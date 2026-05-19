import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { accountService } from '../service'

// Encapsula la carga de las cuentas propias del usuario logueado y el resumen
// (total de cuentas, balance consolidado). Usado por AccountPage, DashboardPage
// y cualquier otro consumidor que necesite el estado financiero del cliente.
// Maneja loading, errores y refresco bajo demanda.
export function useMyAccounts({ autoLoad = true, limit = 50 } = {}) {
  const [accounts, setAccounts] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(autoLoad)
  const [summaryLoading, setSummaryLoading] = useState(autoLoad)

  const loadAccounts = useCallback(async () => {
    setLoading(true)
    try {
      const result = await accountService.getMyAccounts({ limit })
      if (result.success) {
        setAccounts(result.data.items)
      } else {
        toast.error(result.error || 'No se pudieron cargar tus cuentas')
      }
    } catch {
      toast.error('Error al consultar mis cuentas')
    } finally {
      setLoading(false)
    }
  }, [limit])

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true)
    try {
      const result = await accountService.getMyInfo()
      if (result.success) {
        setSummary(result.data.summary)
      } else {
        toast.error(result.error || 'No se pudo cargar tu resumen')
      }
    } catch {
      toast.error('Error al cargar mi información')
    } finally {
      setSummaryLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    await loadAccounts()
    await loadSummary()
  }, [loadAccounts, loadSummary])

  useEffect(() => {
    if (!autoLoad) return undefined
    // Pequeño defer (setTimeout 0) para evitar la regla set-state-in-effect:
    // los `setLoading(true)` internos quedan fuera de la fase de render.
    const timer = window.setTimeout(() => {
      void refresh()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [autoLoad, refresh])

  return {
    accounts,
    summary,
    loading,
    summaryLoading,
    refresh,
    reloadAccounts: loadAccounts,
    reloadSummary: loadSummary,
  }
}
