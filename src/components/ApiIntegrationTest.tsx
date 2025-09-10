import React, { useState, useEffect } from 'react';
import { useApiTest } from '../hooks/useApiTest';
import { isRealApiEnabled, getApiBaseUrl } from '../lib/apiConfig';

export function ApiIntegrationTest() {
  const [showDetails, setShowDetails] = useState(false);
  const { isLoading, result, testApi } = useApiTest();

  useEffect(() => {
    console.log('🔧 API Configuration:', {
      useRealApi: isRealApiEnabled(),
      apiUrl: getApiBaseUrl(),
    });
  }, []);

  const handleTestApi = () => {
    testApi('HOHOHO');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Teste de Integração da API</h1>
      
      {/* Status da configuração */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Configuração Atual</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">API Real:</span> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${isRealApiEnabled() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {isRealApiEnabled() ? 'Habilitada' : 'Desabilitada (Mock)'}
            </span>
          </div>
          <div>
            <span className="font-semibold">URL Base:</span> 
            <span className="ml-2 text-sm text-gray-600">{getApiBaseUrl()}</span>
          </div>
        </div>
      </div>

      {/* Botão de teste */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Teste da API</h2>
        <button
          onClick={handleTestApi}
          disabled={isLoading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testando...' : 'Testar API (HOHOHO)'}
        </button>
      </div>

      {/* Resultado do teste */}
      {result && (
        <div className={`rounded-lg p-6 mb-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h2 className={`text-xl font-bold mb-4 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.success ? '✅ Teste Bem-sucedido' : '❌ Teste Falhou'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Tempo de resposta:</span> 
              <span className="ml-2">{result.responseTime}ms</span>
            </div>
            
            {result.error && (
              <div>
                <span className="font-semibold text-red-600">Erro:</span>
                <p className="mt-1 text-red-600">{result.error}</p>
              </div>
            )}
            
            {result.data && (
              <div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {showDetails ? 'Ocultar' : 'Mostrar'} detalhes da resposta
                </button>
                
                {showDetails && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Dados da API:</h3>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Instruções</h2>
        <div className="space-y-2 text-sm">
          <p>• Para habilitar/desabilitar a API real, edite <code>src/config/environment.ts</code></p>
          <p>• A API real está configurada para: <code>{getApiBaseUrl()}</code></p>
          <p>• Os dados mock são usados quando a API real está desabilitada</p>
          <p>• O teste faz uma requisição GET para o pacote HOHOHO</p>
        </div>
      </div>
    </div>
  );
}
