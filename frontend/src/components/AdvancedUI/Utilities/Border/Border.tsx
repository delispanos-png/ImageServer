import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row, Table} from 'react-bootstrap';

interface BorderProps {}

const Border: FC<BorderProps> = () => (
  <Fragment>
						<PageHeader  title="Borders"/>
						<Row>
							<Col lg={12}>
								<Card>
									<Card.Header>
										<Card.Title>Set Border</Card.Title>
									</Card.Header>
									<Card.Body>
										<div className="d-flex flex-wrap">
											<div className="w-9 h-9 border m-2 bg-light2"></div>
											<div className="w-9 h-9 border-start m-2 bg-light2"></div>
											<div className="w-9 h-9 border-end m-2 bg-light2"></div>
											<div className="w-9 h-9 border-bottom m-2 bg-light2"></div>
											<div className="w-9 h-9 border-top m-2 bg-light2"></div>
											<div className="w-9 h-9 border-top-bottom m-2 bg-light2"></div>
											<div className="w-9 h-9 border-start-right m-2 bg-light2"></div>
										</div>
										<div className="table-responsive mt-5">
											<Table className="table table-bordered border-top text-nowrap mg-b-0 mg-t-10">
												<thead>
													<tr>
														<th className="wd-30p">className</th>
														<th className="wd-70p">Description</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td><code className="pd-0">className="border"</code></td>
														<td>Add border in all sides of an element using default color
															and
															width.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-start"</code></td>
														<td>Add border to left side of element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-end"</code></td>
														<td>Add border to right side of element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-bottom"</code></td>
														<td>Add border to bottom side of element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-top"</code></td>
														<td>Add border to top side of element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-top-bottom"</code></td>
														<td>Add border to top and bottom side of element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-start-right"</code></td>
														<td>Add border to left and right side of element.</td>
													</tr>
												</tbody>
											</Table>
										</div>
									</Card.Body>
								</Card>
								<Card>
									<Card.Header>
										<Card.Title>Border Width</Card.Title>
									</Card.Header>
									<Card.Body>
										<div className="d-flex flex-wrap">
											<div className="w-9 h-9 border m-2 bg-light2 border-wd-1"></div>
											<div className="w-9 h-9 border m-2 bg-light2 border-wd-2"></div>
											<div className="w-9 h-9 border m-2 bg-light2 border-wd-3"></div>
											<div className="w-9 h-9 border m-2 bg-light2 border-wd-4"></div>
											<div className="w-9 h-9 border m-2 bg-light2 border-wd-5"></div>
										</div>
										<div className="table-responsive mt-5">
											<Table className="table table-bordered border-top text-nowrap mg-b-0 mg-t-10">
												<thead>
													<tr>
														<th className="wd-30p">className</th>
														<th className="wd-70p">Description</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td><code className="pd-0">className="border-wd-1"</code></td>
														<td>Set 1px border to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-wd-2"</code></td>
														<td>Set 2px border to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-wd-3"</code></td>
														<td>Set 3px border to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-wd-4"</code></td>
														<td>Set 4px border to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-wd-5"</code></td>
														<td>Set 5px border to element.</td>
													</tr>
												</tbody>
											</Table>
										</div>
									</Card.Body>
								</Card>
								<Card>
									<Card.Header>
										<Card.Title>Border Color</Card.Title>
									</Card.Header>
									<Card.Body>
										<div className="d-flex flex-wrap">
											<div className="w-9 h-9 border m-2 bg-light2 border-primary border-wd-2"></div>
											<div className="w-9 h-9 border m-2 bg-light2 border-secondary border-wd-2">
											</div>
											<div className="w-9 h-9 border m-2 bg-light2 border-info border-wd-2"></div>
											<div className="w-9 h-9 border m-2 bg-light2 border-success border-wd-2"></div>
											<div className="w-9 h-9 border m-2 bg-light2 border-warning border-wd-2"></div>
											<div className="w-9 h-9 border m-2 bg-light2 border-danger border-wd-2"></div>
											<div className="w-9 h-9 border m-2 bg-light2 border-light border-wd-2"></div>
											<div
												className="w-9 h-9 border m-2 bg-light2 border-dark border-wd-2`																							                      ">
											</div>
										</div>
										<div className="table-responsive mt-5">
											<Table className="table table-bordered border-top text-nowrap mg-b-0 mg-t-10">
												<thead>
													<tr>
														<th className="wd-30p">className</th>
														<th className="wd-70p">Description</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td><code className="pd-0">className="border-primary"</code></td>
														<td>Set Border Color primary to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-secondary"</code></td>
														<td>Set Border Color secondary to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-info"</code></td>
														<td>Set Border Color info to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-success"</code></td>
														<td>Set Border Color success to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-warning"</code></td>
														<td>Set Border Color warning to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-danger"</code></td>
														<td>Set Border Color danger to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-light"</code></td>
														<td>Set Border Color light to element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-dark"</code></td>
														<td>Set Border Color dark to element.</td>
													</tr>
												</tbody>
											</Table>
										</div>
									</Card.Body>
								</Card>
								<Card>
									<Card.Header>
										<Card.Title>Remove Border</Card.Title>
									</Card.Header>
									<Card.Body>
										<div className="d-flex flex-wrap">
											<div className="w-9 h-9 border-0 m-2 bg-light2"></div>
											<div className="w-9 h-9 border border-start-0 m-2 bg-light2"></div>
											<div className="w-9 h-9 border border-end-0 m-2 bg-light2"></div>
											<div className="w-9 h-9 border border-bottom-0 m-2 bg-light2"></div>
											<div className="w-9 h-9 border border-top-0 m-2 bg-light2"></div>
											<div className="w-9 h-9 border border-top-bottom-0 m-2 bg-light2"></div>
											<div className="w-9 h-9 border border-start-right-0 m-2 bg-light2"></div>
										</div>
										<div className="table-responsive mt-5">
											<Table className="table table-bordered border-top text-nowrap mg-b-0 mg-t-10">
												<thead>
													<tr>
														<th className="wd-30p">className</th>
														<th className="wd-70p">Description</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td><code className="pd-0">className="border-0"</code></td>
														<td>Remove border in all sides of an element using default color
															and
															width.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-start-0"</code></td>
														<td>Remove border to left side of element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-end-0"</code></td>
														<td>Remove border to right side of element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-bottom-0"</code></td>
														<td>Remove border to bottom side of element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-top-0"</code></td>
														<td>Remove border to top side of element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-top-bottom-0"</code></td>
														<td>Remove border to top and bottom side of element.</td>
													</tr>
													<tr>
														<td><code className="pd-0">className="border-start-right-0"</code></td>
														<td>Remove border to left and right side of element.</td>
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

export default Border;
