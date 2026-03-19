import React, { FC, Fragment, useState } from 'react';
import { Card, Col, Collapse, Dropdown, Form, Nav, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../layout/Header/pageheader';
import { navigations, transperantcolors } from '../../../components/Elements/Navigation/Data/NavigationData';
; interface NavigationProps { }

const Navigation: FC<NavigationProps> = () => {
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
			<PageHeader title="Navigation" />
			<Row>
				<Col lg={6} md={12} >
					<Card>
						<Card.Header>
							<Card.Title>Nav Vertical</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
						</Card.Header>
						<Card.Body>
							<Nav className="nav1 flex-column br-7">
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary active" to="#">Active</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary" to="#">Link</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary" to="#">Link</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary disabled" to="#">Disabled</Link></Nav.Item>
							</Nav>
						</Card.Body>
						<Collapse in={show} className="">
							<pre>
								<code>
									{`
 <Nav className="nav1 flex-column br-7">
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary active"to="#">Active</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary disabled" to="#">Disabled</Link>
</Nav.Item>
</Nav>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Nav Vertical With Border</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
						</Card.Header>
						<Card.Body>
							<Nav className="nav1 flex-column br-7 border">
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary active" to="#">Active</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary" to="#">Link</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary" to="#">Link</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary disabled" to="#">Disabled</Link></Nav.Item>
							</Nav>
						</Card.Body>
						<Collapse in={show1} className="">
							<pre>
								<code>
									{`
 <Nav className="nav1 flex-column br-7 border">
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary active"to="#">Active</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary disabled" to="#">Disabled</Link>
</Nav.Item>
</Nav>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Basic Nav</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />
						</Card.Header>
						<Card.Body>
							<Nav className="nav1 br-7">
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary active" to="#">Active</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary" to="#">Link</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary" to="#">Link</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary disabled" to="#">Disabled</Link></Nav.Item>
							</Nav>
						</Card.Body>
						<Collapse in={show2} className="">
							<pre>
								<code>
									{`
 <Nav className="nav1  br-7 ">
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary active"to="#">Active</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary disabled" to="#">Disabled</Link>
</Nav.Item>
</Nav>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Basic Nav With Border</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow3(!show3)} />
						</Card.Header>
						<Card.Body>
							<Nav className="nav1 br-7 border">
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary active" to="#">Active</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary" to="#">Link</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary" to="#">Link</Link></Nav.Item>
								<Nav.Item className="nav-item1"><Link className="nav-link text-primary disabled" to="#">Disabled</Link></Nav.Item>
							</Nav>
						</Card.Body>
						<Collapse in={show3} className="">
							<pre>
								<code>
									{`
 <Nav className="nav1  br-7 border ">
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary active"to="#">Active</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary disabled" to="#">Disabled</Link>
</Nav.Item>
</Nav>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Icon With Text Navigation</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow4(!show4)} />
						</Card.Header>
						<Card.Body>
							<Nav className="nav nav-pills nav-pills-circle" id="tabs_2" role="tablist" defaultActiveKey={'link-3'}>
								<Nav.Item className="nav-item"><Nav.Link className="nav-link border py-3 px-5 m-2" id="tab1" data-bs-toggle="tab" eventKey={'link-1'}
									href="#tabs_2_1" role="tab" aria-selected="false">
									<span className="nav-link-icon d-block"><i className="fe fe-home me-2"></i>Home</span>
								</Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item">
									<Nav.Link className="nav-link border py-3 px-5 m-2" id="tab2" data-bs-toggle="tab" eventKey={'link-2'}
										href="#tabs_2_2" role="tab" aria-selected="false">
										<span className="nav-link-icon d-block"><i className="fe fe-unlock me-2"></i>Lock</span>
									</Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item">
									<Nav.Link className="nav-link py-3 px-5 border show m-2" id="tab3" data-bs-toggle="tab" eventKey={'link-3'}
										href="#tabs_2_3" role="tab" aria-selected="true"><span className="nav-link-icon d-block"><i className="fe fe-play  me-2"></i>Videos</span>
									</Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item">
									<Nav.Link className="nav-link  border py-3 px-5 m-2" id="tab4" data-bs-toggle="tab" eventKey={'link-4'}
										href="#tabs_2_3" role="tab" aria-selected="false">
										<span className="nav-link-icon d-block"><i className="fe fe-layers  me-2"></i>Severs</span>
									</Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item">
									<Nav.Link className="nav-link border py-3 px-5 m-2" id="tab5" data-bs-toggle="tab" eventKey={'link-5'}
										href="#tabs_2_4" role="tab" aria-selected="false">
										<span className="nav-link-icon d-block"><i className="fe fe-image  me-2"></i>Gallery</span>
									</Nav.Link>
								</Nav.Item>
							</Nav>
						</Card.Body>
						<Collapse in={show4} className="">
							<pre>
								<code>
									{`
 <Nav className="nav nav-pills nav-pills-circle" id="tabs_2" role="tablist">
 <Nav.Item className="nav-item"><Link className="nav-link border py-3 px-5 m-2" id="tab1" data-bs-toggle="tab"
		 to="#tabs_2_1" role="tab" aria-selected="false">
		 <span className="nav-link-icon d-block"><i className="fe fe-home"></i>Home</span>
	 </Link>
 </Nav.Item>
 <Nav.Item className="nav-item">
	 <Link className="nav-link border py-3 px-5 m-2" id="tab2" data-bs-toggle="tab"
		 to="#tabs_2_2" role="tab" aria-selected="false">
		 <span className="nav-link-icon d-block"><i className="fe fe-unlock"></i>Lock</span>
	 </Link>
 </Nav.Item>
 <Nav.Item className="nav-item">
	 <Link className="nav-link py-3 px-5 border active show m-2" id="tab3"data-bs-toggle="tab"
	  to="#tabs_2_3" role="tab"aria-selected="true"><span className="nav-link-icon d-block"><i className="fe fe-play"></i>Videos</span>
	 </Link>
 </Nav.Item>
 <Nav.Item className="nav-item">
	 <Link className="nav-link  border py-3 px-5 m-2" id="tab4" data-bs-toggle="tab"
		 to="#tabs_2_3" role="tab" aria-selected="false">
		 <span className="nav-link-icon d-block"><i className="fe fe-layers"></i>Severs</span>
	 </Link>
 </Nav.Item>
 <Nav.Item className="nav-item">
	 <Link className="nav-link border py-3 px-5 m-2" id="tab5" data-bs-toggle="tab"
		 to="#tabs_2_4" role="tab" aria-selected="false">
		 <span className="nav-link-icon d-block"><i className="fe fe-image"></i>Gallery</span>
	 </Link>
 </Nav.Item>
</Nav>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Justified Navigation</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow5(!show5)} />
						</Card.Header>
						<Card.Body>
							<Nav className="nav nav-justified border">
								<Nav.Item className="nav-item m-2"><Link className="nav-link text-primary px-4 py-2" to="#">Home</Link></Nav.Item>
								<Nav.Item className="nav-item m-2"><Link className="nav-link text-primary px-4 py-2" to="#">About</Link></Nav.Item>
								<Nav.Item className="nav-item m-2"><Link className="nav-link text-primary px-4 py-2" to="#">Link</Link></Nav.Item>
								<Nav.Item className="nav-item m-2"><Link className="nav-link text-primary disabled px-4 py-2" to="#">Disabled</Link></Nav.Item>
							</Nav>
						</Card.Body>
						<Collapse in={show5} className="">
							<pre>
								<code>
									{`
 <Nav className="nav1  br-7 border ">
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary active"to="#">Active</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary disabled" to="#">Disabled</Link>
</Nav.Item>
</Nav>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Center Navigation</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow6(!show6)} />
						</Card.Header>
						<Card.Body>
							<Nav className="nav justify-content-center border">
								<Nav.Item className="nav-item m-2">
									<Link className="nav-link text-primary px-4 py-2" to="#">Home</Link></Nav.Item>
								<Nav.Item className="nav-item m-2">
									<Link className="nav-link active text-primary px-4 py-2" to="#">About</Link></Nav.Item>
								<Nav.Item className="nav-item m-2">
									<Link className="nav-link text-primary px-4 py-2" to="#">Link</Link></Nav.Item>
								<Nav.Item className="nav-item m-2">
									<Link className="nav-link text-primary disabled px-4 py-2" to="#">Disabled</Link></Nav.Item>
							</Nav>
						</Card.Body>
						<Collapse in={show6} className="">
							<pre>
								<code>
									{`
 <Nav className="nav justify-content-center border">
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary active"to="#">Active</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary disabled" to="#">Disabled</Link>
</Nav.Item>
</Nav>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Right Navigation</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow7(!show7)} />
						</Card.Header>
						<Card.Body>
							<Nav className="nav justify-content-end border">
								<Nav.Item className="nav-item m-2"><Link className="nav-link text-primary px-4 py-2" to="#">Home</Link></Nav.Item>
								<Nav.Item className="nav-item m-2"><Link className="nav-link text-primary px-4 py-2" to="#">About</Link></Nav.Item>
								<Nav.Item className="nav-item m-2"><Link className="nav-link text-primary px-4 py-2" to="#">Link</Link></Nav.Item>
								<Nav.Item className="nav-item m-2"><Link className="nav-link text-primary disabled px-4 py-2" to="#">Disabled</Link></Nav.Item>
							</Nav>
						</Card.Body>
						<Collapse in={show7} className="">
							<pre>
								<code>
									{`
 <Nav className="nav justify-content-end border">
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary active"to="#">Active</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary" to="#">Link</Link>
</Nav.Item>
 <Nav.Item className="nav-item1">
    <Link className="nav-link text-primary disabled" to="#">Disabled</Link>
</Nav.Item>
</Nav>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Navigation Wiith dropdown</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow8(!show8)} />
						</Card.Header>
						<Card.Body>
							<Nav className="nav-pills">
								<Nav.Item className="m-2">
									<Link className="text-primary px-4 py-2"
										to="#">Home</Link>
								</Nav.Item>
								<Nav.Item className="dropdown m-2">
									<Dropdown>
										<Dropdown.Toggle className="nav-link active px-4 py-2"
											data-bs-toggle="dropdown" role="button"
											aria-haspopup="true" aria-expanded="false">Dropdown</Dropdown.Toggle>
										<Dropdown.Menu>
											<Dropdown.Item>Action</Dropdown.Item>
											<Dropdown.Item>Another
												action</Dropdown.Item>
											<Dropdown.Item>Something else
												here</Dropdown.Item>
											<div className="dropdown-divider"></div>
											<Dropdown.Item>Separated
												link</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</Nav.Item>
								<Nav.Item><Link className="nav-link text-primary px-4 py-2" to="#">Link</Link></Nav.Item>
								<Nav.Item><Link className="nav-link text-primary disabled px-4 py-2" to="#">Disabled</Link></Nav.Item>
							</Nav>
						</Card.Body>
						<Collapse in={show8} className="">
							<pre>
								<code>
									{`
 <Nav className="nav nav-pills">
   <Nav.Item className="nav-item m-2">
	 <Link className="nav-link text-primary px-4 py-2" to="#">Home</Link>
   </Nav.Item>
 <Nav.Item className="nav-item dropdown m-2">
	<Dropdown>
	 <Dropdown.Toggle className="nav-link active dropdown-toggle px-4 py-2"
		 data-bs-toggle="dropdown" role="button"
		 aria-haspopup="true" aria-expanded="false">Dropdown
		 </Dropdown.Toggle>
	 <Dropdown.Menu>
		 <Dropdown.Item className="dropdown-item" to="#">Action</Dropdown.Item>
		 <Dropdown.Item className="dropdown-item" to="#">Anotheraction</Dropdown.Item>
		 <Dropdown.Item className="dropdown-item" to="#">Something else here</Dropdown.Item>
		 <div className="dropdown-divider"></div>
		 <Dropdown.Item className="dropdown-item" to="#">Separated link</Dropdown.Item>
	 </Dropdown.Menu>
	</Dropdown>
 </Nav.Item>
   <Nav.Item className="nav-item m-2">
     <Link className="nav-link text-primary px-4 py-2" to="#">Link</Link>
   </Nav.Item>
   <Nav.Item className="nav-item m-2">
     <Link className="nav-link text-primary disabled px-4 py-2" to="#">Disabled</Link>
	</Nav.Item>
</Nav>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Icon Nav Bar</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow9(!show9)} />

						</Card.Header>
						<Card.Body>
							<Nav className="nav nav-pills nav-pills-circle" id="tabs_3" role="tablist" defaultActiveKey={'link-3'}>
								<Nav.Item className="nav-item m-2"><Nav.Link className="nav-link px-2 py-2" data-bs-toggle="tab" href="#" eventKey={'link-1'}>
									<span className="nav-link-icon d-block text-center mx-auto">
										<i className="fe fe-home fs-15"></i></span></Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item m-2">
									<Nav.Link className="nav-link px-2 py-2" data-bs-toggle="tab" eventKey={'link-2'}
										href="#"><span
											className="nav-link-icon d-block text-center mx-auto"><i
												className="fe fe-unlock fs-15"></i></span></Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item m-2">
									<Nav.Link className="nav-link px-2 py-2" data-bs-toggle="tab" href="#" eventKey={'link-3'}><span
										className="nav-link-icon d-block text-center mx-auto"><i
											className="fe fe-play fs-15"></i></span></Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item m-2">
									<Nav.Link className="nav-link px-2 py-2" data-bs-toggle="tab" eventKey={'link-4'}
										href="#"><span
											className="nav-link-icon d-block text-center mx-auto"><i
												className="fe fe-layers fs-15"></i></span></Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item m-2">
									<Nav.Link className="nav-link px-2 py-2" data-bs-toggle="tab" eventKey={'link-5'}
										href="#"><span
											className="nav-link-icon d-block text-center mx-auto"><i
												className="fe fe-image fs-15"></i> </span></Nav.Link>
								</Nav.Item>
							</Nav>
						</Card.Body>
						<Collapse in={show9} className="">
							<pre>
								<code>
									{`
 	<Nav className="nav nav-pills nav-pills-circle" id="tabs_3" role="tablist">
	 <Nav.Item className="nav-item m-2"><Nav.Link className="nav-link px-2 py-2" data-bs-toggle="tab" href="#">
		 <span className="nav-link-icon d-block text-center mx-auto">
		 <i className="fe fe-home fs-15"></i></span></Nav.Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item m-2">
		 <Nav.Link className="nav-link px-2 py-2" data-bs-toggle="tab"
			 href="#"><span
				 className="nav-link-icon d-block text-center mx-auto"><i
					 className="fe fe-unlock fs-15"></i></span></Nav.Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item m-2">
		 <Nav.Link className="nav-link active px-2 py-2" data-bs-toggle="tab" href="#"><span
				 className="nav-link-icon d-block text-center mx-auto"><i
					 className="fe fe-play fs-15"></i></span></Nav.Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item m-2">
		 <Nav.Link className="nav-link px-2 py-2" data-bs-toggle="tab"
			 href="#"><span
				 className="nav-link-icon d-block text-center mx-auto"><i
					 className="fe fe-layers fs-15"></i></span></Nav.Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item m-2">
		 <Nav.Link className="nav-link px-2 py-2" data-bs-toggle="tab"
			 href="#"><span
				 className="nav-link-icon d-block text-center mx-auto"><i
					 className="fe fe-image fs-15"></i> </span></Nav.Link>
	 </Nav.Item>
 </Nav>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Colored Background Navigation</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow10(!show10)} />
						</Card.Header>
						<Card.Body>
							{navigations.map((navigation) => (
								<Nav key={Math.random()} className={`nav1 bg-${navigation.color} mt-4 br-7`}>
									<Nav className="nav-item1">
										<Link className="nav-link text-white active"
											to="#">Active</Link>
									</Nav>
									<Nav.Item className="nav-item1">
										<Link className="nav-link text-white" to="#">Link</Link>
									</Nav.Item>
									<Nav.Item className="nav-item1">
										<Link className="nav-link text-white" to="#">Link</Link>
									</Nav.Item>
									<Nav.Item className="nav-item1">
										<Link className="nav-link text-white disabled"
											to="#">Disabled</Link>
									</Nav.Item>
								</Nav>
							))}

						</Card.Body>
						<Collapse in={show10} className="">
							<pre>
								<code>
									{`
 	<Nav className="nav1 bg-warning mt-4 br-7">
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link text-white active"
			 to="#">Active</Link>
	 </Nav.Item >
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link text-white" to="#">Link</Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link text-white" to="#">Link</Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link text-white disabled"
			 to="#">Disabled</Link>
	 </Nav.Item>
 </Nav>
 <Nav className="nav1 bg-success mt-4 br-7">
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link text-white active"
			 to="#">Active</Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link text-white" to="#">Link</Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link text-white" to="#">Link</Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link text-white disabled"
			 to="#">Disabled</Link>
	 </Nav.Item>
 </Nav>
 <Nav className="nav1 bg-danger mt-4 br-7">
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link text-white active"
			 to="#">Active</Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link text-white" to="#">Link</Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link text-white" to="#">Link</Link>
	 </Nav.Item>
	 <Nav.Item className="nav-item1">
		 <Link className="nav-link disabled text-white"
			 to="#">Disabled</Link>
	 </Nav.Item>
 </Nav> 
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Transparent Background Navigation</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow11(!show11)} />

						</Card.Header>
						<Card.Body>
							{transperantcolors.map((transperantcolor) => (
								<Nav key={Math.random()} className={`nav1 bg-${transperantcolor.color}-transparent mt-4 br-7`}>
									<Nav.Item className="nav-item1">
										<Link className={`nav-link active text-${transperantcolor.color}`}
											to="#">Active</Link>
									</Nav.Item>
									<Nav.Item className="nav-item1">
										<Link className={`nav-link text-${transperantcolor.color}`} to="#">Link</Link>
									</Nav.Item>
									<Nav.Item className="nav-item1">
										<Link className={`nav-link text-${transperantcolor.color}`} to="#">Link</Link>
									</Nav.Item>
									<Nav.Item className="nav-item1">
										<Link className={`nav-link disabled text-${transperantcolor.color}`}
											to="#">Disabled</Link>
									</Nav.Item>
								</Nav>
							))}

						</Card.Body>
						<Collapse in={show11} className="">
							<pre>
								<code>
									{`
 <Nav className="nav1 bg-warning-transparent mt-4 br-7">
 <Nav.Item className="nav-item1">
	 <Link className="nav-link text-warning active"
		 to="#">Active</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
	 <Link className="nav-link text-warning" to="#">Link</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
	 <Link className="nav-link text-warning" to="#">Link</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
	 <Link className="nav-link text-warning disabled"
		 to="#">Disabled</Link>
 </Nav.Item>
</Nav>
<Nav className="nav1 bg-success-transparent mt-4 br-7">
 <Nav.Item className="nav-item1">
	 <Link className="nav-link text-success active"
		 to="#">Active</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
	 <Link className="nav-link text-success" to="#">Link</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
	 <Link className="nav-link text-success" to="#">Link</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
	 <Link className="nav-link text-success disabled"
		 to="#">Disabled</Link>
 </Nav.Item>
</Nav>
<Nav className="nav1 bg-danger-transparent mt-4 br-7">
 <Nav.Item className="nav-item1">
	 <Link className="nav-link text-danger active"
		 to="#">Active</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
	 <Link className="nav-link text-danger" to="#">Link</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
	 <Link className="nav-link text-danger" to="#">Link</Link>
 </Nav.Item>
 <Nav.Item className="nav-item1">
	 <Link className="nav-link disabled text-danger"
		 to="#">Disabled</Link>
 </Nav.Item>
</Nav> 
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

export default Navigation;
