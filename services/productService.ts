import axiosClient from "@/utils/axiosClient";

export interface Produit {
  idProduit: string;
  codeProduit: string;
  nom: string;
  description?: string;
  image?: string;
  prixAchat: number;
  prixMin: number;
  prixVente: number;
  stock: number;
  seuilMin: number;
  garantieMois: number;
  statut: 'ACTIF' | 'EN_ATTENTE_SUPPRESSION' | 'SUPPRIME';
  idCategorie: string;
  dateCreation: string;
  dateModification: string;
  categorie?: {
    nom: string;
    statut: boolean;
  };
  _count?: {
    lignesVente: number;
    garanties: number;
  };
}

export interface CreateProduitData {
  codeProduit: string;
  nom: string;
  description?: string;
  image?: string;
  prixAchat: number;
  prixMin: number;
  prixVente: number;
  stock: number;
  seuilMin?: number;
  garantieMois?: number;
  idCategorie: string;
}

export interface UpdateProduitData {
  codeProduit?: string;
  nom?: string;
  description?: string;
  image?: string;
  prixAchat?: number;
  prixMin?: number;
  prixVente?: number;
  stock?: number;
  seuilMin?: number;
  garantieMois?: number;
  idCategorie?: string;
}

export interface ProduitsResponse {
  produits: Produit[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const produitService = {
  async getAllProduits(params?: {
    page?: number;
    limit?: number;
    search?: string;
    idCategorie?: string;
    statut?: 'ACTIF' | 'EN_ATTENTE_SUPPRESSION' | 'SUPPRIME';
    stockMin?: number;
  }): Promise<ProduitsResponse> {
    const response = await axiosClient.get('/produits', { params });
    return response.data;
  },

  async getProduitById(id: string): Promise<Produit> {
    const response = await axiosClient.get(`/produits/${id}`);
    return response.data;
  },

  async createProduit(data: CreateProduitData): Promise<Produit> {
    const response = await axiosClient.post('/produits', data);
    return response.data;
  },

  async updateProduit(id: string, data: UpdateProduitData): Promise<Produit> {
    const response = await axiosClient.put(`/produits/${id}`, data);
    return response.data;
  },

  async demandeSuppression(id: string, raison: string): Promise<{ message: string }> {
    const response = await axiosClient.post(`/produits/${id}/demande-suppression`, { raison });
    return response.data;
  },

  async updateStock(id: string, quantite: number, motif: string): Promise<Produit> {
    const response = await axiosClient.patch(`/produits/${id}/stock`, { quantite, motif });
    return response.data;
  },
};
