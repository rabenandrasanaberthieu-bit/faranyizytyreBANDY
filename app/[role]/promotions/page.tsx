"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getPromotions } from "@/services/data-service"
import { Plus, Search, Tag, Edit, Trash2, Calendar, Percent } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Promotion } from "@/types/type"

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [deletingPromotionId, setDeletingPromotionId] = useState<string | null>(null)
  const promotions = getPromotions()
  const { toast } = useToast()

  const isPromotionActive = (dateDebut: string, dateFin: string) => {
    const now = new Date()
    const start = new Date(dateDebut)
    const end = new Date(dateFin)
    return now >= start && now <= end
  }

  const filteredPromotions = promotions.filter(
    (promo) =>
      (promo.nom ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (promo.codePromotion ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setIsDialogOpen(true)
  }

  const handleDelete = (promotionId: string) => {
    toast({
      title: "Promotion supprimée",
      description: "La promotion a été supprimée avec succès",
    })
    setDeletingPromotionId(null)
  }

  const handleSave = () => {
    toast({
      title: editingPromotion ? "Promotion modifiée" : "Promotion créée",
      description: `La promotion a été ${editingPromotion ? "modifiée" : "créée"} avec succès`,
    })
    setIsDialogOpen(false)
    setEditingPromotion(null)
  }

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Promotions</h1>
              <p className="text-muted-foreground mt-1">Gérer les offres et réductions</p>
            </div>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) setEditingPromotion(null)
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-red hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>{editingPromotion ? "Modifier" : "Créer"} une Promotion</DialogTitle>
                <DialogDescription>
                  {editingPromotion
                    ? "Modifier les informations de la promotion"
                    : "Ajouter une nouvelle offre promotionnelle"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="promo-name">Nom de la promotion</Label>
                  <Input
                    id="promo-name"
                    placeholder="Soldes d'été"
                    defaultValue={editingPromotion?.nom}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo-code">Code promo</Label>
                  <Input
                    id="promo-code"
                    placeholder="SUMMER2025"
                    defaultValue={editingPromotion?.codePromotion}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="promo-type">Type</Label>
                    <Select defaultValue={editingPromotion?.typePromo}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="POURCENTAGE">Pourcentage</SelectItem>
                        <SelectItem value="MONTANT">Montant fixe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promo-value">Valeur</Label>
                    <Input
                      id="promo-value"
                      type="number"
                      placeholder="10"
                      defaultValue={editingPromotion?.valeur}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-debut">Date début</Label>
                    <Input
                      id="date-debut"
                      type="date"
                      defaultValue={editingPromotion?.dateDebut.split("T")[0]}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-fin">Date fin</Label>
                    <Input
                      id="date-fin"
                      type="date"
                      defaultValue={editingPromotion?.dateFin.split("T")[0]}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingPromotion(null)
                  }}
                >
                  Annuler
                </Button>
                <Button className="bg-gradient-red hover:opacity-90" onClick={handleSave}>
                  {editingPromotion ? "Modifier" : "Créer"}
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
                placeholder="Rechercher une promotion..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </CardHeader>
        </Card>

        {filteredPromotions.length === 0 ? (
          <Card className="border-border">
            <CardContent className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Aucune promotion</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Créez votre première promotion pour attirer plus de clients
              </p>
              <Button className="bg-gradient-red hover:opacity-90" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer une promotion
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPromotions.map((promo) => {
              const isActive = isPromotionActive(promo.dateDebut, promo.dateFin)
              return (
                <Card
                  key={promo.idPromotion}
                  className={`border-border hover:border-red-500/50 transition-colors ${isActive ? "bg-gradient-to-br from-red-500/5 to-transparent" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${isActive ? "bg-gradient-red" : "bg-gray-500"}`}
                        >
                          <Percent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{promo.nom}</h3>
                          <Badge variant="outline" className="mt-1 font-mono text-xs border-muted-foreground">
                            {promo.codePromotion}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Réduction</span>
                        <span className="text-2xl font-bold text-gradient-red">
                          {promo.typePromo === "POURCENTAGE" ? `${promo.valeur}%` : `${promo.valeur}€`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(promo.dateDebut).toLocaleDateString("fr-FR")} -{" "}
                          {new Date(promo.dateFin).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Badge
                          variant="outline"
                          className={isActive ? "text-green-500 border-green-500" : "text-gray-500 border-gray-500"}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(promo)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeletingPromotionId(promo.idPromotion)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <AlertDialog open={!!deletingPromotionId} onOpenChange={() => setDeletingPromotionId(null)}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette promotion ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => deletingPromotionId && handleDelete(deletingPromotionId)}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedLayout>
  )
}
