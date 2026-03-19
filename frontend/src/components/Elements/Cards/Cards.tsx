import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Col, Collapse, Form, InputGroup, Nav, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages';
import PageHeader from '../../../layout/Header/pageheader';
import { caredalerts, basiccards, cardloaders } from '../../../components/Elements/Cards/Data/CardsData';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function Cards() {

	//Fullscreen
	const [fullExpanded, setfullExpanded] = useState(true)

	const fullHandleExpandClick = () => {
		setfullExpanded(!fullExpanded)
	}
	const [fullshow, setfullshow] = useState(true)
	//Card with Switch
	const [modaltoggle, setmodaltoggle] = useState(true)
	//Built card
	const [BasicExpanded, setBasicExpanded] = useState(true)

	const BasicHandleExpandClick = () => {
		setBasicExpanded(!BasicExpanded)
	}
	const [Basicshow, setBasicshow] = useState(true)
	//Card Blue
	const [BlueExpanded, setBlueExpanded] = useState(true)

	const BlueHandleExpandClick = () => {
		setBlueExpanded(!BlueExpanded)
	}
	const [Blueshow, setBlueshow] = useState(true)

	//Card status on left side
	const [StatusExpanded, setStatusExpanded] = useState(true)

	const StatusHandleExpandClick = () => {
		setStatusExpanded(!StatusExpanded)
	}
	const [Statusshow, setStatusshow] = useState(true)

	const [expanded6, setExpanded6] = useState(false);

	const handleExpandClick6 = () => {
		setExpanded6(!expanded6);
	};
	const [show6, setShow6] = useState(true);


	//Basics card
	const [BasicsExpanded, setBasicsExpanded] = useState(true)

	const BasicsHandleExpandClick = () => {
		setBasicsExpanded(!BasicsExpanded)
	}
	const [Basicsshow, setBasicsshow] = useState(true)
	//Basics1 card
	const [Basics1Expanded, setBasics1Expanded] = useState(true)

	const Basics1HandleExpandClick = () => {
		setBasics1Expanded(!Basics1Expanded)
	}
	const [Basics1show, setBasics1show] = useState(true)

	//Basic Color Card Header
	const [ColorExpanded, setColorExpanded] = useState(true)

	const ColorHandleExpandClick = () => {
		setColorExpanded(!ColorExpanded)
	}
	const [Colorshow, setColorshow] = useState(true)
	//Basic Color Card Footer 
	const [FooterExpanded, setFooterExpanded] = useState(true)

	const FooterHandleExpandClick = () => {
		setFooterExpanded(!FooterExpanded)
	}
	const [Footershow, setFootershow] = useState(true)

	//Primary card
	const [PrimaryExpanded, setPrimaryExpanded] = useState(true)

	const PrimaryHandleExpandClick = () => {
		setPrimaryExpanded(!PrimaryExpanded)
	}
	const [Primaryshow, setPrimaryshow] = useState(true)
	//Secondary card
	const [SecondaryExpanded, setSecondaryExpanded] = useState(true)

	const SecondaryHandleExpandClick = () => {
		setSecondaryExpanded(!SecondaryExpanded)
	}
	const [Secondaryshow, setSecondaryshow] = useState(true)
	//Alert card
	const [AlertExpanded, setAlertExpanded] = useState(true)

	const AlertHandleExpandClick = () => {
		setAlertExpanded(!AlertExpanded)
	}
	const [Alertshow, setAlertshow] = useState(true)
	//Alert1 card
	const [Alert1Expanded, setAlert1Expanded] = useState(true)

	const Alert1HandleExpandClick = () => {
		setAlert1Expanded(!Alert1Expanded)
	}
	const [Alert1show, setAlert1show] = useState(true)
	//Loader card
	const [LoaderExpanded, setLoaderExpanded] = useState(true)

	const LoaderHandleExpandClick = () => {
		setLoaderExpanded(!LoaderExpanded)
	}
	const [Loadershow, setLoadershow] = useState(true)
	//Loader1 card
	const [Loader1Expanded, setLoader1Expanded] = useState(true)

	const Loader1HandleExpandClick = () => {
		setLoader1Expanded(!Loader1Expanded)
	}
	const [Loader1show, setLoader1show] = useState(true)
	// const Cards: FC<CardsProps> =() => (
	//FullScreen
	const screendata = () => {
		document.querySelector(".card")?.classList.toggle("card-fullscreen")
	}
	
	return (
		<Fragment>
			<PageHeader title="Cards" />
			<Row>

				<Col md={6} lg={4}>
					{fullshow ?
						<Card className="card">
							<Card.Header>
								<Card.Title>fullscreen button</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={fullHandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i className={`fe ${fullExpanded ? 'fe fe-chevron-up' : 'fe fe-chevron-down'}`}></i></Link>
									<Link to="#" className="card-options-fullscreen me-2"
										data-bs-toggle="card-fullscreen"><i className="fe fe-maximize" onClick={() => screendata()}></i></Link>
									<Link to="#" onClick={() => setfullshow(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x"></i></Link>
								</div>
							</Card.Header>

							<Collapse in={fullExpanded} timeout={350}>
								<Card.Body>
									Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
									eu
									fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
									culpa
									qui officia deserunt mollit anim id est laborum
								</Card.Body>
							</Collapse>
						</Card>
						: null}
				</Col>
				<Col md={6} lg={4}>
					<Card>
						<Card.Header>
							<Card.Title>Card with switch</Card.Title>
							<div className="card-options">
								<label className="custom-switch m-0">
									<input type="checkbox" value="1" className="custom-switch-input" defaultChecked onClick={() => { setmodaltoggle(modaltoggle) }} />
									<span className="custom-switch-indicator"></span>
								</label>
							</div>
						</Card.Header>
						{modaltoggle && (
							<Card.Body>
								Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
								eu
								fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
								culpa
								qui officia deserunt mollit anim id est laborum
							</Card.Body>
						)}
					</Card>
				</Col>
				<Col lg={4} md={6}>
					{show6 ? <Card className="">
						<Card.Header className="justify-content-between">
							<h3 className="card-title">Initial collapsed</h3>
							<div className="rtlcards">
								<Link onClick={handleExpandClick6} aria-expanded={expanded6} aria-label="show more" to={''}>
									<ExpandMoreIcon />
								</Link>
								<IconButton
									size="small"
									edge="start"
									color="inherit"
									onClick={() => setShow6(false)}
									aria-label="close"
								>
									<CloseIcon fontSize="small" />
								</IconButton>
							</div>
						</Card.Header>
						<Collapse in={expanded6} timeout={3000}>
							<div className="card-body">
								Duis aute irure dolor in reprehenderit in voluptate velit esse
								cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
								cupidatat non proident, sunt in culpa qui officia deserunt mollit
								anim id est laborum
							</div>
						</Collapse>
					</Card> : null}
				</Col>
				<Col md={6} lg={4}>
					{Basicshow ?
						<Card>
							<Card.Header>
								<Card.Title>Built card</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={BasicHandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i className={`fe ${BasicExpanded ? 'fe fe-chevron-up' : 'fe fe-chevron-down'}`}></i></Link>
									<Link to="#" onClick={() => setBasicshow(false)}
										className="card-options-remove"
										data-bs-toggle="card-remove"
									><i className="fe fe-x"></i></Link>
								</div>
							</Card.Header>
							<Collapse in={BasicExpanded} timeout={5000}>
								<Card.Body>
									Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
									eu
									fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
									culpa
									qui officia deserunt mollit anim id est laborum
								</Card.Body>
							</Collapse>
						</Card>
						: null}
				</Col>
				<Col md={6} lg={4}>
					{Blueshow ?
						<Card className=" overflow-hidden">
							<div className="card-status bg-blue"></div>
							<Card.Header>
								<Card.Title>Card blue</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={BlueHandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i className={`fe ${BlueExpanded ? 'fe fe-chevron-up' : 'fe fe-chevron-down'}`}></i></Link>
									<Link to="#" onClick={() => setBlueshow(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x"></i></Link>
								</div>
							</Card.Header>
							<Collapse in={BlueExpanded} timeout={3000}>
								<Card.Body>
									Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
									eu
									fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
									culpa
									qui officia deserunt mollit anim id est laborum
								</Card.Body>
							</Collapse>
						</Card>
						: null}
				</Col>
				<Col md={6} lg={4}>
					{Statusshow ?
						<Card className=" overflow-hidden">
							<div className="card-status card-status-left bg-red br-bs-7 br-ts-7"></div>
							<Card.Header>
								<Card.Title>Card status on left side</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={StatusHandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i className={`${StatusExpanded ? "fe fe-chevron-up" : "fe fe-chevron-down"}`}></i></Link>
									<Link to="#" onClick={() => setStatusshow(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x"></i></Link>
								</div>
							</Card.Header>
							<Collapse in={StatusExpanded} timeout={3000}>
								<Card.Body>
									Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
									eu
									fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
									culpa
									qui officia deserunt mollit anim id est laborum
								</Card.Body>
							</Collapse>
						</Card>
						: null}
				</Col>
			</Row>
			<Row>
				<Col md={12} lg={4}>
					<Card>
						<Card.Header>
							<Card.Title>Special title treatment</Card.Title>
						</Card.Header>
						<Card.Body>
							<Card.Text>With supporting text below as a natural lead-in to
								additional
								content.</Card.Text><Link className="btn btn-primary" to="#">Go
									somewhere</Link>
						</Card.Body>
					</Card>
				</Col>
				<Col md={12} lg={4}>
					<Card className=" text-center">
						<Card.Header>
							<Card.Title>Special title treatment</Card.Title>
						</Card.Header>
						<Card.Body>
							<Card.Text>With supporting text below as a natural lead-in to
								additional
								content.</Card.Text><Link className="btn btn-primary" to="#">Go
									somewhere</Link>
						</Card.Body>
					</Card>
				</Col>
				<Col md={12} lg={4}>
					<Card className=" text-end">
						<Card.Header>
							<Card.Title>Special title treatment</Card.Title>
						</Card.Header>
						<Card.Body>
							<Card.Text>With supporting text below as a natural lead-in to
								additional
								content.</Card.Text><Link className="btn btn-primary" to="#">Go
									somewhere</Link>
						</Card.Body>
					</Card>
				</Col>
				<Col md={12} lg={4}>
					<Card>
						<Card.Body>
							This is some text within a card body.
						</Card.Body>
					</Card>
					<Card>
						<Card.Header>
							<Card.Title>Card title</Card.Title>
						</Card.Header>
						<Card.Body>
							<h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
							<Card.Text>Some quick example text to build on the card title and make
								up
								the bulk of the card's content.</Card.Text>
							<Link className="card-link" to="#">Card link</Link> <a
								className="card-link d-inline-block" href="#">Another link</a>
						</Card.Body>
					</Card>
					<Card>
						<Card.Body>
							<ul className="list-group m-2">
								<li className="list-group-item">Cras justo odio</li>
								<li className="list-group-item">Dapibus ac facilisis in</li>
								<li className="list-group-item">Vestibulum at eros</li>
								<li className="list-group-item">Dapibus ac facilisis in</li>
								<li className="list-group-item">Vestibulum at eros</li>
							</ul>
						</Card.Body>
					</Card>
				</Col>
				<Col md={12} lg={4}>
					<Card className=" overflow-hidden">
						<Card.Header>
							<Card.Title>Card title</Card.Title>
						</Card.Header>
						<img src={ImagesData("media10")} alt="image" className="image10" />
						<Card.Body>
							<Card.Text>Some quick example text to build on the card title and make
								up
								the bulk of the card's content.</Card.Text>
						</Card.Body>
						<ul className="list-group mx-2">
							<li className="list-group-item">Cras justo odio</li>
							<li className="list-group-item">Dapibus ac facilisis in</li>
						</ul>
						<Card.Body>
							<Link className="card-link" to="#">Card link</Link> <Link
								className="card-link d-inline-block" to="#">Another link</Link>
						</Card.Body>
					</Card>
				</Col>
				<Col md={12} lg={4}>
					<Card>
						<Card.Header>
							<Card.Title>
								Featured
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Card.Title>Special title treatment</Card.Title>
							<Card.Text>With supporting text below as a natural lead-in to
								additional
								content.</Card.Text><Link className="btn btn-primary" to="#">Go
									somewhere</Link>
						</Card.Body>
					</Card>
					<Card className=" text-center">
						<Card.Header>
							<Card.Title>
								Featured
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Card.Title>Special title treatment</Card.Title>
							<Card.Text>With supporting text below as a natural lead-in to
								additional
								content.</Card.Text><Link className="btn btn-primary" to="#">Go
									somewhere</Link>
						</Card.Body>
						<Card.Footer className="ext-muted">
							2 days ago
						</Card.Footer>
					</Card>
				</Col>
				<Col md={12} lg={4}>
					<Card>
						<Card.Header>
							<Card.Title>
								Featured
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Card.Title>Special title treatment</Card.Title>
							<Card.Text>With supporting text below as a natural lead-in to
								additional
								content.</Card.Text><Link className="btn btn-primary" to="#">Go
									somewhere</Link>
						</Card.Body>
					</Card>
				</Col>
				<Col md={12} lg={4}>
					<Card>
						<Card.Header>
							<Card.Title>
								Quote
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<blockquote className="blockquote mb-0">
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
									erat
									a ante.</p>
								<footer className="blockquote-footer">
									Someone famous in <cite title="Source Title">Source Title</cite>
								</footer>
							</blockquote>
						</Card.Body>
					</Card>
				</Col>
				<Col md={12} lg={4}>
					<Card>
						<Card.Body>
							<Card.Title>Card title</Card.Title>
							<Card.Text>With supporting text below as a natural lead-in to
								additional
								content.</Card.Text>
							<p>If you are going to use a passage of Lorem Ipsum, you need to be sure there
								isn't
								anything embarrassing hidden in the middle of text.</p>
							<Link className="btn btn-primary" to="#">Button</Link>
						</Card.Body>
					</Card>
				</Col>

				<Col md={12} lg={6}>
					<Card className=" text-center">
						<Card.Header>
							<Nav as="ul" className="nav-pills card-header-pills">
								<Nav.Item as="li">
									<Link className="nav-link active" to="#">Active</Link>
								</Nav.Item>
								<Nav.Item as="li">
									<Link className="nav-link" to="#">Link</Link>
								</Nav.Item>
								<Nav.Item as="li">
									<Link aria-disabled="false" className="nav-link disabled" to="#!"
									>Disabled</Link>
								</Nav.Item>
							</Nav>
						</Card.Header>
						<Card.Body>
							<Card.Title>Special title treatment</Card.Title>
							<p className="card-text">With supporting text below as a natural lead-in to
								additional
								content.</p><Link className="btn btn-primary" to="#">Go
									somewhere</Link>
						</Card.Body>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Body>
							<Nav as="ul" className="nav-pills card-header-pills mb-6">
								<Nav.Item as="li">
									<Link className="nav-link active d-block" to="#!">Active</Link>
								</Nav.Item>
								<Nav.Item as="li">
									<Link className="nav-link d-block" to="#">Link</Link>
								</Nav.Item>
								<Nav.Item as="li">
									<Link aria-disabled="false" className="nav-link disabled d-block" to="#!"
									>Disabled</Link>
								</Nav.Item>
							</Nav>
							<Card.Title>Special title treatment</Card.Title>
							<Card.Text>With supporting text below as a natural lead-in to
								additional
								content.</Card.Text><Link className="btn btn-primary" to="#">Go
									somewhere</Link>
						</Card.Body>
					</Card>
				</Col>

				<Col md={12} lg={6}>
					{Basicsshow ?
						<Card>
							<Card.Header>
								<Card.Title>Basic card</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={BasicsHandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i className={`${BasicsExpanded ? "fe fe-chevron-up" : "fe fe-chevron-down"}`}></i></Link>
									<Link to="#" onClick={() => setBasicsshow(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x"></i></Link>
								</div>
							</Card.Header>

							<Collapse in={BasicsExpanded} timeout={5000}>
								<div>
									<Card.Body>
										Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
										eu
										fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
										culpa
										qui officia deserunt mollit anim id est laborum
									</Card.Body>

									<Card.Footer>
										This is Basic card footer
									</Card.Footer>
								</div>
							</Collapse>
						</Card>
						: null}
				</Col>

				<Col md={12} lg={6}>
					{Basics1show ?
						<Card>
							<Card.Header>
								<Card.Title>Basic card</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={Basics1HandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i className={`${Basics1Expanded ? "fe fe-chevron-up" : "fe fe-chevron-down"}`}></i></Link>
									<Link to="#" onClick={() => setBasics1show(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x"></i></Link>
								</div>
							</Card.Header>
							<Collapse in={Basics1Expanded} timeout={3000}>
								<div>
									<Card.Body>

										Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
										eu
										fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
										culpa
										qui officia deserunt mollit anim id est laborum
									</Card.Body>
									<Card.Footer>
										This is Basic card footer
									</Card.Footer>
								</div>
							</Collapse>
						</Card>
						: null}
				</Col>
				<Col md={12} lg={6}>
					{Colorshow ?
						<Card className=" overflow-hidden">
							<Card.Header className=" bg-primary ">
								<Card.Title className="card-title text-white">Basic color card-header</Card.Title>
								<div className="card-options ">
									<Link to="#" onClick={ColorHandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i
											className={`${ColorExpanded ? "fe fe-chevron-up text-white" : "fe fe-chevron-down text-white"}`}></i></Link>
									<Link to="#" onClick={() => setColorshow(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x text-white"></i></Link>
								</div>
							</Card.Header>
							<Collapse in={ColorExpanded} timeout={3000}>
								<div>
									<Card.Body>
										Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
										eu
										fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
										culpa
										qui officia deserunt mollit anim id est laborum
									</Card.Body>
									<Card.Footer>
										This is Basic card footer
									</Card.Footer>
								</div>
							</Collapse>
						</Card>
						: null}
				</Col>
				<Col md={12} lg={6}>
					{Footershow ?
						<Card className=" overflow-hidden">
							<Card.Header>
								<Card.Title>Basic color card-footer</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={FooterHandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i className={`${FooterExpanded ? "fe fe-chevron-up" : "fe fe-chevron-down"}`}></i></Link>
									<Link to="#" onClick={() => setFootershow(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x"></i></Link>
								</div>
							</Card.Header>
							<Collapse in={FooterExpanded} timeout={3000}>
								<div>
									<Card.Body>
										Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
										eu
										fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
										culpa
										qui officia deserunt mollit anim id est laborum
									</Card.Body>
									<Card.Footer className=" bg-info ">
										<div className="text-white">Basic card footer</div>
									</Card.Footer>
								</div>
							</Collapse>
						</Card>
						: null}
				</Col>
			</Row>
			<Row>
				<Col md={12} lg={6}>
					{Primaryshow ?
						<Card className=" text-white bg-primary">
							<Card.Header>
								<Card.Title>primary card title</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={PrimaryHandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i
											className={`${PrimaryExpanded ? "fe fe-chevron-up text-white" : "fe fe-chevron-down text-white"}`}></i></Link>
									<Link to="#" onClick={() => setPrimaryshow(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x text-white "></i></Link>
								</div>
							</Card.Header>
							<Collapse in={PrimaryExpanded} timeout={3000}>
								<Card.Body>
									<Card.Text>Some quick example text to build on the card title and make
										up
										the bulk of the card's content.</Card.Text>
								</Card.Body>
							</Collapse>
						</Card>
						: null}
				</Col>
				<Col md={12} lg={6}>
					{Secondaryshow ?
						<Card className=" text-white bg-secondary">
							<Card.Header>
								<Card.Title >Secondary card title</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={SecondaryHandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i
											className={`${SecondaryExpanded ? "fe fe-chevron-up text-white" : "fe fe-chevron-down text-white"}`}></i></Link>
									<Link to="#" onClick={() => setSecondaryshow(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x text-white "></i></Link>
								</div>
							</Card.Header>
							<Collapse in={SecondaryExpanded} timeout={3000}>
								<Card.Body>
									<Card.Text>Some quick example text to build on the card title and make
										up
										the bulk of the card's content.</Card.Text>
								</Card.Body>
							</Collapse>
						</Card>

						: null}
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Panel with custom buttons</Card.Title>
							<div className="card-options">
								<Link to="#" className="btn btn-primary btn-sm me-2 mt-1">Action 1</Link>
								<Link to="#" className="btn btn-secondary btn-sm me-2 mt-1">Action
									2</Link>
							</div>
						</Card.Header>
						<Card.Body>
							No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but
							because those who do not know how to pursue pleasure rationally encounter
							consequences that are extremely painful actual teachings of the great explorer
						</Card.Body>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Card with search form</Card.Title>
							<div className="card-options">
								<Form>
									<InputGroup className="input-group mt-2">
										<Form.Control type="text" className="form-control form-control-sm"
											placeholder="Search something..." name="s" />
										<span className="input-group-btn">
											<Button className="btn h-100 btn-primary" type="submit">
												<span className="fe fe-search"></span>
											</Button>
										</span>
									</InputGroup>
								</Form>
							</div>
						</Card.Header>
						<Card.Body>
							No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but
							because those who do not know how to pursue pleasure rationally encounter
							consequences that are extremely painful actual teachings of the great explorer
						</Card.Body>
					</Card>
				</Col>

				<Col md={12} lg={6}>
					{Alertshow ?
						<Card>
							<Card.Header>
								<Card.Title>Card with alert</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={AlertHandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i className={`${SecondaryExpanded ? "fe fe-chevron-up" : "fe fe-chevron-down"}`}></i></Link>
									<Link to="#" onClick={() => setAlertshow(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x"></i></Link>
								</div>
							</Card.Header>
							<Collapse in={AlertExpanded} timeout={3000}>

								<div>

									<div className={`card-alert alert alert-success mb-0`}>
										Adding action failed
									</div>
									<Card.Body>
										Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
									</Card.Body>

								</div>

							</Collapse>
						</Card>
						: null}
				</Col>

				<Col md={12} lg={6}>
					{Alert1show ?
						<Card>
							<Card.Header>
								<Card.Title>Card with alert</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={Alert1HandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i className={`${Alert1Expanded ? "fe fe-chevron-up" : "fe fe-chevron-down"}`}></i></Link>
									<Link to="#" onClick={() => setAlert1show(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x"></i>

									</Link>
								</div>
							</Card.Header>
							<Collapse in={Alert1Expanded} timeout={3000}>
								<div>
									<div className="card-alert alert alert-danger mb-0">
										Adding action failed
									</div>
									<Card.Body>
										No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but
										because those who do not know how to pursue pleasure rationally encounter
										consequences that are extremely painful actual teachings of the great explorer
									</Card.Body>
								</div>
							</Collapse>
						</Card>
						: null}
				</Col>

				<Col md={12} lg={6}>
					{Loadershow ?
						<Card>
							<Card.Header>
								<Card.Title>CARD WITH LOADER</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={LoaderHandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i className={`${LoaderExpanded ? "fe fe-chevron-up" : "fe fe-chevron-down"}`}></i></Link>
									<Link to="#" onClick={() => setLoadershow(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x"></i></Link>
								</div>
							</Card.Header>
							<Collapse in={LoaderExpanded} timeout={3000}>
								<Card.Body>
									<div className="dimmer active">
										<div className="spinner"></div>
									</div>
								</Card.Body>
							</Collapse>
						</Card>
						: null}
				</Col>


				<Col md={12} lg={6}>
					{Loader1show ?
						<Card>
							<Card.Header>
								<Card.Title>CARD WITH LOADER</Card.Title>
								<div className="card-options">
									<Link to="#" onClick={Loader1HandleExpandClick} className="card-options-collapse me-2"
										data-bs-toggle="card-collapse"><i className={`${Loader1Expanded ? "fe fe-chevron-up" : "fe fe-chevron-down"}`}></i></Link>
									<Link to="#" onClick={() => setLoader1show(false)} className="card-options-remove"
										data-bs-toggle="card-remove"><i className="fe fe-x"></i></Link>
								</div>
							</Card.Header>
							<Collapse in={Loader1Expanded} timeout={3000}>
								<Card.Body>
									<div className="dimmer active">
										<div className="spinner1">
											<div className="double-bounce1"></div>
											<div className="double-bounce2"></div>
										</div>
									</div>
								</Card.Body>
							</Collapse>
						</Card>
						: null}
				</Col>
			</Row>
		</Fragment>

	);
}
export default Cards;
