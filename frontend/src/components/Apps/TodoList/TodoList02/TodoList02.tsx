import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Dropdown, ListGroup, Pagination, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { todolists, listsdata } from '../../../../components/Apps/TodoList/TodoList02/Data/Todolist02Data';

interface TodoList02Props { }

const TodoList02: FC<TodoList02Props> = () => (

	<Fragment>

		<PageHeader title="Todo List 2" />
		<Row>
			<Col md={12} xl={3} lg={4}>
				<Card>
					<ListGroup className="list-group-transparent mb-0 mail-inbox pb-3">
						<div className="mt-4 mb-4 ms-4 me-4 text-center">
							<Button href="#" className="d-grid" variant='primary'>Add New
								Task</Button>
						</div>
						{todolists.map((todolist) => (
							<ListGroup.Item key={Math.random()}
								className="list-group-item-action d-flex align-items-center">
								<i
									className={`fe fe-${todolist.icon}  me-4 p-2 border-${todolist.color1} ${todolist.main} bg-${todolist.color1}-transparent text-primary`}></i>
								{todolist.heading}<span className={`ms-auto badge bg-${todolist.color}`}>{todolist.class}</span>
							</ListGroup.Item>
						))}
					</ListGroup>
				</Card>
			</Col>
			<Col md={12} lg={8} xl={9}>
				<Row className="todo-list2">
					{listsdata.map((listdata) => (
						<Col xl={4} lg={6} key={Math.random()}>
							<Card>
								<Card.Body className="p-0">
									<div className="todo-widget-header d-flex pb-2 p-4">
										<label className="custom-control custom-checkbox mb-0">
											<input type="checkbox" className="custom-control-input"
												name="example-checkbox2" value="option2" />
											<span className="custom-control-label"></span>
										</label>
										<Dropdown className="ms-auto">
											<Dropdown.Toggle as="a" className="option-dots no-caret" data-bs-toggle="dropdown"><i
												className="fe fe-more-vertical"></i></Dropdown.Toggle>
											<Dropdown.Menu className="dropdown-menu-start">
												<Dropdown.Item href="#">Assigned
													to</Dropdown.Item>
												<Dropdown.Item href="#">Mark As
													Unread</Dropdown.Item>
												<Dropdown.Item href="#">Mark As
													Important</Dropdown.Item>
												<Dropdown.Item href="#">Add to
													Tasks</Dropdown.Item>
												<Dropdown.Item href="#">Add
													Star</Dropdown.Item>
												<Dropdown.Item href="#">Move
													to</Dropdown.Item>
												<Dropdown.Item href="#">Mute</Dropdown.Item>
												<Dropdown.Item href="#">Move to
													Trash</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</div>
									<div className="px-4 pb-4">
										<Link to="#">
											<div className="font-weight-bold d-flex">
												<img className="avatat avatar-md brround me-3"
													src={listdata.src1} alt="img" />
												<div className="mt-1">
													<h6 className="font-weight-semibold mb-0">{listdata.heading}
													</h6>
													<small>Angular Developer</small>
												</div>
											</div>
										</Link>
									</div>
									<div className="p-4 border-top">
										<span
											className={`rounded-pill bg-${listdata.color} text-white float-end`}>{listdata.main}</span>
										<small className="text-muted">10.54am</small>
										<h6 className="mb-0  mt-2 fs-13">{listdata.class}</h6>
									</div>
									<div className="p-4 border-top">
										<small className="text-muted">10.54am</small>
										<h6 className="mb-0  mt-2 fs-13">{listdata.class1}
										</h6>
									</div>
								</Card.Body>
								<Card.Footer>
									<Button variant="primary" href="#" className='mb-2 mt-1'
										title="Assign Task">Assign</Button>
									<Button className="ms-auto float-end border-secondary mb-2 mt-1" variant='outline-secondary'
										href="#" data-placement="top"
										data-bs-toggle="tooltip" title=""
										data-original-title="View Task">View All</Button>
								</Card.Footer>
							</Card>
						</Col>
					))}
				</Row>
				<div className="pagination mb-4 float-end">
					<Pagination>
						<Pagination.Item disabled>Prev</Pagination.Item>
						<Pagination.Item className="active">
							{1}
						</Pagination.Item>
						<Pagination.Item>{2}</Pagination.Item>
						<Pagination.Item>{3}</Pagination.Item>
						<Pagination.Item>{4}</Pagination.Item>
						<Pagination.Item>{5}</Pagination.Item>
						<Pagination.Next>Next</Pagination.Next>
					</Pagination>
				</div>
			</Col>
		</Row>
	</Fragment>
);

export default TodoList02;
