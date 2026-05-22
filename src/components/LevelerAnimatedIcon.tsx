type Props = {
  direction: 'deploy' | 'store'
  /** Fill color for the ramp + arrow. Defaults to white (green theme). */
  fill?: string
  /** Stroke color for the arrow outline. Defaults to the green background. */
  stroke?: string
}

// Path data extracted from the Figma "down" (flat-ramp) frames. Each
// direction has its own arrow shape, but the ramp parallelogram is rotated
// around the dock-side pivot to tilt up into the stored pose.

const DEPLOY = {
  ramp: 'M206.508 119.794L200.306 104.814L123.593 136.577L6.52251 184.998L18.9121 214.903L135.983 166.483L129.78 151.503L206.508 119.794Z',
  arrow:
    'M70.2404 72.7953L128.551 70.7484L97.6366 21.2128L89.4291 36.6575L55.3043 18.5827L44.3008 39.224L78.448 57.3496L70.2404 72.7953Z',
  viewBox: { w: 218, h: 216 },
  // Pivot in viewBox-coord %, mapped to the lower-left "foot" of the ramp.
  pivotPct: { x: '5.5%', y: '92.6%' },
} as const

const STORE = {
  ramp: 'M213.872 180.594L213.732 164.382L130.707 165.095L4.0226 166.134L4.30714 198.504L130.992 197.464L130.853 181.252L213.872 180.594Z',
  arrow:
    'M157.2 119.005L156.646 117.614L155.254 118.168L141.417 123.67L149.155 71.0407L190.855 103.998L177.017 109.5L175.621 110.055L176.177 111.449L189.922 145.972L170.963 153.481L157.2 119.005Z',
  viewBox: { w: 216, h: 221 },
  pivotPct: { x: '1.9%', y: '82.4%' },
} as const

// Tilt angle (negative = counter-clockwise / upward swing) for the stored
// pose. The deployed pose is 0° (the SVG's natural drawn orientation).
const STORED_TILT_DEG = -25

export function LevelerAnimatedIcon({
  direction,
  fill = 'white',
  stroke = '#43ac1d',
}: Props) {
  const cfg = direction === 'store' ? STORE : DEPLOY
  // Deploy: tilted (stored) → flat (deployed) — i.e. -25 → 0.
  // Store:  flat (deployed) → tilted (stored)  — i.e. 0 → -25.
  const fromDeg = direction === 'deploy' ? STORED_TILT_DEG : 0
  const toDeg = direction === 'deploy' ? 0 : STORED_TILT_DEG

  // Use a unique keyframe name per direction so React can swap animations
  // cleanly. The wrapper div hosts the CSS rotation around a percentage
  // pivot (more reliable across browsers than transform-origin in pixel
  // coords on SVG <g>).
  const animName = `leveler-rotate-${direction}`

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transformOrigin: `${cfg.pivotPct.x} ${cfg.pivotPct.y}`,
        // Start the rotation immediately on mount and run linearly to the
        // end pose over the 5-second hold. `forwards` freezes the final
        // state.
        animation: `${animName} 5s linear forwards`,
      }}
    >
      <style>{`
        @keyframes ${animName} {
          from { transform: rotate(${fromDeg}deg); }
          to   { transform: rotate(${toDeg}deg); }
        }
      `}</style>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${cfg.viewBox.w} ${cfg.viewBox.h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={cfg.ramp} fill={fill} />
        <path
          d={cfg.arrow}
          fill={fill}
          stroke={stroke}
          strokeWidth="3"
        />
      </svg>
    </div>
  )
}
