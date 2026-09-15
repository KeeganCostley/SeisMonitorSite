# Design handoff: the "Update" page (web firmware flasher)

*Paste this into Claude Design so it knows about the new feature and can design for it.*

---

The SeisMonitor site has grown a second job. It's no longer just a marketing /
preorder page — it's also **the tool existing owners use to update their device**.
A new page at **`/update`** flashes the latest firmware onto a SeisMonitor over
USB, directly from the browser. The owner plugs their device into their computer
with USB-C, clicks one button, picks the serial port from a browser popup, and
about a minute later the device reboots itself on the new firmware. Nothing to
download or install. (Under the hood: Web Serial + Espressif's `esp-web-tools`,
so it only works in Chrome/Edge on desktop.)

Please design this page as part of the new front end. Here's everything on it:

**Content the page must carry:**

1. **Page label / heading** — it's the "Firmware" section of the site.
   Current heading: "Update your SeisMonitor."
2. **A short explainer** — plug in, press the button, the browser does the rest.
3. **Three steps** (numbered 01/02/03):
   - *Plug it in* — USB-C, must be a **data** cable (charge-only cables silently fail).
   - *Connect* — click the button, pick the device from the browser's port list;
     close anything else using the port (Arduino IDE, serial monitors).
   - *Wait for the reboot* — ~1 minute, keep the cable in, device restarts itself
     and shows the new version on its boot screen.
4. **A "Latest release" card** — this is data-driven from `/firmware/manifest.json`:
   - version (e.g. `v7.9`), release date, and a bullet changelog (2–5 short lines).
5. **THE BUTTON** — the hero of the page. One primary action:
   "Update firmware → v7.9". Important constraint: in code this is a real
   `<button slot="activate">` nested inside an `<esp-web-install-button>` custom
   element — so it can be styled 100% freely (it's our own button element), but it
   is a single button, and the flow after clicking it (port picker, progress
   dialog) is browser/library UI we don't control.
6. **Reassurance microcopy** near the button:
   - settings (region, alert sensitivity) survive the update; the dialog's
     "Erase device" option wipes them to defaults.
   - troubleshooting: no port → try another cable/socket; failed flash → unplug,
     replug, run again — it can't brick the device.

**States to design:**

- **Normal** (Chrome/Edge desktop): everything above, button enabled.
- **Unsupported browser** (Safari, Firefox, any phone/tablet): the button area is
  replaced by a notice — "open this in Chrome or Edge on a computer". Phones can
  never flash, so mobile layouts should treat this page as informational.
- **Loading**: brief moment while the flasher module loads — currently a disabled
  ghost button reading "Loading flasher…".

**Navigation:** "Update" is now a top-level nav item (it lives at `/update`, a
separate page from the landing page — nav links need real paths like `/#features`,
not bare `#features`).

**Tone:** this page is for people who already own the device — warmer and more
practical than the marketing sections, but it should still feel like the same
instrument. It's also a quiet proof point for buyers ("OTA firmware updates" is
listed in Pricing — this page is that promise, visible).
