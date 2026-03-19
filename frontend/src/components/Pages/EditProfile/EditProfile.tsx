import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages';
import PageHeader from '../../../layout/Header/pageheader';
import { Card, Col, Row, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { countrys } from '../../../components/Pages/EditProfile/Data/EditprofileData';
import Select from 'react-select';

interface EditProfileProps { }

const EditProfile: FC<EditProfileProps> = () => (
	<Fragment>
		<PageHeader title="Edit Profile" />
		<Row>
			<Col xl={3} lg={4}>
				<Card className="box-widget widget-user">
					<div className="widget-user-image mx-auto mt-5"><img alt="User Avatar"
						className="rounded-circle" src={ImagesData("users2")} /></div>
					<Card.Body className="text-center pt-2">
						<div className="pro-user">
							<h3 className="pro-user-username  mb-1 fs-22">Patrenna</h3>
							<h6 className="pro-user-desc text-muted">Web Designer</h6>
							<div className="text-center mb-4">
								<span><i className="fa fa-star text-warning me-1"></i></span>
								<span><i className="fa fa-star text-warning me-1"></i></span>
								<span><i className="fa fa-star text-warning me-1"></i></span>
								<span><i className="fa fa-star-half-o text-warning me-1"></i></span>
								<span><i className="fa fa-star-o text-warning"></i></span>
							</div>
							<Link to="#" className="btn btn-primary mt-3">View Profile</Link>
						</div>
					</Card.Body>
					<Card.Footer className="p-0">
						<Row>
							<div className="col-6 border-end text-center">
								<div className="description-block p-4">
									<h5 className="description-header mb-1 font-weight-bold  number-font">
										689k
									</h5>
									<span className="text-muted">Followers</span>
								</div>
							</div>
							<div className="col-6">
								<div className="description-block text-center p-4">
									<h5 className="description-header mb-1 font-weight-bold  number-font">
										3,765
									</h5>
									<span className="text-muted">Following</span>
								</div>
							</div>
						</Row>
					</Card.Footer>
				</Card>
				<Card>
					<Card.Header>
						<Card.Title>Edit Password</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="text-center mb-5">
							<div className="widget-user-image">
								<img alt="User Avatar" className="rounded-circle  me-3"
									src={ImagesData("users2")} />
							</div>
						</div>
						<Form.Group>
							<Form.Label >Change Password</Form.Label>
							<Form.Control type="password" defaultValue="password" />
						</Form.Group>
						<Form.Group>
							<Form.Label >New Password</Form.Label>
							<Form.Control type="password" defaultValue="password" />
						</Form.Group>
						<Form.Group>
							<Form.Label >Confirm Password</Form.Label>
							<Form.Control type="password" defaultValue="password" />
						</Form.Group>
					</Card.Body>
					<Card.Footer className="text-end">
						<Button href="#" className="btn mb-1 me-2" variant='success'>Updated</Button>
						<Button href="#" className="btn mb-1 me-2" variant='danger'>Cancel</Button>
					</Card.Footer>
				</Card>
			</Col>
			<Col xl={9} lg={8}>
				<Card>
					<Card.Header>
						<Card.Title>Edit Profile</Card.Title>
					</Card.Header>
					<Card.Body>
						<Card.Title className="font-weight-bold">Basic info:</Card.Title>
						<Row>
							<Col sm={6} md={6}>
								<Form.Group>
									<Form.Label >First Name</Form.Label>
									<Form.Control type="text" placeholder="First Name"
										defaultValue="Patrenna" />
								</Form.Group>
							</Col>
							<Col sm={6} md={6}>
								<Form.Group>
									<Form.Label>Last Name</Form.Label>
									<Form.Control type="text" placeholder="Last Name"
										defaultValue="Schell" />
								</Form.Group>
							</Col>
							<Col sm={6} md={6}>
								<Form.Group>
									<Form.Label className='mt-2'>Email address</Form.Label>
									<Form.Control type="email" placeholder="Email"
										defaultValue="patrennaschell@gmail.com" />
								</Form.Group>
							</Col>
							<Col sm={6} md={6}>
								<Form.Group>
									<Form.Label className='mt-2'>Phone Number</Form.Label>
									<Form.Control type="number" placeholder="Number"
										defaultValue="1234567890" />
								</Form.Group>
							</Col>
							<Col md={12}>
								<Form.Group>
									<Form.Label className='mt-2'>Address</Form.Label>
									<Form.Control type="text" placeholder="Home Address"
										defaultValue="3rd Lane,4th Phase,Street no-4 California" />
								</Form.Group>
							</Col>
							<Col sm={6} md={4} lg={6} xl={4}>
								<Form.Group>
									<Form.Label className='mt-2'>City</Form.Label>
									<Form.Control type="text" placeholder="City"
										defaultValue="California" />
								</Form.Group>
							</Col>
							<Col sm={6} md={3} lg={6} xl={3}>
								<Form.Group>
									<Form.Label className='mt-2'>Postal Code</Form.Label>
									<Form.Control type="number" placeholder="ZIP Code" />
								</Form.Group>
							</Col>
							<Col md={5} xl={5} lg={12}>
								<Form.Group>
									<Form.Label className='mt-2'>Country</Form.Label>
									<Select options={countrys} classNamePrefix='Select2' placeholder="--Select--" />
								</Form.Group>
							</Col>
						</Row>
						<Card.Title className="font-weight-bold mt-5">External Links:</Card.Title>
						<Row>
							<Col sm={6} md={6}>
								<Form.Group>
									<Form.Label >Facebook</Form.Label>
									<Form.Control type="text"
										placeholder="https://www.facebook.com/" defaultValue="PatrennaSchell" />
								</Form.Group>
							</Col>
							<Col sm={6} md={6}>
								<Form.Group>
									<Form.Label >Google</Form.Label>
									<Form.Control type="text"
										placeholder="https://www.google.com/"
										defaultValue="patrenna@gmail.com" />
								</Form.Group>
							</Col>
							<Col sm={6} md={6}>
								<Form.Group>
									<Form.Label className='mt-2'>Twitter</Form.Label>
									<Form.Control type="text"
										placeholder="https://twitter.com/" defaultValue="PatrennaSchell" />
								</Form.Group>
							</Col>
							<Col sm={6} md={6}>
								<Form.Group>
									<Form.Label className='mt-2'>Pinterest</Form.Label>
									<Form.Control type="text"
										placeholder="https://in.pinterest.com/" defaultValue="PatrennaSchell" />
								</Form.Group>
							</Col>
						</Row>
						<Card.Title className="card-title font-weight-bold mt-5">About:</Card.Title>
						<Row>
							<Col md={12}>
								<Form.Group>
									<Form.Label >About Me</Form.Label>
									<Form.Control as="textarea" className='form-control' rows={5}
										placeholder="Enter About your description"defaultValue='Anim pariatur cliche reprehrighterit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumrighta shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo.'/>
								</Form.Group>
							</Col>
						</Row>
					</Card.Body>
					<Card.Footer className="text-end">
						<Button href="#" className="btn mb-1 me-2" variant='success'>Updated</Button>
						<Button href="#" className="btn mb-1 me-2" variant='danger'>Cancel</Button>
					</Card.Footer>
				</Card>
			</Col>
		</Row>
	</Fragment>
);

export default EditProfile;
