import { getCopy, c } from '@/lib/copy'
import FlashToolClient from './FlashToolClient'

export default function FlashTool() {
  const copy = getCopy()
  return (
    <FlashToolClient
      copy={{
        sectionLabel: c(copy, 'Section label', 'Firmware'),
        heading: c(copy, 'Heading'),
        intro: c(copy, 'Intro paragraph'),
        steps: [1, 2, 3].map((n) => ({
          title: c(copy, 'Step ' + n + ' title'),
          body: c(copy, 'Step ' + n + ' body'),
        })),
        releaseCardLabel: c(copy, '"Latest release" card label', 'Latest release'),
        updateButtonPrefix: c(copy, 'Update button', 'Update firmware'),
        loadingFlasher: c(copy, 'Flasher -- Loading state', 'Loading flasher\u2026'),
        unsupportedMessage: c(copy, 'Unsupported-browser message'),
        webSerialUnsupported: c(copy, 'Web Serial unsupported (library message)'),
        httpsRequired: c(copy, 'HTTPS-required message (library message)'),
        settingsNote: c(copy, 'Settings-persistence note'),
        troubleshootingNote: c(copy, 'Troubleshooting note'),
      }}
    />
  )
}
