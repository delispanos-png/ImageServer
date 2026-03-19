import React, { FC, Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import { panelHeadings, headerpanels } from '../../../components/Elements/Panel/Data/panelData';
interface PanelProps { }

const Panel: FC<PanelProps> = () => (
  <Fragment>
    <PageHeader title="Panels" />
    <Row>
      <Col md={12} lg={12}>
        <Card>
          <Card.Header>
            <Card.Title as="h3">Simple Panels</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="expanel expanel-default m-0">
              <div className="expanel-body">
                Basic panel example
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md={12} lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Panel with heading</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="row mt-4">
              {panelHeadings.map((panelHeading) => (
                <Col lg={6} key={Math.random()}>
                  <div className="expanel expanel-default">
                    <div className="expanel-heading">{panelHeading.heading}</div>
                    <div className="expanel-body">
                      Panel content
                    </div>
                  </div>
                </Col>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md={12} lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Panel with footer</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="expanel expanel-default m-0">
              <div className="expanel-body">
                Panel content
              </div>
              <div className="expanel-footer">Panel footer</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md={12} lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Panel with color header</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="row mt-4">
              {headerpanels.map((headerpanel) => (
                <Col lg={6} key={Math.random()}>
                  <div className={`expanel expanel-${headerpanel.color} overflow-hidden`}>
                    <div className="expanel-heading">
                      <h3 className="expanel-title">Panel title</h3>
                    </div>
                    <div className="expanel-body">
                      Panel content
                    </div>
                  </div>
                </Col>
              ))}
            </div>
            <Row>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default Panel;
