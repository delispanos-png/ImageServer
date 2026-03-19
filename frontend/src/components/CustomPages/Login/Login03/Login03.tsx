import React, { FC, Fragment, useState } from 'react';
import { Col, InputGroup, Row, Form, Button } from 'react-bootstrap';
import {Link } from 'react-router-dom';
import Logo from '../../../../assets/images/brand/logo.png';
interface Login03Props {}

const Login03: FC<Login03Props> = () => {
    document.body.classList.add("bg-white","register-3", "login-page");
	const [passwordshow, setpasswordshow] = useState(false);

	return(
  <Fragment>
   <div className="page">
		<div className="page-content">
			<div className="container">
				<Row>
					<div className="col mx-auto mt-5">
						<div className="row justify-content-center">
							<Col lg={6} xl={4} md={7} sm={12} xs={12} >
								<div className="text-center mb-5 mt-0">
									<Link to={`${import.meta.env.BASE_URL}dashboard`}>
                    <img src={Logo} className="header-brand-img"
										alt="Azea logo"/></Link>
								</div>
								<div className="card-group mb-0">
									<div className="card bg-primary text-white br-7 p-2">
										<div className="card-body mb-0">
											<div className="text-center mb-3">
												<h1 className="mb-2 text-white">Log In</h1>
												<Link to="#" className="text-white">Welcome Back !</Link>
											</div>
											<hr className="hrregister3"/>
											<div className="text-center small mt-3">Sign in with</div>
											<div className="btn-list text-center mb-3 mt-2">
												<Link to="#" className="btn   m-0 me-2 p-2 mb-2"><i
														className="fa fa-google"></i> Google</Link>
												<Link to="#" className="btn  m-0 me-2 p-2 mb-2"><i
														className="fa fa-twitter"></i> twitter</Link>
												<Link to="#" className="btn  m-0 p-2 mb-2"><i
														className="fa fa-facebook"></i> facebook</Link>
											</div>
											<hr className="divider my-6 text-primary"/>
											<Form>
												<InputGroup className="input-group mb-4">
													<InputGroup.Text>
														<i className="fe fe-user"></i>
													</InputGroup.Text>
													<Form.Control type="text" className="form-control" placeholder="Username"/>
												</InputGroup>
												<InputGroup className="input-group mb-4" onClick={()=>setpasswordshow(!passwordshow)}>
													<div className="input-group" id="Password-toggle">
														<Link to="#" className="input-group-text">
															<i className={`zmdi ${passwordshow ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
														</Link>
														<Form.Control className="form-control" type={(passwordshow) ? 'text' : "password"}
															placeholder="Password"/>
													</div>
												</InputGroup>
												<Form.Group>
												
													<label className="custom-control custom-checkbox">
														<input type="checkbox" className="custom-control-input"/>
														<span className="custom-control-label text-white-50">Remember Me <Link to={`${import.meta.env.BASE_URL}CustomPages/forgetpassword/forgetpassword03`} className="btn-link text-white float-end ms-2">Forget password
																?</Link></span>

													</label>
												</Form.Group>
											</Form>
											<Row>
												<div className="col-12">
													<Link to={`${import.meta.env.BASE_URL}dashboard`}
														className="btn btn-white text-primary btn-block d-grid px-4 font-weight-bold">Log
														In</Link>
												</div>
											</Row>
											<div className="text-center pt-4">
												<div className="font-weight-normal fs-14 text-white-50">Don't have an
													account ? <Link className="btn-link font-weight-bold anchors text-white"
														to={`${import.meta.env.BASE_URL}CustomPages/register/register03`}>Sign Up</Link></div>
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
)};

export default Login03;
