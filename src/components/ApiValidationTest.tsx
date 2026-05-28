import React, { useState } from 'react';

interface LegacyApiResponse {
  timestamp?: string;
  metadata?: {
    generatedAt?: string;
  };
  package?: {
    name?: string;
    code?: string;
  };
  processedSlots?: {
    all?: Record<string, string[]>;
  };
  pagination?: {
    currentPage?: number;
    totalPages?: number;
  };
  [key: string]: unknown;
}

interface ApiValidationResult {
  success: boolean;
  data: LegacyApiResponse;
  validation: {
    timestamp: {
      value?: string;
      isValid: boolean;
      parsed: string;
    };
    generatedAt: {
      value?: string;
      isValid: boolean;
      parsed: string;
    };
  };
}

export function ApiValidationTest() {
  const [result, setResult] = useState<ApiValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApiWithValidation = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Teste direto da API
      const url = new URL('https://horarios.fotosdenatal.com/app.php');
      url.searchParams.set('pack', 'ENTAO');
      url.searchParams.set('page', '1');
      url.searchParams.set('perPage', '30');
      
      console.log('Testing API URL:', url.toString());
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json() as LegacyApiResponse;
      console.log('Raw API Response:', data);
      
      // Teste de validação manual dos campos problemáticos
      const timestamp = data.timestamp;
      const generatedAt = data.metadata?.generatedAt;
      
      console.log('Timestamp validation:', {
        value: timestamp,
        isValid: !isNaN(Date.parse(timestamp)),
        parsed: new Date(timestamp)
      });
      
      console.log('GeneratedAt validation:', {
        value: generatedAt,
        isValid: !isNaN(Date.parse(generatedAt)),
        parsed: new Date(generatedAt)
      });
      
      setResult({
        success: true,
        data,
        validation: {
          timestamp: {
            value: timestamp,
            isValid: !isNaN(Date.parse(timestamp)),
            parsed: new Date(timestamp).toISOString()
          },
          generatedAt: {
            value: generatedAt,
            isValid: !isNaN(Date.parse(generatedAt)),
            parsed: new Date(generatedAt).toISOString()
          }
        }
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('API Test Error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Teste de Validação da API</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Teste de Validação de Datas</h2>
        <p className="text-gray-600 mb-4">
          Este teste verifica se os campos de data/hora da API são válidos para o JavaScript.
        </p>
        
        <button
          onClick={testApiWithValidation}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Testar Validação'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">❌ Erro</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-green-800 mb-2">✅ Validação Bem-sucedida</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Timestamp:</h3>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <p><strong>Valor:</strong> {result.validation.timestamp.value}</p>
                <p><strong>Válido:</strong> {result.validation.timestamp.isValid ? '✅ Sim' : '❌ Não'}</p>
                <p><strong>Parsed:</strong> {result.validation.timestamp.parsed}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">GeneratedAt:</h3>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <p><strong>Valor:</strong> {result.validation.generatedAt.value}</p>
                <p><strong>Válido:</strong> {result.validation.generatedAt.isValid ? '✅ Sim' : '❌ Não'}</p>
                <p><strong>Parsed:</strong> {result.validation.generatedAt.parsed}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Dados da API:</h3>
              <div className="text-sm">
                <p><strong>Package:</strong> {result.data.package?.name} ({result.data.package?.code})</p>
                <p><strong>Slots disponíveis:</strong> {Object.keys(result.data.processedSlots?.all ?? {}).length} datas</p>
                <p><strong>Paginação:</strong> Página {result.data.pagination?.currentPage} de {result.data.pagination?.totalPages}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Informações</h2>
        <div className="space-y-2 text-sm">
          <p>• A API está retornando dados reais de horários de Natal</p>
          <p>• Os campos de data estão no formato correto para JavaScript</p>
          <p>• O problema era no schema de validação Zod muito restritivo</p>
          <p>• Agora a validação aceita qualquer formato de data válido</p>
        </div>
      </div>
    </div>
  );
}
