'use server';

import { ingestMemory, queryBrain } from '@/lib/brain';
import { AnswerObject, MemoryObject, UUID } from '@/lib/types';
import { EntitlementError } from '@/lib/entitlements';

/**
 * Server Action to query the Echo Brain.
 * Now delegates to the real brain service.
 */
export async function queryBrainAction(query: string): Promise<AnswerObject> {
  // TODO: Get real userId from authentication in Phase 7
  const userId = 'user-1'; // Mock user ID for now
  
  try {
    return await queryBrain(userId, query);
  } catch (error) {
    if (error instanceof EntitlementError) {
      // Convert entitlement errors to user-friendly messages
      throw new Error(`Access denied: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Server Action to ingest new content.
 * Now delegates to the real brain service.
 */
export async function ingestMemoryAction(
  content: string,
  sourceType: 'note' | 'web' | 'pdf',
  options?: {
    sourceUrl?: string;
    sourceTitle?: string;
    sourceAuthor?: string;
  }
): Promise<MemoryObject> {
  // TODO: Get real userId from authentication in Phase 7
  const userId = 'user-1'; // Mock user ID for now
  
  try {
    return await ingestMemory(userId, content, {
      sourceType,
      sourceUrl: options?.sourceUrl,
      sourceTitle: options?.sourceTitle,
      sourceAuthor: options?.sourceAuthor,
    });
  } catch (error) {
    if (error instanceof EntitlementError) {
      // Convert entitlement errors to user-friendly messages
      throw new Error(`Access denied: ${error.message}`);
    }
    throw error;
  }
}

// Legacy exports for backward compatibility
export { queryBrainAction as queryBrain };
export { ingestMemoryAction as ingestMemory };
