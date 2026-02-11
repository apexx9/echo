/**
 * Database Persistence Layer
 * 
 * Handles all direct database operations using Prisma.
 * This is Phase 2 - Real Memory Persistence.
 */

import { PrismaClient } from '@prisma/client';
import { MemoryObject, AnswerObject, UUID } from '@/lib/types';

// Singleton pattern for Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Save a MemoryObject to database
 */
export async function saveMemory(memory: MemoryObject): Promise<void> {
  try {
    await prisma.memory.create({
      data: {
        id: memory.id,
        userId: memory.user_id,
        
        // Content
        rawContent: memory.raw_content,
        rawContentHash: memory.raw_content_hash,
        cleanedContent: memory.cleaned_content,
        
        // Provenance
        sourceType: memory.source_type,
        sourceUrl: memory.source_url,
        sourceTitle: memory.source_title,
        sourceAuthor: memory.source_author,
        
        // Chronology
        createdAt: memory.created_at,
        consumedAt: memory.consumed_at,
        sourcePublishedAt: memory.source_published_at,
        
        // Intelligence
        summary: memory.summary,
        keyConcepts: memory.key_concepts,
        
        // Graph Connections
        relatedMemoryIds: memory.related_memory_ids,
        relationshipReason: memory.relationship_reason || [],
        
        // Verification & Feedback
        confidenceScore: memory.confidence_score,
        userVerified: memory.user_verified,
        correctionNotes: memory.correction_notes,
        
        // Retention Physics
        importanceWeight: memory.importance_weight,
        decayRate: memory.decay_rate,
        
        deletedAt: memory.deleted_at,
      },
    });
    
    console.log(`[DB] Saved memory: ${memory.id}`);
  } catch (error) {
    console.error(`[DB] Failed to save memory: ${memory.id}`, error);
    throw error;
  }
}

/**
 * Save an AnswerObject to database
 */
export async function saveAnswer(answer: AnswerObject): Promise<void> {
  try {
    await prisma.answer.create({
      data: {
        id: answer.id,
        userId: answer.user_id,
        originalQuery: answer.original_query,
        interpretedIntent: answer.interpreted_intent,
        answerText: answer.answer_text,
        supportingMemories: answer.supporting_memories,
        timelineData: answer.timeline,
        suggestedActions: answer.suggested_actions,
        overallConfidence: answer.overall_confidence,
        uncertaintyNotes: answer.uncertainty_notes,
        generatedAt: answer.generated_at,
      },
    });
    
    console.log(`[DB] Saved answer: ${answer.id}`);
  } catch (error) {
    console.error(`[DB] Failed to save answer: ${answer.id}`, error);
    throw error;
  }
}

/**
 * Get answers for a user, with optional filtering
 */
