import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';

interface Invoice02Props { }

const Invoice02: FC<Invoice02Props> = () => (
  <Fragment>
    <PageHeader title="Invoice 2" />
    <Row>
      <Col md={12}>
        <Card>
          <Card.Body>
            <div className="invoice-header text-end d-block mb-5">
              <h1 className="invoice-title font-weight-bold text-uppercase mb-1 text-primary">
                Invoice</h1>
            </div>
            <Row className="mt-4">
              <Col className="col-md">
                <label className="font-weight-bold">Billed To</label>
                <div className="billed-to">
                  <h6>Goerge</h6>
                  <p>2406 Raoul Wallenberg Place<br />
                    Tel No: 203-875-4147<br />
                    Email: goerge234@gmail.com</p>
                </div>
              </Col>
              <Col className="col-md">
                <div className="billed-from text-md-right">
                  <label className="font-weight-bold">Billed From</label>
                  <h6>Spruko Pvt Ltd.</h6>
                  <p>201 Something St., Something Town, YT 242, Country 6546<br />
                    Tel No: 324 445-4544<br />
                    Email: info@spruko.com</p>
                </div>
              </Col>
            </Row>
            <div className="table-responsive mt-4">
              <Table className="table table-bordered border text-nowrap mb-0">
                <thead>
                  <tr>
                    <th className="wd-20p">Product</th>
                    <th className="tx-center">QNTY</th>
                    <th className="tx-right">Unit Price</th>
                    <th className="tx-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-weight-bold">Website design & development</td>
                    <td className="tx-center">6</td>
                    <td className="tx-right">$250.00</td>
                    <td className="tx-right">$1500.00</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">Branding</td>
                    <td className="tx-center">1</td>
                    <td className="tx-right">$900.00</td>
                    <td className="tx-right">$900.00</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">Redesign Service</td>
                    <td className="tx-center">1</td>
                    <td className="tx-right">$500.00</td>
                    <td className="tx-right">$500.00</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">Wordpress Plugins</td>
                    <td className="tx-center">5</td>
                    <td className="tx-right">$360.00</td>
                    <td className="tx-right">$1800.00</td>
                  </tr>
                  <tr>
                    <td className="valign-middle" colSpan={2} rowSpan={4}>
                      <div className="invoice-notes">
                        <label
                          className="main-content-label  font-weight-semibold">Notes</label>
                        <p> voluptatum deleniti atque corrupti explicabo.</p>
                      </div>
                    </td>
                    <td className="tx-right font-weight-semibold">Sub-Total</td>
                    <td className="tx-right font-weight-semibold">$4700.00</td>
                  </tr>
                  <tr>
                    <td className="tx-right font-weight-semibold">Tax (5%)</td>
                    <td className="tx-right font-weight-semibold">$235.50</td>
                  </tr>
                  <tr>
                    <td className="tx-right font-weight-semibold">Discount</td>
                    <td className="tx-right font-weight-semibold">-$50.00</td>
                  </tr>
                  <tr className="text-danger">
                    <td className="text-uppercase text-danger font-weight-semibold">Total Due</td>
                    <td className="tx-right">
                      <h4 className="font-weight-bold text-danger">$4,885.50</h4>
                    </td>
                  </tr>

                </tbody>
              </Table>
            </div>
            <div className="float-end">
              <Button type="button" className="btn  me-2 mt-3" variant='primary' onClick={() => { window.print() }}
              ><i className="si si-wallet"></i> Pay
                Invoice</Button>
              <Button type="button" className="btn  me-2 mt-3" variant='success' onClick={() => { window.print() }}
              ><i className="si si-paper-plane"></i>
                Send
                Invoice</Button>
              <Button type="button" className="btn me-2 mt-3" variant='secondary' onClick={() => { window.print() }}
              ><i className="si si-printer"></i> Print
                Invoice</Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default Invoice02;
