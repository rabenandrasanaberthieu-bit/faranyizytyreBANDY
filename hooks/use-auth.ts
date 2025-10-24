"use client"

import { useState, useEffect } from "react"
import { type AuthUser, getCurrentUser, setCurrentUser as saveUser, logout as performLogout } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const setCurrentUser = (user: AuthUser | null) => {
    setUser(user)
    saveUser(user)
  }

  const logout = () => {
    performLogout()
    setUser(null)
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    setCurrentUser,
    logout,
  }
}
