import React, { FC, Fragment, useState } from 'react';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages';
import { Card, Col, Collapse, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import media2 from '../../../assets/images/media/2.jpg';
import media20 from '../../../assets/images/media/20.jpg';
import PageHeader from '../../../layout/Header/pageheader';
import { cardGroups, cardfooters, employeecards } from '../../../components/Elements/CardImages/Data/CardimagesData';
// interface CardImagesProps {}
function CardImages() {
    //show code 
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    //Card with Image
    const [ImageExpanded, setImageExpanded] = useState(true)

    const ImageHandleExpandClick = () => {
        setImageExpanded(!ImageExpanded)
    }
    const [Imageshow, setImageshow] = useState(true)
    //Card with Image1
    const [Image1Expanded, setImage1Expanded] = useState(true)

    const Image1HandleExpandClick = () => {
        setImage1Expanded(!Image1Expanded)
    }
    const [Image1show, setImage1show] = useState(true)
    //Employe card
    const [EmployeExpanded, setEmployeExpanded] = useState(true)

    const EmployeHandleExpandClick = () => {
        setEmployeExpanded(!EmployeExpanded)
    }
    const [Employeshow, setEmployeshow] = useState(true)
    //Employe1 card
    const [Employe1Expanded, setEmploye1Expanded] = useState(true)

    const Employe1HandleExpandClick = () => {
        setEmploye1Expanded(!Employe1Expanded)
    }
    const [Employe1show, setEmploye1show] = useState(true)

    return (
        <Fragment>
            <PageHeader title="Card Images" />
            <Card>
                <Card.Header>
                    <Card.Title className="card-title ">Card Group</Card.Title>
                    <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
                </Card.Header>
                <div className="card-group p-5">
                    {cardGroups.map((cardGroup) => (
                        <div key={Math.random()} className={`card shadow-none border ${cardGroup.data} overflow-hidden`}>
                            <img src={cardGroup.src1} alt="image" className="card-image1 " />
                            <Card.Body>
                                <Card.Title >Card title</Card.Title>
                                <Card.Text >{cardGroup.class}</Card.Text>
                                <Card.Text className="card-text"><small className="text-muted">Last updated 3 mins ago</small>
                                </Card.Text>
                            </Card.Body>
                        </div>
                    ))}

                </div>
                <Collapse in={show} className="">
                    <pre>
                        <code>
                            {`
 {cardGroups.map((cardGroup)=>(
    <div className="card shadow-none border border-end-0 overflow-hidden">
        <img src={cardGroup.src1} alt="image" className="card-image1 "/>
        <Card.Body>
            <Card.Title >Card title</Card.Title>
            <Card.Text >{cardGroup.class}</Card.Text>
            <Card.Text className="card-text"><small className="text-muted">Last updated 3 mins ago</small>
            </Card.Text>
        </Card.Body>
    </div>
    ))}
`}
                        </code>
                    </pre>
                </Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <Card.Title>Card Group Footers</Card.Title>
                    <Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
                </Card.Header>
                <div className="card-group p-5">
                    {cardfooters.map((cardfooter) => (
                        <div key={Math.random()} className={`card  overflow-hidden shadow-none border ${cardfooter.data}`}>
                            <img src={cardfooter.src1} alt="image" className="card-image1 " />
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>{cardfooter.class}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">Last updated 3 mins ago</small>
                            </Card.Footer>
                        </div>
                    ))}
                </div>
                <Collapse in={show1} className="">
                    <pre>
                        <code>
                            {`
  {cardfooters.map((cardfooter)=>(
    <div className="card  overflow-hidden shadow-none border border-end-0">
        <img src={cardfooter.src1} alt="image" className="card-image1 "/>
        <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text>{cardfooter.class}</Card.Text>
        </Card.Body>
        <Card.Footer>
            <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
    </div>
    ))}
`}
                        </code>
                    </pre>
                </Collapse>
            </Card>

            {/* <!--Row--> */}
            <Row>
                <Col md={6} lg={4}>
                    <Card className="overflow-hidden">
                        <img src={ImagesData("media2")} alt="image" className="card-image1 " />
                        <Card.Body>
                            <Card.Title className="card-title mb-3">Card title</Card.Title>
                            <Card.Text className="card-text">Some quick example text to build on the card title and make
                                upthe bulk of the card's content.</Card.Text>
                            <Link to="#" className="btn btn-primary">Read More</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="overflow-hidden">
                        <Card.Body>
                            <Card.Title className="card-title mb-3">Card title</Card.Title>
                            <p className="card-text">Some quick example text to build on the card title and make
                                up
                                the bulk of the card's content.</p>
                            <Link to="#" className="btn btn-primary">Read More</Link>
                        </Card.Body>
                        <img src={ImagesData("media1")} alt="image" className="card-image1 " />
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="overflow-hidden">
                        <img src={ImagesData("media5")} alt="image" className="card-image1 " />
                        <Card.Body>
                            <Card.Title className="card-title mb-3">Card title</Card.Title>
                            <Card.Text>Some quick example text to build on the card title and make
                                up
                                the bulk of the card's content.</Card.Text>
                        </Card.Body>
                        <Card.Footer>card footer</Card.Footer>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card>
                        <Card.Header>
                            <Card.Title>card header</Card.Title>
                        </Card.Header>
                        <img src={ImagesData("media6")} alt="image" className="card-image1 " />
                        <Card.Body>
                            <Card.Text>Some quick example text to build on the card title and make
                                up
                                the bulk of the card's content.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="overflow-hidden">
                        <img src={ImagesData("media10")} alt="image" className="card-image1 " />
                        <Card.Body>
                            <Card.Title>Card title</Card.Title>
                            <Card.Text>This is a wider card with supporting text below as a
                                natural
                                lead-in to additional content. This content is a little bit longer.</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="overflow-hidden">
                        <img src={ImagesData("media8")} alt="image" className="card-image1 " />
                        <Card.Body >
                            <Card.Title>Card title</Card.Title>
                            <Card.Text>This is a longer card with supporting text below as a
                                natural
                                lead-in to additional content. This content is a little bit longer.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} xl={6}>
                    <Card className="card card-blog-overlay1 border-0 overflow-hidden">
                        <Card.Body className='text-white'>
                            <Card.Title className="card-title text-white">card-with image</Card.Title>
                            Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
                            eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                            culpa
                            qui officia deserunt mollit anim id est laborum
                        </Card.Body>
                        <Card.Footer className="text-white z-index-10">
                            This is Basic card footer
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md={12} xl={6}>
                    <Card className="card card-blog-overlay2 border-0 overflow-hidden">
                        <Card.Body className="text-white">
                            <Card.Title className="card-title text-white">card-with image</Card.Title>
                            Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
                            eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                            culpa
                            qui officia deserunt mollit anim id est laborum
                        </Card.Body>
                        <Card.Footer className="text-white z-index-10">
                            This is Basic card footer
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md={12} xl={6}>
                    {Imageshow ?
                        <Card className="card-blog-overlay " key={Math.random()}>
                            <Card.Header className=" z-index-10">
                                <Card.Title className="card-title text-white">card-with image</Card.Title>
                                <div className="card-options">
                                    <Link to="#" onClick={ImageHandleExpandClick} className="card-options-collapse me-2"
                                        data-bs-toggle="card-collapse"><i className={`fe ${ImageExpanded ? 'fe fe-chevron-up text-white' : 'fe fe-chevron-down text-white'}`}></i></Link>
                                    <Link to="#" onClick={() => setImageshow(false)} className="card-options-remove"
                                        data-bs-toggle="card-remove"><i className="fe fe-x text-white"></i></Link>
                                </div>
                            </Card.Header>
                            <Collapse in={ImageExpanded} timeout={3000}>
                                <Card.Body className="text-white">
                                    Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore
                                    eu
                                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                    culpa
                                    qui officia deserunt mollit anim id est laborum
                                </Card.Body>
                            </Collapse>
                        </Card>
                        : null}
                </Col>
                <Col md={12} xl={6}>
                    {Image1show ?
                        <Card key={Math.random()}>
                            <Card.Header>
                                <Card.Title className="card-title ">card-with image</Card.Title>
                                <div className="card-options">
                                    <Link to="#" onClick={Image1HandleExpandClick} className="card-options-collapse me-2"
                                        data-bs-toggle="card-collapse"><i className={`${Image1Expanded ? "fe fe-chevron-up " : "fe fe-chevron-down "}`}></i></Link>
                                    <Link to="#" onClick={() => setImage1show(false)} className="card-options-remove"
                                        data-bs-toggle="card-remove"><i className="fe fe-x "></i></Link>
                                </div>
                            </Card.Header>
                            <Collapse in={Image1Expanded} timeout={3000}>
                                <div>
                                    <Card.Body className="text-white card-blog-overlay1 h-9 w-100">
                                    </Card.Body>
                                    <Card.Body>
                                        Duis aute irure dolor
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>
                        : null}
                </Col>
                <Col md={12} xl={6}>
                    <Card className="card-aside">
                        <Card.Body className="">
                            <h4><Link to="#">Play Music</Link></h4>
                            <div className="text-muted">Some quick example text to build on the card title and
                                make
                                up the bulk of the card's</div>
                            <div className="d-flex align-items-center pt-5 mt-auto text-center ">
                                <div className="text-muted">
                                    <Link to="#"
                                        className="icon d-none d-md-inline-block ms-3"><i
                                            className="fa fa-step-backward"></i></Link>
                                    <Link to="#"
                                        className="icon d-none d-md-inline-block ms-3"><i
                                            className="fa fa-play "></i></Link>
                                    <Link to="#"
                                        className="icon d-none d-md-inline-block ms-3"><i
                                            className="fa fa-step-forward"></i></Link>
                                </div>
                            </div>
                        </Card.Body>
                        <img className="card-aside-column br-te-7 br-be-7 w-50"
                            src={media2} />

                    </Card>
                </Col>
                <Col md={12} xl={6}>
                    <Card className=" card-aside bg-primary">
                        <Card.Body className="">
                            <h4><Link to="#" className="text-white">Play Music</Link></h4>
                            <div className="text-white">Some quick example text to build on the card title and
                                make
                                up the bulk of the card's </div>
                            <div className="d-flex align-items-center pt-5 mt-auto text-center ">
                                <div className="text-muted">
                                    <Link to="#"
                                        className="icon d-none d-md-inline-block ms-3"><i
                                            className="fa fa-step-backward text-white"></i></Link>
                                    <Link to="#"
                                        className="icon d-none d-md-inline-block ms-3"><i
                                            className="fa fa-play text-white "></i></Link>
                                    <Link to="#"
                                        className="icon d-none d-md-inline-block ms-3"><i
                                            className="fa fa-step-forward text-white"></i></Link>
                                </div>
                            </div>
                        </Card.Body>
                        <img className="card-aside-column br-te-7 br-be-7 w-50"
                            src={media20} />
                    </Card>
                </Col>

                <Col md={12} lg={6} key={Math.random()}>
                    {Employeshow ?
                        <Card>
                            <Card.Header>
                                <Card.Title className="card-title ">Employee card</Card.Title>
                                <div className="card-options">
                                    <Link to="#" onClick={EmployeHandleExpandClick} className="card-options-collapse me-2"
                                        data-bs-toggle="card-collapse"><i className={`${EmployeExpanded ? "fe fe-chevron-up" : "fe fe-chevron-down"}`}></i></Link>
                                    <Link to="#" onClick={() => setEmployeshow(false)} className="card-options-remove me-2"
                                        data-bs-toggle="card-remove"><i className="fe fe-x "></i></Link>
                                </div>
                            </Card.Header>
                            <Collapse in={EmployeExpanded} timeout={3000}>
                                <div>

                                    <Card.Body className=" text-center">

                                        <img src={ImagesData("users16")} className="avatar avatar-xxl brround"
                                            alt="" />
                                        <h4 className="h4 mb-0 mt-3 font-weight-bold">James thomas</h4>
                                        <Card.Text className="card-text text-muted">Web designer</Card.Text>

                                    </Card.Body>

                                </div>
                            </Collapse>
                        </Card>
                        : null}
                </Col>

                <Col md={12} lg={6}>
                    {Employe1show ?
                        <Card>
                            <Card.Header>
                                <Card.Title className="card-title ">Employee card</Card.Title>
                                <div className="card-options">
                                    <Link to="#" onClick={Employe1HandleExpandClick} className="card-options-collapse me-2"
                                        data-bs-toggle="card-collapse"><i className={`${Employe1Expanded ? "fe fe-chevron-up" : "fe fe-chevron-down"}`}></i></Link>
                                    <Link to="#" onClick={() => setEmploye1show(false)} className="card-options-remove"
                                        data-bs-toggle="card-remove"><i className="fe fe-x "></i></Link>
                                </div>
                            </Card.Header>
                            <Collapse in={Employe1Expanded} timeout={3000}>
                                <Card.Body className=" text-center">
                                    <img src={ImagesData("users10")} className="avatar avatar-xxl brround"
                                        alt="" />
                                    <h4 className="h4 mb-0 mt-3 font-weight-bold">Rebacca Thomas</h4>
                                    <p className="text-muted">Web designer</p>
                                </Card.Body>
                            </Collapse>
                        </Card>
                        : null}
                </Col>
            </Row>
        </Fragment>

    );
}

export default CardImages;
