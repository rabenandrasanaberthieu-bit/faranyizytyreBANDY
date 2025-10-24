"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/authContext"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { BreadcrumbNav } from "./breadcrumb-nav"

interface ProtectedLayoutProps {
  children: React.ReactNode
  allowedRoles?: ("admin" | "stock_manager" | "cashier")[]
}

export function ProtectedLayout({ children, allowedRoles }: ProtectedLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard if user doesn't have access
        switch (user.role) {
          case "admin":
            router.push("/admin/dashboard")
            break
          case "stock_manager":
            router.push("/stock/dashboard")
            break
          case "cashier":
            router.push("/cashier/dashboard")
            break
        }
      }
    }
  }, [user, loading, allowedRoles, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="pl-64">
        <AppHeader />
        <main className="p-6">
          <BreadcrumbNav />
          {children}
        </main>
      </div>
    </div>
  )
}
