
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay,Navigation,Pagination} from "swiper";
import { Card, Col, Collapse, Form } from 'react-bootstrap';

import React, { FC, useState } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import "./styles.css";

//CAROUSAL WITH CONTROLS
interface Carouselcontrol {
  id: number
  src1: string
}
export const Carouselcontrols : Carouselcontrol[]=[
  {id:1, src1:ImagesData('media4')},
  {id:2, src1:ImagesData('media5')},
  {id:3, src1:ImagesData('media6')},
  {id:4, src1:ImagesData('media7')},
  {id:5, src1:ImagesData('media8')},

]
//CAUROSEL WITH CAPTIONS
interface Carouselcaption {
  id: number
  src1: string
}
export const Carouselcaptions : Carouselcaption[]=[
  {id:1, src1:ImagesData('media9')},
  {id:2, src1:ImagesData('media10')},
  {id:3, src1:ImagesData('media11')},
  {id:4, src1:ImagesData('media12')},
  {id:5, src1:ImagesData('media13')},

]
//CAROUSEL WITH TOP CONTROLS
interface Carouseltop {
  id: number
  src1: string
}
export const Carouseltops : Carouseltop[]=[
  {id:1, src1:ImagesData('media14')},
  {id:2, src1:ImagesData('media15')},
  {id:3, src1:ImagesData('media16')},
  {id:4, src1:ImagesData('media17')},
  {id:5, src1:ImagesData('media18')},

]
//CAROUSEL WITGH TOP RIGHT CONTROLS
interface Carouselright {
  id: number
  src1: string
}
export const Carouselrights : Carouselright[]=[
  {id:1, src1:ImagesData('media19')},
  {id:2, src1:ImagesData('media20')},
  {id:3, src1:ImagesData('media21')},
  {id:4, src1:ImagesData('media22')},
  {id:5, src1:ImagesData('media23')},

]
//CAROUSEL TOP-LEFT
interface Carouselleft {
  id: number
  src1: string
}
export const Carousellefts : Carouselleft[]=[
  {id:1, src1:ImagesData('media24')},
  {id:2, src1:ImagesData('media25')},
  {id:3, src1:ImagesData('media1')},
  {id:4, src1:ImagesData('media2')},
  {id:5, src1:ImagesData('media3')},

]
//CAROUSEL BOTTOM-RIGHT
interface Carouselbottom {
  id: number
  src1: string
}
export const Carouselbottoms : Carouselbottom[]=[
  {id:1, src1:ImagesData('media4')},
  {id:2, src1:ImagesData('media5')},
  {id:3, src1:ImagesData('media6')},
  {id:4, src1:ImagesData('media7')},
  {id:5, src1:ImagesData('media8')},

]
//CAUROSEL WITH BOTTOM-LEFT
interface bottomleft {
  id: number
  src1: string
}
export const bottomlefts : bottomleft[]=[
  {id:1, src1:ImagesData('media9')},
  {id:2, src1:ImagesData('media10')},
  {id:3, src1:ImagesData('media11')},
  {id:4, src1:ImagesData('media12')},
  {id:5, src1:ImagesData('media13')},

]
//BACKGROUND COLOR
interface backgroundcolor {
  id: number
  src1: string
}
export const backgroundcolors : backgroundcolor[]=[
  {id:1, src1:ImagesData('media28')},
  {id:2, src1:ImagesData('media29')},
  {id:3, src1:ImagesData('media30')},
 

]

