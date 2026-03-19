import { FormEvent, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import cloudonLogo from '../../assets/images/brand/cloudon-wordmark.svg';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';
import { usePortalAuth } from '../providers/PortalAuthProvider';
import { portalRoutes } from '../routes/portalRouteMap';

export default function PortalLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = usePortalAuth();
  const { t } = usePortalLanguage();
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(loginValue, password);
      const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || `/${portalRoutes.dashboard}`;
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('portal.login.failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-login-shell">
      <div className="portal-login-card">
        <section className="portal-login-card__hero">
          <div className="portal-login-card__brand">
            <img src={cloudonLogo} alt="CloudOn ContentSync Platform" className="portal-login-card__logo" />
            <span className="portal-login-card__badge">Client access</span>
          </div>
          <div className="portal-login-card__copy">
            <p className="portal-login-card__eyebrow">ContentSync Portal</p>
            <h1>{t('portal.login.heroTitle')}</h1>
            <p>{t('portal.login.heroBody')}</p>
          </div>
          <div className="portal-login-card__features">
            <div className="portal-login-card__feature">
              <span className="portal-login-card__feature-index">01</span>
              <div>
                <strong>{t('portal.login.feature.catalog')}</strong>
                <p>Structured product visibility with clean category and image context.</p>
              </div>
            </div>
            <div className="portal-login-card__feature">
              <span className="portal-login-card__feature-index">02</span>
              <div>
                <strong>{t('portal.login.feature.updates')}</strong>
                <p>Track changes without exposing editing controls to client users.</p>
              </div>
            </div>
            <div className="portal-login-card__feature">
              <span className="portal-login-card__feature-index">03</span>
              <div>
                <strong>{t('portal.login.feature.remarks')}</strong>
                <p>Collect review notes and follow-up requests directly on the item.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="portal-login-card__form-panel">
          <div className="portal-login-card__form-header">
            <p className="portal-login-card__eyebrow">Secure sign-in</p>
            <h2>{t('portal.login.formTitle')}</h2>
            <p>{t('portal.login.formSubtitle')}</p>
          </div>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Form onSubmit={handleSubmit} className="portal-login-form">
            <Form.Group>
              <Form.Label>{t('portal.login.usernameLabel')}</Form.Label>
              <Form.Control
                value={loginValue}
                onChange={(event) => setLoginValue(event.target.value)}
                placeholder={t('portal.login.usernamePlaceholder')}
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('portal.login.passwordLabel')}</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('portal.login.passwordPlaceholder')}
                autoComplete="current-password"
              />
            </Form.Group>
            <div className="portal-login-card__form-meta">
              <span>Portal credentials only</span>
              <span>Read-only access</span>
            </div>
            <Button type="submit" disabled={submitting} className="portal-login-card__submit">
              {submitting ? <Spinner animation="border" size="sm" /> : t('portal.login.submit')}
            </Button>
          </Form>
        </section>
      </div>
    </div>
  );
}
