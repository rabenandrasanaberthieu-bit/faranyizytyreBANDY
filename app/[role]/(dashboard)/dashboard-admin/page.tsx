"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, AlertTriangle, ArrowUpRight } from "lucide-react"
import { getVentes, getProduits, getClients, getProduitsLowStock } from "@/services/data-service"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts"

export default function AdminDashboard() {
  const ventes = getVentes()
  const produits = getProduits()
  const clients = getClients()
  const lowStockProducts = getProduitsLowStock()

  const totalVentes = ventes.reduce((sum, v) => sum + Number.parseFloat(v.totalNet), 0)
  const totalProduits = produits.length

  const salesData = [
    { name: "Lun", ventes: 1200, objectif: 1500 },
    { name: "Mar", ventes: 1900, objectif: 1500 },
    { name: "Mer", ventes: 1600, objectif: 1500 },
    { name: "Jeu", ventes: 2400, objectif: 1500 },
    { name: "Ven", ventes: 2100, objectif: 1500 },
    { name: "Sam", ventes: 2800, objectif: 1500 },
    { name: "Dim", ventes: 1800, objectif: 1500 },
  ]

  const categoryData = [
    { name: "Portables", value: 45, color: "#dc2626" },
    { name: "Composants", value: 30, color: "#ea580c" },
    { name: "Périphériques", value: 25, color: "#f59e0b" },
  ]

  const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Fév", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Avr", revenue: 16000 },
    { month: "Mai", revenue: 22000 },
    { month: "Juin", revenue: 25000 },
  ]

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord Admin</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de votre magasin</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-gradient-to-br from-red-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ventes Totales</CardTitle>
              <div className="w-10 h-10 bg-gradient-red rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalVentes.toFixed(2)} €</div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500 font-medium">+20.1%</span>
                <span className="text-xs text-muted-foreground">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-orange-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Produits</CardTitle>
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalProduits}</div>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                  {lowStockProducts.length} stock faible
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-blue-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Commandes</CardTitle>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{ventes.length}</div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500 font-medium">+4</span>
                <span className="text-xs text-muted-foreground">depuis hier</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-purple-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clients</CardTitle>
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{clients.length}</div>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="text-green-500 border-green-500">
                  Tous actifs
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gradient-red" />
                Ventes de la Semaine
              </CardTitle>
              <p className="text-sm text-muted-foreground">Comparaison avec l'objectif</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="ventes"
                    stroke="#dc2626"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVentes)"
                  />
                  <Line type="monotone" dataKey="objectif" stroke="#a3a3a3" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gradient-red" />
                Ventes par Catégorie
              </CardTitle>
              <p className="text-sm text-muted-foreground">Répartition des produits vendus</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
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
                  <Bar dataKey="value" fill="#dc2626" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gradient-red" />
              Évolution du Chiffre d'Affaires
            </CardTitle>
            <p className="text-sm text-muted-foreground">Tendance sur 6 mois</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="month" stroke="#a3a3a3" />
                <YAxis stroke="#a3a3a3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={{ fill: "#dc2626", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity & Low Stock */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ventes.slice(0, 5).map((vente, index) => (
                  <div key={vente.idVente} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-gradient-red" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nouvelle vente créée</p>
                      <p className="text-xs text-muted-foreground">{vente.numeroVente}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(vente.dateCreation).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                  lowStockProducts.slice(0, 5).map((produit) => (
                    <div key={produit.idProduit} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{produit.nom}</p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {produit.stock} unités (Seuil: {produit.seuilMin})
                        </p>
                      </div>
                      <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                        Attention
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}
