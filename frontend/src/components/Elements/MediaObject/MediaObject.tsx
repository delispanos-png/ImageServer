import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages';
import { Card, Row, Col } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
interface MediaObjectProps { }

const MediaObject: FC<MediaObjectProps> = () => (
	<Fragment>
		<PageHeader title="Media Object" />
		<Row>
			<Col lg={12}>
				<Card id="media">
					<Card.Header>
						<Card.Title>
							Basic Example
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="border p-4">
							<div className="media d-block d-sm-flex">
								<img alt="" className="avatar avatar-xl brround me-3"
									src={ImagesData("users4")} />
								<div className="media-body pt-2 pt-sm-0">
									<h5 className="mg-b-5 tx-inverse tx-15">Media heading</h5>
									Lorem Ipsum generators on the Internet as necessary aut odit aut
									fugit,
									sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
									nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
									amet, consectetur, adipisci velit
								</div>
							</div>
						</div>
					</Card.Body>
				</Card>
				<Card id="media1">
					<Card.Header>
						<Card.Title>
							Nesting
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="border p-4">
							<div className="media d-block d-sm-flex">
								<img alt="" className="avatar avatar-xl brround me-3"
									src={ImagesData("users9")} />
								<div className="media-body pt-2 pt-sm-0">
									<h5 className="mg-b-5 tx-inverse tx-15">Media heading</h5>
									<p>Lorem Ipsum generators on the Internet as necessary aut odit aut
										fugit, sed quia consequuntur magni dolores eos qui ratione
										voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
										ipsum quia dolor sit amet, consectetur, adipisci velit</p>
									<div className="media d-block d-sm-flex mg-t-25">
										<img alt="" className="avatar avatar-xl brround me-3"
											src={ImagesData("users8")} />
										<div className="media-body">
											<h5 className="mg-b-5 tx-inverse tx-15">Media heading</h5>
											Lorem Ipsum generators on the Internet as necessary aut odit
											aut
											fugit, sed quia consequuntur magni dolores eos qui ratione
											voluptatem sequi nesciunt. Neque porro quisquam est, qui
											dolorem
											ipsum quia dolor sit amet, consectetur, adipisci velit
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card.Body>
				</Card>
				<Card id="media2">
					<Card.Header>
						<Card.Title>
							Alignment
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="border p-4">
							<div className="media d-block d-sm-flex">
								<img alt="" className="avatar avatar-xl brround me-3 align-self-center"
									src={ImagesData("users11")} />
								<div className="media-body pt-2 pt-sm-0">
									<h5 className="mg-b-5 tx-inverse tx-15">Media heading</h5>
									Lorem Ipsum generators on the Internet as necessary aut odit aut
									fugit,
									sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
									nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
									amet, consectetur, adipisci velit Lorem Ipsum generators on the
									Internet
									as necessary aut odit aut fugit, sed quia consequuntur magni dolores
									eos
									qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
									dolorem ipsum quia dolor sit amet, consectetur, adipisci velit
								</div>
							</div>
						</div>
					</Card.Body>
				</Card>
				<Card id="media3">
					<Card.Header>
						<Card.Title>
							Order
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="border p-4">
							<div className="media d-block d-sm-flex">
								<div className="media-body pt-2 mb-sm-0">
									<h5 className="mg-b-5 tx-inverse tx-15">Media heading</h5>
									Lorem Ipsum generators on the Internet as necessary aut odit aut
									fugit,
									sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
									nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
									amet, consectetur, adipisci velit
								</div>
								<img alt="" className="avatar avatar-xl brround ms-3"
									src={ImagesData("users12")} />
							</div>
						</div>
					</Card.Body>
				</Card>
				<Card id="media4">
					<Card.Header>
						<Card.Title>
							Media List
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="border p-4">
							<ul className="list-unstyled mb-0">
								<li className="media d-block d-sm-flex border-0">
									<img alt="" className="avatar avatar-xl brround me-3"
										src={ImagesData("users2")} />
									<div className="media-body pt-2 pt-sm-0">
										<h5 className="mg-b-5 tx-inverse tx-15">Media heading</h5>
										Lorem Ipsum generators on the Internet as necessary aut odit aut
										fugit, sed quia consequuntur magni dolores eos qui ratione
										voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
										ipsum quia dolor sit amet, consectetur, adipisci velit
									</div>
								</li>
								<li className="media d-block d-sm-flex mt-5 border-0">
									<img alt="" className="avatar avatar-xl brround me-3"
										src={ImagesData("users12")} />
									<div className="media-body pt-2 pt-sm-0">
										<h5 className="mg-b-5 tx-inverse tx-15">Media heading</h5>
										Lorem Ipsum generators on the Internet as necessary aut odit aut
										fugit, sed quia consequuntur magni dolores eos qui ratione
										voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
										ipsum quia dolor sit amet, consectetur, adipisci velit
									</div>
								</li>
								<li className="media d-block d-sm-flex mt-5 border-0">
									<img alt="" className="avatar avatar-xl brround me-3"
										src={ImagesData("users2")} />
									<div className="media-body pt-2 pt-sm-0">
										<h5 className="mg-b-5 tx-inverse tx-15">Media heading</h5>
										Lorem Ipsum generators on the Internet as necessary aut odit aut
										fugit, sed quia consequuntur magni dolores eos qui ratione
										voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
										ipsum quia dolor sit amet, consectetur, adipisci velit
									</div>
								</li>
							</ul>
						</div>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	</Fragment>
);

export default MediaObject;
