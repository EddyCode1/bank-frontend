import { useEffect, useMemo, useState } from 'react'
import { financialService } from '../service/financialService'
import html2canvas from 'html2canvas-pro'
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

  const handleExportPdf = async () => {
    try {
      const element = document.getElementById('financial-export-area')
      if (!element) return

      window.scrollTo(0, 0)
      await new Promise(resolve => setTimeout(resolve, 300))

      const scale = 1.2
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 5000,
      })

      const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const pxPerMm = (96 / 25.4) * scale
      const pageHeightPx = Math.floor(pdfHeight * pxPerMm)

      const totalHeightPx = canvas.height
      let renderedHeight = 0
      let pageCount = 0

      while (renderedHeight < totalHeightPx) {
        const fragmentHeight = Math.min(pageHeightPx, totalHeightPx - renderedHeight)
        const fragment = document.createElement('canvas')
        fragment.width = canvas.width
        fragment.height = fragmentHeight
        const ctx = fragment.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, fragment.width, fragment.height)
        ctx.drawImage(canvas, 0, renderedHeight, canvas.width, fragmentHeight, 0, 0, fragment.width, fragmentHeight)

        const imgData = fragment.toDataURL('image/png')
        const imgHeightMm = fragment.height / pxPerMm

        if (pageCount > 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightMm)

        renderedHeight += fragmentHeight
        pageCount += 1
      }

      pdf.save('saldos.pdf')
    } catch (err) {
      console.error('Error exportando PDF:', err instanceof Error ? err.message : err)
      alert('No fue posible exportar el PDF. Revisa la consola para más detalles.')
    }
  }

  return (
    <div id="financial-export-area" className="financial-page">
      <div className="financial-header">
        <div className="financial-header-left">
          <h1>Consulta de Saldo e Historial</h1>
          <p>Accede a tu información de tarjetas de crédito y préstamos con un diseño pensado para experiencia bancaria enterprise.</p>
        </div>
        <div className="financial-header-right">
          <img src={slimCard} alt="Tarjeta ejemplo" className="financial-hero-image" />
        </div>
        <div className="financial-actions">
          <button className="export-button" type="button" onClick={handleExportPdf}>
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="financial-summary-grid">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
            Cargando saldos...
          </div>
        ) : (
          summary.map((item) => (
            <FinancialSummaryCard key={item.title} {...item} />
          ))
        )}
      </div>

      <div className="financial-grid-2">
        <section className="financial-section">
          <h2 className="section-title">Tarjetas de Crédito</h2>
          <div className="financial-card-sample-wrap">
            <img src={slimCard} alt="Vista móvil tarjeta" className="financial-card-sample" />
          </div>
          <div className="financial-cards-list">
            {creditCards.map((card) => (
              <div key={card.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{card.name}</h3>
                    <p className="text-sm text-slate-600">{card.type} · {card.currency} · {card.status}</p>
                  </div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{card.status}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">Límite autorizado</span>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(card.authorizedLimit, card.currency)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">Saldo pendiente</span>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(card.balanceDue, card.currency)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">Saldo disponible</span>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(card.availableBalance, card.currency)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">Pago mínimo</span>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(card.minimumPayment, card.currency)}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <span className="text-sm text-slate-600">Fecha corte: {card.cutOffDate}</span>
                  <span className="text-sm text-slate-600">Fecha pago: {card.paymentDueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="financial-section">
          <h2 className="section-title">Préstamos</h2>
          <div className="financial-loans-list">
            {loans.map((loan) => (
              <div key={loan.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{loan.name}</h3>
                    <p className="text-sm text-slate-600">{loan.type} · {loan.status}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{loan.status}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">Monto original</span>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(loan.principalAmount)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">Saldo pendiente</span>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(loan.outstandingBalance)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">Tasa</span>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{loan.interestRate}%</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">Cuota mensual</span>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(loan.monthlyInstallment)}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <span className="text-sm text-slate-600">Próximo pago: {loan.nextPaymentDate}</span>
                  <span className="text-sm text-slate-600">Plazo restante: {loan.termRemaining}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="financial-section">
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