import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from './HeroSection'
import FeatureJourney from './FeatureJourney'
import ProblemSection from './ProblemSection'
import AlgorithmsSection from './AlgorithmsSection'
import ModiSection from './ModiSection'
import FAQSection from './FAQSection'
import Footer from './Footer'

function LandingPage() {
  return (
    <div className='min-h-screen bg-slate-50/60 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white'>
      <Navbar />
      <HeroSection />
      <FeatureJourney />
      <ProblemSection />
      <AlgorithmsSection />
      <ModiSection />
      <FAQSection />
      <Footer />
    </div>
  )
}

export default LandingPage


