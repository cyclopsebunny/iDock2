import { useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { BackArrowIcon, CloseIcon } from '../icons/Icons'

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
        <div className="flex h-[66px] items-center gap-[12px] px-[15px] shrink-0">
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
            {t('Camera State Configuration')}
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

        <div className="flex w-full items-center gap-[8px] rounded-[6px] border border-btn-secondary-stroke bg-btn-secondary-bg p-[8px]">
          <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
            {t('Camera {n} State', { n: cameraIndex })}
          </span>
          <SwitchToggle value={draft} onChange={setDraft} />
        </div>

        <div className="flex-1" />

        <SaveButton enabled={dirty} onClick={save} />
      </div>
    </div>
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

function SaveButton({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  const t = useT()
  if (enabled) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full px-[12px] py-[14px] rounded-[6px] border border-brand-primary bg-brand-primary text-white font-inter font-medium text-center text-[24px] tracking-[0.0066em] transition-opacity active:opacity-90"
      >
        {t('Save Configuration')}
      </button>
    )
  }
  return (
    <button
      type="button"
      disabled
      className="w-full px-[12px] py-[14px] rounded-[6px] border border-[#eaeaea] bg-btn-secondary-bg text-[#a6a6a6] font-inter font-medium text-center text-[24px] tracking-[0.0066em] cursor-not-allowed"
    >
      {t('Save Configuration')}
    </button>
  )
}
