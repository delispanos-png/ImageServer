import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import {prices,prices1, prices2,prices3} from '../Pricing03/Data/pricing3Data';
interface Pricing03Props {}

const Pricing03: FC<Pricing03Props> = () => (
  <Fragment>
						<PageHeader  title="Pricing 3" />
						<div className="pricing-tabs">
							<div className="text-center">
								<Tab.Container id="center-tabs-example"
                  defaultActiveKey="second">
								<div className="pri-tabs-heading">
									<Nav as='ul' variant="pills" className="justify-content-center nav-price">
										<Nav.Item as='li'><Nav.Link eventKey="first">Month</Nav.Link></Nav.Item>
										<Nav.Item as='li'><Nav.Link eventKey="second">Year</Nav.Link></Nav.Item>
									</Nav>
								</div>
								<Tab.Content>
									<Tab.Pane eventKey="first" className="tab-pane pb-0" id="Month">
										<div className="row row-sm pricing-style01">
										{prices.map((price)=>(
							<Col sm={6} xl={3}  key={Math.random()}>
								<div className="panel price panel-color">
									<div className={`panel-heading bg-${price.color} text-white p-0 pb-0 text-center`}>
										<h3>{price.heading}</h3>
									</div>
									<div className={`bg-${price.color}-transparent`}>
										<div className="panel-body text-center mb-3">
											<p className={`lead text-${price.color}`}><strong>{price.main} </strong>/ Month</p>
										</div>
										<ul className="text-center">
											<li className="mb-4"> <strong>{price.text}</strong> Free Domain Name</li>
											<li className="mb-4"><strong>{price.text1}</strong> One-Click Apps</li>
											<li className="mb-4"><strong> {price.text2} </strong>Databases</li>
											<li className="mb-4"><strong> Money </strong> BackGuarantee</li>
											<li className="mb-6"><strong> 24/7</strong> support</li>
										</ul>
										<div className={`panel-footer  bg-${price.color}-transparent text-center border-top-0`}>
											<Button className="btn btn-lg" href="#" variant={price.color}>Purchase Now!</Button>
										</div>
									</div>
								</div>
							</Col>
							))}
										</div>
									</Tab.Pane>
									<Tab.Pane eventKey="second"  id="Year">
										<Row className="row-sm pricing-style01">
										{prices1.map((price1)=>(
							<Col sm={6} xl={3}  key={Math.random()}>
								<div className="panel price panel-color">
									<div className={`panel-heading bg-${price1.color} text-white p-0 pb-0 text-center`}>
										<h3>{price1.heading}</h3>
									</div>
									<div className={`bg-${price1.color}-transparent`}>
										<div className="panel-body text-center mb-3">
											<p className={`lead text-${price1.color}`}><strong>{price1.main} </strong>/ Year</p>
										</div>
										<ul className="text-center">
											<li className="mb-4"> <strong>{price1.text}</strong> Free Domain Name</li>
											<li className="mb-4"><strong>{price1.text1}</strong> One-Click Apps</li>
											<li className="mb-4"><strong> {price1.text2} </strong>Databases</li>
											<li className="mb-4"><strong> Money </strong> BackGuarantee</li>
											<li className="mb-6"><strong> 24/7</strong> support</li>
										</ul>
										<div className={`panel-footer  bg-${price1.color}-transparent text-center border-top-0`}>
											<Button className="btn btn-lg" href="#" variant={price1.color}>Purchase Now!</Button>
										</div>
									</div>
								</div>
							</Col>
							))}
										</Row>
									</Tab.Pane>
								</Tab.Content>
								</Tab.Container>
							</div>
						</div>
						<div className="pricing-tabs">
							<div className="text-center">
								<Tab.Container id="center-tabs-example"
                  defaultActiveKey="first">
								<div className="pri-tabs-heading pri-tabs-heading2">
									<Nav as='ul' variant="pills" className="justify-content-center nav-price">
										<Nav.Item as='li'><Nav.Link eventKey="first"  >Month</Nav.Link></Nav.Item>
										<Nav.Item as='li'><Nav.Link eventKey="second"  >Year</Nav.Link></Nav.Item>
									</Nav>
								</div>
								<Tab.Content >
									<Tab.Pane eventKey="first" className="pb-0 " id="month1">
										<div className="row text-center">
											{prices2.map((price2)=>(
											<div className="col-sm-6 col-xl-3" key={Math.random()}>
												<div className="card plan-card shadow-none border">
													<div>
														<div className="pt-4 pb-4">
															<i className={`fa fa-${price2.icon} plan-icon bg-${price2.color} mb-5`}></i>
															<h6
																className={`text-uppercase font-weight-semibold text-${price2.color}`}>
																{price2.heading}</h6>
														</div>
														<div>
															<h1
																className="plan-price padding-b-15 display-4 mb-0 font-weight-semibold">
																{price2.class} <span className="text-muted m-l-10"><sup>Per
																		Month</sup></span></h1>
															<div className="plan-div-border"></div>
														</div>
														<div className="plan-features pb-4 mt-4 text-muted padding-t-b-30">
															<p><strong>{price2.text} </strong> FreeDomain Name</p>
															<p><strong>{price2.text1}</strong> One-Click Apps</p>
															<p><strong>{price2.text2}</strong> Databases</p>
															<p><strong>{price2.text2}</strong> BackGuarntee</p>
															<p><strong>24/7</strong> Support</p>
															<Button href="#"
																className=" btn-lg mt-4" variant={price2.color}>Sign Up Now</Button>
														</div>
													</div>
												</div>
											</div>
											))}
										</div>
									</Tab.Pane>
									<Tab.Pane eventKey="second" className="tab-pane pb-0" id="year1">
										<div className="row text-center">
										{prices3.map((price3)=>(
											<Col sm={6} xl={3} key={Math.random()}>
												<div className="card plan-card shadow-none border">
													<div>
														<div className="pt-4 pb-4">
															<i className={`fa fa-${price3.icon} plan-icon bg-${price3.color} mb-5`}></i>
															<h6
																className={`text-uppercase font-weight-semibold text-${price3.color}`}>
																{price3.heading}</h6>
														</div>
														<div>
															<h1
																className="plan-price padding-b-15 display-4 mb-0 font-weight-semibold">
																{price3.class} <span className="text-muted m-l-10"><sup>Per
																		Year</sup></span></h1>
															<div className="plan-div-border"></div>
														</div>
														<div className="plan-features pb-4 mt-4 text-muted padding-t-b-30">
															<p><strong>{price3.text} </strong> FreeDomain Name</p>
															<p><strong>{price3.text1}</strong> One-Click Apps</p>
															<p><strong>{price3.text2}</strong> Databases</p>
															<p><strong>{price3.text2}</strong> BackGuarntee</p>
															<p><strong>24/7</strong> Support</p>
															<Button href="#"
																className=" btn-lg mt-4" variant={price3.color}>Sign Up Now</Button>
														</div>
													</div>
												</div>
											</Col>
											))}
										</div>
									</Tab.Pane>
								</Tab.Content>
								</Tab.Container>
							</div>
						</div>
						<div className="pricing-tabs">
							<div className="text-center">
							<Tab.Container id="center-tabs-example"
                  defaultActiveKey="third">
								<div className="pri-tabs-heading pri-tabs-heading3">
									<Nav as='ul' variant="pills" className="justify-content-center nav-price">
										<Nav.Item as='li'><Nav.Link eventKey="first" href="#week">Week</Nav.Link></Nav.Item>
										<Nav.Item as='li'><Nav.Link eventKey="second" href="#month2">Month</Nav.Link></Nav.Item>
										<Nav.Item as='li'><Nav.Link eventKey="third" href="#year2">Year</Nav.Link></Nav.Item>
									</Nav>
								</div>
								<Tab.Content>
								<Tab.Pane eventKey="first" className="pb-0" id="week">
										<Row className="pt-7">
											<Col xs={6} sm={6} xl={3} className="mt-2">
												<Card className="cshadow-none">
													<Card.Header className="bg-primary text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Team</h3>
															<div className="mb fs-13">$0 PER USER/Week</div>
															<p className="fs-12">billed weekly</p>
														</Card.Title>
													</Card.Header>
													<Card.Body className="card-body text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>20 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><span
																	className="text-primary fs-16 font-weight-bold">New! </span>
																<strong>16</strong> One-Click Apps
															</li>
															<li className="text-muted border-bottom"><strong>6</strong>
																Databases</li>
															<li className="text-muted border-bottom"><strong>Money</strong>
																BackGuarntee</li>
															<li className="text-muted border-bottom"><strong>24/7</strong>
																Support</li>
														</ul>
														<div className="text-center mt-5 px-5">
															<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-primary'>Buy
																Now</Button>
														</div>
													</Card.Body>
												</Card>
											</Col>
											<Col xs={6} sm={6} xl={3} className=" mt-2">
												<Card className="shadow-none">
													<Card.Header className="bg-success text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Personal</h3>
															<div className="mb fs-13">$9 PER USER/Week</div>
															<p className="fs-12">billed weekly</p>
														</Card.Title>
													</Card.Header>
													<Card.Body className="text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>5 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><strong>7</strong>
																One-Click Apps</li>
															<li className="text-muted border-bottom"><strong>6</strong>
																Databases</li>
															<li className="text-muted border-bottom"><span
																	className="text-success fs-16 font-weight-bold">New! </span>
																<strong>Money</strong> BackGuarntee
															</li>
															<li className="text-muted border-bottom"><strong>24/7</strong>
																Support</li>
														</ul>
														<div className="text-center mt-5 px-5">
														<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-success'>Buy
																Now</Button>
														</div>
													</Card.Body>
												</Card>
											</Col>
											<Col xs={6} sm={6} xl={3} className="mt-2">
												<Card className="shadow-none plan-card border">
													<Card.Header className="bg-secondary text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Corporate</h3>
															<div className="mb fs-13">$9 PER USER/Week</div>
															<p className="fs-12">billed weekly</p>
														</Card.Title>
													</Card.Header>
													<Card.Body className="text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>12 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><strong>10</strong>
																One-Click Apps</li>
															<li className="text-muted border-bottom"><strong>6</strong>
																Databases</li>
															<li className="text-muted border-bottom"><strong>Money</strong>
																BackGuarntee</li>
															<li className="text-muted border-bottom"><span
																	className="text-secondary fs-16 font-weight-bold">New! </span>
																<strong>24/7</strong> Support
															</li>
														</ul>
														<div className="text-center mt-5 px-5">
														<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-secondary'>Buy
																Now</Button>
														</div>
													</Card.Body>
												</Card>
											</Col>
											<Col xs={6} sm={6} xl={3} className="mt-2">
												<Card className="shadow-none">
													<Card.Header className="bg-danger text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Unlimited</h3>
															<div className="mb fs-13">$19 PER USER/Week</div>
															<p className="fs-12">billed weekly</p>
														</Card.Title>
													</Card.Header>
													<Card.Body className="text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>12 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><strong>10</strong>
																One-Click Apps</li>
															<li className="text-muted border-bottom"><span
																	className="text-danger fs-16 font-weight-bold">New! </span>
																<strong>6</strong> Databases
															</li>
															<li className="text-muted border-bottom"><strong>Money</strong>
																BackGuarntee</li>
															<li className="text-muted border-bottom"><strong>24/7</strong>
																Support</li>
														</ul>
														<div className="text-center mt-5 px-5">
														<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-danger'>Buy
																Now</Button>
														</div>
													</Card.Body>
												</Card>
											</Col>
										</Row>
										{/* <!-- End Row --> */}
									</Tab.Pane>
									<Tab.Pane eventKey="second" className="pb-0" id="month2">
										{/* <!-- Row --> */}
										<Row className="pt-7">
											<Col xs={6} sm={6} xl={3} className="mt-2">
												<Card className="shadow-none">
													<Card.Header className="bg-primary text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Team</h3>
															<div className="mb fs-13">$15 PER USER/MONTH</div>
															<p className="fs-12">billed Monthly</p>
														</Card.Title>
													</Card.Header>
													<Card.Body className="text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>20 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><span
																	className="text-primary fs-16 font-weight-bold">New! </span>
																<strong>16</strong> One-Click Apps
															</li>
															<li className="text-muted border-bottom"><strong>6</strong>
																Databases</li>
															<li className="text-muted border-bottom"><strong>Money</strong>
																BackGuarntee</li>
															<li className="text-muted border-bottom"><strong>24/7</strong>
																Support</li>
														</ul>
														<div className="text-center mt-5 px-5">
														<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-primary'>Buy
																Now</Button>
														</div>
													</Card.Body>
												</Card>
											</Col>
											<Col xs={6} sm={6} xl={3} className="mt-2">
												<Card className="shadow-none">
													<Card.Header className="bg-success text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Personal</h3>
															<div className="mb fs-13">$29 PER USER/MONTH</div>
															<p className="fs-12">billed Monthly</p>
														</Card.Title>
													</Card.Header>
													<Card.Body className="text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>5 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><strong>7</strong>
																One-Click Apps</li>
															<li className="text-muted border-bottom"><strong>6</strong>
																Databases</li>
															<li className="text-muted border-bottom"><span
																	className="text-success fs-16 font-weight-bold">New! </span>
																<strong>Money</strong> BackGuarntee
															</li>
															<li className="text-muted border-bottom"><strong>24/7</strong>
																Support</li>
														</ul>
														<div className="text-center mt-5 px-5">
														<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-success'>Buy
																Now</Button>
														</div>
													</Card.Body>
												</Card>
											</Col>
											<Col xs={6} sm={6} xl={3} className="mt-2">
												<Card className="shadow-none plan-card border">
													<Card.Header className=" bg-secondary text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Corporate</h3>
															<div className="mb fs-13">$49 PER USER/MONTH</div>
															<p className="fs-12">billed Monthly</p>
														</Card.Title>
													</Card.Header>
													<Card.Body className="text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>12 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><strong>10</strong>
																One-Click Apps</li>
															<li className="text-muted border-bottom"><strong>6</strong>
																Databases</li>
															<li className="text-muted border-bottom"><strong>Money</strong>
																BackGuarntee</li>
															<li className="text-muted border-bottom"><span
																	className="text-secondary fs-16 font-weight-bold">New! </span>
																<strong>24/7</strong> Support
															</li>
														</ul>
														<div className="text-center mt-5 px-5">
														<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-secondary'>Buy
																Now</Button>
														</div>
													</Card.Body>
												</Card>
											</Col>
											<Col xs={6} sm={6} xl={3} className="mt-2">
												<Card className="shadow-none">
													<Card.Header className="bg-danger text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Unlimited</h3>
															<div className="mb fs-13">$49 PER USER/MONTH</div>
															<p className="fs-12">billed monthly</p>
														</Card.Title>
													</Card.Header>
													<Card.Body className="text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>12 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><strong>10</strong>
																One-Click Apps</li>
															<li className="text-muted border-bottom"><span
																	className="text-danger fs-16 font-weight-bold">New! </span>
																<strong>6</strong> Databases
															</li>
															<li className="text-muted border-bottom"><strong>Money</strong>
																BackGuarntee</li>
															<li className="text-muted border-bottom"><strong>24/7</strong>
																Support</li>
														</ul>
														<div className="text-center mt-5 px-5">
														<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-danger'>Buy
																Now</Button>
																</div>
													</Card.Body>
												</Card>
											</Col>
										</Row>
									</Tab.Pane>
									<Tab.Pane eventKey="third" className="pb-0" id="year2">
										<Row className="pt-7">
											<div className= "col-xs-6 col-sm-6 col-xl-3 mt-2">
												<Card className="shadow-none">
													<Card.Header className="bg-primary text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Team</h3>
															<div className="mb fs-13">$159 PER USER/MONTH</div>
															<p className="fs-12">billed anually</p>
														</Card.Title>
													</Card.Header>
													<Card.Body className="text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>20 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><span
																	className="text-primary fs-16 font-weight-bold">New! </span>
																<strong>16</strong> One-Click Apps
															</li>
															<li className="text-muted border-bottom"><strong>6</strong>
																Databases</li>
															<li className="text-muted border-bottom"><strong>Money</strong>
																BackGuarntee</li>
															<li className="text-muted border-bottom"><strong>24/7</strong>
																Support</li>
														</ul>
														<div className="text-center mt-5 px-5">
														<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-primary'>Buy
																Now</Button>
														</div>
													</Card.Body>
												</Card>
											</div>
											<div className= "col-xs-6 col-sm-6 col-xl-3 mt-2">
												<Card className="shadow-none">
													<Card.Footer className="bg-success text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Personal</h3>
															<div className="mb fs-13">$129 PER USER/MONTH</div>
															<p className="fs-12">billed anually</p>
														</Card.Title>
													</Card.Footer>
													<Card.Body className="text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>5 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><strong>7</strong>
																One-Click Apps</li>
															<li className="text-muted border-bottom"><strong>6</strong>
																Databases</li>
															<li className="text-muted border-bottom"><span
																	className="text-success fs-16 font-weight-bold">New! </span>
																<strong>Money</strong> BackGuarntee
															</li>
															<li className="text-muted border-bottom"><strong>24/7</strong>
																Support</li>
														</ul>
														<div className="text-center mt-5 px-5">
														<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-success'>Buy
																Now</Button>
														</div>
													</Card.Body>
												</Card>
											</div>
											<div className= "col-xs-6 col-sm-6 col-xl-3 mt-2">
												<Card className="shadow-none plan-card border">
													<Card.Header className="bg-secondary text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Corporate</h3>
															<div className="mb fs-13">$149 PER USER/MONTH</div>
															<p className="fs-12">billed anually</p>
														</Card.Title>
													</Card.Header>
													<Card.Body className="text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>12 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><strong>10</strong>
																One-Click Apps</li>
															<li className="text-muted border-bottom"><strong>6</strong>
																Databases</li>
															<li className="text-muted border-bottom"><strong>Money</strong>
																BackGuarntee</li>
															<li className="text-muted border-bottom"><span
																	className="text-secondary fs-16 font-weight-bold">New! </span>
																<strong>24/7</strong> Support
															</li>
														</ul>
														<div className="text-center mt-5 px-5">
														<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-secondary'>Buy
																Now</Button>
														</div>
													</Card.Body>
												</Card>
											</div>
											<div className= "col-xs-6 col-sm-6 col-xl-3 mt-2">
												<Card className="shadow-none">
													<Card.Header className="bg-danger text-white align-items-center">
														<Card.Title className="mx-auto text-center">
															<h3 className=" font-weight-semibold mt-3 mb-2">Unlimited</h3>
															<div className="mb fs-13">$249 PER USER/MONTH</div>
															<p className="fs-12">billed anually</p>
														</Card.Title>
													</Card.Header>
													<Card.Body className="text-center px-0 pricing">
														<ul className="list-unstyled leading-loose">
															<li className="text-muted border-bottom"><strong>12 </strong>
																FreeDomain Name</li>
															<li className="text-muted border-bottom"><strong>10</strong>
																One-Click Apps</li>
															<li className="text-muted border-bottom"><span
																	className="text-danger fs-16 font-weight-bold">New! </span>
																<strong>6</strong> Databases
															</li>
															<li className="text-muted border-bottom"><strong>Money</strong>
																BackGuarntee</li>
															<li className="text-muted border-bottom"><strong>24/7</strong>
																Support</li>
														</ul>
														<div className="text-center mt-5 px-5">
														<Button href="#"
																className="btn btn-lg  d-grid" variant='outline-danger'>Buy
																Now</Button>
														</div>
													</Card.Body>
												</Card>
											</div>
										</Row>
									</Tab.Pane>	
								</Tab.Content>
								</Tab.Container>
							</div>
						</div>
					</Fragment>
);

export default Pricing03;
