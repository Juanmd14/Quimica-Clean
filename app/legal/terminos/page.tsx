'use client'

export default function TerminosDeUso() {
  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: '#f9f7f4',
      minHeight: '100vh',
      padding: '0',
    }}>
      <div style={{
        background: '#1a2e1a',
        padding: '48px 32px 40px',
        textAlign: 'center',
      }}>
        <p style={{
          color: '#8db88d',
          fontSize: '11px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          margin: '0 0 12px',
          fontFamily: "'Helvetica Neue', sans-serif",
          fontWeight: 500,
        }}>
          Química Clean
        </p>
        <h1 style={{
          color: '#f0ece4',
          fontSize: 'clamp(24px, 5vw, 38px)',
          fontWeight: 400,
          margin: '0 0 12px',
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
        }}>
          Términos de Uso
        </h1>
        <p style={{
          color: '#6b8f6b',
          fontSize: '13px',
          margin: 0,
          fontFamily: "'Helvetica Neue', sans-serif",
        }}>
          Última actualización: 20 de mayo de 2026
        </p>
      </div>

      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '40px 24px 0',
      }}>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.75',
          color: '#4a4a4a',
          borderLeft: '3px solid #8db88d',
          paddingLeft: '20px',
          margin: '0 0 40px',
          fontStyle: 'italic',
        }}>
          Al navegar este sitio aceptás estos términos. Es un catálogo informativo:
          no vendemos online ni procesamos pagos. Las consultas se canalizan por
          WhatsApp o email.
        </p>
      </div>

      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '0 24px 64px',
      }}>
        {sections.map((s, i) => (
          <Section key={i} number={i + 1} title={s.title} text={s.text} />
        ))}

        <div style={{
          marginTop: '48px',
          background: '#1a2e1a',
          borderRadius: '4px',
          padding: '32px',
          color: '#c8dcc8',
          fontFamily: "'Helvetica Neue', sans-serif",
        }}>
          <p style={{
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#8db88d',
            margin: '0 0 16px',
            fontWeight: 600,
          }}>
            Contacto
          </p>
          <p style={{ margin: '0 0 6px', fontSize: '15px' }}>
            <strong style={{ color: '#f0ece4' }}>Química Clean</strong>
          </p>
          <p style={{ margin: '0 0 4px', fontSize: '14px' }}>San Miguel de Tucumán, Argentina</p>
          <p style={{ margin: '0 0 4px', fontSize: '14px' }}>
            <a href="mailto:admquimicaclean@gmail.com" style={{ color: '#8db88d', textDecoration: 'none' }}>
              admquimicaclean@gmail.com
            </a>
          </p>
          <p style={{ margin: 0, fontSize: '14px' }}>
            <a href="https://wa.me/5493813046228" style={{ color: '#8db88d', textDecoration: 'none' }}>
              +54 9 381 304-6228
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

function Section({ number, title, text }: { number: number; title: string; text: string[] }) {
  return (
    <div style={{
      borderTop: '1px solid #ddd8d0',
      paddingTop: '28px',
      marginBottom: '28px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '12px' }}>
        <span style={{
          fontSize: '11px',
          fontFamily: "'Helvetica Neue', sans-serif",
          color: '#8db88d',
          fontWeight: 700,
          letterSpacing: '1px',
          minWidth: '20px',
        }}>
          {String(number).padStart(2, '0')}
        </span>
        <h2 style={{
          fontSize: '17px',
          fontWeight: 700,
          color: '#1a2e1a',
          margin: 0,
          fontFamily: "'Helvetica Neue', sans-serif",
          letterSpacing: '0.3px',
        }}>
          {title}
        </h2>
      </div>
      <div style={{ paddingLeft: '32px' }}>
        {text.map((line, i) => (
          <p key={i} style={{
            fontSize: '15px',
            lineHeight: '1.75',
            color: '#4a4a4a',
            margin: '0 0 10px',
          }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}

const sections = [
  {
    title: 'Uso del sitio',
    text: [
      'Química Clean es un catálogo informativo de productos de limpieza y materias primas. La información mostrada (descripciones, imágenes, categorías) tiene fines orientativos.',
      'El sitio no realiza ventas en línea ni procesa pagos. Toda transacción comercial se acuerda directamente con el equipo de ventas por WhatsApp o email.',
    ],
  },
  {
    title: 'Disponibilidad y precios',
    text: [
      'Los productos exhibidos están sujetos a disponibilidad de stock. Los precios y condiciones comerciales se informan al momento de la consulta y pueden modificarse sin previo aviso.',
      'Las imágenes son referenciales: el envase, presentación o color del producto entregado puede variar respecto del mostrado en el sitio.',
    ],
  },
  {
    title: 'Pedidos y entregas',
    text: [
      'Los pedidos se confirman por escrito (WhatsApp o email) con el equipo de ventas. Los plazos, formas de envío y mínimos de compra se acuerdan caso por caso.',
      'Realizamos envíos a todo el país. Los costos de logística no están incluidos salvo que se indique lo contrario.',
    ],
  },
  {
    title: 'Propiedad intelectual',
    text: [
      'Los contenidos del sitio (textos, imágenes, logos, diseño) son propiedad de Química Clean o se utilizan con autorización. No está permitida su reproducción sin consentimiento previo.',
    ],
  },
  {
    title: 'Limitación de responsabilidad',
    text: [
      'Nos esforzamos por mantener la información actualizada, pero no garantizamos exactitud absoluta de descripciones técnicas, fichas de seguridad o usos sugeridos. Ante dudas, consultá con nuestro equipo antes de aplicar un producto.',
      'Los productos químicos deben utilizarse siguiendo las indicaciones del fabricante y normas de seguridad vigentes.',
    ],
  },
  {
    title: 'Privacidad',
    text: [
      'El tratamiento de datos personales se rige por nuestra Política de Privacidad, disponible en /legal.',
    ],
  },
  {
    title: 'Ley aplicable',
    text: [
      'Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia se someterá a los tribunales ordinarios de la Provincia de Tucumán.',
    ],
  },
]
