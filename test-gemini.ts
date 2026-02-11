/**
 * Test script to verify Gemini integration
 * Run with: node -r esbuild-register test-gemini.ts
 */

import { ingestMemory } from './lib/brain/ingest';
import { queryBrain } from './lib/brain/retrieve';

async function testGeminiIntegration() {
  console.log('🧪 Testing Gemini AI Integration...\n');

  try {
    // Test 1: Ingest some content
    console.log('📝 Testing memory ingestion with Gemini...');
    const testContent = `
    React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta. 
    React uses a virtual DOM to optimize rendering performance. Components can be functional or class-based, though functional 
    components with hooks are now the recommended approach. Key concepts include state management, props, and the component lifecycle.
    `;
    
    const memory = await ingestMemory('test-user-1', testContent, {
      sourceType: 'note',
      sourceTitle: 'React Learning Notes',
      sourceAuthor: 'Test User'
    });
    
    console.log('✅ Memory ingested successfully:');
    console.log(`   ID: ${memory.id}`);
    console.log(`   Summary: ${memory.summary}`);
    console.log(`   Concepts: ${memory.key_concepts.join(', ')}`);
    console.log(`   Confidence: ${memory.confidence_score}\n`);

    // Test 2: Query the brain
    console.log('🔍 Testing brain query with Gemini...');
    const answer = await queryBrain('test-user-1', 'What do I know about React?');
    
    console.log('✅ Query answered successfully:');
    console.log(`   Query: ${answer.original_query}`);
    console.log(`   Intent: ${answer.interpreted_intent}`);
    console.log(`   Confidence: ${answer.overall_confidence}`);
    console.log(`   Answer: ${answer.answer_text.substring(0, 200)}...`);
    console.log(`   Supporting memories: ${answer.supporting_memories.length}\n`);

    console.log('🎉 All tests passed! Gemini integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error instanceof Error && error.message.includes('GOOGLE_GENERATIVE_AI_API_KEY')) {
      console.log('\n💡 Make sure to set your GOOGLE_GENERATIVE_AI_API_KEY in the environment.');
      console.log('   Copy .env.example to .env and add your API key.');
    }
  }
}

// Run the test
testGeminiIntegration();
