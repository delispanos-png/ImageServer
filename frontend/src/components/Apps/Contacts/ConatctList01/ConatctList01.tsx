import React, { FC, useState, useEffect, Fragment } from 'react';
import { Button, ButtonGroup, Card, Col, Dropdown, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DropDown from '../../../Elements/DropDown/DropDown';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { contactlists } from '../../../../components/Apps/Contacts/ConatctList01/Data/Contact01Data';
interface ConatctList01Props { }

const ConatctList01: FC<ConatctList01Props> = () => {

  //for User search function
  const [data, setdata] = useState(contactlists)
  useEffect(() => {
  }, [contactlists])

  //Delete function
  function handleRemove(id) {
    const RemoveData = data.filter((contactlist) => contactlist.id !== id);
    setdata(RemoveData);

  }
  return (
    <Fragment>
      <PageHeader title="Contact List" />
      <Row className="flex-lg-nowrap">
        <Col col={12}>
          <div className="row flex-lg-nowrap">
            <Col col={12} mb={3}>
              <div>
                <div>
                  <Row>
                    <Col col={12} mb={4}>

                    </Col>
                  </Row>
                  <Row>
                    {data.map((contactlist) => (
                      <Col xxl={3} md={6} key={Math.random()}>
                        <Card className="card text-start user-contact-list">
                          <div>
                            <Card.Header
                              className=" border-bottom text-white bg-gradient p-5">
                              <Dropdown className="card-options float-end">

                                <Dropdown.Toggle as="a"
                                  className="option-dots border-0 bg-white-transparent no-caret"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false">
                                  <i className="fe fe-more-horizontal fs-20"></i>
                                </Dropdown.Toggle >
                                <Dropdown.Menu>
                                  <Dropdown.Item >Message <i
                                    className="fe fe-message-square float-end"></i></Dropdown.Item>
                                  <Dropdown.Item >Call <i
                                    className="fe  fe-phone float-end"></i></Dropdown.Item>
                                  <Dropdown.Item>Vedio Call <i
                                    className="fe  fe-video float-end"></i></Dropdown.Item>
                                  <Dropdown.Item >Favourites <i
                                    className="fe  fe-heart float-end"></i></Dropdown.Item>
                                  <Dropdown.Item >Send Mail<i
                                    className="fe  fe-mail float-end"></i></Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              <img className="avatar avatar-xxl br-7 d-block cover-image"
                                src={contactlist.src1} />


                              <div className=" ms-3 text-white">
                                <p className="mb-0 mt-1 fs-18 font-weight-semibold">
                                  {contactlist.heading}</p>
                                <small>{contactlist.title}</small>
                              </div>
                            </Card.Header>
                            <div className="p-5">
                              <div className="wrapper">
                                <p className="fs-14 font-weight-bold">ABOUT :</p>
                                <p className="mt-2 text-muted">Lorem Ipsum is not
                                  simply
                                  random text to popular belief Contrary Nemo
                                  enim
                                  ipsam to popular belief Contrary Nemo enim
                                  ipsam.</p>
                              </div>
                              <div>
                                <p className="font-weight-bold">Email : <span
                                  className="text-muted font-weight-normal ms-5 d-inline-block">denisrose123@gmail.com</span>
                                </p>
                                <p className="font-weight-bold">Phone : <span
                                  className="text-muted font-weight-normal ms-5 d-inline-block">+
                                  4568(234)1234.</span></p>
                                <p className="font-weight-bold">Category : <span
                                  className={`font-weight-normal text-${contactlist.color} ms-5 d-inline-block`}>{contactlist.class}</span>
                                </p>
                              </div>
                              <div className="text-white text-center mt-5">
                                <Link className="btn btn-md btn-primary w-48 me-1 my-1"
                                  to="#">Message</Link>
                                <Link onClick={() => { handleRemove(contactlist.id) }} className="btn btn-md btn-outline-primary w-48 me-1"
                                  to="#">Delete</Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>
          </div>
          <div className="modal fade" role="dialog" id="user-form-modal">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create User</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="py-1">
                    <form className="form" noValidate>
                      <Row>
                        <Col>
                          <Row>
                            <Col>
                              <div className="form-group">
                                <label>Full Name</label>
                                <input className="form-control" type="text"
                                  name="name" placeholder="John Smith"
                                  defaultValue="John Smith" />
                              </div>
                            </Col>
                            <Col>
                              <div className="form-group">
                                <label>Username</label>
                                <input className="form-control" type="text"
                                  name="username" placeholder="johnny.s"
                                  defaultValue="johnny.s" />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <div className="form-group">
                                <label>Email</label>
                                <input className="form-control" type="text"
                                  placeholder="user@example.com" />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col mb={3}>
                              <div className="form-group">
                                <label>About</label>
                                <textarea className="form-control"
                                  placeholder="My Bio"></textarea>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col col={12} sm={6} md={3}>
                          <div className="mb-2"><b>Change Password</b></div>
                          <Row>
                            <Col>
                              <div className="form-group">
                                <label>Current Password</label>
                                <input className="form-control" type="password"
                                  placeholder="••••••" />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <div className="form-group">
                                <label>New Password</label>
                                <input className="form-control" type="password"
                                  placeholder="••••••" />
                              </div>
                            </Col>
                            <Col>
                              <div className="form-group">
                                <label>Confirm <span
                                  className="d-none d-xl-inline">Password</span></label>
                                <input className="form-control" type="password"
                                  placeholder="••••••" />
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col col={12} sm={5} offset-sm={1} mb={3}>
                          <div className="mb-2"><b>Keeping in Touch</b></div>
                          <Row>
                            <Col>
                              <label>Email Notifications</label>
                              <div className="custom-controls-stacked px-2">
                                <div className="custom-control custom-checkbox">
                                  <input type="checkbox"
                                    className="custom-control-input"
                                    id="notifications-blog" defaultChecked />
                                  <label className="custom-control-label"
                                    htmlFor="notifications-blog">Blog
                                    posts</label>
                                </div>
                                <div className="custom-control custom-checkbox">
                                  <input type="checkbox"
                                    className="custom-control-input"
                                    id="notifications-news" defaultChecked />
                                  <label className="custom-control-label"
                                    htmlFor="notifications-news">Newsletter</label>
                                </div>
                                <div className="custom-control custom-checkbox">
                                  <input type="checkbox"
                                    className="custom-control-input"
                                    id="notifications-offers"
                                    defaultChecked />
                                  <label className="custom-control-label"
                                    htmlFor="notifications-offers">Personal
                                    Offers</label>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <div className="col d-flex justify-content-right">
                          <Button className="btn btn-primary" type="submit">Save
                            Changes</Button>
                        </div>
                      </Row>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
};

export default ConatctList01;
