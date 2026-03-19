import React, { FC, Fragment, useState } from 'react';
import Logo from '../../../../assets/images/brand/logo.png';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Register03Props {}

const Register03: FC<Register03Props> = () => {
    
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
								<Col lg={6} xl={4} md={7} sm={12} xs={12}>
									<div className="text-center mb-5 mt-0">
										<Link to={`${import.meta.env.BASE_URL}dashboard`}>
                      <img src={Logo}  className="header-brand-img" alt="Azea logo"/></Link>
									</div>
									<div className="card-group mb-0">
										<div className="card bg-primary text-white br-7 p-2">
											<div className="card-body mb-0">
												<div className="text-center mb-3">
													<h1 className="mb-2">Register</h1>
													<Link to="#" className="text-white">Create New Account</Link>
												</div>
											<hr className="hrregister3"/>
											<div className="text-center small mt-3">Sign up with</div>
											<div className="btn-list text-center mb-3 mt-2">
												<Link to="#" className="btn   m-0 me-2 p-2 mb-2"><i className="fa fa-google"></i> Google</Link>
												<Link to="#" className="btn  m-0 me-2 p-2 mb-2"><i className="fa fa-twitter"></i> twitter</Link>
												<Link to="#" className="btn  m-0 p-2 mb-2"><i className="fa fa-facebook"></i> facebook</Link>
											</div>
											<hr className="divider my-6 text-primary"/>
											<Form>
												<InputGroup className=" mb-4">
														<InputGroup.Text className="input-group-text">
															<i className="fe fe-user"></i>
														</InputGroup.Text>
													<Form.Control type="text" className="border-start-0" placeholder="Username"/>
												</InputGroup>
												<InputGroup className="mb-4">
														<InputGroup.Text>
															<i className="fe fe-mail"></i>
														</InputGroup.Text>
													<Form.Control type="text" className="border-start-0" placeholder="Enter Email"/>
												</InputGroup>
												<InputGroup className="mb-4">
													<InputGroup.Text ><i className="fe fe-lock"></i></InputGroup.Text>
													<Form.Control className="form-control border-start-0" type="password" placeholder="Password"/>
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
											</Form>
											<Row>
												<div className="col-12">
													<Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn btn-white text-primary btn-block d-grid px-4 font-weight-bold">Create New Account</Link>
												</div>
											</Row>
											<div className="text-center pt-4">
												<div className="font-weight-normal fs-14 text-white-50">Already have an account ?<Link className="btn-link font-weight-bold anchors text-white ms-2 d-inline-block" to={`${import.meta.env.BASE_URL}CustomPages/login/login03`} >Login Here</Link></div>
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

export default Register03;
