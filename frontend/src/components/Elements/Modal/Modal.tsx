import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Modal ,Col, Row, Form, Collapse, } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../layout/Header/pageheader';
import Rodal from "rodal";
import 'rodal/lib/rodal.css';
// interface ModalProps {}
function Modals(this: any) {
  //show code
  const [showdata, setShowdata] = useState(false);
  const [showdata1, setShowdata1] = useState(false);
  const [showdata2, setShowdata2] = useState(false);
  const [showdata3, setShowdata3] = useState(false);
  const [showdata4, setShowdata4] = useState(false);
  const [showdata5, setShowdata5] = useState(false);
  const [showdata6, setShowdata6] = useState(false);

  //Basic Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
//Small Modal
const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  //Large Modal
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  //Small Button
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
  //Default Button
  const [show4, setShow4] = useState(false);

  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);
  //Large Button
  const [show5, setShow5] = useState(false);

  const handleClose5 = () => setShow5(false);
  const handleShow5 = () => setShow5(true);
  //Success Alert Message
  const [show6, setShow6] = useState(false);
  const handleClose6 = () => setShow6(false);
  const handleShow6 = () => setShow6(true);
  //Warning Alert Message
  const [show7, setShow7] = useState(false);
  const handleClose7 = () => setShow7(false);
  const handleShow7 = () => setShow7(true);
  //Scale
  const [show8, setShow8] = useState(false);

  const handleClose8 = () => setShow8(false);
  const handleShow8 = () => setShow8(true);
  // //Animated Modal
  const [visible, setVisible] = useState(false);

  const [animation1, setanimation1] = useState(false);
  const [animation2, setanimation2] = useState(false);
  const [animation3, setanimation3] = useState(false);
  const [animation4, setanimation4] = useState(false);
  const [animation5, setanimation5] = useState(false);
  const [animation6, setanimation6] = useState(false);
  const [animation7, setanimation7] = useState(false);
  const [animation8, setanimation8] = useState(false);
  const [animation9, setanimation9] = useState(false);

  const hide = () => {
    setVisible(false);
  };

  let viewDemoShow1 = (modal) => {
    switch (modal) {
      case "Basic":
        setanimation1(true)
        break;
      case "show2":
        setanimation2(true)
        break;
      case "show3":
        setanimation3(true)
        break;
      case "show4":
        setanimation4(true)
        break;
      case "show5":
        setanimation5(true)
        break;
      case "show6":
        setanimation6(true)
        break;
      case "show7":
        setanimation7(true)
        break;
      case "show8":
        setanimation8(true)
        break;
      case "show9":
        setanimation9(true)
        break;
    }
  }

  let viewDemoClose1 = (modal) => {
    switch (modal) {
      case "Basic":
        setanimation1(false)
        break;
      case "show2":
        setanimation2(false)
        break;
      case "show3":
        setanimation3(false)
        break;
      case "show4":
        setanimation4(false)
        break;
      case "show5":
        setanimation5(false)
        break;
      case "show6":
        setanimation6(false)
        break;
      case "show7":
        setanimation7(false)
        break;
      case "show8":
        setanimation8(false)
        break;
      case "show9":
        setanimation9(false)
        break;
    }
  }


  
  return (
    <Fragment>

      <PageHeader title="Modals" />
        <Col lg={12}>
          <Card id="Modal">
            <Card.Header>
              <Card.Title>
                Basic Modal
              </Card.Title>
              <Form.Check  type="switch"  className='ms-auto' label="show code" onClick={()=>setShowdata(!showdata)}/>
            </Card.Header>

              <div className="p-4 bg-light  border-bottom-0">
                <div className="modal d-block pos-static" data-bs-backdrop="static"
                  data-bs-keyboard="false" aria-hidden="true">
                  <div className="modal-dialog" role="document">

                    <div className="modal d-block pos-static" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
												<div className="modal-dialog" role="document">
													<div className="modal-content modal-content-demo">
														<div className="modal-header">
															<h6 className="modal-title">Message Preview</h6>
															<button aria-label="Close" className="btn-close" data-bs-dismiss="modal" type="button"><span aria-hidden="true"></span></button>
														</div>
														<div className="modal-body">
															<h6>Why We Use Electoral College, Not Popular Vote</h6>
															<p>It is a long established fact that a reader will be
																distracted by the readable content of a page when
																looking at
																its layout. The point of using Lorem Ipsum is that it
																has a
																more-or-less normal distribution of letters, as opposed
																to
																using 'Content here, content here', making it look like
																readable English.</p>
														</div>
														<div className="modal-footer">
															<button className="btn btn-primary" type="button">Save
																changes</button> <button className="btn btn-secondary" type="button">Close</button>
														</div>
													</div>
												</div>
											</div>
                        <Modal   show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                        <Modal.Header>
                        <Modal.Title>Message Preview</Modal.Title>
                      <Button onClick={handleClose} className="btn-close text-dark border-0" variant=''>
                      <span aria-hidden="true">&times;</span></Button>
                        </Modal.Header>
                        

                      
                      <Modal.Body>
                        <h6>Why We Use Electoral College, Not Popular Vote</h6>
                        <p>It is a long established fact that a reader will be
                          distracted by the readable content of a page when
                          looking at
                          its layout. The point of using Lorem Ipsum is that it
                          has a
                          more-or-less normal distribution of letters, as opposed
                          to
                          using 'Content here, content here', making it look like
                          readable English.</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="primary" type="button" >Save
                      changes</Button>
                       <Button onClick={handleClose} variant="secondary"
                      type="button">Close</Button>
                      </Modal.Footer>
                      </Modal>

                  </div>
                </div>
              </div>
              <div className="text-center py-4 bg-light border">
     <Button onClick={handleShow} className="btn btn-primary" data-bs-target="#modaldemo1"
              data-bs-toggle="modal">View Live Demo</Button> 
          </div>
              <Collapse in={showdata} className="">
									<pre>
										<code>
											{`
 export consy Modal = () = {
   const [show, setShow] = useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
   return(
  <Modal  show={show} onHide={handleClose} backdrop="static" keyboard={false}>
    <Modal.Header>
      <Modal.Title>Message Preview</Modal.Title>
      <Button onClick={handleClose} className="btn-close btn-close-white"><span aria-hidden="true">×</span></Button>
    </Modal.Header>
    <Modal.Body>
      <h6>Why We Use Electoral College, Not Popular Vote</h6>
       <p>It is a long established fact that a reader will be
      distracted by the readable content of a page when
      looking at
      its layout. The point of using Lorem Ipsum is that it
      has a
      more-or-less normal distribution of letters, as opposed
      to
      using 'Content here, content here', making it look like
      readable English.</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" type="button">Save changes</Button>
      <Button onClick={handleClose} variant="secondary" type="button">Close</Button>
    </Modal.Footer>
  </Modal>
  )
   };
`}
										</code>
									</pre>
								</Collapse>
          </Card>
        </Col>
        <Card id="modal1">
          <Card.Header>
            <Card.Title>
              Small Modal
            </Card.Title>
            <Form.Check  type="switch"  className='ms-auto' label="show code" onClick={()=>setShowdata1(!showdata1)}/>
          </Card.Header>
            <div className="p-4 bg-light border border-bottom-0">
              <div className="modal d-block pos-static">
                <div className="modal-dialog modal-sm" role="document">
               

											<div className="modal d-block pos-static">
												<div className="modal-dialog modal-sm" role="document">
													<div className="modal-content modal-content-demo">
														<div className="modal-header">
															<h6 className="modal-title">Notice</h6><button
																aria-label="Close" className="btn-close"
																data-bs-dismiss="modal" type="button"><span
																	aria-hidden="true">&times;</span></button>
														</div>
														<div className="modal-body">
															<p>It is a long established fact that a reader will be
																distracted by the readable content of a page when
																looking at
																its layout.</p>
														</div>
														<div className="modal-footer justify-content-center">
															<button className="btn btn-primary" type="button">Save
																changes</button> <button className="btn btn-secondary"
																type="button">Close</button>
														</div>
													</div>
												</div>
											</div>
										</div> 
                    <Modal size='sm' show={show1} onHide={handleClose1} backdrop="static" keyboard={false}>
                    <Modal.Header>
                      <Modal.Title>Notice</Modal.Title>
                      <Button onClick={handleClose1} className="btn-close text-dark border-0" variant=''>
                        <span aria-hidden="true">×</span></Button>
                    </Modal.Header>
                    <Modal.Body>
                      <p>It is a long established fact that a reader will be
                        distracted by the readable content of a page when
                        looking at
                        its layout.</p>
                    </Modal.Body>
                    <Modal.Footer className="modal-footer justify-content-center">
                      <Button variant="primary" type="button" >Save
                        changes</Button>
                         <Button  onClick={handleClose1} variant="secondary"
                          type="button">Close</Button>
                    </Modal.Footer>
                    </Modal>
                  </div>
                </div>
            <div className="text-center py-4 bg-light border">
              <Button onClick={handleShow1} className="btn btn-primary" data-bs-target="#modaldemo2"
                data-bs-toggle="modal">View Live Demo</Button>
            </div>
            <Collapse in={showdata1} className="">
									<pre>
										<code>
											{`
export const Modal = () = {
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  return(
<Modal size='sm' show={show1} onHide={handleClose1} backdrop="static" keyboard={false}>
<Modal.Header>
  <Modal.Title>Notice</Modal.Title>
  <Button onClick={handleClose1} className="btn-close btn-close-white"> <span aria-hidden="true">×</span></Button>
</Modal.Header>
<Modal.Body>
  <p>It is a long established fact that a reader will be
  distracted by the readable content of a page when
  looking at
  its layout.</p>
</Modal.Body>
<Modal.Footer className="modal-footer justify-content-center">
  <Button variant="primary" type="button">Save changes</Button>
  <Button  onClick={handleClose1} variant="secondary" type="button">Close</Button>
</Modal.Footer>
</Modal>
)
  };
`}
										</code>
									</pre>
								</Collapse>
        </Card>
        <Card id="modal2">
          <Card.Header>
            <Card.Title>
              Large Modal
            </Card.Title>
            <Form.Check  type="switch"  className='ms-auto' label="show code" onClick={()=>setShowdata2(!showdata2)}/>
          </Card.Header>
         
            <div className="p-4 bg-light border border-bottom-0">
              <div className="modal  d-block pos-static">
                <div className="modal-dialog modal-lg" role="document">
											<div className="modal  d-block pos-static">
												<div className="modal-dialog modal-lg" role="document">
													<div className="modal-content modal-content-demo">
														<div className="modal-header">
															<h6 className="modal-title">Message Preview</h6><button
																aria-label="Close" className="btn-close"
																data-bs-dismiss="modal" type="button"><span
																	aria-hidden="true">&times;</span></button>
														</div>
														<div className="modal-body">
															<h6>Why We Use Electoral College, Not Popular Vote</h6>
															<p>It is a long established fact that a reader will be
																distracted by the readable content of a page when
																looking at
																its layout. The point of using Lorem Ipsum is that it
																has a
																more-or-less normal distribution of letters, as opposed
																to
																using 'Content here, content here', making it look like
																readable English.</p>
														</div>
														<div className="modal-footer">
															<button className="btn btn-primary" type="button">Save
																changes</button>
															<button className="btn btn-secondary"
																type="button">Close</button>
														</div>
													</div>
												</div>
											</div>
										</div>
                    <Modal size='lg' show={show2} onHide={handleClose2} backdrop="static" keyboard={false}>
                    <Modal.Header>
<Modal.Title>Message Preview</Modal.Title>
                      <Button onClick={handleClose2} className="btn-close  text-dark border-0" variant='' type="button"><span aria-hidden="true">&times;</span></Button>
                    </Modal.Header>
                    <Modal.Body>
                      <h6>Why We Use Electoral College, Not Popular Vote</h6>
                      <p>It is a long established fact that a reader will be
                        distracted by the readable content of a page when
                        looking at
                        its layout. The point of using Lorem Ipsum is that it
                        has a
                        more-or-less normal distribution of letters, as opposed
                        to
                        using 'Content here, content here', making it look like
                        readable English.</p>
                    </Modal.Body>
                    <Modal.Footer className="modal-footer">
                      <Button variant="primary" type="button">Save
                        changes</Button>
                      <Button onClick={handleClose2} variant="secondary"
                        type="button">Close</Button>
                        </Modal.Footer>
                        </Modal>
                    </div>
                  </div>
            <div className="text-center py-4 bg-light border">
              <Button onClick={handleShow2} className="btn btn-primary" data-bs-target="#modaldemo3"
                data-bs-toggle="modal" >View Live Demo</Button>
            </div>
            <Collapse in={showdata2} className="">
									<pre>
										<code>
											{`
export const Modal = () = {
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  return (
  <Modal size='lg' show={show2} onHide={handleClose2} backdrop="static" keyboard={false}>
      <Modal.Header>
          <Modal.Title>Message Preview</Modal.Title>
          <Button onClick={handleClose2} className="btn-close  btn-close-white" type="button"><span aria-hidden="true">&times;</span></Button>
      </Modal.Header>
      <Modal.Body>
          <h6>Why We Use Electoral College, Not Popular Vote</h6>
          <p>It is a long established fact that a reader will be
          distracted by the readable content of a page when
          looking atits layout. The point of using Lorem Ipsum is 
          that ithas more-or-less normal distribution of letters, as 
          opposedtousing 'Content here, content here', making it look
           like readable English.</p>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
          <Button variant="primary" type="button">Savechanges</Button>
          <Button onClick={handleClose2} variant="secondary" type="button">Close</Button>
      </Modal.Footer>
   </Modal>
   )
  };
`}
										</code>
									</pre>
								</Collapse>
        </Card>
        <Card id="modal3">
          <Card.Header>
            <Card.Title>
              Success Alert Messages
            </Card.Title>
            <Form.Check  type="switch"  className='ms-auto' label="show code" onClick={()=>setShowdata3(!showdata3)}/>
          </Card.Header>
          
            <div className="p-4 bg-light border border-bottom-0">
              <div className="modal d-block pos-static">
                <div className="modal-dialog" role="document">
            
											<div className="modal d-block pos-static">
												<div className="modal-dialog" role="document">
													<div className="modal-content">
														<div className="modal-body text-center p-4">
															<button aria-label="Close" className="btn-close"
																data-bs-dismiss="modal" type="button"><span
																	aria-hidden="true">&times;</span></button>
															<i
																className="fe fe-check-circle fs-70 text-success lh-1 mb-4 d-inline-block"></i>
															<h4 className="text-success mb-4">Congratulations!</h4>
															<p className="mb-4 mx-4">There are many variations of passages
																of
																Lorem Ipsum available, but the majority have suffered
																alteration.</p><button className="btn btn-success pd-x-25"
																type="button">Continue</button>
														</div>
													</div>
												</div>
											</div>
										</div>
                   
                    <Modal  aria-labelledby="contained-modal-title-vcenter" centered show={show6} onHide={handleClose6} backdrop="static" keyboard={false}>
                    <Modal.Body className="modal-body text-center p-4">
                    <Button onClick={handleClose6} className="btn-close  text-dark border-0" variant='' type="button"><span  aria-hidden="true">&times;</span></Button>
                      <i className="fe fe-check-circle fs-70 text-success lh-1 mb-4 d-inline-block"></i>
                      <h4 className="text-success mb-4">Congratulations!</h4>
                      <p className="mb-4 mx-4">There are many variations of passages
                        of
                        Lorem Ipsum available, but the majority have suffered
                        alteration.</p>
                        <Button onClick={handleClose6} className=" pd-x-25" variant='success'
                          type="button">Continue</Button>
                    </Modal.Body>
                    </Modal>
                  </div>
                </div>
          
            <div className="text-center py-4 bg-light border">
              <Button onClick={handleShow6} className="btn btn-primary" data-bs-target="#modaldemo4"
                data-bs-toggle="modal">View Live Demo</Button>
            </div>
            <Collapse in={showdata3} className="">
									<pre>
										<code>
                      {`
 export const Modal = () = {
  const [show6, setShow6] = useState(false);
  const handleClose6 = () => setShow6(false);
  const handleShow6 = () => setShow6(true);
											return (
     <Modal  aria-labelledby="contained-modal-title-vcenter" centered show={show6} onHide={handleClose6} backdrop="static" keyboard={false}>
       <Modal.Body className="modal-body text-center p-4">
           <Button onClick={handleClose6} className="btn-close  btn-close-white" type="button"><span aria-hidden="true">&times;</span></Button>
           <i className="fe fe-check-circle fs-70 text-success lh-1 mb-4 d-inline-block"></i>
            <h4 className="text-success mb-4">Congratulations!</h4>
            <p className="mb-4 mx-4">There are many variations of passages
            of Lorem Ipsum available, but the majority have suffered
             alteration.</p>
          <Button onClick={handleClose6} className=" pd-x-25" variant='success' type="button">Continue</Button>
     </Modal.Body>
   </Modal>
   )
 };
`}
										</code>
									</pre>
								</Collapse>
        </Card>
        <Card id="modal4">
          <Card.Header>
            <Card.Title>
              Warning Alert Messages
            </Card.Title>
            <Form.Check  type="switch"  className='ms-auto' label="show code" onClick={()=>setShowdata4(!showdata4)}/>
          </Card.Header>
        
            <div className="p-4 bg-light border border-bottom-0 mg-t-20">
              <div className="modal d-block pos-static">
                <div className="modal-dialog" role="document">
											<div className="modal d-block pos-static">
												<div className="modal-dialog" role="document">
													<div className="modal-content">
														<div className="modal-body text-center p-4">
															<button aria-label="Close" className="btn-close"
																data-bs-dismiss="modal" type="button"><span
																	aria-hidden="true">&times;</span></button>
															<i
																className="fe fe-x-circle fs-70 text-danger lh-1 mb-4 d-inline-block"></i>
															<h4 className="text-danger mb-20">Error: Cannot process your
																entry!
															</h4>
															<p className="mb-4 mx-4">There are many variations of passages
																of
																Lorem Ipsum available, but the majority have suffered
																alteration.</p><button aria-label="Close"
																className="btn btn-danger pd-x-25"
																type="button">Continue</button>
														</div>
													</div>
												</div>
											</div>
										</div>
                    <Modal  aria-labelledby="contained-modal-title-vcenter" centered show={show7} onHide={handleClose7} backdrop="static" keyboard={false}>
                    <Modal.Body className="modal-body text-center p-4">
                      <Button onClick={handleClose7} className="btn-close  btn text-dark "type="button" variant=''><span aria-hidden="true">&times;</span></Button>
                      <i className="fe fe-x-circle fs-70 text-danger lh-1 mb-4 d-inline-block"></i>
                      <h4 className="text-danger mb-20">Error: Cannot process your
                        entry!
                      </h4>
                      <p className="mb-4 mx-4">There are many variations of passages
                        of
                        Lorem Ipsum available, but the majority have suffered
                        alteration.</p>
                        <Button onClick={handleClose7} aria-label="Close"
                          className="pd-x-25" variant='danger'
                          type="button">Continue</Button>
                    </Modal.Body>
                    </Modal>
                  </div>
                </div>
            <div className="text-center py-4 bg-light border">
              <Button onClick={handleShow7} className="btn btn-primary" data-bs-target="#modaldemo5"
                data-bs-toggle="modal">View Live Demo</Button>
            </div>
            <Collapse in={showdata4} className="">
									<pre>
										<code>
											{`
export const Modal = ()= {
  const [show7, setShow7] = useState(false);
  const handleClose7 = () => setShow7(false);
  const handleShow7 = () => setShow7(true);
  return(
    <Modal  aria-labelledby="contained-modal-title-vcenter" centered show={show7} onHide={handleClose7} backdrop="static" keyboard={false}>
       <Modal.Body className="modal-body text-center p-4">
          <Button onClick={handleClose7} className="btn-close  btn-close-white "type="button"><span aria-hidden="true">&times;</span></Button>
          <i className="fe fe-x-circle fs-70 text-danger lh-1 mb-4 d-inline-block"></i>
           <h4 className="text-danger mb-20">Error: Cannot process your entry! </h4>
              <p className="mb-4 mx-4">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.</p>
            <Button onClick={handleClose7} aria-label="Close"className="pd-x-25" variant='danger'type="button">Continue</Button>
      </Modal.Body>
   </Modal>
   )
  };
`}
										</code>
									</pre>
								</Collapse>
        </Card>
        <div className="card" id="modal5">
            <Card.Header className="card-header border-bottom-0">
              <Card.Title className=''>Modal Animation Effects</Card.Title>
              <Form.Check  type="switch"  className='ms-auto' label="show code" onClick={()=>setShowdata6(!showdata6)}/>
            </Card.Header>
            <Card.Body>
            <Row className="row-sm">
								<Col sm={6} md={4} xl={3} className="col-sm-6 col-md-4 col-xl-3">
									<Link to="#" className="modal-effect btn btn-primary btn-block mb-3"  onClick={() => viewDemoShow1("Basic")}>Zoom</Link>
									<Rodal onClose={hide} visible={animation1} animation='Scale' height={300}>
										<h6 className='modal-header'>Message Preview
											<Link to='#'><span className="d-flex ms-auto text-dark" onClick={() => { viewDemoClose1("Basic") }}><i className='fe fe-x ms-auto'></i></span></Link>
										</h6>
										<div className='modal-body'>
											<h6>Why We Use Electoral College, Not Popular Vote</h6>
											It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</div>
										<div className='modal-footer'>
											<Button className="" variant="primary" onClick={() => viewDemoClose1("Basic")}>Save Changes</Button>
											<Button className='' variant="secondary" onClick={() => viewDemoClose1("Basic")}>Close</Button>
										</div>
									</Rodal>
								</Col>
								<Col sm={6} md={4} xl={3} className="mg-t-20 mg-sm-t-0">
									<Link to="#" className="modal-effect btn btn-primary btn-block mb-3" onClick={() => viewDemoShow1("show2")}>Fade</Link>
									<Rodal onClose={hide} visible={animation2} animation='fade' height={300}>
										<h6 className='modal-header'>Message Preview
										<Link to='#'><span className="d-flex ms-auto text-dark" onClick={() => { viewDemoClose1("show2") }}><i className='fe fe-x ms-auto'></i></span></Link>
										</h6>
										<div className='modal-body'>
											<h6>Why We Use Electoral College, Not Popular Vote</h6>
											It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</div>
										<div className='modal-footer'>
											<Button className="" variant="primary" onClick={() => viewDemoClose1("show2")}>Save Changes</Button>
											<Button variant="secondary" onClick={() => viewDemoClose1("show2")}>Close</Button>
										</div>
									</Rodal>
								</Col>
								<Col sm={6} md={4} xl={3} className="mg-t-20 mg-md-t-0">
									<Link to="#" className="modal-effect btn btn-primary btn-block mb-3" onClick={() => viewDemoShow1("show3")}>Flip</Link>
									<Rodal onClose={hide} visible={animation3} animation='flip' height={300}>
										<h6 className='modal-header'>Message Preview
											<Link to='#'><span className="d-flex ms-auto text-dark" onClick={() => { viewDemoClose1("show3") }}><i className='fe fe-x ms-auto'></i></span></Link>
										</h6>
										<div className='modal-body'>
											<h6>Why We Use Electoral College, Not Popular Vote</h6>
											It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</div>
										<div className='modal-footer'>
											<Button variant="primary" onClick={() => viewDemoClose1("show3")}>Save Changes</Button>
											<Button variant="secondary" onClick={() => viewDemoClose1("show3")}>Close</Button>
										</div>
									</Rodal>
								</Col>
								<Col sm={6} md={4} xl={3} className="mg-t-20 mg-xl-t-0">
									<Link to="#" className="modal-effect btn btn-primary btn-block mb-3" onClick={() => viewDemoShow1("show4")}>Door</Link>
									<Rodal onClose={hide} visible={animation4} animation='door' height={300}>
										<h6 className='modal-header'>Message Preview
											<Link to='#'><span className="d-flex ms-auto text-dark" onClick={() => { viewDemoClose1("show4") }}><i className='fe fe-x ms-auto'></i></span></Link>
										</h6>
										<div className='modal-body'>
											<h6>Why We Use Electoral College, Not Popular Vote</h6>
											It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</div>
										<div className='modal-footer'>
											<Button className="" variant="primary" onClick={() => viewDemoClose1("show4")}>Save Changes</Button>
											<Button variant="secondary" onClick={() => viewDemoClose1("show4")}>Close</Button>
										</div>
									</Rodal>
								</Col>
								<Col sm={6} md={4} xl={3} className="mg-t-20">
									<Link to="#" className="modal-effect btn btn-primary btn-block mb-3" onClick={() => viewDemoShow1("show5")}>Rotate</Link>
									<Rodal onClose={hide} visible={animation5} animation='rotate' height={300}>
										<h6 className='modal-header'>Message Preview
											<Link to='#'><span className="d-flex ms-auto text-dark" onClick={() => { viewDemoClose1("show5") }}><i className='fe fe-x ms-auto'></i></span></Link>
										</h6>
										<div className='modal-body'>
											<h6>Why We Use Electoral College, Not Popular Vote</h6>
											It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</div>
										<div className='modal-footer'>
											<Button className="" variant="primary" onClick={() => viewDemoClose1("show5")}>Save Changes</Button>
											<Button variant="secondary" onClick={() => viewDemoClose1("show5")}>Close</Button>
										</div>
									</Rodal>
								</Col>
								<Col sm={6} md={4} xl={3} className="mg-t-20">
									<Link to="#" className="modal-effect btn btn-primary btn-block mb-3" onClick={() => viewDemoShow1("show6")}>Slide-Up</Link>
									<Rodal onClose={hide} visible={animation6} animation='slideUp' height={300}>
										<h6 className='modal-header'>Message Preview
											<Link to='#'><span className="d-flex ms-auto text-dark" onClick={() => { viewDemoClose1("show6") }}><i className='fe fe-x ms-auto'></i></span></Link>
										</h6>
										<div className='modal-body'>
											<h6>Why We Use Electoral College, Not Popular Vote</h6>
											It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</div>
										<div className='modal-footer'>
											<Button className="" variant="primary" onClick={() => viewDemoClose1("show6")}>Save Changes</Button>
											<Button variant="secondary" onClick={() => viewDemoClose1("show6")}>Close</Button>
										</div>
									</Rodal>
								</Col>
								<Col sm={6} md={4} xl={3} className="mg-t-20">
									<Link to="#" className="modal-effect btn btn-primary btn-block mb-3" onClick={() => viewDemoShow1("show7")}>slide-Down</Link>
									<Rodal onClose={hide} visible={animation7} animation='slideDown' height={300}>
										<h6 className='modal-header'>Message Preview
											<Link to='#'><span className="d-flex ms-auto text-dark" onClick={() => { viewDemoClose1("show7") }}><i className='fe fe-x ms-auto'></i></span></Link>
										</h6>
										<div className='modal-body'>
											<h6>Why We Use Electoral College, Not Popular Vote</h6>
											It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</div>
										<div className='modal-footer'>
											<Button className="" variant="primary" >Save Changes</Button>
											<Button variant="secondary" onClick={() => viewDemoClose1("show7")}>Close</Button>
										</div>
									</Rodal>
								</Col>
								<Col sm={6} md={4} xl={3} className="mg-t-20">
									<Link to="#" className="modal-effect btn btn-primary btn-block mb-3" onClick={() => viewDemoShow1("show8")}>slide-Left</Link>
									<Rodal onClose={hide} visible={animation8} animation='slideLeft' height={300}>
										<h6 className='modal-header'>Message Preview
											<Link to='#'><span className="d-flex ms-auto text-dark" onClick={() => { viewDemoClose1("show8") }}><i className='fe fe-x ms-auto'></i></span></Link>
										</h6>
										<div className='modal-body'>
											<h6>Why We Use Electoral College, Not Popular Vote</h6>
											It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</div>
										<div className='modal-footer'>
											<Button className="" variant="primary" onClick={() => viewDemoClose1("show8")}>Save Changes</Button>
											<Button variant="secondary" onClick={() => viewDemoClose1("show8")}>Close</Button>
										</div>
									</Rodal>
								</Col>
								<Col sm={6} md={4} xl={3} className="mg-t-20">
									<Link to="#" className="modal-effect btn btn-primary btn-block mb-3" onClick={() => viewDemoShow1("show9")}>slide-Right</Link>
									<Rodal onClose={hide} visible={animation9} animation='slideRight' height={300}>
										<h6 className='modal-header'>Message Preview
											<Link to='#'><span className="d-flex ms-auto text-dark" onClick={() => { viewDemoClose1("show9") }}><i className='fe fe-x ms-auto'></i></span></Link>
										</h6>
										<div className='modal-body'>
											<h6>Why We Use Electoral College, Not Popular Vote</h6>
											It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</div>
										<div className='modal-footer'>
											<Button className="" variant="primary" onClick={() => viewDemoClose1("show9")}>Save Changes</Button>
											<Button variant="secondary" onClick={() => viewDemoClose1("show9")}>Close</Button>
										</div>
									</Rodal>
								</Col>
							</Row>
            </Card.Body>
            <Collapse in={showdata6} className="">
									<pre>
										<code>
											{`
export const Modal = ()= {
  const [animation1, setanimation1] = useState(false);

  let viewDemoShow1 = (modal) => {
    switch (modal) {
      case "Basic":
        setanimation1(true)
        break;
    }
  let viewDemoClose1 = (modal) => {
      switch (modal) {
        case "Basic":
          setanimation1(false)
          break;
  return(
    <Col sm={6} md={4} xl={3} className="col-sm-6 col-md-4 col-xl-3">
    <Link to="#" className="modal-effect btn btn-primary btn-block"  onClick={() => viewDemoShow1("Basic")}>Zoom</Link>
    <Rodal onClose={hide} visible={animation1} animation='Scale' height={280}>
      <div className='modal-header'>Modal Header
        <Link to='#'><span className="d-flex ms-auto text-dark" onClick={() => { viewDemoClose1("Basic") }}><i className='fe fe-x ms-auto'></i></span></Link>
      </div>
      <div className='modal-body'>
        <h6>Modal Body</h6>
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</div>
      <div className='modal-footer'>
        <Button className="me-2" variant="primary" onClick={() => viewDemoClose1("Basic")}>Save Changes</Button>
        <Button variant="secondary" onClick={() => viewDemoClose1("Basic")}>Close</Button>
      </div>
    </Rodal>
  </Col>
   )
  };
`}
										</code>
									</pre>
								</Collapse>
          </div>
        <Row>
          <Col sm={12} md={12}>
            <Card>
              <Card.Header>
                <Card.Title>Modal Sizes</Card.Title>
            <Form.Check  type="switch"  className='ms-auto' label="show code" onClick={()=>setShowdata5(!showdata5)}/>
              </Card.Header>
              <Card.Body className="text-center">
                <p>Add <code className="highlighter-rouge">.modal-sm </code> or <code
                  className="highlighter-rouge">.modal-lg </code> to modal-dialog to increase
                  and
                  decrease the modal box sizes.</p>
                  <Modal size='sm'  show={show3} onHide={handleClose3} backdrop="static" keyboard={false}>
                    <Modal.Header>
                      <Modal.Title> Modal Title</Modal.Title>
                      <Button onClick={handleClose3} className="btn-close btn text-dark border-0" variant=''>
                        <span aria-hidden="true">×</span></Button>
                    </Modal.Header>
                    <Modal.Body>
                      Modal body text goes here
                    </Modal.Body>
                    <Modal.Footer>
                    <Button  onClick={handleClose3} variant="btn btn-secondary"
                          type="button">Close</Button>
                      <Button variant="btn btn-primary" type="button">Save Changes</Button>
                     
                    </Modal.Footer>
                  </Modal>
                  <Button  onClick={handleShow3} type="button" variant="primary" className="me-1 mt-3" data-bs-toggle="modal"
                  data-bs-target="#smallmodal">Small Modal</Button>
                  <Modal size='xl'  show={show4} onHide={handleClose4} backdrop="static" keyboard={false}>
                    <Modal.Header>
                      <Modal.Title> Modal Title</Modal.Title>
                      <Button onClick={handleClose4} className="btn-close btn text-dark border-0" variant=''>
                        <span aria-hidden="true">×</span></Button>
                    </Modal.Header>
                    <Modal.Body>
                      Modal body text goes here
                    </Modal.Body>
                    <Modal.Footer>
                    <Button  onClick={handleClose4} variant="btn btn-secondary"
                          type="button">Close</Button>
                      <Button variant="btn btn-primary" type="button">Save Changes</Button>
                      
                    </Modal.Footer>
                  </Modal>
                  <Button  onClick={handleShow4} type="button" variant="secondary" className="me-1 mt-3" data-bs-toggle="modal"
                  data-bs-target="#smallmodal">Default Modal</Button>
                   <Modal size='lg'  show={show5} onHide={handleClose5} backdrop="static" keyboard={false}>
                    <Modal.Header>
                      <Modal.Title> Modal Title</Modal.Title>
                      <Button onClick={handleClose5} className="btn-close btn text-dark border-0" variant=''>
                        <span aria-hidden="true">×</span></Button>
                    </Modal.Header>
                    <Modal.Body>
                      Modal body text goes here
                    </Modal.Body>
                    <Modal.Footer>
                    <Button  onClick={handleClose5} variant="secondary"
                          type="button">Close</Button>
                      <Button variant="btn btn-primary" type="button">Save Changes</Button>
                      
                    </Modal.Footer>
                  </Modal>
                  <Button className='mt-3'  onClick={handleShow5} type="button"  variant="btn btn-info" data-bs-toggle="modal"
                  data-bs-target="#smallmodal">Large Modal</Button>
              </Card.Body>
              <Collapse in={showdata5} className="">
									<pre>
										<code>
											{`
export const Modal = ()= {
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
  return(
<Modal size='sm'  show={show3} onHide={handleClose3} backdrop="static" keyboard={false}>
<Modal.Header>
  <Modal.Title> Modal Title</Modal.Title>
  <Button onClick={handleClose3} className="btn-close btn-close-white">
<span aria-hidden="true">×</span></Button>
</Modal.Header>
<Modal.Body>
  Modal body text goes here
</Modal.Body>
<Modal.Footer>
<Button  onClick={handleClose3} variant="btn btn-secondary"
  type="button">Close</Button>
  <Button variant="btn btn-primary" type="button">Save Changes</Button>
 
</Modal.Footer>
  </Modal>
   )
  };
`}
										</code>
									</pre>
								</Collapse>
    </Card>
          </Col>
        </Row>
           
    </Fragment>

  );
}
export default Modals;
