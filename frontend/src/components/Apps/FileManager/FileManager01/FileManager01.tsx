import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Dropdown, Form, InputGroup, ListGroup, Pagination, Row } from 'react-bootstrap';
import { filemanagers, filemanagers1, recentfile, folders,ApexChart } from '../../../../components/Apps/FileManager/FileManager01/Data/Filemanager01Data';
interface FileManager01Props { }

const FileManager01: FC<FileManager01Props> = () => {
  const [allData, setAllData] = React.useState(recentfile)

  let allElement2: any = [];

  let myfunction = (InputData) => {
    let allElement: any
    for (allElement of recentfile) {
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
      <PageHeader title="File manager"/>
      <Row>
        <Col xl={3}>
          <Card>
            <Card.Body className="text-center">
              <Button variant="primary" className="w-100"><i className="fa fa-plus me-2"></i> Create
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
            <Card.Body className="py-3 px-2">
              <ListGroup className="list-group-transparent mb-0 mail-inbox">
                {filemanagers1.map((filemanager1) => (
                  <ListGroup.Item key={Math.random()}
                    className="list-group-item-action d-flex align-items-center px-0 py-2">
                    <span className={`w-3 h-3 brround bg-${filemanager1.color} me-2`}></span>{filemanager1.heading}
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
                    <Button className=" btn-xs mt-2" variant='light'>
                      Upgrade Storage
                    </Button>
                  </div>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={9}>
          <Row>
            <Col className="col-6">
              <div className="fs-20 mb-4">
                All Files
              </div>
            </Col>
            <Col className="col-6 col-auto">
              <Form.Group>
              <div className="input-icon">
              <span className="input-icon-addon">
													<i className="fe fe-search"></i>
												</span>
                <Form.Control onChange={(ele) => { myfunction(ele.target.value) }} type="text" className="" placeholder="Search ..." />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <div className="text-muted mb-2 fs-16">Recent Files</div>
          <Row>
            {allData.map((recentfiles) => (
              <Col xxl={3} md={4} key={Math.random()}>
                <Card>
                  <Card.Body>
                    <div className="fs-16 mb-1">{recentfiles.icon}{recentfiles.heading}
                      <div className="float-end fs-13 text-muted">{recentfiles.main}</div>
                    </div>
                    <div className="text-muted fs-12">{recentfiles.class}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-muted mb-2 fs-16">Folders</div>
          <Row>
            {folders.map((folder) => (
              <Col xl={3} md={4} sm={6} key={Math.random()}>
                <div className="card border p-0 shadow-none">
                  <div className="d-flex align-items-center px-4 pt-2">
                    <label className="custom-control custom-checkbox">
                      <input type="checkbox" className="custom-control-input"
                        name="example-checkbox2" value="option2" />
                      <span className="custom-control-label"></span>
                    </label>
                    <Dropdown className="float-end ms-auto">
                      <Dropdown.Toggle as="a" className="option-dots no-caret"
                        data-bs-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu dropdown-menu-start">
                        <Dropdown.Item><i
                          className="fe fe-edit me-2"></i> Edit</Dropdown.Item>
                        <Dropdown.Item><i
                          className={`fe fe-${folder.icon1} me-2`}></i> Share</Dropdown.Item>
                        <Dropdown.Item><i
                          className="fe fe-download me-2"></i> Download</Dropdown.Item>
                        <Dropdown.Item><i
                          className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="card-body pt-0 text-center">
                    <div className="file-manger-icon">
                      <img src={folder.src1} alt="img"
                        className="br-7" />
                      {folder.data}
                    </div>
                    <h6 className="mb-1 font-weight-semibold mt-4">{folder.heading}</h6>
                    <span className="text-muted">{folder.main}</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
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
  );
}
export default FileManager01;
