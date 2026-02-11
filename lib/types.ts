export type UUID = string;

export interface MemoryObject {
    id: UUID;
    user_id: UUID;

    // Content
    raw_content: string;         // The exact excerpt from source
    raw_content_hash: string;    // SHA-256 for integrity check
    cleaned_content: string;     // Strip HTML, markdown noise, etc.

    // Provenance
    source_type: 'note' | 'web' | 'pdf' | 'youtube' | 'conversation';
    source_url?: string;
    source_title?: string;
    source_author?: string;

    // Chronology
    created_at: Date;            // When this object was created in DB
    consumed_at?: Date;          // When the user actually read/watched this (User Time)
    source_published_at?: Date;  // When the content was originally published (World Time)

    // Intelligence
    summary: string;             // generated 3-5 sentence summary
    key_concepts: string[];      // ["React", "State Management", "Zustand"]
    embedding?: number[];        // 1536d vector (OpenAI/Cohere) - Optional in frontend type

    // Graph Connections
    related_memory_ids: UUID[];
    relationship_reason?: string[]; // e.g., ["Contradicts memory-123", "Expands on memory-456"]

    // Verification & Feedback
    confidence_score: number;    // 0.0 to 1.0 (How reliable is this source?)
    user_verified: boolean;      // Has user explicitly confirmed this?
    correction_notes?: string;   // User overrides

    // Retention Physics
    importance_weight: number;   // 0.0 to 1.0 (User defined or inferred importance)
    decay_rate: number;          // Standard decay curve modifier

    deleted_at?: Date;
}

export interface AnswerObject {
    id: UUID;
    user_id: UUID;

    // Input Context
    original_query: string;
    interpreted_intent: 'overview' | 'timeline' | 'summary' | 'comparison' | 'unknown';

    // The Output
    answer_text: string; // Markdown supported

    // Making it verifiable
    supporting_memories: {
        memory_id: UUID;
        source_title?: string;
        source_type: string;
        consumed_at?: Date;
        confidence_score: number;
        relevance_score: number; // The logic score that picked this memory
        snippet: string;         // The specific part used
    }[];

    // Meta-Cognition
    overall_confidence: number;
    uncertainty_notes?: string; // "I found standard docs, but no personal notes on this."

    // Temporal Reasoning (if timeline intent)
    timeline?: {
        memory_id: UUID;
        date: Date;
        role: 'first_encounter' | 'refinement' | 'contradiction';
        description: string;
    }[];

    // Next Steps
    suggested_actions: {
        label: string;
        action_type: 'expand' | 'summarize' | 'open_source' | 'compare';
        payload?: any;
    }[];

    generated_at: Date;
}
