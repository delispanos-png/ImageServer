import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import Slider from "react-slick";

class VerticalMode extends Component {
    render() {
        const settings = {
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: -1,
            vertical: true,
            arrows: false,
            autoplay: true,
            centerPadding: '10px',
            verticalTopSwiping: true,
            beforeChange: function (currentSlide, nextSlide) {
                console.log("before change", currentSlide, nextSlide);
            },
            afterChange: function (currentSlide) {
                console.log("after change", currentSlide);
            }
        };
        return (
            <div>

                <Slider {...settings} className="h-80 vertical-scroll mb-0">
                    <div className="d-flex border-0">
                        <div className="w-90 bg-primary-transparent text-primary border-primary p-3 br-7">
                            <div><label className="fs-12">Oct 20 <span className="font-weight-semibold">Sunday</span></label>
                                <span className="mb-0 fs-12 float-end"><strong>8AM-4PM</strong> Rew City, USA</span>
                                <h6>New Fests Blog </h6>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex border-0">
                        <div
                            className="w-90 bg-info-transparent text-info border-info p-3 br-7">
                            <label className="fs-12">Oct 18 <span
                                className="font-weight-semibold">Friday</span></label>
                            <span className="mb-0 fs-12 float-end"><strong>8AM -
                                5PM</strong> Newyork</span>
                            <h6>New Location Visited</h6>
                        </div>
                    </div>
                    <div className="d-flex border-0">
                        <div
                            className="w-90 bg-success-transparent text-success border-success p-3 br-7">
                            <label className="fs-12">Oct 12 <span
                                className="font-weight-semibold">Saturday</span></label>
                            <span className="mb-0 fs-12 float-end"><strong>8AM -
                                5PM</strong> Japan</span>
                            <h6>Weding Event Dance Show</h6>
                        </div>
                    </div>
                    <div className="d-flex border-0">
                        <div
                            className="w-90 bg-warning-transparent text-warning border-warning p-3 br-7">
                            <label className="fs-12">Sep 20 <span
                                className="font-weight-semibold">Friday</span></label>
                            <span className="mb-0 fs-12 float-end"><strong>8AM -
                                4PM</strong> Albania, USA</span>
                            <h6>Field day Festival Events Orders</h6>
                        </div>
                    </div>
                    <div className="d-flex border-0">
                        <div
                            className="w-90 bg-secondary-transparent text-secondary border-secondary p-3 br-7">
                            <label className="fs-12">Sep 25 <span
                                className="font-weight-semibold">Wednesday</span></label>
                            <span className="mb-0 fs-12 float-end"><strong>4AM -
                                8PM</strong> Texas, USA</span>
                            <h6>Christamas Party Event Orders</h6>
                        </div>
                    </div>
                    <div className="d-flex border-0">
                        <div
                            className="w-90 bg-danger-transparent text-danger border-danger p-3 br-7">
                            <label className="fs-12">Sep 30 <span
                                className="font-weight-semibold">Monday</span></label>
                            <span className="mb-0 fs-12 float-end"><strong>8AM -
                                5PM</strong> Japan</span>
                            <h6>New Weding Event Dance Show Orders</h6>
                        </div>
                    </div>
                </Slider>
            </div>
        );
    }
}
export default VerticalMode;