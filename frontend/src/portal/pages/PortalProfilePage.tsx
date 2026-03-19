import { useEffect, useState } from 'react';
import { Alert, Badge, Card, Col, Row, Spinner } from 'react-bootstrap';
import type { PortalClient } from '../../types';
import { fetchPortalProfile } from '../../services/portal';
import PortalScopeNotice from '../components/PortalScopeNotice';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';

export default function PortalProfilePage() {
  const { t } = usePortalLanguage();
  const [profile, setProfile] = useState<PortalClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchPortalProfile();
        if (active) {
          setProfile(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : t('portal.error.profile'));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [t]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="mb-1">{t('portal.profile.title')}</h2>
        <p className="text-muted mb-0">{t('portal.profile.subtitle')}</p>
      </div>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <PortalScopeNotice />
      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : profile ? (
            <Row className="g-4">
              <Col xl={6}>
                <div className="d-flex flex-column gap-3">
                  <div><span className="text-muted d-block fs-12">{t('portal.profile.name')}</span><strong>{profile.name || '-'}</strong></div>
                  <div><span className="text-muted d-block fs-12">{t('portal.profile.company')}</span><strong>{profile.company || '-'}</strong></div>
                  <div><span className="text-muted d-block fs-12">{t('portal.profile.email')}</span><strong>{profile.email || '-'}</strong></div>
                  <div><span className="text-muted d-block fs-12">{t('portal.profile.phone')}</span><strong>{profile.phone || '-'}</strong></div>
                  <div><span className="text-muted d-block fs-12">{t('portal.profile.apiUsername')}</span><strong>{profile.api_username || '-'}</strong></div>
                </div>
              </Col>
              <Col xl={6}>
                <div className="d-flex flex-column gap-3">
                  <div>
                    <span className="text-muted d-block fs-12">{t('portal.profile.subscriptionMode')}</span>
                    <Badge bg={profile.receive_all_categories ? 'success' : 'primary'}>{profile.subscription_mode}</Badge>
                  </div>
                  <div>
                    <span className="text-muted d-block fs-12 mb-2">{t('portal.profile.assignedCategories')}</span>
                    {profile.receive_all_categories ? (
                      <div className="text-muted">{t('portal.profile.allCategories')}</div>
                    ) : profile.assigned_categories?.length ? (
                      <div className="d-flex flex-wrap gap-2">
                        {profile.assigned_categories.map((category) => (
                          <Badge key={category.id} bg="light" text="dark" className="border">{category.label}</Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted">{t('portal.profile.noCategories')}</div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          ) : null}
        </Card.Body>
      </Card>
    </div>
  );
}
