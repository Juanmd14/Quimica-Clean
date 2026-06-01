'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { C } from './constants'
import { WhatsAppIcon } from './ui'
import { useBreakpoint } from '@/lib/hooks'
import { useProductos } from '@/lib/useProductos'

const PHONE = '543813046228'

type RubroKey = 'hospitalidad' | 'salud' | 'industrial' | 'domestico' | 'automotriz'
type NecKey =
  | 'pisos' | 'cocinas' | 'banos' | 'ropa' | 'vidrios'
  | 'desinfeccion' | 'aromatizacion' | 'piletas' | 'auto' | 'materiasprimas'

const RUBROS: { key: RubroKey; label: string; emoji: string; desc: string }[] = [
  { key: 'hospitalidad', label: 'Hotelería y gastronomía', emoji: '🏨', desc: 'Hoteles, restaurantes, cocinas industriales' },
  { key: 'salud',        label: 'Salud y limpieza profesional', emoji: '🏥', desc: 'Clínicas, oficinas, empresas de limpieza' },
  { key: 'industrial',   label: 'Industria y taller', emoji: '🏭', desc: 'Fábricas, depósitos, mantenimiento' },
  { key: 'domestico',    label: 'Doméstico / Revendedor', emoji: '🛒', desc: 'Almacenes, kioscos, venta minorista' },
  { key: 'automotriz',   label: 'Lavaderos y automotor', emoji: '🚗', desc: 'Lavaderos, talleres, detailing' },
]

const NECESIDADES: Record<NecKey, { label: string; emoji: string; cats: string[]; keyword?: string }> = {
  pisos:          { label: 'Pisos y superficies',     emoji: '🧹', cats: ['Pisos', 'Hogar', 'Concentrados'], keyword: 'piso' },
  cocinas:        { label: 'Cocinas y desengrase',    emoji: '🍳', cats: ['Desengrasantes', 'Concentrados'] },
  banos:          { label: 'Baños y sanitarios',      emoji: '🚿', cats: ['Desinfectantes', 'Desengrasantes'] },
  ropa:           { label: 'Ropa y textiles',         emoji: '👕', cats: ['Jabones', 'Suavizantes', 'Detergentes'] },
  vidrios:        { label: 'Vidrios y brillo',        emoji: '🪟', cats: ['Concentrados', 'Hogar'], keyword: 'vidrio' },
  desinfeccion:   { label: 'Desinfección',            emoji: '🦠', cats: ['Desinfectantes'] },
  aromatizacion:  { label: 'Aromatización',           emoji: '🌸', cats: ['Bouquets', 'Hogar'] },
  piletas:        { label: 'Piletas',                 emoji: '🏊', cats: ['Piletas'] },
  auto:           { label: 'Auto y lavadero',         emoji: '🚙', cats: ['Automotor'] },
  materiasprimas: { label: 'Materias primas',         emoji: '⚗️', cats: ['Materia Prima', 'Contenedores'] },
}

