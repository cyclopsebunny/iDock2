import { useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { MenuModal } from './MenuModal'
import { SaveButton } from './SaveButton'

type Props = {
  cameraIndex: number
  enabled: boolean
  onSave: (enabled: boolean) => void
  onBack: () => void
  onClose: () => void
}

export function CameraStateConfig({
  cameraIndex,
  enabled,
  onSave,
  onBack,
  onClose,
}: Props) {
  const t = useT()
  const [draft, setDraft] = useState<boolean>(enabled)
  const dirty = draft !== enabled

  const save = () => {
    if (!dirty) return
    onSave(draft)
  }

  return (
    <MenuModal title="Camera State Configuration" onBack={onBack} onClose={onClose}>
      <div className="flex w-full items-center gap-[8px] rounded-[6px] border border-btn-secondary-stroke bg-btn-secondary-bg p-[8px]">
        <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
          {t('Camera {n} State', { n: cameraIndex })}
        </span>
        <SwitchToggle value={draft} onChange={setDraft} />
      </div>

      <div className="flex-1" />

      <SaveButton enabled={dirty} onClick={save} label="Save Configuration" />
    </MenuModal>
  )
}

function SwitchToggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  const t = useT()
  const baseBtn =
    'flex items-center justify-center px-[8px] py-[16px] font-inter font-bold text-[20px] leading-none tracking-[0.0066em] whitespace-nowrap'
  const shadow = { boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }
  return (
    <div className="flex items-stretch">
      <button
        type="button"
        onClick={() => onChange(false)}
        style={shadow}
        className={`${baseBtn} rounded-l-[4px] border ${
          !value
            ? 'bg-panel-red border-panel-red text-white'
            : 'bg-btn-secondary-bg border-btn-secondary-stroke text-btn-secondary-label'
        }`}
      >
        {t('Disabled')}
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        style={shadow}
        className={`${baseBtn} rounded-r-[4px] border ${
          value
            ? 'bg-[#6ac449] border-[#6ac449] text-white'
            : 'bg-btn-secondary-bg border-btn-secondary-stroke text-btn-secondary-label'
        }`}
      >
        {t('Enabled')}
      </button>
    </div>
  )
}

