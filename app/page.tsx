import Navbar   from '@/components/Navbar'
import Hero     from '@/components/Hero'
import LiveDemo from '@/components/LiveDemo'
import Features from '@/components/Features'
import Gallery  from '@/components/Gallery'
import Pricing  from '@/components/Pricing'
import About    from '@/components/About'
import Footer   from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LiveDemo />
        <Features />
        <Gallery />
        <Pricing />
        <About />
      </main>
      <Footer />
    </>
  )
}
