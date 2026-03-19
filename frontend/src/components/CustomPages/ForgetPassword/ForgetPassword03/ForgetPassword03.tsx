import React, { FC, Fragment } from 'react';
import { Col, Row , Form, InputGroup, Card} from 'react-bootstrap';
import {  Link } from 'react-router-dom';
import Logo from '../../../../assets/images/brand/logo.png';

interface ForgetPassword03Props {}

const ForgetPassword03: FC<ForgetPassword03Props> = () => {
    document.body.classList.add("bg-white","register-3", "login-page");

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
                    <img src={Logo} className="header-brand-img"
										alt="Azea logo"/></Link>
								</div>
								<div className="card-group mb-0">
									<Card className="card bg-primary text-white br-7 p-2">
										<Card.Body className="card-body mb-0">
											<div className="text-center mb-5">
												<h1 className="mb-2">Forget Password</h1>
												<Link to="#" className="text-white">Create New Password</Link>
											</div>
											<div className="text-center small mt-3">Log In with</div>
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
														<i className="fe fe-mail"></i>
													</InputGroup.Text>
													<Form.Control type="text" className="form-control" placeholder="Enter Email"/>
												</InputGroup>
												<Form.Group>
													<Form.Check type="checkbox" label="Send recovery mail" />

												</Form.Group>
											</Form>
											<Row>
												<div className="col-12">
													<Link to={`${import.meta.env.BASE_URL}dashboard`}
														className="btn btn-white text-primary btn-block d-grid px-4 font-weight-bold">Send</Link>
												</div>
											</Row>
											<div className="text-center pt-4">
												<div className="font-weight-normal fs-14 text-white-50">Have an other
													account ? <Link className="btn-link font-weight-bold anchors text-white"
														to={`${import.meta.env.BASE_URL}CustomPages/login/login03`}>Login Here</Link></div>
											</div>
										</Card.Body>
									</Card>
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

export default ForgetPassword03;
