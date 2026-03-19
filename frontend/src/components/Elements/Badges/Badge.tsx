import React, { FC, Fragment } from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import { simpleBadge, squareBadge, borderBadge, roundBadge, borderoundBadge, borderBadgee, Contextual, roundContextual, lightBadge, gradientBadge, shapeBadge } from '../../../components/Elements/Badges/Data/BadgesData';
interface BadgesProps { }

const Badges: FC<BadgesProps> = () => (

  <Fragment>
    <PageHeader title="Badges" />
    <Row>
      {simpleBadge.map((simpleBadges) => (
        <Col lg={6} key={Math.random()} >
          <Card>
            <Card.Header>
              <Card.Title>{simpleBadges.title}</Card.Title>
            </Card.Header>
            <Card.Body>
              <h1>{simpleBadges.header}<Badge bg={simpleBadges.color} className={`${simpleBadges.classNam} ms-2` }>{simpleBadges.class}</Badge></h1>
              <h2>{simpleBadges.header1}<Badge bg={simpleBadges.color1} className={`${simpleBadges.classNam} ms-2` }>{simpleBadges.class}</Badge></h2>
              <h3>{simpleBadges.header2}<Badge bg={simpleBadges.color2} className={`${simpleBadges.classNam} ms-2` }>{simpleBadges.class}</Badge></h3>
              <h4>{simpleBadges.header3}<Badge bg={simpleBadges.color3} className={`${simpleBadges.classNam} ms-2` }>{simpleBadges.class}</Badge></h4>
              <h5>{simpleBadges.header4}<Badge bg={simpleBadges.color4} className={`${simpleBadges.classNam} ms-2` }>{simpleBadges.class}</Badge></h5>
              <h6>{simpleBadges.header5}<Badge bg={simpleBadges.color5} className={`${simpleBadges.classNam} ms-2` }>{simpleBadges.class}</Badge></h6>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Header>
            <Card.Title >Buttons with square Badges</Card.Title>
          </Card.Header>
          <Card.Body>
            {squareBadge.map((squareBadges) => (
              <Button className="mt-1 mb-1 me-3" variant={squareBadges.color} key={Math.random()} >
                {squareBadges.heading}
                <Badge bg="white" className='text-dark ms-2'>
                  {squareBadges.class}</Badge>

              </Button>
            ))}
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Header>
            <Card.Title>Border buttons with square Badges</Card.Title>
          </Card.Header>
          <Card.Body>
           <div className="example">
            {borderBadge.map((borderBadges) => (
              <Button className="mt-1 mb-1 me-3" variant={borderBadges.color} key={Math.random()} >
                {borderBadges.heading}
                <Badge bg={borderBadges.color1} className='text-white ms-2'>
                  {borderBadges.class}</Badge>

              </Button>
            ))}

           </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
<Row>
      <Col xl={12}>
        <Card>
          <Card.Header>
            <Card.Title>Buttons with rounded Badges</Card.Title>
          </Card.Header>
          <Card.Body>
            {roundBadge.map((roundBadges) => (
              <Button className="mt-1 mb-1 me-3" variant={roundBadges.color} key={Math.random()} >
                {roundBadges.heading}
                <Badge bg="white rounded-pill" className='text-dark ms-2'>
                  {roundBadges.class}</Badge>

              </Button>
            ))}
          </Card.Body>
        </Card>
      </Col>
      </Row>
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>Border buttons with rounded Badges</Card.Title>
            </Card.Header>
            <Card.Body>
              {borderoundBadge.map((borderoundBadges) => (
                <Button className="mt-1 mb-1 me-3" variant={borderoundBadges.color} key={Math.random()} >
                  {borderoundBadges.heading}
                  <Badge bg={borderoundBadges.color1} className='rounded-pill ms-2'>
                    {borderoundBadges.class}</Badge>

                </Button>
              ))}
            </Card.Body>
          </Card>
        </Col>
        </Row>
        <Row>
          <Col xl={12}>
            <Card>
              <Card.Header>
                <Card.Title>Border buttons with rounded Badges</Card.Title>
              </Card.Header>
              <Card.Body>
                {borderBadgee.map((borderBadges) => (
                  <Button className='btn position-relative me-5 mb-3' key={Math.random()} variant={borderBadges.color}>
                    {borderBadges.heading}
                    <Badge bg={borderBadges.color1} className='position-absolute top-0 start-100 translate-middle badge rounded-pill'>{borderBadges.class}</Badge>
                  </Button>
                ))}
              </Card.Body>
            </Card>
          </Col>
          </Row>
          <Row>
            <Col md={12} lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Contextual variations</Card.Title>
                </Card.Header>
                <Card.Body>
                  {Contextual.map((Contextuals) => (
                    <Badge className=" me-1 mt-2" key={Math.random()} bg={Contextuals.color}>{Contextuals.heading}</Badge>
                  ))}
                </Card.Body>
              </Card>
            </Col>
         
         
            <Col md={12} lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Pill Badges</Card.Title>
                </Card.Header>
                <Card.Body>
                  {roundContextual.map((roundContextuals) => (
                    <Badge className=" me-1 rounded-pill mt-2" key={Math.random()} bg={roundContextuals.color}>{roundContextuals.heading}</Badge>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>light Badges</Card.Title>
                </Card.Header>
                <Card.Body>
                  {lightBadge.map((lightBadges) => (
                    <Badge className=" me-1 mt-2" key={Math.random()} bg={lightBadges.color}>{lightBadges.heading}</Badge>
                  ))}
                </Card.Body>
              </Card>
            </Col>
        
            <Col md={12} lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Graident Badges</Card.Title>
                </Card.Header>
                <Card.Body>
                  {gradientBadge.map((gradientBadges) => (
                    <Badge className=" me-1 mt-2" key={Math.random()} bg={gradientBadges.color}>{gradientBadges.heading}</Badge>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card>
            <Card.Body >
              <Row>
                {shapeBadge.map((shapeBadges) => (
                  <Col xs={12} sm={6} lg={4} key={Math.random()}>
                    <div className={`offer ${shapeBadges.color}`}>
                      <div className="shape">
                        <div className="shape-text">
                          {shapeBadges.title}
                        </div>
                      </div>
                      <div className="offer-content">
                        <h3 className="lead font-weight-semibold">
                          {shapeBadges.heading}
                        </h3>
                        <p className="mb-0">
                          {shapeBadges.class}
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

   
  </Fragment>


);

export default Badges;
