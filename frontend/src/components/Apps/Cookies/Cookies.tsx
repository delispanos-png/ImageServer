import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../layout/Header/pageheader';
import CookieConsent from 'react-cookie-consent';

interface CookiesProps { }

const Cookies: FC<CookiesProps> = () => {

	//top Cookie
	const [showCookieConsent1, setShowCookieConsent1] = useState(false);

	const handleButtonClick1 = () => {
		setShowCookieConsent1(true)
	}
	//bottom Cookie
	const [showCookieConsent2, setShowCookieConsent2] = useState(false);

	const handleButtonClick2 = () => {
		setShowCookieConsent2(true)
	}
	//light Cookie
	const [showCookieConsent3, setShowCookieConsent3] = useState(false);

	const handleButtonClick3 = () => {
		setShowCookieConsent3(true)
	}
	//dark Cookie
	const [showCookieConsent4, setShowCookieConsent4] = useState(false);

	const handleButtonClick4 = () => {
		setShowCookieConsent4(true)
	}
	//primary Cookie
	const [showCookieConsent5, setShowCookieConsent5] = useState(false);

	const handleButtonClick5 = () => {
		setShowCookieConsent5(true)
	}
	// info Cookie
	const [showCookieConsent6, setShowCookieConsent6] = useState(false);

	const handleButtonClick6 = () => {
		setShowCookieConsent6(true)
	}
	// danger Cookie
	const [showCookieConsent7, setShowCookieConsent7] = useState(false);

	const handleButtonClick7 = () => {
		setShowCookieConsent7(true)
	}
	// success Cookie
	const [showCookieConsent8, setShowCookieConsent8] = useState(false);

	const handleButtonClick8 = () => {
		setShowCookieConsent8(true)
	}
	// warning Cookie
	const [showCookieConsent9, setShowCookieConsent9] = useState(false);

	const handleButtonClick9 = () => {
		setShowCookieConsent6(true)
	}
	return (
		<Fragment>
			<PageHeader title="Cookies" />
			<Row>
				<Col lg={12}>
					<Card>
						<Card.Header>
							<Card.Title>
								Cookies Position
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<div className="position-buttons">
								<Button onClick={handleButtonClick1}
									className="btn position-button mg-t-5 ms-2" variant='secondary' data-position="top">Top
									Cookie</Button>

								{showCookieConsent1 && (
									<CookieConsent debug={true} location="top" buttonText="Accept" style={{ background: '#efedf1', textAlign: 'left', color: '#000', zIndex: '99999999' }} buttonStyle={{ background: '#664dc9', borderRadius: '2px', color: '#fff' }}>WE CARE ABOUT YOUR PRIVACY <br />By using this site, you agree to our use of cookies, Terms And Conditions.
									</CookieConsent>
								)}
								<Button onClick={handleButtonClick2}
									className="btn position-button mg-t-5 ms-2" variant='info' data-position="top">Bottom
									Cookie</Button>

								{showCookieConsent2 && (
									<CookieConsent debug={true} location="bottom" buttonText="Accept" style={{ background: '#efedf1', textAlign: 'left', color: '#000', zIndex: '99999999' }} buttonStyle={{ background: '#664dc9', borderRadius: '2px', color: '#fff' }}>WE CARE ABOUT YOUR PRIVACY <br />By using this site, you agree to our use of cookies, Terms And Conditions.
									</CookieConsent>
								)}
							</div>
						</Card.Body>
					</Card>
					<Card>
						<Card.Header>
							<Card.Title>
								Cookies Background
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<div id="theme-buttons" className="theme-buttons">
								<Button onClick={handleButtonClick3} className="btn  theme-button mg-t-5 me-2 mt-2" variant='light'
									data-theme1="theme-light">Light</Button>
								{showCookieConsent3 && (
									<CookieConsent debug={true} location="bottom" buttonText="Accept" style={{ background: '#efedf1', textAlign: 'left', color: '#000', zIndex: '99999999' }} buttonStyle={{ background: '#d1d1dd', borderRadius: '2px', color: '#fff' }}>WE CARE ABOUT YOUR PRIVACY <br />By using this site, you agree to our use of cookies, Terms And Conditions.
									</CookieConsent>
								)}
								<Button onClick={handleButtonClick4} className="btn  theme-button mg-t-5 me-2 mt-2" variant='dark'
									data-theme1="theme-light">Dark</Button>
								{showCookieConsent4 && (
									<CookieConsent debug={true} location="bottom" buttonText="Accept" style={{ background: '#343a40', textAlign: 'left', color: '#fff', zIndex: '99999999' }} buttonStyle={{ background: '#62666a', borderRadius: '2px', color: '#fff' }} >WE CARE ABOUT YOUR PRIVACY <br />By using this site, you agree to our use of cookies, Terms And Conditions.
									</CookieConsent>
								)}
								<Button onClick={handleButtonClick5} className="btn  theme-button mg-t-5 me-2 mt-2" variant='primary'
									data-theme1="theme-light">Primary</Button>
								{showCookieConsent5 && (
									<CookieConsent debug={true} location="bottom" buttonText="Accept" style={{ background: '#664dc9', textAlign: 'left', color: '#fff', zIndex: '99999999' }} buttonStyle={{ background: '#8571d4', borderRadius: '2px', color: '#fff' }}>WE CARE ABOUT YOUR PRIVACY <br />By using this site, you agree to our use of cookies, Terms And Conditions.
									</CookieConsent>
								)}
								<Button onClick={handleButtonClick6} className="btn  theme-button mg-t-5 me-2 mt-2" variant='info'
									data-theme1="theme-light">Info</Button>
								{showCookieConsent6 && (
									<CookieConsent debug={true} location="bottom" buttonText="Accept" style={{ background: '#3e80eb', textAlign: 'left', color: '#fff', zIndex: '99999999' }} buttonStyle={{ background: '#6abbf5', borderRadius: '2px', color: '#fff' }}>WE CARE ABOUT YOUR PRIVACY <br />By using this site, you agree to our use of cookies, Terms And Conditions.
									</CookieConsent>
								)}
								<Button onClick={handleButtonClick7} className="btn  theme-button mg-t-5 me-2 mt-2" variant='danger'
									data-theme1="theme-light">Danger</Button>
								{showCookieConsent7 && (
									<CookieConsent debug={true} location="bottom" buttonText="Accept" style={{ background: '#dc0441', textAlign: 'left', color: '#fff', zIndex: '99999999' }} buttonStyle={{ background: '#e33667', borderRadius: '2px', color: '#fff' }}>WE CARE ABOUT YOUR PRIVACY <br />By using this site, you agree to our use of cookies, Terms And Conditions.
									</CookieConsent>
								)}
								<Button onClick={handleButtonClick8} className="btn  theme-button mg-t-5 me-2 mt-2" variant='success'
									data-theme1="theme-light">Success</Button>
								{showCookieConsent8 && (
									<CookieConsent debug={true} location="bottom" buttonText="Accept" style={{ background: '#38cb89', textAlign: 'left', color: '#000', zIndex: '99999999' }} buttonStyle={{ background: '#57d8a1', borderRadius: '2px', color: '#fff' }}>WE CARE ABOUT YOUR PRIVACY <br />By using this site, you agree to our use of cookies, Terms And Conditions.
									</CookieConsent>
								)}
								<Button onClick={handleButtonClick9} className="btn  theme-button mg-t-5 me-2 mt-2" variant='warning'
									data-theme1="theme-light">Warning</Button>
								{showCookieConsent9 && (
									<CookieConsent debug={true} location="bottom" buttonText="Accept" style={{ background: '#ecb403', textAlign: 'left', color: '#000', zIndex: '99999999' }} buttonStyle={{ background: '#f0c335', borderRadius: '2px', color: '#fff' }}>WE CARE ABOUT YOUR PRIVACY <br />By using this site, you agree to our use of cookies, Terms And Conditions.
									</CookieConsent>
								)}
							</div>
						</Card.Body>
					</Card>
					<Card>
						<Card.Header>
							<Card.Title>
								Customize Cookie Text
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Row>
								<Col md={6}>
									<div className="form-group">
										<input type="text" className="form-control" name="customHeader"
											id="customHeader" defaultValue="" placeholder="Popup Header Text..." />
									</div>
									<div className="form-group">
										<input type="text" className="form-control" name="customSubHeader"
											id="customSubHeader" defaultValue=""
											placeholder="Popup Sub Header Text..." />
									</div>
									<div className="form-group">
										<input type="text" className="form-control" name="customAccept"
											id="customAccept" defaultValue="" placeholder="Accept Button Text..." />
									</div>
									<div className="form-group">
										<input type="text" className="form-control" name="customLearnMore"
											id="customLearnMore" defaultValue=""
											placeholder="Learn More Button Text..." />
									</div>
									<div className="form-group">
										<input type="text" className="form-control" name="customLearnMoreInfo"
											id="customLearnMoreInfo" defaultValue=""
											placeholder="Learn More Info Text..." />
									</div>
									<div>
										<Link to="#"
											className="btn btn-primary px-6 option-button"
											data-option="customtext">Apply</Link>
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
};

export default Cookies;


