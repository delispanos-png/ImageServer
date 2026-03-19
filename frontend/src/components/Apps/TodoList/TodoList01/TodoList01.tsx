import React, { FC, Fragment, useEffect, useState } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Form, Dropdown, ListGroup, Pagination, Row, Table, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { todolists, listsdata } from '../../../../components/Apps/TodoList/TodoList01/Data/Todolist01Data';
interface TodoList01Props { }

const TodoList01: FC<TodoList01Props> = () => {
	//for User search function

	const [data, setdata] = useState(listsdata)
	useEffect(() => {
	}, [listsdata])


	//Delete function
	function handleRemove(id) {
		const RemoveData = data.filter((listdata) => listdata.id !== id);
		setdata(RemoveData);

	}
	//search
	const [allData, setAllData] = React.useState(listsdata)

	let allElement2: any = [];

	let myfunction = (InputData) => {
		let allElement: any
		for (allElement of listsdata) {
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
			<PageHeader title="Todo list" />
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
					<Card>
						<Card.Body className="p-6">
							<div className="inbox-body">
								<Row>
									<Col>
                                        <Form.Group className="w-auto">
											<div className="input-icon">
												<span className="input-icon-addon">
													<i className="fe fe-search"></i>
												</span>
												<Form.Control type="text" onChange={(ele) => { myfunction(ele.target.value) }} className="" placeholder="Search Files"/>
											</div>
										</Form.Group>
									</Col>
									<Dropdown className="col col-auto mb-4">
										<Dropdown.Toggle as="a" data-bs-toggle="dropdown" href="#" className='btn btn-light no-caret'
											aria-expanded="false">
											Sort By
											<i className="fa fa-angle-down "></i>
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu-end">
											<Dropdown.Item><Link to="#">Assending Order</Link></Dropdown.Item>
											<Dropdown.Item><Link to="#">Descending Order</Link></Dropdown.Item>
											<Dropdown.Item className="divider"></Dropdown.Item>
											<Dropdown.Item><Link to="#">Settings</Link></Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</Row>
								<div className="table-responsive">
									<Table className="table-inbox table-hover text-nowrap mb-0">
										<tbody>
											{allData.map((listdata) => (
												<tr className="mt-2 mb-2" key={Math.random()}>

													<td className="inbox-small-cells w-7">
														<Form.Check type="checkbox" id="default-checkbox" />

													</td>
													<td className="inbox-small-cells w-4"><i className={`fa fa-${listdata.icon}`}></i>
													</td>
													<td className="view-message dont-show font-weight-semibold"><img
														className="avatat avatar-sm brround me-2"
														src={listdata.src1}
														alt="img" />{listdata.heading}</td>
													<td className="view-message">{listdata.class}</td>
													<td className="view-message"><span
														className={`badge bg-${listdata.color} br-7 p-2`}>
														{listdata.class1}</span></td>
													<td onClick={() => { handleRemove(listdata.id) }} className=" text-center font-weight-semibold">
														<i className={`fe fe-${listdata.main}-2 fs-20 text-danger me-7`}></i>
													</td>

												</tr>
											))}
										</tbody>
									</Table>

								</div>
							</div>
						</Card.Body>
					</Card>
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
	)
};

export default TodoList01;
