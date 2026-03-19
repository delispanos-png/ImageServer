import React, { FC, Fragment, useState } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';


import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
interface FormEditorProps { }

const FormEditor: FC<FormEditorProps> = () => {
  //Editor 
  const htmlWithTableImages = `<center>  </center>`;
  const [value, setValue] = React.useState(htmlWithTableImages);
  //LargeModaleditor

  const [lgShow, setLgShow] = useState(false);

  const values = [true];
  //Modal Editor
  const [show, setShow] = useState<any>(false);

  const handleClose: any = () => setShow(false);
  const handleShow: any = () => setShow(true);
  return (

    <Fragment>
      <PageHeader title="Form Editor" />
      <Row className="row-cards">
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Form Editor style1</Card.Title>
            </Card.Header>
            <Card.Body>
              <SunEditor />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>
                Form Editor
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <SunEditor
                setContents={value}
                onChange={setValue}
                setOptions={{
                  buttonList: [
                    ["font"],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "subscript",
                      "superscript"
                    ],
                    ["outdent", "indent"],
                    ["link", "image"],
                    // ["preview", "print"],
                    // ["removeFormat"]
                  ],
                  defaultTag: "div",
                  minHeight: "300px",
                  showPathLabel: false,
                  attributesWhitelist: {
                    all: "style",
                    table: "cellpadding|width|cellspacing|height|style",
                    tr: "valign|style",
                    td: "styleinsert|height|style",
                    img: "title|alt|src|style"
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header className=" border-bottom-0">
              <Card.Title as='h6'>
                Form Editor in Modal
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className='text-center '>
                <Button variant="primary" onClick={handleShow} className="text-center">
                  View live demo
                </Button>
                <Modal show={show} onHide={handleClose} size="lg" variant='primary' aria-labelledby="contained-modal-title-vcenter" backdrop="static" keyboard={false} centered>
                  <Modal.Header className='pd-20'>
                    <Modal.Title as='h6'>Create New Document</Modal.Title>
                    <Link to='#'><span className="text-dark d-flex ms-auto my-auto" onClick={() => { handleClose("Basic") }}><i className='fe fe-x ms-auto'></i></span></Link>
                  </Modal.Header>
                  <Modal.Body className="">
                    <SunEditor

                    />
                  </Modal.Body>
                  <Modal.Footer className="pd-20">
                  <Button className='' variant="primary" onClick={handleClose}>
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
};

export default FormEditor;
