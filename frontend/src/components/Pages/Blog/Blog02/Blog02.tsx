import React, { FC, Fragment } from 'react';
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../../layout/Header/pageheader';
import { blogs2 } from '../Blog02/Data/Blog2Data';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
interface Blog02Props { }

const Blog02: FC<Blog02Props> = () => (
	<Fragment>

		<PageHeader title="Blog2" />
		<Row>
			{blogs2.map((blog2) => (
				<Col xl={4} lg={6} md={12} key={Math.random()}>
					<Card className="overflow-hidden">
						<Card.Body className="pe-2">
							<div className="d-flex align-items-center mt-auto">
								<img className="avatar brround avatar-md me-3"
									src={ImagesData('users16')} />
								<div>
									<Link to={`${import.meta.env.BASE_URL}Pages/profile/profile01`} className="font-weight-semibold">Anna Ogden</Link>
									<small className="d-block text-muted">2 days ago</small>
								</div>
								<Dropdown className="ms-auto text-muted dropdown">
									<Dropdown.Toggle as="a" className="option-dots me-2 bg-light border-light text-primary no-caret"
										data-bs-toggle="dropdown"><i
											className="fe fe-chevron-down text-icon"></i></Dropdown.Toggle>
									<Dropdown.Menu className="dropdown-menu dropdown-menu-start">
										<Dropdown.Item href="#">Assigned to</Dropdown.Item>
										<Dropdown.Item href="#">Mark As
											Unread</Dropdown.Item>
										<Dropdown.Item href="#">Mark As
											Important</Dropdown.Item>
										<Dropdown.Item href="#">Add Star</Dropdown.Item>
										<Dropdown.Item href="#">Move to</Dropdown.Item>
										<Dropdown.Item href="#">Mute</Dropdown.Item>
										<Dropdown.Item href="#">Move to
											Trash</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</Card.Body>
						<div className="item7-card-img px-4">
							<Link to="#"></Link>
							<img src={blog2.src2} alt="img" className="cover-image br-7" />
						</div>
						<Card.Body>
							<div className="item7-card-desc d-flex mb-5">
								<Link to="#" className="d-flex"><i
									className="fe fe-calendar fs-16 me-1 text-secondary mt-0"></i>
									<div className="ms-1 text-muted font-weight-semibold">Jan-18-2021</div>
								</Link>
								<div className="ms-auto">
									<Link className="me-0 d-flex" to="#"><i
										className="fe fe-message-square fs-16 me-1 text-warning"></i>
										<div className="ms-1 text-muted font-weight-semibold">12 Comments</div>
									</Link>
								</div>
							</div>
							<Link to="#" className="mt-4">
								<h5 className="font-weight-semibold text-primary">Excepteur occaecat cupidatat
								</h5>
							</Link>
							<p>Lorem ipsum dolor quis exercitationem into enim ad minima nostrum
								itationem </p>
							<div className="d-sm-flex pt-3 mt-0 border-top align-items-center">
								<div className="media-user me-2 my-1">
									<div className="avatar-list avatar-list-stacked my-1">
										<img className="avatar brround my-auto"
											src={ImagesData('users12')} />
										<img className="avatar brround my-auto"
											src={ImagesData('users2')} />
										<img className="avatar brround my-auto"
											src={ImagesData('users9')} />
										<img className="avatar brround my-auto"
											src={ImagesData('users2')} />
									</div>
								</div>
								<div className="ms-auto text-muted my-1">
									<Link to="#" className="new "><i
										className="p-2 text-danger brround bg-danger-transparent border-danger fe fe-heart  fs-16 text-icon"></i></Link>
									<Link to="#" className="new ms-3"><i
										className="p-2 text-success brround bg-success-transparent border-success fe fe-thumbs-up  fs-16 text-icon"></i></Link>
									<Link to="#" className="new ms-3"><i
										className="p-2 text-secondary brround bg-secondary-transparent border-secondary fe fe-share-2  fs-16 text-icon"></i></Link>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
	</Fragment>
);

export default Blog02;
