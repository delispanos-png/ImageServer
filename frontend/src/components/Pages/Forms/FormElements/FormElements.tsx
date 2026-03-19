import React, { FC, Fragment, useState } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row, Form, Dropdown, Button, Placeholder, Tabs, Tab, InputGroup, Nav } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import { options, options1, options2, options3, options4, options5, options6, options7 } from './Data/FormelementData';
import Select from 'react-select';
import { Link } from 'react-router-dom';
interface FormElementsProps { }
const FormElements: FC<FormElementsProps> = () => {
  return (
    <Fragment>
      <PageHeader title="Form Elements" />
      <Row>
        <Col lg={12} md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Inputs & Textareas </Card.Title>
            </Card.Header>
            <Card.Body className="pb-2">
              <Row className="row-sm">
                <Col className="col-lg">
                  <Form.Control className="form-control mb-4" placeholder="Input box" type="text" />
                </Col>
                <div className="col-lg mg-t-10 mg-lg-t-0">
                  <Form.Control className="form-control mb-4" placeholder="Input box (readonly)"
                    type="text" disabled/>
                </div>
                <div className="col-lg mg-t-10 mg-lg-t-0">
                  <Form.Control className="form-control mb-4"
                    placeholder="Input box (disabled)" type="text" disabled />
                </div>
              </Row>
              <Row className="row-sm">
                <Col className="col-lg">
                  <textarea
                    className="form-control mb-4"
                    placeholder="Textarea"
                    rows={3}
                  ></textarea>
                </Col>
                <Col className="col-lg mg-t-10">
                  <textarea
                    className="form-control mb-4"
                    placeholder="Textarea (readOnly)"
                    readOnly
                    rows={3}
                  ></textarea>
                </Col>
                <Col className="col-lg mg-t-10">
                  <textarea
                    className="form-control mb-4"
                    disabled
                    placeholder="Texarea (disabled)"
                    rows={3}
                  ></textarea>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>Input Sizes</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row className="row-sm">
                <Col className="col-lg">
                  <Form.Control className="form-control form-control-sm  mb-4"
                    placeholder="Input sm box" type="text" />
                  <Form.Control className="form-control  mb-4" placeholder="Input box" type="text" />
                  <Form.Control className="form-control form-control-lg" placeholder="Input lg box"
                    type="text" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Valid Inputs</Card.Title>
            </Card.Header>
            <Card.Body className="pb-2">
              <Form className="needs-validation was-validated">
                <Row className="row-sm">
                  <div className="col-lg-6">
                    <Form.Group>
                      <input
                        className="form-control  mb-4 is-valid state-valid"
                        placeholder="Input box (success state)"
                        required
                        type="text"
                        defaultValue="This is input"
                      />
                      <textarea
                        className="form-control mb-4 is-valid state-valid"
                        placeholder="Textarea (success state)"
                        required
                        rows={3}
                        defaultValue="This is textarea"
                      ></textarea>
                    </Form.Group>
                  </div>
                  <div className="col-lg-6">
                    <Form.Group>
                      <input
                        className="form-control mb-4 is-invalid state-invalid"
                        placeholder="Input box (invalid state)"
                        required
                        type="text"
                      />
                      <textarea
                        className="form-control mb-4 is-invalid state-invalid"
                        placeholder="Textarea (invalid state)"
                        required
                        rows={3}
                      ></textarea>
                    </Form.Group>
                  </div>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12} md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Form elements</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label className="form-label">Country</Form.Label>
                <Select className="farm" options={options} classNamePrefix='Select2' placeholder="poland" />
              </Form.Group>
              <Form.Group>
                <Form.Label className="form-label mt-2">Input group</Form.Label>
                <InputGroup>
                  <Form.Control type="text" id="InputGroup" placeholder="Search for..." />
                  <Button className="btn" variant='primary' type="button">Go!</Button>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label className="form-label" >Input group buttons</Form.Label>
                <InputGroup>
                  <Form.Control type="text" id="InputGroup" />
                  <Dropdown>
                    <Button type="button"  variant='primary'>Action</Button>

                    <Dropdown.Toggle as="a"
                      className="btn btn-primary  No-caret"></Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-start">
                      <Dropdown.Item>News</Dropdown.Item>
                      <Dropdown.Item>Messages</Dropdown.Item>
                      <div className="dropdown-divider"></div>
                      <Dropdown.Item>Edit
                        Profile</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label className="form-label " id="InputGroup">Separated inputs</Form.Label>
                <div className="row g-xs">
                  <InputGroup>
                    <Form.Control type="text" placeholder="Search for..." />
                    <Button variant='primary' type="button"><i
                      className="fe fe-search"></i></Button>
                  </InputGroup>
                </div>
              </Form.Group>
              <Form.Group>
                <div className="input-icon mt-2">
                  <span className="input-icon-addon text-primary">
                    <i className="fe fe-user fs-14"></i>
                  </span>
                  <Form.Control type="text" placeholder="Username" />
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label className="mt-2">ZIP Code</Form.Label>
                <div className="row g-sm">
                  <InputGroup>
                    <Form.Control type="text" placeholder="Search for..." />
                    <span>
                      <span className="form-help" data-bs-toggle="tooltip"
                        data-bs-placement="top" title="ZIP Code must be US or CDN format. You can use an extrighted ZIP+4 code to determine address more accurately.
                    USP ZIP codes lookup tools
                    ">?
                      </span>
                    </span>
                  </InputGroup>
                </div>
              </Form.Group>
              <Form.Group className="form-group m-0">
                <Form.Label className="form-label mt-2">Date of birth</Form.Label>
                <div className="row g-xs input-group">
                  <div className="col-sm-5">
                    <Select className="farms mb-1" classNamePrefix='Select2' options={options1} placeholder="June" />
                  </div>
                  <Col sm={3} mb={2} className='mt-2'>
                    <Select options={options2} classNamePrefix='Select2' placeholder="20" />
                  </Col>
                  <Col sm={4} mb={2} className='mt-2'>
                    <Select options={options3} classNamePrefix='Select2' placeholder="1989" />
                  </Col>
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title>General Elements</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={6} md={12}>
                  <Form className="form-horizontal">
                    <Form.Group className="form-group row">
                      <Form.Label className="col-md-3 form-label">Text</Form.Label>
                      <Col md={9}>
                        <Form.Control type="text" defaultValue="Typing....." />
                      </Col>
                    </Form.Group>
                    <Form.Group className="form-group row">
                      <Form.Label className="col-md-3 form-label"
                        htmlFor="example-email">Email</Form.Label>
                      <Col md={9}>
                        <Form.Control type="email" id="example-email" name="example-email"
                          placeholder="Email" />
                      </Col>
                    </Form.Group>
                    <Form.Group className="form-group row">
                      <Form.Label className="col-md-3 form-label">Password</Form.Label>
                      <div className="col-md-9">
                        <Form.Control type="password"
                          defaultValue="password" />
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group row">
                      <Form.Label className="col-md-3 form-label">Placeholder</Form.Label>
                      <Col md={9}>
                        <Form.Control type="text" placeholder="text" />
                      </Col>
                    </Form.Group>
                    <Form.Group className="form-group row">
                      <Form.Label className="col-md-3 form-label">Readonly</Form.Label>
                      <Col md={9}>
                        <Form.Control type="text"
                          defaultValue="Readonly value" />
                      </Col>
                    </Form.Group>
                    <Form.Group className="form-group row">
                      <Form.Label className="col-md-3 form-label">Disabled</Form.Label>
                      <Col md={9}>
                        <Form.Control type="text"
                          defaultValue="Disabled value" disabled/>
                      </Col>
                    </Form.Group>

                    <Form.Group className="form-group row">
                      <Form.Label className="col-md-3 form-label">Number</Form.Label>
                      <Col md={9}>
                        <Form.Control type="number" name="number" />
                      </Col>
                    </Form.Group>
                  </Form>
                </Col>
                <Col lg={6} md={12}>
                  <form className="form-horizontal">
                    <Form.Group className="form-group row">
                      <Form.Label className="col-md-3 form-label">Name</Form.Label>
                      <div className="col-md-9">
                        <Form.Control type="text" name="name" />
                      </div>
                    </Form.Group>
                    <Form.Group className="row form-group">
                      <Form.Label className="col-md-3 form-label">Text area</Form.Label>
                      <Col md={9}>
                      <Form.Control  as='textarea' rows={4} className="" defaultValue="Hii....."/>
                      </Col>
                    </Form.Group>
                    <Form.Group className="row form-group">
                      <Form.Label className="col-md-3 form-label">URL</Form.Label>
                      <Col md={9}>
                        <Form.Control type="url" name="url" />
                      </Col>
                    </Form.Group>
                    <Form.Group className="row form-group">
                      <Form.Label className="col-md-3 form-label">Search</Form.Label>
                      <Col md={9}>
                        <Form.Control type="search" name="search" />
                      </Col>
                    </Form.Group>
                    <Form.Group className="row form-group">
                      <Form.Label className="col-md-3 form-label">Tel</Form.Label>
                      <Col md={9}>
                        <Form.Control type="tel" name="tel" />
                      </Col>
                    </Form.Group>
                    <Form.Group className="row mb-0">
                      <Form.Label className="col-md-3 form-label">Input Select</Form.Label>
                      <Col md={9}>
                        <Select options={options4} placeholder="Apple" classNamePrefix='Select2' />
                      </Col>
                    </Form.Group>
                  </form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12}>
          <Card className="card">
            <Card.Header>
              <Card.Title>form elements</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} lg={6}>
                  <Form.Group>
                    <Form.Label>Toggle switch single</Form.Label>
                    <Form.Label className="custom-switch">
                      <Form.Control type="checkbox" name="custom-switch-checkbox"
                        className="custom-switch-input" />
                      <span className="custom-switch-indicator"></span>
                      <span className="custom-switch-description">I agree with terms and
                        conditions</span>
                    </Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Your skills</Form.Label>
                    <div className="selectgroup selectgroup-pills">
                      <label className="selectgroup-item">
                        <Form.Control type="checkbox" name="value" defaultValue="HTML"
                          className="selectgroup-input" defaultChecked/>
                        <span className="selectgroup-button">HTML</span>
                      </label>
                      <label className="selectgroup-item">
                        <Form.Control type="checkbox" name="value" defaultValue="CSS"
                          className="selectgroup-input" />
                        <span className="selectgroup-button">CSS</span>
                      </label>
                      <label className="selectgroup-item">
                        <Form.Control type="checkbox" name="value" defaultValue="PHP"
                          className="selectgroup-input" />
                        <span className="selectgroup-button">PHP</span>
                      </label>
                      <label className="selectgroup-item">
                        <Form.Control type="checkbox" name="value" defaultValue="JavaScript"
                          className="selectgroup-input" />
                        <span className="selectgroup-button">JavaScript</span>
                      </label>
                      <label className="selectgroup-item">
                        <Form.Control type="checkbox" name="value" defaultValue="Angular"
                          className="selectgroup-input" />
                        <span className="selectgroup-button">Angular</span>
                      </label>
                      <label className="selectgroup-item">
                        <Form.Control type="checkbox" name="value" defaultValue="Java"
                          className="selectgroup-input" />
                        <span className="selectgroup-button">Java</span>
                      </label>
                      <label className="selectgroup-item">
                        <Form.Control type="checkbox" name="value" defaultValue="C++"
                          className="selectgroup-input" />
                        <span className="selectgroup-button">C++</span>
                      </label>
                    </div>
                  </Form.Group>
                  <Form.Group className="m-0">
                    <Form.Label>Select Color</Form.Label>
                    <div className="row g-xs">
                      <div className="col-auto">
                        <Form.Label className="colorinput">
                          <Form.Control name="color" type="checkbox" defaultValue="azure"
                            className="colorinput-input" defaultChecked />
                          <span className="colorinput-color bg-azure"></span>
                        </Form.Label>
                      </div>
                      <div className="col-auto">
                        <Form.Label className="colorinput">
                          <Form.Control name="color" type="checkbox" defaultValue="indigo"
                            className="colorinput-input" />
                          <span className="colorinput-color bg-indigo"></span>
                        </Form.Label>
                      </div>
                      <div className="col-auto">
                        <Form.Label className="colorinput">
                          <Form.Control name="color" type="checkbox" defaultValue="purple"
                            className="colorinput-input" />
                          <span className="colorinput-color bg-purple"></span>
                        </Form.Label>
                      </div>
                      <div className="col-auto">
                        <Form.Label className="colorinput">
                          <Form.Control name="color" type="checkbox" defaultValue="pink"
                            className="colorinput-input" />
                          <span className="colorinput-color bg-pink"></span>
                        </Form.Label>
                      </div>
                      <div className="col-auto">
                        <Form.Label className="colorinput">
                          <Form.Control name="color" type="checkbox" defaultValue="red"
                            className="colorinput-input" />
                          <span className="colorinput-color bg-red"></span>
                        </Form.Label>
                      </div>
                      <div className="col-auto">
                        <Form.Label className="colorinput">
                          <Form.Control name="color" type="checkbox" defaultValue="orange"
                            className="colorinput-input" />
                          <span className="colorinput-color bg-orange"></span>
                        </Form.Label>
                      </div>
                      <div className="col-auto">
                        <Form.Label className="colorinput">
                          <Form.Control name="color" type="checkbox" defaultValue="yellow"
                            className="colorinput-input" />
                          <span className="colorinput-color bg-yellow"></span>
                        </Form.Label>
                      </div>
                      <div className="col-auto">
                        <Form.Label className="colorinput">
                          <Form.Control name="color" type="checkbox" defaultValue="lime"
                            className="colorinput-input" />
                          <span className="colorinput-color bg-lime"></span>
                        </Form.Label>
                      </div>
                      <div className="col-auto">
                        <Form.Label className="colorinput">
                          <Form.Control name="color" type="checkbox" defaultValue="green"
                            className="colorinput-input" />
                          <span className="colorinput-color bg-green"></span>
                        </Form.Label>
                      </div>
                      <div className="col-auto">
                        <Form.Label className="colorinput">
                          <Form.Control name="color" type="checkbox" defaultValue="teal"
                            className="colorinput-input" />
                          <span className="colorinput-color bg-teal"></span>
                        </Form.Label>
                      </div>
                    </div>
                  </Form.Group>
                </Col>
                <div className="col-md-6 col-lg-6">
												<div className="form-group ">
													<div className="form-label">Radios</div>
													<div className="custom-controls-stacked">
														<label className="custom-control custom-radio">
															<input type="radio" className="custom-control-input"
																name="example-radios" value="option1" defaultChecked/>
															<span className="custom-control-label">Option 1</span>
														</label>
														<label className="custom-control custom-radio">
															<input type="radio" className="custom-control-input"
																name="example-radios" value="option2"/>
															<span className="custom-control-label">Option 2</span>
														</label>
														<label className="custom-control custom-radio">
															<input type="radio" className="custom-control-input"
																name="example-radios" value="option3" disabled/>
															<span className="custom-control-label">Option Disabled</span>
														</label>
														<label className="custom-control custom-radio">
															<input type="radio" className="custom-control-input"
																name="example-radios2" value="option4" disabled defaultChecked/>
															<span className="custom-control-label">Option Disabled
																Checked</span>
														</label>
													</div>
												</div>

												<div className="form-group m-0">
													<div className="form-label">Checkboxes</div>
													<div className="custom-controls-stacked">
														<label className="custom-control custom-checkbox">
															<input type="checkbox" className="custom-control-input"
																name="example-checkbox1" value="option1" defaultChecked/>
															<span className="custom-control-label">Option 1</span>
														</label>
														<label className="custom-control custom-checkbox">
															<input type="checkbox" className="custom-control-input"
																name="example-checkbox2" value="option2"/>
															<span className="custom-control-label">Option 2</span>
														</label>
														<label className="custom-control custom-checkbox">
															<input type="checkbox" className="custom-control-input"
																name="example-checkbox3" value="option3" defaultChecked/>
															<span className="custom-control-label">Option Disabled</span>
														</label>
														<label className="custom-control custom-checkbox">
															<input type="checkbox" className="custom-control-input"
																name="example-checkbox4" value="option4" defaultChecked
																disabled/>
															<span className="custom-control-label">Option Disabled
																Checked</span>
														</label>
													</div>
												</div>
											</div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Switches </div>
            </div>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item">
                  Bootstrap Switch Default
                  <div className="material-switch pull-right">
                    <Form.Control id="someSwitchOptionDefault" name="someSwitchOption001"
                      type="checkbox" />
                    <Form.Label htmlFor="someSwitchOptionDefault" className="label-default"></Form.Label>
                  </div>
                </li>
                <li className="list-group-item">
                  Bootstrap Switch Primary
                  <div className="material-switch pull-right">
                    <Form.Control id="someSwitchOptionPrimary" name="someSwitchOption001"
                      type="checkbox" />
                    <Form.Label htmlFor="someSwitchOptionPrimary" className="label-primary"></Form.Label>
                  </div>
                </li>
                <li className="list-group-item">
                  Bootstrap Switch Success
                  <div className="material-switch pull-right">
                    <Form.Control id="someSwitchOptionSuccess" name="someSwitchOption001"
                      type="checkbox" />
                    <Form.Label htmlFor="someSwitchOptionSuccess" className="label-success"></Form.Label>
                  </div>
                </li>
                <li className="list-group-item">
                  Bootstrap Switch Info
                  <div className="material-switch pull-right">
                    <Form.Control id="someSwitchOptionInfo" name="someSwitchOption001"
                      type="checkbox" />
                    <Form.Label htmlFor="someSwitchOptionInfo" className="label-info"></Form.Label>
                  </div>
                </li>
                <li className="list-group-item">
                  Bootstrap Switch Warning
                  <div className="material-switch pull-right">
                    <Form.Control id="someSwitchOptionWarning" name="someSwitchOption001"
                      type="checkbox" />
                    <Form.Label htmlFor="someSwitchOptionWarning" className="label-warning"></Form.Label>
                  </div>
                </li>
                <li className="list-group-item">
                  Bootstrap Switch Danger
                  <div className="material-switch pull-right">
                    <Form.Control id="someSwitchOptionDanger" name="someSwitchOption001"
                      type="checkbox" />
                    <Form.Label htmlFor="someSwitchOptionDanger" className="label-danger"></Form.Label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <Col lg={12} xl={6} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title>Vertical Form</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <div>
                  <Form.Group className=''>
                    <Form.Label htmlFor="exampleInputEmail1" className="form-label mt-2">Email
                      address</Form.Label>
                    <Form.Control type="email" id="exampleInputEmail1"
                      placeholder="Enter email" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="exampleInputPassword1"
                      className="form-label mt-3">Password</Form.Label>
                    <Form.Control type="password"
                      id="exampleInputPassword1" placeholder="Password" />
                  </Form.Group>
                  <Form.Check className='mt-5' type="checkbox" label="Check me out" />
                </div>
                <Button type="submit" className="btn btn-primary mt-4 mb-0">Submit</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12} xl={6} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title>Horizontal Form</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form className="form-horizontal">
                <Form.Group className="form-group row">
                  <Form.Label htmlFor="inputName" className="col-md-3 form-label">User Name</Form.Label>
                  <Col md={9}>
                    <Form.Control type="text" id="inputName"
                      placeholder="Name" />
                  </Col>
                </Form.Group>
                <Form.Group className="form-group row">
                  <Form.Label htmlFor="inputEmail3" className="col-md-3 form-label">Email</Form.Label>
                  <Col md={9}>
                    <Form.Control type="email" id="inputEmail3"
                      placeholder="Email" />
                  </Col>
                </Form.Group>
                <Form.Group className="form-group row">
                  <Form.Label htmlFor="inputPassword3" className="col-md-3 form-label">Password</Form.Label>
                  <Col md={9}>
                    <Form.Control type="password" id="inputPassword3"
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
        <Col md={12} lg={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Shipping Details</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="form-row">
                <div className="form-group col-md-6 mb-0">
                  <div className="form-group">
                    <Form.Control type="text" id="name1"
                      placeholder="First Name" />
                  </div>
                </div>
                <div className="form-group col-md-6 mb-0">
                  <div className="form-group">
                    <Form.Control type="text" id="name2"
                      placeholder="Last Name" />
                  </div>
                </div>
              </div>
              <div className="form-group ">
                <Form.Control type="email" id="inputEmail5"
                  placeholder="Email Address" />
              </div>
              <div className="form-group ">
                <Form.Control type="text" id="address"
                  placeholder="AddressLine1" />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6 mb-0">
                  <div className="form-group">
                    <Form.Control type="text" id="country"
                      placeholder="Country" />
                  </div>
                </div>
                <div className="form-group col-md-6 mb-0">
                  <div className="form-group">
                    <Form.Control type="text" id="region"
                      placeholder="Country/Region" />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6 mb-0">
                  <div className="form-group">
                    <Form.Control type="text" id="city"
                      placeholder="City" />
                  </div>
                </div>
                <div className="form-group col-md-6 mb-0">
                  <div className="form-group">
                    <Form.Control type="number" id="postal"
                      placeholder="Zip/Postal" />
                  </div>
                </div>
              </div>
              <div className="form-footer mt-2">
                <a href="#" className="btn btn-primary">Confirm Details</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} lg={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">CheckOut</Card.Title>
              <div className="card-options">
                <Dropdown className="btn-group">
                  <Dropdown.Toggle
                    className="btn btn-primary dropdown-toggle"
                    aria-expanded="false"
                  >
                    Visa<span className="caret"></span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu">
                    <Dropdown.Item>
                      <Link to="#">Visa</Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link to="#">Rupay</Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link to="#">Mastercard</Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link to="#">PayPal</Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

              </div>
            </Card.Header>
            <Card.Body>
              <Form>
                <div className="form-group">
                  <div className="form-group">
                    <Form.Label className="form-label">CardHolder Name</Form.Label>
                    <Form.Control type="text" id="name11"
                      placeholder="First Name" />
                  </div>
                </div>
              </Form>
              <div className="form-row">
                <div className="form-group col-md-9 col-lg-8 mb-0">
                  <div className="form-group">
                    <Form.Label className="form-label">Credit card Number</Form.Label>
                    <Form.Control type="number" id="number"
                      placeholder="number" />
                  </div>
                </div>
                <div className="form-group col-md-3 col-lg-4 mb-0">
                  <div className="form-group">
                    <Form.Label className="form-label">CVV Number</Form.Label>
                    <Form.Control type="number" id="region1"
                      placeholder="675" />
                  </div>
                </div>
              </div>
              <Form.Group className="form-group m-0">
                <Form.Label className="form-label">Expiration Date</Form.Label>
                <Row className="row g-xs">
                  <Col className="col-6">
                    <Select classNamePrefix='Select2' options={options5} placeholder="January" />
                  </Col>
                  <Col className="col-6">
                    <Select classNamePrefix='Select2' options={options6} placeholder="2040" />
                  </Col>
                </Row>
              </Form.Group>
              <div className="mt-4 mb-0 ">
                Your Credit card information is encrypted
              </div>
              <div className="form-footer mt-2">
                <Button href="#" className="btn" variant='primary'>Make Payment</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Billing Information</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={6} md={6}>
                  <Form.Group>
                    <Form.Label>First Name <span
                      className="text-red">*</span></Form.Label>
                    <Form.Control type="text" placeholder="First name" />
                  </Form.Group>
                </Col>
                <Col sm={6} md={6}>
                  <Form.Group>
                    <Form.Label>Last Name <span
                      className="text-red">*</span></Form.Label>
                    <Form.Control type="text" placeholder="Last name" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className='mt-2'>Company Name <span
                      className="text-red">*</span></Form.Label>
                    <Form.Control type="text" placeholder="Company name" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className='mt-2'>Email address <span
                      className="text-red">*</span></Form.Label>
                    <Form.Control type="email" placeholder="Email" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className='mt-2'>Country <span
                      className="text-red">*</span></Form.Label>
                    <Select classNamePrefix='Select2' options={options7} placeholder="--Select--" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className='mt-2'>Address <span
                      className="text-red">*</span></Form.Label>
                    <Form.Control type="text" placeholder="Home Address" />
                  </Form.Group>
                </Col>
                <Col sm={6} md={6}>
                  <Form.Group>
                    <Form.Label className='mt-2'>City <span
                      className="text-red">*</span></Form.Label>
                    <Form.Control type="text" placeholder="City" />
                  </Form.Group>
                </Col>
                <Col sm={6} md={6}>
                  <Form.Group>
                    <Form.Label className='mt-2'>Postal Code <span
                      className="text-red">*</span></Form.Label>
                    <Form.Control type="number" placeholder="ZIP Code" />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Payment Information</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="card-pay">
                <Tab.Container id="fill-tab-example" defaultActiveKey="first">

                  <Nav as='ul' variant="pills" className="tabs-menu nav mb-4">
                    <Nav.Item as='li' className=''>
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
                          <Form.Control type="text"
                            placeholder="First Name" />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label className="form-label mt-2">Card number</Form.Label>
                          <div className="input-group">
                            <Form.Control type="text" id="InputGroup"
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
                                <Form.Control type="number"
                                  placeholder="MM" name="Month" />
                                <Form.Control type="number"
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
                              <Form.Control type="number" />
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
    </Fragment>

  )
};

export default FormElements;
