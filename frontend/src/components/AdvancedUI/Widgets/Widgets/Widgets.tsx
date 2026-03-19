import React, { FC, Fragment, useState } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Collapse, ProgressBar, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LightboxGallery, products, widgets } from '../Widgets/Data/Widgets1Data';
import { products1, transactions, revenues, widgets1, widgets2, Invoices, targets, visits, facebooks, widgets3 } from '../Widgets/Data/Widgets1Data';

interface WidgetsProps { }

const Widgets: FC<WidgetsProps> = () => {
  const now = 58;
  //Card Blue
  const [BlueExpanded, setBlueExpanded] = useState(true)

  const BlueHandleExpandClick = () => {
    setBlueExpanded(!BlueExpanded)
  }
  const [Blueshow, setBlueshow] = useState(true)

  return (

    <Fragment>
      <PageHeader title="Widgets" />
      <Row>
        {widgets.map((widget) => (
          <Col xl={3} lg={6} md={12} key={Math.random()}>
            <Card>
              <Card.Body>
                {widget.icon}
                <p className=" mb-1">{widget.heading}</p>
                <h2 className="mb-1 font-weight-bold">{widget.text}</h2>
                <span className="mb-1 text-muted"><span className={`text-${widget.color}`}><i
                  className={`fa fa-${widget.icon1}  me-1`}></i>{widget.data1}</span>{widget.data}</span>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Col md={12} sm={12} lg={12} xl={6}>
          <Card>
            <Card.Header>
              <Card.Title>
                Top Products
              </Card.Title>
              <div className="card-options">
                <Button href="#" className="btn btn-sm mt-3" variant='primary'>View All</Button>
              </div>
            </Card.Header>
            <Card.Body className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover card-table table-vcenter text-nowrap">
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
                        <td className="fs-13 text-success"><span
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
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} sm={12} lg={6} xl={3} >
          <Card>
            <Card.Header>
              <Card.Title>
                Recent transactions
              </Card.Title>
              <div className="card-options">
                <Button href="#" className="btn btn-sm mt-3" variant='primary'>View All</Button>
              </div>
            </Card.Header>
            <Card.Body>
              {transactions.map((transaction) => (
                <div className="mt-2" key={Math.random()}>
                  <div className="d-flex">
                    <div
                      className={`Recent-transactions-img brround bg-${transaction.color} text-white font-weight-normal1`}>
                      {transaction.main}</div>
                    <div>
                      <Link to="#"
                        className="font-weight-normal1 fs-13">{transaction.heading}</Link>
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
        <Col md={12} sm={12} lg={6} xl={3}>
          <Card>
            <Card.Header>
              <Card.Title>Revenue Of This Month</Card.Title>
            </Card.Header>
            <Card.Body>
              {revenues.map((revenue) => (
                <div className="mt-5" key={Math.random()}>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted fs-13 mb-1">{revenue.heading}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fs-16 font-weight-normal1">{revenue.main}</span>
                    <span className="text-muted fs-12"><i className="mdi mdi-arrow-up-thick text-success"></i> {revenue.class}</span>
                  </div>
                  <ProgressBar key={Math.random()} className="progress-sm" variant={revenue.color} animated now={revenue.width} />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6} xl={4}>
          <Card>
            <Card.Header>
              <Card.Title>
                Recent Activity
              </Card.Title>
              <div className="card-options">
                <Button href="#" className="btn btn-sm " variant='primary'>View All</Button>
              </div>
            </Card.Header>
            <Card.Body className="card-body p-0">
              <ul className="recent-activity">
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
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={8}>
          <Card>
            <Card.Body className="card-body p-0 pt-4">
              <div className="table-responsive">
                <Table className="table card-table table-vcenter text-nowrap">
                  <thead>
                    <tr>
                      <th>s.no</th>
                      <th>Product Category</th>
                      <th>Customer Ratings</th>
                      <th>Sale Value</th>
                      <th>Sale Info</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {widgets3.map((widget3) => (
                      <tr key={Math.random()}>
                        <td>{widget3.value}</td>
                        <td><img className="avatat avatar-md brround me-2"
                          src={widget3.src1}
                          alt="img" />{widget3.heading}
                        </td>
                        <td className=" fs-12"><i className="fa fa-star text-warning"></i><i
                          className="fa fa-star text-warning"></i><i
                            className="fa fa-star text-warning"></i><i
                              className={`fa fa-${widget3.icon1} text-warning`}></i><i
                                className={`fa fa-${widget3.icon} text-warning`}></i></td>
                        <td><span className="font-weight-semibold">{widget3.text}</span></td>
                        <td className="text-muted">{widget3.data}</td>
                        <td><span
                          className={`badge bg-${widget3.color} text-white p-2 ms-2`}>{widget3.main}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        {widgets1.map((widget1) => (
          <Col xl={4} lg={4} md={12} key={Math.random()}>
            <Card>
              <Card.Body>
                {widget1.icon}
                <p className=" mb-1 text-muted fs-14">{widget1.heading}</p>
                <h2 className="mb-1 font-weight-bold text-primary">{widget1.text}</h2>
                <span className="mb-1"><span className={`text-${widget1.color}`}><i
                  className={`fa fa-${widget1.icon1}  me-1`}></i>
                  {widget1.data1}</span> {widget1.data}</span>
                <ProgressBar key={Math.random()} className="progress-sm mt-3" variant={widget1.color1} animated now={widget1.width} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Col xl={4} lg={12} md={12}>
          <Card>
            <Card.Body className="card-body text-center bg-primary text-white">
              <img className="avatar avatar-xxl brround mb-5"
                src={ImagesData("users16")} alt="img" />
              <h4 className="font-weight-semibold mb-1">John Thomson</h4>
              <p className="fs-12 mb-0">UI/UX Designer</p>
            </Card.Body>
            <Card.Body>
              <Row className=" mb-2">
                <div className="col-4 fs-12">Previous</div>
                <div className="col-8 font-weight-semibold fs-12">New Tech Software Pvt Ltd
                </div>
              </Row>
              <Row className=" mb-2">
                <div className="col-4 fs-12">Opportunity</div>
                <div className="col-8 font-weight-semibold fs-12">Through Facebook</div>
              </Row>
              <Row className="">
                <div className="col-4 fs-12">Education</div>
                <div className="col-8 font-weight-semibold fs-12">Bachelors of Engineering</div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={12} md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Interview Schedule</Card.Title>
            </Card.Header>
            <Card.Body>
              <h3 className="font-weight-bold">04<sup>th</sup> July, 2021</h3>
              <div className="d-flex mb-5 mt-5">
                <div className="icon icon-shape bg-primary br-5 text-white mb-0 me-3">
                  <div>04</div>
                </div>
                <div>
                  <p className="mb-1">New Modal Technologies<br /> <b>Software Pvt ltd</b></p>
                  <small className="text-muted">10.04am</small>
                </div>
              </div>
              <div className="d-flex">
                <div
                  className="icon icon-shape bg-secondary br-5 text-white mb-0 me-3">
                  <div>04</div>
                </div>
                <div>
                  <p className="mb-1">New Modal Technologies<br /> <b>Software Pvt ltd</b></p>
                  <small className="text-muted">12.04pm</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={12} md={12}>
          <Card className="card  mb-3">
            <Card.Body>
              <div className="media mt-0">
                <figure className="rounded-circle align-self-start mb-0">
                  <img src={ImagesData("users1")}
                    alt="Generic placeholder image"
                    className="avatar brround avatar-md me-3" />
                </figure>
                <div className="media-body time-title1 ">
                  <h5 className="time-title p-0 mb-0 font-weight-semibold leading-normal">
                    Victoria
                  </h5>
                  New york, UK
                </div>
                <Button className="btn  d-sm-block me-1 mb-3" variant='primary'><i
                  className="fa fa-comments"></i> </Button>
                <Button className="btn d-sm-block mb-3" variant='info'><i className="fa fa-phone"></i>
                </Button>
              </div>
            </Card.Body>
            <Card.Footer className="card-footer text-secondary border-top">
              Email: <span className="text-primary">victoriacott@Azea.com</span>
            </Card.Footer>
          </Card>
          <Card className="mb-5">
            <Card.Body>
              <div className="media mt-0">
                <figure className="rounded-circle align-self-start mb-0">
                  <img src={ImagesData("users16")}
                    alt="Generic placeholder image"
                    className="avatar brround avatar-md me-3" />
                </figure>
                <div className="media-body time-title1 ">
                  <h5 className="time-title p-0 mb-0 font-weight-semibold leading-normal">
                    Thomas
                    Jaim</h5>
                  Spain, UN
                </div>
                <button className="btn btn-primary d-sm-block me-1 mb-3"><i
                  className="fa fa-comments"></i> </button>
                <button className="btn btn-info d-sm-block mb-3"><i className="fa fa-phone"></i>
                </button>
              </div>
            </Card.Body>
            <Card.Footer className="card-footer text-secondary border-top">
              Email: <span className="text-primary">thomasjaim@Azea.com</span>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row>
        {widgets2.map((widget2) => (
          <Col sm={12} lg={4} key={Math.random()}>
            <Card>
              <Card.Body className="card-body text-center list-icons">
                {widget2.icon}
                <p className="card-text mt-3 mb-0">{widget2.heading}</p>
                <p className="h2 text-center font-weight-bold">{widget2.text}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {Invoices.map((Invoice) => (
          <Col sm={12} md={6} xl={3} key={Math.random()}>
            <Card className={`bg-${Invoice.color}`}>
              <Card.Body>
                <div className="d-flex no-block align-items-center">
                  <div>
                    <h6 className="text-white">{Invoice.heading}</h6>
                    <h2 className="text-white m-0 font-weight-bold">{Invoice.text}</h2>
                  </div>
                  <div className="ms-auto">
                    <span className="text-white display-6"><i
                      className={`fa fa-${Invoice.icon} fa-2x`}></i></span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        {Blueshow ?
          <Col md={12} sm={12} lg={12}>
            <div className="demo-gallery card">
              <Card.Header>
                <Card.Title>Best Pictures for Today</Card.Title>
                <div className="card-options ">
                  <Link to="#" onClick={BlueHandleExpandClick} className="card-options-collapse"
                    data-bs-toggle="card-collapse"><i className={`fe ${BlueExpanded ? 'fe fe-chevron-up' : 'fe fe-chevron-down'}`}></i></Link>
                  <Link to="#" onClick={() => setBlueshow(false)} className="card-options-remove"
                    data-bs-toggle="card-remove"><i className="fe fe-x"></i></Link>
                </div>
              </Card.Header>
              <Collapse in={BlueExpanded} timeout={3000}>
                <Card.Body>
                  <ul id="lightgallery" className="list-unstyled row">
                    <LightboxGallery />
                  </ul>
                </Card.Body>
              </Collapse>
            </div>
          </Col>
          : null}
      </Row>
      <Row>
        {targets.map((target) => (
          <Col lg={4} key={Math.random()}>
            <Card>
              <Card.Body>
                <div className="mb-4 fs-14 font-weight-semibold">
                  {target.heading}
                </div>
                <Row>
                  <Col className="col">
                    Target Achivement
                  </Col>
                  <div className="col col-auto">
                    <span className={`text-${target.color} h5`}>{target.text}</span>
                  </div>
                </Row>
                <ProgressBar className="progress-sm mt-3" variant={target.color1} now={target.width} />

                <Row>
                  <Col>
                    <div className="mt-4">
                      <h6 className="mb-1 fs-12">{target.title}</h6>
                      <h4 className="mb-0 font-weight-semibold">{target.data}</h4>
                    </div>
                  </Col>
                  <div className="col col-auto">
                    <div className="mt-4">
                      <h6 className="mb-1 fs-12">{target.title1}</h6>
                      <h4 className="mb-0 font-weight-semibold">{target.data1}</h4>
                    </div>
                  </div>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Row className="row me-0 ms-0">
              {visits.map((visit) => (
                <Col xl={2} lg={6} sm={6} className="pe-0 ps-0 border-end" key={Math.random()}>
                  <Card.Body className="card-body text-center">
                    <p className="mb-1">{visit.heading}</p>
                    <h2 className="mb-1 font-weight-bold">{visit.text}</h2>
                    <span className="mb-0 text-muted"><span className={`text-${visit.color}`}><i
                      className={`fa fa-${visit.icon}  me-1`}></i> {visit.data}</span> Last
                      month</span>
                  </Card.Body>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        {facebooks.map((facebook) => (
          <Col xl={3} md={6} sm={12} className="m-b-3" key={Math.random()}>
            <Card className="card overflow-hidden">
              <div>
                <Row>

                  <Col className="col-12">
                    <div className="bg-primary p-4 ">
                      <div className="text-center text-white social">
                        <i className={`fa fa-${facebook.icon}`}></i>
                      </div>
                    </div>
                    <Card.Body className="card-body mt-0">
                      <div className="d-flex  align-items-center">
                        <div>
                          <h3 className="font-weight-semibold mb-1">{facebook.text}</h3>
                          <h5 className="text-muted mb-0">Following</h5>
                        </div>
                        <div className="ms-auto">
                          <h3 className="font-weight-semibold mb-1">{facebook.text1}</h3>
                          <h5 className="text-muted mb-0">Friends</h5>
                        </div>
                      </div>
                    </Card.Body>
                  </Col>

                </Row>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Fragment>
  )
};

export default Widgets;
