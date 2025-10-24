// src/services/mouvementStock.service.ts
import axiosClient from '../utils/axiosClient';

export interface MouvementStock {
  idMouvement: string;
  idProduit: string;
  idUser: string;
  typeMouvement: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT';
  quantite: number;
  motif?: string;
  dateMouvement: string;
  produit: {
    nom: string;
    codeProduit: string;
  };
  user: {
    username: string;
    email: string;
  };
}

export interface MouvementsResponse {
  mouvements: MouvementStock[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MouvementStats {
  totalMouvements: number;
  totalEntrees: number;
  totalSorties: number;
  solde: number;
  produitsAvecMouvements: Array<{
    idProduit: string;
    nom: string;
    codeProduit: string;
    stockActuel: number;
    nbMouvements: number;
    derniersMouvements: MouvementStock[];
  }>;
}

export const mouvementStockService = {
  async getAllMouvements(params?: {
    page?: number;
    limit?: number;
    idProduit?: string;
    typeMouvement?: string;
    dateDebut?: string;
    dateFin?: string;
  }): Promise<MouvementsResponse> {
    const response = await axiosClient.get('/mouvements-stock', { params });
    return response.data;
  },

  async getMouvementById(id: string): Promise<MouvementStock> {
    const response = await axiosClient.get(`/mouvements-stock/${id}`);
    return response.data;
  },

  async getStatistiquesMouvements(params?: {
    dateDebut?: string;
    dateFin?: string;
  }): Promise<MouvementStats> {
    const response = await axiosClient.get('/mouvements-stock/statistiques', { params });
    return response.data;
  },
};
