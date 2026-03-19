import React, { FC, Fragment, } from 'react';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages';
import PageHeader from '../../../layout/Header/pageheader';
import { Card, Col, Dropdown, ListGroup, Nav, Row, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import users12 from '../../../assets/images/users/12.jpg';
import users2 from '../../../assets/images/users/2.jpg';
import users9 from '../../../assets/images/users/9.jpg';
import users4 from '../../../assets/images/users/4.jpg';
import Slider from "react-slick";
import VerticalMode from './Data/Timelinedata';
interface TimeLineProps { }

const TimeLine: FC<TimeLineProps> = () => {

	return (

		<Fragment>
			<PageHeader title="Timeline" />
			<Row className="row row-sm">
				<Col xl={8}>
					<Card>
						<div className="tabs-menu1">
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                  <Nav as="ul" className="flex-column ">
                    <Nav.Item as="li">
                      <Nav.Link eventKey="first">Post</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="second">Album</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="third">Videos</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Tab.Container>
              </div>
						<Card.Body className="card-body d-sm-flex border-top">
							<div className="me-4 mb-2"><img alt="" className="rounded-circle avatar avatar-md"
								src={ImagesData("users2")} /></div>
							<form className="w-100">
								<textarea className="form-control br-be-0 br-bs-0"
									placeholder="Share Your Thoughts!"></textarea>
								<div className=" border  border-top-0 p-4 br-5 br-ts-0 br-te-0">
									<Link to="#" className="me-1" title=""
										data-bs-toggle="tooltip" data-placement="top"
										data-original-title="Audio"><i
											className="fe fe-mic fs-16 p-2 brround bg-primary-transparent text-primary border-primary"></i></Link>
									<Link to="#" className="me-1" title=""
										data-bs-toggle="tooltip" data-placement="top"
										data-original-title="Video"><i
											className="fe fe-video fs-16 p-2 brround bg-warning-transparent text-warning border-warning"></i></Link>
									<Link to="#" className="me-1" title=""
										data-bs-toggle="tooltip" data-placement="top"
										data-original-title="Picture"><i
											className="fe fe-image fs-16 p-2 brround bg-info-transparent text-info border-info"></i></Link>
									<Link to="#" className="me-1" title=""
										data-bs-toggle="tooltip" data-placement="top"
										data-original-title="Picture"><i
											className="fe fe-share-2 fs-16 p-2 brround bg-success-transparent text-success border-success"></i></Link>
								</div>
							</form>
						</Card.Body>
					</Card>
					<Card className="card overflow-hidden">
						<Card.Body className="card-body pb-0">
							<div className="d-flex">
								<div className="media mt-0">
									<div className="media-user me-2">
										<div><img alt="" className="rounded-circle avatar avatar-md"
											src={ImagesData("users2")} /></div>
									</div>
									<div className="media-body">
										<h6 className="mb-0 mt-1 font-weight-bold">Patrenna</h6>
										<small className="text-primary">just now</small>
									</div>
								</div>
								<div className="ms-auto">
									<Dropdown className="dropdown">
										<Dropdown.Toggle as="a" className="pro-option no-caret"
											data-bs-toggle="dropdown"><i
												className="fe fe-more-vertical fs-20"></i></Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu dropdown-menu-start">
											<Dropdown.Item>Edit
												Post</Dropdown.Item>
											<Dropdown.Item>Delete
												Post</Dropdown.Item>
											<Dropdown.Item>Personal
												Settings</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
							</div>
							<div className="mt-4">
								<p className="mb-0">There are many variations of passages of Lorem Ipsum
									available,
									but the majority have suffered alteration in some form, by injected
									humour,
									or randomised words which don't look even slightly believable.</p>
							</div>
							<div className="media mg-t-15 profile-footer align-items-center">
								<div className="media-user mx-2 mt-1">
									<div className="avatar-list avatar-list-stacked">
										<img className="avatar brround"
											src={users12} />
										<img className="avatar brround"
											src={users2} />
										<img className="avatar brround"
											src={users9} />
										<img className="avatar brround"
											src={users2} />
										<img className="avatar brround"
											src={users4} />
										<span className="avatar brround">+28</span>
									</div>
								</div>
								<div className="media-body">
									<h6 className="mb-0 mt-3 ms-2">28 people like your photo</h6>
								</div>
								<div className="ms-auto">
									<Link className="me-2" to="#"><i
										className="fe fe-heart p-3 bg-danger-transparent text-danger border-danger brround fs-14"></i></Link>
									<Link className="me-2" to="#"><i
										className="fe fe-message-square p-3 bg-info-transparent text-info border-info brround fs-14"></i></Link>
									<Link className="me-2" to="#"><i
										className="fe fe-share-2 p-3 bg-success-transparent border-success text-success brround fs-14"></i></Link>
								</div>
							</div>
						</Card.Body>
					</Card>
					<Card className="card overflow-hidden">
						<Card.Body className="card-body pb-0">
							<div className="d-flex">
								<div className="media mt-0">
									<div className="media-user me-2">
										<div><img alt="" className="rounded-circle avatar avatar-md"
											src={ImagesData("users2")} /></div>
									</div>
									<div className="media-body">
										<h6 className="mb-0 mt-1 font-weight-bold">Patrenna</h6>
										<small className="text-muted">Sep 26 2019, 10:14am</small>
									</div>
								</div>
								<div className="ms-auto">
									<Dropdown className="dropdown">
										<Dropdown.Toggle as="a" className="pro-option no-caret"
											data-bs-toggle="dropdown"><i
												className="fe fe-more-vertical fs-20"></i></Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu-start">
											<Dropdown.Item>Edit
												Post</Dropdown.Item>
											<Dropdown.Item>Delete
												Post</Dropdown.Item>
											<Dropdown.Item>Personal
												Settings</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
							</div>
							<div className="mt-4">
								<p className="mb-0">There are many variations of passages of Lorem Ipsum
									available,
									but the majority have suffered alteration in some form, by injected
									humour,
									or randomised words which don't look even slightly believable.</p>
								<div className="d-md-flex">
									<img src={ImagesData("media2")} alt="img" className="w-40 m-1 br-5" />
									<img src={ImagesData("media3")} alt="img" className="w-40 m-1 br-5" />
								</div>
							</div>
							<div className="media mg-t-15 profile-footer align-items-center">
								<div className="media-user mx-2 mt-1">
									<div className="avatar-list avatar-list-stacked">
										<img className="avatar brround"
											src={users12} />
										<img className="avatar brround"
											src={users2} />
										<img className="avatar brround"
											src={users9} />
										<img className="avatar brround"
											src={users2} />
										<img className="avatar brround"
											src={users4} />
										<span className="avatar brround">+28</span>
									</div>
								</div>
								<div className="media-body">
									<h6 className="mb-0 mt-3 ms-2">28 people like your photo</h6>
								</div>
								<div className="ms-auto">
									<Link className="me-2" to="#"><i
										className="fe fe-heart p-3 bg-danger-transparent text-danger border-danger brround fs-14"></i></Link>
									<Link className="me-2" to="#"><i
										className="fe fe-message-square p-3 bg-info-transparent text-info border-info brround fs-14"></i></Link>
									<Link className="me-2" to="#"><i
										className="fe fe-share-2 p-3 bg-success-transparent border-success text-success brround fs-14"></i></Link>
								</div>
							</div>
						</Card.Body>
					</Card>
					<Card className="card overflow-hidden">
						<Card.Body className="card-body pb-0">
							<div className="d-flex">
								<div className="media mt-0">
									<div className="media-user me-2">
										<div><img alt="" className="rounded-circle avatar avatar-md"
											src={ImagesData("users2")} /></div>
									</div>
									<div className="media-body">
										<h6 className="mb-0 mt-1 font-weight-bold">Patrenna</h6>
										<small className="text-muted">Sep 24 2019, 09:14am</small>
									</div>
								</div>
								<div className="ms-auto">
									<Dropdown className="dropdown">
										<Dropdown.Toggle as="a" className="pro-option no-caret"
											data-bs-toggle="dropdown"><i
												className="fe fe-more-vertical fs-20"></i></Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu-start">
											<Dropdown.Item>Edit
												Post</Dropdown.Item>
											<Dropdown.Item>Delete
												Post</Dropdown.Item>
											<Dropdown.Item>Personal
												Settings</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
							</div>
							<div className="mt-4">
								<p className="mb-0">There are many variations of passages of Lorem Ipsum
									available,
									but the majority have suffered alteration in some form, by injected
									humour,
									or randomised words which don't look even slightly believable.</p>
								<div className="d-md-flex">
									<img src={ImagesData("media4")} alt="img" className="w-30 m-1 br-5" />
									<img src={ImagesData("media5")} alt="img" className="w-30 m-1 br-5" />
									<img src={ImagesData("media6")} alt="img" className="w-30 m-1 br-5" />
								</div>
							</div>
							<div className="media mg-t-15 profile-footer align-items-center">
								<div className="media-user mx-2 mt-1">
									<div className="avatar-list avatar-list-stacked">
										<img className="avatar brround"
											src={users12} />
										<img className="avatar brround"
											src={users2} />
										<img className="avatar brround"
											src={users9} />
										<img className="avatar brround"
											src={users2} />
										<img className="avatar brround"
											src={users4} />
										<span className="avatar brround">+28</span>
									</div>
								</div>
								<div className="media-body">
									<h6 className="mb-0 mt-3 ms-2">28 people like your photo</h6>
								</div>
								<div className="ms-auto">
									<Link className="me-2" to="#"><i
										className="fe fe-heart p-3 bg-danger-transparent text-danger border-danger brround fs-14"></i></Link>
									<Link className="me-2" to="#"><i
										className="fe fe-message-square p-3 bg-info-transparent text-info border-info brround fs-14"></i></Link>
									<Link className="me-2" to="#"><i
										className="fe fe-share-2 p-3 bg-success-transparent border-success text-success brround fs-14"></i></Link>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4}>
					<Card className="mg-b-20 card--events">
						<Card.Header>
							<Card.Title>
								Trending Posts
							</Card.Title>
						</Card.Header>
						<Card.Body className="p-0">
							<VerticalMode />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
};

export default TimeLine;


