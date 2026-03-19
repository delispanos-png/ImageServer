import React, { FC, useState,Fragment } from 'react';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages';
import PageHeader from '../../../layout/Header/pageheader';
import { Button, Card, Col, Form, InputGroup, Nav, Pagination, Row, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface SearchProps { }

const Search: FC<SearchProps> = () => {

  return (

    <Fragment>
      <PageHeader title="Search" />
      <Row>
        <Col sm={12} md={12}>

          <Card className="custom-card search-tabs">
            <Card.Body className="pb-0">
              <InputGroup className="mb-2">
                <Form.Control className="form-control" placeholder="Searching....." id="InputGroup" />
                <Button className="btn ripple btn-primary" type="button">Search</Button>
              </InputGroup>
              <div className="tabs-menu1">
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                  <Nav as="ul" className="flex-column ">
                    <Nav.Item as="li">
                      <Nav.Link eventKey="first">All</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="second">Images</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="third">Books</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="four">News</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="five">Videos</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Tab.Container>
              </div>
            </Card.Body>
            <Card.Footer className=" p-3">
              <p className="text-muted mb-0 ps-3">About 12,546,90000 results (0.56 Seconds)</p>
            </Card.Footer>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="#" className="h4 ">Templist – HTML5 Digital
                  Marketplace
                  Template by ...</Link>
              </div>
              <Link to="#"
                className="text-primary">https://www.spruko.com/demo/templist/Html/index.html</Link>
              <p className="text-muted mt-2 mb-2">Nemo enim ipsam voluptatem quia voluptas sit
                aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui
                ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
                ipsum
                quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius
                modi
                tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
              <div className="d-inline-flex">
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star-o text-yellow fs-16"></i></Link>
                <Link to="#" className="mx-4"> (48) Reviews</Link>
                <Link to="#" className="font-weight-bold">USD-$24</Link>
              </div>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="#" className="h4 ">Treal - Admin Responsive Bootstrap
                  HTML Dashboard Template</Link>
              </div>
              <Link to="#"
                className="text-primary">https://www.spruko.com/demo/treal/html/</Link>
              <p className="text-muted mt-2 mb-1">Treal Template included in 30 versions. In the
                demo
                30 versions is shown in 4 floders. And In the final each version has single
                floder corresponding to that ...</p>
              <p className="text-muted  mb-2">Tags: admin, admin dashboard, admin panel, admin
                template, backright, bootstrap, bootstrap 4, clean, dashboard, flat, jquery,
                modern, premium admin templates ...</p>
              <div className="d-inline-flex">
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star-o text-yellow fs-16"></i></Link>
                <Link to="#" className="mx-4"> (48) Reviews</Link>
                <Link to="#" className="font-weight-bold">USD-$24</Link>
              </div>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="#" className="h4 ">Eduserv Website Templates from
                  ThemeForest</Link>
              </div>
              <Link to="#"
                className="text-primary">https://spruko.com/demo/eduserv/html/</Link>
              <p className="text-muted mt-2 mb-2">Nemo enim ipsam voluptatem quia voluptas sit
                aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui
                ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
                ipsum
                quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius
                modi
                tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
              <div className="d-inline-flex">
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star-o text-yellow fs-16"></i></Link>
                <Link to="#" className="mx-4"> (18) Reviews</Link>
                <Link to="#" className="font-weight-bold">USD-$12</Link>
              </div>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="#" className="h4 ">HostOne – Web Hosting HTML
                  Creative
                  Responsive Clean Template</Link>
              </div>
              <Link to="#"
                className="text-primary">https://www.spruko.com/demo/treal/html/</Link>
              <p className="text-muted mt-2 mb-1"> HostOne - Web Hosting HTML Creative Responsive
                Clean Template by sprukosoft HostOne -HTML Templates is a Clean, Simple
                Responsive Template Design.</p>
              <p className="text-muted  mb-2">Neque porro quisquam est, qui dolorem ipsum quia
                dolor
                sit amet, consectetur, adipisci velit, sed quia non numquam eius modi
                tempora
                incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad
                minima veniam, quis nostrum exercitationem ullam corporis suscipit
                laboriosam,
                nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure
                reprehrighterit qui in ea voluptate velit esse quam nihil molestiae
                consequatur,
                vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
              <div className="d-inline-flex">
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star-o text-yellow fs-16"></i></Link>
                <Link to="#"><i
                  className="fa fa-star-o text-yellow fs-16"></i></Link>
                <Link to="#" className="mx-4"> (18) Reviews</Link>
                <Link to="#" className="font-weight-bold">USD-$12</Link>
              </div>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="#" className="h4 ">Videos</Link>
              </div>
              <ul className="list-unstyled video-list-thumbs row">
                <li className="col-sm-12 col-lg-3 col-md-6 border-0">
                  <Link to="#"
                    title="sed do eiusmod tempor incidi dunt ut labore et dolore magna">
                    <img alt="Barca" className="img-responsive"
                      src={ImagesData("media1")} />
                    <span className="fa fa-play-circle-o"></span> <span
                      className="duration"><span className="fe fe-play-circle"></span>
                      06:28</span>
                  </Link>
                </li>
                <li className="col-sm-12 col-lg-9 col-md-6 border-0">
                  <div className="mb-2">
                    <Link to="#" className="h4 ">HostOne – Web Hosting HTML
                      Creative Responsive Clean Template</Link>
                  </div>
                  <Link to="#"
                    className="text-primary border-0 p-0">https://www.spruko.com/demo/treal/html/</Link>
                  <p className="text-muted mt-2 mb-1"> HostOne - Web Hosting HTML Creative
                    Responsive Clean Template by sprukosoft HostOne -HTML Templates is a
                    Clean, Simple Responsive Template Design.</p>
                  <p className="text-muted  mb-2">Neque porro quisquam est, qui dolorem ipsum
                    quia
                    dolor sit amet, consectetur, adipisci velit, sed quia non numquam
                    eius
                    modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                    voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem
                    ullam
                    corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                    consequatur?
                    Quis autem vel eum iure reprehrighterit qui in ea voluptate velit
                    esse
                    quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat
                    quo
                    voluptas nulla pariatur?</p>
                </li>
              </ul>
            </Card.Body>
          </Card>
          <div className="text-center">
            <div className="mb-5">
              <ul className="pagination justify-content-center">
                <Pagination className='gap-2'>
                  <Pagination.Item disabled>Prev</Pagination.Item>
                  <Pagination.Item className='active'>1</Pagination.Item>
                  <Pagination.Item className=''>2</Pagination.Item>
                  <Pagination.Item className=''>3</Pagination.Item>
                  <Pagination.Item className=''>4</Pagination.Item>
                  <Pagination.Item className=''>5</Pagination.Item>
                  <Pagination.Item>Next</Pagination.Item>
                </Pagination>
              </ul>
            </div>
          </div>

        </Col>
      </Row>
    </Fragment>

  )
};

export default Search;
