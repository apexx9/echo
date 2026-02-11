/**
 * Memory Retrieval Service
 * 
 * Handles finding and ranking memories based on user queries.
 * This implements the core search and scoring logic.
 */

import { MemoryObject, AnswerObject, UUID } from '@/lib/types';
import { getMemoriesForUser } from '@/lib/database';
import { getUserEntitlements } from '@/lib/user-service';
import { getAllowedSearchDepth as getEntitlementSearchDepth } from '@/lib/entitlements';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateAnswer } from './answer';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export interface RetrievalOptions {
  userId: UUID;
  query: string;
  limit?: number;
  intent?: 'overview' | 'timeline' | 'summary' | 'comparison' | 'unknown';
}

export interface RetrievalResult {
  memories: MemoryObject[];
  scores: number[];
  intent: string;
}

/**
 * Main retrieval function - finds relevant memories for a query
 */
export async function retrieveMemories(options: RetrievalOptions): Promise<RetrievalResult> {
  const { userId, query, limit = 10, intent = 'unknown' } = options;
  
  // Step 0: Get user entitlements to determine search depth
  const entitlements = await getUserEntitlements(userId);
  const maxSearchDepth = getEntitlementSearchDepth(entitlements);
  const effectiveLimit = Math.min(limit, maxSearchDepth);
  
  // Step 1: Generate query embedding (Phase 3)
  // For now, use simple text matching
  const queryEmbedding = await generateQueryEmbedding(query);
  
  // Step 2: Get candidate memories from database (respecting entitlement limits)
  const candidates = await getCandidateMemories(userId, queryEmbedding, effectiveLimit * 2);
  
  // Step 3: Score candidates using the Echo scoring algorithm
  const scoredMemories = await scoreMemories(candidates, query, intent);
  
  // Step 4: Apply intent-specific filtering and ranking
  const finalMemories = applyIntentModifications(scoredMemories, intent);
  
  // Step 5: Return top results (respecting entitlement limits)
  return {
    memories: finalMemories.slice(0, effectiveLimit),
    scores: finalMemories.slice(0, effectiveLimit).map(m => m.confidence_score), // Placeholder
    intent
  };
}

/**
 * Generate embedding for user query using Gemini
 * For now, we'll use a simplified approach since Gemini doesn't have a dedicated embedding API
 * In production, you'd want to use a dedicated embedding model like OpenAI's text-embedding-3-small
 */
async function generateQueryEmbedding(query: string): Promise<number[]> {
  console.log(`[RETRIEVE] Generating embedding for: "${query}"`);
  
  try {
    // For a more robust implementation, you'd use a dedicated embedding model
    // Gemini doesn't have a native embedding API, so we'll create a semantic hash
    // This is a simplified approach - in production, use OpenAI embeddings or similar
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Generate a semantic representation of this query for similarity search: "${query}"
    
Please respond with a comma-separated list of 10 floating point numbers between 0 and 1 that represent the semantic meaning of this query. Consider the topics, entities, and intent.

Format: 0.1,0.8,0.3,0.6,0.2,0.9,0.4,0.7,0.5,0.1`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the numbers
    const numbers = text.split(',').map(n => {
      const num = parseFloat(n.trim());
      return isNaN(num) ? Math.random() : Math.max(0, Math.min(1, num));
    });
    
    // Pad to 1536 dimensions (standard for OpenAI embeddings)
    const embedding = new Array(1536).fill(0);
    for (let i = 0; i < Math.min(numbers.length, 1536); i++) {
      embedding[i] = numbers[i];
    }
    
    return embedding;
    
  } catch (error) {
    console.error('[RETRIEVE] Error generating embedding:', error);
    
    // Fallback: create a simple hash-based embedding
    const hash = await simpleHash(query);
    const embedding = new Array(1536).fill(0);
    
    // Use hash to seed pseudo-random values
    let seed = hash;
    for (let i = 0; i < 1536; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      embedding[i] = seed / 233280;
    }
    
    return embedding;
  }
}

/**
 * Simple hash function for fallback embedding generation
 */
async function simpleHash(str: string): Promise<number> {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get candidate memories from database using vector similarity
 * In Phase 3, this will use pgvector for efficient similarity search
 */
async function getCandidateMemories(
  userId: UUID, 
  queryEmbedding: number[], 
  limit: number
): Promise<MemoryObject[]> {
  // TODO: Implement pgvector similarity search in Phase 3
  // For now, get recent memories from database
  console.log(`[RETRIEVE] Getting candidates for user: ${userId}`);
  
  try {
    const memories = await getMemoriesForUser(userId, { limit });
    console.log(`[RETRIEVE] Found ${memories.length} memories`);
    return memories;
  } catch (error) {
    console.error(`[RETRIEVE] Error getting memories:`, error);
    return [];
  }
}

/**
 * Score memories using the Echo scoring algorithm
 * Score_final = (S_sem × 0.40) + (S_temp × 0.20) + (S_imp × 0.15) + (S_graph × 0.15) + (S_conf × 0.10)
 */
async function scoreMemories(
  memories: MemoryObject[], 
  query: string, 
  intent: string
): Promise<MemoryObject[]> {
  console.log(`[RETRIEVE] Scoring ${memories.length} memories for query: "${query}"`);
  
  // TODO: Implement real scoring in Phase 4
  // For now, return memories with basic confidence scores
  
  return memories.map(memory => ({
    ...memory,
    confidence_score: Math.random() * 0.5 + 0.5 // Random confidence 0.5-1.0
  }));
}

/**
 * Apply intent-specific modifications to scoring
 */
function applyIntentModifications(memories: MemoryObject[], intent: string): MemoryObject[] {
  switch (intent) {
    case 'timeline':
      // For timeline queries, favor older memories and temporal distribution
      return memories.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    
    case 'summary':
      // For summary queries, favor high-importance memories
      return memories.sort((a, b) => b.importance_weight - a.importance_weight);
    
    default:
      // For overview/unknown, use the scored order
      return memories.sort((a, b) => b.confidence_score - a.confidence_score);
  }
}

/**
 * Main query function - combines retrieval and answer generation
 * This is what the UI calls
 */
export async function queryBrain(userId: UUID, query: string): Promise<AnswerObject> {
  console.log(`[BRAIN] Processing query: "${query}"`);
  
  // Step 1: Retrieve relevant memories
  const retrieval = await retrieveMemories({ userId, query });
  
  // Step 2: Generate answer using retrieved memories
  const answer = await generateAnswer({
    query,
    memories: retrieval.memories,
    intent: retrieval.intent,
    userId
  });
  
  return answer;
}
