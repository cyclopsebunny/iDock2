import { Panel } from '../components/Panel'
import { TopGraphic, type TopGraphicVariant } from '../components/TopGraphic'
import { useT } from '../i18n/LanguageContext'
import { SettingsGearIcon } from '../icons/Icons'

export type PromptSpec = {
  /** Path under /public/controls — full URL is resolved with BASE_URL. */
  icon: string
  label: string
  /** Background / border / label colors for the prompt bar. */
  tone?: 'warning' | 'info' | 'success' | 'alert'
}

type Props = {
  doorNumber: string
  status: string
  prompt?: PromptSpec | null
  onOpenSettings: () => void
  topGraphic?: TopGraphicVariant
  /** Optional label rendered under the top graphic (used by bypass screens). */
  topSubtitle?: string
  /**
   * Color for the top subtitle text. Defaults to white so it works on the
   * red / green themed top panels. Bypass screens override to a dark color.
   */
  topSubtitleColor?: string
  /** If false, the title row only shows the gear (no "Door NN" text). */
  showDoorNumber?: boolean
}

const TONES = {
  warning: { bg: '#f7dbd2', border: '#f7b6a1', label: '#732006' },
  info: { bg: '#edf9ff', border: '#a1def7', label: '#003b5c' },
  success: { bg: '#eafde3', border: '#d4ebcc', label: '#1d5807' },
  alert: { bg: '#fff7e2', border: '#ffed8f', label: '#513500' },
} as const

const C = (name: string) => `${import.meta.env.BASE_URL}controls/${name}`

export function UnlockedScreen({
  doorNumber,
  status,
  prompt,
  onOpenSettings,
  topGraphic = 'stop',
  topSubtitle,
  topSubtitleColor = '#513500',
  showDoorNumber = true,
}: Props) {
  const t = useT()
  const tone = TONES[prompt?.tone ?? 'warning']
  return (
    <>
      <TopGraphic variant={topGraphic} />
      {topSubtitle && (
        <div
          className="absolute font-inter font-semibold text-center"
          style={{
            left: 0,
            right: 0,
            // Sits just below the dock-doors-dark icon position
            // (top:30 + height:170 + 25 gap = y:225).
            top: 225,
            color: topSubtitleColor,
            fontSize: 32,
            lineHeight: 1.05,
          }}
        >
          {t(topSubtitle)}
        </div>
      )}
      <Panel padding={12} gap={12}>
        <div className="flex h-[66px] items-center gap-[12px] px-[16px]">
          {showDoorNumber ? (
            <>
              <span className="font-inter font-semibold text-primary-text text-[40px] leading-none whitespace-nowrap">
                {t('Door')}
              </span>
              <span className="flex-1 font-inter font-semibold text-primary-text text-[40px] leading-none">
                {doorNumber}
              </span>
            </>
          ) : (
            <span className="flex-1" />
          )}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="shrink-0 text-[#A6A6A6] hover:text-[#8a8a8a]"
            style={{ width: 36, height: 36 }}
          >
            <SettingsGearIcon className="h-full w-full" />
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-start gap-[16px] px-[8px]">
          <div className="flex flex-1 items-center justify-center w-full">
            <p className="font-inter font-semibold text-primary-text text-[64px] leading-tight text-center">
              {t(status)}
            </p>
          </div>
          {prompt ? (
            <div
              className="w-full flex items-center justify-center gap-[20px] rounded-[8px] pl-[8px] pr-[16px] py-[8px]"
              style={{
                background: tone.bg,
                border: `3px solid ${tone.border}`,
                height: 156,
              }}
            >
              <img
                src={C(prompt.icon)}
                alt=""
                className="block shrink-0"
                style={{ width: 70, height: 70 }}
                draggable={false}
              />
              <span
                className="font-inter font-medium text-[32px] leading-[1.1] text-center whitespace-pre-line"
                style={{ color: tone.label }}
              >
                {t(prompt.label)}
              </span>
            </div>
          ) : (
            <div className="h-[156px] w-full" />
          )}
        </div>
      </Panel>
    </>
  )
}
