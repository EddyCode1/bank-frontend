import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { bankingClient } from '../../../shared/api/adminClient'

function resolveApiError(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.error || fallback
}

// Centraliza la carga de solicitudes de producto: tanto las del cliente
// (`/products/requests/me`) como las globales para administradores
// (`/products/requests`). El catálogo de productos sigue viviendo en
// `useProductStore` porque tiene filtros, paginación y mutaciones; aquí
// solo nos interesa el sub-recurso de solicitudes.
export function useProductRequests({ isAdmin = false, autoLoad = true } = {}) {
  const [myRequests, setMyRequests] = useState([])
  const [allRequests, setAllRequests] = useState([])
  const [loading, setLoading] = useState(autoLoad)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [myRes, allRes] = await Promise.all([
        bankingClient.get('/products/requests/me'),
        isAdmin ? bankingClient.get('/products/requests') : Promise.resolve(null),
      ])
      setMyRequests(myRes?.data?.requests ?? [])
      setAllRequests(isAdmin ? (allRes?.data?.requests ?? []) : [])
    } catch (error) {
      toast.error(resolveApiError(error, 'No se pudieron cargar las solicitudes de productos'))
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    if (autoLoad) {
      const timer = window.setTimeout(() => {
        void load()
      }, 0)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [autoLoad, load])

  return {
    myRequests,
    allRequests,
    loading,
    refresh: load,
  }
}
