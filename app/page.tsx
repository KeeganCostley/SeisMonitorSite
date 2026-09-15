import Navbar   from '@/components/Navbar'
import LiveDemo from '@/components/LiveDemo'
import WhatItIs from '@/components/WhatItIs'
import Pricing  from '@/components/Pricing'
import About    from '@/components/About'
import Gallery  from '@/components/Gallery'
import MadeBy   from '@/components/MadeBy'
import Footer   from '@/components/Footer'

export default function Home() {
  return (
    <div className="seismo-90s">
      <div className="page-col">
        <Navbar />

        {/* The turnable 3D enclosure is the hero -- first thing you see. */}
        <LiveDemo />
        <hr className="dot" />

        <WhatItIs />
        <hr className="s" />

        <Pricing />
        <hr className="s" />

        <About />
        <hr className="s" />

        <Gallery />
        <hr className="s" />

        <MadeBy />
        <hr className="d" />

        <Footer />
      </div>
    </div>
  )
}
