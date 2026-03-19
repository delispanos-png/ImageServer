import React, { FC, Fragment } from 'react';
import PageHeader from '../../../layout/Header/pageheader';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

function Notifications() {
	const DefaultTostify = () => {
		toast.success(
			<h6 className="text-white tx-16 mb-0">Success: Well done Details Submitted Successfully</h6>,
			{
				position: toast.POSITION.TOP_RIGHT,
				hideProgressBar: true,
				autoClose: 2000,
				closeButton: false,
				theme: 'colored'
			}
		)
	};
	//default notification center
	const CenterToastify = () => {
		toast.error(
			<h6 className="text-white tx-16 mb-0">Oops! An Error Occurred</h6>,
			{
				position: toast.POSITION.TOP_CENTER,
				hideProgressBar: true,
				autoClose: 2000,
				closeButton: false,
				theme: 'colored',

			}
		)
	};
	//default notification left
	const LeftNotifier = () => {
		toast.warn(
			<h6 className="text-white tx-16 mb-0">Warning: Something Went Wrong</h6>,
			{
				position: toast.POSITION.TOP_LEFT,
				hideProgressBar: true,
				autoClose: 2000,
				closeButton: false,
				theme: 'colored',
			}
		)
	};
	//default notification center info
	const InfoToastify = () => {
		toast.info(
			<h6 className="text-white tx-16 mb-0">info:some info here.</h6>,
			{
				position: toast.POSITION.TOP_CENTER,
				hideProgressBar: true,
				autoClose: 2000,
				closeButton: false,
				theme: 'colored'
			}
		)
	};
	//default notification center error
	const DangerNotifier = () => {
		toast.error(
			<h6 className="text-white tx-16 mb-0">Error:this error will stay here until you click it.</h6>,
			{
				position: toast.POSITION.TOP_CENTER,
				hideProgressBar: true,
				autoClose: 2000,
				closeButton: false,
				theme: 'colored'
			}
		)
	};
	//default notification center warn
	const WarningNotifier = () => {
		toast.warn(
			<h6 className="text-white tx-16 mb-0">Opacity is cool!.</h6>,
			{
				position: toast.POSITION.TOP_CENTER,
				hideProgressBar: true,
				autoClose: 2000,
				closeButton: false,
				theme: 'colored'
			}
		)
	};
	//side alert notification primary
	const PrimaryNotifier = () => {
		toast.success(
			<h6 className="text-white tx-16 mb-0">Notice!<br /> you have 4 notifications </h6>,
			{
				position: toast.POSITION.TOP_RIGHT,
				hideProgressBar: true,
				autoClose: 2000,

				theme: 'colored'
			}
		)
	};
	//side alert notification warning
	const WarningToastify = () => {
		toast.warn(
			<h6 className="text-white tx-16 mb-0">Warning!<br />read all details carefully. </h6>,
			{
				position: toast.POSITION.TOP_RIGHT,
				hideProgressBar: true,
				autoClose: 2000,

				theme: 'colored'
			}
		)
	};
	//side alert notification danger
	const DangeNotifier = () => {
		toast.error(
			<h6 className="text-white tx-16 mb-0">Error!<br />please check your details.... file is missing. </h6>,
			{
				position: toast.POSITION.TOP_RIGHT,
				hideProgressBar: true,
				autoClose: 2000,

				theme: 'colored'
			}
		)
	};

	return (
		<Fragment>
			<PageHeader title="Notify" />
			<Row className="row">
				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Alerts Styles Notifications</Card.Title>
						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								<Button variant="success" onClick={DefaultTostify}>Default</Button>
								<Button variant="danger" onClick={CenterToastify}>Center</Button>
								<Button variant="warning" onClick={LeftNotifier}>Left</Button>
								<Button variant="info" onClick={InfoToastify}>Center Info</Button>
								<Button variant="danger" onClick={DangerNotifier}>Center Error</Button>
								<Button variant="warning" onClick={WarningNotifier}>Center Warning</Button>
								<ToastContainer />
							</div>
						</Card.Body>
					</Card>
					<Card>
						<Card.Header>
							<Card.Title>Side Alerts Notifications</Card.Title>
						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								<Button className=" notice" variant="success" onClick={PrimaryNotifier}>Primary</Button>
								<Button className="warning" variant="warning" onClick={WarningToastify}>Warning</Button>
								<Button className="error" variant="danger" onClick={DangeNotifier}>Danger</Button>
							</div>
						</Card.Body>
					</Card>
					<Card>
						<Card.Header>
							<Card.Title>Alerts Popovers</Card.Title>
						</Card.Header>
						<Card.Body className="card-body text-center">
							{['bottom'].map((placement: any) => (
								<OverlayTrigger
									trigger="click"
									key={placement}
									placement={placement}
									overlay={
										<div id={`div-positioned-${placement}`}>
											<Popover.Header as="h3">alert sucess</Popover.Header>
											<Popover.Body>
												<div className="div-arrow">
													<strong id="alert sucess"
														data-bs-container="body"
														data-bs-placement="bottom"
														data-bs-popover-color="default4"
														title="alert sucess"
													>
														Well done! You successfully read this<br /> important alert message..
													</strong>
												</div>
											</Popover.Body>
										</div>
									}
								>
									<Button className=" me-2 mb-2" variant='success'>Show success</Button>
								</OverlayTrigger>
							))}
							{['top'].map((placement: any) => (
								<OverlayTrigger
									trigger="click"
									key={placement}
									placement={placement}
									overlay={
										<div id={`div-positioned-${placement}`}>
											<Popover.Header as="h3">alert info</Popover.Header>
											<Popover.Body>
												<div className="div-arrow">
													<strong id="alert sucess"
														data-bs-container="body"
														data-bs-placement="top"
														data-bs-popover-color="default5"
														title="alert info"
													>
														Heads up! This alert needs your<br /> attention, but it's not super<br /> important...
													</strong>
												</div>
											</Popover.Body>
										</div>
									}
								>
									<Button className=" me-2 mb-2" variant='info'>Show info</Button>
								</OverlayTrigger>
							))}
							{['bottom'].map((placement: any) => (
								<OverlayTrigger
									trigger="click"
									key={placement}
									placement={placement}
									overlay={
										<div id={`div-positioned-${placement}`}>
											<Popover.Header as="h3">alert warning</Popover.Header>
											<Popover.Body>
												<div className="div-arrow">
													<strong id="alert warning"
														data-bs-container="body"
														data-bs-placement="bottom"
														data-bs-popover-color="default6"
														title="alert warning"
													>
														Warning! Best check yo self, you're not<br /> looking too good..
													</strong>
												</div>
											</Popover.Body>
										</div>
									}
								>
									<Button className="me-2 mb-2" variant='warning'>Show warning</Button>
								</OverlayTrigger>
							))}
							{['top'].map((placement: any) => (
								<OverlayTrigger
									trigger="click"
									key={placement}
									placement={placement}
									overlay={
										<div id={`div-positioned-${placement}`}>
											<Popover.Header as="h3">alert secondary</Popover.Header>
											<Popover.Body>
												<div className="div-arrow">
													<strong id="alert secondary"
														data-bs-container="body"
														data-bs-placement="top"
														data-bs-popover-color="default5"
														title="alert secondary"
													>
														Error! Please Check u r emial id..
													</strong>
												</div>
											</Popover.Body>
										</div>
									}
								>
									<Button className="me-2 mb-2" variant='secondary'>Show secondary</Button>
								</OverlayTrigger>
							))}
							{['bottom'].map((placement: any) => (
								<OverlayTrigger
									trigger="click"
									key={placement}
									placement={placement}
									overlay={
										<div id={`div-positioned-${placement}`}>
											<Popover.Header as="h3">alert danger</Popover.Header>
											<Popover.Body>
												<div className="div-arrow">
													<strong id="alert danger"
														data-bs-container="body"
														data-bs-placement="bottom"
														data-bs-popover-color="default6"
														title="alert danger"
													>
														Oh snap! Change a few things up and<br /> try submitting again.
													</strong>
												</div>
											</Popover.Body>
										</div>
									}
								>
									<Button className="me-2 mb-2" variant='danger'>Show danger</Button>
								</OverlayTrigger>
							))}
							{['top'].map((placement: any) => (
								<OverlayTrigger
									trigger="click"
									key={placement}
									placement={placement}
									overlay={
										<div id={`div-positioned-${placement}`}>
											<Popover.Header as="h3">alert primary</Popover.Header>
											<Popover.Body>
												<div className="div-arrow">
													<strong id="alert primary"
														data-bs-container="body"
														data-bs-placement="top"
														data-bs-popover-color="default5"
														title="alert primary"
													>
														Cool! This alert will close in 3 seconds.<br /> The data-delay attribute is in<br /> milliseconds.
													</strong>
												</div>
											</Popover.Body>
										</div>
									}
								>
									<Button className="me-2 mb-2" variant='primary'>Show primary</Button>
								</OverlayTrigger>
							))}

						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
}
export default Notifications;
