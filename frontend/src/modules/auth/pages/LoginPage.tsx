import { FormEvent, useMemo, useState } from 'react';
import { Alert, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ApiError } from '../../../services/api';
import cloudonLogo from '../../../assets/images/brand/cloudon-wordmark.svg';

function getRedirectTarget(state: unknown) {
  if (state && typeof state === 'object' && 'from' in state) {
    const from = (state as { from?: { pathname?: string } }).from;
    if (from?.pathname) {
      return from.pathname;
    }
  }
  return '/dashboard';
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const target = useMemo(() => getRedirectTarget(location.state), [location.state]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(target, { replace: true });
    } catch (submissionError) {
      if (submissionError instanceof ApiError) {
        setError(submissionError.message);
      } else {
        setError('Login failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <section className="admin-login-card__hero">
          <div className="admin-login-card__brand">
            <img src={cloudonLogo} alt="CloudOn ContentSync Platform" className="admin-login-card__logo" />
            <span className="admin-login-card__badge">Admin access</span>
          </div>
          <div className="admin-login-card__copy">
            <p className="admin-login-card__eyebrow">Operational shell</p>
            <h1>CloudOn CMS</h1>
            <p>Access catalog operations, refresh workflows, audit events, and review queues from one controlled shell.</p>
          </div>
          <div className="admin-login-card__features">
            <div className="admin-login-card__feature">
              <span className="admin-login-card__feature-index">01</span>
              <div>
                <strong>Catalog control</strong>
                <p>Items, categories, source coverage, and readiness signals in one place.</p>
              </div>
            </div>
            <div className="admin-login-card__feature">
              <span className="admin-login-card__feature-index">02</span>
              <div>
                <strong>Source orchestration</strong>
                <p>Manual refresh, fallback chains, bulk repair flows, and hosted image overrides.</p>
              </div>
            </div>
            <div className="admin-login-card__feature">
              <span className="admin-login-card__feature-index">03</span>
              <div>
                <strong>Traceable publishing</strong>
                <p>Role-based access, session validation, and full audit visibility for every change.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="admin-login-card__form-panel">
          <div className="admin-login-card__form-header">
            <p className="admin-login-card__eyebrow">Secure sign-in</p>
            <h2>Login</h2>
            <p>Use your CMS credentials to start a secure session.</p>
          </div>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Form onSubmit={onSubmit} className="admin-login-form">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fe fe-mail" />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@cloudon.local"
                  autoComplete="username"
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
                <Button variant="light" onClick={() => setShowPassword((value) => !value)} type="button">
                  <i className={`zmdi ${showPassword ? 'zmdi-eye-off' : 'zmdi-eye'}`} />
                </Button>
              </InputGroup>
            </Form.Group>
            <div className="admin-login-card__form-meta">
              <span>Session cookie with server validation</span>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <Button type="submit" className="admin-login-card__submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" animation="border" /> : 'Login'}
            </Button>
          </Form>
        </section>
      </div>
    </div>
  );
}
