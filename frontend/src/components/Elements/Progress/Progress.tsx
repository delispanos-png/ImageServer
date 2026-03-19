import React, { FC, Fragment, useState } from 'react';
import { Card, Col, Collapse, Form, ProgressBar, Row } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import { basicProgres, contextualProgres, labelProgres, labelsProgres, sizeProgres, mixedProgres, strippedProgres, animatedProgres } from '../../../components/Elements/Progress/Data/progressData';
interface ProgressProps { }

const Progress: FC<ProgressProps> = () => {
	const [show, setShow] = useState(false);
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	const [show3, setShow3] = useState(false);
	const [show4, setShow4] = useState(false);
	const [show5, setShow5] = useState(false);
	const [show6, setShow6] = useState(false);
	const [show7, setShow7] = useState(false);
	return (

		<Fragment>
			<PageHeader title="Progress" />
			<Row>
				<Col md={6} sm={12}>
					<Card>
						<Card.Header>
							<Card.Title>Basic Progress</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
						</Card.Header>
						<Card.Body>
							{basicProgres.map((basicProgress) => (

								<ProgressBar className="progress-md mb-3" key={Math.random()} variant={basicProgress.color} now={basicProgress.width} />
							))}
						</Card.Body>
						<Collapse in={show} className="">
							<pre>
								<code>
									{`
              {basicProgres.map((basicProgress) => (
				<ProgressBar className="progress-md mb-3"
				      key={Math.random()} variant={basicProgress.color}
					    now={basicProgress.width}/>
				))}
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={6} sm={12}>
					<Card>
						<Card.Header>
							<Card.Title>Contextual Progress</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
						</Card.Header>
						<Card.Body>
							{contextualProgres.map((contextualProgress) => (
								<ProgressBar key={Math.random()} className="progress-md mb-3" variant={contextualProgress.color} now={contextualProgress.width} />
							))}

						</Card.Body>
						<Collapse in={show1} className="">
							<pre>
								<code>
									{`
              {contextualProgres.map((contextualProgress) => (
				<ProgressBar key={Math.random()} className="progress-md mb-3" 
				      variant={contextualProgress.color} 
				        now={contextualProgress.width}/>
				))}
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={6} sm={12}>
					<Card>
						<Card.Header>
							<Card.Title>Basic Progress with label</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />
						</Card.Header>
						<Card.Body>
							{labelProgres.map((labelProgress) => (
								<ProgressBar key={Math.random()} className="progress-md mb-3" variant={labelProgress.color} now={labelProgress.width} label={labelProgress.label} />
							))}

						</Card.Body>
						<Collapse in={show2} className="">
							<pre>
								<code>
									{`
              {labelProgres.map((labelProgress) => (
				<ProgressBar key={Math.random()} className={labelProgress.size}
				   variant={labelProgress.color} now={labelProgress.width} 
				      label={labelProgress.label}/>
						   ))}
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={6} sm={12}>
					<Card>
						<Card.Header>
							<Card.Title>Contextual Progress with label</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow3(!show3)} />
						</Card.Header>
						<Card.Body>
							{labelsProgres.map((labelsProgress) => (
								<ProgressBar key={Math.random()} className="progress-md mb-3" variant={labelsProgress.color} now={labelsProgress.width} label={labelsProgress.label} />
							))}
						</Card.Body>
						<Collapse in={show3} className="">
							<pre>
								<code>
									{`
             {labelsProgres.map((labelsProgress) => (
				<ProgressBar key={Math.random()} className={labelsProgress.size} 
				   variant={labelsProgress.color} now={labelsProgress.width}
				     label={labelsProgress.label}/>
						   ))}
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={6} sm={12}>
					<Card>
						<Card.Header>
							<Card.Title>Progress Sizes</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow4(!show4)} />
						</Card.Header>
						<Card.Body>
							{sizeProgres.map((sizeProgress) => (
								<ProgressBar key={Math.random()} className={`progress-${sizeProgress.size}`} variant={sizeProgress.color} now={sizeProgress.width} label={`${sizeProgress.label}`} />
							))}

						</Card.Body>
						<Collapse in={show4} className="">
							<pre>
								<code>
									{`
             <ProgressBar className="progress progress-xs mb-3">
			 <ProgressBar className="progress-bar bg-primary" now={30}></ProgressBar>
		 </ProgressBar>
		 <ProgressBar className="progress progress-sm mb-3">
			 <ProgressBar className="progress-bar bg-primary" now={60}></ProgressBar>
		 </ProgressBar>
		 <ProgressBar className="progress progress-md mb-3">
			 <ProgressBar className="progress-bar bg-primary" now={70} label="70%"></ProgressBar>
		 </ProgressBar>
		 <ProgressBar className="progress progress-lg">
			 <ProgressBar className="progress-bar bg-primary" now={80} label="80%"></ProgressBar>
		 </ProgressBar> 
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={6} sm={12}>
					<Card>
						<Card.Header>
							<Card.Title>Mixed color Progress with Sizes</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow5(!show5)} />
						</Card.Header>
						<Card.Body>
							{mixedProgres.map((mixedProgress) => (
								<ProgressBar key={Math.random()} className={`progress-${mixedProgress.size}`}>
									<ProgressBar variant={mixedProgress.color} now={mixedProgress.width} />
									<ProgressBar variant={mixedProgress.color1} now={mixedProgress.width1} />
									<ProgressBar variant={mixedProgress.color2} now={mixedProgress.width2} />
								</ProgressBar>
							))}

						</Card.Body>
						<Collapse in={show5} className="">
							<pre>
								<code>
									{`
           <ProgressBar className="progress progress-sm mb-3">
		   <ProgressBar className="bg-danger" now={10}></ProgressBar>
		   <ProgressBar className="bg-danger-1" now={15}></ProgressBar>
		   <ProgressBar className="bg-danger-2" now={15}></ProgressBar>
	   </ProgressBar>
	   <ProgressBar className="progress progress-md mb-3">
		   <ProgressBar className="bg-warning" now={18}></ProgressBar>
		   <ProgressBar className="bg-warning-1" now={20}></ProgressBar>
		   <ProgressBar className="bg-warning-2" now={30}></ProgressBar>
	   </ProgressBar>
	   <ProgressBar className="progress progress-lg">
		   <ProgressBar className="bg-success" now={30}></ProgressBar>
		   <ProgressBar className="bg-success-1" now={20}></ProgressBar>
		   <ProgressBar className="bg-success-2" now={40}></ProgressBar>
	   </ProgressBar>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={6} sm={12}>
					<Card>
						<Card.Header>
							<Card.Title>Striped Progress</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow6(!show6)} />
						</Card.Header>
						<Card.Body>
							{strippedProgres.map((strippedProgress) => (
								<ProgressBar key={Math.random()} className={strippedProgress.size} variant={strippedProgress.color} animated now={strippedProgress.width} label={strippedProgress.label} />
							))}

						</Card.Body>
						<Collapse in={show6} className="">
							<pre>
								<code>
									{`
          {strippedProgres.map((strippedProgress)=> (
			<ProgressBar key={Math.random()} className={strippedProgress.size} 
			    variant={strippedProgress.color} animated now={strippedProgress.width} 
				    label={strippedProgress.label}/>
		))}
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col md={6} sm={12}>
					<Card>
						<Card.Header>
							<Card.Title>Animated Progress</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow7(!show7)} />
						</Card.Header>
						<Card.Body>
							{animatedProgres.map((animatedProgress) => (
								<ProgressBar className={animatedProgress.size} key={Math.random()}>
									<ProgressBar className="progress-bar-indeterminate" variant={animatedProgress.color} />
								</ProgressBar>
							))}

						</Card.Body>
						<Collapse in={show7} className="">
							<pre>
								<code>
									{`
        {animatedProgres.map((animatedProgress)=> (
			<ProgressBar className={animatedProgress.size}>
				<ProgressBar key={Math.random()}  className="progress-bar-indeterminate"
				    variant={animatedProgress.color}/>
				</ProgressBar>
		))}
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

export default Progress;
