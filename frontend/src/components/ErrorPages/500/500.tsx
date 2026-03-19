import React, { FC, Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


interface Error500Props {}

const Error500: FC<Error500Props> = () => {
  document.querySelector("body")?.classList.add("h-100vh", "bg-primary", "login-page");

  return(
    <Fragment>
       <div className="box">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
    <div className="page">
    <div className="page-content">
      <div className="container text-center">
        <Row>
          <Col md={12}>
            <div className="mt-lg-7">
              <div className="text-white">
                <div className="fs-100  mb-5 font-weight-normal h1 error-text"><i className="fa fa-frown-o"></i>ops!</div>
                <h1 className="h3  mb-3 font-weight-bold">Error 500: Internal Server Error</h1>
                <p className="h5 font-weight-normal mb-7 leading-normal">You may have mistyped the address or the page may have moved.</p>
                <Link className="btn btn-light text-primary mb-5 fs-18" to="#">Help</Link>
                <Link className="btn text-light border-light mb-5 ms-2 fs-18" to={`${import.meta.env.BASE_URL}dashboard`}>Back to Home</Link>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
  </Fragment>
)
  };

export default Error500;
