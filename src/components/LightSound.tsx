import { useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { ClockIcon, LightBulbIcon, VolumeIcon } from '../icons/EquipmentIcons'
import { BackArrowIcon, ChevronRightIcon, CloseIcon } from '../icons/Icons'

type Props = {
  onBack: () => void
  onClose: () => void
}

type Settings = {
  colorMode: boolean
  lightBar: boolean
  lightBarLevel: number // 0..4
  outsideLight: boolean
  outsideLightLevel: number // 0..4
  sound: boolean
}

const DEFAULTS: Settings = {
  colorMode: false,
  lightBar: true,
  lightBarLevel: 1,
  outsideLight: true,
  outsideLightLevel: 1,
  sound: false,
}

export function LightSound({ onBack, onClose }: Props) {
  const t = useT()
  const [committed, setCommitted] = useState<Settings>(DEFAULTS)
  const [draft, setDraft] = useState<Settings>(DEFAULTS)
  const dirty = JSON.stringify(draft) !== JSON.stringify(committed)

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  return (
    <div className="absolute inset-0 flex items-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <div
        className="relative flex flex-col gap-[10px] bg-white rounded-[12px] shadow-panel"
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
            {t('Light & Sound')}
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

        <ToggleRow
          icon={<ClockIcon className="h-full w-full text-btn-secondary-label" />}
          label={t('Color Mode')}
          value={draft.colorMode}
          onChange={(v) => update('colorMode', v)}
        />

        <SliderPanel
          icon={<LightBulbIcon className="text-btn-secondary-label" />}
          label={t('Light Bar')}
          on={draft.lightBar}
          onChangeOn={(v) => update('lightBar', v)}
          level={draft.lightBarLevel}
          onChangeLevel={(v) => update('lightBarLevel', v)}
        />

        <SliderPanel
          icon={<LightBulbIcon className="text-btn-secondary-label" />}
          label={t('Outside Light')}
          on={draft.outsideLight}
          onChangeOn={(v) => update('outsideLight', v)}
          level={draft.outsideLightLevel}
          onChangeLevel={(v) => update('outsideLightLevel', v)}
        />

        <ToggleRow
          icon={<VolumeIcon className="h-full w-full text-btn-secondary-label" />}
          label={t('Sound')}
          value={draft.sound}
          onChange={(v) => update('sound', v)}
        />

        <div className="flex-1" />

        <SaveButton
          enabled={dirty}
          onClick={() => {
            setCommitted(draft)
            onBack()
          }}
          label={t('Save Settings')}
        />
      </div>
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex w-full items-center gap-[8px] rounded-[6px] border border-btn-secondary-stroke bg-btn-secondary-bg pl-px pr-[9px] py-[9px]">
      <div className="flex flex-1 items-center gap-[16px] pl-[16px]">
        <span className="shrink-0" style={{ width: 34, height: 34 }}>
          {icon}
        </span>
        <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
          {label}
        </span>
      </div>
      <OnOffSwitch value={value} onChange={onChange} />
    </div>
  )
}

function SliderPanel({
  icon,
  label,
  on,
  onChangeOn,
  level,
  onChangeLevel,
}: {
  icon: React.ReactNode
  label: string
  on: boolean
  onChangeOn: (v: boolean) => void
  level: number
  onChangeLevel: (v: number) => void
}) {
  return (
    <div className="w-full rounded-[6px] border border-btn-secondary-stroke bg-btn-secondary-bg p-px">
      <div className="flex items-center gap-[8px] py-[8px] pr-[8px]">
        <div className="flex flex-1 items-center gap-[16px] pl-[16px]">
          <span className="shrink-0" style={{ width: 34, height: 38 }}>
            {icon}
          </span>
          <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
            {label}
          </span>
        </div>
        <OnOffSwitch value={on} onChange={onChangeOn} />
      </div>
      <BrightnessSlider value={level} onChange={onChangeLevel} disabled={!on} />
    </div>
  )
}

function OnOffSwitch({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  const shadow = { boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }
  const base =
    'flex-1 px-[8px] py-[16px] border font-inter font-bold text-[20px] leading-none tracking-[0.0066em] whitespace-nowrap'
  return (
    <div className="flex items-stretch w-[180px]">
      <button
        type="button"
        onClick={() => onChange(false)}
        style={shadow}
        className={`${base} rounded-l-[4px] ${
          !value
            ? 'bg-accent-blue border-accent-blue text-white'
            : 'bg-btn-secondary-bg border-btn-secondary-stroke text-btn-secondary-label'
        }`}
      >
        OFF
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        style={shadow}
        className={`${base} rounded-r-[4px] ${
          value
            ? 'bg-accent-blue border-accent-blue text-white'
            : 'bg-btn-secondary-bg border-btn-secondary-stroke text-btn-secondary-label'
        }`}
      >
        ON
      </button>
    </div>
  )
}

function BrightnessSlider({
  value,
  onChange,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  const dec = () => onChange(Math.max(0, value - 1))
  const inc = () => onChange(Math.min(4, value + 1))
  const fillPct = ((value + 1) / 5) * 100
  return (
    <div className={`flex items-stretch px-[8px] pb-[8px] ${disabled ? 'opacity-60' : ''}`}>
      <button
        type="button"
        onClick={dec}
        disabled={disabled}
        className="w-[68px] rounded-l-[8px] border border-btn-secondary-stroke bg-btn-secondary-bg flex items-center justify-center"
        style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }}
        aria-label="Decrease"
      >
        <span style={{ width: 20, height: 20, transform: 'rotate(180deg)' }}>
          <ChevronRightIcon className="h-full w-full text-btn-secondary-label" />
        </span>
      </button>
      <div className="flex-1 h-[62px] border-t border-b border-btn-secondary-stroke bg-white overflow-hidden flex items-center pr-[8px]">
        <div
          className="h-[46px] bg-accent-blue border border-accent-blue rounded-r-[8px]"
          style={{ width: `${fillPct}%` }}
        />
      </div>
      <button
        type="button"
        onClick={inc}
        disabled={disabled}
        className="w-[68px] rounded-r-[8px] border border-btn-secondary-stroke bg-btn-secondary-bg flex items-center justify-center"
        style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }}
        aria-label="Increase"
      >
        <span style={{ width: 20, height: 20 }}>
          <ChevronRightIcon className="h-full w-full text-btn-secondary-label" />
        </span>
      </button>
    </div>
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
        className="w-full h-[75px] px-[12px] rounded-[8px] border border-accent-blue bg-accent-blue text-white font-inter font-medium text-center text-[32px] tracking-[0.0066em] transition-opacity active:opacity-90"
      >
        {label}
      </button>
    )
  }
  return (
    <button
      type="button"
      disabled
      className="w-full h-[75px] px-[12px] rounded-[8px] border border-[#eaeaea] bg-white text-[#a6a6a6] font-inter font-medium text-center text-[32px] tracking-[0.0066em] cursor-not-allowed"
    >
      {label}
    </button>
  )
}
