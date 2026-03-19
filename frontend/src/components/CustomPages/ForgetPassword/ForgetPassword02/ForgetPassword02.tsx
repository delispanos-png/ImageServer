import React, { FC, Fragment } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Logo1 from '../../../../assets/images/brand/logo1.png';
import { Link } from 'react-router-dom';

interface ForgetPassword02Props {}

const ForgetPassword02: FC<ForgetPassword02Props> = () => {
    document.body.classList.add("register-2", "login-page");

	return(
  <Fragment>
   <div className="page">
			<div className="page-content">
				<div className="container">
					<Row>
						<div className="col mx-auto mt-5">
							<div className="row justify-content-center">
								<Col lg={4} md={6} sm={8}>
									<div className="text-center mb-6">
										<Link to={`${import.meta.env.BASE_URL}dashboard`}>
                      <img src={Logo1}className="header-brand-img" alt="Azea logo"/></Link>
									</div>
									<Card>
										<Card.Body>
											<div className="text-center mb-3">
												<h1 className="mb-2">Forget Password</h1>
												<Link to={`${import.meta.env.BASE_URL}CustomPages/login/login02`}>Create New Password</Link>
											</div>
											<Form className="mt-5">
												<InputGroup className="input-group mb-4">
														<InputGroup.Text>
															<i className="fe fe-mail"></i>
														</InputGroup.Text>
													<Form.Control type="text" className="form-control" placeholder="Email"/>
												</InputGroup>
												<Form.Group>
													<Form.Check type="checkbox" label="Send recovery mail" />

												</Form.Group>
												<Form.Group className="text-center mb-3">
													<Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn w-100 br-7 btn-primary" >Send</Link>
												</Form.Group>
												<Form.Group className="fs-12 text-center">
													By Clicking Send ,You agree to our  <Link to="#" className="font-weight-bold">Terms & Conditions</Link> and have read and acknowledge our  <a href="#" className="font-weight-bold">Privacy & Services.</a>
												</Form.Group>
											</Form>
										</Card.Body>
									</Card>
									<div className="text-center register-icons">
										<div className="small text-white mb-4">Login using with</div>
										<Button className="btn bg-white-50  text-white-50 font-weight-semibold w-12 google me-2" variant='' type="button"><i className="fa fa-google"></i></Button>
										<Button className="btn bg-white-50  text-white-50 font-weight-semibold  w-12 facebook me-2" variant='' type="button"><i className="fa fa-facebook-f"></i></Button>
										<Button className="btn bg-white-50  text-white-50 font-weight-semibold w-12 twitter me-2" variant='' type="button"><i className="fa fa-twitter"></i></Button>
									</div>
								</Col>
							</div>
						</div>
					</Row>
				</div>
			</div>
		</div>
  </Fragment>
)
	};

export default ForgetPassword02;
