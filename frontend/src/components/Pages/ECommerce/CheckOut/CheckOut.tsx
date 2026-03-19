 import React, { FC, Fragment, useEffect, useState } from 'react';
import Products12 from '../../../../assets/images/products/12.jpg';
import Products14 from '../../../../assets/images/products/14.jpg';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Form, Nav ,Row, Tab} from 'react-bootstrap';
import Select from 'react-select';
import { TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import { Link } from 'react-router-dom';

  const country = [
    { value: "Brazil", label: "Brazil" },
    { value: "Czech Republic", label: "Czech Republic" },
    { value: "Germany", label: "Germany" },
    { value: "Poland", label: "Poland" },
  
  ]

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
  const CheckOut = ({ local_varaiable }) => {

    const [activeTab, setactiveTab] = useState(1);
    const [progressbarvalue, setprogressbarvalue] = useState(0);
    const [passedSteps, setPassedSteps] = useState([1]);
    const [FiltercartData, setCartData] = useState<any>([])
    const [Price, setPrice] = useState(0)

    interface cart {
      id: number,
			preview: string,
			title: string,
			oldprice: string,
			newprice: string,
			data:string
    }
	let cartData : cart[] = [
		{
			id: Math.random(),
			preview: Products12,
			title: "Flowerpot",
			oldprice: "2498",
			newprice: "290",
			data:'Cosmetics'
		},
		{
			id: Math.random(),
			preview: Products14,
			title: "Mens Formal Red Shoes",
			oldprice: "2498",
			newprice: "124",
			data:'Shoe'
		},
	]

	function toggleTab(tab, value) {
		if (activeTab !== tab) {
			var modifiedSteps = [...passedSteps, tab];

			if (tab >= 1 && tab <= 6) {
				setactiveTab(tab);
				setPassedSteps(modifiedSteps);
			}
		}
		setprogressbarvalue(value);
	}

	function clickOut() {
		alert('logging successfully, click on next to continue for your order..');
	}


	useEffect(() => {
		
		if (local_varaiable == undefined) {
			
			setCartData(cartData)
			cartData.filter((ele) => {
				setPrice(Number(ele.newprice) + Price);
			})
		}
		else if (local_varaiable.length == 0) {
			
			setCartData(cartData)
			cartData.filter((ele) => {
				setPrice(Number(ele.newprice) + Price);
			})
		}
		else {
			
			setCartData(local_varaiable)
			local_varaiable.filter((ele) => {
				setPrice(Number(ele.newprice) + Price);
			})
		}
	}, [local_varaiable])
  return(
 
  <Fragment>
  <PageHeader  title="Checkout" />
  <Row>
    <Col xl={12}>
      <Card className="custom-card">
        <Card.Header>
          <Card.Title>
            <label className="main-content-label mb-2">Checkout</label>
          </Card.Title>
        </Card.Header>
        						<Card.Body>
							<Row>
								<Col lg={8} xl={6} className="mx-auto border p-xl-5 py-5 rounded-3">
									<div className="checkout-steps wrapper">
										<div id="checkoutsteps" className="">
                    <div className='steps clearfix'>
                        <div className='checkoutline'></div>
											<Nav as='ul' className="" role="tablist">
												<Nav.Item as='li' className="">
													<Nav.Link className={classnames({ active: activeTab === 1, done: activeTab <= 6 && activeTab >= 0 })} onClick={() => { toggleTab(1, 0); }}>
														<span className="number">1.</span>
                            Sign In
													</Nav.Link>
												</Nav.Item>
												<Nav.Item as='li' className="">
													<Nav.Link className={classnames({ active: activeTab === 2, done: activeTab <= 6 && activeTab > 1, })} onClick={() => { toggleTab(2, 25); }}>
														<i><span className="number">2.</span></i>
                            Billing
													</Nav.Link>
												</Nav.Item>
												<Nav.Item as='li' className="">
													<Nav.Link className={classnames({ active: activeTab === 3, done: activeTab <= 6 && activeTab > 2, })} onClick={() => { toggleTab(3, 50); }}>
														<i><span className="number">3.</span></i>
                            Order
													</Nav.Link>
												</Nav.Item>
												<Nav.Item as='li' className="">
													<Nav.Link className={classnames({ active: activeTab === 4, done: activeTab <= 6 && activeTab > 3, })} onClick={() => { toggleTab(4, 75); }}>
														<i><span className="number">4.</span></i>
                            Payments
													</Nav.Link>
												</Nav.Item>
												<Nav.Item as='li' className="">
													<Nav.Link className={classnames({ active: activeTab === 5, done: activeTab <= 6 && activeTab > 4, })} onClick={() => { toggleTab(5, 100); }}>
														<i><span className="number">5.</span></i>
                            Finished
													</Nav.Link>
												</Nav.Item>
											</Nav>
											<TabContent activeTab={activeTab}>
												<TabPane tabId={1}>
													<section>
														<Form>
															<h5 className="text-start mb-2">Signin to Your Account</h5>
															<p className="mb-4 text-muted tx-13 ms-0 text-start">Signin to create, discover and connect with the global community</p>
															<Form.Group className="text-start">
																<Form.Label>Email</Form.Label>
																<Form.Control className="form-control mb-3" placeholder="Enter your email" type="text" />
															</Form.Group>
															<Form.Group className="text-start">
																<Form.Label>Password</Form.Label>
																<Form.Control className="form-control mb-4" placeholder="Enter your password" type="password" />
															</Form.Group>
															<Button variant='primary' className="ripple btn-block mb-3" onClick={clickOut}>Sign In</Button>
														</Form>
													</section>
													<div className="d-flex align-items-start gap-3 mt-4">
														<Button variant="" disabled style={{ background: "#949eb7", color: "#fff" }} onClick={() => { toggleTab(activeTab - 1, 0); }}>Previous</Button>
														<Button variant="primary" className="ms-auto" onClick={() => { toggleTab(activeTab + 1, 25); }}>Next</Button>
													</div>
												</TabPane>
												<TabPane tabId={2}>
													<section>
														<Form className="needs-validation" noValidate>
															<h5 className="text-start mb-2">Billing Information</h5>
															<p className="mb-4 text-muted tx-13 ms-0 text-start">Lorem Ipsum has been the industry's standard dummy text ever since</p>
															<Row className="">
																<Col md={6} className="mb-3">
																	<Form.Label htmlFor="firstName">First name</Form.Label>
																	<Form.Control type="text" className="" id="firstName" required />
																	<Form.Control.Feedback type="invalid" className="invalid-feedback">Valid first name is required.</Form.Control.Feedback>
																</Col>
																<Col md={6} className="mb-3">
																	<Form.Label htmlFor="lastName">Last name</Form.Label>
																	<Form.Control type="text" className="" id="lastName" required />
																	<Form.Control.Feedback type="invalid" className="invalid-feedback">Valid last name is required.</Form.Control.Feedback>
																</Col>
															</Row>
															<div className="mb-3">
																<Form.Label htmlFor="address">Address</Form.Label>
																<Form.Control type="text" className="" id="address" placeholder="1234 Main St" required />
																<Form.Control.Feedback type="invalid" className="invalid-feedback">Please enter your shipping address.</Form.Control.Feedback>
															</div>
															<div className="mb-3">
																<Form.Label htmlFor="address2">Address 2 <span className="text-muted">(Optional)</span>
																</Form.Label>
																<Form.Control type="text" className="" id="address2" placeholder="Apartment or suite" />
															</div>
															<div className="mb-3">
																<Form.Label htmlFor="mobile">Mobile Number</Form.Label>
																<Form.Control type="number" className="" id="mobile" />
															</div>
															<Row className="">
																<Col md={5} className="mb-3">
																	<Form.Label className="">Country</Form.Label>
																	<Select classNamePrefix="Select-sm Select2" options={country} placeholder='Select Country' />
																	<Form.Control.Feedback type="invalid" className="invalid-feedback">Please select a valid country.</Form.Control.Feedback>
																</Col>
																<Col md={4} className="mb-3">
																	<Form.Label className="">State</Form.Label>
																	<Select classNamePrefix="Select-sm Select2" options={country} placeholder='Select State' />
																	<Form.Control.Feedback type="invalid" className="invalid-feedback">Please provide a valid state.</Form.Control.Feedback>
																</Col>
																<Col md={3} className="mb-3">
																	<Form.Label htmlFor="zip">Zip</Form.Label>
																	<Form.Control type="number" className="" id="zip" required />
																	<Form.Control.Feedback type="invalid" className="invalid-feedback">Zip code required.</Form.Control.Feedback>
																</Col>
															</Row>
															<hr className="mb-4" />
															<Button size='lg' variant='primary' className="btn-block">Continue to checkout</Button>
														</Form>
													</section>
													<div className="d-flex align-items-start gap-3 mt-4">
														<Button variant="primary" className="" onClick={() => { toggleTab(activeTab - 1, 0); }}>Previous</Button>
														<Button variant="success" className="ms-auto" onClick={() => { toggleTab(activeTab + 1, 50); }}>Next</Button>
													</div>
												</TabPane>
												<TabPane tabId={3}>
													<section>
														<h5 className="text-start mb-2">Your Order</h5>
														<p className="mb-4 text-muted tx-13 ms-0 text-start">Lorem Ipsum has been the industry's standard dummy text ever since</p>
														<div className="product">
															{FiltercartData.map((ele) => {
																return (
																	<div className="item flex-wrap" key={Math.random()}>
																		<div className="left"> <Link to="#" className="thumb radius"><img src={ele.preview} alt="" className="radius" /></Link>
																			<div className="purchase">
																				<h6><Link to="#">{ele.data}</Link></h6>
                                        <div>1</div>
																			</div>
																		</div> <span className="price tx-20">${ele.newprice}</span>
																	</div>)
															})}
														</div>
														<div className="checkout">
															<div className="subtotal"> <span className="heading">Subtotal</span> <span className="total tx-20 font-weight-bold">${local_varaiable == undefined ? 379 : Price - 35}</span> </div>
														</div>
													</section>

													<div className="d-flex align-items-start mt-4">
														<Button variant="primary" className="" onClick={() => { toggleTab(activeTab - 1, 25); }}>Previous</Button>
														<Button variant="success" className="ms-auto" onClick={() => { toggleTab(activeTab + 1, 75); }}>Next</Button>
													</div>
												</TabPane>
												<TabPane tabId={4}>
                          <Card>
            <Card.Header>
              <Card.Title>Payment Information</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="card-pay">
              <Tab.Container id="fill-tab-example" defaultActiveKey="first">
      
          <Nav as='ul' variant="pills" className="tabs-menu nav mb-4">
            <Nav.Item as='li'>
              <Nav.Link eventKey="first"><i className="fa fa-credit-card me-2"></i>Credit Card</Nav.Link>
            </Nav.Item>
            <Nav.Item as='li'>
              <Nav.Link eventKey="second"><i className="fa fa-paypal me-2"></i>Paypal</Nav.Link>
            </Nav.Item>
            <Nav.Item as='li'> 
              <Nav.Link eventKey="third"><i className="fa fa-university me-2"></i>Bank Offers</Nav.Link>
            </Nav.Item>
          </Nav>
        
          <Tab.Content>
            <Tab.Pane eventKey="first">
            <div className="tab-pane active show" id="tab20">
                        <div className="bg-danger-transparent-2 text-danger px-4 py-2 br-3 mb-4" role="alert">Please Enter Valid Details</div>
                        <Form.Group>
                          <Form.Label className="form-label mt-2">CardHolder Name</Form.Label>
                          <Form.Control type="text" className="form-control"
                            placeholder="First Name" />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label className="form-label mt-2">Card number</Form.Label>
                          <div className="input-group">
                            <Form.Control type="text" className="form-control" id="InputGroup"
                              placeholder="Search for..." />
                            <Button className="btn btn-secondary box-shadow-0"
                              type="button"><i className="fa fa-cc-visa"></i> &nbsp;
                              <i className="fa fa-cc-amex"></i> &nbsp;
                              <i className="fa fa-cc-mastercard"></i></Button>
                          </div>
                        </Form.Group>
                        <Row>
                          <Col sm={8}>
                            <Form.Group>
                              <Form.Label className='mt-3'>Expiration</Form.Label>
                              <div className="input-group mb-3">
                                <Form.Control type="number" className="form-control"
                                  placeholder="MM" name="Month" />
                                <Form.Control type="number" className="form-control"
                                  placeholder="YY" name="Year" />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col sm={4}>
                            <Form.Group>
                              <Form.Label className='mt-3'>CVV
                                <span className="form-help m-0 ms-1" data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  title="Don't Share your CVV with others">? </span>
                               
                              </Form.Label>
                              <Form.Control type="number" className="form-control" />
                            </Form.Group>
                          </Col>
                        </Row>

                      </div>
            </Tab.Pane>
            <Tab.Pane eventKey="second">
            <div className="tab-pane" id="tab21">
                      <p>Paypal is easiest way to pay online</p>
                      <p>
                        <Link to="#" className="btn btn-primary">
                          <i className="fa fa-paypal"></i> Log in my Paypal
                        </Link>
                      </p>
                      <p className="mb-0">
                        <strong>Note:</strong> Nemo enim ipsam voluptatem quia
                        voluptas sit aspernatur aut odit aut fugit, sed quia
                        consequuntur magni dolores eos qui ratione voluptatem
                        sequi nesciunt.
                      </p>
                    </div>
            </Tab.Pane>
            <Tab.Pane eventKey="third">
            <div className="tab-pane" id="tab22">
                      <p>Bank account details</p>
                      <dl className="card-text">
                        <dt>BANK: </dt>
                        <dd> THE UNION BANK 0456</dd>
                      </dl>
                      <dl className="card-text">
                        <dt>Account Number: </dt>
                        <dd> 67542897653214</dd>
                      </dl>
                      <dl className="card-text">
                        <dt>IBAN: </dt>
                        <dd>543218769</dd>
                      </dl>
                      <p className="mb-0">
                        <strong>Note:</strong> Nemo enim ipsam voluptatem quia
                        voluptas sit aspernatur aut odit aut fugit, sed quia
                        consequuntur magni dolores eos qui ratione voluptatem
                        sequi nesciunt.
                      </p>
                    </div>
            </Tab.Pane>
          </Tab.Content>
     
    </Tab.Container>
              </div>

            </Card.Body>
          </Card>
													<div className="d-flex align-items-start gap-3 mt-4">
														<Button
															variant=""
															type="button"
															className="btn btn-primary"
															onClick={() => {
																toggleTab(activeTab - 1, 50);
															}}
														>
															Previous
														</Button>
														<Button
															variant=""
															type="button"
															className="btn btn-success ms-auto"
															onClick={() => {
																toggleTab(activeTab + 1, 100);
															}}
														>
															Next
														</Button>
													</div>
												</TabPane>
											<TabPane tabId={5}>
													<h4>Finished</h4>
													<section className="text-center">
														<div className="">
															<h5 className="text-center mb-4">Your order Confirmed!</h5>
														</div>
														<svg className="wd-8 ht-8 mx-auto justify-content-center mb-3 text-center" style={{width:'15%', height:'15%'}} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
															<circle className="path circle" fill="none" stroke="#22c03c" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
															<polyline className="path check" fill="none" stroke="#22c03c" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
														</svg>
														<p className="success pl-5 pr-5">Order placed successfully. Your order will be dispacted soon. meanwhile you can track your order in my order section.</p>
													</section>
													<div className="d-flex align-items-start gap-3 mt-4">
														<Button variant="primary" className="" onClick={() => { toggleTab(activeTab - 1, 75); }}>Previous</Button>
														<Button variant="primary" className="ms-auto" onClick={() => { toggleTab(activeTab - 4, 0); }}>Order Again</Button>
													</div>
												</TabPane>
											</TabContent>
</div>
										</div>
									</div>
								</Col>
							</Row>
						</Card.Body>
      </Card>
    </Col>
  </Row>
</Fragment>
 )
 };

export default CheckOut;
