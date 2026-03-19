import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { lists } from '../InvoiceList/Data/InvoicelistData';
import { Button, Card, Col, Dropdown, Form, Row, Table } from 'react-bootstrap';
interface InvoiceListProps { }

const InvoiceList: FC<InvoiceListProps> = () => (
  <Fragment>
    <PageHeader title="Invoice List" />
    <Row>
      <Col lg={12}>
        <Card>
          <Card.Body>
            <Row>
              <Col md={6} mb={4}>
                <Button href="#" className="btn mb-3" variant='primary'><i
                  className="fe fe-plus"></i> Add New Invoice</Button>
              </Col>
              <div className="col-md-6 col-auto">
              </div>
            </Row>
            <div className="e-table">
              <div className="table-responsive">
                <Table className="table table-vcenter text-nowrap border mb-0 table-hover"
                  id="invoicedatatable">
                  <thead>
                    <tr>
                      <th></th>
                      <th>InvoiceID</th>
                      <th>User Name</th>
                      <th>Bill Date</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Bill Status</th>
                      <th>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lists.map((list) => (
                      <tr key={Math.random()}>
                        <td className="align-middle w-5">
                          <Form.Check type="checkbox"/>
                        </td>
                        <td className="align-middle">
                          <div className="d-flex">
                            <div className="mt-1">
                              <a className="btn-link fs-16"
                                href="#">{list.heading}</a>
                            </div>
                          </div>
                        </td>
                        <td className="text-nowrap align-middle">
                          <img src={ImagesData("pngs2")} alt="img"
                            className="w-5 h-5 me-2 brround" />
                          {list.class}
                        </td>
                        <td className="text-nowrap align-middle"><span>{list.class1}</span>
                        </td>
                        <td className="text-nowrap align-middle">
                          {list.mail}
                        </td>
                        <td className="text-nowrap align-middle"><span
                          className="font-weight-bold">{list.class2}</span></td>
                        <td><span
                          className={`bg-${list.color} px-2 py-1 text-white br-7`}>{list.class3}</span>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle as="a" className="btn-light btn-sm no-caret" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                              Options <i
                                className="fa fa-angle-down"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <li>
                                <Dropdown.Item><i
                                  className="fe fe-eye me-2"></i> View</Dropdown.Item>
                              </li>
                              <li>
                                <Dropdown.Item><i
                                  className="fe fe-share me-2"></i> Send</Dropdown.Item>
                              </li>
                              <li>
                                <Dropdown.Item><i
                                  className="fe fe-edit me-2"></i> Edit</Dropdown.Item>
                              </li>
                              <li>
                                <Dropdown.Item><i
                                  className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                              </li>
                            </Dropdown.Menu>

                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default InvoiceList;
