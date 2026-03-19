import React, { FC } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';



interface VectorMapsProps {}

const VectorMaps: FC<VectorMapsProps> = () => (
  <div>

  {/* <!--Page header--> */}
  <PageHeader  title="Maps" />

  {/* <!--End Page header--> */}

  {/* <!-- Row --> */}
  <Row>
    <Col lg={12}>
      <Card>
        <Card.Header>
          <Card.Title>World Map</Card.Title>
        </Card.Header>
        <Card.Body>
          <div id="world-map-markers" className="worldh" style={{height:"300px;"}}></div>
        </Card.Body>
      </Card>
    </Col>
    {/* <!-- right col --> */}
  </Row>
  {/* <!-- End row --> */}

  {/* <!-- Row --> */}
  <Row>
    <Col lg={6}>
      <Card className="card m-b-20">
        <Card.Header>
          <Card.Title>Asia Map</Card.Title>
        </Card.Header>
        <Card.Body>
          <div id="vmap2" className="stateh" style={{height:"300px;"}}></div>
        </Card.Body>
      </Card>
    </Col>
    {/* <!-- right col --> */}

    <Col lg={6}>
      <Card className="card m-b-20">
        <Card.Header>
          <Card.Title>Australia Map</Card.Title>
        </Card.Header>
        <Card.Body>
          <div id="vmap3" className="stateh" style={{height:"300px;"}}></div>
        </Card.Body>
      </Card>
    </Col>
    {/* <!-- right col --> */}

    <Col lg={6}>
      <Card>
        <Card.Header>
          <Card.Title>Canada Map</Card.Title>
        </Card.Header>
        <Card.Body>
          <div id="vmap4" className="stateh" style={{height:"300px;"}}></div>
        </Card.Body>
      </Card>
    </Col>
    {/* <!-- right col --> */}
    <Col lg={6}>
      <div className="card m-b-20">
        <Card className="card-header">
          <Card.Title>Germany Map</Card.Title>
        </Card>
        <Card.Body>
          <div id="vmap5" className="stateh" style={{height:"300px;"}}></div>
        </Card.Body>
      </div>
    </Col>
    {/* <!-- right col --> */}

    <Col lg={6}>
      <Card className="card m-b-20">
        <Card.Header>
          <Card.Title>Europe Map</Card.Title>
        </Card.Header>
        <Card.Body>
          <div id="vmap6" className="stateh" style={{height:"300px;"}}></div>
        </Card.Body>
      </Card>
    </Col>
    {/* <!-- right col --> */}

    <Col lg={6}>
      <Card>
        <Card.Header>
          <Card.Title>India Map</Card.Title>
        </Card.Header>
        <Card.Body>
          <div id="vmap7" className="stateh" style={{height:"300px;"}}></div>
        </Card.Body>
      </Card>
    </Col>
    {/* <!-- right col --> */}
    <Col lg={6}>
      <Card className="card m-b-20">
        <Card.Header>
          <Card.Title>UK Map</Card.Title>
        </Card.Header>
        <Card.Body>
          <div id="vmap8" className="stateh" style={{height:"300px;"}}></div>
        </Card.Body>
      </Card>
    </Col>
    {/* <!-- right col --> */}

    <Col lg={6}>
      <Card>
        <Card.Header>
          <Card.Title>USA Map</Card.Title>
        </Card.Header>
        <Card.Body>
          <div id="vmap9" className="stateh" style={{height:"300px;"}}></div>
        </Card.Body>
      </Card>
    </Col>
    {/* <!-- right col --> */}
  </Row>
  {/* <!-- End Row --> */}

</div>
);

export default VectorMaps;
