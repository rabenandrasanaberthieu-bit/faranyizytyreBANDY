import { useState, useCallback } from 'react';
import { produitService, Produit, CreateProduitData, UpdateProduitData, ProduitsResponse } from '../services/productService';

export function useProduit() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const getAllProduits = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    idCategorie?: string;
    statut?: 'ACTIF' | 'EN_ATTENTE_SUPPRESSION' | 'SUPPRIME';
    stockMin?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response: ProduitsResponse = await produitService.getAllProduits(params);
      setProduits(response.produits);
      setMeta(response.meta);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des produits');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProduitById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const produitData = await produitService.getProduitById(id);
      setProduit(produitData);
      return produitData;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération du produit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduit = useCallback(async (data: CreateProduitData) => {
    setLoading(true);
    setError(null);
    try {
      const newProduit = await produitService.createProduit(data);
      setProduits(prev => [newProduit, ...prev]);
      return newProduit;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du produit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduit = useCallback(async (id: string, data: UpdateProduitData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduit = await produitService.updateProduit(id, data);
      setProduits(prev => prev.map(p => p.idProduit === id ? updatedProduit : p));
      if (produit && produit.idProduit === id) {
        setProduit(updatedProduit);
      }
      return updatedProduit;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du produit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [produit]);

  const demandeSuppression = useCallback(async (id: string, raison: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await produitService.demandeSuppression(id, raison);
      // Mettre à jour le statut du produit localement
      setProduits(prev => prev.map(p => 
        p.idProduit === id ? { ...p, statut: 'EN_ATTENTE_SUPPRESSION' } : p
      ));
      if (produit && produit.idProduit === id) {
        setProduit({ ...produit, statut: 'EN_ATTENTE_SUPPRESSION' });
      }
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la demande de suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [produit]);

  const updateStock = useCallback(async (id: string, quantite: number, motif: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduit = await produitService.updateStock(id, quantite, motif);
      setProduits(prev => prev.map(p => p.idProduit === id ? updatedProduit : p));
      if (produit && produit.idProduit === id) {
        setProduit(updatedProduit);
      }
      return updatedProduit;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du stock');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [produit]);

  return {
    produits,
    produit,
    loading,
    error,
    meta,
    getAllProduits,
    getProduitById,
    createProduit,
    updateProduit,
    demandeSuppression,
    updateStock,
  };
}
