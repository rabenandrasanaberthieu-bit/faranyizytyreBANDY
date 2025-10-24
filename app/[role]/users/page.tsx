"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getUsers } from "@/services/data-service"
import { Plus, Search, Edit, Lock, Unlock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const users = getUsers()
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-red text-white"
      case "stock_manager":
        return "bg-blue-500 text-white"
      case "cashier":
        return "bg-green-500 text-white"
      default:
        return "bg-secondary"
    }
  }

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    toast({
      title: currentStatus ? "Utilisateur désactivé" : "Utilisateur activé",
      description: "Le statut de l'utilisateur a été mis à jour avec succès",
    })
  }

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground mt-1">Gérer les comptes et les rôles</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-red hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Nouvel Utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Créer un Utilisateur</DialogTitle>
                <DialogDescription>Ajouter un nouveau compte utilisateur au système</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input id="username" placeholder="johndoe" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input id="password" type="password" placeholder="••••••••" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="stock_manager">Responsable Stock</SelectItem>
                      <SelectItem value="cashier">Caissier</SelectItem>
                    </SelectContent>
                  </Select>
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
                      title: "Utilisateur créé",
                      description: "Le nouvel utilisateur a été ajouté avec succès",
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
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière Connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-border">
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role === "admin" && "Admin"}
                        {user.role === "stock_manager" && "Stock"}
                        {user.role === "cashier" && "Caissier"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("fr-FR") : "Jamais"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(user.id, user.isActive)}>
                          {user.isActive ? (
                            <Lock className="h-4 w-4 text-destructive" />
                          ) : (
                            <Unlock className="h-4 w-4 text-green-500" />
                          )}
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
