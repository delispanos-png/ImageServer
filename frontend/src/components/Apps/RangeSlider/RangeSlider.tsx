import React, { FC, Fragment } from 'react';
import PageHeader from '../../../layout/Header/pageheader';
import Box from '@mui/material/Box';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { Card, Col, Row } from 'react-bootstrap';
import styles from './RangeSlider.module.scss';

interface RangeSliderProps { }

const RangeSlider: FC<RangeSliderProps> = () => {
	//Row 1
	const marks = [
		{
			value: 0,
			label: '10',
		},

		{
			value: 100,
			label: '100',
		},
	];

	function valuetext(value) {
		return `${value}`;
	}
	//Row 2
	const mark = [
		{
			value: 100,
			label: '100',
		},

		{
			value: 1000,
			label: '1000',
		},
	];

	function valuetext1(value) {
		return `${value}`;
	}
	//Row 3

	const Mark = [
		{
			value: 0,
			label: '$0',
		},
		{
			value: 250,
			label: '$250',
		},
		{
			value: 500,
			label: '$500',
		},
		{
			value: 750,
			label: '$750',
		},
		{
			value: 1000,
			label: '$1000',
		}
	];


	function valuetext4(value) {
		return `${value}°C`;
	};


	const [value, setValue] = React.useState([200, 800]);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	//Row 4

	const Marking = [
		{
			value: -1000,
			label: '-1000',
		},
		{
			value: -500,
			label: '-500',
		},
		{
			value: 0,
			label: '0',
		},
		{
			value: 500,
			label: '$750',
		},
		{
			value: 1000,
			label: '1000',
		}
	];

	function valuetext3(value) {
		return `${value}$`;
	}

	const [value1, setValue1] = React.useState([-750, 750]);

	const handleChange1 = (event, newValue) => {
		setValue1(newValue);
	};
	const iOSBoxShadow =
		"0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";
	const marker = [
		{
			value: 0,
			label: '0',
		},
		{
			value: 100,
			label: '100',
		}
	];

	const IOSSlider = styled(Slider)(({ theme }) => ({
		color: theme.palette.mode === "dark" ? "#3880ff" : "#3880ff",
		height: 2,
		padding: "15px 0",
		"& .MuiSlider-thumb": {
			height: 28,
			width: 28,
			backgroundColor: "#fff",
			boxShadow: iOSBoxShadow,
			"&:focus, &:hover, &.Mui-active": {
				boxShadow:
					"0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
				"@media (hover: none)": {
					boxShadow: iOSBoxShadow
				}
			}
		},
		"& .MuiSlider-valueLabel": {
			fontSize: 12,
			fontWeight: "normal",
			top: -6,
			backgroundColor: "unset",
			color: theme.palette.text.primary,
			"&:before": {
				display: "none"
			},
			"& *": {
				background: "transparent",
				color: theme.palette.mode === "dark" ? "#fff" : "#000"
			}
		},
		"& .MuiSlider-mark": {
			backgroundColor: "#bfbfbf",
			height: 8,
			width: 1,
			"&.MuiSlider-markActive": {
				opacity: 1,
				backgroundColor: "currentColor"
			}
		}
	}));
	const markey = [
		{
			value: 100,
			label: '100',
		},
		{
			value: 1000,
			label: '1000',
		}
	];

	const PrettoSlider = styled(Slider)({
		color: 'primary',
		height: 5,
		'& .MuiSlider-valueLabel': {
			lineHeight: 1.2,
			fontSize: 12,
			background: 'unset',
			padding: 0,
			width: 32,
			height: 32,
			borderRadius: '50% 50% 50% 0',
			backgroundColor: '#5389b8',
			transformOrigin: 'bottom left',
			transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
			'&:before': { display: 'none' },
			'&.MuiSlider-valueLabelOpen': {
				transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
			},
			'& > *': {
				transform: 'rotate(45deg)',
			},
		},
	});
	const Markee = [
		{
			value: 0,
			label: '$0',
		},
		{
			value: 250,
			label: '$250',
		},
		{
			value: 500,
			label: '$500',
		},
		{
			value: 750,
			label: '$750',
		},
		{
			value: 1000,
			label: '$1000',
		}
	];

	function ValueLabelComponent2(props) {
		const { children, value } = props;

		return (
			<Tooltip enterTouchDelay={0} placement="top" title={value}>
				{children}
			</Tooltip>
		);
	}
	const Markr = [
		{
			value: -1000,
			label: '-1000',
		},
		{
			value: -500,
			label: '-500',
		},
		{
			value: 0,
			label: '0',
		},
		{
			value: 500,
			label: '$750',
		},
		{
			value: 1000,
			label: '1000',
		}
	];

	const AirbnbSlider = styled(Slider)(({ theme }) => ({
		color: `$primary`,
		height: 3,
		padding: '13px 0',
		'& .MuiSlider-thumb': {
			height: 27,
			width: 27,
			backgroundColor: '#fff',
			border: '1px solid currentColor',
			'&:hover': {
				boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
			},
			'& .airbnb-bar': {
				height: 9,
				width: 1,
				backgroundColor: 'currentColor',
				marginLeft: 1,
				marginRight: 1,
			},
		},
		'& .MuiSlider-track': {
			height: 3,
		},
		'& .MuiSlider-rail': {
			color: theme.palette.mode === 'dark' ? '#5389b8' : '#d8d8d8',
			opacity: theme.palette.mode === 'dark' ? undefined : 1,
			height: 3,
		},
	}));
	return (

		<Fragment>
			<PageHeader title="Range Slider" />
			<Card>
				<Card.Header>
					<Card.Title>
						Range Slider
					</Card.Title>
				</Card.Header>
				<Card.Body className='ms-5 me-5'>
					<Row className="row-sm">
						<Col lg={12}>
							<div style={{ width: "100%" }}>
								<Slider className='mt-5' defaultValue={10} getAriaValueText={valuetext} step={1} valueLabelDisplay="on" marks={marks} />
							</div>
						</Col>
						<Col lg={12} mt={4}>
							<div style={{ width: "100%" }}>
								<Slider defaultValue={550} getAriaValueText={valuetext1} valueLabelDisplay="on" step={1} min={100} max={1000} marks={mark} />
							</div>
						</Col>
					</Row>
					<Row className="row-sm">
						<Col lg={12} mt={4}>
							<div style={{ width: "100%" }}>
								<Slider className='mt-4'
									onChange={handleChange}
									valueLabelDisplay="on"
									getAriaValueText={valuetext4}
									value={value}
									min={0}
									max={1000}
									defaultValue={[200, 800]}
									marks={Mark}
								/>
							</div>
						</Col>
						<Col lg={12} mt={4}>
							<div style={{ width: "100%" }}>
								<Slider className='mt-4'
									onChange={handleChange1}
									valueLabelDisplay="on"
									getAriaValueText={valuetext3}
									value={value1}
									min={-1000}
									max={1000}
									marks={Marking}
									defaultValue={[-500, 500]}
									step={250}
								/>
							</div>
						</Col>
					</Row>
				</Card.Body>
			</Card>
			<Card>
				<Card.Header>
					<Card.Title>
						Range Slider (Modern Skin)
					</Card.Title>
				</Card.Header>
				<Card.Body className='ms-5 me-5'>
					<Row className="row-sm">
						<Col lg={12}>
							<div style={{ width: "100%" }}>

								<IOSSlider
									defaultValue={10}
									marks={marker}
									valueLabelDisplay="on"
								/>
							</div>
						</Col>
						<Col lg={12} mt={4}>
							<PrettoSlider
								valueLabelDisplay="auto"
								defaultValue={560}
								marks={markey}
								step={1}
								min={100}
								max={1000}
							/>
						</Col>
					</Row>
					<Row className="row-sm">
						<Col lg={12} mt={4}>
							<div style={{ width: "100%" }}>
								<Slider className='mt-4'
									valueLabelDisplay="auto"
									components={{
										ValueLabel: ValueLabelComponent2,
									}}
									step={250}
									defaultValue={[200, 800]}
									marks={Markee}
									getAriaValueText={valuetext4}
									min={0}
									max={1000}
								/>
							</div>
						</Col>
						<Col lg={12} mt={4}>
							<AirbnbSlider className='mt-4'
								getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
								defaultValue={[-750, 250]}
								marks={Markr}
								valueLabelDisplay="on"
								min={-1000}
								max={1000}
								step={250}
							/>
						</Col>
					</Row>
				</Card.Body>
			</Card>
			<Card>
				<Card.Header>
					<Card.Title>
						Range Slider (Outline Skin)
					</Card.Title>
				</Card.Header>
				<Card.Body className='ms-5 me-5'>
					<Row className="row-sm">
						<Col lg={12}>
							<div style={{ width: "100%" }}>
								<IOSSlider defaultValue={10} marks={marker} valueLabelDisplay="on" />
							</div>
						</Col>
						<Col lg={12} mt={4}>
							<PrettoSlider
								valueLabelDisplay="auto"
								defaultValue={560}
								marks={markey}
								step={1}
								min={100}
								max={1000}
							/>
						</Col>
					</Row>
					<Row className="row-sm">
						<Col lg={12} mt={4}>
							<div style={{ width: "100%" }}>
								<Slider className='mt-4'
									valueLabelDisplay="auto"
									components={{
										ValueLabel: ValueLabelComponent2,
									}}
									step={250}
									defaultValue={[200, 800]}
									marks={Markee}
									getAriaValueText={valuetext4}
									min={0}
									max={1000}
								/>
							</div>
						</Col>
						<Col lg={12} mt={4}>
							<AirbnbSlider className='mt-4'
								getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
								defaultValue={[-750, 250]}
								marks={Markr}
								valueLabelDisplay="on"
								min={-1000}
								max={1000}
								step={250}
							/>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</Fragment>
	)
};

export default RangeSlider;
