import styles from './home.module.css'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Stats, Products } from './components/Sections'
import { WhyUs, Contact, Footer } from './components/ContactFooter'
import { CalidadShowcase } from './components/CalidadShowcase'
import WhatsAppChatLazy from './components/WhatsAppChatLazy'
import { DataProvider } from './components/DataProvider'
import { getProductos, getCategorias } from '@/lib/data'

export default async function Home() {
  const [productos, categorias] = await Promise.all([
    getProductos(),
    getCategorias(),
  ])

  return (
    <DataProvider productos={productos} categorias={categorias}>
      <div className={styles['home-styles']}>
        <Navbar />
        <Hero />
        <Stats />
        <Products />
        <CalidadShowcase />
        <WhyUs />
        <Contact />
        <Footer />

        {/* WhatsApp flotante (lazy) */}
        <WhatsAppChatLazy />
      </div>
    </DataProvider>
  )
}
