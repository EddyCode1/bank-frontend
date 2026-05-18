
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { bankingClient } from '../../../shared/api/adminClient';
import { accountService } from '../../account/service';
import { transactionService } from '../../transaction/service/transactionService';
import useAuthStore from '../../auth/store/useAuthStore';
import SummaryCard from '../components/SummaryCard';
import QuickLinks from '../components/QuickLinks';
import { EmptyState, ErrorState } from '../components/States';

// Ilustraciones
import bannerCreditos from '../../../assets/banner-creditos.png';
import bannerServicios from '../../../assets/banner-servicios.png';
import cardAhorro from '../../../assets/card-ahorro.png';
import cardSeguros from '../../../assets/card-seguros.png';
import cardEducacion from '../../../assets/card-educacion.png';
import secPassword from '../../../assets/security-password.png';
import secUrl from '../../../assets/security-url.png';
import secJwt from '../../../assets/security-jwt.png';
import secPhishing from '../../../assets/security-phishing.png';
import secUpdates from '../../../assets/security-updates.png';
import secMonitoring from '../../../assets/security-monitoring.png';

const quickLinksBase = [
  { id: 1, label: 'Cuentas',         path: '/loby/account',       icon: '◉', roles: ['USER_ROLE', 'ADMIN_ROLE'] },
  { id: 2, label: 'Favoritos',      path: '/loby/favorites',     icon: '★', roles: ['USER_ROLE', 'ADMIN_ROLE'] },
  { id: 3, label: 'Productos',      path: '/loby/products',      icon: '◫', roles: ['USER_ROLE', 'ADMIN_ROLE'] },
  { id: 4, label: 'Servicios',      path: '/loby/services',      icon: '◌', roles: ['USER_ROLE', 'ADMIN_ROLE'] },
  { id: 5, label: 'Transacciones',  path: '/loby/transactions',  icon: '⇄', roles: ['USER_ROLE', 'ADMIN_ROLE'] },
];

const promoSlides = [
  {
    id: 1,
    tag: 'Créditos',
    title: 'Encuentra el crédito ideal para ti',
    subtitle:
      'Tasas preferenciales para clientes verificados y acompañamiento financiero en cada etapa de tu proyecto.',
    ctaLabel: 'Solicitar ahora',
    ctaPath: '/loby/products',
    image: bannerCreditos,
    imagePosition: 'object-[70%_center]',
    overlayFrom: 'from-[#1E3A5F]/85',
  },
  {
    id: 2,
    tag: 'Beneficios',
    title: 'Servicios exclusivos para clientes Banco del Quetzal',
    subtitle:
      'Descuentos en tiendas, restaurantes y servicios de salud disponibles directo desde tu portal bancario.',
    ctaLabel: 'Ver catálogo',
    ctaPath: '/loby/services',
    image: bannerServicios,
    imagePosition: 'object-[30%_center]',
    overlayFrom: 'from-[#0D3B2E]/85',
  },
];

const institutionalProducts = [
  {
    id: 1,
    title: 'Cuentas de Ahorro',
    description:
      'Haz crecer tu dinero con opciones flexibles y rendimiento competitivo para tus metas personales.',
    photo: cardAhorro,
    photoAlt: 'Ilustraciones de ahorro, seguridad y educación financiera',
    imgClassName: 'object-contain bg-white',
    path: '/loby/account',
    accent: '#5B5CF6',
  },
  {
    id: 2,
    title: 'Seguros y Protección',
    description:
      'Protege lo que más valoras: coberturas de vida, salud y hogar adaptadas a tu familia.',
    photo: cardSeguros,
    photoAlt: 'Comerciante satisfecho en frutería',
    path: '/loby/services',
    accent: '#22C55E',
  },
  {
    id: 3,
    title: 'Educación Financiera',
    description:
      'Planifica tu futuro y aprende a administrar tus ingresos con cursos gratuitos en línea.',
    photo: cardEducacion,
    photoAlt: 'Profesional con cuaderno frente a edificio corporativo',
    path: '/loby/favorites',
    accent: '#A855F7',
  },
];

