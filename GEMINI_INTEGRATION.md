# Gemini AI Integration for Echo

This document explains how to set up and use the Gemini AI integration in the Echo personal memory system.

## Overview

The Echo project now uses Google's Gemini AI for:

1. **Answer Generation** - Synthesizing responses from retrieved memories
2. **Intelligence Generation** - Creating summaries and extracting concepts during ingestion
3. **Query Embeddings** - Generating semantic representations for similarity search

## Setup

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Gemini API key:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY="your_actual_api_key_here"
   ```

3. Also configure your database connection:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/echo"
   ```

### 3. Install Dependencies

```bash
npm install
# or
pnpm install
```

## Testing the Integration

Run the test script to verify everything works:

```bash
# Using ts-node (recommended)
npx ts-node test-gemini.ts

# Or compile and run
npx tsc test-gemini.ts --target es2020 --module commonjs --esModuleInterop
node test-gemini.js
```

## How It Works

### 1. Memory Ingestion (`lib/brain/ingest.ts`)

When you add content to Echo, Gemini analyzes it and provides:
- **Summary**: 2-3 sentence overview
- **Key Concepts**: Important topics/entities
- **Confidence Score**: Reliability assessment

### 2. Query Processing (`lib/brain/retrieve.ts`)

When you ask questions, Gemini:
- Generates semantic embeddings for similarity search
- Helps rank memories by relevance

### 3. Answer Generation (`lib/brain/answer.ts`)

Gemini synthesizes final answers by:
- Understanding your query intent
- Combining information from relevant memories
- Providing grounded, trustworthy responses

## Configuration Options

### Model Selection

The integration uses `gemini-1.5-flash` by default for speed and cost efficiency. You can change this in the respective files:

```typescript
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Higher quality
```

### Fallback Behavior

If Gemini is unavailable, the system falls back to:
- Basic heuristics for intelligence generation
- Hash-based embeddings for similarity search
- Simple text matching for retrieval

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure your API key is correctly set in `.env`
   - Check that the key has sufficient quota

2. **Network Issues**
   - Verify internet connection
   - Check firewall settings

3. **TypeScript Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that `@google/generative-ai` is up to date

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=echo:*
```

## Production Considerations

### Rate Limits

- Gemini has rate limits. Consider implementing request queuing for high-traffic applications.
- Monitor your API usage in the Google Cloud Console.

### Cost Management

- `gemini-1.5-flash` is cost-effective for most use cases
- Consider caching embeddings to reduce API calls
- Monitor token usage, especially for large content ingestion

### Security

- Never commit API keys to version control
- Use environment variables in production
- Consider using secret management services (AWS Secrets Manager, etc.)

## Next Steps

1. **Enhanced Embeddings**: Consider using dedicated embedding models for better similarity search
2. **Streaming**: Implement streaming responses for real-time answer generation
3. **Caching**: Add intelligent caching to reduce API calls and costs
4. **Monitoring**: Add metrics and logging for production monitoring

## Support

If you encounter issues:

1. Check the [Google AI Documentation](https://ai.google.dev/docs)
2. Review the test script output for specific error messages
3. Ensure all environment variables are properly set
