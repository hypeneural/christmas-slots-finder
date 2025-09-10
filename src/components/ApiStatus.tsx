import React from 'react';
import { isRealApiEnabled, getApiBaseUrl } from '../lib/apiConfig';

interface ApiStatusProps {
  show?: boolean;
}

export function ApiStatus({ show = false }: ApiStatusProps) {
  const isRealApi = isRealApiEnabled();
  const apiUrl = getApiBaseUrl();

  React.useEffect(() => {
    console.log('API Status:', {
      isRealApi,
      apiUrl,
      timestamp: new Date().toISOString(),
    });
  }, [isRealApi, apiUrl]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded-lg text-xs z-50">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isRealApi ? 'bg-green-400' : 'bg-yellow-400'}`} />
        <span>{isRealApi ? 'API Real' : 'Mock Data'}</span>
      </div>
      <div className="text-gray-300 text-xs mt-1">
        {apiUrl}
      </div>
    </div>
  );
}

