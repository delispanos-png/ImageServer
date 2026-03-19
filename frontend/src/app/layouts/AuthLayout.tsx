import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import cloudonLogo from '../../assets/images/brand/cloudon-wordmark.svg';

const watermarkWords = ['Catalog Ops', 'Content Review', 'Source Control', 'Image Delivery'];

export default function AuthLayout() {
  useEffect(() => {
    const body = document.body;
    body.classList.remove(
      'sidenav-toggled',
      'sidenav-toggled1',
      'dark-mode',
      'light-header',
      'light-menu',
      'landing-page',
      'horizontal',
      'register1',
      'register-2',
      'register-3',
      'comming',
      'construction',
    );
    body.classList.add('bg-white', 'login-page');
    return () => {
      body.classList.remove('login-page');
    };
  }, []);

  return (
    <div className="page admin-auth-shell">
      <div className="admin-auth-shell__backdrop" aria-hidden="true">
        <div className="admin-auth-shell__aurora admin-auth-shell__aurora--left" />
        <div className="admin-auth-shell__aurora admin-auth-shell__aurora--right" />
        <img src={cloudonLogo} alt="" className="admin-auth-shell__ghost admin-auth-shell__ghost--top" />
        <img src={cloudonLogo} alt="" className="admin-auth-shell__ghost admin-auth-shell__ghost--bottom" />
        <div className="admin-auth-shell__watermark-grid">
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="admin-auth-shell__watermark-row"
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
        <div className="container-fluid admin-auth-shell__container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
