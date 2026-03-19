import React, { FC, Fragment, useEffect, useState } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, FormGroup, InputGroup, Row, Table ,Form, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {carts} from './Data/ShoppingCartData';
import { ItemData } from '../Data/EcommerceData';


interface ShoppingCartProps {}

const ShoppingCart: FC<ShoppingCartProps> = () => {

  const [FiltercartData, setCartData] = useState(ItemData)
  //Count up & Count Down
  function dec(el) {
    let unit = el.currentTarget.parentElement.querySelector("input").value;
    if (Number(unit) === 0) {
      return false;
    } else {
      el.currentTarget.parentElement.querySelector("input").value--;
    }
  }
  function inc(el) {
    el.currentTarget.parentElement.querySelector("input").value++;

  }

 
  return (

  <Fragment>
  <PageHeader  title="Carts" />
  <Row>
    <Col lg={12} md={12} sm={12} xl={8}>
      <Card>
        <Card.Header>
          <Card.Title>
            Cart Items
          </Card.Title>
        </Card.Header>
        <div className="table-responsive">
          <Table className="table card-table table-vcenter text-nowrap shopping-carttable">
            <thead className="border-bottom-0 pt-3 pb-3 ">
              <tr>
                <th className="fs-15">Products</th>
                <th>Product Details</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
          	{carts.map((cart) => (
            <tbody key={Math.random()}>
              <tr className="cart-table attach-supportfiles">
                <td><img className="avatar avatar-lg br-7" src={cart.src1} alt="img"/></td>
                <td className="fs-15 font-weight-normal1">{cart.heading}</td>
                <td>{cart.text}</td>
                <td>
                  <InputGroup className="w-125p">
                       <Button type="button" className="btn btn-sm border-0 br-3 minus" variant='primary' onClick={dec}>
                        <i className="fa fa-minus"></i>
                      </Button>
                    <Form.Control type="text" name="quantity" className="form-control text-center qty border-0" defaultValue="1"/>
                    <Button type="button" className="btn btn-sm border-0 br-3 add" variant='primary' onClick={inc}>
                      <i className="fa fa-plus"></i>
                    </Button>
                  </InputGroup>
                </td>
                <td><span>{cart.text}</span></td>
                <td>
                  <span className="text-success fs-18 me-3">
                  <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            Download
                          </Tooltip>}>
                          <i className="fe fe-download"></i>
                      </OverlayTrigger>
                    
                  </span>
                  <span className="text-danger fs-18">
                  <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            Delete
                          </Tooltip>}>
                          <i className="fe fe-trash"></i>
                      </OverlayTrigger>
                    
                  </span>
                </td>
              </tr>
            </tbody>
            ))}
          </Table>

        </div>
      </Card>
    </Col>
    <Col lg={12} xl={4} sm={12} md={12}>
      <Card>
        <Card.Body>
          <Form>
            <FormGroup className="mb-0"> <Form.Label className="font-weight-bold">Have
                coupon?</Form.Label>
              <InputGroup className="mt-2">
                <Form.Control type="text" className="form-control coupon" placeholder="Coupon code"/>
                <Button className="btn-apply coupon" variant='primary'>Apply</Button>
              </InputGroup>
            </FormGroup>
          </Form>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Order-Summary</Card.Title>
        </Card.Header>
        <Card.Body>
          <h5>Amount Details</h5>
          <div className="table-responsive">
            <Table className="table table-borderless text-nowrap mb-0">
              <tbody>
                <tr>
                  <td className="text-start">Total Price</td>
                  <td className="text-end"><span
                      className="font-weight-bold  ms-auto">$256</span></td>
                </tr>
                <tr>
                  <td className="text-start">Additional Discount</td>
                  <td className="text-end"><span
                      className="font-weight-bold text-success">-
                      $35</span></td>
                </tr>
                <tr>
                  <td className="text-start">Delivery Charges</td>
                  <td className="text-end"><span
                      className="font-weight-bold text-green">Free</span></td>
                </tr>
                <tr>
                  <td className="text-start">Tax</td>
                  <td className="text-end"><span
                      className="font-weight-bold text-danger">+
                      $55</span></td>
                </tr>
                <tr>
                  <td className="text-start">Coupon Discount</td>
                  <td className="text-end"><span
                      className="font-weight-bold text-success">-
                      $10</span></td>
                </tr>
                <tr>
                  <td className="text-start">Vat Tax</td>
                  <td className="text-end"><span className="font-weight-bold ">+ $5</span>
                  </td>
                </tr>
                <tr>
                  <td className="text-start fs-18">Total Bill</td>
                  <td className="text-end"><span
                      className="ms-2 font-weight-bold  fs-22">$271</span></td>
                </tr>
                <tr>
                  <td className="text-start"><a href={`${import.meta.env.BASE_URL}Pages/ecommerce/products`}
                      className="btn btn-success btn-md mt-3"
                      role="button">Continue
                      Shopping <i className="fe fe-arrow-right ms-2"></i></a></td>
                  <td className="text-end"><a href={`${import.meta.env.BASE_URL}Pages/ecommerce/checkout`}
                      className="btn btn-primary btn-md mt-3"
                      role="button">Checkout</a></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

    </Col>
  </Row>
</Fragment>
)
  };

export default ShoppingCart;


