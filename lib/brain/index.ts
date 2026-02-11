/**
 * Brain Service - The only interface between UI and Echo's intelligence layer
 * 
 * This module is the single source of truth for all memory operations.
 * UI components should only call functions exported from this index.
 */

export { ingestMemory } from './ingest';
export { retrieveMemories, queryBrain } from './retrieve';
export { generateAnswer } from './answer';

// Re-export types for convenience
export type { MemoryObject, AnswerObject } from '@/lib/types';
