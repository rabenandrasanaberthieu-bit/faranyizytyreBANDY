import { mockDataComplete } from "@/lib/mock-data-complete"

export interface Warranty {
  idGarantie: string
  idVente: string
  idProduit: string
  dateDebut: string
  dateFin: string
  statut: "ACTIVE" | "EXPIREE" | "UTILISEE" | "ANNULEE"
  description: string
  produit?: any
  vente?: any
}

export interface CreateWarrantyData {
  idVente: string
  idProduit: string
  dateDebut: string
  dureeGarantieMois: number
  description?: string
}

export const mockWarrantyService = {
  async getAll(params?: any) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let warranties = [...mockDataComplete.garanties]

    // Filter by status
    if (params?.statut) {
      warranties = warranties.filter((w) => w.statut === params.statut)
    }

    // Filter by product
    if (params?.idProduit) {
      warranties = warranties.filter((w) => w.idProduit === params.idProduit)
    }

    // Filter by date range
    if (params?.dateDebut && params?.dateFin) {
      warranties = warranties.filter((w) => {
        const wDate = new Date(w.dateDebut)
        return wDate >= new Date(params.dateDebut) && wDate <= new Date(params.dateFin)
      })
    }

    return {
      data: warranties,
      meta: { total: warranties.length, page: 1, limit: 100 },
    }
  },

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const warranty = mockDataComplete.garanties.find((w) => w.idGarantie === id)
    if (!warranty) throw new Error("Warranty not found")
    return warranty
  },

  async create(data: CreateWarrantyData) {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const dateFin = new Date(data.dateDebut)
    dateFin.setMonth(dateFin.getMonth() + data.dureeGarantieMois)

    const newWarranty: Warranty = {
      idGarantie: `garantie-${Date.now()}`,
      idVente: data.idVente,
      idProduit: data.idProduit,
      dateDebut: data.dateDebut,
      dateFin: dateFin.toISOString(),
      statut: "ACTIVE",
      description: data.description || "Garantie constructeur",
    }

    mockDataComplete.garanties.push(newWarranty)
    return newWarranty
  },

  async updateStatus(id: string, statut: string) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const warranty = mockDataComplete.garanties.find((w) => w.idGarantie === id)
    if (!warranty) throw new Error("Warranty not found")
    warranty.statut = statut as any
    return warranty
  },

  async generateAttestation(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const warranty = mockDataComplete.garanties.find((w) => w.idGarantie === id)
    if (!warranty) throw new Error("Warranty not found")

    // Simulate PDF generation
    return {
      filename: `attestation-${warranty.idGarantie}.pdf`,
      content: `Attestation de garantie ${warranty.idGarantie}`,
    }
  },
}
