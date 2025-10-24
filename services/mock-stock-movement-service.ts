import { mockDataComplete } from "@/lib/mock-data-complete"
import type { MouvementStock, MouvementsResponse, MouvementStats } from "./mouvementStock"

export const mockStockMovementService = {
  async getAllMouvements(params?: {
    page?: number
    limit?: number
    idProduit?: string
    typeMouvement?: string
    dateDebut?: string
    dateFin?: string
  }): Promise<MouvementsResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let mouvements = [...mockDataComplete.mouvementsStock]

    if (params?.idProduit) {
      mouvements = mouvements.filter((m) => m.idProduit === params.idProduit)
    }

    if (params?.typeMouvement) {
      mouvements = mouvements.filter((m) => m.typeMouvement === params.typeMouvement)
    }

    if (params?.dateDebut) {
      mouvements = mouvements.filter((m) => new Date(m.dateMouvement) >= new Date(params.dateDebut!))
    }

    if (params?.dateFin) {
      mouvements = mouvements.filter((m) => new Date(m.dateMouvement) <= new Date(params.dateFin!))
    }

    const page = params?.page || 1
    const limit = params?.limit || 10
    const start = (page - 1) * limit
    const paginatedMouvements = mouvements.slice(start, start + limit)

    return {
      mouvements: paginatedMouvements,
      meta: {
        page,
        limit,
        total: mouvements.length,
        totalPages: Math.ceil(mouvements.length / limit),
      },
    }
  },

  async getMouvementById(id: string): Promise<MouvementStock> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const mouvement = mockDataComplete.mouvementsStock.find((m) => m.idMouvement === id)
    if (!mouvement) throw new Error("Mouvement non trouvé")
    return mouvement
  },

  async getStatistiquesMouvements(params?: {
    dateDebut?: string
    dateFin?: string
  }): Promise<MouvementStats> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let mouvements = [...mockDataComplete.mouvementsStock]

    if (params?.dateDebut) {
      mouvements = mouvements.filter((m) => new Date(m.dateMouvement) >= new Date(params.dateDebut!))
    }

    if (params?.dateFin) {
      mouvements = mouvements.filter((m) => new Date(m.dateMouvement) <= new Date(params.dateFin!))
    }

    const totalEntrees = mouvements.filter((m) => m.typeMouvement === "ENTREE").reduce((sum, m) => sum + m.quantite, 0)

    const totalSorties = mouvements.filter((m) => m.typeMouvement === "SORTIE").reduce((sum, m) => sum + m.quantite, 0)

    return {
      totalMouvements: mouvements.length,
      totalEntrees,
      totalSorties,
      solde: totalEntrees - totalSorties,
      produitsAvecMouvements: [],
    }
  },
}
