"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Activity } from "lucide-react"
import { getAudits } from "@/services/data-service"

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const audits = getAudits()

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-500 text-white"
      case "UPDATE":
        return "bg-blue-500 text-white"
      case "DELETE":
        return "bg-red-500 text-white"
      case "LOGIN":
        return "bg-purple-500 text-white"
      case "LOGOUT":
        return "bg-gray-500 text-white"
      default:
        return "bg-secondary"
    }
  }

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Historique d'Audit</h1>
            <p className="text-muted-foreground mt-1">Suivi complet des actions utilisateurs</p>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans l'historique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </CardHeader>
          <CardContent>
            {audits.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Aucun historique</h3>
                <p className="text-sm text-muted-foreground">Les actions des utilisateurs apparaîtront ici</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Date</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audits.map((audit) => (
                    <TableRow key={audit.idAudit} className="border-border">
                      <TableCell className="text-muted-foreground">
                        {new Date(audit.dateAction).toLocaleString("fr-FR")}
                      </TableCell>
                      <TableCell className="font-medium">{audit.idUser}</TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(audit.action)}>{audit.action}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{audit.tableAffectee}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{audit.ip}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {audit.details ? JSON.stringify(audit.details).slice(0, 50) + "..." : "-"}
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
