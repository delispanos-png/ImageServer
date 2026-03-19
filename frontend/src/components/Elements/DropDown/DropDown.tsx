import React, { FC, Fragment, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Collapse, Dropdown, Form, Row } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import PageHeader from '../../../layout/Header/pageheader';
import { singleButton, roundButton, splitButton, roundsplitButton, squareButton, roundedButton, splitoutButton, roundoutButton } from './Data/DropdownData';
interface DropDownProps { }

const DropDown: FC<DropDownProps> = () => {
	const [show, setShow] = useState(false);
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	const [show3, setShow3] = useState(false);
	const [show4, setShow4] = useState(false);
	const [show5, setShow5] = useState(false);
	const [show6, setShow6] = useState(false);
	const [show7, setShow7] = useState(false);
	const [show8, setShow8] = useState(false);
	const [show9, setShow9] = useState(false);
	const [show10, setShow10] = useState(false);
	const [show11, setShow11] = useState(false);
	return (

		<Fragment>
			<PageHeader title="Dropdowns" />
			<Row>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Single button dropdowns</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />

						</Card.Header>
						<Card.Body>
							<div className="panel panel-default">
								<div className="panel-body p-0">
									<div className="mt-2 mb-2 flex-wrap gap-2 d-flex">
										{singleButton.map((singleButtons) => (
											<Dropdown className='' key={Math.random()}>
												<Dropdown.Toggle variant={singleButtons.color}
													data-bs-toggle="dropdown">
													Action<span className="no-caret"></span>
												</Dropdown.Toggle>
												<Dropdown.Menu role="menu">
													<li className="dropdown-plus-title">
														Dropdown
														<b className="fa fa-angle-up" aria-hidden="true"></b>
													</li>
													<li><Dropdown.Item>Action</Dropdown.Item></li>
													<li><Dropdown.Item>Another Action</Dropdown.Item></li>
													<li><Dropdown.Item>Something Else Here</Dropdown.Item></li>
													<li className="divider"></li>
													<li><Dropdown.Item>Separated Link</Dropdown.Item></li>
												</Dropdown.Menu>
											</Dropdown>
										))}
									</div>
								</div>
							</div>
						</Card.Body>
						<Collapse in={show} className="">
							<pre>
								<code>
									{`
 <div className="btn-group mt-2 mb-2">
 {singleButton.map((singleButtons) => (
 <Dropdown className='me-1'>
  <Dropdown.Toggle variant={singleButtons.color} data-bs-toggle="dropdown"> {singleButtons.title}<span className="no-caret"></span></Dropdown.Toggle>
  <Dropdown.Menu role="menu">
		 <li className="dropdown-plus-title">{singleButtons.menu}<b className="fa fa-angle-up" aria-hidden="true"></b></li>
		 <li><Dropdown.Item href="#">{singleButtons.item}</Dropdown.Item></li>
		 <li><Dropdown.Item href="#">{singleButtons.item1}</Dropdown.Item></li>
		 <li><Dropdown.Item href="#">{singleButtons.item2}</Dropdown.Item></li>
		 <li className="divider"></li>
		 <li><Dropdown.Item href="#">{singleButtons.item3}</Dropdown.Item></li>
 </Dropdown.Menu>
 </Dropdown>
 ))}
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Rounded button dropdowns</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
						</Card.Header>
						<Card.Body>
							<div className="panel panel-default">
								<div className="panel-body p-0">
									<div className="mt-2 mb-2 flex-wrap gap-2  d-flex">
										{roundButton.map((roundButtons) => (
											<Dropdown className='' key={Math.random()}>
												<Dropdown.Toggle className="btn-pill" variant={roundButtons.color}
													data-bs-toggle="dropdown">
													Action <span className="caret"></span>
												</Dropdown.Toggle>
												<Dropdown.Menu role="menu">
													<li className="dropdown-plus-title">
														Dropdown
														<b className="fa fa-angle-up" aria-hidden="true"></b>
													</li>
													<li><Dropdown.Item>Action</Dropdown.Item></li>
													<li><Dropdown.Item>Another Action</Dropdown.Item></li>
													<li><Dropdown.Item>Something Else Here</Dropdown.Item></li>
													<li className="divider"></li>
													<li><Dropdown.Item>Separated Link</Dropdown.Item></li>
												</Dropdown.Menu>
											</Dropdown>
										))}
									</div>

								</div>
							</div>
						</Card.Body>
						<Collapse in={show1} className="">
							<pre>
								<code>
									{`
 	<div className="btn-group mt-2 mb-2">
	 {roundButton.map((roundButtons) => (
	<Dropdown className='me-1'>
	<Dropdown.Toggle className="btn-pill" variant={roundButtons.color} data-bs-toggle="dropdown"> {roundButtons.title} <span className="caret"></span>
		 </Dropdown.Toggle>
	<Dropdown.Menu role="menu">
			 <li className="dropdown-plus-title"> {roundButtons.menu} <b className="fa fa-angle-up" aria-hidden="true"></b> </li>
			 <li><Dropdown.Item>{roundButtons.item}</Dropdown.Item></li>
			 <li><Dropdown.Item>{roundButtons.item1}</Dropdown.Item></li>
			 <li><Dropdown.Item>{roundButtons.item2}</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>{roundButtons.item3}</Dropdown.Item></li>
	</Dropdown.Menu>
	 </Dropdown>
	 ))}
 </div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Split button dropdowns</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />
						</Card.Header>
						<Card.Body>
							<div className="panel panel-default">
								<div className="panel-body p-0">
									<div className="mt-2 mb-2 flex-wrap gap-2">
										{splitButton.map((splitButtons) => (
											<Dropdown as={ButtonGroup} className='me-1 mt-2' key={Math.random()}>
												<Button type="button" variant={splitButtons.color}>Action</Button>
												<Dropdown.Toggle
													className="split-dropdown" variant={splitButtons.color}
													data-bs-toggle="dropdown">
													<span className="caret"></span>
													<span className="sr-only">Toggle Dropdown</span>
												</Dropdown.Toggle>
												<Dropdown.Menu role="menu">
													<li className="dropdown-plus-title">
														Dropdown
														<b className="fa fa-angle-up"></b>
													</li>
													<li><Dropdown.Item>Action</Dropdown.Item></li>
													<li><Dropdown.Item>Another Action</Dropdown.Item></li>
													<li><Dropdown.Item>Something Else Here</Dropdown.Item></li>
													<li className="divider"></li>
													<li><Dropdown.Item>Separated Link</Dropdown.Item></li>
												</Dropdown.Menu>
											</Dropdown>
										))}
									</div>

								</div>
							</div>
						</Card.Body>
						<Collapse in={show2} className="">
							<pre>
								<code>
									{`
 	<div className="btn-group mt-2 mb-2">
	 {splitButton.map((splitButtons) => (
	 <Dropdown as={ButtonGroup} className='me-1'>
		     <Button type="button" variant={splitButtons.color}>{splitButtons.title}</Button>
		 <Dropdown.Toggle
              className="split-dropdown" variant={splitButtons.color}
              data-bs-toggle="dropdown">
              <span className="caret"></span>
              <span className="sr-only">Toggle Dropdown</span>
		 </Dropdown.Toggle>
		 <Dropdown.Menu role="menu">
			 <li className="dropdown-plus-title"> {splitButtons.menu} <b className="fa fa-angle-up"></b></li>
			 <li><Dropdown.Item>{splitButtons.item}</Dropdown.Item></li>
			 <li><Dropdown.Item>{splitButtons.item1}</Dropdown.Item></li>
			 <li><Dropdown.Item>{splitButtons.item2}</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>{splitButtons.item3}</Dropdown.Item></li>
		 </Dropdown.Menu>
	 </Dropdown>
	 ))}
 </div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Rounded Split button dropdowns</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow3(!show3)} />
						</Card.Header>
						<Card.Body>
							<div className="panel panel-default rounded-split-buttons">
								<div className="panel-body p-0">
									<div className="mt-2 mb-2 flex-wrap gap-2">
										{roundsplitButton.map((roundsplitButtons) => (

											<Dropdown as={ButtonGroup} className='me-1 mt-2' key={Math.random()}>
												<Button type="button" className="btn-pill" variant={roundsplitButtons.color}>Action</Button>
												<Dropdown.Toggle
													className="btn-pill  split-dropdown" variant={roundsplitButtons.color}
													data-bs-toggle="dropdown">
													<span className="caret"></span>
													<span className="sr-only">Toggle Dropdown</span>
												</Dropdown.Toggle>
												<Dropdown.Menu role="menu">
													<li className="dropdown-plus-title">
													Dropdown
														<b className="fa fa-angle-up"></b>
													</li>
													<li><Dropdown.Item>Action</Dropdown.Item></li>
													<li><Dropdown.Item>Another Action</Dropdown.Item></li>
													<li><Dropdown.Item>Something Else Here</Dropdown.Item></li>
													<li className="divider"></li>
													<li><Dropdown.Item>Separated Link</Dropdown.Item></li>
												</Dropdown.Menu>
											</Dropdown>
										))}
									</div>

								</div>
							</div>
						</Card.Body>
						<Collapse in={show3} className="">
							<pre>
								<code>
									{`
 	<div className="btn-group mt-2 mb-2">
	 {roundsplitButton.map((roundsplitButtons) => (
	 <Dropdown as={ButtonGroup} className='me-1'>
	   <Button type="button" className="btn-pill" variant={roundsplitButtons.color}>{roundsplitButtons.title}</Button>
		 <Dropdown.Toggle
			 className="btn-pill  split-dropdown" variant={roundsplitButtons.color}
			 data-bs-toggle="dropdown">
			 <span className="caret"></span>
			 <span className="sr-only">Toggle Dropdown</span>
		 </Dropdown.Toggle>
		 <Dropdown.Menu role="menu">
			 <li className="dropdown-plus-title">{roundsplitButtons.menu}<b className="fa fa-angle-up"></b></li>
			 <li><Dropdown.Item>{roundsplitButtons.item}</Dropdown.Item></li>
			 <li><Dropdown.Item>{roundsplitButtons.item1}</Dropdown.Item></li>
			 <li><Dropdown.Item>{roundsplitButtons.item2}</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>{roundsplitButtons.item3}</Dropdown.Item></li>
		 </Dropdown.Menu>
	 </Dropdown>
	 ))}
 </div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Single Square outline button dropdowns</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow4(!show4)} />
						</Card.Header>
						<Card.Body>
							<div className="panel panel-default">
								<div className="panel-body p-0">
									<div className="btn-group mt-2 mb-2 flex-wrap gap-2">
										{squareButton.map((squareButtons) => (
											<Dropdown className='me-1' key={Math.random()}>
												<Dropdown.Toggle className=''
													variant={squareButtons.color}
													data-bs-toggle="dropdown">
													Action <span className="caret"></span>
												</Dropdown.Toggle>
												<Dropdown.Menu role="menu">
													<li className="dropdown-plus-title">
														Dropdown
														<b className="fa fa-angle-up" aria-hidden="true"></b>
													</li>
													<Dropdown.Item>Action</Dropdown.Item>
													<Dropdown.Item>Another Action</Dropdown.Item>
													<Dropdown.Item>Something Else Here</Dropdown.Item>
													<Dropdown.Divider className="divider"></Dropdown.Divider>
													<Dropdown.Item>Separated Link</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										))}
									</div>

								</div>
							</div>
						</Card.Body>
						<Collapse in={show4} className="">
							<pre>
								<code>
									{`
 	<div className="btn-group mt-2 mb-2">
	 {squareButton.map((squareButtons) => (
	 <Dropdown className='me-1'>
		 <Dropdown.Toggle className=''
			 variant={squareButtons.color}
			 data-bs-toggle="dropdown">
			 {squareButtons.title} <span className="caret"></span>
		 </Dropdown.Toggle>
		 <Dropdown.Menu role="menu">
			 <li className="dropdown-plus-title">{squareButtons.menu}<b className="fa fa-angle-up" aria-hidden="true"></b></li>
			 <li><Dropdown.Item>{squareButtons.item}</Dropdown.Item></li>
			 <li><Dropdown.Item>{squareButtons.item1}</Dropdown.Item></li>
			 <li><Dropdown.Item>{squareButtons.item2}</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>{squareButtons.item3}</Dropdown.Item></li>
		 </Dropdown.Menu>
	 </Dropdown>
	 ))}
 </div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Rounded button dropdowns</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow5(!show5)} />
						</Card.Header>
						<Card.Body>
							<div className="panel panel-default">
								<div className="panel-body p-0">

									<div className="btn-group mt-2 mb-2 flex-wrap gap-2">
										{roundedButton.map((roundedButtons) => (
											<Dropdown className='me-1' key={Math.random()}>
												<Dropdown.Toggle type="button"
													className="btn-pill" variant={roundedButtons.color}
													data-bs-toggle="dropdown">
													Action<span className="caret"></span>
												</Dropdown.Toggle>
												<Dropdown.Menu role="menu">
													<li className="dropdown-plus-title">
													Dropdown
														<b className="fa fa-angle-up" aria-hidden="true"></b>
													</li>
													<li><Dropdown.Item>Action</Dropdown.Item></li>
													<li><Dropdown.Item>Another Action</Dropdown.Item></li>
													<li><Dropdown.Item>Something Else Here</Dropdown.Item></li>
													<li className="divider"></li>
													<li><Dropdown.Item>Separated Link</Dropdown.Item></li>
												</Dropdown.Menu>
											</Dropdown>
										))}
									</div>

								</div>
							</div>
						</Card.Body>
						<Collapse in={show5} className="">
							<pre>
								<code>
									{`
 	<div className="btn-group mt-2 mb-2">
	 {roundedButton.map((roundedButtons) => (
	 <Dropdown className='me-1'>
		 <Dropdown.Toggle type="button"
			 className="btn-pill" variant={roundedButtons.color}
			 data-bs-toggle="dropdown">
			 {roundedButtons.title}<span className="caret"></span>
		 </Dropdown.Toggle>
		 <Dropdown.Menu role="menu">
			 <li className="dropdown-plus-title"> {roundedButtons.menu} <b className="fa fa-angle-up" aria-hidden="true"></b></li>
			 <li><Dropdown.Item>{roundedButtons.item}</Dropdown.Item></li>
			 <li><Dropdown.Item>{roundedButtons.item1}</Dropdown.Item></li>
			 <li><Dropdown.Item>{roundedButtons.item2}</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>{roundedButtons.item3}</Dropdown.Item></li>
		 </Dropdown.Menu>
	 </Dropdown>
	 ))}
 </div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Split button dropdowns</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow6(!show6)} />
						</Card.Header>
						<Card.Body>
							<div className="panel panel-default">
								<div className="panel-body p-0">

									<div className=" d-flex flex-wrap gap-2">
										{splitoutButton.map((splitoutButtons) => (
											<Dropdown as={ButtonGroup} className='me-1' key={Math.random()}>
												<Button type="button"
													variant={splitoutButtons.color}>Action</Button>

												<Dropdown.Toggle
													variant={splitoutButtons.color}
													data-bs-toggle="dropdown">
													<span className="caret"></span>
													<span className="sr-only">Toggle Dropdown</span>
												</Dropdown.Toggle>
												<Dropdown.Menu role="menu">
													<li className="dropdown-plus-title">
													Dropdown
														<b className="fa fa-angle-up"></b>
													</li>
													<li><Dropdown.Item>Action</Dropdown.Item></li>
													<li><Dropdown.Item>Another Action</Dropdown.Item></li>
													<li><Dropdown.Item>Something Else Here</Dropdown.Item></li>
													<li className="divider"></li>
													<li><Dropdown.Item>Separated Link</Dropdown.Item></li>
												</Dropdown.Menu>
											</Dropdown>
										))}
									</div>


								</div>
							</div>
						</Card.Body>
						<Collapse in={show6} className="">
							<pre>
								<code>
									{`
 <div className="btn-group mt-2 mb-2">
 {splitoutButton.map((splitoutButtons) => (
 <Dropdown as={ButtonGroup} className='me-1'>
	 <Button type="button" variant={splitoutButtons.color}>{splitoutButtons.title}</Button>
     <Dropdown.Toggle
		 variant="outline-primary"
		 data-bs-toggle="dropdown">
		 <span className="caret"></span>
		 <span className="sr-only">Toggle Dropdown</span>
	 </Dropdown.Toggle>
	 <Dropdown.Menu role="menu">
		 <li className="dropdown-plus-title"> {splitoutButtons.menu} <b className="fa fa-angle-up"></b></li>
		 <li><Dropdown.Item>{splitoutButtons.item}</Dropdown.Item></li>
		 <li><Dropdown.Item>{splitoutButtons.item1}</Dropdown.Item></li>
		 <li><Dropdown.Item>{splitoutButtons.item2}</Dropdown.Item></li>
		 <li className="divider"></li>
		 <li><Dropdown.Item>{splitoutButtons.item3}</Dropdown.Item></li>
	 </Dropdown.Menu>
 </Dropdown>
 ))}
</div>

`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Rounded Split button dropdowns</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow7(!show7)} />
						</Card.Header>
						<Card.Body>
							<div className="panel panel-default">
								<div className="panel-body p-0">
									<div className=" d-flex mt-2 mb-2 flex-wrap gap-2">
										{roundoutButton.map((roundoutButtons) => (
											<Dropdown as={ButtonGroup} className='me-1' key={Math.random()}>
												<Button type="button"
													className="btn-pill" variant={roundoutButtons.color}>Action</Button>
												<Dropdown.Toggle
													className="btn-pill" variant={roundoutButtons.color}
													data-bs-toggle="dropdown">
													<span className="caret"></span>
													<span className="sr-only">Toggle Dropdown</span>
												</Dropdown.Toggle>
												<Dropdown.Menu role="menu">
													<li className="dropdown-plus-title">
														Dropdown
														<b className=" fa fa-angle-up"></b>
													</li>
													<li><Dropdown.Item>Action</Dropdown.Item></li>
													<li><Dropdown.Item>Another Action</Dropdown.Item></li>
													<li><Dropdown.Item>Something Else Here</Dropdown.Item></li>
													<li className="divider"></li>
													<li><Dropdown.Item>Separated Link</Dropdown.Item></li>
												</Dropdown.Menu>
											</Dropdown>
										))}
									</div>
								</div>
							</div>
						</Card.Body>
						<Collapse in={show7} className="">
							<pre>
								<code>
									{`
 	<div className="btn-group mt-2 mb-2">
	 {roundoutButton.map((roundoutButtons) => (
	 <Dropdown as={ButtonGroup} className='me-1'>
		 <Button type="button" className="btn-pill" variant={roundoutButtons.color}>{roundoutButtons.title}</Button>
		 <Dropdown.Toggle
			 className="btn-pill" variant={roundoutButtons.color}
			 data-bs-toggle="dropdown">
			 <span className="caret"></span>
			 <span className="sr-only">Toggle Dropdown</span>
		 </Dropdown.Toggle>
		 <Dropdown.Menu role="menu">
			 <li className="dropdown-plus-title"> {roundoutButtons.menu} <b className=" fa fa-angle-up"></b></li>
			 <li><Dropdown.Item>{roundoutButtons.item}</Dropdown.Item></li>
			 <li><Dropdown.Item>{roundoutButtons.item1}</Dropdown.Item></li>
			 <li><Dropdown.Item>{roundoutButtons.item2}</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>{roundoutButtons.item3}</Dropdown.Item></li>
		 </Dropdown.Menu>
	 </Dropdown>
	 ))}
 </div>

`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Dropright dropdowns</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow8(!show8)} />
						</Card.Header>
						<Card.Body>
							<div className="btn-group dropend">
								<Dropdown className='me-1 ' as={ButtonGroup}

								>
										<Button type="button" variant="primary">
										Dropright
									</Button>
									<Dropdown.Toggle
										data-bs-toggle="dropdown" aria-expanded="false">
										{/* <span className="visually-hidden">Toggle Dropright</span> */}
									</Dropdown.Toggle>
									<Dropdown.Menu data-popper-placement="right-start">
										<li className="dropdown-plus-title">
											Dropdown
											<b className="fa fa-angle-up"></b>
										</li>
										<li><Dropdown.Item>Action</Dropdown.Item></li>
										<li><Dropdown.Item>Another action</Dropdown.Item></li>
										<li><Dropdown.Item>Something else here</Dropdown.Item></li>
										<li className="divider"></li>
										<li><Dropdown.Item>Separated link</Dropdown.Item></li>
									</Dropdown.Menu>
								</Dropdown>
							</div>

							<div className="btn-group dropend">
								<Dropdown className='me-1' as={ButtonGroup}>
								<Button type="button" variant="success">
										Dropright
									</Button>
									<Dropdown.Toggle   variant='success'
										data-bs-toggle="dropdown" aria-expanded="false">
								<span className="visually-hidden">Toggle Dropright</span>
									</Dropdown.Toggle>
									<Dropdown.Menu data-popper-placement="right-start">
										<li className="dropdown-plus-title">
											Dropdown
											<b className="fa fa-angle-up"></b>
										</li>
										<li><Dropdown.Item>Action</Dropdown.Item></li>
										<li><Dropdown.Item>Another action</Dropdown.Item></li>
										<li><Dropdown.Item>Something else here</Dropdown.Item></li>
										<li className="divider"></li>
										<li><Dropdown.Item>Separated link</Dropdown.Item></li>
									</Dropdown.Menu>
								</Dropdown>
							</div>

							<div className="btn-group dropend my-2">
								<Dropdown as={ButtonGroup} className='me-1'>
									<Button type="button" variant="info">
										Split dropend
									</Button>
									<Dropdown.Toggle
										className="dropdown-toggle-split" variant='info'
										data-bs-toggle="dropdown" aria-expanded="false">
										<span className="visually-hidden">Toggle Dropright</span>
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<li className="dropdown-plus-title">
											Dropdown
											<b className="fa fa-angle-up"></b>
										</li>
										<li><Dropdown.Item>Action</Dropdown.Item></li>
										<li><Dropdown.Item>Another action</Dropdown.Item></li>
										<li><Dropdown.Item>Something else here</Dropdown.Item></li>
										<li className="divider"></li>
										<li><Dropdown.Item>Separated link</Dropdown.Item></li>
									</Dropdown.Menu>
								</Dropdown>
							</div>
							<div className="btn-group dropend">
								<Dropdown as={ButtonGroup} className='me-1'>
									<Button type="button" variant="danger">
										Split dropend
									</Button>
									<Dropdown.Toggle
										className="dropdown-toggle-split" variant='danger'
										data-bs-toggle="dropdown" aria-expanded="false">
										<span className="visually-hidden">Toggle Dropright</span>
									</Dropdown.Toggle>
									<Dropdown.Menu >
										<li className="dropdown-plus-title">
											Dropdown
											<b className="fa fa-angle-up"></b>
										</li>
										<li><Dropdown.Item>Action</Dropdown.Item></li>
										<li><Dropdown.Item>Another action</Dropdown.Item></li>
										<li><Dropdown.Item>Something else here</Dropdown.Item></li>
										<li className="divider"></li>
										<li><Dropdown.Item>Separated link</Dropdown.Item></li>
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</Card.Body>
						<Collapse in={show8} className="">
							<pre>
								<code>
									{`
 	<div className="btn-group mb-2 mt-2 dropend">
	 <Dropdown className='me-1'>
		 <Dropdown.Toggle variant="primary"
			 data-bs-toggle="dropdown" aria-expanded="false">Dropright
		 </Dropdown.Toggle>
		 <Dropdown.Menu>
			 <li className="dropdown-plus-title"> Dropdown <b className="fa fa-angle-up"></b>
			 </li>
			 <li><Dropdown.Item>Action</Dropdown.Item></li>
			 <li><Dropdown.Item>Another action</Dropdown.Item></li>
			 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
		 </Dropdown.Menu>
	 </Dropdown>
 </div>

 <div className="btn-group dropend">
	 <Dropdown className='me-1'>
		 <Dropdown.Toggle variant="success"
			 data-bs-toggle="dropdown" aria-expanded="false">
			 Dropright
		 </Dropdown.Toggle>
		 <Dropdown.Menu>
			 <li className="dropdown-plus-title"> Dropdown <b className="fa fa-angle-up"></b></li>
			 <li><Dropdown.Item>Action</Dropdown.Item></li>
			 <li><Dropdown.Item>Another action</Dropdown.Item></li>
			 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
		 </Dropdown.Menu>
	 </Dropdown>
 </div>

 <div className="btn-group dropend my-2">
	 <Dropdown as={ButtonGroup} className='me-1'>
	 <Button type="button" variant="info">Split dropend</Button>
		 <Dropdown.Toggle
			 className="dropdown-toggle-split" variant='info'
			 data-bs-toggle="dropdown" aria-expanded="false">
			 <span className="visually-hidden">Toggle Dropright</span>
		 </Dropdown.Toggle>
		 <Dropdown.Menu>
			 <li className="dropdown-plus-title"> Dropdown <b className="fa fa-angle-up"></b></li>
			 <li><Dropdown.Item>Action</Dropdown.Item></li>
			 <li><Dropdown.Item>Another action</Dropdown.Item></li>
			 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
		 </Dropdown.Menu>
	 </Dropdown>
 </div>
 <div className="btn-group dropend">
	 <Dropdown as={ButtonGroup} className='me-1'>
	<Button type="button" variant="danger">Split dropend</Button>
		 <Dropdown.Toggle
			 className="dropdown-toggle-split" variant='danger'
			 data-bs-toggle="dropdown" aria-expanded="false">
			 <span className="visually-hidden">Toggle Dropright</span>
		 </Dropdown.Toggle>
		 <Dropdown.Menu>
			 <li className="dropdown-plus-title"> Dropdown <b className="fa fa-angle-up"></b></li>
			 <li><Dropdown.Item>Action</Dropdown.Item></li>
			 <li><Dropdown.Item>Another action</Dropdown.Item></li>
			 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
		 </Dropdown.Menu>
	 </Dropdown>
 </div>

`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Dropleft dropdowns</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow9(!show9)} />

						</Card.Header>
						<Card.Body className='dropleft-dropdowns'>
							<div className="btn-group dropstart">
							<Dropdown className='me-1'> 
									<Dropdown.Toggle variant="secondary"  data-popper-placement="left-start"
										data-bs-toggle="dropdown" aria-expanded="false">
										Dropstart
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<li className="dropdown-plus-title">
											Dropdown
											<b className="fa fa-angle-up"></b>
										</li>
										<li><Dropdown.Item>Action</Dropdown.Item></li>
										<li><Dropdown.Item>Another action</Dropdown.Item></li>
										<li><Dropdown.Item>Something else here</Dropdown.Item></li>
										<li className="divider"></li>
										<li><Dropdown.Item>Separated link</Dropdown.Item></li>
									</Dropdown.Menu>
								</Dropdown>
							</div>

							<div className="btn-group dropstart">
								<Dropdown className='me-1'> 
									<Dropdown.Toggle variant="success"  data-popper-placement="left-start"
										data-bs-toggle="dropdown" aria-expanded="false">
										Dropstart
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<li className="dropdown-plus-title">
											Dropdown
											<b className="fa fa-angle-up"></b>
										</li>
										<li><Dropdown.Item>Action</Dropdown.Item></li>
										<li><Dropdown.Item>Another action</Dropdown.Item></li>
										<li><Dropdown.Item>Something else here</Dropdown.Item></li>
										<li className="divider"></li>
										<li><Dropdown.Item>Separated link</Dropdown.Item></li>
									</Dropdown.Menu>
								</Dropdown>
							</div>

							<div className="btn-group my-2">
								<Dropdown as={ButtonGroup} className='me-1'>
									<div className="btn-group dropstart" role="group">
										<Dropdown.Toggle
											className="dropdown-toggle-split" variant='info'
											data-bs-toggle="dropdown" aria-expanded="false">
											<span className="visually-hidden">Toggle Dropstart</span>
										</Dropdown.Toggle>
										<Dropdown.Menu data-popper-placement="left-start">
											<li className="dropdown-plus-title">
												Dropdown
												<b className="fa fa-angle-up"></b>
											</li>
											<li><Dropdown.Item>Action</Dropdown.Item></li>
											<li><Dropdown.Item>Another action</Dropdown.Item></li>
											<li><Dropdown.Item>Something else here</Dropdown.Item></li>
											<li className="divider"></li>
											<li><Dropdown.Item>Separated link</Dropdown.Item></li>
										</Dropdown.Menu>

									</div>
									<Button type="button" variant="info">
										Split dropstart
									</Button>
								</Dropdown>
							</div>
							<div className="btn-group">
								<Dropdown as={ButtonGroup} className='me-1'>
									<div className="btn-group dropstart" role="group">
										<Dropdown.Toggle
											className="dropdown-toggle-split" variant='danger'
											data-bs-toggle="dropdown" aria-expanded="false">
											<span className="visually-hidden">Toggle Dropstart</span>
										</Dropdown.Toggle>
										<Dropdown.Menu>
											<li className="dropdown-plus-title">
												Dropdown
												<b className="fa fa-angle-up"></b>
											</li>
											<li><Dropdown.Item>Action</Dropdown.Item></li>
											<li><Dropdown.Item>Another action</Dropdown.Item></li>
											<li><Dropdown.Item>Something else here</Dropdown.Item></li>
											<li className="divider"></li>
											<li><Dropdown.Item>Separated link</Dropdown.Item></li>
										</Dropdown.Menu>
									</div>
									<Button type="button" variant="danger">
										Split dropstart
									</Button>
								</Dropdown>
							</div>
						</Card.Body>
						<Collapse in={show9} className="">
							<pre>
								<code>
									{`
 	<div className="btn-group mt-2 mb-2 dropstart">
	 <Dropdown className='me-1'>
		 <Dropdown.Toggle variant="secondary"
			 data-bs-toggle="dropdown" aria-expanded="false">
			 Dropstart
		 </Dropdown.Toggle>
		 <Dropdown.Menu>
			 <li className="dropdown-plus-title"> Dropdown <b className="fa fa-angle-up"></b></li>
             <li><Dropdown.Item>Action</Dropdown.Item></li>
			 <li><Dropdown.Item>Another action</Dropdown.Item></li>
			 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
		 </Dropdown.Menu>
	 </Dropdown>
 </div>

 <div className="btn-group dropstart">
	 <Dropdown className='me-1'>
		 <Dropdown.Toggle variant="success"
			 data-bs-toggle="dropdown" aria-expanded="false">
			 Dropstart
		 </Dropdown.Toggle>
		 <Dropdown.Menu>
			 <li className="dropdown-plus-title"> Dropdown <b className="fa fa-angle-up"></b></li>
			 <li><Dropdown.Item>Action</Dropdown.Item></li>
			 <li><Dropdown.Item>Another action</Dropdown.Item></li>
			 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
			 <li className="divider"></li>
			 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
		 </Dropdown.Menu>
	 </Dropdown>
 </div>

 <div className="btn-group my-2">
	 <Dropdown as={ButtonGroup} className='me-1'>
		 <div className="btn-group dropstart" role="group">
			 <Dropdown.Toggle
				 className="dropdown-toggle-split" variant='info'
				 data-bs-toggle="dropdown" aria-expanded="false">
				 <span className="visually-hidden">Toggle Dropstart</span>
			 </Dropdown.Toggle>
			 <Dropdown.Menu>
				 <li className="dropdown-plus-title"> Dropdown <b className="fa fa-angle-up"></b></li>
				 <li><Dropdown.Item>Action</Dropdown.Item></li>
				 <li><Dropdown.Item>Another action</Dropdown.Item></li>
				 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
				 <li className="divider"></li>
				 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
			 </Dropdown.Menu>

		 </div>
		 <Button type="button" variant="info">
			 Split dropstart
		 </Button>
	 </Dropdown>
 </div>
 <div className="btn-group">
	 <Dropdown as={ButtonGroup} className='me-1'>
		 <div className="btn-group dropstart" role="group">
			 <Dropdown.Toggle
				 className="dropdown-toggle-split" variant='danger'
				 data-bs-toggle="dropdown" aria-expanded="false">
				 <span className="visually-hidden">Toggle Dropstart</span>
			 </Dropdown.Toggle>
			 <Dropdown.Menu>
				 <li className="dropdown-plus-title"> Dropdown <b className="fa fa-angle-up"></b></li>
				 <li><Dropdown.Item>Action</Dropdown.Item></li>
				 <li><Dropdown.Item>Another action</Dropdown.Item></li>
				 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
				 <li className="divider"></li>
				 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
			 </Dropdown.Menu>
		 </div>
		 <Button type="button" variant="danger">
			 Split dropstart
		 </Button>
	 </Dropdown>
 </div>

`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Dropup variation</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow10(!show10)} />
						</Card.Header>
						<Card.Body>
							<div className="dropup btn-group mt-2 mb-2">
								<Dropdown className='me-1'>
									<Dropdown.Toggle variant="primary" type="button" className='mt-3'
										data-bs-toggle="dropdown">Dropup1
										<span className="caret"></span></Dropdown.Toggle>
									<Dropdown.Menu>
										<li><Dropdown.Item>HTML</Dropdown.Item></li>
										<li><Dropdown.Item>CSS</Dropdown.Item></li>
										<li><Dropdown.Item>JavaScript</Dropdown.Item></li>
										<li className="divider"></li>
										<li><Dropdown.Item>About Us</Dropdown.Item></li>
									</Dropdown.Menu>
								</Dropdown>
							</div>


							<div className="dropup btn-group mt-3">
								<Dropdown className='me-1'>
									<Dropdown.Toggle variant="info" type="button"
										data-bs-toggle="dropdown">Dropup2
										<span className="caret"></span></Dropdown.Toggle>
									<Dropdown.Menu>
										<li><Dropdown.Item>HTML</Dropdown.Item></li>
										<li><Dropdown.Item>CSS</Dropdown.Item></li>
										<li><Dropdown.Item>JavaScript</Dropdown.Item></li>
										<li className="divider"></li>
										<li><Dropdown.Item>About Us</Dropdown.Item></li>
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</Card.Body>
						<Collapse in={show10} className="">
							<pre>
								<code>
									{`
 		<div className="dropup btn-group mt-2 mb-2">
		 <Dropdown className='me-1'>
			 <Dropdown.Toggle variant="primary" type="button"
				 data-bs-toggle="dropdown">Dropup1
				 <span className="caret"></span></Dropdown.Toggle>
			 <Dropdown.Menu>
				 <li><Dropdown.Item>HTML</Dropdown.Item></li>
				 <li><Dropdown.Item>CSS</Dropdown.Item></li>
				 <li><Dropdown.Item>JavaScript</Dropdown.Item></li>
				 <li className="divider"></li>
				 <li><Dropdown.Item>About Us</Dropdown.Item></li>
			 </Dropdown.Menu>
		 </Dropdown>
	 </div>
	 <div className="dropup btn-group mt-2 mb-2">
		 <Dropdown className='me-1'>
			 <Dropdown.Toggle variant="info" type="button"
				 data-bs-toggle="dropdown">Dropup2
				 <span className="caret"></span></Dropdown.Toggle>
			 <Dropdown.Menu>
				 <li><Dropdown.Item>HTML</Dropdown.Item></li>
				 <li><Dropdown.Item>CSS</Dropdown.Item></li>
				 <li><Dropdown.Item>JavaScript</Dropdown.Item></li>
				 <li className="divider"></li>
				 <li><Dropdown.Item>About Us</Dropdown.Item></li>
			 </Dropdown.Menu>
		 </Dropdown>
	 </div>

`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title className='me-5'>Icon Drop Downs dropdowns</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow11(!show11)} />
						</Card.Header>
						<Card.Body>
							<div className="panel panel-default">
								<div className="panel-body p-0">
									<div className="btn-group mt-2 mb-2">
										<Dropdown className='me-1'>
											<Dropdown.Toggle type="button" variant="primary"
												data-bs-toggle="dropdown">
												<i className="fa fa-cog me-1"></i> <span className="caret"></span>
											</Dropdown.Toggle>
											<Dropdown.Menu role="menu">
												<li className="dropdown-plus-title">
													Dropdown
													<b className="fa fa-angle-up" aria-hidden="true"></b>
												</li>
												<li><Dropdown.Item>Action</Dropdown.Item></li>
												<li><Dropdown.Item>Another action</Dropdown.Item></li>
												<li><Dropdown.Item>Something else here</Dropdown.Item></li>
												<li className="divider"></li>
												<li><Dropdown.Item>Separated link</Dropdown.Item></li>
											</Dropdown.Menu>
										</Dropdown>
									</div>
									<div className="btn-group mt-2 mb-2">
										<Dropdown className='me-1'>
											<Dropdown.Toggle type="button" variant="primary"
												data-bs-toggle="dropdown">
												<i className="fa fa-ellipsis-h me-1"></i> <span
													className="caret"></span>
											</Dropdown.Toggle>
											<Dropdown.Menu role="menu">
												<li className="dropdown-plus-title">
													Dropdown
													<b className="fa fa-angle-up" aria-hidden="true"></b>
												</li>
												<li><Dropdown.Item>Action</Dropdown.Item></li>
												<li><Dropdown.Item>Another action</Dropdown.Item></li>
												<li><Dropdown.Item>Something else here</Dropdown.Item></li>
												<li className="divider"></li>
												<li><Dropdown.Item>Separated link</Dropdown.Item></li>
											</Dropdown.Menu>
										</Dropdown>
									</div>
									<div className="btn-group mt-2 mb-2">
										<Dropdown className='me-1'>
											<Dropdown.Toggle type="button" variant="primary"
												data-bs-toggle="dropdown">
												<i className="fa fa-ellipsis-v me-1"></i> <span
													className="caret"></span>
											</Dropdown.Toggle>
											<Dropdown.Menu role="menu">
												<li className="dropdown-plus-title">
													Dropdown
													<b className="fa fa-angle-up" aria-hidden="true"></b>
												</li>
												<li><Dropdown.Item>Action</Dropdown.Item></li>
												<li><Dropdown.Item>Another action</Dropdown.Item></li>
												<li><Dropdown.Item>Something else here</Dropdown.Item></li>
												<li className="divider"></li>
												<li><Dropdown.Item>Separated link</Dropdown.Item></li>
											</Dropdown.Menu>
										</Dropdown>
									</div>
									<div className="btn-group mt-2 mb-2">
										<Dropdown className='me-1'>
											<Dropdown.Toggle type="button" variant="primary"
												data-bs-toggle="dropdown">
												<i className="fa fa-chain me-1"></i><span className="caret"></span>
											</Dropdown.Toggle>
											<Dropdown.Menu className='dropdown-menu' role="menu">
												<li className="dropdown-plus-title">
													Dropdown
													<b className="fa fa-angle-up" aria-hidden="true"></b>
												</li>
												<li><Dropdown.Item>Action</Dropdown.Item></li>
												<li><Dropdown.Item>Another action</Dropdown.Item></li>
												<li><Dropdown.Item>Something else here</Dropdown.Item></li>
												<li className="divider"></li>
												<li><Dropdown.Item>Separated link</Dropdown.Item></li>
											</Dropdown.Menu>
										</Dropdown>
									</div>
								</div>
							</div>
						</Card.Body>
						<Collapse in={show11} className="">
							<pre>
								<code>
									{`
 		<div className="panel-body p-0">
		 <div className="btn-group mt-2 mb-2">
			 <Dropdown className='me-1'>
				 <Dropdown.Toggle type="button" variant="primary"
					 data-bs-toggle="dropdown">
					 <i className="fa fa-cog me-1"></i> <span className="caret"></span>
				 </Dropdown.Toggle>
				 <Dropdown.Menu role="menu">
					 <li className="dropdown-plus-title">
						 Dropdown
						 <b className="fa fa-angle-up" aria-hidden="true"></b>
					 </li>
					 <li><Dropdown.Item>Action</Dropdown.Item></li>
					 <li><Dropdown.Item>Another action</Dropdown.Item></li>
					 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
					 <li className="divider"></li>
					 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
				 </Dropdown.Menu>
			 </Dropdown>
		 </div>
		 <div className="btn-group mt-2 mb-2">
			 <Dropdown className='me-1'>
				 <Dropdown.Toggle type="button" variant="primary"
					 data-bs-toggle="dropdown">
					 <i className="fa fa-ellipsis-h me-1"></i> <span
						 className="caret"></span>
				 </Dropdown.Toggle>
				 <Dropdown.Menu role="menu">
					 <li className="dropdown-plus-title">
						 Dropdown
						 <b className="fa fa-angle-up" aria-hidden="true"></b>
					 </li>
					 <li><Dropdown.Item>Action</Dropdown.Item></li>
					 <li><Dropdown.Item>Another action</Dropdown.Item></li>
					 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
					 <li className="divider"></li>
					 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
				 </Dropdown.Menu>
			 </Dropdown>
		 </div>
		 <div className="btn-group mt-2 mb-2">
			 <Dropdown className='me-1'>
				 <Dropdown.Toggle type="button" variant="primary"
					 data-bs-toggle="dropdown">
					 <i className="fa fa-ellipsis-v me-1"></i> <span
						 className="caret"></span>
				 </Dropdown.Toggle>
				 <Dropdown.Menu role="menu">
					 <li className="dropdown-plus-title">
						 Dropdown
						 <b className="fa fa-angle-up" aria-hidden="true"></b>
					 </li>
					 <li><Dropdown.Item>Action</Dropdown.Item></li>
					 <li><Dropdown.Item>Another action</Dropdown.Item></li>
					 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
					 <li className="divider"></li>
					 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
				 </Dropdown.Menu>
			 </Dropdown>
		 </div>
		 <div className="btn-group mt-2 mb-2">
			 <Dropdown className='me-1'>
				 <Dropdown.Toggle type="button" variant="primary"
					 data-bs-toggle="dropdown">
					 <i className="fa fa-chain me-1"></i><span className="caret"></span>
				 </Dropdown.Toggle>
				 <Dropdown.Menu className='dropdown-menu' role="menu">
					 <li className="dropdown-plus-title">
						 Dropdown
						 <b className="fa fa-angle-up" aria-hidden="true"></b>
					 </li>
					 <li><Dropdown.Item>Action</Dropdown.Item></li>
					 <li><Dropdown.Item>Another action</Dropdown.Item></li>
					 <li><Dropdown.Item>Something else here</Dropdown.Item></li>
					 <li className="divider"></li>
					 <li><Dropdown.Item>Separated link</Dropdown.Item></li>
				 </Dropdown.Menu>
			 </Dropdown>
		 </div>
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

export default DropDown;
