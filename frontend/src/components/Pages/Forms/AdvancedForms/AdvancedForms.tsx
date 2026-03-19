
import React, { Fragment, useState } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, InputGroup, Row, Form } from 'react-bootstrap';
import Select from 'react-select';
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { MultiSelect } from "react-multi-select-component";
import ReactFlagsSelect from "react-flags-select";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ChromePicker } from "react-color";
import { Compact } from '@uiw/react-color';
import DatePicker from "react-multi-date-picker";
import dayjs, { Dayjs } from 'dayjs';
import { DualList, SelectBox1, SketchExample, options, options1, options10, options11, options12, options13, options14, options15, options16, options17, options18, options19, options2, options20, options21, options22, options23, options24, options25, options26, options27, options3, options4, options5, options6, options7, options8, options9 } from './Data/advancedata';

export default function AdvancedForms() {
	const [files, setFiles] = useState([])
	//Basic multiple select
	const [selected4, setSelected4] = useState([]);
	//Desable select
	const [selected5, setSelected5] = useState([]);
	//Single Select

	function logChange(val) {
		console.log("Selected: " + JSON.stringify(val));
	}
	//Multiple Items With Group-Option
	const [selected7, setSelected7] = useState([])
	//Single select
	const [selected8, setSelected8] = useState([])
	//Group option filter
	const [selected9, setSelected9] = useState([])
	//Multi select
	const [selected10, setSelected10] = useState([])
	//Group option multiselect
	const [selected11, setSelected11] = useState([])
	//Multiple items 
	const [selected12, setSelected12] = useState([])
	//Hide selectall
	const [selected13, setSelected13] = useState([])
	//Select filter
	const [selected14, setSelected14] = useState([])
	//Disable select
	const [selected15, setSelected15] = useState([])
	//multi select-1
	const [selected16, setSelected16] = useState([])
	//Search select-2
	const [selected17, setSelected17] = useState([])
	//search Select

	function logChange1(val) {
		console.log("Selected: " + JSON.stringify(val));
	}
	//Multi slect #
	const [selected18, setSelected18] = useState([])
	//Multi select #
	const [selected19, setSelected19] = useState([])
	//optgroup select
	const [selected20, setSelected20] = useState([])
	//search Select-2
	function logChange2(val) {
		console.log("Selected: " + JSON.stringify(val));
	}
	//search select-3
	const [selected21, setSelected21] = useState([])
	//search select-4
	const [selected22, setSelected22] = useState([])
	//custom select
	const [selected23, setSelected23] = useState([])
	//file uploader
	const uploader = Uploader({
		apiKey: "free"
	});
	//country flag
	const [select, setSelect] = useState("SE");
	const onSelect = (code) => setSelect(code);
	//color picker
	const [color, setColor] = useState('#6c5ffc')
	const [showColorPicker, setShowColorPicker] = useState(false)
	const handleChangeComplete = (color) => {
		console.log(color)
	};
	const [hex, setHex] = useState("#fff");

	//Data month and year range picker
	const [dates, setDates] = useState<any>();
	//Time picker with default value
	const [value1, setValue1] = useState<Dayjs | null>(
		dayjs('2018-01-01T00:00:00.000Z'),
	);
	return (
		<Fragment>
			<div>
				<PageHeader title="Advanced Forms" />
				<Row>
					<Col lg={12} md={12}>
						<Form className="card" method="post">
							<Card.Header>
								<Card.Title>File Upload</Card.Title>
							</Card.Header>
							<Card.Body>
								<Row>
									<Col sm={12} lg={4} className=" mg-t-10 mg-lg-t-0">

										<FilePond
											files={files}
											allowMultiple={true}
											maxFiles={3}
											server="/api"
											name="files"
											labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
										/>
									</Col>
									<Col lg={4} sm={12} className='Upload-button mg-t-10 mg-lg-t-0 mb-2'>
										<UploadButton uploader={uploader}
											onComplete={files => alert(files.map(x => x.fileUrl).join("\n"))}>
											{({ onClick }) =>
												<span onClick={onClick}>
													Drag & Drop your files or <span className="">Browse</span>
												</span>
											}
										</UploadButton>
									</Col>
									<Col lg={4} sm={12} className=' mg-t-10 mg-lg-t-0 '>

										<FilePond disabled files={files} allowMultiple={true} maxFiles={3} server="/api" name="files" labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
										/>
									</Col>
									 <Form.Group controlId="formFilemd" className="mb-3 col-lg-12">
										<Form.Control type="file" size="lg" />
									</Form.Group>
									<Col lg={12}>
										<Form.Group className="form-group mb-0">
											<FilePond files={files} allowMultiple={true} maxFiles={3} server="/api" name="files" />
										</Form.Group>
									</Col>
								</Row>
							</Card.Body>
						</Form>
					</Col>
				</Row>
				<Row>
					<Col lg={12} md={12}>
						<Form method="post" className="card">
							<Card.Header>
								<Card.Title>Select2 elements</Card.Title>
							</Card.Header>
							<Card.Body>
								<Form.Group>
									<Form.Label>Beast</Form.Label>
									<Select options={options} classNamePrefix='Select2' placeholder="Choose one"/>
								</Form.Group>
								<Form.Group>
									<Form.Label className='mt-2'>Basic Select2</Form.Label>
									<Select classNamePrefix="Select2" options={options1} placeholder="Arizona"/>
								</Form.Group>
								<Form.Group>
									<Form.Label className='mt-2'> Select2 with search box</Form.Label>
									<Select classNamePrefix="Select2" options={options2}  placeholder="Arizona"/>
								</Form.Group>
								<Form.Group>
									<Form.Label className='mt-2'>Users list</Form.Label>
									<Select classNamePrefix="Select2" options={options3}  placeholder="Opera"/>
								</Form.Group>
							</Card.Body>
						</Form>
					</Col>
				</Row>

				<Row>
					<Col lg={12} md={12}>
						<Row>
							<Col lg={6}>
								<Card>
									<Card.Header>
										<Card.Title>Time Picker</Card.Title>
									</Card.Header>
									<Card.Body>
										<label>Default Time Picker:</label>
										<div className="wd-150 mg-b-30">
											<LocalizationProvider dateAdapter={AdapterDayjs}>
												<DemoContainer components={['TimePicker']}>
													<TimePicker label="Basic time picker" />
												</DemoContainer>
											</LocalizationProvider>
										</div>
										<label className="mt-4">Set the scroll position to local time if no defaultValue
											selected:</label>
										<div className="wd-150 mg-b-30">
											<div className="input-group">
												<LocalizationProvider dateAdapter={AdapterDayjs}>
													<TimePicker value={value1} onChange={setValue1} />
												</LocalizationProvider>
											</div>
										</div>
										<label className="mt-4 ">Dynamically set the time using a Javascript Date
											object:</label>
										<div className="d-flex">
											<div className="input-group wd-150">
												<LocalizationProvider dateAdapter={AdapterDayjs}>
													<TimePicker ampm={false} openTo="hours" views={['hours', 'minutes', 'seconds']} format="HH:mm:ss" label="With seconds" value={value1} onChange={(newValue) => { setValue1(newValue); }} />

												</LocalizationProvider>
												<button className="btn btn btn-primary br-ts-0 br-bs-0"
													id="setTimeButton">Set Current Time</button>

											</div>
										</div>
									</Card.Body>
								</Card>
							</Col>
							<Col lg={6}>
								<Card>
									<Card.Header>
										<Card.Title>Color Picker</Card.Title>
									</Card.Header>
									<Card.Body>
										<div>
											<p className=" mb-1">Same way you select color in Adobe Photoshop.</p>
											<Button className='btn-pill' size='sm' onClick={() => setShowColorPicker(showColorPicker => !showColorPicker)}>{showColorPicker ? 'Close Color Picker' : 'Pick a Color'}</Button>
											{showColorPicker && (<ChromePicker className='mt-3' disableAlpha={true} color={color} onChange={updatedColor => setColor(updatedColor.hex)} onChangeComplete={handleChangeComplete} />
											)}
										</div>
										<div>
											<SketchExample />
										</div>
										<div>
											<p className="mt-4 mb-1">Show pallete only. If you'd like, spectrum can show the palettes you specify, and nothing else.</p>
											<Compact

												color={hex}
												onChange={(color) => {
													setHex(color.hex);
												}}
											/>
										</div>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Col>
				</Row>

				<Row>
					<Col lg={12} md={12}>
						<Row>
							<Col lg={6}>
								<Card>
									<Card.Header>
										<Card.Title>Default Date picker</Card.Title>
									</Card.Header>
									<Card.Body>
										<p className="mg-b-20 mg-sm-b-40">The datepicker is tied to a standard form
											input field. Click on the input to open an interactive Calendar in a
											small overlay. If a date is chosen, feedback is shown as the input's
											defaultValue.</p>
										<div className="wd-200 mg-b-30">
											<div className="input-group">
												<LocalizationProvider dateAdapter={AdapterDayjs}>
													<DemoContainer components={['DatePicker']}>
														<DatePicker
															placeholder="MM/DD/YYYY" />
													</DemoContainer>
												</LocalizationProvider>
											</div>
										</div>
									</Card.Body>
								</Card>
							</Col>
							<Col lg={6}>
								<Card>
									<Card.Header>
										<Card.Title>Multiple Months </Card.Title>
									</Card.Header>
									<Card.Body>
										<p className="mg-b-20 mg-sm-b-40">The datepicker is tied to a standard form
											input field. Click on the input to open an interactive Calendar in a
											small overlay. If a date is chosen, feedback is shown as the input's
											defaultValue.</p>
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DemoContainer components={['DatePicker']}>
												<DatePicker placeholder="MM/DD/YYYY" />
											</DemoContainer>
										</LocalizationProvider>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<Card>
							<Card.Header>
								<Card.Title>Date,Month,Year Picker</Card.Title>
							</Card.Header>
							<Card.Body>
								<Row>
									<Col md={4} mt={4} className="col-md-4 mt-4 mt-md-0">
										<InputGroup>
											<InputGroup.Text>
												<span className="fe fe-clock"></span>
											</InputGroup.Text>
											<DatePicker placeholder="Date Range" value={dates} onChange={setDates} multiple numberOfMonths={1} />
										</InputGroup>
									</Col>
									<Col md={4} mt={4} className="col-md-4 mt-4 mt-md-0">
										<InputGroup>
											<InputGroup.Text>
												<span className="fe fe-clock "></span>
											</InputGroup.Text>
											<DatePicker className="form-control" placeholder="Month Range" onlyMonthPicker multiple sort plugins={[]} id="DTM-picker" />
										</InputGroup>
									</Col>
									<Col md={4} mt={4} className="col-md-4 mt-4 mt-md-0">
										<InputGroup>
											<InputGroup.Text>
												<span className="fe fe-clock"></span>
											</InputGroup.Text>
											<DatePicker className="form-control" placeholder="Year Range" onlyYearPicker multiple sort />
										</InputGroup>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<Card>
							<Card.Header>
								<Card.Title>Multiple Select Styles</Card.Title>
							</Card.Header>
							<Card.Body>
								<Row>
									<Col lg={6}>
										<Form.Group>
											<Form.Label>Basic MutipleSelect</Form.Label>
											<MultiSelect value={selected4} onChange={setSelected4} labelledBy="" disableSearch={true} options={options4} />
										</Form.Group>
										<Form.Group>
											<Form.Label className='mt-2'>Disabled MutipleSelect</Form.Label>
											<MultiSelect options={options5} value={selected5} onChange={setSelected5} labelledBy="" disabled={true} />
										</Form.Group>
										<Form.Group>
											<Form.Label className=" dropdown-heading form-group mb-0 mt-2">Single Group Disabled
												MutipleSelect</Form.Label>
											<Select classNamePrefix="Select2" name="form-field-name" options={options6} onChange={logChange} placeholder=""/>
										</Form.Group>
										<Form.Group>
											<Form.Label className='mt-2'>Multiple Items With Group-Option</Form.Label>
											<MultiSelect options={options7} value={selected7} onChange={setSelected7} labelledBy="" disableSearch={true} />
										</Form.Group>
										<Form.Group>
											<Form.Label className='mt-2'>Single Row</Form.Label>
											<MultiSelect value={selected8} onChange={setSelected8} labelledBy="Selected" disableSearch={true} options={options8} hasSelectAll={false} />
										</Form.Group>
										<Form.Group className="form-group mb-0">
											<Form.Label className="mg-b-10 mt-2">Group-Option Filter</Form.Label>
											<MultiSelect options={options9} value={selected9} onChange={setSelected9} labelledBy="Fourth" />
										</Form.Group>
									</Col>
									<Col lg={6}>
										<Form.Group>
											<Form.Label>MutipleSelect</Form.Label>
											<MultiSelect value={selected10} onChange={setSelected10} labelledBy=""  options={options10} />
										</Form.Group>
										<Form.Group>
											<Form.Label className='mt-2'>Group-Option MutipleSelect</Form.Label>
											<MultiSelect options={options11} value={selected11} onChange={setSelected11} labelledBy="" />
										</Form.Group>
										<Form.Group>
											<Form.Label className='mt-2'>Multiple Items</Form.Label>
											<MultiSelect options={options12} value={selected12} onChange={setSelected12} labelledBy="" disableSearch={true} />
										</Form.Group>
										<Form.Group>
											<Form.Label className='mt-2'>Hide SelectAll</Form.Label>
											<MultiSelect options={options13} value={selected13} onChange={setSelected13} labelledBy="" disableSearch={true} hasSelectAll={false} />
										</Form.Group>
										<Form.Group>
											<Form.Label className='mt-2'>Select Filter</Form.Label>
											<MultiSelect options={options14} value={selected14} onChange={setSelected14} labelledBy="" disableSearch={true} />
										</Form.Group>
										<Form.Group className="form-group mb-0">
											<Form.Label className='mt-2'>Custom Style</Form.Label>
											<MultiSelect options={options27} value={selected23} onChange={setSelected23} labelledBy=""  hasSelectAll={false} />
										</Form.Group>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<Card>
							<Card.Header>
								<Card.Title>Select All Styles</Card.Title>
							</Card.Header>
							<Card.Body>
								<Row>
									<Col lg={6} md={12}>
										<div className="form-group row">
											<Form.Label className="col-md-12 form-label">Single Select:</Form.Label>
											<Col md={12}>
												<Select classNamePrefix="Select2" options={options15} placeholder="Volvo" />
											</Col>
										</div>
										<div className="form-group row">
											<Form.Label disabled>Disabled Select:</Form.Label>
											<Col md={12}>
												<MultiSelect options={options22} value={selected19} onChange={setSelected19} labelledBy="sab" disableSearch={true} disabled={true} />
											</Col>
										</div>
										<div className="form-group row">
											<label className="col-md-12 form-label">Inline Select:</label>
											<Col md={12}>
												<Select classNamePrefix="Select2" options={options17} placeholder="selected" />
											</Col>
										</div>
									</Col>
									<Col lg={6} md={12}>
										<div className="form-group row">
											<Form.Label className="col-md-12 form-label">Multiple Select:</Form.Label>
											<Col md={12}>
												<MultiSelect options={options21} value={selected18} onChange={setSelected18} labelledBy="Select" disableSearch={true} hasSelectAll={false} />
											</Col>
										</div>
										<div className="form-group row">
											<label className="col-md-12 form-label">Disabled Select:</label>
											<Col md={12}>
												<MultiSelect options={options22} value={selected19} onChange={setSelected19} labelledBy="Select" disableSearch={true} disabled={true} />
											</Col>
										</div>
										<div className="form-group row">
											<Form.Label className="col-md-12 form-label">Optgroup Support:</Form.Label>
											<Col md={12}>
												<MultiSelect options={options23} value={selected20} onChange={setSelected20} labelledBy="Select" disableSearch={true} hasSelectAll={false} />
											</Col>
										</div>
									</Col>
									<Col lg={6} md={12}>
										<div className="form-group row">
											<label className="col-md-12 form-label">Multiple Select-1:</label>
											<Col md={12}>
												<MultiSelect options={options18} value={selected16} onChange={setSelected16} labelledBy="" disableSearch={true} hasSelectAll={true} />
											</Col>
										</div>
										<div className="form-group row ">
											<label className="col-md-12 form-label">Multiple Select-2:</label>
											<Col md={12}>
												<MultiSelect options={options19} value={selected17} onChange={setSelected17} labelledBy="" disableSearch={true} hasSelectAll={true} />
											</Col>
										</div>
										<div className="form-group row">
											<label className="col-md-12 form-label">Search Select-1:</label>
											<Col md={12}>
												<Select classNamePrefix="Select2" name="form-field-name" options={options20} onChange={logChange1} placeholder="Saab" />
											</Col>
										</div>
									</Col>
									<Col lg={6} md={12}>
										<div className="form-group row">
											<Form.Label className="col-md-12 form-label">Search Select-2:</Form.Label>
											<Col md={12}>
												<Select classNamePrefix="Select2" name="form-field-name" options={options24} onChange={logChange2} placeholder="Saab" />
											</Col>
										</div>
										<div className="form-group row">
											<Form.Label className="col-md-12 form-label">Search Select-3:</Form.Label>
											<Col md={12}>
												<MultiSelect options={options25} value={selected21} onChange={setSelected21} hasSelectAll={false} labelledBy={''} />
											</Col>
										</div>
										<div className="form-group row">
											<label className="col-md-12 form-label">Search Select-4:</label>
											<Col md={12}>
												<MultiSelect options={options26} value={selected22} onChange={setSelected22} labelledBy="" disableSearch={true} hasSelectAll={false} />
											</Col>
										</div>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</div>
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Country selctor</Card.Title>
						</Card.Header>
						<div className="card-body row">
							<div className="input-group col-md-12">
								<Form className="d-flex">
									<ReactFlagsSelect
										selected={select}
										onSelect={onSelect}
										countries={["fi", "GB", "IE", "IT", "NL", "SE", "AS", "US", "UK", ""]} />
								</Form>
							</div>
						</div>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Dual List Box</Card.Title>
						</Card.Header>
						<Card.Body>
							<DualList />
							<Row>
								<Col md={12}>
									<div className="card shadow-none border">
										<Card.Body>
											<div className="transfer"></div>
										</Card.Body>
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

				</Col>
			</Row>
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Select Box</Card.Title>
						</Card.Header>
						<Card.Body>
							<SelectBox1 />
							<Row>
								<Col xl={6} md={12}>
									<Form.Group className="from-group mb-5 mb-lg-0">
									</Form.Group>
								</Col>
								<Col xl={6} md={12}>
									<Form.Group>
									</Form.Group>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
}

