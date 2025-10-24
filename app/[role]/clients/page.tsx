"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getClients } from "@/services/data-service"
import { Search, UserCircle, Edit } from "lucide-react"

export default function AdminClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const clients = getClients()

  const filteredClients = clients.filter(
    (client) =>
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telephone.includes(searchTerm) ||
      client.codeClient.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <ProtectedLayout allowedRoles={["admin", "cashier"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground mt-1">Consultation de la base clients</p>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, téléphone ou code..."
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
                  <TableHead>Code</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Date Création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.idClient} className="border-border">
                    <TableCell className="font-mono text-sm">{client.codeClient}</TableCell>
                    <TableCell className="font-medium">{client.nom}</TableCell>
                    <TableCell className="text-muted-foreground">{client.telephone}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(client.dateCreation).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
