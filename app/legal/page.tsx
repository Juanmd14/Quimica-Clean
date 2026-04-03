'use client'

const sections = [
  {
    id: 'privacidad',
    title: 'Política de Privacidad',
    content: `
      <h3>1. RESPONSABLE DEL TRATAMIENTO DE DATOS</h3>
      <p><strong>Química Clean</strong><br/>San Miguel de Tucumán, Argentina<br/>Email: admquimicaclean@gmail.com</p>

      <h3>2. DATOS PERSONALES QUE RECOPILAMOS</h3>
      <p>Recopilamos y procesamos los siguientes datos personales:</p>
      <ul>
        <li>Nombre y apellido</li>
        <li>Número de teléfono</li>
        <li>Dirección de correo electrónico</li>
        <li>Empresa/razón social (opcional)</li>
        <li>Información sobre productos de interés</li>
        <li>Mensajes y consultas enviadas a través de nuestros formularios</li>
      </ul>

      <h3>3. BASE LEGAL Y FINALIDAD</h3>
      <p>Los datos se procesan con base en:</p>
      <ul>
        <li><strong>Consentimiento:</strong> Cuando completas formularios y solicitas información</li>
        <li><strong>Ejecución de contrato:</strong> Para procesar pedidos y consultas comerciales</li>
        <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y comunicaciones</li>
      </ul>

      <h3>4. RETENCIÓN DE DATOS</h3>
      <p>Conservamos tus datos mientras mantengas una relación comercial con nosotros y durante el tiempo legal requerido (mínimo 2 años) para cumplir obligaciones fiscales y legales.</p>

      <h3>5. SEGURIDAD</h3>
      <p>Implementamos medidas técnicas y organizativas para proteger tus datos personales contra acceso no autorizado, alteración o pérdida.</p>

      <h3>6. DERECHOS DEL USUARIO</h3>
      <p>Tienes derecho a:</p>
      <ul>
        <li>Acceder a tus datos personales</li>
        <li>Solicitar su rectificación o actualización</li>
        <li>Solicitar su eliminación (excepto donde existan obligaciones legales)</li>
        <li>Oponerme al procesamiento de tus datos</li>
        <li>Revocar tu consentimiento</li>
      </ul>
      <p>Para ejercer estos derechos, contacta a admquimicaclean@gmail.com</p>

      <h3>7. CAMBIOS EN ESTA POLÍTICA</h3>
      <p>Nos reservamos el derecho de actualizar esta política. Notificaremos cambios significativos mediante email o publicación en el sitio.</p>

      <p><strong>Última actualización: 3 de Abril de 2026</strong></p>
    `
  },
  {
    id: 'terminos',
    title: 'Términos de Uso',
    content: `
      <h3>1. ACEPTACIÓN DE TÉRMINOS</h3>
      <p>Al acceder y utilizar este sitio web perteneciente a <strong>Química Clean</strong>, aceptas estar vinculado por estos términos y condiciones. Si no estás de acuerdo, no uses el sitio.</p>

      <h3>2. USO AUTORIZADO</h3>
      <p>Este sitio está destinado a proporcionar información sobre nuestros productos y servicios. Te comprometes a:</p>
      <ul>
        <li>No violar leyes o regulaciones aplicables</li>
        <li>No enviar contenido fraudulento, difamatorio u ofensivo</li>
        <li>No interferir con la funcionalidad o seguridad del sitio</li>
        <li>Respetar los derechos de propiedad intelectual</li>
      </ul>

      <h3>3. PROPIEDAD INTELECTUAL</h3>
      <p>Todo el contenido del sitio (textos, imágenes, diseño, logos) es propiedad de Química Clean o tiene licencia correspondiente. No puedes reproducir, distribuir o transmitir este contenido sin permiso expreso.</p>

      <h3>4. DESCARGO DE RESPONSABILIDAD</h3>
      <p>El contenido se proporciona "tal cual" sin garantías de ningún tipo. Aunque realizamos esfuerzos por mantener información precisa y actualizada, no garantizamos exactitud, completitud o ausencia de errores.</p>

      <h3>5. LIMITACIÓN DE RESPONSABILIDAD</h3>
      <p>Química Clean no será responsable por daños indirectos, incidentales, especiales o consecuentes derivados del uso o imposibilidad de usar este sitio, incluso si ha sido informado de la posibilidad de tales daños.</p>

      <h3>6. ENLACES EXTERNOS</h3>
      <p>Este sitio puede contener enlaces a sitios de terceros. No somos responsables por el contenido, precisión o prácticas de privacidad de sitios externos.</p>

      <h3>7. MODIFICACIÓN DE TÉRMINOS</h3>
      <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entran en vigor inmediatamente. Tu uso continuado del sitio constituye aceptación de los términos modificados.</p>

      <h3>8. LEY APLICABLE</h3>
      <p>Estos términos se rigen por las leyes de Argentina. Cualquier disputa se resolverá en los tribunales competentes de Tucumán.</p>

      <p><strong>Última actualización: 3 de Abril de 2026</strong></p>
    `
  },
  {
    id: 'aviso-legal',
    title: 'Aviso Legal',
    content: `
      <h3>1. IDENTIFICACIÓN</h3>
      <p><strong>Nombre Comercial:</strong> Química Clean<br/>
      <strong>Ubicación:</strong> San Miguel de Tucumán, Argentina<br/>
      <strong>Teléfono:</strong> +54 9 381 304-6228<br/>
      <strong>Email:</strong> admquimicaclean@gmail.com</p>

      <h3>2. INFORMACIÓN DEL SITIO</h3>
      <p>Este sitio web proporciona información sobre productos de limpieza y materias primas destinados a uso industrial y comercial. Los precios y disponibilidad están sujetos a cambios sin previo aviso.</p>

      <h3>3. RESPONSABILIDAD POR CONTENIDO</h3>
      <p>Nos esforzamos por proporcionar información precisa y actualizada. Sin embargo, no garantizamos que todo el contenido sea completamente exacto, oportuno o completo.</p>

      <h3>4. GARANTÍAS DE PRODUCTOS</h3>
      <p>Las garantías, especificaciones técnicas y características de nuestros productos se describen en fichas técnicas adjuntas. Para reclamaciones de garantía, contacta directamente con nuestro equipo comercial.</p>

      <h3>5. POLÍTICA DE DEVOLUCIONES</h3>
      <p>Las devoluciones deben realizarse de acuerdo con nuestras políticas comerciales. Los productos deben estar en condiciones originales de venta. Contacta a admquimicaclean@gmail.com para procesos de devolución.</p>

      <h3>6. CONFIDENCIALIDAD COMERCIAL</h3>
      <p>Toda información comercial intercambiada será tratada con confidencialidad y solo se utilizará para propósitos transaccionales y comerciales.</p>

      <h3>7. EXCLUSIÓN DE RESPONSABILIDAD</h3>
      <p>No seremos responsables por:</p>
      <ul>
        <li>Daños derivados del uso de nuestros productos fuera de los parámetros especificados</li>
        <li>Accidentes, lesiones o daños causados por manipulación inadecuada</li>
        <li>Interrupciones del servicio o acceso al sitio web</li>
      </ul>

      <h3>8. USO DE DATOS DE ACCESO</h3>
      <p>Podemos recopilar información sobre tu acceso al sitio (dirección IP, tipo de navegador) con propósitos analíticos y de seguridad.</p>

      <p><strong>Última actualización: 3 de Abril de 2026</strong></p>
    `
  },
  {
    id: 'cookies',
    title: 'Política de Cookies',
    content: `
      <h3>1. POLÍTICA DE COOKIES SIMPLE Y TRANSPARENTE</h3>
      <p>En <strong>Química Clean</strong> creemos en la transparencia. Este sitio web es una plataforma informativa sobre nuestros productos y servicios, y queremos que sepas exactamente qué datos recopilamos.</p>

      <h3>2. COOKIES EN NUESTRO SITIO WEB PARA VISITANTES</h3>
      <p><strong>La realidad: NO utilizamos cookies en el sitio web público.</strong></p>
      <p>Cuando visitas chemistryquimica-clean.vercel.app, tu navegador no recibe ni almacena cookies propias del sitio. Esto significa:</p>
      <ul>
        <li>✓ No hay rastreo de tu comportamiento de navegación</li>
        <li>✓ No hay análisis de datos mediante Google Analytics ni servicios similares</li>
        <li>✓ No hay identificadores persistentes que nos permitan reconocerte en futuras visitas</li>
        <li>✓ No hay cookies de publicidad o remarketing</li>
      </ul>

      <h3>3. SERVICIOS EXTERNOS</h3>
      <p>El único servicio externo disponible en el sitio es un <strong>enlace a WhatsApp</strong> para comunicarte directamente con nosotros. Este enlace es completamente opcional y no genera cookies. Al hacer clic, eres redirigido al servidor de WhatsApp donde se aplica su propia política de privacidad.</p>

      <h3>4. INFORMACIÓN TÉCNICA QUE RECOPILAMOS</h3>
      <p>Tu servidor web (independiente de nosotros) puede registrar automáticamente:</p>
      <ul>
        <li>Tu dirección IP</li>
        <li>Tipo y versión del navegador</li>
        <li>Sistema operativo</li>
        <li>Páginas visitadas</li>
        <li>Fecha y hora de acceso</li>
      </ul>
      <p>Estos datos se usan exclusivamente para seguridad del servidor y diagnóstico de problemas técnicos, <strong>no para marketing ni perfilado.</strong></p>

      <h3>6. CONTACTO A TRAVÉS DE FORMULARIOS</h3>
      <p>Si completas un formulario de contacto o consulta, los datos que proporcionas (nombre, teléfono, email, mensaje) se procesan según nuestra <strong>Política de Privacidad</strong>. Esta información no genera cookies; se almacena en nuestros servidores seguros para responder a tu consulta.</p>

      <h3>7. TECNOLOGÍAS DE RASTREO RECHAZADAS</h3>
      <p>Explícitamente <strong>no utilizamos</strong>:</p>
      <ul>
        <li>Google Analytics o similares</li>
        <li>Pixel tracking o web beacons</li>
        <li>Cookies de perfilado</li>
        <li>Identificadores de sesión para visitantes</li>
        <li>Servicios de retargeting o publicidad programática</li>
      </ul>

      <h3>8. DERECHO A PRIVACIDAD</h3>
      <p>Tu privacidad es importante. Puedes visitar nuestro sitio con total confianza en que no estamos recopilando datos sobre tu comportamiento. Si en algún momento esto cambia, actualizaremos esta política y notificaremos los cambios significativos.</p>

      <h3>9. PREGUNTAS</h3>
      <p>Si tienes dudas sobre nuestra política de cookies o privacidad, contáctanos a <strong>admquimicaclean@gmail.com</strong>.</p>

      <p><strong>Última actualización: 3 de Abril de 2026</strong></p>
    `
  },
]

