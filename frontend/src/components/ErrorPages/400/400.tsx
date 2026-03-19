import React, { FC, Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Error400Props {}

const Error400: FC<Error400Props> = () => {
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
                    <div>
                        <div className="text-light">
                            <div className="display-1 mb-5 font-weight-bold error-text">400</div>
                            <h1 className="h3  mb-3 font-weight-bold">Address Not Found Error!</h1>
                            <p className="h5 font-weight-normal mb-7 leading-normal">The address you have typed was incorrect! Please try with correct address.</p>
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

export default Error400;
