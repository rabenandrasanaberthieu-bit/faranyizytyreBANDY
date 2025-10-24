"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getVentes, getClients } from "@/services/data-service"
import { Search, ShoppingCart, Eye } from "lucide-react"

export default function AdminSalesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const ventes = getVentes()
  const clients = getClients()

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "PAYEE":
        return <Badge className="bg-green-500 text-white">Payée</Badge>
      case "PARTIELLEMENT_PAYEE":
        return <Badge className="bg-yellow-500 text-white">Partielle</Badge>
      case "NON_PAYEE":
        return <Badge variant="destructive">Non Payée</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  return (
    <ProtectedLayout allowedRoles={["admin", "cashier"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ventes</h1>
            <p className="text-muted-foreground mt-1">Consultation complète des ventes</p>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une vente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>N° Vente</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Caissier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventes.map((vente) => {
                  const client = clients.find((c) => c.idClient === vente.idClient)
                  return (
                    <TableRow key={vente.idVente} className="border-border">
                      <TableCell className="font-mono text-sm">{vente.numeroVente}</TableCell>
                      <TableCell className="font-medium">{client?.nom || "Client inconnu"}</TableCell>
                      <TableCell className="text-muted-foreground">{vente.idUser}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(vente.dateCreation).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-gradient-red font-semibold">{vente.totalNet}€</TableCell>
                      <TableCell>{getStatutBadge(vente.statutPaiement)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vente.typeVente}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
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
