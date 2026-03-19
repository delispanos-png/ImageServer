import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { prices, prices1, prices2 } from '../Pricing01/Data/Pricing01Data';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
interface Pricing01Props { }

const Pricing01: FC<Pricing01Props> = () => (
	<Fragment>
		<PageHeader title="Pricing" />
		<Row>
			{prices.map((price) => (
				<Col sm={6} xl={3} key={Math.random()}>
					<div className="panel price panel-color">
						<div className={`panel-heading bg-${price.color} text-white p-0 pb-0 text-center`}>
							<h3>{price.heading}</h3>
						</div>
						<div className={`bg-${price.color}-transparent`}>
							<div className="panel-body text-center mb-3">
								<p className={`lead text-${price.color}`}><strong>{price.main} </strong>/ Month</p>
							</div>
							<ul className="text-center">
								<li className="mb-4"> <strong>{price.text}</strong> Free Domain Name</li>
								<li className="mb-4"><strong>{price.text1}</strong> One-Click Apps</li>
								<li className="mb-4"><strong> {price.text2} </strong>Databases</li>
								<li className="mb-4"><strong> Money </strong> BackGuarantee</li>
								<li className="mb-6"><strong> 24/7</strong> support</li>
							</ul>
							<div className={`panel-footer  bg-${price.color}-transparent text-center border-top-0`}>
								<Button className="btn btn-lg" href="#" variant={price.color}>Purchase Now!</Button>
							</div>
						</div>
					</div>
				</Col>
			))}
		</Row>
		<Card className="px-5 pt-5">
			<Row>
				<Col sm={12} xl={3}>
					<div className="card shadow-none border overflow-hidden">
						<Card.Header className="bg-primary text-white align-items-center">
							<Card.Title className="mx-auto text-center">
								<h3 className=" font-weight-semibold mt-3 mb-2">Team</h3>
								<div className="mb fs-13">$159 PER USER/MONTH</div>
								<p className="fs-12">billed anually</p>
							</Card.Title>
						</Card.Header>
						<Card.Body className="text-center  pricing px-0">
							<ul className="list-unstyled leading-loose">
								<li className="text-muted border-bottom"><strong>20 </strong> FreeDomain
									Name
								</li>
								<li className="text-muted border-bottom"><span
									className="text-primary fs-16 font-weight-bold">New! </span>
									<strong>16</strong> One-Click Apps
								</li>
								<li className="text-muted border-bottom"><strong>6</strong> Databases</li>
								<li className="text-muted border-bottom"><strong>Money</strong> BackGuarntee
								</li>
								<li className="text-muted border-bottom"><strong>24/7</strong> Support</li>
							</ul>
							<div className="text-center mt-5 px-4">
								<Link to="#"
									className="btn btn-lg btn-outline-primary d-grid">Buy Now</Link>
							</div>
						</Card.Body>
					</div>
				</Col>
				<Col sm={12} xl={3}>
					<div className="card shadow-none border overflow-hidden">
						<Card.Header className="bg-success text-white align-items-center">
							<Card.Title className="mx-auto text-center">
								<h3 className=" font-weight-semibold mt-3 mb-2">Personal</h3>
								<div className="mb fs-13">$29 PER USER/MONTH</div>
								<p className="fs-12">billed anually</p>
							</Card.Title>
						</Card.Header>
						<Card.Body className="text-center  pricing px-0">
							<ul className="list-unstyled leading-loose">
								<li className="text-muted border-bottom"><strong>5 </strong> FreeDomain Name
								</li>
								<li className="text-muted border-bottom"><strong>7</strong> One-Click Apps
								</li>
								<li className="text-muted border-bottom"><strong>6</strong> Databases</li>
								<li className="text-muted border-bottom"><span
									className="text-success fs-16 font-weight-bold">New!</span>
									<strong>Money</strong> BackGuarntee
								</li>
								<li className="text-muted border-bottom"><strong>24/7</strong> Support</li>
							</ul>
							<div className="text-center mt-5 px-4">
								<Link to="#"
									className="btn btn-lg btn-outline-success d-grid">Buy Now</Link>
							</div>
						</Card.Body>
					</div>
				</Col>
				<Col sm={12} xl={3}>
					<div className="card shadow-none border overflow-hidden">
						<Card.Header className="bg-secondary text-white align-items-center">
							<Card.Title className="mx-auto text-center">
								<h3 className=" font-weight-semibold mt-3 mb-2">Corporate</h3>
								<div className="mb fs-13">$49 PER USER/MONTH</div>
								<p className="fs-12">billed anually</p>
							</Card.Title>
						</Card.Header>
						<Card.Body className="text-center  pricing px-0">
							<ul className="list-unstyled leading-loose">
								<li className="text-muted border-bottom"><strong>12 </strong> FreeDomain
									Name
								</li>
								<li className="text-muted border-bottom"><strong>10</strong> One-Click Apps
								</li>
								<li className="text-muted border-bottom"><strong>6</strong> Databases</li>
								<li className="text-muted border-bottom"><strong>Money</strong> BackGuarntee
								</li>
								<li className="text-muted border-bottom"><span
									className="text-secondary fs-16 font-weight-bold">New! </span>
									<strong>24/7</strong> Support
								</li>
							</ul>
							<div className="text-center mt-5">
								<Link to="#"
									className="btn btn-lg btn-outline-secondary d-grid">Buy Now</Link>
							</div>
						</Card.Body>
					</div>
				</Col>
				<Col sm={12} xl={3}>
					<div className="card shadow-none border overflow-hidden">
						<Card.Header className="bg-danger text-white align-items-center">
							<Card.Title className="mx-auto text-center">
								<h3 className=" font-weight-semibold mt-3 mb-2">Unlimited</h3>
								<div className="mb fs-13">$249 PER USER/MONTH</div>
								<p className="fs-12">billed anually</p>
							</Card.Title>
						</Card.Header>
						<Card.Body className="text-center  pricing px-0	">
							<ul className="list-unstyled leading-loose">
								<li className="text-muted border-bottom"><strong>12 </strong> FreeDomain
									Name
								</li>
								<li className="text-muted border-bottom"><strong>10</strong> One-Click Apps
								</li>
								<li className="text-muted border-bottom"><span
									className="text-danger fs-16 font-weight-bold">New! </span>
									<strong>6</strong> Databases
								</li>
								<li className="text-muted border-bottom"><strong>Money</strong> BackGuarntee
								</li>
								<li className="text-muted border-bottom"><strong>24/7</strong> Support</li>
							</ul>
							<div className="text-center mt-5 px-4">
								<Link to="#"
									className="btn btn-lg btn-outline-danger d-grid">Buy Now</Link>
							</div>
						</Card.Body>
					</div>
				</Col>
			</Row>
		</Card>
		<Row>
			{prices1.map((price1) => (
				<Col sm={6} xl={3} key={Math.random()} >
					<Card className=" p-6 text-center">
						<h3 className={`fw-semibold text-${price1.color} pt-0 mb-2`}>{price1.heading}</h3>
						<p className="text-dark mb-2"><span className="fs-35 fw-semibold">{price1.title}</span><span className="mx-1 text-muted">/</span> month</p>
						<p className="fs-13">Lorem ipsum dolor sit amet
							consectetur adipisicing elit. Iure quos debitis.</p>
						<ul className="pt-3">
							<li className="mb-4"><i className="fe fe-check me-1 text-primary"></i> <strong> 2 Free</strong> Domain Name</li>
							<li className="mb-4"><i className="fe fe-check me-1 text-primary"></i><strong>3 </strong> One-Click Apps</li>
							<li className="mb-4"><i className="fe fe-check me-1 text-primary"></i><strong> 1 </strong> Databases</li>
							<li className="mb-4"><i className="fe fe-check me-1 text-primary"></i><strong> Money </strong> BackGuarantee</li>
							<li className="mb-6 "><i className="fe fe-check me-1 text-primary"></i><strong> 24/7</strong> support</li>
						</ul>
						<div className="text-center border-top-0">
							<Button className=" btn-block" variant={price1.color} href="#">Purchase Now!</Button>
						</div>
					</Card>
				</Col>
			))}

			{prices2.map((price2) => (
				<Col sm={6} xl={3} key={Math.random()}>
					<Card>
						<Card.Body>
							<div className={`ribbon ribbon-top-left text-${price2.color}`}><span className={`bg-${price2.color}`}>Popular</span></div>
							<div className="d-flex align-items-center">
								<span className={`pricing-icon me-2 bg-${price2.color}-transparent`}><i className={`fe fe-${price2.icon} text-${price2.color}`}></i></span>
								<h4 className={`fw-semibold text-${price2.color} pt-0 mb-2`}>{price2.heading}</h4>
							</div>
							<p className="text-dark mb-2 mt-3"><span className="fs-40 fw-semibold"> {price2.main}</span><span className="mx-1 text-muted">/</span> month</p>
							<p className="mb-3">Best for Business</p>
							<div className="text-center border-top-0">
								<Button className="btn-block mb-4 btn-pill" variant={price2.color1} href="#">Purchase Now!</Button>
							</div>
							<p className="fs-13 fw-semibold">Lorem ipsum dolor sit amet
								consectetur adipisicing.</p>
							<ul className="pt-3 mb-0">
								<li className="mb-4"><i className={`bx bxs-check-circle me-2 text-${price2.color}`}></i> <strong> 2 Free</strong> Domain Name</li>
								<li className="mb-4"><i className={`bx bxs-check-circle me-2 text-${price2.color}`}></i><strong>3 </strong> Projects</li>
								<li className="mb-4"><i className={`bx bxs-check-circle me-2 text-${price2.color}`}></i><strong>3 </strong> One-Click Apps</li>
								<li className="mb-4"><i className={`bx bxs-check-circle me-2 text-${price2.color}`}></i><strong> 1 </strong> Databases</li>
								<li className="mb-4 text-muted"><i className="bx bxs-x-circle me-2"></i><strong> Money </strong> BackGuarantee</li>
								<li className="mb-0 text-muted"><i className="bx bxs-x-circle me-2"></i><strong> 24/7</strong> support</li>
							</ul>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
	</Fragment>
);

export default Pricing01;
