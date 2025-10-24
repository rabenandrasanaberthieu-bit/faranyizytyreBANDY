"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, DollarSign, ShoppingCart, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getVentes, getClients } from "@/services/data-service"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export default function CashierDashboard() {
  const ventes = getVentes()
  const clients = getClients()

  const totalVentes = ventes.reduce((sum, v) => sum + Number.parseFloat(v.totalNet), 0)
  const averageVente = ventes.length > 0 ? totalVentes / ventes.length : 0

  // Daily sales data
  const dailySalesData = [
    { name: "Lun", montant: 1200 },
    { name: "Mar", montant: 1900 },
    { name: "Mer", montant: 1600 },
    { name: "Jeu", montant: 2400 },
    { name: "Ven", montant: 2100 },
    { name: "Sam", montant: 2800 },
    { name: "Dim", montant: 1800 },
  ]

  return (
    <ProtectedLayout allowedRoles={["cashier"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tableau de bord Caisse</h1>
            <p className="text-muted-foreground mt-1">Gestion des ventes et paiements</p>
          </div>
          <Link href="/cashier/new-sale">
            <Button className="bg-gradient-red hover:opacity-90">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Nouvelle Vente
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ventes Aujourd'hui</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient-red">{totalVentes.toFixed(2)} €</div>
              <p className="text-xs text-muted-foreground mt-1">{ventes.length} transaction(s)</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paiements</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{ventes.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Tous payés</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Garanties Actives</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-1">En cours</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Moyenne Vente</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{averageVente.toFixed(2)} €</div>
              <p className="text-xs text-muted-foreground mt-1">Par transaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gradient-red" />
              Ventes de la Semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailySalesData}>
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
                <Line type="monotone" dataKey="montant" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Ventes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ventes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aucune vente récente</p>
              ) : (
                ventes.slice(0, 5).map((vente) => {
                  const client = clients.find((c) => c.idClient === vente.idClient)
                  return (
                    <div key={vente.idVente} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{vente.numeroVente}</p>
                        <p className="text-xs text-muted-foreground">{client?.nom || "Client inconnu"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gradient-red">{vente.totalNet} €</p>
                        <p className="text-xs text-muted-foreground">
                          {vente.statutPaiement === "PAYEE" ? "Payée" : "En attente"}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
