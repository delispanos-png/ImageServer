import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../../layout/Header/pageheader';
import PerfectScrollbar from "react-perfect-scrollbar";
import { contacts } from './Data/Contact2Data';
interface ContactList02Props { }

const ContactList02: FC<ContactList02Props> = () => {
  const [allData, setAllData] = React.useState(contacts)

  let allElement2: any = [];

  let myfunction = (InputData) => {
    let allElement: any
    for (allElement of contacts) {
      if (allElement.heading[0] == " ") {
        allElement.heading = allElement.title.trim()
      }
      if (allElement.heading.toLowerCase().includes(InputData.toLowerCase())) {
        if (allElement.heading.toLowerCase().startsWith(InputData.toLowerCase())) {
          allElement2.push(allElement);
        }
      }

    }
    setAllData(allElement2);
  };
  return (

    <Fragment>
      <PageHeader title="Contact List 2" />
      <Card>
        <Row className="g-0">
          <Col xl={3}>
            <div className="border-end">
              <div className="main-content-left main-content-left-contacts">
                <Card.Header>
													<InputGroup className="input-group">
														<Form.Control type="text"  onChange={(ele) => { myfunction(ele.target.value) }} className="form-control" placeholder="Search Friends..." />
														<Button type="button" className="btn" variant='primary'>
															<i className="fa fa-search"></i>
														</Button>
													</InputGroup>
                </Card.Header>
                <PerfectScrollbar style={{ width: "100%", height: "700px" }}>

                  <div className="main-contacts-list" id="mainContactList">
                    <div className="main-contact-label bg-light">
                      A
                    </div>
                    {allData.map((contact) => (
                      <div className="main-contact-item" key={Math.random()}>
                        <div className={contact.user}><img alt=""
                          src={contact.src1}
                          className="avatar avatar-md brround" /></div>
                        <div className="main-contact-body">
                          <h6>{contact.heading}</h6><span className="phone">+1-457-658-856</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </PerfectScrollbar>
              </div>
            </div>
          </Col>
          <Col xl={9}>
            <div>
              <div className="main-content-body main-content-body-contacts">
                <div className="main-contact-info-header bg-contacthead">
                  <div className="media">
                    <div className="main-img-user brround">
                      <img alt="" src={ImagesData("users2")}
                        className="w-100 h-100 br-7" />
                      <Link to="#"><i className="fe fe-camera"></i></Link>
                    </div>
                    <div className="media-body text-white">
                      <h4 className="text-white">Patrenna</h4>
                      <p>Web Designer</p>
                      <nav className="nav contact-icons">
                        <Button role="button"
                          className="btn text-white bg-white-50 me-2 mb-2" variant=''
                        ><i className="fe fe-phone me-2"></i>
                          Call</Button>
                        <Link role="button"
                          className="btn text-white bg-white-50 me-2 mb-2"
                          to="#"><i className="fe fe-mail me-2"></i>
                          Message</Link>
                        <Button role="button"
                          className="btn text-white bg-white-50 me-2 mb-2" variant=''
                        ><i
                          className="fe fe-user-plus me-2"></i>
                          Add to Group</Button>
                        <Button role="button"
                          className="btn text-white bg-white-50 me-2 mb-2" variant=''
                        ><i className="fe fe-slash me-2"></i>
                          Block</Button>
                      </nav>
                    </div>
                  </div>
                  <div className="main-contact-action">
                    <Button className='me-3 mb-5' variant="success"> Edit Profile</Button>
                    <Button className='mb-5' variant="primary">Delete</Button>
                  </div>
                </div>
                <div className="main-contact-info-body">
                  <Card.Body>
                    <h6 className="text-primary">Biography</h6>
                    <p className="text-muted">Sed ut perspiciatis unde omnis iste natus
                      error
                      sit voluptatem accusantium doloremque uis aute irure dolor in
                      reprehrighterit in voluptate velit esse cillum dolore eu fugiat
                      nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                      sunt
                      in culpa qui officia deserunt mollit anim id est laborum.
                      laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                      veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                      aut
                      fugit, sed quia consequuntur magni dolores eos qui ratione
                      voluptatem sequi nesciunt.</p>
                    <p className="text-muted"> aute irure dolor in reprehrighterit in
                      voluptate
                      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint
                      occaecat cupidatat non proident, sunt in culpa qui officia
                      deserunt
                      mollit anim id est laborum. laudantium, totam rem aperiam, eaque
                      ipsa quae ab illo inventore veritatis et quasi architecto beatae
                      vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                      voluptas
                      sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                      dolores eos qui ratione voluptatem sequiSed ut perspiciatis unde
                      omnis iste natus error sit voluptatem accusantium doloremque
                      uisSed
                      ut perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium doloremque uis nesciunt.</p>
                  </Card.Body>
                  <div className="media-list p-0">
                    <div className="media py-4 mt-0">
                      <div className="media-body">
                        <div className="d-flex">
                          <div
                            className="media-icon bg-primary-transparent border-primary me-3 mt-1">
                            <i className="fa fa-phone"></i>
                          </div>
                          <div className="w-70">
                            <label>Work</label> <span
                              className="font-weight-normal1 fs-14">+1 (425) 857
                              5463</span>
                          </div>
                        </div>
                        <div className="d-flex">
                          <div
                            className="media-icon bg-primary-transparent border-primary me-3 mt-1">
                            <i className="fa fa-phone"></i>
                          </div>
                          <div className="w-70">
                            <label>Personal</label> <span
                              className="font-weight-normal1 fs-14">+1 (547) 542
                              3568</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="media py-4 border-top mt-0">
                      <div className="media-body">
                        <div className="d-flex">
                          <div
                            className="media-icon bg-primary-transparent border-primary me-3 mt-1">
                            <i className="fa fa-envelope"></i>
                          </div>
                          <div className="w-70">
                            <label>Gmail Account</label> <span
                              className="font-weight-normal1 fs-14">arlena.soles@gmail.com</span>
                          </div>
                        </div>
                        <div className="d-flex">
                          <div
                            className="media-icon bg-primary-transparent border-primary me-3 mt-1">
                            <i className="fa fa-envelope"></i>
                          </div>
                          <div className="w-70">
                            <label>Other Account</label> <span
                              className="font-weight-normal1 fs-14">me@spruko.com</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="media py-4 border-top mt-0">
                      <div className="media-body">
                        <div className="d-flex">
                          <div
                            className="media-icon bg-primary-transparent border-primary me-3 mt-1">
                            <i className="fa fa-map-marker"></i>
                          </div>
                          <div className="w-70">
                            <label>Current Address</label> <span
                              className="font-weight-normal1 fs-14">012 San
                              Francisco,
                              California 13245</span>
                          </div>
                        </div>
                        <div className="d-flex">
                          <div
                            className="media-icon bg-primary-transparent border-primary me-3 mt-1">
                            <i className="fa fa-clock-o"></i>
                          </div>
                          <div className="w-70">
                            <label>Call History</label> <Link
                              className="font-weight-normal1 fs-14"
                              to="#">Duration of last
                              call: 2m
                              32sec</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Fragment>
  )
};

export default ContactList02;
