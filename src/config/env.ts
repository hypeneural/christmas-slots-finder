// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

/**
 * Environment variables with fallbacks
 */
export const ENV = {
  USE_REAL_API: import.meta.env.VITE_USE_REAL_API === 'true' || false,
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true' || false,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://horarios.fotosdenatal.com/app.php',
} as const;

/**
 * Development helpers
 */
export const DEV_CONFIG = {
  ENABLE_LOGGING: ENV.DEV_MODE,
  ENABLE_DEBUG: ENV.DEV_MODE,
  MOCK_DELAYS: ENV.DEV_MODE,
} as const;

/**
 * Logging helper for development
 */
export function devLog(message: string, ...args: any[]) {
  if (DEV_CONFIG.ENABLE_LOGGING) {
    console.log(`[DEV] ${message}`, ...args);
  }
}

/**
 * Debug helper for development
 */
export function devDebug(message: string, data?: any) {
  if (DEV_CONFIG.ENABLE_DEBUG) {
    console.debug(`[DEBUG] ${message}`, data);
  }
}
