/**
 * Memory Ingestion Service
 * 
 * Handles the transformation of raw content into MemoryObjects
 * and their persistence to the database.
 */

import { MemoryObject, UUID } from '@/lib/types';
import { saveMemory as saveMemoryToDb, findMemoryByHash as findMemoryByHashInDb } from '@/lib/database';
import { 
  getUserEntitlements, 
  getCurrentMonthlyIngestCount, 
  getUserMemoryCount,
  incrementMonthlyIngestCount
} from '@/lib/user-service';
import { 
  assertCanIngest,
  assertCanStoreMemory,
  assertFileSizeAllowed,
  EntitlementError
} from '@/lib/entitlements';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export interface IngestOptions {
  sourceType: 'note' | 'web' | 'pdf' | 'youtube' | 'conversation';
  sourceUrl?: string;
  sourceTitle?: string;
  sourceAuthor?: string;
  consumedAt?: Date;
  sourcePublishedAt?: Date;
}

/**
 * Core ingestion function - transforms raw content into a MemoryObject
 * This is where cleaning, chunking, and initial intelligence happens
 */
export async function ingestMemory(
  userId: UUID,
  rawContent: string,
  options: IngestOptions
): Promise<MemoryObject> {
  // Step 0: Check user entitlements before doing any work
  const entitlements = await getUserEntitlements(userId);
  const currentMonthlyCount = await getCurrentMonthlyIngestCount(userId);
  const currentMemoryCount = await getUserMemoryCount(userId);
  
  // Assert entitlements - throws EntitlementError if violated
  assertCanIngest(entitlements, currentMonthlyCount);
  assertCanStoreMemory(entitlements, currentMemoryCount);
  
  // Check file size if applicable (for now, estimate from content length)
  const estimatedSizeMb = rawContent.length / (1024 * 1024); // Rough estimate
  if (estimatedSizeMb > 0) {
    assertFileSizeAllowed(entitlements, estimatedSizeMb);
  }
  
  // Step 1: Clean and normalize content
  const cleanedContent = cleanContent(rawContent);
  
  // Step 2: Generate content hash for deduplication
  const contentHash = await generateHash(cleanedContent);
  
  // Step 3: Check for duplicates
  const existingMemory = await findMemoryByHashInDb(userId, contentHash);
  if (existingMemory) {
    return existingMemory;
  }
  
  // Step 4: Generate intelligence (summary, concepts)
  const intelligence = await generateIntelligence(cleanedContent);
  
  // Step 5: Create MemoryObject
  const memoryObject: MemoryObject = {
    id: crypto.randomUUID(),
    user_id: userId,
    
    // Content
    raw_content: rawContent,
    raw_content_hash: contentHash,
    cleaned_content: cleanedContent,
    
    // Provenance
    source_type: options.sourceType,
    source_url: options.sourceUrl,
    source_title: options.sourceTitle,
    source_author: options.sourceAuthor,
    
    // Chronology
    created_at: new Date(),
    consumed_at: options.consumedAt,
    source_published_at: options.sourcePublishedAt,
    
    // Intelligence
    summary: intelligence.summary,
    key_concepts: intelligence.concepts,
    // embedding will be added in Phase 3
    
    // Graph connections (will be populated later)
    related_memory_ids: [],
    relationship_reason: [],
    
    // Verification
    confidence_score: intelligence.confidence,
    user_verified: false,
    
    // Retention
    importance_weight: 0.5, // Default, can be updated later
    decay_rate: 0.1,
  };
  
  // Step 6: Persist to database
  await saveMemoryToDb(memoryObject);
  
  // Step 7: Update usage tracking
  await incrementMonthlyIngestCount(userId);
  
  // Step 8: Trigger async processes (embedding generation, graph linking)
  // These will run in the background and update the memory later
  triggerAsyncProcessing(memoryObject);
  
  return memoryObject;
}

/**
 * Clean and normalize raw content
 */
function cleanContent(rawContent: string): string {
  return rawContent
    .trim()
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove HTML tags (basic)
    .replace(/<[^>]*>/g, '')
    // Normalize line breaks
    .replace(/\n+/g, ' ');
}

/**
 * Generate SHA-256 hash for content deduplication
 */
async function generateHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate intelligence from content using Gemini AI (summary, concepts, confidence)
 */
async function generateIntelligence(content: string): Promise<{
  summary: string;
  concepts: string[];
  confidence: number;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Analyze the following content and provide:
1. A concise 2-3 sentence summary
2. 5-7 key concepts or topics mentioned
3. A confidence score (0.0-1.0) based on content clarity and completeness

Content: ${content}

Please respond in JSON format:
{
  "summary": "2-3 sentence summary here",
  "concepts": ["concept1", "concept2", "concept3", "concept4", "concept5"],
  "confidence": 0.8
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || content.substring(0, 200) + '...',
        concepts: Array.isArray(parsed.concepts) ? parsed.concepts : [],
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7
      };
    }
    
    // Fallback if JSON parsing fails
    throw new Error('Failed to parse Gemini response');
    
  } catch (error) {
    console.error('[INGEST] Error generating intelligence:', error);
    
    // Fallback to basic heuristics
    const sentences = content.split('.').filter(s => s.trim().length > 0);
    const summary = sentences.slice(0, 3).join('. ').trim();
    
    const words = content.toLowerCase().split(/\s+/);
    const concepts = words
      .filter(word => word.length > 6)
      .slice(0, 5);
    
    const confidence = Math.min(1.0, content.length / 1000);
    
    return {
      summary: summary || content.substring(0, 200) + '...',
      concepts,
      confidence
    };
  }
}

/**
 * Check if memory with this hash already exists for this user
 */
// TODO: This function is now handled by the database layer
// The findMemoryByHashInDb function is imported and used above

/**
 * Save MemoryObject to database
 */
// TODO: This function is now handled by the database layer  
// The saveMemoryToDb function is imported and used above

/**
 * Trigger background processing for the memory
 */
function triggerAsyncProcessing(memory: MemoryObject): void {
  // TODO: Queue for background processing
  // - Generate embeddings (Phase 3)
  // - Find related memories (Phase 4)
  // - Update graph connections
  console.log(`[INGEST] Queued async processing for: ${memory.id}`);
}
