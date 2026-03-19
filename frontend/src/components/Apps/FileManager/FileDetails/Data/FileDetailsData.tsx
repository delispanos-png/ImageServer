import media39 from '../../../../../assets/images/media/39.jpg';
import media38 from '../../../../../assets/images/media/38.jpg';
import React, { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import  "yet-another-react-lightbox/plugins/thumbnails.css";
import { Col, Row } from 'react-bootstrap';



interface filedetail {
    id: number
    src1: string
    heading: string
    class: string
}
export const filedetails : filedetail []=[
    {id:1, src1:ImagesData('media39'), heading:'image2.jpg', class:'66 KB'},
    {id:2, src1:ImagesData('pngs2'), heading:'file.pdf', class:'32 KB'},
    {id:3, src1:ImagesData('media43'), heading:'image1.jpg', class:'76 KB'},
    {id:4, src1:ImagesData('pngs3'), heading:'excel.xls', class:'34 KB'},
    {id:5, src1:ImagesData('media42'), heading:'nature.jpg', class:'66 KB'},
    {id:6, src1:ImagesData('pngs4'), heading:'demo.ppt', class:'67 KB'},
    {id:7, src1:ImagesData('media38'), heading:'image1.jpg', class:'76 KB'},

]

//Images

import media37 from '../../../../../assets/images/media/37.jpg';
import media41 from '../../../../../assets/images/media/41.jpg';
import media40 from '../../../../../assets/images/media/40.jpg';
import media42 from '../../../../../assets/images/media/42.jpg';
import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';


export const LightboxGallery = () => {

  const [open, setOpen] = useState(false);

  return (
    <div>
      <Row className="masonry">
        <Col xs={6} sm={4} md={4} xl={4} mb={5} className="brick mb-5">
          <img src={media37} alt='media1' onClick={() => setOpen(true)} />
        </Col>
        <Col xs={6} sm={4} md={4} xl={4}  className="brick mb-5">
          <img src={media38} alt='media2' onClick={() => setOpen(true)} />
        </Col>
        <Col xs={6} sm={4} md={4} xl={4}  className="brick mb-5">
          <img src={media39} alt='media3' onClick={() => setOpen(true)} />
        </Col>
        <Col xs={6} sm={4} md={4} xl={4}  className="brick mb-5">
          <img src={media40} alt='media4' onClick={() => setOpen(true)} />
        </Col>
        <Col xs={6} sm={4} md={4} xl={4}  className="brick mb-5">
          <img src={media41} alt='media5' onClick={() => setOpen(true)} />
        </Col> 
        <Col xs={6} sm={4} md={4} xl={4}  className="brick mb-5">
          <img src={media42} alt='media5' onClick={() => setOpen(true)} />
        </Col>
       
      </Row>

      <Lightbox open={open} close={() => setOpen(false)} plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      zoom={{
        maxZoomPixelRatio: 10,
        scrollToZoom: true
    }}
        slides={[{ src: media37 }, { src: media38}, { src: media39}, { src: media40 }, { src: media41 },{ src: media42 }]} />
    </div>
  )
};



