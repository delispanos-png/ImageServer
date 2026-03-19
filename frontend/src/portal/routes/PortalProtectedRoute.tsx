import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { usePortalAuth } from '../providers/PortalAuthProvider';
import { portalRoutes } from './portalRouteMap';

export default function PortalProtectedRoute() {
  const { isAuthenticated, isLoading } = usePortalAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${portalRoutes.login}`} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
