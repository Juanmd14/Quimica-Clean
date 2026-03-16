import styles from './home.module.css'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Stats, Categories, Products } from './components/Sections'
import { WhyUs, Contact, Footer } from './components/ContactFooter'
import { WhatsAppChat } from './components/WhatsAppChat'

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
      <WhatsAppChat />
    </div>
  )
}