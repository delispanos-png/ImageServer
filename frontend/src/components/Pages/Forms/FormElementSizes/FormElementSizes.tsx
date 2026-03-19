import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row, Form } from 'react-bootstrap';
interface FormElementSizesProps { }
const FormElementSizes: FC<FormElementSizesProps> = () => (
  <Fragment>
    <PageHeader title="Form Sizes" />
    <Row>
      <Col md={12}>
        <Card>
          <Card.Header>
            <Card.Title className="mb-0 card-title">Form Element Sizes</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col xl={12}>
                <p>Form control small Size add className <code
                  className="highlighter-rouge">.form-control-sm</code> to <code
                    className="highlighter-rouge">.form-control</code></p>
                <Form.Group>
                  <Form.Control type="text" className="form-control form-control-sm"
                    name="input" />
                </Form.Group>
              </Col>
              <Col xl={12}>
                <Form.Group>
                  <p>Form Control Medium Size <code
                    className="highlighter-rouge">.form-control</code></p>
                  <Form.Control type="text" className="form-control" name="input" />
                </Form.Group>
              </Col>
              <Col xl={12}>
                <Form.Group className='mt-2'>
                  <p>Form control small Size add className <code
                    className="highlighter-rouge">.form-control-lg</code> to <code
                      className="highlighter-rouge">.form-control</code></p>
                  <Form.Control type="text" className="form-control form-control-lg"
                    name="input" />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

      </Col>
      <Col lg={12} md={12}>
        <Card>

          <Card.Header>
            <Card.Title>CHECK BOX SIZES</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col xl={4}>
                <Form.Group className="m-0 ms-5">
                  <Form.Label className="mb-4">Checkboxes</Form.Label>

                  <div className="custom-controls-stacked">
                    <label className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox1"
                        value="option1" defaultChecked
                      />
                      <span className="custom-control-label">Option 1</span>
                    </label>
                    <label className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox2"
                        value="option2"
                      />
                      <span className="custom-control-label">Option 2</span>
                    </label>
                    <label className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox3"
                        value="option3" disabled
                      />
                      <span className="custom-control-label">
                        Option Disabled
                      </span>
                    </label>
                    <label className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox4"
                        value="option4" defaultChecked disabled
                      />
                      <span className="custom-control-label">
                        Option Disabled Checked
                      </span>
                    </label>
                  </div>
                </Form.Group>
              </Col>
              <Col xl={4} className="mt-4 mt-xl-0">
                <Form.Group className="m-0">
                  <Form.Label className="mb-4">Checkboxes Medium Sizes</Form.Label>
                  <div className="custom-controls-stacked">
                    <label className="custom-control custom-checkbox custom-control-md">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox1"
                        value="option1" defaultChecked
                      />
                      <span className="custom-control-label custom-control-label-md  tx-16">
                        Option 1
                      </span>
                    </label>
                    <label className="custom-control custom-checkbox custom-control-md">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox2"
                        value="option2"
                      />
                      <span className="custom-control-label custom-control-label-md  tx-16">
                        Option 2
                      </span>
                    </label>
                    <label className="custom-control custom-checkbox custom-control-md">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox3"
                        value="option3" disabled
                      />
                      <span className="custom-control-label custom-control-label-md  tx-16">
                        Option Disabled
                      </span>
                    </label>
                    <label className="custom-control custom-checkbox custom-control-md">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox4"
                        value="option4" defaultChecked disabled
                      />
                      <span className="custom-control-label custom-control-label-md  tx-16">
                        Option Disabled checked
                      </span>
                    </label>
                  </div>
                </Form.Group>
              </Col>
              <Col xl={4} className="mt-4 mt-xl-0">
                <Form.Group className="m-0">
                  <Form.Label className="mb-4">Checkboxes Large Size</Form.Label>
                  <div className="custom-controls-stacked">
                    <label className="custom-control custom-checkbox custom-control-lg">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox1"
                        value="option1" defaultChecked
                      />
                      <span className="custom-control-label custom-control-label-lg  tx-20">
                        Option 1
                      </span>
                    </label>
                    <label className="custom-control custom-checkbox custom-control-lg">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox2"
                        value="option2"
                      />
                      <span className="custom-control-label custom-control-label-lg  tx-20">
                        Option 2
                      </span>
                    </label>
                    <label className="custom-control custom-checkbox custom-control-lg">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox3"
                        value="option3" disabled
                      />
                      <span className="custom-control-label custom-control-label-lg  tx-20">
                        Option Disabled
                      </span>
                    </label>
                    <label className="custom-control custom-checkbox custom-control-lg">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="example-checkbox4"
                        value="option4" defaultChecked disabled
                      />
                      <span className="custom-control-label custom-control-label-lg  tx-20">
                        Option Disabled Checked
                      </span>
                    </label>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>

        </Card>
      </Col>

      <Col lg={12} md={12}>
        <Card className="custom-card">
          <Card.Header>
            <Card.Title>RADIO SIZES</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col xl={4}>
                <div className="form-group ">
                  <div className="form-label">Radios</div>
                  <div className="custom-controls-stacked">
                    <label className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios"
                        value="option1" defaultChecked
                      />
                      <span className="custom-control-label">Option 1</span>
                    </label>
                    <label className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios"
                        value="option2"
                      />
                      <span className="custom-control-label">Option 2</span>
                    </label>
                    <label className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios"
                        value="option3" disabled
                      />
                      <span className="custom-control-label">
                        Option Disabled
                      </span>
                    </label>
                    <label className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios02"
                        value="option4" defaultChecked disabled
                      />
                      <span className="custom-control-label">
                        Option Disabled Checked
                      </span>
                    </label>
                  </div>
                </div>
              </Col>
              <Col xl={4} className="mt-4 mt-xl-0">
                <div className="form-group ">
                  <div className="form-label">Medium Radios</div>
                  <div className="custom-controls-stacked">
                    <label className="custom-control custom-radio custom-control-md">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios1"
                        value="option1" defaultChecked
                      />
                      <span className="custom-control-label custom-control-label-md  tx-16">
                        Option 1
                      </span>
                    </label>
                    <label className="custom-control custom-radio custom-control-md">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios1"
                        value="option2"
                      />
                      <span className="custom-control-label custom-control-label-md  tx-16">
                        Option 2
                      </span>
                    </label>
                    <label className="custom-control custom-radio custom-control-md">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios1"
                        value="option3" disabled
                      />
                      <span className="custom-control-label custom-control-label-md  tx-16">
                        Option Disabled
                      </span>
                    </label>
                    <label className="custom-control custom-radio custom-control-md">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios12"
                        value="option4" defaultChecked disabled
                      />
                      <span className="custom-control-label custom-control-label-md  tx-16">
                        Option Disabled Checked
                      </span>
                    </label>
                  </div>
                </div>
              </Col>
              <Col xl={4} className="mt-4 mt-xl-0">
            
                <div className="form-group ">
                  <div className="form-label">Large Radios</div>
                  <div className="custom-controls-stacked">
                    <label className="custom-control custom-radio custom-control-lg">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios2"
                        value="option1" defaultChecked
                      />
                      <span className="custom-control-label custom-control-label-lg  tx-20">
                        Option 1
                      </span>
                    </label>
                    <label className="custom-control custom-radio custom-control-lg">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios2"
                        value="option2"
                      />
                      <span className="custom-control-label custom-control-label-lg tx-20">
                        Option 2
                      </span>
                    </label>
                    <label className="custom-control custom-radio custom-control-lg">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios2"
                        value="option3" disabled
                      />
                      <span className="custom-control-label custom-control-label-lg  tx-20">
                        Option Disabled
                      </span>
                    </label>
                    <label className="custom-control custom-radio custom-control-lg">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="example-radios22"
                        value="option4" defaultChecked disabled
                      />
                      <span className="custom-control-label custom-control-label-lg  tx-20">
                        Option Disabled Checked
                      </span>
                    </label>
                  </div>
                </div>
                
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={12} md={12}>
        <Card>
          <Card.Header>
            <Card.Title className="mb-0 card-title">Check Box Sizes Switches</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col xl={4}>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Check Box</span>
                    <input type="checkbox" name="custom-switch-checkbox1"
                      className="custom-switch-input" />
                    <span className="custom-switch-indicator"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Check Box</span>
                    <input type="checkbox" name="custom-switch-checkbox1"
                      className="custom-switch-input" defaultChecked />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-lg"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Check Box</span>
                    <input type="checkbox" name="custom-switch-checkbox1"
                      className="custom-switch-input" />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-xl"></span>
                  </label>
                </Form.Group>
              </Col>
              <div className="col-xl-4 mt-4 mt-xl-0">
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Check Box</span>
                    <input type="checkbox" name="custom-switch-checkbox2"
                      className="custom-switch-input" />
                    <span className="custom-switch-indicator custom-square"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Check Box</span>
                    <input type="checkbox" name="custom-switch-checkbox2"
                      className="custom-switch-input" />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-lg custom-square"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Check Box</span>
                    <input type="checkbox" name="custom-switch-checkbox2"
                      className="custom-switch-input" defaultChecked />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-xl custom-square"></span>
                  </label>
                </Form.Group>
              </div>
              <div className="col-xl-4 mt-4 mt-xl-0">
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Check Box</span>
                    <input type="checkbox" name="custom-switch-checkbox3"
                      className="custom-switch-input" defaultChecked />
                    <span className="custom-switch-indicator custom-radius"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Check Box</span>
                    <input type="checkbox" name="custom-switch-checkbox3"
                      className="custom-switch-input" />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-lg custom-radius"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Check Box</span>
                    <input type="checkbox" name="custom-switch-checkbox3"
                      className="custom-switch-input" />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-xl custom-radius"></span>
                  </label>
                </Form.Group>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={12} md={12}>
        <Card>
          <Card.Header>
            <Card.Title className="mb-0 card-title">Radio Button Sizes Switches</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col xl={4}>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Radio
                      Buttons</span>
                    <input type="radio" name="custom-switch-radio"
                      className="custom-switch-input" />
                    <span className="custom-switch-indicator"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Radio
                      Buttons</span>
                    <input type="radio" name="custom-switch-radio"
                      className="custom-switch-input" />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-lg"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Radio
                      Buttons</span>
                    <input type="radio" name="custom-switch-radio"
                      className="custom-switch-input" defaultChecked />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-xl"></span>
                  </label>
                </Form.Group>
              </Col>
              <div className="col-xl-4 mt-4 mt-xl-0">
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Radio
                      Buttons</span>
                    <input type="radio" name="custom-switch-radio1"
                      className="custom-switch-input" />
                    <span className="custom-switch-indicator custom-square"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Radio
                      Buttons</span>
                    <input type="radio" name="custom-switch-radio1"
                      className="custom-switch-input" />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-lg custom-square"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Radio
                      Buttons</span>
                    <input type="radio" name="custom-switch-radio1"
                      className="custom-switch-input" defaultChecked />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-xl custom-square"></span>
                  </label>
                </Form.Group>
              </div>
              <div className="col-xl-4 mt-4 mt-xl-0">
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Radio
                      Buttons</span>
                    <input type="radio" name="custom-switch-radio2"
                      className="custom-switch-input" defaultChecked />
                    <span className="custom-switch-indicator custom-radius"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Radio
                      Buttons</span>
                    <input type="radio" name="custom-switch-radio2"
                      className="custom-switch-input" />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-lg custom-radius"></span>
                  </label>
                </Form.Group>
                <Form.Group>
                  <label className="custom-switch mb-3">
                    <span className="custom-switch-description me-2">Radio
                      Buttons</span>
                    <input type="radio" name="custom-switch-radio2"
                      className="custom-switch-input" />
                    <span
                      className="custom-switch-indicator custom-switch-indicator-xl custom-radius"></span>
                  </label>
                </Form.Group>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>


);

export default FormElementSizes;
