"use client"

import { useState, useCallback } from "react"
import { mockSalesService } from "@/services/mock-sales-service"

export function useSale() {
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(async (params?: any) => {
    setLoading(true)
    try {
      const result = await mockSalesService.getAll(params)
      setSales(result.data)
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
      const sale = await mockSalesService.getById(id)
      return sale
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
        const sale = await mockSalesService.create(data)
        setSales([sale, ...sales])
        return sale
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [sales],
  )

  const getDashboardStats = useCallback(async () => {
    setLoading(true)
    try {
      return await mockSalesService.getDashboardStats()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getTopProducts = useCallback(async (limit?: number) => {
    setLoading(true)
    try {
      return await mockSalesService.getTopProducts(limit)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getTopClients = useCallback(async (limit?: number) => {
    setLoading(true)
    try {
      return await mockSalesService.getTopClients(limit)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    sales,
    loading,
    error,
    getAll,
    getById,
    create,
    getDashboardStats,
    getTopProducts,
    getTopClients,
  }
}
