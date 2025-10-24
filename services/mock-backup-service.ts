import { mockDataComplete } from "@/lib/mock-data-complete"

export interface Backup {
  idBackup: string
  type: "COMPLETE" | "INCREMENTALE" | "MANUELLE"
  dateCreation: string
  taille: number
  statut: "EN_COURS" | "TERMINE" | "ECHOUE"
  progression: number
}

export const mockBackupService = {
  backups: [] as Backup[],

  async getAll() {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return {
      data: this.backups,
      meta: { total: this.backups.length, page: 1, limit: 100 },
    }
  },

  async create(type: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const backup: Backup = {
      idBackup: `backup-${Date.now()}`,
      type: type as any,
      dateCreation: new Date().toISOString(),
      taille: Math.random() * 10000000,
      statut: "TERMINE",
      progression: 100,
    }

    this.backups.push(backup)
    return backup
  },

  async restore(idBackup: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const backup = this.backups.find((b) => b.idBackup === idBackup)
    if (!backup) throw new Error("Backup not found")

    // Simulate restore
    return { success: true, message: "Backup restored successfully" }
  },

  async download(idBackup: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const backup = this.backups.find((b) => b.idBackup === idBackup)
    if (!backup) throw new Error("Backup not found")

    return {
      filename: `backup-${backup.idBackup}.json`,
      content: JSON.stringify(mockDataComplete, null, 2),
    }
  },
}