export function ProductFinder() {
  const { isMobile, isTablet } = useBreakpoint()
  const { productos } = useProductos()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [rubro, setRubro] = useState<RubroKey | null>(null)
  const [nec, setNec] = useState<NecKey | null>(null)

  const matched = useMemo(() => {
    if (!nec) return []
    const def = NECESIDADES[nec]
    let list = productos.filter(p => def.cats.includes(p.categoria))
    if (def.keyword) {
      const k = def.keyword.toLowerCase()
      const refined = list.filter(p => p.nombre.toLowerCase().includes(k))
      if (refined.length) list = refined
    }
    return list.slice(0, 6)
  }, [productos, nec])

  const buildWa = () => {
    const r = rubro ? RUBROS.find(x => x.key === rubro)!.label : '—'
    const n = nec ? NECESIDADES[nec].label : '—'
    const lines = matched.length
      ? matched.slice(0, 5).map(p => `• ${p.nombre}`).join('\n')
      : '(sin coincidencias — necesito asesoramiento)'
    return encodeURIComponent(
      `Hola Química Clean!\n\nUso el buscador del sitio:\n• Rubro: ${r}\n• Necesidad: ${n}\n\nProductos sugeridos:\n${lines}\n\n¿Pueden asesorarme con precios y disponibilidad?`,
    )
  }

  const goTo = (s: 1 | 2 | 3) => setStep(s)
  const reset = () => { setStep(1); setRubro(null); setNec(null) }

  const sectionPad = isMobile ? '56px 20px' : '96px 48px'
  const optionCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'
  const necCols    = isMobile ? '1fr 1fr' : isTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)'

  return (
    <section
      id="asesor"
      style={{
        padding: sectionPad,
        background: `linear-gradient(160deg, ${C.blueLight} 0%, ${C.white} 70%)`,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '28px' : '44px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, color: C.gold, marginBottom: '14px',
          }}>
            <span style={{ width: '24px', height: '2px', background: C.gold, display: 'inline-block' }} />
            Asesor inteligente
            <span style={{ width: '24px', height: '2px', background: C.gold, display: 'inline-block' }} />
          </div>
          <h2 style={{
            fontFamily: 'DM Sans', fontWeight: 700,
            fontSize: isMobile ? '26px' : '34px',
            color: C.text, letterSpacing: '-0.02em', marginBottom: '10px',
          }}>
            ¿Qué necesitás resolver?
          </h2>
          <p style={{ fontSize: '14px', color: C.textMid, maxWidth: '520px', margin: '0 auto' }}>
            Te ayudamos a encontrar el producto adecuado en menos de un minuto.
          </p>
        </div>

        {/* Stepper */}
        <Stepper step={step} isMobile={isMobile} />

        {/* Steps body — key forces remount → fadeUp re-plays */}
        <div key={step} className="qc-reveal qc-reveal-in" style={{ marginTop: isMobile ? '24px' : '36px' }}>

          {step === 1 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: optionCols, gap: isMobile ? '10px' : '14px' }}>
                {RUBROS.map(r => (
                  <OptionCard
                    key={r.key}
                    emoji={r.emoji}
                    label={r.label}
                    desc={r.desc}
                    selected={rubro === r.key}
                    onClick={() => { setRubro(r.key); goTo(2) }}
                  />
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: necCols, gap: isMobile ? '8px' : '12px' }}>
                {(Object.keys(NECESIDADES) as NecKey[]).map(k => {
                  const item = NECESIDADES[k]
                  return (
                    <OptionCard
                      key={k}
                      emoji={item.emoji}
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

          {step === 3 && (
            <Results
              rubroLabel={rubro ? RUBROS.find(x => x.key === rubro)!.label : ''}
              necLabel={nec ? NECESIDADES[nec].label : ''}
              productos={matched}
              waLink={`https://wa.me/${PHONE}?text=${buildWa()}`}
              isMobile={isMobile}
            />
          )}

          {/* Nav buttons */}
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
                padding: '10px 18px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600,
                cursor: step === 1 ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
              }}
            >
              ← Atrás
            </button>

            {step === 3 && (
              <button
                onClick={reset}
                style={{
                  background: C.white,
                  border: `1.5px solid ${C.gold}`,
                  color: C.gold,
                  padding: '10px 18px', borderRadius: '8px',
                  fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                ↻ Nueva búsqueda
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
      gap: isMobile ? '10px' : '14px',
      maxWidth: '480px', margin: '0 auto',
    }}>
      {[1, 2, 3].map((n, i) => {
        const active = step === n
        const done = step > n
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'initial' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: isMobile ? '52px' : '70px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: done ? C.gold : active ? C.gold : C.white,
                border: `2px solid ${done || active ? C.gold : C.border}`,
                color: done || active ? 'white' : C.textLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '13px',
                transition: 'all 0.25s',
              }}>
                {done ? '✓' : n}
              </div>
              <div style={{
                fontSize: '11px',
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
                marginBottom: '20px',
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── OptionCard ──────────────────────────────────────────────────────────────
function OptionCard({
  emoji, label, desc, selected, onClick, compact = false,
}: {
  emoji: string; label: string; desc?: string; selected: boolean
  onClick: () => void; compact?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="qc-card-lift"
      style={{
        background: selected ? C.goldLight : C.white,
        border: `1.5px solid ${selected ? C.gold : C.border}`,
        borderRadius: '14px',
        padding: compact ? '16px 12px' : '20px 18px',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: '8px',
        alignItems: compact ? 'center' : 'flex-start',
        minHeight: compact ? '108px' : '120px',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <div style={{
        fontSize: compact ? '28px' : '32px',
        lineHeight: 1,
        marginBottom: compact ? '4px' : '6px',
      }}>{emoji}</div>
      <div style={{
        fontWeight: 700, fontSize: compact ? '12.5px' : '15px',
        color: C.text, lineHeight: 1.3,
        textAlign: compact ? 'center' : 'left',
      }}>{label}</div>
      {desc && !compact && (
        <div style={{ fontSize: '12px', color: C.textMid, lineHeight: 1.45 }}>{desc}</div>
      )}
    </button>
  )
}

// ─── Results ─────────────────────────────────────────────────────────────────
function Results({
  rubroLabel, necLabel, productos, waLink, isMobile,
}: {
  rubroLabel: string; necLabel: string
  productos: ReturnType<typeof useProductos>['productos']
  waLink: string; isMobile: boolean
}) {
  const empty = productos.length === 0
  return (
    <>
      <div style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: '14px',
        padding: isMobile ? '18px 16px' : '24px 28px',
        marginBottom: isMobile ? '18px' : '24px',
        display: 'flex', flexWrap: 'wrap', gap: '16px',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: C.textMid, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
            Para tu búsqueda
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: C.text }}>
            {rubroLabel} <span style={{ color: C.textLight, fontWeight: 400 }}>·</span> {necLabel}
          </div>
        </div>
        <a href={waLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <button className="qc-btn-wa" style={{
            padding: '11px 20px', borderRadius: '8px',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px',
          }}>
            <WhatsAppIcon size={16} color="white" />
            Pedir cotización
          </button>
        </a>
      </div>

      {empty ? (
        <div style={{
          background: C.white, border: `1px dashed ${C.border}`, borderRadius: '14px',
          padding: '36px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '34px', marginBottom: '8px' }}>🤝</div>
          <div style={{ fontWeight: 700, color: C.text, marginBottom: '6px' }}>
            No encontramos coincidencia exacta
          </div>
          <p style={{ fontSize: '13px', color: C.textMid, marginBottom: '16px' }}>
            Contanos qué necesitás por WhatsApp y te asesoramos.
          </p>
          <a href={waLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <button className="qc-btn-wa" style={{
              padding: '11px 20px', borderRadius: '8px',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px',
            }}>
              Escribir por WhatsApp
            </button>
          </a>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: isMobile ? '10px' : '14px',
        }}>
          {productos.map(p => (
            <Link key={p.id} href={`/productos/${p.id}`} style={{ textDecoration: 'none' }}>
              <div className="qc-card-lift-sm" style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: '14px', overflow: 'hidden',
              }}>
                <MiniThumb id={p.id} imageUrl={p.imagen_url ?? undefined} color={p.color ?? undefined} color2={p.color2 ?? undefined} emoji={p.emoji ?? undefined} />
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', color: C.blue, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                    {p.categoria}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: '4px' }}>
                    {p.nombre}
                  </div>
                  <div style={{ fontSize: '11px', color: C.gold, fontWeight: 600 }}>
                    Ver detalles →
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
      position: 'relative', height: '110px', background: bg, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {!err && (
        <Image src={src} alt="" fill sizes="200px" onError={() => setErr(true)} style={{ objectFit: 'cover' }} />
      )}
      {err && emoji && (
        <span style={{ fontSize: '32px', position: 'relative', zIndex: 1 }}>{emoji}</span>
      )}
    </div>
  )
}

