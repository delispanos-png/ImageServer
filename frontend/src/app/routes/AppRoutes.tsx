import { Fragment } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ErrorLayout from '../layouts/ErrorLayout';
import AuthLayout from '../layouts/AuthLayout';
import { cmsRoutes } from './routeMap';
import DashboardPage from '../../modules/dashboard';
import ServerPage from '../../modules/server';
import SourcesPage from '../../modules/sources';
import ItemsPage from '../../modules/items';
import ItemsFixQueuePage from '../../modules/items-fix-queue';
import ItemsReviewQueuePage from '../../modules/items-review-queue';
import ItemsByCategoryPage from '../../modules/items-by-category';
import CategoriesPage from '../../modules/categories';
import ClientsPage from '../../modules/clients';
import CustomerRemarksPage from '../../modules/customer-remarks';
import MissingBarcodesPage from '../../modules/missing-barcodes';
import SourceScannerPage from '../../modules/source-scanner';
import ProductSubmissionsPage from '../../modules/product-submissions';
import BrandQueuePage from '../../modules/brand-queue';
import DuplicatesPage from '../../modules/duplicates';
import AnalyticsPage from '../../modules/analytics';
import ProductAttributesPage from '../../modules/product-attributes';
import UsersPage from '../../modules/users';
import RolesPage from '../../modules/roles';
import NotificationsPage from '../../modules/notifications';
import AuditLogPage from '../../modules/audit';
import SettingsPage from '../../modules/settings';
import LoginPage from '../../modules/auth/pages/LoginPage';
import ForgotPasswordPage from '../../modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../../modules/auth/pages/ResetPasswordPage';
import Error400 from '../../components/ErrorPages/400/400';
import Error401 from '../../components/ErrorPages/401/401';
import Error403 from '../../components/ErrorPages/403/403';
import Error404 from '../../components/ErrorPages/404/404';
import Error500 from '../../components/ErrorPages/500/500';
import Error503 from '../../components/ErrorPages/503/503';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import ModuleAccessRoute from './components/ModuleAccessRoute';
import { AuthProvider } from '../providers/AuthProvider';
import { AdminLanguageProvider } from '../i18n/AdminLanguageProvider';

const rawBase = import.meta.env.BASE_URL ?? '/';
const basePath = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

export default function AppRoutes() {
  return (
    <Fragment>
      <BrowserRouter basename={basePath || '/'}>
        <AdminLanguageProvider>
          <AuthProvider>
            <Routes>
            <Route element={<PublicOnlyRoute />}>
              <Route path={cmsRoutes.login} element={<AuthLayout />}>
                <Route index element={<LoginPage />} />
              </Route>
              <Route path={cmsRoutes.forgotPassword} element={<AuthLayout />}>
                <Route index element={<ForgotPasswordPage />} />
              </Route>
              <Route path={cmsRoutes.resetPassword} element={<AuthLayout />}>
                <Route index element={<ResetPasswordPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to={cmsRoutes.dashboard} replace />} />
                <Route
                  path={cmsRoutes.dashboard}
                  element={
                    <ModuleAccessRoute moduleKey="dashboard">
                      <DashboardPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.server}
                  element={
                    <ModuleAccessRoute moduleKey="server">
                      <ServerPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.sources}
                  element={
                    <ModuleAccessRoute moduleKey="sources">
                      <SourcesPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.items}
                  element={
                    <ModuleAccessRoute moduleKey="items">
                      <ItemsPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.itemsFixQueue}
                  element={
                    <ModuleAccessRoute moduleKey="items_fix_queue">
                      <ItemsFixQueuePage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.itemsReviewQueue}
                  element={
                    <ModuleAccessRoute moduleKey="items_review_queue">
                      <ItemsReviewQueuePage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.itemsByCategory}
                  element={
                    <ModuleAccessRoute moduleKey="items_by_category">
                      <ItemsByCategoryPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.categories}
                  element={
                    <ModuleAccessRoute moduleKey="categories">
                      <CategoriesPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.clients}
                  element={
                    <ModuleAccessRoute moduleKey="clients">
                      <ClientsPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.customerRemarks}
                  element={
                    <ModuleAccessRoute moduleKey="customer_remarks">
                      <CustomerRemarksPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.missingBarcodes}
                  element={
                    <ModuleAccessRoute moduleKey="missing_barcodes">
                      <MissingBarcodesPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.sourceScanner}
                  element={
                    <ModuleAccessRoute moduleKey="missing_barcodes">
                      <SourceScannerPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.productSubmissions}
                  element={
                    <ModuleAccessRoute moduleKey="missing_barcodes">
                      <ProductSubmissionsPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.brandQueue}
                  element={
                    <ModuleAccessRoute moduleKey="brand_queue">
                      <BrandQueuePage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.duplicates}
                  element={
                    <ModuleAccessRoute moduleKey="duplicates">
                      <DuplicatesPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.analytics}
                  element={
                    <ModuleAccessRoute moduleKey="dashboard">
                      <AnalyticsPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.productAttributes}
                  element={
                    <ModuleAccessRoute moduleKey="items">
                      <ProductAttributesPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.users}
                  element={
                    <ModuleAccessRoute moduleKey="users">
                      <UsersPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.roles}
                  element={
                    <ModuleAccessRoute moduleKey="roles">
                      <RolesPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.notifications}
                  element={
                    <ModuleAccessRoute moduleKey="notifications">
                      <NotificationsPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.auditLog}
                  element={
                    <ModuleAccessRoute moduleKey="audit_log">
                      <AuditLogPage />
                    </ModuleAccessRoute>
                  }
                />
                <Route
                  path={cmsRoutes.settings}
                  element={
                    <ModuleAccessRoute moduleKey="settings">
                      <SettingsPage />
                    </ModuleAccessRoute>
                  }
                />
              </Route>
            </Route>

            <Route path="/" element={<ErrorLayout />}>
              <Route path="ErrorPages/Error400" element={<Error400 />} />
              <Route path="ErrorPages/Error401" element={<Error401 />} />
              <Route path="ErrorPages/Error403" element={<Error403 />} />
              <Route path="ErrorPages/Error404" element={<Error404 />} />
              <Route path="ErrorPages/Error500" element={<Error500 />} />
              <Route path="ErrorPages/Error503" element={<Error503 />} />
            </Route>

            <Route path="*" element={<Navigate to={cmsRoutes.dashboard} replace />} />
            </Routes>
          </AuthProvider>
        </AdminLanguageProvider>
      </BrowserRouter>
    </Fragment>
  );
}
