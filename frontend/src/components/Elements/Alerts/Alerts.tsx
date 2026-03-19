import React, { FC, Fragment, useState } from 'react';
import { Alert, Button, Card, Col, Collapse, Form, Nav, OverlayTrigger, Popover, Row, Tab } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import { defaultData, linksAData, transparentData, linkAlert, alertStyles, iconAlerts } from '../../Elements/Alerts/Data/AlertsData';

interface AlertsProps { }

const Alerts: FC<AlertsProps> = () => {

  const [showdata, setshowdata] = useState(defaultData);
  const [linkshowdata, setlinkshowdata] = useState(linksAData);
  const [styleshowdata, setstyleshowdata] = useState(alertStyles);
  const [iconshowdata, seticonshowdata] = useState(iconAlerts)
  //Show Code
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show5, setShow5] = useState(false);

  //Default Alert

  function handleRemove(id) {
    const RemoveData = showdata.filter((data) => data.id !== id);
    setshowdata(RemoveData);
  }
  //Link Alert

  function handlelinkRemove(id) {
    const RemovelinkData = linkshowdata.filter((link) => link.id !== id);
    setlinkshowdata(RemovelinkData);
  }
  //Styles Alert

  function handlestyleRemove(id) {
    const RemovestyleData = styleshowdata.filter((main) => main.id !== id);
    setstyleshowdata(RemovestyleData);
  }
  //Icon Alerts

  function handleiconRemove(id) {
    const RemoveiconData = iconshowdata.filter((con) => con.id !== id);
    seticonshowdata(RemoveiconData)
  }

  return (

    <Fragment>
      <PageHeader title="Alerts" />

      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Default alerts</Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
            </Card.Header>
            <Card.Body>
              {showdata.map((data) => (
                <Alert key={Math.random()} variant={data.color}>
                  <Button className="btn-close text-light" onClick={() => { handleRemove(data.id) }} variant="default">
                    <span >×</span>
                  </Button>
                  {data.color} alert—At vero eos et accusamus praesentium!

                </Alert>
              ))}
            </Card.Body>
            <Collapse in={show} className="">
              <pre>
                <code>
                  {`
export const Alert = () = {
  const [showdata, setshowdata] = useState(defaultData);

  function handleRemove(id) {
    const RemoveData = showdata.filter((data) => data.id !== id);
    setshowdata(RemoveData);
  }
    return(
<div className="example">
{showdata2.map((solid) => (
	<Alert key={Math.random()} className={solid.class}>
		<Button variant='' className="close" onClick={() => { handleRemove2(solid.id) }}>
			<span aria-hidden="true">&times;</span></Button>
		<strong>{solid.heading}</strong>{solid.description}
	</Alert>
))}

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
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Links in alerts</Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
            </Card.Header>
            <Card.Body>
              {linkshowdata.map((link) => (
                <Alert key={Math.random()} variant={link.class}>
                  <Button className={`btn-close text-${link.color}`} onClick={() => { handlelinkRemove(link.id) }} variant='default'>
                    <span>×</span>
                  </Button>
                  <strong>{link.heading}</strong>&nbsp;{link.alertLine}
                  <Alert.Link href="#">&nbsp; {link.description}</Alert.Link>
                </Alert>
              ))}
            </Card.Body>
            <Collapse in={show1} className="">
              <pre>
                <code>
                  {`
 export const Alert = () = {
  const [linkshowdata, setlinkshowdata] = useState(linksAData);
  function handlelinkRemove(id) {
    const RemovelinkData = linkshowdata.filter((link) => link.id !== id);
    setlinkshowdata(RemovelinkData);
  }
  return(
   <div className="card-body">
<Alert className="alert variant="light-success" role="alert">
    <button type="button" className="btn-close text-success"aria-hidden="true">×</button>
    <strong>Well done!</strong> You successfully read <a href="#" className="alert-link">this important alert message.</a>
</Alert>
<Alert className="alert variant="light-info" role="alert">
    <button type="button" className="btn-close text-info" aria-hidden="true">×</button>
     <strong>Heads up!</strong> This<a href="#" className="alert-link"> alert needs your attention,</a> but it's not super important.
</Alert>
<Alert className="alert variant="light-warning" role="alert">
    <button type="button" className="btn-close text-warning" aria-hidden="true">×</button>
    <strong>Warning! </strong> Better check yourself, you're <a href="#" className="alert-link">notlooking  good.</a>
</Alert>
<Alert className="alert variant="light-danger" role="alert">
    <button type="button" className="btn-close text-danger" aria-hidden="true">×</button>
    <strong>Oh snap!</strong> <a href="#" className="alert-link">Change a few things up</a>and try submitting again.
</Alert>
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
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Transparent Alerts</Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />
            </Card.Header>
            <Card.Body>
              {transparentData.map((transparent) => (
                <Alert key={Math.random()} variant={transparent.class}>
                  {transparent.alertLine}
                </Alert>
              ))}

            </Card.Body>
            <Collapse in={show2} className="">
              <pre>
                <code>
                  {`


   {transparentData.map((transparent) => (
     <Alert key={Math.random()} variant={transparent.class}>
       {transparent.alertLine}
     </Alert>
   ))}


`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
        <Col lg={12}>
          <Card>

            <Card.Header>
              <Card.Title>Link Alerts</Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow3(!show3)} />
            </Card.Header>
            <Card.Body>
              {linkAlert.map((content) => (
                <Alert key={Math.random()} variant={content.class}>
                  This is a {content.class} Primary alert with <Alert.Link>An example Link</Alert.Link> Give it a click if u like
                </Alert>
              ))}

            </Card.Body>
            <Collapse in={show3} className="">
              <pre>
                <code>
                  {`
 
{linkAlert.map((content) => (
  <Alert key={Math.random()} variant={content.class}>
    This is a {content.class} Primary alert with <Alert.Link>An example Link</Alert.Link> Give it a click if u like
  </Alert>
))}


`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header>
                <Card.Title>Tabs Alerts</Card.Title>
              </Card.Header>
              <Card.Body>
                <Tab.Container>
                  <Nav className="nav nav-pills nav-with-alerts mb-3">
                    <Col lg={3}>
                      <Nav.Link eventKey="first" className='btn btn-info d-grid gap-2 btn-lg p-2 mt-2' >Informatiom</Nav.Link>
                    </Col>
                    <Col lg={3}>
                      <Nav.Link eventKey="second" className='btn btn-success d-grid gap-2 btn-lg p-2 mt-2' > Successes </Nav.Link>
                    </Col>
                    <Col lg={3}>
                      <Nav.Link eventKey="third" className='btn btn-warning d-grid gap-2 btn-lg p-2 mt-2' >Warnings</Nav.Link>
                    </Col>
                    <Col lg={3}>
                      <Nav.Link eventKey="four" className='btn btn-danger d-grid gap-2 btn-lg p-2 mt-2' > Errors</Nav.Link>
                    </Col>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="first" id="info">
                      <div className="alert alert-info mt-2">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                          vehicula nec arcu at faucibus. Duis justo urna, adipiscing
                          quis
                          turpis non, dictum hrightrerit ipsum. Fusce non viverra
                          erat.
                          Curabitur sit amet ante dui. Donec congue molestie mi a
                          varius.
                          Susprightisse potenti. Cum sociis natoque penatibus et
                          magnis
                          dis parturient montes, nascetur ridiculus mus. Aliquam
                          ornare
                          quam eu ultricies bibrightum. Cras ante augue, pharetra eget
                          ultricies eu, aliquam eu velit. Phasellus mattis vitae justo
                          pretium tempus. Duis vitae felis et sem tristique suscipit.
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second" className="fade" id="success">
                      <div className="alert alert-success  mt-2">
                        <p>Nulla magna sapien, ullamcorper nec dolor id, gravida
                          venenatis
                          velit. Aliquam et malesuada metus. Sed vitae turpis pharetra
                          nunc dignissim ultricies et sit amet lacus. Cras gravida
                          felis
                          mauris, a pellentesque augue interdum ac. In varius
                          facilisis
                          ante, nec viverra libero commodo ac. Maecenas tempus, elit
                          nec
                          aliquet fermentum, tellus odio auctor sapien, eu scelerisque
                          purus turpis quis eros. Morbi id ante diam. Phasellus
                          aliquet
                          purus id odio mollis dignissim. Proin sagittis, risus a
                          ullamcorper dapibus, velit enim adipiscing nulla, vel
                          facilisis
                          ipsum dui quis diam. Aliquam ullamcorper accumsan felis id
                          consequat. Nullam vehicula ut mi eget porta.</p>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third" className="fade" id="warning">
                      <div className="alert alert-warning  mt-2">
                        <p>Curabitur varius euismod nisi ac lacinia. Curabitur nec urna
                          adipiscing, fermentum augue id, commodo nisl. Quisque ut
                          convallis est. Susprightisse tellus nisi, tempus eu nulla
                          quis,
                          laoreet imperdiet ante. Vivamus in lorem purus. Integer
                          luctus
                          elit et metus condimentum porta. Susprightisse viverra sit
                          amet
                          mauris vel elementum. Fusce lorem arcu, accumsan non odio
                          vel,
                          vestibulum pharetra odio. Sed non mollis mi, ac lacinia
                          nunc.
                          Cras eleifright massa velit, tincidunt tempor arcu sodales
                          at.
                          Nam sit amet erat enim. Mauris placerat suscipit odio, vitae
                          gravida purus bibrightum sed. Susprightisse a nunc quis
                          libero
                          rutrum mattis at ac metus. In ac risus eleifright,
                          vestibulum mi
                          eget, dapibus nulla. Nunc diam eros, convallis a sagittis
                          non,
                          rhoncus non nunc. Maecenas in eleifright quam.</p>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="four" className="fade" id="error">
                      <div className="alert alert-danger  mt-2">
                        <p>Sed quis dapibus nunc. Proin vestibulum libero elit, gravida
                          tincidunt mauris tincidunt blandit. Donec non ultrices
                          neque,
                          nec sollicitudin elit. Curabitur volutpat nulla vel mauris
                          vestibulum, tempor ultrices quam ullamcorper. Fusce
                          ultricies
                          elementum pretium. In vel consectetur leo, nec rutrum velit.
                          Fusce fermentum pulvinar nibh. Ut posuere ante sed luctus
                          egestas. Aenean ut suscipit tortor.</p>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </Card>
            <Card>
            <Card.Header>
              <Card.Title>Alerts Popovers</Card.Title>
            </Card.Header>
            <Card.Body className='text-center mb-3 mt-3 btn-list'>

              {['top',].map((placement: any) => (
                <OverlayTrigger
                  trigger="click"
                  key={placement}
                  placement={placement}
                  overlay={
                    <Popover id={`div-positioned-${placement}`}>
                      <Popover.Header as="h3">{`Popover ${placement}`}</Popover.Header>
                      <Popover.Body>
                       Vivamus sagittis lacus vel augue<br /> laoreet rutrum faucibus.
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button className='text-center me-1 mb-2' variant='success'>Click Success</Button>
                </OverlayTrigger>
              ))}
              {['bottom',].map((placement: any) => (
                <OverlayTrigger
                  trigger="click"
                  key={placement}
                  placement={placement}
                  overlay={
                    <Popover id={`div-positioned-${placement}`}>
                      <Popover.Header as="h3">Alert Info</Popover.Header>
                      <Popover.Body>
                        "Heads up! This alert needs your<br /> attention, but it's not super<br /> important...
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button className='text-light me-1 mb-2' variant='info'>Show Info</Button>
                </OverlayTrigger>
              ))}
              {['top',].map((placement: any) => (
                <OverlayTrigger
                  trigger="click"
                  key={placement}
                  placement={placement}
                  overlay={
                    <Popover id={`div-positioned-${placement}`}>
                      <Popover.Header as="h3">Alert Warning</Popover.Header>
                      <Popover.Body>
                      Warning! Best check yo self, you're <br />not looking too good..
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button className='text-light me-1 mb-2' variant='warning'>Show Warning</Button>
                </OverlayTrigger>
              ))}

              {['bottom',].map((placement: any) => (
                <OverlayTrigger
                  trigger="click"
                  key={placement}
                  placement={placement}
                  overlay={
                    <Popover id={`div-positioned-${placement}`}>
                      <Popover.Header as="h3">Alert Secondary</Popover.Header>
                      <Popover.Body>
                         Error! Please Check u r emial id..
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button className='text-light me-1 mb-2' variant='secondary'>Show Secondary</Button>
                </OverlayTrigger>
              ))}

              {['top',].map((placement: any) => (
                <OverlayTrigger
                  trigger="click"
                  key={placement}
                  placement={placement}
                  overlay={
                    <Popover id={`div-positioned-${placement}`}>
                      <Popover.Header as="h3">Alert Danger</Popover.Header>
                      <Popover.Body>
                         Oh snap! Change a few things up and <br />try submitting again.
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button className='text-light me-1 mb-2' variant='danger'>Show Danger</Button>
                </OverlayTrigger>
              ))}

              {['bottom',].map((placement: any) => (
                <OverlayTrigger
                  trigger="click"
                  key={placement}
                  placement={placement}
                  overlay={
                    <Popover id={`div-positioned-${placement}`}>
                      <Popover.Header as="h3">Alert Primary</Popover.Header>
                      <Popover.Body> 
                         Cool! This alert will close in 3 seconds.<br /> The data-bs-delay attribute is in<br /> milliseconds.
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button className='text-light me-1 mb-2' variant='primary'>Show Primary</Button>
                </OverlayTrigger>
              ))}
            </Card.Body>
          </Card>
          </Col>
          <Col md={12}>
            <Card>
              <Card.Header>
                <Card.Title>Alerts style</Card.Title>
                <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow4(!show4)} />
              </Card.Header>
              <Card.Body>
                <Row>
                  {styleshowdata.map((main) => (
                    <Col sm={6} md={6} key={Math.random()}>

                      <Alert variant={main.class}>
                        <Button className="btn-close text-light" variant='default' onClick={() => { handlestyleRemove(main.id) }}><span>×</span></Button>
                        <Alert.Heading>{main.heading}</Alert.Heading>
                        {main.description}
                      </Alert>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
              <Collapse in={show4} className="">
                <pre>
                  <code>
                    {`
  export const Alert = () = {
  const [styleshowdata, setstyleshowdata] = useState(alertStyles);
  function handlestyleRemove(id) {
    const RemovestyleData = styleshowdata.filter((main) => main.id !== id);
    setstyleshowdata(RemovestyleData);
  }
  return(
{styleshowdata.map((main) => (
  <Col sm={6} md={6} key={Math.random()}>

    <Alert variant={main.class}>
<Button className="btn-close text-light" variant='default' onClick={() => { handlestyleRemove(main.id) }}><span>×</span></Button>
<Alert.Heading>{main.heading}</Alert.Heading>
{main.description}
    </Alert>
  </Col>
))}
   )
};
`}
                  </code>
                </pre>
              </Collapse>
            </Card>
          </Col>
          <Col lg={12}>
            <Card>
              <Card.Header>
                <Card.Title>Alert with icon</Card.Title>
                <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow5(!show5)} />
              </Card.Header>
              <Card.Body>
                {iconshowdata.map((con) => (
                  <Alert key={Math.random()} variant={con.class}>
                    <Button className='btn-close text-light' onClick={() => { handleiconRemove(con.id) }} variant='default'><span>×</span></Button>
                    {con.icon} {con.description}
                  </Alert>
                ))}
              </Card.Body>
              <Collapse in={show5} className="">
                <pre>
                  <code>
                    {` 
  export const Alert = () = {
  const [iconshowdata, seticonshowdata] = useState(iconAlerts);
  function handleiconRemove(id) {
    const RemoveiconData = iconshowdata.filter((con) => con.id !== id);
    seticonshowdata(RemoveiconData)
  }
  return(
{iconshowdata.map((con) => (
  <Alert key={Math.random()} variant={con.class}>
    <Button className='btn-close text-light' onClick={() => { handleiconRemove(con.id) }} variant='default'><span>×</span></Button>
    {con.icon} {con.description}
  </Alert>
))}
  )
}; 
`}
                  </code>
                </pre>
              </Collapse>
            </Card>
          </Col>
        </Row>
      </Row>
    </Fragment>
  )
};

export default Alerts;
