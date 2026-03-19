import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row } from 'react-bootstrap';
import {fonts,sizes,quoits,headers} from './Data/TyphographyData';
interface TyphographyProps {}

const Typhography: FC<TyphographyProps> = () => (
  <Fragment>
  <PageHeader  title="Typhography" />
  <Row>
    {headers.map((header)=>(
    <Col lg={6} md={12} key={Math.random()}>
      <Card>
        <Card.Header>
          <Card.Title>Default Heading Text</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="text-wrap">
            <p>Examples using standard <code>h1</code> to <code>h6</code> html tags</p>
            <h1 className={header.color}>{header.class}</h1>
            <h2 className={header.color1}>{header.class1}</h2>
            <h3 className={header.color2}>{header.class2}</h3>
            <h4 className={header.color3}>{header.class3}</h4>
            <h5 className={header.color4}>{header.class4}</h5>
            <h6 className={header.color5}>{header.class5}</h6>
          </div>
        </Card.Body>
      </Card>
    </Col>
    ))}
  </Row>
  <Row>
    <Col lg={12} md={12}>
      <Card>
        <Card.Header>
          <Card.Title>Heading-Inverse</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="text-wrap">
            <p>Examples using <code>heading-inverse</code> css</p>
            <h1 className="heading-inverse">h1. Heading</h1>
            <h2 className="heading-inverse">h2. Heading</h2>
            <h3 className="heading-inverse">h3. Heading</h3>
            <h4 className="heading-inverse">h4. Heading</h4>
            <h5 className="heading-inverse">h5. Heading</h5>
            <h6 className="heading-inverse">h6. Heading</h6>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
  <Row>
    <Col lg={12} md={12}>
      <Card>
        <Card.Header>
          <Card.Title>Paragraph Text</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="text-wrap">
            <p>Far far away, behind the word mountains, far from the countries Vokalia
              and
              Consonantia, there live the blind texts. Separated they live in
              Bookmarksgrove right at the coast of the Semantics, a large language
              ocean.
              A small river named Duden flows by their place and supplies it with the
              necessary regelialia. It is a paradisematic country, in which roasted
              parts
              of sentences fly into your mouth.</p>
            <p className="lead">Most designers set their type arbitrarily, either by pulling
              values out of the sky or by adhering to a baseline grid. The former case
              isn’t worth discussing here, but the latter requires a closer look.</p>
            <p>You can use the mark tag to <mark>highlight</mark> text.</p>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
  <Row>
    <Col lg={12}>
      <Card>
        <Card.Header>
          <Card.Title>Text alignment</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="text-wrap">
            <p>Easily realign text to components with text alignment classes.</p>
            <div className="example">
              <p className="text-start">Left aligned text on all viewport sizes.</p>
              <p className="text-center">Center aligned text on all viewport sizes.</p>
              <p className="text-end">Right aligned text on all viewport sizes.</p>
              <p className="text-start m-0">Both aligned text on all viewport sizes.
                Ambitioni
                dedisse scripsisse iudicaretur. Cras mattis iudicium purus sit amet
                fermentum. Donec sed odio operae, eu vulputate felis rhoncus.</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
    <Col lg={12} md={12}>
      <Card>
        <Card.Header>
          <Card.Title>Text transform</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="text-wrap">
            <p>Transform text in components with text capitalization classes.</p>
            <div className="example">
              <p className="text-lowercase">Lowercased text.</p>
              <p className="text-uppercase">Uppercased text.</p>
              <p className="text-capitalize m-0">Capitalized text.</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
    <Col lg={12} md={12}>
      <Card>
        <Card.Header>
          <Card.Title>Letter spacing</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="text-wrap">
            <p>Utilities for controlling the tracking (letter spacing) of an element.
            </p>
            <div className="example">
              <p className="tracking-tight">Lorem ipsum dolor sit amet. Tight letter
                spacing.
              </p>
              <p className="tracking-normal">Lorem ipsum dolor sit amet. Normal letter
                spacing.</p>
              <p className="tracking-wide m-0">Lorem ipsum dolor sit amet. Wide letter
                spacing.</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
    <Col lg={12}>
      <Card>
        <Card.Header>
          <Card.Title>Line Height</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="text-wrap">
            <p>Utilities for controlling the leading (line height) of an element.</p>
            <div className="example">
              <p className="leading-none">Lorem ipsum dolor sit amet.<br/>
                Dolor sit amet.
              </p>
              <p className="leading-tight">Lorem ipsum dolor sit amet.<br/>
                Dolor sit amet.
              </p>
              <p className="leading-normal">Lorem ipsum dolor sit amet.<br/>
                Dolor sit amet.
              </p>
              <p className="leading-loose m-0">Lorem ipsum dolor sit amet.<br/>
                Dolor sit amet.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Text-styles</Card.Title>
        </Card.Header>
        <Card.Body className="card-body ps-5 pe-5">
          <p>You can use the mark tag to
            <mark>highlight</mark> text.
          </p>
          <p>
            <del>This line of text is meant to be treated as deleted text.</del>
          </p>
          <p>
            <s>This line of text is meant to be treated as no longer accurate.</s>
          </p>
          <p>
            <ins>This line of text is meant to be treated as an addition to the
              document.</ins>
          </p>
          <p><u>This line of text will rrighter as underlined</u></p>
          <p>
            <small>This line of text is meant to be treated as fine print.</small>
          </p>
          <p><strong>This line rrightered as bold text.</strong></p>
          <p><em>This line rrightered as italicized text.</em></p>
          <p><b>This line rrightered as italicized text.</b></p>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Inline Style</Card.Title>
        </Card.Header>
        <Card.Body className="card-body ps-5 pe-5">
          <ul className="list-inline">
            <li className="list-inline-item">Lorem ipsum</li>
            <li className="list-inline-item">Phasellus iaculis</li>
            <li className="list-inline-item">Nulla volutpat</li>
          </ul>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Description Align</Card.Title>
        </Card.Header>
        <Card.Body className="card-body ps-5 pe-5">
          <dl className="row">
            <dt className="col-sm-3">Description lists</dt>
            <dd className="col-sm-9">A description list is perfect for defining terms.</dd>

            <dt className="col-sm-3">Euismod</dt>
            <dd className="col-sm-9">
              <p>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem
                nec
                elit.</p>
              <p>Donec id elit non mi porta gravida at eget metus.</p>
            </dd>

            <dt className="col-sm-3">Malesuada porta</dt>
            <dd className="col-sm-9">Etiam porta sem malesuada magna mollis euismod.</dd>

            <dt className="col-sm-3 text-truncate">Truncated term is truncated</dt>
            <dd className="col-sm-9">Fusce dapibus, tellus ac cursus commodo, tortor mauris
              condimentum nibh, ut fermentum massa justo sit amet risus.</dd>

            <dt className="col-sm-3">Nesting</dt>
            <dd className="col-sm-9">
              <dl className="row">
                <dt className="col-sm-4">Nested definition list</dt>
                <dd className="col-sm-8">Aenean posuere, tortor sed cursus feugiat, nunc
                  augue blandit nunc.</dd>
              </dl>
            </dd>
          </dl>
        </Card.Body>
      </Card>
      <Row>
        {quoits.map((quoit)=>(
        <Col lg={6} key={Math.random()}>
          <Card>
            <Card.Header>
              <Card.Title>{quoit.class}</Card.Title>
            </Card.Header>
            <Card.Body className="card-body ps-5 pe-5">
              <blockquote className={`blockquote ${quoit.data}`}>
                <p className="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit.
                  Integer posuere erat a ante.</p>
                <footer className="blockquote-footer">Someone famous in <cite
                    title="Source Title">Source Title</cite></footer>
              </blockquote>
            </Card.Body>
          </Card>
        </Col>
        ))}
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>
                Font Size
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {sizes.map((size)=>(
              <div className="mb-4" key={Math.random()}>
                <p className={size.class}>Demo Content Title</p>
              </div>
              ))}
              <div className="mt-3 table-responsive">
                <table className="table table-bordered text-nowrap mg-t-0 mb-0">
                  <tbody>
                    <tr>
                      <td><b>Classes</b></td>
                      <td><code>.fs-[size]</code></td>
                    </tr>
                    <tr>
                      <td><b>Values</b></td>
                      <td>10 | 11 | 12 | 13 | 14 | 15 | 16 | 18 | 20 | 25 | 30
                        |
                        ... | 100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>
                Font Weight
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <p className="font-weight-light">Demo Content Title</p>
                <p className="font-weight-normal">Demo Content Title</p>
                <p className="font-weight-semibold">Demo Content Title</p>
                <p className="font-weight-bold">Demo Content Title</p>
              </div>
              <div className="mt-3 table-responsive">
                <table className="table  table-bordered text-nowrap mg-t-0 mb-0">
                  <tbody>
                    <tr>
                      <td><b>Classes</b></td>
                      <td><code>.font-[weight]</code></td>
                    </tr>
                    <tr>
                      <td><b>Weight</b></td>
                      <td>bold | semibold | normal | light </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>
                Font Color
              </Card.Title>
            </Card.Header>
           
                       <Card.Body>
                       {fonts.map((font)=>(
              <div className="mb-4" key={Math.random()}>
                <p className={`text-${font.color}`}>Demo Content Title</p>
              </div>
                       ))}
              <div className="mt-3 table-responsive">
                <table className="table table-bordered text-nowrap mg-t-0 mb-0">
                  <tbody>
                    <tr>
                      <td className="wd-20p"><b>Classes</b></td>
                      <td><code>.text-[color]</code></td>
                    </tr>
                    <tr>
                      <td className="wd-20p"><b>Colors</b></td>
                      <td>primary | success | warning | danger | info | indigo
                        |
                        purple | orange | teal | pink | black | white |
                        inverse
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>        
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  </Row>
</Fragment>
);

export default Typhography;
