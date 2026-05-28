// ============================================================================
// SIMPLE API CONFIGURATION
// ============================================================================

// Configuração simples sem dependências externas
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://evydencia.com/api/public/v1/agenda',
  USE_REAL_API: import.meta.env.VITE_USE_REAL_API !== 'false',
  TIMEOUT_MS: 15000,
  DEFAULT_TZ: 'America/Sao_Paulo',
  CAMPAIGN_SLUG: import.meta.env.VITE_AGENDA_CAMPAIGN_SLUG || 'natal',
  
  // Mapeamento de slugs para códigos da API
  PACKAGE_MAPPING: {
    'ho-ho-ho': 'HOHOHO',
    'entao-e-natal': 'ENTAO', 
    'boas-festas': 'BOAS',
  } as const,
  
  // Configurações de paginação
  DEFAULT_PAGE_SIZE: 30,
  MAX_PAGE_SIZE: 100,
  
  // Configurações de cache
  CACHE_TTL: 5 * 60 * 1000, // 5 minutos
} as const;

export type PackageSlug = keyof typeof API_CONFIG.PACKAGE_MAPPING;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Verifica se a API real está habilitada
 */
export function isRealApiEnabled(): boolean {
  return API_CONFIG.USE_REAL_API;
}

/**
 * Obtém a URL base da API
 */
export function getApiBaseUrl(): string {
  return API_CONFIG.BASE_URL;
}

/**
 * Obtém código do pacote da API baseado no slug
 */
export function getPackageCodeFromSlug(slug: string): string | null {
  return API_CONFIG.PACKAGE_MAPPING[slug as PackageSlug] || null;
}

/**
 * Verifica se um slug de pacote é válido
 */
export function isValidPackageSlug(slug: string): boolean {
  return slug in API_CONFIG.PACKAGE_MAPPING;
}

/**
 * Obtém configuração de timeout
 */
export function getTimeoutMs(): number {
  return API_CONFIG.TIMEOUT_MS;
}

/**
 * Obtém timezone padrão
 */
export function getDefaultTimezone(): string {
  return API_CONFIG.DEFAULT_TZ;
}
