"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getPaiements } from "@/services/data-service"
import { CreditCard } from "lucide-react"

export default function PaymentsPage() {
  const paiements = getPaiements()

  const getModePaiementBadge = (mode: string) => {
    const colors: Record<string, string> = {
      ESPECES: "bg-green-500 text-white",
      MOBILE_MONEY: "bg-blue-500 text-white",
      CARTE: "bg-purple-500 text-white",
      VIREMENT: "bg-orange-500 text-white",
    }
    return <Badge className={colors[mode] || "bg-secondary"}>{mode.replace("_", " ")}</Badge>
  }

  return (
    <ProtectedLayout allowedRoles={["admin", "cashier"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Paiements</h1>
            <p className="text-muted-foreground mt-1">Historique des transactions</p>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <h3 className="text-lg font-semibold">Liste des Paiements</h3>
          </CardHeader>
          <CardContent>
            {paiements.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Aucun paiement</h3>
                <p className="text-sm text-muted-foreground">Les paiements apparaîtront ici</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>N° Paiement</TableHead>
                    <TableHead>N° Vente</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paiements.map((paiement) => (
                    <TableRow key={paiement.idPaiement} className="border-border">
                      <TableCell className="font-mono text-sm">{paiement.numeroPaiement}</TableCell>
                      <TableCell className="font-mono text-sm">{paiement.idVente}</TableCell>
                      <TableCell className="text-gradient-red font-semibold">{paiement.montant}€</TableCell>
                      <TableCell>{getModePaiementBadge(paiement.modePaiement)}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        {paiement.reference || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(paiement.dateCreation).toLocaleDateString("fr-FR")}
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
