import { useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { ClockIcon, LightBulbIcon, VolumeIcon } from '../icons/EquipmentIcons'
import { ChevronRightIcon } from '../icons/Icons'
import { MenuModal } from './MenuModal'
import { SaveButton } from './SaveButton'

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
    <MenuModal title="Light & Sound" onBack={onBack} onClose={onClose}>
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
      />
    </MenuModal>
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

