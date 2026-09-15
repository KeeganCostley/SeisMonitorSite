import type { Metadata } from 'next'
import Navbar    from '@/components/Navbar'
import FlashTool from '@/components/FlashTool'
import Footer    from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Firmware Update — SeisMonitor',
  description:
    'Update your SeisMonitor to the latest firmware straight from the browser. ' +
    'Plug in over USB-C, press the button, done.',
}

export default function UpdatePage() {
  return (
    <>
      <Navbar />
      <main>
        <FlashTool />
      </main>
      <Footer />
    </>
  )
}
