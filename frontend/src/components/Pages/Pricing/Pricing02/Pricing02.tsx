import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { prices, prices2 } from '../Pricing02/Data/Price02Data';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
interface Pricing02Props { }

const Pricing02: FC<Pricing02Props> = () => (
  <Fragment>
    <PageHeader title="Pricing 2" />
    <div className="row text-center mb-7">
      {prices2.map((price2) => (
        <div className={price2.data} key={Math.random()}>
          <div className="card plan-card shadow-none">
            <div>
              <div className="pt-4 pb-4">
                <i className={`fa fa-${price2.icon} plan-icon bg-${price2.color}`}></i>
                <h6 className={`text-uppercase font-weight-semibold text-${price2.color}`}>{price2.heading}
                </h6>
              </div>
              <div>
                <h1 className="plan-price padding-b-15 display-4 mb-0 font-weight-semibold">  {price2.class}
                  <span className="text-muted m-l-10 ms-3"><sup>Per Month</sup></span>
                </h1>
                <div className="plan-div-border"></div>
              </div>
              <div className="plan-features pb-4 mt-4 text-muted padding-t-b-30">
                <p><strong>{price2.text}</strong> FreeDomain Name</p>
                <p><strong>{price2.text1}</strong> One-Click Apps</p>
                <p><strong>{price2.text2}</strong> Databases</p>
                <p><strong>Money</strong> BackGuarntee</p>
                <p><strong>24/7</strong> Support</p>
                <Button href="#" className="btn btn-lg  mt-4" variant={price2.color}>Sign Up
                  Now</Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="br-7">
      <Row>
        <Col sm={6} lg={4}>
          <div className="card shadow-none overflow-hidden">
            <Card.Header className="bg-primary text-white align-items-center">
              <div className="card-title mx-auto text-center">
                <h3 className=" font-weight-semibold mt-3 mb-2">Team</h3>
                <div className="mb fs-13">$159 PER USER/MONTH</div>
                <p className="fs-12">billed anually</p>
              </div>
            </Card.Header>
            <Card.Body className="text-center px-0 pricing">
              <ul className="list-unstyled leading-loose">
                <li className="text-muted border-bottom"><strong>20 </strong> FreeDomain
                  Name
                </li>
                <li className="text-muted border-bottom"><span
                  className="text-primary fs-16 font-weight-bold me-1">New!</span>
                  <strong>16</strong> One-Click Apps
                </li>
                <li className="text-muted border-bottom"><strong>6</strong> Databases</li>
                <li className="text-muted border-bottom"><strong>Money</strong> BackGuarntee
                </li>
                <li className="text-muted border-bottom"><strong>24/7</strong> Support</li>
              </ul>
              <div className="text-center mt-5 px-5">
                <Link to="#"
                  className="btn btn-lg btn-outline-primary d-grid">Buy Now</Link>
              </div>
            </Card.Body>
          </div>
        </Col>
        <Col sm={6} lg={4}>
          <div className="card shadow-none plan-card border overflow-hidden">
            <Card.Header className="bg-success text-white align-items-center">
              <div className="card-title mx-auto text-center">
                <h3 className=" font-weight-semibold mt-3 mb-2">Personal</h3>
                <div className="mb fs-13">$29 PER USER/MONTH</div>
                <p className="fs-12">billed anually</p>
              </div>
            </Card.Header>
            <Card.Body className="text-center px-0 pricing">
              <ul className="list-unstyled leading-loose">
                <li className="text-muted border-bottom"><strong>5 </strong> FreeDomain Name
                </li>
                <li className="text-muted border-bottom"><strong>7</strong> One-Click Apps
                </li>
                <li className="text-muted border-bottom"><strong>6</strong> Databases</li>
                <li className="text-muted border-bottom"><span
                  className="text-success fs-16 font-weight-bold me-1">New!</span>
                  <strong>Money</strong> BackGuarntee
                </li>
                <li className="text-muted border-bottom"><strong>24/7</strong> Support</li>
              </ul>
              <div className="text-center mt-5 px-5">
                <Link to="#"
                  className="btn btn-lg btn-outline-success d-grid">Buy Now</Link>
              </div>
            </Card.Body>
          </div>
        </Col>
        <Col sm={12} lg={4}>
          <div className="card shadow-none overflow-hidden">
            <Card.Header className="bg-secondary text-white align-items-center">
              <div className="card-title mx-auto text-center">
                <h3 className=" font-weight-semibold mt-3 mb-2">Corporate</h3>
                <div className="mb fs-13">$49 PER USER/MONTH</div>
                <p className="fs-12">billed anually</p>
              </div>
            </Card.Header>
            <Card.Body className="text-center px-0 pricing">
              <ul className="list-unstyled leading-loose">
                <li className="text-muted border-bottom"><strong>12 </strong> FreeDomain
                  Name
                </li>
                <li className="text-muted border-bottom"><strong>10</strong> One-Click Apps
                </li>
                <li className="text-muted border-bottom"><strong>6</strong> Databases</li>
                <li className="text-muted border-bottom"><strong>Money</strong> BackGuarntee
                </li>
                <li className="text-muted border-bottom"><span
                  className="text-secondary fs-16 font-weight-bold me-1">New!</span>
                  <strong>24/7</strong> Support
                </li>
              </ul>
              <div className="text-center mt-5 px-5">
                <Link to="#"
                  className="btn btn-lg btn-outline-secondary d-grid">Buy Now</Link>
              </div>
            </Card.Body>
          </div>
        </Col>
      </Row>
    </div>
    <Row className="row pt-7">
      {prices.map((price) => (
        <div  className="col-xs-6 col-sm-6 col-xl-3 mt-2" key={Math.random()}>
          <div className="panel price panel-color bg-white">
            <div className={`panel-heading bg-${price.color} text-white p-0 pb-0 text-center`}>
              <h3>{price.heading}</h3>
            </div>
            <div className={`bg-${price.color}-transparent`}>
              <div className="panel-body text-center mb-3">
                <p className={`lead text-${price.color}`}><strong>{price.main} </strong>/ Month</p>
              </div>
              <ul className="text-center">
                <li className="mb-4"> <strong>{price.text}</strong> Free Domain Name</li>
                <li className="mb-4"><strong>{price.text1}</strong> One-Click Apps</li>
                <li className="mb-4"><strong> {price.text2} </strong>Databases</li>
                <li className="mb-4"><strong> Money </strong> BackGuarantee</li>
                <li className="mb-6"><strong> 24/7</strong> support</li>
              </ul>
              <div className={`panel-footer  bg-${price.color}-transparent text-center border-top-0`}>
                <Button className="btn btn-lg" href="#" variant={price.color}>Purchase Now!</Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Row>
  </Fragment>
);

export default Pricing02;
