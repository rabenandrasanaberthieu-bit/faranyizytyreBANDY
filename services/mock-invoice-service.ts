import { mockDataComplete } from "@/lib/mock-data-complete"

export interface Invoice {
  idFacture: string
  numeroFacture: string
  idVente: string
  dateFacture: string
  montantTotal: number
  montantPaye: number
  statut: "GENEREE" | "ENVOYEE" | "PAYEE" | "ANNULEE"
  dateEcheance: string
  dateCreation: string
}

export interface CreateInvoiceData {
  idVente: string
  montantTotal: number
  dateEcheance: string
}

export const mockInvoiceService = {
  async getAll(params?: any) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let invoices = [...mockDataComplete.factures]

    if (params?.statut) {
      invoices = invoices.filter((i) => i.statut === params.statut)
    }

    if (params?.idVente) {
      invoices = invoices.filter((i) => i.idVente === params.idVente)
    }

    return {
      data: invoices,
      meta: { total: invoices.length, page: 1, limit: 100 },
    }
  },

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const invoice = mockDataComplete.factures.find((i) => i.idFacture === id)
    if (!invoice) throw new Error("Invoice not found")
    return invoice
  },

  async create(data: CreateInvoiceData) {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const numeroFacture = `F-${new Date().getFullYear()}-${String(mockDataComplete.factures.length + 1).padStart(6, "0")}`

    const newInvoice: Invoice = {
      idFacture: `facture-${Date.now()}`,
      numeroFacture,
      idVente: data.idVente,
      dateFacture: new Date().toISOString(),
      montantTotal: data.montantTotal,
      montantPaye: 0,
      statut: "GENEREE",
      dateEcheance: data.dateEcheance,
      dateCreation: new Date().toISOString(),
    }

    mockDataComplete.factures.push(newInvoice)
    return newInvoice
  },

  async updateStatus(id: string, statut: string) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const invoice = mockDataComplete.factures.find((i) => i.idFacture === id)
    if (!invoice) throw new Error("Invoice not found")
    invoice.statut = statut as any
    return invoice
  },

  async generatePDF(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const invoice = mockDataComplete.factures.find((i) => i.idFacture === id)
    if (!invoice) throw new Error("Invoice not found")

    return {
      filename: `facture-${invoice.numeroFacture}.pdf`,
      content: `Facture ${invoice.numeroFacture}`,
    }
  },

  async sendEmail(id: string, email: string) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return { success: true, message: `Email sent to ${email}` }
  },
}
