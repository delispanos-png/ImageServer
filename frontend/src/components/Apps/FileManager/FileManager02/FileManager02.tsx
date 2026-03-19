import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Form, InputGroup, ListGroup, Pagination, Row, Table } from 'react-bootstrap';
import { filemanagers, filemanagers1, allfile,ApexChart } from '../../../../components/Apps/FileManager/FileManager02/Data/File2Data';
interface FileManager02Props { }

const FileManager02: FC<FileManager02Props> = () => {
  const [allData, setAllData] = React.useState(allfile)

  let allElement2: any = [];

  let myfunction = (InputData) => {
    let allElement: any
    for (allElement of allfile) {
      if (allElement.heading[0] == " ") {
        allElement.heading = allElement.title.trim()
      }
      if (allElement.heading.toLowerCase().includes(InputData.toLowerCase())) {
        if (allElement.heading.toLowerCase().startsWith(InputData.toLowerCase())) {
          allElement2.push(allElement);
        }
      }

    }
    setAllData(allElement2);
  };

  return (
    <Fragment>
      <PageHeader title="File manager list" />
      <Row>
        <Col lg={4} xl={3}>
          <Card>
            <Card.Body className="text-center">
              <Button className="w-100" variant="primary"><i className="fa fa-plus me-2"></i> Create
                Folder</Button>
            </Card.Body>
            <Card.Body className="py-3 px-0">
              <ListGroup className="list-group-transparent mb-0 file-manger">
                {filemanagers.map((filemanager) => (
                  <ListGroup.Item key={Math.random()}
                    className="list-group-item-action d-flex align-items-center px-0">
                    {filemanager.icon}{filemanager.heading}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
            <Card.Body className="d-flex">
              <Row>
             <ApexChart/>
                <div className="col-auto">
                  <div className="mt-2">
                    <h5 className="mb-1 font-weight-bold">Storage</h5>
                    <p className="mb-0"><span className="text-muted">13.65gb</span> / <span
                      className="text-muted">16gb</span></p>
                    <Button className="btn btn-xs mt-2" variant='light'>
                      Upgrade Storage
                    </Button>
                  </div>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={9} lg={8}>
          <Row>
            <div className="col-6 mb-2">
              <div className="fs-20">
                All Files
              </div>
            </div>
            <div className="col-6 col-auto">
              <div className="form-group">
              <Form.Group>
              <div className="input-icon">
              <span className="input-icon-addon">
													<i className="fe fe-search"></i>
												</span>
                <Form.Control onChange={(ele) => { myfunction(ele.target.value) }} type="text" className="" placeholder="Search ..." />
                </div>
              </Form.Group>
              </div>
            </div>
          </Row>
          <Card>
            <Card.Body className="p-0">
              <div className="e-table">
                <div className="table-responsive table-lg mb-0">
                  <Table className="table mb-0" id="example1">
                    <tbody>
                      {allData.map((allfiles) => (
                        <tr key={Math.random()}>
                          <td className="align-middle w-5 border-top-0">
                            <label className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input"
                                name="example-checkbox2" value="option2" />
                              <span className="custom-control-label"></span>
                            </label>
                          </td>
                          <td className="align-middle border-top-0">
                            <div className="d-flex">
                              <img src={allfiles.src1} alt="img"
                                className="w-5 h-5 me-2" />
                              <div className="mt-1">
                                {allfiles.heading}
                              </div>
                            </div>
                          </td>
                          <td className="text-nowrap align-middle border-top-0"><span>{allfiles.class}</span></td>
                          <td className="text-nowrap align-middle border-top-0">
                            {allfiles.class1}
                          </td>
                          <td className="text-nowrap align-middle border-top-0">
                            {allfiles.main}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Card.Body>
          </Card>
          <div className="pagination float-end mb-4">
            <Pagination>
              <Pagination.Item disabled>Prev</Pagination.Item>
              <Pagination.Item className="active">
                {1}
              </Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Item>{4}</Pagination.Item>
              <Pagination.Next>Next</Pagination.Next>
            </Pagination>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
};

export default FileManager02;
