// Screen-window transform, extracted numerically from the actual CAD script
// that cuts the aperture (3D prints/Seismonitor Enclosure/handoff/
// boulder_enclosure.py -- F_N, F_UP, ap_center, aw/ah). Same coordinate frame
// the STL files in public/models/ are exported in, so this plane lines up
// with the real printed opening -- not eyeballed.
export const SCREEN_CENTER: [number, number, number] = [2.0424, 3.5852, 5.1996]
export const SCREEN_NORMAL: [number, number, number] = [0, -0.9744, 0.225]
export const SCREEN_UP: [number, number, number] = [0, 0.225, 0.9744]
export const SCREEN_RIGHT: [number, number, number] = [1, 0, 0]

// Two screen-shaped features exist in the CAD: the tight 60.7 x 38.4mm
// through-hole (the actual light-passage), and the larger 74.7 x 52.4mm
// chamfered recess around it (boulder_enclosure.py's APER_CHAM_W/H bevel) --
// the dark "well" a viewer actually reads as the screen bezel. Sizing the
// plane to the tight hole made it look like a small screen floating in a big
// dark void. Fit to the chamfer recess instead, so the glass fills the well
// a real display module would sit in -- still at the firmware's true 320x240
// (4:3) aspect ratio, fit by height so it never stretches into ellipses.
export const SCREEN_VISIBLE_H = 52.4 // mm -- chamfer recess height
export const SCREEN_VISIBLE_W = SCREEN_VISIBLE_H * (320 / 240) // 69.9mm, fit within the 74.7mm-wide recess
export const SCREEN_OFFSET = 0.6 // mm proud of the wall, avoids z-fighting
