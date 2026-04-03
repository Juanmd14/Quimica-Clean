'use client'

export default function PoliticaPrivacidad() {
  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: '#f9f7f4',
      minHeight: '100vh',
      padding: '0',
    }}>
      {/* Header */}
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
          Política de Privacidad
        </h1>
        <p style={{
          color: '#6b8f6b',
          fontSize: '13px',
          margin: 0,
          fontFamily: "'Helvetica Neue', sans-serif",
        }}>
          Última actualización: 3 de abril de 2026
        </p>
      </div>

      {/* Intro */}
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
          Este sitio es un catálogo informativo. No vendemos en línea, no creamos cuentas
          de usuario y no rastreamos tu navegación. Solo nos contactás si te interesa
          algún producto.
        </p>
      </div>

      {/* Sections */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '0 24px 64px',
      }}>
        {sections.map((s, i) => (
          <Section key={i} number={i + 1} title={s.title} text={s.text} />
        ))}

        {/* Contact block */}
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
    title: 'Qué es este sitio',
    text: [
      'Química Clean es un catálogo digital de productos de limpieza y materias primas. Podés navegar, ver descripciones y contactarnos para consultas comerciales.',
      'No es una tienda en línea: no se realizan compras ni pagos a través del sitio.',
    ],
  },
  {
    title: 'No almacenamos usuarios ni usamos cookies',
    text: [
      'Este sitio no crea cuentas de usuario, no guarda historial de navegación y no utiliza cookies de ningún tipo. No hay rastreo de comportamiento ni publicidad dirigida.',
    ],
  },
  {
    title: 'Datos que recopilamos',
    text: [
      'Solo recibimos los datos que vos nos enviás voluntariamente, a través de dos canales:',
      '• Formulario de contacto: nombre, teléfono, email y mensaje. Estos datos son atendidos por nuestro equipo de ventas para responder tu consulta.',
      '• WhatsApp: si nos escribís directamente, la conversación queda bajo las políticas de privacidad de dicha plataforma.',
      'No compartimos tus datos con terceros.',
    ],
  },
  {
    title: 'Consentimiento',
    text: [
      'Al enviar el formulario de contacto, aceptás que tus datos sean utilizados para contactarte con fines comerciales, conforme a la Ley 25.326 de Protección de Datos Personales de la República Argentina.',
    ],
  },
  {
    title: 'Por cuánto tiempo guardamos tus datos',
    text: [
      'Conservamos tus datos el tiempo necesario para gestionar tu consulta y hasta un máximo de 2 años, salvo que la normativa vigente exija un plazo diferente.',
    ],
  },
  {
    title: 'Tus derechos',
    text: [
      'Conforme a la Ley 25.326, tenés derecho a acceder, rectificar o eliminar tus datos personales. Para ejercerlos, contactanos por email a admquimicaclean@gmail.com.',
    ],
  },
]