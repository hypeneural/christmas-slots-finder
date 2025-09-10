import React, { useState } from 'react';

export function SimpleApiTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const url = new URL('https://horarios.fotosdenatal.com/app.php');
      url.searchParams.set('pack', 'HOHOHO');
      
      console.log('Testing API URL:', url.toString());
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      setResult(data);
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
      <h1 className="text-3xl font-bold mb-6">Teste Simples da API</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Teste Direto da API</h2>
        <p className="text-gray-600 mb-4">
          Este teste faz uma requisição direta para a API sem usar o SDK.
        </p>
        
        <button
          onClick={testApi}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Testar API (HOHOHO)'}
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
          <h2 className="text-xl font-bold text-green-800 mb-2">✅ Sucesso</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Success:</strong> {result.success ? 'true' : 'false'}</p>
            {result.package && (
              <p><strong>Package:</strong> {result.package.name} ({result.package.code})</p>
            )}
            {result.processedSlots && (
              <p><strong>Slots disponíveis:</strong> {Object.keys(result.processedSlots.all).length} datas</p>
            )}
          </div>
          
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold">Ver resposta completa</summary>
            <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Informações da API</h2>
        <div className="space-y-2 text-sm">
          <p><strong>URL:</strong> https://horarios.fotosdenatal.com/app.php</p>
          <p><strong>Método:</strong> GET</p>
          <p><strong>Parâmetro:</strong> pack=HOHOHO</p>
          <p><strong>CORS:</strong> Habilitado</p>
        </div>
      </div>
    </div>
  );
}
