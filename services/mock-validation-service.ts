import { mockDataComplete } from "@/lib/mock-data-complete"

export interface Validation {
  idValidation: string
  type: string
  idEntite: string
  statut: "EN_ATTENTE" | "APPROUVEE" | "REJETEE"
  raison: string
  dateCreation: string
  dateValidation?: string
  idUserValidateur?: string
  motifRejet?: string
}

export const mockValidationService = {
  async getAll(params?: any) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let validations = [...mockDataComplete.validations]

    if (params?.statut) {
      validations = validations.filter((v) => v.statut === params.statut)
    }

    return {
      data: validations,
      meta: { total: validations.length, page: 1, limit: 100 },
    }
  },

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const validation = mockDataComplete.validations.find((v) => v.idValidation === id)
    if (!validation) throw new Error("Validation not found")
    return validation
  },

  async approve(id: string, userId: string) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const validation = mockDataComplete.validations.find((v) => v.idValidation === id)
    if (!validation) throw new Error("Validation not found")

    validation.statut = "APPROUVEE"
    validation.dateValidation = new Date().toISOString()
    validation.idUserValidateur = userId

    return validation
  },

  async reject(id: string, userId: string, motif: string) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const validation = mockDataComplete.validations.find((v) => v.idValidation === id)
    if (!validation) throw new Error("Validation not found")

    validation.statut = "REJETEE"
    validation.dateValidation = new Date().toISOString()
    validation.idUserValidateur = userId
    validation.motifRejet = motif

    return validation
  },

  async create(type: string, idEntite: string, raison: string) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newValidation: Validation = {
      idValidation: `validation-${Date.now()}`,
      type,
      idEntite,
      statut: "EN_ATTENTE",
      raison,
      dateCreation: new Date().toISOString(),
    }

    mockDataComplete.validations.push(newValidation)
    return newValidation
  },
}
