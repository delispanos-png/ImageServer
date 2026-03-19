import React, { FC, Fragment } from 'react';
import Logo1 from '../../../../assets/images/brand/logo1.png';
import { Col, Row,Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface ForgetPassword01Props {}

const ForgetPassword01: FC<ForgetPassword01Props> = () => {

    document.body.classList.add("register1", "login-page");

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
										<div className="text-justified text-white p-5 register-1  overflow-hidden">
											<div className="custom-content">
												<div className="mb-5 br-7">
													<Link to={`${import.meta.env.BASE_URL}dashboard`}>
                            <img src={Logo1}
														className="header-brand-img" alt="Azea logo"/></Link>
												</div>
												<div className="ms-5">
													<div className="fs-16 mb-6 font-weight-bold text-white">Welcome Back To
														Azea !</div>
													<div className="mb-6 text-white-50">
														Lorem ipsum, dolor sit amet consectetur adipisicing elit.
														Exercitationem deleniti facilis quo!
													</div>
													<h6 className="text-white-50">Subscribe For More .</h6>
													<Link to={`${import.meta.env.BASE_URL}CustomPages/login/login01`}
														className="btn btn-white text-primary font-weight-bold ">Visit
														Page</Link>
												</div>
											</div>
										</div>
									</Col>
									<Col md={8} lg={6} className="p-0 mx-auto">
										<Card className="mb-0 border-0 br-7 br-ts-0 br-bs-0">
											<Card.Body>
												<div className="text-center mb-3">
													<h1 className="mb-2">Forget Password</h1>
													<Link to="#">OOps....</Link>
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
													<Form.Group className="form-group text-center mb-3">
														<Link  to={`${import.meta.env.BASE_URL}dashboard`} className="btn  btn-lg w-100 br-7 btn-primary" >Send</Link>
													</Form.Group>
													<Form.Group className="form-group fs-12 text-center">
														By Clicking Send,You agree to our <Link to={`${import.meta.env.BASE_URL}Pages/terms`}
															className="font-weight-bold">Terms & Conditions</Link> and have
														read and acknowledge our <Link to="#"
															className="font-weight-bold">Privacy & Services.</Link>
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
)};

export default ForgetPassword01;
