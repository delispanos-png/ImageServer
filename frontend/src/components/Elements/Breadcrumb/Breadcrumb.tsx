import React, { FC, Fragment, useState } from 'react';
import { Card, Col, Row, Breadcrumb, Form, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../layout/Header/pageheader';

interface BreadcrumbProps { }

const Breadcrumbs: FC<BreadcrumbProps> = () => {
	const [show, setShow] = useState(false);
	const [show1, setShow1] = useState(false);

	return (

		<Fragment>
			<PageHeader title="Breadcrumbs" />
			<Row>
				<Col md={12} lg={12}>
					<Card>
						<Card.Header>
							<h3 className="card-title me-5">Simple Breadcrumbs</h3>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
						</Card.Header>
						<Card.Body>
							<Breadcrumb>
								<Breadcrumb.Item className="breadcrumb-item1 mt-5 ms-4" href="#"> Home</Breadcrumb.Item>
								<Breadcrumb.Item className="breadcrumb-item1 mt-5" href="#" active>About</Breadcrumb.Item>
							</Breadcrumb>
							<Breadcrumb>
								<Breadcrumb.Item className='breadcrumb-item1 mt-5 ms-4' href="#">Home</Breadcrumb.Item>
								<Breadcrumb.Item className='mt-5' href="#" active>Library</Breadcrumb.Item>
							</Breadcrumb>
							<Breadcrumb>
								<Breadcrumb.Item className="breadcrumb-item1 mt-5 ms-4" href="#">Home</Breadcrumb.Item>
								<Breadcrumb.Item className="breadcrumb-item1 mt-5" href="#">Library</Breadcrumb.Item>
								<Breadcrumb.Item className="breadcrumb-item1 mt-5 " href="#" active>Data</Breadcrumb.Item>
							</Breadcrumb>
						</Card.Body>
						<Collapse in={show} className="">
							<pre>
								<code>
									{`
 <Breadcrumb>
 <Breadcrumb.Item className="breadcrumb-item1" href="#"> Home</Breadcrumb.Item>
 <Breadcrumb.Item className="breadcrumb-item1" active>About</Breadcrumb.Item>
</Breadcrumb>
<Breadcrumb>
<Breadcrumb.Item href="#">Home</Breadcrumb.Item>
 <Breadcrumb.Item active>Library</Breadcrumb.Item>
</Breadcrumb>
<Breadcrumb>
 <Breadcrumb.Item className="breadcrumb-item1" href="#">Home</Breadcrumb.Item>
 <Breadcrumb.Item className="breadcrumb-item1"href="#">Library</Breadcrumb.Item>
 <Breadcrumb.Item className="breadcrumb-item1 " active>Data</Breadcrumb.Item>
</Breadcrumb>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12} lg={12}>
					<Card id="breadcrumb4">
						<Card.Header>
							<Card.Title>Icon Breadcrumbs</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
						</Card.Header>
						<Card.Body>
							<div aria-label="breadcrumb">
								<Breadcrumb className="border bg-transparent">
									<Breadcrumb.Item className="breadcrumb-item1 mt-3 ms-4" href="#" active><i
										className="fe fe-home me-2 white-text"></i>Home
									</Breadcrumb.Item>
									<Breadcrumb.Item className="breadcrumb-item1 mt-3 mb-3" href="#" active>About</Breadcrumb.Item>
								</Breadcrumb>
								<Breadcrumb >
									<Breadcrumb.Item className='breadcrumb-item1 mt-5 ms-4' href="#"><i
										className="fe fe-home me-2"></i>Home</Breadcrumb.Item>
									<Breadcrumb.Item className="breadcrumb-item1 mt-5" href="#" active><i className="fe fe-home me-2 text-white"
									></i>Library</Breadcrumb.Item>
								</Breadcrumb>
								<div className=" breadcrumb1 bg-primary mt-5 ">
									<Breadcrumb.Item className='breadcrumb-item1' href="#"><i className="fe fe-home me-2 text-white"
										></i><span className='text-white'>Home</span></Breadcrumb.Item>
									<Breadcrumb.Item className="breadcrumb-item1" href="#"><i className="fe fe-home me-2 text-white"
										></i><span className='text-white'>Library</span></Breadcrumb.Item>
									<Breadcrumb.Item className="breadcrumb-item1 active" href="#"><i
											className="fe fe-home me-2 text-white"></i><span className='text-white'>Data</span>
									</Breadcrumb.Item>
								</div>
							</div>
						</Card.Body>
						<Collapse in={show1} className="">
							<pre>
								<code>
									{`
	<Breadcrumb className="bg-transparent">
 <Breadcrumb.Item className="active "><iclassName="fe fe-home me-2 white-text" aria-hidden="true"></iclassName=>Home</Breadcrumb.Item>
<Breadcrumb.Item className="active ">About</Breadcrumb.Item></Breadcrumb>
</Breadcrumb>
<Breadcrumb>
<Breadcrumb.Item className=''><Link to="#"><i className="fe fe-home me-2" aria-hidden="true"></i>Home</Link></Breadcrumb.Item>
<Breadcrumb.Item className="active "><i className="fe fe-home me-2" aria-hidden="true"></i>Library</Breadcrumb.Item>
</Breadcrumb>
<Breadcrumb className=" breadcrumb1 bg-primary">
<Breadcrumb.Item className=''><Link to="#" className="text-white m"><i className="fe fe-home me-2 white-text" aria-hidden="true"></i>Home</Link></Breadcrumb.Item>
<Breadcrumb.Item className=" text-white "><Link to="#" className="text-white"><i className="fe fe-home me-2 white-text"  aria-hidden="true"></i>Library</Link></Breadcrumb.Item>
<Breadcrumb.Item className="breadcrumb-item1 active text-white "><i className="fe fe-home me-2 white-text" aria-hidden="true"></i>Data</Breadcrumb.Item>
</Breadcrumb>
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

export default Breadcrumbs;
