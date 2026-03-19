import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Dropdown, Form, InputGroup, ListGroup, Nav, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface BlogDetailsProps { }

const BlogDetails: FC<BlogDetailsProps> = () => (
    <Fragment>
        <PageHeader title="Blog Details" />
        <Row>
            <Col xl={8}>
                <Card>
                    <img className="card-img-blog-details" src={ImagesData("media25")}
                        alt="Card image cap" />
                    <Card.Body>
                        <div className="d-md-flex">
                            <Link to="#" className="d-flex me-4 mb-2"><i
                                className="fe fe-calendar fs-16 me-1 p-3 bg-info-transparent text-secondary bradius"></i>
                                <div className="mt-0 mt-3 ms-1 text-muted font-weight-semibold">Sep-25-2021
                                </div>
                            </Link>
                            <Link to={`${import.meta.env.BASE_URL}pages/profile/profile01`} className="d-flex mb-2"><i
                                className="fe fe-user fs-16 me-1 p-3 bg-primary-transparent text-primary bradius"></i>
                                <div className="mt-0 mt-3 ms-1 text-muted font-weight-semibold">Harry Fisher
                                </div>
                            </Link>
                            <div className="ms-auto">
                                <Link to="#" className="d-flex mb-2"><i
                                    className="fe fe-message-square fs-16 me-1 p-3 bg-success-transparent text-success bradius"></i>
                                    <div className="mt-0 mt-3 ms-1 text-muted font-weight-semibold">13
                                        Comments
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </Card.Body>
                    <Card.Body>
                        <h3><a href="#"> Voluptatem quia voluptas</a></h3>
                        <p className="card-text">Some quick example text to build on the card title and make
                            up
                            the bulk of the card's content.</p>
                        <p> Lorem ipsum dolor sit amet, quis Neque porro quisquam est, nostrud
                            exercitation
                            ullamco laboris commodo consequat. There’s an old maxim that states, “No fun
                            for
                            the writer, no fun for the reader.”No matter what industry
                            you’re working in, as a blogger, you should live and die by this statement.
                        </p>
                        <p>I must explain to you how all this mistaken idea of denouncing pleasure and
                            praising pain was born and I will give you a complete account of the system,
                            and
                            expound the actual teachings of the great explorer of the
                            truth, the master-builder of human happiness. No one rejects, dislikes, or
                            avoids pleasure itself, because it is pleasure.</p>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header>
                        <Card.Title>Comments</Card.Title>
                    </Card.Header>
                    <Card.Body className="pb-0">
                        <div className="media mb-5 overflow-visible d-block d-sm-flex">
                            <div className="me-3 mb-2">
                                <Link to={`${import.meta.env.BASE_URL}pages/profile/profile01`}> <img
                                    className="media-object rounded-circle thumb-sm" alt="64x64"
                                    src={ImagesData("users5")} /> </Link>
                            </div>
                            <div className="media-body overflow-visible">
                                <div className="border mb-5 p-4 br-5">
                                    <Nav className="nav float-end">
                                        <Dropdown>
                                            <Dropdown.Toggle as="a" className="nav-link text-muted fs-16 p-0 ps-4 no-caret"
                                                data-bs-toggle="dropdown"
                                                role="button" aria-haspopup="true"
                                                aria-expanded="false"><i
                                                    className="fe fe-more-vertical"></i></Dropdown.Toggle>
                                            <Dropdown.Menu className="dropdown-menu-end">
                                                <Dropdown.Item><i
                                                    className="fe fe-edit mx-1"></i> Edit</Dropdown.Item>
                                                <Dropdown.Item><i
                                                    className="fe fe-corner-up-left mx-1"></i> Reply</Dropdown.Item>
                                                <Dropdown.Item><i
                                                    className="fe fe-flag mx-1"></i> Report Abuse</Dropdown.Item>
                                                <Dropdown.Item><i
                                                    className="fe fe-trash-2 mx-1"></i> Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Nav>
                                    <h5 className="mt-0">Gavin Murray</h5>
                                    <span><i className="fe fe-thumb-up text-danger"></i></span>
                                    <p className="font-13 text-muted">Lorem ipsum dolor sit amet, quis Neque
                                        porro quisquam est, nostrud exercitation ullamco laboris commodo
                                        consequat. There’s an old maxim that states, “No fun for the
                                        writer,
                                        no fun for the reader.”No matter
                                        what industry you’re working in, as a blogger, you should live
                                        and
                                        die by this statement.</p>
                                    <Link className="like me-1" to="">
                                        <span
                                            className="badge bg-danger-transparent rounded-pill py-2 px-3">
                                            <i className="fe fe-heart me-1"></i>56</span>
                                    </Link>
                                    <span className="reply" id="1">
                                        <Link to=""><span
                                            className="badge btn-pill bg-primary-transparent py-2 px-3"><i
                                                className="fe fe-corner-up-left mx-1"></i>Reply</span></Link>
                                    </span>
                                </div>
                                <div className="media mb-5 overflow-visible">
                                    <div className="me-3">
                                        <Link to={`${import.meta.env.BASE_URL}pages/profile/profile01`}> <img
                                            className="media-object rounded-circle thumb-sm" alt="64x64"
                                            src={ImagesData("users2")} /> </Link>
                                    </div>
                                    <div className="media-body border p-4 overflow-visible br-5">
                                        <Nav className="nav float-end">
                                            <Dropdown>
                                                <Dropdown.Toggle as="a" className="nav-link text-muted fs-16 p-0 ps-4 no-caret"
                                                    data-bs-toggle="dropdown"
                                                    role="button" aria-haspopup="true"
                                                    aria-expanded="false"><i
                                                        className="fe fe-more-vertical"></i></Dropdown.Toggle>
                                                <Dropdown.Menu className="dropdown-menu-end">
                                                    <Dropdown.Item><i
                                                        className="fe fe-edit mx-1"></i> Edit</Dropdown.Item>
                                                    <Dropdown.Item><i
                                                        className="fe fe-corner-up-left mx-1"></i> Reply</Dropdown.Item>
                                                    <Dropdown.Item><i
                                                        className="fe fe-flag mx-1"></i> Report Abuse</Dropdown.Item>
                                                    <Dropdown.Item><i
                                                        className="fe fe-trash-2 mx-1"></i> Delete</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Nav>
                                        <h5 className="mt-0">Mozelle Belt</h5>
                                        <span><i className="fe fe-thumb-up text-danger"></i></span>
                                        <p className="font-13 text-muted">Nostrud exercitation ullamco
                                            laboris
                                            commodo consequat. There’s an old maxim that states, “No fun
                                            for
                                            the writer, no fun for the reader.”No matter what industry
                                            you’re working in, as a blogger, you should
                                            live and die by this statement.</p>
                                        <Link className="like me-1" to="#"><span
                                            className="badge bg-danger-transparent btn-pill py-2 px-3"><i
                                                className="fe fe-heart me-1"></i>56</span></Link>
                                        <span className="reply" id="2">
                                            <Link to=""><span
                                                className="badge bg-primary-transparent btn-pill py-2 px-3"><i
                                                    className="fe fe-corner-up-left mx-1"></i>Reply</span></Link>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="media mb-5 overflow-visible">
                            <div className="me-3">
                                <Link to={`${import.meta.env.BASE_URL}pages/profile/profile01`}> <img
                                    className="media-object rounded-circle thumb-sm" alt="64x64"
                                    src={ImagesData("users15")} /> </Link>
                            </div>
                            <div className="media-body overflow-visible">
                                <div className="border mb-5 p-4 br-5">
                                    <Nav className="nav float-end">
                                        <Dropdown>
                                            <Dropdown.Toggle as="a" className="nav-link text-muted fs-16 p-0 ps-4 no-caret"
                                                data-bs-toggle="dropdown"
                                                role="button" aria-haspopup="true"
                                                aria-expanded="false"><i
                                                    className="fe fe-more-vertical"></i></Dropdown.Toggle>
                                            <Dropdown.Menu className="dropdown-menu-end">
                                                <Dropdown.Item><i
                                                    className="fe fe-edit mx-1"></i> Edit</Dropdown.Item>
                                                <Dropdown.Item><i
                                                    className="fe fe-corner-up-left mx-1"></i> Reply</Dropdown.Item>
                                                <Dropdown.Item><i
                                                    className="fe fe-flag mx-1"></i> Report Abuse</Dropdown.Item>
                                                <Dropdown.Item><i
                                                    className="fe fe-trash-2 mx-1"></i> Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Nav>
                                    <h5 className="mt-0">Paul Smith</h5>
                                    <p className="font-13 text-muted">Very nice ! On the other hand, we
                                        denounce
                                        with righteous indignation and dislike men who are so beguiled
                                        and
                                        demoralized by the </p>
                                    <Link className="like me-1" to="#"><span
                                        className="badge bg-danger-transparent btn-pill py-2 px-3"><i
                                            className="fe fe-heart me-1"></i>56</span></Link>
                                    <span className="reply" id="3">
                                        <Link to="#"><span
                                            className="badge bg-primary-transparent btn-pill py-2 px-3"><i
                                                className="fe fe-corner-up-left mx-1"></i>Reply</span></Link>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="media mb-5 overflow-visible d-block d-sm-flex">
                            <div className="me-3 mb-1">
                                <Link to={`${import.meta.env.BASE_URL}pages/profile/profile01`}> <img
                                    className="media-object rounded-circle thumb-sm" alt="64x64"
                                    src={ImagesData("users5")} /> </Link>
                            </div>
                            <div className="media-body overflow-visible">
                                <div className="border mb-5 p-4 br-5">
                                    <Nav className="nav float-end">
                                        <Dropdown>
                                            <Dropdown.Toggle as="a" className="nav-link text-muted fs-16 p-0 ps-4 no-caret"
                                                data-bs-toggle="dropdown"
                                                role="button" aria-haspopup="true"
                                                aria-expanded="false"><i
                                                    className="fe fe-more-vertical"></i></Dropdown.Toggle>
                                            <Dropdown.Menu className="dropdown-menu-end">
                                                <Dropdown.Item><i
                                                    className="fe fe-edit mx-1"></i> Edit</Dropdown.Item>
                                                <Dropdown.Item><i
                                                    className="fe fe-corner-up-left mx-1"></i> Reply</Dropdown.Item>
                                                <Dropdown.Item><i
                                                    className="fe fe-flag mx-1"></i> Report Abuse</Dropdown.Item>
                                                <Dropdown.Item><i
                                                    className="fe fe-trash-2 mx-1"></i> Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Nav>
                                    <h5 className="mt-0">Gavin Murray</h5>
                                    <span><i className="fe fe-thumb-up text-danger"></i></span>
                                    <p className="font-13 text-muted">Lorem ipsum dolor sit amet, quis Neque
                                        porro quisquam est, nostrud exercitation ullamco laboris commodo
                                        consequat. There’s an old maxim that states, “No fun for the
                                        writer,
                                        no fun for the reader.”No matter
                                        what industry you’re working in, as a blogger, you should live
                                        and
                                        die by this statement.</p>
                                    <Link className="like me-1" to="#"><span
                                        className="badge bg-danger-transparent btn-pill py-2 px-3"><i
                                            className="fe fe-heart me-1"></i>56</span></Link>
                                    <span className="reply" id="4">
                                        <Link to="#"><span
                                            className="badge bg-primary-transparent btn-pill py-2 px-3"><i
                                                className="fe fe-corner-up-left mx-1"></i>Reply</span></Link>
                                    </span>
                                </div>
                                <div className="media mb-5 overflow-visible d-block d-sm-flex">
                                    <div className="me-3 mb-1">
                                        <Link to={`${import.meta.env.BASE_URL}pages/profile/profile01`}> <img
                                            className="media-object rounded-circle thumb-sm" alt="64x64"
                                            src={ImagesData("users2")} /> </Link>
                                    </div>
                                    <div className="media-body overflow-visible">
                                        <div className="border p-4 mb-5 br-5">
                                            <Nav className="nav float-end">
                                                <Dropdown>
                                                    <Dropdown.Toggle as="a" className="nav-link text-muted fs-16 p-0 ps-4 no-caret"
                                                        data-bs-toggle="dropdown"
                                                        role="button" aria-haspopup="true"
                                                        aria-expanded="false"><i
                                                            className="fe fe-more-vertical"></i></Dropdown.Toggle>
                                                    <Dropdown.Menu className="dropdown-menu-end">
                                                        <Dropdown.Item><i
                                                            className="fe fe-edit mx-1"></i> Edit</Dropdown.Item>
                                                        <Dropdown.Item><i
                                                            className="fe fe-corner-up-left mx-1"></i> Reply</Dropdown.Item>
                                                        <Dropdown.Item><i
                                                            className="fe fe-flag mx-1"></i> Report Abuse</Dropdown.Item>
                                                        <Dropdown.Item><i
                                                            className="fe fe-trash-2 mx-1"></i> Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Nav>
                                            <h5 className="mt-0">Mozelle Belt</h5>
                                            <span><i className="fe fe-thumb-up text-danger"></i></span>
                                            <p className="font-13 text-muted">Nostrud exercitation ullamco
                                                laboris commodo consequat. There’s an old maxim that
                                                states,
                                                “No fun for the writer, no fun for the reader.”No matter
                                                what industry you’re working in, as a blogger, you
                                                should live and die by this statement.</p>
                                            <Link className="like me-1" to="#"><span
                                                className="badge bg-danger-transparent btn-pill py-2 px-3"><i
                                                    className="fe fe-heart me-1"></i>56</span></Link>
                                            <span className="reply" id="5">
                                                <Link to="#"><span
                                                    className="badge bg-primary-transparent btn-pill py-2 px-3"><i
                                                        className="fe fe-corner-up-left mx-1"></i>Reply</span></Link>
                                            </span>
                                        </div>
                                        <div className="media overflow-visible">
                                            <div className="me-3">
                                                <Link to={`${import.meta.env.BASE_URL}pages/profile/profile01`}> <img
                                                    className="media-object rounded-circle thumb-sm"
                                                    alt="64x64"
                                                    src={ImagesData("users9")} />
                                                </Link>
                                            </div>
                                            <div className="media-body border p-4 overflow-visible br-5">
                                                <Nav className="nav float-end">
                                                    <Dropdown>
                                                        <Dropdown.Toggle as="a" className="nav-link text-muted fs-16 p-0 ps-4 no-caret"
                                                            data-bs-toggle="dropdown"
                                                            role="button" aria-haspopup="true"
                                                            aria-expanded="false"><i
                                                                className="fe fe-more-vertical"></i></Dropdown.Toggle>
                                                        <Dropdown.Menu className="dropdown-menu-end">
                                                            <Dropdown.Item><i
                                                                className="fe fe-edit mx-1"></i> Edit</Dropdown.Item>
                                                            <Dropdown.Item><i
                                                                className="fe fe-corner-up-left mx-1"></i> Reply</Dropdown.Item>
                                                            <Dropdown.Item><i
                                                                className="fe fe-flag mx-1"></i> Report Abuse</Dropdown.Item>
                                                            <Dropdown.Item><i
                                                                className="fe fe-trash-2 mx-1"></i> Delete</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </Nav>
                                                <h5 className="mt-0">Paul Smith</h5>
                                                <span><i className="fe fe-thumb-up text-danger"></i></span>
                                                <p className="font-13 text-muted">Nostrud exercitation
                                                    ullamco
                                                    laboris commodo consequat. There’s an old maxim that
                                                    states, “No fun for the writer, no fun for the
                                                    reader.”No matter what industry you’re working in,
                                                    as a
                                                    blogger,
                                                    you should live and die by this statement.</p>
                                                <Link className="like me-1" to="#"><span
                                                    className="badge bg-danger-transparent rounded-pill py-2 px-3"><i
                                                        className="fe fe-heart me-1"></i>56</span></Link>
                                                <span className="reply" id="6">
                                                    <Link to="#"><span
                                                        className="badge bg-primary-transparent rounded-pill py-2 px-3"><i
                                                            className="fe fe-corner-up-left mx-1"></i>Reply</span></Link>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header>
                        <Card.Title>Add a Comments</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form className="form-horizontal  m-t-20">
                            <Form.Group>
                                <Col xs={12}>
                                    <Form.Control className="mt-3" type="text"
                                        placeholder="Username*" />
                                </Col>
                            </Form.Group>
                            <Form.Group>
                                <Col xs={12}>
                                    <Form.Control className='mt-3' type="email"
                                        placeholder="Email*" />
                                </Col>
                            </Form.Group>
                            <Form.Group>
                                <Col xs={12}>
                                    <Form.Control as='textarea' rows={4} className="mb-3 mt-3" />
                                </Col>
                            </Form.Group>
                            <div>
                                <Button href="#"
                                    className="btn btn-rounded  waves-effect waves-light" variant='primary'>Submit</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col xl={4}>
                <Card>
                    <Card.Body>
                        <InputGroup>
                            <Form.Control type="text" className="form-control border-end-0"
                                placeholder="Search ..." />
                            <Button className="btn input-group-text border-start-0" variant='primary'>
                                <i className="fe fe-search" aria-hidden="true"></i>
                            </Button>
                        </InputGroup>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>Categories</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <ListGroup>
                            <ListGroup.Item className="border-0 p-0"><Link to="#"><i
                                className="fe fe-chevron-right"></i> Development</Link> <span
                                    className="product-label">22</span> </ListGroup.Item>
                            <ListGroup.Item className="border-0 p-0"><Link to="#"><i
                                className="fe fe-chevron-right"></i> Web Design</Link> <span
                                    className="product-label">15</span> </ListGroup.Item>
                            <ListGroup.Item className="border-0 p-0"><Link to="#"><i
                                className="fe fe-chevron-right"></i> Technology</Link> <span
                                    className="product-label">10</span> </ListGroup.Item>
                            <ListGroup.Item className="border-0 p-0"><Link to="#"><i
                                className="fe fe-chevron-right"></i> Sports</Link> <span
                                    className="product-label">88</span> </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>Professional Blog Writers</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div>
                            <div className="d-flex overflow-visible">
                                <img className="avatar br-5 avatar-xl me-3"
                                    src={ImagesData("users1")} alt="avatar-img" />
                                <div className="media-body valign-middle">
                                    <Link to={`${import.meta.env.BASE_URL}pages/profile/profile01`} className="fw-semibold text-body">Simon Sais</Link>
                                    <p className="text-muted mb-0">There are many Lorem ipsum dolor sit
                                        amet.variations of passages of
                                        Lorem Ipsum available ...</p>
                                </div>
                            </div>
                            <div className="d-flex overflow-visible mt-5">
                                <img className="avatar br-5 avatar-xl me-3"
                                    src={ImagesData("users3")} alt="avatar-img" />
                                <div className="media-body valign-middle">
                                    <Link to={`${import.meta.env.BASE_URL}pages/profile/profile01`} className="fw-semibold text-body">Cherry
                                        Blossom</Link>
                                    <p className="text-muted mb-0">There are many Lorem ipsum dolor sit
                                        amet.variations of passages of
                                        Lorem Ipsum available ...</p>
                                </div>
                            </div>
                            <div className="d-flex overflow-visible mt-5">
                                <img className="avatar br-5 avatar-xl me-3"
                                    src={ImagesData("users5")} alt="avatar-img" />
                                <div className="media-body valign-middle">
                                    <Link to={`${import.meta.env.BASE_URL}pages/profile/profile01`} className="fw-semibold text-body">Ivan
                                        Notheridiya</Link>
                                    <p className="text-muted mb-0">There are many Lorem ipsum dolor sit
                                        amet.variations of passages of
                                        Lorem Ipsum available ...</p>
                                </div>
                            </div>
                            <div className="d-flex overflow-visible mt-5">
                                <img className="avatar br-5 avatar-xl me-3"
                                    src={ImagesData("users15")} alt="avatar-img" />
                                <div className="media-body valign-middle">
                                    <Link to={`${import.meta.env.BASE_URL}pages/profile/profile01`} className="fw-semibold text-body">Manny Jah</Link>
                                    <p className="text-muted mb-0">There are many Lorem ipsum dolor sit
                                        amet.variations of passages of
                                        Lorem Ipsum available ...</p>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>Recent Posts</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div>
                            <div className="d-flex overflow-visible">
                                <Link to={`${import.meta.env.BASE_URL}pages/blog/blogdetails`} className="card-recent-post cover-image">
                                    <img src={ImagesData("users2")} alt="img" />
                                </Link>
                                <div className="ps-3 ">
                                    <h4><Link to={`${import.meta.env.BASE_URL}pages/blog/blogdetails`}>Generator on the Internet..</Link></h4>
                                    <div className="text-muted">Excepteur sint occaecat cupidatat non
                                        proident,
                                        accusantium sunt in culpa qui officia deserunt mollit anim id
                                        est
                                        laborum....</div>
                                </div>
                            </div>
                            <div className="d-flex overflow-visible mt-5">
                                <Link to={`${import.meta.env.BASE_URL}pages/blog/blogdetails`} className="card-recent-post cover-image">
                                    <img src={ImagesData("users3")} alt="img" />
                                </Link>
                                <div className="ps-3 ">
                                    <h4><Link to={`${import.meta.env.BASE_URL}pages/blog/blogdetails`}>Voluptatem quia voluptas...</Link></h4>
                                    <div className="text-muted">Excepteur sint occaecat cupidatat non
                                        proident,
                                        accusantium sunt in culpa qui officia deserunt mollit anim id
                                        est
                                        laborum....</div>
                                </div>
                            </div>
                            <div className="d-flex overflow-visible mt-5">
                                <Link to={`${import.meta.env.BASE_URL}pages/blog/blogdetails`} className="card-recent-post cover-image">
                                    <img src={ImagesData("media1")} alt="img" />
                                </Link>
                                <div className="ps-3 ">
                                    <h4><Link to={`${import.meta.env.BASE_URL}pages/blog/blogdetails`}>Generator on the Internet..</Link></h4>
                                    <div className="text-muted">Excepteur sint occaecat cupidatat non
                                        proident,
                                        accusantium sunt in culpa qui officia deserunt mollit anim id
                                        est
                                        laborum....</div>
                                </div>
                            </div>
                            <div className="d-flex overflow-visible mt-5">
                                <Link to={`${import.meta.env.BASE_URL}pages/blog/blogdetails`} className="card-recent-post cover-image">
                                    <img src={ImagesData("media4")} alt="img" />
                                </Link>
                                <div className="ps-3 ">
                                    <h4><Link to={`${import.meta.env.BASE_URL}pages/blog/blogdetails`}>Voluptatem quia voluptas...</Link></h4>
                                    <div className="text-muted">Excepteur sint occaecat cupidatat non
                                        proident,
                                        accusantium sunt in culpa qui officia deserunt mollit anim id
                                        est
                                        laborum....</div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>Tags</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="tags">
                            <Link to="#" className="tag">Development</Link>
                            <Link to="#" className="tag">Design</Link>
                            <Link to="#" className="tag">Technology</Link>
                            <Link to="#" className="tag">Popular</Link>
                            <Link to="#" className="tag">Codiegniter</Link>
                            <Link to="#" className="tag">JavaScript</Link>
                            <Link to="#" className="tag">Bootstrap</Link>
                            <Link to="#" className="tag">PHP</Link>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Fragment>
);

export default BlogDetails;
