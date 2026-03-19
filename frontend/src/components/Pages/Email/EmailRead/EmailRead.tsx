import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { emails, emailcolors } from '../EmailRead/Data/EmailreadData';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Dropdown, Row } from 'react-bootstrap';

interface EmailReadProps { }

const EmailRead: FC<EmailReadProps> = () => (
  <Fragment>
    <PageHeader title="Email Read" />
    <Row>
      <Col md={12} lg={4} xl={3}>
        <Card>
          <div
            className="list-group list-group-transparent mb-0 mail-inbox mail-inbox-elements pb-3">
            <div className="mt-4 mb-4 ms-4 me-4 text-center">
              <Link to={`${import.meta.env.BASE_URL}pages/email/emailCompose`} className="btn btn-primary d-grid">Compose</Link>
            </div>
            {emails.map((email) => (
              <Link key={Math.random()}
                to="#"
                className="list-group-item list-group-item-action d-flex align-items-center font-weight-bold text-muted mb-2"
              >
                <span className="icons">
                  <i className={`fe fe-${email.icon} fs-18 me-5 ms-2 text-muted"`}></i>
                </span>
                {email.heading} <span className={`ms-auto badge bg-${email.color}`}>{email.text}</span>
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
      <Col md={12} lg={8} xl={9}>
        <Card>
          <Card.Body className="px-0">
            <div className="email-media px-5">
              <div className="mt-0 d-sm-flex">
                <img className="me-2 rounded-circle avatar avatar-lg"
                  src={ImagesData("users2")} alt="avatar" />
                <div className="media-body pt-0  overflow-visible">
                  <div className="float-end d-none d-md-flex fs-15">
                    <small className="me-3 mt-3 text-muted">July 13 , 2021 12:45
                      pm</small>
                    <Link to="#" className="me-3 email-icon bg-danger-transparent"
                      data-bs-toggle="tooltip" title=""
                      data-original-title="Rated"><i
                        className="text-danger fe fe-star fs-16"></i></Link>
                    <Link to="#" className="me-3 email-icon bg-success-transparent"
                      data-bs-toggle="tooltip" title=""
                      data-original-title="Reply"><i
                        className="text-success fa fa-reply"></i></Link>
                    <Dropdown>
                      <Dropdown.Toggle as="a" 
                        className="email-icon bg-primary-transparent no-caret"
                        data-bs-toggle="dropdown" role="button"
                        aria-haspopup="true" aria-expanded="false"><i
                          className="text-primary fe fe-more-vertical fs-16"></i></Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-start">
                        <Dropdown.Item><i
                          className="fe fe-share me-2"></i> Reply</Dropdown.Item>
                        <Dropdown.Item><i
                          className="fe fe-alert-circle me-2"></i>Report
                          Spam</Dropdown.Item>
                        <Dropdown.Item><i
                          className="fe fe-trash me-2"></i>Delete</Dropdown.Item>
                        <Dropdown.Item><i
                          className="fe fe-printer me-2"></i>Print</Dropdown.Item>
                        <Dropdown.Item><i
                          className="fe fe-filter me-2"></i>Filter</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="media-title font-weight-semibold mt-1">Patrenna <span
                    className="text-muted font-weight-semibold">(
                    alicnestle@gmail.com
                    )</span>
                  </div>
                  <small className="mb-0">to Adam Cotter ( adamcotter@gmail.com ) </small>
                  <small className="me-2 d-md-none">Jul 13 , 2021 12:45 pm</small>
                </div>
              </div>
            </div>
            <div className="eamil-body mt-5">
              <h6 className="px-5">Hi Sir/Madam</h6>
              <p className="px-5">Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
                inventore
                veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                enim
                ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed
                quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
              <p className="px-5"> Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia.</p>
              <p className="px-5"> Nor again is there anyone who loves or pursues or desires to obtain pain
                of
                itself, because it is pain, but because occasionally circumstances occur
                in
                which toil and pain can procure him some great pleasure. To take a
                trivial
                example, which of us ever undertakes laborious physical exercise, except
                to
                obtain some advantage from it?</p>
              <p className="mb-0 px-5">Thanking you Sir/Madam</p>
              <hr />
              <div className="email-attch px-5">
                <div className="float-end">
                  <Link to="#" className="email-icon"
                    data-bs-toggle="tooltip" title=""
                    data-original-title="Download"><i
                      className="fe fe-download fs-18"></i></Link>
                </div>
                <p className="font-weight-semibold">3 Attachments <Link
                  to="#">View</Link></p>
              </div>
              <Row className="px-5">
                <Col sm={6} xl={3} className="mt-4">
                  <Link to="#">
                    <div className="border p-0 text-center br-ts-5 br-te-5">
                      <img src={ImagesData("pngs3")} alt="img"
                        className="w-80 mx-auto" />
                    </div>
                    <div className="bg-light p-3 br-bs-5 br-be-5">
                      <i className="fa fa-file-excel-o me-1"></i> xls document
                    </div>
                  </Link>
                </Col>
                <Col sm={6} xl={3} className="mt-4">
                  <Link to="#">
                    <div className="border p-0 text-center br-ts-5 br-te-5">
                      <img src={ImagesData("pngs1")} alt="img"
                        className="w-80 mx-auto" />
                    </div>
                    <div className="bg-light p-3 br-bs-5 br-be-5">
                      <i className="fa fa-file-word-o me-1"></i> word document
                    </div>
                  </Link>
                </Col>
                <Col sm={6} xl={3} className="mt-4">
                  <Link to="#">
                    <div className="border p-0 text-center br-ts-5 br-te-5">
                      <img src={ImagesData("pngs1")} alt="img"
                        className="w-80 mx-auto" />
                    </div>
                    <div className="bg-light p-3 br-bs-5 br-be-5">
                      <i className="fa fa-file-word-o me-1"></i> word document
                    </div>
                  </Link>
                </Col>
              </Row>
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="bth-list text-end">
              <Button className="btn btn me-2" variant='outline-light' href="#"><i
                className="fa fa-reply"></i> Reply</Button>
              <Button className="btn btn" variant='outline-light' href="#"><i
                className="fa fa-share"></i> Forward</Button>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default EmailRead;
