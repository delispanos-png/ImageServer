import React, { FC, Fragment, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Collapse, Dropdown, Form, Row, ToggleButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../layout/Header/pageheader';
import { defaultButton, disableButton, squareButton, roundButton, lightButton, disabledButton, roundedButton, roundlightButton, iconButton, toggleButton, outlineButton, outlinedisableButton, buttonIcon, socialButton, colorButton, socialIcon, buttonIcons } from '../../Elements/Buttons/Data/BuutonsData';
interface ButtonsProps { }

const Buttons: FC<ButtonsProps> = () => {
	const [show, setShow] = useState(false);
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	const [show3, setShow3] = useState(false);
	const [show4, setShow4] = useState(false);
	const [show5, setShow5] = useState(false);
	const [show6, setShow6] = useState(false);
	const [show7, setShow7] = useState(false);
	const [show8, setShow8] = useState(false);
	const [show9, setShow9] = useState(false);
	const [show10, setShow10] = useState(false);
	const [show11, setShow11] = useState(false);
	const [show12, setShow12] = useState(false);
	const [show13, setShow13] = useState(false);
	const [show14, setShow14] = useState(false);
	const [show15, setShow15] = useState(false);
	const [show16, setShow16] = useState(false);
	const [show17, setShow17] = useState(false);
	const [show18, setShow18] = useState(false);
	const [show19, setShow19] = useState(false);
	const [show20, setShow20] = useState(false);
	const [show21, setShow21] = useState(false);
	const [show22, setShow22] = useState(false);
	const [show23, setShow23] = useState(false);
	const [show24, setShow24] = useState(false);

	//radio Buttons
	const [radioValue, setRadioValue] = useState('1');
	interface radio {
		name: string
		value: string
	}
	const radios: radio[] = [
		{ name: 'Radio 1', value: '1' },
		{ name: 'Radio 2', value: '2' },
		{ name: 'Radio 3', value: '3' },
	];
	//Checked Buttons
	const [checked, setChecked] = useState(false);


	return (

		<Fragment>
			<PageHeader title="Buttons" />
			<Row>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Default Button</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{defaultButton.map((defaultButtons) => (
									<Button key={Math.random()} variant={defaultButtons.color} >{defaultButtons.Buttontheme}</Button>
								))}

							</div>
						</Card.Body>
						<Collapse in={show} className="">
							<pre>
								<code>
									{`
 <div className="btn-list">
 {defaultButton.map((defaultButtons) => (
	 <Button key={Math.random()} variant={defaultButtons.color} >{defaultButtons.Buttontheme}</Button>
 ))}
 
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Disabled buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								<div className="btn-list">
									{disableButton.map((disableButtons) => (
										<Button className='disableButtonsabled' key={Math.random()} variant={disableButtons.color} >{disableButtons.Buttontheme}</Button>
									))}

								</div>
							</div>
						</Card.Body>
						<Collapse in={show1} className="">
							<pre>
								<code>
									{`
 <div className="btn-list">
 {disableButton.map((disableButtons) => (
	 <Button className='disableButtonsabled' key={Math.random()} variant={disableButtons.color} >{disableButtons.Buttontheme}</Button>
 ))}
 
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Square buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />

						</Card.Header>
						<Card.Body>

							<div className="btn-list">
								{squareButton.map((squareButtons) => (
									<Button className='btn-square' key={Math.random()} variant={squareButtons.color} >{squareButtons.Buttontheme}</Button>
								))}

							</div>
						</Card.Body>
						<Collapse in={show2} className="">
							<pre>
								<code>
									{`
 <div className="btn-list">
 {squareButton.map((squareButtons) => (
	 <Button className='btn-square' key={Math.random()} variant={squareButtons.color} >{squareButtons.Buttontheme}</Button>
 ))}
 
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Rounded buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow3(!show3)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{roundButton.map((round) => (
									<Button className='btn-pill' key={Math.random()} variant={round.color} >{round.Buttontheme}</Button>
								))}
							</div>
						</Card.Body>
						<Collapse in={show3} className="">
							<pre>
								<code>
									{`
 <div className="btn-list">
 {roundButton.map((round) => (
	 <Button className='btn-pill' key={Math.random()} variant={round.color} >{round.Buttontheme}</Button>
 ))}
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Light buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow4(!show4)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{lightButton.map((lightButtons) => (
									<Button href="#" key={Math.random()} className={`btn bg-${lightButtons.color}-transparent`} variant={lightButtons.Buttontheme}>{lightButtons.Buttontheme}</Button>

								))}
							</div>
						</Card.Body>
						<Collapse in={show4} className="">
							<pre>
								<code>
									{`
 <ButtonclassName="btn bg-secondary-transparent"  variant=''>Secondary</ButtonclassName=>
<Button href="#" className="btn bg-info-transparent"  variant=''>Info</Button>
<Button href="#" className="btn bg-teal-transparent"  variant=''>Teal</Button>
<Button href="#" className="btn bg-warning-transparent"  variant=''>Warning</Button>
<Button href="#" className="btn bg-danger-transparent"  variant=''>Danger</Button>
<Button href="#" className="btn bg-dark-transparent"  variant=''>Dark</Button>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<h3 className="card-title">Disabled Light buttons</h3>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow5(!show5)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{disabledButton.map((disabledButtons) => (
									<Button href="#" key={Math.random()} className={`btn bg-${disabledButtons.color}-transparent disabled`} variant={disabledButtons.Buttontheme}>{disabledButtons.Buttontheme}</Button>

								))}
							</div>
						</Card.Body>
						<Collapse in={show5} className="">
							<pre>
								<code>
									{`
 <Button href="#" className="btn bg-primary-transparent disabled">Primary</Button>
<Button href="#" className="btn bg-secondary-transparent disabled">Secondary</Button>
<Button href="#" className="btn bg-success-transparent disabled">Success</Button>
<Button href="#" className="btn bg-info-transparent disabled">Info</Button>
<Button href="#" className="btn bg-teal-transparent disabled">Teal</Button>
<Button href="#" className="btn bg-warning-transparent disabled">Warning</Button>
<Button href="#" className="btn bg-danger-transparent disabled">Danger</Button>
<Button href="#" className="btn bg-dark-transparent disabled">Dark</Button>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Light Rounded buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow6(!show6)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{roundedButton.map((roundedButtons) => (
									<Button key={Math.random()} href="#" className={`btn-pill bg-${roundedButtons.color}-transparent`} variant={roundedButtons.Buttontheme}>{roundedButtons.Buttontheme}</Button>

								))}
							</div>
						</Card.Body>
						<Collapse in={show6} className="">
							<pre>
								<code>
									{`
 <Button href="#" className="btn btn-pill bg-primary-transparent" variant=''>Primary</Button>
<Button href="#" className="btn btn-pill bg-secondary-transparent" variant=''>Secondary</Button>
<Button href="#" className="btn btn-pill bg-success-transparent" variant=''>Success</Button>
<Button href="#" className="btn btn-pill bg-info-transparent" variant=''>Info</Button>
<Button href="#" className="btn btn-pill bg-teal-transparent" variant=''>Teal</Button>
<Button href="#" className="btn btn-pill bg-warning-transparent" variant=''>Warning</Button>
<Button href="#" className="btn btn-pill bg-danger-transparent" variant=''>Danger</Button>
<Button href="#" className="btn btn-pill bg-dark-transparent" variant=''>Dark</Button>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Disabled Light Rounded buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow7(!show7)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">

								{roundlightButton.map((roundlightButtons) => (
									<Button href="#" key={Math.random()} className={`btn-pill bg-${roundlightButtons.color}-transparent disabled`} variant={roundlightButtons.Buttontheme}>{roundlightButtons.Buttontheme}</Button>

								))}

							</div>
						</Card.Body>
						<Collapse in={show7} className="">
							<pre>
								<code>
									{`
<Button className="btn-pill bg-primary-transparent disabled">Primary</Button>
<Button className="btn-pill bg-secondary-transparent disabled">Secondary</Button>
<Button className="btn-pill bg-success-transparent disabled">Success</Button>
<Button className="btn-pill bg-info-transparent disabled">Info</Button>
<Button className="btn-pill bg-teal-transparent disabled">Teal</Button>
<Button className="btn-pill bg-warning-transparent disabled">Warning</Button>
<Button className="btn-pill bg-danger-transparent disabled">Danger</Button>
<Button className="btn-pill bg-dark-transparent disabled">Dark</Button>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Light Icon buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow8(!show8)} />
						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{iconButton.map((iconButtons) => (
									<Button key={Math.random()} href="#" variant={`btn bg-${iconButtons.color}-transparent`}>{iconButtons.icon}</Button>

								))}
							</div>
						</Card.Body>
						<Collapse in={show8} className="">
							<pre>
								<code>
									{`
<Button type="button" className="btn bg-primary-transparent"><i className="fe fe-plus"></i></Button>
<Button type="button" className="btn bg-warning-transparent"><i className="fe fe-heart"></i></Button>
<Button type="button" className="btn bg-success-transparent"><i className="fe fe-check"></i></Button>
<Button type="button" className="btn bg-danger-transparent"><i className="fe fe-link"></i></Button>
<Button type="button" className="btn bg-info-transparent"><i className="fe fe-message-circle"></i></Button>
<Button type="button" className="btn bg-teal-transparent"><i className="fe fe-trash"></i></Button>
<Button type="button" className="btn bg-dark-transparent"><i className="fe fe-upload"></i></Button> 
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Toggle buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow9(!show9)} />
						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{toggleButton.map((toggleButtons) => (
									<Button key={Math.random()} variant={toggleButtons.color} >{toggleButtons.Buttontheme}</Button>
								))}

							</div>
						</Card.Body>
						<Collapse in={show9} className="">
							<pre>
								<code>
									{`
	<div className="btn-list">
	{toggleButton.map((toggleButtons) => (
			<Button key={Math.random()} variant={toggleButtons.color} >{toggleButtons.Buttontheme}</Button>
		))}
		</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Outline buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow10(!show10)} />
						</Card.Header>
						<Card.Body>
							<div className="btn-list">

								{outlineButton.map((outlineButtons) => (
									<Button key={Math.random()} href="#" variant={outlineButtons.color}>{outlineButtons.Buttontheme}</Button>

								))}
							</div>
						</Card.Body>
						<Collapse in={show10} className="">
							<pre>
								<code>
									{`
<div className="btn-list">
						
{outlineButton.map((outlineButtons) => (
		<Button href="#" variant={outlineButtons.color}>{outlineButtons.Buttontheme}</Button>

	))}
	</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Outline Disabled buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow11(!show11)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{outlinedisableButton.map((outlinedisableButtons) => (
									<Button key={Math.random()} href="#" className='disabled' variant={outlinedisableButtons.color}>{outlinedisableButtons.Buttontheme}</Button>

								))}

							</div>
						</Card.Body>
						<Collapse in={show11} className="">
							<pre>
								<code>
									{`
<div className="btn-list">
{outlinedisableButton.map((outlinedisableButtons) => (
		<Button href="#" className='disabled' variant={outlinedisableButtons.color}>{outlinedisableButtons.Buttontheme}</Button>

	))}
	</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6} xl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Radio buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow12(!show12)} />
						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								<ButtonGroup>
									{radios.map((radio, idx) => (
										<ToggleButton
											key={idx}
											id={`radio-${idx}`}
											type="radio"
											variant={idx % 2 ? 'outline-primary' : 'outline-primary'}
											name="radio"
											value={radio.value}
											checked={radioValue === radio.value}
											onChange={(e) => setRadioValue(e.currentTarget.value)}
										>
											{radio.name}
										</ToggleButton>
									))}
								</ButtonGroup>
							</div>
						</Card.Body>
						<Collapse in={show12} className="">
							<pre>
								<code>
									{`
<div className="btn-list">
<ButtonGroup role="group" aria-label="Basic radio toggle button group">

<input type="radio" className="btn-check" name="btnradio" id="btnradio1" checked>
<label class="btn btn-outline-primary" for="btnradio1">Radio 1</label>

<input type="radio" className="btn-check" name="btnradio" id="btnradio2">
<label class="btn btn-outline-primary" for="btnradio2">Radio 2</label>

<input type="radio" className="btn-check" name="btnradio" id="btnradio3">
<label class="btn btn-outline-primary" for="btnradio3">Radio 3</label>
</ButtonGroup>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6} xl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Checkbox buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow13(!show13)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								<ButtonGroup className="mb-2">

									<ToggleButton
										id="toggle-check"
										type="checkbox"
										variant="outline-primary"
										className='text-wrap'
										checked={checked}
										value="1"
										onChange={(e) => setChecked(e.currentTarget.checked)}
									>
										checkbox 1
									</ToggleButton>
									<ToggleButton
										id="toggle-check"
										type="checkbox"
										variant="outline-primary"
										className='text-wrap'
										value="1"
										onChange={(e) => setChecked(e.currentTarget.checked)}
									>
										checkbox 2
									</ToggleButton>
									<ToggleButton
										id="toggle-check"
										type="checkbox"
										variant="outline-primary"
										className='text-wrap'
										value="1"
										onChange={(e) => setChecked(e.currentTarget.checked)}
									>
										checkbox 3
									</ToggleButton>
								</ButtonGroup>
							</div>
						</Card.Body>
						<Collapse in={show13} className="">
							<pre>
								<code>
									{`
<div className="btn-list">
<ButtonGroup role="group" aria-label="Basic radio toggle button group">

<input type="radio" className="btn-check" name="btnradio" id="btnradio1" checked>
<label class="btn btn-outline-primary" for="btnradio1">checkbox 1</label>

<input type="radio" className="btn-check" name="btnradio" id="btnradio2">
<label class="btn btn-outline-primary" for="btnradio2">checkbox 2</label>

<input type="radio" className="btn-check" name="btnradio" id="btnradio3">
<label class="btn btn-outline-primary" for="btnradio3">checkbox 3</label>
</ButtonGroup>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} xl={12}>
					<Card>
						<Card.Header>
							<Card.Title>Button Toolbar</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow14(!show14)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								<div className="btn-toolbar" role="toolbar"
									aria-label="Toolbar with button groups">
									<div className="btn-group me-2 mb-1 mb-sm-0" role="group" aria-label="First group">
										<Button type="button" variant="primary">1</Button>
										<Button type="button" variant="primary">2</Button>
										<Button type="button" variant="primary">3</Button>
										<Button type="button" variant="primary">4</Button>
									</div>
									<div className="btn-group me-2 mb-1 mb-sm-0" role="group" aria-label="Second group">
										<Button type="button" variant="primary">5</Button>
										<Button type="button" variant="primary">6</Button>
										<Button type="button" variant="primary">7</Button>
									</div>
									<div className="btn-group mb-1 mb-sm-0" role="group" aria-label="Third group">
										<Button type="button" variant="primary">8</Button>
									</div>
								</div>
							</div>
						</Card.Body>
						<Collapse in={show14} className="">
							<pre>
								<code>
									{`
<div className="btn-list">
<div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
<div className="btn-group me-2 mb-1 mb-sm-0" role="group" aria-label="First group">
		<Button type="button" variant="primary">1</Button>
		<Button type="button" variant="primary">2</Button>
		<Button type="button" variant="primary">3</Button>
		<Button type="button" variant="primary">4</Button>
</div>
<div className="btn-group me-2 mb-1 mb-sm-0" role="group" aria-label="Second group">
		<Button type="button" variant="primary">5</Button>
		<Button type="button" variant="primary">6</Button>
		<Button type="button" variant="primary">7</Button>
</div>
<div className="btn-group mb-1 mb-sm-0" role="group" aria-label="Third group">
		<Button type="button" variant="primary">8</Button>
</div>
</div>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Button with icon</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow15(!show15)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{buttonIcon.map((buttonIcons) => (
									<Button key={Math.random()} variant={buttonIcons.color}>{buttonIcons.icon}{buttonIcons.Buttontheme}</Button>
								))}
							</div>
						</Card.Body>
						<Collapse in={show15} className="">
							<pre>
								<code>
									{`
<div className="btn-list">
{buttonIcon.map((buttonIcons) => (
	<Button key={Math.random()} variant={buttonIcons.color}>{buttonIcons.icon}{buttonIcons.Buttontheme}</Button>
))}
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Button with Svg icon</Card.Title>
						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								<Button type="button" className="btn-svgs btn-svg-white" variant='primary'><svg
									className="svg-icon" xmlns="http://www.w3.org/2000/svg" height="20"
									viewBox="0 0 24 24" width="24">
									<path d="M0 0h24v24H0V0z" fill="none"></path>
									<path
										d="M16.5 5c-1.54 0-3.04.99-3.56 2.36h-1.87C10.54 5.99 9.04 5 7.5 5 5.5 5 4 6.5 4 8.5c0 2.89 3.14 5.74 7.9 10.05l.1.1.1-.1C16.86 14.24 20 11.39 20 8.5c0-2-1.5-3.5-3.5-3.5z"
										opacity=".3"></path>
									<path
										d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z">
									</path>
								</svg> <span className="btn-svg-text">Like</span></Button>
								<Button type="button" className="btn-svgs btn-svg-white" variant='dark'><svg
									className="svg-icon" xmlns="http://www.w3.org/2000/svg" height="20"
									viewBox="0 0 24 24" width="24">
									<path d="M0 0h24v24H0V0z" fill="none"></path>
									<path d="M13 4H6v16h12V9h-5V4zm3 14H8v-2h8v2zm0-6v2H8v-2h8z"
										opacity=".3"></path>
									<path
										d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z">
									</path>
								</svg><span className="btn-svg-text">File</span></Button>
								<Button type="button" className="btn-svgs btn-svg-white" variant='warning'><svg
									className="svg-icon" xmlns="http://www.w3.org/2000/svg" height="20"
									viewBox="0 0 24 24" width="24">
									<path d="M0 0h24v24H0V0z" fill="none"></path>
									<path d="M5 19h14V8H5v11zm5.55-6v-3h2.91v3H16l-4 4-4-4h2.55z"
										opacity=".3"></path>
									<path
										d="M16 13h-2.55v-3h-2.9v3H8l4 4zm4.54-7.77l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.81.97H5.44l.8-.97zM19 19H5V8h14v11z">
									</path>
								</svg> <span className="btn-svg-text">Download</span></Button>
								<Button type="button" className="btn-svgs btn-svg-white" variant='success'><svg
									className="svg-icon" xmlns="http://www.w3.org/2000/svg" height="20"
									viewBox="0 0 24 24" width="24">
									<path d="M0 0h24v24H0V0z" fill="none"></path>
									<path d="M5 8h14V6H5z" opacity=".3"></path>
									<path
										d="M7 11h2v2H7zm12-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-4 3h2v2h-2zm-4 0h2v2h-2z">
									</path>
								</svg> <span className="btn-svg-text">Calendar</span></Button>
								<Button type="button" className="btn-svgs btn-svg-white" variant='danger'><svg
									className="svg-icon" xmlns="http://www.w3.org/2000/svg" height="20"
									viewBox="0 0 24 24" width="24">
									<path d="M0 0h24v24H0V0z" fill="none"></path>
									<circle cx="18" cy="5" opacity=".3" r="1"></circle>
									<circle cx="6" cy="12" opacity=".3" r="1"></circle>
									<circle cx="18" cy="19.02" opacity=".3" r="1"></circle>
									<path
										d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z">
									</path>
								</svg><span className="btn-svg-text"> Share</span></Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Button sizes</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow16(!show16)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								<Button type="button" className="btn-sm mb-1" variant='primary'>Small
									button</Button>
								<Button type="button" className="btn-md mb-1" variant='success'>Medium
									button</Button>
								<Button type="button" className="btn-lg mb-1" variant='danger'>Large
									button</Button>
							</div>
						</Card.Body>
						<Collapse in={show16} className="">
							<pre>
								<code>
									{`
<div className="btn-list">
<Button type="button" className="btn-sm mb-1" variant='primary'>Small button</Button>
<Button type="button" className="btn-md mb-1" variant='success'>Medium button</Button>
<Button type="button" className="btn-lg mb-1" variant='danger'>Large button</Button>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={6}>
					<Card>
						<Card.Header>
							<Card.Title>Width Buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow17(!show17)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								<Button type="button" className="w-xs mb-1" variant='primary'>XS</Button>
								<Button type="button" className="w-sm mb-1" variant='success'>SM</Button>
								<Button type="button" className="w-md mb-1" variant='danger'>MD</Button>
								<Button type="button" className=" w-lg mb-1" variant='success'>LG</Button>
							</div>
						</Card.Body>
						<Collapse in={show17} className="">
							<pre>
								<code>
									{`
<div className="btn-list">
<Button type="button" className="w-xs mb-1" variant='primary'>XS</Button>
<Button type="button" className="w-sm mb-1" variant='success'>SM</Button>
<Button type="button" className="w-md mb-1" variant='danger'>MD</Button>
<Button type="button" className=" w-lg mb-1" variant='success'>LG</Button>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Block Level Button</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow18(!show18)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								<Button type="button"
									className="btn bg-primary-transparent btn-md btn-block" variant=''>Block
									level button</Button>
								<Button type="button" className="btn bg-info-transparent btn-md btn-block" variant=''>Block
									level button</Button>
								<Button type="button"
									className="btn bg-success-transparent btn-sm btn-block" variant=''>Block
									level button</Button>
							</div>
						</Card.Body>
						<Collapse in={show18} className="">
							<pre>
								<code>
									{`
	<div className="btn-list">
	<Button type="button" className="btn bg-primary-transparent btn-md btn-block" variant=''>Block level button</Button>
	<Button type="button" className="btn bg-info-transparent btn-md btn-block" variant=''>Block level button</Button>
	<Button type="button" className="btn bg-success-transparent btn-sm btn-block" variant=''>Block level button</Button>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>

				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Social buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow19(!show19)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{socialButton.map((socialButtons) => (
									<Button key={Math.random()} variant={socialButtons.color}>{socialButtons.icon}{socialButtons.Buttontheme}</Button>
								))}
							</div>
						</Card.Body>
						<Collapse in={show19} className="">
							<pre>
								<code>
									{`
	<div className="btn-list">
	{socialButton.map((socialButtons) => (
	   <Button key={Math.random()} variant={socialButtons.color}>{socialButtons.icon}{socialButtons.Buttontheme}</Button>
	))}
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Color variations</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow20(!show20)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{colorButton.map((colorButtons) => (
									<Button key={Math.random()} variant={colorButtons.color}>{colorButtons.Buttontheme}</Button>
								))}

							</div>
						</Card.Body>
						<Collapse in={show20} className="">
							<pre>
								<code>
									{`
	<div className="btn-list">
	{colorButton.map((colorButtons) => (
		<Button key={Math.random()} variant={colorButtons.color}>{colorButtons.Buttontheme}</Button>
	))}
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12} lg={4}>
					<Card>
						<Card.Header>
							<Card.Title>Social Icon buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow21(!show21)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{socialIcon.map((socialIcons) => (
									<Button className='me-1' key={Math.random()} variant={socialIcons.color}>{socialIcons.icon}</Button>
								))}

							</div>
						</Card.Body>
						<Collapse in={show21} className="">
							<pre>
								<code>
									{`
	<div className="btn-list">
	{socialIcon.map((socialIcons) => (
		<Button className='me-1' key ={Math.random()} variant={socialIcons.color}>{socialIcons.icon}</Button>
	))}
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={4}>
					<Card>
						<Card.Header>
							<Card.Title>Icon buttons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow22(!show22)} />

						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								{buttonIcons.map((buttonIcon) => (
									<Button key={Math.random()} variant={buttonIcon.color}>{buttonIcon.icon}</Button>
								))}
							</div>
						</Card.Body>
						<Collapse in={show22} className="">
							<pre>
								<code>
									{`
		<div className="btn-list">
		{buttonIcons.map((buttonIcon) => (
			<Button key={Math.random()} variant={buttonIcon.color}>{buttonIcon.icon}</Button>
		))}
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12} lg={4}>
					<Card>
						<Card.Header>
							<Card.Title>Svg Icon Buttons</Card.Title>
						</Card.Header>
						<Card.Body>
							<div className="btn-list">
								<Button type="button" className="btn-icon btn-svg" variant='dark'><svg
									className="svg-icon" xmlns="http://www.w3.org/2000/svg" height="100%"
									viewBox="0 0 24 24" width="100%">
									<path d="M0 0h24v24H0V0z" fill="none"></path>
									<path d="M13 4H6v16h12V9h-5V4zm3 14H8v-2h8v2zm0-6v2H8v-2h8z"
										opacity=".3"></path>
									<path
										d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z">
									</path>
								</svg></Button>
								<Button type="button" className="btn-icon btn-svg" variant='warning'><svg
									className="svg-icon" xmlns="http://www.w3.org/2000/svg" height="100%"
									viewBox="0 0 24 24" width="100%">
									<path d="M0 0h24v24H0V0z" fill="none"></path>
									<path d="M5 19h14V8H5v11zm5.55-6v-3h2.91v3H16l-4 4-4-4h2.55z"
										opacity=".3"></path>
									<path
										d="M16 13h-2.55v-3h-2.9v3H8l4 4zm4.54-7.77l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.81.97H5.44l.8-.97zM19 19H5V8h14v11z">
									</path>
								</svg></Button>
								<Button type="button" className="btn-icon btn-svg" variant='success'><svg
									className="svg-icon" xmlns="http://www.w3.org/2000/svg" height="100%"
									viewBox="0 0 24 24" width="100%">
									<path d="M0 0h24v24H0V0z" fill="none"></path>
									<path d="M5 8h14V6H5z" opacity=".3"></path>
									<path
										d="M7 11h2v2H7zm12-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-4 3h2v2h-2zm-4 0h2v2h-2z">
									</path>
								</svg></Button>
								<Button type="button" className="btn-icon btn-svg" variant='primary'><svg
									className="svg-icon" xmlns="http://www.w3.org/2000/svg" height="100%"
									viewBox="0 0 24 24" width="100%">
									<path d="M0 0h24v24H0V0z" fill="none"></path>
									<path
										d="M16.5 5c-1.54 0-3.04.99-3.56 2.36h-1.87C10.54 5.99 9.04 5 7.5 5 5.5 5 4 6.5 4 8.5c0 2.89 3.14 5.74 7.9 10.05l.1.1.1-.1C16.86 14.24 20 11.39 20 8.5c0-2-1.5-3.5-3.5-3.5z"
										opacity=".3"></path>
									<path
										d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z">
									</path>
								</svg></Button>
								<Button type="button" className="btn-icon btn-svg" variant='danger'><svg
									className="svg-icon" xmlns="http://www.w3.org/2000/svg" height="100%"
									viewBox="0 0 24 24" width="100%">
									<path d="M0 0h24v24H0V0z" fill="none"></path>
									<circle cx="18" cy="5" opacity=".3" r="1"></circle>
									<circle cx="6" cy="12" opacity=".3" r="1"></circle>
									<circle cx="18" cy="19.02" opacity=".3" r="1"></circle>
									<path
										d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z">
									</path>
								</svg></Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Button dropdown</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow23(!show23)} />

						</Card.Header>
						<Card.Body>
							<div className="text-wrap">
								<p>Wrap the dropdown’s toggle using different colors and icons implemented
									in
									different dropdowns styles (your button or link) and the dropdown menu
									within <code className="highlighter-rouge">.dropdown</code>, or another
									element
									that declares <code
										className="highlighter-rouge">position: relative;</code>.
									Dropdowns can be triggered from <code
										className="highlighter-rouge">&lt;a&gt;</code> or <code
											className="highlighter-rouge">&lt;button&gt;</code> elements to better
									fit
									your potential needs.</p>
								<div className="example">
									<div className="btn-list">
										<Dropdown className="">
											<Dropdown.Toggle variant='primary'>
												<i className="fe fe-calendar"></i>
											</Dropdown.Toggle>
											<Dropdown.Menu style={{ marginTop: "0px" }}>
												<Dropdown.Item>Dropdown
													link</Dropdown.Item>
												<Dropdown.Item>Dropdown
													link</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
										<Dropdown className="dropdown">


											<Dropdown.Toggle variant='info'>
												<i className="fe fe-calendar me-2"></i>Show Calendar
											</Dropdown.Toggle>
											<Dropdown.Menu>
												<Dropdown.Item>Dropdown
													link</Dropdown.Item>
												<Dropdown.Item>Dropdown
													link</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
										<Dropdown className='mt-3'>


											<Dropdown.Toggle variant='danger'>
												Show Calendar
											</Dropdown.Toggle>

											<Dropdown.Menu>
												<Dropdown.Item>Dropdown
													link</Dropdown.Item>
												<Dropdown.Item>Dropdown
													link</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</div>
								</div>
							</div>
						</Card.Body>
						<Collapse in={show23} className="">
							<pre>
								<code>
									{`
		<div className="example">
		<div className="btn-list">
		<Dropdown>
		<Dropdown.Toggle variant='primary'><i className="fe fe-calendar"></i></Dropdown.Toggle>
		<Dropdown.Menu style={{ marginTop: "0px" }}>
			<Dropdown.Item>Dropdown link</Dropdown.Item>
		   <Dropdown.Item>Dropdown link</Dropdown.Item>
		</Dropdown.Menu>
		</Dropdown>
		<Dropdown className="dropdown"> 
		<Dropdown.Toggle variant='info'><i className="fe fe-calendar me-2"></i>Show Calendar</Dropdown.Toggle>
	    <Dropdown.Menu>
			<Dropdown.Item>Dropdown link</Dropdown.Item>
			<Dropdown.Item>Dropdown link</Dropdown.Item>
		</Dropdown.Menu>
		</Dropdown>
		<Dropdown>
		<Dropdown.Toggle variant='danger'>	Show Calendar</Dropdown.Toggle>
		<Dropdown.Menu>
			<Dropdown.Item>Dropdown link</Dropdown.Item>
			<Dropdown.Item>Dropdown link</Dropdown.Item>
		</Dropdown.Menu>
		</Dropdown>
		</div>
	    </div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Loading button</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow24(!show24)} />

						</Card.Header>
						<Card.Body>
							<div className="text-wra">
								<p>Add <code className="highlighter-rouge">.btn-loading</code> to use a loading
									state on a button. The width of the button deprights on the length of
									the
									text inside Since the loading spinner is implemented using the element.
								</p>
								<div className="example">
									<div className="btn-list btn-animation">
										<Button type="button"
											className="btn-loaders btn-icon" variant='success'>Button</Button>
										<Button type="button"
											className="btn-loaders btn-icon" variant='primary'>Button</Button>
										<Button type="button"
											className="btn-loaders btn-icon" variant='warning'>Button</Button>
										<Button type="button"
											className="btn-loaders btn-icon" variant='info'>Button</Button>
									</div>
								</div>
							</div>
						</Card.Body>
						<Collapse in={show24} className="">
							<pre>
								<code>
									{`
<div className="btn-list btn-animation">
	<Button type="button" className="btn-loaders btn-icon" variant='success'>Button</Button>
	<Button type="button" className="btn-loaders btn-icon" variant='primary'>Button</Button>
	<Button type="button" className="btn-loaders btn-icon" variant='warning'>Button</Button>
	<Button type="button" className="btn-loaders btn-icon" variant='info'>Button</Button>
</div>
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

export default Buttons;
