import React, { FC, Fragment, useState } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Row, Tab, Tabs, Form, TabContainer, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import pngs15 from '../../../../assets/images/pngs/15.png';
import pngs16 from '../../../../assets/images/pngs/16.png';
import pngs17 from '../../../../assets/images/pngs/17.png';
import pngs18 from '../../../../assets/images/pngs/18.png';

interface ProductsDetailsProps { }

const ProductsDetails: FC<ProductsDetailsProps> = () => {

    let [img, setimg] = useState(pngs15);
  
    let click = (id) => {
      if ((id) === "watch3") {
        setimg(pngs15)
      }
      else if ((id) === "watch2") {
        setimg(pngs16)
      }
      else if ((id) === "watch4") {
        setimg(pngs17)
      }
      else if ((id) === "watch5") {
        setimg(pngs18)
      }
    }
  
  return (

    <Fragment>
      <PageHeader title="Products Details" />
      <Row>
        <Col md={12} className="wrapper wrapper-content">
          <Card>
            <Card.Body>
              <div className="ibox-content">
                <div className="row mb-3">
                  <Col md={12} lg={12} className="col-md-12 col-lg-12">
                    <Row>
                      <Col lg={12} md={12} sm={12} xs={12} xl={5}>
                               <Row>
                    <div className="col-2">
                      <div className="clearfix carousel-slider">
                        <div className="carousel slide">
                          <div className="carousel-inner">
                            <div className='carousel-item active'>
                              <div className="thumb my-2">
                                <img src={ImagesData('pngs15')} className='img-fluid br-7 border' alt="img" onClick={() => { click("watch3") }} />
                              </div>
                              <div data-bs-slide-to="1" className="thumb my-2">
                              <img src={ImagesData('pngs16')} className='img-fluid br-7 border' alt="img" onClick={() => { click("watch2") }} />
                              </div>
                              <div data-bs-slide-to="2"  className="thumb my-2">
                                <img src={ImagesData('pngs17')} className='img-fluid br-7 border' alt="img" onClick={() => { click("watch4") }} />
                              </div>
                              <div data-bs-slide-to="3"  className="thumb my-2">
                                <img src={ImagesData('pngs18')} className='img-fluid br-7 border' alt="img" onClick={() => { click("watch5") }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-10">
                      <div className="product-carousel border br-7">
                        <div
                          id="carousel"
                          className="carousel slide"
                          data-bs-ride="false"
                        >
                          <div className="carousel-inner">
                            <div>
                              <img
                                src={img}
                                alt="img"
                                className="img-fluid mx-auto d-block"
                              />
                            </div>
                            <div className="carousel-item my-2">

                              <img
                                src={ImagesData('pngs15')}
                                alt="img"
                                className="img-fluid mx-auto d-block"
                              />
                            </div>
                            <div className="carousel-item my-2">

                              <img
                                src={ImagesData('pngs16')}
                                alt="img"
                                className="img-fluid mx-auto d-block"
                              />
                            </div>
                            <div className="carousel-item my-2">

                              <img
                                src={ImagesData('pngs17')}
                                alt="img"
                                className="img-fluid mx-auto d-block"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                      </Col>
                      <Col lg={12} sm={12} xs={12} xl={7} className="mt-5">
                        <h3 className="mb-3">
                          <Link to="#" className="text-navy">
                            Stylish Men's T-shirt
                          </Link>
                        </h3>
                        <div>
                          <h5>Description</h5>
                          <p>At vero eos et accusamus et iusto odio dignissimos
                            ducimus qui blanditiis praesentium voluptatum
                            deleniti
                            atque corrupti quos dolores et quas molestias
                            excepturi
                            sint occaecati cupiditate non provident, similique
                            sunt
                            in culpa qui officia deserunt mollitia animi, id est
                            laborum et dolorum fuga.</p>
                          <p>On the other hand, we denounce with righteous
                            indignation
                            and dislike men who are so beguiled and demoralized
                            by
                            the charms of pleasure of the moment, so blinded by
                            desire, that they cannot foresee the pain and
                            trouble
                            that are bound to ensue; and equal blame belongs to
                            those who fail in their duty through weakness of
                            will,
                            which is the same as saying through shrinking from
                            toil
                            and pain.</p>
                        </div>
                        <h3 className="font-weight-bold fs-24">$99 <del
                          className="h5 font-weight-normal">$250</del></h3>
                        <div className="mt-2"><span
                          className="font-weight-bold text-primary">15% Cashback
                        </span> by using icici bank credit card.<small
                          className="text-muted">Terms and Conditions
                            Applies!</small>
                        </div>
                        <div className="font-weight-bold mb-2 mt-2"><span
                          className="fs-16">Available :</span><span
                            className="text-success ms-2 fs-16 d-inline-block">In stock</span>
                        </div>
                        <div className="font-weight-bold">Over All Ratings:<i
                          className="fa fa-star ms-2 fs-16 text-warning"></i><i
                            className="fa fa-star fs-16 text-warning"></i><i
                              className="fa fa-star fs-16 text-warning"></i><i
                                className="fa fa-star fs-16 text-warning"></i><i
                                  className="fa fa-star-half-o fs-16 text-warning"></i><span
                                    className="font-weight-semibold fs-16 ms-2 d-inline-block">4.4 Out Of
                            5.</span></div>
                        <div className="text-muted fs-14 font-weight-normal mt-2">1,164
                          Total Ratings</div>
                        <div className="row mt-2">
                          <Col lg={12} sm={12} xs={12} md={12} xl={6}>
                            <Row>
                              <div className="col-3">
                                <span>5 stars</span>
                              </div>
                              <div className="col-6">
                                <div className="progress progress-sm mb-5">
                                  <div className="progress-bar bg-warning"
                                    style={{ width: "52%" }}></div>
                                </div>
                              </div>
                              <div className="col-3">
                                <span>(52%)</span>
                              </div>
                            </Row>
                            <Row>
                              <div className="col-3">
                                <span>4 stars</span>
                              </div>
                              <div className="col-6">
                                <div className="progress progress-sm mb-5">
                                  <div className="progress-bar bg-warning"
                                    style={{ width: "33%" }}></div>
                                </div>
                              </div>
                              <div className="col-3">
                                <span>(33%)</span>
                              </div>
                            </Row>
                            <Row>
                              <div className="col-3">
                                <span>3 stars</span>
                              </div>
                              <div className="col-6">
                                <div className="progress progress-sm mb-5">
                                  <div className="progress-bar bg-warning"
                                    style={{ width: "3%" }}></div>
                                </div>
                              </div>
                              <div className="col-3">
                                <span>(3%)</span>
                              </div>
                            </Row>
                            <Row>
                              <div className="col-3">
                                <span>2 stars</span>
                              </div>
                              <div className="col-6">
                                <div className="progress progress-sm mb-5">
                                  <div className="progress-bar bg-warning"
                                    style={{ width: "2%" }}></div>
                                </div>
                              </div>
                              <div className="col-3">
                                <span>(2%)</span>
                              </div>
                            </Row>
                            <Row>
                              <div className="col-3">
                                <span>1 star</span>
                              </div>
                              <div className="col-6">
                                <div className="progress progress-sm">
                                  <div className="progress-bar bg-warning"
                                    style={{ width: "10%" }}></div>
                                </div>
                              </div>
                              <div className="col-3">
                                <span>(10%)</span>
                              </div>
                            </Row>
                          </Col>
                          <div className="col-7"></div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="ibox-content text-end">
              <Button href={`${import.meta.env.BASE_URL}Pages/ecommerce/checkout`} className="btn me-2 mb-0" variant='success'>Buy Now</Button>
              <Button href={`${import.meta.env.BASE_URL}Pages/ecommerce/shoppingcart`} className="btn" variant='primary'><i
                className="fe fe-shopping-cart me-1"></i>
                Add to cart</Button>
            </Card.Footer>
          </Card>
          <Row>
            <Col lg={7} xl={6} sm={12} md={12}>
              <Card className="productdesc">
                <Card.Body>
                  <div className="panel panel-light">
                    <div className="tab-menu-heading">
                      <div className="tabs-menu ">
                        <Tab.Container defaultActiveKey='first'>
                          <Nav as="ul" className="nav panel-tabs shop-des-tabs mb-3">
                            <Nav.Item as="li"><Nav.Link eventKey="first" className=""
                              data-bs-toggle="tab">Description</Nav.Link></Nav.Item>
                            <Nav.Item as="li"><Nav.Link eventKey='second' className=""
                              data-bs-toggle="tab">Details</Nav.Link></Nav.Item>
                            <Nav.Item as="li"><Nav.Link eventKey='third' className=""
                              data-bs-toggle="tab">Additional Features</Nav.Link></Nav.Item>

                          </Nav>

                          <div className='panel-body tabs-menu-body fs-13'>
                            <Tab.Content>

                              <Tab.Pane eventKey="first">
                                <ul>
                                  <li className="row mb-5">
                                    <div className="col-sm-3 text-muted">Brand</div>
                                    <div className="col-sm-9">Eenio, MOTilo (WUHAN)
                                      MOBILITY
                                      TECHNOLOGIES COMMNICATION MOBILITY
                                      TECHNOLOGIES
                                      MOBILITY TECHNOLOGIES COMMNICATION</div>
                                  </li>
                                  <li className="row mb-5">
                                    <div className="col-sm-3 text-muted">Model</div>
                                    <div className="col-sm-9">Eenio Tab M10 FHD Plus
                                      Tablet
                                      (10.3-inch, 2GB, 32GB, Wi-Fi + LTE, Volte
                                      Calling), Platinum Grey</div>
                                  </li>
                                  <li className="row mb-5">
                                    <div className="col-sm-3 text-muted">Dimensions
                                    </div>
                                    <div className="col-sm-9">24.4 x 0.8 x 15.3 cm; 460
                                      Grams</div>
                                  </li>
                                  <li className="row mb-5">
                                    <div className="col-sm-3 text-muted">Color</div>
                                    <div className="col-sm-9">White</div>
                                  </li>
                                  <li className="row ">
                                    <div className="col-sm-3 text-muted">Material</div>
                                    <div className="col-sm-9">Metal Body</div>
                                  </li>
                                </ul>
                              </Tab.Pane>
                              <Tab.Pane eventKey="second">
                                <ul>
                                  <li className="row mb-5">
                                    <div className="col-sm-3 text-muted">
                                      Operating System
                                    </div>
                                    <div className="col-sm-3">
                                      Android 9.0 Pie
                                    </div>
                                  </li>
                                  <li className="row mb-5 text-muted">
                                    <div className="col-sm-3">
                                      Processor Brand
                                    </div>
                                    <div className="col-sm-3">
                                      MediaTek
                                    </div>
                                  </li>
                                  <li className="row mb-5 text-muted">
                                    <div className="col-sm-3">
                                      Battery Cell Composition
                                    </div>
                                    <div className="col-sm-3">
                                      Lithium Ion
                                    </div>
                                  </li>
                                  <li className="row mb-5 text-muted">
                                    <div className="col-sm-3">
                                      Connector Type
                                    </div>
                                    <div className="col-sm-3">
                                      Cellular, Wi-Fi
                                    </div>
                                  </li>
                                  <li className="row mb-5 text-muted">
                                    <div className="col-sm-3">
                                      Manufacturer
                                    </div>
                                    <div className="col-sm-3">
                                      MOTilo
                                    </div>
                                  </li>
                                </ul>
                              </Tab.Pane>
                              <Tab.Pane eventKey="third">
                                <ul className="">
                                  <li><i
                                    className="fa fa-check me-3 text-success mb-5"></i>Quad
                                    Stereo Sound - more lively movies and music</li>
                                  <li><i
                                    className="fa fa-check me-3 text-success mb-5"></i>Long
                                    lasting 7,040 mAH battery with fast adaptive
                                    charging</li>
                                  <li><i
                                    className="fa fa-check me-3 text-success mb-5"></i>8
                                    MP Primary Camera, 5 MP Front Facing Camera</li>
                                  <li><i
                                    className="fa fa-check me-3 text-success mb-5"></i>Seamless
                                    apps and gaming experience with Qualcomm
                                    Snapdragon
                                    662 processor (4X2.0 GHz+4X1.8 GHz)</li>
                                  <li><i
                                    className="fa fa-check me-3 text-success mb-5"></i>1
                                    year manufacturer warranty for device and 6
                                    months
                                    manufacturer warranty for in-box accessories
                                  </li>
                                  <li><i
                                    className="fa fa-check me-3 text-success mb-5"></i>Customer
                                    care :1234 567 678</li>
                                </ul>
                              </Tab.Pane>
                            </Tab.Content>
                          </div>
                        </Tab.Container>
                      </div>
                    </div>
                  </div>

                </Card.Body>
              </Card>
            </Col>
            <Col lg={5} xl={6} sm={12} md={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Reviews</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div
                    className="d-sm-flex mt-0 mb-4 sub-review-section border-bottom-0 br-bs-0 br-be-0">
                    <div className="d-flex me-3">
                      <Link to="#"><img
                        className="media-object brround avatar-md" alt="64x64"
                        src={ImagesData("users1")} /> </Link>
                    </div>
                    <div className="media-body Comments1">
                      <h5 className="mt-0 mb-1 font-weight-semibold">Joanne Scott
                        <span className="fs-14 ms-0" data-bs-toggle="tooltip"
                          data-placement="top" title=""
                          data-original-title="verified"><i
                            className="fa fa-check-circle-o text-success ms-2"></i></span>
                        <span className="fs-14 ms-2 d-inline-block"> 4.5 <i
                          className="fa fa-star text-yellow"></i></span>
                        <span>
                          <Link to="#" className="new ms-3"><i
                            className="text-success br-7 text-success fe fe-thumbs-up fs-16 text-icon "></i></Link>
                          <Link to="#" className="new ms-3 mt-6"><i
                            className="text-danger br-7 text-danger fe fe-thumbs-down  fs-16 text-icon"></i></Link>
                        </span>
                      </h5>
                      <p className="font-13  mb-2 mt-2 text-muted">
                        Lorem ipsum dolor sit amet, quis Neque porro quisquam est,
                        nostrud exercitation ullamco laboris commodo consequat.
                      </p>
                      <Link to="#" className="me-2 mt-1"><span
                        className="badge badge-sm bg-primary-transparent text-primary border-primary my-1">Helpful</span></Link>
                      <Link to="#" className="me-2 mt-1"><span
                        className="border-info badge bg-info-transparent text-info">Comment</span></Link>
                      <Link to="#" className="me-2 mt-1"><span
                        className="border-danger badge bg-danger-transparent text-danger">Report</span></Link>
                    </div>
                  </div>
                  <div
                    className="d-sm-flex mt-0 mb-4  sub-review-sectio border-bottom-0 br-bs-0 br-be-0">
                    <div className="d-flex me-3">
                      <Link to="#"><img
                        className="media-object brround avatar-md" alt="64x64"
                        src={ImagesData("users1")} /> </Link>
                    </div>
                    <div className="media-body Comments1">
                      <h5 className="mt-0 mb-1 font-weight-semibold">Franchesca
                        <span className="fs-14 ms-0" data-bs-toggle="tooltip"
                          data-placement="top" title=""
                          data-original-title="verified"><i
                            className="fa fa-check-circle-o text-success ms-2"></i></span>
                        <span className="fs-14 ms-2 d-inline-block"> 4 <i
                          className="fa fa-star text-yellow"></i></span>
                        <span>
                          <Link to="#" className="new ms-3 "><i
                            className="text-success br-7 text-success fe fe-thumbs-up  fs-16 text-icon"></i></Link>
                          <Link to="#" className="new ms-3 mt-6"><i
                            className="text-danger br-7 text-danger fe fe-thumbs-down  fs-16 text-icon"></i></Link>
                        </span>
                      </h5>
                      <p className="font-13  mb-2 mt-2 text-muted">
                        Lorem ipsum dolor sit amet, quis Neque porro quisquam est,
                        nostrud.
                      </p>
                      <Link to="#" className="me-2 mt-1"><span
                        className="badge bg-primary-transparent text-primary border-primary my-1">Helpful</span></Link>
                      <Link to="#" className="me-2 mt-1"><span
                        className="border-info badge bg-info-transparent text-info">Comment</span></Link>
                      <Link to="#" className="me-2 mt-1"><span
                        className="badge border-danger bg-danger-transparent text-danger">Report</span></Link>
                    </div>
                  </div>
                  <h5 className="mb-3">Add Review</h5>
                  <Form className="form-horizontal  m-t-20">
                    <Form.Group>
                      <Col xs={12}>
                        <Form.Control as='textarea' rows={2} className="mb-3" defaultValue="Your View*" />
                      </Col>
                    </Form.Group>
                    <div>
                      <Link to="#"
                        className="btn btn-primary btn-rounded  waves-effect waves-light">Submit</Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  )
};

export default ProductsDetails;


