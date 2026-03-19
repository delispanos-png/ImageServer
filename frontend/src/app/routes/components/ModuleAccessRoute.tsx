import type { ReactNode } from 'react';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../../providers/AuthProvider';
import type { CmsModuleKey } from '../../../types';

export default function ModuleAccessRoute({
  moduleKey,
  children,
}: {
  moduleKey: CmsModuleKey;
  children: ReactNode;
}) {
  const { canAccessModule } = useAuth();

  if (!canAccessModule(moduleKey)) {
    return (
      <div className="container-fluid py-4">
        <Alert variant="danger" className="mb-0">
          You do not have permission to access this module.
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
