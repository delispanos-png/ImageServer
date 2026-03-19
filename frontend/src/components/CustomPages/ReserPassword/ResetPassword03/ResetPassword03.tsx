import React, { FC, Fragment, useState } from 'react';
import { Col, Row,Form, InputGroup } from 'react-bootstrap';
import Logo from '../../../../assets/images/brand/logo.png';
import {  Link } from 'react-router-dom';
interface ResetPassword03Props {}

const ResetPassword03: FC<ResetPassword03Props> = () => {
    document.body.classList.add("register-3", "login-page","bg-white");
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
								<Col lg={6} xl={4} md={7} sm={12} xs={12}>
									<div className="text-center mb-5 mt-0">
										<Link to={`${import.meta.env.BASE_URL}dashboard`}>
                      <img src={Logo} className="header-brand-img" alt="Azea logo"/></Link>
									</div>
									<div className="card-group mb-0">
										<div className="card bg-primary text-white border-0 br-7 p-2">
											<div className="card-body mb-0">
												<div className="text-center mb-5">
													<h1 className="mb-2">Password</h1>
													<p className="mb-0 text-white">Create New Password</p>
												</div>
											<Form>
												<InputGroup className="input-group mb-4" onClick={()=>setpasswordshow(!passwordshow)}>
													<div className="input-group" id="Password-toggle">
															<Link to="#" className="input-group-text">
															<i className={`zmdi ${passwordshow ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
															</Link>
														<Form.Control className="form-control"  type={(passwordshow) ? 'text' : "password"} placeholder="Password"/>
													</div>
												</InputGroup>
												<InputGroup className="input-group mb-4" onClick={()=>setpasswordshow1(!passwordshow1)}>
													<div className="input-group" id="Password-toggle1">
															<Link to="#" className="input-group-text">
															<i className={`zmdi ${passwordshow1 ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
															</Link>
														<Form.Control className="form-control"  type={(passwordshow1) ? 'text' : "password"} placeholder="New Password"/>
													</div>
												</InputGroup>
												<InputGroup className="input-group mb-4" onClick={()=>setpasswordshow2(!passwordshow2)}>
													<div className="input-group" id="Password-toggle2">
															<Link to="#" className="input-group-text">
															<i className={`zmdi ${passwordshow2 ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
															</Link>
														<Form.Control className="form-control"  type={(passwordshow2) ? 'text' : "password"} placeholder="Re enter Password"/>
													</div>
												</InputGroup>
												<Form.Group>
													<Form.Check type="checkbox" label="Remember Me" />

												</Form.Group>
											</Form>
											<Row>
												<div className="col-12">
													<Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn btn-white btn-block text-primary d-grid px-4 font-weight-bold">Reset</Link>
												</div>
											</Row>
											<div className="text-center pt-4">
												<div className="font-weight-normal fs-14 text-white-50">Have another account <Link className="btn-link font-weight-bold anchors text-white" to={`${import.meta.env.BASE_URL}CustomPages/login/login03`}>Login Here</Link></div>
											</div>
											</div>
										</div>
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

export default ResetPassword03;
