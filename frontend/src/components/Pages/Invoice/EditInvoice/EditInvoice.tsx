import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row, Form, Table, Button } from 'react-bootstrap';

interface EditInvoiceProps { }

const EditInvoice: FC<EditInvoiceProps> = () => (
  <Fragment>
    <PageHeader title="Edit Invoice" />
    <Row>
      <Col md={12}>
        <Card>
          <Card.Header>
            <Card.Title className="text-primary">Edit Invoice</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <div className="col-12">
                <Form.Group className="form-group row">
                  <Col md={5} mb={2}>
                    <Form.Label>Invoice Title</Form.Label>
                    <Form.Control placeholder="Invoice title"
                      defaultValue="Invoice" />
                  </Col>
                  <Col md={5} mb={2}>
                    <Form.Label className='mt-2'>Payment Number</Form.Label>
                    <Form.Control placeholder="Payment Number"
                      defaultValue="23543" />
                  </Col>
                  <Col md={2}>
                    <Form.Label className="form-label mt-2">Payment Date</Form.Label>
                    <Form.Control type="number" defaultValue=""
                      placeholder="dd-mm-yy" />
                  </Col>
                </Form.Group>
                <Form.Group className="form-group row">
                  <Col md={6} mb={2}>
                    <Form.Label>Bill To</Form.Label>
                    <Form.Control placeholder='Street Address, State, City, Region, Postal Code, ctr@example.com' as='textarea' rows={4} className="mb-3" />
                  </Col>
                  <div className="col-md-6">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control placeholder='Hi Patrenna Allen,This is the receipt for a payment of $450.00 (USD) for your works' as='textarea' rows={4} className="mb-3" />

                  </div>
                </Form.Group>
              </div>
            </Row>
            <div className="table-responsive">
              <Table className="table nowrap text-nowrap border mt-5">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th className="w-40">DESCRIPTION</th>
                    <th>QNTY</th>
                    <th>UNIT PRICE</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><Form.Control placeholder="" type="text"
                      defaultValue="Logo Creation" /></td>
                    <td><Form.Control placeholder="" type="text"
                      defaultValue="Logo and business cards design" /></td>
                    <td><Form.Control placeholder="" type="text"
                      defaultValue="2" /></td>
                    <td><Form.Control placeholder="" type="text"
                      defaultValue="$60.00" /></td>
                    <td><Form.Control placeholder="" type="text"
                      defaultValue="$120.00" /></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td><Button className="btn" variant='light' href="#"><i
                      className="fe fe-plus"></i> Add Product</Button></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tfoot>
              </Table>
            </div>
            <Form.Group className="row">
              <Col md={12}>
                <Form.Label>Vat Rate</Form.Label>
                <Form.Control placeholder="Vat Rate" type="text"
                  defaultValue="20%" />
              </Col>
            </Form.Group>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col>
                <Button className="btn me-2" variant="success" href="#">Save</Button>
                <Button className="btn me-2" variant='secondary' href="#">Cancel</Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default EditInvoice;