const securityTips = [
  {
    id: 1,
    title: 'Tu contraseña es personal',
    description: 'Nunca compartas tus credenciales. El banco jamás te solicitará claves o pines por llamada, mensaje de texto o correo electrónico.',
    image: secPassword,
    alt: 'Ícono de candado de seguridad',
  },
  {
    id: 2,
    title: 'Verifica la URL siempre',
    description: 'Antes de ingresar, asegúrate de estar en el portal oficial y busca el candado de seguridad en la barra de tu navegador.',
    image: secUrl,
    alt: 'Ventana de navegador con escudo verificado',
  },
  {
    id: 3,
    title: 'Sesión protegida con JWT',
    description: 'Utilizamos tokens encriptados para cada transacción. Recuerda cerrar tu sesión al finalizar, especialmente en equipos compartidos.',
    image: secJwt,
    alt: 'Llave digital de autenticación',
  },
  {
    id: 4,
    title: 'Prevención de Phishing',
    description: 'Desconfía de enlaces sospechosos o correos alarmantes que pidan verificar tu cuenta. Repórtalos a nuestro centro de atención.',
    image: secPhishing,
    alt: 'Advertencia de phishing en dispositivo móvil',
  },
  {
    id: 5,
    title: 'Actualizaciones Seguras',
    description: 'Mantén el sistema operativo y el navegador de tus dispositivos siempre actualizados para garantizar la máxima protección contra malware.',
    image: secUpdates,
    alt: 'Equipo y configuración segura',
  },
  {
    id: 6,
    title: 'Monitoreo Constante',
    description: 'Revisa regularmente tu historial de movimientos. Si detectas algo que no reconoces, contáctanos de inmediato.',
    image: secMonitoring,
    alt: 'Notificación y alertas de cuenta',
  },
]


const currencyOptions = ['GTQ', 'USD', 'EUR'];


