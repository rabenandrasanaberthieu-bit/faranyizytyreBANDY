import { useState, useCallback } from 'react';
import { mouvementStockService, MouvementStock, MouvementsResponse, MouvementStats } from '../services/mouvementStock';
export function useMouvementStock() {
  const [mouvements, setMouvements] = useState<MouvementStock[]>([]);
  const [mouvement, setMouvement] = useState<MouvementStock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState<MouvementStats | null>(null);

  const getAllMouvements = useCallback(async (params?: {
    page?: number;
    limit?: number;
    idProduit?: string;
    typeMouvement?: string;
    dateDebut?: string;
    dateFin?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response: MouvementsResponse = await mouvementStockService.getAllMouvements(params);
      setMouvements(response.mouvements);
      setMeta(response.meta);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des mouvements de stock');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMouvementById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const mouvementData = await mouvementStockService.getMouvementById(id);
      setMouvement(mouvementData);
      return mouvementData;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération du mouvement de stock');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatistiquesMouvements = useCallback(async (params?: {
    dateDebut?: string;
    dateFin?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const statistics = await mouvementStockService.getStatistiquesMouvements(params);
      setStats(statistics);
      return statistics;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des statistiques');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    mouvements,
    mouvement,
    loading,
    error,
    meta,
    stats,
    getAllMouvements,
    getMouvementById,
    getStatistiquesMouvements,
  };
}
