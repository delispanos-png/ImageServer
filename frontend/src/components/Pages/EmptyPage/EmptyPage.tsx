import React, { FC, Fragment } from 'react';
import PageHeader from '../../../layout/Header/pageheader';
import { Card, Col, Row } from 'react-bootstrap';

interface EmptyPageProps { }
const EmptyPage: FC<EmptyPageProps> = () => (
  <Fragment>
    <PageHeader title="Empty" />
    <Row>
      <Col md={12}>
        <Card>
          <Card.Body>
            Something text type here.....
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default EmptyPage;
