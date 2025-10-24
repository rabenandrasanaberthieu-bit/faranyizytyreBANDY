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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { Plus, Search, Package, Edit, Trash2, AlertTriangle, Grid3x3, List, Shield, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { useProduit } from "@/hooks/useProduct"
import { mockDataComplete } from "@/lib/mock-data-complete"
import { generateInventoryPDF } from "@/lib/pdf-generator"
import { ProductForm } from "@/components/products/product-form"
import { PromotionModal } from "@/components/products/promotion-modal"
import { FileDown, Download } from "lucide-react"

import type { Produit, CreateProduitData, UpdateProduitData } from "@/services/productService"
import { useCategorie } from "@/hooks/useCategory"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Produit | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [formData, setFormData] = useState<CreateProduitData>({
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
  })
  const [editFormData, setEditFormData] = useState<UpdateProduitData>({})
  const [deleteReason, setDeleteReason] = useState("")
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false)
  const [selectedProductForPromotion, setSelectedProductForPromotion] = useState<Produit | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all")
  const [promotionFilter, setPromotionFilter] = useState<"all" | "active" | "inactive">("all")

  const { toast } = useToast()
  const {
    produits,
    loading,
    error,
    meta,
    getAllProduits,
    getProduitById,
    createProduit,
    updateProduit,
    demandeSuppression,
  } = useProduit()

  const { categories, getAllCategories } = useCategorie()

  useEffect(() => {
    loadProduits()
    getAllCategories({ statut: true })
  }, [getAllCategories])

  const loadProduits = async (params?: any) => {
    try {
      await getAllProduits({
        page: 1,
        limit: 100,
        search: params?.search,
        idCategorie: params?.idCategorie,
        statut: "ACTIF",
      })
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    loadProduits({ search: value })
  }

  const getActivePromotion = (productId: string) => {
    const now = new Date()
    return mockDataComplete.promotions.find((p) => {
      const start = new Date(p.dateDebut)
      const end = new Date(p.dateFin)
      return p.statut === "ACTIVE" && now >= start && now <= end
    })
  }

  const getDiscountedPrice = (originalPrice: number, promotion: any) => {
    if (!promotion) return originalPrice
    if (promotion.typePromotion === "POURCENTAGE") {
      return originalPrice * (1 - promotion.valeur / 100)
    }
    return originalPrice - promotion.valeur
  }

  const handleCreateProduct = async (data: CreateProduitData) => {
    try {
      await createProduit(data)
      setIsDialogOpen(false)
      toast({
        title: "Produit créé",
        description: "Le nouveau produit a été ajouté avec succès",
      })
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du produit",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = async () => {
    if (!selectedProduct) return

    try {
      await updateProduit(selectedProduct.idProduit, editFormData)
      setIsEditDialogOpen(false)
      setSelectedProduct(null)
      setEditFormData({})
      toast({
        title: "Produit modifié",
        description: `${selectedProduct.nom} a été mis à jour avec succès`,
      })
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du produit",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRequest = async () => {
    if (!selectedProduct) return

    try {
      await demandeSuppression(selectedProduct.idProduit, deleteReason)
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
      setDeleteReason("")
      toast({
        title: "Demande de suppression envoyée",
        description: `${selectedProduct.nom} sera supprimé après validation`,
      })
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la demande de suppression",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    const csv = [
      ["Code", "Nom", "Catégorie", "Prix Achat", "Prix Vente", "Stock", "Garantie"],
      ...produits.map((p) => [
        p.codeProduit,
        p.nom,
        p.categorie?.nom || "",
        p.prixAchat,
        p.prixVente,
        p.stock.toString(),
        `${p.garantieMois} mois`,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `produits-${new Date().toISOString().split("T")[0]}.csv`
    a.click()

    toast({
      title: "Export réussi",
      description: "Les produits ont été exportés en CSV",
    })
  }

  const handleImport = () => {
    toast({
      title: "Import",
      description: "Fonctionnalité d'import en cours de développement",
    })
  }

  const handleExportPDF = async () => {
    try {
      const doc = await generateInventoryPDF(produits)
      doc.save(`inventaire-${new Date().toISOString().split("T")[0]}.pdf`)
      toast({
        title: "Export réussi",
        description: "L'inventaire a été exporté en PDF",
      })
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export PDF",
        variant: "destructive",
      })
    }
  }

  const handleCreatePromotion = async (promotionData: any) => {
    if (!selectedProductForPromotion) return
    try {
      // In a real app, this would call an API
      toast({
        title: "Promotion créée",
        description: "La promotion a été ajoutée avec succès",
      })
      setIsPromotionModalOpen(false)
      setSelectedProductForPromotion(null)
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la promotion",
        variant: "destructive",
      })
    }
  }

  const getFilteredProducts = () => {
    let filtered = produits.filter(
      (produit) =>
        (produit.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (produit.codeProduit?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false),
    )

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.idCategorie === categoryFilter)
    }

    if (stockFilter === "low") {
      filtered = filtered.filter((p) => p.stock <= p.seuilMin && p.stock > 0)
    } else if (stockFilter === "out") {
      filtered = filtered.filter((p) => p.stock === 0)
    }

    if (promotionFilter === "active") {
      filtered = filtered.filter((p) => getActivePromotion(p.idProduit))
    } else if (promotionFilter === "inactive") {
      filtered = filtered.filter((p) => !getActivePromotion(p.idProduit))
    }

    return filtered
  }

  const filteredProduits = getFilteredProducts()

  const columns: ColumnDef<Produit>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
          {row.original.image ? (
            <Image
              src={row.original.image || "/placeholder.svg"}
              alt={row.original.nom}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <Package className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "codeProduit",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("codeProduit")}</span>,
    },
    {
      accessorKey: "nom",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
      cell: ({ row }) => <span className="font-medium">{row.getValue("nom")}</span>,
    },
    {
      accessorKey: "idCategorie",
      header: "Catégorie",
      cell: ({ row }) => {
        const categorie = categories.find((c) => c.idCategorie === row.getValue("idCategorie"))
        return <span className="text-muted-foreground">{categorie?.nom || row.original.categorie?.nom}</span>
      },
    },
    {
      accessorKey: "prixVente",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Prix" />,
      cell: ({ row }) => {
        const promotion = getActivePromotion(row.original.idProduit)
        const discountedPrice = promotion
          ? getDiscountedPrice(row.original.prixVente, promotion)
          : row.original.prixVente

        return (
          <div className="flex items-center gap-2">
            {promotion && <span className="line-through text-muted-foreground text-sm">{row.original.prixVente}€</span>}
            <span className={`font-semibold ${promotion ? "text-green-600" : "text-gradient-red"}`}>
              {discountedPrice.toFixed(2)}€
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number
        const seuilMin = row.original.seuilMin
        return (
          <div className="flex items-center gap-2">
            <span className={stock <= seuilMin ? "text-yellow-500 font-semibold" : ""}>{stock}</span>
            {stock <= seuilMin && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
          </div>
        )
      },
    },
    {
      accessorKey: "garantieMois",
      header: "Garantie",
      cell: ({ row }) => {
        const garantie = row.getValue("garantieMois") as number
        return garantie > 0 ? (
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">{garantie}m</span>
          </div>
        ) : null
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedProduct(row.original)
              setEditFormData({
                codeProduit: row.original.codeProduit,
                nom: row.original.nom,
                description: row.original.description,
                image: row.original.image,
                prixAchat: row.original.prixAchat,
                prixMin: row.original.prixMin,
                prixVente: row.original.prixVente,
                stock: row.original.stock,
                seuilMin: row.original.seuilMin,
                garantieMois: row.original.garantieMois,
                idCategorie: row.original.idCategorie,
              })
              setIsEditDialogOpen(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedProduct(row.original)
              setIsDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedProductForPromotion(row.original)
              setIsPromotionModalOpen(true)
            }}
          >
            <Zap className="h-4 w-4 text-green-500" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <ProtectedLayout allowedRoles={["admin", "stock_manager"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-red rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Produits</h1>
              <p className="text-muted-foreground mt-1">Gérer l'inventaire des produits</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-red hover:opacity-90 shadow-lg shadow-red-500/20">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Produit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un Produit</DialogTitle>
                <DialogDescription>Ajouter un nouveau produit à l'inventaire</DialogDescription>
              </DialogHeader>
              <ProductForm categories={categories} onSubmit={handleCreateProduct} isLoading={loading} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-gradient-red hover:opacity-90" onClick={handleCreateProduct} disabled={loading}>
                  {loading ? "Création..." : "Créer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader className="border-b border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou code..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className={viewMode === "table" ? "bg-gradient-red" : ""}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Table
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-gradient-red" : ""}
                  >
                    <Grid3x3 className="h-4 w-4 mr-2" />
                    Grille
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.idCategorie} value={cat.idCategorie}>
                        {cat.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={stockFilter} onValueChange={(value: any) => setStockFilter(value)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="État du stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les stocks</SelectItem>
                    <SelectItem value="low">Stock faible</SelectItem>
                    <SelectItem value="out">Rupture de stock</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={promotionFilter} onValueChange={(value: any) => setPromotionFilter(value)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Promotions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les promotions</SelectItem>
                    <SelectItem value="active">Promotions actives</SelectItem>
                    <SelectItem value="inactive">Sans promotion</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport} className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportPDF} className="flex-1 bg-transparent">
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              </div>
            ) : viewMode === "table" ? (
              <DataTable
                columns={columns}
                data={filteredProduits}
                searchKey="nom"
                searchPlaceholder="Rechercher un produit..."
                onExport={handleExport}
                onImport={handleImport}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProduits.map((produit) => {
                  const promotion = getActivePromotion(produit.idProduit)
                  const discountedPrice = promotion
                    ? getDiscountedPrice(produit.prixVente, promotion)
                    : produit.prixVente
                  const isLowStock = produit.stock <= produit.seuilMin

                  return (
                    <Card
                      key={produit.idProduit}
                      className="border-border hover:border-red-500/50 transition-all group relative"
                    >
                      {/* Promotion Badge */}
                      {promotion && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                            <Zap className="h-3 w-3" />-{promotion.valeur}
                            {promotion.typePromotion === "POURCENTAGE" ? "%" : "€"}
                          </Badge>
                        </div>
                      )}

                      {/* Low Stock Badge */}
                      {isLowStock && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Stock faible
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        <div className="aspect-square rounded-lg overflow-hidden bg-secondary mb-3">
                          {produit.image ? (
                            <Image
                              src={produit.image || "/placeholder.svg"}
                              alt={produit.nom}
                              width={300}
                              height={300}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-16 h-16 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground line-clamp-1">{produit.nom}</h3>
                            <p className="text-sm text-muted-foreground font-mono">{produit.codeProduit}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{produit.description}</p>

                        {/* Badges Row */}
                        <div className="flex flex-wrap gap-2">
                          {produit.garantieMois > 0 && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {produit.garantieMois}m
                            </Badge>
                          )}
                          {produit.categorie && <Badge variant="outline">{produit.categorie.nom}</Badge>}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div>
                            {promotion && (
                              <span className="line-through text-muted-foreground text-sm">{produit.prixVente}€</span>
                            )}
                            <div className={`text-2xl font-bold ${promotion ? "text-green-600" : "text-gradient-red"}`}>
                              {discountedPrice.toFixed(2)}€
                            </div>
                          </div>
                          <Badge variant={isLowStock ? "destructive" : "secondary"} className="font-semibold">
                            Stock: {produit.stock}
                          </Badge>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent hover:bg-secondary"
                            onClick={() => {
                              setSelectedProduct(produit)
                              setEditFormData({
                                codeProduit: produit.codeProduit,
                                nom: produit.nom,
                                description: produit.description,
                                image: produit.image,
                                prixAchat: produit.prixAchat,
                                prixMin: produit.prixMin,
                                prixVente: produit.prixVente,
                                stock: produit.stock,
                                seuilMin: produit.seuilMin,
                                garantieMois: produit.garantieMois,
                                idCategorie: produit.idCategorie,
                              })
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-destructive/10 bg-transparent"
                            onClick={() => {
                              setSelectedProduct(produit)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-green-500/10 bg-transparent"
                            onClick={() => {
                              setSelectedProductForPromotion(produit)
                              setIsPromotionModalOpen(true)
                            }}
                          >
                            <Zap className="h-4 w-4 text-green-500" />
                            Promotion
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le Produit</DialogTitle>
              <DialogDescription>Mettre à jour les informations du produit</DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Code produit</Label>
                  <Input
                    id="edit-code"
                    value={editFormData.codeProduit || selectedProduct.codeProduit}
                    onChange={(e) => setEditFormData({ ...editFormData, codeProduit: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Catégorie</Label>
                  <Select
                    value={editFormData.idCategorie || selectedProduct.idCategorie}
                    onValueChange={(value) => setEditFormData({ ...editFormData, idCategorie: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.idCategorie} value={cat.idCategorie}>
                          {cat.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-name">Nom du produit</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.nom || selectedProduct.nom}
                    onChange={(e) => setEditFormData({ ...editFormData, nom: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editFormData.description || selectedProduct.description || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-prix-achat">Prix d'achat</Label>
                  <Input
                    id="edit-prix-achat"
                    type="number"
                    value={editFormData.prixAchat || selectedProduct.prixAchat}
                    onChange={(e) => setEditFormData({ ...editFormData, prixAchat: Number(e.target.value) })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-prix-min">Prix minimum</Label>
                  <Input
                    id="edit-prix-min"
                    type="number"
                    value={editFormData.prixMin || selectedProduct.prixMin}
                    onChange={(e) => setEditFormData({ ...editFormData, prixMin: Number(e.target.value) })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-prix-vente">Prix de vente</Label>
                  <Input
                    id="edit-prix-vente"
                    type="number"
                    value={editFormData.prixVente || selectedProduct.prixVente}
                    onChange={(e) => setEditFormData({ ...editFormData, prixVente: Number(e.target.value) })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editFormData.stock || selectedProduct.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: Number(e.target.value) })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-seuil">Seuil minimum</Label>
                  <Input
                    id="edit-seuil"
                    type="number"
                    value={editFormData.seuilMin || selectedProduct.seuilMin}
                    onChange={(e) => setEditFormData({ ...editFormData, seuilMin: Number(e.target.value) })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-garantie">Garantie (mois)</Label>
                  <Input
                    id="edit-garantie"
                    type="number"
                    value={editFormData.garantieMois || selectedProduct.garantieMois}
                    onChange={(e) => setEditFormData({ ...editFormData, garantieMois: Number(e.target.value) })}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-gradient-red hover:opacity-90" onClick={handleEditProduct} disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Demander la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir demander la suppression du produit "{selectedProduct?.nom}" ? Cette demande
                devra être validée par un administrateur.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delete-reason">Raison de la suppression</Label>
                <Textarea
                  id="delete-reason"
                  placeholder="Expliquez la raison de la suppression..."
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteRequest} disabled={!deleteReason.trim() || loading}>
                {loading ? "Envoi..." : "Demander la suppression"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Promotion Modal */}
        <PromotionModal
          open={isPromotionModalOpen}
          onOpenChange={setIsPromotionModalOpen}
          onSubmit={handleCreatePromotion}
          isLoading={loading}
          selectedProduct={selectedProductForPromotion}
        />
      </div>
    </ProtectedLayout>
  )
}
