import PortalItemsPage from './PortalItemsPage';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';

export default function PortalNewItemsPage() {
  const { t } = usePortalLanguage();

  return (
    <PortalItemsPage
      title={t('portal.items.newTitle')}
      description={t('portal.items.newSubtitle')}
      recentOnlyDays={30}
    />
  );
}
