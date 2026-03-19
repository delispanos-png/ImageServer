import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Emailcomposes, emailcolors } from '../EmailCompose/Data/EmailcomposeData';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
interface EmailComposeProps { }

const EmailCompose: FC<EmailComposeProps> = () => (
  <Fragment>
    <PageHeader title="Email Compose" />
    <Row>
      <Col lg={4} xl={3} md={12} sm={12}>
        <Card>
          <div
            className="list-group list-group-transparent mb-0 mail-inbox mail-inbox-elements pb-3">
            <div className="mt-2 mb-2 ms-4 me-5 text-center">
            </div>
            {Emailcomposes.map((Emailcompose) => (
              <Link to={`${import.meta.env.BASE_URL}Pages/Email/emailinbox`} key={Math.random()}
                className="list-group-item list-group-item-action d-flex align-items-center font-weight-bold text-muted mb-2">
                <i className={`fe fe-${Emailcompose.icon} fs-18 me-5 ms-2 text-muted`}></i>{Emailcompose.heading}<span
                  className={`ms-auto badge bg-${Emailcompose.color} me-2`}>{Emailcompose.class}</span>
              </Link>
            ))}
          </div>
          <div className="p-1">
            <div className="list-group list-group-transparent mb-0 mail-inbox">
              {emailcolors.map((emailcolor) => (
                <Link key={Math.random()}
                  to="#"
                  className="list-group-item list-group-item-action d-flex align-items-center font-weight-bold text-muted mb-2"
                >
                  <span className={`w-3 h-3 brround bg-${emailcolor.color} me-2`}></span>
                  {emailcolor.heading}
                </Link>
              ))}
            </div>
          </div>
        </Card>
      </Col>
      <Col lg={8} xl={9} md={12} sm={12}>
        <Card>
          <Card.Header>
            <Card.Title>Compose new message</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group>
                <div className="row align-items-center ">
                  <Form.Label className="col-sm-2 ">To</Form.Label>
                  <Col sm={10}>
                    <Form.Control type="text" className="form-control" />
                  </Col>
                </div>
              </Form.Group>
              <Form.Group>
                <div className="row align-items-center">
                  <Form.Label className="col-sm-2 mt-6">Subject</Form.Label>
                  <Col sm={10}>
                    <Form.Control type="text" className="form-control" />
                  </Col>
                </div>
              </Form.Group>
              <Form.Group>
                <div className="row ">
                  <Form.Label className="col-sm-2 mt-6 ">Message</Form.Label>
                  <Col sm={10}>
                    <Form.Control as='textarea' rows={10} className="mb-3" />
                  </Col>
                </div>
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer className="d-sm-flex">
            <div className="">
              <Link to="#"
                className="btn btn-icon btn-light  my-1 bg-primary-transparent me-2"
                data-bs-toggle="tooltip" title="" data-bs-original-title="Attach"> <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip className="primary">Attach</Tooltip>
                  }
                ><i
                  className="fe fe-paperclip"></i>

                </OverlayTrigger></Link>
              <Link to="#"
                className="btn btn-icon btn-light my-1 bg-primary-transparent  me-2"
                data-bs-toggle="tooltip" title="" data-bs-original-title="Link"> <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip className="primary">Link</Tooltip>
                  }
                ><i
                  className="fe fe-link"></i>

                </OverlayTrigger></Link>
              <Link to="#"
                className="btn btn-icon btn-light my-1 bg-primary-transparent me-2"
                data-bs-toggle="tooltip" title="" data-bs-original-title="Photos"><OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip className="primary">Photos</Tooltip>
                  }
                ><i
                  className="fe fe-image"></i>

                </OverlayTrigger></Link>
              <Link to="#"
                className="btn btn-icon btn-light my-1 bg-primary-transparent me-2"
                data-bs-toggle="tooltip" title="" data-bs-original-title="Delete"><OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip className="primary">Delete</Tooltip>
                  }
                ><i
                  className="fe fe-trash-2"></i>

                </OverlayTrigger></Link>
            </div>
            <div className="btn-list ms-auto">
              <Button type="button"
                className="btn text-primary  btn  btn-space my-1 br-7" variant="outline-primary">Cancel</Button>
              <Button type="submit" className="btn text-primary  my-1 br-7" variant='outline-primary'>Send
                message <i className="fa fa-paper-plane"></i></Button>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default EmailCompose;
