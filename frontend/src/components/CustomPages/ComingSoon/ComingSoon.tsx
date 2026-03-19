import React, { FC, Fragment } from 'react';
import Logo1 from '../../../assets/images/brand/logo1.png';
import { Button, Form, InputGroup, Row } from 'react-bootstrap';
interface ComingSoonProps {}

const ComingSoon: FC<ComingSoonProps> = () => {
    document.body.classList.add("comming", "login-page");

	return(

  <Fragment>
 	<div className="page relative">
		<div className="page-content">
			<div className="container text-center">
				<div className="mb-5 br-7">
					<img src={Logo1} className="header-brand-img" alt="Azea logo"/>
				</div>
				<div className="display-2 text-white mb-5 font-weight-normal1 error-text">Coming soon</div>
				<p className="h5 font-weight-normal mb-5 leading-normal text-white-50">Our website is under construction and
					we are working on it will be available soon.</p>
				<Row>
					<div className="col-md-6 d-block mx-auto">
						<InputGroup className="input-group  mb-8">
							<Form.Control style={{height:'35px'}} className="form-control" placeholder="Enter Your Email" type="text"/>
							<Button className="btn br-ts-0 br-bs-0" variant='primary' type="button">
								<span className="input-group-btn">Notify Me</span>
							</Button>
						</InputGroup>
						<div className="text-center register-icons">
							<Button className="btn bg-white-50  text-white-50 font-weight-semibold google me-2" variant='light'
								type="button"><i className="fa fa-google"></i></Button>
							<Button className="btn bg-white-50  text-white-50 font-weight-semibold  facebook me-2" variant='light'
								type="button"><i className="fa fa-facebook-f"></i></Button>
							<Button className="btn bg-white-50  text-white-50 font-weight-semibold twitter me-2" variant='light'
								type="button"><i className="fa fa-twitter"></i></Button>
						</div>
					</div>
				</Row>
			</div>
		</div>
	</div>
  </Fragment>
)
	};

export default ComingSoon;
