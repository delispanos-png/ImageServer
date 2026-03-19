import React, { FC, Fragment, useState } from 'react';
import { Button, Card, Col, Collapse, Form, Row, } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../layout/Header/pageheader';
import { TagsInput } from "react-tag-input-component";
import { avatarTags, colortags, listTags } from '../../../components/Elements/Tags/Data/TagsData';
function Tag() {
	const [selected, setSelected] = useState(['Amsterdam', 'Washington', 'Sydney', 'Beijing', 'Cairo']);
	const [show, setShow] = useState(false);
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	const [show3, setShow3] = useState(false);
	const [show4, setShow4] = useState(false);
	const [show5, setShow5] = useState(false);
	const [show6, setShow6] = useState(false);
	const [show7, setShow7] = useState(false);
	const [show8, setShow8] = useState(false);
	return (
		<Fragment>
			<PageHeader title="Tags" />
			<Row>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Default tag</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow(!show)} />
						</Card.Header>
						<Card.Body>
							<div className="tags">
								<span className="tag">First tag</span>
								<span className="tag">Second tag</span>
								<span className="tag">Third tag</span>
							</div>
						</Card.Body>
						<Collapse in={show} className="">
							<pre>
								<code>
									{`
<div className="tags">
<span className="tag">First tag</span>
<span className="tag">Second tag</span>
<span className="tag">Third tag</span>
</div>

</div>

`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Tag Add & Remove</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow1(!show1)} />
						</Card.Header>
						<Card.Body>

							<div className="rti--tag">
								<TagsInput value={selected} onChange={setSelected} />
							</div>

						</Card.Body>
						<Collapse in={show1} className="">
							<pre>
								<code>
									{`
import { TagsInput } from "react-tag-input-component";
   export const Tags = ()= {
	  const [selected, setSelected] = useState(['Amsterdam', 'Washington', 'Sydney', 'Beijing', 'Cairo']);
    return(
 <TagsInput value={selected} onChange={setSelected}  />
 )
	};
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>

				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Link tag</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow2(!show2)} />
						</Card.Header>
						<Card.Body>
							<div className="tags">
								<Link to="#" className="tag">First tag</Link>
								<Link to="#" className="tag">Second tag</Link>
								<Link to="#" className="tag">Third tag</Link>
							</div>
						</Card.Body>
						<Collapse in={show2} className="">
							<pre>
								<code>
									{`
	<div className="tags">
	<Link to="#" className="tag">First tag</Link>
	<Link to="#" className="tag">Second tag</Link>
	<Link to="#" className="tag">Third tag</Link>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Rounded tag</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow3(!show3)} />
						</Card.Header>
						<Card.Body>
							<div className="tags">
								<span className="tag tag-rounded">First tag</span>
								<span className="tag tag-rounded">Second tag</span>
								<span className="tag tag-rounded">Third tag</span>
							</div>
						</Card.Body>
						<Collapse in={show3} className="">
							<pre>
								<code>
									{`
	<div className="tags">
	<span className="tag tag-rounded">First tag</span>
	<span className="tag tag-rounded">Second tag</span>
	<span className="tag tag-rounded">Third tag</span>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Avatar tag</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow4(!show4)} />
						</Card.Header>
						<Card.Body>
							{avatarTags.map((avatarTag) => (
								<span className='tag me-2' key={Math.random()}>
									<img className="tag-avatar avatar me-1"
										src={avatarTag.src1} />{avatarTag.heading}
								</span>
							))}

						</Card.Body>
						<Collapse in={show4} className="">
							<pre>
								<code>
									{`
	{avatarTags.map((avatarTag)=>(
		<span className='tag'>
			<img className="tag-avatar avatar me-1"
			 src={avatarTag.src1}/>{avatarTag.heading}
			 </span>
	))}				
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Tag remove</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow5(!show5)} />
						</Card.Header>
						<Card.Body>
							<div className="tags">
								<span className="tag">One<Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link></span>
								<span className="tag">Two<Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link></span>
								<span className="tag">Three<Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link></span>
								<span className="tag">Four<Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link></span>
							</div>
						</Card.Body>
						<Collapse in={show5} className="">
							<pre>
								<code>
									{`
<div className="tags">
	<span className="tag">One<Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link></span>
	<span className="tag">Two<Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link></span>
	<span className="tag">Three<Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link></span>
	<span className="tag">Four<Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link></span>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Tag addons</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow6(!show6)} />
						</Card.Header>
						<Card.Body>
							<div className="tags">
								<div className="tag">
									npm
									<Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
								</div>
								<div className="tag tag-danger">npm<span className="tag-addon"><i className="fe fe-activity"></i></span></div>
								<div className="tag">bundle<span className="tag-addon tag-success">passing</span></div>
								<div className="tag tag-dark">CSS gzip size<span className="tag-addon tag-warning">20.9 kB</span></div>
							</div>
						</Card.Body>
						<Collapse in={show6} className="">
							<pre>
								<code>
									{`
<div className="tags">
    <div className="tag">
    	npm
    	<Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
    </div>
    <div className="tag tag-danger">npm<span className="tag-addon"><i className="fe fe-activity"></i></span></div>
    <div className="tag">bundle<span className="tag-addon tag-success">passing</span></div>
    <div className="tag tag-dark">CSS gzip size<span className="tag-addon tag-warning">20.9 kB</span></div>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={6} md={12}>
					<Card>
						<Card.Header>
							<Card.Title>Color tag</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow7(!show7)} />
						</Card.Header>
						<Card.Body>

							<div className="tags">
								{colortags.map((colorTag) => (
									<span key={Math.random()} className={`tag tag-${colorTag.color}`}>{colorTag.heading}</span>
								))}
							</div>

						</Card.Body>
						<Collapse in={show7} className="">
							<pre>
								<code>
									{`
<div className="tags">
    <span className="tag tag-blue">Blue tag</span>
    <span className="tag tag-azure">Azure tag</span>
    <span className="tag tag-indigo">Indigo tag</span>
    <span className="tag tag-purple">Purple tag</span>
    <span className="tag tag-pink">Pink tag</span>
    <span className="tag tag-red">Red tag</span>
    <span className="tag tag-orange">Orange tag</span>
    <span className="tag tag-yellow">Yellow tag</span>
    <span className="tag tag-lime">Lime tag</span>
    <span className="tag tag-green">Green tag</span>
    <span className="tag tag-teal">Teal tag</span>
    <span className="tag tag-cyan">Cyan tag</span>
    <span className="tag tag-gray">Gray tag</span>
    <span className="tag tag-gray-dark">Dark gray tag</span>
</div>
`}
								</code>
							</pre>
						</Collapse>
					</Card>
				</Col>
				<Col lg={12}>
					<Card>
						<Card.Header>
							<Card.Title>List of tags</Card.Title>
							<Form.Check type="switch" className='ms-auto' label="show code" onClick={() => setShow8(!show8)} />
						</Card.Header>
						<Card.Body>
							<div className="text-wrap">
								<p>You can create a list of tags with the <code
									className="highlighter-rouge">.tags</code> container.</p>
								<div className="tags">
									<span className="tag">First tag</span>
									<span className="tag">Second tag</span>
									<span className="tag">Third tag</span>
								</div>
								<p className="mt-4">If the list is very long, it will automatically wrap on
									multiple
									lines, while keeping all tags evenly spaced.</p>
								<div className="tags">
									{listTags.map((listTag) => (
										<span key={Math.random()} className="tag">{listTag.heading}</span>
									))}

								</div>
							</div>
						</Card.Body>
						<Collapse in={show8} className="">
							<pre>
								<code>
									{`
<div className="tags">
   {listTags.map((listTag)=>(
    <span key={Math.random()} className="tag">{listTag.heading}</span>
  ))}
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

export default Tag;
