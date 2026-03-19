import React, { FC, Fragment, useState } from 'react';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages';
import { Button, Card, CloseButton, Col, Collapse, Form, Row, Toast } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';

function Toastes() {
  const [showA, setShowA] = useState(true);

  const toggleShowA = () => setShowA(!showA);
  // Live toast
  const [show, setShow] = useState(false);
  // custamized toast
  const [showB, setShowB] = useState(true);
  const toggleShowB = () => setShowB(!showB)
  //Coloured toast
  const [showD, setShowD] = useState(true);

  const toggleShowD = () => setShowD(!showD);
  //
  const [showE, setShowE] = useState(true);

  const toggleShowE = () => setShowE(!showE);
  //
  const [showF, setShowF] = useState(true);

  const toggleShowF = () => setShowF(!showF);
  //
  const [showG, setShowG] = useState(true);

  const toggleShowG = () => setShowG(!showG);
  //
  const [showH, setShowH] = useState(true);

  const toggleShowH = () => setShowH(!showH);
  //
  const [showI, setShowI] = useState(true);

  const toggleShowI = () => setShowI(!showI);
  //stacking Toast
  const [showJ, setShowJ] = useState(true);

  const toggleShowJ = () => setShowJ(!showJ);
  //
  const [showK, setShowK] = useState(true);

  const toggleShowK = () => setShowK(!showK);
  //Placement
  const [showL, setShowL] = useState(true);

  const toggleShowL = () => setShowL(!showI);
  //
  const [showM, setShowM] = useState(true);

  const toggleShowM = () => setShowM(!showM);
  //show code
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show5, setShow5] = useState(false);
  const [show6, setShow6] = useState(false);

  return (
    <Fragment>
      <PageHeader title="Toast" />
      <Row>
        <Col md={12} lg={12} xl={4}>
          <Card>
            <Card.Body>
              <div className='d-flex'>
                <Card.Title as="h6" className="main-content-label mb-1">Basic toast-main</Card.Title>
                <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
              </div>
              <p className="mg-b-20 text-muted">Toasts are as flexible as you need and
                have
                very little required markup.</p>

              <div className="text-wrap">
                <div className="toast-main">
                  <div className="demo-static-toast">
                    <Toast show={showA} aria-atomic="true" aria-live="assertive"
                      className="toast fade show" role="alert" data-bs-autohide="false">

                      <Toast.Header className="">
                        <img src={ImagesData("Favicon")}
                          className="rounded me-2" alt="img" height="18" />
                        <strong className="me-auto">Azea</strong>
                        <small>11 mins ago</small>
                        <CloseButton aria-label="Close" onClick={toggleShowA}
                          className="me-4 mb-1 btn-close fs-normal"
                          data-bs-dismiss="toast" type="button">
                          <span aria-hidden="true">×</span>
                        </CloseButton>
                      </Toast.Header>
                      <Toast.Body>Hello, world! This is a toast message.</Toast.Body>

                    </Toast>

                  </div>
                </div>
              </div>


            </Card.Body>
            <Collapse in={show1} className="">
              <pre>
                <code>
                  {`
                      export const Toasts = ()={
                        const [showA, setShowA] = useState(true);
                         const toggleShowA = () => setShowA(!showA);
                        return(
                          <div className="toast-main">
                          <div className="demo-static-toast">
           <Toast show={showA} onClick={toggleShowA}>
             <Toast.Header className=" text-black">
             <img src={ImagesData("Favicon")}
                       className="rounded me-2" alt="img" height="18" />
               <strong className="me-auto">Azea</strong>
               <small>11 mins ago</small>
                  </Toast.Header>
             <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
           </Toast>
           </div>
           </div>
           )
                        };
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
        <Col md={12} lg={12} xl={4}>
          <Card>
            <Card.Body>
              <div className='d-flex'>
                <Card.Title as="h6" className="main-content-label mb-1">Live Toast toast-main</Card.Title>
                <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />
              </div>
              <p className="text-muted card-sub-title">Click the button below to show a toast
              </p>

              <div className="text-wrap">
                <div className="toast-main p-5">
                  <div className="demo-static-toast">
                    <Button onClick={() => setShow(true)} type="button" variant="primary" id="liveToastBtn" >Show
                      live toast</Button>

                    <div className="position-fixed bottom-0 end-0 p-3 live-toast">
                      <Toast id="liveToast" className="toast fade show" role="alert" show={show} delay={3000000} autohide
                        aria-live="assertive" aria-atomic="true">
                        <Toast.Header className="bg-success text-white ">
                          <img src={ImagesData("Favicon1")}
                            className="rounded me-2" alt="img" height="18" />
                          <strong className="me-auto">Azea</strong>
                          <small>11 mins ago</small>
                          <CloseButton aria-label="Close" onClick={() => setShow(false)}
                            className="me-4 mb-1 btn-close fs-normal text-white"
                            data-bs-dismiss="toast" type="button">
                            <span aria-hidden="true">×</span>
                          </CloseButton>
                        </Toast.Header>
                        <Toast.Body>
                          Hello, world! This is a toast message.
                        </Toast.Body>
                      </Toast>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Collapse in={show2} className="">
              <pre>
                <code>
                  {`
               export const toast = () ={
                const [show, setShow] = useState(false);
               
             return (
                 <div className="demo-static-toast">
                 <Button onClick={() => setShow(true)} type="button" variant="primary" id="liveToastBtn" >Show
                   live toast</Button>
   
                 <div className="position-fixed bottom-0 end-0 p-3">
                         <div id="liveToast" className="toast fade show" role="alert"
                           aria-live="assertive" aria-atomic="true">
                 <Toast onClick={() => setShow(false)} show={show} delay={3000000} autohide  >
                   <Toast.Header className="bg-success text-white ">
                     <img src={ImagesData("Favicon1")}
                       className="rounded me-2" alt="img" height="18" />
                     <strong className="me-auto">Azea</strong>
                     <small>11 mins ago</small>
                    
                   </Toast.Header>
                   <Toast.Body>
                     Hello, world! This is a toast message.
                   </Toast.Body>
                 </Toast>
                 </div>
                       </div>
                 </div>
                 )
             };
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
        <Col md={12} lg={12} xl={4}>
          <Card>
            <Card.Body>
              <div className='d-flex'>
                <Card.Title className="main-content-label mb-1">Customized Toast</Card.Title>
                <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow3(!show3)} />

              </div>
              <p className="text-muted card-sub-title">Customize your Toasts as flexible as
                you
                need and have very little required markup.</p>

              <div className="text-wrap">
                <div className="toast-main">
                  <div className="demo-static-toast">
                    <Toast show={showB}>
                      <Toast.Body className="p-0">
                        <p className="p-3 mb-0"> Hello, world! This is a toast message.
                        </p>
                        <div className="mt-0 p-3 border-top">
                          <Button className="btn-sm btn me-2" variant='success' type="button">
                            Action
                          </Button>
                          <Button onClick={toggleShowB} type="button" className="btn btn-sm me-2" variant='danger'>
                            Close
                          </Button>
                        </div>
                      </Toast.Body>
                    </Toast>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Collapse in={show3} className="">
              <pre>
                <code>
                  {`
               export const toast = () ={
                const [showB, setShowB] = useState(true);
                const toggleShowB = () => setShowB(!showB)
               
             return (
              <Toast  show={showB} onClick={toggleShowB}>
              <Toast.Body className="p-0">
                <p className="p-3 mb-0"> Hello, world! This is a toast message.
                </p>
                <div className="mt-0 p-3 border-top">
                  <Button className="btn-sm btn me-2"  variant='success' type="button">
                    Action
                  </Button>
                  <Button type="button" className="btn btn-sm me-2" variant='danger'>
                    Close
                  </Button>
                </div>
              </Toast.Body>
            </Toast>
                 )
             };
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
        <Col md={12} lg={12}>
          <Card>
            <Card.Body>
              <div className='d-flex'>
                <Card.Title className="main-content-label mb-1">Colored Toast</Card.Title>
                <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow4(!show4)} />
              </div>
              <Card.Subtitle className="text-muted card-sub-title">Toasts are as flexible as you need and
                have
                very little required markup.</Card.Subtitle>

              <div className="text-wrap">
                <div className="toast-main">
                  <Row className=" row-sm">
                    <Col md={4} lg={6} xl={4} mt={2} >
                      <div className="demo-static-toast">
                        <Toast show={showD} aria-atomic="true" aria-live="assertive"
                          className="toast fade show mb-2" role="alert"
                          data-bs-autohide="false">

                          <Toast.Header className=" bg-primary text-white">
                            <i className="fe fe-bell me-2"></i>
                            <h6 className="fs-14 mb-0 me-auto">Azea</h6>
                            <small className="text-white me-2">11 mins ago</small>
                            <CloseButton aria-label="Close" onClick={toggleShowD}
                              className="me-4 mb-1 btn text-white- close fs-normal text-white"
                              data-bs-dismiss="toast" type="button">
                              <span aria-hidden="true">×</span>
                            </CloseButton>
                          </Toast.Header>
                          <Toast.Body>
                            Hello, world! This is a toast message.
                          </Toast.Body>
                        </Toast>
                      </div>
                      {/* </div> */}

                    </Col>
                    <Col md={4} lg={6} xl={4} mt={2}>
                      <div className="demo-static-toast">
                        <Toast show={showE} aria-atomic="true" aria-live="assertive"
                          className="toast fade show mb-2" role="alert"
                          data-bs-autohide="false">

                          <Toast.Header className="bg-success text-white">
                            <i className="fe fe-check-circle me-2"></i>
                            <h6 className="fs-14 mb-0 me-auto">Azea</h6>
                            <small className="text-white me-2">11 mins ago</small>
                            <CloseButton aria-label="Close" onClick={toggleShowE}
                              className="me-4 mb-1 btn-close fs-normal text-white"
                              data-bs-dismiss="toast" type="button">
                              <span aria-hidden="true">×</span>
                            </CloseButton>
                          </Toast.Header>
                          <Toast.Body>
                            Hello, world! This is a toast message.
                          </Toast.Body>

                        </Toast>
                      </div>
                    </Col>
                    <Col md={4} lg={6} xl={4} mt={2}>
                      <div className="demo-static-toast">
                        <Toast show={showF} aria-atomic="true" aria-live="assertive"
                          className="toast fade show mb-2" role="alert"
                          data-bs-autohide="false">

                          <Toast.Header className=" bg-secondary text-white">
                            <i className="fe fe-map-pin me-2"></i>
                            <h6 className="fs-14 mb-0 me-auto">Azea</h6>
                            <small className="text-white me-2">11 mins ago</small>
                            <CloseButton aria-label="Close" onClick={toggleShowF}
                              className="me-4 mb-1 btn-close fs-normal text-white"
                              data-bs-dismiss="toast" type="button">
                              <span aria-hidden="true">×</span>
                            </CloseButton>
                          </Toast.Header>
                          <Toast.Body>
                            Hello, world! This is a toast message.
                          </Toast.Body>
                        </Toast>

                      </div>
                    </Col>
                    <Col md={4} lg={6} xl={4} mt={2}>
                      <div className="demo-static-toast">
                        <Toast show={showG} aria-atomic="true" aria-live="assertive"
                          className="toast fade show mb-2" role="alert"
                          data-bs-autohide="false">

                          <Toast.Header className="bg-warning text-white">
                            <i className="fe fe-alert-triangle me-2"></i>
                            <h6 className="fs-14 mb-0 me-auto">Azea</h6>
                            <small className="text-white me-2">11 mins ago</small>
                            <CloseButton aria-label="Close" onClick={toggleShowG}
                              className="me-4 mb-1 btn-close fs-normal text-white"
                              data-bs-dismiss="toast" type="button">
                              <span aria-hidden="true">×</span>
                            </CloseButton>
                          </Toast.Header>
                          <Toast.Body>
                            Hello, world! This is a toast message.
                          </Toast.Body>
                        </Toast>

                      </div>
                    </Col>
                    <Col md={4} lg={6} xl={4} mt={2}>
                      <div className="demo-static-toast">
                        <Toast show={showH} aria-atomic="true" aria-live="assertive"
                          className="toast fade show mb-2" role="alert"
                          data-bs-autohide="false">

                          <Toast.Header className=" bg-info text-white">
                            <i className="fe fe-info me-2"></i>
                            <h6 className="fs-14 mb-0 me-auto">Azea</h6>
                            <small className="text-white me-2">11 mins ago</small>
                            <CloseButton aria-label="Close" onClick={toggleShowH}
                              className="me-4 mb-1 btn-close fs-normal text-white"
                              data-bs-dismiss="toast" type="button">
                              <span aria-hidden="true">×</span>
                            </CloseButton>
                          </Toast.Header>
                          <Toast.Body>
                            Hello, world! This is a toast message.
                          </Toast.Body>
                        </Toast>
                      </div>
                    </Col>
                    <Col md={4} lg={6} xl={4} mt={2}>
                      <div className="demo-static-toast">
                        <Toast show={showI} aria-atomic="true" aria-live="assertive"
                          className="toast fade show mb-2" role="alert"
                          data-bs-autohide="false">

                          <Toast.Header className=" bg-dark text-white">
                            <i className="fe fe-clock me-2"></i>
                            <h6 className="fs-14 mb-0 me-auto">Azea</h6>
                            <small className="text-white me-2">11 mins ago</small>
                            <CloseButton aria-label="Close" onClick={toggleShowI}
                              className="me-4 mb-1 btn-close fs-normal text-white"
                              data-bs-dismiss="toast" type="button">
                              <span aria-hidden="true">×</span>
                            </CloseButton>
                          </Toast.Header>
                          <Toast.Body>
                            Hello, world! This is a toast message.
                          </Toast.Body>
                        </Toast>

                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card.Body>
            <Collapse in={show4} className="">
              <pre>
                <code>
                  {`
               export const toast = () ={
                const [showD, setShowD] = useState(true);

                const toggleShowD = () => setShowD(!showD);
               
             return (
              <div aria-atomic="true" aria-live="assertive"
                          className="toast fade show mb-2" role="alert"
                          data-bs-autohide="false">
                      <Toast  show={showD} onClick={toggleShowD}>
                        <Toast.Header className=" bg-primary text-white">
                          <i className="fe fe-bell me-2"></i>
                          <h6 className="fs-14 mb-0 me-auto">Azea</h6>
                          <small className="text-white me-2">11 mins ago</small>
                        </Toast.Header>
                        <Toast.Body>
                          Hello, world! This is a toast message.
                        </Toast.Body>
                      </Toast>
                      </div>
                 )
             };
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
        <Col md={12} lg={12}>
          <Card id="stacking">
            <Card.Body>
              <div className='d-flex'>
                <Card.Title className="main-content-label mb-1">Stacking Toast</Card.Title>
                <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow5(!show5)} />
              </div>
              <Card.Subtitle className="text-muted card-sub-title">When you have multiple toasts, we
                default
                to vertiaclly stacking them in a readable manner.</Card.Subtitle>

              <div className="text-wrap">
                <div className="toast-main">
                  <div className="demo-static-toast">
                    <Toast show={showJ} aria-atomic="true" aria-live="assertive"
                      className="toast fade show mb-3" role="alert"
                      data-bs-autohide="false">

                      <Toast.Header>
                        <img src={ImagesData("Favicon")}
                          className="rounded me-2" alt="img" height="18" />
                        <h6 className="fs-14 mb-0 me-auto">Azea</h6>
                        <small className="text-muted me-2">Just now</small>
                        <CloseButton aria-label="Close" onClick={toggleShowJ}
                          className="me-4 mb-1 btn-close fs-normal"
                          data-bs-dismiss="toast" type="button">
                          <span aria-hidden="true">×</span>
                        </CloseButton>
                      </Toast.Header>
                      <Toast.Body>
                        See? Just like this.
                      </Toast.Body>
                    </Toast>
                  </div>
                  <div className="demo-static-toast">
                    <Toast show={showK} aria-atomic="true" aria-live="assertive"
                      className="toast fade show" role="alert" data-bs-autohide="false">
                      <Toast.Header>
                        <img src={ImagesData("Favicon")}
                          className="rounded me-2" alt="img" height="18" />
                        <h6 className="fs-14 mb-0 me-auto">Azea</h6><small
                          className="text-muted me-2">11 mins ago</small>
                        <CloseButton aria-label="Close" onClick={toggleShowK}
                          className="me-4 mb-1 btn-close fs-normal"
                          data-bs-dismiss="toast" type="button">
                          <span aria-hidden="true">×</span>
                        </CloseButton>
                      </Toast.Header>
                      <Toast.Body>
                        Hello, world! This is a toast message.
                      </Toast.Body>
                    </Toast>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Collapse in={show5} className="">
              <pre>
                <code>
                  {`
               export const toast = () ={
                const [showJ, setShowJ] = useState(true);
                const toggleShowJ = () => setShowJ(!showJ);
               
             return (
              <div aria-atomic="true" aria-live="assertive"
              className="toast fade show mb-3" role="alert"
              data-bs-autohide="false">
               <Toast show={showJ} onClick={toggleShowJ}>
              <Toast.Header>
                <img src={ImagesData("Favicon")}
                  className="rounded me-2" alt="img" height="18" />
                <h6 className="fs-14 mb-0 me-auto">Azea</h6>
                <small className="text-muted me-2">Just now</small>
              </Toast.Header>
              <Toast.Body>
                See? Just like this.
              </Toast.Body>
              </Toast>
            </div>
                 )
             };
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
        <Col md={12} lg={12}>
          <Card id="place">
            <Card.Body>
              <div className='d-flex'>
                <Card.Title className="main-content-label mb-1">Placement</Card.Title>
                <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow6(!show6)} />
              </div>
              <Card.Subtitle className="text-muted card-sub-title">Place toasts with custom CSS as you
                need
                them. The top right is often used for notifications, as is the top
                middle.
              </Card.Subtitle>

              <div className="text-wrap mb-3">
                <div className="toast-main">
                  <div className="h-150 position-relative mb-3">
                    <div className="demo-static-toast t-10 r-10">
                      <Toast show={showL} aria-atomic="true" aria-live="assertive"
                        className="toast fade show" role="alert"
                        data-bs-autohide="false">

                        <Toast.Header>
                          <img src={ImagesData("Favicon")}
                            className="rounded me-2" alt="img" height="18" />
                          <h6 className="fs-14 mb-0 me-auto">Azea</h6><small
                            className="text-muted me-2">11 mins ago</small>
                          <CloseButton aria-label="Close" onClick={toggleShowL}
                            className="me-4 mb-1 btn-close fs-normal"
                            data-bs-dismiss="toast" type="button">
                            <span aria-hidden="true">×</span>
                          </CloseButton>
                        </Toast.Header>
                        <Toast.Body>
                          Hello, world! This is a toast message.
                        </Toast.Body>
                      </Toast>

                    </div>
                  </div>
                </div>
              </div>
              <div className="text-wrap mb-3">
                <div className="toast-main">
                  <div
                    className="demo-static-toast d-flex justify-content-center align-items-center">
                    <Toast show={showM} aria-atomic="true" aria-live="assertive"
                      className="toast fade show " role="alert" data-bs-autohide="true">

                      <Toast.Header>
                        <img src={ImagesData("Favicon")}
                          className="rounded me-2" alt="img" height="18" />
                        <h6 className="fs-14 mb-0 me-auto">Azea</h6><small
                          className="text-muted me-2">11 mins ago</small>
                        <CloseButton aria-label="Close" onClick={toggleShowM}
                          className="me-4 mb-1 btn-close fs-normal"
                          data-bs-dismiss="toast" type="button">
                          <span aria-hidden="true">×</span>
                        </CloseButton>
                      </Toast.Header>
                      <Toast.Body>
                        Hello, world! This is a toast message.
                      </Toast.Body>
                    </Toast>

                  </div>
                </div>
              </div>
            </Card.Body>
            <Collapse in={show6} className="">
              <pre>
                <code>
                  {`
               export const toast = () ={
                const [showL, setShowL] = useState(true);
                const toggleShowL = () => setShowL(!showI);
               
             return (
              <div aria-atomic="true" aria-live="assertive"
                        className="toast fade show" role="alert"
                        data-bs-autohide="false">
                         <Toast show={showL} onClick={toggleShowL}>
                        <Toast.Header>
                          <img src={ImagesData("Favicon")}
                            className="rounded me-2" alt="img" height="18" />
                          <h6 className="fs-14 mb-0 me-auto">Azea</h6><small
                            className="text-muted me-2">11 mins ago</small>
                        </Toast.Header>
                        <Toast.Body>
                          Hello, world! This is a toast message.
                        </Toast.Body>
                        </Toast>
                       </div>
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
  )
};

export default Toastes;
