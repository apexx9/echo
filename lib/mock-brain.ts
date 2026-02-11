import { AnswerObject, MemoryObject, UUID } from './types';

export class MockBrainService {
    private memories: MemoryObject[] = [];

    constructor() {
        // Seed with some initial data if needed
    }

    async ingest(content: string, sourceType: 'note' | 'web' | 'pdf'): Promise<MemoryObject> {
        console.log(`[MockBrain] Ingesting ${sourceType}: ${content.substring(0, 50)}...`);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const newMemory: MemoryObject = {
            id: crypto.randomUUID(),
            user_id: 'user-1',
            raw_content: content,
            raw_content_hash: 'mock-hash-' + Date.now(),
            cleaned_content: content.trim(),
            source_type: sourceType,
            created_at: new Date(),
            summary: "This is a mock summary of the ingested content.",
            key_concepts: ["Mock Concept", "Testing"],
            related_memory_ids: [],
            confidence_score: 1.0,
            user_verified: false,
            importance_weight: 0.5,
            decay_rate: 0.1
        };

        this.memories.push(newMemory);
        return newMemory;
    }

    async query(userQuery: string): Promise<AnswerObject> {
        console.log(`[MockBrain] Querying: ${userQuery}`);

        // Simulate thinking delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Hardcoded responses for WOW Queries
        if (userQuery.toLowerCase().includes("what do i know about react")) {
            return this.generateWowAnswer_React();
        }

        // Default generic response
        return {
            id: crypto.randomUUID(),
            user_id: 'user-1',
            original_query: userQuery,
            interpreted_intent: 'unknown',
            answer_text: "I found 0 memories relevant to your query in the mock database.",
            overall_confidence: 0.0,
            supporting_memories: [],
            suggested_actions: [],
            generated_at: new Date()
        };
    }

    private generateWowAnswer_React(): AnswerObject {
        return {
            id: crypto.randomUUID(),
            user_id: 'user-1',
            original_query: "What do I know about React?",
            interpreted_intent: 'overview',
            answer_text: "Based on your notes, you view React primarily as a library for **UI composition** rather than a full framework. You've noted that `useEffect` should be used sparingly, preferring event handlers for side effects. You also saved an article comparing React Server Components to PHP, highlighting the cyclic nature of web development.",
            overall_confidence: 0.9,
            uncertainty_notes: undefined,
            supporting_memories: [
                {
                    memory_id: 'mock-mem-1',
                    source_title: 'React Docs - Best Practices',
                    source_type: 'web',
                    confidence_score: 0.95,
                    relevance_score: 0.9,
                    snippet: "You might not need an Effect. Effects are an escape hatch from the React paradigm."
                },
                {
                    memory_id: 'mock-mem-2',
                    source_title: 'My Engineering Journal',
                    source_type: 'note',
                    consumed_at: new Date('2025-11-10'),
                    confidence_score: 1.0,
                    relevance_score: 0.85,
                    snippet: "RSC feels like we are reinventing PHP but with better types."
                }
            ],
            suggested_actions: [
                { label: "Summarize React vs Vue", action_type: "compare" },
                { label: "When did I write that note?", action_type: "expand" }
            ],
            generated_at: new Date()
        };
    }
}

export const mockBrain = new MockBrainService();
