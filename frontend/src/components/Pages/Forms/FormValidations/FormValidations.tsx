import React, { FC, Fragment, useState } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row, Form, Button, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { Formik } from 'formik';
import *as Yup from 'yup';

const schema = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  username: Yup.string().required(),
  city: Yup.string().required(),
  state: Yup.string().required(),
  zip: Yup.string().required(),
  file: Yup.mixed().required(),
  terms: Yup.bool().required().oneOf([true], 'terms must be accepted'),
});
interface FormValidationsProps { }

const FormValidations: FC<FormValidationsProps> = () => {
  //Custom Validations
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  //DefaultValidation

  const [validated1, setValidated1] = useState(false);
  const handleSubmit1 = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated1(true);
  };
  interface option {
    value: number
    label: string
  }
  const options: option[] = [
    { value: 1, label: 'Choose' },
    { value: 2, label: '...' },
  ]

  interface option1 {
    value: string
    label: string
  }
  const options1: option1[] = [
    { value: "One", label: "One" },
    { value: "Two", label: "Two" },
    { value: "Three", label: "Three" },
    { value: "Four", label: "Four" }
  ];


  return (

    <Fragment>
      <PageHeader title="Form Validations" />
      <Row>
        <Col lg={12} md={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">
                Custom Validation
              </Card.Title>
            </Card.Header>
            <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="First name"
                  defaultValue="Mark"
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Last name" />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                <Form.Label>Username</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    aria-describedby="inputGroupPrepend"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a username.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom03">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid city.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label>State</Form.Label>
                <Select classNamePrefix="Select2" options={options} placeholder="Choose"/>
                {/* <Form.Control type="text" placeholder="Choose" required /> */}
                <Form.Control.Feedback type="invalid">
                  Please provide a valid state.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustom05">
                <Form.Label>Zip</Form.Label>
                <Form.Control type="text" placeholder="" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid zip.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                required
                label="Agree to terms and conditions"
                feedback="You must agree before submitting."
                feedbackType="invalid"
              />
            </Form.Group>
            <Button type="submit">Submit form</Button>
          </Form>
          </Card.Body>
          </Card>
        </Col>

        <Col lg={12} md={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Default Validation</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form className="row g-3" noValidate={validated1} onSubmit={handleSubmit1}>
                <Col md={4}>
                  <Form.Label htmlFor="validationDefault01" className="form-label">First name</Form.Label>
                  <Form.Control type="text" className="form-control" id="validationDefault01"
                    defaultValue="Mark" required />
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="validationDefault02" className="form-label">Last name</Form.Label>
                  <Form.Control type="text" className="form-control" id="validationDefault02"
                    defaultValue="Otto" required />
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="validationDefaultUsername"
                    className="form-label">Username</Form.Label>
                  <InputGroup>
                    <span className="input-group-text" id="inputGroupPrepend2">@</span>
                    <Form.Control type="text" className="form-control"
                      id="validationDefaultUsername"
                      aria-describedby="inputGroupPrepend2" required />
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="validationDefault03" className="form-label">City</Form.Label>
                  <Form.Control type="text" className="form-control" id="validationDefault03"
                    required />
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="validationDefault04" className="form-label">State</Form.Label>
                  <Select classNamePrefix="Select2" options={options} placeholder="Choose"/>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="validationDefault05" className="form-label">Zip</Form.Label>
                  <Form.Control type="text" className="form-control" id="validationDefault05"
                    required />
                </Col>
                <div className="col-12">
                  <div className="form-check">
                    <Form.Check type="checkbox" label="Agree to terms and conditions" />
                  </div>
                </div>
                <div className="col-12">
                  <Button className="btn btn-primary" type="submit">Submit form</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12} md={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Server Side Validation</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form className="row g-3">
                <Col md={4}>
                  <Form.Label htmlFor="validationServer01" className="form-label">First name</Form.Label>
                  <Form.Control type="text" className="form-control is-valid" id="validationServer01"
                    defaultValue="Mark" required />
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="validationServer02" className="form-label">Last name</Form.Label>
                  <Form.Control type="text" className="form-control is-valid" id="validationServer02"
                    defaultValue="Otto" required />
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="validationServerUsername"
                    className="form-label">Username</Form.Label>
                  <div className="input-group has-validation">
                    <span className="input-group-text" id="inputGroupPrepend3">@</span>
                    <Form.Control type="text" className="form-control is-invalid"
                      id="validationServerUsername"
                      aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback"
                      required />
                    <div id="validationServerUsernameFeedback" className="invalid-feedback">
                      Please choose a username.
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="validationServer03" className="form-label">City</Form.Label>
                  <Form.Control type="text" className="form-control is-invalid"
                    id="validationServer03"
                    aria-describedby="validationServer03Feedback" required />
                  <div id="validationServer03Feedback" className="invalid-feedback">
                    Please provide a valid city.
                  </div>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="validationServer04" className="form-label">State</Form.Label>
                  <div id="validationServer04Feedback" className="invalid-feedback">
                    Please select a valid state.
                  </div>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="validationServer05" className="form-label">Zip</Form.Label>
                  <Form.Control type="text" className="form-control is-invalid"
                    id="validationServer05"
                    aria-describedby="validationServer05Feedback" required />
                  <div id="validationServer05Feedback" className="invalid-feedback">
                    Please provide a valid zip.
                  </div>
                </Col>
                <div className="col-12">
                  <div className="form-check">
                    <input className="form-check-input is-invalid" type="checkbox" value=""
                      id="invalidCheck3" aria-describedby="invalidCheck3Feedback"
                      required />
                    <label className="form-check-label" htmlFor="invalidCheck3">
                      Agree to terms and conditions
                    </label>
                    <div id="invalidCheck3Feedback" className="invalid-feedback">
                      You must agree before submitting.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <Button className="btn" variant="primary" type="submit">Submit form</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12} md={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Supported Elements</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form className="was-validated">
                <div className="mb-3">
                  <Form.Label htmlFor="validationTextarea" >Textarea</Form.Label>
                  <Form.Control as='textarea' className="" placeholder="Required example textarea" required isInvalid></Form.Control>
                  <Form.Control.Feedback type='invalid' className="">
                    Please enter a message in the textarea.
                  </Form.Control.Feedback>
                </div>
                <Form.Check
                  className="mb-3"
                  required
                  label="Check this checkbox"
                  feedback="Example invalid feedback text"
                  feedbackType="invalid"
                />
                <Form.Check
                  className=""
                  required
                  label="Toggle this radio"
                />
                <Form.Check
                  className="mb-3"
                  required
                  label="Or toggle this other radio"
                  feedback="More example invalid feedback text"
                  feedbackType="invalid"
                />
                <div className="mb-3">
                  <Select classNamePrefix="Select-sm Select2" options={options1} placeholder='Open this select menu' />
                  <Form.Control.Feedback className="">Example invalid select feedback</Form.Control.Feedback>
                </div>
                <Form.Control type="file" className="file-browser mb-5" multiple />
                <div className="mb-3">
                  <Button variant='primary' className="" disabled>Submit form</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <div className="col-lg-12 col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tooltips</h3>
            </div>
            <div className="card-body">
              <Formik
                validationSchema={schema}
                onSubmit={console.log}
                initialValues={{
                  firstName: 'Mark',
                  lastName: 'Otto',
                  username: '',
                  city: '',
                  state: '',
                  zip: '',
                  file: null,
                  terms: false,
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  touched,
                  isValid,
                  errors,
                }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationFormik101"
                        className="position-relative"
                      >
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                          isValid={touched.firstName && !errors.firstName}
                        />
                        <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationFormik102"
                        className="position-relative"
                      >
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={values.lastName}
                          onChange={handleChange}
                          isValid={touched.lastName && !errors.lastName}
                        />

                        <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col} md="4" controlId="validationFormikUsername2">
                        <Form.Label>Username</Form.Label>
                        <InputGroup hasValidation>
                          <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Username"
                            aria-describedby="inputGroupPrepend"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            isInvalid={!!errors.username}
                          />
                          <Form.Control.Feedback type="invalid" tooltip>
                            {errors.username}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationFormik103"
                        className="position-relative"
                      >
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="City"
                          name="city"
                          value={values.city}
                          onChange={handleChange}
                          isInvalid={!!errors.city}
                        />

                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.city}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="validationFormik104"
                        className="position-relative"
                      >
                        <Form.Label>State</Form.Label>
                  <Select classNamePrefix="Select2" options={options} placeholder="Choose...."/>

                        {/* <Form.Control
                          type="text"
                          placeholder="State"
                          name="state"
                          value={values.state}
                          onChange={handleChange}
                          isInvalid={!!errors.state}
                        /> */}
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.state}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="validationFormik105"
                        className="position-relative"
                      >
                        <Form.Label>Zip</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Zip"
                          name="zip"
                          value={values.zip}
                          onChange={handleChange}
                          isInvalid={!!errors.zip}
                        />

                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.zip}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Form.Group className="position-relative mb-3">
                      <Form.Label>File</Form.Label>
                      <Form.Control
                        type="file"
                        required
                        name="file"
                        onChange={handleChange}
                        isInvalid={!!errors.file}
                      />
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.file}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="position-relative mb-3">
                      <Form.Check
                        required
                        name="terms"
                        label="Agree to terms and conditions"
                        onChange={handleChange}
                        isInvalid={!!errors.terms}
                        feedback={errors.terms}
                        feedbackType="invalid"
                        id="validationFormik106"
                        feedbackTooltip
                      />
                    </Form.Group>
                    <Button type="submit">Submit form</Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </Row>
    </Fragment>
  )
};

export default FormValidations;
