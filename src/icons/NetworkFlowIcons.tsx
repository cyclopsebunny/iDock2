type Props = { className?: string }

export function PhoneIcon({ className }: Props) {
  return (
    <svg className={className} width="44" height="70" viewBox="0 0 44 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="2" width="36" height="66" rx="4" stroke="#595959" strokeWidth="2" fill="none" />
      <rect x="9" y="40" width="6" height="22" fill="#7ed957" />
      <rect x="9" y="35" width="6" height="5" fill="#595959" />
      <line x1="20" y1="46" x2="20" y2="62" stroke="#595959" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="46" x2="25" y2="62" stroke="#595959" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="46" x2="30" y2="62" stroke="#595959" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function RouterIcon({
  className,
  state = 'idle',
}: Props & { state?: 'idle' | 'active' }) {
  const isActive = state === 'active'
  const bodyFill = isActive ? '#86E08A' : '#ffffff'
  const stroke = '#595959'
  return (
    <svg className={className} width="78" height="80" viewBox="0 0 78 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* antenna */}
      <line x1="52" y1="30" x2="52" y2="10" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      {/* wifi arcs */}
      <path d="M30 30 A 12 12 0 0 1 50 30" stroke={stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M34 28 A 7 7 0 0 1 46 28" stroke={stroke} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="27" r="2" fill={stroke} />
      {/* body */}
      <rect x="6" y="36" width="66" height="28" rx="6" stroke={stroke} strokeWidth="2" fill={bodyFill} />
      {/* lights */}
      <circle cx="20" cy="50" r="2" fill={stroke} />
      <circle cx="30" cy="50" r="2" fill={stroke} />
      <circle cx="40" cy="50" r="2" fill={stroke} />
      {isActive && (
        <g>
          <circle cx="58" cy="50" r="7" fill="#2BAA63" />
          <path d="M54.5 50.5 L57.2 53 L62 47.7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  )
}

export function CloudIcon({
  className,
  state = 'idle',
}: Props & { state?: 'idle' | 'active' }) {
  const isActive = state === 'active'
  const fill = isActive ? '#86E08A' : '#ffffff'
  return (
    <svg className={className} width="78" height="60" viewBox="0 0 78 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M18 46 C8 46 5 38 9 32 C5 22 18 14 26 22 C30 12 50 12 54 24 C66 22 72 32 66 40 C72 50 60 50 56 46 Z"
        stroke="#595959"
        strokeWidth="2"
        fill={fill}
        strokeLinejoin="round"
      />
      {isActive && (
        <g transform="translate(30 24)">
          <path d="M2 8 L8 13 L18 3" stroke="#2BAA63" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  )
}

export function CheckCircleIcon({
  className,
  active,
}: Props & { active: boolean }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill={active ? '#2BAA63' : '#d0d0d0'} />
      <path
        d="M6.5 11.5 L9.5 14.3 L15.2 8"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function EyeIcon({ className }: Props) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M2 12 C5 6 8 4 12 4 C16 4 19 6 22 12 C19 18 16 20 12 20 C8 20 5 18 2 12 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  )
}
