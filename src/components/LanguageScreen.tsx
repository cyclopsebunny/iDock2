import { useLanguage } from '../i18n/LanguageContext'
import type { Lang } from '../i18n/translations'
import { MenuModal } from './MenuModal'

type Props = {
  onBack: () => void
  onClose: () => void
}

const OPTIONS: { value: Lang; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: 'us.png' },
  { value: 'es', label: 'Spanish', flag: 'mx.png' },
  { value: 'fr', label: 'French', flag: 'fr.png' },
]

export function LanguageScreen({ onBack, onClose }: Props) {
  const { lang, setLang } = useLanguage()
  return (
    <MenuModal title="Language" onBack={onBack} onClose={onClose}>
      <div className="flex flex-col gap-[8px]">
        {OPTIONS.map((opt) => {
          const selected = lang === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLang(opt.value)}
              className="w-full h-[62px] flex items-center gap-[10px] bg-btn-secondary-bg border border-btn-secondary-stroke rounded-[6px] pl-[18px] pr-[8px] py-[10px] transition-colors active:bg-[#ebebeb]"
            >
              <div className="flex items-center justify-center p-[5px] rounded-[4px] h-full">
                <img
                  src={`${import.meta.env.BASE_URL}flags/${opt.flag}`}
                  alt=""
                  className="block h-[42.5px] w-[65px] object-cover"
                />
              </div>
              <span className="flex-1 text-left font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
                {opt.label}
              </span>
              <Radio selected={selected} />
            </button>
          )
        })}
      </div>
    </MenuModal>
  )
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <span className="relative shrink-0" style={{ width: 30, height: 30 }}>
      <span
        className="absolute inset-[3.75px] rounded-full bg-white"
        style={{ border: '2.5px solid #009cde' }}
      />
      {selected && (
        <span
          className="absolute rounded-full bg-accent-blue"
          style={{ inset: '29.17%' }}
        />
      )}
    </span>
  )
}
