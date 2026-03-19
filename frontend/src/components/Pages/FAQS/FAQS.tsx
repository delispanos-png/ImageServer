import React, { FC, Fragment } from 'react';
import PageHeader from '../../../layout/Header/pageheader';
import { Accordion, Card, Col, Row, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
interface FaqsProps { }
const Faqs: FC<FaqsProps> = () => (
  <Fragment>
    <PageHeader title="FAQ's" />
    <Row>
      <Col md={12}>
        <Card className="p-5">
          <div className="panel-group" id="accordion1" role="tablist" aria-multiselectable="true">
            <div className="panel panel-default active border-0">
              <div className="panel-heading " role="tab" id="headingOne1">
                <h4 className="panel-title">
                </h4>
              </div>
              <Accordion className="acc-card mb-4 " flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="acc-header">
                    Can I use this Plugins in Another Template?
                  </Accordion.Header>
                  <Accordion.Body className="border">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                    tempor, sunt aliqua put a bird on it squid single-origin
                    coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice
                    lomo. Leggings occaecat craft beer farm-to-table, raw
                    denim aesthetic synth nesciunt you probably haven't heard
                    of them accusamus labore sustainable VHS.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <Accordion className="acc-card mb-4" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="acc-header">
                    How Can I contact?
                  </Accordion.Header>
                  <Accordion.Body className="border">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                    tempor, sunt aliqua put a bird on it squid single-origin
                    coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice
                    lomo. Leggings occaecat craft beer farm-to-table, raw
                    denim aesthetic synth nesciunt you probably haven't heard
                    of them accusamus labore sustainable VHS.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <Accordion className="acc-card mb-4" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="acc-header">
                    Can I use this Plugins in Another Template?
                  </Accordion.Header>
                  <Accordion.Body className="border">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                    tempor, sunt aliqua put a bird on it squid single-origin
                    coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice
                    lomo. Leggings occaecat craft beer farm-to-table, raw
                    denim aesthetic synth nesciunt you probably haven't heard
                    of them accusamus labore sustainable VHS.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <Accordion className="acc-card mb-4" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="acc-header">
                    It is Easy to Customizable?
                  </Accordion.Header>
                  <Accordion.Body className="border">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                    tempor, sunt aliqua put a bird on it squid single-origin
                    coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice
                    lomo. Leggings occaecat craft beer farm-to-table, raw
                    denim aesthetic synth nesciunt you probably haven't heard
                    of them accusamus labore sustainable VHS.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <Accordion className="acc-card mb-4" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="acc-header">
                    How can I download This template?
                  </Accordion.Header>
                  <Accordion.Body className="border">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                    tempor, sunt aliqua put a bird on it squid single-origin
                    coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice
                    lomo. Leggings occaecat craft beer farm-to-table, raw
                    denim aesthetic synth nesciunt you probably haven't heard
                    of them accusamus labore sustainable VHS.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <Accordion className="acc-card mb-4" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="acc-header">
                    How Can I Add another page in Template?
                  </Accordion.Header>
                  <Accordion.Body className="border">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                    tempor, sunt aliqua put a bird on it squid single-origin
                    coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice
                    lomo. Leggings occaecat craft beer farm-to-table, raw
                    denim aesthetic synth nesciunt you probably haven't heard
                    of them accusamus labore sustainable VHS.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Ask Question</Card.Title>
          </Card.Header>
          <Card.Body>
            <h5>If Your Query Not Clarified Post Your Question, My Customer Support will
              help
              You</h5>
            <div className="pt-4">
              <Form.Group className='mt-3'>
                <Form.Control type="text" className="form-control" id="name1"
                  placeholder="Your Name" />
              </Form.Group>
              <Form.Group className='mt-3'>
                <input type="email" className="form-control" id="email"
                  placeholder="Email Address" />
              </Form.Group>
              <Form.Group className='mt-3'>
                <textarea className="form-control" name="example-textarea-input"
                  placeholder="Post Your Quesry"></textarea>
              </Form.Group>
              <Button href="#" className="btn mt-5" variant="primary">Send Question</Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default Faqs;
