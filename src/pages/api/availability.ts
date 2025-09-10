import { NextApiRequest, NextApiResponse } from 'next';
import { AvailabilityClient, QueryFilters, PostBody } from '../../lib/availabilityClient';

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

const client = new AvailabilityClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { pack } = req.query;

    if (!pack || typeof pack !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Package code is required' 
      });
    }

    let data;

    if (req.method === 'GET') {
      // Parse query parameters
      const filters: QueryFilters = {
        tz: req.query.tz as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        perPage: req.query.perPage ? parseInt(req.query.perPage as string) : undefined,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        daysOfWeek: req.query.daysOfWeek ? (req.query.daysOfWeek as string).split(',') as any : undefined,
        onlyWeekends: req.query.onlyWeekends === 'true',
        timeOfDay: req.query.timeOfDay ? (req.query.timeOfDay as string).split(',') as any : undefined,
        timeStart: req.query.timeStart as string,
        timeEnd: req.query.timeEnd as string,
        onlyAfter18: req.query.onlyAfter18 === 'true',
        exactTime: req.query.exactTime as string || null,
        minSlotsPerDate: req.query.minSlotsPerDate ? parseInt(req.query.minSlotsPerDate as string) : undefined,
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof QueryFilters] === undefined) {
          delete filters[key as keyof QueryFilters];
        }
      });

      data = await client.getAvailability(pack, filters);

    } else if (req.method === 'POST') {
      const body: PostBody = req.body;
      data = await client.postAvailability(pack, body);

    } else {
      return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
      });
    }

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
}

// ============================================================================
// EXAMPLE USAGE IN COMPONENT
// ============================================================================

/*
// Exemplo de uso em um componente React:

import { useState, useEffect } from 'react';

export function AvailabilityComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvailability = async (pack: string, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        pack,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined)
        ),
      });

      const response = await fetch(`/api/availability?${queryParams}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability('HOHOHO', {
      dateFrom: '2025-11-15',
      dateTo: '2025-12-24',
      onlyWeekends: false,
      onlyAfter18: true,
    });
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!data) return <div>Nenhum dado disponível</div>;

  return (
    <div>
      <h1>Horários Disponíveis</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
*/
