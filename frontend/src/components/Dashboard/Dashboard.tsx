import React, { FC, Fragment } from 'react';
import products15 from '../../assets/images/products/15.jpg';
import products13 from '../../assets/images/products/13.jpg';
import products18 from '../../assets/images/products/18.jpg';
import { ImagesData } from '../../CommonComponents/Images/CommonImages';
import { ApexChartscontent, ResponsiveDataTable } from './dashboarddata/boarddata';
import PageHeader from '../../layout/Header/pageheader';
import { Button, Card, Col, Pagination, ProgressBar, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Spark1, Spark2, Spark3, Spark4, products, products1, transactions, revenues } from '../Dashboard/dashboarddata/boarddata';
interface DashboardProps { }

const Dashboard: FC<DashboardProps> = () => (
  <Fragment>
    <PageHeader title="Dashboard" />
    <Row>
      <Col xxl={3} lg={6} md={6} className='xm-12'>
        <Card className="overflow-hidden dash1-card border-0 dash1">
          <Card.Body>
            <Row>
              <Col md={7} sm={6} className="col-6">
                <div>
                <span className="fs-14">Total Sales</span>
                <h2 className="mb-2 mt-1 number-font carn2 font-weight-bold">3,257</h2>
                <span><i className="fe fe-arrow-down-circle me-1"></i> 76% <span
                  className="ms-1 fs-11">Growth This Month</span>
                </span>
                </div>
              </Col>
              <Col md={5} sm={6} className="col-6 my-auto mx-auto">
                <div className="mx-auto text-end">

                  <Spark1 />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xxl={3} lg={6} md={6} className='xm-12'>
        <Card className="overflow-hidden dash1-card border-0 dash2">
          <Card.Body>
            <Row>
              <Col md={6} sm={6} className="col-6">
                <div>
                  <span className="fs-14">Total Stats</span>
                  <h2 className="mb-2 mt-1 number-font carn2 font-weight-bold">1,678</h2>
                  <span><i className="fe fe-arrow-down-circle me-1"></i> 15% <span
                    className="ms-1 fs-11">Loss This Month</span>
                  </span>
                </div>
              </Col>
              <Col md={6} sm={6} className=" col-6 my-auto mx-auto">
                <div className="mx-auto text-end">

                  <Spark2 />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xxl={3} lg={6} md={6} className='xm-12'>
        <Card className="overflow-hidden dash1-card border-0 dash3">
          <Card.Body>
            <Row>
              <Col md={6} sm={6} className="col-6">
                <div>
                  <span className="fs-14">Total Income</span>
                  <h2 className="mb-2 mt-1 number-font carn2 font-weight-bold">$2,590</h2>
                  <span><i className="fe fe-arrow-up-circle me-1"></i> 62% <span
                    className="ms-1 fs-11">From Last Month</span>
                  </span>
                </div>
              </Col>
              <Col md={6} sm={6} className="col-6 my-auto mx-auto">
                <div className="mx-auto text-end">

                  <Spark3 />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xxl={3} lg={6} md={6}className='xm-12'>
        <Card className="overflow-hidden dash1-card border-0 dash4">
          <Card.Body>
            <Row>
              <Col md={6} sm={6} className="col-6">
                <div className="text-justify">
                  <span>Total Tax</span>
                  <h2 className="mb-2 mt-1 number-font carn2 font-weight-bold">$1,954</h2>
                  <span><i className="fe fe-arrow-up-circle me-1"></i> 53% <span
                    className="ms-1 fs-11">From Last Month</span>
                  </span>
                </div>
              </Col>
              <Col md={6} sm={6} className=" col-6 my-auto mx-auto">
                <div className="mx-auto text-end">

                  <Spark4 />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="row">
      <Col xl={8} lg={12} md={12} sm={12}>
        <Card>
          <Card.Header className="border-bottom-0">
            <Card.Title>Sales Activity</Card.Title>
          </Card.Header>
          <Card.Body className="pt-0">
            <div className="chart-wrapper">

              <ApexChartscontent />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={4} lg={12} md={12} sm={12}>
        <Card>
          <Card.Header>
            <Card.Title>
              Recent Activity
            </Card.Title>
            <div className="card-options">
              <Button href="#" className="btn btn-sm" variant='primary'>View All</Button>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {products.map((Product) => (
              <ul className="recent-activity" key={Math.random()}>
                <li className="mb-5 mt-5">
                  <div>
                    <span className={`activity-timeline bg-${Product.color} text-white`}>{Product.main}</span>
                    <div className="activity-timeline-content">
                      <span className="font-weight-normal1 fs-13">{Product.heading}</span><span
                        className="text-muted fs-12 float-end">{Product.class2}</span>
                      <span className={`activity-sub-content text-${Product.color1} fs-11`}>{Product.class}</span>
                      <p className="text-muted fs-12 mt-1">{Product.class1}</p>
                    </div>
                  </div>
                </li>

              </ul>
            ))}
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md={12} sm={12} lg={12} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              Top Products
            </Card.Title>
            <div className="card-options">
              <Button href="#" className="btn btn-sm" variant='primary'>View All</Button>
            </div>
          </Card.Header>
          <Card.Body className=" p-0 py-2">
            <div className="table-responsive">
              <Table className="table table-hover card-table table-vcenter text-nowrap">
                <thead className="border-bottom-0 pt-3 pb-3">
                  <tr>
                    <th className="text-center">s.no</th>
                    <th>Product Category</th>
                    <th>Product Name</th>
                    <th>Sale Value</th>
                    <th>Sale Info</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products1.map((Product1) => (
                    <tr key={Math.random()}>
                      <td className="text-center">{Product1.main}</td>
                      <td><img className="avatat avatar-md brround me-2"
                        src={Product1.src1} alt="" />{Product1.heading}
                      </td>
                      <td className={`fs-13 text-${Product1.color}`}><span
                        className={`dot-label bg-${Product1.color} me-2 w-2 h-2`}></span>{Product1.class}
                      </td>
                      <td><span className="font-weight-normal1">{Product1.class1}</span></td>
                      <td className="text-muted">{Product1.class2}</td>
                      <td><span
                        className={`badge fs-11 bg-${Product1.color}-transparent text-success ms-21`}>{Product1.class3}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} sm={12} lg={6} xl={3}>
        <Card>
          <Card.Header>
            <Card.Title>
              Recent transactions
            </Card.Title>
            <div className="card-options">
              <Button href="#" className="btn btn-sm" variant='primary'>View All</Button>
            </div>
          </Card.Header>
          <Card.Body>
            {transactions.map((transaction) => (
              <div className="mb-3" key={Math.random()}>
                <div className="d-flex">
                  <div
                    className={`Recent-transactions-img brround bg-${transaction.color} text-white font-weight-normal1`}>
                    {transaction.main}</div>
                  <div>
                    <Link to="#"
                      className="font-weight-normal1 mb-1 fs-13">{transaction.heading}</Link>
                    <p className="text-muted fs-11">{transaction.class}</p>
                  </div>
                  <span
                    className={`text-${transaction.color1}success font-weight-normal fs-12 ms-auto`}>{transaction.class1}</span>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>
      <Col sm={12} md={12} lg={6} xl={3}>
        <Card>
          <Card.Header>
            <Card.Title>Revenue Of This Month</Card.Title>
          </Card.Header>
          <Card.Body>
            {revenues.map((revenue) => (
              <div className="mb-6" key={Math.random()}>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted fs-13 mb-1">{revenue.heading}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="fs-16 font-weight-normal1">{revenue.main}</span>
                  <span className="text-muted fs-12"><i
                    className="mdi mdi-arrow-up-thick text-success"></i> {revenue.class}</span>
                </div>
                <ProgressBar key={Math.random()} className="progress-sm" variant={revenue.color} animated now={revenue.width} />
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col xl={12} lg={12} md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Invoice Summary</Card.Title>
          </Card.Header>

          <Card.Body>
            <div className="table-responsive">
              <ResponsiveDataTable />
              <Pagination className="pagination float-end mb-4">
                <Pagination.Item disabled>Prev</Pagination.Item>
                <Pagination.Item className="active">
                  {1}
                </Pagination.Item>
                <Pagination.Item disabled>Next</Pagination.Item>
              </Pagination>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>

  </Fragment>
);

export default Dashboard;
