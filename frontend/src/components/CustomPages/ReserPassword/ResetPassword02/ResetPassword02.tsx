import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Logo1 from '../../../../assets/images/brand/logo1.png';
import { Link } from 'react-router-dom';
interface ResetPassword02Props {}

const ResetPassword02: FC<ResetPassword02Props> = () => {
    document.body.classList.add("register-2", "login-page");
	const [passwordshow, setpasswordshow] = useState(false);
	const [passwordshow1, setpasswordshow1] = useState(false);
	const [passwordshow2, setpasswordshow2] = useState(false);
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
													<Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn btn-primary w-100 br-7">Reset</Link>
												</Form.Group>
												<Form.Group className="form-group fs-12 text-center">
													By Clicking Reset, New Password Your agree to our  <Link to="#" className="font-weight-bold">Terms & Conditions</Link> and have read and acknowledge our  <Link to="#" className="font-weight-bold">Privacy & Services.</Link>
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

export default ResetPassword02;
