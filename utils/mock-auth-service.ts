// Mock authentication service for demo purposes
import { DEMO_ACCOUNTS } from "@/lib/mock-data"
import type { AuthResponse, LoginData, ChangePasswordData } from "@/services/authService"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockAuthService = {
  async login(data: LoginData): Promise<AuthResponse> {
    await delay(800) // Simulate network delay

    const account = Object.values(DEMO_ACCOUNTS).find(
      (acc) => acc.username === data.identifier || acc.email === data.identifier,
    )

    if (!account) {
      throw {
        response: {
          data: {
            message: "Nom d'utilisateur ou mot de passe incorrect.",
          },
        },
      }
    }

    // Check password
    if (account.password !== data.password) {
      throw {
        response: {
          data: {
            message: "Nom d'utilisateur ou mot de passe incorrect.",
          },
        },
      }
    }

    // Generate mock token
    const token = `mock_token_${account.id}_${Date.now()}`

    return {
      user: {
        id: account.id,
        username: account.username,
        email: account.email,
        role: account.role,
        avatar: account.avatar,
        lastLogin: account.lastLogin,
        mustChangePassword: account.mustChangePassword,
      },
      token,
    }
  },

  async getMe(): Promise<any> {
    await delay(300)

    // Get user from localStorage (set during login)
    const userStr = typeof window !== "undefined" ? localStorage.getItem("mock_user") : null
    if (!userStr) {
      throw new Error("Not authenticated")
    }

    return JSON.parse(userStr)
  },

  async changePassword(data: ChangePasswordData): Promise<any> {
    await delay(600)
    return { message: "Password changed successfully" }
  },

  async signup(data: any): Promise<any> {
    await delay(800)
    return { message: "Signup successful" }
  },
}
