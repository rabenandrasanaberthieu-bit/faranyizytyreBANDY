"use client"

import { useState, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, FolderTree, Edit, Trash2, Package, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCategorie } from "@/hooks/useCategory"
import type { Categorie } from "@/types/type"
import type { CreateCategorieData, UpdateCategorieData } from "@/services/categoryService"

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Categorie | null>(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nom: "",
    description: ""
  })
  
  const { toast } = useToast()
  const { 
    categories, 
    loading, 
    error,
    getAllCategories, 
    createCategorie, 
    updateCategorie, 
    deleteCategorie,
    updateCategorieStatut
  } = useCategorie()

  useEffect(() => {
    getAllCategories()
  }, [getAllCategories])

  const filteredCategories = categories.filter((cat) => 
    cat.nom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDialogOpen = (category?: Categorie) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        nom: category.nom,
        description: category.description || ""
      })
    } else {
      setEditingCategory(null)
      setFormData({
        nom: "",
        description: ""
      })
    }
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingCategory(null)
    setFormData({
      nom: "",
      description: ""
    })
  }

  const handleSave = async () => {
    if (!formData.nom.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est requis",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingCategory) {
        await updateCategorie(editingCategory.idCategorie, formData as UpdateCategorieData)
        toast({
          title: "Catégorie modifiée",
          description: "La catégorie a été modifiée avec succès",
        })
      } else {
        await createCategorie(formData as CreateCategorieData)
        toast({
          title: "Catégorie créée",
          description: "La catégorie a été créée avec succès",
        })
      }
      handleDialogClose()
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  }

  const handleDelete = async () => {
    if (!deletingCategoryId) return

    try {
      await deleteCategorie(deletingCategoryId)
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès",
      })
      setDeletingCategoryId(null)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  }

  // Gérer le changement de statut
  const handleToggleStatut = async (category: Categorie) => {
    try {
      await updateCategorieStatut(category.idCategorie, !category.statut)
      toast({
        title: "Statut modifié",
        description: `La catégorie est maintenant ${!category.statut ? "active" : "inactive"}`,
      })
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  }

  // Animation variants pour framer-motion (si vous l'utilisez)
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  }

  return (
    <ProtectedLayout allowedRoles={["admin", "stock_manager"]}>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
              <FolderTree className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Catégories</h1>
              <p className="text-muted-foreground mt-1">Organiser les produits par catégorie</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-red hover:opacity-90 transition-all duration-200 hover:scale-105"
                onClick={() => handleDialogOpen()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Catégorie
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border animate-in fade-in-80 duration-300">
              <DialogHeader>
                <DialogTitle className="animate-in fade-in-50 duration-500">
                  {editingCategory ? "Modifier" : "Créer"} une Catégorie
                </DialogTitle>
                <DialogDescription className="animate-in fade-in-50 duration-500 delay-100">
                  {editingCategory
                    ? "Modifier les informations de la catégorie"
                    : "Ajouter une nouvelle catégorie de produits"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 animate-in fade-in-50 duration-500 delay-150">
                <div className="space-y-2">
                  <Label htmlFor="cat-name">Nom de la catégorie</Label>
                  <Input
                    id="cat-name"
                    placeholder="Ordinateurs Portables"
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    className="bg-secondary border-border transition-all duration-200 focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-description">Description</Label>
                  <Textarea
                    id="cat-description"
                    placeholder="Description de la catégorie..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-secondary border-border transition-all duration-200 focus:ring-2 focus:ring-red-500 min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter className="animate-in fade-in-50 duration-500 delay-200">
                <Button
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={loading}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Annuler
                </Button>
                <Button 
                  className="bg-gradient-red hover:opacity-90 transition-all duration-200 hover:scale-105"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingCategory ? "Modification..." : "Création..."}
                    </>
                  ) : (
                    editingCategory ? "Modifier" : "Créer"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Barre de recherche */}
        <Card className="border-border transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200" />
              <Input
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-border transition-all duration-200 focus:ring-2 focus:ring-red-500"
              />
            </div>
          </CardHeader>
        </Card>

        {/* Contenu principal avec loading state */}
        {loading && !categories.length ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-red-500" />
              <p className="text-muted-foreground">Chargement des catégories...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category : any, index : any) => (
              <Card 
                key={category.idCategorie} 
                className="border-border transition-all duration-300 hover:border-red-500/50 hover:shadow-lg group animate-in fade-in-50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-red/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-gradient-red/20 group-hover:scale-110">
                        <FolderTree className="w-6 h-6 text-red-500 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg transition-colors duration-300 group-hover:text-red-600">
                          {category.nom}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className="mt-1 text-muted-foreground border-muted-foreground transition-all duration-300 group-hover:border-red-500 group-hover:text-red-500"
                        >
                          <Package className="w-3 h-3 mr-1 transition-colors duration-300" />
                          {category._count?.produits || 0} produits
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 transition-colors duration-300 group-hover:text-foreground">
                    {category.description || "Aucune description"}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        category.statut 
                          ? "text-green-500 border-green-500 hover:bg-green-500/10" 
                          : "text-gray-500 border-gray-500 hover:bg-gray-500/10"
                      }`}
                      onClick={() => handleToggleStatut(category)}
                    >
                      {category.statut ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDialogOpen(category)}
                        className="transition-all duration-300 hover:scale-110 hover:bg-red-500/10"
                      >
                        <Edit className="h-4 w-4 transition-colors duration-300" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setDeletingCategoryId(category.idCategorie)}
                        className="transition-all duration-300 hover:scale-110 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 text-destructive transition-colors duration-300" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* État vide */}
        {!loading && filteredCategories.length === 0 && (
          <div className="text-center py-12 animate-in fade-in-50 duration-500">
            <FolderTree className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? "Aucune catégorie trouvée" : "Aucune catégorie"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? "Aucune catégorie ne correspond à votre recherche" 
                : "Commencez par créer votre première catégorie"
              }
            </p>
            {!searchTerm && (
              <Button 
                className="bg-gradient-red hover:opacity-90 transition-all duration-200 hover:scale-105"
                onClick={() => handleDialogOpen()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Créer une catégorie
              </Button>
            )}
          </div>
        )}

        {/* Dialog de suppression */}
        <AlertDialog open={!!deletingCategoryId} onOpenChange={() => setDeletingCategoryId(null)}>
          <AlertDialogContent className="bg-card border-border animate-in fade-in-80 duration-300">
            <AlertDialogHeader>
              <AlertDialogTitle className="animate-in fade-in-50 duration-500">
                Confirmer la suppression
              </AlertDialogTitle>
              <AlertDialogDescription className="animate-in fade-in-50 duration-500 delay-100">
                Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="animate-in fade-in-50 duration-500 delay-150">
              <AlertDialogCancel className="transition-all duration-200 hover:scale-105">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 transition-all duration-200 hover:scale-105"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Supprimer"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedLayout>
  )
}
