/**
 * Answer Generation Service
 * 
 * Handles synthesizing answers from retrieved memories using LLM.
 * This is "mouth" of Echo - it formats and explains but never invents.
 */

import { AnswerObject, MemoryObject } from '@/lib/types';
import { GoogleGenerativeAI } from '@google/generative-ai';
  
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export interface AnswerGenerationOptions {
  query: string;
  memories: MemoryObject[];
  intent: string;
  userId: string;
}

/**
 * Generate a complete AnswerObject from query and retrieved memories
 * This implements the LLM synthesis layer (Phase 5)
 */
export async function generateAnswer(options: AnswerGenerationOptions): Promise<AnswerObject> {
  const { query, memories, intent, userId } = options;
  
  console.log(`[ANSWER] Generating answer for query: "${query}"`);
  console.log(`[ANSWER] Using ${memories.length} memories`);
  
  // Step 1: Prepare context for LLM
  const context = prepareLLMContext(memories);
  
  // Step 2: Generate answer text with LLM
  const answerText = await synthesizeAnswer(query, context, intent);
  
  // Step 3: Extract supporting memories and evidence
  const supportingMemories = extractSupportingMemories(memories, context);
  
  // Step 4: Calculate overall confidence
  const confidence = calculateOverallConfidence(memories, answerText);
  
  // Step 5: Generate suggested actions
  const suggestedActions = generateSuggestedActions(query, memories, intent);
  
  // Step 6: Build timeline if needed
  const timeline = intent === 'timeline' ? buildTimeline(memories) : undefined;
  
  return {
    id: crypto.randomUUID(),
    user_id: userId,
    
    // Input context
    original_query: query,
    interpreted_intent: intent as any,
    
    // The output
    answer_text: answerText,
    
    // Evidence
    supporting_memories: supportingMemories,
    
    // Meta-cognition
    overall_confidence: confidence,
    uncertainty_notes: generateUncertaintyNotes(memories, confidence),
    
    // Timeline
    timeline,
    
    // Next steps
    suggested_actions: suggestedActions,
    
    generated_at: new Date()
  };
}

/**
 * Prepare context for LLM by formatting memories
 */
function prepareLLMContext(memories: MemoryObject[]): string {
  return memories
    .map((memory, index) => 
      `[Memory ${index + 1}]\n` +
      `Source: ${memory.source_title || 'Unknown'}\n` +
      `Date: ${memory.consumed_at || memory.created_at}\n` +
      `Content: ${memory.cleaned_content}\n` +
      `Summary: ${memory.summary}\n`
    )
    .join('\n---\n');
}

/**
 * Synthesize answer using LLM
 * This is where the actual AI magic happens (Phase 5)
 */
