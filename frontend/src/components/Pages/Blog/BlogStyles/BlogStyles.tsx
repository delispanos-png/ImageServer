import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import media7 from '../../../../assets/images/media/7.jpg';
import media8 from '../../../../assets/images/media/8.jpg';
import media2 from '../../../../assets/images/media/2.jpg';
import media16 from '../../../../assets/images/media/16.jpg';
import { Link } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
import users14 from '../../../../assets/images/users/14.jpg';
import { blogstyles, blogstyles01, blogstyles03 } from '../BlogStyles/Data/BlogstyleData';
interface BlogStylesProps { }

const BlogStyles: FC<BlogStylesProps> = () => (
  <Fragment>
    <PageHeader title="Blog Styles" />
    <Row>
      <Col xl={6}>
        <Card className="card-aside">
  <Link to="#" className="card-aside-column br-ts-7 br-bs-7" style={{backgroundImage: `url(${media7})`}}></Link>
          <Card.Body>
            <div className="d-flex align-items-center mb-5">
              <img className="avatar  brround avatar-md me-3"
                src={ImagesData("users6")} />
                 {/* {`${import.meta.env.BASE_URL}Pages/blog/blogdetails`} */}
              <div>
             
                <Link to= {`${import.meta.env.BASE_URL}Pages/profile/profile01`} className="font-weight-semibold">Thomos Scott</Link>
                <small className="d-block text-muted">1 day ago</small>
              </div>
              <div className="ms-auto text-muted">
                <Link to="#"
                  className="icon d-none d-md-inline-block ms-3"><i
                    className="p-2 brround bg-danger-transparent text-danger border-danger fe fe-heart  fs-16 text-icon"></i></Link>
                <Link to="#"
                  className="icon d-none d-md-inline-block ms-3"><i
                    className="p-2 brround bg-success-transparent border-success text-success fe fe-thumbs-up  fs-16 text-icon"></i></Link>
              </div>
            </div>
            <h4><Link to="#">Publishing packages</Link></h4>
            <div className="text-muted ">Many desktop publishing packages and web page editors
              now
              use default model text, and a search for will uncover...</div>
            <div><Link to="#" className=" mt-3 btn btn-sm btn-primary">Read more</Link></div>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={6}>
        <Card className="card-aside">
          <Card.Body>
            <div className="d-flex align-items-center mb-5">
              <img className="avatar  brround avatar-md me-3"
                src={ImagesData("users16")} />
              <div>
                <Link to= {`${import.meta.env.BASE_URL}Pages/profile/profile01`}  className="font-weight-semibold">Irene Scott</Link>
                <small className="d-block text-muted">2 days ago</small>
              </div>
              <div className="ms-auto text-muted">
                <Link to="#"
                  className="icon d-none d-md-inline-block ms-3"><i
                    className="p-2 brround bg-danger-transparent text-danger border-danger fe fe-heart  fs-16 text-icon"></i></Link>
                <Link to="#"
                  className="icon d-none d-md-inline-block ms-3"><i
                    className="p-2 brround bg-success-transparent border-success text-success fe fe-thumbs-up  fs-16 text-icon"></i></Link>
              </div>
            </div>
            <h4><Link to="#">Nihil molestaturrgt.</Link></h4>
            <div className="text-muted ">Many desktop publishing packages and web page editors
              now
              use default model text, and a search for will uncover...</div>
            <div><Link to="#" className=" mt-3 btn btn-sm btn-primary">Read more</Link></div>
          </Card.Body>
          {/* <img className="card-aside-column br-be-7 br-te-7"
            src={ImagesData("media8")} /> */}
            <Link to="#" className="card-aside-column br-be-7 br-te-7" style={{backgroundImage: `url(${media8})`}}></Link>
        </Card>
      </Col>
      <Col xl={6}>
        <Card className="card-aside">
        <Link to="#" className="card-aside-column br-be-7 br-te-7" style={{backgroundImage: `url(${media2})`}}></Link>

          <Card.Body>
            <h4><Link to="#">Generator on the Internet..</Link></h4>
            <div className="text-muted">Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum....</div>
            <div className="d-flex align-items-center pt-5 mt-auto">
              <img className="avatar  brround avatar-md me-3"
                src={ImagesData("users12")} />
              <div>
                <Link to= {`${import.meta.env.BASE_URL}Pages/profile/profile01`}  className="font-weight-semibold">Anna Ogden</Link>
                <small className="d-block text-muted">1 days ago</small>
              </div>
              <div className="ms-auto text-muted">
                <Link to="#"
                  className="icon d-none d-md-inline-block ms-3"><i
                    className="p-2 brround bg-danger-transparent text-danger border-danger fe fe-heart  fs-16 text-icon"></i></Link>
                <Link to="#"
                  className="icon d-none d-md-inline-block ms-3"><i
                    className="p-2 brround bg-success-transparent border-success text-success fe fe-thumbs-up  fs-16 text-icon"></i></Link>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={6}>
        <Card className="card-aside">
          <Card.Body>
            <h4><Link to="#">Nihil Molestiae.</Link></h4>
            <div className="text-muted">Many desktop publishing packages and web page editors
              now
              use default model text, and a search for will uncover...</div>
            <div className="d-flex align-items-center pt-5 mt-auto">
              <img className="avatar  brround avatar-md me-3"
                src={ImagesData("users2")} />
              <div>
                <Link to= {`${import.meta.env.BASE_URL}Pages/profile/profile01`}  className="font-weight-semibold">Irene Scott</Link>
                <small className="d-block text-muted">2 days ago</small>
              </div>
              <div className="ms-auto text-muted">
                <Link to="#"
                  className="icon d-none d-md-inline-block ms-3"><i
                    className="p-2 brround bg-danger-transparent text-danger border-danger fe fe-heart  fs-16 text-icon"></i></Link>
                <Link to="#"
                  className="icon d-none d-md-inline-block ms-3"><i
                    className="p-2 brround bg-success-transparent border-success text-success fe fe-thumbs-up  fs-16 text-icon"></i></Link>
              </div>
            </div>
          </Card.Body>
          <Link to="#" className="card-aside-column br-be-7 br-te-7" style={{backgroundImage: `url(${media16})`}}></Link>

        </Card>
      </Col>
      {blogstyles.map((blogstyle) => (
        <div className={blogstyle.data1} key={Math.random()}>
          <Card>
            <Card.Body className="card-body d-flex flex-column">
              <h4><Link to="#">voluptatem quia voluptas.</Link></h4>
              <div className="text-muted">{blogstyle.data}</div>
              <div className="d-flex align-items-center pt-5 mt-auto">
                <img className="avatar brround avatar-md me-3"
                  src={blogstyle.src1} />
                <div>
                  <Link to= {`${import.meta.env.BASE_URL}Pages/profile/profile01`}  className="font-weight-semibold">{blogstyle.heading}</Link>
                  <small className="d-block text-muted">{blogstyle.text}</small>
                </div>
                <div className="ms-auto text-muted">
                  <Link to="#"
                    className="icon d-none d-md-inline-block ms-3"><i
                      className="p-2 brround bg-danger-transparent text-danger border-danger fe fe-heart  fs-16 text-icon"></i></Link>
                  <Link to="#"
                    className="icon d-none d-md-inline-block ms-3"><i
                      className="p-2 brround bg-success-transparent border-success text-success fe fe-thumbs-up  fs-16 text-icon"></i></Link>
                </div>
              </div>
            </Card.Body>
            <Link to="#"><img className="card-img-top br-bs-7 br-be-7"
              src={blogstyle.src2}
              alt="And this isn&#39;t my nose. This is a false one." /></Link>
          </Card>
        </div>
      ))}
    </Row>
    <Row>
      {blogstyles03.map((blogstyle03) => (
        <div className={blogstyle03.data1} key={Math.random()}>
          <Card className="card overflow-hidden">
            <Card.Body className="card-body d-flex flex-column ">
              <h4><Link to="#">{blogstyle03.heading}</Link></h4>
              <div className="text-muted">{blogstyle03.data}</div>
            </Card.Body>
            <Card.Body>
              <div className="d-flex align-items-center mt-auto">
                <img className="avatar brround avatar-md me-3"
                  src={blogstyle03.src1} />
                <div>
                  <Link to= {`${import.meta.env.BASE_URL}Pages/profile/profile01`}  className="font-weight-semibold">{blogstyle03.text}</Link>
                  <small className="d-block text-muted">2 days ago</small>
                </div>
                <div className="ms-auto text-muted">
                  <Link to="#"
                    className="icon d-none d-md-inline-block ms-3"><i
                      className="p-2 brround bg-danger-transparent text-danger border-danger fe fe-heart  fs-16 text-icon"></i></Link>
                  <Link to="#"
                    className="icon d-none d-md-inline-block ms-3"><i
                      className="p-2 brround bg-success-transparent border-success text-success fe fe-thumbs-up  fs-16 text-icon"></i></Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
      {blogstyles01.map((blogstyle01) => (
        <div className={blogstyle01.data1} key={Math.random()}>
          <Card className="card overflow-hidden">
            <Link to="#"><img className="card-img-top  "
              src={blogstyle01.src1} alt="img" /></Link>
            <Card.Body className="card-body d-flex flex-column">
              <h4><Link to="#">voluptatem quia voluptas.</Link></h4>
              <div className="text-muted">{blogstyle01.heading}
              </div>
              <Link to="#" className="mt-3 btn btn-md btn-primary">Read more</Link>
            </Card.Body>
          </Card>
        </div>
      ))}
    </Row>
  </Fragment>
);

export default BlogStyles;
