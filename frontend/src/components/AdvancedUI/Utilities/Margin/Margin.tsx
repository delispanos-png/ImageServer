import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row, Table } from 'react-bootstrap';

interface MarginProps {}

const Margin: FC<MarginProps> = () => (
 					 <Fragment>
						<PageHeader  title="Margins" />
						<Row>
							<Col lg={12}>
								<Card>
									<Card.Header>
										<Card.Title>Margin Positions</Card.Title>
									</Card.Header>
									<Card.Body>
										<div className="d-flex">
											<div className="w-9 h-9 bg-light">
												<div
													className="d-flex align-items-center justify-content-center h-100 bg-light">

												</div>
											</div>
											<div className="w-9 h-9 bg-light ms-4">
												<div
													className="d-flex align-items-center justify-content-center h-100 bg-light">
													.ms-4
												</div>
											</div>
											<div className="w-9 h-9 bg-light ms-7">
												<div
													className="d-flex align-items-center justify-content-center h-100 bg-light">
													.ms-7
												</div>
											</div>
										</div>
										<div className="mt-3 table-responsive">
											<Table className="table table-bordered border-top text-nowrap mt-4 mb-0">
												<thead>
													<tr>
														<th className="wd-30p">className</th>
														<th className="wd-70p">Description</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td><code className="pd-0">className="m-1"</code></td>
														<td>Add Margin all sides to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="ms-1"</code></td>
														<td>Add Margin left side to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="me-1"</code></td>
														<td>Add Margin right side to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="mt-1"</code></td>
														<td>Add Margin top side to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="mb-1"</code></td>
														<td>Add Margin bottom side to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="mx-1"</code></td>
														<td>Add Margin horizonatl sides to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="my-1"</code></td>
														<td>Add Margin vertical sides to element.</td>
													</tr>
												</tbody>
											</Table>
										</div>
									</Card.Body>
								</Card>
								<Card>
									<Card.Header>
										<Card.Title>Margin values</Card.Title>
									</Card.Header>
									<Card.Body>
										<div className="mt-3 table-responsive">
											<Table className="table table-bordered border-top text-nowrap mb-0 mg-t-10">
												<thead>
													<tr>
														<th className="wd-30p">className</th>
														<th className="wd-70p">Description</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td><code className="pd-0">className="m-1"</code></td>
														<td>Add margin m-1 to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="m-2"</code></td>
														<td>Add margin m-2 to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="m-3"</code></td>
														<td>Add margin m-3 to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="m-4"</code></td>
														<td>Add margin m-4 to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="m-5"</code></td>
														<td>Add margin m-5 to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="m-6"</code></td>
														<td>Add margin m-6 to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="m-7"</code></td>
														<td>Add margin m-7 to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="m-8"</code></td>
														<td>Add margin m-8 to element.</td>
													</tr>
												</tbody>
											</Table>
										</div>
									</Card.Body>
								</Card>
								<Card>
									<Card.Header>
										<Card.Title>Remove Margin</Card.Title>
									</Card.Header>
									<Card.Body>
										<div className="mt-3 table-responsive">
											<Table className="table table-bordered border-top text-nowrap mb-0 mg-t-10">
												<thead>
													<tr>
														<th className="wd-30p">className</th>
														<th className="wd-70p">Description</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td><code className="pd-0">className="m-0"</code></td>
														<td>Remove margin all sides to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="ms-0"</code></td>
														<td>Remove margin left side to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="me-0"</code></td>
														<td>Remove margin right side to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="mt-0"</code></td>
														<td>Remove margin top side to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="mb-0"</code></td>
														<td>Remove margin bottom side to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="mx-0"</code></td>
														<td>Remove margin horizonatl sides to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="my-0"</code></td>
														<td>Remove margin vertical sides to element.</td>
													</tr>
												</tbody>
											</Table>
										</div>
									</Card.Body>
								</Card>
								<Card>
									<Card.Header>
										<Card.Title>Media Query margins</Card.Title>
									</Card.Header>
									<Card.Body>
										<div className="mt-3 table-responsive">
											<Table className="table table-bordered border-top text-nowrap mg-t-0 mb-0">
												<thead>
													<tr>
														<th className="wd-30p">className</th>
														<th className="wd-70p">Value</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>
															<code className="pd-0 bg-light mb-1">.mt-[size]-[value]</code>
															<code className="pd-0 bg-light mb-1">.mb-[size]-[value]</code>
															<code className="pd-0 bg-light mb-1">.me-[size]-[value]</code>
															<code className="pd-0 bg-light mb-1">.ms-[size]-[value]</code>
															</td>
														<td>
															<p className="mg-b-5">size: xs | sm | md | lg | xl | xxl</p>
															<p className="mg-b-0">value: the padding value (refer to code
																above)
															</p>
														</td>
													</tr>
												</tbody>
											</Table>
										</div>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Fragment>
);

export default Margin;
