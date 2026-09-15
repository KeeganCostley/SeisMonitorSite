# Seismonitor -- Site Copy

Every piece of text on the site, in one file. **Edit anything below and save
-- the live site reads this file directly, so your change shows up on a
refresh. No need to send it back to me.**

A few notes:
- Keep the `**Label:**` part of each line exactly as it is -- that's how the
  site finds which piece of text is which. Only change the text *after* the
  colon.
- Lines marked *(auto-generated, not editable here)* are computed live (real
  quake data, the visitor count, today's date) -- there's nothing to edit,
  they're listed just for completeness.
- A few lines have a link baked into the middle of the sentence (GeoNet, USGS,
  "the firmware page", "reflash it here") -- the *link itself* (where it goes)
  is fixed in code, but the surrounding words are still yours to edit.
- Don't delete a `**Label:**` line or rename the label -- if the site can't
  find a label it expects, that piece of text will just go blank rather than
  break the page, but it's better to leave every label in place and only
  touch the value.
- Special characters (— · ◆ × → ↓ ©) are plain text here, typed directly --
  edit or delete them like any other character.
- If the site doesn't pick up a change: hard-refresh the page (Ctrl+Shift+R).
  If it's running in dev mode it should update on a normal refresh; if it's a
  deployed production build, it may need a rebuild to see filesystem changes.

---

## Page metadata (app/layout.tsx)
*Not visible on the page itself -- shows in the browser tab, search results, and link previews.*

**Main page -- Browser tab title:** Seismonitor -- a desk seismograph, made in New Zealand
**Main page -- Search description:** Seismo connects to WiFi and pulls live seismic data from GeoNet and USGS. A small desk seismograph, 3D printed and hand-assembled in New Zealand.
**Link-preview title:** Seismonitor -- a desk seismograph, made in New Zealand
**Link-preview description:** A small seismonitor for your desk or shelf. Built in Aotearoa New Zealand.

---

## Masthead + nav [Component: Navbar.tsx]

**Wordmark:** SEISMO
**Tagline:** Live seismic data to your desk or shelf
**Location line:** ◆ BUILT IN AOTEAROA NEW ZEALAND ◆

**Nav link 1:** What it is
**Nav link 2:** Order
**Nav link 3:** The model
**Nav link 4:** Specifications
**Nav link 5:** Gallery
**Nav link 6:** Firmware *(carries a small "NEW" badge)*

---

## Hero -- the 3D model [Component: LiveDemo.tsx]

**Caption below the model:** The actual print file — 133 × 93 × 76 mm. The screen is live too, not a photo: real data pulled from {source} as you look at it. *({source} becomes GeoNet or USGS automatically depending which region is selected -- keep that exact token if you want the swap to keep working)*
**Alert-trigger link (part of the caption above):** Show me an alert.
**Caveat line:** ◆ Needs a recent browser. If you see nothing, that will be why.
**Download button:** ↓ STL
**Hint strip (bottom of the frame):** Drag to rotate · scroll to zoom
**3D model -- Loading state:** Loading model_

---

## What it is [Component: WhatItIs.tsx]

**Main paragraph:** Seismo connects to WiFi, and pulls seismic data from GeoNet and USGS. It draws the latest event, the biggest events of the last day, and displays a live rolling trace of the ground itself.
**Italic line under it:** Each one is 3D printed and assembled by hand in my family home come studio.

---

## Order [Component: Pricing.tsx]

**Order -- Section heading:** Order
**Order -- Section sublabel:** first batch · ships when ready

### Tier 1 -- Assembled
**Tier 1 -- Assembled -- Tier label:** Assembled — Prototype 001
**Tier 1 -- Assembled -- Price:** $79.95
**Tier 1 -- Assembled -- Price tag:** ◆ first batch only
**Tier 1 -- Assembled -- Order button:** Order the Prototype
**Tier 1 -- Assembled -- "Then what" text, line 1:** I write to you when the batch is ready, and you decide then.
**Tier 1 -- Assembled -- "Then what" text, line 2:** Free postage inside New Zealand. Overseas, ask me.
**Tier 1 -- Assembled -- "Then what" text, line 3:** Expect around **Q4 2026**. It is one person soldering, so that may slip.

**Transition line between the two tiers:** Or, if you've already got a printer — the DIY kit skips the enclosure and just sends the board and the files.

### Tier 2 -- DIY Kit
**Tier 2 -- DIY Kit -- Tier label:** DIY Kit — print your own
**Tier 2 -- DIY Kit -- Price:** $59.95
**Tier 2 -- DIY Kit -- Price tag:** ◆ rolling batch
**Tier 2 -- DIY Kit -- Order button:** Order the DIY Kit
**Tier 2 -- DIY Kit -- "Then what" text, line 1:** You get the STEP file — the real editable CAD, not just a fixed mesh — plus a bare ESP32-S3 board, posted to you.
**Tier 2 -- DIY Kit -- "Then what" text, line 2:** Print the enclosure yourself, wire up the board, flash it from the firmware page. Same live data, your own build.
**Tier 2 -- DIY Kit -- "Then what" text, line 3:** Free postage inside New Zealand. Overseas, ask me.

### Coming next -- the future designer edition
**Coming next -- Label:** coming next · pre-order
**Coming next -- Paragraph:** A second edition is already in the works — designed properly this time, with **Reuben Tait**, rather than whatever I could manage with a hot end and an evening. *(Reuben Tait is a placeholder I made up -- tell me the real name once you have one, or leave it blank for now.)* No price yet, no date yet. If you'd rather hear about that one first:
**Coming next -- Button:** Keep me posted

**Form button behaviour (all three forms above), not really "copy" but worth knowing:**
- Typing something that isn't a valid-looking email and clicking the button shows **"That email?"** for 1.6 seconds, then reverts.
- A valid-looking email shows **"Got you — thanks"** and disables the button.

---

## Specifications [Component: About.tsx]

**Specifications -- Section heading:** Specifications
**Specifications -- Section sublabel:** Seismonitor One · rev. A

**Spec -- Processor:** ESP32-S3
**Spec -- Screen:** 2.8" IPS TFT, 240 × 320, ILI9341V (landscape)
**Spec -- Network:** 802.11 b/g/n
**Spec -- Data from:** GeoNet (NZ) · USGS (global)
**Spec -- Body:** PLA, 3D printed, hand finished
**Spec -- Power:** USB-C, 5V 1A
**Spec -- Firmware:** C++ *(the trailing ", and you can reflash it here" link is fixed in code)*
**Spec -- Weight:** 110 g

---

## Gallery [Component: Gallery.tsx]

**Gallery -- Section heading:** Gallery
**Gallery -- Section sublabel:** taken on a bench, not in a studio

**Photo i caption:** Three-quarter, on the desk
**Photo ii caption:** Front
**Photo iii caption:** Open, board in place
**Photo iv caption:** Back, USB-C
**Photo v caption:** Showing an M3.6, 60km NW of Te Kaha, three minutes after it happened

**Closing note:** Better photographs are coming, once I borrow a proper light.

---

## Made by [Component: MadeBy.tsx]

**Made by -- Section heading:** Made by
**Made by -- Section sublabel:** a handful of people

**Credit 1 name:** Keegan Costley
**Credit 1 role:** built the thing
**Credit 2 name:** Claude Code
**Credit 2 role:** special credit
**Credit 3 name:** Jack Ewing
**Credit 3 role:** coding support
**Credit 4 name:** Jack Callister
**Credit 4 role:** advisor
**Credit 5 name:** Allan Clayton
**Credit 5 role:** 3D support

---

## Footer [Component: Footer.tsx]

**Credits line:** Earthquake data courtesy of GeoNet and the USGS.
**Disclaimer line:** Seismonitor is not a warning system. Please do not rely on it as one.
**Visitors label:** Visitors *(count itself is auto-generated, not editable here)*
**Last updated line:** LAST UPDATED *(today's date, auto-generated, not editable here)*
**Closing line -- before year:** Best viewed on a screen. ©
**Closing line -- after year:** Seismonitor, Wellington. *(the year itself is auto-generated and sits between these two)*

---
---

# /update -- the firmware page

This page has its own look (kept separate from the rest of the redesign, see
`design_handoff_seismo_site/README.md`), but its copy still lives here.

## Nav + footer [Components: UpdateNavbar.tsx, UpdateFooter.tsx]

**Nav logo:** Seismonitor
**Nav link:** Pre-order → *(links to /#order)*
**Footer wordmark:** Seismonitor
**Footer line -- after year:** Made in Aotearoa New Zealand · Data: GeoNet / USGS *(the "© {year} ·" prefix is automatic)*

## Page metadata (app/update/page.tsx)
**Update page -- Browser tab title:** Firmware Update — SeisMonitor
**Update page -- Search description:** Update your SeisMonitor to the latest firmware straight from the browser. Plug in over USB-C, press the button, done.

## Main content [Component: FlashTool.tsx]

**Section label:** Firmware
**Heading:** Update your SeisMonitor.
**Intro paragraph:** New firmware ships regularly — better data, better maps, better alerts. Updating happens right here in the browser: plug your device into this computer, press the button, and it flashes itself. Nothing to install.

**Step 1 title:** Plug it in
**Step 1 body:** Connect your SeisMonitor to this computer with a USB-C cable. It must be a data cable — some charge-only cables look identical but won't show up.

**Step 2 title:** Connect
**Step 2 body:** Click the update button and pick your device from the port list — it appears as a USB / COM serial port. Unplug any other devices using your USB ports.

**Step 3 title:** Wait for the reboot
**Step 3 body:** Flashing takes about a minute. Keep the cable in. When it finishes, your SeisMonitor restarts itself on the new firmware — the version shows on the boot screen.

**"Latest release" card label:** Latest release
**Version + changelog notes:** *(auto-generated from public/firmware/manifest.json, not editable here)*

**Update button:** Update firmware → *(version number appended automatically)*
**Flasher -- Loading state:** Loading flasher…
**Unsupported-browser message:** This browser can't talk to USB devices. Open this page in Chrome or Edge on a computer — phones and tablets can't flash firmware.
**Web Serial unsupported (library message):** This browser doesn't support Web Serial.
**HTTPS-required message (library message):** Serial access is blocked — this page needs to be served over HTTPS.
**Settings-persistence note:** Your settings — region, alert sensitivity — are kept. Choosing "Erase device" in the dialog wipes them back to defaults.
**Troubleshooting note:** Trouble? If no port shows up, try another cable or USB socket. If the flash fails partway, just unplug, replug, and run it again — it can't brick the device.
