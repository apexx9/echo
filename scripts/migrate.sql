-- Echo Database Migration Script
-- PostgreSQL setup with pgvector extension
-- Run this after creating your database on Render

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_memory_user_id" ON "Memory"("userId");
CREATE INDEX IF NOT EXISTS "idx_memory_created_at" ON "Memory"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_memory_source_type" ON "Memory"("sourceType");
CREATE INDEX IF NOT EXISTS "idx_memory_deleted_at" ON "Memory"("deletedAt");
CREATE INDEX IF NOT EXISTS "idx_memory_hash" ON "Memory"("rawContentHash");

CREATE INDEX IF NOT EXISTS "idx_answer_user_id" ON "Answer"("userId");
CREATE INDEX IF NOT EXISTS "idx_answer_generated_at" ON "Answer"("generatedAt" DESC);

-- Create index for email uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS "idx_user_email_unique" ON "User"("email");

-- Add vector column for embeddings (if not using raw SQL)
-- This is handled by Prisma schema, but keeping for reference
-- ALTER TABLE "Memory" ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create vector similarity search function
CREATE OR REPLACE FUNCTION memory_similarity_search(
  query_vector vector(1536),
  user_id_param TEXT,
  limit_param INTEGER DEFAULT 10
)
RETURNS TABLE(
  memory_id TEXT,
  similarity_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    "Memory".id,
    1 - ("Memory".embedding <=> query_vector) as similarity
  FROM "Memory"
  WHERE "Memory"."userId" = user_id_param
    AND "Memory"."deletedAt" IS NULL
    AND "Memory".embedding IS NOT NULL
  ORDER BY "Memory".embedding <=> query_vector
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to update user monthly ingest count atomically
CREATE OR REPLACE FUNCTION increment_monthly_ingest(
  user_id_param TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Check if we need to reset for new month
  IF EXISTS (
    SELECT 1 FROM "User" 
    WHERE id = user_id_param 
      AND (
        EXTRACT(MONTH FROM "lastIngestReset") != EXTRACT(MONTH FROM CURRENT_DATE)
        OR EXTRACT(YEAR FROM "lastIngestReset") != EXTRACT(YEAR FROM CURRENT_DATE)
      )
  ) THEN
    UPDATE "User" 
    SET 
      "monthlyIngestCount" = 1,
      "lastIngestReset" = CURRENT_DATE
    WHERE id = user_id_param;
  ELSE
    UPDATE "User" 
    SET "monthlyIngestCount" = "monthlyIngestCount" + 1
    WHERE id = user_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust based on your database user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO echo_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO echo_user;

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- This can be used for future updated_at columns if needed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing (optional)
-- This will be handled by the seed script instead

COMMIT;
