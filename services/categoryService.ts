import axiosClient from "@/utils/axiosClient";

export interface Categorie {
  idCategorie: string;
  nom: string;
  description?: string;
  statut: boolean;
  dateCreation: string;
  dateModification: string;
  _count?: {
    produits: number;
  };
}

export interface CreateCategorieData {
  nom: string;
  description?: string;
}

export interface UpdateCategorieData {
  nom?: string;
  description?: string;
  statut?: boolean;
}

export interface CategoriesResponse {
  categories: Categorie[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const categorieService = {
  async getAllCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    statut?: boolean;
  }): Promise<CategoriesResponse> {
    const response = await axiosClient.get('/categories', { params });
    return response.data;
  },

  async getCategorieById(id: string): Promise<Categorie> {
    const response = await axiosClient.get(`/categories/${id}`);
    return response.data;
  },

  async createCategorie(data: CreateCategorieData): Promise<Categorie> {
    const response = await axiosClient.post('/categories', data);
    return response.data;
  },

  async updateCategorie(id: string, data: UpdateCategorieData): Promise<Categorie> {
    const response = await axiosClient.put(`/categories/${id}`, data);
    return response.data;
  },

  async updateCategorieStatut(id: string, statut: boolean): Promise<Categorie> {
    const response = await axiosClient.patch(`/categories/${id}/statut`, { statut });
    return response.data;
  },

  async deleteCategorie(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(`/categories/${id}`);
    return response.data;
  },
};
