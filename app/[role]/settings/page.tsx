"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsIcon, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [taxRate, setTaxRate] = useState("20")
  const [currency, setCurrency] = useState("EUR")
  const [storeName, setStoreName] = useState("Computer Store")
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres ont été mis à jour avec succès",
    })
  }

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
            <p className="text-muted-foreground mt-1">Configuration globale du magasin</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Informations du Magasin</CardTitle>
              <CardDescription>Paramètres généraux de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Nom du magasin</Label>
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Input
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Taxes et Tarification</CardTitle>
              <CardDescription>Configuration des taxes et prix</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Taux de TVA (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="pt-4">
                <Button className="w-full bg-gradient-red hover:opacity-90" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder les paramètres
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Gérer les alertes et notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertes de stock faible</p>
                <p className="text-sm text-muted-foreground">Recevoir des notifications quand le stock est bas</p>
              </div>
              <Button variant="outline">Activé</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nouvelles ventes</p>
                <p className="text-sm text-muted-foreground">Notifications pour chaque nouvelle vente</p>
              </div>
              <Button variant="outline">Activé</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
