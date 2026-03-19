import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import Slider from "react-slick";
import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';

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

                <Slider {...settings} className="">
                <img src={ImagesData("pngs15")} alt="img" className="img-fluid br-7 border"/>
       
       <img src={ImagesData("pngs16")} alt="img" className="img-fluid br-7 border"/>
     
       <img src={ImagesData("pngs17")} alt="img" className="img-fluid br-7 border"/>
     
       <img src={ImagesData("pngs18")} alt="img" className="img-fluid br-7 border"/>
                    
                </Slider>
            </div>
        );
    }
}
export default VerticalMode;