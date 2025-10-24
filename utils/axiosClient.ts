import axios from "axios"
import { tokenService } from "./token"

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Ajouter automatiquement le token JWT
axiosClient.interceptors.request.use(
  (config) => {
    const token = tokenService.get()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"

if (USE_MOCK_DATA) {
  axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config
      if (!config) return Promise.reject(error)

      // Import mock services dynamically to avoid circular dependencies
      const { mockProductService } = await import("@/services/mock-product-service")
      const { mockCategoryService } = await import("@/services/mock-category-service")
      const { mockStockMovementService } = await import("@/services/mock-stock-movement-service")
      const { mockDataComplete } = await import("@/lib/mock-data-complete")

      try {
        // Products endpoints
        if (config.url?.includes("/produits")) {
          if (config.method === "get" && !config.url.match(/\/produits\/[^/]+$/)) {
            const response = await mockProductService.getAllProduits(config.params)
            return Promise.resolve({ data: response })
          }
          if (config.method === "get" && config.url.match(/\/produits\/[^/]+$/)) {
            const id = config.url.split("/").pop()
            const response = await mockProductService.getProduitById(id)
            return Promise.resolve({ data: response })
          }
          if (config.method === "post" && !config.url.includes("/demande-suppression")) {
            const response = await mockProductService.createProduit(config.data)
            return Promise.resolve({ data: response })
          }
          if (config.method === "put") {
            const id = config.url.split("/").pop()
            const response = await mockProductService.updateProduit(id, config.data)
            return Promise.resolve({ data: response })
          }
          if (config.method === "patch" && config.url.includes("/stock")) {
            const id = config.url.split("/")[2]
            const response = await mockProductService.updateStock(id, config.data.quantite, config.data.motif)
            return Promise.resolve({ data: response })
          }
        }

        // Categories endpoints
        if (config.url?.includes("/categories")) {
          if (config.method === "get" && !config.url.match(/\/categories\/[^/]+$/)) {
            const response = await mockCategoryService.getAllCategories(config.params)
            return Promise.resolve({ data: response })
          }
          if (config.method === "get" && config.url.match(/\/categories\/[^/]+$/)) {
            const id = config.url.split("/").pop()
            const response = await mockCategoryService.getCategorieById(id)
            return Promise.resolve({ data: response })
          }
          if (config.method === "post") {
            const response = await mockCategoryService.createCategorie(config.data)
            return Promise.resolve({ data: response })
          }
          if (config.method === "put") {
            const id = config.url.split("/").pop()
            const response = await mockCategoryService.updateCategorie(id, config.data)
            return Promise.resolve({ data: response })
          }
          if (config.method === "patch") {
            const id = config.url.split("/")[2]
            const response = await mockCategoryService.updateCategorieStatut(id, config.data.statut)
            return Promise.resolve({ data: response })
          }
          if (config.method === "delete") {
            const id = config.url.split("/").pop()
            const response = await mockCategoryService.deleteCategorie(id)
            return Promise.resolve({ data: response })
          }
        }

        // Stock movements endpoints
        if (config.url?.includes("/mouvements-stock")) {
          if (
            config.method === "get" &&
            !config.url.match(/\/mouvements-stock\/[^/]+$/) &&
            !config.url.includes("/statistiques")
          ) {
            const response = await mockStockMovementService.getAllMouvements(config.params)
            return Promise.resolve({ data: response })
          }
          if (config.method === "get" && config.url.includes("/statistiques")) {
            const response = await mockStockMovementService.getStatistiquesMouvements(config.params)
            return Promise.resolve({ data: response })
          }
          if (config.method === "get" && config.url.match(/\/mouvements-stock\/[^/]+$/)) {
            const id = config.url.split("/").pop()
            const response = await mockStockMovementService.getMouvementById(id)
            return Promise.resolve({ data: response })
          }
        }

        // Ventes endpoints
        if (config.url?.includes("/ventes")) {
          if (config.method === "get") {
            const response = {
              ventes: mockDataComplete.ventes,
              meta: { page: 1, limit: 10, total: mockDataComplete.ventes.length, totalPages: 1 },
            }
            return Promise.resolve({ data: response })
          }
        }

        // Clients endpoints
        if (config.url?.includes("/clients")) {
          if (config.method === "get") {
            const response = {
              clients: mockDataComplete.clients,
              meta: { page: 1, limit: 10, total: mockDataComplete.clients.length, totalPages: 1 },
            }
            return Promise.resolve({ data: response })
          }
        }

        // Promotions endpoints
        if (config.url?.includes("/promotions")) {
          if (config.method === "get") {
            const response = {
              promotions: mockDataComplete.promotions,
              meta: { page: 1, limit: 10, total: mockDataComplete.promotions.length, totalPages: 1 },
            }
            return Promise.resolve({ data: response })
          }
        }

        // Garanties endpoints
        if (config.url?.includes("/garanties")) {
          if (config.method === "get") {
            const response = {
              garanties: mockDataComplete.garanties,
              meta: { page: 1, limit: 10, total: mockDataComplete.garanties.length, totalPages: 1 },
            }
            return Promise.resolve({ data: response })
          }
        }

        // Paiements endpoints
        if (config.url?.includes("/paiements")) {
          if (config.method === "get") {
            const response = {
              paiements: mockDataComplete.paiements,
              meta: { page: 1, limit: 10, total: mockDataComplete.paiements.length, totalPages: 1 },
            }
            return Promise.resolve({ data: response })
          }
        }

        // Factures endpoints
        if (config.url?.includes("/factures")) {
          if (config.method === "get") {
            const response = {
              factures: mockDataComplete.factures,
              meta: { page: 1, limit: 10, total: mockDataComplete.factures.length, totalPages: 1 },
            }
            return Promise.resolve({ data: response })
          }
        }

        // Audits endpoints
        if (config.url?.includes("/audits")) {
          if (config.method === "get") {
            const response = {
              audits: mockDataComplete.audits,
              meta: { page: 1, limit: 10, total: mockDataComplete.audits.length, totalPages: 1 },
            }
            return Promise.resolve({ data: response })
          }
        }

        // Validations endpoints
        if (config.url?.includes("/validations")) {
          if (config.method === "get") {
            const response = {
              validations: mockDataComplete.validations,
              meta: { page: 1, limit: 10, total: mockDataComplete.validations.length, totalPages: 1 },
            }
            return Promise.resolve({ data: response })
          }
        }
      } catch (err) {
        console.error("[v0] Mock interceptor error:", err)
      }

      return Promise.reject(error)
    },
  )
}

export default axiosClient
