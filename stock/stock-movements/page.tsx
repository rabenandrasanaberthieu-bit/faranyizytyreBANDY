"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getMouvementsStock, getProduits } from "@/services/data-service"
import { TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react"

export default function StockMovementsPageStock() {
  const mouvements = getMouvementsStock()
  const produits = getProduits()

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "ENTREE":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "SORTIE":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "AJUSTEMENT":
        return <ArrowUpDown className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getMovementBadgeColor = (type: string) => {
    switch (type) {
      case "ENTREE":
        return "bg-green-500 text-white"
      case "SORTIE":
        return "bg-red-500 text-white"
      case "AJUSTEMENT":
        return "bg-blue-500 text-white"
      default:
        return "bg-secondary"
    }
  }

  return (
    <ProtectedLayout allowedRoles={["stock_manager"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mouvements de Stock</h1>
            <p className="text-muted-foreground mt-1">Historique des entrées et sorties</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Entrées</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {mouvements.filter((m) => m.typeMouvement === "ENTREE").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Sorties</span>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {mouvements.filter((m) => m.typeMouvement === "SORTIE").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border border-blue-500/20 bg-blue-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Ajustements</span>
                <ArrowUpDown className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {mouvements.filter((m) => m.typeMouvement === "AJUSTEMENT").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardHeader>
            <h3 className="text-lg font-semibold">Historique des Mouvements</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Date</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Motif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mouvements.map((mouvement) => {
                  const produit = produits.find((p) => p.idProduit === mouvement.idProduit)
                  return (
                    <TableRow key={mouvement.idMouvement} className="border-border">
                      <TableCell className="text-muted-foreground">
                        {new Date(mouvement.dateMouvement).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="font-medium">{produit?.nom || "Produit inconnu"}</TableCell>
                      <TableCell>
                        <Badge className={getMovementBadgeColor(mouvement.typeMouvement)}>
                          <span className="mr-1">{getMovementIcon(mouvement.typeMouvement)}</span>
                          {mouvement.typeMouvement}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {mouvement.typeMouvement === "ENTREE" && "+"}
                        {mouvement.typeMouvement === "SORTIE" && "-"}
                        {mouvement.quantite}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{mouvement.motif || "-"}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
