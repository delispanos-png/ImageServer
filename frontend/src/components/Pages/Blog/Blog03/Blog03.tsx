import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import users12 from '../../../../assets/images/users/12.jpg';
import users2 from '../../../../assets/images/users/2.jpg';
import users9 from '../../../../assets/images/users/9.jpg';

interface Blog03Props { }

const Blog03: FC<Blog03Props> = () => (
  <Fragment>
    <PageHeader title="Blog3" />
    <Row>
      <Col xl={12} lg={12} md={12}>
        <Card className="overflow-hidden">
          <div className="item7-card-img px-4 pt-4">
            <Link to="#"></Link>
            <img src={ImagesData("media27")} alt="img"
              className="cover-image br-7 w-100" />
          </div>
          <Card.Body className="px-0">
            <div className="item7-card-desc d-md-flex mb-5 px-5">
              <Link to="#" className="d-flex me-4 mb-2"><i
                className="fe fe-calendar fs-16 me-1 p-3 bg-secondary-transparent text-secondary brround border-secondary"></i>
                <div className="mt-0 mt-3 ms-1 text-muted font-weight-semibold">Jan-18-2021
                </div>
              </Link>
              <Link to="#" className="d-flex mb-2"><i
                className="fe fe-user fs-16 me-1 p-3 bg-success-transparent text-success brround border-success"></i>
                <div className="mt-0 mt-3 ms-1 text-muted font-weight-semibold">Anna Ogden
                </div>
              </Link>
              <div className="ms-auto mb-2">
                <Link className="me-0 d-flex" to="#"><i
                  className="fe fe-message-square fs-16 me-1 p-3 bg-warning-transparent text-warning brround border-warning"></i>
                  <div className="mt-0 mt-3 ms-1 text-muted font-weight-semibold">12
                    Comments
                  </div>
                </Link>
              </div>
            </div>
            <Link to="#" className="mt-4">
              <h5 className="font-weight-semibold px-5">Excepteur occaecat cupidatat</h5>
            </Link>
            <p className="px-5">I must explain to you how all this mistaken idea of denouncing
              pleasure
              and praising pain was born and I will give you a complete account of the
              system,
              and expound the actual teachings of the great explorer of the truth, the
              master-builder of human happiness. No one rejects, dislikes, or avoids
              pleasure
              itself, because it is pleasure.</p>
            <p className="px-5">but because those who do not know how to pursue pleasure rationally encounter
              consequences that are extremely painful. Nor again is there anyone who loves
              or
              pursues or desires to obtain pain of itself, because it is pain, but because
              occasionally circumstances occur in which toil and pain can procure him some
              great pleasure. To take a trivial example</p>
            <div className="media py-3 mt-0 border-top align-items-center px-5">
              <div className="media-user me-2">
                <div className="avatar-list avatar-list-stacked">
                  <img className="avatar brround"
                  src={ImagesData('users12')}/>
                  <img className="avatar brround"
                   src={ImagesData('users2')} />
                  <img className="avatar brround"
                    src={ImagesData('users9')} />
                  <img className="avatar brround"
                     src={ImagesData('users2')} />
                </div>
              </div>
              <div className="ms-auto">
                <div className="d-flex">
                  <Link to="#" className="new ms-2 mt-2"><i
                    className="p-3 text-danger br-7 bg-danger-transparent fe fe-heart  fs-16 text-icon"></i></Link>
                  <Link to="#" className="new ms-2 mt-2"><i
                    className="p-3 text-success br-7 bg-success-transparent fe fe-thumbs-up  fs-16 text-icon"></i></Link>
                  <Link to="#" className="new ms-2 mt-2"><i
                    className="p-3 text-secondary br-7 bg-secondary-transparent fe fe-share-2  fs-16 text-icon"></i></Link>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>3 Comments</Card.Title>
          </Card.Header>
          <Card.Body>
            <div
              className="d-sm-flex mt-0 p-5 sub-review-section border border-bottom-0 br-bs-0 br-be-0">
              <div className="d-flex me-3">
                <Link to="#"><img
                  className="media-object brround avatar-md mb-1" alt="64x64"
                  src={ImagesData("users1")} /> </Link>
              </div>
              <div className="media-body Comments1">
                <h5 className="mt-0 mb-1 font-weight-semibold">Joanne Scott
                  <span className="fs-14 ms-1" data-bs-toggle="tooltip"
                    data-placement="top" title="" data-original-title="verified"><i
                      className="fa fa-check-circle-o text-success"></i></span>
                  <span className="fs-14  d-inline-block"> 4.5 <i
                    className="fa fa-star text-yellow"></i></span>
                </h5>
                <p className="font-13  mb-2 mt-2">
                  Lorem ipsum dolor sit amet, quis Neque porro quisquam est, nostrud
                  exercitation ullamco laboris commodo consequat.
                </p>
                <Link to="#" className="me-2 mt-1"><span
                  className="badge bg-primary">Helpful</span></Link>
                <Link to="#" className="me-2 mt-1"><span
                  className="badge bg-info">Comment</span></Link>
                <Link to="#" className="me-2 mt-1"><span
                  className="badge bg-danger">Report</span></Link>
                <div className="d-flex float-md-end mb-2">
                  <Link to="#" className="new ms-lg-3 mt-5 mt-md-2"><i
                    className="p-3 text-success br-7 bg-success-transparent fe fe-thumbs-up  fs-16 text-icon"></i></Link>
                  <Link to="#" className="new ms-3 mt-5 mt-md-2"><i
                    className="p-3 text-danger br-7 bg-danger-transparent fe fe-thumbs-down  fs-16 text-icon"></i></Link>
                </div>
              </div>
            </div>
            <div
              className="d-sm-flex p-5 sub-review-section border subsection-color br-ts-0 br-te-0">
              <div className="d-flex me-3">
                <Link to="#"><img
                  className="media-object brround avatar-md mb-1" alt="64x64"
                  src={ImagesData("users2")} /> </Link>
              </div>
              <div className="media-body Comments1">
                <h5 className="mt-0 mb-1 font-weight-semibold">Rose Slater <span
                  className="fs-14 ms-1" data-bs-toggle="tooltip" data-placement="top"
                  title="" data-original-title="verified"><i
                    className="fa fa-check-circle-o text-success"></i></span></h5>
                <p className="font-13  mb-2 mt-2">
                  Lorem ipsum dolor sit amet nostrud exercitation ullamco laboris
                  commodo
                  consequat.
                </p>
                <Link to="#"
                  className="mt-1"><span className="badge bg-info">Comment</span></Link>
                <div className="d-flex float-md-end mb-2">
                  <Link to="#" className="new ms-lg-3 mt-5 mt-md-2"><i
                    className="p-3 text-success br-7 bg-success-transparent fe fe-thumbs-up  fs-16 text-icon"></i></Link>
                  <Link to="#" className="new ms-3 mt-5 mt-md-2"><i
                    className="p-3 text-danger br-7 bg-danger-transparent fe fe-thumbs-down  fs-16 text-icon"></i></Link>
                </div>
              </div>
            </div>
            <div className="d-sm-flex p-5 mt-4 border sub-review-section">
              <div className="d-flex me-3">
                <Link to="#"><img
                  className="media-object brround avatar-md mb-1" alt="64x64"
                  src={ImagesData("users3")} /> </Link>
              </div>
              <div className="media-body Comments1">
                <h5 className="mt-0 mb-1 font-weight-semibold">Edward
                  <span className="fs-14 ms-1" data-bs-toggle="tooltip"
                    data-placement="top" title="" data-original-title="verified"><i
                      className="fa fa-check-circle-o text-success me-2"></i></span>
                  <span className="fs-14 d-inline-block"> 4 <i
                    className="fa fa-star text-yellow"></i></span>
                </h5>
                <p className="font-13  mb-2 mt-2">
                  Lorem ipsum dolor sit amet, quis Neque porro quisquam est, nostrud
                  exercitation ullamco laboris commodo consequat.
                </p>
                <Link to="#" className="me-2 mt-1"><span
                  className="badge bg-primary">Helpful</span></Link>
                <Link to="#" className="me-2 mt-1"><span
                  className="badge bg-info">Comment</span></Link>
                <Link to="#" className="me-2 mt-1"><span
                  className="badge bg-danger">Report</span></Link>
                <div className="d-flex float-md-end mb-2">
                  <Link to="#" className="new ms-lg-3 mt-5 mt-md-2"><i
                    className="p-3 text-success br-7 bg-success-transparent fe fe-thumbs-up  fs-16 text-icon"></i></Link>
                  <Link to="#" className="new ms-3 mt-5 mt-md-2"><i
                    className="p-3 text-danger br-7 bg-danger-transparent fe fe-thumbs-down  fs-16 text-icon"></i></Link>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card className="mb-lg-0">
          <Card.Header>
            <Card.Title>Add a Comment</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="mt-2">
              <div className="form-group">
                <input type="text" className="form-control" id="name1"
                  placeholder="Your Name" />
              </div>
              <div className="form-group">
                <input type="email" className="form-control" id="email"
                  placeholder="Email Address" />
              </div>
              <div className="form-group">
                <textarea className="form-control" name="example-textarea-input"
                  placeholder="Write Review"></textarea>
              </div>
              <Button className="btn btn-primary">Send Reply</Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default Blog03;
