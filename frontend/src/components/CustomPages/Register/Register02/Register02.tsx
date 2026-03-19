import React, { FC, Fragment, useState } from 'react';
import Logo1 from '../../../../assets/images/brand/logo1.png';
import { Card, Col, InputGroup, Row, Form, Button} from 'react-bootstrap';
import {Link } from 'react-router-dom';

interface Register02Props {}

const Register02: FC<Register02Props> = () => {
    document.body.classList.add("register-2", "login-page");
	const [passwordshow, setpasswordshow] = useState(false);
	return(
  <Fragment>
  	<div className="page">
			<div className="page-content">
				<div className="container">
					<Row>
						<div className="col mx-auto mt-5">
							<div className="row justify-content-center">
								<Col md={6} xl={4}>
									<div className="text-center mb-6">
										<Link to={`${import.meta.env.BASE_URL}dashboard`}>
                      <img src={Logo1} className="header-brand-img" alt="Azea logo"/></Link>
									</div>
									<Card>
										<Card.Body>
											<div className="text-center mb-3">
												<h1 className="mb-2">Register</h1>
												<Link to="#">Create New Account</Link>
											</div>
											<div className="mt-5">
												<InputGroup className="mb-4">
														<InputGroup.Text>
															<i className="fe fe-user"></i>
														</InputGroup.Text>
													<Form.Control type="text" placeholder="Username"/>
												</InputGroup>
												<InputGroup className="mb-4">
														<InputGroup.Text>
															<i className="fe fe-mail"></i>
														</InputGroup.Text>
													<Form.Control type="text"  placeholder="Email"/>
												</InputGroup>
												<InputGroup className="mb-4">
													<span className="input-group-text"><i className="fe fe-lock"></i></span>
													<Form.Control  type="password" placeholder="Password"/>
												</InputGroup>
												<InputGroup className="input-group mb-4">
														<span className="input-group-text"><i className="fe fe-lock"></i></span>
													<Form.Control type={(passwordshow) ? 'text' : "password"} placeholder="Password" name='password' />
													<Link to="#" className="input-group-text" onClick={()=>setpasswordshow(!passwordshow)}>
														<i className={`zmdi ${passwordshow ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
													</Link>
											</InputGroup>
												<Form.Group>
													<Form.Check type="checkbox" label="I Agree For Terms & Conditions." />

												</Form.Group>
												<div className="form-group text-center mb-3">
													<Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn btn-primary w-100 br-7">Sign Up</Link>
												</div>
												<div className="form-group fs-12 text-center">
													By Clicking Sign up,Your agree to our  <Link to="#" className="font-weight-bold">Terms & Conditions</Link> and have read and acknowledge our  <a href="#" className="font-weight-bold">Privacy & Services.</a>
												</div>
											</div>
										</Card.Body>
									</Card>
									<div className="text-center register-icons">
										<div className="small text-white mb-4">Register using with</div>
										<Button className="btn bg-white-50  text-white-50 font-weight-semibold w-12 google me-2" type="button" variant=''><i className="fa fa-google"></i></Button>
										<Button className="btn bg-white-50  text-white-50 font-weight-semibold  w-12 facebook me-2" type="button" variant=''><i className="fa fa-facebook-f"></i></Button>
										<Button className="btn bg-white-50  text-white-50 font-weight-semibold w-12 twitter me-2" type="button" variant=''><i className="fa fa-twitter"></i></Button>
									</div>
								</Col>
							</div>
						</div>
					</Row>
				</div>
			</div>
		</div>

  </Fragment>
)};

export default Register02;
