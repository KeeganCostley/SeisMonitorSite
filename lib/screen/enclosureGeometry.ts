// Screen-window transform, extracted numerically from the actual CAD script
// that cuts the aperture (3D prints/Seismonitor Enclosure/handoff/
// boulder_enclosure.py -- F_N, F_UP, ap_center, aw/ah). Same coordinate frame
// the STL files in public/models/ are exported in, so this plane lines up
// with the real printed opening -- not eyeballed.
export const SCREEN_CENTER: [number, number, number] = [2.0424, 3.5852, 5.1996]
export const SCREEN_NORMAL: [number, number, number] = [0, -0.9744, 0.225]
export const SCREEN_UP: [number, number, number] = [0, 0.225, 0.9744]
export const SCREEN_RIGHT: [number, number, number] = [1, 0, 0]
export const SCREEN_VISIBLE_W = 60.7 // mm
export const SCREEN_VISIBLE_H = 38.4 // mm
export const SCREEN_OFFSET = 0.6 // mm proud of the wall, avoids z-fighting