export async function getAnswersForUser(
  userId: UUID,
  options: {
    limit?: number;
    offset?: number;
  } = {}
): Promise<AnswerObject[]> {
  const { limit = 20, offset = 0 } = options;
  
  try {
    const answers = await prisma.answer.findMany({
      where: {
        userId,
      },
      orderBy: {
        generatedAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
    
    return answers.map(mapDbAnswerToAnswerObject);
  } catch (error) {
    console.error(`[DB] Failed to get answers for user: ${userId}`, error);
    throw error;
  }
}

/**
 * Get a single answer by ID
 */
export async function getAnswerById(
  userId: UUID,
  answerId: UUID
): Promise<AnswerObject | null> {
  try {
    const answer = await prisma.answer.findFirst({
      where: {
        id: answerId,
        userId,
      },
    });
    
    return answer ? mapDbAnswerToAnswerObject(answer) : null;
  } catch (error) {
    console.error(`[DB] Failed to get answer: ${answerId}`, error);
    return null;
  }
}

/**
 * Get memories for a user, with optional filtering
 */
export async function getMemoriesForUser(
  userId: UUID,
  options: {
    limit?: number;
    offset?: number;
    sourceType?: string;
    deleted?: boolean;
  } = {}
): Promise<MemoryObject[]> {
  const { limit = 50, offset = 0, sourceType, deleted = false } = options;
  
  try {
    const memories = await prisma.memory.findMany({
      where: {
        userId,
        deletedAt: deleted ? { not: null } : null,
        ...(sourceType && { sourceType }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
    
    return memories.map(mapDbMemoryToMemoryObject);
  } catch (error) {
    console.error(`[DB] Failed to get memories for user: ${userId}`, error);
    throw error;
  }
}

/**
 * Find a memory by its hash for a specific user (deduplication)
 */
export async function findMemoryByHash(
  userId: UUID, 
  hash: string
): Promise<MemoryObject | null> {
  try {
    const memory = await prisma.memory.findFirst({
      where: {
        userId,
        rawContentHash: hash,
        deletedAt: null,
      },
    });
    
    return memory ? mapDbMemoryToMemoryObject(memory) : null;
  } catch (error) {
    console.error(`[DB] Failed to find memory by hash: ${hash}`, error);
    return null;
  }
}

/**
 * Get a single memory by ID
 */
export async function getMemoryById(
  userId: UUID,
  memoryId: UUID
): Promise<MemoryObject | null> {
  try {
    const memory = await prisma.memory.findFirst({
      where: {
        id: memoryId,
        userId,
        deletedAt: null,
      },
    });
    
    return memory ? mapDbMemoryToMemoryObject(memory) : null;
  } catch (error) {
    console.error(`[DB] Failed to get memory: ${memoryId}`, error);
    return null;
  }
}

/**
 * Soft delete a memory
 */
export async function deleteMemory(
  userId: UUID,
  memoryId: UUID
): Promise<boolean> {
  try {
    const result = await prisma.memory.updateMany({
      where: {
        id: memoryId,
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    
    return result.count > 0;
  } catch (error) {
    console.error(`[DB] Failed to delete memory: ${memoryId}`, error);
    return false;
  }
}

/**
 * Update memory verification status
 */
export async function updateMemoryVerification(
  userId: UUID,
  memoryId: UUID,
  verified: boolean,
  correctionNotes?: string
): Promise<boolean> {
  try {
    const result = await prisma.memory.updateMany({
      where: {
        id: memoryId,
        userId,
        deletedAt: null,
      },
      data: {
        userVerified: verified,
        correctionNotes: correctionNotes,
      },
    });
    
    return result.count > 0;
  } catch (error) {
    console.error(`[DB] Failed to update memory verification: ${memoryId}`, error);
    return false;
  }
}

/**
 * Get memory statistics for a user
 */
export async function getUserMemoryStats(userId: UUID): Promise<{
  totalMemories: number;
  memoriesByType: Record<string, number>;
  averageConfidence: number;
  verifiedCount: number;
}> {
  try {
    const [total, byType, avgConfidence, verified] = await Promise.all([
      prisma.memory.count({
        where: { userId, deletedAt: null },
      }),
      prisma.memory.groupBy({
        by: ['sourceType'],
        where: { userId, deletedAt: null },
        _count: true,
      }),
      prisma.memory.aggregate({
        where: { userId, deletedAt: null },
        _avg: { confidenceScore: true },
      }),
      prisma.memory.count({
        where: { userId, userVerified: true, deletedAt: null },
      }),
    ]);
    
    const memoriesByType = byType.reduce((acc: Record<string, number>, item: any) => {
      acc[item.sourceType] = item._count;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalMemories: total,
      memoriesByType,
      averageConfidence: avgConfidence._avg.confidenceScore || 0,
      verifiedCount: verified,
    };
  } catch (error) {
    console.error(`[DB] Failed to get user stats: ${userId}`, error);
    return {
      totalMemories: 0,
      memoriesByType: {},
      averageConfidence: 0,
      verifiedCount: 0,
    };
  }
}

/**
 * Helper function to map database memory to MemoryObject type
 */
function mapDbMemoryToMemoryObject(dbMemory: any): MemoryObject {
  return {
    id: dbMemory.id,
    user_id: dbMemory.userId,
    
    // Content
    raw_content: dbMemory.rawContent,
    raw_content_hash: dbMemory.rawContentHash,
    cleaned_content: dbMemory.cleanedContent,
    
    // Provenance
    source_type: dbMemory.sourceType as any,
    source_url: dbMemory.sourceUrl,
    source_title: dbMemory.sourceTitle,
    source_author: dbMemory.sourceAuthor,
    
    // Chronology
    created_at: dbMemory.createdAt,
    consumed_at: dbMemory.consumedAt,
    source_published_at: dbMemory.sourcePublishedAt,
    
    // Intelligence
    summary: dbMemory.summary,
    key_concepts: dbMemory.keyConcepts,
    
    // Graph Connections
    related_memory_ids: dbMemory.relatedMemoryIds,
    relationship_reason: dbMemory.relationshipReason,
    
    // Verification & Feedback
    confidence_score: dbMemory.confidenceScore,
    user_verified: dbMemory.userVerified,
    correction_notes: dbMemory.correctionNotes,
    
    // Retention Physics
    importance_weight: dbMemory.importanceWeight,
    decay_rate: dbMemory.decayRate,
    
    deleted_at: dbMemory.deletedAt,
  };
}

/**
 * Helper function to map database answer to AnswerObject type
 */
function mapDbAnswerToAnswerObject(dbAnswer: any): AnswerObject {
  return {
    id: dbAnswer.id,
    user_id: dbAnswer.userId,
    
    // Input context
    original_query: dbAnswer.originalQuery,
    interpreted_intent: dbAnswer.interpretedIntent as any,
    
    // The output
    answer_text: dbAnswer.answerText,
    
    // Making it verifiable
    supporting_memories: dbAnswer.supportingMemories,
    
    // Meta-Cognition
    overall_confidence: dbAnswer.overallConfidence,
    uncertainty_notes: dbAnswer.uncertaintyNotes,
    
    // Temporal Reasoning
    timeline: dbAnswer.timelineData,
    
    // Next Steps
    suggested_actions: dbAnswer.suggestedActions,
    
    generated_at: dbAnswer.generatedAt,
  };
}
