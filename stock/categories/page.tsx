"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCategories, getProduits } from "@/services/data-service"
import { FolderTree } from "lucide-react"

export default function StockCategoriesPage() {
  const categories = getCategories()
  const produits = getProduits()

  const getProductCount = (categoryId: string) => {
    return produits.filter((p) => p.idCategorie === categoryId).length
  }

  return (
    <ProtectedLayout allowedRoles={["stock_manager"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-red rounded-lg flex items-center justify-center">
            <FolderTree className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Catégories</h1>
            <p className="text-muted-foreground mt-1">Consulter les catégories de produits</p>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <h3 className="text-lg font-semibold">Liste des Catégories</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Produits</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.idCategorie} className="border-border">
                    <TableCell className="font-medium">{category.nom}</TableCell>
                    <TableCell className="text-muted-foreground">{category.description || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getProductCount(category.idCategorie)} produits</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.statut ? "default" : "secondary"}>
                        {category.statut ? "Active" : "Inactive"}
                      </Badge>
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
