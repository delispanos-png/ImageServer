import React, { FC, Fragment, useState } from 'react';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../../../../assets/images/brand/logo.png';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
interface LockScreen03Props {}

const LockScreen03: FC<LockScreen03Props> = () => {
	const [passwordshow, setpasswordshow] = useState(false);
    document.body.classList.add("bg-white","register-3", "login-page");

	return(
  <Fragment>
  <div className="page">
			<div className="page-content">
				<div className="container">
					<Row>
						<div className="col mx-auto mt-5">
							<Row className="justify-content-center">
								<Col lg={6} xl={4} md={7} sm={12} xs={12}>
									<div className="text-center mb-5 mt-0">
										<Link to={`${import.meta.env.BASE_URL}dashboard`}>
                      <img src={Logo} className="header-brand-img"
											alt="Azea logo"/></Link>
									</div>
									<div className="card-group mb-0">
										<div className="card bg-primary text-white br-7 p-2">
											<div className="card-body">
												<div className="text-center mb-4 ">
													<img className="avatar avatar-xxl  brround" src={ImagesData("users2")}></img>
												</div>
												<span className="m-4 d-none d-lg-block text-center">
													<span className="fs-20"><strong>Patrenna</strong></span>
												</span>
												<InputGroup className="input-group mb-4"  onClick={()=>setpasswordshow(!passwordshow)}>
													<div className="input-group" id="Password-toggle">
															<Link to="#" className="input-group-text">
															<i className={`zmdi ${passwordshow ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true"></i>
															</Link>
														<Form.Control className="form-control" type={(passwordshow) ? 'text' : "password"} placeholder="Password"/>
													</div>
												</InputGroup>
												<Row>
													<div className="col-12">
														<Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn text-primary w-100 btn-white"><i className="fe fe-lock"></i> Unlock</Link>
													</div>
												</Row>
											</div>
										</div>
									</div>
								</Col>
							</Row>
						</div>
					</Row>
				</div>
			</div>
		</div>
  </Fragment>
)
	};

export default LockScreen03;
