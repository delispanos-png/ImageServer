import React, { FC, Fragment } from 'react';
import { AreaChart, DoughnutChart, Gradient, HoriStackedBarChart, HoriStackedBarChart2, HoriStackedBarCharts, LineChart, PieChart, StackedBarChart, StackedBarCharts, Transparency } from './chartdata1/Barchart';
import { Card, Col, Row } from 'react-bootstrap';
import PageHeader from '../../../../layout/Header/pageheader';

interface ChartjsChartsProps { }

const ChartjsCharts: FC<ChartjsChartsProps> = () => (
  <Fragment>
    <PageHeader title="Chartjs Charts" />
    <Row>
      <Col sm={12} md={6} lg={4} xl={4}>
        <Card>
          <Card.Header>
            <Card.Title>Bar Chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <div>
              <StackedBarChart />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={12} md={6} lg={4} xl={4}>
        <Card>
          <Card.Header>
            <Card.Title>Transparency </Card.Title>
          </Card.Header>
          <Card.Body>
            <div>
              <Transparency />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={12} md={6} lg={4} xl={4}>
        <Card>
          <Card.Header>
            <Card.Title>Gradient Bar Chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <div>
              <Gradient />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col sm={12} md={6}>
        <Card>
          <Card.Header>
            <Card.Title>Horizontal Bar Chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="chartjs-wrapper-demo">
              <HoriStackedBarChart />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={12} md={6}>
        <Card>
          <Card.Header>
            <Card.Title>Horizontal Bar Chart Style2</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="chartjs-wrapper-demo">
              <HoriStackedBarCharts />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col sm={12} md={6}>
        <Card>
          <Card.Header>
            <Card.Title>Vertical Stacked Bar Chart</Card.Title>

          </Card.Header>
          <Card.Body>
            <div className="chartjs-wrapper-demo">
              <StackedBarCharts />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={12} md={6}>
        <Card>
          <Card.Header>
            <Card.Title>Horizontal Stacked Bar Chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="chartjs-wrapper-demo">
              <HoriStackedBarChart2 />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col sm={12} md={6}>
        <Card>
          <Card.Header>
            <Card.Title>Line Chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="chartjs-wrapper-demo">
              <LineChart />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={12} md={6}>
        <Card>
          <Card.Header>
            <div className="card-title">Area Chart</div>
          </Card.Header>
          <Card.Body>
            <div className="chartjs-wrapper-demo">
              <AreaChart />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col sm={12} md={6}>
        <Card>
          <Card.Header>
            <Card.Title>Donut Chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="chartjs-wrapper-demo">
              <DoughnutChart />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={12} md={6}>
        <Card>
          <Card.Header>
            <Card.Title>Pie Chart</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="chartjs-wrapper-demo">
              <PieChart />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default ChartjsCharts;
