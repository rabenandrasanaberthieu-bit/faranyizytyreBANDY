export type RoleType = "admin" | "stock_manager" | "cashier"
export type TypeVente = "DIRECTE" | "COMMANDE" | "ANNULEE"
export type StatutProduit = "ACTIF" | "EN_ATTENTE_SUPPRESSION" | "SUPPRIME"
export type StatutPaiement = "NON_PAYEE" | "PARTIELLEMENT_PAYEE" | "PAYEE"
export type StatutReception = "EN_ATTENTE" | "RECU"
export type TypeRemise = "MONTANT" | "POURCENTAGE"
export type ModePaiement = "ESPECES" | "MOBILE_MONEY" | "CARTE" | "VIREMENT"
export type StatutFacture = "GENEREE" | "ENVOYEE" | "ANNULEE"
export type StatutGarantie = "EN_COURS" | "EXPIREE" | "ANNULEE"
export type TypeMouvement = "ENTREE" | "SORTIE" | "AJUSTEMENT"
export type ActionAudit =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "LOGIN_FAILED"
  | "RESTORE"
  | "CHANGE_STATUS"
  | "GENERATE_INVOICE"
  | "ADD_PAYMENT"
  | "STOCK_UPDATE"
export type StatutValidation = "EN_ATTENTE" | "VALIDEE" | "REFUSEE"

// --------------------
// Models
// --------------------

export interface User {
  id: string
  username: string
  email: string
  password?: string
  avatar?: string | null
  role: RoleType
  mustChangePassword: boolean
  isActive: boolean
  lastLogin?: string | null
  createdAt: string
  updatedAt: string

  ventes?: Vente[]
  audits?: Audit[]
  mouvementsStock?: MouvementStock[]
  validationsDemande?: Validation[]
  validationsValide?: Validation[]
}

export interface Client {
  idClient: string
  codeClient: string
  nom: string
  telephone: string
  supprime: boolean
  dateCreation: string
  dateModification: string
  ventes?: Vente[]
}

export interface Categorie {
  idCategorie: string
  nom: string
  description?: string | null
  statut: boolean
  dateCreation: string
  dateModification: string
  produits?: Produit[]
  promotions?: Promotion[]
}

export interface Produit {
  idProduit: string
  codeProduit: string
  nom: string
  description: string
  image?: string | null
  prixAchat: string
  prixMin: string
  prixVente: string
  stock: number
  seuilMin: number
  garantieMois: number
  statut: StatutProduit
  idCategorie: string

  dateCreation: string
  dateModification: string

  categorie?: Categorie
  lignesVente?: LigneVente[]
  promotions?: Promotion[]
  garanties?: Garantie[]
  mouvementsStock?: MouvementStock[]
}

export interface Vente {
  idVente: string
  numeroVente: string
  idUser: string
  idClient: string
  totalBrut: string
  remiseTotal: string
  totalNet: string
  typeVente: TypeVente
  statutPaiement: StatutPaiement
  statutReception: StatutReception
  commentaire?: string | null
  dateReception?: string | null
  dateCreation: string
  dateModification: string

  caissier?: User
  client?: Client
  lignesVente?: LigneVente[]
  paiements?: Paiement[]
  garanties?: Garantie[]
}

export interface LigneVente {
  idLigne: string
  idVente: string
  idProduit: string
  quantite: number
  prixUnitaire: string
  typeRemiseLigne?: TypeRemise | null
  valeurRemiseLigne: string
  sousTotal: string
  dateCreation: string
  dateModification: string

  vente?: Vente
  produit?: Produit
}

export interface Paiement {
  idPaiement: string
  idVente: string
  numeroPaiement: string
  montant: string
  modePaiement: ModePaiement
  reference?: string | null
  dateCreation: string
  dateModification: string

  facture?: Facture | null
  vente?: Vente
}

export interface Facture {
  idFacture: string
  idPaiement: string
  numeroFacture: string
  statutFacture: StatutFacture
  pdfUrl?: string | null
  dateCreation: string
  dateModification: string

  paiement?: Paiement
}

export interface Promotion {
  idPromotion: string
  nom: string
  codePromotion: string
  description?: string | null
  typePromo: TypeRemise
  valeur: string
  dateDebut: string
  dateFin: string
  idProduit?: string | null
  idCategorie?: string | null
  supprime: boolean
  dateCreation: string
  dateModification: string

  produit?: Produit | null
  categorie?: Categorie | null
}

export interface Garantie {
  idGarantie: string
  idVente: string
  idProduit: string
  dateDebut: string
  dateFin: string
  statut: StatutGarantie
  dateCreation: string
  dateModification: string

  vente?: Vente
  produit?: Produit
}

export interface MouvementStock {
  idMouvement: string
  idProduit: string
  idUser: string
  typeMouvement: TypeMouvement
  quantite: number
  motif?: string | null
  dateMouvement: string

  produit?: Produit
  user?: User
}

export interface Audit {
  idAudit: string
  idUser: string
  tableAffectee: string
  action: ActionAudit
  details?: any | null
  ip: string
  deviceInfo?: string | null
  dateAction: string

  user?: User
}

export interface Validation {
  idValidation: string
  tableAffectee: string
  idElement: string
  action: ActionAudit
  idDemandeur: string
  idValidateur: string
  statut: StatutValidation
  commentaire?: string | null
  dateCreation: string
  dateValidation?: string | null

  demandeur?: User
  validateur?: User
}
