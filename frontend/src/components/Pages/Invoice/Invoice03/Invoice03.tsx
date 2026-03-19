import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { invoices3 } from '../Invoice03/Data/invoice3Data';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
interface Invoice03Props { }

const Invoice03: FC<Invoice03Props> = () => (
	<Fragment>
		<PageHeader title="Invoice 3" />
		<Row>
			<Col lg={12}>
				<Card>
					<Card.Body>
						<Row className=" m-0">
							<Col lg={4} className="p-md-0">
								<div className="border p-0 invoicelist" id="invoicelist">
									<Card.Body className="p-0">
										<div className="tab-menu-heading sub-panel-heading p-0 border-0">
											<div className="tabs-menu">
												{invoices3.map((invoice3) => (
													<ul className="nav panel-tabs border-0" key={Math.random()}>
														<li className="active">
															<Link className="d-flex" data-bs-toggle="tab"
																to="#tab41" aria-expanded="true">
																<img src={ImagesData("pngs2")}
																	alt="img" className="w-7 h-7 me-4" />
																<div className="mt-1">
																	<h5 className="mb-1 font-weight-bold mt-0">
																		{invoice3.heading}</h5>
																	<p className="mb-0 text-muted">{invoice3.class}</p>
																</div>
															</Link>
														</li>
														<li>
															<Link className="d-flex" data-bs-toggle="tab"
																to="#tab42" aria-expanded="false">
																<img src={ImagesData("pngs2")}
																	alt="img" className="w-7 h-7 me-4" />
																<div className="mt-1">
																	<h5 className="mb-1 font-weight-bold mt-0">
																		Invoice #543</h5>
																	<p className="mb-0 text-muted">Transcation
																		Id :
																		Inv24234</p>
																</div>
															</Link>
														</li>
														<li>
															<Link className="d-flex" data-bs-toggle="tab"
																to="#tab41" aria-expanded="false">
																<img src={ImagesData("pngs2")}
																	alt="img" className="w-7 h-7 me-4" />
																<div className="mt-1">
																	<h5 className="mb-1 font-weight-bold mt-0">
																		Invoice #124</h5>
																	<p className="mb-0 text-muted">Transcation
																		Id :
																		Inv65432</p>
																</div>
															</Link>
														</li>
														<li>
															<Link className="d-flex" data-bs-toggle="tab"
																to="#tab42" aria-expanded="false">
																<img src={ImagesData("pngs2")}
																	alt="img" className="w-7 h-7 me-4" />
																<div className="mt-1">
																	<h5 className="mb-1 font-weight-bold mt-0">
																		Invoice #543</h5>
																	<p className="mb-0 text-muted">Transcation
																		Id :
																		Inv87543</p>
																</div>
															</Link>
														</li>
														<li>
															<Link className="d-flex" data-bs-toggle="tab"
																to="#tab41" aria-expanded="false">
																<img src={ImagesData("pngs2")}
																	alt="img" className="w-7 h-7 me-4" />
																<div className="mt-1">
																	<h5 className="mb-1 font-weight-bold mt-0">
																		Invoice #456</h5>
																	<p className="mb-0 text-muted">Transcation
																		Id :
																		Inv65342</p>
																</div>
															</Link>
														</li>
														<li>
															<Link className="d-flex" data-bs-toggle="tab"
																to="#tab42" aria-expanded="false">
																<img src={ImagesData("pngs2")}
																	alt="img" className="w-7 h-7 me-4" />
																<div className="mt-1">
																	<h5 className="mb-1 font-weight-bold mt-0">
																		Invoice #534</h5>
																	<p className="mb-0 text-muted">Transcation
																		Id :
																		Inv67543</p>
																</div>
															</Link>
														</li>
														<li>
															<Link className="d-flex" data-bs-toggle="tab"
																to="#tab41" aria-expanded="false">
																<img src={ImagesData("pngs2")}
																	alt="img" className="w-7 h-7 me-4" />
																<div className="mt-1">
																	<h5 className="mb-1 font-weight-bold mt-0">
																		Invoice #634</h5>
																	<p className="mb-0 text-muted">Transcation
																		Id :
																		Inv73456</p>
																</div>
															</Link>
														</li>
														<li>
															<Link className="d-flex" data-bs-toggle="tab"
																to="#tab42" aria-expanded="false">
																<img src={ImagesData("pngs2")}
																	alt="img" className="w-7 h-7 me-4" />
																<div className="mt-1">
																	<h5 className="mb-1 font-weight-bold mt-0">
																		Invoice #623</h5>
																	<p className="mb-0 text-muted">Transcation
																		Id :
																		Inv45325</p>
																</div>
															</Link>
														</li>
														<li>
															<Link className="d-flex" data-bs-toggle="tab"
																to="#tab41" aria-expanded="false">
																<img src={ImagesData("pngs2")}
																	alt="img" className="w-7 h-7 me-4" />
																<div className="mt-1">
																	<h5 className="mb-1 font-weight-bold mt-0">
																		Invoice #243</h5>
																	<p className="mb-0 text-muted">Transcation
																		Id :
																		Inv87654</p>
																</div>
															</Link>
														</li>
													</ul>
												))}
											</div>
										</div>
									</Card.Body>
								</div>
							</Col>
							<Col lg={8} className="p-md-0">
								<div className="panel-body tabs-menu-body p-6 invoice-print d-block invoicedetailspage"
									id="invoicedetailspage">
									<div className="tab-content">
										<div className="tab-pane active text-center" id="tab01">
											<div className="row my-7">
												<div className="my-8 col-md-9 d-block mx-auto">
													<img src={ImagesData("pngs2")}
														alt="img" className="w-30 mb-4" />
													<h4 className="font-weight-bold">Invoice Details</h4>
													<p className="text-muted">Duis aute irure dolor in
														reprehrighterit in voluptate velit esse cillum
														dolore eu fugiat nulla pariatur. Excepteur sint
														occaecat cupidatat non proident</p>
													<div>
														<Button type="button"
															className="mb-3 mb-md-0 me-2" variant='primary' onClick={() => { window.print() }}
														><i
															className="fe fe-eye me-1"></i> View</Button>
														<Button type="button"
															className="mb-3 mb-md-0 me-2" variant='success' onClick={() => { window.print() }}
														><i
															className="fe fe-download me-1"></i>
															Download</Button>
														<Button type="button"
															className="mb-3 mb-md-0 me-2" variant='secondary' onClick={() => { window.print() }}
														><i
															className="fe fe-share me-1"></i> Send</Button>
														<Button type="button"
															className="mb-3 mb-md-0 me-2" variant='danger' onClick={() => { window.print() }}
														><i
															className="fe fe-printer me-1"></i>
															Print</Button>
													</div>
												</div>
											</div>
										</div>
										<div className="tab-pane" id="tab41">
											<div className="card-body p-0">
												<div className="invoice-header text-end d-block mb-5">
													<h1
														className="invoice-title font-weight-bold text-uppercase mb-1">
														Invoice</h1>
												</div>
												<div className="row mt-4">
													<div className="col-md">
														<label className="font-weight-bold">Billed
															To</label>
														<div className="billed-to">
															<h6>Goerge</h6>
															<p>2406 Raoul Wallenberg Place<br />
																Tel No: 203-875-4147<br />
																Email: goerge234@gmail.com</p>
														</div>
													</div>
													<div className="col-md">
														<div className="billed-from text-md-right">
															<label className="font-weight-bold">Billed
																From</label>
															<h6>Spruko Pvt Ltd.</h6>
															<p>201 Something St., Something Town, YT
																242,
																Country 6546<br />
																Tel No: 324 445-4544<br />
																Email: info@spruko.com</p>
														</div>
													</div>
												</div>
												<div className="table-responsive mt-4">
													<table
														className="table table-bordered border text-nowrap mb-0">
														<thead>
															<tr>
																<th className="wd-20p">Product</th>
																<th className="tx-center">QNTY</th>
																<th className="tx-right">Unit Price</th>
																<th className="tx-right">Amount</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td className="font-weight-bold">Website
																	design
																	&amp; development</td>
																<td className="tx-center">6</td>
																<td className="tx-right">$250.00</td>
																<td className="tx-right">$1500.00</td>
															</tr>
															<tr>
																<td className="font-weight-bold">Branding
																</td>
																<td className="tx-center">1</td>
																<td className="tx-right">$900.00</td>
																<td className="tx-right">$900.00</td>
															</tr>
															<tr>
																<td className="font-weight-bold">Redesign
																	Service</td>
																<td className="tx-center">1</td>
																<td className="tx-right">$500.00</td>
																<td className="tx-right">$500.00</td>
															</tr>
															<tr>
																<td className="font-weight-bold">Wordpress
																	Plugins</td>
																<td className="tx-center">5</td>
																<td className="tx-right">$360.00</td>
																<td className="tx-right">$1800.00</td>
															</tr>
															<tr>
																<td className="valign-middle">
																	<div className="invoice-notes">
																		<label
																			className="main-content-label  font-weight-semibold">Notes</label>
																		<p> voluptatum deleniti atque
																			corrupti explicabo.</p>
																	</div>
																</td>
																<td
																	className="tx-right font-weight-semibold">
																	Sub-Total</td>
																<td className="tx-right font-weight-semibold"
																>$4700.00</td>
															</tr>
															<tr>
																<td
																	className="tx-right font-weight-semibold">
																	Tax (5%)</td>
																<td className="tx-right font-weight-semibold"
																>$235.50</td>
															</tr>
															<tr>
																<td
																	className="tx-right font-weight-semibold">
																	Discount</td>
																<td className="tx-right font-weight-semibold"
																>-$50.00</td>
															</tr>
															<tr>
																<td
																	className="text-uppercase font-weight-semibold">
																	Total Due</td>
																<td className="tx-right" >
																	<h4
																		className="text-primary font-weight-bold">
																		$4,885.50</h4>
																</td>
															</tr>
														</tbody>
													</table>
												</div>
												<div className="float-end mb-4">
													<button type="button" className="btn btn-primary m-2"
													><i
														className="si si-wallet"></i> Pay</button>
													<button type="button" className="btn btn-success m-2"
													><i
														className="si si-cloud-download"></i>
														Send</button>
													<button type="button" className="btn btn-secondary m-2"
													><i
														className="si si-printer"></i> Print</button>
												</div>
											</div>
										</div>
										<div className="tab-pane" id="tab42">
											<div className="card-body p-0">
												<div className="invoice-header text-end d-block mb-5">
													<h1
														className="invoice-title font-weight-bold text-uppercase mb-1">
														Invoice1</h1>
												</div>
												<div className="row mt-4">
													<div className="col-md">
														<label className="font-weight-bold">Billed
															To</label>
														<div className="billed-to">
															<h6>Spruko Pvt Ltd.</h6>
															<p>201 Something St., Something Town, YT
																242,
																Country 6546<br />
																Tel No: 324 445-4544<br />
																Email: info@spruko.com</p>

														</div>
													</div>
													<div className="col-md">
														<div className="billed-from text-md-right">
															<label className="font-weight-bold">Billed
																From</label>
															<h6>Goerge</h6>
															<p>2406 Raoul Wallenberg Place<br />
																Tel No: 203-875-4147<br />
																Email: goerge234@gmail.com</p>
														</div>
													</div>
												</div>
												<div className="table-responsive mt-4">
													<table
														className="table table-bordered border text-nowrap mb-0">
														<thead>
															<tr>
																<th className="wd-20p">Product</th>
																<th className="tx-center">QNTY</th>
																<th className="tx-right">Unit Price</th>
																<th className="tx-right">Amount</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td className="font-weight-bold">Website
																	design
																	&amp; development</td>
																<td className="tx-center">6</td>
																<td className="tx-right">$250.00</td>
																<td className="tx-right">$1500.00</td>
															</tr>
															<tr>
																<td className="font-weight-bold">Branding
																</td>
																<td className="tx-center">1</td>
																<td className="tx-right">$900.00</td>
																<td className="tx-right">$900.00</td>
															</tr>
															<tr>
																<td className="font-weight-bold">Redesign
																	Service</td>
																<td className="tx-center">1</td>
																<td className="tx-right">$500.00</td>
																<td className="tx-right">$500.00</td>
															</tr>
															<tr>
																<td className="font-weight-bold">Wordpress
																	Plugins</td>
																<td className="tx-center">5</td>
																<td className="tx-right">$360.00</td>
																<td className="tx-right">$1800.00</td>
															</tr>
															<tr>
																<td className="valign-middle" >
																	<div className="invoice-notes">
																		<label
																			className="main-content-label  font-weight-semibold">Notes</label>
																		<p> voluptatum deleniti atque
																			corrupti explicabo.</p>
																	</div>
																</td>
																<td
																	className="tx-right font-weight-semibold">
																	Sub-Total</td>
																<td className="tx-right font-weight-semibold"
																>$4700.00</td>
															</tr>
															<tr>
																<td
																	className="tx-right font-weight-semibold">
																	Tax (5%)</td>
																<td className="tx-right font-weight-semibold"
																>$235.50</td>
															</tr>
															<tr>
																<td
																	className="tx-right font-weight-semibold">
																	Discount</td>
																<td className="tx-right font-weight-semibold"
																>-$50.00</td>
															</tr>
															<tr>
																<td
																	className="text-uppercase font-weight-semibold">
																	Total Due</td>
																<td className="tx-right" >
																	<h4
																		className="text-primary font-weight-bold">
																		$4,885.50</h4>
																</td>
															</tr>
														</tbody>
													</table>
												</div>
												<div className="float-end mb-4">
													<button type="button" className="btn btn-primary m-2"
													><i
														className="si si-wallet"></i> Pay</button>
													<button type="button" className="btn btn-success m-2"
													><i
														className="si si-cloud-download"></i>
														Send</button>
													<button type="button" className="btn btn-secondary m-2"
													><i
														className="si si-printer"></i> Print</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	</Fragment>
);

export default Invoice03;
