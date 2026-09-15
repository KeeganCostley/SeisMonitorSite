import { getCopy, c } from '@/lib/copy'
import GalleryCarousel from './GalleryCarousel'

// #pix -- captions come from copy.md; the actual image files stay fixed
// (drop new ones in public/photos/ and update the src list below).
const PHOTO_FILES = [
  { src: '/photos/desk.png', alt: 'Seismonitor, three-quarter view on the desk', num: 'i', key: 'Photo i caption' },
  { src: '/photos/front.jpg', alt: 'Seismonitor, front view showing the NZ map', num: 'ii', key: 'Photo ii caption' },
  { src: '/photos/open.jpg', alt: 'Seismonitor open, board in place', num: 'iii', key: 'Photo iii caption' },
  { src: '/photos/rear.jpg', alt: 'Seismonitor rear panel showing the USB-C port', num: 'iv', key: 'Photo iv caption' },
  { src: '/photos/hero.png', alt: 'Seismonitor One, on a desk', num: 'v', key: 'Photo v caption' },
]

export default function Gallery() {
  const copy = getCopy()
  const photos = PHOTO_FILES.map((p) => ({
    src: p.src,
    alt: p.alt,
    num: p.num,
    cap: c(copy, p.key),
  }))

  return (
    <div className="wrap" id="pix">
      <h2 className="hd"><span className="n">03</span>{c(copy, 'Gallery -- Section heading', 'Gallery')}</h2>
      <div className="sublab">{c(copy, 'Gallery -- Section sublabel')}</div>

      <GalleryCarousel photos={photos} />

      <p className="note" style={{ marginTop: 9, textAlign: 'center' }}>
        {c(copy, 'Closing note')}
      </p>
    </div>
  )
}
