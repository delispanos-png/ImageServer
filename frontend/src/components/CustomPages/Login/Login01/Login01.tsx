import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Col, Row ,Form, InputGroup} from 'react-bootstrap';
import Logo1 from '../../../../assets/images/brand/logo1.png';
import {  Link } from 'react-router-dom';
interface Login01Props {}

const Login01: FC<Login01Props> = () => {
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
								<Row className="p-0 m-0">
									<Col lg={6} className="p-0">
										<div className="text-justified text-white p-5 register-1 overflow-hidden">
											<div className="custom-content">
												<div className="mb-5 br-7">
													<Link to={`${import.meta.env.BASE_URL}dashboard`}>
                            <img src={Logo1}
														className="header-brand-img" alt="Azea logo"/></Link>
												</div>
												<div className="ms-5">
													<div className="fs-18 mb-6 font-weight-bold text-white">Welcome Back To
														Azea !</div>
													<div className="mb-7 text-white-50">
														Lorem ipsum, dolor sit amet consectetur adipisicing elit.
														Exercitationem et esse in velit deleniti facilis quo!
													</div>
													<div className="d-flex">
														<h6 className="text-white-50">Don't Have an Account?</h6>
														<Link to={`${import.meta.env.BASE_URL}CustomPages/register/register01`}
															className="text-white font-weight-semibold ms-1">Create
															Here</Link>
													</div>
												</div>
											</div>
										</div>
									</Col>
									<Col md={8} lg={6} className="p-0 mx-auto">
										<Card className="mb-0 border-0 br-7 br-ts-0 br-bs-0">
											<Card.Body>
												<div className="text-center mb-3">
													<h1 className="mb-2">Log In</h1>
													<Link to="#">Hello There !</Link>
												</div>
												<Form className="mt-5">
													<InputGroup className="mb-4">
														<InputGroup.Text>
															<i className="fe fe-user"></i>
														</InputGroup.Text>
														<Form.Control type="text" placeholder="Username"/>
													</InputGroup>
													<InputGroup className="input-group mb-4">
												<div className="input-group" id="Password-toggle1" onClick={()=>setpasswordshow(!passwordshow)}>
													<Link to="#" className="input-group-text">
														<i className={`zmdi ${passwordshow ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
													</Link>
													<Form.Control type={(passwordshow) ? 'text' : "password"} placeholder="Password" name='password' />
												</div>
											</InputGroup>
													<Form.Group>
													<Form.Check type="checkbox" label="Remember Me" />

													</Form.Group>
													<div className="form-group text-center mb-3">
														<Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn  w-100 br-7 btn-primary" >Log
															In</Link>
													</div>
													<Form.Group className="fs-13 text-center">
														<Link to={`${import.meta.env.BASE_URL}CustomPages/forgetpassword/forgetpassword01`}> Forget Password?</Link>
													</Form.Group>
													<Form.Group className="fs-14 text-center font-weight-bold">
														<Link to="#">Click Here To Backup Mail</Link>
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

export default Login01;
