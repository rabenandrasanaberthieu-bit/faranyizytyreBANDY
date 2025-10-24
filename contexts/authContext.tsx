"use client"
import { useState, useEffect, useContext, createContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  authService,
  type AuthResponse,
  type LoginData,
  type SignupData,
  type ChangePasswordData,
} from "@/services/authService"
import { mockAuthService } from "@/utils/mock-auth-service"
import { tokenService } from "../utils/token"

interface AuthContextType {
  user: any | null
  login: (data: LoginData) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  changePassword: (data: ChangePasswordData) => Promise<void>
  loading: boolean
  requirePasswordChange: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getAuthService = () => {
  const useMockAuth = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true" || !process.env.NEXT_PUBLIC_API_URL
  return useMockAuth ? mockAuthService : authService
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [requirePasswordChange, setRequirePasswordChange] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = tokenService.get()
    if (token) {
      try {
        const currentAuthService = getAuthService()
        const userData = await currentAuthService.getMe()
        setUser(userData)
        setRequirePasswordChange(userData.mustChangePassword || false)
      } catch (error) {
        tokenService.remove()
        if (typeof window !== "undefined") {
          localStorage.removeItem("mock_user")
        }
      }
    }
    setLoading(false)
  }

  const login = async (data: LoginData) => {
    try {
      const currentAuthService = getAuthService()
      const response: AuthResponse = await currentAuthService.login(data)

      if (response.token) {
        tokenService.set(response.token)
      }

      if (response.user) {
        setUser(response.user)
        setRequirePasswordChange(response.user.mustChangePassword || false)

        if (typeof window !== "undefined") {
          localStorage.setItem("mock_user", JSON.stringify(response.user))
        }

        if (response.user.mustChangePassword || response.requirePasswordChange) {
          router.push("/change-password")
        } else {
          const baseRolePath = `/${response.user.role}`
          switch (response.user.role) {
            case "admin":
              router.push(`${baseRolePath}/dashboard-admin`)
              break
            case "stock_manager":
              router.push(`${baseRolePath}/dashboard-stock`)
              break
            case "cashier":
              router.push(`${baseRolePath}/dashboard-cashier`)
              break
            default:
              router.push("/dashboard")
          }
        }
      }
    } catch (error) {
      throw error
    }
  }

  const signup = async (data: SignupData) => {
    try {
      const currentAuthService = getAuthService()
      await currentAuthService.signup(data)
      router.push("/users")
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    tokenService.remove()
    setUser(null)
    setRequirePasswordChange(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem("mock_user")
    }
    router.push("/login")
  }

  const changePassword = async (data: ChangePasswordData) => {
    try {
      const currentAuthService = getAuthService()
      await currentAuthService.changePassword(data)
      setRequirePasswordChange(false)
      if (user) {
        setUser({ ...user, mustChangePassword: false })
      }
      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    login,
    signup,
    logout,
    changePassword,
    loading,
    requirePasswordChange,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
