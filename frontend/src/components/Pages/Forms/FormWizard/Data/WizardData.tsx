import React, {Children, Component, Fragment, useState } from "react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from '@mui/material/StepLabel';
import Box from "@mui/material/Box";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import validator from "validator";
import { Button, Card, Col, Form, ListGroup, Form as ReactForm, Row } from "react-bootstrap";

export function BasicWizard() {

    //Basic Form wizard

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address format")
            .required("Email is required"),
        password: Yup.string()
            .min(3, "Password must be 3 characters at minimum")
            .required("Password is required"),
    });

    return (
        <div>
            <div className="row">
                <div className="col-lg-12">
                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={LoginSchema}
                        onSubmit={(values) => {
                            console.log(values);
                            alert("Form is validated! Submitting the form...");
                        }}
                    >
                        {({ touched, errors, isSubmitting, values }) =>
                            !isSubmitting ? (
                                <div>
                                    <Form>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <Field
                                                type="email"
                                                name="email"
                                                placeholder="Enter email"
                                                autoComplete="off"
                                                className={`mt-2 form-control
                          ${touched.email && errors.email ? "is-invalid" : ""}`}
                                            />

                                            <ErrorMessage
                                                component="div"
                                                name="email"
                                                className="invalid-feedback"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password" className="mt-3">
                                                Password
                                            </label>
                                            <Field
                                                type="password"
                                                name="password"
                                                placeholder="Enter password"
                                                className={`mt-2 form-control
                          ${touched.password && errors.password
                                                        ? "is-invalid"
                                                        : ""
                                                    }`}
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="password"
                                                className="invalid-feedback"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary mt-4"
                                        >
                                            Submit
                                        </button>
                                    </Form>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="p-3 mt-5">Resistration Successfully completed</h3>

                                    <div className="alert alert-success mt-3">
                                        Thank you for your connecting with us. Here's we got the authentication details from
                                        you !
                                    </div>
                                    <ul className="list-group">
                                        <li className="list-group-item"><b>Email ID:</b>&nbsp;&nbsp;{values.email}</li>
                                        <li className="list-group-item">
                                            <b>Password:</b>&nbsp;&nbsp;{values.password}
                                        </li>
                                    </ul>
                                </div>
                            )
                        }
                    </Formik>
                </div>
            </div>
        </div>
    )
}

//vertical wizard

const data = [
    {
        label: "Personal Information",
        description: (
            <span>
                <span className="control-group form-group">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control required mb-3"
                        placeholder="Name"
                    />
                </span>
                <span className="control-group form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control required mb-3"
                        placeholder="Email Address"
                    />
                </span>
                <span className="control-group form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="number"
                        className="form-control required mb-3"
                        placeholder="Number"
                    />
                </span>
                <span className="control-group form-group mb-0">
                    <label className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control required mb-3"
                        placeholder="Address"
                    />
                </span>
            </span>
        ),
    },
    {
        label: "Billing Information",
        description: (
            <span>
                <span className="table-responsive mg-t-20">
                    <span className="table">
                        <span>
                            <span className="row valid border">
                                <span className="col-sm-6 text-dark boder-right">Cart Subtotal</span>
                                <span className="text-end col-sm-6 text-dark">$792.00</span>
                            </span>

                            <span className="row border border-bottom-0 border-top-0">
                                <span className="col-sm-6  boder-right">
                                    <span className="text-dark ">Totals</span>
                                </span>
                                <span className="col-sm-6 text-end text-muted">
                                    <span>$792.00</span>
                                </span>
                            </span>
                            <span className="row border">
                                <span className="col-sm-6  boder-right">
                                    <span className="text-dark">Order Total</span>
                                </span>

                                <span className="col-sm-6 price text-end text-dark mb-0">
                                    $792.00

                                </span>
                            </span>
                        </span>
                    </span>
                </span>
            </span>
        ),
    },
    {
        label: "Payment Details ",
        description: (
            <span>
                <span className="form-group">
                    <label className="form-label">Card Holder Name</label>
                    <input
                        type="text"
                        className="form-control mb-3"
                        id="name12"
                        placeholder="First Name"
                    />
                </span>
                <span className="form-group">
                    <label className="form-label">Card number</label>
                    <span className="input-group">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search for..."
                        />
                        <a className="btn btn-info mb-3">
                            <i className="fa fa-cc-visa"></i> &nbsp;
                            <i className="fa fa-cc-amex"></i> &nbsp;
                            <i className="fa fa-cc-mastercard"></i>
                        </a>
                    </span>
                </span>
                <span className="row">
                    <span className="col-sm-8">
                        <span className="form-group mb-sm-0">
                            <label className="form-label">Expiration</label>
                            <span className="input-group">
                                <input
                                    type="number"
                                    className="form-control mb-3"
                                    placeholder="MM"
                                    name="expiremonth"
                                />
                                <input
                                    type="number"
                                    className="form-control mb-3"
                                    placeholder="YY"
                                    name="expireyear"
                                />
                            </span>
                        </span>
                    </span>
                    <span className="col-sm-4 ">
                        <span className="form-group mb-0">
                            <label className="form-label">
                                CVV <i className="fa fa-question-circle"></i>
                            </label>
                            <input type="number" className="form-control" required />
                        </span>
                    </span>
                </span>
            </span>
        ),
    },
];

