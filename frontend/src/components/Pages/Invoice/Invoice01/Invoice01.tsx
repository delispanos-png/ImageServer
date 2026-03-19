import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';

interface Invoice01Props { }

const Invoice01: FC<Invoice01Props> = () => (
	<Fragment>
		<PageHeader title="Invoice 1" />
		<Row>
			<Col md={12}>
				<Card className="overflow-hidden">
					<Card.Body>
						<h2 className="font-weight-bold text-primary">INVOICE</h2>
						<div>
							<h5 className="mb-1">Hi <strong>Patrenna Schell</strong>,</h5>
							This is the receipt for a payment of <strong>$450.00</strong> (USD) for your
							works
						</div>

						<Card.Body className="ps-0 pe-0">
							<Row>
								<Col sm={6}>
									<span>Payment No.</span><br />
									<strong>INV23456-234</strong>
								</Col>
								<Col sm={6} className="text-end">
									<span>Payment Date</span><br />
									<strong>July 10, 2021 - 12:20 pm</strong>
								</Col>
							</Row>
						</Card.Body>
						<div className="dropdown-divider"></div>
						<Row className="pt-4">
							<Col lg={6}>
								<p className="h5 font-weight-bold">Bill From</p>
								<address>
									Street Address<br />
									State, City<br />
									Region, Postal Code<br />
									ltd@example.com
								</address>
							</Col>
							<Col lg={6} className="text-end">
								<div className='demo'>
									<p className="h5 font-weight-bold">Bill To</p>
									<address>
										Street Address<br />
										State, City<br />
										Region, Postal Code<br />
										ctr@example.com
									</address>
								</div>
							</Col>
						</Row>

						<div className="table-responsive push">
							<Table striped bordered hover className="table table-bordered border text-nowrap mb-0" >
								<tbody>
									<tr className=" ">
										<th className="text-center " style={{ width: "1%" }}></th>
										<th>Product</th>
										<th className="text-center" style={{ width: "1%" }}>Qnty</th>
										<th className="text-end" style={{ width: "1%" }}>Unit Price</th>
										<th className="text-end" style={{ width: "1%" }}>Amount</th>
									</tr>
									<tr>
										<td className="text-center">1</td>
										<td>
											<p className="font-weight-semibold mb-1">Logo Creation</p>
											<div className="text-muted">Logo and business cards design</div>
										</td>
										<td className="text-center">2</td>
										<td className="text-end">$60.00</td>
										<td className="text-end">$120.00</td>
									</tr>
									<tr>
										<td className="text-center">2</td>
										<td>
											<p className="font-weight-semibold mb-1">Online Store Design &amp;
												Development</p>
											<div className="text-muted">Design/Development for all popular
												modern
												browsers</div>
										</td>
										<td className="text-center">3</td>
										<td className="text-end">$80.00</td>
										<td className="text-end">$240.00</td>
									</tr>
									<tr>
										<td className="text-center">3</td>
										<td>
											<p className="font-weight-semibold mb-1">App Design</p>
											<div className="text-muted">Promotional mobile application</div>
										</td>
										<td className="text-center">1</td>
										<td className="text-end">$40.00</td>
										<td className="text-end">$40.00</td>
									</tr>
									<tr>
										<td colSpan={4} className="font-weight-semibold text-end">Subtotal</td>
										<td className="text-end">$400.00</td>
									</tr>
									<tr>
										<td colSpan={4} className="font-weight-semibold text-end">Vat Rate</td>
										<td className="text-end">20%</td>
									</tr>
									<tr>
										<td colSpan={4} className="font-weight-semibold text-end">Vat Due</td>
										<td className="text-end">$50.00</td>
									</tr>
									<tr className="text-danger">
										<td colSpan={4}
											className="font-weight-bold text-danger text-uppercase text-end h4 mb-0">Total
											Due
										</td>
										<td className="font-weight-bold text-danger text-end h4 mb-0">$450.00</td>
									</tr>
									<tr>
										<td colSpan={5} className="text-end ">
											<Button type="button" className="btn me-2" variant='primary'
												onClick={() => { window.print() }}><i
													className="si si-wallet"></i> Pay Invoice</Button>
											<Button type="button" className="btn me-2" variant='success'
												onClick={() => { window.print() }}><i
													className="si si-paper-plane"></i> Send Invoice</Button>
											<Button type="button" className="btn me-2" variant='secondary'
												onClick={() => { window.print() }}><i
													className="si si-printer"></i> Print Invoice</Button>
										</td>
									</tr>
								</tbody>
							</Table>
						</div>
						<p className="text-muted text-center mt-3">Thank you very much for doing business with
							us. We
							look forward to working with you again!</p>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	</Fragment>
);

export default Invoice01;
