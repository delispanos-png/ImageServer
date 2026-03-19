import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row, Table } from 'react-bootstrap';

interface ColorsProps {}

const Colors: FC<ColorsProps> = () => (
  <Fragment>
  <PageHeader  title="Colors"/>
  <Row>
    <Col lg={12}>
      <Card>
        <Card.Header>
          <Card.Title>
            Gray Set
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap ht-80">
            <div className="w-9 bg-gray-900 h-9"></div>
            <div className="w-9 bg-gray-800 h-9"></div>
            <div className="w-9 bg-gray-700 h-9"></div>
            <div className="w-9 bg-gray-600 h-9"></div>
            <div className="w-9 bg-gray-500 h-9"></div>
            <div className="w-9 bg-gray-400 h-9"></div>
            <div className="w-9 bg-gray-300 h-9"></div>
            <div className="w-9 bg-gray-200 h-9"></div>
            <div className="w-9 bg-gray-100 h-9"></div>
          </div>
          <div className="mt-5 mb-0 table-responsive">
            <table className="table table-bordered text-nowrap mb-0">
              <tbody>
                <tr>
                  <td className="wd-20p"><b>Classes</b></td>
                  <td><code>className="bg-gray-[value]"</code></td>
                </tr>
                <tr>
                  <td className="wd-20p"><b>Values</b></td>
                  <td>900 | 800 | 700 | 600 | 500 | 400 | 300 | 200 | 100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>
            Solid Background Set
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap ht-80">
            <div className="w-9 bg-primary h-9"></div>
            <div className="w-9 bg-secondary h-9"></div>
            <div className="w-9 bg-success h-9"></div>
            <div className="w-9 bg-warning h-9"></div>
            <div className="w-9 bg-danger h-9"></div>
            <div className="w-9 bg-info h-9"></div>
            <div className="w-9 bg-indigo h-9"></div>
            <div className="w-9 bg-purple h-9"></div>
            <div className="w-9 bg-pink h-9"></div>
            <div className="w-9 bg-teal h-9"></div>
            <div className="w-9 bg-orange h-9"></div>
          </div>
          <div className="mt-5 mb-0 table-responsive">
            <Table className="table table-bordered text-nowrap mb-0">
              <tbody>
                <tr>
                  <td className="wd-20p"><b>Classes</b></td>
                  <td><code>className="bg-[value]"</code></td>
                </tr>
                <tr>
                  <td className="wd-20p"><b>Values</b></td>
                  <td>primary | secondary | success | warning | danger | info |
                    indigo
                    | purple | pink | teal | orange</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>
            Transparent White Set
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap ht-80">
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-white-1"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-white-2"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-white-3"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-white-4"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-white-5"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-white-6"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-white-7"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-white-8"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
               src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-white-9"></div>
            </div>
          </div>
          <div className="mt-5 mb-0 table-responsive">
            <table className="table table-bordered text-nowrap mb-0">
              <tbody>
                <tr>
                  <td className="wd-20p"><b>Classes</b></td>
                  <td><code>className="bg-white-[value]"</code></td>
                </tr>
                <tr>
                  <td className="wd-20p"><b>Values</b></td>
                  <td>1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>
            Transparent Black Set
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap ht-80">
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-black-1"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-black-2"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-black-3"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-black-4"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-black-5"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
               src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-black-6"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
                src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-black-7"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
               src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-black-8"></div>
            </div>
            <div className="w-9 relative">
              <img alt="" className="w-9 h-9 cover-image"
               src={ImagesData("media26")}/>
              <div className="pos-absolute a-0 bg-black-9"></div>
            </div>
          </div>
          <div className="mt-5 mb-0 table-responsive">
            <table className="table table-bordered text-nowrap mb-0">
              <tbody>
                <tr>
                  <td className="wd-20p"><b>Classes</b></td>
                  <td><code>className="bg-black-[value]"</code></td>
                </tr>
                <tr>
                  <td className="wd-20p"><b>Values</b></td>
                  <td>1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9</td>
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

export default Colors;
