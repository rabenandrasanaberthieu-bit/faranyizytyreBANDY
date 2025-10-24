"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react"
import { getProduits, getMouvementsStock, getProduitsLowStock, getCategories } from "@/services/data-service"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Pie, PieChart, Cell } from "recharts"

export default function StockDashboard() {
  const produits = getProduits()
  const mouvements = getMouvementsStock()
  const lowStockProducts = getProduitsLowStock()
  const categories = getCategories()

  const entrees = mouvements.filter((m) => m.typeMouvement === "ENTREE")
  const sorties = mouvements.filter((m) => m.typeMouvement === "SORTIE")

  // Category distribution
  const categoryData = categories.map((cat) => ({
    name: cat.nom,
    value: produits.filter((p) => p.idCategorie === cat.idCategorie).length,
  }))

  const COLORS = ["#dc2626", "#991b1b", "#7f1d1d"]

  // Stock movement trend
  const movementData = [
    { name: "Sem 1", entrees: 45, sorties: 20 },
    { name: "Sem 2", entrees: 52, sorties: 28 },
    { name: "Sem 3", entrees: 38, sorties: 15 },
    { name: "Sem 4", entrees: 60, sorties: 32 },
  ]

  return (
    <ProtectedLayout allowedRoles={["stock_manager"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord Stock</h1>
          <p className="text-muted-foreground mt-1">Gestion de l'inventaire</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Produits Totaux</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{produits.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{categories.length} catégories</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Stock Faible</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{lowStockProducts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Nécessite réapprovisionnement</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Entrées</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{entrees.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sorties</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{sorties.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Mouvements de Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={movementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="name" stroke="#a3a3a3" />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #262626",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="entrees" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="sorties" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Répartition par Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #262626",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        <Card className="border-border border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Alertes Stock Faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune alerte de stock</p>
              ) : (
                lowStockProducts.map((produit) => (
                  <div key={produit.idProduit} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{produit.nom}</p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {produit.stock} unités (Seuil: {produit.seuilMin})
                      </p>
                    </div>
                    <span className="text-xs text-yellow-500 font-medium">Attention</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
