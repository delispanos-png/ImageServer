import React, { FC, Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';

interface UnderConstructionProps {}

const UnderConstruction: FC<UnderConstructionProps> = () => {
    document.body.classList.add("construction", "login-page");
	let [days, setdays] = useState<any>()
	let [hours, sethours] = useState<any>()
	let [minutes, setminutes] = useState<any>()
	let [seconds, setseconds] = useState<any>()
	useEffect(() => {
		let countDown = new Date('May 31, 2023 00:00:00').getTime();
		let time = setInterval(() => {
			let now = new Date().getTime();
			let distance = countDown + now;
			setdays(Math.floor(distance / (1000 * 60 * 60 * 24)))
			sethours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
			setminutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
			setseconds(Math.floor((distance % (1000 * 60)) / 1000))

			if (distance < 0) {
				clearInterval(time);
			}
		}, 1000)
	});
	return(

  <Fragment>
   	<div className="page relative">
		<div className="page-content">
			<div className="container text-center">
				<div className="row justify-content-center">
					<Col md={6}>
						<div className="custom-content">
							<div className="text-white">
								<Card.Body>
									<h2 className="display-3 mb-2 font-weight-bold error-text"><strong>Under
											Construction</strong></h2>
									<h4 className="text-white-80 mb-5">Our website is in Under construction</h4>
									<div id="launch_date" className="is-countdown">
										<ul className="countdown">
											<li><span className="number">{days}</span><br/><span className="time">Days</span></li>
											<li><span className="number">{hours}</span><br/><span className="time">Hours</span></li>
											<li><span className="number">{minutes}</span><br/><span className="time">Minutes</span></li>
											<li><span className="number">{seconds}</span><br/><span className="time">Seconds</span></li>
											</ul>
											</div>
								</Card.Body>
									<InputGroup className="input-group mb-7">
										<Form.Control  placeholder="Enter Your Email" type="text" id="InputGroup"/>
										<Button className="btn br-ts-0 br-bs-0 " variant='primary' type="button">
										Notify
										</Button>
									</InputGroup>
								<div className="custom-btns">
									<Button className="btn btn-icon" variant='' type="button">
										<i className="fa fa-facebook-f"></i>
									</Button>
									<Button className="btn btn-icon" variant='' type="button">
										<i className="fa fa-google"></i>
									</Button>
									<Button className="btn btn-icon" variant='' type="button">
										<i className="fa fa-twitter"></i>
									</Button>
									<Button className="btn btn-icon" variant='' type="button">
										<i className="fa fa-pinterest-p"></i>
									</Button>
								</div>
							</div>
						</div>
					</Col>
				</div>
			</div>
		</div>
	</div>
  </Fragment>
)
	};

export default UnderConstruction;
