import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PortalAuthProvider } from '../providers/PortalAuthProvider';
import { PortalLanguageProvider } from '../i18n/PortalLanguageProvider';
import PortalAuthLayout from '../layouts/PortalAuthLayout';
import PortalLayout from '../layouts/PortalLayout';
import PortalProtectedRoute from './PortalProtectedRoute';
import PortalPublicOnlyRoute from './PortalPublicOnlyRoute';
import { portalRoutes } from './portalRouteMap';
import PortalLoginPage from '../pages/PortalLoginPage';
import PortalDashboardPage from '../pages/PortalDashboardPage';
import PortalItemsPage from '../pages/PortalItemsPage';
import PortalNewItemsPage from '../pages/PortalNewItemsPage';
import PortalCategoriesPage from '../pages/PortalCategoriesPage';
import PortalRemarksPage from '../pages/PortalRemarksPage';
import PortalProfilePage from '../pages/PortalProfilePage';
import PortalItemDetailPage from '../pages/PortalItemDetailPage';

export default function PortalRoutes() {
  const rawBase = import.meta.env.BASE_URL ?? '/';
  const basePath = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

  return (
    <BrowserRouter basename={basePath || '/'}>
      <PortalLanguageProvider>
        <PortalAuthProvider>
          <Routes>
            <Route element={<PortalPublicOnlyRoute />}>
              <Route element={<PortalAuthLayout />}>
                <Route path={portalRoutes.login} element={<PortalLoginPage />} />
              </Route>
            </Route>

            <Route element={<PortalProtectedRoute />}>
              <Route element={<PortalLayout />}>
                <Route index element={<Navigate to={portalRoutes.dashboard} replace />} />
                <Route path={portalRoutes.dashboard} element={<PortalDashboardPage />} />
                <Route path={portalRoutes.items} element={<PortalItemsPage />} />
                <Route path={portalRoutes.newItems} element={<PortalNewItemsPage />} />
                <Route path={portalRoutes.categories} element={<PortalCategoriesPage />} />
                <Route path={portalRoutes.myRemarks} element={<PortalRemarksPage />} />
                <Route path={portalRoutes.profile} element={<PortalProfilePage />} />
                <Route path={portalRoutes.itemDetails} element={<PortalItemDetailPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to={portalRoutes.dashboard} replace />} />
          </Routes>
        </PortalAuthProvider>
      </PortalLanguageProvider>
    </BrowserRouter>
  );
}
