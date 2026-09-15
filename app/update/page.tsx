import type { Metadata } from 'next'
import Navbar    from '@/components/UpdateNavbar'
import FlashTool from '@/components/FlashTool'
import Footer    from '@/components/UpdateFooter'
import { getCopy, c } from '@/lib/copy'

export async function generateMetadata(): Promise<Metadata> {
  const copy = getCopy()
  return {
    title: c(copy, 'Update page -- Browser tab title', 'Firmware Update \u2014 SeisMonitor'),
    description: c(copy, 'Update page -- Search description'),
  }
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
