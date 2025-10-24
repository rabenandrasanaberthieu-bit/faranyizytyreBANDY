import { mockDataComplete } from "@/lib/mock-data-complete"

export interface Payment {
  idPaiement: string
  idVente: string
  montant: number
  modePaiement: "ESPECES" | "CARTE_BANCAIRE" | "MOBILE_MONEY" | "VIREMENT" | "CHEQUE"
  statut: "VALIDE" | "EN_ATTENTE" | "ANNULE"
  datePaiement: string
  reference: string
  dateCreation: string
}

export interface CreatePaymentData {
  idVente: string
  montant: number
  modePaiement: string
  reference?: string
}

export const mockPaymentService = {
  async getAll(params?: any) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let payments = [...mockDataComplete.paiements]

    if (params?.modePaiement) {
      payments = payments.filter((p) => p.modePaiement === params.modePaiement)
    }

    if (params?.statut) {
      payments = payments.filter((p) => p.statut === params.statut)
    }

    if (params?.idVente) {
      payments = payments.filter((p) => p.idVente === params.idVente)
    }

    return {
      data: payments,
      meta: { total: payments.length, page: 1, limit: 100 },
    }
  },

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const payment = mockDataComplete.paiements.find((p) => p.idPaiement === id)
    if (!payment) throw new Error("Payment not found")
    return payment
  },

  async create(data: CreatePaymentData) {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const newPayment: Payment = {
      idPaiement: `paiement-${Date.now()}`,
      idVente: data.idVente,
      montant: data.montant,
      modePaiement: data.modePaiement as any,
      statut: "VALIDE",
      datePaiement: new Date().toISOString(),
      reference: data.reference || `REF-${Date.now()}`,
      dateCreation: new Date().toISOString(),
    }

    mockDataComplete.paiements.push(newPayment)
    return newPayment
  },

  async generateReceipt(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const payment = mockDataComplete.paiements.find((p) => p.idPaiement === id)
    if (!payment) throw new Error("Payment not found")

    return {
      filename: `bordereau-${payment.reference}.pdf`,
      content: `Bordereau de paiement ${payment.reference}`,
    }
  },
}