export function VerticalWizard() {

    // Accordion Form wizard

    const [activeStep, setActiveStep] = useState<any>(0);

    const handleNext: any = () => {
        setActiveStep((prevActiveStep: any) => prevActiveStep + 1);
    };

    const handleBack: any = () => {
        setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
    };

    const handleReset: any = () => {
        setActiveStep(0);
    };

}

//Wizard Form Validation

function Name({ nextStep, handleFormData, values }) {
    const [error, setError] = useState(false);
    const submitFormData = (e) => {
        e.preventDefault();
        if (
            validator.isEmpty(values.firstName) ||
            validator.isEmpty(values.lastName)
        ) {
            setError(true);
        } else {
            nextStep();
        }
    };

    return (
        <div>
            <ReactForm onSubmit={submitFormData}>
                <ReactForm.Group className="">
                    <ReactForm.Label>First Name</ReactForm.Label>
                    <ReactForm.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        name="firstName"
                        defaultValue={values.firstName}
                        type="text"
                        placeholder="First Name"
                        onChange={handleFormData("firstName")}
                    />
                    {error ? (
                        <ReactForm.Text style={{ color: "red" }}>
                            This is a required field
                        </ReactForm.Text>
                    ) : (
                        ""
                    )}
                </ReactForm.Group>
                <ReactForm.Group className="">
                    <ReactForm.Label>Last Name</ReactForm.Label>
                    <ReactForm.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        name="lastName"
                        defaultValue={values.lastName}
                        type="text"
                        placeholder="Last Name"
                        onChange={handleFormData("lastName")}
                    />
                    {error ? (
                        <ReactForm.Text style={{ color: "red" }}>
                            This is a required field
                        </ReactForm.Text>
                    ) : (
                        ""
                    )}
                </ReactForm.Group>
                <Button type="submit">
                    Continue
                </Button>
            </ReactForm>
        </div>
    );
}
function StepTwo({ nextStep, handleFormData, prevStep, values }) {

    const [error, setError] = useState(false);


    const submitFormData = (e) => {
        e.preventDefault();


        if (validator.isEmpty(values.age) || validator.isEmpty(values.email)) {
            setError(true);
        } else {
            nextStep();
        }
    };
    return (
        <div>
            <ReactForm onSubmit={submitFormData}>
                <ReactForm.Group className="mb-3">
                    <ReactForm.Label>Age</ReactForm.Label>
                    <ReactForm.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        type="number"
                        placeholder="Age"
                        onChange={handleFormData("age")}
                    />
                    {error ? (
                        <ReactForm.Text style={{ color: "red" }}>
                            This is a required field
                        </ReactForm.Text>
                    ) : (
                        ""
                    )}
                </ReactForm.Group>
                <ReactForm.Group className="mb-3">
                    <ReactForm.Label>Email</ReactForm.Label>
                    <ReactForm.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        type="email"
                        placeholder="email"
                        onChange={handleFormData("email")}
                    />
                    {error ? (
                        <ReactForm.Text style={{ color: "red" }}>
                            This is a required field
                        </ReactForm.Text>
                    ) : (
                        ""
                    )}
                </ReactForm.Group>
                <div >
                    <Button className="float-start" onClick={prevStep}>
                        Previous
                    </Button>

                    <Button className="float-end" type="submit">
                        Submit
                    </Button>
                </div>
            </ReactForm>
        </div>
    );
};
function Final({ values }) {


    const { firstName, lastName, age, email } = values;
    return (

        <div style={{ textAlign: "left" }}>
            <div>
                <p>
                    <strong>First Name :</strong> {firstName}
                </p>
                <p>
                    <strong>Last Name :</strong> {lastName}
                </p>
                <p>
                    <strong>Age :</strong> {age}
                </p>
                <p>
                    <strong>Email :</strong> {email}
                </p>
            </div>
        </div>

    );
};
export function WizardForm() {
    const [step, setstep] = useState(1);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        email: ""
    })
    const nextStep = () => {
        setstep(step + 1);
    };
    const prevStep = () => {
        setstep(step - 1);
    };
    const handleInputData = input => e => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [input]: value
        }));
    }
    switch (step) {
        case 1:
            return (

                <div className="custom-margin">
                    <Name nextStep={nextStep} handleFormData={handleInputData} values={formData} />
                </div>
            );

        default:
            return (

                <div className="custom-margin">
                    <StepTwo nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
                </div>
            );

        case 3:
            return (
                <div className="">
                    <div className="custom-margin">
                        <Final values={formData} />
                    </div>
                </div>


            );


    }
}
// Accordion-Wizard-Form

