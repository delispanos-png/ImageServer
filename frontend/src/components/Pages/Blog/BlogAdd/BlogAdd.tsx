import React, { FC, Fragment, useState } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Row, Form } from 'react-bootstrap';
import SunEditor from 'suneditor-react';
import { FilePond } from 'react-filepond';
import { blogadds, personals, posts } from '../BlogAdd/Data/BlogaddData';
import { Link } from 'react-router-dom';
import Select from 'react-select';

interface BlogAddProps { }

const BlogAdd: FC<BlogAddProps> = () => {
    const [files, setFiles] = useState([])

    return (
        <Fragment>
            <PageHeader title="Blog Add" />
            <Row>
                <Col xl={8}>
                    <Card>
                        <Card.Header>
                            <Card.Title>Add New Post</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-4">
                                <Form.Label className="col-md-3 form-label">Post Title :</Form.Label>
                                <div>
                                    <Form.Control type="text" className="form-control" defaultValue="Typing....." />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="col-md-3 form-label">Categories :</label>
                                <div>
                                    <Select options={posts} classNamePrefix='Select2' placeholder='Select Country' />
                                </div>
                            </div>
                            <div>
                                <label className="col-md-3 form-label mb-4">Post Description :</label>
                                <SunEditor />
                            </div>
                            <div className="form-group mb-0">
                                <label className="col-md-3 form-label my-4">File Upload :</label>
                                <FilePond
                                    files={files}
                                    allowMultiple={true}
                                    maxFiles={3}
                                    server="/api"
                                    name="files"
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <Button href="#" className="btn" variant='primary'>Post</Button>
                            <Button href="#" className="btn float-end" variant='light'>Discard</Button>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card>
                        <Card.Header>
                            <Card.Title>Recent Posts</Card.Title>
                        </Card.Header>

                        <Card.Body>
                            <div>
                                {blogadds.map((blogadd) => (
                                    <div className="d-flex overflow-visible mt-3" key={Math.random()}>

                                        <Link to={`${import.meta.env.BASE_URL}Pages/blog/blogdetails`} className="card-recent-post cover-image">
                                            <img src={blogadd.src1} alt="img" />
                                        </Link>

                                        <div className="ps-3 ">
                                            <span className={`badge bg-${blogadd.color} me-1 mb-1 mt-1`}>{blogadd.text}</span>
                                            <h4><Link to={`${import.meta.env.BASE_URL}Pages/blog/blogdetails`}>{blogadd.heading}</Link></h4>
                                            <div className="text-muted">Excepteur sint occaecat cupidatat non
                                                proident,
                                                accusantium sunt in culpa qui officia deserunt mollit anim id
                                                est
                                                laborum....</div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </Card.Body>

                    </Card>

                    <Card>
                        <Card.Header>
                            <Card.Title>Professional Blog Writers</Card.Title>
                        </Card.Header>

                        <Card.Body>
                            <div>
                                {personals.map((personal) => (
                                    <div key={Math.random()}
                                        className="d-flex justify-content-center align-content-center overflow-visible mt-3">
                                        <img className="avatar br-5 avatar-xl me-3"
                                            src={personal.src1} alt="avatar-img" />
                                        <div className="media-body valign-middle">
                                            <Link to={`${import.meta.env.BASE_URL}Pages/profile/profile03`} className="fw-bold text-dark">{personal.heading}</Link>
                                            <p className="text-muted mb-0">There are many Lorem ipsum dolor sit
                                                amet.variations of passages of
                                                Lorem Ipsum available ...</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>

                    </Card>

                </Col>

            </Row>
        </Fragment>
    )
};

export default BlogAdd;
