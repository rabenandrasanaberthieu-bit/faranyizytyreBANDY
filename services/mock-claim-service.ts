import { mockDataComplete } from "@/lib/mock-data-complete"

export interface Claim {
  idReclamation: string
  idGarantie: string
  idProduit: string
  typeProbleme: string
  description: string
  photos: string[]
  statut: "EN_ATTENTE" | "EN_COURS" | "APPROUVEE" | "REJETEE"
  motifRejet?: string
  produitRemplacementId?: string
  dateCreation: string
  dateModification: string
}

export interface CreateClaimData {
  idGarantie: string
  idProduit: string
  typeProbleme: string
  description: string
  photos?: string[]
}

export const mockClaimService = {
  async getAll(params?: any) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let claims = mockDataComplete.reclamations || []

    if (params?.statut) {
      claims = claims.filter((c) => c.statut === params.statut)
    }

    if (params?.idGarantie) {
      claims = claims.filter((c) => c.idGarantie === params.idGarantie)
    }

    return {
      data: claims,
      meta: { total: claims.length, page: 1, limit: 100 },
    }
  },

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const claim = (mockDataComplete.reclamations || []).find((c) => c.idReclamation === id)
    if (!claim) throw new Error("Claim not found")
    return claim
  },

  async create(data: CreateClaimData) {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const newClaim: Claim = {
      idReclamation: `reclamation-${Date.now()}`,
      idGarantie: data.idGarantie,
      idProduit: data.idProduit,
      typeProbleme: data.typeProbleme,
      description: data.description,
      photos: data.photos || [],
      statut: "EN_ATTENTE",
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
    }

    if (!mockDataComplete.reclamations) {
      mockDataComplete.reclamations = []
    }
    mockDataComplete.reclamations.push(newClaim)
    return newClaim
  },

  async updateStatus(id: string, statut: string, motifRejet?: string) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const claim = (mockDataComplete.reclamations || []).find((c) => c.idReclamation === id)
    if (!claim) throw new Error("Claim not found")

    claim.statut = statut as any
    if (motifRejet) claim.motifRejet = motifRejet
    claim.dateModification = new Date().toISOString()

    return claim
  },

  async generateReport(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const claim = (mockDataComplete.reclamations || []).find((c) => c.idReclamation === id)
    if (!claim) throw new Error("Claim not found")

    return {
      filename: `rapport-reclamation-${claim.idReclamation}.pdf`,
      content: `Rapport de réclamation ${claim.idReclamation}`,
    }
  },
}
