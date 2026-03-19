import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import { Link } from 'react-router-dom';
import users12 from '../../../../assets/images/users/12.jpg';
import users2 from '../../../../assets/images/users/2.jpg';
import users9 from '../../../../assets/images/users/9.jpg';
import users4 from '../../../../assets/images/users/4.jpg';

interface Profile03Props { }

const Profile03: FC<Profile03Props> = () => (
  <Fragment>
    <PageHeader title="Profile 3" />
    <Row>
      <Col xl={4} lg={12} md={12}>
        <Card>
          <Card.Body>
            <div className="box-widget widget-user text-center">
              <div className="widget-user-image mx-auto">
                <img alt="User Avatar" className="rounded-circle"
                  src={ImagesData("users2")} />
              </div>
              <div className="mt-4 ms-sm-5 ms-0">
                <h4 className="pro-user-username  mb-2 font-weight-bold">Patrenna</h4>
                <div>
                  <span
                    className="badge fs-13 bg-primary-transparent text-primary border-primary  me-2">admin</span>
                  <span
                    className="badge fs-13 bg-success-transparent text-success border-success">Director</span>
                </div>
                <div className="wideget-user-rating mt-2">
                  <Link to="#"><i
                    className="fa fa-star text-warning"></i></Link>
                  <Link to="#"><i
                    className="fa fa-star text-warning"></i></Link>
                  <Link to="#"><i
                    className="fa fa-star text-warning"></i></Link>
                  <Link to="#"><i
                    className="fa fa-star text-warning"></i></Link>
                  <Link to="#"><i
                    className="fa fa-star-o text-warning me-1"></i></Link> <span>5
                      (3876
                      Reviews)</span>
                </div>
                <div className="wideget-user-icons mb-2 mt-2">
                  <Link to="#" className="bg-primary text-white me-1"><i
                    className="fa fa-facebook"></i></Link>
                  <Link to="#" className="bg-info text-white me-1"><i
                    className="fa fa-twitter"></i></Link>
                  <Link to="#" className="bg-google text-white me-1"><i
                    className="fa fa-google"></i></Link>
                  <Link to="#" className="bg-dribbble text-white me-1"><i
                    className="fa fa-dribbble"></i></Link>
                </div>
                <Link to={`${import.meta.env.BASE_URL}pages/editProfile`} className="btn btn-success mt-3 me-1"><i
                  className="fa fa-pencil"></i> Edit Profile</Link>
                <Link to="#" className="btn btn-primary mt-3 me-1"><i
                  className="fa fa-rss"></i> Follow</Link>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Education</Card.Title>
          </Card.Header>
          <Card.Body
          >
            <div className="main-profile-contact-list">
              <div className="media me-5 mt-0">
                <div className="media-icon bg-info-transparent text-info me-4">
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
            <Card.Title>Contact</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="main-profile-contact-list">
              <div className="media me-4 mt-0 mb-3">
                <div className="media-icon bg-danger-transparent text-danger me-3 mt-1">
                  <i className="fa fa-phone"></i>
                </div>
                <div className="media-body">
                  <small className="text-muted">Mobile</small>
                  <div className="font-weight-normal1">
                    +245 354 654
                  </div>
                </div>
              </div>
              <div className="media me-4 mb-3">
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
                <div className="media-icon bg-primary-transparent text-primary me-3 mt-1">
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
      <Col xl={8} lg={12} md={12}>
        <Card>
          <Card.Body>
            <form className="profile-edit mb-0">
              <textarea className="form-control br-be-0 br-bs-0"
                placeholder="What are you doing right now?" rows={5}></textarea>
              <div className="profile-share  border border-top-0 d-inline-block">
                <Link to="#" className="me-2" title=""
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
                <Link to="#" className="me-2" title=""
                  data-bs-toggle="tooltip" data-bs-placement="top"
                  data-bs-original-title="Video" aria-label="Video">
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip className="primary">Video</Tooltip>}

                  ><i className="fe fe-video"></i>
                  </OverlayTrigger></Link>
                <Link to="#" className="me-2" title=""
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
                  className="pull-right mt-1" variant='outline-success'><i
                    className="fa fa-share ms-1"></i> Share</Button>
              </div>
            </form>
          </Card.Body>
        </Card>
        <Card className="card overflow-hidden">
          <Card.Header>
            <Card.Title>Time Line</Card.Title>
          </Card.Header>
          <Card.Body className="card-body pb-0 mb-0">
            <div className="d-flex">
              <div className="media mt-0">
                <div className="media-user me-2">
                  <div><img alt="" className="rounded-circle avatar avatar-md"
                    src={ImagesData("users2")} /></div>
                </div>
                <div className="media-body">
                  <h6 className="mb-0 mt-1 font-weight-bold">Patrenna</h6>
                  <small className="text-primary">just now</small>
                </div>
              </div>
              <div className="ms-auto">
                <Dropdown className="dropdown">
                  <Dropdown.Toggle as="a" className="pro-option no-caret"
                    data-bs-toggle="dropdown"><i
                      className="fe fe-more-vertical"></i></Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Edit
                      Post</Dropdown.Item>
                    <Dropdown.Item>Delete
                      Post</Dropdown.Item>
                    <Dropdown.Item>Personal
                      Settings</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-0">There are many variations of passages of Lorem Ipsum
                available,
                but the majority have suffered alteration in some form, by injected
                humour,
                or randomised words which don't look even slightly believable.</p>
            </div>
            <div className="media mg-t-15 profile-footer">
              <div className="media-user me-2 mt-1">
                <div className="avatar-list avatar-list-stacked">
                  <img className="avatar brround"
                    src={ImagesData("users12")} />
                  <img className="avatar brround"
                    src={ImagesData("users2")} />
                  <img className="avatar brround"
                    src={ImagesData("users9")} />
                  <img className="avatar brround"
                    src={ImagesData("users2")} />
                  <img className="avatar brround"
                    src={ImagesData("users4")} />

                  <span className="avatar brround">+28</span>
                </div>
              </div>
              <div className="media-body">
                <h6 className="mb-0 mt-4 ms-2">28 people like your photo</h6>
              </div>
              <div className="ms-auto">
                <Link className="new" to="#"><i
                  className="fe fe-heart"></i></Link>
                <Link className="new" to="#"><i
                  className="fe fe-message-square"></i></Link>
                <Link className="new" to="#"><i
                  className="fe fe-share-2"></i></Link>
              </div>
            </div>

          </Card.Body>
        </Card>
        <Card className="card overflow-hidden">
          <Card.Body className="card-body pb-0">
            <div className="d-flex">
              <div className="media mt-0">
                <div className="media-user me-2">
                  <div><img alt="" className="rounded-circle avatar avatar-md"
                    src={ImagesData("users2")} /></div>
                </div>
                <div className="media-body">
                  <h6 className="mb-0 mt-1 font-weight-bold">Patrenna</h6>
                  <small className="text-muted">Sep 26 2019, 10:14am</small>
                </div>
              </div>
              <div className="ms-auto">
                <Dropdown className="dropdown">
                  <Dropdown.Toggle as="a" className="pro-option no-caret"
                    data-bs-toggle="dropdown"><i
                      className="fe fe-more-vertical"></i></Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu dropdown-menu-end">
                    <Dropdown.Item>Edit
                      Post</Dropdown.Item>
                    <Dropdown.Item>Delete
                      Post</Dropdown.Item>
                    <Dropdown.Item>Personal
                      Settings</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-0">There are many variations of passages of Lorem Ipsum
                available,
                but the majority have suffered alteration in some form, by injected
                humour,
                or randomised words which don't look even slightly believable.</p>
              <div className="d-md-flex">
                <img src={ImagesData("media2")} alt="img" className="w-40 m-1" />
                <img src={ImagesData("media3")} alt="img" className="w-40 m-1" />
              </div>
            </div>
            <div className="media mg-t-15 profile-footer">
              <div className="media-user me-2 mt-1">
                <div className="avatar-list avatar-list-stacked">
                  <img className="avatar brround"
                    src={users12} />
                  <img className="avatar brround"
                    src={users2} />
                  <img className="avatar brround"
                    src={users9} />
                  <img className="avatar brround"
                    src={users2} />
                  <img className="avatar brround"
                    src={users4} />
                  <span className="avatar brround">+28</span>
                </div>
              </div>
              <div className="media-body">
                <h6 className="mb-0 mt-3 ms-2">28 people like your photo</h6>
              </div>
              <div className="ms-auto">
                <Link className="new" to="#"><i
                  className="fe fe-heart"></i></Link>
                <Link className="new" to="#"><i
                  className="fe fe-message-square"></i></Link>
                <Link className="new" to="#"><i
                  className="fe fe-share-2"></i></Link>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card className="card overflow-hidden">
          <Card.Body className="card-body pb-0">
            <div className="d-flex">
              <div className="media mt-0">
                <div className="media-user me-2">
                  <div><img alt="" className="rounded-circle avatar avatar-md"
                    src={ImagesData("users2")} /></div>
                </div>
                <div className="media-body">
                  <h6 className="mb-0 mt-1 font-weight-bold">Patrenna</h6>
                  <small className="text-muted">Sep 24 2019, 09:14am</small>
                </div>
              </div>
              <div className="ms-auto">
                <Dropdown className="dropdown">
                  <Dropdown.Toggle as="a" className="pro-option no-caret"
                    data-bs-toggle="dropdown"><i
                      className="fe fe-more-vertical"></i></Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu dropdown-menu-end">
                    <Dropdown.Item>Edit
                      Post</Dropdown.Item>
                    <Dropdown.Item>Delete
                      Post</Dropdown.Item>
                    <Dropdown.Item>Personal
                      Settings</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-0">There are many variations of passages of Lorem Ipsum
                available,
                but the majority have suffered alteration in some form, by injected
                humour,
                or randomised words which don't look even slightly believable.</p>
              <div className="d-md-flex">
                <img src={ImagesData("media4")} alt="img" className="w-30 m-1" />
                <img src={ImagesData("media5")} alt="img" className="w-30 m-1" />
                <img src={ImagesData("media6")} alt="img" className="w-30 m-1" />
              </div>
            </div>
            <div className="media mg-t-15 profile-footer">
              <div className="media-user me-2 mt-1">
                <div className="avatar-list avatar-list-stacked">
                  <img className="avatar brround"
                    src={users12} />
                  <img className="avatar brround"
                    src={users2} />
                  <img className="avatar brround"
                    src={users9} />
                  <img className="avatar brround"
                    src={users2} />
                  <img className="avatar brround"
                    src={users4} />
                  <span className="avatar brround">+28</span>
                </div>
              </div>
              <div className="media-body">
                <h6 className="mb-0 mt-3 ms-2">28 people like your photo</h6>
              </div>
              <div className="ms-auto">
                <Link className="new" to="#"><i
                  className="fe fe-heart"></i></Link>
                <Link className="new" to="#"><i
                  className="fe fe-message-square"></i></Link>
                <Link className="new" to="#"><i
                  className="fe fe-share-2"></i></Link>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default Profile03;
