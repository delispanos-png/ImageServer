import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Col, Collapse, Form, OverlayTrigger, Popover, Row, } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import { defaultpopover, headpopover, coloredpopover } from '../../../components/Elements/Popover/Data/popoverData';
interface PopoverProps { }

const Popovers: FC<PopoverProps> = () => {
	const [show, setShow] = useState(false);
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	return (

		<Fragment>
			<PageHeader title="Popovers" />
			<Row>
				<Col lg={12}>
					<Card id="popover">
						<Card.Header>
							<Card.Title>
								Default Popover
							</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
						</Card.Header>
						<Card.Body>

							<div className="form-label mb-2">
								Static Example
							</div>
							<div className="popover-static-demo mb-4 border br-3 pb-6">
								<Row className="row row-sm">
									<Col md={6} mt={4} mb={2}>
										<div className="popover bs-popover-top">
											<div className="popover-arrow"></div>
											<Popover.Header>Popover top</Popover.Header>
											<Popover.Body>
												<p>Sed posuere consectetur est at lobortis. Aenean eu leo
													quam.
													Pellentesque ornare sem lacinia quam venenatis
													vestibulum.
												</p>
											</Popover.Body>
										</div>
									</Col>
									<Col md={6} mt={4}>
										<div className="popover bs-popover-bottom mt-2">
											<div className="popover-arrow"></div>
											<Popover.Header >Popover Bottom</Popover.Header>
											<Popover.Body>
												<p>Sed posuere consectetur est at lobortis. Aenean eu leo
													quam.
													Pellentesque ornare sem lacinia quam venenatis
													vestibulum.
												</p>
											</Popover.Body>
										</div>
									</Col>
									<Col md={6} mt={4}>
										<div className="popover bs-popover-start">
											<div className="popover-arrow"></div>
											<Popover.Header>Popover Left</Popover.Header>
											<Popover.Body>
												<p>Sed posuere consectetur est at lobortis. Aenean eu leo
													quam.
													Pellentesque ornare sem lacinia quam venenatis
													vestibulum.
												</p>
											</Popover.Body>
										</div>
									</Col>
									<Col md={6} mt={4}>
										<div className="popover bs-popover-end ">
											<div className="popover-arrow"></div>
											<Popover.Header>Popover Right</Popover.Header>
											<Popover.Body>
												<p>Sed posuere consectetur est at lobortis. Aenean eu leo
													quam.
													Pellentesque ornare sem lacinia quam venenatis
													vestibulum.
												</p>
											</Popover.Body>
										</div>
									</Col>
								</Row>
							</div>
							<div className="form-label mb-2">
								Example
							</div>
							<div className="px-4 bg-light border br-3 pt-4 pb-5">
								<Row className="row row-sm text-center">
									{defaultpopover.map((defaultpopovers) => (
										<Col sm={6} lg={3} mt={3} key={Math.random()}>
											<OverlayTrigger
												trigger="click"
												placement={defaultpopovers.placement}
												overlay={
													<Popover>
														<Popover.Header as="h3">{defaultpopovers.heading}</Popover.Header>
														<Popover.Body>
															Vivamus sagittis lacus vel augue<br /> laoreet rutrum faucibus.
														</Popover.Body>
													</Popover>
												}
											>
												<Button className='mt-2' variant="secondary">Click me</Button>
											</OverlayTrigger>
										</Col>
									))}

								</Row>
							</div>
						</Card.Body>

						<Collapse in={show} className="">
							<pre>
								<code>
									{`
{defaultpopover.map((defaultpopovers)=> (
	<Col sm={6} lg={3} mt={3}>
		<OverlayTrigger
				trigger="click"
				placement={defaultpopovers.placement}
				overlay={
		 <div>
				<Popover.Header as="h3">{defaultpopovers.heading}</Popover.Header>
			<Popover.Body>
			    <strong  id="popover-top">Vivamus sagittis lacus vel augue<br/> laoreet rutrum faucibus.</strong> 
			</Popover.Body>
		</div>
				}
			>
				<Button variant="secondary">Click me</Button>
			</OverlayTrigger>
	</Col>
	))}
`}
								</code>
							</pre>
						</Collapse>
					</Card>
					<Card className="card mb-4" id="popover1">
						<Card.Header>
							<Card.Title>
								Colored Head Popover
							</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
						</Card.Header>
						<Card.Body>
							<div className="form-label mb-2">
								Static Example
							</div>
							<div className="popover-static-demo mb-4">
								<Row className="row row-sm">
									<Col md={6}>
										<div className="popover popover-head-primary bs-popover-top mt-2">
											<div className="popover-arrow"></div>
											<Popover.Header>Popover top</Popover.Header>
											<Popover.Body>
												<p>Sed posuere consectetur est at lobortis. Aenean eu leo
													quam.
													Pellentesque ornare sem lacinia quam venenatis
													vestibulum.
												</p>
											</Popover.Body>
										</div>
									</Col>
									<Col md={6} mt={5} mt-mb={0}>
										<div className="popover popover-head-secondary bs-popover-bottom mt-4">
											<div className="popover-arrow"></div>
											<Popover.Header>Popover Bottom</Popover.Header>
											<Popover.Body>
												<p>Sed posuere consectetur est at lobortis. Aenean eu leo
													quam.
													Pellentesque ornare sem lacinia quam venenatis
													vestibulum.
												</p>
											</Popover.Body>

										</div>
									</Col>
								</Row>
							</div>
							<div className="form-label mb-2">
								Example
							</div>
							<div className="px-4 bg-light border br-3 pt-4 pb-5">
								<Row className="row row-sm text-center">
									{headpopover.map((headpopovers) => (
										<Col sm={6} lg={3} mt={3} className="text-center" key={Math.random()}>
											<OverlayTrigger
												trigger="click"
												placement={headpopovers.placement}
												overlay={
													<Popover className=" popover-head-primary bs-popover-top mt-2">
														<Popover.Header>{headpopovers.heading}</Popover.Header>
														<Popover.Body>
															<p>Vivamus sagittis lacus vel augue<br /> laoreet rutrum faucibus.
															</p>
														</Popover.Body>
													</Popover>
												}
											>
												<Button className='mt-2' variant="secondary">Click me</Button>
											</OverlayTrigger>
										</Col>
									))}
								</Row>
							</div>
						</Card.Body>
						<Collapse in={show1} className="">
							<pre>
								<code>
									{`
{headpopover.map((headpopovers)=>(
	<Col sm={6} lg={3} mt={3} className="text-center">
			<OverlayTrigger
				trigger="click"
				placement={headpopovers.placement}
				overlay={
					<div>
						<Popover.Header as="h3" className='bg-primary'>{headpopovers.heading}</Popover.Header>
						<Popover.Body>
						<strong>Vivamus sagittis lacus vel augue<br/> laoreet rutrum faucibus.</strong> 
						</Popover.Body>
					</div>
				}
			>
				<Button variant="secondary">Click me</Button>
			</OverlayTrigger>
	</Col>
	))}
`}
								</code>
							</pre>
						</Collapse>
					</Card>
					<Card id="popover2">
						<Card.Header>
							<Card.Title>
								Full Colored Popover
							</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />
						</Card.Header>
						<Card.Body>
							<div className="form-label mb-2">
								Static Example
							</div>
							<div className="popover-static-demo mb-4 pb-6">
								<Row className="row row-sm">
									<Col md={6} mt={4}>
										<div className="popover popover-primary bs-popover-top mt-2">
											<div className="popover-arrow"></div>
											<Popover.Header>Popover top</Popover.Header>
											<Popover.Body className='bg-primary'>
												<p>Sed posuere consectetur est at lobortis. Aenean eu leo
													quam.
													Pellentesque ornare sem lacinia quam venenatis
													vestibulum.
												</p>
											</Popover.Body>
										</div>
									</Col>
									<Col md={6} mt={4}>
										<div className="popover popover-secondary bs-popover-bottom mt-4">
											<div className="popover-arrow"></div>
											<Popover.Header>Popover Bottom</Popover.Header>
											<Popover.Body className='bg-secondary'>
												<p>Sed posuere consectetur est at lobortis. Aenean eu leo
													quam.
													Pellentesque ornare sem lacinia quam venenatis
													vestibulum.
												</p>
											</Popover.Body>
										</div>
									</Col>
								</Row>
							</div>
							<div className="form-label mb-2">
								Example
							</div>
							<div className="px-4 bg-light border br-3 pb-5 pt-4">
								<Row className="row row-sm text-center">
									{coloredpopover.map((coloredpopovers) => (
										<Col sm={6} lg={3} mt={3} key={Math.random()}>
											<OverlayTrigger
												trigger="click"
												placement={coloredpopovers.placement}
												overlay={
													<Popover className={`popover-${coloredpopovers.color}`} >
														<Popover.Header as="h3" className={`bg-${coloredpopovers.color} text-white`}>{coloredpopovers.heading}</Popover.Header>
														<Popover.Body className={`bg-${coloredpopovers.color} text-white`}>
														Vivamus sagittis lacus vel augue<br /> laoreet rutrum faucibus.
														</Popover.Body>
													</Popover>
												
												}
											>
												<Button className='mt-2' variant="secondary">Click me</Button>
											</OverlayTrigger>
										</Col>
									))}
								</Row>
							</div>
						</Card.Body>
						<Collapse in={show2} className="">
							<pre>
								<code>
									{`
	{coloredpopover.map((coloredpopovers)=>(
		<Col sm={6} lg={3} mt={3}>
	<OverlayTrigger 
			trigger="click"
					placement={coloredpopovers.placement}
					overlay={
						<div id="div-positioned-top" className='bg-primary' >
							<Popover.Header as="h3" className='bg-primary'>{coloredpopovers.heading}</Popover.Header>
							<Popover.Body>
							<strong >Vivamus sagittis lacus vel augue<br/> laoreet rutrum faucibus.</strong> 
								</Popover.Body>
						</div>
					}
				>
					<Button variant="secondary">Click me</Button>
				</OverlayTrigger>
		</Col>
		))}
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

export default Popovers;
