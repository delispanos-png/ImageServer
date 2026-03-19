import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface AddInvoiceProps {}

const AddInvoice: FC<AddInvoiceProps> = () => (
  <Fragment>
						<PageHeader title="Add Invoice" />
						<Row>
							<Col md={12}>
								<Card>
									<Card.Header>
										<Card.Title>Add Invoice</Card.Title>
									</Card.Header>
									<Card.Body>
										<Row>
											<Col className="col-12">
												<Form.Group className="form-group row">
													<Col md={5} mb={2}>
														<Form.Label className="form-label">Invoice Title</Form.Label>
														<Form.Control className="form-control" placeholder="Invoice title"
															defaultValue=""/>
													</Col>
													<Col md={5} mb={2}>
														<Form.Label className="form-label">Payment Number</Form.Label>
														<Form.Control className="form-control" placeholder="Payment Number"
															defaultValue=""/>
													</Col>
													<Col md={2}>
														<Form.Label className="form-label mt-2">Payment Date</Form.Label>
														<Form.Control className="form-control" type="number" defaultValue=""
															placeholder="dd-mm-yy"/>
													</Col>
												</Form.Group>
												<Form.Group className="form-group row">
													<Col md={6}>
														<Form.Label className="form-label">Bill To</Form.Label>
														<Form.Control placeholder='Bill To' as='textarea' rows={4} className="mb-3" />

													</Col>
													<Col md={6} mb={2}>
														<Form.Label className="form-label">Subject</Form.Label>
                    <Form.Control placeholder='Subject of Invoice' as='textarea' rows={4} className="mb-3" />
                  </Col>
												</Form.Group>
											</Col>
										</Row>
										<div className="table-responsive">
											<Table className="table nowrap text-nowrap border mt-5">
												<thead>
													<tr>
														<th>PRODUCT</th>
														<th className="w-40">DESCRIPTION</th>
														<th>QNTY</th>
														<th>UNIT PRICE</th>
														<th>AMOUNT</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td><Form.Control className="form-control mt-1" placeholder="" type="text"
																defaultValue=""/>
														</td>
														<td><Form.Control as='textarea' rows={1} className="mt-1" /></td>
														<td><Form.Control className="form-control mt-1" placeholder="" type="text"
																defaultValue=""/>
														</td>
														<td><Form.Control className="form-control mt-1" placeholder="" type="text"
																defaultValue=""/>
														</td>
														<td><Form.Control className="form-control mt-1" placeholder="" type="text"
																defaultValue=""/>
														</td>
													</tr>
												</tbody>
												<tfoot>
													<tr>
														<td><Link className="btn btn-light" to="#"><i
																	className="fe fe-plus"></i> Add Product</Link></td>
														<td></td>
														<td></td>
														<td></td>
														<td></td>
													</tr>
												</tfoot>
											</Table>
										</div>
										<Form.Group className="form-group row">
											<Col md={12}>
												<Form.Label className="form-label">Vat Rate</Form.Label>
												<Form.Control className="form-control" placeholder="Vat Rate" type="text" defaultValue=""/>
											</Col>
										</Form.Group>
									</Card.Body>
									<Card.Footer>
										<Row>
											<Col>
												<Button className="btn me-2" variant='success' href="#"><i
														className="fe fe-plus"></i> Add New Invoice</Button>
												<Button className="btn me-2" variant='info' href="#">Cancel</Button>
											</Col>
										</Row>
									</Card.Footer>
								</Card>
							</Col>
						</Row>
					</Fragment>
);

export default AddInvoice;
