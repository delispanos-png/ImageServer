import React, { FC, Fragment, useState } from 'react';
import Logo1 from '../../../../assets/images/brand/logo1.png';
import { Card, Col, Row ,Form, InputGroup, Button} from 'react-bootstrap';
import {  Link } from 'react-router-dom';
interface Register01Props {}

const Register01: FC<Register01Props> = () => {
    document.body.classList.add("register1", "login-page");
	const [passwordshow, setpasswordshow] = useState(false);
	return(

  <Fragment>
   	<div className="page">
			<div className="page-single">
				<div className="container">
					<Row>
						<div className="col mx-auto mt-5">
							<div className="row justify-content-center">
								<Col xl={7} lg={12}>
									<div className="row p-0 m-0">
										<Col lg={6} className="p-0">
											<div className="text-justified card mb-0 border-0 text-white p-5 register-1 overflow-hidden br-te-0 br-be-0">
												<div className="custom-content">
													<div className="mb-5 br-7">
														<Link to={`${import.meta.env.BASE_URL}dashboard`} >
                              <img src={Logo1} className="header-brand-img" alt="Azea logo"/></Link>
													</div>
													<div className="ms-5">
														<div className="fs-16 mb-6 font-weight-bold text-white">Welcome Back To Azea !</div>
														<div className="mb-6 text-white-50">
															Lorem ipsum, dolor sit amet consectetur adipisicing elit. Exercitationem et esse in velit deleniti facilis quo, placeat totam aliquam veniam, quis rerum itaque, incidunt sequi quidem magni error est! Provident!
														</div>
														<h6 className="text-white-50">Already a member ?</h6>
														<Link to={`${import.meta.env.BASE_URL}CustomPages/login/login01`}  className="btn btn-white text-primary font-weight-bold ">Login Here</Link>
													</div>
												</div>
											</div>
										</Col>
										<Col md={8} lg={6} className="p-0 mx-auto">
										<div className="br-7 br-ts-0 br-bs-0 card mb-0 border-0">
											<Card.Body>
												<div className="text-center mb-3">
													<h1 className="mb-2">Sign Up</h1>
													<Link to="#">Create New Account</Link>
												</div>
												<Form className="mt-5">
													<InputGroup className="mb-4">
															<InputGroup.Text>
																<i className="fe fe-user"></i>
															</InputGroup.Text>
														<Form.Control type="text"  placeholder="Username"/>
													</InputGroup>
													<InputGroup className=' mb-4'>
															<div className="input-group-text">
																<i className="fe fe-mail"></i>
															</div>
														<Form.Control type="text"  placeholder="Email"/>
													</InputGroup>
													<InputGroup className="mb-4">
														<span className="input-group-text"><i className="fe fe-lock"></i></span>
														<Form.Control type="password" placeholder="Password"/>
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
														<Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn  w-100 br-7 btn-primary">Sign Up</Link>
													</div>
													<div className="form-group fs-12 text-center">
														By Clicking Sign up,Your agree to our  <Link to="#" className="font-weight-bold">Terms & Conditions</Link> and have read and acknowledge our  <a href="#" className="font-weight-bold">Privacy & Services.</a>
													</div>
												</Form>
											</Card.Body>
										</div>
										</Col>
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

export default Register01;
