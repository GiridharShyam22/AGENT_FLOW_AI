import { useEffect } from 'react'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import TechStack from '../components/landing/TechStack'
import Features from '../components/landing/Features'
import HowRAGWorks from '../components/landing/HowRAGWorks'
import LivePreview from '../components/landing/LivePreview'
import CTASection from '../components/landing/CTASection'
import LandingFooter from '../components/landing/LandingFooter'

export default function LandingPage() {
  // Allow body to scroll for landing page
  useEffect(() => {
    document.body.style.overflow = 'auto'
    return () => {
      // Reset to hidden when leaving (chat/workspace layout needs it)
      document.body.style.overflow = 'hidden'
    }
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <TechStack />
      <Features />
      <HowRAGWorks />
      <LivePreview />
      <CTASection />
      <LandingFooter />
    </div>
  )
}
