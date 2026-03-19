import React, { FC, Fragment } from "react";
import { Dropdown, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import { EmailInboxdata, emails, emailcolors } from '../EmailInbox/Data/EmailinboxData';
import PageHeader from '../../../../layout/Header/pageheader';

interface EmailInboxProps { }
const EmailInbox: FC<EmailInboxProps> = () => {
  return (
    <Fragment>
      <PageHeader title="Email Inbox" />
      <Row>
        <Col lg={4} xl={3} md={12}>
          <Card>
            <div className="list-group list-group-transparent mb-0 mail-inbox">
              <div className="mt-4 mb-4 mx-4 text-center">
                <Link
                  to={`${import.meta.env.BASE_URL}pages/email/emailCompose`}
                  className="btn btn-primary d-grid"
                >
                  Compose
                </Link>
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
            {/* <div className="card border-top"> */}
              <div className="list-group list-group-transparent mb-0 mail-inbox ms-2">
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
            {/* </div> */}
          </Card>
        </Col>
        <Col md={12} lg={8} xl={9}>
          <Card>
            <Card.Body className=" p-6">
              <div className="inbox-body">
                <div className="mail-option">
                  <div className="chk-all me-1 p-0">
                    <Dropdown >
                      <Dropdown.Toggle as="a"
                        className="btn mini all no-caret"
                        variant=""
                        aria-expanded="false"
                      >
                        All
                        <i className="fa fa-angle-down ms-1"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu">
                        <Dropdown.Item> None</Dropdown.Item>
                        <Dropdown.Item>Read</Dropdown.Item>
                        <Dropdown.Item> Unread</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="btn-group me-1 p-0">
                    <Link to="#" className="btn mini tooltips">
                      <i className=" fa fa-refresh"></i>
                    </Link>
                  </div>
                  <div className="chk-all me-1 p-0">
                    <Dropdown className="hidden-phone">
                      <Dropdown.Toggle as="a"
                        className="btn mini blue no-caret"
                        variant=""
                        aria-expanded="false"
                      >
                        More
                        <i className="fa fa-angle-down ms-1"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu">
                        <Dropdown.Item href="#">
                          <i className="fa fa-pencil me-2"></i> Mark as Read
                        </Dropdown.Item>
                        <Dropdown.Item href="#">
                          <i className="fa fa-ban me-2"></i> Spam
                        </Dropdown.Item>
                        <hr className="my-0"></hr>
                        <Dropdown.Item href="#">
                          <i className="fa fa-trash-o me-2"></i> Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <ul className="unstyled inbox-pagination">
                    <li>
                      <span>1-50 of 234</span>
                    </li>

                    <li>
                      <Link className="np-btn" to="#">
                        <i className="fa fa-angle-right pagination-right"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="table-responsive">
                  <EmailInboxdata />
                </div>
              </div>
            </Card.Body>
          </Card>
          <div className="float-end mb-5">
            <Pagination>
              <Pagination.Prev disabled>Prev </Pagination.Prev>
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Item>{4}</Pagination.Item>
              <Pagination.Next>Next </Pagination.Next>
            </Pagination>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
}
export default EmailInbox;
