type Tone = 'positive' | 'negative' | 'info' | 'neutral'

export type SegmentedOption<V extends string> = {
  value: V
  label: string
  /** Active color for this segment. Defaults to `'info'` (accent blue). */
  tone?: Tone
}

type Props<V extends string> = {
  value: V
  options: SegmentedOption<V>[]
  onChange: (v: V) => void
  /**
   * Visual size. 'lg' = 20px bold text with rounded-[4px] caps (matches the
   * Card/Credential Enabled/Disabled switch and the Motion Detection
   * OFF/ON switch). 'sm' is reserved for future use.
   */
  size?: 'lg'
}

const TONE_CLASS: Record<Tone, string> = {
  positive: 'bg-[#6ac449] border-[#6ac449] text-white',
  negative: 'bg-panel-red border-panel-red text-white',
  info: 'bg-accent-blue border-accent-blue text-white',
  neutral: 'bg-btn-secondary-bg border-btn-secondary-stroke text-btn-secondary-label',
}

/**
 * 2-3 segment ON/OFF / Enabled/Disabled style toggle.
 *
 * Each segment can carry its own tone — typically a `negative`-toned
 * Disabled paired with a `positive`-toned Enabled, or an `info`-toned ON
 * paired with a `negative`-toned OFF.
 */
export function SegmentedToggle<V extends string>({
  value,
  options,
  onChange,
  size: _size = 'lg',
}: Props<V>) {
  return (
    <div
      className="flex items-stretch"
      style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }}
    >
      {options.map((opt, i) => {
        const active = opt.value === value
        const isFirst = i === 0
        const isLast = i === options.length - 1
        const radius = isFirst
          ? 'rounded-l-[4px]'
          : isLast
            ? 'rounded-r-[4px]'
            : ''
        const tone = opt.tone ?? 'info'
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-center px-[12px] py-[14px] border font-inter font-bold text-[20px] leading-none tracking-[0.0066em] transition-colors ${radius} ${
              active ? TONE_CLASS[tone] : TONE_CLASS.neutral
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
