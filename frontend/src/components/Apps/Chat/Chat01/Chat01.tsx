import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages';
import { Card, Col, Dropdown, OverlayTrigger, Row, Tooltip, Tab, ListGroup, Nav, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../../layout/Header/pageheader';
import PerfectScrollbar from "react-perfect-scrollbar";
interface Chat01Props { }

const Chat01: FC<Chat01Props> = () => {
	return (
		<Fragment>
			<PageHeader title="Chat" />
			<Row>
				<Col md={12}>
					<Card className="overflow-hidden">

						<div className="tile tile-alt mb-0" id="messages-main">
							<div className="ms-menu tab-menu-heading border-top-0 pt-0">
								
									<div className='tabs-menu1'>
										<Tab.Container id="left-tabs-example"  defaultActiveKey="first">
											<Nav as='ul' className='' >
												<Nav.Item as='li' className='d-block' id="chats-data">
													<Nav.Link eventKey="first">Chat</Nav.Link>
												</Nav.Item>
												<Nav.Item as='li' className='d-block' id="chats-data">
													<Nav.Link eventKey="second">Contacts</Nav.Link>
												</Nav.Item>
											</Nav>
										
							
									<Tab.Content >
										<Tab.Pane eventKey="first">
											<ul className="list-group lg-alt chat-conatct-list ps ps--active-y	" id="ChatList">
												<li className="list-group-item media p-4 mt-0 border-0">
													<div className="float-start pe-2">
														<img src={ImagesData("users5")} alt=""
															className="avatar avatar-md brround" />
													</div>
													<div className="media-body">
														<div
															className="list-group-item-heading text-default font-weight-semibold">
															Davil Parnell<span
																className="dot-label bg-danger ms-2 w-2 h-2"></span>
														</div>
														<small
															className="list-group-item-text text-muted">Fierent
															fastidii recteque ad pro</small>
													</div>
													<span className="chat-time text-muted">2 mins</span>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
													<div className="float-start pe-2">
														<img src={ImagesData("users2")} alt=""
															className="avatar avatar-md brround" />
													</div>
													<div className="media-body">
														<div
															className="list-group-item-heading text-default font-weight-semibold">
															Ann Watkinson<span
																className="dot-label bg-success ms-2 w-2 h-2"></span>
														</div>
														<small className="list-group-item-text text-muted">Cum
															sociis natoque penatibus </small>
													</div>
													<span className="chat-time text-muted">10 mins</span>

												</li>
												<li className="list-group-item media p-4 border-top mt-0">
														<div className="float-start pe-2">
															<img src={ImagesData("users7")} alt=""
																className="avatar avatar-md brround" />
														</div>
														<div className="media-body">
															<div
																className="list-group-item-heading text-default font-weight-semibold">
																Marse Walter<span
																	className="dot-label bg-success ms-2 w-2 h-2"></span>
															</div>
															<small
																className="list-group-item-text text-muted">Susprightisse
																sapien ligula</small>
														</div>
														<span className="chat-time text-muted">15 mins</span>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
														<div className="lv-avatar float-start pe-2">
															<img src={ImagesData("users3")} alt=""
																className="avatar avatar-md brround" />
														</div>
														<div className="media-body">
															<div
																className="list-group-item-heading text-default font-weight-semibold">
																Jeremy Robbins<span
																	className="dot-label bg-danger ms-2 w-2 h-2"></span>
															</div>
															<small
																className="list-group-item-text text-muted">Phasellus
																porttitor tellus nec</small>
														</div>
														<span className="chat-time text-muted">30 mins</span>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
														<div className="lv-avatar float-start pe-2">
															<img src={ImagesData("users9")} alt=""
																className="avatar avatar-md brround" />
														</div>
														<div className="media-body">
															<div
																className="list-group-item-heading text-default font-weight-semibold">
																Reginald Horace<span
																	className="dot-label bg-danger ms-2 w-2 h-2"></span>
															</div>
															<small
																className="list-group-item-text text-muted">Quisque
																consequat arcu eget</small>
														</div>
														<span className="chat-time text-muted">50 min</span>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
														<div className="float-start pe-2">
															<img src={ImagesData("users6")} alt=""
																className="avatar avatar-md brround" />
														</div>
														<div className="media-body">
															<div
																className="list-group-item-heading text-default font-weight-semibold">
																Shark Henry<span
																	className="dot-label bg-success ms-2 w-2 h-2"></span>
															</div>
															<small className="list-group-item-text text-muted">Nam
																lobortis odio et leo maximu</small>
														</div>
														<span className="chat-time text-muted">1 day</span>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
														<div className="float-start pe-2">
															<img src={ImagesData("users7")} alt=""
																className="avatar avatar-md brround" />
														</div>
														<div className="media-body">
															<div
																className="list-group-item-heading text-default font-weight-semibold">
																Paul Van Dack<span
																	className="dot-label bg-danger ms-2 w-2 h-2"></span>
															</div>
															<small className="list-group-item-text text-muted">Nam
																posuere purus sed velit auctor sodales</small>
														</div>
														<span className="chat-time text-muted">2 days</span>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
														<div className="lv-avatar float-start pe-2">
															<img src={ImagesData("users5")} alt=""
																className="avatar avatar-md brround" />
														</div>
														<div className="media-body">
															<div
																className="list-group-item-heading text-default font-weight-semibold">
																James Anderson<span
																	className="dot-label bg-success ms-2 w-2 h-2"></span>
															</div>
															<small
																className="list-group-item-text text-muted">Vivamus
																imperdietsag</small>
														</div>
														<span className="chat-time text-muted">2 days</span>
												</li>
											</ul>
										</Tab.Pane>
										<Tab.Pane eventKey="second">
											<ul className="list-group lg-alt chat-conatct-list" id='ChatList2'>
												<li className="list-group-item media p-4 border-0 mt-0">
													<div className="float-start pe-2">
														<img src={ImagesData("users5")} alt=""
															className="avatar avatar-md brround" />
													</div>
													<div className="media-body">
														<div
															className="list-group-item-heading text-default font-weight-semibold">
															Davil Parnell</div>
														<small
															className="list-group-item-text text-muted">davilparnell@gmail.com</small>
													</div>
														<Dropdown className="ms-auto">
														<Dropdown.Toggle as="a" data-bs-toggle="dropdown" className="option-dots no-caret" variant=''>
															<i className="fe fe-more-vertical fs-14"></i>
														</Dropdown.Toggle>
														<Dropdown.Menu className="dropdown-menu dropdown-menu-start">
															<li>
																<Dropdown.Item><i className="fe fe-phone-call me-1"></i>
																	Call</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-video me-1"></i>
																	Videocall</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-mail me-1"></i> New
																	Message</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-settings me-1"></i>
																	Settings</Dropdown.Item>
															</li>
														</Dropdown.Menu>
													</Dropdown>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
													<div className="float-start pe-2">
														<img src={ImagesData("users5")} alt=""
															className="avatar avatar-md brround" />
													</div>
													<div className="media-body">
														<div
															className="list-group-item-heading text-default font-weight-semibold">
															Ann Watkinson</div>
														<small
															className="list-group-item-text text-muted">annwatkinso@gmail.com</small>
													</div>
														<Dropdown className="ms-auto">
														<Dropdown.Toggle as="a" data-bs-toggle="dropdown" className="option-dots no-caret" variant=''>
															<i className="fe fe-more-vertical fs-14"></i>
														</Dropdown.Toggle>
														<Dropdown.Menu className="dropdown-menu dropdown-menu-start">
															<li>
																<Dropdown.Item><i className="fe fe-phone-call me-1"></i>
																	Call</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-video me-1"></i>
																	Videocall</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-mail me-1"></i> New
																	Message</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-settings me-1"></i>
																	Settings</Dropdown.Item>
															</li>
														</Dropdown.Menu>
													</Dropdown>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
													<div className="float-start pe-2">
														<img src={ImagesData("users7")} alt=""
															className="avatar avatar-md brround" />
													</div>
													<div className="media-body">
														<div
															className="list-group-item-heading text-default font-weight-semibold">
															Marse Walter</div>
														<small
															className="list-group-item-text text-muted">marsewalter@gmail.com</small>
													</div>
													<Dropdown className="ms-auto">
														<Dropdown.Toggle as="a" data-bs-toggle="dropdown" className="option-dots no-caret">
															<i className="fe fe-more-vertical fs-14"></i>
														</Dropdown.Toggle>
														<Dropdown.Menu className="dropdown-menu dropdown-menu-start">
															<li>
																<Dropdown.Item><i className="fe fe-phone-call me-1"></i>
																	Call</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-video me-1"></i>
																	Videocall</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-mail me-1"></i> New
																	Message</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-settings me-1"></i>
																	Settings</Dropdown.Item>
															</li>
														</Dropdown.Menu>
													</Dropdown>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
													<div className="lv-avatar float-start pe-2">
														<img src={ImagesData("users3")} alt=""
															className="avatar avatar-md brround" />
													</div>
													<div className="media-body">
														<div
															className="list-group-item-heading text-default font-weight-semibold">
															Jeremy Robbins</div>
														<small
															className="list-group-item-text text-muted">jeremyrobbins@gmail.com</small>
													</div>
													<Dropdown className="ms-auto">
														<Dropdown.Toggle as="a" data-bs-toggle="dropdown" className="option-dots no-caret">
															<i className="fe fe-more-vertical fs-14"></i>
														</Dropdown.Toggle>
														<Dropdown.Menu className="dropdown-menu dropdown-menu-start">
															<li>
																<Dropdown.Item><i className="fe fe-phone-call me-1"></i>
																	Call</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-video me-1"></i>
																	Videocall</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-mail me-1"></i> New
																	Message</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-settings me-1"></i>
																	Settings</Dropdown.Item>
															</li>
														</Dropdown.Menu>
													</Dropdown>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
													<div className="lv-avatar float-start pe-2">
														<img src={ImagesData("users9")} alt=""
															className="avatar avatar-md brround" />
													</div>
													<div className="media-body">
														<div
															className="list-group-item-heading text-default font-weight-semibold">
															Reginald Horace</div>
														<small
															className="list-group-item-text text-muted">reginaldhorace@gmail.com</small>
													</div>
													<Dropdown className="ms-auto">
														<Dropdown.Toggle as="a" data-bs-toggle="dropdown" className="option-dots no-caret">
															<i className="fe fe-more-vertical fs-14"></i>
														</Dropdown.Toggle>
														<Dropdown.Menu className="dropdown-menu dropdown-menu-start">
															<li>
																<Dropdown.Item><i className="fe fe-phone-call me-1"></i>
																	Call</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-video me-1"></i>
																	Videocall</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-mail me-1"></i> New
																	Message</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-settings me-1"></i>
																	Settings</Dropdown.Item>
															</li>
														</Dropdown.Menu>
													</Dropdown>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
													<div className="float-start pe-2">
														<img src={ImagesData("users6")} alt=""
															className="avatar avatar-md brround" />
													</div>
													<div className="media-body">
														<div
															className="list-group-item-heading text-default font-weight-semibold">
															Shark Henry</div>
														<small
															className="list-group-item-text text-muted">sharkhenry@gmail.com</small>
													</div>
													<Dropdown className="ms-auto">
														<Dropdown.Toggle as="a" data-bs-toggle="dropdown" className="option-dots no-caret">
															<i className="fe fe-more-vertical fs-14"></i>
														</Dropdown.Toggle>
														<Dropdown.Menu className="dropdown-menu dropdown-menu-start">
															<li>
																<Dropdown.Item><i className="fe fe-phone-call me-1"></i>
																	Call</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-video me-1"></i>
																	Videocall</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-mail me-1"></i> New
																	Message</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-settings me-1"></i>
																	Settings</Dropdown.Item>
															</li>
														</Dropdown.Menu>
													</Dropdown>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
													<div className="float-start pe-2">
														<img src={ImagesData("users7")} alt=""
															className="avatar avatar-md brround" />
													</div>
													<div className="media-body">
														<div
															className="list-group-item-heading text-default font-weight-semibold">
															Paul Van Dack</div>
														<small
															className="list-group-item-text text-muted">paulvandack@gmail.com</small>
													</div>
													<Dropdown className="ms-auto">
														<Dropdown.Toggle as="a" data-bs-toggle="dropdown" className="option-dots no-caret">
															<i className="fe fe-more-vertical fs-14"></i>
														</Dropdown.Toggle>
														<Dropdown.Menu className="dropdown-menu dropdown-menu-start">
															<li>
																<Dropdown.Item><i className="fe fe-phone-call me-1"></i>
																	Call</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-video me-1"></i>
																	Videocall</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-mail me-1"></i> New
																	Message</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-settings me-1"></i>
																	Settings</Dropdown.Item>
															</li>
														</Dropdown.Menu>
													</Dropdown>
												</li>
												<li className="list-group-item media p-4 border-top mt-0">
													<div className="lv-avatar float-start pe-2">
														<img src={ImagesData("users5")} alt=""
															className="avatar avatar-md brround" />
													</div>
													<div className="media-body">
														<div
															className="list-group-item-heading text-default font-weight-semibold">
															James Anderson</div>
														<small
															className="list-group-item-text text-muted">jamesanderson@gmail.com</small>
													</div>
													<Dropdown className="ms-auto">
														<Dropdown.Toggle as="a" data-bs-toggle="dropdown" className="option-dots no-caret">
															<i className="fe fe-more-vertical fs-14"></i>
														</Dropdown.Toggle>
														<Dropdown.Menu className="dropdown-menu dropdown-menu-start">
															<li>
																<Dropdown.Item><i className="fe fe-phone-call me-1"></i>
																	Call</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-video me-1"></i>
																	Videocall</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-mail me-1"></i> New
																	Message</Dropdown.Item>
															</li>
															<li>
																<Dropdown.Item><i className="fe fe-settings me-1"></i>
																	Settings</Dropdown.Item>
															</li>
														</Dropdown.Menu>
													</Dropdown>
												</li>
											</ul>
										</Tab.Pane>
									</Tab.Content>
									</Tab.Container>
									</div>
							</div>
							<div className="ms-body">
								<div className="action-header clearfix">
									<div className="float-start hidden-xs d-flex ms-0 chat-user">
										<img src={ImagesData("users2")} alt=""
											className="avatar avatar-lg brround me-2" />
										<div className="align-items-center mt-1">
											<p className="font-weight-bold mb-0 fs-16">Patrenna</p>
											<span><span
												className="dot-label bg-success me-2 w-2 h-2"></span>online</span>

										</div>
									</div>

									<ul className="ah-actions actions align-items-center">
										<li>
											<Link className="br-7 my-1 me-2" data-bs-toggle="tooltip" to="#">
												<OverlayTrigger
													placement="top"
													delay={{ show: 250, hide: 400 }}
													overlay={
														<Tooltip className="primary">Call</Tooltip>
													}
												>
													<i className="fe fe-phone text-muted"></i>
												</OverlayTrigger>
											</Link>

										</li>
										<li>
											<Link className="br-7 my-1 me-2" data-bs-toggle="tooltip" data-bs-original-title="Archive" to="#">
												<OverlayTrigger
													placement="top"
													delay={{ show: 250, hide: 400 }}
													overlay={
														<Tooltip className="primary">Archive</Tooltip>
													}
												>
													<i className="fe fe-folder-plus text-muted"></i>
												</OverlayTrigger>
											</Link>
										</li>
										<li>
											<Link className="br-7 my-1 me-2" data-bs-toggle="tooltip" data-bs-original-title="Delete" to="#">
												<OverlayTrigger
													placement="top"
													delay={{ show: 250, hide: 400 }}
													overlay={
														<Tooltip className="primary">Delete</Tooltip>
													}
												>
													<i className="fe fe-trash-2 text-muted"></i>
												</OverlayTrigger>
											</Link>
										</li>
										<li>
											<Link className="br-7 me-2" data-bs-toggle="tooltip" data-bs-original-title="View Info" to="#">
												<OverlayTrigger
													placement="top"
													delay={{ show: 250, hide: 400 }}
													overlay={
														<Tooltip className="primary">View Info</Tooltip>
													}
												><i
													className="fe fe-alert-octagon text-muted"></i>
												</OverlayTrigger>
											</Link>
										</li>
										<Dropdown as="li">
														<Dropdown.Toggle as="a" className="br-7 no-caret"
															>
															<i className="fe fe-more-vertical"></i>
														</Dropdown.Toggle>
														<Dropdown.Menu as="ul" className=" dropdown-menu-end">
															<Dropdown.Item as="li">
																Refresh
															</Dropdown.Item>
															<Dropdown.Item as="li">
															Message Settings
															</Dropdown.Item>
														</Dropdown.Menu>
													</Dropdown>
									</ul>
								</div>
								<PerfectScrollbar>

									<div className="chat-body-style" id="ChatBody">
										<div className="message-feed media mt-0">
											<div className="float-startpe-2">
												<img src={ImagesData("users2")} alt=""
													className="avatar avatar-md brround" />
											</div>

											<div className="media-body">
												<div className="mf-content">
													Quisque consequat arcu eget odio cursus, ut tempor arcu
													vestibulum. Etiam ex arcu, porta a urna non, lacinia
													pellentesque orci. Proin semper sagittis erat, eget
													condimentum
													sapien viverra et.
												</div>
												<small className="mf-date"><i className="fa fa-clock-o"></i> 20/05/2021
													at
													09:00</small>
											</div>
										</div>
										<div className="message-feed right">
											<div className="float-end ps-2">
												<img src={ImagesData("users10")} alt=""
													className="avatar avatar-md brround" />
											</div>
											<div className="media-body">
												<div className="mf-content">
													Etiam nec facilisis lacus. Nulla imperdiet augue ullamcorper
													dui
													ullamcorper, eu laoreet sem consectetur. Aenean et ligula
													risus.
													Praesent sed posuere sem. Cum sociis natoque penatibus et
													magnis
													dis parturient montes,
													<div className="row mt-2">
													</div>
												</div>
												<small className="mf-date"><i className="fa fa-clock-o"></i> 20/05/2021
													at
													10:10</small>
											</div>
										</div>
										<div className="message-feed media">
											<div className="float-startpe-2">
												<img src={ImagesData("users2")} alt=""
													className="avatar avatar-md brround" />
											</div>
											<div className="media-body">
												<div className="mf-content">
													Etiam ex arcumentum
												</div>
												<small className="mf-date"><i className="fa fa-clock-o"></i> 20/05/2021
													at
													09:33</small>
											</div>
										</div>
										<div className="message-feed right">
											<div className="float-end ps-2">
												<img src={ImagesData("users10")} alt=""
													className="avatar avatar-md brround" />
											</div>
											<div className="media-body">
												<div className="mf-content">
													Etiam nec facilisis lacus. Nulla imperdiet augue ullamcorper
													dui
													ullamcorper, eu laoreet sem consectetur. Aenean et ligula
													risus.
													Praesent sed posuere sem. Cum sociis natoque penatibus et
													magnis
													dis parturient montes,
												</div>
												<small className="mf-date"><i className="fa fa-clock-o"></i> 20/05/2021
													at
													10:10</small>
											</div>
										</div>
										<div className="message-feed media">
											<div className="float-startpe-2">
												<img src={ImagesData("users2")} alt=""
													className="avatar avatar-md brround" />
											</div>
											<div className="media-body">
												<div className="mf-content">
													Cum sociis natoque penatibus et magnis dis parturient
													montes,
													nascetur ridiculus mus. Etiam ac tortor ut elit sodales
													varius.
													Mauris id ipsum id mauris malesuada tincidunt. Vestibulum
													elit
													massa, pulvinar at sapien sed, luctus vestibulum eros.
												</div>
												<small className="mf-date"><i className="fa fa-clock-o"></i> 20/05/2021
													at
													10:24</small>
											</div>
										</div>
									</div>
								</PerfectScrollbar>
								<div className="msb-reply">
									<Form.Control as="textarea" placeholder="What's on your mind..."></Form.Control>
									<Button className="btn br-7 px-3" variant=''><i
										className="fa fa-paper-plane-o text-muted"></i></Button>

								</div>
							</div>
						</div>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
}
export default Chat01;
