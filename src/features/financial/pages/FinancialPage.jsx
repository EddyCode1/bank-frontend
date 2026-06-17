import { useEffect, useMemo, useState } from 'react'
import { financialService } from '../service/financialService'
import { jsPDF } from 'jspdf'
import { CREDIT_CARDS, LOANS, TRANSACTION_FILTER_OPTIONS } from '../constants/financialData'
import slimCard from '../../../assets/slim-card.png'
import { FinancialSummaryCard, FinancialFilters, FinancialHistoryTable } from '../components'
import '../FinancialPage.css'

const formatCurrency = (value, currency = 'GTQ') =>
  Number(value ?? 0).toLocaleString('es-GT', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  })

const initialFilters = {
  startDate: '',
  endDate: '',
  type: 'Todos',
  currency: 'Todos',
  status: 'Todos',
  search: '',
  ...TRANSACTION_FILTER_OPTIONS,
}

const buildDashboardSummary = (cards, loans) => {
  const totalCardBalance = cards.reduce((sum, item) => sum + (item.balanceDue ?? 0), 0)
  const totalLoanBalance = loans.reduce((sum, item) => sum + (item.outstandingBalance ?? 0), 0)
  return [
    {
      title: 'Saldo total tarjetas',
      value: formatCurrency(totalCardBalance, 'GTQ'),
      subtitle: 'Saldo pendiente consolidado en todas las tarjetas',
    },
    {
      title: 'Saldo total préstamos',
      value: formatCurrency(totalLoanBalance, 'GTQ'),
      subtitle: 'Saldo pendiente consolidado en préstamos activos',
    },
    {
      title: 'Servicios de consulta',
      value: 'Tarjetas & Préstamos',
      subtitle: 'Historial de transacciones, exportación y control financiero',
    },
  ]
}

export default function FinancialPage() {
  const [creditCards, setCreditCards] = useState([])
  const [loans, setLoans] = useState([])
  const [history, setHistory] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        setCreditCards(CREDIT_CARDS)
        setLoans(LOANS)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    const loadHistory = async () => {
      setHistoryLoading(true)
      try {
        const result = await financialService.getFinancialHistory(filters)
        if (result.success) {
          setHistory(result.data)
        }
      } finally {
        setHistoryLoading(false)
      }
    }
    loadHistory()
  }, [filters])

  const summary = useMemo(() => buildDashboardSummary(creditCards, loans), [creditCards, loans])

  const handleExportPdf = () => {
    try {
      if (!history || history.length === 0) {
        alert('No hay datos para exportar')
        return
      }

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Título
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text('Historial de Movimientos', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15

      // Configurar tabla
      const columns = ['Fecha', 'Descripción', 'Tipo', 'Monto', 'Moneda', 'Estado']
      const columnWidths = [25, 55, 22, 25, 20, 25]
      const rowHeight = 8
      const headerHeight = 10
      let tableY = yPosition

      // Dibujar encabezado
      doc.setFillColor(41, 128, 185)
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')

      let xPosition = 10
      columns.forEach((col, i) => {
        doc.rect(xPosition, tableY, columnWidths[i], headerHeight, 'F')
        doc.text(col, xPosition + 2, tableY + 7)
        xPosition += columnWidths[i]
      })

      tableY += headerHeight

      // Dibujar filas
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)

      history.forEach((item, index) => {
        // Cambiar color de fondo cada dos filas
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240)
          doc.rect(10, tableY, pageWidth - 20, rowHeight, 'F')
        }

        // Dibujar bordes
        doc.setDrawColor(200, 200, 200)
        xPosition = 10
        const rowData = [
          item.date || item.fecha || '',
          item.description || item.descripcion || '',
          item.type || item.tipo || '',
          item.amount || item.monto || '',
          item.currency || item.moneda || '',
          item.status || item.estado || '',
        ]

        rowData.forEach((data, i) => {
          doc.rect(xPosition, tableY, columnWidths[i], rowHeight)
          doc.text(String(data).substring(0, 15), xPosition + 2, tableY + 6)
          xPosition += columnWidths[i]
        })

        tableY += rowHeight

        // Verificar si necesita nueva página
        if (tableY > pageHeight - 20) {
          doc.addPage()
          tableY = 20
        }
      })

      doc.save('historial_movimientos.pdf')
    } catch (err) {
      console.error('Error exportando PDF:', err)
      alert('No fue posible exportar el PDF. Error: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  return (
    <div className="financial-page">
      <div className="financial-header">
        <div className="financial-header-left">
          <h1>Consulta de Saldo e Historial</h1>
          <p>Accede a tu información de tarjetas de crédito y préstamos con un diseño pensado para experiencia bancaria enterprise.</p>
        </div>
        <div className="financial-actions">
          <button className="export-button" type="button" onClick={handleExportPdf}>
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="financial-grid-2">
        <section className="financial-section">
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-amber-300 bg-amber-50 py-16 px-6">
            <div className="mb-4 text-6xl">🔧</div>
            <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">Próximamente: Créditos y Préstamos</h2>
            <p className="max-w-md text-center text-slate-600">
              Aquí podrás consultar el estado de tus tarjetas de crédito y préstamos activos. Esta sección estará disponible en la próxima versión.
            </p>
          </div>
        </section>
      </div>

      <section id="financial-export-area" className="financial-section">
        <h2 className="section-title">Historial de movimientos</h2>
        <FinancialFilters filters={filters} onChange={setFilters} />
        <div className="mt-4 flex flex-col gap-4">
          {historyLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
              Cargando movimientos...
            </div>
          ) : (
            <FinancialHistoryTable items={history} />
          )}
        </div>
      </section>
    </div>
  )
}