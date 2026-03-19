import React, { FC, Fragment, useState } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import {images} from '../Products/Data/ProductsData'
import { Button, Card, Col, Form, Pagination, Row } from 'react-bootstrap';
import {products,brands} from '../Products/Data/ProductsData';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { ItemData } from '../Data/EcommerceData';


interface ProductsProps {}

const Products: FC<ProductsProps> = () => {

  const [show, setshow] = useState(ItemData);
  return(

  <Fragment>
  <PageHeader  title="Products" />
  <Row>
    <Col xl={3} lg={12}>
      <Row>
        <Col md={12} lg={12}>
          <Card>

            <Card.Header className="bg-light">
              <Card.Title> Categories &amp; Fliters</Card.Title>
            </Card.Header>
            <Card.Body>
            <div className="custom-checkbox">
              <Form.Check  label="Mens" defaultChecked />
              <Form.Check  label="Womens" />
              <Form.Check  label="Kids" />
              <Form.Check  label="Others" />
              </div>
            </Card.Body>
            <Card.Header className=" bg-light">
              <Card.Title>Category</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label></Form.Label>
                <Select options={products} classNamePrefix='Select2' placeholder="Dress"/>
              </Form.Group>
            </Card.Body>
            <Card.Header className="bg-light">
              <Card.Title>Brand</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label className="mt-1"></Form.Label>
                <Select options={brands} classNamePrefix='Select2' placeholder="Black"/>
              </Form.Group>
            </Card.Body>
            <Card.Header className="bg-light">
              <Card.Title>
                Color
              </Card.Title>
            </Card.Header>
            <Card.Body className='ms-2'>
              <Row className="gutters-xs">
                <div className="col-auto brround">
                  <label className="colorinput">
                    <input name="color" type="radio" value="azure"
                      className="colorinput-input " defaultChecked/>
                    <span className="colorinput-color bg-azure"></span>
                  </label>
                </div>
                <div className="col-auto">
                  <label className="colorinput">
                    <input name="color" type="radio" value="indigo"
                      className="colorinput-input"/>
                    <span className="colorinput-color bg-indigo"></span>
                  </label>
                </div>
                <div className="col-auto">
                  <label className="colorinput">
                    <input name="color" type="radio" value="purple"
                      className="colorinput-input"/>
                    <span className="colorinput-color bg-purple"></span>
                  </label>
                </div>
                <div className="col-auto">
                  <label className="colorinput">
                    <input name="color" type="radio" value="pink"
                      className="colorinput-input"/>
                    <span className="colorinput-color bg-pink"></span>
                  </label>
                </div>
                <div className="col-auto">
                  <label className="colorinput">
                    <input name="color" type="radio" value="red"
                      className="colorinput-input"/>
                    <span className="colorinput-color bg-red"></span>
                  </label>
                </div>
                <div className="col-auto">
                  <label className="colorinput">
                    <input name="color" type="radio" value="orange"
                      className="colorinput-input"/>
                    <span className="colorinput-color bg-orange"></span>
                  </label>
                </div>
                <div className="col-auto">
                  <label className="colorinput">
                    <input name="color" type="radio" value="yellow"
                      className="colorinput-input"/>
                    <span className="colorinput-color bg-yellow"></span>
                  </label>
                </div>
                <div className="col-auto">
                  <label className="colorinput">
                    <input name="color" type="radio" value="lime"
                      className="colorinput-input"/>
                    <span className="colorinput-color bg-lime"></span>
                  </label>
                </div>
                <div className="col-auto">
                  <label className="colorinput">
                    <input name="color" type="radio" value="green"
                      className="colorinput-input"/>
                    <span className="colorinput-color bg-green"></span>
                  </label>
                </div>
                <div className="col-auto">
                  <label className="colorinput">
                    <input name="color" type="radio" value="teal"
                      className="colorinput-input"/>
                    <span className="colorinput-color bg-teal"></span>
                  </label>
                </div>
              </Row>
            </Card.Body>
            <Card.Header className="bg-light">
              <Card.Title>Price</Card.Title>
            </Card.Header>
            <Card.Body>
            <div className="custom-checkbox">
            <Form.Check type="radio" label="Under $25" defaultChecked/>
            <Form.Check type="radio" label="$25 to $50" />
            <Form.Check type="radio" label="$50 to $100" />
            <Form.Check type="radio" label="$100 to $200" />
            <Form.Check type="radio" label="$200 & Above" />
            </div>
            </Card.Body>
            <Card.Header className="bg-light">
              <Card.Title> Size</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="custom-checkbox">
            <Form.Check  label="Xtra Small" defaultChecked/>
            <Form.Check type="checkbox" label=" Small" />
            <Form.Check type="checkbox" label="Medium" />
            <Form.Check type="checkbox" label="Large" />
            <Form.Check type="checkbox" label="Xtra Large" />
              </div>
            </Card.Body>
            <Card.Header className="bg-light">
              <Card.Title> Ratings</Card.Title>
            </Card.Header>
            <div className="py-2 px-3">
							<div className="p-1 d-flex align-items-center">
								<Form.Check type="checkbox" label="" defaultChecked />
							  <span className="fs-14 ms-2 my-auto">
                    <i className="fa fa-star  text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                  </span>         
							</div>
							<div className="p-1 d-flex align-items-center">
								<Form.Check type="checkbox" label=""/>
							  <span className="fs-14 ms-2 my-auto">
                    <i className="fa fa-star  text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                  </span>      
							</div>
							<div className="p-1 d-flex align-items-center">
								<Form.Check type="checkbox" label=""/>
							  <span className="fs-14 ms-2 my-auto">
                    <i className="fa fa-star  text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                  </span>      
							</div>
							<div className="p-1 d-flex align-items-center">
								<Form.Check type="checkbox" label="" />
							  <span className="fs-14 ms-2 my-auto">
                    <i className="fa fa-star  text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                  </span>      
							</div>
							<div className="p-1  d-flex align-items-center">
								<Form.Check type="checkbox" label="" />
							  <span className="fs-14 ms-2 my-auto">
                    <i className="fa fa-star  text-warning"></i>
                  </span>      
							</div>
				
						</div>
            <Card.Footer>
              <Button className="btn my-1 me-2" variant='primary' href="#">Apply Filter</Button>
              <Button className="btn my-1 me-2" variant='success' href="#">Search Now</Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Col>
    <Col lg={12} xl={9}>
      <Row>
          {images.map((image)=>(  
        <Col xl={4} md={6} className="alert mb-0" key={Math.random()}>
          <Card className="item-card ">
            <Card.Body className="pb-0">
              <div className="text-center zoom">
                <Link to={`${import.meta.env.BASE_URL}Pages/ecommerce/productsdetails`}><img 
                    src={image.src1} alt="img"
                    className="img-fluid w-100 br-7"/></Link>
              </div>
              <Card.Body className="px-0 pb-3">
                <Row>
                  <div className="col-9">
                    <div className="cardtitle">
                      <div>
                        <Link to="#"><i className="fa fa-star text-yellow fs-16"></i></Link>
                        <Link to="#"><i className="fa fa-star text-yellow fs-16"></i></Link>
                        <Link to="#"><i className="fa fa-star text-yellow fs-16"></i></Link>
                        <Link to="#"><i className="fa fa-star-half text-yellow fs-16"></i></Link>
                        <Link to="#"><i  className="fa fa-star-o text-yellow fs-16"></i></Link>
                        <Link to="#">{image.data}</Link>
                      </div>
                      <a className="shop-title fs-18">{image.heading}</a>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="cardprice">
                      <span
                        className="type--strikethrough number-font">{image.text}</span>
                      <span className="number-font ms-1">{image.text1}</span>
                    </div>
                  </div>
                  <div>
                    <p className="shop-description fs-13 text-muted mb-0">Lorem
                      ipsum
                      dolor sit amet consectetur, adipisicing elit. Dolor
                      ipsum
                      quia saepe esse.</p>
                  </div>
                </Row>
              </Card.Body>
            </Card.Body>
            <div className="text-center pb-4 ps-2 pe-2">
              <Link to={`${import.meta.env.BASE_URL}Pages/ecommerce/productsdetails`}
                className="btn btn-md bg-primary-transparent text-primary mb-2 border-primary w-45 text-wrap"><i
                  className="fe fe-eye me-2 font-weight-bold"></i>Quick View</Link>
              <Link to={`${import.meta.env.BASE_URL}Pages/ecommerce/shoppingcart`} 
                className="btn btn-md btn-primary mb-2 ms-2 w-45 fs-14 text-wrap"><i
                  className="fe fe-shopping-cart me-2"></i>Add Item</Link>
            </div>
          </Card>
        </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-end">
      <Pagination>
      <Pagination.First/>
								<Pagination.Item className="active">
									{1}
								</Pagination.Item>
								<Pagination.Item>{2}</Pagination.Item>
								<Pagination.Item>{3}</Pagination.Item>
								<Pagination.Item>{4}</Pagination.Item>
								<Pagination.Item>{5}</Pagination.Item>
								<Pagination.Next />
							</Pagination>
      </div>
    </Col>
  </Row>
</Fragment>
)
 };

export default Products;
