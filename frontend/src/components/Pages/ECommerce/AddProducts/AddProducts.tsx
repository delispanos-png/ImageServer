import React, { FC, Fragment, useState } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import SunEditor from 'suneditor-react';
import { FilePond} from 'react-filepond';

interface AddProductsProps {}

const AddProducts: FC<AddProductsProps> = () => {
    interface option {
    label: string
    }
     const options: option[]=[
        {label:'Electronics'},
        {label:'Fashion'},
        {label:'Home Decor'},
        {label:'Furniture'},

     ]
     const [files, setFiles] = useState([])
    return (


  <Fragment>

                        <PageHeader  title="Add Products" />
                            <Col lg={12}>
                                <Card>
                                    <Card.Header>
                                        <Card.Title>Add New Product</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className="mb-4">
                                            <Form.Label className="col-md-3">Product Name :</Form.Label>
                                            <Col md={9}>
                                                <Form.Control type="text" className="form-control" placeholder="Product Name"/>
                                            </Col>
                                        </Row>
                                        <div className="row mb-4">
                                            <Form.Label className="col-md-3">Price :</Form.Label>
                                            <Col md={9}>
                                                <Form.Control type="number" className="form-control"/>
                                            </Col>
                                        </div>
                                        <div className="row mb-4">
                                            <Form.Label className="col-md-3">Categories :</Form.Label>
                                            <Col md={9}>
                                                <Select options={options} classNamePrefix='Select2' placeholder='Electronics'/>
                                            </Col>
                                        </div>
                                        <div className="row">
                                            <label className="col-md-3 form-label mb-4">Product Description :</label>
                                            <div className="col-md-9 mb-4">
                                                <SunEditor/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-md-3 form-label mb-4">Product Upload :</label>
                                            <div className="col-md-9">
                                                    <FilePond
        files={files}
        // onupdatefiles={setFiles}
        allowMultiple={true}
        maxFiles={3}
        server="/api"
        name="files" 
      /> 
                                            </div>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer>
                                        <Row>
                                            <Col md={3}></Col>
                                            <Col md={9}>
                                                <Button href="#" className="btn mt-2" variant='primary'>Add Product</Button>
                                                <Button href="#" className="float-end mt-2" variant='light'>Discard</Button>
                                            </Col>
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Col>
                     </Fragment>
                    
)
    };

export default AddProducts;
