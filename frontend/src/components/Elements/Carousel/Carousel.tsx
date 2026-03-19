import React, { FC, Fragment, useState } from 'react';
import { Card, Carousel, Col, Collapse, Form, Row } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Carouselcaptions, backgroundcolors, Carosels, Carosels1, Carosels2, Carosels3, Carosels4, Carosels5, Carosels6, Carosels7 } from '../../Elements/Carousel/Data/carouselData';
interface CarouselProps { }

const Carousels: FC<CarouselProps> = () => {
	const [show, setShow] = useState(false);
	const [show1, setShow1] = useState(false);

	return (
		<Fragment>
			<PageHeader title="Carousels" />
			<Row>
				<Col md={6} lg={6}>
					<Carosels />
				</Col>
				<Col md={6} lg={6}>
					<Carosels1 />
				</Col>
				<Col md={6} lg={6}>
					<Carosels2 />
				</Col>
				<Col md={6} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Carousel with captions</Card.Title>
							<Form.Check type="switch" id="custom-switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />

						</Card.Header>
						<Card.Body>

							<Carousel indicators={false}>
								{Carouselcaptions.map((Carouselcaption) => (
									<Carousel.Item key={Math.random()}>
										<img className="d-block w-100" alt="" src={Carouselcaption.src1} />
										<Carousel.Caption>
											<h3>Slide label</h3>
											<p>Secure other greater pleasures</p>
										</Carousel.Caption>
									</Carousel.Item>
								))}

							</Carousel>
						</Card.Body>
						<Collapse in={show} className="">
							<pre>
								<code>
									{`
 <Carousel indicators={false}>
 {Carouselcaptions.map((Carouselcaption) => (
	 <Carousel.Item>
		 <img key={Math.random()} className="d-block w-100" alt="" src={Carouselcaption.src1} />
		 <Carousel.Caption>
			 <h3>Slide label</h3>
			 <p>Secure other greater pleasures</p>
		 </Carousel.Caption>
	 </Carousel.Item>
 ))}

</Carousel>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={6} lg={6}>
					<Carosels3 />
				</Col>
				<Col md={6} lg={6}>
					<Carosels4 />
				</Col>
				<Col md={6} lg={6}>
					<Carosels5 />
				</Col>
				<Col md={6} lg={6}>
					<Carosels6 />
				</Col>
				<Col md={6} lg={6}>
					<Carosels7 />
				</Col>
				<Col md={6} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Carousel with Background color captions</Card.Title>
							<Form.Check type="switch" id="custom-switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />

						</Card.Header>
						<Card.Body>

							<Carousel indicators={false}>
								{backgroundcolors.map((backgroundcolor) => (
									<Carousel.Item key={Math.random()}>

										<img className="d-block w-100" alt=""
											src={backgroundcolor.src1}
											data-holder-rendered="true" />
										<Carousel.Caption>
											<h3>Slide label</h3>
											<p>The wise man therefore always holds in these matters to this
												principle of selection he rejects pleasures.</p>
										</Carousel.Caption>
									</Carousel.Item>
								))}

							</Carousel>
						</Card.Body>
						<Collapse in={show1} className="">
							<pre>
								<code>
									{`
	<Carousel indicators={false}>
	    {backgroundcolors.map((backgroundcolor) => (
	<Carousel.Item>
        <img key={Math.random()} className="d-block w-100" alt="" src={backgroundcolor.src1} data-holder-rendered="true" />
	<Carousel.Caption>
		<h3>Slide label</h3>
		<p>The wise man therefore always holds in these matters to this
			principle of selection he rejects pleasures.</p>
	</Carousel.Caption>
	</Carousel.Item>
	))}

</Carousel>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
};
export default Carousels;
