import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { data } from '../Profile02/Data/profile02Data';
interface Profile02Props { }

const Profile02: FC<Profile02Props> = () => (
	<Fragment>
		<PageHeader title="Profile 2" />
		<div className="main-proifle border">
			<Row>
				<Col lg={12} xl={7}>
					<div className="box-widget widget-user">
						<div className="widget-user-image1 d-xl-flex d-block">
							<img alt="User Avatar" className="avatar brround p-0"
								src={ImagesData("users2")} />
							<div className="mt-1 ms-xl-5">
								<h4 className="pro-user-username mb-3 font-weight-bold">Patrenna <i
									className="fa fa-check-circle text-success"></i></h4>
								<ul className="mb-0 pro-details">
									<li><span className="profile-icon bg-danger-transparent text-danger"><i
										className="fe fe-globe"></i></span><span
											className="h6 mt-3">https://demo.com</span></li>
									<li><span
										className="profile-icon bg-success-transparent text-success"><i
											className="fe fe-mail"></i></span><span
												className="h6 mt-3">jessica@gmail.com</span></li>
									<li><span className="profile-icon bg-info-transparent text-info"><i
										className="fe fe-flag"></i></span><span
											className="h6 mt-3">English,
											German</span></li>
									<li><span
										className="profile-icon bg-warning-transparent text-warning"><i
											className="fe fe-phone-call"></i></span><span
												className="h6 mt-3">+345 657 567</span></li>
								</ul>
							</div>
						</div>
					</div>
				</Col>
				<Col lg={12} xl={5} className="col-md-auto">
					<div className="text-xl-right text-end btn-list mt-4 mt-lg-0">
						<Link to="#" className="btn btn-outline-primary">Message</Link>
						<Link to={`${import.meta.env.BASE_URL}pages/editProfile`} className="btn btn-primary">Edit Profile</Link>
					</div>
					<div className="mt-5">
						<div className="main-profile-contact-list row">
							<div className="media col-sm-4 mb-3">
								<div className="media-icon bg-primary-transparent text-primary me-3 mt-1">
									<i className="fa fa-comments fs-18"></i>
								</div>
								<div className="media-body">
									<small className="text-muted">Posts</small>
									<div className="font-weight-bold number-font">
										245
									</div>
								</div>
							</div>
							<div className="media col-sm-4 mb-3">
								<div className="media-icon bg-primary-transparent text-primary me-3 mt-1">
									<i className="fa fa-users fs-18"></i>
								</div>
								<div className="media-body">
									<small className="text-muted">Followers</small>
									<div className="font-weight-normal1">
										689k
									</div>
								</div>
							</div>
							<div className="media col-sm-4 mb-3">
								<div className="media-icon bg-primary-transparent text-primary me-3 mt-1">
									<i className="fa fa-feed fs-18"></i>
								</div>
								<div className="media-body">
									<small className="text-muted">Following</small>
									<div className="font-weight-bold number-font">
										3,765
									</div>
								</div>
							</div>
						</div>
					</div>
				</Col>
			</Row>

			<div className="profile-cover">
				<div className="wideget-user-tab">
					<div className="tab-menu-heading p-0">
						<div className="tabs-menu1">
							<Tab.Container id="left-tabs-example" defaultActiveKey="first">
								<Nav as="ul">
									<Nav.Item as="li"><Nav.Link eventKey="first" className="fs-14">About</Nav.Link>
									</Nav.Item>
									<Nav.Item as="li"><Nav.Link eventKey="second" className="fs-14">friends</Nav.Link></Nav.Item>
									<Nav.Item as="li" ><Nav.Link eventKey="third" className="fs-14">Timeline</Nav.Link>
									</Nav.Item>
								</Nav>


								<Tab.Content className='border p-3 br-dark'>
									<Tab.Pane eventKey="first">
											<Card.Header>
												<Card.Title className=''>Biography</Card.Title>
											</Card.Header>
											<Card.Body>
												<div className="main-profile-bio mb-0">
													<p>simply dummy text of the printing and typesetting industry.
														Lorem
														Ipsum has been the industry's standard dummy when an unknown
														printer took a galley of type and scrambled it to make a
														type
														specimen book. It has survived not only five centuries
														nchanged.
													</p>
													<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco
														laboris nisi ut aliquip ex ea commodo consequat. Duis aute
														irure
														dolor in reprehrighterit in voluptate velit esse cillum
														dolore
														eu fugiat nulla pariatur. </p>
													<p className="mb-0">pleasure rationally encounter but because pursue
														consequences that are extremely painful.occur in which toil
														and
														pain can procure him some great pleasure.. <Link
															to="#">More</Link>
													</p>
												</div>
											</Card.Body>
											<Card.Header>
												<Card.Title>Work & Education</Card.Title>
											</Card.Header>
											<Card.Body>
												<div className="main-profile-contact-list d-lg-flex">
													<div className="media me-5">
														<div
															className="media-icon bg-primary-transparent text-primary me-4">
															<i className="fa fa-whatsapp"></i>
														</div>
														<div className="media-body">
															<h6 className="font-weight-bold mb-1">Web Designer at <Link
																to="#" className="btn-link">Spruko</Link></h6>
															<span>2018 - present</span>
															<p>Past Work: Spruko, Inc.</p>
														</div>
													</div>
													<div className="media me-5">
														<div
															className="media-icon bg-success-transparent text-success me-4">
															<i className="fa fa-briefcase"></i>
														</div>
														<div className="media-body">
															<h6 className="font-weight-bold mb-1">Studied at <Link to="#"
																className="btn-link">University</Link></h6>
															<span>2004-2008</span>
															<p>Graduation: Bachelor of Science in Computer Science
															</p>
														</div>
													</div>
												</div>
											</Card.Body>
											<div className="card-header ">
												<h3 className="card-title">Skills</h3>
											</div>
											<div className="card-body">
												<Button className="btn  btn-sm mt-1 me-1" variant='light'
													href="#">HTML5</Button>
												<Button className="btn  btn-sm mt-1 me-1" variant='light'
													href="#">CSS</Button>
												<Button className="btn  btn-sm mt-1 me-1" variant='light'
													href="#">Java script</Button>
												<Button className="btn  btn-sm mt-1 me-1" variant='light'
													href="#">Photo Shop</Button>
												<Button className="btn  btn-sm mt-1 me-1" variant='light'
													href="#">Word Press</Button>
												<Button className="btn  btn-sm mt-1 me-1" variant='light'
													href="#">Php</Button>
												<Button className="btn  btn-sm mt-1 me-1" variant='light'
													href="#">Sass</Button>
												<Button className="btn  btn-sm mt-1 me-1" variant='light'
													href="#">Angular</Button>
											</div>
											<Card.Header>
												<Card.Title>Contact</Card.Title>
											</Card.Header>
											<Card.Body>
												<div className="main-profile-contact-list d-lg-flex">
													<div className="media me-4">
														<div
															className="media-icon bg-danger-transparent text-danger me-3 mt-1">
															<i className="fa fa-phone"></i>
														</div>
														<div className="media-body">
															<small className="text-muted">Mobile</small>
															<div className="font-weight-normal1">
																+245 354 654
															</div>
														</div>
													</div>
													<div className="media me-4">
														<div
															className="media-icon bg-warning-transparent text-warning me-3 mt-1">
															<i className="fa fa-slack"></i>
														</div>
														<div className="media-body">
															<small className="text-muted">Stack</small>
															<div className="font-weight-normal1">
																@spruko.com
															</div>
														</div>
													</div>
													<div className="media">
														<div
															className="media-icon bg-info-transparent text-info me-3 mt-1">
															<i className="fa fa-map"></i>
														</div>
														<div className="media-body">
															<small className="text-muted">Current Address</small>
															<div className="font-weight-normal1">
																San Francisco, USA
															</div>
														</div>
													</div>
												</div>
												{/* <!-- main-profile-contact-list --> */}
											</Card.Body>
									
									</Tab.Pane>


									<Tab.Pane eventKey="second" id="tab-8">
										<Card className="p-3 border-0">
											<Row>
												{data.map((friend) => (
													<Col lg={6} key={Math.random()}>
														<div className="d-flex align-items-center border p-3 mb-3 br-7">
															<img className="avatar avatar-lg brround d-block cover-image"
																src={friend.src1} />

															<div className="wrapper ms-3">
																<p className="mb-0 mt-1  font-weight-semibold">{friend.heading}
																</p>
																<small className="text-muted">Project Manager</small>
															</div>
															<div className="float-end ms-auto">
																<Button href="#"
																	className="btn-md" variant='primary'>View</Button>
															</div>
														</div>
													</Col>
												))}
												<Col md={12}>
													<Link className="btn d-block btn-light" to="#"> See All <i
														className="fe fe-chevron-down ms-1"></i></Link>
												</Col>
											</Row>
										</Card>
									</Tab.Pane>
									
									<Tab.Pane eventKey="third" className="tab-pane" id="tab-9">
									<Card>
										<ul className="timelineleft pb-3">
											<li className="timeleft-label"><span className="bg-cyan">10 May. 2021</span>
											</li>
											<li>
												<i className="fa fa-camera bg-orange"></i>
												<div className="timelineleft-item">
													<span className="time"><i className="fa fa-clock-o text-danger"></i> 2
														days
														ago</span>
													<h3 className="timelineleft-header"><Link
														to="#">Mina
														Lee</Link> uploaded new photos</h3>
													<div className="timelineleft-body">
														<img src={ImagesData("media5")} alt="..." className="margin mt-2 mb-2 me-1" />
														<img src={ImagesData("media7")} alt="..." className="margin mt-2 mb-2 me-1" />
													</div>
												</div>
											</li>
											<li>
												<i className="fa fa-envelope bg-primary"></i>
												<div className="timelineleft-item">
													<span className="time"><i className="fa fa-clock-o text-danger"></i>
														12:05</span>
													<h3 className="timelineleft-header"><Link
														to="#">Support Team</Link> <span>sent
															you
															an email</span></h3>
													<div className="timelineleft-body">
														Etsy doostang zoodles disqus groupon greplin oooj voxy
														zoodles,
														weebly ning heekya handango imeem plugg dopplr jibjab,
														movity
														jajah plickers sifteo edmodo ifttt zimbra. Babblely odeo
														kaboodle
														quora plaxo ideeli hulu weebly balihoo...
													</div>
													<div className="timelineleft-footer">
														<Button className="text-white btn-sm me-2" variant='success'>Read more</Button>
														<Button className="text-white btn-sm me-2" variant='danger'>Delete</Button>
													</div>
												</div>
											</li>
											<li>
												<i className="fa fa-user bg-secondary"></i>
												<div className="timelineleft-item">
													<span className="time"><i className="fa fa-clock-o text-danger"></i> 5
														mins
														ago</span>
													<h3 className="timelineleft-header no-border">
														<Link to="#">Sarah Young</Link> accepted your friright request</h3>
												</div>
											</li>
											<li>
												<i className="fa fa-comments bg-warning"></i>
												<div className="timelineleft-item">
													<span className="time"><i className="fa fa-clock-o text-danger"></i> 27
														mins
														ago</span>
													<h3 className="timelineleft-header"><Link to="#">Jay	White</Link> commented on your post</h3>
													<div className="timelineleft-body">
														Take me to your leader!
														Switzerland is small and neutral!
														We are more like Germany, ambitious and misunderstood!
													</div>
													<div className="timelineleft-footer">
														<Button className="text-white btn-flat btn-sm" variant='info'>View
															comment</Button>
													</div>
												</div>
											</li>
											<li className="timeleft-label">
												<span className="bg-purple"> 3 Jan. 2014</span>
											</li>
											<li>
												<i className="fa fa-camera bg-orange"></i>
												<div className="timelineleft-item">
													<span className="time"><i className="fa fa-clock-o text-danger"></i> 2
														days
														ago</span>
													<h3 className="timelineleft-header"><Link
														to="#">Mina
														Lee</Link> uploaded new photos</h3>
													<div className="timelineleft-body">
														<img src={ImagesData("media1")} alt="..." className="margin mt-2 mb-2 me-1" />
														<img src={ImagesData("media2")} alt="..." className="margin mt-2 mb-2 me-1" />
														<img src={ImagesData("media3")} alt="..." className="margin mt-2 mb-2 me-1" />
														<img src={ImagesData("media4")} alt="..." className="margin mt-2 mb-2 me-1" />
													</div>
												</div>
											</li>
											<li>
												<i className="fa fa-clock-o bg-success pb-3"></i>
											</li>
											</ul>
											</Card>
										

									</Tab.Pane>
									
								</Tab.Content>
							</Tab.Container>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Fragment>

);

export default Profile02;
