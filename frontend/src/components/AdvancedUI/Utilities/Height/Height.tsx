import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row, Table} from 'react-bootstrap';

interface HeightProps {}

const Height: FC<HeightProps> = () => (
  <Fragment>
  <PageHeader  title="Heights" />
  <Row>
    <Col lg={12}>
      <Card>
        <Card.Header>
          <Card.Title>
            Height Values
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex">
            <div
              className="d-flex align-items-center justify-content-center w-150 h-5 bg-gray-100">
              .h-5
            </div>
            <div
              className="d-flex align-items-center justify-content-center w-150 h-9 bg-gray-100 ms-4">
              .h-9
            </div>
            <div
              className="d-flex align-items-center justify-content-center w-150 h-200 bg-gray-100 ms-4">
              .h-200
            </div>
          </div>
          <div className="mt-3">
            <Table className="table table-bordered text-nowrap mt-4">
              <tbody>
                <tr>
                  <td className="w-20"><b>Classes</b></td>
                  <td><code>.h-[value]</code></td>
                </tr>
                <tr>
                  <td className="w-20"><b>Values</b></td>
                  <td>1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="mt-3 table-responsive">
            <table className="table table-bordered text-nowrap mt-4 mb-0">
              <tbody>
                <tr>
                  <td className="w-20"><b>Classes</b></td>
                  <td><code>.h-[value]</code></td>
                </tr>
                <tr>
                  <td className="w-20"><b>Values</b></td>
                  <td>100h | 150 | 200 | 250 | 300 | ... | 500 &nbsp; (step of 50)
                    Bigger Height</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 table-responsive">
            <table className="table table-bordered text-nowrap mt-4 mb-0">
              <tbody>
                <tr>
                  <td className="w-20"><b>Classes</b></td>
                  <td><code>.h-[value]</code></td>
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

export default Height;
