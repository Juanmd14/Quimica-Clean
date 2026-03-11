import styles from './home.module.css'
import { CONFIG } from '@/lib/config'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Stats, Categories, Products } from './components/Sections'
import { WhyUs, Contact, Footer } from './components/ContactFooter'
import { WhatsAppIcon } from './components/ui'

export default function Home() {
  return (
    <div className={styles['home-styles']}>
      <Navbar />
      <Hero />
      <Stats />
      <Categories />
      <Products />
      <WhyUs />
      <Contact />
      <Footer />

      {/* WhatsApp flotante */}
      <a
        href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '')}`}
        target="_blank"
        rel="noreferrer"
        className={styles['whatsapp-float']}
        title="Escribinos por WhatsApp"
      >
        <WhatsAppIcon size={26} color="white" />
      </a>
    </div>
  )
}