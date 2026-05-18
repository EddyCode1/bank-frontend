import React from 'react';
import BrandLogo from '../../app/components/BrandLogo';

const links = [
  {
    title: 'Acerca del Banco',
    items: [
      { label: 'Sobre Banco del Quetzal', url: '#' },
      { label: 'Calificación y reconocimiento', url: '#' },
      { label: 'Inversionista', url: '#' },
      { label: 'Línea de ética', url: '#' },
      { label: 'Sostenibilidad empresarial', url: '#' },
      { label: 'Trabaja con nosotros', url: '#' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Información Financiera', url: '#' },
      { label: 'Gobierno Corporativo', url: '#' },
      { label: 'Términos y Condiciones', url: '#' },
      { label: 'Legales', url: '#' },
    ],
  },
  {
    title: 'Accesos rápidos',
    items: [
      { label: 'Blog', url: '#' },
      { label: 'Medios y Prensa', url: '#' },
      { label: 'Mapa del Sitio', url: '#' },
    ],
  },
  {
    title: 'Contáctanos',
    items: [
      { label: 'Teléfono: 2411-6000', url: 'tel:24116000' },
      { label: 'PBX: 1717', url: 'tel:1717' },
      { label: 'Dirección: Vía 5 5-35 Zona 4, Ciudad de Guatemala, Guatemala', url: 'https://goo.gl/maps/...' },
    ],
  },
];

const social = [
  { icon: 'facebook', url: '#' },
  { icon: 'instagram', url: '#' },
  { icon: 'youtube', url: '#' },
  { icon: 'whatsapp', url: '#' },
  { icon: 'x', url: '#' },
];

const appLinks = [
  { label: 'App Store', icon: '', url: '#' },
  { label: 'Google Play', icon: '▶', url: '#' },
  { label: 'Huawei', icon: 'H', url: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#05406b] text-white pt-5 pb-2 px-2 mt-10 text-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:gap-8">
          <div className="flex-1 mb-6 md:mb-0 flex flex-col items-start">
            <BrandLogo className="w-24 mb-2" compact />
            <div className="text-[10px] tracking-widest font-semibold opacity-80 mb-1">BANCO INDUSTRIAL</div>
            <div className="flex gap-2 mt-1">
              {social.map((s) => (
                <a key={s.icon} href={s.url} className="text-xl opacity-70 hover:opacity-100 transition" aria-label={s.icon}>
                  <span>{s.icon === 'x' ? '✕' : s.icon[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
            {links.map((col) => (
              <div key={col.title} className="mb-2">
                <div className="font-bold mb-1 text-xs">{col.title}</div>
                <ul className="space-y-0.5 text-xs">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.url} className="hover:underline opacity-90">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex-1 flex flex-col md:flex-row md:gap-4">
            <div className="bg-[#0a4c7a] rounded-xl p-2 flex-1 flex items-center justify-between mb-1 md:mb-0 text-xs">
              <span className="font-bold">Descarga Banca en Línea para Personas</span>
              <div className="flex gap-1 ml-2">
                {appLinks.map((a) => (
                  <a key={a.label} href={a.url} className="text-xl" aria-label={a.label}>
                    <span>{a.icon}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-[#0a4c7a] rounded-xl p-2 flex-1 flex items-center justify-between text-xs">
              <span className="font-bold">Descarga Banca en Línea para Empresas</span>
              <div className="flex gap-1 ml-2">
                {appLinks.slice(0,2).map((a) => (
                  <a key={a.label} href={a.url} className="text-xl" aria-label={a.label}>
                    <span>{a.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <button className="bg-cyan-400 text-[#05406b] rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold shadow-lg hover:bg-cyan-300 transition" aria-label="Más opciones">
            +
          </button>
        </div>
        <div className="text-center text-[10px] opacity-70 mt-3">2026 © Todos los derechos reservados Corporación Bi.</div>
      </div>
    </footer>
  );
}
