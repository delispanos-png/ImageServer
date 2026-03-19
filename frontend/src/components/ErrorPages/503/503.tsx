import React, { FC, Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


interface Error503Props {}

const Error503: FC<Error503Props> = () => {
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
									<div className="display-1 error-text mb-5 font-weight-bold"> 5<i className="fa fa-frown-o"></i>3</div>
									<h1 className="h3  mb-3 font-weight-bold">Sorry, an error has occured, Serive Unavaliable </h1>
									<p className="h5 font-weight-normal mb-7 leading-normal">You may have mistyped the address or the page may have moved.</p>
									<Link className="btn btn-primary text-light mb-5 fs-18" to="#">Help</Link>
									<Link className="btn text-primary border-primary mb-5 ms-2 fs-18" to={`${import.meta.env.BASE_URL}dashboard`}>Back to Home</Link>
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

export default Error503;