const steps = [{
    label: "Name & Email",
    description: (
      <>
        <ListGroup>
          <ListGroup.Item>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" name="name" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control type="text" name="email" />
            </Form.Group>
          </ListGroup.Item>
        </ListGroup>
      </>
    ),
  },
  {
    label: "Contact",
    description: (
      <>
        <ListGroup>
          <ListGroup.Item>
            <Form.Group>
              <Form.Label>Telephone:</Form.Label>
              <Form.Control type="text" name="telephone" className="form-control" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mobile:</Form.Label>
              <Form.Control type="text" name="mobile" className="form-control" />
            </Form.Group>
          </ListGroup.Item>
        </ListGroup>
      </>
    ),
  },
  {
    label: "Payment",
    description: (
      <>
        <ListGroup>
          <ListGroup.Item>
            <Form.Group>
              <Form.Label>Credit card:</Form.Label>
              <Form.Control type="text" name="card" />
            </Form.Group>
            <Form.Group className="form-row">
              <Col sm={4}>
                <Form.Label>Expiry:</Form.Label>
                <Form.Control type="text" name="expiry" />
              </Col>
              <Col sm={4}>
                <Form.Label>CVV:</Form.Label>
                <Form.Control type="text" name="cvv" />
              </Col>
            </Form.Group>
          </ListGroup.Item>
        </ListGroup>
      </>
    ),
  },];
  
  export  function BasicFormWizard() {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const isStepOptional = (step) => {
      return step === 1;
    };
    const isStepSkipped = (step) => {
      return skipped.has(step);
    };
    const handleNext = () => {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    };
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleSkip = () => {
      if (!isStepOptional(activeStep)) {
        throw new Error("You can't skip a step that isn't optional.");
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped((prevSkipped) => {
        const newSkipped = new Set(prevSkipped.values());
        newSkipped.add(activeStep);
        return newSkipped;
      });
    };
    const handleReset = () => {
      setActiveStep(0);
    };
  
    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            const stepProps = {}
            // const labelProps: { optional?: ReactNode } = {}
            if (isStepOptional(index)) { }
            if (isStepSkipped(index)) {
            //   stepProps.completed = false
            }
            return (
              <Step key={label.label} {...stepProps}>
                {/* <StepLabel optional={
                  index === 2 ? <Typography variant="caption"></Typography> : null
                }>{label.label}</StepLabel> */}
                <StepContent>
                  {label.description}
                  <Fragment>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button onClick={handleReset}>Reset</Button>
                    </Box>
                  </Fragment>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        <Fragment>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button
              color="primary"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <div style={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button className="me-1" color="inherit" onClick={handleSkip}>
                Skip
              </Button>
            )}
            <Button className='ms-auto mt-1' color='primary' onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'SUBMIT' : 'Next'}
            </Button>
          </div>
        </Fragment>
  
      </Box>
    );
  }

const steps1 = ['Login', 'New User', 'End'];

 export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps1.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            // labelProps.optional = (
            //   <Typography variant="caption">Optional</Typography>
            // );
            
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
            
          }
          return (
            <Step key={Math.random()} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
          
        })}
        
      </Stepper>
      
      
      {activeStep === steps1.length ? (
        
        <React.Fragment>
           
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}> Step{activeStep +1}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              style={{ marginRight: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button className="me-2" color="inherit" onClick={handleSkip} style={{ marginRight: 1 }}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext}>
              {activeStep === steps1.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}




