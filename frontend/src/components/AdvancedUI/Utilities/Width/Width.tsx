import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row } from 'react-bootstrap';

interface WidthProps {}

const Width: FC<WidthProps> = () => (
  <Fragment>
  <PageHeader  title="Widths"/>
  <Row>
    <Col lg={12}>
      <Card>
        <Card.Header>
          <Card.Title>
            Width Values
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex">
            <div
              className="d-flex align-items-center justify-content-center w-8 h-9 bg-light">
              .w-8
            </div>
            <div
              className="d-flex align-items-center justify-content-center w-150 h-9 bg-light ms-4">
              .w-150
            </div>
            <div
              className="d-flex align-items-center justify-content-center w-50 h-9 bg-light ms-4">
              .w-50
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered text-nowrap mt-4">
              <tbody>
                <tr>
                  <td className="w-20"><b>Classes</b></td>
                  <td><code>.w-[value]</code></td>
                </tr>
                <tr>
                  <td className="w-20"><b>Values</b></td>
                  <td>1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered text-nowrap mt-4">
              <tbody>
                <tr>
                  <td className="w-20"><b>Classes</b></td>
                  <td><code>.w-[value]</code></td>
                </tr>
                <tr>
                  <td className="w-20"><b>Values</b></td>
                  <td>100h | 150 | 200 | 250 | 300 | ... | 500 &nbsp; (step of 50)
                    Bigger Height</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered text-nowrap mt-4 mb-0">
              <tbody>
                <tr>
                  <td className="w-20"><b>Classes</b></td>
                  <td><code>.w-[value]</code></td>
                </tr>
                <tr>
                  <td className="w-20"><b>Values</b></td>
                  <td>10 | 15 | 20 | 25 | 30 | ... | 100 &nbsp; (step of 5) %
                    Percentage Height</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Fragment>
);

export default Width;
