import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row, Form, Button, Dropdown, Tab, Tabs, Nav } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router-dom';
interface FormLayoutsProps { }

const FormLayouts: FC<FormLayoutsProps> = () => {
  //BILLING INFORMATION
  //Country
  interface option {
    value: number
    label: string

  }
  const options: option[] = [
    { value: 1, label: "Country" },
    { value: 2, label: "Germany" },
    { value: 3, label: "Canada" },
    { value: 4, label: "USA" },
    { value: 5, label: "Aus" },

  ]
  //COLUMN AND AUTO SIZING
  interface option1 {
    value: number
    label: string
  }
  const options1: option1[] = [
    { value: 1, label: "Choose" },
    { value: 2, label: "One" },
    { value: 3, label: "Two" },
    { value: 4, label: "Three" },

  ]
  //CHECKOUT
  interface option2 {
    value: number
    label: string
  }
  const options2: option2[] = [
    { value: 1, label: "Month" },
    { value: 2, label: "January" },
    { value: 3, label: "February" },
    { value: 4, label: "March" },
    { value: 5, label: "April" },
    { value: 6, label: "May" },
    { value: 7, label: "June" },
    { value: 8, label: "July" },
    { value: 9, label: "August" },
    { value: 10, label: "September" },
    { value: 11, label: "October" },
    { value: 12, label: "November" },
    { value: 13, label: "December" },

  ]
  //Year
  interface option3 {
    value: number
    label: number
  }
  const options3: option3[] = [
    { value: 22, label: 2040 },
    { value: 21, label: 2039 },
    { value: 20, label: 2038 },
    { value: 19, label: 2037 },
    { value: 18, label: 2036 },
    { value: 17, label: 2035 },
    { value: 16, label: 2034 },
    { value: 15, label: 2032 },
    { value: 14, label: 2031 },
    { value: 13, label: 2030 },
    { value: 12, label: 2029 },
    { value: 11, label: 2028 },
    { value: 11, label: 2028 },
    { value: 10, label: 2027 },
    { value: 9, label: 2026 },
    { value: 8, label: 2025 },
    { value: 7, label: 2024 },
    { value: 6, label: 2023 },
    { value: 5, label: 2022 },
    { value: 4, label: 2021 },
    { value: 3, label: 2020 },
    { value: 2, label: 2019 },
    { value: 1, label: 2018 },
  ]
  return (

    <Fragment>
      <div>
        <PageHeader title="Form Layout" />
        <Row>
          <Col md={12} xl={6}>
            <Card>
              <Card.Header>
                <Card.Title>Vertical Form</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <div>
                    <Form.Group>
                      <Form.Label htmlFor="exampleInputEmail1" className="form-label">Email
                        address</Form.Label>
                      <Form.Control type="email" className="form-control mt-3" id="exampleInputEmail1"
                        placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="exampleInputPassword1"
                        className="form-label mt-3">Password</Form.Label>
                      <Form.Control type="password" className="form-control"
                        id="exampleInputPassword1" placeholder="Password" />
                    </Form.Group>
                    <Form.Check type="checkbox" className='mt-4' label="Check me out" />
                  </div>
                  <Button type="submit" className="btn btn-primary mt-5 mb-0">Submit</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={12} xl={6}>
            <Card>
              <Card.Header>
                <Card.Title>Horizontal Form</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form className="form-horizontal">
                  <Form.Group className="form-group row">
                    <Form.Label htmlFor="inputName" className="col-md-3 form-label">User Name</Form.Label>
                    <Col md={9}>
                      <Form.Control type="text" className="form-control" id="inputName"
                        placeholder="Name" />
                    </Col>
                  </Form.Group>
                  <Form.Group className="form-group row">
                    <Form.Label htmlFor="inputEmail3" className="col-md-3 form-label">Email</Form.Label>
                    <Col md={9}>
                      <Form.Control type="email" className="form-control" id="inputEmail3"
                        placeholder="Email" />
                    </Col>
                  </Form.Group>
                  <Form.Group className="form-group row">
                    <Form.Label htmlFor="inputPassword3" className="col-md-3 form-label">Password</Form.Label>
                    <Col md={9}>
                      <Form.Control type="password" className="form-control" id="inputPassword3"
                        placeholder="Password" />
                    </Col>
                  </Form.Group>
                  <Form.Group className="form-group mb-0 row justify-content-end">
                    <Col md={9}>
                      <Form.Check type="checkbox" label="Check me out" />
                    </Col>
                  </Form.Group>
                  <Form.Group className="form-group mb-0 mt-4 row justify-content-end">
                    <Col md={9}>
                      <Button type="submit" className="btn btn-primary me-2">Sign in</Button>
                      <Button type="submit" className="btn btn-secondary me-2">Cancel</Button>
                    </Col>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12} xl={6}>
            <Card>
              <Card.Header>
                <Card.Title>Shipping Details</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form className="form-row ">
                  <div className="form-group col-md-6 mb-0 mt-2">
                    <Form.Group>
                      <Form.Control type="text" className="form-control " id="name1"
                        placeholder="First Name" />
                    </Form.Group>
                  </div>
                  <div className="form-group col-md-6 mb-0 mt-2">
                    <Form.Group>
                      <Form.Control type="text" className="form-control" id="name2"
                        placeholder="Last Name" />
                    </Form.Group>
                  </div>
                </Form>
                <Form.Group>
                  <Form.Control type="email" className="form-control mt-4" id="inputEmail5"
                    placeholder="Email Address"
                  />
                </Form.Group>
                <Form.Group>
                  <input type="text" className="form-control mt-4" id="address"
                    placeholder="AddressLine1" />
                </Form.Group>
                <div className="form-row">
                  <div className="form-group col-md-6 mb-0">
                    <Form.Group>
                      <input type="text" className="form-control mt-4" id="country"
                        placeholder="Country" />
                    </Form.Group>
                  </div>
                  <div className="form-group col-md-6 mb-0">
                    <Form.Group className="form-group">
                      <Form.Control type="text" className="form-control mt-4" id="region"
                        placeholder="Country/Region" />
                    </Form.Group>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6 mb-0">
                    <Form.Group className="form-group">
                      <Form.Control type="text" className="form-control" id="city"
                        placeholder="City" />
                    </Form.Group>
                  </div>
                  <div className="form-group col-md-6 mb-0">
                    <Form.Group className="form-group">
                      <Form.Control type="number" className="form-control" id="postal"
                        placeholder="Zip/Postal" />
                    </Form.Group>
                  </div>
                </div>
                <div className="form-footer mt-2">
                  <Button href="#" className="btn" variant='primary'>Confirm Details</Button>
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Billing Information</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6} md={6}>
                    <Form.Group>
                      <Form.Label className="form-label">First Name <span
                        className="text-red">*</span></Form.Label>
                      <Form.Control type="text" className="form-control" placeholder="First name" />
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={6}>
                    <Form.Group>
                      <Form.Label className="form-label">Last Name <span
                        className="text-red">*</span></Form.Label>
                      <Form.Control type="text" className="form-control" placeholder="Last name" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="form-label mt-2">Company Name <span
                        className="text-red">*</span></Form.Label>
                      <Form.Control type="text" className="form-control" placeholder="Company name" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="form-label mt-2">Email address <span
                        className="text-red">*</span></Form.Label>
                      <Form.Control type="email" className="form-control" placeholder="Email"

                      // autocomplete="username"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="form-label mt-2">Country <span
                        className="text-red">*</span></Form.Label>
                      <Select options={options} placeholder="Country--"  classNamePrefix="Select2"/>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="form-label mt-2">Address <span
                        className="text-red">*</span></Form.Label>
                      <Form.Control type="text" className="form-control" placeholder="Home Address" />
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={6}>
                    <Form.Group>
                      <Form.Label className=' mt-2'>City <span
                        className="text-red">*</span></Form.Label>
                      <Form.Control type="text" className="form-control" placeholder="City" />
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={6}>
                    <Form.Group>
                      <Form.Label className=' mt-2'>Postal Code <span
                        className="text-red">*</span></Form.Label>
                      <Form.Control type="number" placeholder="ZIP Code" />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Column & Auto Sizing</Card.Title>
              </Card.Header>
              <Card.Body className="pt-0">
                <Form.Group>
                  <Form.Label className=' mt-2'>Column Sizing</Form.Label>
                  <Row className="row g-3">
                    <Col sm={7}>
                      <Form.Control type="text" className="form-control" placeholder="City"
                        aria-label="City" />
                    </Col>
                    <Col className="col-sm">
                      <Form.Control type="text" className="form-control" placeholder="State"
                        aria-label="State" />
                    </Col>
                    <Col className="col-sm">
                      <Form.Control type="text" className="form-control" placeholder="Zip"
                        aria-label="Zip" />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label className=' mt-2'>Auto Sizing</Form.Label>
                  <Form className="row gy-2 gx-3 align-items-center">
                    <div className="col-auto">
                      <Form.Label className="visually-hidden" htmlFor="autoSizingInput">Name</Form.Label>
                      <Form.Control type="text" className="form-control" id="autoSizingInput"
                        placeholder="Jane Doe" />
                    </div>
                    <div className="col-auto mt-4 ">
                      <Form.Label className="visually-hidden "
                        htmlFor="autoSizingInputGroup">Username</Form.Label>
                      <div className="input-group">
                        <div className="input-group-text btn-primary">@</div>
                        <Form.Control type="text" className="form-control"
                          id="autoSizingInputGroup" placeholder="Username" />
                      </div>
                    </div>
                    <div className="col-auto">
                      <Form.Label className="visually-hidden"
                        htmlFor="autoSizingSelect">Preference</Form.Label>
                      <Select options={options1} placeholder="Choose..." />
                    </div>
                    <div className="col-auto">
                      <Form.Check type="checkbox" label="Remember me" />
                    </div>
                  </Form>
                </Form.Group>
              </Card.Body>
            </Card>

          </Col>
          <Col md={12} xl={6}>
            <Card>
              <Card.Header>
                <Card.Title>Horizontal form label sizing</Card.Title>
              </Card.Header>
              <Card.Body>
                <p>Be sure to use <code className="highlighter-rouge">.col-form-label-sm</code> or
                  <code className="highlighter-rouge">.col-form-label-lg</code> to your <code
                    className="highlighter-rouge">&lt;label&gt;</code> s or <code
                      className="highlighter-rouge">&lt;legend&gt;</code>s
                  to correctly follow the size of <code
                    className="highlighter-rouge">&lt;.form-control-lg&gt;</code> and <code
                      className="highlighter-rouge">&lt;.form-control-sm&gt;</code> .</p>
                <div className="row mb-3">
                  <Form.Label htmlFor="colFormLabelSm"
                    className="col-sm-2 col-form-label col-form-label-sm">Email</Form.Label>
                  <div className="col-sm-10">
                    <Form.Control type="email" className="form-control-sm"
                      id="colFormLabelSm" placeholder="col-form-label-sm"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <Form.Label htmlFor="colFormLabel" className="col-sm-2 col-form-label">Email</Form.Label>
                  <div className="col-sm-10">
                    <Form.Control type="email" className="form-control" id="colFormLabel"
                      placeholder="col-form-label"
                    />
                  </div>
                </div>
                <div className="row">
                  <Form.Label htmlFor="colFormLabelLg"
                    className="col-sm-2 col-form-label col-form-label-lg">Email</Form.Label>
                  <div className="col-sm-10">
                    <Form.Control type="email" className="form-control form-control-lg"
                      id="colFormLabelLg" placeholder="col-form-label-lg"

                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>CheckOut</Card.Title>
                <div className="card-options mt-3">
                  <Dropdown className="btn-group">
                    <Dropdown.Toggle className="btn btn-primary dropdown-toggle"
                      data-bs-toggle="dropdown" aria-expanded="false">
                      Visa<span className="caret"></span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item><Link to="#">Visa</Link></Dropdown.Item>
                      <Dropdown.Item><Link to="#">Rupay</Link></Dropdown.Item>
                      <Dropdown.Item><Link to="#">Mastercard</Link></Dropdown.Item>
                      <Dropdown.Item><Link to="#">PayPal</Link></Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Group>
                      <Form.Label className="form-label mt-3">CardHolder Name</Form.Label>
                      <Form.Control type="text" className="form-control" id="name11"
                        placeholder="First Name" />
                    </Form.Group>
                <div className="form-row">
                  <div className="form-group col-md-9 mb-0">
                    <Form.Group>
                      <Form.Label className="form-label mt-1">Credit card Number</Form.Label>
                      <Form.Control type="number" className="form-control" id="number"
                        placeholder="number" />
                    </Form.Group>
                  </div>
                  <div className="form-group col-md-3 mb-0">
                    <Form.Group>
                      <Form.Label className="form-label mt-1">CVV Number</Form.Label>
                      <Form.Control type="number" className="form-control" id="region1"
                        placeholder="675" />
                    </Form.Group>
                  </div>
                </div>
                <div className="form-group m-0">
                  <Form.Label className="form-label mt-2">Expiration Date</Form.Label>
                  <Row>
                    <div className="col-6">
                      <Select options={options2} placeholder="Month" classNamePrefix="Select2"/>
                    </div>
                    <div className="col-6">
                      <Select options={options3} placeholder="Select Year" classNamePrefix="Select2"/>
                    </div>
                  </Row>
                </div>
                <div className="mt-4 mb-0 text-dark">
                  Your Credit card information is encrypted
                </div>
                <div className="form-footer mt-2">
                  <Button href="#" className="btn " variant='primary'>Make Payment</Button>
                </div>
              </Form.Group>
              </Form>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Header>
                <Card.Title>Payment Information</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="card-pay">
                  <Tab.Container id="fill-tab-example" defaultActiveKey="first">

                    <Nav as='ul' variant="pills" className="tabs-menu nav mb-4">
                      <Nav.Item as='li'>
                        <Nav.Link eventKey="first"><i className="fa fa-credit-card me-2"></i>Credit Card</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as='li'>
                        <Nav.Link eventKey="second"><i className="fa fa-paypal me-2"></i>Paypal</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as='li'>
                        <Nav.Link eventKey="third"><i className="fa fa-university me-2"></i>Bank Offers</Nav.Link>
                      </Nav.Item>
                    </Nav>

                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <div className="tab-pane active show" id="tab20">
                          <div className="bg-danger-transparent-2 text-danger px-4 py-2 br-3 mb-4" role="alert">Please Enter Valid Details</div>
                          <Form.Group>
                            <Form.Label className="form-label mt-2">CardHolder Name</Form.Label>
                            <Form.Control type="text" className="form-control"
                              placeholder="First Name" />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label className="form-label mt-2">Card number</Form.Label>
                            <div className="input-group">
                              <Form.Control type="text" className="form-control" id="InputGroup"
                                placeholder="Search for..." />
                              <Button className="btn btn-secondary box-shadow-0"
                                type="button"><i className="fa fa-cc-visa"></i> &nbsp;
                                <i className="fa fa-cc-amex"></i> &nbsp;
                                <i className="fa fa-cc-mastercard"></i></Button>
                            </div>
                          </Form.Group>
                          <Row>
                            <Col sm={8}>
                              <Form.Group>
                                <Form.Label className='mt-3'>Expiration</Form.Label>
                                <div className="input-group mb-3">
                                  <Form.Control type="number" className="form-control"
                                    placeholder="MM" name="Month" />
                                  <Form.Control type="number" className="form-control"
                                    placeholder="YY" name="Year" />
                                </div>
                              </Form.Group>
                            </Col>
                            <Col sm={4}>
                              <Form.Group>
                                <Form.Label className='mt-3'>CVV
                                  <span className="form-help m-0 ms-1" data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Don't Share your CVV with others">? </span>

                                </Form.Label>
                                <Form.Control type="number" className="form-control" />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Button href="#" className="btn mt-6" variant='primary'>Confirm</Button>

                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="second">
                        <div className="tab-pane" id="tab21">
                          <p>Paypal is easiest way to pay online</p>
                          <p>
                            <Link to="#" className="btn btn-primary">
                              <i className="fa fa-paypal"></i> Log in my Paypal
                            </Link>
                          </p>
                          <p className="mb-0">
                            <strong>Note:</strong> Nemo enim ipsam voluptatem quia
                            voluptas sit aspernatur aut odit aut fugit, sed quia
                            consequuntur magni dolores eos qui ratione voluptatem
                            sequi nesciunt.
                          </p>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="third">
                        <div className="tab-pane" id="tab22">
                          <p>Bank account details</p>
                          <dl className="card-text">
                            <dt>BANK: </dt>
                            <dd> THE UNION BANK 0456</dd>
                          </dl>
                          <dl className="card-text">
                            <dt>Account Number: </dt>
                            <dd> 67542897653214</dd>
                          </dl>
                          <dl className="card-text">
                            <dt>IBAN: </dt>
                            <dd>543218769</dd>
                          </dl>
                          <p className="mb-0">
                            <strong>Note:</strong> Nemo enim ipsam voluptatem quia
                            voluptas sit aspernatur aut odit aut fugit, sed quia
                            consequuntur magni dolores eos qui ratione voluptatem
                            sequi nesciunt.
                          </p>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <Row>
        <Col md={12} xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>Floating Labels Inputs, textarea </Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <div className="form-floating  mb-4">
                        <Form.Control type="email" className="form-control" id="floatingInput"
                          placeholder="Email" />
                        <Form.Label htmlFor="floatingInput">Email address</Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="form-floating  mb-4">
                        <Form.Control type="password" className="form-control"
                          id="floatingPassword" placeholder="Password" />
                        <Form.Label htmlFor="floatingPassword">Password</Form.Label>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <div className="form-floating floating-label mb-4">
                        <textarea className="form-control" placeholder="review"
                          id="floatingTextarea"></textarea>
                        <Form.Label htmlFor="floatingTextarea">Reviews</Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="form-floating floating-label1 mb-4">
                        <textarea className="form-control" placeholder="Comments"
                          id="floatingTextarea2" style={{ height: "100px" }}></textarea>
                        <Form.Label htmlFor="floatingTextarea2">Comments</Form.Label>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
};

export default FormLayouts;
