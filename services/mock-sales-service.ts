import { mockDataComplete } from "@/lib/mock-data-complete"
import { mockInvoiceService } from "./mock-invoice-service"
import { mockPaymentService } from "./mock-payment-service"
import { mockWarrantyService } from "./mock-warranty-service"
import { mockAuditService } from "./mock-audit-service"

export interface SaleLineItem {
  idProduit: string
  quantite: number
  prixUnitaire: number
  remise: number
  sousTotal: number
}

export interface CreateSaleData {
  idClient: string
  idUser: string
  lignes: SaleLineItem[]
  remiseGlobale: number
  modePaiement: string
}

export interface Sale {
  idVente: string
  numeroVente: string
  idClient: string
  idUser: string
  dateVente: string
  totalBrut: number
  remise: number
  totalNet: number
  statut: "COMMANDE" | "VALIDEE" | "ANNULEE" | "RETOURNEE"
  lignes: any[]
  client?: any
  user?: any
}

export const mockSalesService = {
  async getAll(params?: any) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let sales = [...mockDataComplete.ventes]

    if (params?.statut) {
      sales = sales.filter((s) => s.statut === params.statut)
    }

    if (params?.idClient) {
      sales = sales.filter((s) => s.idClient === params.idClient)
    }

    if (params?.dateDebut && params?.dateFin) {
      sales = sales.filter((s) => {
        const sDate = new Date(s.dateVente)
        return sDate >= new Date(params.dateDebut) && sDate <= new Date(params.dateFin)
      })
    }

    // Sort by date descending
    sales.sort((a, b) => new Date(b.dateVente).getTime() - new Date(a.dateVente).getTime())

    return {
      data: sales,
      meta: { total: sales.length, page: 1, limit: 100 },
    }
  },

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const sale = mockDataComplete.ventes.find((s) => s.idVente === id)
    if (!sale) throw new Error("Sale not found")
    return sale
  },

  async create(data: CreateSaleData) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    for (const ligne of data.lignes) {
      const produit = mockDataComplete.produits.find((p) => p.idProduit === ligne.idProduit)
      if (!produit || produit.stock < ligne.quantite) {
        throw new Error(`Stock insuffisant pour ${produit?.nom}`)
      }
    }

    // Calculate totals
    const totalBrut = data.lignes.reduce((sum, ligne) => sum + ligne.sousTotal, 0)
    const totalNet = totalBrut - data.remiseGlobale

    // Generate sale number
    const numeroVente = `V-${new Date().getFullYear()}-${String(mockDataComplete.ventes.length + 1).padStart(6, "0")}`

    const newSale: Sale = {
      idVente: `vente-${Date.now()}`,
      numeroVente,
      idClient: data.idClient,
      idUser: data.idUser,
      dateVente: new Date().toISOString(),
      totalBrut,
      remise: data.remiseGlobale,
      totalNet,
      statut: "VALIDEE",
      lignes: data.lignes.map((ligne) => ({
        idLigneVente: `ligne-${Date.now()}-${Math.random()}`,
        ...ligne,
        produit: mockDataComplete.produits.find((p) => p.idProduit === ligne.idProduit),
      })),
      client: mockDataComplete.clients.find((c) => c.idClient === data.idClient),
      user: mockDataComplete.users.find((u) => u.id === data.idUser),
    }

    mockDataComplete.ventes.push(newSale)

    const dateEcheance = new Date()
    dateEcheance.setDate(dateEcheance.getDate() + 30)
    await mockInvoiceService.create({
      idVente: newSale.idVente,
      montantTotal: totalNet,
      dateEcheance: dateEcheance.toISOString(),
    })

    await mockPaymentService.create({
      idVente: newSale.idVente,
      montant: totalNet,
      modePaiement: data.modePaiement,
    })

    for (const ligne of data.lignes) {
      const produit = mockDataComplete.produits.find((p) => p.idProduit === ligne.idProduit)
      if (produit && produit.garantieMois > 0) {
        await mockWarrantyService.create({
          idVente: newSale.idVente,
          idProduit: ligne.idProduit,
          dateDebut: new Date().toISOString(),
          dureeGarantieMois: produit.garantieMois,
          description: `Garantie constructeur ${produit.garantieMois} mois`,
        })
      }
    }

    for (const ligne of data.lignes) {
      mockDataComplete.mouvementsStock.push({
        idMouvement: `mouv-${Date.now()}-${Math.random()}`,
        idProduit: ligne.idProduit,
        idUser: data.idUser,
        typeMouvement: "SORTIE",
        quantite: ligne.quantite,
        motif: `Vente ${numeroVente}`,
        dateMouvement: new Date().toISOString(),
        produit: mockDataComplete.produits.find((p) => p.idProduit === ligne.idProduit),
        user: mockDataComplete.users.find((u) => u.id === data.idUser),
      })

      // Update product stock
      const produit = mockDataComplete.produits.find((p) => p.idProduit === ligne.idProduit)
      if (produit) {
        produit.stock -= ligne.quantite
      }
    }

    await mockAuditService.log(data.idUser, "CREATE_SALE", "Vente", newSale.idVente, null, {
      numeroVente,
      totalNet,
      client: newSale.client?.nom,
    })

    return newSale
  },

  async updateStatus(id: string, statut: string) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const sale = mockDataComplete.ventes.find((s) => s.idVente === id)
    if (!sale) throw new Error("Sale not found")
    sale.statut = statut as any
    return sale
  },

  async getDashboardStats() {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const salesThisMonth = mockDataComplete.ventes.filter((s) => {
      const sDate = new Date(s.dateVente)
      return sDate.getMonth() === today.getMonth() && sDate.getFullYear() === today.getFullYear()
    })

    const salesToday = mockDataComplete.ventes.filter((s) => {
      const sDate = new Date(s.dateVente)
      sDate.setHours(0, 0, 0, 0)
      return sDate.getTime() === today.getTime()
    })

    const totalSalesMonth = salesThisMonth.reduce((sum, s) => sum + s.totalNet, 0)
    const totalSalesToday = salesToday.reduce((sum, s) => sum + s.totalNet, 0)
    const averageBasket = salesToday.length > 0 ? totalSalesToday / salesToday.length : 0

    return {
      totalSalesMonth,
      totalSalesToday,
      averageBasket,
      salesCountMonth: salesThisMonth.length,
      salesCountToday: salesToday.length,
    }
  },

  async getTopProducts(limit = 5) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const productSales: Record<string, { product: any; quantity: number; revenue: number }> = {}

    mockDataComplete.ventes.forEach((sale) => {
      sale.lignes.forEach((ligne: any) => {
        if (!productSales[ligne.idProduit]) {
          productSales[ligne.idProduit] = {
            product: ligne.produit,
            quantity: 0,
            revenue: 0,
          }
        }
        productSales[ligne.idProduit].quantity += ligne.quantite
        productSales[ligne.idProduit].revenue += ligne.sousTotal
      })
    })

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)
  },

  async getTopClients(limit = 5) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const clientSales: Record<string, { client: any; totalSpent: number; purchaseCount: number }> = {}

    mockDataComplete.ventes.forEach((sale) => {
      if (!clientSales[sale.idClient]) {
        clientSales[sale.idClient] = {
          client: sale.client,
          totalSpent: 0,
          purchaseCount: 0,
        }
      }
      clientSales[sale.idClient].totalSpent += sale.totalNet
      clientSales[sale.idClient].purchaseCount += 1
    })

    return Object.values(clientSales)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit)
  },
}
