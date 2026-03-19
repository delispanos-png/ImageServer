import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import type { PortalComment, PortalItem } from '../../types';
import { createPortalComment, fetchPortalComments, fetchPortalItem } from '../../services/portal';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';

function badgeVariant(status: PortalComment['status']) {
  return status === 'resolved' ? 'success' : status === 'under_review' ? 'warning' : 'info';
}

export default function PortalItemDetailPage() {
  const { itemId = '' } = useParams();
  const { t, locale } = usePortalLanguage();
  const [item, setItem] = useState<PortalItem | null>(null);
  const [comments, setComments] = useState<PortalComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [commentType, setCommentType] = useState('generic_remark');
  const [commentText, setCommentText] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const formatDate = (value: string) => {
    if (!value) return '-';
    return new Date(value).toLocaleString(locale);
  };

  const statusLabel = (status: PortalComment['status']) => t(`portal.status.${status}`);
  const commentTypeLabel = (value: string) => t(`portal.remark.type.${value}`);

  const load = async () => {
    if (!itemId) return;
    setLoading(true);
    setError('');
    try {
      const [itemData, commentsData] = await Promise.all([
        fetchPortalItem(itemId),
        fetchPortalComments({ item_id: itemId, status_filter: 'all' }),
      ]);
      setItem(itemData);
      setComments(commentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('portal.error.item'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [itemId]);

  const mainImage = useMemo(() => item?.main_image || item?.image_urls?.[0] || '', [item]);

  const handleCommentSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!itemId) return;
    setSubmitting(true);
    setError('');
    try {
      await createPortalComment(itemId, { comment_text: commentText, comment_type: commentType });
      setCommentText('');
      setCommentType('generic_remark');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('portal.error.submitRemark'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 cloudon-portal-detail">
      <div className="cloudon-page-banner cloudon-portal-detail__hero mb-4">
        <div className="cloudon-page-banner__content">
          <div className="mb-2">
            <Link to="/items" className="text-primary fw-semibold">{t('portal.actions.backToItems')}</Link>
          </div>
          <div className="cloudon-page-banner__eyebrow">{t('portal.itemDetails.readOnlyDetails')}</div>
          <h2 className="cloudon-page-banner__title mb-1">{item?.title || t('portal.itemDetails.fallbackTitle')}</h2>
          <div className="cloudon-page-banner__subtitle">{item?.barcode || '-'} • {item?.code || '-'}</div>
        </div>
        <div className="cloudon-page-banner__actions">
          <Badge bg="light" text="dark" className="border cloudon-meta-pill cloudon-meta-pill--static">{t('portal.actions.readOnly')}</Badge>
        </div>
      </div>

      {error ? <Alert variant="danger">{error}</Alert> : null}

      {loading ? (
        <Spinner animation="border" />
      ) : item ? (
        <Row className="g-4 align-items-start">
          <Col xl={4}>
            <Card className="border-0 shadow-sm cloudon-portal-detail__media-card">
              <Card.Header className="bg-transparent">
                <Card.Title className="mb-0">{t('portal.itemDetails.media')}</Card.Title>
              </Card.Header>
              <Card.Body className="cloudon-portal-detail__media-body">
                {mainImage ? (
                  <div className="cloudon-portal-detail__media-stack">
                    <div className="cloudon-portal-detail__image-frame">
                      <img
                        src={mainImage}
                        alt={item.title}
                        style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain', cursor: 'zoom-in' }}
                        onClick={() => setSelectedImage(mainImage)}
                      />
                    </div>
                    {item.image_urls?.length > 1 ? (
                      <div className="cloudon-portal-detail__thumb-grid">
                        {item.image_urls.map((imageUrl) => (
                          <button
                            key={imageUrl}
                            type="button"
                            className="btn btn-light border p-2 cloudon-portal-detail__thumb"
                            onClick={() => setSelectedImage(imageUrl)}
                          >
                            <img src={imageUrl} alt="thumbnail" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <div className="cloudon-portal-detail__media-note text-muted fs-13">
                      {t('portal.itemDetails.imagesAvailable', { count: item.image_urls.length })}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted">{t('portal.itemDetails.noHostedImage')}</div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col xl={8}>
            <Row className="g-4">
              <Col xl={6}>
                <Card className="border-0 shadow-sm cloudon-portal-detail__info-card">
                  <Card.Header className="bg-transparent"><Card.Title className="mb-0">{t('portal.itemDetails.summary')}</Card.Title></Card.Header>
                  <Card.Body className="cloudon-portal-detail__facts">
                    <div className="cloudon-portal-detail__fact">
                      <span className="text-muted d-block fs-12">{t('portal.itemDetails.categoryPath')}</span>
                      <strong>{item.category_path.length ? item.category_path.join(' / ') : '-'}</strong>
                    </div>
                    <div className="cloudon-portal-detail__fact">
                      <span className="text-muted d-block fs-12">{t('portal.itemDetails.brand')}</span>
                      <strong>{item.brand || '-'}</strong>
                    </div>
                    <div className="cloudon-portal-detail__fact">
                      <span className="text-muted d-block fs-12">{t('portal.itemDetails.unit')}</span>
                      <strong>{item.unit || '-'}</strong>
                    </div>
                    <div className="cloudon-portal-detail__fact">
                      <span className="text-muted d-block fs-12">{t('portal.itemDetails.created')}</span>
                      <strong>{formatDate(item.created_at)}</strong>
                    </div>
                    <div className="cloudon-portal-detail__fact">
                      <span className="text-muted d-block fs-12">{t('portal.itemDetails.updated')}</span>
                      <strong>{formatDate(item.updated_at)}</strong>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={6}>
                <Card className="border-0 shadow-sm cloudon-portal-detail__info-card">
                  <Card.Header className="bg-transparent"><Card.Title className="mb-0">{t('portal.itemDetails.readOnlyDetails')}</Card.Title></Card.Header>
                  <Card.Body className="cloudon-portal-detail__facts">
                    <div className="cloudon-portal-detail__fact">
                      <span className="text-muted d-block fs-12">{t('portal.itemDetails.title')}</span>
                      <strong>{item.title || '-'}</strong>
                    </div>
                    <div className="cloudon-portal-detail__fact">
                      <span className="text-muted d-block fs-12">{t('portal.itemDetails.code')}</span>
                      <strong>{item.code || '-'}</strong>
                    </div>
                    <div className="cloudon-portal-detail__fact">
                      <span className="text-muted d-block fs-12">{t('portal.itemDetails.sku')}</span>
                      <strong>{item.sku || '-'}</strong>
                    </div>
                    <div className="cloudon-portal-detail__fact">
                      <span className="text-muted d-block fs-12">{t('portal.itemDetails.barcode')}</span>
                      <strong>{item.barcode || '-'}</strong>
                    </div>
                    <div className="cloudon-portal-detail__fact">
                      <span className="text-muted d-block fs-12">{t('portal.itemDetails.imageVisibility')}</span>
                      <strong>{item.catalog_public_image_enabled ? t('portal.itemDetails.imageVisible') : t('portal.itemDetails.imageHidden')}</strong>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={12}>
                <Card className="border-0 shadow-sm cloudon-portal-detail__description-card">
                  <Card.Header className="bg-transparent"><Card.Title className="mb-0">{t('portal.itemDetails.description')}</Card.Title></Card.Header>
                  <Card.Body className="cloudon-portal-detail__description">
                    {item.description_html ? (
                      <div dangerouslySetInnerHTML={{ __html: item.description_html }} />
                    ) : (
                      <div className="text-muted">{t('portal.itemDetails.noDescription')}</div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent"><Card.Title className="mb-0">{t('portal.itemDetails.sendRemark')}</Card.Title></Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleCommentSubmit} className="d-flex flex-column gap-3">
                      <Row className="g-3">
                        <Col md={4}>
                          <Form.Label>{t('portal.itemDetails.remarkType')}</Form.Label>
                          <Form.Select value={commentType} onChange={(event) => setCommentType(event.target.value)}>
                            <option value="generic_remark">{t('portal.remark.type.generic_remark')}</option>
                            <option value="missing_description">{t('portal.remark.type.missing_description')}</option>
                            <option value="incorrect_category">{t('portal.remark.type.incorrect_category')}</option>
                            <option value="incorrect_information">{t('portal.remark.type.incorrect_information')}</option>
                            <option value="missing_characteristics">{t('portal.remark.type.missing_characteristics')}</option>
                          </Form.Select>
                        </Col>
                        <Col md={8}>
                          <Form.Label>{t('portal.itemDetails.comment')}</Form.Label>
                          <Form.Control as="textarea" rows={4} value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder={t('portal.itemDetails.commentPlaceholder')} />
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-end">
                        <Button type="submit" disabled={submitting || commentText.trim().length < 3}>{submitting ? <Spinner animation="border" size="sm" /> : t('portal.actions.submitRemark')}</Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent"><Card.Title className="mb-0">{t('portal.itemDetails.previousRemarks')}</Card.Title></Card.Header>
                  <Card.Body>
                    {comments.length ? (
                      <div className="d-flex flex-column gap-3">
                        {comments.map((comment) => (
                          <div key={comment.id} className="border rounded-3 p-3">
                            <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                              <div className="fw-semibold">{commentTypeLabel(comment.comment_type || 'generic_remark')}</div>
                              <div className="d-flex align-items-center gap-2">
                                <Badge bg={badgeVariant(comment.status)}>{statusLabel(comment.status)}</Badge>
                                <span className="text-muted fs-12">{formatDate(comment.created_at)}</span>
                              </div>
                            </div>
                            <div className="mb-2">{comment.comment_text}</div>
                            {comment.admin_response || comment.resolution_note ? (
                              <div className="bg-light border rounded-3 p-2 fs-13">
                                <strong>{t('portal.itemDetails.adminResponse')}:</strong> {comment.admin_response || comment.resolution_note}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted">{t('portal.itemDetails.noRemarks')}</div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : null}

      <Modal show={Boolean(selectedImage)} onHide={() => setSelectedImage('')} centered size="lg">
        <Modal.Body className="text-center p-4">
          {selectedImage ? <img src={selectedImage} alt="Zoom" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} /> : null}
        </Modal.Body>
      </Modal>
    </div>
  );
}
