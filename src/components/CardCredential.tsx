import { useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { MenuModal } from './MenuModal'
import { SaveButton } from './SaveButton'
import { SegmentedToggle } from './SegmentedToggle'

type Props = {
  enabled: boolean
  onBack: () => void
  onClose: () => void
  onSave: (enabled: boolean) => void
}

export function CardCredential({ enabled, onBack, onClose, onSave }: Props) {
  const t = useT()
  const [draft, setDraft] = useState(enabled)
  const dirty = draft !== enabled

  return (
    <MenuModal title="Card/Credential" onBack={onBack} onClose={onClose}>
      <div
        className="flex items-center gap-[6px] rounded-[6px] border pl-[18px] pr-[8px] py-[8px]"
        style={{ background: '#f5f5f5', borderColor: '#b0b0b0' }}
      >
        <p className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] tracking-[0.0066em]">
          {t('Card/Credential')}
        </p>
        <SegmentedToggle
          value={draft ? 'enabled' : 'disabled'}
          onChange={(v) => setDraft(v === 'enabled')}
          options={[
            { value: 'disabled', label: t('Disabled'), tone: 'negative' },
            { value: 'enabled', label: t('Enabled'), tone: 'positive' },
          ]}
        />
      </div>

      <div className="flex-1" />

      <SaveButton enabled={dirty} onClick={() => onSave(draft)} />
    </MenuModal>
  )
}
