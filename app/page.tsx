"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/authContext"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect based on role
        switch (user.role) {
          case "admin":
            router.push("/admin/dashboard-admin")
            break
          case "stock_manager":
            router.push("/stock_manager/dashboard-stock")
            break
          case "cashier":
            router.push("/cashier/dashboard-cashier")
            break
        }
      } else {
        router.push("/login")
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}
