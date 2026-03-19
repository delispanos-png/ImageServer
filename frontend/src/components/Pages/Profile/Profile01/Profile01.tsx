import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { details } from '../Profile01/Data/Profile01Data';
interface Profile01Props {
}

const Profile01: FC<Profile01Props> = () => (
  <Fragment>
    <PageHeader title="Profile 1" />
    <Row>
      <Col xl={3} lg={5} md={12}>
        <Card className="box-widget widget-user">
          <div className="widget-user-image  mt-5"><img alt="User Avatar"
            className="rounded-circle" src={ImagesData("users2")} /></div>
          <Card.Body className="card-body text-center">
            <div className="pro-user">
              <h4 className="pro-user-username mb-1 font-weight-bold">Patrenna</h4>
              <h6 className="pro-user-desc text-muted">UI UX Designer</h6>
              <div className="wideget-user-rating">
                <Link to="#"><i
                  className="fa fa-star text-warning"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-warning"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-warning"></i></Link>
                <Link to="#"><i
                  className="fa fa-star text-warning"></i></Link>
                <Link to="#"><i
                  className="fa fa-star-o text-warning me-1"></i></Link> <span>5 (3876
                    Reviews)</span>
              </div>
              <Link to={`${import.meta.env.BASE_URL}pages/editProfile`} className="btn btn-success mt-3 me-1 mt-1"><i
                className="fa fa-pencil me-2 mt-0"></i>Edit Profile</Link>
              <Link to="#" className="btn btn-primary mt-3 me-1"><i
                className="fa fa-rss "></i> Follow</Link>
            </div>
          </Card.Body>
          <Card.Footer className="p-0">
            <Row>
              <Col sm={6} className="col-sm-6 border-end text-center">
                <div className="description-block p-4">
                  <h5 className="description-header mb-1 font-weight-bold  number-font">
                    689k
                  </h5>
                  <span className="text-muted">Followers</span>
                </div>
              </Col>
              <Col sm={6}>
                <div className="description-block text-center p-4">
                  <h5 className="description-header mb-1 font-weight-bold number-font">
                    3,765
                  </h5>
                  <span className="text-muted">Following</span>
                </div>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Personal Details</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table className="table table-bordered mb-0">
                <tbody>
                  {details.map((detail) => (
                    <tr key={Math.random()}>
                      <td>
                        <span className="font-weight-semibold w-50">{detail.heading} </span>
                      </td>
                      <td>{detail.class}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xl={9} lg={7} md={12}>
        <Card className="main-content-body main-content-body-profile card">
          <Card.Header>
            <Card.Title>Biography</Card.Title>
          </Card.Header>
          <div className="main-profile-body">
            <Card.Body>
              <div className="main-profile-bio mb-5">
                <p>simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum
                  has been the industry's standard dummy when an unknown printer took
                  a
                  galley of type and scrambled it to make a type specimen book. It has
                  survived not only five centuries nchanged.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi
                  ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                  reprehrighterit in voluptate velit esse cillum dolore eu fugiat
                  nulla
                  pariatur. </p>
                <p className="mb-0">pleasure rationally encounter but because pursue
                  consequences that are extremely painful.occur in which toil and pain
                  can
                  procure him some great pleasure.. <a href="#">More</a></p>
              </div>
              <div>
                <form className="profile-edit mb-0">
                  <textarea className="form-control br-be-0 br-bs-0"
                    placeholder="What are you doing right now?" rows={5}></textarea>
                  <div className="profile-share  border border-top-0 d-flex">
                    <Link to="#" className="me-1" title=""
                      data-bs-toggle="tooltip" data-bs-placement="top"
                      data-bs-original-title="Audio" aria-label="Audio">
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                          <Tooltip className="primary">Audio</Tooltip>
                        }
                      ><i className="fe fe-mic"></i>

                      </OverlayTrigger></Link>
                    <Link to="#" className="me-1" title=""
                      data-bs-toggle="tooltip" data-bs-placement="top"
                      data-bs-original-title="Video" aria-label="Video">
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={<Tooltip className="primary">Video</Tooltip>}

                      ><i className="fe fe-video"></i>
                      </OverlayTrigger></Link>
                    <Link to="#" className="me-1" title=""
                      data-bs-toggle="tooltip" data-bs-placement="top"
                      data-bs-original-title="Image" aria-label="Image">
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                          <Tooltip className="primary">Share</Tooltip>
                        }
                      ><i className="fe fe-image"></i>
                      </OverlayTrigger></Link>
                    <Button type="submit"
                      className="pull-right mt-1 ms-auto" variant='outline-success'><i
                        className="fa fa-share ms-1"></i> Share</Button>
                  </div>
                </form>
              </div>
            </Card.Body>
          </div>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Work & Education</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="main-profile-contact-list d-lg-flex">
              <div className="media me-5">
                <div className="media-icon bg-secondary-transparent text-secondary me-4">
                  <i className="fa fa-whatsapp"></i>
                </div>
                <div className="media-body">
                  <h6 className="font-weight-bold mb-1">Web Designer at <Link to="#"
                    className="btn-link">Spruko</Link></h6>
                  <span>2018 - present</span>
                  <p>Past Work: Spruko, Inc.</p>
                </div>
              </div>
              <div className="media me-5">
                <div className="media-icon bg-success-transparent text-success me-4">
                  <i className="fa fa-briefcase"></i>
                </div>
                <div className="media-body">
                  <h6 className="font-weight-bold mb-1">Studied at <Link to="#"
                    className="btn-link">University</Link></h6>
                  <span>2004-2008</span>
                  <p>Graduation: Bachelor of Science in Computer Science</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Skills</Card.Title>
          </Card.Header>

          <Card.Body>
            <Button className="btn btn-sm  me-1 mt-1" variant='light' href="#">HTML5</Button>
            <Button className="btn btn-sm  me-1 mt-1" variant='light' href="#">CSS</Button>
            <Button className="btn btn-sm  me-1 mt-1" variant='light' href="#">Java Script</Button>
            <Button className="btn btn-sm  me-1 mt-1" variant='light' href="#">Photo Shop</Button>
            <Button className="btn btn-sm  me-1 mt-1" variant='light' href="#">Php</Button>
            <Button className="btn btn-sm  me-1 mt-1" variant='light' href="#">Wordpress</Button>
            <Button className="btn btn-sm  me-1 mt-1" variant='light' href="#">Sass</Button>
            <Button className="btn btn-sm  me-1 mt-1" variant='light' href="#">Angular</Button>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Contact</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="main-profile-contact-list d-lg-flex">
              <div className="media me-4">
                <div className="media-icon bg-danger-transparent text-danger  me-3 mt-1">
                  <i className="fa fa-phone"></i>
                </div>
                <div className="media-body">
                  <small className="text-muted">Mobile</small>
                  <div className="font-weight-normal1">
                    +245 354 654
                  </div>
                </div>
              </div>
              <div className="media me-4">
                <div className="media-icon bg-warning-transparent text-warning me-3 mt-1">
                  <i className="fa fa-slack"></i>
                </div>
                <div className="media-body">
                  <small className="text-muted">Stack</small>
                  <div className="font-weight-normal1">
                    @spruko.com
                  </div>
                </div>
              </div>
              <div className="media">
                <div className="media-icon bg-info-transparent text-info me-3 mt-1">
                  <i className="fa fa-map"></i>
                </div>
                <div className="media-body">
                  <small className="text-muted">Current Address</small>
                  <div className="font-weight-normal1">
                    San Francisco, USA
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>

);

export default Profile01;
