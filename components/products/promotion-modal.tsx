"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

interface PromotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export function PromotionModal({ open, onOpenChange, onSubmit, isLoading }: PromotionModalProps) {
  const [formData, setFormData] = useState({
    typePromotion: "POURCENTAGE",
    valeur: 0,
    dateDebut: new Date().toISOString().split("T")[0],
    dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })

  const handleSubmit = () => {
    onSubmit(formData)
    setFormData({
      typePromotion: "POURCENTAGE",
      valeur: 0,
      dateDebut: new Date().toISOString().split("T")[0],
      dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Créer une Promotion</DialogTitle>
          <DialogDescription>Ajouter une promotion pour ce produit</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de promotion</Label>
              <Select
                value={formData.typePromotion}
                onValueChange={(value) => setFormData({ ...formData, typePromotion: value })}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POURCENTAGE">Pourcentage (%)</SelectItem>
                  <SelectItem value="MONTANT">Montant fixe (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="valeur">Valeur</Label>
              <Input
                id="valeur"
                type="number"
                step="0.01"
                placeholder={formData.typePromotion === "POURCENTAGE" ? "10" : "50"}
                value={formData.valeur}
                onChange={(e) => setFormData({ ...formData, valeur: Number(e.target.value) })}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="debut" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date de début
              </Label>
              <Input
                id="debut"
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fin" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date de fin
              </Label>
              <Input
                id="fin"
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button className="bg-gradient-red hover:opacity-90" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Création..." : "Créer la promotion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
