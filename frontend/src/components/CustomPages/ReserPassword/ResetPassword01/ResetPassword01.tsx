import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo1 from '../../../../assets/images/brand/logo1.png';
interface ResetPassword01Props {}

const ResetPassword01: FC<ResetPassword01Props> = () => {
    document.body.classList.add("register1", "login-page");
	const [passwordshow, setpasswordshow] = useState(false);
	const [passwordshow1, setpasswordshow1] = useState(false);
	const [passwordshow2, setpasswordshow2] = useState(false);

	return(
  
  <Fragment>
 	<div className="page">
			<div className="page-single">
				<div className="container">
					<Row>
						<div className="col mx-auto mt-5">
							<div className="row justify-content-center">
								<Col xl={7} lg={12}>
									<Row className="row p-0 m-0">
										<Col lg={6} className="p-0">
											<div className="text-justified text-white p-5 register-1">
												<div className="custom-content">
													<div className="mb-5 br-7">
														<Link to={`${import.meta.env.BASE_URL}dashboard`}>
                              <img src={Logo1} className="header-brand-img" alt="Azea logo"/></Link>
													</div>
													<div className="ms-5">
														<div className="fs-16 mb-6 font-weight-bold text-white">Welcome Back To Azea !</div>
														<div className="mb-6 text-white-50">
															Lorem ipsum, dolor sit amet consectetur adipisicing elit. Exercitationem et esse in velit deleniti facilis quo, placeat totam aliquam veniam, quis rerum itaque!
														</div>
														<h6 className="text-white-50">Subscribe For More ?</h6>
														<Link to={`${import.meta.env.BASE_URL}CustomPages/login/login01`} className="btn btn-white text-primary font-weight-bold ">Visit Page</Link>
													</div>
												</div>
											</div>
										</Col>
										<Col md={8} lg={6} className="p-0 mx-auto">
										<Card className="card mb-0 border-0 br-7 br-ts-0 br-bs-0">
											<Card.Body>
												<div className="text-center mb-3">
													<h1 className="mb-2">Password</h1>
													<p className="mb-0">Create New Password</p>
												</div>
												<Form className="mt-5">
													<InputGroup className="input-group mb-4" onClick={()=>setpasswordshow(!passwordshow)}>
														<div className="input-group" id="Password-toggle">
															<Link to="#" className="input-group-text">
															<i className={`zmdi ${passwordshow ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
															</Link>
															<Form.Control className="form-control" type={(passwordshow) ? 'text' : "password"} placeholder="Password"/>
														</div>
													</InputGroup>
													<InputGroup className="input-group mb-4" onClick={()=>setpasswordshow1(!passwordshow1)}>
														<div className="input-group" id="Password-toggle1">
															<Link to="#" className="input-group-text">
															<i className={`zmdi ${passwordshow1 ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
															</Link>
															<Form.Control className="form-control" type={(passwordshow1) ? 'text' : "password"} placeholder="New Password"/>
														</div>
													</InputGroup>
													<InputGroup className="input-group mb-4" onClick={()=>setpasswordshow2(!passwordshow2)}>
														<div className="input-group" id="Password-toggle2">
															<Link to="#" className="input-group-text">
															<i className={`zmdi ${passwordshow2 ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
															</Link>
															<Form.Control className="form-control" type={(passwordshow2) ? 'text' : "password"} placeholder="Confirm Password"/>
														</div>
													</InputGroup>
													<Form.Group>
													<Form.Check type="checkbox" label="Remember Me" />

													</Form.Group>
													<Form.Group className="form-group text-center mb-3">
														<Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn w-100 br-7 btn-primary">Reset</Link>
													</Form.Group>
													<Form.Group className="form-group fs-12 text-center">
														By Clicking Reset,Password Changes & Agree to our  <Link to="#" className="font-weight-bold">Terms & Conditions</Link> and have read and acknowledge our  <Link to="#" className="font-weight-bold">Privacy & Services.</Link>
													</Form.Group>
												</Form>
											</Card.Body>
										</Card>
										</Col>
									</Row>
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

export default ResetPassword01;
