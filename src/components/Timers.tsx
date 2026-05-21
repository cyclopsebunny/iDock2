import { useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { BackArrowIcon, ChevronRightIcon, CloseIcon } from '../icons/Icons'
import { MenuRow } from './MenuRow'

type CommonProps = { onBack: () => void; onClose: () => void }

export const TIMER_KEYS = [
  'Hook Raise Time',
  'Hook Auto Store Extend Time',
  'Hook Auto Raise Time',
  'Below Dock Raise Time',
  'Below Dock Lip Out Time',
  'Chock Pullout Time',
  'VS Bumpback Time',
] as const

export type TimerKey = (typeof TIMER_KEYS)[number]

type TimersProps = CommonProps & {
  onOpenTimer: (key: TimerKey) => void
}

export function Timers({ onBack, onClose, onOpenTimer }: TimersProps) {
  const t = useT()
  return (
    <div className="absolute inset-0 flex items-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <div
        className="relative flex flex-col gap-[8px] bg-white rounded-[12px] shadow-panel"
        style={{ width: 448, height: 768, padding: 8, marginLeft: 16, marginBottom: 16 }}
      >
        <div className="flex h-[66px] items-center gap-[12px] px-[16px] shrink-0">
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="shrink-0 text-brand-primary"
            style={{ width: 36, height: 36 }}
          >
            <BackArrowIcon className="h-full w-full" />
          </button>
          <h2 className="flex-1 text-center font-inter font-semibold text-brand-primary text-[28px] leading-[30px]">
            {t('Timers')}
          </h2>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="shrink-0 text-brand-primary"
            style={{ width: 36, height: 36 }}
          >
            <CloseIcon className="h-full w-full" />
          </button>
        </div>
        {TIMER_KEYS.map((key) => (
          <MenuRow key={key} label={t(key)} onClick={() => onOpenTimer(key)} />
        ))}
      </div>
    </div>
  )
}

type TimerDetailProps = CommonProps & {
  timerKey: TimerKey
  value: number
  onSave: (v: number) => void
}

export function TimerDetail({
  timerKey,
  value,
  onSave,
  onBack,
  onClose,
}: TimerDetailProps) {
  const t = useT()
  const [draft, setDraft] = useState(value)
  const dirty = draft !== value
  const inc = () => setDraft((v) => Math.min(60_000, v + 10))
  const dec = () => setDraft((v) => Math.max(0, v - 10))

  return (
    <div className="absolute inset-0 flex items-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <div
        className="relative flex flex-col gap-[8px] bg-white rounded-[12px] shadow-panel"
        style={{ width: 448, height: 768, padding: 8, marginLeft: 16, marginBottom: 16 }}
      >
        <div className="flex h-[66px] items-center gap-[12px] px-[16px] shrink-0">
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="shrink-0 text-brand-primary"
            style={{ width: 36, height: 36 }}
          >
            <BackArrowIcon className="h-full w-full" />
          </button>
          <h2 className="flex-1 text-center font-inter font-semibold text-brand-primary text-[28px] leading-[30px]">
            {t(timerKey)}
          </h2>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="shrink-0 text-brand-primary"
            style={{ width: 36, height: 36 }}
          >
            <CloseIcon className="h-full w-full" />
          </button>
        </div>

        <div className="px-[16px] pt-[8px]">
          <ValueStepper value={draft} onUp={inc} onDown={dec} unit="mSec" />
        </div>

        <div className="flex-1" />

        <SaveButton enabled={dirty} onClick={() => onSave(draft)} label={t('Save Settings')} />
      </div>
    </div>
  )
}

function ValueStepper({
  value,
  onUp,
  onDown,
  unit,
}: {
  value: number
  onUp: () => void
  onDown: () => void
  unit: string
}) {
  return (
    <div className="w-full rounded-[6px] border border-btn-secondary-stroke bg-btn-secondary-bg p-[12px]">
      <div className="flex flex-col items-center w-full">
        <StepperBtn direction="up" onClick={onUp} position="top" />
        <div className="flex items-center justify-center gap-[11px] py-[12px] w-full">
          <p className="font-inter font-medium text-btn-secondary-label text-[28px] leading-normal text-center tracking-[0.0066em]">
            {value}
          </p>
          <p className="font-inter font-medium text-btn-secondary-label text-[28px] leading-normal text-center tracking-[0.0066em]">
            {unit}
          </p>
        </div>
        <StepperBtn direction="down" onClick={onDown} position="bottom" />
      </div>
    </div>
  )
}

function StepperBtn({
  direction,
  onClick,
  position,
}: {
  direction: 'up' | 'down'
  onClick: () => void
  position: 'top' | 'bottom'
}) {
  const rounded = position === 'top' ? 'rounded-t-[8px]' : 'rounded-b-[8px]'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'up' ? 'Increase' : 'Decrease'}
      className={`h-[62px] w-full flex items-center justify-center bg-btn-secondary-bg border border-btn-secondary-stroke ${rounded} active:bg-[#ebebeb] transition-colors`}
      style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }}
    >
      <span
        className="block text-btn-secondary-label"
        style={{
          width: 30,
          height: 30,
          transform: direction === 'up' ? 'rotate(-90deg)' : 'rotate(90deg)',
        }}
      >
        <ChevronRightIcon className="h-full w-full" />
      </span>
    </button>
  )
}

function SaveButton({
  enabled,
  onClick,
  label,
}: {
  enabled: boolean
  onClick: () => void
  label: string
}) {
  if (enabled) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full px-[12px] py-[14px] rounded-[6px] border border-brand-primary bg-brand-primary text-white font-inter font-medium text-center text-[24px] tracking-[0.0066em] transition-opacity active:opacity-90"
      >
        {label}
      </button>
    )
  }
  return (
    <button
      type="button"
      disabled
      className="w-full px-[12px] py-[14px] rounded-[6px] border border-[#eaeaea] bg-white text-[#a6a6a6] font-inter font-medium text-center text-[24px] tracking-[0.0066em] cursor-not-allowed"
    >
      {label}
    </button>
  )
}
