import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Lang, translate } from './translations'

type LanguageContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (en: string, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  const t = useCallback(
    (en: string, vars?: Record<string, string | number>) => {
      let s = translate(lang, en)
      if (vars) {
        for (const k of Object.keys(vars)) {
          s = s.split(`{${k}}`).join(String(vars[k]))
        }
      }
      return s
    },
    [lang],
  )

  const value = useMemo<LanguageContextValue>(() => ({ lang, setLang, t }), [lang, t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const v = useContext(LanguageContext)
  if (!v) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return v
}

export function useT() {
  return useLanguage().t
}
