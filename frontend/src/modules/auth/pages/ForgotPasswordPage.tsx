import { FormEvent, useState } from 'react';
import { Alert, Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ApiError } from '../../../services/api';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setResetToken('');
    setIsSubmitting(true);
    try {
      const response = await forgotPassword(email.trim());
      setMessage(response.message);
      if (response.reset_token) {
        setResetToken(response.reset_token);
      }
    } catch (submissionError) {
      if (submissionError instanceof ApiError) {
        setError(submissionError.message);
      } else {
        setError('Reset request failed.');
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
                    <h2 className="mb-1">Forgot Password</h2>
                    <p className="text-muted mb-0">Request a reset token for your CMS account.</p>
                  </div>
                  {error ? <Alert variant="danger">{error}</Alert> : null}
                  {message ? <Alert variant="success">{message}</Alert> : null}
                  {resetToken ? (
                    <Alert variant="warning" className="mb-4">
                      <div className="fw-semibold mb-1">Development reset token</div>
                      <code>{resetToken}</code>
                    </Alert>
                  ) : null}
                  <Form onSubmit={onSubmit} className="d-flex flex-column gap-3">
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
                          autoComplete="email"
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                    <Button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                      {isSubmitting ? <Spinner size="sm" animation="border" /> : 'Send reset request'}
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
