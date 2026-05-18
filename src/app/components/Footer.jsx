
import React from 'react';
import BrandLogo from '../../app/components/BrandLogo';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';

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
  { icon: <FaFacebookF />, url: '#' },
  { icon: <FaInstagram />, url: '#' },
  { icon: <FaYoutube />, url: '#' },
  { icon: <FaWhatsapp />, url: '#' },
  { icon: <FaXTwitter />, url: '#' },
];



function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#05406b] via-[#0a4c7a] to-[#0e2235] text-white pt-10 pb-4 px-2 mt-10 text-sm shadow-2xl overflow-hidden">
      {/* Efecto decorativo */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 right-0 w-80 h-80 bg-yellow-300/10 rounded-full blur-3xl animate-pulse" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:gap-12">
          <div className="flex-1 mb-8 md:mb-0 flex flex-col items-start">
            <div className="mb-3">
              <BrandLogo className="w-32 mb-2 drop-shadow-xl" compact />
              <div className="text-xs tracking-widest font-semibold opacity-90 mb-1 text-cyan-200 drop-shadow">BANCO DEL QUETZAL</div>
              <div className="flex gap-3 mt-3">
                {social.map((s, i) => (
                  <a key={i} href={s.url} className="text-2xl opacity-80 hover:scale-110 hover:text-cyan-300 transition-all duration-200" aria-label="Red social">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
            <div className="hidden md:block h-1 w-16 bg-gradient-to-r from-cyan-400/80 to-yellow-300/60 rounded-full my-2" />
            <div className="text-xs text-cyan-100/80 italic mt-2">Tu bienestar es nuestro trabajo</div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            {links.map((col) => (
              <div key={col.title} className="mb-2">
                <div className="font-bold mb-2 text-base text-cyan-200 drop-shadow">{col.title}</div>
                <ul className="space-y-1 text-sm">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.url} className="hover:underline hover:text-yellow-300 transition-colors opacity-90">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="my-8 border-t border-cyan-100/20" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full text-left text-xs text-cyan-100/80">2026 © Todos los derechos reservados Corporación Banco del Quetzal.</div>
          <div className="flex gap-2 text-xs text-cyan-100/60 md:justify-end w-full">
            <span className="hover:text-yellow-300 cursor-pointer transition-colors">Política de privacidad</span>
            <span className="mx-1">|</span>
            <span className="hover:text-yellow-300 cursor-pointer transition-colors">Términos de uso</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
