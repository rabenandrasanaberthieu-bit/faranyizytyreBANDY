"use client"

import { useState, useCallback } from "react"
import { mockWarrantyService } from "@/services/mock-warranty-service"

export function useWarranty() {
  const [warranties, setWarranties] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(async (params?: any) => {
    setLoading(true)
    try {
      const result = await mockWarrantyService.getAll(params)
      setWarranties(result.data)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getById = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const warranty = await mockWarrantyService.getById(id)
      return warranty
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(
    async (data: any) => {
      setLoading(true)
      try {
        const warranty = await mockWarrantyService.create(data)
        setWarranties([...warranties, warranty])
        return warranty
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [warranties],
  )

  const updateStatus = useCallback(
    async (id: string, statut: string) => {
      setLoading(true)
      try {
        const warranty = await mockWarrantyService.updateStatus(id, statut)
        setWarranties(warranties.map((w) => (w.idGarantie === id ? warranty : w)))
        return warranty
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [warranties],
  )

  return {
    warranties,
    loading,
    error,
    getAll,
    getById,
    create,
    updateStatus,
  }
}
