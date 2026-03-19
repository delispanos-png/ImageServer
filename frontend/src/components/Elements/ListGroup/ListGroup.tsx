import React, { FC, Fragment } from 'react';
import { Card, Col, Row, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../layout/Header/pageheader';
import { List, List1, listitem, listGroup, listBadge, customList } from '../../../components/Elements/ListGroup/Data/ListgroupData';
interface ListGroupProps { }

const ListGroups: FC<ListGroupProps> = () => (
	<Fragment>
		<PageHeader title="List Group" />
		<Row>
			{List.map((List) => (
				<Col sm={12} lg={6} key={Math.random()}>
					<Card>
						<Card.Header>
							<Card.Title>{List.title}</Card.Title>
						</Card.Header>
						<Card.Body>
							<ListGroup>
								<ListGroup.Item className={List.active}>{List.item}</ListGroup.Item>
								<ListGroup.Item>{List.item1}</ListGroup.Item>
								<ListGroup.Item>{List.item2}</ListGroup.Item>
								<ListGroup.Item>{List.item3}</ListGroup.Item>
								<ListGroup.Item>{List.item4}</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
		<Row>
			{List1.map((Lists1) => (
				<Col sm={12} lg={4} key={Math.random()}>
					<Card>
						<Card.Header>
							<Card.Title>{Lists1.title}</Card.Title>
						</Card.Header>
						<Card.Body>
							<div className={`panel panel-${Lists1.color}`}>
								<ListGroup>
									<ListGroup.Item>{Lists1.item}</ListGroup.Item>
									<ListGroup.Item active>{Lists1.item1}</ListGroup.Item>
									<ListGroup.Item>{Lists1.item2}</ListGroup.Item>
									<ListGroup.Item>{Lists1.item3}
									</ListGroup.Item>
									<ListGroup.Item>{Lists1.item4}</ListGroup.Item>
								</ListGroup>
							</div>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
		<Row>
			<Col sm={12} lg={6} >
				<Card>
					<Card.Header>
						<Card.Title>Order list</Card.Title>
					</Card.Header>
					<Card.Body>
						<ListGroup as="ol" numbered>
							<ListGroup.Item as="li">Cras justo
								odio</ListGroup.Item>
							<ListGroup.Item as="li">Dapibus ac
								facilisis in</ListGroup.Item>
							<ListGroup.Item as="li">Morbi leo
								risus</ListGroup.Item>
							<ListGroup.Item as="li">Porta ac
								consectetur
								ac</ListGroup.Item>
							<ListGroup.Item as="li">Vestibulum at
								eros</ListGroup.Item>
						</ListGroup>
					</Card.Body>
				</Card>
			</Col>
			<Col sm={12} lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Unorder list</Card.Title>
					</Card.Header>
					<Card.Body>
						<ul className="list-group">
											<li className="listunorder">Cras justo odio</li>
											<li className="listunorder">Dapibus ac facilisis in</li>
											<li className="listunorder">Morbi leo risus</li>
											<li className="listunorder">Porta ac consectetur ac</li>
											<li className="listunorder">Vestibulum at eros</li>
										</ul>
					</Card.Body>
				</Card>
			</Col>
		</Row>
		<Row>
			{listitem.map((listitems) => (
				<Col sm={12} lg={6} key={Math.random()}>
					<Card>
						<Card.Header>
							<Card.Title>{listitems.title}</Card.Title>
						</Card.Header>
						<Card.Body>
							<ListGroup>
								<ListGroup.Item className={listitems.class} >{listitems.item}</ListGroup.Item>
								<ListGroup.Item variant={listitems.color} >{listitems.item1}</ListGroup.Item>
								<ListGroup.Item variant={listitems.color1}>{listitems.item2}</ListGroup.Item>
								<ListGroup.Item variant={listitems.color2}>{listitems.item3}</ListGroup.Item>
								<ListGroup.Item variant={listitems.color3}>{listitems.item4}</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
		<Row>
			{listGroup.map((listGroups) => (
				<Col sm={12} lg={6} key={Math.random()}>
					<Card>
						<Card.Header>
							<Card.Title>{listGroups.title}</Card.Title>
						</Card.Header>
						<Card.Body>
							<ListGroup>
								<ListGroup.Item >{listGroups.icon}{listGroups.item}</ListGroup.Item>
								<ListGroup.Item >{listGroups.icon1}{listGroups.item1}</ListGroup.Item>
								<ListGroup.Item >{listGroups.icon2}{listGroups.item2}</ListGroup.Item>
								<ListGroup.Item >{listGroups.icon3}{listGroups.item3}</ListGroup.Item>
								<ListGroup.Item >{listGroups.icon4}{listGroups.item4}</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
		<Row>
			<Col lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Unorder List Style</Card.Title>
					</Card.Header>
					<Card.Body className="card-body ps-5 pe-5">
						<ul className="list-style">
							<li>Lorem ipsum dolor sit amet</li>
							<li>Consectetur adipiscing elit</li>
							<li>Integer molestie lorem at massa</li>
							<li>Facilisis in pretium nisl aliquet</li>
							<li>Nulla volutpat aliquam velit
								<ul>
									<li>Phasellus iaculis neque</li>
									<li>Purus sodales ultricies</li>
									<li>Vestibulum laoreet porttitor sem</li>
									<li>Ac tristique libero volutpat at</li>
								</ul>
							</li>
							<li>Faucibus porta lacus fringilla vel</li>
							<li>Aenean sit amet erat nunc</li>
							<li>Eget porttitor lorem</li>
						</ul>
					</Card.Body>
				</Card>
			</Col>
			<Col lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Unorder List Style2</Card.Title>
					</Card.Header>
					<Card.Body className="card-body ps-5 pe-5">
						<ul className="list-style2">
							<li>Lorem ipsum dolor sit amet</li>
							<li>Consectetur adipiscing elit</li>
							<li>Integer molestie lorem at massa</li>
							<li>Facilisis in pretium nisl aliquet</li>
							<li>Nulla volutpat aliquam velit
								<ul>
									<li>Phasellus iaculis neque</li>
									<li>Purus sodales ultricies</li>
									<li>Vestibulum laoreet porttitor sem</li>
									<li>Ac tristique libero volutpat at</li>
								</ul>
							</li>
							<li>Faucibus porta lacus fringilla vel</li>
							<li>Aenean sit amet erat nunc</li>
							<li>Eget porttitor lorem</li>
						</ul>
					</Card.Body>
				</Card>
			</Col>
			<Col lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Unorder List Style3</Card.Title>
					</Card.Header>
					<Card.Body className="card-body ps-5 pe-5">
						<ul className="list-style3">
							<li>Lorem ipsum dolor sit amet</li>
							<li>Consectetur adipiscing elit</li>
							<li>Integer molestie lorem at massa</li>
							<li>Facilisis in pretium nisl aliquet</li>
							<li>Nulla volutpat aliquam velit
								<ul>
									<li>Phasellus iaculis neque</li>
									<li>Purus sodales ultricies</li>
									<li>Vestibulum laoreet porttitor sem</li>
									<li>Ac tristique libero volutpat at</li>
								</ul>
							</li>
							<li>Faucibus porta lacus fringilla vel</li>
							<li>Aenean sit amet erat nunc</li>
							<li>Eget porttitor lorem</li>
						</ul>
					</Card.Body>
				</Card>
			</Col>
			<Col lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Unorder List Style4</Card.Title>
					</Card.Header>
					<Card.Body className="card-body ps-5 pe-5">
						<ul className="list-style4">
							<li>Lorem ipsum dolor sit amet</li>
							<li>Consectetur adipiscing elit</li>
							<li>Integer molestie lorem at massa</li>
							<li>Facilisis in pretium nisl aliquet</li>
							<li>Nulla volutpat aliquam velit
								<ul>
									<li>Phasellus iaculis neque</li>
									<li>Purus sodales ultricies</li>
									<li>Vestibulum laoreet porttitor sem</li>
									<li>Ac tristique libero volutpat at</li>
								</ul>
							</li>
							<li>Faucibus porta lacus fringilla vel</li>
							<li>Aenean sit amet erat nunc</li>
							<li>Eget porttitor lorem</li>
						</ul>
					</Card.Body>
				</Card>
			</Col>
			<Col lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Unorder List Style5</Card.Title>
					</Card.Header>
					<Card.Body className="card-body ps-5 pe-5">
						<ul className="list-style5">
							<li>Lorem ipsum dolor sit amet</li>
							<li>Consectetur adipiscing elit</li>
							<li>Integer molestie lorem at massa</li>
							<li>Facilisis in pretium nisl aliquet</li>
							<li>Nulla volutpat aliquam velit
								<ul>
									<li>Phasellus iaculis neque</li>
									<li>Purus sodales ultricies</li>
									<li>Vestibulum laoreet porttitor sem</li>
									<li>Ac tristique libero volutpat at</li>
								</ul>
							</li>
							<li>Faucibus porta lacus fringilla vel</li>
							<li>Aenean sit amet erat nunc</li>
							<li>Eget porttitor lorem</li>
						</ul>
					</Card.Body>
				</Card>
			</Col>
			<Col lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Unorder List Style6</Card.Title>
					</Card.Header>
					<Card.Body className="card-body ps-5 pe-5">
						<ul className="list-style6">
							<li>Lorem ipsum dolor sit amet</li>
							<li>Consectetur adipiscing elit</li>
							<li>Integer molestie lorem at massa</li>
							<li>Facilisis in pretium nisl aliquet</li>
							<li>Nulla volutpat aliquam velit
								<ul>
									<li>Phasellus iaculis neque</li>
									<li>Purus sodales ultricies</li>
									<li>Vestibulum laoreet porttitor sem</li>
									<li>Ac tristique libero volutpat at</li>
								</ul>
							</li>
							<li>Faucibus porta lacus fringilla vel</li>
							<li>Aenean sit amet erat nunc</li>
							<li>Eget porttitor lorem</li>
						</ul>
					</Card.Body>
				</Card>
			</Col>
			<Col lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Order list</Card.Title>
					</Card.Header>
					<Card.Body className="card-body ps-5 pe-5">
						<ol className="order-list">
							<li>Lorem ipsum dolor sit amet</li>
							<li>Consectetur adipiscing elit</li>
							<li>Integer molestie lorem at massa</li>
							<li>Facilisis in pretium nisl aliquet</li>
							<li>Nulla volutpat aliquam velit
								<ol className="order-list">
									<li>Phasellus iaculis neque</li>
									<li>Purus sodales ultricies</li>
									<li>Vestibulum laoreet porttitor sem</li>
									<li>Ac tristique libero volutpat at</li>
								</ol>
							</li>
							<li>Faucibus porta lacus fringilla vel</li>
							<li>Aenean sit amet erat nunc</li>
							<li>Eget porttitor lorem</li>
						</ol>
					</Card.Body>
				</Card>
			</Col>
			<Col lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Order With unorder</Card.Title>
					</Card.Header>
					<Card.Body className="card-body ps-5 pe-5">
						<ol className="order-list">
							<li>Lorem ipsum dolor sit amet</li>
							<li>Consectetur adipiscing elit</li>
							<li>Integer molestie lorem at massa</li>
							<li>Facilisis in pretium nisl aliquet</li>
							<li>Nulla volutpat aliquam velit
								<ul className="list-style4 ps-5">
									<li>Phasellus iaculis neque</li>
									<li>Purus sodales ultricies</li>
									<li>Vestibulum laoreet porttitor sem</li>
									<li>Ac tristique libero volutpat at</li>
								</ul>
							</li>
							<li>Faucibus porta lacus fringilla vel</li>
							<li>Aenean sit amet erat nunc</li>
							<li>Eget porttitor lorem</li>
						</ol>
					</Card.Body>
				</Card>
			</Col>
		</Row>
		<Row>
			{listBadge.map((listBadges) => (
				<Col sm={12} lg={6} key={Math.random()}>
					<Card>
						<Card.Header>
							<Card.Title>{listBadges.title}</Card.Title>
						</Card.Header>
						<Card.Body>
							<ListGroup>
								<ListGroup.Item>
									{listBadges.item}
									<Badge className=" badgetext badge  rounded-pill" bg={listBadges.color} pill>{listBadges.class}</Badge>
								</ListGroup.Item>
								<ListGroup.Item >
									{listBadges.item1}
									<Badge className=" badgetext badge  rounded-pill" bg={listBadges.color1} pill>{listBadges.class1}</Badge>
								</ListGroup.Item>
								<ListGroup.Item >
									{listBadges.item2}
									<Badge className=" badgetext badge  rounded-pill" bg={listBadges.color2} pill>{listBadges.class2}</Badge>
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
		<Row>
			{customList.map((customLists) => (
				<Col sm={12} lg={6} key={Math.random()}>
					<Card>
						<Card.Header>
							<Card.Title>{customLists.title}</Card.Title>
						</Card.Header>
						<Card.Body>
							<ListGroup>
								<ListGroup.Item
									className={`list-group-item list-group-item-action  ${customLists.main}`}>
									<div className="d-flex w-100 justify-content-between">
										<h5 className="mb-1">{customLists.heading}</h5>
										<small>{customLists.data}</small>
									</div>
									<p className="mb-1">{customLists.description}</p>
									<small>{customLists.class}</small>
								</ListGroup.Item>
								<ListGroup.Item
									className={`list-group-item list-group-item-action  ${customLists.main1}`}>
									<div className="d-flex w-100 justify-content-between">
										<h5 className="mb-1">{customLists.heading1}</h5>
										<small className="text-muted">{customLists.data1}</small>
									</div>
									<p className="mb-1">{customLists.description1}</p>
									<small className="text-muted">{customLists.class1}</small>
								</ListGroup.Item>
								<ListGroup.Item
									className={`list-group-item list-group-item-action  ${customLists.main1}`}>
									<div className="d-flex w-100 justify-content-between">
										<h5 className="mb-1">{customLists.heading2}</h5>
										<small className="text-muted">{customLists.data2}</small>
									</div>
									<p className="mb-1">{customLists.description2}</p>
									<small className="text-muted">{customLists.class2}</small>
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
	</Fragment>
);

export default ListGroups;
