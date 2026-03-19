import React, { FC, Fragment, useState } from 'react';
import { Card, Col, Row, Pagination, Form, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../layout/Header/pageheader';
interface PaginationProps { }

const Paginations: FC<PaginationProps> = () => {
	const [show, setShow] = useState(false);
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	const [show3, setShow3] = useState(false);
	const [show4, setShow4] = useState(false);
	const [show5, setShow5] = useState(false);
	const [show6, setShow6] = useState(false);
	const [show7, setShow7] = useState(false);
	return (

		<Fragment>
			<PageHeader title="Pagination" />
			<Row>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Basic pagination</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
						</Card.Header>
						<Card.Body>
							<div className="pagination-wrapper">

								<Pagination>
									<Pagination.Item className="active">
										{1}
									</Pagination.Item>
									<Pagination.Item>{2}</Pagination.Item>
									<Pagination.Item>{3}</Pagination.Item>
									<Pagination.Item>{4}</Pagination.Item>
									<Pagination.Item>{5}</Pagination.Item>
									<Pagination.Item><i className="fa fa-angle-right"></i>								
									</Pagination.Item>
								</Pagination>

							</div>

						</Card.Body>
						<Collapse in={show} className="">
							<pre>
								<code>
									{`
                    <Pagination>
                       <Pagination.Item  className="active">{1}</Pagination.Item>
                       <Pagination.Item>{2}</Pagination.Item>
                       <Pagination.Item>{3}</Pagination.Item>
                       <Pagination.Item>{4}</Pagination.Item>
                       <Pagination.Item>{5}</Pagination.Item>
                       <Pagination.Next />
                    </Pagination>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Basic pagination</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
						</Card.Header>
						<Card.Body>
							<Pagination>
								<Pagination.Item disabled>Prev</Pagination.Item>
								<Pagination.Item className="active">
									{1}
								</Pagination.Item>
								<Pagination.Item>{2}</Pagination.Item>
								<Pagination.Item>{3}</Pagination.Item>
								<Pagination.Item>{4}</Pagination.Item>
								<Pagination.Next>Next</Pagination.Next>
							</Pagination>
						</Card.Body>
						<Collapse in={show1} className="">
							<pre>
								<code>
									{`
                <Pagination>
				   <Pagination.Item disabled>Prev</Pagination.Item>
                   <Pagination.Item  className="active">{1}</Pagination.Item>
                   <Pagination.Item>{2}</Pagination.Item>
                   <Pagination.Item>{3}</Pagination.Item>
                   <Pagination.Item>{4}</Pagination.Item>
                   <Pagination.Item>{5}</Pagination.Item>
                   <Pagination.Next />
                </Pagination>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Model Pagination</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />
						</Card.Header>
						<Card.Body>
							<Pagination>
							<Pagination.Item><i className="fa fa-angle-double-left"></i>
							</Pagination.Item>
							<Pagination.Item><i className="fa fa-angle-left"></i></Pagination.Item>
								<Pagination.Item>{2}</Pagination.Item>
								<Pagination.Item className='active'>{3}</Pagination.Item>
								<Pagination.Item>{4}</Pagination.Item>
								<Pagination.Item><i className="fa fa-angle-right"></i>
							</Pagination.Item>
							<Pagination.Item><i className="fa fa-angle-double-right"></i>
							</Pagination.Item>
							</Pagination>
						</Card.Body>
						<Collapse in={show2} className="">
							<pre>
								<code>
									{`
            <Pagination>
			  <Pagination.First />
			  <Pagination.Prev />
			  <Pagination.Item>{2}</Pagination.Item>
			  <Pagination.Item>{3}</Pagination.Item>
			  <Pagination.Item>{4}</Pagination.Item>
			  <Pagination.Next />
			  <Pagination.Last />
		  </Pagination>
`}
								</code>
							</pre>
						</Collapse>

					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Model Pagination2</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow3(!show3)} />
						</Card.Header>
						<Card.Body>

							<Pagination>
							<Pagination.Item><i className="fa fa-angle-double-left"></i>
							</Pagination.Item>
							<Pagination.Item><i className="fa fa-angle-left"></i></Pagination.Item>
								<Pagination.Item active>{4}</Pagination.Item>
								<Pagination.Ellipsis />
								<Pagination.Item>{10}</Pagination.Item>
								<Pagination.Item><i className="fa fa-angle-right"></i>
							</Pagination.Item>
							<Pagination.Item><i className="fa fa-angle-double-right"></i>
							</Pagination.Item>
							</Pagination>
						</Card.Body>
						<Collapse in={show3} className="">
							<pre>
								<code>
									{`
        <Pagination>
			<Pagination.Prev />
			<Pagination.First />
			<Pagination.Item active>{4}</Pagination.Item>
			<Pagination.Ellipsis />
			<Pagination.Item>{10}</Pagination.Item>
			<Pagination.Next />
			<Pagination.Last />
		</Pagination>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Model Pagination2</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow4(!show4)} />
						</Card.Header>
						<Card.Body>
							<Pagination>
							<Pagination.Item><i className="fa fa-angle-left"></i></Pagination.Item>
								<Pagination.Item>{1}</Pagination.Item>
								<Pagination.Item>{2}</Pagination.Item>
								<Pagination.Item>{3}</Pagination.Item>
								<Pagination.Item><i className="fa fa-angle-right"></i></Pagination.Item>
								</Pagination>
						</Card.Body>
						<Collapse in={show4} className="">
							<pre>
								<code>
									{`
    <Pagination>
	   <Pagination.Prev />
	   <Pagination.Item>{1}</Pagination.Item>
	   <Pagination.Item>{2}</Pagination.Item>
	   <Pagination.Item>{3}</Pagination.Item>
	   <Pagination.Next />
   </Pagination>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Pagination left alignment</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow5(!show5)} />
						</Card.Header>
						<Card.Body>
							<Pagination>
							<Pagination.Item disabled><i className="fa fa-angle-left"></i></Pagination.Item>
								<Pagination.Item>{1}</Pagination.Item>
								<Pagination.Item active>{2}</Pagination.Item>
								<Pagination.Item>{3}</Pagination.Item>
								<Pagination.Item><i className="fa fa-angle-right"></i></Pagination.Item>
							</Pagination>
						</Card.Body>
						<Collapse in={show5} className="">
							<pre>
								<code>
									{`
                    <Pagination>
                       <Pagination.Prev disabled />
                       <Pagination.Item>{1}</Pagination.Item>
                       <Pagination.Item active>{2}</Pagination.Item>
                       <Pagination.Item>{3}</Pagination.Item>
                       <Pagination.Next />
                    </Pagination>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Pagination center alignment</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow6(!show6)} />
						</Card.Header>
						<Card.Body>

							<Pagination className="pagination justify-content-center">
							<Pagination.Item disabled><i className="fa fa-angle-left"></i></Pagination.Item>
								<Pagination.Item>{1}</Pagination.Item>
								<Pagination.Item active>{2}</Pagination.Item>
								<Pagination.Item>{3}</Pagination.Item>
								<Pagination.Item><i className="fa fa-angle-right"></i></Pagination.Item>
							</Pagination>
						</Card.Body>
						<Collapse in={show6} className="">
							<pre>
								<code>
									{`
                <Pagination className="pagination justify-content-center">
				   <Pagination.Prev disabled />
				  <Pagination.Item>{1}</Pagination.Item>
				  <Pagination.Item active>{2}</Pagination.Item>
				  <Pagination.Item>{3}</Pagination.Item>
				  <Pagination.Next />
			  </Pagination>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Pagination Right Alignment</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow7(!show7)} />
						</Card.Header>
						<Card.Body>

							<Pagination className="pagination float-end">
							<Pagination.Item disabled><i className="fa fa-angle-left"></i></Pagination.Item>
								<Pagination.Item>{1}</Pagination.Item>
								<Pagination.Item active>{2}</Pagination.Item>
								<Pagination.Item>{3}</Pagination.Item>
								<Pagination.Item><i className="fa fa-angle-right"></i></Pagination.Item>
							</Pagination>
						</Card.Body>
						<Collapse in={show7} className="">
							<pre>
								<code>
									{`
            <Pagination className="pagination float-end">
				<Pagination.Prev disabled />
			   <Pagination.Item>{1}</Pagination.Item>
			   <Pagination.Item active>{2}</Pagination.Item>
			   <Pagination.Item>{3}</Pagination.Item>
			   <Pagination.Next />
		   </Pagination>
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

export default Paginations;
