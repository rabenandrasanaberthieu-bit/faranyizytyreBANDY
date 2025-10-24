import { useState, useCallback } from 'react';
import { categorieService, Categorie, CreateCategorieData, UpdateCategorieData, CategoriesResponse } from '../services/categoryService';

export function useCategorie() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [categorie, setCategorie] = useState<Categorie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const getAllCategories = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    statut?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response: CategoriesResponse = await categorieService.getAllCategories(params);
      setCategories(response.categories);
      setMeta(response.meta);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des catégories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategorieById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const categorieData = await categorieService.getCategorieById(id);
      setCategorie(categorieData);
      return categorieData;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération de la catégorie');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategorie = useCallback(async (data: CreateCategorieData) => {
    setLoading(true);
    setError(null);
    try {
      const newCategorie = await categorieService.createCategorie(data);
      setCategories(prev => [newCategorie, ...prev]);
      return newCategorie;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la catégorie');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategorie = useCallback(async (id: string, data: UpdateCategorieData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategorie = await categorieService.updateCategorie(id, data);
      setCategories(prev => prev.map(c => c.idCategorie === id ? updatedCategorie : c));
      if (categorie && categorie.idCategorie === id) {
        setCategorie(updatedCategorie);
      }
      return updatedCategorie;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour de la catégorie');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [categorie]);

  const updateCategorieStatut = useCallback(async (id: string, statut: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategorie = await categorieService.updateCategorieStatut(id, statut);
      setCategories(prev => prev.map(c => c.idCategorie === id ? updatedCategorie : c));
      if (categorie && categorie.idCategorie === id) {
        setCategorie(updatedCategorie);
      }
      return updatedCategorie;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du statut');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [categorie]);

  const deleteCategorie = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await categorieService.deleteCategorie(id);
      setCategories(prev => prev.filter(c => c.idCategorie !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression de la catégorie');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    categorie,
    loading,
    error,
    meta,
    getAllCategories,
    getCategorieById,
    createCategorie,
    updateCategorie,
    updateCategorieStatut,
    deleteCategorie,
  };
}
