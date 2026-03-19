import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Logo1 from '../../../../assets/images/brand/logo1.png';
import { Link } from 'react-router-dom';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
interface LockScreen01Props {}

const LockScreen01: FC<LockScreen01Props> = () => {
	const [passwordshow, setpasswordshow] = useState(false);
	
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
									<Col lg={6} className="col-lg-6 p-0">
										<div className="text-justified text-white p-5 register-1 overflow-hidden">
											<div className="custom-content">
												<div className="mb-5 br-7">
													<Link to={`${import.meta.env.BASE_URL}dashboard`}>
                            <img src={Logo1}
														className="header-brand-img" alt="Azea logo"/> 
														</Link>
												</div>
												<div className="ms-5">
													<div className="fs-16 mb-6 font-weight-bold text-white">Welcome Back To
														Azea !</div>
													<div className="mb-6 text-white-50">
														Lorem ipsum dolor sit amet consectetur adipisicing elit.
														Adipisci, neque nam. Vero quisquam error fugiat !
													</div>
												</div>
											</div>
										</div>
									</Col>
									<Col md={8} lg={6} className="p-0 mx-auto">
										<Card className="mb-0 border-0 h-300 br-7 br-ts-0 br-bs-0">
											<Card.Body>
												<div className="text-center mb-4 ">
													<img className="avatar avatar-xxl  brround"
														src={ImagesData("users2")}>

														</img>
												</div>
												<span className="m-4 d-none d-lg-block text-center">
													<span className="fs-20"><strong>Patrenna</strong></span>
												</span>
												<InputGroup className="input-group mb-4" onClick={()=>setpasswordshow(!passwordshow)}>
													<div className="input-group" id="Password-toggle">
														<Link to="#" className="input-group-text">
															<i className={`zmdi ${passwordshow ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
														</Link>
														<Form.Control className="form-control" type={(passwordshow) ? 'text' : "password"}
															placeholder="Password"/>
													</div>
												</InputGroup>
												<Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn  w-100 btn-primary"><i className="fe fe-lock"></i>
													Unlock</Link>
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

export default LockScreen01;