async function synthesizeAnswer(query: string, context: string, intent: string): Promise<string> {
  console.log(`[ANSWER] Synthesizing answer for intent: ${intent}`);
  
  try {
    // Create prompt based on intent
    let prompt = '';
    
    switch (intent) {
      case 'overview':
        prompt = `Based on the following saved memories, provide a comprehensive answer about: ${query}

${context}

Please provide a clear, informative response that directly answers the user's question. Use only the information provided in the memories - do not invent or hallucinate additional details.`;
        break;
        
      case 'timeline':
        prompt = `Based on the following saved memories, show how understanding of "${query}" has evolved over time:

${context}

Please create a timeline-style response that shows the progression and evolution of understanding on this topic. Focus on how the user's knowledge has grown or changed.`;
        break;
        
      case 'summary':
        prompt = `Based on the following saved memories, provide a concise summary about: ${query}

${context}

Please create a brief, well-structured summary that captures the key points about this topic from the memories.`;
        break;
        
      default:
        prompt = `Based on the following saved memories, provide relevant information about: ${query}

${context}

Please provide a helpful response using only the information from these memories.`;
        break;
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    
    if (!result.response) {
      throw new Error('Failed to generate response from Gemini AI');
    }
    
    const answerText = result.response.text();
    console.log(`[ANSWER] Gemini response generated: ${answerText.substring(0, 200)}...`);
    
    return answerText;
    
  } catch (error) {
    console.error('[ANSWER] Error generating answer:', error);
    throw error;
  }
}

/**
 * Extract supporting memories with relevance scores
 */
function extractSupportingMemories(memories: MemoryObject[], context: string): AnswerObject['supporting_memories'] {
  return memories.map((memory, index) => ({
    memory_id: memory.id,
    source_title: memory.source_title,
    source_type: memory.source_type,
    consumed_at: memory.consumed_at,
    confidence_score: memory.confidence_score,
    relevance_score: calculateRelevanceScore(memory, context),
    snippet: memory.cleaned_content.substring(0, 200) + '...'
  }));
}

/**
 * Calculate relevance score for a memory
 */
function calculateRelevanceScore(memory: MemoryObject, context: string): number {
  // TODO: Implement real relevance calculation in Phase 5
  // For now, use confidence score as proxy
  return memory.confidence_score;
}

/**
 * Calculate overall confidence for the answer
 */
function calculateOverallConfidence(memories: MemoryObject[], answerText: string): number {
  if (memories.length === 0) return 0.1;
  
  // Average of memory confidences, weighted by number of memories
  const avgMemoryConfidence = memories.reduce((sum, m) => sum + m.confidence_score, 0) / memories.length;
  
  // More memories = higher confidence (up to a point)
  const memoryCountBonus = Math.min(memories.length / 5, 0.2);
  
  return Math.min(1.0, avgMemoryConfidence + memoryCountBonus);
}

/**
 * Generate uncertainty notes when confidence is low
 */
function generateUncertaintyNotes(memories: MemoryObject[], confidence: number): string | undefined {
  if (confidence < 0.3) {
    return "I found very limited information in your saved memories. This answer may not be comprehensive.";
  } else if (confidence < 0.6) {
    return "I found some relevant information, but your saved memories on this topic are limited.";
  } else if (memories.length === 0) {
    return "I couldn't find any relevant memories in your saved content.";
  }
  
  return undefined;
}

/**
 * Generate suggested next actions for the user
 */
function generateSuggestedActions(
  query: string, 
  memories: MemoryObject[], 
  intent: string
): AnswerObject['suggested_actions'] {
  const actions: AnswerObject['suggested_actions'] = [
    {
      label: 'Ask follow-up',
      action_type: 'expand',
      payload: { query }
    }
  ];
  
  if (intent !== 'timeline') {
    actions.push({
      label: 'View timeline',
      action_type: 'expand',
      payload: { query, intent: 'timeline' }
    });
  }
  
  if (memories.length > 0) {
    actions.push({
      label: 'Revisit sources',
      action_type: 'open_source',
      payload: { memoryIds: memories.slice(0, 3).map(m => m.id) }
    });
  }
  
  return actions;
}

/**
 * Build timeline data for timeline intent
 */
function buildTimeline(memories: MemoryObject[]): AnswerObject['timeline'] {
  return memories
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(memory => ({
      memory_id: memory.id,
      date: memory.created_at,
      role: determineTimelineRole(memory, memories) as 'first_encounter' | 'refinement' | 'contradiction',
      description: memory.summary
    }));
}

/**
 * Determine the role of a memory in the timeline
 */
function determineTimelineRole(memory: MemoryObject, allMemories: MemoryObject[]): string {
  const memoryDate = new Date(memory.created_at);
  const sameTopicMemories = allMemories.filter(m => 
    m.key_concepts.some(concept => memory.key_concepts.includes(concept))
  );
  
  const sortedMemories = sameTopicMemories.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  
  const isFirst = sortedMemories[0]?.id === memory.id;
  
  if (isFirst) return 'first_encounter' as const;
  
  // TODO: Implement more sophisticated role detection
  // For now, default to refinement
  return 'refinement' as const;
}
