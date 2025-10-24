"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getValidations } from "@/services/data-service"
import { CheckSquare, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ValidationsPage() {
  const validations = getValidations()
  const { toast } = useToast()

  const handleValidate = (id: string, approve: boolean) => {
    toast({
      title: approve ? "Demande approuvée" : "Demande refusée",
      description: `La demande a été ${approve ? "validée" : "refusée"} avec succès`,
    })
  }

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Demandes de Validation</h1>
            <p className="text-muted-foreground mt-1">Approuver ou refuser les demandes</p>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Demandes en attente</h3>
              <Badge variant="secondary">{validations.length} demandes</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {validations.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Aucune demande</h3>
                <p className="text-sm text-muted-foreground">Les demandes de validation apparaîtront ici</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Date</TableHead>
                    <TableHead>Demandeur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validations.map((validation) => (
                    <TableRow key={validation.idValidation} className="border-border">
                      <TableCell className="text-muted-foreground">
                        {new Date(validation.dateCreation).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="font-medium">{validation.idDemandeur}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{validation.action}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{validation.tableAffectee}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            validation.statut === "EN_ATTENTE"
                              ? "secondary"
                              : validation.statut === "VALIDEE"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {validation.statut === "EN_ATTENTE" && "En attente"}
                          {validation.statut === "VALIDEE" && "Validée"}
                          {validation.statut === "REFUSEE" && "Refusée"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {validation.statut === "EN_ATTENTE" && (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => handleValidate(validation.idValidation, true)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleValidate(validation.idValidation, false)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Refuser
                            </Button>
                          </div>
                        )}
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
