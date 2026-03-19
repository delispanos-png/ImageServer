import { FormEvent, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ApiError } from '../../../services/api';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialToken = useMemo(() => searchParams.get('token') ?? '', [searchParams]);

  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token.trim(), password);
      setMessage('Password updated. Redirecting to login...');
      window.setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (submissionError) {
      if (submissionError instanceof ApiError) {
        setError(submissionError.message);
      } else {
        setError('Password reset failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-single">
        <div className="container">
          <Row className="justify-content-center mt-5">
            <Col xl={5} lg={7} md={9}>
              <Card className="border-0 br-7">
                <Card.Body className="p-5">
                  <div className="mb-4">
                    <h2 className="mb-1">Reset Password</h2>
                    <p className="text-muted mb-0">Apply the reset token and set a new password.</p>
                  </div>
                  {error ? <Alert variant="danger">{error}</Alert> : null}
                  {message ? <Alert variant="success">{message}</Alert> : null}
                  <Form onSubmit={onSubmit} className="d-flex flex-column gap-3">
                    <Form.Group>
                      <Form.Label>Reset token</Form.Label>
                      <Form.Control
                        value={token}
                        onChange={(event) => setToken(event.target.value)}
                        placeholder="Paste reset token"
                        required
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>New password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          autoComplete="new-password"
                          required
                        />
                        <Button variant="light" type="button" onClick={() => setShowPassword((value) => !value)}>
                          <i className={`zmdi ${showPassword ? 'zmdi-eye-off' : 'zmdi-eye'}`} />
                        </Button>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Confirm password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          autoComplete="new-password"
                          required
                        />
                        <Button variant="light" type="button" onClick={() => setShowConfirmPassword((value) => !value)}>
                          <i className={`zmdi ${showConfirmPassword ? 'zmdi-eye-off' : 'zmdi-eye'}`} />
                        </Button>
                      </InputGroup>
                    </Form.Group>
                    <Button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                      {isSubmitting ? <Spinner size="sm" animation="border" /> : 'Reset password'}
                    </Button>
                    <div className="text-center fs-13">
                      <Link to="/login">Back to login</Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
