"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getProduits, getCategories } from "@/services/data-service"
import { Search, Package, AlertTriangle } from "lucide-react"

export default function StockProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const produits = getProduits()
  const categories = getCategories()

  const filteredProduits = produits.filter(
    (produit) =>
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produit.codeProduit.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <ProtectedLayout allowedRoles={["stock_manager"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Produits</h1>
            <p className="text-muted-foreground mt-1">Consulter l'inventaire des produits</p>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou code..."
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
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix Vente</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Seuil Min</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProduits.map((produit) => (
                  <TableRow key={produit.idProduit} className="border-border">
                    <TableCell className="font-mono text-sm">{produit.codeProduit}</TableCell>
                    <TableCell className="font-medium">{produit.nom}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {categories.find((c) => c.idCategorie === produit.idCategorie)?.nom}
                    </TableCell>
                    <TableCell className="text-gradient-red font-semibold">{produit.prixVente} €</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={produit.stock <= produit.seuilMin ? "text-yellow-500 font-semibold" : ""}>
                          {produit.stock}
                        </span>
                        {produit.stock <= produit.seuilMin && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{produit.seuilMin}</TableCell>
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
