import { useT } from '../i18n/LanguageContext'
import { MenuModal } from './MenuModal'

type Props = { onBack: () => void; onClose: () => void }

export function UpdateFirmware({ onBack, onClose }: Props) {
  const t = useT()
  return (
    <MenuModal title="Update Firmware" onBack={onBack} onClose={onClose} gap={8}>
      <div
        className="self-center flex flex-col items-center justify-center px-[12px] py-[14px] rounded-[6px] border-2 text-center"
        style={{
          background: '#f7dbd2',
          borderColor: '#f7b6a1',
          color: '#732006',
          width: 398,
          height: 152,
        }}
      >
        <p className="font-inter font-bold text-[30px] leading-none tracking-[0.0066em] mb-[14px]">
          {t('USB Not Found')}
        </p>
        <p className="font-inter font-medium text-[24px] leading-none tracking-[0.0066em]">
          {t('Connect a USB to update the firmware')}
        </p>
      </div>
    </MenuModal>
  )
}
