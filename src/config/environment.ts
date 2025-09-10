// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

/**
 * Para habilitar a API real, defina VITE_USE_REAL_API=true no seu arquivo .env.local
 * ou modifique o valor abaixo para true
 */
export const ENABLE_REAL_API = true; // Mude para false para usar dados mock

/**
 * Configuração da API
 */
export const API_ENV = {
  USE_REAL_API: import.meta.env.VITE_USE_REAL_API === 'true' || ENABLE_REAL_API,
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true' || false,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://horarios.fotosdenatal.com/app.php',
} as const;

/**
 * Logging helper
 */
export function logApiStatus() {
  console.log('🔧 API Configuration:', {
    useRealApi: API_ENV.USE_REAL_API,
    apiUrl: API_ENV.API_BASE_URL,
    devMode: API_ENV.DEV_MODE,
  });
}