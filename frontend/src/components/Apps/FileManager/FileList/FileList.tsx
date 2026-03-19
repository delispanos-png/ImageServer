import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface FileListProps { }

const FileList: FC<FileListProps> = () => (
    <Fragment>
        <PageHeader title="File list" />
        <Row className="row-sm">
            <Col lg={12} xl={12}>
                <Row className="row-sm">
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`}><img
                                src={ImagesData("media39")} alt="img"
                                className="file-list-manger w-100" /></Link>
                            <Card.Footer className="card-footer">
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">image2.jpg</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">66 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`} className="mx-auto my-3"><img
                                src={ImagesData("pngs2")} alt="img" className="filelist-img" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">file.pdf</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">32 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`}><img
                                src={ImagesData("media43")} alt="img"
                                className="file-list-manger w-100" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">image1.jpg</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">76 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`} className="mx-auto my-3"><img
                                src={ImagesData("pngs3")} alt="img" className="filelist-img" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break me-1">excel.xls</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">34 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`}><img
                                src={ImagesData("media42")} alt="img"
                                className="file-list-manger w-100" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">nature.jpg</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">66 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`} className="mx-auto my-3"><img
                                src={ImagesData("pngs5")} alt="img" className="filelist-img" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">demo.ppt</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">67 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`}><img
                                src={ImagesData("media38")} alt="img"
                                className="file-list-manger w-100" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">image1.jpg</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">76 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`} className="mx-auto my-3"><img
                                src={ImagesData("pngs9")} alt="img" className="filelist-img" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">video.mp4</h5>
                                    </div>
                                    <div className="ms-auto my-auto mt-3">
                                        <span className="text-muted mb-0">320 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`} className="mx-auto my-3"><img
                                src={ImagesData("pngs1")} alt="img" className="filelist-img" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">word.doc</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">320 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`}><img
                                src={ImagesData("media37")} alt="img"
                                className="file-list-manger w-100" /></Link>
                            <Card.Footer>
                                <div className="d-flex flex-wrap">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break me-1">mountain.jpg</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">320 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`} className="mx-auto my-3"><img
                                src={ImagesData("pngs2")} alt="img" className="filelist-img" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">file.pdf</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">32 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`} className="mx-auto my-3"><img
                                src={ImagesData("pngs3")} alt="img" className="filelist-img" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">excel.xls</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">34 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`} className="mx-auto my-3"><img
                                src={ImagesData("pngs5")} alt="img" className="filelist-img" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">profile.ppt</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">67 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`}><img
                                src={ImagesData("media40")} alt="img"
                                className="file-list-manger w-100" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">nature.jpg</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">66 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} sm={4} xxl={2}>
                        <Card className="overflow-hidden">
                            <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`} className="mx-auto my-3"><img
                                src={ImagesData("pngs7")} alt="img" className="filelist-img" /></Link>
                            <Card.Footer>
                                <div className="d-flex">
                                    <div>
                                        <h5 className="mb-0 fw-semibold text-break">exe.zip</h5>
                                    </div>
                                    <div className="ms-auto my-auto">
                                        <span className="text-muted mb-0">320 KB</span>
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Fragment>
);

export default FileList;
