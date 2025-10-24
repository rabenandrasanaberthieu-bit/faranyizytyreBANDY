"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import type { Categorie } from "@/services/categoryService"

interface ProductFormProps {
  categories?: Categorie[]
  onSubmit: (data: any) => void
  initialData?: any
  isLoading?: boolean
}

export function ProductForm({ categories = [], onSubmit, initialData, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      codeProduit: "",
      nom: "",
      description: "",
      image: "",
      prixAchat: 0,
      prixMin: 0,
      prixVente: 0,
      stock: 0,
      seuilMin: 0,
      garantieMois: 0,
      idCategorie: "",
    },
  )
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || "")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setImagePreview(base64)
        setFormData({ ...formData, image: base64 })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Image du produit</Label>
        <div className="relative">
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-secondary">
              <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview("")
                  setFormData({ ...formData, image: "" })
                }}
                className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full hover:bg-destructive/90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Cliquez pour télécharger</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Code produit</Label>
          <Input
            id="code"
            placeholder="LAP001"
            value={formData.codeProduit}
            onChange={(e) => setFormData({ ...formData, codeProduit: e.target.value })}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select
            value={formData.idCategorie}
            onValueChange={(value) => setFormData({ ...formData, idCategorie: value })}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {(categories || []).map((cat) => (
                <SelectItem key={cat.idCategorie} value={cat.idCategorie}>
                  {cat.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom du produit</Label>
        <Input
          id="name"
          placeholder="Dell XPS 15"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          className="bg-secondary border-border"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description détaillée du produit..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-secondary border-border"
          rows={4}
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prix-achat">Prix d'achat (€)</Label>
          <Input
            id="prix-achat"
            type="number"
            step="0.01"
            placeholder="1200.00"
            value={formData.prixAchat}
            onChange={(e) => setFormData({ ...formData, prixAchat: Number(e.target.value) })}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prix-min">Prix minimum (€)</Label>
          <Input
            id="prix-min"
            type="number"
            step="0.01"
            placeholder="1300.00"
            value={formData.prixMin}
            onChange={(e) => setFormData({ ...formData, prixMin: Number(e.target.value) })}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prix-vente">Prix de vente (€)</Label>
          <Input
            id="prix-vente"
            type="number"
            step="0.01"
            placeholder="1599.99"
            value={formData.prixVente}
            onChange={(e) => setFormData({ ...formData, prixVente: Number(e.target.value) })}
            className="bg-secondary border-border"
          />
        </div>
      </div>

      {/* Stock */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock initial</Label>
          <Input
            id="stock"
            type="number"
            placeholder="15"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seuil">Seuil minimum</Label>
          <Input
            id="seuil"
            type="number"
            placeholder="5"
            value={formData.seuilMin}
            onChange={(e) => setFormData({ ...formData, seuilMin: Number(e.target.value) })}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="garantie">Garantie (mois)</Label>
          <Input
            id="garantie"
            type="number"
            placeholder="24"
            value={formData.garantieMois}
            onChange={(e) => setFormData({ ...formData, garantieMois: Number(e.target.value) })}
            className="bg-secondary border-border"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full bg-gradient-red hover:opacity-90">
        {isLoading ? "Enregistrement..." : "Enregistrer le produit"}
      </Button>
    </form>
  )
}
