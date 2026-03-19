import React, { FC, Fragment } from 'react';
import { ApexChart, ApexChart1, ApexChart10, ApexChart11, ApexChart12, ApexChart14, ApexChart15, ApexChart16, ApexChart17, ApexChart18, ApexChart2, ApexChart3, ApexChart19, ApexChart20, ApexChart4, ApexChart5, ApexChart6, ApexChart7, ApexChart8, ApexChart9 } from './widgets/widgets';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row } from 'react-bootstrap';
interface ChartWidgetsProps { }

const ChartWidgetss: FC<ChartWidgetsProps> = () => (
  <Fragment>
    <PageHeader title="Widgets2" />
    <Row>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden">
          <Card.Body className="card-body pb-0">
            <div>
              <p className=" mb-0">BTC / USDT</p>
              <h3 className="mb-1 font-weight-bold">$10513</h3>
            </div>
          </Card.Body>
          <Card.Body className="card-body pt-0 pb-5 border-top-0 overflow-hidden">
            <div className="chart-wrapper">
              <ApexChart1 />

            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden">
          <Card.Body className="card-body pb-0">
            <div>
              <p className=" mb-0">XEM / USDT</p>
              <h3 className="mb-1 font-weight-bold">$966</h3>
            </div>
          </Card.Body>
          <Card.Body className="card-body pt-0 pb-5 border-top-0 overflow-hidden">
            <div className="chart-wrapper ">
              <ApexChart2 />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden">
          <Card.Body className="card-body pb-0">
            <div>
              <p className=" mb-0">XRP / USDT</p>
              <h3 className="mb-1 font-weight-bold">$7,349</h3>
            </div>
          </Card.Body>
          <Card.Body className="card-body pt-0 pb-5 border-top-0 overflow-hidden">
            <div className="chart-wrapper ">
              <ApexChart3 />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden">
          <Card.Body className="card-body pb-0">
            <div>
              <p className=" mb-0">NEO / USDT</p>
              <h3 className="mb-1 font-weight-bold">$5,563</h3>
            </div>
          </Card.Body>
          <Card.Body className="card-body pt-0 pb-5 border-top-0 overflow-hidden">
            <div className="chart-wrapper ">
              <ApexChart4 />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden bg-primary text-white">
          <Card.Body>
            <Row className='widget-chart'>
              <Col className="col">
                <div className="mb-2 fs-18">
                  Total Application
                </div>
                <h1 className="font-weight-bold mb-1">45,675</h1>
                <span><i className="fa fa-arrow-up me-1"></i> +1.4%</span>
              </Col>
              <Col className="col-auto">
                <ApexChart />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden bg-danger text-white">
          <Card.Body>
            <Row className='widget-chart'>
              <Col className="col">
                <div className="mb-2 fs-18">
                  Shortlisted
                </div>
                <h1 className="font-weight-bold mb-1">30,175</h1>
                <span><i className="fa fa-arrow-up me-1"></i> +1.8%</span>
              </Col>
              <div className="col col-auto">
                <ApexChart5 />
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden bg-success text-white">
          <Card.Body>
            <Row className='widget-chart'>
              <Col className="col">
                <div className="mb-2 fs-18">
                  Rejected
                </div>
                <h1 className="font-weight-bold mb-1">7,745</h1>
                <span><i className="fa fa-arrow-down me-1"></i> -2.4%</span>
              </Col>
              <div className="col col-auto">
                <div className="chart-circle chart-circle-md mt-sm-0 mb-0"
                  data-value="0.45" data-thickness="6" data-color="#008a4c">
                  <ApexChart6 />
                </div>

              </div>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden bg-warning text-white">
          <Card.Body className="card-body">
            <Row className='widget-chart'>
              <Col className="col">
                <div className="mb-2 fs-18">
                  Rejected
                </div>
                <h1 className="font-weight-bold mb-1">7,745</h1>
                <span><i className="fa fa-arrow-down me-1"></i> -2.4%</span>
              </Col>
              <div className="col col-auto">
                <ApexChart7 />
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col xl={3} md={12} lg={6}>
        <Card>
          <Card.Body>
            <div className="row text-center">
              <div className="col">
                <ApexChart12 />

              </div>
              <div className="col col-auto">
                <div className="mb-2 fs-18">
                  Rejected
                </div>
                <h3 className="font-weight-bold mb-1">1,745</h3>
                <span className="text-danger"><i className="fa fa-arrow-down me-1"></i>
                  -2.4%</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card>
          <Card.Body>
            <div className="row text-center">
              <Col className="col">
                <div>
                </div>
                <ApexChart19 />
              </Col>
              <div className="col col-auto">
                <div className="mb-2 fs-18">
                  Accepted
                </div>
                <h3 className="font-weight-bold mb-1">3,845</h3>
                <span className="text-success"><i className="fa fa-arrow-up me-1"></i>
                  -2.4%</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card>
          <Card.Body>
            <div className="row text-center">
              <Col className="col">
                <div>
                </div>
                <ApexChart14 />
              </Col>
              <div className="col col-auto">
                <div className="mb-2 fs-18">
                  Pending
                </div>
                <h3 className="font-weight-bold mb-1">745</h3>
                <span className="text-danger"><i className="fa fa-arrow-down me-1"></i>
                  -2.4%</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card>
          <Card.Body>
            <div className="row text-center">
              <Col className="col">
                <div>
                </div>
                <ApexChart20 />
              </Col>
              <div className="col col-auto">
                <div className="mb-2 fs-18">
                  Succeeded
                </div>
                <h3 className="font-weight-bold mb-1">745</h3>
                <span className="text-success"><i className="fa fa-arrow-down me-1"></i>
                  -2.4%</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden">
          <Card.Body>
            <Row>
              <Col className="col">
                <p className="mb-1">Today Revenue</p>
                <h2 className="mb-0 font-weight-bold text-success">$897k</h2>
              </Col>
              <Col className="col">
                <ApexChart8 />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden">
          <Card.Body>
            <Row>
              <Col className="col">
                <p className="mb-1">Unique Visitors</p>
                <h2 className="mb-0 font-weight-bold text-primary">5,896</h2>
              </Col>
              <Col className="col">
                <ApexChart9 />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden">
          <Card.Body>
            <Row>
              <Col className="col">
                <p className="mb-1">Expenses</p>
                <h2 className="mb-0 font-weight-bold text-teal">$1,678</h2>
              </Col>
              <div className="col">
                <ApexChart10 />
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6}>
        <Card className="card overflow-hidden">
          <Card.Body>
            <Row>
              <Col className="col">
                <p className="mb-1">Today Profit</p>
                <h2 className="mb-0 font-weight-bold text-danger">$817k</h2>
              </Col>
              <Col className="col">
                <ApexChart11 />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col xl={3} md={12} lg={6}>
        <Card className="card mg-b-md-20">
          <Card.Body>
            <Row>
              <Col className="col-6">
                <ApexChart15 />
              </Col>
              <div className="col-6 my-auto">
                <ul className="morris-legends">
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-secondary brround"></span>Sales</span>
                  </li>
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-secondary-light-1 brround"></span>Clients</span>
                  </li>
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-secondary-light-2 brround"></span>Profits</span>
                  </li>
                </ul>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6} className="p-l-0 p-r-0">
        <Card className="card mg-b-md-20">
          <Card.Body>
            <Row>
              <Col className="col-6">
                <ApexChart16 />
              </Col>
              <div className="col-6 my-auto">
                <ul className="morris-legends">
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-success brround"></span>Sales</span>
                  </li>
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-success-light-1 brround"></span>Clients</span>
                  </li>
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-success-light-2 brround"></span>Profits</span>
                  </li>
                </ul>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6} className="p-l-0">
        <Card className="card mg-b-md-20">
          <Card.Body>
            <Row>
              <Col className="col-6">
                <ApexChart17 />
              </Col>
              <div className="col-6 my-auto">
                <ul className="morris-legends">
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-warning brround"></span>Sales</span>
                  </li>
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-warning-light-1 brround"></span>Clients</span>
                  </li>
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-warning-light-2 brround"></span>Profits</span>
                  </li>
                </ul>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} md={12} lg={6} className="p-l-0">
        <Card className="card mg-b-md-20">
          <Card.Body>
            <Row>
              <Col className="col-6">
                <ApexChart18 />
              </Col>
              <div className="col-6 my-auto">
                <ul className="morris-legends">
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-danger brround"></span>Sales</span>
                  </li>
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-danger-light-1 brround"></span>Clients</span>
                  </li>
                  <li>
                    <span className="d-flex tx-14"><span
                      className="legend bg-danger-light-2 brround"></span>Profits</span>
                  </li>
                </ul>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default ChartWidgetss;
