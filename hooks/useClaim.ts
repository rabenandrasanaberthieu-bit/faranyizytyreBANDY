"use client"

import { useState, useCallback } from "react"
import { mockClaimService } from "@/services/mock-claim-service"

export function useClaim() {
  const [claims, setClaims] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(async (params?: any) => {
    setLoading(true)
    try {
      const result = await mockClaimService.getAll(params)
      setClaims(result.data)
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
      const claim = await mockClaimService.getById(id)
      return claim
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
        const claim = await mockClaimService.create(data)
        setClaims([...claims, claim])
        return claim
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [claims],
  )

  const updateStatus = useCallback(
    async (id: string, statut: string, motif?: string) => {
      setLoading(true)
      try {
        const claim = await mockClaimService.updateStatus(id, statut, motif)
        setClaims(claims.map((c) => (c.idReclamation === id ? claim : c)))
        return claim
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [claims],
  )

  return {
    claims,
    loading,
    error,
    getAll,
    getById,
    create,
    updateStatus,
  }
}
