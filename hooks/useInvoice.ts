"use client"

import { useState, useCallback } from "react"
import { mockInvoiceService } from "@/services/mock-invoice-service"

export function useInvoice() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(async (params?: any) => {
    setLoading(true)
    try {
      const result = await mockInvoiceService.getAll(params)
      setInvoices(result.data)
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
      const invoice = await mockInvoiceService.getById(id)
      return invoice
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
        const invoice = await mockInvoiceService.create(data)
        setInvoices([...invoices, invoice])
        return invoice
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [invoices],
  )

  return {
    invoices,
    loading,
    error,
    getAll,
    getById,
    create,
  }
}
