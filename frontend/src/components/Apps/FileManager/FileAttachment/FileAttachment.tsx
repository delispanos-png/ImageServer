import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import { Button, Card, Col, Row } from 'react-bootstrap';
import PageHeader from '../../../../layout/Header/pageheader';
import { Link } from 'react-router-dom';
import { squarecolors, roundcolors, outlinecolors, outlineroundcolors, transperantcolors, transperantcolorss, imagefiles, imagesmallfiles, imagemediumfiles, imagelargefiles } from '../../../../components/Apps/FileManager/FileAttachment/Data/FileattachmentData';
interface FileAttachmentProps { }

const FileAttachment: FC<FileAttachmentProps> = () => (
    <Fragment>
        <PageHeader title="File Attachments" />
        <Row>

            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className="border-bottom">
                        <Card.Title>Color Square File_Attachment</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="tags">
                            {squarecolors.map((squarecolor) => (
                                <div className="btn-group file-attach m-2" role="group" key={Math.random()}
                                    aria-label="Basic example">
                                    <Button type="button" variant={squarecolor.color}><i
                                        className={`${squarecolor.img} text-white me-2`}></i>
                                        {squarecolor.heading}
                                    </Button>
                                    <Button type="button" className="btn-close text-white" variant={squarecolor.color1}
                                        aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </Button>

                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className="border-bottom">
                        <Card.Title>Color Rounded File_Attachment</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="tags">
                            {roundcolors.map((roundcolor) => (
                                <div className="btn-group file-attach m-2" role="group" key={Math.random()}
                                    aria-label="Basic example">
                                    <Button type="button" className="btn-pill text-white" variant={roundcolor.color1}><i
                                        className={`${roundcolor.img} me-2`}></i>
                                        {roundcolor.heading}
                                    </Button>
                                    <Button type="button"
                                        className="btn-pill btn-close text-white" variant={roundcolor.color}
                                        aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className="border-bottom">
                        <Card.Title>Outline Square File_Attachment</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="tags">
                            {outlinecolors.map((outlinecolor) => (
                                <div className="btn-group file-attach m-2" role="group" key={Math.random()}
                                    aria-label="Basic example">
                                    <Button type="button" variant={outlinecolor.color1}><i
                                        className={`${outlinecolor.img} me-2`}></i>
                                        {outlinecolor.heading}
                                    </Button>
                                    <Button type="button" className="btn-close text-primary" variant={outlinecolor.color}
                                        aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className="border-bottom">
                        <Card.Title>Outline Rounded File_Attachment</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="tags">
                            {outlineroundcolors.map((outlineroundcolor) => (
                                <div className="btn-group file-attach m-2" role="group" key={Math.random()}
                                    aria-label="Basic example">
                                    <Button type="button" className="btn-pill" variant={outlineroundcolor.color1}><i
                                        className={`${outlineroundcolor.img} me-2`}></i>
                                        {outlineroundcolor.heading}
                                    </Button>
                                    <Button type="button" className="btn-close btn-pill text-primary" variant={outlineroundcolor.color}
                                        aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className="border-bottom">
                        <Card.Title>Transparent Square File_Attachment</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="tags">
                            {transperantcolors.map((transperantcolor) => (
                                <div className="btn-group file-attach m-2" role="group" key={Math.random()}
                                    aria-label="Basic example">
                                    <Button type="button" className={`btn bg-${transperantcolor.color1}-transparent`} variant=''><i
                                        className={`${transperantcolor.img} me-2`}></i>
                                        {transperantcolor.heading}
                                    </Button>
                                    <Button type="button" className={` btn btn-close bg-${transperantcolor.color}-transparent`} variant=''
                                        aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className="border-bottom">
                        <Card.Title>Transparent Rounded File_Attachment</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="tags">
                            {transperantcolorss.map((transperantcolors) => (
                                <div className="btn-group file-attach m-2" role="group" key={Math.random()}
                                    aria-label="Basic example">
                                    <Button type="button" className={`btn bg-${transperantcolors.color1}-transparent btn-pill`} variant=''><i
                                        className={`${transperantcolors.img} me-2`}></i>
                                        {transperantcolors.heading} </Button>
                                    <Button type="button"
                                        className={`btn btn-close bg-${transperantcolors.color}-transparent btn-pill`} variant=''
                                        aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className="border-bottom">
                        <Card.Title>Square File_Attachment with link</Card.Title>
                    </Card.Header>
                    <Card className="p-4 p-sm-5">
                        <p>Square File_Attachment with <code className="highlighter-rouge">&lt;a&gt;</code>
                            tag.
                        </p>
                        <div className="tags">
                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button role="button" className="text-white" variant='primary'><i
                                    className="mdi mdi-file-image mx-2"></i>Image01..._jpg</Button>
                                <Button role="button" className="btn-close text-white" variant='primary'
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button role="button" className="text-secondary" variant='outline-secondary'><i
                                    className="mdi mdi-file-image me-2"></i>
                                    Image_file.jpg </Button>
                                <Button role="button"
                                    className="btn-close text-secondary" variant='outline-secondary'
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button role="button" className="btn bg-success-transparent" variant=''><i
                                    className="mdi mdi-file-image me-2"></i> Image_file.jpg </Button>
                                <Button role="button" className="btn btn-close bg-success-transparent" variant=''
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Card>
            </Col>
            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className="border-bottom">
                        <h3 className="card-title">Rounded File_Attachment with link</h3>
                    </Card.Header>
                    <Card.Body className="p-4 p-sm-5">
                        <p>Rounded File_Attachment with <code className="highlighter-rouge">&lt;a&gt;</code>
                            tag.</p>
                        <div className="tags">
                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button role="button" className="btn-pill text-white" variant='info'><i
                                    className="mdi mdi-file-image mx-2"></i>Image01..._jpg</Button>
                                <Button role="button" className="btn-close btn-pill text-white" variant='info'
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button role="button"
                                    className="btn-pill text-warning" variant='outline-warning'><i
                                        className="mdi mdi-file-image me-2"></i>
                                    Image_file.jpg </Button>
                                <Button role="button"
                                    className="btn-close btn-pill text-warning" variant='outline-warning'
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button role="button" className="btn-pill bg-danger-transparent" variant=''><i
                                    className="mdi mdi-file-image me-2"></i> Image_file.jpg
                                </Button>
                                <Button role="button" className="btn-close btn-pill bg-danger-transparent" variant=''
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className="border-bottom">
                        <h3 className="card-title">Square File Attachment Sizes</h3>
                    </Card.Header>
                    <Card.Body className="p-4 p-sm-5">
                        <div className="tags">
                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button type="button" className="btn-sm text-white" variant='primary'><i
                                    className="mdi mdi-file-image mx-2"></i>Image01..._jpg</Button>
                                <Button type="button"
                                    className="btn-close btn-sm text-white" variant='primary'
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button className="text-white" variant='secondary'><i
                                    className="mdi mdi-file-excel me-2"></i>Document.exl</Button>
                                <Button className="btn-close text-white" variant='secondary'
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button type="button" className=" btn-lg btn-pink" variant='' ><i
                                    className="mdi mdi-file-pdf fs-20 me-2"></i>AMN0012.pdf</Button>
                                <Button type="button" className="btn-close btn-lg btn-pink text-white" variant=''
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className="border-bottom">
                        <Card.Title>Rounded File Attachment Sizes</Card.Title>
                    </Card.Header>
                    <Card.Body className="p-4 p-sm-5">
                        <div className="tags">
                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button type="button"
                                    className="btn-pill btn-sm text-white" variant='primary'><i
                                        className="mdi mdi-file-image mx-2"></i>Image01..._jpg</Button>
                                <Button type="button"
                                    className="btn-close btn-pill btn-sm text-white" variant='primary'
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button type="button" className="btn-pill" variant='secondary'><i
                                    className="mdi mdi-file-excel me-2"></i>Document.exl</Button>
                                <Button type="button"
                                    className="btn-pill btn-close text-white" variant='secondary'
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button type="button" className="btn btn-pill btn-lg btn-pink" variant=''><i
                                    className="mdi mdi-file-pdf fs-20 me-2"></i>AMN0012.pdf</Button>
                                <Button type="button"
                                    className="btn btn-close btn-pill btn-lg btn-pink text-white" variant=''
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className="border-bottom">
                        <Card.Title>Square File Attachment Sizes with link</Card.Title>
                    </Card.Header>
                    <Card.Body className="p-4 p-sm-5">
                        <p>Square File_Attachment Sizes with <code
                            className="highlighter-rouge">&lt;a&gt;</code> tag.</p>
                        <div className="tags">
                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button className="btn-sm text-white" variant='primary'><i
                                    className="mdi mdi-file-image mx-2"></i>Image01..._jpg</Button>
                                <Button className="btn-close btn-sm text-white" variant='primary'
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button className="text-white" variant='secondary'><i
                                    className="mdi mdi-file-excel me-2"></i>Document.exl</Button>
                                <Button className="btn-close text-white" variant='secondary' aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button className="btn-lg btn-pink text-white" variant=''><i
                                    className="mdi mdi-file-pdf fs-20 me-2"></i>AMN0012.pdf</Button>
                                <Button className="btn-close btn-lg btn-pink text-white" variant='' aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={6}>
                <Card className="custom-card">
                    <Card.Header className=" border-bottom">
                        <h3 className="card-title">Rounded File Attachment Sizes with link</h3>
                    </Card.Header>
                    <Card.Body className=" p-4 p-sm-5">
                        <p>Rounded File_Attachment Sizes with <code
                            className="highlighter-rouge">&lt;a&gt;</code> tag.</p>
                        <div className="tags">
                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button className="btn-pill btn-sm text-white" variant='primary'><i
                                    className="mdi mdi-file-image mx-2"></i>Image01..._jpg</Button>
                                <Button className="btn-close btn-pill btn-sm text-white" variant='primary'
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button className="btn-pill text-white" variant='secondary'><i
                                    className="mdi mdi-file-excel me-2"></i>Document.exl</Button>
                                <Button className="btn-close btn-pill text-white" variant='secondary'
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>

                            <div className="btn-group file-attach m-2" role="group"
                                aria-label="Basic example">
                                <Button className="btn-pill btn-lg btn-pink text-white" variant=''><i
                                    className="mdi mdi-file-pdf fs-20 me-2"></i>AMN0012.pdf</Button>
                                <Button className="btn-close btn-pill btn-lg btn-pink text-white" variant=''
                                    aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col lg={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Image File_Attachment</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="text-wrap">
                            <div>
                                <Row>
                                    {imagefiles.map((imagefile) => (
                                        <Col xl={2} lg={3} md={4} sm={4} key={Math.random()}>
                                            <div className="file-image p-2">
                                                <Link to={`${import.meta.env.BASE_URL}Apps/filemanager/filedetails`}>
                                                    <img src={imagefile.src1} alt=""
                                                        className="w-100 br-5" />
                                                </Link>
                                                <ul className=" icons">
                                                    <li><Link to="#"
                                                        className="btn bg-danger"><i
                                                            className="fe fe-trash"></i></Link></li>
                                                    <li><Link to="#"
                                                        className="btn bg-secondary"><i
                                                            className="fe fe-download"></i></Link></li>
                                                    <li><Link to={`${import.meta.env.BASE_URL}Apps/filemanager/filedetails`}
                                                        className="btn bg-primary"><i
                                                            className="fe fe-eye"></i></Link>
                                                    </li>
                                                </ul>
                                                <Link to="#"><span
                                                    className="file-name">{imagefile.heading}</span></Link>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col lg={12}>
                <Card>
                    <Card.Header>
                        <h3 className="card-title">Image File_Attachment Small Size</h3>
                    </Card.Header>
                    <div className="card-body">
                        <div className="text-wrap">
                            {imagesmallfiles.map((imagesmallfile) => (
                                <div className="file-image-1 file-images-noraml" key={Math.random()}>
                                    <Link to={`${import.meta.env.BASE_URL}Apps/filemanager/filedetails`}>
                                        <img src={imagesmallfile.src1} className="br-5" alt="" />
                                    </Link>
                                    <ul className="icons">
                                        <li><Link to="#" className="btn bg-danger"><i
                                            className="fe fe-trash"></i></Link></li>
                                        <li><Link to="#" className="btn bg-secondary"><i
                                            className="fe fe-download"></i></Link></li>
                                        <li><Link to={`${import.meta.env.BASE_URL}Apps/filemanager/filedetails`} className="btn bg-primary"><i
                                            className="fe fe-eye"></i></Link></li>
                                    </ul>
                                    <span className="file-name-1">{imagesmallfile.heading}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col lg={12}>
                <Card>
                    <Card.Header>
                        <Card.Title as="h3">Image File_Attachment Medium Size</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="text-wrap mb-3">
                            {imagemediumfiles.map((imagemediumfile) => (
                                <div className="file-image-1 file-images-md" key={Math.random()}>
                                    <Link to={`${import.meta.env.BASE_URL}Apps/filemanager/filedetails`}>
                                        <img src={imagemediumfile.src1} className="br-5" alt="" />
                                    </Link>
                                    <ul className="icons">
                                        <li><Link to="#" className="btn bg-danger"><i
                                            className="fe fe-trash"></i></Link></li>
                                        <li><Link to="#" className="btn bg-secondary"><i
                                            className="fe fe-download"></i></Link></li>
                                        <li><Link to={`${import.meta.env.BASE_URL}Apps/filemanager/filedetails`} className="btn bg-primary"><i
                                            className="fe fe-eye"></i></Link></li>
                                    </ul>
                                    <span className="file-name-1">{imagemediumfile.heading}</span>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col lg={12}>
                <Card>
                    <Card.Header>
                        <Card.Title as="h3">Image File_Attachment Large Size</Card.Title>
                    </Card.Header>
                    <div className="card-body">
                        <div className="text-wrap">
                            {imagelargefiles.map((imagelargefile) => (
                                <div className="file-image-1 file-images-lg" key={Math.random()}>
                                    <Link to={`${import.meta.env.BASE_URL}Apps/filemanager/filedetails`}>
                                        <img src={imagelargefile.src1} className="br-5" alt="" />
                                    </Link>
                                    <ul className="icons">
                                        <li><Link to="#" className="btn bg-danger"><i
                                            className="fe fe-trash"></i></Link></li>
                                        <li><Link to="#" className="btn bg-secondary"><i
                                            className="fe fe-download"></i></Link></li>
                                        <li><Link to={`${import.meta.env.BASE_URL}Apps/filemanager/filedetails`} className="btn bg-primary"><i
                                            className="fe fe-eye"></i></Link></li>
                                    </ul>
                                    <span className="file-name-1">{imagelargefile.heading}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    </Fragment>
);

export default FileAttachment;
