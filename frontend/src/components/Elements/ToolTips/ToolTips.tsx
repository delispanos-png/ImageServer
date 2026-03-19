import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Col, Collapse, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import { defaultTooltip, colorTooltip } from '../../../components/Elements/ToolTips/Data/Tooltipsdata';
interface ToolTipsProps { }

const ToolTips: FC<ToolTipsProps> = () => {
	const [show, setShow] = useState(false);
	const [show1, setShow1] = useState(false);
	return (

		<Fragment>
			<PageHeader title="Tooltips" />
			<Row>
				<Col lg={12}>
					<Card id="Tooltip">
						<Card.Header>
							<Card.Title>
								Default Tooltip
							</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
						</Card.Header>
						<Card.Body>
							<div className="form-label mb-2">
								Static Example
							</div>
							<div className="tooltip-static-demo mb-4 border br-3">
								<Row>
									<Col sm={6} lg={3} mb={1}>
										<div className="tooltip bs-tooltip-top" role="tooltip">
											<div className="tooltip-arrow"></div>
											<div className="tooltip-inner">
												Tooltip on the top
											</div>
										</div>
									</Col>
									<Col sm={6} lg={3} mg-t={30} mg-sm-t={0}>
										<div className="tooltip bs-tooltip-bottom" role="tooltip">
											<div className="tooltip-arrow"></div>
											<div className="tooltip-inner">
												Tooltip on the bottom
											</div>
										</div>
									</Col>
									<Col sm={6} lg={3} mg-t={30} mg-sm-t={0} mb={1}>
										<div className="tooltip bs-tooltip-start" role="tooltip">
											<div className="tooltip-arrow"></div>
											<div className="tooltip-inner">
												Tooltip on the left
											</div>
										</div>
									</Col>
									<Col sm={6} lg={3} mg-t={30} mg-sm-t={0}>
										<div className="tooltip bs-tooltip-end" role="tooltip">
											<div className="tooltip-arrow"></div>
											<div className="tooltip-inner">
												Tooltip on the right
											</div>
										</div>
									</Col>
								</Row>
							</div>
							<div className="form-label mb-2">
								Example
							</div>
							<div className="bg-light px-4 pt-4 pb-2 border br-3">
								<div className="row  text-center">
									{defaultTooltip.map((defaultTooltips) => (
										<Col sm={6} lg={3} className='mb-3' key={Math.random()}>
											<OverlayTrigger
												placement={defaultTooltips.placement}
												delay={{ show: 250, hide: 400 }}
												overlay={
													<Tooltip className="primary">{defaultTooltips.title}</Tooltip>
												}
											>
												<Button variant="secondary">{defaultTooltips.heading} </Button>
											</OverlayTrigger>

										</Col>
									))}

								</div>
							</div>
						</Card.Body>
						<Collapse in={show} className="">
							<pre>
								<code>
									{`

{defaultTooltip.map((defaultTooltips)=> (
<Col sm={6} lg={3} mb={3} key={Math.random()}>
<OverlayTrigger
		placement={defaultTooltips.placement}
		delay={{ show: 250, hide: 400 }}
		overlay={
			<Tooltip className='bg-dark'>{defaultTooltips.title}</Tooltip>
		}
	>
		<Button className='mt-2' variant='primary'>{defaultTooltips.heading}</Button>
		</OverlayTrigger>
	
</Col>
))}

`}
								</code>
							</pre>
						</Collapse>
					</Card>
					<Card id="Tooltip1">
						<Card.Header>
							<Card.Title>
								Color Tooltip
							</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
						</Card.Header>
						<Card.Body>
							<div className="form-label  mb-2">
								Static Example
							</div>
							<div className="tooltip-static-demo mb-4 border br-3">
								<Row>
									<Col sm={6} lg={3} my={1}>
										<div className="tooltip tooltip-primary bs-tooltip-top" role="tooltip">
											<div className="tooltip-arrow"></div>
											<div className="tooltip-inner">
												Tooltip on the top
											</div>
										</div>
									</Col>
									<Col sm={6} lg={3} mg-t={30} mg-sm-t={0}>
										<div className="tooltip tooltip-primary bs-tooltip-bottom"
											role="tooltip">
											<div className="tooltip-arrow"></div>
											<div className="tooltip-inner">
												Tooltip on the bottom
											</div>
										</div>
									</Col>
									<Col sm={6} lg={3} mg-t={30} mg-lg-t={0}>
										<div className="tooltip tooltip-primary bs-tooltip-start"
											role="tooltip">
											<div className="tooltip-arrow"></div>
											<div className="tooltip-inner">
												Tooltip on the left
											</div>
										</div>
									</Col>
									<Col sm={6} lg={3} mg-t={30} mg-lg-t={0}>
										<div className="tooltip tooltip-primary bs-tooltip-end" role="tooltip">
											<div className="tooltip-arrow"></div>
											<div className="tooltip-inner">
												Tooltip on the right
											</div>
										</div>
									</Col>
								</Row>
							</div>
							<div className="form-label mb-2">
								Example
							</div>
							<div className="bg-light px-4 pt-4 pb-2 border br-3">
								<Row className="row  text-center">
									{colorTooltip.map((colorTooltips) => (
										<Col sm={6} lg={3} className='mb-3' key={Math.random()}>

											<OverlayTrigger
												placement={colorTooltips.placement}
												delay={{ show: 250, hide: 400 }}
												overlay={
													<Tooltip className="tooltip tooltip-primary">{colorTooltips.title}</Tooltip>
												}
											>
												<Button variant="primary">{colorTooltips.heading} </Button>
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
{colorTooltip.map((colorTooltips)=> (
	<Col sm={6} lg={3} mb={3}>

	<OverlayTrigger
			placement={colorTooltips.placement}
			delay={{ show: 250, hide: 400 }}
			overlay={
				<Tooltip className="primary">{colorTooltips.title}</Tooltip>
			}
		>
			<Button variant="primary">{colorTooltips.heading} </Button>
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

export default ToolTips;
