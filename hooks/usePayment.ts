"use client"

import { useState, useCallback } from "react"
import { mockPaymentService } from "@/services/mock-payment-service"

export function usePayment() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(async (params?: any) => {
    setLoading(true)
    try {
      const result = await mockPaymentService.getAll(params)
      setPayments(result.data)
      return result
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
        const payment = await mockPaymentService.create(data)
        setPayments([...payments, payment])
        return payment
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [payments],
  )

  return {
    payments,
    loading,
    error,
    getAll,
    create,
  }
}
