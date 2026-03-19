import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import cloudonLogo from '../../assets/images/brand/cloudon-wordmark.svg';

const watermarkWords = ['CloudOn Catalog', 'Product Sync', 'Image Delivery', 'Client Portal'];

export default function PortalAuthLayout() {
  useEffect(() => {
    const body = document.body;
    body.classList.remove('sidenav-toggled', 'sidenav-toggled1', 'dark-mode', 'light-header', 'light-menu');
    body.classList.add('bg-white', 'login-page');
    body.classList.remove('landing-page', 'horizontal', 'register1', 'register-2', 'register-3', 'comming', 'construction');
    return () => {
      body.classList.remove('login-page');
    };
  }, []);

  return (
    <div className="page portal-auth-shell">
      <div className="portal-auth-shell__backdrop" aria-hidden="true">
        <div className="portal-auth-shell__aurora portal-auth-shell__aurora--left" />
        <div className="portal-auth-shell__aurora portal-auth-shell__aurora--right" />
        <img src={cloudonLogo} alt="" className="portal-auth-shell__ghost portal-auth-shell__ghost--top" />
        <img src={cloudonLogo} alt="" className="portal-auth-shell__ghost portal-auth-shell__ghost--bottom" />
        <div className="portal-auth-shell__watermark-grid">
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="portal-auth-shell__watermark-row"
              style={{ transform: `translateX(${rowIndex % 2 === 0 ? '0' : '7%'})` }}
            >
              {watermarkWords.map((word) => (
                <span key={`${rowIndex}-${word}`}>{word}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="page-content position-relative">
        <div className="container-fluid portal-auth-shell__container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
