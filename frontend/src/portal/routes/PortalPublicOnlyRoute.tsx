import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { usePortalAuth } from '../providers/PortalAuthProvider';
import { portalRoutes } from './portalRouteMap';

export default function PortalPublicOnlyRoute() {
  const { isAuthenticated, isLoading } = usePortalAuth();

  if (isLoading) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={`/${portalRoutes.dashboard}`} replace />;
  }

  return <Outlet />;
}
