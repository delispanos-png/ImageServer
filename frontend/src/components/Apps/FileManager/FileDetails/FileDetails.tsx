import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LightboxGallery, filedetails } from '../FileDetails/Data/FileDetailsData';
import Slider from "react-slick";


interface FileDetailsProps { }

const FileDetails: FC<FileDetailsProps> = () => {
    const settings = {
        className: "center",
        infinite: true,
        centerPadding: "60px",
        autoplay: true,
        slidesToShow: 5,
        afterChange: function (index) {
            console.log(
                `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
            );
        },
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }
    return (

        <Fragment>
            <PageHeader title="File details" />
            <Row className="row-sm">
                <Col xl={8} lg={12} md={12}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Body className="p-3">
                            <Link to="#"><img src={ImagesData("media42")}
                                alt="img" className="br-5 w-100" /></Link>
                        </Card.Body>
                    </Card>
                    <Col xl={12} lg={12} md={12} className="">
                        <Card className="custom-card">
                            <Card.Header className="border-bottom-0">
                                Related Files
                            </Card.Header>


                            <Card.Body className="pt-0 h-100">
                                <div className="owl-carousel owl-carousel-icons2 owl-loaded owl-drag">
                                    <Slider {...settings} style={{height:'180px'}}>
                                        {filedetails.map((filedetail) => (
                                            <div className="item" key={Math.random()}>
                                                <Card className="overflow-hidden border p-0 mb-0 bg-white">
                                                    <Link to={`${import.meta.env.BASE_URL}Apps/FileManager/FileDetails`}><img
                                                        src={filedetail.src1} alt="img"
                                                        height="124" className="w-100" /></Link>
                                                    <Card.Footer className="card-footer">
                                                        <div className="d-flex">
                                                            <div>
                                                                <h5 className="mb-0 fw-semibold text-break">{filedetail.heading}</h5>
                                                            </div>
                                                            <div className="ms-auto my-auto">
                                                                <span className="text-muted mb-0">{filedetail.class}</span>
                                                            </div>
                                                        </div>

                                                    </Card.Footer>
                                                </Card>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Col>
                <Col xl={4} lg={12} md={12}>
                    <Card className="custom-card">
                        <Card.Body>
                            <h5 className="mb-3">File details</h5>
                            <div>
                                <Row>
                                    <Col xl={12} >
                                        <div className="table-responsive">
                                            <Table className="table mb-0 table-bordered text-nowrap">
                                                <tbody>
                                                    <tr>
                                                        <th>File Name</th>
                                                        <td>image.jpg</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Uploaded</th>
                                                        <td>10-10-2021</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Size</th>
                                                        <td>25 MB</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Dimensions</th>
                                                        <td>1000 x 350</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Resolution Unit</th>
                                                        <td>1</td>
                                                    </tr>
                                                    <tr>
                                                        <th>File Type</th>
                                                        <td>jpg</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                        <div className="text-center mt-3">
                                            <Button type="button" variant=''
                                                className="btn-icon bg-primary-transparent me-2"><i 
                                                    className="fe fe-edit"></i></Button>
                                            <Button type="button" variant=''
                                                className="btn-icon  bg-danger-transparent me-2 bradius"><i
                                                    className="fe fe-trash"></i></Button>
                                            <Button type="button" variant=''
                                                className="btn-icon  bg-success-transparent me-2 bradius"><i
                                                    className="fe fe-download fs-14"></i></Button>
                                            <Button type="button" variant=''
                                                className="btn-icon  bg-warning-transparent bradius"><i
                                                    className="fe fe-share-2 fs-14"></i></Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className=" custom-card">
                        <Card.Body className="pb-0">
                            <h5 className="mb-3">Recent Files</h5>
                            <ul id="lightgallery" className="list-unstyled row">
                                <LightboxGallery />
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
};

export default FileDetails;
