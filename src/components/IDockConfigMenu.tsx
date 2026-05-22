import { useT } from '../i18n/LanguageContext'
import { MenuModal } from './MenuModal'
import { MenuRow } from './MenuRow'

type Props = {
  onBack: () => void
  onClose: () => void
  onOpenCameras: () => void
  onOpenDiagnostics: () => void
  onOpenCardCredential: () => void
  onOpenBypassConfig: () => void
  onOpenUserAccessConfig: () => void
  cardCredentialEnabled: boolean
}

export function IDockConfigMenu({
  onBack,
  onClose,
  onOpenCameras,
  onOpenDiagnostics,
  onOpenCardCredential,
  onOpenBypassConfig,
  onOpenUserAccessConfig,
  cardCredentialEnabled,
}: Props) {
  const t = useT()
  return (
    <MenuModal title="iDock Configuration" onBack={onBack} onClose={onClose}>
      <MenuRow label={t('Diagnostics')} onClick={onOpenDiagnostics} />
      <MenuRow label={t('Maxum Settings')} />
      <MenuRow label={t('Field Installation Settings')} />
      <MenuRow label={t('Factory Installation Settings')} />
      <MenuRow label={t('Cameras')} onClick={onOpenCameras} />
      <MenuRow
        label={t('Card/Credential')}
        status={cardCredentialEnabled ? t('Enabled') : t('Disabled')}
        onClick={onOpenCardCredential}
      />
      <MenuRow label={t('Bypass Configuration')} onClick={onOpenBypassConfig} />
      <MenuRow
        label={t('User Access Configuration')}
        onClick={onOpenUserAccessConfig}
      />
    </MenuModal>
  )
}
