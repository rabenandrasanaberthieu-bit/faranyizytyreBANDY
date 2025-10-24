import mockData from "@/data/mockData.json"
import type {
  User,
  Client,
  Categorie,
  Produit,
  Vente,
  MouvementStock,
  Promotion,
  Garantie,
  Paiement,
  Facture,
  Audit,
  Validation,
} from "@/types/type"

// Users
export function getUsers(): User[] {
  return mockData.users as User[]
}

export function getUserById(id: string): User | undefined {
  return mockData.users.find((u) => u.id === id) as User | undefined
}

// Clients
export function getClients(): Client[] {
  return mockData.clients.filter((c) => !c.supprime) as Client[]
}

export function getClientById(id: string): Client | undefined {
  return mockData.clients.find((c) => c.idClient === id) as Client | undefined
}

// Categories
export function getCategories(): Categorie[] {
  return mockData.categories.filter((c) => c.statut) as Categorie[]
}

export function getCategorieById(id: string): Categorie | undefined {
  return mockData.categories.find((c) => c.idCategorie === id) as Categorie | undefined
}

// Produits
export function getProduits(): Produit[] {
  return mockData.produits.filter((p) => p.statut === "ACTIF") as Produit[]
}

export function getProduitById(id: string): Produit | undefined {
  return mockData.produits.find((p) => p.idProduit === id) as Produit | undefined
}

export function getProduitsLowStock(): Produit[] {
  return mockData.produits.filter((p) => p.statut === "ACTIF" && p.stock <= p.seuilMin) as Produit[]
}

// Ventes
export function getVentes(): Vente[] {
  return mockData.ventes as Vente[]
}

export function getVenteById(id: string): Vente | undefined {
  return mockData.ventes.find((v) => v.idVente === id) as Vente | undefined
}

// Mouvements Stock
export function getMouvementsStock(): MouvementStock[] {
  return mockData.mouvementsStock as MouvementStock[]
}

// Promotions
export function getPromotions(): Promotion[] {
  return mockData.promotions.filter((p) => !p.supprime) as Promotion[]
}

// Garanties
export function getGaranties(): Garantie[] {
  return mockData.garanties as Garantie[]
}

// Paiements
export function getPaiements(): Paiement[] {
  return mockData.paiements as Paiement[]
}

// Factures
export function getFactures(): Facture[] {
  return mockData.factures as Facture[]
}

// Audits
export function getAudits(): Audit[] {
  return mockData.audits as Audit[]
}

// Validations
export function getValidations(): Validation[] {
  return mockData.validations as Validation[]
}

// Statistics helpers
export function getTotalVentes(): number {
  return mockData.ventes.reduce((sum, v) => sum + Number.parseFloat(v.totalNet), 0)
}

export function getTotalProduitsVendus(): number {
  return mockData.ventes.length
}

export function getTotalClients(): number {
  return mockData.clients.filter((c) => !c.supprime).length
}
