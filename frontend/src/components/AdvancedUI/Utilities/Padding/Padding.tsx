import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row, Table} from 'react-bootstrap';

interface PaddingProps { }

const Padding: FC<PaddingProps> = () => (
  <Fragment>
    <PageHeader title="Padding" />
    <Row>
      <Col lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Padding Positions</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap">
              <div className="w-9 h-9 bg-light  my-1 p-1">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .p-1
                </div>
              </div>
              <div className="w-9 h-9 bg-light  my-1 ps-1 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .ps-1
                </div>
              </div>
              <div className="w-9 h-9 bg-light  my-1 pe-1 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .pe-1
                </div>
              </div>
              <div className="w-9 h-9 bg-light  my-1 pt-1 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .pt-1
                </div>
              </div>
              <div className="w-9 h-9 bg-light  my-1 pb-1 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .pb-1
                </div>
              </div>
              <div className="w-9 h-9 bg-light  my-1 px-1 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .px-1
                </div>
              </div>
              <div className="w-9 h-9 bg-light  my-1 py-1 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .py-1
                </div>
              </div>
            </div>
            <div className="mt-3 table-responsive">
              <Table className="table table-bordered border-top text-nowrap mb-0 mg-t-10">
                <thead>
                  <tr>
                    <th className="wd-30p">className</th>
                    <th className="wd-70p">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="pd-0">className="p-1"</code></td>
                    <td>Add padding all sides to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="ps-1"</code></td>
                    <td>Add padding left side to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="pe-1"</code></td>
                    <td>Add padding right side to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="pt-1"</code></td>
                    <td>Add padding top side to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="pb-1"</code></td>
                    <td>Add padding bottom side to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="px-1"</code></td>
                    <td>Add padding horizonatl sides to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="py-1"</code></td>
                    <td>Add padding vertical sides to element.</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Padding values</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap">
              <div className="w-9 h-9 bg-light my-1 p-1">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .p-1
                </div>
              </div>
              <div className="w-9 h-9 bg-light my-1 p-2 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .p-2
                </div>
              </div>
              <div className="w-9 h-9 bg-light my-1 p-3 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .p-3
                </div>
              </div>
              <div className="w-9 h-9 bg-light my-1 p-4 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .p-4
                </div>
              </div>
              <div className="w-9 h-9 bg-light my-1 p-5 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .p-5
                </div>
              </div>
              <div className="w-9 h-9 bg-light my-1 p-6 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .p-6
                </div>
              </div>
            </div>
            <div className="mt-3 table-responsive">
              <table className="table table-bordered border-top text-nowrap mb-0 mg-t-10">
                <thead>
                  <tr>
                    <th className="wd-30p">className</th>
                    <th className="wd-70p">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="pd-0">className="p-1"</code></td>
                    <td>Add padding p-1 to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="p-2"</code></td>
                    <td>Add padding p-2 to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="p-3"</code></td>
                    <td>Add padding p-3 to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="p-4"</code></td>
                    <td>Add padding p-4 to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="p-5"</code></td>
                    <td>Add padding p-5 to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="p-6"</code></td>
                    <td>Add padding p-6 to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="p-7"</code></td>
                    <td>Add padding p-7 to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="p-8"</code></td>
                    <td>Add padding p-8 to element.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Remove Padding</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap">
              <div className="w-9 h-9 bg-light my-1 p-0">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .p-0
                </div>
              </div>
              <div className="w-9 h-9 bg-light my-1 p-1 ps-0 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .ps-0
                </div>
              </div>
              <div className="w-9 h-9 bg-light my-1 p-1 pe-0 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .pe-0
                </div>
              </div>
              <div className="w-9 h-9 bg-light my-1 p-1 pt-0 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .pt-0
                </div>
              </div>
              <div className="w-9 h-9 bg-light my-1 p-1 pb-0 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .pb-0
                </div>
              </div>
              <div className="w-9 h-9 bg-light my-1 p-1 px-0 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .px-0
                </div>
              </div>
              <div className="w-9 h-9 bg-light my-1 p-1 py-0 ms-3">
                <div
                  className="d-flex align-items-center justify-content-center h-100 bg-light2">
                  .py-0
                </div>
              </div>
            </div>
            <div className="mt-3 table-responsive">
              <Table className="table table-bordered border-top text-nowrap mb-0 mg-t-10">
                <thead>
                  <tr>
                    <th className="wd-30p">className</th>
                    <th className="wd-70p">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="pd-0">className="p-0"</code></td>
                    <td>Remove padding all sides to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="ps-0"</code></td>
                    <td>Remove padding left side to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="pe-0"</code></td>
                    <td>Remove padding right side to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="pt-0"</code></td>
                    <td>Remove padding top side to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="pb-0"</code></td>
                    <td>Remove padding bottom side to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="px-0"</code></td>
                    <td>Remove padding horizonatl sides to element.</td>
                  </tr>
                  <tr>
                    <td><code className="pd-0">className="py-0"</code></td>
                    <td>Remove padding vertical sides to element.</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Media Query Padding</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="mt-3 table-responsive">
              <Table className="table table-bordered border-top text-nowrap mg-t-0 mb-0">
                <thead>
                  <tr>
                    <th className="wd-30p">className</th>
                    <th className="wd-70p">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                    <code className="pd-0 bg-light mb-1">.pt-[size]-[value]</code>
                    <code className="pd-0 bg-light mb-1">.pb-[size]-[value]</code>
                    <code className="pd-0 bg-light mb-1">.pe-[size]-[value]</code>
                    <code className="pd-0 bg-light mb-1">.ps-[size]-[value]</code>
                    </td>
                    <td>
                      <p className="mg-b-5">size: xs | sm | md | lg | xl | xxl</p>
                      <p className="mg-b-0">value: the padding value (refer to code
                        above)
                      </p>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default Padding;
