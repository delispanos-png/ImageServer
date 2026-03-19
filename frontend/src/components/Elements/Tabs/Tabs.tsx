import React, { FC, Fragment, useState } from 'react';
import { Card, Col, Collapse, Form, Nav, Row, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../layout/Header/pageheader';
interface TabsProps { }

const Tabs: FC<TabsProps> = () => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);

  return (
    <Fragment>
      <PageHeader title="Tabs" />
      <Row>
        <Col md={12} xl={6}>
          <Card>
            <Card.Header>
              <Card.Title>Tabs style </Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
            </Card.Header>
            <Card.Body>
              <div className='tabs-menu'>
                <div className="panel panel-primary tab_wrapper first_tab">
                  <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row>

                      <Nav as="ul" variant="pills" className="flex-row nav panel-tabs">
                        <Nav.Item as="li">
                          <Nav.Link eventKey="first">Tab 1</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link eventKey="second">Tab 2</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link eventKey="third">Tab 3</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link eventKey="four">Tab 4</Nav.Link>
                        </Nav.Item>
                      </Nav>

                      <Tab.Content>
                        <div className="panel-body tabs-menu-body ">
                          <div className="tab-content">
                            <Tab.Pane eventKey="first">
                              <p>page editors now use Lorem Ipsum as their default model text,
                                and
                                a search for 'lorem ipsum' will uncover many web sites still
                                in
                                their infancy. Various versions have evolved over the years,
                                sometimes by accident, sometimes on purpose (injected humour
                                and
                                the like Ipsum as their default model text, and a search for
                                'lorem ipsum' will uncover many web sites still Ipsum as
                                their
                                default model text, and a search for 'lorem ipsum' will
                                uncover
                                many web sites stillIpsum as their default model text, and a
                                search for 'lorem ipsum' will uncover many web sites still
                              </p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                              <p>search for 'lorem ipsum' will uncover many web sites still in
                                their infancy. Various versions have evolved over the years,
                                sometimes by accident, sometimes on purpose (injected humour
                                and
                                the like Ipsum as their default model text, and a search for
                                'lorem ipsum' will uncover many web sites still Ipsum as
                                their
                                default model text, and a search for 'lorem ipsum' will
                                uncover
                                many web sites stillIpsum as their default model text, and a
                                search for 'lorem ipsum' will uncover many web sitespage
                                editors
                                now use Lorem Ipsum as their default model text, and a still
                              </p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="third">
                              <p>model text, and a search for 'lorem ipsum' will uncover many
                                web
                                sites still in their infancy. Various versions have evolved
                                over
                                the years, sometimes by accident, sometimes on purpose
                                (injected
                                humour and the like Ipsum as their default model text, and a
                                search for 'lorem ipsum' will uncover many web sites still
                                Ipsum
                                as their default model text, and a search for 'lorem ipsum'
                                will
                                uncover many web sites stillIpsum as their default model
                                text,
                                and a search for 'lorem ipsum'page editors now use Lorem
                                Ipsum
                                as their default will uncover many web sites still</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="four">
                              <p> Various versions have evolved over the years, sometimes by
                                accident, sometimes on purpose (injected humour and the like
                                Ipsum as their default model text, and a search for 'lorem
                                ipsum' will uncover many web sites still Ipsum as their
                                default
                                model text, and a search for 'lorem ipsum' will uncover many
                                web
                                sites stillIpsum as their default model text, and a search
                                for
                                'lorem ipsum' will uncover many web sites stillpage editors
                                now
                                use Lorem Ipsum as their default model text, and a search
                                for
                                'lorem ipsum' will uncover many web sites still in their
                                infancy.</p>
                            </Tab.Pane>
                          </div>
                        </div>
                      </Tab.Content>

                    </Row>
                  </Tab.Container>
                </div>
              </div>
            </Card.Body>
            <Collapse in={show} className="">
              <pre>
                <code>
                  {`
              <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>

                <Nav variant="pills" className="flex-row ">
                  <Nav.Item>
                    <Nav.Link eventKey="first">Tab 1</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">Tab 2</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third">Tab 3</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="four">Tab 4</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>

                  <Tab.Pane eventKey="first">
                    <div className="tab_content">
                      <p>page editors now use Lorem Ipsum as their default model text,
                        and
                        a search for 'lorem ipsum' will uncover many web sites still
                        in
                        their infancy. Various versions have evolved over the years,
                        sometimes by accident, sometimes on purpose (injected humour
                        and
                        the like Ipsum as their default model text, and a search for
                        'lorem ipsum' will uncover many web sites still Ipsum as
                        their
                        default model text, and a search for 'lorem ipsum' will
                        uncover
                        many web sites stillIpsum as their default model text, and a
                        search for 'lorem ipsum' will uncover many web sites still
                      </p>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <div className="tab_content">
                      <p>search for 'lorem ipsum' will uncover many web sites still in
                        their infancy. Various versions have evolved over the years,
                        sometimes by accident, sometimes on purpose (injected humour
                        and
                        the like Ipsum as their default model text, and a search for
                        'lorem ipsum' will uncover many web sites still Ipsum as
                        their
                        default model text, and a search for 'lorem ipsum' will
                        uncover
                        many web sites stillIpsum as their default model text, and a
                        search for 'lorem ipsum' will uncover many web sitespage
                        editors
                        now use Lorem Ipsum as their default model text, and a still
                      </p>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <div className="tab-pane ">
                      <p>model text, and a search for 'lorem ipsum' will uncover many
                        web
                        sites still in their infancy. Various versions have evolved
                        over
                        the years, sometimes by accident, sometimes on purpose
                        (injected
                        humour and the like Ipsum as their default model text, and a
                        search for 'lorem ipsum' will uncover many web sites still
                        Ipsum
                        as their default model text, and a search for 'lorem ipsum'
                        will
                        uncover many web sites stillIpsum as their default model
                        text,
                        and a search for 'lorem ipsum'page editors now use Lorem
                        Ipsum
                        as their default will uncover many web sites still</p>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="four">
                    <div className="tab-pane">
                      <p> Various versions have evolved over the years, sometimes by
                        accident, sometimes on purpose (injected humour and the like
                        Ipsum as their default model text, and a search for 'lorem
                        ipsum' will uncover many web sites still Ipsum as their
                        default
                        model text, and a search for 'lorem ipsum' will uncover many
                        web
                        sites stillIpsum as their default model text, and a search
                        for
                        'lorem ipsum' will uncover many web sites stillpage editors
                        now
                        use Lorem Ipsum as their default model text, and a search
                        for
                        'lorem ipsum' will uncover many web sites still in their
                        infancy.</p>
                    </div>

                  </Tab.Pane>
                </Tab.Content>

              </Row>
            </Tab.Container>
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
        <Col md={12} xl={6}>
          <Card>
            <Card.Header>
              <Card.Title>Tabs style 1</Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
            </Card.Header>
            <Card.Body>
              <div className="panel panel-primary">
                <div className="tabs-menu ">
                  <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Nav as="ul" variant="pills" className="flex-row nav panel-tabs">
                      <Nav.Item as="li">
                        <Nav.Link eventKey="first" className="me-2">Tab 1</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Nav.Link eventKey="second" className="me-2">Tab 2</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Nav.Link eventKey="third" className="me-2">Tab 3</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Nav.Link eventKey="four" className="me-2">Tab 4</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <div className="panel-body tabs-menu-body ">
                        <div className="tab-content">
                          <Tab.Pane eventKey="first">
                            <p>page editors now use Lorem Ipsum as their default model text,
                              and
                              a search for 'lorem ipsum' will uncover many web sites still
                              in
                              their infancy. Various versions have evolved over the years,
                              sometimes by accident, sometimes on purpose (injected humour
                              and
                              the like Ipsum as their default model text, and a search for
                              'lorem ipsum' will uncover many web sites still Ipsum as
                              their
                              default model text, and a search for 'lorem ipsum' will
                              uncover
                              many web sites stillIpsum as their default model text, and a
                              search for 'lorem ipsum' will uncover many web sites still
                            </p>
                          </Tab.Pane>
                          <Tab.Pane eventKey="second">
                            <p>search for 'lorem ipsum' will uncover many web sites still in
                              their infancy. Various versions have evolved over the years,
                              sometimes by accident, sometimes on purpose (injected humour
                              and
                              the like Ipsum as their default model text, and a search for
                              'lorem ipsum' will uncover many web sites still Ipsum as
                              their
                              default model text, and a search for 'lorem ipsum' will
                              uncover
                              many web sites stillIpsum as their default model text, and a
                              search for 'lorem ipsum' will uncover many web sitespage
                              editors
                              now use Lorem Ipsum as their default model text, and a still
                            </p>
                          </Tab.Pane>
                          <Tab.Pane eventKey="third">
                            <p>model text, and a search for 'lorem ipsum' will uncover many
                              web
                              sites still in their infancy. Various versions have evolved
                              over
                              the years, sometimes by accident, sometimes on purpose
                              (injected
                              humour and the like Ipsum as their default model text, and a
                              search for 'lorem ipsum' will uncover many web sites still
                              Ipsum
                              as their default model text, and a search for 'lorem ipsum'
                              will
                              uncover many web sites stillIpsum as their default model
                              text,
                              and a search for 'lorem ipsum'page editors now use Lorem
                              Ipsum
                              as their default will uncover many web sites still</p>
                          </Tab.Pane>
                          <Tab.Pane eventKey="four">
                            <p> Various versions have evolved over the years, sometimes by
                              accident, sometimes on purpose (injected humour and the like
                              Ipsum as their default model text, and a search for 'lorem
                              ipsum' will uncover many web sites still Ipsum as their
                              default
                              model text, and a search for 'lorem ipsum' will uncover many
                              web
                              sites stillIpsum as their default model text, and a search
                              for
                              'lorem ipsum' will uncover many web sites stillpage editors
                              now
                              use Lorem Ipsum as their default model text, and a search
                              for
                              'lorem ipsum' will uncover many web sites still in their
                              infancy.</p>
                          </Tab.Pane>
                        </div>
                      </div>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </Card.Body>
            <Collapse in={show1} className="">
              <pre>
                <code>
                  {`
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Nav variant="pills" className="flex-row">
                  <Nav.Item>
                    <Nav.Link eventKey="first">Tab 1</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">Tab 2</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third">Tab 3</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="four">Tab 4</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <p>page editors now use Lorem Ipsum as their default model text,
                      and
                      a search for 'lorem ipsum' will uncover many web sites still
                      in
                      their infancy. Various versions have evolved over the years,
                      sometimes by accident, sometimes on purpose (injected humour
                      and
                      the like Ipsum as their default model text, and a search for
                      'lorem ipsum' will uncover many web sites still Ipsum as
                      their
                      default model text, and a search for 'lorem ipsum' will
                      uncover
                      many web sites stillIpsum as their default model text, and a
                      search for 'lorem ipsum' will uncover many web sites still
                    </p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <p>search for 'lorem ipsum' will uncover many web sites still in
                      their infancy. Various versions have evolved over the years,
                      sometimes by accident, sometimes on purpose (injected humour
                      and
                      the like Ipsum as their default model text, and a search for
                      'lorem ipsum' will uncover many web sites still Ipsum as
                      their
                      default model text, and a search for 'lorem ipsum' will
                      uncover
                      many web sites stillIpsum as their default model text, and a
                      search for 'lorem ipsum' will uncover many web sitespage
                      editors
                      now use Lorem Ipsum as their default model text, and a still
                    </p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <p>model text, and a search for 'lorem ipsum' will uncover many
                      web
                      sites still in their infancy. Various versions have evolved
                      over
                      the years, sometimes by accident, sometimes on purpose
                      (injected
                      humour and the like Ipsum as their default model text, and a
                      search for 'lorem ipsum' will uncover many web sites still
                      Ipsum
                      as their default model text, and a search for 'lorem ipsum'
                      will
                      uncover many web sites stillIpsum as their default model
                      text,
                      and a search for 'lorem ipsum'page editors now use Lorem
                      Ipsum
                      as their default will uncover many web sites still</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="four">
                    <p> Various versions have evolved over the years, sometimes by
                      accident, sometimes on purpose (injected humour and the like
                      Ipsum as their default model text, and a search for 'lorem
                      ipsum' will uncover many web sites still Ipsum as their
                      default
                      model text, and a search for 'lorem ipsum' will uncover many
                      web
                      sites stillIpsum as their default model text, and a search
                      for
                      'lorem ipsum' will uncover many web sites stillpage editors
                      now
                      use Lorem Ipsum as their default model text, and a search
                      for
                      'lorem ipsum' will uncover many web sites still in their
                      infancy.</p>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
        <Col md={12} xxl={6}>
          <Card id="tabs-style4">
            <Card.Header>
              <Card.Title>
                Vertical Tabs
              </Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />
            </Card.Header>
            <Card.Body>
              <div className="d-md-flex">
                <div className="border border-end br-ts-7 br-bs-7">
                  <div className="panel panel-primary tabs-style-4">
                    <div
                      className="tab-menu-heading border-top-0 border-bottom-0 border-start-0 br-te-0">
                      <div className="tabs-menu">
                        {/* <!-- Tabs --> */}

                        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                          <Row>
                            <Col sm={3}>
                              <Nav as="ul" variant="pills" className="nav panel-tabs">
                                <Nav.Item as="li">
                                  <Nav.Link as="a" eventKey="first" >Tab style01</Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                                  <Nav.Link as="a" eventKey="second">Tab style02</Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                                  <Nav.Link as="a" eventKey="third">Tab style03</Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                                  <Nav.Link as="a" eventKey="four">Tab style04</Nav.Link>
                                </Nav.Item>
                              </Nav>
                            </Col>
                            <Col sm={9}>
                              <Tab.Content className='tabs-data'>
                                <div className="panel-body tabs-menu-body">
                                  <div className="tab-content">

                                    <Tab.Pane eventKey="first">
                                      <p>At vero eos et accusamus et iusto odio dignissimos
                                        ducimus
                                        qui blanditiis praesentium voluptatum deleniti atque
                                        corrupti quos dolores et quas molestias excepturi sint
                                        occaecati cupiditate non provident, similique sunt in
                                        culpa
                                        qui officia deserunt mollitia animi, id est laborum et
                                        dolorum fuga.</p>
                                      <p>At vero eos et accusamus et iusto odio dignissimos
                                        ducimus
                                        qui blanditiis praesentium voluptatum deleniti atque
                                        corrupti quos dolores et quas molestias excepturi sint
                                        occaecati cupiditate non provident, similique sunt in
                                        culpa
                                        qui officia deserunt mollitia animi, id est laborum et
                                        dolorum fuga.</p>
                                      <p className="mb-0">Et harum quidem rerum facilis est et
                                        expedita
                                        distinctio. </p>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                      <p>Officia deserunt mollitia animi, id est laborum et
                                        ducimus
                                        qui blanditiis praesentium voluptatum deleniti atque
                                        corrupti quos dolores et quas molestias excepturi sint
                                        occaecati cupiditate non provident, similique sunt in
                                        culpa
                                        qui officia deserunt mollitia animi, id est laborum et
                                        dolorum fuga.</p>
                                      <p>At vero eos et accusamus et iusto odio dignissimos
                                        ducimus
                                        qui blanditiis praesentium voluptatum deleniti atque
                                        corrupti quos dolores et quas molestias excepturi sint
                                        occaecati cupiditate non provident, similique sunt in
                                        culpa
                                        qui officia deserunt mollitia animi, id est laborum et
                                        dolorum fuga.</p>
                                      <p className="mb-0">Et harum quidem rerum facilis est et
                                        expedita
                                        distinctio. </p>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="third">
                                      <p>occaecati cupiditate non providents similique sunt in
                                        ducimus
                                        qui blanditiis praesentium voluptatum deleniti atque
                                        corrupti quos dolores et quas molestias excepturi sint
                                        occaecati cupiditate non provident, similique sunt in
                                        culpa
                                        qui officia deserunt mollitia animi, id est laborum et
                                        dolorum fuga.</p>
                                      <p>At vero eos et accusamus et iusto odio dignissimos
                                        Et harum quidem rerum facilis est et
                                        expedita
                                        distinctio. molestias excepturi sint
                                        occaecati cupiditate non provident, similique sunt in
                                        culpa
                                        qui officia deserunt mollitia animi, id est laborum et
                                        dolorum fuga.</p>
                                      <p className="mb-0">Et harum quidem rerum facilis est et
                                        expedita
                                        distinctio.cupiditate non provident, similique sunt in
                                        culpa </p>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="four">
                                      <p>At vero eos et accusamus et iusto odio dignissimos
                                        ducimus
                                        qui blanditiis praesentium voluptatum deleniti atque
                                        corrupti quos dolores et quas molestias excepturi sint
                                        occaecati cupiditate non provident, similique sunt in
                                        culpa
                                        qui officia deserunt mollitia animi, id est laborum et
                                        dolorum fuga.</p>
                                      <p>At vero eos et accusamus et iusto odio dignissimos
                                      </p>
                                      <p className="mb-0">Et harum quidem rerum facilis est et
                                        expedita
                                        distinctio.ducimus
                                        qui blanditiis praesentium voluptatum deleniti atque
                                        corrupti quos dolores et quas molestias excepturi sint
                                        occaecati cupiditate non provident, similique sunt in
                                        culpa
                                        qui officia deserunt mollitia animi, id est laborum et
                                        dolorum fuga. </p>
                                    </Tab.Pane>
                                  </div>
                                </div>
                              </Tab.Content>
                            </Col>
                          </Row>
                        </Tab.Container>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Collapse in={show2} className="">
              <pre>
                <code>
                  {`
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column ">
                  <Nav.Item as="li">
                    <Nav.Link eventKey="first" className="me-2">Tab style01</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second" className="me-2">Tab style02</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third" className="me-2">Tab style03</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="four" className="me-2">Tab style04</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <p>At vero eos et accusamus et iusto odio dignissimos
                      ducimus
                      qui blanditiis praesentium voluptatum deleniti atque
                      corrupti quos dolores et quas molestias excepturi sint
                      occaecati cupiditate non provident, similique sunt in
                      culpa
                      qui officia deserunt mollitia animi, id est laborum et
                      dolorum fuga.</p>
                    <p>At vero eos et accusamus et iusto odio dignissimos
                      ducimus
                      qui blanditiis praesentium voluptatum deleniti atque
                      corrupti quos dolores et quas molestias excepturi sint
                      occaecati cupiditate non provident, similique sunt in
                      culpa
                      qui officia deserunt mollitia animi, id est laborum et
                      dolorum fuga.</p>
                    <p className="mb-0">Et harum quidem rerum facilis est et
                      expedita
                      distinctio. </p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <p>Officia deserunt mollitia animi, id est laborum et
                      ducimus
                      qui blanditiis praesentium voluptatum deleniti atque
                      corrupti quos dolores et quas molestias excepturi sint
                      occaecati cupiditate non provident, similique sunt in
                      culpa
                      qui officia deserunt mollitia animi, id est laborum et
                      dolorum fuga.</p>
                    <p>At vero eos et accusamus et iusto odio dignissimos
                      ducimus
                      qui blanditiis praesentium voluptatum deleniti atque
                      corrupti quos dolores et quas molestias excepturi sint
                      occaecati cupiditate non provident, similique sunt in
                      culpa
                      qui officia deserunt mollitia animi, id est laborum et
                      dolorum fuga.</p>
                    <p className="mb-0">Et harum quidem rerum facilis est et
                      expedita
                      distinctio. </p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <p>occaecati cupiditate non providents similique sunt in
                      ducimus
                      qui blanditiis praesentium voluptatum deleniti atque
                      corrupti quos dolores et quas molestias excepturi sint
                      occaecati cupiditate non provident, similique sunt in
                      culpa
                      qui officia deserunt mollitia animi, id est laborum et
                      dolorum fuga.</p>
                    <p>At vero eos et accusamus et iusto odio dignissimos
                      Et harum quidem rerum facilis est et
                      expedita
                      distinctio. molestias excepturi sint
                      occaecati cupiditate non provident, similique sunt in
                      culpa
                      qui officia deserunt mollitia animi, id est laborum et
                      dolorum fuga.</p>
                    <p className="mb-0">Et harum quidem rerum facilis est et
                      expedita
                      distinctio.cupiditate non provident, similique sunt in
                      culpa </p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="four">
                    <p>At vero eos et accusamus et iusto odio dignissimos
                      ducimus
                      qui blanditiis praesentium voluptatum deleniti atque
                      corrupti quos dolores et quas molestias excepturi sint
                      occaecati cupiditate non provident, similique sunt in
                      culpa
                      qui officia deserunt mollitia animi, id est laborum et
                      dolorum fuga.</p>
                    <p>At vero eos et accusamus et iusto odio dignissimos
                    </p>
                    <p className="mb-0">Et harum quidem rerum facilis est et
                      expedita
                      distinctio.ducimus
                      qui blanditiis praesentium voluptatum deleniti atque
                      corrupti quos dolores et quas molestias excepturi sint
                      occaecati cupiditate non provident, similique sunt in
                      culpa
                      qui officia deserunt mollitia animi, id est laborum et
                      dolorum fuga. </p>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>

        <Col md={12} xxl={6}>
          <Card id="tabs-style3">
            <Card.Header>
              <Card.Title>
                Tab Style 2
              </Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow3(!show3)} />
            </Card.Header>
            <Card.Body>
              <div className="panel panel-primary tabs-style-3 me-2 ">
                <div className="tab-menu-heading ">
                <div className="tabs-menu ">
                  <Tab.Container  defaultActiveKey="first">
                    <Nav as="ul" variant="pills" className="flex-row nav panel-tabs">
                      <Nav.Item as="li">
                        <Nav.Link eventKey="first" className="me-2">Tab style01</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Nav.Link eventKey="second" className="me-2">Tab style02</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Nav.Link eventKey="third" className="me-2">Tab style03</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Nav.Link eventKey="four" className="me-2 ">Tab style04</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>

                      <div className="panel-body tabs-menu-body mt-3">
                        <div className="tab-content">
                          <Tab.Pane eventKey="first" className='mt-2'>
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus
                              qui
                              blanditiis praesentium voluptatum deleniti atque corrupti
                              quos
                              dolores et quas molestias excepturi sint occaecati
                              cupiditate
                              non provident, similique sunt in culpa qui officia deserunt
                              mollitia animi, id est laborum et dolorum fuga.</p>
                            <p className="mb-0">Et harum quidem rerum facilis est et expedita
                              distinctio. Nam libero tempore, cum soluta nobis est
                              eligrighti
                              optio cumque nihil impedit quo minus id quod maxime placeat
                              facere possimus, omnis voluptas assumrighta est, omnis
                              dolor.
                            </p>
                          </Tab.Pane>
                          <Tab.Pane eventKey="second" className='mt-2'>
                            <p> Et harum quidem rerum facilis est et expedita distinctio.
                              Nam
                              libero tempore, cum soluta nobis est eligrighti optio cumque
                              nihil impedit quo minus id quod maxime placeat facere
                              possimus,
                              omnis voluptas assumrighta est, omnis dolor repellrightus.
                            </p>
                            <p className="mb-0">At vero eos et accusamus et iusto odio
                              dignissimos
                              ducimus qui blanditiis praesentium voluptatum deleniti atque
                              corrupti quos dolores et quas molestias excepturi sint
                              occaecati
                              cupiditate non provident, similique sunt in culpa qui
                              officia
                              deserunt mollitia animi, id est laborum et dolorum fuga.</p>
                          </Tab.Pane>
                          <Tab.Pane eventKey="third" className='mt-2'>
                            <p>Temporibus autem quibusdam et aut officiis debitis aut rerum
                              necessitatibus saepe eveniet ut et voluptates repudiandae
                              sint
                              et molestiae non recusandae</p>
                            <p className="mb-0">Et harum quidem rerum facilis est et expedita
                              distinctio. Nam libero tempore, cum soluta nobis est
                              eligrighti
                              optio cumque nihil impedit quo minus id quod maxime placeat
                              facere possimus, omnis voluptas assumrighta est, omnis dolor
                              repellrightus. </p>
                          </Tab.Pane>
                          <Tab.Pane eventKey="four" className='mt-2'>
                            <p>On the other hand, we denounce with righteous indignation and
                              dislike men who are so beguiled and demoralized by the
                              charms of
                              pleasure of the moment, so blinded by desire</p>
                            <p className="mb-0">Nam libero tempore, cum soluta nobis est
                              eligrighti
                              optio cumque nihil impedit quo minus id quod maxime placeat
                              facere possimus, omnis voluptas assumrighta est, omnis dolor
                              repellrightus. Temporibus autem quibusdam et aut officiis
                              debitis aut rerum necessitatibus </p>
                          </Tab.Pane>
                        </div>
                      </div>

                    </Tab.Content>
                  </Tab.Container>
                </div>
                </div>
              </div>
            </Card.Body>
            <Collapse in={show3} className="">
              <pre>
                <code>
                  {`
             <Tab.Container id="left-tabs-example" defaultActiveKey="first">
             <Nav variant="pills" className="flex-row">
               <Nav.Item>
                 <Nav.Link eventKey="first" className="me-2">Tab style01</Nav.Link>
               </Nav.Item>
               <Nav.Item>
                 <Nav.Link eventKey="second" className="me-2">Tab style02</Nav.Link>
               </Nav.Item>
               <Nav.Item>
                 <Nav.Link eventKey="third" className="me-2">Tab style03</Nav.Link>
               </Nav.Item>
               <Nav.Item>
                 <Nav.Link eventKey="four" className="me-2">Tab style04</Nav.Link>
               </Nav.Item>
             </Nav>
             <Tab.Content>

               <div className="panel-body tabs-menu-body">
                 <div className="tab-content">
                   <Tab.Pane eventKey="first">
                     <p>At vero eos et accusamus et iusto odio dignissimos ducimus
                       qui
                       blanditiis praesentium voluptatum deleniti atque corrupti
                       quos
                       dolores et quas molestias excepturi sint occaecati
                       cupiditate
                       non provident, similique sunt in culpa qui officia deserunt
                       mollitia animi, id est laborum et dolorum fuga.</p>
                     <p className="mb-0">Et harum quidem rerum facilis est et expedita
                       distinctio. Nam libero tempore, cum soluta nobis est
                       eligrighti
                       optio cumque nihil impedit quo minus id quod maxime placeat
                       facere possimus, omnis voluptas assumrighta est, omnis
                       dolor.
                     </p>
                   </Tab.Pane>
                   <Tab.Pane eventKey="second">
                     <p> Et harum quidem rerum facilis est et expedita distinctio.
                       Nam
                       libero tempore, cum soluta nobis est eligrighti optio cumque
                       nihil impedit quo minus id quod maxime placeat facere
                       possimus,
                       omnis voluptas assumrighta est, omnis dolor repellrightus.
                     </p>
                     <p className="mb-0">At vero eos et accusamus et iusto odio
                       dignissimos
                       ducimus qui blanditiis praesentium voluptatum deleniti atque
                       corrupti quos dolores et quas molestias excepturi sint
                       occaecati
                       cupiditate non provident, similique sunt in culpa qui
                       officia
                       deserunt mollitia animi, id est laborum et dolorum fuga.</p>
                   </Tab.Pane>
                   <Tab.Pane eventKey="third">
                     <p>Temporibus autem quibusdam et aut officiis debitis aut rerum
                       necessitatibus saepe eveniet ut et voluptates repudiandae
                       sint
                       et molestiae non recusandae</p>
                     <p className="mb-0">Et harum quidem rerum facilis est et expedita
                       distinctio. Nam libero tempore, cum soluta nobis est
                       eligrighti
                       optio cumque nihil impedit quo minus id quod maxime placeat
                       facere possimus, omnis voluptas assumrighta est, omnis dolor
                       repellrightus. </p>
                   </Tab.Pane>
                   <Tab.Pane eventKey="four">
                     <p>On the other hand, we denounce with righteous indignation and
                       dislike men who are so beguiled and demoralized by the
                       charms of
                       pleasure of the moment, so blinded by desire</p>
                     <p className="mb-0">Nam libero tempore, cum soluta nobis est
                       eligrighti
                       optio cumque nihil impedit quo minus id quod maxime placeat
                       facere possimus, omnis voluptas assumrighta est, omnis dolor
                       repellrightus. Temporibus autem quibusdam et aut officiis
                       debitis aut rerum necessitatibus </p>
                   </Tab.Pane>
                 </div>
               </div>

             </Tab.Content>
           </Tab.Container>
`}
                </code>
              </pre>
            </Collapse>
          </Card>
        </Col>
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Tabs Style 3</Card.Title>
              <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow4(!show4)} />
            </Card.Header>
            <Card.Body>
              <div className="panel panel-primary me-2">
              <div className=" tab-menu-heading p-0 bg-light">
                <div className="tabs-menu1 ">
                  <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                   
                      <Nav as="ul"  className="flex-row nav panel-tabs">
                        <Nav.Item as="li">
                          <Nav.Link eventKey="first" className="me-2">Tab1</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link eventKey="second" className="me-2">Tab2</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link eventKey="third" className="me-2">Tab3</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link eventKey="four" className="me-2">Tab4</Nav.Link>
                        </Nav.Item>
                      </Nav>
                   <div className='panel-body tabs-menu-body'>
                    <Tab.Content>
                       <Tab.Pane eventKey="first">
                          <p>page editors now use Lorem Ipsum as their default model text,
                            and
                            a search for 'lorem ipsum' will uncover many web sites still
                            in
                            their infancy. Various versions have evolved over the years,
                            sometimes by accident, sometimes on purpose (injected humour
                            and
                            the like</p>
                          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                            diam
                            nonumy eirmod tempor invidunt ut labore et dolore magna
                            aliquyam
                            erat, sed diam voluptua. At vero eos et</p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                          <p> default model text, and a search for 'lorem ipsum' will
                            uncover
                            many web sites still in their infancy. Various versions have
                            evolved over the years, sometimes by accident, sometimes on
                            purpose (injected humour and the like</p>
                          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                            diam
                            nonumy eirmod tempor invidunt ut labore et dolore magna
                            aliquyam
                            erat, sed diam voluptua. At vero eos et</p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="third">
                          <p>over the years, sometimes by accident, sometimes on purpose
                            (injected humour and the like</p>
                          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                            diam
                            nonumy eirmod tempor invidunt ut labore et dolore magna
                            aliquyam
                            erat, sed diam voluptua. At vero eos et</p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="four">
                          <p>page editors now use Lorem Ipsum as their default model text,
                            and
                            a search for 'lorem ipsum' will uncover many web sites still
                            in
                            their infancy. Various versions have evolved over the years,
                            sometimes by accident, sometimes on purpose (injected humour
                            and
                            the like</p>
                          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                            diam
                            nonumy eirmod tempor invidunt ut labore et dolore magna
                            aliquyam
                            erat, sed diam voluptua. At vero eos et</p>
                        </Tab.Pane>
                    </Tab.Content>
                    </div>
                  </Tab.Container>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Collapse in={show4} className="">
              <pre>
                <code>
                  {`
           <Tab.Container id="left-tabs-example" defaultActiveKey="first">
           <div className=" tab-menu-heading p-0 bg-light">
             <Nav variant="pills" className="flex-row">
               <Nav.Item>
                 <Nav.Link eventKey="first" className="me-2">Tab1</Nav.Link>
               </Nav.Item>
               <Nav.Item>
                 <Nav.Link eventKey="second" className="me-2">Tab2</Nav.Link>
               </Nav.Item>
               <Nav.Item>
                 <Nav.Link eventKey="third" className="me-2">Tab3</Nav.Link>
               </Nav.Item>
               <Nav.Item>
                 <Nav.Link eventKey="four" className="me-2">Tab4</Nav.Link>
               </Nav.Item>
             </Nav>
           </div>
           <Tab.Content>

             <div className="tab-content">
               <Tab.Pane eventKey="first">
                 <p>page editors now use Lorem Ipsum as their default model text,
                   and
                   a search for 'lorem ipsum' will uncover many web sites still
                   in
                   their infancy. Various versions have evolved over the years,
                   sometimes by accident, sometimes on purpose (injected humour
                   and
                   the like</p>
                 <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                   diam
                   nonumy eirmod tempor invidunt ut labore et dolore magna
                   aliquyam
                   erat, sed diam voluptua. At vero eos et</p>
               </Tab.Pane>
               <Tab.Pane eventKey="second">
                 <p> default model text, and a search for 'lorem ipsum' will
                   uncover
                   many web sites still in their infancy. Various versions have
                   evolved over the years, sometimes by accident, sometimes on
                   purpose (injected humour and the like</p>
                 <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                   diam
                   nonumy eirmod tempor invidunt ut labore et dolore magna
                   aliquyam
                   erat, sed diam voluptua. At vero eos et</p>
               </Tab.Pane>
               <Tab.Pane eventKey="third">
                 <p>over the years, sometimes by accident, sometimes on purpose
                   (injected humour and the like</p>
                 <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                   diam
                   nonumy eirmod tempor invidunt ut labore et dolore magna
                   aliquyam
                   erat, sed diam voluptua. At vero eos et</p>
               </Tab.Pane>
               <Tab.Pane eventKey="four">
                 <p>page editors now use Lorem Ipsum as their default model text,
                   and
                   a search for 'lorem ipsum' will uncover many web sites still
                   in
                   their infancy. Various versions have evolved over the years,
                   sometimes by accident, sometimes on purpose (injected humour
                   and
                   the like</p>
                 <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                   diam
                   nonumy eirmod tempor invidunt ut labore et dolore magna
                   aliquyam
                   erat, sed diam voluptua. At vero eos et</p>
               </Tab.Pane>
             </div>

           </Tab.Content>
         </Tab.Container>
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

export default Tabs;
