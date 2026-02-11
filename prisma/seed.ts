import { PrismaClient } from '@prisma/client';
import { MemoryObject, AnswerObject, UUID } from '@/lib/types';

// Use the same pattern as database.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

export async function seedDatabase() {
  console.log('🌱 Seeding Echo database...');

  try {
    // Create test user
    const testUser = await prisma.user.upsert({
      where: { email: 'test@echo.dev' },
      update: {},
      create: {
        id: 'test-user-1',
        email: 'test@echo.dev',
        entitlementTier: 'free',
        monthlyIngestCount: 0,
        lastIngestReset: new Date(),
      },
    });

    console.log(`✅ Created test user: ${testUser.email}`);

    // Create sample memories
    const sampleMemories = [
      {
        id: 'mem-1',
        userId: testUser.id,
        rawContent: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta. React uses a virtual DOM to optimize rendering performance.',
        rawContentHash: 'react-content-hash-1',
        cleanedContent: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta. React uses a virtual DOM to optimize rendering performance.',
        sourceType: 'note',
        sourceTitle: 'React Learning Notes',
        sourceAuthor: 'Test User',
        createdAt: new Date('2024-01-15'),
        consumedAt: new Date('2024-01-15'),
        summary: 'React is a JavaScript library for building user interfaces with virtual DOM optimization.',
        keyConcepts: ['React', 'JavaScript', 'Virtual DOM', 'UI', 'Facebook'],
        relatedMemoryIds: [],
        relationshipReason: [],
        confidenceScore: 0.9,
        userVerified: false,
        importanceWeight: 0.8,
        decayRate: 0.1,
      },
      {
        id: 'mem-2',
        userId: testUser.id,
        rawContent: 'TypeScript is a strongly typed programming language that builds on JavaScript, adding static type definitions. TypeScript makes JavaScript development more robust and maintainable.',
        rawContentHash: 'typescript-content-hash-2',
        cleanedContent: 'TypeScript is a strongly typed programming language that builds on JavaScript, adding static type definitions. TypeScript makes JavaScript development more robust and maintainable.',
        sourceType: 'web',
        sourceUrl: 'https://www.typescriptlang.org/docs/',
        sourceTitle: 'TypeScript Documentation',
        sourceAuthor: 'Microsoft',
        createdAt: new Date('2024-02-01'),
        consumedAt: new Date('2024-02-01'),
        summary: 'TypeScript extends JavaScript with static typing for more robust development.',
        keyConcepts: ['TypeScript', 'JavaScript', 'Static Types', 'Microsoft'],
        relatedMemoryIds: [],
        relationshipReason: [],
        confidenceScore: 0.95,
        userVerified: true,
        importanceWeight: 0.9,
        decayRate: 0.1,
      },
      {
        id: 'mem-3',
        userId: testUser.id,
        rawContent: 'Next.js is a React framework that enables server-side rendering, static site generation, and API routes. It provides an excellent developer experience with features like file-based routing.',
        rawContentHash: 'nextjs-content-hash-3',
        cleanedContent: 'Next.js is a React framework that enables server-side rendering, static site generation, and API routes. It provides an excellent developer experience with features like file-based routing.',
        sourceType: 'web',
        sourceUrl: 'https://nextjs.org/docs',
        sourceTitle: 'Next.js Documentation',
        sourceAuthor: 'Vercel',
        createdAt: new Date('2024-03-10'),
        consumedAt: new Date('2024-03-10'),
        summary: 'Next.js is a React framework with SSR, SSG, and file-based routing.',
        keyConcepts: ['Next.js', 'React', 'SSR', 'SSG', 'Vercel'],
        relatedMemoryIds: ['mem-1'],
        relationshipReason: ['Builds on React concepts'],
        confidenceScore: 0.85,
        userVerified: false,
        importanceWeight: 0.7,
        decayRate: 0.1,
      },
    ];

    for (const memoryData of sampleMemories) {
      await prisma.memory.upsert({
        where: { id: memoryData.id },
        update: {},
        create: memoryData,
      });
      console.log(`✅ Created memory: ${memoryData.sourceTitle}`);
    }

    // Create sample answer
    const sampleAnswer = {
      id: 'answer-1',
      userId: testUser.id,
      originalQuery: 'What do I know about React?',
      interpretedIntent: 'overview',
      answerText: 'Based on your saved memories, you understand React as a JavaScript library for building user interfaces that was developed by Facebook. You\'ve noted that it uses a virtual DOM to optimize rendering performance and that you see it as a fundamental tool for UI development.',
      supportingMemories: [
        {
          memory_id: 'mem-1',
          source_title: 'React Learning Notes',
          source_type: 'note',
          consumed_at: new Date('2024-01-15'),
          confidence_score: 0.9,
          relevance_score: 0.95,
          snippet: 'React is a JavaScript library for building user interfaces...',
        }
      ],
      overallConfidence: 0.9,
      uncertaintyNotes: undefined,
      suggestedActions: [
        {
          label: 'Ask follow-up',
          action_type: 'expand',
          payload: { query: 'What do I know about React components?' },
        },
        {
          label: 'View timeline',
          action_type: 'expand',
          payload: { query: 'What do I know about React?', intent: 'timeline' },
        },
      ],
      generatedAt: new Date(),
    };

    await prisma.answer.upsert({
      where: { id: sampleAnswer.id },
      update: {},
      create: sampleAnswer,
    });

    console.log('✅ Created sample answer');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created: ${sampleMemories.length} memories, 1 answer, 1 user`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedDatabase()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
