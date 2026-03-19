import React, { FC, Fragment } from 'react';
import PageHeader from '../../../layout/Header/pageheader';
import { Card, Col, Row } from 'react-bootstrap';
interface LoadersProps { }

const Loaders: FC<LoadersProps> = () => (
	<Fragment>
		<PageHeader title="Loaders" />
		<Row className="row-deck">
			<Col md={6} xl={6}>
				<Card>
					<Card.Header>
						<Card.Title as="h3">loaders1</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="dimmer active">
							<div className="spinner3">
								<div className="dot1"></div>
								<div className="dot2"></div>
							</div>
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6} xl={6}>
				<Card>
					<Card.Header>
						<Card.Title as="h3">loaders2</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="dimmer active">
							<div className="spinner4">
								<div className="bounce1"></div>
								<div className="bounce2"></div>
								<div className="bounce3"></div>
							</div>
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6} xl={6}>
				<Card>
					<Card.Header>
						<Card.Title as="h3">loaders3</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="dimmer active">
							<div className="sk-circle">
								<div className="sk-circle1 sk-child"></div>
								<div className="sk-circle2 sk-child"></div>
								<div className="sk-circle3 sk-child"></div>
								<div className="sk-circle4 sk-child"></div>
								<div className="sk-circle5 sk-child"></div>
								<div className="sk-circle6 sk-child"></div>
								<div className="sk-circle7 sk-child"></div>
								<div className="sk-circle8 sk-child"></div>
								<div className="sk-circle9 sk-child"></div>
								<div className="sk-circle10 sk-child"></div>
								<div className="sk-circle11 sk-child"></div>
								<div className="sk-circle12 sk-child"></div>
							</div>
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6} xl={6}>
				<Card>
					<Card.Header>
						<Card.Title as="h3">loaders4</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="dimmer active">
							<div className="sk-cube-grid">
								<div className="sk-cube sk-cube1"></div>
								<div className="sk-cube sk-cube2"></div>
								<div className="sk-cube sk-cube3"></div>
								<div className="sk-cube sk-cube4"></div>
								<div className="sk-cube sk-cube5"></div>
								<div className="sk-cube sk-cube6"></div>
								<div className="sk-cube sk-cube7"></div>
								<div className="sk-cube sk-cube8"></div>
								<div className="sk-cube sk-cube9"></div>
							</div>
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6} xl={6}>
				<Card>
					<Card.Header>
						<Card.Title as="h3">loaders5</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="dimmer active">
							<div className="sk-folding-cube">
								<div className="sk-cube1 sk-cube"></div>
								<div className="sk-cube2 sk-cube"></div>
								<div className="sk-cube4 sk-cube"></div>
								<div className="sk-cube3 sk-cube"></div>
							</div>
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6} xl={6}>
				<Card>
					<Card.Header>
						<Card.Title as="h3">loaders6</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="dimmer active">
							<div className="lds-hourglass"></div>
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6} xl={6}>
				<Card>
					<Card.Header>
						<Card.Title as="h3">loaders7</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="dimmer active">
							<div className="loader7">
								<span className="circles circle-1"></span>
								<span className="circles circle-2"></span>
								<span className="circles circle-3"></span>
								<span className="circles circle-4"></span>
								<span className="circles circle-5"></span>
							</div>
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6} xl={6}>
				<Card>
					<Card.Header>
						<Card.Title as="h3">loaders8</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="dimmer active">
							<div className="loader8">
								<div className="circle1 circle-1"></div>
								<div className="circle1 circle-2"></div>
								<div className="circle1 circle-3"></div>
								<div className="circle1 circle-4"></div>
								<div className="circle1 circle-5"></div>
							</div>
						</div>
					</Card.Body>
				</Card>
			</Col>
		</Row>
		<div className="row row-deck">
			<Col md={6}>
				<Card>
					<Card.Header>
						<Card.Title as="h3">loaders9</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="dimmer active">
							<div className="spinner">
								<div className="rect1"></div>
								<div className="rect2"></div>
								<div className="rect3"></div>
								<div className="rect4"></div>
								<div className="rect5"></div>
							</div>
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6}>
				<Card>
					<Card.Header>
						<Card.Title as="h3">loaders10</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="dimmer active">
							<div className="spinner1">
								<div className="double-bounce1"></div>
								<div className="double-bounce2"></div>
							</div>
						</div>
					</Card.Body>
				</Card>
			</Col>
		</div>
	</Fragment>
);

export default Loaders;