import { useState } from 'react'
import Link from 'next/link'

const C = {
  white: '#ffffff',
  offWhite: '#f8f9fb',
  gold: '#e7a73f',
  goldLight: '#fdf3e0',
  blue: '#2b7bb8',
  blueLight: '#e8f2fb',
  text: '#1a2332',
  textMid: '#4a5568',
  textLight: '#8a9ab0',
  border: '#e2e8f0',
  dark: '#0d1520',
}

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState('privacidad')
  const activeContent = sections.find(s => s.id === activeSection)

  return (
    <main style={{ minHeight: '100vh', background: C.offWhite, paddingTop: '88px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: C.text, marginBottom: '8px', textAlign: 'center' }}>
          Información Legal
        </h1>
        <p style={{ fontSize: '15px', color: C.textMid, textAlign: 'center', marginBottom: '40px' }}>
          Políticas y términos de Química Clean
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '32px' }}>
          {/* Sidebar */}
          <nav style={{
            background: C.white,
            borderRadius: '14px',
            padding: '24px',
            border: `1px solid ${C.border}`,
            height: 'fit-content',
            position: 'sticky',
            top: '100px',
          }}>
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  width: '100%',
                  background: activeSection === section.id ? C.blueLight : 'transparent',
                  color: activeSection === section.id ? C.blue : C.textMid,
                  border: activeSection === section.id ? `1.5px solid ${C.blue}` : '1px solid transparent',
                  padding: '12px 16px',
                  textAlign: 'left',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: activeSection === section.id ? 700 : 500,
                  cursor: 'pointer',
                  marginBottom: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.background = C.offWhite
                  }
                }}
                onMouseLeave={e => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {section.title}
              </button>
            ))}
          </nav>

          {/* Content */}
          <article style={{
            background: C.white,
            borderRadius: '14px',
            padding: '40px',
            border: `1px solid ${C.border}`,
          }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.text, marginBottom: '24px' }}>
              {activeContent?.title}
            </h2>

            <div
              style={{
                fontSize: '14px',
                lineHeight: '1.8',
                color: C.text,
              }}
              dangerouslySetInnerHTML={{ __html: activeContent?.content || '' }}
            />

            <style>{`
              article h3 {
                font-size: 16px;
                font-weight: 700;
                color: ${C.text};
                margin-top: 28px;
                margin-bottom: 12px;
              }
              article p {
                margin-bottom: 16px;
                color: ${C.textMid};
              }
              article ul {
                margin: 16px 0 16px 24px;
                color: ${C.textMid};
              }
              article li {
                margin-bottom: 8px;
              }
              article strong {
                color: ${C.text};
                font-weight: 700;
              }
            `}</style>
          </article>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{
              background: C.blue,
              color: 'white',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1a5a99'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.blue
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              ← Volver al inicio
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
