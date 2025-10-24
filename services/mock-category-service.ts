import { mockDataComplete } from "@/lib/mock-data-complete"
import type { Categorie, CategoriesResponse, CreateCategorieData, UpdateCategorieData } from "./categoryService"

export const mockCategoryService = {
  async getAllCategories(params?: {
    page?: number
    limit?: number
    search?: string
    statut?: boolean
  }): Promise<CategoriesResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let categories = [...mockDataComplete.categories]

    if (params?.search) {
      const search = params.search.toLowerCase()
      categories = categories.filter((c) => c.nom.toLowerCase().includes(search))
    }

    if (params?.statut !== undefined) {
      categories = categories.filter((c) => c.statut === params.statut)
    }

    const page = params?.page || 1
    const limit = params?.limit || 10
    const start = (page - 1) * limit
    const paginatedCategories = categories.slice(start, start + limit)

    return {
      categories: paginatedCategories,
      meta: {
        page,
        limit,
        total: categories.length,
        totalPages: Math.ceil(categories.length / limit),
      },
    }
  },

  async getCategorieById(id: string): Promise<Categorie> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const categorie = mockDataComplete.categories.find((c) => c.idCategorie === id)
    if (!categorie) throw new Error("Catégorie non trouvée")
    return categorie
  },

  async createCategorie(data: CreateCategorieData): Promise<Categorie> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newCategorie: Categorie = {
      idCategorie: `cat-${Date.now()}`,
      ...data,
      statut: true,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      _count: { produits: 0 },
    }
    mockDataComplete.categories.push(newCategorie)
    return newCategorie
  },

  async updateCategorie(id: string, data: UpdateCategorieData): Promise<Categorie> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const categorie = mockDataComplete.categories.find((c) => c.idCategorie === id)
    if (!categorie) throw new Error("Catégorie non trouvée")

    Object.assign(categorie, data, { dateModification: new Date().toISOString() })
    return categorie
  },

  async updateCategorieStatut(id: string, statut: boolean): Promise<Categorie> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const categorie = mockDataComplete.categories.find((c) => c.idCategorie === id)
    if (!categorie) throw new Error("Catégorie non trouvée")

    categorie.statut = statut
    return categorie
  },

  async deleteCategorie(id: string): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockDataComplete.categories.findIndex((c) => c.idCategorie === id)
    if (index === -1) throw new Error("Catégorie non trouvée")

    mockDataComplete.categories.splice(index, 1)
    return { message: "Catégorie supprimée" }
  },
}
