import React, { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';

export const VerticalOrientationWizard = () => {
  const [goSteps, setGoSteps] = useState(0);

  const handleClick=()=>{
   alert('form submitted sucessfully !!')
  }

  return (
    <div className="">
      <Stepper activeStep={goSteps}>
        <Step onClick={() => setGoSteps(0)} />
        <Step onClick={() => setGoSteps(1)} />
        <Step onClick={() => setGoSteps(2)} />
      </Stepper>
      {goSteps === 0 && (
        <>
        <div className="row border" >
          <div className="col-xl-4 border-end">
          <span className="Stepperh3 d-flex p-4"><span className="number step3 m-01 me-2 active">1</span><span className="title " onClick={() => setGoSteps(0)}>Personal Information</span></span>
          <span className="Stepperh3 d-flex p-4"><span className="number step2 m-01 me-2">2</span><span className="title Step1 " onClick={() => setGoSteps(1)}>Billing Information</span></span>
          <span className="Stepperh3 d-flex p-4"><span className="number step2 m-01 me-2">3</span><span className="title Step1 " onClick={() => setGoSteps(2)}>Payment Details</span></span>
          </div>
          <div className="col-xl-8 p-4">
          <section>
            <div className="control-group form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-control required" placeholder="Name" />
            </div>
            <div className="control-group form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control required"
                placeholder="Email Address" />
            </div>
            <div className="control-group form-group">
              <label className="form-label">Phone Number</label>
              <input type="number" className="form-control required" placeholder="Number" />
            </div>
            <div className="control-group form-group mb-0">
              <label className="form-label">Address</label>
              <input type="text" className="form-control required" placeholder="Address" />
            </div>
           
          </section>
          </div>
          <div className="col-xl-4 border-end"></div>
        <div className="col-xl-8 p-4">
       <button
        className="btn btn-primary mt-2 float-end mt-4"
        onClick={() => setGoSteps(1)}
      >
        Next
      </button>
      <button
        className="btn btn-primary mt-2 float-start mt-4"
        onClick={() => setGoSteps(0)}
        disabled
      >
        Previous
      </button>
      </div>
        </div>
      </>
      )}
      {goSteps === 1 && (
        <div>
        <div className="row borders" >
          <div className="col-sm-4 border-right">
          <span className="Stepperh3 d-flex p-4"><span className="number step2 m-01 me-2">1</span><span className="title Step1" onClick={() => setGoSteps(0)}>Personal Information</span></span>
          <span className="Stepperh3 d-flex p-4"><span className="number step3 m-01 me-2 active">2</span><span className="title" onClick={() => setGoSteps(1)}>Billing Information </span></span>
          <span className="Stepperh3 d-flex p-4"><span className="number step2 m-01 me-2">3</span><span className="title Step1" onClick={() => setGoSteps(2)}>Payment Details</span></span>
          </div>
          <div className="col-sm-8 p-4">
          <section>
            <div className="table-responsive mg-t-20">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td>Cart Subtotal</td>
                    <td className="text-end">$792.00</td>
                  </tr>
                  <tr>
                    <td><span>Totals</span></td>
                    <td className="text-end text-muted"><span>$792.00</span></td>
                  </tr>
                  <tr>
                    <td><span>Order Total</span></td>
                    <td>
                      <h2 className="price text-end mb-0">$792.00</h2>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          </div>
          <div className="col-sm-4 border-right"></div>
        <div className="col-sm-8 p-4">
            <button
              className="btn btn-primary float-end mt-4"
              onClick={() => setGoSteps(2)}
            >
              Next
            </button>
            <button className="btn btn-primary float-start mt-4" onClick={() => setGoSteps(0)}>
              Previous
            </button>
          </div>
          </div>
        </div>
       
      )}
      {goSteps === 2 && (
        <>
        <div className="row borders">
          <div className="col-sm-4 border-right">
        <span className="Stepperh3 d-flex p-4"><span className="number step2 m-01 me-2">1</span><span className="title Step1" onClick={() => setGoSteps(0)}>Personal Information</span></span>
          <span className="Stepperh3 d-flex p-4"><span className="number step2 m-01 me-2">2</span><span className="title Step1" onClick={() => setGoSteps(1)}>Billing Information </span></span>
          <span className="Stepperh3 d-flex p-4"><span className="number step3 m-01 me-2 active">3</span><span className="title" onClick={() => setGoSteps(2)}>Payment Details</span></span>
          </div>
          <div className="col-sm-8 p-4">
          <section>
            <Form.Group>
              <label className="form-label">CardHolder Name</label>
              <input type="text" className="form-control" id="name1"
                placeholder="First Name" />
            </Form.Group>
            <Form.Group>
              <label className="form-label">Card number</label>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Search for..." />
                <span className="input-group-text btn btn-info shadow-none mb-0">
                  <i className="fa fa-cc-visa"></i> &nbsp; <i
                    className="fa fa-cc-amex"></i> &nbsp;
                  <i className="fa fa-cc-mastercard"></i>
                </span>
              </div>
            </Form.Group>
            <Row>
              <Col sm={8}>
                <Form.Group className="mb-sm-0">
                  <label className="form-label">Expiration</label>
                  <div className="input-group">
                    <input type="number" className="form-control" placeholder="MM"
                      name="expiremonth" />
                    <input type="number" className="form-control" placeholder="YY"
                      name="expireyear" />
                  </div>
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group className="mb-0">
                  <label className="form-label">CVV <i
                    className="fa fa-question-circle"></i></label>
                  <input type="number" className="form-control" required />
                </Form.Group>
              </Col>
            </Row>
          </section>
          </div>
          <div className="col-sm-4 border-right"></div>
<div className="col-sm-8 p-4">   <button
            className="btn btn-primary float-end mt-4"
            onClick={() =>{ handleClick(); setGoSteps(0)}}
          >
            Submit
          </button>
          <button className="btn btn-primary wizer float-start mt-4" onClick={() => setGoSteps(1)}>
            Previous
          </button></div>
        </div>
        </>
      )}
    </div>
  );
};