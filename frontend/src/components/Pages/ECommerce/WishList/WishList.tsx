import React, { FC, Fragment, useState } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Pagination, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { images } from '../WishList/Data/WishlistData';

interface WishListProps { }

const WishList: FC<WishListProps> = () => {

  const [show, setshow] = useState(images);
  function handleRemove(id) {
		const RemoveData = show.filter((idx) => idx.id !== id);
		setshow(RemoveData);
	}
  function AddToCart(id: number) {
    throw new Error('Function not implemented.');
  }
  return(
  <Fragment>
  <PageHeader  title="Wishlist"/>
  <Col sm={12} lg={12} xl={12} className="p-0">
    <Row>
    {show.map((idx) => (
      <Col xxl={3} sm={6} xl={4} className="alert mb-0" key={Math.random()}>
        <Card className=" item-card ">
          <Card.Body className="pb-0">
            <div className="text-center zoom">
              <Link to={`${import.meta.env.BASE_URL}Pages/ecommerce/productsdetails`} ><img src={idx.src1}
                  alt="img" className="img-fluid w-100 br-7"/></Link>
            </div>
            <Card.Body className="ps-0 pb-3">
              <Row>
                <div className="col-10 mb-3">
                  <div className="cardtitle">
                    <div>
                      <Link to="#"><i
                          className="fa fa-star text-yellow fs-16"></i></Link>
                      <Link to="#"><i
                          className="fa fa-star text-yellow fs-16"></i></Link>
                      <Link to="#"><i
                          className="fa fa-star text-yellow fs-16"></i></Link>
                      <Link to="#"><i
                          className="fa fa-star-half text-yellow fs-16"></i></Link>
                      <Link to="#"><i
                          className="fa fa-star-o text-yellow fs-16"></i></Link>
                      <Link to="#">{idx.text}</Link>
                    </div>
                    <Link  to="#" className="shop-title fs-16">{idx.heading}</Link>
                  </div>
                </div>
                <div className="col-2">
                  <div className="cardprice">
                    <span className="type--strikethrough number-font">{idx.text}</span>
                    <span className="number-font">{idx.text1}</span>
                  </div>
                </div>
                <div>
                  <p className="shop-description fs-13 text-muted mb-0">All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.</p>
                </div>
              </Row>
            </Card.Body>
          </Card.Body>
          <div className="text-center pb-4 ps-2 pe-2">
            <Link to={`${import.meta.env.BASE_URL}Pages/ecommerce/shoppingcart`} className="btn btn-md btn-primary mb-2 ms-2 w-45 fs-14"><i
                className="fe fe-shopping-cart me-2"></i><span> Add Item</span></Link>
            <Link to="#" className="btn btn-md btn-light mb-2 ms-2 w-45 fs-14"  onClick={() => { handleRemove(idx.id) }} data-bs-dismiss="alert" aria-label="Close"><i
              className="fe fe-x me-2"></i><span> Remove</span></Link>
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
</Fragment>
)
  };

export default WishList;