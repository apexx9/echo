import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if required extensions exist
    const extensions = await prisma.$queryRaw<Array<{ extname: string }>>`
      SELECT extname FROM pg_extension 
      WHERE extname IN ('uuid-ossp', 'pgvector')
    `;
    
    const hasUuidOssp = extensions.some((ext: { extname: string }) => ext.extname === 'uuid-ossp');
    const hasPgvector = extensions.some((ext: { extname: string }) => ext.extname === 'pgvector');
    
    // Test basic table operations
    const userCount = await prisma.user.count();
    const memoryCount = await prisma.memory.count();
    const answerCount = await prisma.answer.count();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        extensions: {
          'uuid-ossp': hasUuidOssp,
          'pgvector': hasPgvector,
        },
        tables: {
          users: userCount,
          memories: memoryCount,
          answers: answerCount,
        },
      },
      services: {
        gemini_api: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        authentication: !!process.env.NEXTAUTH_SECRET,
      },
    };
    
    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('[HEALTH] Database health check failed:', error);
    
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: {
        message: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    };
    
    return NextResponse.json(errorResponse, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  }
}
