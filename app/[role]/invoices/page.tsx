"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getFactures } from "@/services/data-service"
import { FileText, Download } from "lucide-react"

export default function InvoicesPage() {
  const factures = getFactures()

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "GENEREE":
        return <Badge className="bg-green-500 text-white">Générée</Badge>
      case "ENVOYEE":
        return <Badge className="bg-blue-500 text-white">Envoyée</Badge>
      case "ANNULEE":
        return <Badge variant="destructive">Annulée</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  return (
    <ProtectedLayout allowedRoles={["admin", "cashier"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Factures</h1>
            <p className="text-muted-foreground mt-1">Gestion des factures</p>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <h3 className="text-lg font-semibold">Liste des Factures</h3>
          </CardHeader>
          <CardContent>
            {factures.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Aucune facture</h3>
                <p className="text-sm text-muted-foreground">Les factures générées apparaîtront ici</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>N° Facture</TableHead>
                    <TableHead>N° Paiement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factures.map((facture) => (
                    <TableRow key={facture.idFacture} className="border-border">
                      <TableCell className="font-mono text-sm">{facture.numeroFacture}</TableCell>
                      <TableCell className="font-mono text-sm">{facture.idPaiement}</TableCell>
                      <TableCell>{getStatutBadge(facture.statutFacture)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(facture.dateCreation).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
