import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../../layout/Header/pageheader';
import { blogs } from '../Blog01/Data/BlogData';
interface Blog01Props { }

const Blog01: FC<Blog01Props> = () => (
  <Fragment>
    <PageHeader title="Blog" />
    <Row>
      {blogs.map((blog) => (
        <Col xl={4} lg={6} md={12} key={Math.random()}>
          <Card className=" overflow-hidden">
            <div className="item7-card-img">
              <Link to={`${import.meta.env.BASE_URL}Pages/blog/blogdetails`}>
                <img src={blog.src1} alt="img"
                  className="cover-image w-100" />
              </Link>
            </div>
            <Card.Body>
              <div className="item7-card-desc d-flex mb-5">
                <Link to="#" className="d-flex"><i
                  className="fe fe-calendar fs-16 me-1 p-3 bg-secondary-transparent brround text-secondary font-weight-bold border-secondary h-43"></i><span
                    className="mt-3 me-1 text-muted font-weight-semibold">
                    July-18-2021</span></Link>
                <div className="ms-auto">
                  <Link className="me-0 d-flex" to="#"><i
                    className="fe fe-message-square fs-16 me-1 p-3 bg-warning-transparent brround text-warning font-weight-bold border-warning h-43"></i><span
                      className="mt-3 text-muted font-weight-semibold">12
                      Comments</span></Link>
                </div>
              </div>
              <Link to="#" className="mt-4">
                <h5 className="font-weight-semibold text-primary">Excepteur occaecat cupidatat
                </h5>
              </Link>
              <p>Lorem ipsum dolor quis exercitationem into enim ad minima nostrum itationem
              </p>
            </Card.Body>
            <Card.Body>
              <div className="d-flex align-items-center mt-auto">
                <img className="avatar brround avatar-md me-3"
                  src={ImagesData("users16")} />

                <div>
                  <Link to={`${import.meta.env.BASE_URL}Pages/profile/profile01`} className="font-weight-semibold">Anna Ogden</Link>
                  <small className="d-block text-muted">2 days ago</small>
                </div>
                <div className="ms-auto text-muted mt-2">
                  <Link to="#"
                    className="text-danger icon d-none d-sm-inline-block ms-3"><i
                      className="fe fe-heart p-2 fs-20 text-icon text-danger bg-danger-transparent br-7"></i></Link>
                  <Link to="#"
                    className="icon d-none d-sm-inline-block ms-3"><i
                      className="fe fe-thumbs-up p-2 fs-20 text-icon text-success bg-success-transparent br-7"></i></Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Fragment>
);

export default Blog01;
