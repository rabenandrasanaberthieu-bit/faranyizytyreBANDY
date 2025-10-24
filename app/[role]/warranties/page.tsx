"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getGaranties, getProduits } from "@/services/data-service"
import { Shield, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { Garantie } from "@/types/type"

export default function WarrantiesPage() {
  const [viewingWarranty, setViewingWarranty] = useState<Garantie | null>(null)
  const garanties = getGaranties()
  const produits = getProduits()

  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const activeWarranties = garanties.filter((g) => g.statut === "EN_COURS")
  const expiredWarranties = garanties.filter((g) => g.statut === "EXPIREE")
  const expiringTomorrow = garanties.filter((g) => {
    const endDate = new Date(g.dateFin)
    return endDate.toDateString() === tomorrow.toDateString() && g.statut === "EN_COURS"
  })

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "EN_COURS":
        return (
          <Badge variant="outline" className="text-green-500 border-green-500">
            En Cours
          </Badge>
        )
      case "EXPIREE":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-500">
            Expirée
          </Badge>
        )
      case "ANNULEE":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            Annulée
          </Badge>
        )
      default:
        return <Badge variant="outline">{statut}</Badge>
    }
  }

  const getProductName = (productId: string) => {
    const product = produits.find((p) => p.idProduit === productId)
    return product?.nom || "Produit inconnu"
  }

  return (
    <ProtectedLayout allowedRoles={["cashier", "admin"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Garanties</h1>
            <p className="text-muted-foreground mt-1">Suivi des garanties produits</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-gradient-to-br from-green-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">En Cours</CardTitle>
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{activeWarranties.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Garanties actives</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-red-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expirées</CardTitle>
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <XCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{expiredWarranties.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Garanties terminées</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-yellow-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expire Demain</CardTitle>
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{expiringTomorrow.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Attention requise</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-blue-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{garanties.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Toutes les garanties</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardHeader>
            <h3 className="text-lg font-semibold">Liste des Garanties</h3>
          </CardHeader>
          <CardContent>
            {garanties.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Aucune garantie</h3>
                <p className="text-sm text-muted-foreground">Les garanties apparaîtront ici après les ventes</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>N° Vente</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Date Début</TableHead>
                    <TableHead>Date Fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {garanties.map((garantie) => (
                    <TableRow key={garantie.idGarantie} className="border-border">
                      <TableCell className="font-mono text-sm">{garantie.idVente}</TableCell>
                      <TableCell className="font-medium">{getProductName(garantie.idProduit)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(garantie.dateDebut).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(garantie.dateFin).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>{getStatutBadge(garantie.statut)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setViewingWarranty(garantie)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!viewingWarranty} onOpenChange={() => setViewingWarranty(null)}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Détails de la Garantie</DialogTitle>
              <DialogDescription>Informations complètes sur la garantie</DialogDescription>
            </DialogHeader>
            {viewingWarranty && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">N° Garantie</p>
                    <p className="font-mono text-sm font-medium">{viewingWarranty.idGarantie}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">N° Vente</p>
                    <p className="font-mono text-sm font-medium">{viewingWarranty.idVente}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Produit</p>
                  <p className="font-medium">{getProductName(viewingWarranty.idProduit)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date Début</p>
                    <p className="font-medium">{new Date(viewingWarranty.dateDebut).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date Fin</p>
                    <p className="font-medium">{new Date(viewingWarranty.dateFin).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <div className="mt-1">{getStatutBadge(viewingWarranty.statut)}</div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedLayout>
  )
}
