import mockData from "@/data/mockData.json"

export interface AuthUser {
  id: string
  username: string
  email: string
  role: "admin" | "stock_manager" | "cashier"
  avatar?: string | null
}

export function login(username: string, password: string): AuthUser | null {
  const user = mockData.users.find((u) => u.username === username && u.password === password && u.isActive)

  if (user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    }
  }

  return null
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function setCurrentUser(user: AuthUser | null): void {
  if (typeof window === "undefined") return

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

export function logout(): void {
  setCurrentUser(null)
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function hasRole(role: "admin" | "stock_manager" | "cashier"): boolean {
  const user = getCurrentUser()
  return user?.role === role
}

export function hasAnyRole(roles: ("admin" | "stock_manager" | "cashier")[]): boolean {
  const user = getCurrentUser()
  return user ? roles.includes(user.role) : false
}
