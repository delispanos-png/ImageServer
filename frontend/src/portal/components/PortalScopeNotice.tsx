import { Alert } from 'react-bootstrap';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';
import { usePortalAuth } from '../providers/PortalAuthProvider';

export default function PortalScopeNotice() {
  const { client } = usePortalAuth();
  const { t } = usePortalLanguage();

  if (!client) {
    return null;
  }

  const hasAssignedScope =
    client.receive_all_categories ||
    Boolean(client.assigned_categories?.length) ||
    Boolean(client.category_ids?.length);

  if (hasAssignedScope) {
    return null;
  }

  return (
    <Alert variant="warning" className="border-warning-subtle">
      {t('portal.scope.warning')}
    </Alert>
  );
}
