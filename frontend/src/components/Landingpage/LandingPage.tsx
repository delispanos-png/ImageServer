import React, { FC, Fragment, useState } from 'react';
import { Accordion, Button, Card, Col, Dropdown, Form, InputGroup, Nav, Navbar, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar1, {carousels, codes,data1,pricing,features} from './Data/LandingData';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay,Navigation,Pagination} from "swiper";
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import { ImagesData } from '../../CommonComponents/Images/CommonImages';


interface LandingPageProps {  }

const LandingPage: FC<LandingPageProps> = () => {

const [show,setShow] = useState(false);
    //sidebar nav-toggle function
    const sidebarToggled = () => {
document.querySelector("body")?.classList.toggle("sidenav-toggled");
    }
    //switcher function
    const Switcherdata = () =>{
        document.querySelector(".demo_changer")?.classList.add("active");
        let demoChanger = document.querySelector(".demo_changer") as HTMLInputElement
          demoChanger.style.right = "0px";
      }
//switcher close function
      const SideMenuclose = () => {
  
        document.querySelector(".demo_changer")?.classList.remove("active");
        let demo_changer = document.querySelector(".demo_changer") as HTMLInputElement
        if(demo_changer){
          demo_changer.style.right = "-270px";
        }
      }
    const handleClick = (e) => {
        e.preventDefault()
        const target = e.currentTarget.getAttribute('href')
        const location = document.querySelector(target)?.offsetTop
        window.scrollTo({
            left: 0,
            top: location - 64,

        })
    
    // Pagesactive while scrolling
    const pageLink = document.querySelectorAll(".side-menu__item");
    pageLink.forEach((Element) => {
        Element.addEventListener("click", (_event) => {
            _event.preventDefault();
            let hrefdata: any = Element.getAttribute("href");
            let elementview: any = document.querySelector(hrefdata);
            elementview.scrollIntoView({
                behavior: "smooth",
                offsetTop: 1 - 60,
            });
        });
    });

function onScroll() {
    const sections = document.querySelectorAll(".side-menu__item");
    const scrollPos =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;

    sections.forEach((elem) => {
        const value: any = elem.getAttribute("href");
        const refElement: any = document.querySelector(value);
        const scrollTopMinus = scrollPos + 73;
        if (
            refElement.offsetTop <= scrollTopMinus &&
            refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
        ) {
            elem.classList.add("active");
        } else {
            elem.classList.remove("active");
        }
    })
}
window.document.addEventListener("scroll", onScroll);
    }
 /// pin
 const Topup = () => {
    if (window.scrollY > 30 && document.querySelector(".landing-page")) {
        let Scolls = document.querySelectorAll(".sticky");
        Scolls.forEach((e) => {
            e.classList.add("sticky-pin");
        });
    } else {
        let Scolls = document.querySelectorAll(".sticky");
        Scolls.forEach((e) => {
            e.classList.remove("sticky-pin");
        });
    }
};
window.addEventListener("scroll", Topup);
    return(
    <div className="page">
    <div className="page-main">
    <div className="hor-header header">
    <div className="container main-container">
        <div className="d-flex">
				{/* <div className="app-sidebar__overlay" data-bs-toggle="sidebar"></div> */}
            <div className="app-sidebar__toggle d-flex align-items-center" data-bs-toggle="sidebar" >
                <Link className="open-toggle" to="#"  onClick={() => sidebarToggled()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="feather feather-align-left header-icon"
                        width="24" height="24" viewBox="0 0 24 24">
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
                    </svg>
                </Link>
            </div>
            <Link className="logo-horizontal " to={`${import.meta.env.BASE_URL}dashboard`}>
                <img src={ImagesData('logo')} className="header-brand-img desktop-lgo" alt="logo"/>
                <img src={ImagesData('logo1')} className="header-brand-img dark-logo"
                    alt="logo"/>
            </Link>
            {/* <div className="d-flex order-lg-2 ms-auto main-header-end"> */}
                <Navbar className="d-flex order-lg-2 ms-auto main-header-end" expand="lg">    
                <Navbar.Toggle className="navbar-toggler navresponsive-toggler d-lg-none " type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent-4" aria-controls="navbarSupportedContent-4" aria-expanded="false" aria-label="Toggle navigation">
                                <i className="fe fe-more-vertical header-icons navbar-toggler-icon"></i>
                            </Navbar.Toggle>
                <div className="navbar navbar-expand-lg navbar-collapse responsive-navbar p-0">
                    <Navbar.Collapse className="collapse navbar-collapse" id="navbarSupportedContent-4">
                        <div className="header-nav-right p-4 bg-white">
                            <Link to={`${import.meta.env.BASE_URL}CustomPages/login/login01`} className="fw-bold me-2 btn btn-primary btn-icon"
                                target="_blank"> <i className="fe fe-log-in me-2"></i>Login
                            </Link>
                        </div>
                    </Navbar.Collapse>
                    </div>
                <div className="d-flex" onClick={() => Switcherdata()}>
                    <Link className="nav-link icon demo-icon" to="#">
                        <svg xmlns="http://www.w3.org/2000/svg" className="header-icon fa-spin" width="24"
                            height="24" viewBox="0 0 24 24">
                            <path
                                d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2z">
                            </path>
                            <path
                                d="m2.845 16.136 1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399.999.999 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108z">
                            </path>
                        </svg>
                    </Link>
                </div>
                </Navbar>
            </div>  
        </div>
    </div>
</div>
<div>
<div className="landing-top-header text-white" id="home" >
                <div className="cube1">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="top sticky">
                    <div className="app-sidebar bg-transparent horizontal-main ps">
                        <div className="container">
                            <div className="main-sidemenu navbar px-0">
                                <Link className="navbar-brand ps-0 py-0 d-none d-lg-block" to={`${import.meta.env.BASE_URL}dashboard`} >
                                    <img alt="image" className="logo-2" src={ImagesData('logo1')}/>
                                    <img src={ImagesData('logo')} className="logo-3" alt="logo"/>
                               
                                </Link>
                                <Navbar1/>
                                     <div className="header-nav-right d-none d-lg-flex" >
                                    <div className="header-nav-right d-none align-items-center d-lg-flex">
                                        <Link to={`${import.meta.env.BASE_URL}CustomPages/login/login01`} className="fw-bold d-lg-none me-2 d-xl-block d-block btn btn-primary btn-icon"
                                            target="_blank"> <i className="fe fe-log-in"></i>
                                        </Link>
                                        <div className="demo-icon btn btn-primary btn-icon" onClick={()=> Switcherdata()}>
                                            <i className="fe fe-settings"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="demo-screen-headline main-demo main-demo-1 spacing-top overflow-hidden" onClick={()=>SideMenuclose()}>
                    <div className="container">
                        <Row className="justify-content-center">
                            <Col xl={12} lg={8} className="pb-5 text-center">
                                <h1 className="fw-bold">Azea - Manage Your Project</h1>
                                <p className="pb-3 fs-16 mb-5">
                                    Azea - Now you can use this admin template to design stunning dashboards
                                    that will wow your target viewers or users to no end. To create a good and
                                    well-structured dashboard.
                                    You need to start from scratch with HTML5, SCSS, CSS, and JS and with lots of coding.</p>

                                <Button href={`${import.meta.env.BASE_URL}dashboard`}
                                    className="btn mb-3 me-2 fw-bold align-items-center btn-lg" variant='primary'>Get Started  <i className='bx bx-right-arrow-alt fw-bold'></i>
                                </Button>
                                <Button href={`${import.meta.env.BASE_URL}dashboard`}
                                    className="btn-white text-primary btn mb-3 me-2 mt-1 fw-bold align-items-center btn-lg" variant=''>View plan's
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        <div className="section pb-7 pt-7 card-overlap">
            <div className="container">
                <Row>
                    <Col lg={12}>
                        <Card.Body>
                            <div className="information">
                                
                                <Row>
                                    {codes.map((code)=>(
                                    <Col xl={4} lg={6} key={Math.random()}>
                                        <Card>
                                          
                                            <Card.Body className=" text-center">
                                                {code.icon}
                                                <h4 className="fw-bold mb-0">{code.heading}</h4>
                                                <hr className="divide-line" />
                                                <p className="mb-0">
                                                   {code.data}
                                                </p>
                                              
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    ))}
                                </Row>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </div>
        </div>   
       <div className="section pb-7 aboutUs" id="About">
            <img src={ImagesData("pngs12")} className="png-image" alt="img" />
            <img src={ImagesData("pngs12")} className="png-image1" alt="img" />
            <div className="container">
                <Row>
                    <h3 className="text-center fw-bold text-primary mb-2">About Us</h3>
                    <span className="landing-title"></span>
                    <h4 className="text-center mb-1 mt-1 fw-semibold">Our mission is to make work meaningful.
                    </h4>
                    <Col lg={12}>
                        <Card.Body className=" pb-0">
                            <Row>
                                <Col xl={6} lg={6} className="ps-0">
                                    <div className="text-center mb-3 animated-image">
                                        <img src={ImagesData("pngs13")}
                                            alt="image" className="br-5" />
                                    </div>
                                   
                                </Col>
                                <Col xl={6} lg={6} className="pe-0 my-auto">
                                    <div className="ps-5">
                                        <h3 className="text-start fw-semibold fs-23 mb-5">We are
                                            a creative agency with a passion for design.
                                        </h3>
                                        <p className="mb-6">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis</p>
                                        <div className="d-flex">
                                            <i className="bx bxs-check-circle text-primary fs-16"></i>
                                            <h5 className="fw-semibold ms-4 mb-4">Quality & Clean Code</h5>
                                        </div>
                                        <div className="d-flex">
                                            <i className="bx bxs-check-circle text-primary fs-16"></i>
                                            <h5 className="fw-semibold ms-4 mb-4">Well Documented</h5>
                                        </div>
                                        <div className="d-flex">
                                            <i className="bx bxs-check-circle text-primary fs-16"></i>
                                            <h5 className="fw-semibold ms-4 mb-4">Easy to Customize</h5>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Col>
                </Row>
            </div>
        </div>
        <div className="section bg-section feacture-section" id="Features">
            <div className="container">
                <Row className="justify-content-center">
                    <h3 className="text-center fw-bold text-primary mb-2">Features</h3>
                    <span className="landing-title"></span>
                    <h4 className="text-center fw-semibold mt-1 mb-2">Azea Main Features.</h4>
                    <p className="text-default mb-5 text-center fs-15">The Azea admin template comes with
                        ready-to-use features that are completely easy-to-use for any user, even for
                        a beginner.</p>
                    <Row>
                        {features.map((feature)=>(
                        <Col lg={4} md={12} key={Math.random()}>
                            <Card className="  features main-features main-features-1">
                                <Card.Body className=" p-1 text-center">
                                    <div className="mb-4 avatar avatar-lg p-2  bg-primary-transparent rounded-circle" >
                                      {feature.icon}
                                    </div>
                                    <div className="text-center counter-body">
                                        <h4 className="fw-bold">{feature.heading}</h4>
                                        <p className="mb-0">{feature.data}</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        ))}
                    </Row>
                </Row>
            </div>
        </div>
        <div className="section testimonial-owl-landing testimonials pb-0" id="Clients">
            <div className="container">
                <Row>
                    <Col md={12}>
                        <h3 className="text-center fw-bold text-white mb-2">Testimonials </h3>
                        <div className="landing-title"></div>
                        <h4 className="text-center fw-semibold mt-1 text-white-80 mb-5">What People Are
                            Saying About Our Product.</h4>
                        <Card className=" bg-transparent mb-0 border-0">
                            <Card.Body className=" pt-5">
                                <div className="testimonial-carousel">
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
        navigation={false}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
       
                                    <div className="slide text-center">
                                    <Row>
                                            <Col xl={8} md={12} className="d-block mx-auto">
                                           
                                                   <div className="testimonia">
                                                    
                                                  
                                                    <div>
                                                    <p className="text-white-80">
                                                        <i className="fa fa-quote-left fs-30 text-white-50 me-2"></i>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore cum accusamus eveniet molestias voluptatum inventore laborios labore sit aspernatur praesentium iste impedit quidem dolor veniam.</p>
                                                    <h3 className="title">Elizabeth</h3>
                                                    <span className="post">Web Developer</span>
                                                    <div className="rating-stars block my-rating-5 mb-5"
                                                        data-rating="4"><i  className="rating-stars block my-rating-5 mb-5"></i></div>
                                                        </div>
                                                    
                                                  
                                                </div>
                                           
                                            </Col>
                                           
                                        </Row>
                                  
                                    </div>
     
        
</SwiperSlide>

                           <SwiperSlide>
                                    <div className="slide text-center">
                                        <Row>
                                            <Col xl={8} md={12} className="d-block mx-auto">
                                        
                                                <div className="testimonia">
                                                    <p className="text-white-80"><i
                                                        className="fa fa-quote-left fs-30 text-white-50 me-2"></i> Nemo
                                                        enim ipsam
                                                        voluptatem quia voluptas sit aspernatur aut
                                                        odit aut fugit, sed quia
                                                        consequuntur magni dolores eos qui ratione
                                                        voluptatem sequi nesciunt. Neque
                                                        porro quisquam est, qui dolorem ipsum quia
                                                        dolor sit amet, consectetur,
                                                        adipisci velit, sed quia non numquam eius
                                                        modi tempora incidunt ut labore.
                                                    </p>
                                                    <div className="testimonia-data">
                                                        <h3 className="title">williamson</h3>
                                                        <span className="post">UI Developer</span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    </SwiperSlide>
<SwiperSlide>
                                    <div className="slide text-center">
                                        <Row>
                                            <Col xl={8} md={12} className="d-block mx-auto">
                                                <div className="testimonia">
                                                    <p className="text-white-80"><i
                                                        className="fa fa-quote-left fs-30 text-white-50 me-2"></i> Duis
                                                        aute irure dolor
                                                        in reprehenderit in voluptate velit esse
                                                        cillum dolore eu fugiat nulla
                                                        pariatur. Excepteur sint occaecat cupidatat
                                                        non proident, sunt in culpa qui
                                                        officia deserunt mollit anim id est laborum.
                                                        Sed ut perspiciatis unde omnis
                                                        iste natus error sit voluptatem accusantium
                                                        doloremque laudantium.</p>
                                                    <div className="testimonia-data">
                                                        <h3 className="title">Sophie Carr</h3>
                                                        <span className="post">Web Designer</span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    </SwiperSlide>
                              </Swiper>
                              </div>
                            </Card.Body>
                        </Card>
                        
                    </Col>
                </Row>
            </div>
        </div>
        <div className="section bg-white" id="Faqs">
            <div className="container">
                <Row>
                    <h3 className="text-center fw-bold text-primary mb-2">FAQ'S ?</h3>
                    <span className="landing-title"></span>
                    <h4 className="text-center mt-1 fw-semibold mb-3">We are here to help you</h4>
                    <p className="fs-15 text-center">
                        The Azea admin template is one of the modern dashboard templates.
                        It is also a premium admin dashboard.
                    </p>
                    <section className="demo-screen-demo" id="faqs">
                        <div className="row justify-content-center">
                            <Col lg={6} md={12} className=" pt-6">
                                <Accordion className="accordion accordion-flush" id="accordionFlushExample" defaultActiveKey="1">
                                    <Accordion.Item eventKey="1" className="accordion-item ">
                                        <Accordion.Header className="accordion-header  bg-primary-transparent" id="flush-headingOne">
                                                Can I get a free trial before purchase ?
                                        </Accordion.Header>
                                        <div id="flush-collapseOne" className="accordion-collapse collapse show" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                            <Accordion.Body className="accordion-body">
                                                <p className="mb-0">
                                                    Lorem ipsum dolor sit amet consectetur adipisicing
                                                    elit. Iure quos debitis aliquam .Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                                                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.
                                                </p>
                                            </Accordion.Body>
                                        </div>
                                    </Accordion.Item>
                                    <Accordion.Item  eventKey='2' className="accordion-item">
                                        <Accordion.Header className="accordion-header  bg-primary-transparent" id="flush-headingTwo ">
                                                What type of files i will get after purchase ?
                                        </Accordion.Header>
                                        <div id="flush-collapseTwo" className="accordion-collapse collapse show" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                            <Accordion.Body className="accordion-body">
                                                <p className="mb-0">
                                                    Lorem ipsum dolor sit amet consectetur adipisicing
                                                    elit. Iure quos debitis aliquam .Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                                                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.
                                                </p>
                                            </Accordion.Body>
                                        </div>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey='5' className="accordion-item">
                                        <Accordion.Header className="accordion-header  bg-primary-transparent" id="flush-headingFour">
                                                Can i change my plan later ?
                                        </Accordion.Header>
                                        <div id="flush-collapseFour" className="accordion-collapse collapse show" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample1">
                                            <Accordion.Body className="accordion-body">
                                                <p className="mb-0">
                                                    Lorem ipsum dolor sit amet consectetur adipisicing
                                                    elit. Iure quos debitis aliquam .Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                                                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.
                                                </p>
                                            </Accordion.Body>
                                        </div>
                                    </Accordion.Item>
                                </Accordion>
                            </Col>
                            <Col lg={6} md={12} className=" pt-6">
                                
                                <Accordion className="accordion accordion-flush" id="accordionFlushExample1" defaultActiveKey="5">
                                    <Accordion.Item eventKey='4' className="accordion-item">
                                        <Accordion.Header className="accordion-header  bg-primary-transparent" id="flush-headingThree">
                                                What is a single Application ?
                                        </Accordion.Header>
                                        <div id="flush-collapseThree" className="accordion-collapse collapse show" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample1">
                                            <Accordion.Body className="accordion-body">
                                                <p className="mb-0">
                                                    Lorem ipsum dolor sit amet consectetur adipisicing
                                                    elit. Iure quos debitis aliquam .Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                                                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.
                                                </p>
                                            </Accordion.Body>
                                        </div>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey='5' className="accordion-item">
                                        <Accordion.Header className="accordion-header  bg-primary-transparent" id="flush-headingFour">
                                                How to get future updates ?
                                        </Accordion.Header>
                                        <div id="flush-collapseFour" className="accordion-collapse collapse show" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample1">
                                            <Accordion.Body className="accordion-body">
                                                <p className="mb-0">
                                                    Lorem ipsum dolor sit amet consectetur adipisicing
                                                    elit. Iure quos debitis aliquam .Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                                                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.
                                                </p>
                                            </Accordion.Body>
                                        </div>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey='6' className="accordion-item">
                                        <Accordion.Header className="accordion-header  bg-primary-transparent" id="flush-headingFive">
                                                Do you provide support ?
                                        </Accordion.Header>
                                        <div id="flush-collapseFive" className="accordion-collapse collapse show" aria-labelledby="flush-headingFive" data-bs-parent="#accordionFlushExample1">
                                            <Accordion.Body className="accordion-body">
                                                <p className="mb-0">
                                                    Lorem ipsum dolor sit amet consectetur adipisicing
                                                    elit. Iure quos debitis aliquam .Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                                                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.
                                                </p>
                                            </Accordion.Body>
                                        </div>
                                    </Accordion.Item>
                                </Accordion>
                            </Col>
                        </div>
                    </section>
                </Row>
            </div>
        </div>
        <div className="section bg-section" id="Pricing">
            <div className="container">
                <div className="row justify-content-center">
                    <h3 className="text-center fw-bold text-primary mb-2">Pricing</h3>
                    <span className="landing-title"></span>
                    <h4 className="text-center mb-7 mt-1 fw-semibold"> Meet our monthly plan that suits you.</h4>
                    <Row>
                        {pricing.map((price)=>(
                        <Col lg={4} md={12} key={Math.random()}>
                            <Card className={price.class2}>
                                <Card.Body className=" p-7">
                                    <div className={price.data}><span className={price.data2}>{price.data1}</span></div>
                                    <div className="d-flex align-items-center">
                                        <span className={`pricing-icon me-2 bg-${price.color2}`}><i className={`fe fe-${price.icon} text-primary`
                                        }></i></span>
                                        <h4 className={`fw-semibold ${price.class2} pt-0 mb-2`}>{price.heading}</h4>
                                    </div>
                                    <p className={`text-${price.color1} mb-2 mt-3`}><span className="fs-40 fw-semibold"> {price.badge}</span><span className="mx-1 text-muted">/</span> month</p>
                                    <p className={`text-${price.color1} mb-3`}>Best for Business</p>
                                    <div className="text-center border-top-0">
                                        <Link className={`btn btn-outline-primary bg-white btn-block mb-4 btn-pill ${price.color}`} to="#">Get Started</Link>
                                    </div>
                                    <p className={`fs-13 fw-semibold text-${price.color1}`}>Lorem ipsum dolor sit amet
                                        consectetur adipisicing.</p>
                                    <ul className="pt-3 mb-0" >
                                        <li className={`mb-4 text-${price.color1}`}><i className={`bx bxs-check-circle me-2 text-${price.color}`}></i> <strong> 2 Free</strong> Domain Name</li>
                                        <li className={`mb-4 text-${price.color1}`}><i className={`bx bxs-check-circle me-2 text-${price.color}`}></i><strong>3 </strong> Projects</li>
                                        <li className={`mb-4 text-${price.color1}`}><i className={`bx bxs-check-circle me-2 text-${price.color}`}></i><strong>3 </strong> One-Click Apps</li>
                                        <li className={`mb-4 text-${price.color1}`}><i className={`bx bxs-check-circle me-2 text-${price.color}`}></i><strong> 1 </strong> Databases</li>
                                        <li className={`mb-4 ${price.class1}`}><i className={`bx bxs-${price.icon1} me-2`}></i><strong> Money </strong> BackGuarantee</li>
                                        <li className={`mb-0 ${price.class}`}><i className="bx bxs-x-circle me-2"></i><strong> 24/7</strong> support</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
        <div className="section bg-section contact-bg">
            <div className="container">
                <div className="row text-center justify-content-center">
                    <Col lg={12}>
                        <div className="mt-0  text-white">
                            <h1 className="mb-2 fw-bold">Subscribe to our News Letter</h1>
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias.</p>
                        </div>
                    </Col>
                    <Col lg={7}>
                        <div className="mt-4">
                            <InputGroup className="input-group mt-1">
                                <Form.Control type="text" className=" input-lg" placeholder="Enter a valid Email Address " />
                                <Button type="button" className="btn  btn-lg" variant='primary'>
                                    Subscribe
                                </Button>
                            </InputGroup>
                        </div>
                    </Col>
                </div>
            </div>
        </div>
        <div className="section bg-white" id="Contact">
            <div className="container">
                <Row className="justify-content-center">
                    <h3 className="text-center fw-bold text-primary mb-2">Contact</h3>
                    <span className="landing-title"></span>
                    <h4 className="text-center mb-2 mt-1 fw-semibold">Get In Touch with us.</h4>
                    <Row className="justify-content-center">
                        <Col lg={7}>
                            <Card.Body className=" mt-3 pb-2">
                                <Form>
                                    <Row>
                                        <Col lg={6}>
                                            <Form.Group>
                                                <Form.Label className="" htmlFor="cusName">First Name<span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" className="" id="cusName" placeholder="First Name" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={6}>
                                            <Form.Group>
                                                <Form.Label className="" htmlFor="cusName1">Last Name </Form.Label>
                                                <Form.Control type="text" className="" id="cusName1" placeholder="Last Name" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group>
                                        <Form.Label className="" htmlFor="cusEmail">Email Address <span className="text-danger">*</span> </Form.Label>
                                        <Form.Control type="email" className="" id="cusEmail" placeholder="Email Address" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="">Message </Form.Label>
                                        <Form.Control as='textarea' rows={5} className="form-control" id="cusMessage"
                                                                            placeholder="Type your message here..."></Form.Control>
                                    </Form.Group>
                                </Form>
                                <Button className="btn btn-lg mt-3" variant='primary'>Send Message</Button>
                            </Card.Body>
                        </Col>
                    </Row>
                </Row>
            </div>
        </div>
        <div className="demo-footer pt-0">
            <div className="container">
                <Row className="mb-0">
                    <Card className="cmb-0">
                        <Card.Body>
                            <div className="top-footer">
                                <Row>
                                    <Col lg={4} sm={12} md={4}>
                                        <Link to="index.html"><img loading="lazy" alt="image" className="mb-3"
                                                src={ImagesData('logo1')}/></Link>
                                        <p className="fs-14 mb-5 text-white-50">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                                            dolore eu fugiat nulla.</p>
                                        <div className="d-flex text-white-50">
                                            <i className="fe fe-map-pin fs-13"></i>
                                            <p className="fw-semibold ms-2 mb-2">Cross Roads,
                                                forest towers,410001
                                            </p>
                                        </div>
                                        <div className="d-flex text-white-50">
                                            <i className="fe fe-phone-call fs-13"></i>
                                            <p className="fw-semibold ms-2 mb-2">+123-123-4545</p>
                                        </div>
                                        <div className="d-flex text-white-50">
                                            <i className="fe fe-mail fs-13"></i>
                                            <p className="fw-semibold ms-2">georgeme@abc.com</p>
                                        </div>
                                    </Col>
                                    <Col lg={4} sm={12} md={12} className="fs-14">
                                        <h6 className="fw-semibold mt-2">About</h6>
                                        <p className="text-white-50">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                                            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                                            veritatis et quasi architecto beatae vitae dicta sunt
                                            explicabo.
                                        </p>
                                        <p className="mb-2 text-white-50">Duis aute irure dolor in reprehenderit in voluptate
                                            velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat .
                                        </p>
                                    </Col>
                                    <Col lg={2} sm={6} md={4}>
                                        <h6 className="fw-semibold mt-2">Quick Links</h6>
                                        <ul className="list-unstyled fs-14">
                                            <li className="border-0 mb-2"><Link to={`${import.meta.env.BASE_URL}dashboard`}>Dashboard</Link></li>
                                            <li className="border-0 mb-2"><Link to={`${import.meta.env.BASE_URL}elements/alerts`}>Elements</Link></li>
                                            <li className="border-0 mb-2"><Link to={`${import.meta.env.BASE_URL}Pages/forms/formelements`}>Forms</Link></li>
                                            <li className="border-0 mb-2"><Link to={`${import.meta.env.BASE_URL}AdvancedUI/charts/chartjscharts`}>Charts</Link></li>
                                            <li className="border-0 mb-2"><Link to={`${import.meta.env.BASE_URL}AdvancedUI/tables/datatable`}>Tables</Link></li>
                                            <li className="border-0"><Link to={`${import.meta.env.BASE_URL}Apps/filemanager/fileattachment`}>Other Pages</Link></li>
                                        </ul>
                                    </Col>
                                    <div className="col-lg-2 col-sm-6 col-md-4">
                                        <h6 className="fw-semibold mt-2">Information</h6>
                                        <ul className="list-unstyled fs-14">
                                            <li className="border-0 mb-2"><Link to={`${import.meta.env.BASE_URL}Apps/contacts/contactlist01`}>Our Team</Link></li>
                                            <li className="border-0 mb-2"><Link to={`${import.meta.env.BASE_URL}Apps/contacts/contactlist02`}>Contact US</Link></li>
                                            <li className="border-0 mb-2"><Link to={`${import.meta.env.BASE_URL}dashboard`}>About</Link></li>
                                            <li className="border-0 mb-2"><Link to={`${import.meta.env.BASE_URL}dashboard`}>Services</Link></li>
                                            <li className="border-0 mb-2"><Link to={`${import.meta.env.BASE_URL}Pages/blog/blog01`}>Blog</Link></li>
                                            <li className="border-0"><Link to={`${import.meta.env.BASE_URL}Pages/terms`}>Terms and Services</Link></li>
                                        </ul>
                                    </div>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Row>
            </div>
            <footer className="main-footer py-3">
                <div className="container">
                <Row className="align-items-center">
                    <Col md={6} sm={12} className="mb-1">
                            Copyright © <span id="year"></span> <Link to="#" className="text-primary">Azea</Link>.
                            Designed with <span className="fa fa-heart text-danger"></span> by <Link
                                to="#" className="text-primary"> Spruko </Link> All rights reserved.
                        </Col>
                        <Col md={6} className="text-end">
                            <div className="btn-list">
                                <Button type="button" className="btn btn-icon"><i className="fe fe-twitter"></i></Button>
                                <Button type="button" className="btn btn-icon"><i className="fe fe-github"></i></Button>
                                <Button type="button" className="btn btn-icon"><i className="fe fe-facebook"></i></Button>
                                <Button type="button" className="btn btn-icon"><i className="fe fe-instagram"></i></Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </footer>
        </div>

     </div>
     </div>
    // </div>
 
)
    };

export default LandingPage;
function clearMenuActive() {
    throw new Error('Function not implemented.');
}

