/**
 * Entitlements System - Backend-Only Access Control
 * 
 * This defines what users can do based on their entitlement tier.
 * UI and core functions never reference pricing directly.
 */

export interface UserEntitlements {
  // Core limits
  memory_limit: number;              // e.g. 50, 1000, Infinity
  monthly_ingest_limit: number;      // safety + cost control
  max_file_size_mb: number;
  
  // Feature access
  vector_search_depth: number;       // top-K results
  answer_confidence_detail: boolean;
  timeline_access: boolean;
  weekly_insights: boolean;
  priority_models: boolean;
}

export type EntitlementTier = 'free' | 'pro' | 'student_pro';

/**
 * Entitlement configurations for each tier
 */
const ENTITLEMENT_CONFIGS: Record<EntitlementTier, UserEntitlements> = {
  free: {
    memory_limit: 50,
    monthly_ingest_limit: 100,
    max_file_size_mb: 5,
    vector_search_depth: 10,
    answer_confidence_detail: false,
    timeline_access: true,
    weekly_insights: false,
    priority_models: false,
  },

  pro: {
    memory_limit: Infinity,
    monthly_ingest_limit: 5000,
    max_file_size_mb: 50,
    vector_search_depth: 50,
    answer_confidence_detail: true,
    timeline_access: true,
    weekly_insights: true,
    priority_models: true,
  },

  student_pro: {
    memory_limit: 2000,
    monthly_ingest_limit: 1500,
    max_file_size_mb: 25,
    vector_search_depth: 40,
    answer_confidence_detail: true,
    timeline_access: true,
    weekly_insights: true,
    priority_models: false,
  },
};

/**
 * Get entitlements for a user based on their tier
 */
export function getEntitlements(tier: EntitlementTier): UserEntitlements {
  return ENTITLEMENT_CONFIGS[tier];
}

/**
 * Check if user can ingest more content this month
 */
export function canIngestMore(
  entitlements: UserEntitlements, 
  currentMonthlyCount: number
): boolean {
  return currentMonthlyCount < entitlements.monthly_ingest_limit;
}

/**
 * Check if user can store more memories
 */
export function canStoreMoreMemories(
  entitlements: UserEntitlements, 
  currentMemoryCount: number
): boolean {
  return currentMemoryCount < entitlements.memory_limit;
}

/**
 * Check if file size is allowed
 */
export function isFileSizeAllowed(
  entitlements: UserEntitlements, 
  fileSizeMb: number
): boolean {
  return fileSizeMb <= entitlements.max_file_size_mb;
}

/**
 * Get allowed search depth for vector search
 */
export function getAllowedSearchDepth(entitlements: UserEntitlements): number {
  return entitlements.vector_search_depth;
}

/**
 * Check if user can access confidence details
 */
export function canAccessConfidenceDetails(entitlements: UserEntitlements): boolean {
  return entitlements.answer_confidence_detail;
}

/**
 * Check if user can access timeline
 */
export function canAccessTimeline(entitlements: UserEntitlements): boolean {
  return entitlements.timeline_access;
}

/**
 * Check if user can receive weekly insights
 */
export function canReceiveWeeklyInsights(entitlements: UserEntitlements): boolean {
  return entitlements.weekly_insights;
}

/**
 * Check if user gets priority model access
 */
export function hasPriorityModels(entitlements: UserEntitlements): boolean {
  return entitlements.priority_models;
}

/**
 * Assert functions - throw errors if entitlements are violated
 * These are used by core functions to enforce limits
 */
export class EntitlementError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'EntitlementError';
  }
}

export function assertCanIngest(
  entitlements: UserEntitlements, 
  currentMonthlyCount: number
): void {
  if (!canIngestMore(entitlements, currentMonthlyCount)) {
    throw new EntitlementError(
      `Monthly ingest limit of ${entitlements.monthly_ingest_limit} exceeded`,
      'MONTHLY_INGEST_LIMIT_EXCEEDED'
    );
  }
}

export function assertCanStoreMemory(
  entitlements: UserEntitlements, 
  currentMemoryCount: number
): void {
  if (!canStoreMoreMemories(entitlements, currentMemoryCount)) {
    throw new EntitlementError(
      `Memory limit of ${entitlements.memory_limit} exceeded`,
      'MEMORY_LIMIT_EXCEEDED'
    );
  }
}

export function assertFileSizeAllowed(
  entitlements: UserEntitlements, 
  fileSizeMb: number
): void {
  if (!isFileSizeAllowed(entitlements, fileSizeMb)) {
    throw new EntitlementError(
      `File size ${fileSizeMb}MB exceeds limit of ${entitlements.max_file_size_mb}MB`,
      'FILE_SIZE_EXCEEDED'
    );
  }
}

export function assertCanAccessTimeline(entitlements: UserEntitlements): void {
  if (!canAccessTimeline(entitlements)) {
    throw new EntitlementError(
      'Timeline access not available on current plan',
      'TIMELINE_ACCESS_DENIED'
    );
  }
}

export function assertCanAccessConfidenceDetails(entitlements: UserEntitlements): void {
  if (!canAccessConfidenceDetails(entitlements)) {
    throw new EntitlementError(
      'Confidence details not available on current plan',
      'CONFIDENCE_DETAILS_ACCESS_DENIED'
    );
  }
}
