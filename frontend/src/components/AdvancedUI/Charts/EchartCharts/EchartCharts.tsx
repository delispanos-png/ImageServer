import { FC, Fragment } from 'react';
import { BarChart, DataAttr, DataAttribute, HorizontalBarChart, LineChart, SingleLineChart, SmoothLineChart, VerticalLineChart } from './Echartdata/Linechart';
import PageHeader from '../../../../layout/Header/pageheader';

import { Card, Col, Row } from 'react-bootstrap';
interface EchartChartsProps { }

const EchartChartss: FC<EchartChartsProps> = () => (
  <Fragment>
    <PageHeader title="Echart Charts"/>
    <Row>
      <Col lg={6} md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Line chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <DataAttr />
          </Card.Body>
        </Card>
      </Col>
      <Col lg={6} md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Combination of Line & Bar Chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <DataAttribute />

          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col lg={6} md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Vertical Line chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <VerticalLineChart />
          </Card.Body>
        </Card>
      </Col>
      <Col lg={6} md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Vertical Combination of Line & Bar Chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <LineChart />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col lg={6} md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Bar Chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <BarChart />
          </Card.Body>
        </Card>
      </Col>
      <Col lg={6} md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Horizontal Bar Chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <HorizontalBarChart />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col lg={6} md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Single line chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <SingleLineChart />
          </Card.Body>
        </Card>
      </Col>
      <Col lg={6} md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Single smooth line chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <SmoothLineChart />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default EchartChartss;
