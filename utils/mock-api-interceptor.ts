import axiosClient from "./axiosClient"
import { mockProductService } from "@/services/mock-product-service"
import { mockCategoryService } from "@/services/mock-category-service"
import { mockStockMovementService } from "@/services/mock-stock-movement-service"

const USE_MOCK_DATA = true // Set to false to use real API

export function setupMockInterceptor() {
  if (!USE_MOCK_DATA) return

  // Intercept product requests
  axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config

      // Products
      if (config.url?.includes("/produits")) {
        if (config.method === "get" && !config.url.includes("/produits/")) {
          const response = await mockProductService.getAllProduits(config.params)
          return Promise.resolve({ data: response })
        }
        if (config.method === "get" && config.url.includes("/produits/")) {
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
      }

      // Categories
      if (config.url?.includes("/categories")) {
        if (config.method === "get" && !config.url.includes("/categories/")) {
          const response = await mockCategoryService.getAllCategories(config.params)
          return Promise.resolve({ data: response })
        }
        if (config.method === "get" && config.url.includes("/categories/")) {
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
      }

      // Stock movements
      if (config.url?.includes("/mouvements-stock")) {
        if (config.method === "get" && !config.url.includes("/mouvements-stock/")) {
          const response = await mockStockMovementService.getAllMouvements(config.params)
          return Promise.resolve({ data: response })
        }
        if (config.method === "get" && config.url.includes("/mouvements-stock/")) {
          const id = config.url.split("/").pop()
          const response = await mockStockMovementService.getMouvementById(id)
          return Promise.resolve({ data: response })
        }
      }

      return Promise.reject(error)
    },
  )
}
