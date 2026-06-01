'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { C } from './constants'
import { WhatsAppIcon } from './ui'
import { useBreakpoint } from '@/lib/hooks'
import { useProductos } from '@/lib/useProductos'
import type { Producto } from '@/lib/supabase'

const PHONE = '543813046228'

// ─── Icon set (Lucide-style outline, currentColor) ────────────────────────────
type IconProps = { size?: number; color?: string; strokeWidth?: number }
type IconCmp = React.FC<IconProps>

const makeIcon = (paths: React.ReactNode): IconCmp => {
  const Cmp: IconCmp = ({ size = 22, color = 'currentColor', strokeWidth = 1.7 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths}
    </svg>
  )
  return Cmp
}

const Icons = {
  // Rubros
  hotel: makeIcon(<>
    <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" /><path d="M6 8v9" />
  </>),
  health: makeIcon(<>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M12 8v8M8 12h8" strokeWidth={2.1} />
  </>),
  factory: makeIcon(<>
    <path d="M2 20h20" />
    <path d="M4 20V9l5 4V9l5 4V9l5 4v7" />
    <path d="M9 16h.5M14 16h.5" />
  </>),
  cart: makeIcon(<>
    <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h3l2.6 12.4a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.3L22 7H6.2" />
  </>),
  car: makeIcon(<>
    <path d="M3 17l1.8-6.4A2 2 0 0 1 6.7 9h10.6a2 2 0 0 1 1.9 1.6L21 17" />
    <path d="M3 17v3h3v-3M18 17v3h3v-3" />
    <circle cx="7.5" cy="14.5" r="1.3" /><circle cx="16.5" cy="14.5" r="1.3" />
  </>),
  // Necesidades
  broom: makeIcon(<>
    <path d="M3 21h18" />
    <path d="M7 17l2-5M12 17l1-7M17 17l-1-5" />
    <circle cx="9" cy="9" r="0.8" /><circle cx="14" cy="7" r="0.8" /><circle cx="18" cy="9" r="0.8" />
  </>),
  chef: makeIcon(<>
    <path d="M6 14a4 4 0 1 1 1-7.9A4 4 0 0 1 12 3a4 4 0 0 1 5 3.1A4 4 0 1 1 18 14" />
    <path d="M6 14h12v6H6z" />
    <path d="M9 17h.5M12 17h.5M15 17h.5" />
  </>),
  shower: makeIcon(<>
    <path d="M5 3h10" /><path d="M10 3v5" />
    <path d="M3 10c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v0H3z" />
    <path d="M6 13v1.5M10 13v1.5M14 13v1.5" />
    <path d="M6 17v1.5M10 17v1.5M14 17v1.5" />
  </>),
  shirt: makeIcon(<>
    <path d="M16 3l4 2-2 4-2-1v13H8V8L6 9 4 5l4-2 0 0a4 4 0 0 0 8 0z" />
  </>),
  window: makeIcon(<>
    <rect x="3" y="3" width="18" height="18" rx="1.5" />
    <path d="M3 12h18M12 3v18" />
    <path d="M16.5 7l.6.6M17.1 6.4l-.6-.6" strokeWidth={1.4} />
  </>),
  shield: makeIcon(<>
    <path d="M12 3l8 3v6c0 5-3.6 8.5-8 10-4.4-1.5-8-5-8-10V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </>),
  flower: makeIcon(<>
    <circle cx="12" cy="12" r="2.2" />
    <path d="M12 4a3 3 0 0 0 0 5.6M12 4a3 3 0 0 1 0 5.6" />
    <path d="M20 12a3 3 0 0 0-5.6 0M20 12a3 3 0 0 1-5.6 0" />
    <path d="M12 20a3 3 0 0 0 0-5.6M12 20a3 3 0 0 1 0-5.6" />
    <path d="M4 12a3 3 0 0 0 5.6 0M4 12a3 3 0 0 1 5.6 0" />
  </>),
  pool: makeIcon(<>
    <path d="M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
    <path d="M2 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
    <path d="M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
  </>),
  flask: makeIcon(<>
    <path d="M9 3h6" />
    <path d="M10 3v6L4.3 19.4A1.5 1.5 0 0 0 5.6 21.5h12.8a1.5 1.5 0 0 0 1.3-2.1L14 9V3" />
    <path d="M6.5 15h11" />
  </>),
  // UI
  arrowL: makeIcon(<path d="M19 12H5M11 19l-7-7 7-7" strokeWidth={1.9} />),
  refresh: makeIcon(<>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </>),
  spark: makeIcon(<>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
    <path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" strokeWidth={1.4} />
  </>),
  message: makeIcon(<>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z" />
  </>),
}

// ─── Data ────────────────────────────────────────────────────────────────────
type RubroKey = 'hospitalidad' | 'salud' | 'industrial' | 'domestico' | 'automotriz'
type NecKey =
  | 'pisos' | 'cocinas' | 'banos' | 'ropa' | 'vidrios'
  | 'desinfeccion' | 'aromatizacion' | 'piletas' | 'auto' | 'materiasprimas'

type RubroDef = {
  label: string; Icon: IconCmp; desc: string
  needs: NecKey[]
  tip: string
  priorityCats: string[]
}

type NecDef = {
  label: string; Icon: IconCmp
  cats: string[]
  keywords?: string[]
}

const RUBROS: Record<RubroKey, RubroDef> = {
  hospitalidad: {
    label: 'Hotelería y gastronomía',
    Icon: Icons.hotel,
    desc: 'Hoteles, restaurantes y cocinas industriales',
    needs: ['pisos', 'cocinas', 'banos', 'ropa', 'vidrios', 'desinfeccion', 'aromatizacion'],
    tip: 'Para hotelería priorizamos fragancia y rendimiento — clave en amenities y áreas comunes.',
    priorityCats: ['Concentrados', 'Bouquets', 'Hogar'],
  },
  salud: {
    label: 'Salud y limpieza profesional',
    Icon: Icons.health,
    desc: 'Clínicas, oficinas y empresas de limpieza',
    needs: ['pisos', 'banos', 'desinfeccion', 'aromatizacion', 'ropa'],
    tip: 'Para entornos sanitarios reforzamos desinfectantes y productos de alto rendimiento.',
    priorityCats: ['Desinfectantes', 'Concentrados'],
  },
  industrial: {
    label: 'Industria y taller',
    Icon: Icons.factory,
    desc: 'Fábricas, depósitos y mantenimiento',
    needs: ['pisos', 'cocinas', 'desinfeccion', 'materiasprimas'],
    tip: 'En industria pesan el volumen y el costo por litro — concentrados y materias primas son la mejor opción.',
    priorityCats: ['Concentrados', 'Materia Prima', 'Contenedores'],
  },
  domestico: {
    label: 'Doméstico y reventa',
    Icon: Icons.cart,
    desc: 'Almacenes, kioscos y venta minorista',
    needs: ['pisos', 'cocinas', 'banos', 'ropa', 'vidrios', 'aromatizacion', 'materiasprimas'],
    tip: 'Mejor margen con kits y concentrados que se fraccionan fácil para reventa.',
    priorityCats: ['Concentrados', 'Hogar', 'Jabones'],
  },
  automotriz: {
    label: 'Lavaderos y automotor',
    Icon: Icons.car,
    desc: 'Lavaderos, talleres y detailing',
    needs: ['auto', 'pisos', 'desinfeccion'],
    tip: 'Línea automotor dedicada: espumas activas, siliconas y revividores de plástico.',
    priorityCats: ['Automotor'],
  },
}

const NECESIDADES: Record<NecKey, NecDef> = {
  pisos:          { label: 'Pisos y superficies',  Icon: Icons.broom,  cats: ['Pisos', 'Hogar', 'Concentrados'], keywords: ['piso', 'cera', 'acondicionador'] },
  cocinas:        { label: 'Cocinas y desengrase', Icon: Icons.chef,   cats: ['Desengrasantes', 'Concentrados'], keywords: ['desengras', 'músculo', 'musculo'] },
  banos:          { label: 'Baños y sanitarios',   Icon: Icons.shower, cats: ['Desinfectantes', 'Desengrasantes', 'Hogar'], keywords: ['baño', 'sanitario', 'desincrustante', 'sarro', 'manos'] },
  ropa:           { label: 'Ropa y textiles',      Icon: Icons.shirt,  cats: ['Jabones', 'Suavizantes', 'Detergentes'] },
  vidrios:        { label: 'Vidrios y brillo',     Icon: Icons.window, cats: ['Concentrados', 'Hogar'], keywords: ['vidrio'] },
  desinfeccion:   { label: 'Desinfección',         Icon: Icons.shield, cats: ['Desinfectantes'] },
  aromatizacion:  { label: 'Aromatización',        Icon: Icons.flower, cats: ['Bouquets', 'Hogar'], keywords: ['perfum', 'esencia', 'aroma'] },
  piletas:        { label: 'Piletas',              Icon: Icons.pool,   cats: ['Piletas'] },
  auto:           { label: 'Auto y lavadero',      Icon: Icons.car,    cats: ['Automotor'] },
  materiasprimas: { label: 'Materias primas y kits', Icon: Icons.flask, cats: ['Materia Prima', 'Contenedores', 'Concentrados'], keywords: ['kit', 'pasta'] },
}

// Categorías "anchas" que mezclan productos de uso final con bases — solo entran
// si el nombre matchea algún keyword de la necesidad.
const BROAD_CATS = new Set(['Concentrados', 'Hogar'])
// KITs y pastas son insumos para fabricar, no productos de uso final.
const RAW_KIT_RE = /\b(kit|pasta preformulada)\b/i

// ─── Scoring + reasoning ──────────────────────────────────────────────────────
function scoreProduct(p: Producto, need: NecDef, rubro: RubroDef, allowRawKits: boolean): number {
  const name = p.nombre.toLowerCase()
  const inNeedCats = need.cats.includes(p.categoria)
  const matchesKeyword = need.keywords?.some(k => name.includes(k)) ?? false

  // 1. KITs/pastas de fabricación: solo si el usuario pidió materias primas.
  if (RAW_KIT_RE.test(p.nombre) && !allowRawKits) return 0

  // 2. Gate base: el producto debe coincidir con la categoría o con un keyword.
  if (!inNeedCats && !matchesKeyword) return 0

  // 3. En categorías "anchas" exigimos keyword: evita que entren productos de
  //    la categoría que no son para esta necesidad (ej: KIT en vidrios).
  if (BROAD_CATS.has(p.categoria) && need.keywords && !matchesKeyword) return 0

  let s = 0
  if (inNeedCats) s += 10
  if (matchesKeyword) s += 8
  if (rubro.priorityCats.includes(p.categoria)) s += 4
  if (rubro.priorityCats[0] === p.categoria) s += 2
  if (/concentrado|1\s*\+\s*\d/i.test(p.nombre)) s += 2
  return s
}

function reasonsFor(p: Producto): string[] {
  const r: string[] = []
  const m = p.nombre.match(/1\s*\+\s*(\d+)/)
  if (m) r.push(`Rinde 1+${m[1]}`)
  else if (/concentrado/i.test(p.nombre)) r.push('Concentrado')
  else if (/kit/i.test(p.nombre)) r.push('Kit')
  if (p.categoria === 'Desinfectantes' && !r.length) r.push('Desinfecta')
  if (p.categoria === 'Bouquets' && !r.length) r.push('Aroma')
  return r.slice(0, 2)
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ProductFinder() {
  const { isMobile, isTablet } = useBreakpoint()
  const { productos } = useProductos()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [rubro, setRubro] = useState<RubroKey | null>(null)
  const [nec, setNec] = useState<NecKey | null>(null)

  const rubroDef = rubro ? RUBROS[rubro] : null
  const necDef = nec ? NECESIDADES[nec] : null

  const matched = useMemo(() => {
    if (!necDef || !rubroDef) return []
    const allowRawKits = nec === 'materiasprimas'
    return productos
      .map(p => ({ p, s: scoreProduct(p, necDef, rubroDef, allowRawKits) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map(x => x.p)
  }, [productos, necDef, rubroDef, nec])

  const buildWa = () => {
    const r = rubroDef?.label ?? '—'
    const n = necDef?.label ?? '—'
    const lines = matched.length
      ? matched.slice(0, 5).map(p => `• ${p.nombre}`).join('\n')
      : '(sin coincidencias — necesito asesoramiento)'
    return encodeURIComponent(
      `Hola Química Clean!\n\nUso el asesor del sitio:\n• Rubro: ${r}\n• Necesidad: ${n}\n\nProductos sugeridos:\n${lines}\n\n¿Pueden asesorarme con precios y disponibilidad?`,
    )
  }

  const goTo = (s: 1 | 2 | 3) => setStep(s)
  const reset = () => { setStep(1); setRubro(null); setNec(null) }
  const pickRubro = (k: RubroKey) => {
    setRubro(k)
    if (nec && !RUBROS[k].needs.includes(nec)) setNec(null)
    goTo(2)
  }

  const sectionPad = isMobile ? '60px 20px' : '104px 48px'
  const rubroCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'
  const necesCount = rubroDef ? rubroDef.needs.length : 10
  const necCols = isMobile
    ? '1fr 1fr'
    : isTablet ? 'repeat(3, 1fr)'
    : `repeat(${Math.min(necesCount, 4)}, 1fr)`

  return (
    <section
      id="asesor"
      style={{
        padding: sectionPad,
        background: `linear-gradient(180deg, ${C.offWhite} 0%, ${C.white} 70%)`,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* decorative orbs */}
      <div aria-hidden style={{
        position: 'absolute', top: '-120px', right: '-120px', width: '320px', height: '320px',
        borderRadius: '50%', background: `radial-gradient(circle, ${C.blueLight}cc 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: '-140px', left: '-100px', width: '280px', height: '280px',
        borderRadius: '50%', background: `radial-gradient(circle, ${C.goldLight}aa 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1120px', margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase' as const, color: C.gold, marginBottom: '14px',
          }}>
            <span style={{ width: '28px', height: '2px', background: C.gold, display: 'inline-block' }} />
            <Icons.spark size={14} color={C.gold} />
            Asesor inteligente
            <span style={{ width: '28px', height: '2px', background: C.gold, display: 'inline-block' }} />
          </div>
          <h2 style={{
            fontFamily: 'DM Sans', fontWeight: 700,
            fontSize: isMobile ? '28px' : '38px',
            color: C.text, letterSpacing: '-0.02em', marginBottom: '12px',
            lineHeight: 1.15,
          }}>
            ¿Qué necesitás resolver?
          </h2>
          <p style={{ fontSize: '15px', color: C.textMid, maxWidth: '560px', margin: '0 auto', lineHeight: 1.55 }}>
            Te recomendamos los productos ideales para tu rubro en menos de un minuto.
          </p>
        </div>

        {/* Stepper */}
        <Stepper step={step} isMobile={isMobile} />

        {/* Step body */}
        <div key={step} className="qc-reveal qc-reveal-in" style={{ marginTop: isMobile ? '28px' : '40px' }}>

          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: rubroCols, gap: isMobile ? '12px' : '16px' }}>
              {(Object.keys(RUBROS) as RubroKey[]).map(k => {
                const r = RUBROS[k]
                return (
                  <OptionCard
                    key={k}
                    Icon={r.Icon}
                    label={r.label}
                    desc={r.desc}
                    selected={rubro === k}
                    onClick={() => pickRubro(k)}
                  />
                )
              })}
            </div>
          )}

          {step === 2 && rubroDef && (
            <>
              <AdvisorTip text={rubroDef.tip} />
              <div style={{
                display: 'grid', gridTemplateColumns: necCols,
                gap: isMobile ? '10px' : '14px',
                marginTop: isMobile ? '18px' : '24px',
              }}>
                {rubroDef.needs.map(k => {
                  const item = NECESIDADES[k]
                  return (
                    <OptionCard
                      key={k}
                      Icon={item.Icon}
                      label={item.label}
                      compact
                      selected={nec === k}
                      onClick={() => { setNec(k); goTo(3) }}
                    />
                  )
                })}
              </div>
            </>
          )}

          {step === 3 && rubroDef && necDef && (
            <Results
              rubroLabel={rubroDef.label}
              necLabel={necDef.label}
              productos={matched}
              waLink={`https://wa.me/${PHONE}?text=${buildWa()}`}
              isMobile={isMobile}
            />
          )}

          {/* Nav */}
          <div style={{
            marginTop: isMobile ? '24px' : '32px',
            display: 'flex', justifyContent: 'space-between', gap: '12px',
          }}>
            <button
              onClick={() => step === 1 ? null : goTo((step - 1) as 1 | 2)}
              disabled={step === 1}
              style={{
                background: 'transparent',
                border: `1.5px solid ${step === 1 ? C.border : C.text}`,
                color: step === 1 ? C.textLight : C.text,
                padding: '10px 18px', borderRadius: '10px',
                fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600,
                cursor: step === 1 ? 'not-allowed' : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
              }}
            >
              <Icons.arrowL size={14} />
              Atrás
            </button>

            {step === 3 && (
              <button
                onClick={reset}
                style={{
                  background: C.white,
                  border: `1.5px solid ${C.gold}`,
                  color: C.goldDark,
                  padding: '10px 18px', borderRadius: '10px',
                  fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  transition: 'background 0.2s',
                }}
              >
                <Icons.refresh size={14} />
                Nueva búsqueda
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Stepper ─────────────────────────────────────────────────────────────────
function Stepper({ step, isMobile }: { step: 1 | 2 | 3; isMobile: boolean }) {
  const labels = ['Rubro', 'Necesidad', 'Resultado']
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: isMobile ? '8px' : '14px',
      maxWidth: '500px', margin: '0 auto',
    }}>
      {[1, 2, 3].map((n, i) => {
        const active = step === n
        const done = step > n
        const onGold = done || active
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'initial' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '8px', minWidth: isMobile ? '56px' : '76px',
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: onGold ? C.gold : C.white,
                border: `2px solid ${onGold ? C.gold : C.border}`,
                color: onGold ? 'white' : C.textLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '13px',
                boxShadow: onGold ? `0 4px 12px ${C.gold}55` : 'none',
                transition: 'all 0.3s',
              }}>
                {done ? (
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                ) : n}
              </div>
              <div style={{
                fontSize: '11.5px',
                fontWeight: active ? 700 : 500,
                color: active ? C.text : C.textLight,
                letterSpacing: '0.04em',
              }}>
                {labels[i]}
              </div>
            </div>
            {i < 2 && (
              <div style={{
                flex: 1, height: '2px',
                background: done ? C.gold : C.border,
                marginBottom: '24px',
                transition: 'background 0.4s',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Advisor tip ─────────────────────────────────────────────────────────────
function AdvisorTip({ text }: { text: string }) {
  return (
    <div style={{
      display: 'flex', gap: '12px', alignItems: 'flex-start',
      background: `linear-gradient(135deg, ${C.blueLight} 0%, ${C.white} 100%)`,
      border: `1px solid ${C.blue}22`,
      borderLeft: `3px solid ${C.blue}`,
      borderRadius: '10px',
      padding: '12px 16px',
      maxWidth: '720px', margin: '0 auto',
    }}>
      <div style={{
        flexShrink: 0,
        width: '28px', height: '28px', borderRadius: '50%',
        background: C.white, border: `1.5px solid ${C.blue}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.blue,
      }}>
        <Icons.spark size={14} color={C.blue} />
      </div>
      <div style={{ fontSize: '13.5px', color: C.text, lineHeight: 1.5, paddingTop: '4px' }}>
        <span style={{ fontWeight: 700, color: C.blueDark }}>Tip del asesor:</span> {text}
      </div>
    </div>
  )
}

// ─── OptionCard ──────────────────────────────────────────────────────────────
function OptionCard({
  Icon, label, desc, selected, onClick, compact = false,
}: {
  Icon: IconCmp; label: string; desc?: string; selected: boolean
  onClick: () => void; compact?: boolean
}) {
  const iconColor = selected ? C.goldDark : C.blue
  return (
    <button
      onClick={onClick}
      className="qc-card-lift"
      style={{
        background: selected ? C.goldLight : C.white,
        border: `1.5px solid ${selected ? C.gold : C.border}`,
        borderRadius: '14px',
        padding: compact ? '18px 12px' : '22px 20px',
        textAlign: compact ? 'center' : 'left',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        gap: compact ? '10px' : '12px',
        alignItems: compact ? 'center' : 'flex-start',
        minHeight: compact ? '118px' : '130px',
        fontFamily: 'DM Sans, sans-serif',
        boxShadow: selected
          ? `0 8px 20px ${C.gold}25`
          : '0 1px 3px rgba(0,0,0,0.04)',
        position: 'relative',
        transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{
        width: compact ? '42px' : '48px',
        height: compact ? '42px' : '48px',
        borderRadius: '10px',
        background: selected ? C.white : `${iconColor}11`,
        border: `1px solid ${selected ? C.gold : 'transparent'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: iconColor,
        transition: 'background 0.2s, color 0.2s',
      }}>
        <Icon size={compact ? 22 : 26} color={iconColor} />
      </div>
      <div style={{
        fontWeight: 700, fontSize: compact ? '13px' : '15.5px',
        color: C.text, lineHeight: 1.3,
      }}>{label}</div>
      {desc && !compact && (
        <div style={{ fontSize: '12.5px', color: C.textMid, lineHeight: 1.5 }}>{desc}</div>
      )}
    </button>
  )
}

// ─── Results ─────────────────────────────────────────────────────────────────
function Results({
  rubroLabel, necLabel, productos, waLink, isMobile,
}: {
  rubroLabel: string; necLabel: string
  productos: Producto[]
  waLink: string; isMobile: boolean
}) {
  const empty = productos.length === 0
  return (
    <>
      {/* Summary bar */}
      <div style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: '14px',
        padding: isMobile ? '18px 16px' : '22px 26px',
        marginBottom: isMobile ? '18px' : '24px',
        display: 'flex', flexWrap: 'wrap', gap: '16px',
        alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div>
          <div style={{
            fontSize: '11px', color: C.textMid, letterSpacing: '0.08em',
            textTransform: 'uppercase' as const, marginBottom: '6px',
            fontWeight: 600,
          }}>
            {empty
              ? 'Recomendación del asesor'
              : `${productos.length} ${productos.length === 1 ? 'producto recomendado' : 'productos recomendados'}`}
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: C.text, lineHeight: 1.4 }}>
            {rubroLabel}
            <span style={{ color: C.textLight, fontWeight: 400, margin: '0 8px' }}>·</span>
            {necLabel}
          </div>
        </div>
        <a href={waLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <button className="qc-btn-wa" style={{
            padding: '12px 22px', borderRadius: '10px',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13.5px',
          }}>
            <WhatsAppIcon size={16} color="white" />
            Pedir cotización
          </button>
        </a>
      </div>

      {empty ? (
        <div style={{
          background: C.white, border: `1px dashed ${C.border}`, borderRadius: '14px',
          padding: '40px 24px', textAlign: 'center',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: C.blueLight, color: C.blue,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '12px',
          }}>
            <Icons.message size={26} color={C.blue} />
          </div>
          <div style={{ fontWeight: 700, color: C.text, marginBottom: '6px', fontSize: '16px' }}>
            Te asesoramos personalmente
          </div>
          <p style={{ fontSize: '13.5px', color: C.textMid, marginBottom: '18px', maxWidth: '380px', margin: '0 auto 18px' }}>
            Contanos por WhatsApp qué necesitás y armamos una propuesta a medida.
          </p>
          <a href={waLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <button className="qc-btn-wa" style={{
              padding: '12px 22px', borderRadius: '10px',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13.5px',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              <WhatsAppIcon size={16} color="white" />
              Escribir por WhatsApp
            </button>
          </a>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: isMobile ? '12px' : '16px',
        }}>
          {productos.map(p => {
            const reasons = reasonsFor(p)
            return (
              <Link key={p.id} href={`/productos/${p.id}`} style={{ textDecoration: 'none' }}>
                <div className="qc-card-lift-sm" style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: '14px', overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  height: '100%', display: 'flex', flexDirection: 'column',
                }}>
                  <MiniThumb id={p.id} imageUrl={p.imagen_url ?? undefined} color={p.color ?? undefined} color2={p.color2 ?? undefined} emoji={p.emoji ?? undefined} />
                  <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <div style={{ fontSize: '10px', color: C.blue, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
                      {p.categoria}
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
                      {p.nombre}
                    </div>
                    {reasons.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                        {reasons.map(r => (
                          <span key={r} style={{
                            fontSize: '10px', fontWeight: 600,
                            background: C.goldLight, color: C.goldDark,
                            padding: '3px 7px', borderRadius: '999px',
                            letterSpacing: '0.02em',
                          }}>{r}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ flex: 1 }} />
                    <div style={{ fontSize: '11px', color: C.gold, fontWeight: 600, marginTop: '6px' }}>
                      Ver detalles →
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

function MiniThumb({ id, imageUrl, color, color2, emoji }: {
  id: number; imageUrl?: string; color?: string; color2?: string; emoji?: string
}) {
  const [err, setErr] = useState(false)
  const bg = color2
    ? `linear-gradient(135deg, ${color} 50%, ${color2} 50%)`
    : color || `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`
  const src = imageUrl || `/products/${id}.jpg`
  return (
    <div style={{
      position: 'relative', height: '120px', background: bg, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {!err && (
        <Image src={src} alt="" fill sizes="220px" onError={() => setErr(true)} style={{ objectFit: 'cover' }} />
      )}
      {err && emoji && (
        <span style={{ fontSize: '34px', position: 'relative', zIndex: 1 }}>{emoji}</span>
      )}
    </div>
  )
}
