import axios from "axios"
import { tokenService } from "../utils/token"

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
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

// Response interceptor pour gérer les erreurs
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      tokenService.remove()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    
    // Gérer les erreurs de validation
    if (error.response?.status === 400 && error.response?.data?.error?.details) {
      const validationErrors = error.response.data.error.details
      console.error('Validation errors:', validationErrors)
    }
    
    return Promise.reject(error)
  },
)

export default axiosClient
