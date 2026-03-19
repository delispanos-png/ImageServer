import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import PortalFooter from '../components/PortalFooter';
import PortalHeader from '../components/PortalHeader';
import PortalSidebar from '../components/PortalSidebar';
import { bindStickySidebar } from '../../app/ui/shell';

export default function PortalLayout() {
  useEffect(() => {
    const body = document.body;

    body.classList.remove('landing-page', 'horizontal', 'horizontal-hover');
    body.classList.remove('h-100vh', 'bg-primary', 'login-page');
    body.classList.remove('h-100vh', 'bg-light', 'login-page');
    body.classList.remove('register1', 'register-2', 'register-3', 'comming', 'construction');
    body.classList.remove('center-logo', 'icontext-menu', 'closed-menu', 'scrollable-layout');

    body.classList.add(
      'main-body',
      'app',
      'sidebar-mini',
      'ltr',
      'default-logo',
      'light-header',
      'light-menu',
      'cloudon-shell',
      'cloudon-portal-shell',
    );

    if (!body.classList.contains('dark-mode')) {
      body.classList.add('light-mode');
    }

    return () => {
      body.classList.remove('sidenav-toggled', 'sidenav-toggled1', 'cloudon-shell', 'cloudon-portal-shell');
    };
  }, []);

  useEffect(() => bindStickySidebar(), []);

  const closeSidebar = () => {
    document.body.classList.remove('sidenav-toggled');
    document.body.classList.remove('sidenav-toggled1');
  };

  return (
    <div className="horizontalMenucontainer cloudon-shell-frame">
      <div className="page cloudon-shell-page">
        <div className="page-main">
          <PortalHeader />
          <PortalSidebar />
          <div className="jumps-prevent" style={{ paddingTop: '0px' }} />
          <div className="app-content main-content" onClick={closeSidebar}>
            <div className="side-app">
              <div className="main-container container-fluid px-0 cloudon-shell-content">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
        <PortalFooter />
      </div>
    </div>
  );
}
