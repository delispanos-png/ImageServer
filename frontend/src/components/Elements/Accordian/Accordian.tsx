import React, { FC, Fragment, useState } from 'react';
import { Accordion, Button, Card, Col, Collapse, Form, Row, useAccordionButton, } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';


interface AcordianProps { }

const Acordian: FC<AcordianProps> = () => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show5, setShow5] = useState(false);
;

  //MULTIPLE TARGETS

  let [isFirstCollapsed, setisFirstCollapsed] = useState(false);
  let [isSecondCollapsed, setisSecondCollapsed] = useState(false);


  let first = () => {
    if (isFirstCollapsed === false) {
      setisFirstCollapsed(true)
    }
    else if (isFirstCollapsed === true) {
      setisFirstCollapsed(false)
    }
  }

  let second = () => {

    if (isSecondCollapsed === true) {
      setisSecondCollapsed(false)
    }
    else if (isSecondCollapsed === false) {
      setisSecondCollapsed(true)
    }
  }

  let both = () => {
    if (isSecondCollapsed === true) {
      setisSecondCollapsed(false)
    }
    else if (isSecondCollapsed === false) {
      setisSecondCollapsed(true)
    }
    if (isFirstCollapsed === true) {
      setisFirstCollapsed(false)
    }
    else if (isFirstCollapsed === false) {
      setisFirstCollapsed(true)
    }
  }

  return (


    <Fragment>
      <PageHeader title="Accordion" />
      <Row>
        <Col md={12} >
          <Card>
            <Card.Header >
              <Card.Title>Defalut Accordion</Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
            </Card.Header>
            <div className='panel panel-default active border-0'>
              <Card.Body className="defaultaccordion">
                <Accordion className="acc-card mb-4 " defaultActiveKey="Item #1">
                  <Accordion.Item eventKey="Item #1" className='mb-2'>
                    <Accordion.Header className="acc-header">
                      Collapsible Group Item #1
                    </Accordion.Header>
                    <Accordion.Body>
                      Anim pariatur cliche reprehenderit, enim eiusmod high life
                      accusamus terry richardson ad squid. 3 wolf moon officia
                      aute, non cupidatat skateboard dolor brunch. Food truck
                      quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                      sunt aliqua put a bird on it squid single-origin coffee
                      nulla assumenda shoreditch et. Nihil anim keffiyeh
                      helvetica, craft beer labore wes anderson cred nesciunt
                      sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                      Leggings occaecat craft beer farm-to-table, raw denim
                      aesthetic synth nesciunt you probably haven't heard of them
                      accusamus labore sustainable VHS.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="Item #2" className="mb-2">
                    <Accordion.Header className="style1">
                      Collapsible Group Item #2
                    </Accordion.Header>
                    <Accordion.Body>
                      Anim pariatur cliche reprehenderit, enim eiusmod high life
                      accusamus terry richardson ad squid. 3 wolf moon officia
                      aute, non cupidatat skateboard dolor brunch. Food truck
                      quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                      sunt aliqua put a bird on it squid single-origin coffee
                      nulla assumenda shoreditch et. Nihil anim keffiyeh
                      helvetica, craft beer labore wes anderson cred nesciunt
                      sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                      Leggings occaecat craft beer farm-to-table, raw denim
                      aesthetic synth nesciunt you probably haven't heard of them
                      accusamus labore sustainable VHS.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="Item #3" className="mb-1">
                    <Accordion.Header className="style1">
                      Collapsible Group Item #3
                    </Accordion.Header>
                    <Accordion.Body>
                      Anim pariatur cliche reprehenderit, enim eiusmod high life
                      accusamus terry richardson ad squid. 3 wolf moon officia
                      aute, non cupidatat skateboard dolor brunch. Food truck
                      quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                      sunt aliqua put a bird on it squid single-origin coffee
                      nulla assumenda shoreditch et. Nihil anim keffiyeh
                      helvetica, craft beer labore wes anderson cred nesciunt
                      sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                      Leggings occaecat craft beer farm-to-table, raw denim
                      aesthetic synth nesciunt you probably haven't heard of them
                      accusamus labore sustainable VHS.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card.Body>
            </div>
            <Collapse in={show} className="">
              <pre>
                <code>
                  {`
 <Accordion >
 <Accordion.Item eventKey="Item #1" className="mb-1">
   <Accordion.Header className="style1">
     Collapsible Group Item #1
   </Accordion.Header>
   <Accordion.Body> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.
    Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
     helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
      synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
   </Accordion.Body>
 </Accordion.Item>
 <Accordion.Item eventKey="Item #2" className="mb-1">
   <Accordion.Header className="style1">
     Collapsible Group Item #2
   </Accordion.Header>
   <Accordion.Body>
     Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.
      Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. 
      Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
       beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
   </Accordion.Body>
 </Accordion.Item>
 <Accordion.Item eventKey="Item #3" className="mb-1">
   <Accordion.Header className="style1">
     Collapsible Group Item #3
   </Accordion.Header>
   <Accordion.Body> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.
    Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
     helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
      synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
   </Accordion.Body>
 </Accordion.Item>
</Accordion>
`}
                </code>
              </pre>
            </Collapse>
          </Card>


          <Card>
            <Card.Header>
              <Card.Title>Defalut Accordion 2</Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
            </Card.Header>
            <div className='panel panel-default active border-0'>
              <Card.Body className="defaultaccordion">
                <Accordion alwaysOpen>
                  <Accordion.Item eventKey="Item #1" className="mb-2">
                    <Accordion.Header className="style1" >
                      Collapsible Group Item #1
                    </Accordion.Header>
                    <Accordion.Body>
                      Anim pariatur cliche reprehenderit, enim eiusmod high life
                      accusamus terry richardson ad squid. 3 wolf moon officia
                      aute, non cupidatat skateboard dolor brunch. Food truck
                      quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                      sunt aliqua put a bird on it squid single-origin coffee
                      nulla assumenda shoreditch et. Nihil anim keffiyeh
                      helvetica, craft beer labore wes anderson cred nesciunt
                      sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                      Leggings occaecat craft beer farm-to-table, raw denim
                      aesthetic synth nesciunt you probably haven't heard of them
                      accusamus labore sustainable VHS.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="Item #2" className="mb-2">
                    <Accordion.Header className="style1">
                      Collapsible Group Item #2
                    </Accordion.Header>
                    <Accordion.Body>
                      Anim pariatur cliche reprehenderit, enim eiusmod high life
                      accusamus terry richardson ad squid. 3 wolf moon officia
                      aute, non cupidatat skateboard dolor brunch. Food truck
                      quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                      sunt aliqua put a bird on it squid single-origin coffee
                      nulla assumenda shoreditch et. Nihil anim keffiyeh
                      helvetica, craft beer labore wes anderson cred nesciunt
                      sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                      Leggings occaecat craft beer farm-to-table, raw denim
                      aesthetic synth nesciunt you probably haven't heard of them
                      accusamus labore sustainable VHS.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="Item #3" className="mb-2">
                    <Accordion.Header className="style1">
                      Collapsible Group Item #3
                    </Accordion.Header>
                    <Accordion.Body>
                      Anim pariatur cliche reprehenderit, enim eiusmod high life
                      accusamus terry richardson ad squid. 3 wolf moon officia
                      aute, non cupidatat skateboard dolor brunch. Food truck
                      quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                      sunt aliqua put a bird on it squid single-origin coffee
                      nulla assumenda shoreditch et. Nihil anim keffiyeh
                      helvetica, craft beer labore wes anderson cred nesciunt
                      sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                      Leggings occaecat craft beer farm-to-table, raw denim
                      aesthetic synth nesciunt you probably haven't heard of them
                      accusamus labore sustainable VHS.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card.Body>
            </div>
            <Collapse in={show1} className="">
              <pre>
                <code>
                  {`
 <Accordion >
 <Accordion.Item eventKey="Item #1" className="mb-1">
   <Accordion.Header className="style1">
     Collapsible Group Item #1
   </Accordion.Header>
   <Accordion.Body> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.
    Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
     helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
      synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
   </Accordion.Body>
 </Accordion.Item>
 <Accordion.Item eventKey="Item #2" className="mb-1">
   <Accordion.Header className="style1">
     Collapsible Group Item #2
   </Accordion.Header>
   <Accordion.Body>
     Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.
      Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. 
      Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
       beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
   </Accordion.Body>
 </Accordion.Item>
 <Accordion.Item eventKey="Item #3" className="mb-1">
   <Accordion.Header className="style1">
     Collapsible Group Item #3
   </Accordion.Header>
   <Accordion.Body> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.
    Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
     helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
      synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
   </Accordion.Body>
 </Accordion.Item>
</Accordion>
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card className='color-accordion'>
            <Card.Header>
              <Card.Title>Closed Accordion</Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />
            </Card.Header>
            <Card.Body>
              <Accordion defaultActiveKey="" className="demo-accordion accordionjs m-0">
                <Accordion.Item eventKey="1" className="acc_section border-0">
                  <Accordion.Header className="acc_head p-0"><span className='ms-3'>Section 1</span></Accordion.Header>
                  <Accordion.Body>
                    Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce aliquet neque et accumsan fermentum. Aliquam lobortis neque in nulla tempus, molestie fermentum purus euismod.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" className="acc_section border-0">
                  <Accordion.Header className="acc_head p-0"><span className='ms-3'>Section 2</span></Accordion.Header>
                  <Accordion.Body>
                    Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce aliquet neque et accumsan fermentum. Aliquam lobortis neque in nulla tempus, molestie fermentum purus euismod.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3" className="acc_section border-0">
                  <Accordion.Header className="acc_head p-0"><span className='ms-3'>Section 3</span></Accordion.Header>
                  <Accordion.Body>
                    Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce aliquet neque et accumsan fermentum. Aliquam lobortis neque in nulla tempus, molestie fermentum purus euismod.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

            </Card.Body>
            <Collapse in={show2} className="">
              <pre>
                <code>
                  {`
 <Accordion className="demo-accordion m-0">
 <Accordion.Item eventKey="0" className="acc_section">
   <Accordion.Header className="demo-accordion accordionjs m-0 collapsed" data-active-index="false" data-bs-toggle="collapsed" data-bs-parent="#accordion" aria-expanded="false">Section 1</Accordion.Header>
   <Accordion.Body>
     Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce aliquet neque et accumsan fermentum. Aliquam lobortis neque in nulla tempus, molestie fermentum purus euismod.
   </Accordion.Body>
 </Accordion.Item>
 <Accordion.Item eventKey="1" className="acc_section">
   <Accordion.Header className="acc_head">Section 2</Accordion.Header>
   <Accordion.Body>
     Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce aliquet neque et accumsan fermentum. Aliquam lobortis neque in nulla tempus, molestie fermentum purus euismod.
   </Accordion.Body>
 </Accordion.Item>
 <Accordion.Item eventKey="2" className="acc_section ">
   <Accordion.Header className="acc_head">Section 3</Accordion.Header>
   <Accordion.Body>
     Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce aliquet neque et accumsan fermentum. Aliquam lobortis neque in nulla tempus, molestie fermentum purus euismod.
   </Accordion.Body>
 </Accordion.Item>
 <Accordion.Item eventKey="3" className="acc_section ">
   <Accordion.Header className="acc_head">Section 4</Accordion.Header>
   <Accordion.Body>
     Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce aliquet neque et accumsan fermentum. Aliquam lobortis neque in nulla tempus, molestie fermentum purus euismod.
   </Accordion.Body>
 </Accordion.Item>
</Accordion>
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card className='color-accordion'>
            <Card.Header>
              <Card.Title>Color Accordion Style</Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow3(!show3)} />
            </Card.Header>
            <Card.Body>
              <Accordion defaultActiveKey="0" className="demo-accordion accordionjs m-0">
                <Accordion.Item eventKey="0" className="acc_section border-0">
                  <Accordion.Header className="acc_head p-0"><span className='ms-3'>Section 1</span></Accordion.Header>
                  <Accordion.Body>
                    Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce aliquet neque et accumsan fermentum. Aliquam lobortis neque in nulla tempus, molestie fermentum purus euismod.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" className="acc_section border-0">
                  <Accordion.Header className="acc_head p-0"><span className='ms-3'>Section 2</span></Accordion.Header>
                  <Accordion.Body>
                    Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce aliquet neque et accumsan fermentum. Aliquam lobortis neque in nulla tempus, molestie fermentum purus euismod.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" className="acc_section border-0">
                  <Accordion.Header className="acc_head p-0"><span className='ms-3'>Section 3</span></Accordion.Header>
                  <Accordion.Body>
                    Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce aliquet neque et accumsan fermentum. Aliquam lobortis neque in nulla tempus, molestie fermentum purus euismod.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3" className="acc_section border-0">
                  <Accordion.Header className="acc_head p-0"><span className='ms-3'>Section 4</span></Accordion.Header>
                  <Accordion.Body>
                    Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce aliquet neque et accumsan fermentum. Aliquam lobortis neque in nulla tempus, molestie fermentum purus euismod.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <Collapse in={show3} className="">
              <pre>
                <code>
                  {`
     <Accordion defaultActiveKey="0">
     <Accordion.Item eventKey="0" className="mb-1">
       <Accordion.Header className="panel-heading1 br-7  style3">
         Section 1
       </Accordion.Header>
       <Accordion.Body className="border">
         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
         do eiusmod tempor incididunt ut labore et dolore magna
         aliqua. Ut enim ad minim veniam, quis nostrud exercitation
         ullamco laboris nisi ut aliquip ex ea commodo consequat.
         Duis aute irure dolor in reprehenderit in voluptate velit
         esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
         occaecat cupidatat non proident, sunt in culpa qui officia
         deserunt mollit anim id est laborum.
       </Accordion.Body>
     </Accordion.Item>
     <Accordion.Item eventKey="1" className="mb-1">
       <Accordion.Header className="panel-heading1 style3">
         Section 2
       </Accordion.Header>
       <Accordion.Body className="border">
         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
         do eiusmod tempor incididunt ut labore et dolore magna
         aliqua. Ut enim ad minim veniam, quis nostrud exercitation
         ullamco laboris nisi ut aliquip ex ea commodo consequat.
         Duis aute irure dolor in reprehenderit in voluptate velit
         esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
         occaecat cupidatat non proident, sunt in culpa qui officia
         deserunt mollit anim id est laborum.
       </Accordion.Body>
     </Accordion.Item>
     <Accordion.Item eventKey="2" className="mb-1">
       <Accordion.Header className="panel-heading1 style3">
         Section 3
       </Accordion.Header>
       <Accordion.Body className="border">
         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
         do eiusmod tempor incididunt ut labore et dolore magna
         aliqua. Ut enim ad minim veniam, quis nostrud exercitation
         ullamco laboris nisi ut aliquip ex ea commodo consequat.
         Duis aute irure dolor in reprehenderit in voluptate velit
         esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
         occaecat cupidatat non proident, sunt in culpa qui officia
         deserunt mollit anim id est laborum.
       </Accordion.Body>
     </Accordion.Item>
   </Accordion>
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Multiple targets Accordion</Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow5(!show5)} />
            </Card.Header>
            <Card.Body>
              <div>
                <div className="btn-list">
                  <Button className="ripple mb-3 mb-xl-0 me-2" variant='info' onClick={() => { first() }}>Toggle First Content</Button>
                  <Button className="ripple mb-3 mb-xl-0 me-2" variant='danger' onClick={() => { second() }}>Toggle Second Content</Button>
                  <Button className="ripple mb-3 mb-xl-0 me-2" variant='warning' onClick={() => { both() }}>Toggle Both Contents</Button>
                </div>
                <Row className="row-sm">
                  <Col>
                    <div className="multi-collapse">
                      {isFirstCollapsed ? (
                        <p className="mt-4 border rounded-2 p-3">
                          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                        </p>
                      ) : null}
                    </div>
                  </Col>
                  <Col>
                    <div className="multi-collapse">
                      {isSecondCollapsed ? (
                        <div className="mt-4 border rounded-2 p-3">
                          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                        </div>
                      ) : null}
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
            <Collapse in={show5} className="">
              <pre>
                <code>
                  {`
export const = ()= {
  
  let [isFirstCollapsed, setisFirstCollapsed] = useState(false);
  let first = () => {
    if (isFirstCollapsed === false) {
      setisFirstCollapsed(true)
    }
    else if (isFirstCollapsed === true) {
      setisFirstCollapsed(false)
    }
  }
return(
          <div className="mb-2 ms-2 ">
          <Button className="ripple" variant='primary' onClick={handleExpandClick}>Link with href</Button>
        <Collapse in={expanded}>
          <p className="mt-4">
          Anim pariatur cliche reprehrighterit, enim eiusmod high life accusamus
              terry
              richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore
              wes
              anderson cred nesciunt sapiente ea proident.
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
              fugit,
              sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
              nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
              amet,
              consectetur, adipisci velit, sed quia non numquam eius modi tempora
              incidunt
              ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
              veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam,
              nisi
              ut aliquid ex ea commodi consequatur? Quis autem vel eum iure
              reprehrighterit qui in ea voluptate velit esse quam nihil molestiae
              consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
              pariatur?
          </p>
        </Collapse>
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

export default Acordian;

