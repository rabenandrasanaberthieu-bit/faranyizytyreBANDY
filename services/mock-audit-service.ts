import { mockDataComplete } from "@/lib/mock-data-complete"

export interface AuditLog {
  idAudit: string
  idUser: string
  action: string
  entite: string
  idEntite: string
  anciennesValeurs?: any
  nouvellesValeurs?: any
  dateAction: string
  adresseIP: string
  userAgent?: string
}

export const mockAuditService = {
  async getAll(params?: any) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let audits = [...mockDataComplete.audits]

    if (params?.idUser) {
      audits = audits.filter((a) => a.idUser === params.idUser)
    }

    if (params?.action) {
      audits = audits.filter((a) => a.action === params.action)
    }

    if (params?.entite) {
      audits = audits.filter((a) => a.entite === params.entite)
    }

    // Sort by date descending
    audits.sort((a, b) => new Date(b.dateAction).getTime() - new Date(a.dateAction).getTime())

    return {
      data: audits,
      meta: { total: audits.length, page: 1, limit: 100 },
    }
  },

  async log(userId: string, action: string, entite: string, idEntite: string, oldValues?: any, newValues?: any) {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const newLog: AuditLog = {
      idAudit: `audit-${Date.now()}`,
      idUser: userId,
      action,
      entite,
      idEntite,
      anciennesValeurs: oldValues,
      nouvellesValeurs: newValues,
      dateAction: new Date().toISOString(),
      adresseIP: "192.168.1.1",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
    }

    mockDataComplete.audits.push(newLog)
    return newLog
  },
}
