import { useT } from '../i18n/LanguageContext'
import { BackArrowIcon, CloseIcon } from '../icons/Icons'

type Props = { onBack: () => void; onClose: () => void }

export function UpdateFirmware({ onBack, onClose }: Props) {
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
            {t('Update Firmware')}
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
      </div>
    </div>
  )
}
