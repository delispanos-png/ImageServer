import React, { FC, Fragment, useState } from 'react';
import { Card, Col, Collapse, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../layout/Header/pageheader';

interface FootersProps { }
const Footers: FC<FootersProps> = () => {
	const [show, setShow] = useState(false);
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	const [show3, setShow3] = useState(false);
	const [show4, setShow4] = useState(false);
	return (

		<Fragment>

			<PageHeader title="Footers" />
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Footer style01</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
						</Card.Header>
						<Card.Body>
							<div className="footer p-3 br-bs-7 br-be-7 border-top-0">
								<div className="container">
									<div className="row align-items-center">
										<div className="social">
											<ul className="text-center">
												<li><Link className="social-icon" to="#"><i className="fa fa-facebook"></i></Link></li>
												<li><Link className="social-icon" to="#"><i className="fa fa-twitter"></i></Link></li>
												<li><Link className="social-icon" to="#"><i className="fa fa-rss"></i></Link></li>
												<li><Link className="social-icon" to="#"><i className="fa fa-youtube"></i></Link></li>
												<li><Link className="social-icon" to="#"><i className="fa fa-linkedin"></i></Link></li>
												<li><Link className="social-icon" to="#"><i className="fa fa-google-plus"></i></Link></li>
											</ul>
										</div>
										<div className="col-lg-12 col-sm-12 mt-3 mt-lg-0 text-center">
											Copyright © 2023 <Link to="#">Azea</Link>. Designed
											with <span
												className="fa fa-heart text-danger"></span> by <Link to="#"> Spruko </Link> All
											rights reserved.
										</div>
									</div>
								</div>
							</div>
						</Card.Body>
						<Collapse in={show} className="">
							<pre>
								<code>
									{`
<div className="row align-items-center">
<div className="social">
	<ul className="text-center">
		<li><Link className="social-icon" to="#"><i	className="fa fa-facebook"></i></Link></li>
		<li><Link className="social-icon" to="#"><i	className="fa fa-twitter"></i></Link></li>
		<li><Link className="social-icon" to="#"><i	className="fa fa-rss"></i></Link></li>
		<li><Link className="social-icon" to="#"><i	className="fa fa-youtube"></i></Link></li>
		<li><Link className="social-icon" to="#"><i	className="fa fa-linkedin"></i></Link></li>
		<li><Link className="social-icon" to="#"><i	className="fa fa-google-plus"></i></Link></li>
	</ul>
</div>
<div className="col-lg-12 col-sm-12 mt-3 mt-lg-0 text-center">
	Copyright © 2023 <Link to="#">Azea</Link>. Designed
	with <span
	className="fa fa-heart text-danger"></span> by <Link to="#"> Spruko </Link> All
rights reserved.
</div>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			{/* <!-- End Row-->

                                        <!-- Row --> */}
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Footer style02</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
						</Card.Header>
						<div>
							<div className="footer p-3 br-bs-7 br-be-7 border-top-0">
								<div className="container">
									<div className="row align-items-center">
										<div className="col-lg-6 col-sm-12  col-md-6 mt-3 mt-lg-0 text-center d-none d-md-block">
											<div className="social">
												<ul className="text-center m-0">
													<li><Link className="social-icon" to="#"><i className="fa fa-facebook"></i></Link></li>
													<li><Link className="social-icon" to="#"><i className="fa fa-twitter"></i></Link></li>
													<li><Link className="social-icon" to="#"><i className="fa fa-rss"></i></Link></li>
													<li><Link className="social-icon" to="#"><i className="fa fa-youtube"></i></Link></li>
													<li><Link className="social-icon" to="#"><i className="fa fa-linkedin"></i></Link></li>
													<li><Link className="social-icon" to="#"><i className="fa fa-google-plus"></i></Link></li>
												</ul>
											</div>
										</div>
										<div className="col-lg-6 col-sm-12 col-md-6 mt-3 mt-lg-0 text-md-right">
											Copyright © 2023 <Link to="#">Azea</Link>.Designed
											with <span
												className="fa fa-heart text-danger"></span> by <Link to="#"> Spruko </Link> All
											rights reserved.
										</div>
									</div>
								</div>
							</div>
						</div>
						<Collapse in={show1} className="">
							<pre>
								<code>
									{`
<div className="row align-items-center">
<div className="col-lg-6 col-sm-12  col-md-6 mt-3 mt-lg-0 text-center d-none d-md-block">
	<div className="social">
		<ul className="text-center m-0">
                                        <li><Link className="social-icon" to="#"><i	className="fa fa-facebook"></i></Link></li>
                                        <li><Link className="social-icon" to="#"><i	className="fa fa-twitter"></i></Link></li>
                                        <li><Link className="social-icon" to="#"><i	className="fa fa-rss"></i></Link></li>
                                        <li><Link className="social-icon" to="#"><i	className="fa fa-youtube"></i></Link></li>
                                        <li><Link className="social-icon" to="#"><i	className="fa fa-linkedin"></i></Link></li>
                                        <li><Link className="social-icon" to="#"><i	className="fa fa-google-plus"></i></Link></li>
		</ul>
	</div>
</div>
<div className="col-lg-6 col-sm-12 col-md-6 mt-3 mt-lg-0 text-md-right">
	Copyright © 2023 <Link to="#">Azea</Link>.Designed
	with <span
	className="fa fa-heart text-danger"></span> by <Link to="#"> Spruko </Link> All
rights reserved.
</div>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12}>
					<Card className="overflow-hidden">
						<Card.Header>
							<Card.Title>Footer style03</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />
						</Card.Header>
						<Card.Body>
							<div className="footer br-bs-7 br-be-7 border-top-0 p-0">
								<div>
									<div className="p-3">
										<div className="row align-items-center text-center">
											<div className="col-lg-6 col-md-6 d-none d-md-block ">
												<div className="social">
													<ul className="text-center m-0 ">
														<li><Link className="social-icon" to="#"><i className="fa fa-facebook"></i></Link></li>
														<li><Link className="social-icon" to="#"><i className="fa fa-twitter"></i></Link></li>
														<li><Link className="social-icon" to="#"><i className="fa fa-rss"></i></Link></li>
														<li><Link className="social-icon" to="#"><i className="fa fa-youtube"></i></Link></li>
														<li><Link className="social-icon" to="#"><i className="fa fa-linkedin"></i></Link></li>
														<li><Link className="social-icon" to="#"><i className="fa fa-google-plus"></i></Link></li>
													</ul>
												</div>
											</div>
											<Col lg={6} md={6} className="col-lg-6 col-md-6 text-end privacy">
												<Link to="#" className="btn btn-link">Privacy</Link>
												<Link to="#" className="btn btn-link">Terms</Link>
												<Link to="#" className="btn btn-link">About Us</Link>
											</Col>
										</div>
									</div>
									<div className="row align-items-center flex-row-reverse border-top">
										<div className="col-lg-12 col-sm-12 mt-lg-0 text-center p-3">
											Copyright © 2023 <Link to="#">Azea</Link>. Designed
											with <span
												className="fa fa-heart text-danger"></span> by <Link to="#"> Spruko </Link> All
											rights reserved.
										</div>
									</div>
								</div>
							</div>
						</Card.Body>
						<Collapse in={show2} className="">
							<pre>
								<code>
									{`
<div className="p-3">
<div className="row align-items-center text-center">
	<div className="col-lg-6 col-md-6 d-none d-md-block ">
		<div className="social">
                                        <ul className="text-center m-0 ">
                                        	<li><Link className="social-icon" to="#"><i	className="fa fa-facebook"></i></Link></li>
                                        	<li><Link className="social-icon" to="#"><i	className="fa fa-twitter"></i></Link></li>
                                        	<li><Link className="social-icon" to="#"><i	className="fa fa-rss"></i></Link></li>
                                        	<li><Link className="social-icon" to="#"><i	className="fa fa-youtube"></i></Link></li>
                                        	<li><Link className="social-icon" to="#"><i	className="fa fa-linkedin"></i></Link></li>
                                        	<li><Link className="social-icon" to="#"><i	className="fa fa-google-plus"></i></Link></li>
                                        </ul>
		</div>
	</div>
	<Col lg={6} md={6} className="col-lg-6 col-md-6 text-end privacy">
		<Link to="#"className="btn btn-link">Privacy</Link>
		<Link to="#" className="btn btn-link">Terms</Link>
		<Link to="#" className="btn btn-link">About Us</Link>
	</Col>
</div>
</div>
<div className="row align-items-center flex-row-reverse border-top">
<div className="col-lg-12 col-sm-12 mt-lg-0 text-center p-3">
	Copyright © 2023 <Link to="#">Azea</Link>. Designed
	with <span
	className="fa fa-heart text-danger"></span> by <Link to="#"> Spruko </Link> All
rights reserved.
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12}>
					<Card className="overflow-hidden">
						<Card.Header>
							<Card.Title>Footer style 04</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow3(!show3)} />
						</Card.Header>
						<Card.Body>
							<div className="footer br-bs-7 br-be-7 border-top-0 p-0">
								<div className="container">
									<div className="p-4">
										<div className="row align-items-center">
											<div className="col-lg-6 col-md-6 d-md-block ">
												Copyright © 2023 <Link to="#">Azea</Link>Designed
												with <span
													className="fa fa-heart text-danger"></span> by <Link to="#"> Spruko </Link> All
												rights reserved.
											</div>
											<Col lg={6} md={6} className="col-lg-6 col-md-6 text-end privacy">
												<Link to="#" className="btn btn-link">Privacy</Link>
												<Link to="#" className="btn btn-link">Terms</Link>
												<Link to="#" className="btn btn-link">About Us</Link>
											</Col>
										</div>
									</div>

								</div>
							</div>
						</Card.Body>
						<Collapse in={show3} className="">
							<pre>
								<code>
									{`
<div className="row align-items-center">
<div className="col-lg-6 col-md-6 d-md-block ">
	Copyright © 2023 <Link to="#">Azea</Link>Designed
	with <span
	className="fa fa-heart text-danger"></span> by <Link to="#"> Spruko </Link> All
rights reserved.
</div>
<Col lg={6} md={6} className="col-lg-6 col-md-6 text-end privacy">
	<Link to="#" className="btn btn-link">Privacy</Link>
	<Link to="#" className="btn btn-link">Terms</Link>
	<Link to="#" className="btn btn-link">About Us</Link>
</Col>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Footer style04</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow4(!show4)} />
						</Card.Header>
						<Card.Body>
							<div className="footer br-bs-7 br-be-7 border-top-0 p-3">
								<div className="container">
									<div className="row align-items-center flex-row-reverse">
										<Col lg={12} sm={12} className="mt-3 mt-lg-0 text-center">
											Copyright © 2023 <Link to="#">Azea</Link>. Designed
											with <span
												className="fa fa-heart text-danger"></span> by <Link to="#"> Spruko </Link> All
											rights reserved.
										</Col>
									</div>
								</div>
							</div>
						</Card.Body>
						<Collapse in={show4} className="">
							<pre>
								<code>
									{`
<div className="row align-items-center flex-row-reverse">
<Col lg={12} sm={12} className="mt-3 mt-lg-0 text-center">
	Copyright © 2023 <Link to="#">Azea</Link>. Designed
	with <span
	className="fa fa-heart text-danger"></span> by <Link to="#"> Spruko </Link> All
rights reserved.
</Col>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
};

export default Footers;
