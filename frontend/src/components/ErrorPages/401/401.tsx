import React, { FC, Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


interface Error401Props {}

const Error401: FC<Error401Props> = () => {
  document.querySelector("body")?.classList.add("h-100vh", "bg-light", "login-page");

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
								<div className="text-primary">
									<div className="display-1 mb-5 font-weight-bold error-text">401</div>
									<h1 className="h3  mb-3 font-weight-bold">Un Authorized Error!</h1>
									<p className="h5 font-weight-normal mb-7 leading-normal">You may have mistyped the address or the page may have moved.</p>
									<Link className="btn btn-primary text-white mb-5 fs-18" to="#">Help</Link>
									<Link className="btn text-primary border-primary mb-5 ms-2 fs-18" to={`${import.meta.env.BASE_URL}dashboard`}>Back to Home</Link>
								</div>
							</div>
						</Col>
					</Row>
				</div>
			</div>
		</div>
    </Fragment>
)};

export default Error401;
