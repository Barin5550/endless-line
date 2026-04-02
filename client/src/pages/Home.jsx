import { useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Destinations from '../components/Destinations'
import BookingForm from '../components/BookingForm'
import Reviews from '../components/Reviews'
import FAQ from '../components/FAQ'
import Contacts from '../components/Contacts'
import Footer from '../components/Footer'

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Destinations />
        <BookingForm />
        <Reviews />
        <FAQ />
        <Contacts />
      </main>
      <Footer />
    </>
  )
}
