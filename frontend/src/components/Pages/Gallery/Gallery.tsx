import React, { FC, Fragment, useState } from 'react';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages';
import PageHeader from '../../../layout/Header/pageheader';
import { Card, Col, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { LightboxGallery } from './Data/GalleryData';
interface GalleryProps { }

const Gallery: FC<GalleryProps> = () => {
	const [open, setOpen] = React.useState(false);

	const [BasicExpanded, setBasicExpanded] = useState(true)

	const BasicHandleExpandClick = () => {
		setBasicExpanded(!BasicExpanded)
	}
	const [Basicshow, setBasicshow] = useState(true)
	return (
		<Fragment>
			<PageHeader title="Gallery" />
			<Col>
				{Basicshow ?
					<Card className="demo-gallery card">
						<Card.Header>
							<Card.Title>Light Gallery</Card.Title>
							<div className="card-options">
								<Link to="#" onClick={BasicHandleExpandClick} className="card-options-collapse me-2"
									data-bs-toggle="card-collapse"><i className={`fe ${BasicExpanded ? 'fe fe-chevron-up' : 'fe fe-chevron-down'}`}></i></Link>
								<Link to="#" onClick={() => setBasicshow(false)}
									className="card-options-remove"
									data-bs-toggle="card-remove"
								><i className="fe fe-x"></i></Link>
							</div>
						</Card.Header>
						<Collapse in={BasicExpanded} timeout={5000}>
							<Card.Body>
								<LightboxGallery />
							</Card.Body>
						</Collapse>
					</Card>
					: null}
			</Col>
		</Fragment>
	)
}

export default Gallery;
