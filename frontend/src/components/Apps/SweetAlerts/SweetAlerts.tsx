import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import Swal from "sweetalert2";
interface SweetAlertsProps { }

const SweetAlerts: FC<SweetAlertsProps> = () => {

	const [title, settitle] = useState("Your message")
	const [message, setmessage] = useState("Your message")


	//Successalert
	let Successalert = () => {
		Swal.fire({
			title: "Congratulations!",
			icon: "success",
			allowOutsideClick: false,
			confirmButtonText: "ok",
			cancelButtonColor: "#6259ca",
			text: "Your message has been succesfully sent",
		});
	}
	//Warningalert
	let Warningalert = () => {
		Swal.fire({
			title: "Some Risk File Is Founded",
			icon: "warning",
			allowOutsideClick: false,
			showCancelButton: true,
			cancelButtonText: "Stay This page",
			confirmButtonText: "Exit",
			cancelButtonColor: "#6259ca",
			text: "Some Virus file is detected your system going to be in Risk",
		});
	}
	//Dangeralert
	let Dangeralert = () => {
		Swal.fire({
			title: "Something Went Wrong",
			icon: "error",
			allowOutsideClick: false,
			confirmButtonText: "Exit",
			showCancelButton: true,
			cancelButtonText: "Stay This page",
			cancelButtonColor: "#6259ca",
			text: "Please fix the issue the issue file not loaded & items not found",
		});
	}
	//Infoalert
	let Infoalert = () => {
		Swal.fire({
			title: "Notification Alert",
			icon: "info",
			allowOutsideClick: false,
			confirmButtonText: "Exit",
			showCancelButton: true,
			cancelButtonText: "Stay This page",
			cancelButtonColor: "#6259ca",
			text: "your getting some notification from mail please check it",
		});
	}
	//Primaryalertbutton
	let Primaryalertbutton = () => {
		Swal.fire({
			text: "New Notification from Azea",
			allowOutsideClick: false,
			confirmButtonText: "ok",
		});
	}
	//Secondaryalertbutton
	let Secondaryalertbutton = () => {
		Swal.fire({
			title: "Notifiaction Styles",
			text: "New Notification from Azea",
			allowOutsideClick: false,
			confirmButtonText: "ok",
		});
	}
	//Infoalertbutton
	let Infoalertbutton = () => {
		Swal.fire({
			title: 'Notifiaction Styles',
			text: 'New Notification from Azea',
			imageUrl: "http://localhost:5173/src/assets/images/brand/favicon.png",
			imageWidth: 100,
			imageHeight: 100,
			imageAlt: 'Custom image',
		})
	}
	//Warningalertbutton
	let Warningalertbutton = () => {
		Swal.fire({
			title: "Notifiaction Styles",
			allowOutsideClick: false,
			text: "New Notification from Azea(close after 2seconds)",
			showConfirmButton: false,
			timer: 2000,
		});
	}
	//Confirmalert
	let Confirmalert = () => {
		Swal.fire({
			title: "Notifiaction Styles",
			icon: "warning",
			allowOutsideClick: false,
			confirmButtonText: "Exit",
			showCancelButton: true,
			cancelButtonText: "Stay This page",
			cancelButtonColor: "#6259ca",
			text: "New Notification from Azea",
		});
	}
	//Promptalert
	let Promptalert = () => {
		Swal.fire({
			title: "Notification Alert",
			text: "your getting some notification from mail please check it",
			confirmButtonText: "ok",
			showCancelButton: true,
			cancelButtonText: "cancel",
			cancelButtonColor: "#6259ca",
		});
	}
	return (

		<Fragment>
			<PageHeader title="Sweet Alerts" />
			<Row>
				<Col sm={12}>
					<Card>
						<Card.Header>
							<Card.Title>Sample Sweet Alerts</Card.Title>
						</Card.Header>
						<Card.Body>
							<Button type='button' className="mt-2 me-1" variant="success" onClick={() => { Successalert() }}
								id='click'> success alert</Button>
							<Button type='button' className="mt-2 me-1" variant="warning" onClick={() => { Warningalert() }}
								id='click1'>Warning alert</Button>
							<Button type='button' className=" mt-2 me-1" variant="danger" onClick={() => { Dangeralert() }}
								id='click2'>Danger alert</Button>
							<Button type='button' className=" mt-2 me-1" id='click3' variant="info" onClick={() => { Infoalert() }}>Info alert</Button>
						</Card.Body>
					</Card>
					<Card>
						<Card.Header>
							<Card.Title>Forms Sweet-alert</Card.Title>
						</Card.Header>
						<Card.Body>
							<div className="form-group">

								<label>Title</label>
								<input type="text" className="form-control" placeholder="Title text" id="title" onChange={(ele) => { settitle(ele.target.value) }} />
							</div>
							<div className="form-group">
								<label>Message</label>
								<input type="text" className="form-control" placeholder="Your message" id="message" onChange={(ele) => { setmessage(ele.target.value) }} />
							</div>
							<Button type='button' className=" mt-2" variant="primary" onClick={() => { Primaryalertbutton() }}
								id='but1'>Simple alert</Button>&nbsp;
							<Button type='button' className=" mt-2" variant='secondary' onClick={() => { Secondaryalertbutton() }}
								id='but2'>Alert with title</Button>&nbsp;
							<Button type='button' className="mt-2" variant="info" onClick={() => { Infoalertbutton() }}
								id='but3'>Alert with image</Button>&nbsp;
							<Button type='button' className="mt-2" id='but4' variant="warning" onClick={() => { Warningalertbutton() }}>With timer</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col sm={12}>
					<Card>
						<Card.Header>
							<Card.Title>Prompt and confirm box Demo</Card.Title>
						</Card.Header>
						<Card.Body>
							<Button type='button' className=" me-1" id='prompt' variant="secondary" onClick={() => { Promptalert() }} >Prompt</Button>
							<Button type='button' className="" id='confirm' variant="primary" onClick={() => { Confirmalert() }}>Confirm</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
};

export default SweetAlerts;
