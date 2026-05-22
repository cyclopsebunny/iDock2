import { useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { ChevronRightIcon } from '../icons/Icons'
import { MenuModal } from './MenuModal'
import { SaveButton } from './SaveButton'
import { SegmentedToggle } from './SegmentedToggle'

export type BypassConfig = {
  enabled: boolean
  pinCode: boolean
  cardCredential: boolean
  remote: boolean
  /**
   * Bypass PIN as a string of digits, or `null` when no PIN is set. The
   * actual digits are never shown on the configuration row — the row just
   * shows "Set" / "Not Set" to keep the secret off the screen.
   */
  pin: string | null
}

type Props = {
  value: BypassConfig
  /**
   * Mirrors the global Card/Credential setting from iDock Configuration.
   * When false, the Card/Credential checkbox row is rendered but disabled
   * with a "Disabled" subtext — the user has to enable it globally first.
   */
  cardCredentialEnabled: boolean
  onBack: () => void
  onClose: () => void
  onSave: (cfg: BypassConfig) => void
  /**
   * Open the Edit Bypass Code sub-screen. The current local draft is handed
   * back to the parent so the rest of the form's unsaved edits survive the
   * round-trip through the PIN editor.
   */
  onEditPin: (currentDraft: BypassConfig) => void
}

export function BypassConfiguration({
  value,
  cardCredentialEnabled,
  onBack,
  onClose,
  onSave,
  onEditPin,
}: Props) {
  const t = useT()
  const [draft, setDraft] = useState<BypassConfig>(value)
  const dirty = JSON.stringify(draft) !== JSON.stringify(value)

  const set = <K extends keyof BypassConfig>(key: K, v: BypassConfig[K]) =>
    setDraft((d) => ({ ...d, [key]: v }))

  // When PIN Code is off, the user can't use Card/Credential either (per
  // requirement) and the "Set Bypass PIN Code" row is greyed out.
  const showCardCredentialRow = draft.pinCode
  const pinButtonDisabled = !draft.pinCode

  return (
    <MenuModal
      title="Bypass Configuration"
      onBack={onBack}
      onClose={onClose}
      gap={8}
    >
      {/* Authentication ON/OFF */}
      <div
        className="flex items-center gap-[8px] rounded-[6px] border pl-px pr-[9px] py-[9px]"
        style={{ background: '#f5f5f5', borderColor: '#b0b0b0' }}
      >
        <p className="flex-1 pl-[16px] font-inter font-medium text-btn-secondary-label text-[24px] tracking-[0.0066em]">
          {t('Authentication')}
        </p>
        <SegmentedToggle
          value={draft.enabled ? 'on' : 'off'}
          onChange={(v) => set('enabled', v === 'on')}
          options={[
            { value: 'off', label: t('OFF'), tone: 'negative' },
            { value: 'on', label: t('ON'), tone: 'info' },
          ]}
        />
      </div>

      {/* "Authentication By:" header */}
      <div className="mt-[16px] px-[16px]">
        <p className="font-inter font-medium text-btn-secondary-label text-[28px] tracking-[0.0066em]">
          {t('Authentication By:')}
        </p>
      </div>

      <CheckboxRow
        label={t('PIN Code')}
        checked={draft.pinCode}
        onChange={(v) => set('pinCode', v)}
      />
      {showCardCredentialRow && (
        <CheckboxRow
          label={t('Card/Credential')}
          subtext={
            cardCredentialEnabled
              ? t('Once enabled here, cannot be used elsewhere.')
              : t('Disabled')
          }
          checked={cardCredentialEnabled && draft.cardCredential}
          onChange={(v) => set('cardCredential', v)}
          disabled={!cardCredentialEnabled}
        />
      )}
      <CheckboxRow
        label={t('Remote Authentication')}
        checked={draft.remote}
        onChange={(v) => set('remote', v)}
      />

      <div className="h-[16px]" />

      {/* Set Bypass PIN Code row (nav-style, shows current PIN). Disabled
          when PIN Code authentication itself is unchecked — there's no
          point editing a PIN that won't be used. */}
      <button
        type="button"
        onClick={() => !pinButtonDisabled && onEditPin(draft)}
        disabled={pinButtonDisabled}
        className={`flex h-[58px] items-center gap-[6px] rounded-[6px] border pl-[18px] pr-[8px] py-[14px] text-left transition-colors ${
          pinButtonDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'active:bg-[#ebebeb]'
        }`}
        style={{ background: '#f5f5f5', borderColor: '#b0b0b0' }}
      >
        <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] tracking-[0.0066em]">
          {t('Set Bypass PIN Code')}
        </span>
        <span className="font-inter font-bold text-btn-secondary-label text-[20px] tracking-[0.0066em] whitespace-nowrap">
          {draft.pin ? t('Set') : t('Not Set')}
        </span>
        <span
          className="shrink-0 flex items-center justify-center text-btn-secondary-label"
          style={{ width: 30, height: 30 }}
          aria-hidden
        >
          <ChevronRightIcon className="h-full w-full" />
        </span>
      </button>

      <div className="flex-1" />

      <SaveButton enabled={dirty} onClick={() => onSave(draft)} />
    </MenuModal>
  )
}

function CheckboxRow({
  label,
  subtext,
  checked,
  onChange,
  disabled = false,
}: {
  label: string
  subtext?: string
  checked: boolean
  onChange: (v: boolean) => void
  /** When true, the row is greyed out and won't respond to taps. */
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`flex w-full items-center gap-[10px] rounded-[6px] border pl-[18px] pr-[8px] py-[10px] text-left transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'active:bg-[#ebebeb]'
      }`}
      style={{ background: '#f5f5f5', borderColor: '#b0b0b0' }}
    >
      <div className="flex-1 flex flex-col gap-[6px] justify-center">
        <span className="font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
          {label}
        </span>
        {subtext && (
          <span className="font-inter font-medium text-accent-blue text-[16px] leading-tight tracking-[0.0066em]">
            {subtext}
          </span>
        )}
      </div>
      <Checkbox checked={checked} disabled={disabled} />
    </button>
  )
}

function Checkbox({
  checked,
  disabled = false,
}: {
  checked: boolean
  disabled?: boolean
}) {
  // Disabled checkboxes render as a flat grey square so the user can tell
  // at a glance that the option isn't available, regardless of whether the
  // stored value was previously on.
  if (disabled) {
    return (
      <span
        className="shrink-0 rounded-[2px]"
        style={{
          width: 24,
          height: 24,
          background: '#e5e5e5',
          border: '2.5px solid #b0b0b0',
        }}
      />
    )
  }
  if (checked) {
    return (
      <span
        className="shrink-0 flex items-center justify-center rounded-[2px]"
        style={{ width: 24, height: 24, background: '#009cde' }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M5 12L10 17L19 7"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }
  return (
    <span
      className="shrink-0 rounded-[2px]"
      style={{
        width: 24,
        height: 24,
        background: 'white',
        border: '2.5px solid #009cde',
      }}
    />
  )
}