export const Carosels = () =>{
	const [show,setShow] = useState(false);
  return (

    <Card>
      <Card.Header>
        <Card.Title>Carousel</Card.Title>
        <Form.Check  type="switch" className='ms-auto' label="show code" onClick={()=>setShow(!show)}/>
      </Card.Header>
      <Card.Body>
        <div id="carousel-default" className="carousel-inner" data-bs-ride="carousel">
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
      >
         <SwiperSlide> <img className="d-block w-100" alt=""src={ImagesData("media19")}	data-bs-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""src={ImagesData("media20")} data-bs-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""src={ImagesData("media21")} data-bs-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""src={ImagesData("media22")} data-bs-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""src={ImagesData("media23")} data-bs-holder-rendered="true" /></SwiperSlide>
        
          </Swiper>
          </div>
      </Card.Body>
      <Collapse in={show} className="">
									<pre>
										<code>
											{`
   <Swiper
   spaceBetween={30}
   centeredSlides={true}
   autoplay={{
     delay: 2500,
     disableOnInteraction: false,
   }}
   pagination={{
     clickable: true,
   }}
   navigation={true}
   modules={[Autoplay, Navigation]}
   className="mySwiper"
 >
    <SwiperSlide> <img className="d-block w-100" alt=""src={ImagesData("media19")}	data-bs-holder-rendered="true" /></SwiperSlide>
     <SwiperSlide><img className="d-block w-100" alt=""src={ImagesData("media20")} data-bs-holder-rendered="true" /></SwiperSlide>
     <SwiperSlide><img className="d-block w-100" alt=""src={ImagesData("media21")} data-bs-holder-rendered="true" /></SwiperSlide>
     <SwiperSlide><img className="d-block w-100" alt=""src={ImagesData("media22")} data-bs-holder-rendered="true" /></SwiperSlide>
     <SwiperSlide><img className="d-block w-100" alt=""src={ImagesData("media23")} data-bs-holder-rendered="true" /></SwiperSlide>
   
     </Swiper>
`}
										</code>
									</pre>
								</Collapse>
    </Card>

  )
}
export const Carosels1 = () =>{
	const [show1,setShow1] = useState(false);

  return (
    
    <Card>
      <Card.Header>
      <Card.Title>Carousel with indicators</Card.Title>
      <Form.Check  type="switch" className='ms-auto' label="show code" onClick={()=>setShow1(!show1)}/>

      </Card.Header>
      <Card.Body>
        <div id="carousel-default" className="carousel-inner" data-bs-ride="carousel">
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay,Pagination,Navigation]}
        className="mySwiper"
      >
         <SwiperSlide> <img className="d-block w-100" alt=""
													src={ImagesData("media24")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media25")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media1")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media2")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media3")}
													data-holder-rendered="true" /></SwiperSlide>
        
          </Swiper>
          </div>
      </Card.Body>
      <Collapse in={show1} className="">
									<pre>
										<code>
											{`
  <Swiper
  spaceBetween={30}
  centeredSlides={true}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
  }}
  pagination={{
    clickable: true,
  }}
  navigation={true}
  modules={[Autoplay,Pagination,Navigation]}
  className="mySwiper"
>
   <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media24")} data-holder-rendered="true" /></SwiperSlide>
    <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media25")} data-holder-rendered="true" /></SwiperSlide>
    <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media1")} data-holder-rendered="true" /></SwiperSlide>
    <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media2")} data-holder-rendered="true" /></SwiperSlide>
    <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media3")} data-holder-rendered="true" /></SwiperSlide>
  
    </Swiper>
`}
										</code>
									</pre>
								</Collapse>
    </Card>

  )
}
export const Carosels2 = () =>{
	const [show2,setShow2] = useState(false);

  return (

    <Card>
      <Card.Header>
      <Card.Title>CAROUSEL WITH CONTROLS</Card.Title>
      <Form.Check  type="switch" className='ms-auto' label="show code" onClick={()=>setShow2(!show2)}/>

      </Card.Header>
      <Card.Body>
        <div id="carousel-default" className="carousel-inner" data-bs-ride="carousel">
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
         
        }}
        navigation={true}
        modules={[Autoplay,Navigation]}
        className="mySwiper"
      >
         <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media4")}/></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media5")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media6")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media7")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media8")}
													data-holder-rendered="true" /></SwiperSlide>
        
          </Swiper>
          </div>
      </Card.Body>
      <Collapse in={show2} className="">
									<pre>
										<code>
											{`
    <Swiper
    spaceBetween={30}
    centeredSlides={true}
    autoplay={{
      delay: 2500,
      disableOnInteraction: false,
    }}
    pagination={{
      clickable: true,
     
    }}
    navigation={true}
    modules={[Autoplay,Navigation]}
    className="mySwiper"
  >
     <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media4")}/></SwiperSlide>
      <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media5") data-holder-rendered="true" /></SwiperSlide>
      <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media6") data-holder-rendered="true" /></SwiperSlide>
      <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media7") -holder-rendered="true" /></SwiperSlide>
      <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media8") data-holder-rendered="true" /></SwiperSlide>
    
      </Swiper>
`}
										</code>
									</pre>
								</Collapse>
    </Card>

  )
}
export const Carosels3 = () =>{
	const [show3,setShow3] = useState(false);
  return (
 
    <Card>
      <Card.Header>
      <Card.Title>CAROUSEL WITH TOP CONTROLS</Card.Title>
      <Form.Check  type="switch" className='ms-auto' label="show code" onClick={()=>setShow3(!show3)}/>
      </Card.Header>
      <Card.Body>
        <div id="carousel-default" className="carousel-inner" data-bs-ride="carousel">
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
         
        }}
        navigation={true}
        modules={[Autoplay,Navigation]}
        className="mySwiper"
      >
         <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media14")}/></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media15")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media16")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media17")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media18")}
													data-holder-rendered="true" /></SwiperSlide>
        
          </Swiper>
          </div>
      </Card.Body>
      <Collapse in={show3} className="">
									<pre>
										<code>
											{`
     <Swiper
     spaceBetween={30}
     centeredSlides={true}
     autoplay={{
       delay: 2500,
       disableOnInteraction: false,
     }}
     pagination={{
       clickable: true,
      
     }}
     navigation={true}
     modules={[Autoplay,Navigation]}
     className="mySwiper"
   >
      <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media14")}/></SwiperSlide>
       <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media15")} data-holder-rendered="true" /></SwiperSlide>
       <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media16")} data-holder-rendered="true" /></SwiperSlide>
       <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media17")} data-holder-rendered="true" /></SwiperSlide>
       <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media18")} data-holder-rendered="true" /></SwiperSlide>
     
       </Swiper>
`}
										</code>
									</pre>
								</Collapse>
    </Card>

  )
}
export const Carosels4 = () =>{
	const [show4,setShow4] = useState(false);
  return (

    <Card>
      <Card.Header>
      <Card.Title>CAROUSEL WITH TOP-RIGHT CONTROLS</Card.Title>
      <Form.Check  type="switch" className='ms-auto' label="show code" onClick={()=>setShow4(!show4)}/>
      </Card.Header>
      <Card.Body>
        <div id="carousel-default" className="carousel-inner" data-bs-ride="carousel">
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
         
        }}
        navigation={true}
        modules={[Autoplay,Navigation]}
        className="mySwiper"
      >
         <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media19")}/></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media20")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media21")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media22")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media23")}
													data-holder-rendered="true" /></SwiperSlide>
        
          </Swiper>
          </div>
      </Card.Body>
      <Collapse in={show4} className="">
									<pre>
										<code>
											{`
       <Swiper
       spaceBetween={30}
       centeredSlides={true}
       autoplay={{
         delay: 2500,
         disableOnInteraction: false,
       }}
       pagination={{
         clickable: true,
        
       }}
       navigation={true}
       modules={[Autoplay,Navigation]}
       className="mySwiper"
     >
        <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media19")}/></SwiperSlide>
         <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media20")} data-holder-rendered="true" /></SwiperSlide>
         <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media21")} data-holder-rendered="true" /></SwiperSlide>
         <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media22")} data-holder-rendered="true" /></SwiperSlide>
         <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media23")} data-holder-rendered="true" /></SwiperSlide>
       
         </Swiper>
`}
										</code>
									</pre>
								</Collapse>
    </Card>

  )
}
export const Carosels5 = () =>{
	const [show5,setShow5] = useState(false);
  return (

    <Card>
      <Card.Header>
      <Card.Title>CAROUSEL WITH TOP-LEFT CONTROLS</Card.Title>
      <Form.Check  type="switch" className='ms-auto' label="show code" onClick={()=>setShow5(!show5)}/>
      </Card.Header>
      <Card.Body>
        <div id="carousel-default" className="carousel-inner" data-bs-ride="carousel">
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
         
        }}
        navigation={true}
        modules={[Autoplay,Navigation]}
        className="mySwiper"
      >
         <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media24")}/></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media25")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media1")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media2")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media3")}
													data-holder-rendered="true" /></SwiperSlide>
        
          </Swiper>
          </div>
      </Card.Body>
      <Collapse in={show5} className="">
									<pre>
										<code>
											{`
      <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
       
      }}
      navigation={true}
      modules={[Autoplay,Navigation]}
      className="mySwiper"
    >
       <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media24")}/></SwiperSlide>
        <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media25")} data-holder-rendered="true" /></SwiperSlide>
        <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media1")} data-holder-rendered="true" /></SwiperSlide>
        <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media2")} data-holder-rendered="true" /></SwiperSlide>
        <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media3")} data-holder-rendered="true" /></SwiperSlide>
      
        </Swiper>
`}
										</code>
									</pre>
								</Collapse>
    </Card>
  )
}
export const Carosels6 = () =>{
	const [show6,setShow6] = useState(false);
  return (
 
    <Card>
      <Card.Header>
      <Card.Title>CAROUSEL WITH BOTTOM-RIGHT CONTROLS</Card.Title>
      <Form.Check  type="switch" className='ms-auto' label="show code" onClick={()=>setShow6(!show6)}/>
      </Card.Header>
      <Card.Body>
        <div id="carousel-default" className="carousel-inner" data-bs-ride="carousel">
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
         
        }}
        navigation={true}
        modules={[Autoplay,Navigation]}
        className="mySwiper"
      >
         <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media4")}/></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media5")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media6")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media7")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media8")}
													data-holder-rendered="true" /></SwiperSlide>
        
          </Swiper>
          </div>
          </Card.Body>
          <Collapse in={show6} className="">
									<pre>
										<code>
											{`
      <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
       
      }}
      navigation={true}
      modules={[Autoplay,Navigation]}
      className="mySwiper"
    >
       <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media4")}/></SwiperSlide>
        <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media5")} data-holder-rendered="true" /></SwiperSlide>
        <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media6")} data-holder-rendered="true" /></SwiperSlide>
        <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media7")} data-holder-rendered="true" /></SwiperSlide>
        <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media8")} data-holder-rendered="true" /></SwiperSlide>
      
        </Swiper>
`}
										</code>
									</pre>
								</Collapse>
    </Card>

  )
}
export const Carosels7= () =>{
	const [show7,setShow7] = useState(false);
  return (

    <Card>
      <Card.Header>
      <Card.Title>CAROUSEL WITH BOTTOM-LEFT CONTROLS</Card.Title>
      <Form.Check  type="switch" className='ms-auto' label="show code" onClick={()=>setShow7(!show7)}/>
      </Card.Header>
      <Card.Body>
        <div id="carousel-default" className="carousel-inner" data-bs-ride="carousel">
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
         
        }}
        navigation={true}
        modules={[Autoplay,Navigation]}
        className="mySwiper"
      >
         <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media9")}/></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media10")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media11")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media12")}
													data-holder-rendered="true" /></SwiperSlide>
          <SwiperSlide><img className="d-block w-100" alt=""
													src={ImagesData("media13")}
													data-holder-rendered="true" /></SwiperSlide>
        
          </Swiper>
          </div>
      </Card.Body>
      <Collapse in={show7} className="">
									<pre>
										<code>
											{`
       <Swiper
       spaceBetween={30}
       centeredSlides={true}
       autoplay={{
         delay: 2500,
         disableOnInteraction: false,
       }}
       pagination={{
         clickable: true,
        
       }}
       navigation={true}
       modules={[Autoplay,Navigation]}
       className="mySwiper"
     >
        <SwiperSlide> <img className="d-block w-100" alt="" src={ImagesData("media9")}/></SwiperSlide>
         <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media10")} data-holder-rendered="true" /></SwiperSlide>
         <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media11")} data-holder-rendered="true" /></SwiperSlide>
         <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media12")} data-holder-rendered="true" /></SwiperSlide>
         <SwiperSlide><img className="d-block w-100" alt="" src={ImagesData("media13")} data-holder-rendered="true" /></SwiperSlide>
       
         </Swiper>
`}
										</code>
									</pre>
								</Collapse>
    </Card>

  )
}