export default function DashboardPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [referenceRates, setReferenceRates] = useState(null);
  const [loadingReferenceRates, setLoadingReferenceRates] = useState(true);
  const [referenceError, setReferenceError] = useState('');
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('GTQ');
  const [toCurrency, setToCurrency] = useState('USD');
  const [conversionResult, setConversionResult] = useState(null);
  const [loadingConversion, setLoadingConversion] = useState(false);
  const [exchangeError, setExchangeError] = useState('');

  // Datos de resumen
  const [summary, setSummary] = useState({ accounts: null, balance: null, transactions: null, favorites: null });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState('');

  const user = useAuthStore((s) => s.user);
  const userRole = user?.rol || user?.role || 'USER_ROLE';

  // Auto-rotación del carrusel
  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % promoSlides.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);

  // Cargar datos de resumen (cuentas, saldo, transacciones, favoritos)
  useEffect(() => {
    setSummaryLoading(true);
    setSummaryError('');
    Promise.all([
      accountService.getMyInfo(),
      transactionService.getMyTransactions({ limit: 1 }),
      // Aquí podrías agregar favoritos reales si existe API
    ])
      .then(([accountInfo, txInfo]) => {
        setSummary({
          accounts: accountInfo?.data?.summary?.totalAccounts ?? 0,
          balance: accountInfo?.data?.summary?.totalBalance ?? 0,
          transactions: txInfo?.data?.total ?? 0,
          favorites: 0, // TODO: integrar favoritos reales si hay API
        });
      })
      .catch((err) => {
        setSummaryError('No se pudo cargar el resumen.');
      })
      .finally(() => setSummaryLoading(false));
  }, []);

  // Tasas de referencia desde el backend
  useEffect(() => {
    async function loadReferenceRates() {
      setLoadingReferenceRates(true);
      setReferenceError('');
      try {
        const [usdRes, eurRes] = await Promise.all([
          bankingClient.get('/currency/convert', { params: { from: 'GTQ', to: 'USD', amount: 1 } }),
          bankingClient.get('/currency/convert', { params: { from: 'GTQ', to: 'EUR', amount: 1 } }),
        ]);
        const usdData = usdRes?.data;
        const eurData = eurRes?.data;
        setReferenceRates({
          usdRate: Number(usdData?.convertedAmount ?? usdData?.data?.rate ?? 0),
          eurRate: Number(eurData?.convertedAmount ?? eurData?.data?.rate ?? 0),
          updatedAt: new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
        });
      } catch (error) {
        setReferenceError('No fue posible cargar las tasas del backend.');
      } finally {
        setLoadingReferenceRates(false);
      }
    }
    loadReferenceRates();
  }, []);

  // Convertidor con debounce de 350 ms
  useEffect(() => {
    if (!amount || Number(amount) <= 0) { setConversionResult(null); return; }
    const timeout = window.setTimeout(async () => {
      setLoadingConversion(true);
      setExchangeError('');
      try {
        const res = await bankingClient.get('/currency/convert', {
          params: { from: fromCurrency, to: toCurrency, amount: Number(amount) },
        });
        const d = res?.data;
        if (d?.success && d.convertedAmount != null) {
          setConversionResult({
            amount: d.amount,
            from: d.from,
            to: d.to,
            convertedAmount: d.convertedAmount,
          });
        } else {
          setConversionResult(null);
        }
      } catch {
        setConversionResult(null);
        setExchangeError('No se pudo realizar la conversión con el backend.');
      } finally {
        setLoadingConversion(false);
      }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [amount, fromCurrency, toCurrency]);

  const currentSlide = useMemo(() => promoSlides[activeSlide], [activeSlide]);

  // Filtrar accesos rápidos según rol
  const quickLinks = useMemo(() => quickLinksBase.filter(l => l.roles.includes(userRole)), [userRole]);

  // Formateador de moneda
  function formatCurrency(amount, currency = 'GTQ') {
    return Number(amount ?? 0).toLocaleString('es-GT', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="space-y-6">

      {/* ── Carrusel / Banner Promocional ─────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl shadow-lg" style={{ minHeight: '280px' }}>
        {/* Imagen de fondo */}
        <img
          key={currentSlide.id}
          src={currentSlide.image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${currentSlide.imagePosition}`}
        />

        {/* Overlay degradado para asegurar legibilidad del texto */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.overlayFrom} to-transparent`} />

        {/* Contenido superpuesto */}
        <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white sm:p-10" style={{ minHeight: '280px' }}>
          <div className="max-w-lg">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              Banco del Quetzal · {currentSlide.tag}
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-snug drop-shadow sm:text-3xl lg:text-4xl">
              {currentSlide.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
              {currentSlide.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to={currentSlide.ctaPath}
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#5B5CF6] shadow transition hover:bg-slate-100"
              >
                {currentSlide.ctaLabel}
              </Link>
              <Link
                to="/loby/services"
                className="rounded-lg border border-white/60 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Ver todos los beneficios
              </Link>
            </div>
          </div>

          {/* Indicadores de slide */}
          <div className="flex items-center gap-2 pt-4">
            {promoSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                aria-label={`Ver banner ${slide.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tarjetas de resumen y accesos rápidos ─────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Saldo total"
          value={formatCurrency(summary.balance)}
          icon="💰"
          loading={summaryLoading}
          error={summaryError}
          empty={summary.balance === 0}
          accent="#5B5CF6"
          tooltip="Suma de todos tus saldos bancarios"
        />
        <SummaryCard
          title="Cuentas"
          value={summary.accounts}
          icon="🏦"
          loading={summaryLoading}
          error={summaryError}
          empty={summary.accounts === 0}
          accent="#22C55E"
          tooltip="Cantidad de cuentas activas"
        />
        <SummaryCard
          title="Transacciones"
          value={summary.transactions}
          icon="⇄"
          loading={summaryLoading}
          error={summaryError}
          empty={summary.transactions === 0}
          accent="#A855F7"
          tooltip="Total de transacciones registradas"
        />
        <SummaryCard
          title="Favoritos"
          value={summary.favorites}
          icon="★"
          loading={summaryLoading}
          error={summaryError}
          empty={summary.favorites === 0}
          accent="#F59E42"
          tooltip="Tus accesos o productos favoritos"
        />
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text)]">Accesos rápidos</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Selecciona una sección para continuar.</p>
        <div className="mt-6">
          <QuickLinks links={quickLinks} loading={summaryLoading} />
        </div>
      </section>

      {/* ── Productos + Widget divisas ────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Tarjetas de productos */}
        <article className="xl:col-span-2 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[var(--text)]">Productos y servicios destacados</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Vitrina institucional con beneficios para clientes del banco.</p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {institutionalProducts.map((product) => (
              <Link
                key={product.id}
                to={product.path}
                className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition hover:border-[var(--primary)] hover:shadow-md"
              >
                {/* Foto de persona */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={product.photo}
                    alt={product.photoAlt}
                    className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${product.imgClassName ?? 'object-cover object-top'}`}
                  />
                  {/* Badge de categoría con el color de acento */}
                  <span
                    className="absolute bottom-2 left-2 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white shadow"
                    style={{ background: product.accent }}
                  >
                    {product.title}
                  </span>
                </div>
                {/* Texto */}
                <div className="p-4">
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{product.description}</p>
                  <p className="mt-3 text-xs font-semibold" style={{ color: product.accent }}>
                    Conocer más →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </article>

        {/* Widget tipo de cambio */}
        <article className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[var(--text)]">Tipo de cambio</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Tasas desde el backend del banco.</p>

          {loadingReferenceRates ? (
            <p className="mt-5 text-sm text-[var(--muted)]">Cargando tasas...</p>
          ) : (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
                <span className="text-sm font-semibold text-[var(--muted)]">🇺🇸 USD</span>
                <span className="font-bold text-[var(--primary)]">{referenceRates?.usdRate?.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
                <span className="text-sm font-semibold text-[var(--muted)]">🇪🇺 EUR</span>
                <span className="font-bold text-[var(--primary)]">{referenceRates?.eurRate?.toFixed(4)}</span>
              </div>
              <p className="text-xs text-[var(--muted)]">Por 1 GTQ · {referenceRates?.updatedAt}</p>
            </div>
          )}
          {referenceError ? <p className="mt-2 text-xs text-amber-600">{referenceError}</p> : null}

          {/* Convertidor */}
          <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Convertidor</p>
            <div className="mt-3 space-y-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                placeholder="Monto"
              />
              <div className="grid grid-cols-2 gap-2">
                {[fromCurrency, setFromCurrency, toCurrency, setToCurrency].length && [
                  { value: fromCurrency, onChange: setFromCurrency },
                  { value: toCurrency,   onChange: setToCurrency },
                ].map((sel, i) => (
                  <select
                    key={i}
                    value={sel.value}
                    onChange={(e) => sel.onChange(e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-white px-2 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                  >
                    {currencyOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                ))}
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-white px-3 py-2.5 text-sm">
              {loadingConversion ? (
                <p className="text-[var(--muted)]">Calculando...</p>
              ) : conversionResult ? (
                <p className="text-[var(--text)]">
                  {conversionResult.amount} {conversionResult.from}{' '}
                  <span className="text-[var(--muted)]">=</span>{' '}
                  <span className="font-bold text-[var(--primary)]">
                    {conversionResult.convertedAmount} {conversionResult.to}
                  </span>
                </p>
              ) : (
                <p className="text-[var(--muted)]">Ingresa un monto válido.</p>
              )}
            </div>
            {exchangeError ? <p className="mt-2 text-xs text-amber-600">{exchangeError}</p> : null}
          </div>
        </article>
      </section>

      {/* ── Tips de seguridad ─────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-blue-900">Tu seguridad es nuestra prioridad</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Consejos institucionales para mantener tu cuenta y tus datos siempre protegidos.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {securityTips.map((tip) => (
            <div
              key={tip.id}
              className="flex flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Ilustraciones 3D: fondo claro y contain para no recortar el ícono */}
              <div className="mb-5 flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-white px-4 py-3 ring-1 ring-slate-100">
                <img
                  src={tip.image}
                  alt={tip.alt}
                  className="max-h-full max-w-[min(100%,220px)] object-contain object-center"
                />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-800">{tip.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
