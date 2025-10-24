import { mockDataComplete } from "@/lib/mock-data-complete"

export interface Client {
  idClient: string
  nom: string
  email: string
  telephone: string
  adresse: string
  ville: string
  codePostal: string
  pays: string
  typeClient: "PARTICULIER" | "ENTREPRISE"
  supprime: boolean
  totalAchats?: number
  nombreAchats?: number
  dateCreation: string
  dateModification: string
}

export interface CreateClientData {
  nom: string
  email: string
  telephone: string
  adresse: string
  ville: string
  codePostal: string
  pays: string
  typeClient: string
}

export const mockClientService = {
  async getAll(params?: any) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let clients = mockDataComplete.clients.filter((c) => !c.supprime)

    if (params?.search) {
      const search = params.search.toLowerCase()
      clients = clients.filter(
        (c) =>
          c.nom.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.telephone.includes(search),
      )
    }

    if (params?.typeClient) {
      clients = clients.filter((c) => c.typeClient === params.typeClient)
    }

    // Calculate totals
    clients = clients.map((c) => {
      const ventes = mockDataComplete.ventes.filter((v) => v.idClient === c.idClient)
      return {
        ...c,
        totalAchats: ventes.reduce((sum, v) => sum + v.totalNet, 0),
        nombreAchats: ventes.length,
      }
    })

    return {
      data: clients,
      meta: { total: clients.length, page: 1, limit: 100 },
    }
  },

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const client = mockDataComplete.clients.find((c) => c.idClient === id && !c.supprime)
    if (!client) throw new Error("Client not found")

    const ventes = mockDataComplete.ventes.filter((v) => v.idClient === id)
    return {
      ...client,
      totalAchats: ventes.reduce((sum, v) => sum + v.totalNet, 0),
      nombreAchats: ventes.length,
    }
  },

  async create(data: CreateClientData) {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const newClient: Client = {
      idClient: `client-${Date.now()}`,
      ...data,
      supprime: false,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
    }

    mockDataComplete.clients.push(newClient)
    return newClient
  },

  async update(id: string, data: Partial<CreateClientData>) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const client = mockDataComplete.clients.find((c) => c.idClient === id)
    if (!client) throw new Error("Client not found")

    Object.assign(client, data, { dateModification: new Date().toISOString() })
    return client
  },

  async delete(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const client = mockDataComplete.clients.find((c) => c.idClient === id)
    if (!client) throw new Error("Client not found")
    client.supprime = true
    return client
  },
}
