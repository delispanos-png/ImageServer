import React, { Fragment, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import SideBar from './SideBar/SideBar';
import { bindStickySidebar } from '../app/ui/shell';

function App() {
  useEffect(() => bindStickySidebar(), []);

  useEffect(() => {
    const body = document.body;
    body.classList.remove('landing-page', 'horizontal');
    body.classList.remove('h-100vh', 'bg-primary', 'login-page');
    body.classList.remove('h-100vh', 'bg-light', 'login-page');
    body.classList.remove('register1', 'register-2', 'bg-white', 'register-3', 'comming', 'construction');
    body.classList.add(
      'main-body',
      'app',
      'sidebar-mini',
      'ltr',
      'default-logo',
      'light-header',
      'light-menu',
      'cloudon-shell',
      'cloudon-admin-shell',
    );

    if (!body.classList.contains('dark-mode')) {
      body.classList.add('light-mode');
    }

    return () => {
      body.classList.remove('cloudon-shell', 'cloudon-admin-shell', 'sidenav-toggled');
    };
  }, []);

  const closeSidebar = () => {
    document.querySelector('body')?.classList.remove('sidenav-toggled');
  };

  return (
    <Fragment>
      <div className="horizontalMenucontainer cloudon-shell-frame">
        <div className="page cloudon-shell-page">
          <div className="page-main">
            <Header />
            <SideBar />
            <div className="jumps-prevent" style={{ paddingTop: '0px' }}></div>
            <div className="app-content main-content" onClick={closeSidebar}>
              <div className="side-app">
                <div className="main-container container-fluid px-0 cloudon-shell-content">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </Fragment>
  );
}

export default App;
