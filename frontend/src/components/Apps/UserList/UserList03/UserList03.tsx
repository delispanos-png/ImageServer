import React, { FC, useState, useEffect, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Dropdown, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import { userslist } from '../../../../components/Apps/UserList/UserList03/Data/UsersData03';
interface UserList03Props { }

const UserList03: FC<UserList03Props> = () => {
	//search
	const [allData, setAllData] = React.useState(userslist)

	let allElement2: any = [];

	let myfunction = (InputData) => {
		let allElement: any
		for (allElement of userslist) {
			if (allElement.heading[0] == " ") {
				allElement.heading = allElement.title.trim()
			}
			if (allElement.heading.toLowerCase().includes(InputData.toLowerCase())) {
				if (allElement.heading.toLowerCase().startsWith(InputData.toLowerCase())) {
					allElement2.push(allElement);
				}
			}

		}
		setAllData(allElement2);
	};

	return (

		<Fragment>
			<PageHeader titles="UserList 03" />
			<Row className="flex-lg-nowrap">
				<Col className="col-12">
					<Row className="flex-lg-nowrap">
						<div className="col-12 mb-3">
							<div className="e-panel card">
								<Card.Body className="pb-2">
									<Row className="">
										<Col className="col-md-7 ">
										<div className="form-group w-100">
											<div className="input-icon">
												<span className="input-icon-addon">
													<i className="fe fe-search"></i>
												</span>
												<Form.Control type="text" onChange={(ele) => { myfunction(ele.target.value) }} className="" placeholder="Search Files"/>
											</div>
										</div>
											
										</Col>
										<div className="col-md-5 col-auto text-end mb-2">
											<a href="#" className="btn btn-primary"><i
												className="fe fe-plus"></i> Add New User</a>
										</div>
									</Row>
									<div className="row">
										{allData.map((userlist) => (
											<div className="col-xl-3 col-md-6" key={Math.random()}>
												<div className="card border p-0 shadow-none">
													<div className="d-flex align-items-center p-4">
														<img className="avatar avatar-lg brround d-block cover-image"
															src={userlist.src1} />

														<div className="wrapper ms-3">
															<p className="mb-0 mt-1  font-weight-semibold">{userlist.heading}</p>
															<small className="text-muted">{userlist.class}</small>
														</div>
														<Dropdown className="float-end ms-auto">
															<Dropdown.Toggle as="a" className="option-dots no-caret"
																data-bs-toggle="dropdown" aria-haspopup="true"
																aria-expanded="false"><i
																	className="fe fe-more-vertical"></i></Dropdown.Toggle>
															<Dropdown.Menu className="dropdown-menu dropdown-menu-start">
																<Dropdown.Item><i
																	className="fe fe-edit me-2"></i> View
																	Profile</Dropdown.Item>
																<Dropdown.Item><i
																	className="fe fe-trash me-2"></i> Edit</Dropdown.Item>
																<Dropdown.Item><i
																	className="fe fe-edit me-2"></i> Message</Dropdown.Item>
																<Dropdown.Item><i
																	className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
															</Dropdown.Menu>
														</Dropdown>
													</div>
													<Card.Body className="border-top">
														<p className="mb-5">Duis aute irure dolor in reprehrighterit
															in
															voluptate velit esse cillum dolore eu fugiat nulla
															pariatur</p>
														<ul className="mb-0 user-details">
															<li className="mb-3">
																<i className="fe fe-mail p-2 bg-warning-transparent text-warning border-warning brround me-3"></i><span
																	className="h6">collinbridg@gmail.com</span></li>
															<li><i className="fe fe-phone-call p-2 bg-success-transparent text-success border-success brround me-3"></i><span
																className="h6">+345 657 567</span></li>
														</ul>
													</Card.Body>
												</div>
											</div>
										))}
									</div>
								</Card.Body>
							</div>
						</div>
					</Row>
				</Col>
			</Row>
		</Fragment>
	)
};

export default UserList03;


