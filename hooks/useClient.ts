"use client"

import { useState, useCallback } from "react"
import { mockClientService } from "@/services/mock-client-service"

export function useClient() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(async (params?: any) => {
    setLoading(true)
    try {
      const result = await mockClientService.getAll(params)
      setClients(result.data)
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
      const client = await mockClientService.getById(id)
      return client
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
        const client = await mockClientService.create(data)
        setClients([...clients, client])
        return client
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [clients],
  )

  return {
    clients,
    loading,
    error,
    getAll,
    getById,
    create,
  }
}
