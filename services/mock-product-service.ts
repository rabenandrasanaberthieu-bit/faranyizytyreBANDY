import { mockDataComplete } from "@/lib/mock-data-complete"
import type { Produit, ProduitsResponse, CreateProduitData, UpdateProduitData } from "./productService"

export const mockProductService = {
  async getAllProduits(params?: {
    page?: number
    limit?: number
    search?: string
    idCategorie?: string
    statut?: "ACTIF" | "EN_ATTENTE_SUPPRESSION" | "SUPPRIME"
    stockMin?: number
  }): Promise<ProduitsResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let produits = [...mockDataComplete.produits]

    // Filter by search
    if (params?.search) {
      const search = params.search.toLowerCase()
      produits = produits.filter(
        (p) => p.nom.toLowerCase().includes(search) || p.codeProduit.toLowerCase().includes(search),
      )
    }

    // Filter by category
    if (params?.idCategorie) {
      produits = produits.filter((p) => p.idCategorie === params.idCategorie)
    }

    // Filter by status
    if (params?.statut) {
      produits = produits.filter((p) => p.statut === params.statut)
    }

    // Filter by stock
    if (params?.stockMin !== undefined) {
      produits = produits.filter((p) => p.stock <= params.stockMin!)
    }

    // Pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const start = (page - 1) * limit
    const paginatedProduits = produits.slice(start, start + limit)

    return {
      produits: paginatedProduits,
      meta: {
        page,
        limit,
        total: produits.length,
        totalPages: Math.ceil(produits.length / limit),
      },
    }
  },

  async getProduitById(id: string): Promise<Produit> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const produit = mockDataComplete.produits.find((p) => p.idProduit === id)
    if (!produit) throw new Error("Produit non trouvé")
    return produit
  },

  async createProduit(data: CreateProduitData): Promise<Produit> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newProduit: Produit = {
      idProduit: `prod-${Date.now()}`,
      ...data,
      statut: "ACTIF",
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      categorie: mockDataComplete.categories.find((c) => c.idCategorie === data.idCategorie),
      _count: { lignesVente: 0, garanties: 0 },
    }
    mockDataComplete.produits.push(newProduit)
    return newProduit
  },

  async updateProduit(id: string, data: UpdateProduitData): Promise<Produit> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const produit = mockDataComplete.produits.find((p) => p.idProduit === id)
    if (!produit) throw new Error("Produit non trouvé")

    Object.assign(produit, data, { dateModification: new Date().toISOString() })
    return produit
  },

  async demandeSuppression(id: string, raison: string): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const produit = mockDataComplete.produits.find((p) => p.idProduit === id)
    if (!produit) throw new Error("Produit non trouvé")

    produit.statut = "EN_ATTENTE_SUPPRESSION"
    return { message: "Demande de suppression enregistrée" }
  },

  async updateStock(id: string, quantite: number, motif: string): Promise<Produit> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const produit = mockDataComplete.produits.find((p) => p.idProduit === id)
    if (!produit) throw new Error("Produit non trouvé")

    produit.stock += quantite

    // Add stock movement
    mockDataComplete.mouvementsStock.push({
      idMouvement: `mouv-${Date.now()}`,
      idProduit: id,
      idUser: "user-002",
      typeMouvement: quantite > 0 ? "ENTREE" : "SORTIE",
      quantite: Math.abs(quantite),
      motif,
      dateMouvement: new Date().toISOString(),
      produit: { nom: produit.nom, codeProduit: produit.codeProduit },
      user: { username: "stock", email: "stock@example.com" },
    })

    return produit
  },
}
