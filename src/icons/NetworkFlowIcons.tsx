type Props = { className?: string }

// ────────────────────────────────────────────────────────────────────────────
// iDock controller (80×80) — exported from Figma Component 304
// ────────────────────────────────────────────────────────────────────────────

export function ConnectingControllerIcon({ className }: Props) {
  return (
    <svg className={className} width="80" height="81" viewBox="0 0 80 81" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <mask id="cci_outline" maskUnits="userSpaceOnUse" x="18.8418" y="-0.75" width="40" height="82" fill="black">
        <rect fill="white" x="18.8418" y="-0.75" width="40" height="82" />
        <path fillRule="evenodd" clipRule="evenodd" d="M23.8123 0.25C21.6194 0.25 19.8418 2.02766 19.8418 4.2205V76.2795C19.8418 78.4724 21.6194 80.25 23.8123 80.25H54.4292C56.622 80.25 58.3997 78.4723 58.3997 76.2795V4.22049C58.3997 2.02765 56.622 0.25 54.4292 0.25H23.8123ZM24.9498 2.53564C23.2268 2.53564 21.8301 3.93237 21.8301 5.65532V74.8445C21.8301 76.5675 23.2268 77.9642 24.9497 77.9642H52.9961C54.7191 77.9642 56.1158 76.5675 56.1158 74.8445V5.65532C56.1158 3.93237 54.7191 2.53564 52.9961 2.53564H24.9498Z" />
      </mask>
      <path fillRule="evenodd" clipRule="evenodd" d="M23.8123 0.25C21.6194 0.25 19.8418 2.02766 19.8418 4.2205V76.2795C19.8418 78.4724 21.6194 80.25 23.8123 80.25H54.4292C56.622 80.25 58.3997 78.4723 58.3997 76.2795V4.22049C58.3997 2.02765 56.622 0.25 54.4292 0.25H23.8123ZM24.9498 2.53564C23.2268 2.53564 21.8301 3.93237 21.8301 5.65532V74.8445C21.8301 76.5675 23.2268 77.9642 24.9497 77.9642H52.9961C54.7191 77.9642 56.1158 76.5675 56.1158 74.8445V5.65532C56.1158 3.93237 54.7191 2.53564 52.9961 2.53564H24.9498Z" fill="#595959" />
      <path d="M53.1562 1.95703C55.0266 1.95703 56.543 3.4734 56.543 5.34375V18.582H21.7021V5.34375C21.7021 3.4734 23.2185 1.95703 25.0889 1.95703H53.1562Z" stroke="#595959" strokeWidth="0.533788" />
      <path d="M24.1172 6.52293C24.1172 5.58314 24.879 4.82129 25.8188 4.82129H52.1298C53.0696 4.82129 53.8315 5.58314 53.8315 6.52293V11.1112C53.8315 11.4245 53.5775 11.6784 53.2643 11.6784H24.6844C24.3711 11.6784 24.1172 11.4245 24.1172 11.1112V6.52293Z" fill="#595959" />
      <rect x="26.4023" y="28.8213" width="12.5714" height="21.7143" fill="#9EE6B4" />
      <rect x="26.4023" y="60.8213" width="4.57143" height="13.7143" rx="0.42541" fill="#595959" />
      <rect x="33.2617" y="60.8213" width="4.57143" height="13.7143" rx="0.42541" fill="#595959" />
      <rect x="40.1172" y="60.8213" width="4.57143" height="13.7143" rx="0.42541" fill="#595959" />
      <rect x="46.9707" y="60.8213" width="4.57143" height="13.7143" rx="0.42541" fill="#595959" />
    </svg>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Router (80×60) — Figma export, idle (gray) and active (green + check) variants
// ────────────────────────────────────────────────────────────────────────────

function RouterShape({ stroke, fill, accent, check }: { stroke: string; fill?: string; accent: string; check?: boolean }) {
  return (
    <g>
      {/* body */}
      <path
        d="M12.4805 37.3203H67.5195C73.6162 37.3203 78.5 42.142 78.5 48.0176C78.4999 53.893 73.6161 58.7139 67.5195 58.7139H12.4805C6.38385 58.7139 1.50014 53.893 1.5 48.0176C1.5 42.142 6.38377 37.3203 12.4805 37.3203Z"
        stroke={stroke}
        strokeWidth="3"
        fill={fill ?? 'none'}
      />
      {/* indicator dots on body */}
      <circle cx="57.1968" cy="48.2964" r="2.1558" fill={accent} />
      <circle cx="49.2925" cy="48.2964" r="2.1558" fill={accent} />
      <circle cx="65.1011" cy="48.2964" r="2.1558" fill={accent} />
      {/* antenna */}
      <path d="M65.573 0C64.6433 0 63.8887 0.7546 63.8887 1.68439V29.7575C63.8887 30.6873 64.6433 31.4419 65.573 31.4419C66.5028 31.4419 67.2575 30.6873 67.2575 29.7575V1.68439C67.2575 0.75461 66.5028 0 65.573 0Z" fill={accent} />
      {/* wifi center dot */}
      <path fillRule="evenodd" clipRule="evenodd" d="M28.0364 27.3338C28.6259 27.9233 29.5812 27.9233 30.1708 27.3338L31.5841 25.9205C30.9492 25.2856 30.0725 24.8926 29.1036 24.8926C28.1346 24.8926 27.2579 25.2856 26.623 25.9205L28.0364 27.3338Z" fill={accent} />
      {/* wifi inner arc */}
      <path fillRule="evenodd" clipRule="evenodd" d="M23.5743 22.8721L23.5788 22.8782C24.1018 23.4012 24.909 23.4435 25.5227 23.0323C26.5476 22.3476 27.7796 21.947 29.1022 21.947C30.4264 21.947 31.6568 22.3476 32.6832 23.0323C33.2969 23.4435 34.1026 23.4012 34.6256 22.8782L34.6316 22.8721C35.2816 22.2221 35.2272 21.1156 34.4699 20.5941C32.9432 19.5406 31.0945 18.9238 29.1022 18.9238C27.1114 18.9238 25.2612 19.5406 23.7345 20.5941C22.9772 21.1156 22.9228 22.2221 23.5743 22.8721Z" fill={accent} />
      {/* wifi outer arc */}
      <path fillRule="evenodd" clipRule="evenodd" d="M14.6173 13.9156C15.1676 14.4658 16.0564 14.5187 16.6444 14.0093C19.9865 11.1131 24.3429 9.35815 29.103 9.35815C33.863 9.35815 38.2194 11.1131 41.5615 14.0108C42.1495 14.5203 43.0384 14.4673 43.5886 13.9171V13.9156C44.2174 13.2868 44.1615 12.2604 43.4858 11.68C39.6206 8.34992 34.5931 6.33496 29.103 6.33496C23.6128 6.33496 18.5853 8.34992 14.7201 11.6785C14.0444 12.2604 13.9885 13.2853 14.6173 13.9156Z" fill={accent} />
      {/* wifi middle arc */}
      <path fillRule="evenodd" clipRule="evenodd" d="M19.0605 18.3595C19.6032 18.9022 20.4663 18.9505 21.0619 18.4683C23.2597 16.6862 26.0577 15.616 29.102 15.616C32.1464 15.616 34.9443 16.6862 37.1437 18.4683C37.7393 18.9505 38.6009 18.9022 39.1436 18.3595C39.7815 17.7216 39.724 16.668 39.0226 16.1012C36.3078 13.9079 32.8553 12.5928 29.102 12.5928C25.3487 12.5928 21.8963 13.9079 19.1829 16.1012C18.4816 16.668 18.4226 17.7216 19.0605 18.3595Z" fill={accent} />
      {check && (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.3589 53.238C12.1039 53.238 11.8489 53.1413 11.6546 52.9461L7.77064 49.0621C7.38114 48.6726 7.38114 48.0431 7.77064 47.6536C8.15914 47.2641 8.7897 47.2641 9.17919 47.6536L12.3589 50.8333L19.8171 43.3761C20.2066 42.9866 20.8371 42.9866 21.2256 43.3761C21.6151 43.7656 21.6151 44.3952 21.2256 44.7847L13.0632 52.9461C12.8689 53.1413 12.6139 53.238 12.3589 53.238Z"
          fill={accent}
        />
      )}
    </g>
  )
}

export function RouterIdleIcon({ className }: Props) {
  return (
    <svg className={className} width="80" height="61" viewBox="0 0 80 61" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <RouterShape stroke="#A4A6A4" accent="#A4A6A4" />
    </svg>
  )
}

export function RouterActiveIcon({ className }: Props) {
  return (
    <svg className={className} width="80" height="61" viewBox="0 0 80 61" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <RouterShape stroke="#003B5C" fill="#9EE6B4" accent="#003B5C" check />
    </svg>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Cloud (48×32) — Figma export, idle (gray) and active (green + check) variants
// ────────────────────────────────────────────────────────────────────────────

const CLOUD_PATH =
  'M19.2588 1.5C22.6039 1.47954 25.849 3.15231 28.4785 7.23047L29.0996 8.19434L30.1924 7.84766C33.1686 6.90466 34.9239 7.18384 36.3115 7.98242C37.9416 9.05517 39.1185 10.8711 39.4307 14.1562L39.5244 15.1455L40.4727 15.4453L41.501 15.7695H41.502C44.5075 16.8062 46.5279 19.6726 46.5 22.8926V22.9092C46.5042 24.6617 45.6849 26.4888 43.1055 28.7031C41.5316 29.5901 40.6891 30.0576 39.8008 30.3438C38.9297 30.6243 37.9439 30.7496 36.0693 30.7646C34.1762 30.7799 31.543 30.6859 27.3887 30.5889C23.258 30.4924 17.6855 30.3944 9.99316 30.4102C5.29983 30.4164 1.50665 26.6126 1.5 21.8965C1.49519 18.4211 3.59877 15.1828 7.99023 13.5088L8.86914 13.1738L8.9502 12.2373C9.5196 5.67583 14.0039 1.61017 19.2588 1.5Z'

export function CloudIdleIcon({ className }: Props) {
  return (
    <svg className={className} width="48" height="33" viewBox="0 0 48 33" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d={CLOUD_PATH} stroke="#A4A6A4" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function CloudActiveIcon({ className }: Props) {
  return (
    <svg className={className} width="48" height="33" viewBox="0 0 48 33" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d={CLOUD_PATH} fill="#9EE6B4" stroke="#003B5C" strokeWidth="3" strokeLinecap="round" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.3569 24.6589C19.1019 24.6589 18.8469 24.5622 18.6527 24.367L14.7687 20.483C14.3792 20.0935 14.3792 19.464 14.7687 19.0745C15.1572 18.685 15.7877 18.685 16.1772 19.0745L19.3569 22.2542L26.8151 14.797C27.2046 14.4075 27.8352 14.4075 28.2237 14.797C28.6131 15.1865 28.6131 15.8161 28.2237 16.2056L20.0612 24.367C19.867 24.5622 19.612 24.6589 19.3569 24.6589Z"
        fill="#003B5C"
      />
    </svg>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Connectors — 5-dot dashed + solid line with end caps (Figma)
// ────────────────────────────────────────────────────────────────────────────

export function ConnectingDotsIcon({ className }: Props) {
  return (
    <svg className={className} width="56" height="24" viewBox="0 0 56 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="2" cy="12" r="2" fill="#003B5C" />
      <circle cx="15" cy="12" r="2" fill="#003B5C" />
      <circle cx="28" cy="12" r="2" fill="#003B5C" />
      <circle cx="41" cy="12" r="2" fill="#003B5C" />
      <circle cx="54" cy="12" r="2" fill="#003B5C" />
    </svg>
  )
}

export function ConnectingLineIcon({ className }: Props) {
  return (
    <svg className={className} width="70" height="24" viewBox="0 0 70 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="10.5" width="64.69" height="3" fill="#262626" />
      <circle cx="2.5" cy="12" r="2.5" fill="#262626" />
      <circle cx="67.19" cy="12" r="2.5" fill="#262626" />
    </svg>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Status row check + password eye (kept inline since they're simple)
// ────────────────────────────────────────────────────────────────────────────

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
