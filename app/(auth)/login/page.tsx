"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/authContext"
import Image from "next/image"
import { Eye, EyeOff, User, Lock, Loader2 } from "lucide-react"
import { DEMO_ACCOUNTS } from "@/lib/mock-data"

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {}

    if (!formData.username.trim()) newErrors.username = "Le nom d'utilisateur est requis."
    if (!formData.password.trim()) newErrors.password = "Le mot de passe est requis."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      await login({
        identifier: formData.username,
        password: formData.password,
      })

      toast({
        title: "Connexion réussie ",
        description: `Bienvenue ${formData.username}!`,
      })
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error?.response?.data?.message || "Nom d'utilisateur ou mot de passe incorrect.",
        variant: "destructive",
      })
    }
  }

  const handleQuickLogin = (username: string, password: string) => {
    setFormData({ username, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <Image src="/logo.png" alt="Logo" width={64} height={64} className="mx-auto" />
          <div>
            <CardTitle className="text-3xl font-bold">
              Computer <span className="text-primary">Store</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Connectez-vous pour accéder à votre espace
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`pl-10 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              </div>
              {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full bg-gradient-red" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Comptes de démonstration disponibles:</p>
            <div className="space-y-2">
              {Object.entries(DEMO_ACCOUNTS).map(([key, account]) => (
                <Button
                  key={key}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs bg-transparent"
                  onClick={() => handleQuickLogin(account.username, account.password)}
                >
                  {account.role === "admin" && "👤 Admin"}
                  {account.role === "stock_manager" && "📦 Stock Manager"}
                  {account.role === "cashier" && "💳 Cashier"}
                  <span className="ml-2 text-muted-foreground">({account.username})</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
