/**
 * User Service - User management and entitlement resolution
 * 
 * Handles user operations and entitlement resolution without exposing pricing.
 */

import { prisma } from './database';
import { EntitlementTier, getEntitlements, UserEntitlements } from './entitlements';

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  
  // Entitlements
  entitlementTier: EntitlementTier;
  studentVerifiedUntil?: Date;
  
  // Usage tracking
  monthlyIngestCount: number;
  lastIngestReset: Date;
}

/**
 * Get user by ID with their entitlements
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      entitlementTier: user.entitlementTier as EntitlementTier,
      studentVerifiedUntil: user.studentVerifiedUntil || undefined,
      monthlyIngestCount: user.monthlyIngestCount,
      lastIngestReset: user.lastIngestReset,
    };
  } catch (error) {
    console.error(`[USER] Failed to get user by ID: ${userId}`, error);
    return null;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      entitlementTier: user.entitlementTier as EntitlementTier,
      studentVerifiedUntil: user.studentVerifiedUntil || undefined,
      monthlyIngestCount: user.monthlyIngestCount,
      lastIngestReset: user.lastIngestReset,
    };
  } catch (error) {
    console.error(`[USER] Failed to get user by email: ${email}`, error);
    return null;
  }
}

/**
 * Get user entitlements - this is single source of truth
 */
export async function getUserEntitlements(userId: string): Promise<UserEntitlements> {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check if student status has expired
  if (user.entitlementTier === 'student_pro' && user.studentVerifiedUntil) {
    if (new Date() > user.studentVerifiedUntil) {
      // Student status expired, downgrade to free
      await updateUserEntitlementTier(userId, 'free');
      return getEntitlements('free');
    }
  }
  
  return getEntitlements(user.entitlementTier);
}

/**
 * Update user entitlement tier
 */
export async function updateUserEntitlementTier(
  userId: string, 
  tier: EntitlementTier
): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { entitlementTier: tier },
    });
    console.log(`[USER] Updated user ${userId} to tier: ${tier}`);
  } catch (error) {
    console.error(`[USER] Failed to update user tier: ${userId}`, error);
    throw error;
  }
}

/**
 * Set student verification status
 */
export async function setStudentVerification(
  userId: string, 
  verifiedUntil: Date
): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { 
        entitlementTier: 'student_pro',
        studentVerifiedUntil: verifiedUntil,
      },
    });
    console.log(`[USER] Set student verification for user ${userId} until: ${verifiedUntil}`);
  } catch (error) {
    console.error(`[USER] Failed to set student verification: ${userId}`, error);
    throw error;
  }
}

/**
 * Check if email is from academic institution
 */
export function isAcademicEmail(email: string): boolean {
  const academicDomains = [
    '.edu',
    '.ac.uk',
    '.edu.au',
    '.edu.ca',
    '.ac.jp',
    '.edu.sg',
    '.ac.in',
    '.edu.cn'
  ];
  
  return academicDomains.some(domain => email.endsWith(domain));
}

/**
 * Get current monthly ingest count for user
 */
export async function getCurrentMonthlyIngestCount(userId: string): Promise<number> {
  try {
    const user = await getUserById(userId);
    if (!user) return 0;
    
    // Check if we need to reset monthly count (new month)
    const now = new Date();
    const lastReset = new Date(user.lastIngestReset);
    
    if (now.getMonth() !== lastReset.getMonth() || 
        now.getFullYear() !== lastReset.getFullYear()) {
      // Reset monthly count for new month
      await resetMonthlyIngestCount(userId);
      return 0;
    }
    
    return user.monthlyIngestCount;
  } catch (error) {
    console.error(`[USER] Failed to get monthly ingest count: ${userId}`, error);
    return 0;
  }
}

/**
 * Increment monthly ingest count
 */
export async function incrementMonthlyIngestCount(userId: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyIngestCount: {
          increment: 1,
        },
      },
    });
    console.log(`[USER] Incremented monthly ingest count for user: ${userId}`);
  } catch (error) {
    console.error(`[USER] Failed to increment monthly count: ${userId}`, error);
    throw error;
  }
}

/**
 * Reset monthly ingest count (called at start of new month)
 */
export async function resetMonthlyIngestCount(userId: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyIngestCount: 0,
        lastIngestReset: new Date(),
      },
    });
    console.log(`[USER] Reset monthly ingest count for user: ${userId}`);
  } catch (error) {
    console.error(`[USER] Failed to reset monthly count: ${userId}`, error);
    throw error;
  }
}

/**
 * Get total memory count for user
 */
export async function getUserMemoryCount(userId: string): Promise<number> {
  try {
    return await prisma.memory.count({
      where: {
        userId,
        deletedAt: null,
      },
    });
  } catch (error) {
    console.error(`[USER] Failed to get memory count: ${userId}`, error);
    return 0;
  }
}

/**
 * Create or update user from authentication
 */
export async function upsertUserFromAuth(authData: {
  id: string;
  email: string;
}): Promise<User> {
  try {
    // Check if user exists
    let user = await getUserById(authData.id);
    
    if (!user) {
      // Create new user
      const tier = isAcademicEmail(authData.email) ? 'student_pro' : 'free';
      const studentVerifiedUntil = tier === 'student_pro' ? 
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : // 1 year
        undefined;
      
      const newUser = await prisma.user.create({
        data: {
          id: authData.id,
          email: authData.email,
          entitlementTier: tier,
          studentVerifiedUntil,
          monthlyIngestCount: 0,
          lastIngestReset: new Date(),
        },
      });
      
      user = {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt,
        entitlementTier: newUser.entitlementTier as EntitlementTier,
        studentVerifiedUntil: newUser.studentVerifiedUntil || undefined,
        monthlyIngestCount: newUser.monthlyIngestCount,
        lastIngestReset: newUser.lastIngestReset,
      };
      
      console.log(`[USER] Created new user: ${authData.email} with tier: ${tier}`);
    }
    
    return user;
  } catch (error) {
    console.error(`[USER] Failed to upsert user: ${authData.email}`, error);
    throw error;
  }
}
