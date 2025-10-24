"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { getProduits, getClients } from "@/services/data-service"
import { ShoppingCart, Plus, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface CartItem {
  idProduit: string
  nom: string
  prixUnitaire: number
  quantite: number
  remise: number
  sousTotal: number
}

export default function NewSalePage() {
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedProduit, setSelectedProduit] = useState("")
  const [quantite, setQuantite] = useState(1)
  const [remise, setRemise] = useState(0)
  const [cart, setCart] = useState<CartItem[]>([])
  const [modePaiement, setModePaiement] = useState("")

  const produits = getProduits()
  const clients = getClients()
  const { toast } = useToast()
  const router = useRouter()

  const clientOptions: ComboboxOption[] = clients.map((client) => ({
    value: client.idClient,
    label: client.nom,
    subtitle: client.telephone,
  }))

  const produitOptions: ComboboxOption[] = produits.map((produit) => ({
    value: produit.idProduit,
    label: produit.nom,
    subtitle: `${produit.prixVente}€ - Stock: ${produit.stock}`,
  }))

  const addToCart = () => {
    if (!selectedProduit) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit",
        variant: "destructive",
      })
      return
    }

    const produit = produits.find((p) => p.idProduit === selectedProduit)
    if (!produit) return

    if (quantite > produit.stock) {
      toast({
        title: "Stock insuffisant",
        description: `Seulement ${produit.stock} unités disponibles`,
        variant: "destructive",
      })
      return
    }

    const prixUnitaire = Number.parseFloat(produit.prixVente)
    const remiseMontant = (prixUnitaire * quantite * remise) / 100
    const sousTotal = prixUnitaire * quantite - remiseMontant

    const newItem: CartItem = {
      idProduit: produit.idProduit,
      nom: produit.nom,
      prixUnitaire,
      quantite,
      remise,
      sousTotal,
    }

    setCart([...cart, newItem])
    setSelectedProduit("")
    setQuantite(1)
    setRemise(0)

    toast({
      title: "Produit ajouté",
      description: `${produit.nom} a été ajouté au panier`,
    })
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
    toast({
      title: "Produit retiré",
      description: "Le produit a été retiré du panier",
    })
  }

  const totalBrut = cart.reduce((sum, item) => sum + item.prixUnitaire * item.quantite, 0)
  const totalRemise = cart.reduce((sum, item) => sum + (item.prixUnitaire * item.quantite * item.remise) / 100, 0)
  const totalNet = totalBrut - totalRemise

  const handleSave = () => {
    if (!selectedClient) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client",
        variant: "destructive",
      })
      return
    }

    if (cart.length === 0) {
      toast({
        title: "Erreur",
        description: "Le panier est vide",
        variant: "destructive",
      })
      return
    }

    if (!modePaiement) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un mode de paiement",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Vente créée",
      description: "La vente a été enregistrée avec succès",
    })

    router.push("/cashier/sales")
  }

  return (
    <ProtectedLayout allowedRoles={["cashier"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-red rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <ShoppingCart className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nouvelle Vente</h1>
            <p className="text-muted-foreground mt-1">Créer une nouvelle transaction</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Client Selection */}
            <Card className="border-border shadow-xl">
              <CardHeader className="border-b border-border">
                <CardTitle>Informations Client</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Combobox
                    options={clientOptions}
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                    placeholder="Sélectionner un client"
                    searchPlaceholder="Rechercher un client..."
                    emptyText="Aucun client trouvé."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card className="border-border shadow-xl">
              <CardHeader className="border-b border-border">
                <CardTitle>Ajouter des Produits</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="produit">Produit</Label>
                    <Combobox
                      options={produitOptions}
                      value={selectedProduit}
                      onValueChange={setSelectedProduit}
                      placeholder="Sélectionner un produit"
                      searchPlaceholder="Rechercher un produit..."
                      emptyText="Aucun produit trouvé."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantite">Quantité</Label>
                    <Input
                      id="quantite"
                      type="number"
                      min="1"
                      value={quantite}
                      onChange={(e) => setQuantite(Number.parseInt(e.target.value) || 1)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remise">Remise (%)</Label>
                    <Input
                      id="remise"
                      type="number"
                      min="0"
                      max="100"
                      value={remise}
                      onChange={(e) => setRemise(Number.parseFloat(e.target.value) || 0)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <Button
                  onClick={addToCart}
                  className="w-full bg-gradient-red hover:opacity-90 shadow-lg shadow-red-500/20"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter au Panier
                </Button>
              </CardContent>
            </Card>

            {/* Cart */}
            <Card className="border-border shadow-xl">
              <CardHeader className="border-b border-border">
                <CardTitle>
                  Panier ({cart.length} article{cart.length !== 1 ? "s" : ""})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Le panier est vide</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead>Produit</TableHead>
                          <TableHead>Prix</TableHead>
                          <TableHead>Qté</TableHead>
                          <TableHead>Remise</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.map((item, index) => (
                          <TableRow key={index} className="border-border">
                            <TableCell className="font-medium">{item.nom}</TableCell>
                            <TableCell>{item.prixUnitaire.toFixed(2)}€</TableCell>
                            <TableCell>{item.quantite}</TableCell>
                            <TableCell className="text-yellow-500">{item.remise}%</TableCell>
                            <TableCell className="font-semibold text-gradient-red">
                              {item.sousTotal.toFixed(2)}€
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => removeFromCart(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="border-border shadow-xl sticky top-6">
              <CardHeader className="border-b border-border">
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Brut</span>
                    <span className="font-medium">{totalBrut.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remise Totale</span>
                    <span className="font-medium text-yellow-500">-{totalRemise.toFixed(2)}€</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Net</span>
                      <span className="text-3xl font-bold text-gradient-red">{totalNet.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xl">
              <CardHeader className="border-b border-border">
                <CardTitle>Paiement</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mode-paiement">Mode de paiement</Label>
                  <Select value={modePaiement} onValueChange={setModePaiement}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ESPECES">Espèces</SelectItem>
                      <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                      <SelectItem value="CARTE">Carte Bancaire</SelectItem>
                      <SelectItem value="VIREMENT">Virement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSave}
                  className="w-full bg-gradient-red hover:opacity-90 shadow-lg shadow-red-500/20"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer la Vente
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
