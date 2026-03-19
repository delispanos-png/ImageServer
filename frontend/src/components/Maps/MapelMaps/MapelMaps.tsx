import React, { FC } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';



interface MapelMapsProps {}

const MapelMaps: FC<MapelMapsProps> = () => (
  <div>

  {/* <!--Page header--> */}
  <PageHeader  title="Maps" />

  {/* <!--End Page header--> */}

  {/* <!-- Row --> */}
  <Row>
      <Col lg={12} md={12}>
          <Card>
              <Card.Header>
                  <Card.Title>Map with links between the plotted cities</Card.Title>
              </Card.Header>
              <Card.Body>
                  <div className="mapcontainer4">
                      <div className="map pt-0">
                          <span>Alternative content for the map</span>
                      </div>
                  </div>
              </Card.Body>
          </Card>
      </Col>
      <Col lg={6} md={12}>
          <Card>
              <Card.Header>
                  <Card.Title>Static MapelMaps</Card.Title>
              </Card.Header>
              <Card.Body>
                  <div className="mapcontainer">
                      <div className="map pt-0">
                          <span>Alternative content for the map</span>
                      </div>
                  </div>
              </Card.Body>
          </Card>
      </Col>
      <Col lg={6} md={12}>
          <Card>
              <Card.Header>
                  <Card.Title> Map with a legend for areas</Card.Title>
              </Card.Header>
              <Card.Body>
                  <div className="mapcontainer1">
                      <div className="map pt-0">
                          <span>Alternative content for the map</span>
                      </div>
                  </div>
              </Card.Body>
          </Card>
      </Col>
  </Row>
  {/* <!-- /Row --> */}
</div>
);

export default MapelMaps;
