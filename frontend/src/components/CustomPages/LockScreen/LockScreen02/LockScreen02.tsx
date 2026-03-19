import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import Logo1 from '../../../../assets/images/brand/logo1.png';
interface LockScreen02Props {}

const LockScreen02: FC<LockScreen02Props> = () => {
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
								<Col md={4}>
									<div className="text-center mb-6">
										<Link to={`${import.meta.env.BASE_URL}dashboard`}>
                      <img src={Logo1} className="header-brand-img" alt="Azea logo"/>
					  </Link>
									</div>
									<Card>
										<Card.Body>
											<div className="row mt-xl-5">
												<div className="col-9 d-block mx-auto">
													<div className="text-center mb-4 ">
														<img className="avatar avatar-xxl  brround" src={ImagesData("users2")}></img>
													</div>
													<span className="m-4 d-none d-lg-block text-center">
														<span className="fs-20"><strong>Patrenna</strong></span>
													</span>
													<InputGroup className="input-group mb-4" onClick={()=>setpasswordshow(!passwordshow)}>
														<div className="input-group" id="Password-toggle">
															<Link to="#" className="input-group-text">
															  <i className={`zmdi ${passwordshow ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
															</Link>
															<Form.Control className="form-control" type={(passwordshow) ? 'text' : "password"} placeholder="Confirm Password"/>
														</div>
													</InputGroup>
													<Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn w-100 btn-primary"><i className="fe fe-lock"></i> Unlock</Link>
												</div>
											</div>
										</Card.Body>
									</Card>
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

export default LockScreen02;
