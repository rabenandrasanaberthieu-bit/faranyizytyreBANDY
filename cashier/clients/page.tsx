"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getClients } from "@/services/data-service"
import { Plus, Search, UserCircle, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const clients = getClients()
  const { toast } = useToast()

  const filteredClients = clients.filter(
    (client) =>
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telephone.includes(searchTerm) ||
      client.codeClient.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <ProtectedLayout allowedRoles={["cashier", "admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Clients</h1>
              <p className="text-muted-foreground mt-1">Gérer la base de clients</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-red hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Client
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Créer un Client</DialogTitle>
                <DialogDescription>Ajouter un nouveau client à la base</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Nom complet</Label>
                  <Input id="client-name" placeholder="Jean Dupont" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-phone">Téléphone</Label>
                  <Input id="client-phone" placeholder="+33612345678" className="bg-secondary border-border" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  className="bg-gradient-red hover:opacity-90"
                  onClick={() => {
                    toast({
                      title: "Client créé",
                      description: "Le nouveau client a été ajouté avec succès",
                    })
                    setIsDialogOpen(false)
                  }}
                >
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
