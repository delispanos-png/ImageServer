import React, { FC, Fragment } from 'react';
import { Card, Col, Row, OverlayTrigger, Tooltip} from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';

interface FontAwesomeProps {}

const FontAwesome: FC<FontAwesomeProps> = () => (
  <Fragment>
  <PageHeader  title="Font Awesome Icons" />
  <Row>
    <Col md={12}>
      <Card>
        <Card.Header>
          <Card.Title>Font Awesome</Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col lg={12} sm={12}mb={4}>
              <p className="mb-2">Powered by Font Awesome set. For more info <a 
              href="https://fontawesome.com/" target="_blank"
                  className="fs-16 text-primary font-weight-bold" rel="noreferrer">click here</a>.</p>
              <p><code>&lt;i className="fa fa-ICON_NAME"&gt;&lt;/i&gt;</code></p>
            </Col>
            <Col lg={12} sm={12}>
              <div className="icons-list-wrap">
                <ul className="icons-list">
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-500px 
                          </Tooltip>}>
                            <i className="fa fa-500px" data-bs-toggle="tooltip" title="fa fa-500px"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-address-book 
                          </Tooltip>}>
                            <i className="fa fa-address-book" data-bs-toggle="tooltip" title="fa fa-address-book"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-address-book 
                          </Tooltip>}>
                            <i className="fa fa-address-book-o" data-bs-toggle="tooltip" title="fa fa-address-book-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-address-card 
                          </Tooltip>}>
                            <i className="fa fa-address-card" data-bs-toggle="tooltip" title="fa fa-address-card"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-address-card 
                          </Tooltip>}>
                            <i className="fa fa-address-card-o" data-bs-toggle="tooltip" title="fa fa-address-card-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-adjust
                          </Tooltip>}>
                            <i className="fa fa-adjust" data-bs-toggle="tooltip" title="fa fa-adjust"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-adn
                          </Tooltip>}>
                            <i className="fa fa-adn" data-bs-toggle="tooltip" title="fa fa-adn"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-align-center 
                          </Tooltip>}>
                            <i className="fa fa-align-center" data-bs-toggle="tooltip" title="fa fa-align-center"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-align-justif 
                          </Tooltip>}>
                            <i className="fa fa-align-justify" data-bs-toggle="tooltip" title="fa fa-align-justify"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-align-left  
                          </Tooltip>}>
                            <i className="fa fa-align-left" data-bs-toggle="tooltip" title="fa fa-align-left"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-align-right 
                          </Tooltip>}>
                            <i className="fa fa-align-right" data-bs-toggle="tooltip" title="fa fa-align-right"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-amazon
                          </Tooltip>}>
                            <i className="fa fa-amazon" data-bs-toggle="tooltip" title="fa fa-amazon"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-ambulance 
                          </Tooltip>}>
                            <i className="fa fa-ambulance" data-bs-toggle="tooltip" title="fa fa-ambulance"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-american-sign-language-interpreting" data-bs-toggle="tooltip" title="fa fa-american-sign-language-interpreting"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-anchor
                          </Tooltip>}>
                            <i className="fa fa-anchor" data-bs-toggle="tooltip" title="fa fa-anchor"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-android
                          </Tooltip>}>
                            <i className="fa fa-android" data-bs-toggle="tooltip" title="fa fa-android"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-angellist 
                          </Tooltip>}>
                            <i className="fa fa-angellist" data-bs-toggle="tooltip" title="fa fa-angellist"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-angle-double 
                          </Tooltip>}>
                            <i className="fa fa-angle-double-down" data-bs-toggle="tooltip" title="fa fa-angle-double-down"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-angle-double 
                          </Tooltip>}>
                            <i className="fa fa-angle-double-left" data-bs-toggle="tooltip" title="fa fa-angle-double-left"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-angle-double 
                          </Tooltip>}>
                            <i className="fa fa-angle-double-right" data-bs-toggle="tooltip" title="fa fa-angle-double-right"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-angle-double 
                          </Tooltip>}>
                            <i className="fa fa-angle-double-up" data-bs-toggle="tooltip" title="fa fa-angle-double-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-angle-down 
                          </Tooltip>}>
                            <i className="fa fa-angle-down" data-bs-toggle="tooltip" title="fa fa-angle-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-angle-left  
                          </Tooltip>}>
                            <i className="fa fa-angle-left" data-bs-toggle="tooltip" title="fa fa-angle-left"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-angle-right 
                          </Tooltip>}>
                            <i className="fa fa-angle-right" data-bs-toggle="tooltip" title="fa fa-angle-right"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-angle-up 
                          </Tooltip>}>
                            <i className="fa fa-angle-up" data-bs-toggle="tooltip" title="fa fa-angle-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-apple 
                          </Tooltip>}>
                            <i className="fa fa-apple" data-bs-toggle="tooltip" title="fa fa-apple"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-archive 
                          </Tooltip>}>
                            <i className="fa fa-archive" data-bs-toggle="tooltip" title="fa fa-archive"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-area-chart  
                          </Tooltip>}>
                            <i className="fa fa-area-chart" data-bs-toggle="tooltip" title="fa fa-area-chart"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrow-circle 
                          </Tooltip>}>
                            <i className="fa fa-arrow-circle-down" data-bs-toggle="tooltip" title="fa fa-arrow-circle-down"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrow-circle 
                          </Tooltip>}>
                            <i className="fa fa-arrow-circle-left" data-bs-toggle="tooltip" title="fa fa-arrow-circle-left"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrow-circle 
                          </Tooltip>}>
                            <i className="fa fa-arrow-circle-o-down" data-bs-toggle="tooltip" title="fa fa-arrow-circle-o-down"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrow-circle 
                          </Tooltip>}>
                            <i className="fa fa-arrow-circle-o-left" data-bs-toggle="tooltip" title="fa fa-arrow-circle-o-left"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-arrow-circle-o-right" data-bs-toggle="tooltip" title="fa fa-arrow-circle-o-right"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrow-circle 
                          </Tooltip>}>
                            <i className="fa fa-arrow-circle-o-up" data-bs-toggle="tooltip" title="fa fa-arrow-circle-o-up"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrow-circle 
                          </Tooltip>}>
                            <i className="fa fa-arrow-circle-right" data-bs-toggle="tooltip" title="fa fa-arrow-circle-right"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrow-circle 
                          </Tooltip>}>
                            <i className="fa fa-arrow-circle-up" data-bs-toggle="tooltip" title="fa fa-arrow-circle-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrow-down  
                          </Tooltip>}>
                            <i className="fa fa-arrow-down" data-bs-toggle="tooltip" title="fa fa-arrow-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrow-left  
                          </Tooltip>}>
                            <i className="fa fa-arrow-left" data-bs-toggle="tooltip" title="fa fa-arrow-left"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrow-right 
                          </Tooltip>}>
                            <i className="fa fa-arrow-right" data-bs-toggle="tooltip" title="fa fa-arrow-right"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrow-up
                          </Tooltip>}>
                            <i className="fa fa-arrow-up" data-bs-toggle="tooltip" title="fa fa-arrow-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrows 
                          </Tooltip>}>
                            <i className="fa fa-arrows" data-bs-toggle="tooltip" title="fa fa-arrows"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrows-alt  
                          </Tooltip>}>
                            <i className="fa fa-arrows-alt" data-bs-toggle="tooltip" title="fa fa-arrows-alt"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrows-h 
                          </Tooltip>}>
                            <i className="fa fa-arrows-h" data-bs-toggle="tooltip" title="fa fa-arrows-h"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-arrows-v 
                          </Tooltip>}>
                            <i className="fa fa-arrows-v" data-bs-toggle="tooltip" title="fa fa-arrows-v"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-asl-interpre 
                          </Tooltip>}>
                            <i className="fa fa-asl-interpreting" data-bs-toggle="tooltip" title="fa fa-asl-interpreting"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-assistive-listening-systems" data-bs-toggle="tooltip" title="fa fa-assistive-listening-systems"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-asterisk 
                          </Tooltip>}>
                            <i className="fa fa-asterisk" data-bs-toggle="tooltip" title="fa fa-asterisk"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
           fa fa-at 
                          </Tooltip>}>
                            <i className="fa fa-at" data-bs-toggle="tooltip" title="fa fa-at"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-audio-descri 
                          </Tooltip>}>
                            <i className="fa fa-audio-description" data-bs-toggle="tooltip" title="fa fa-audio-description"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-automobile  
                          </Tooltip>}>
                            <i className="fa fa-automobile" data-bs-toggle="tooltip" title="fa fa-automobile"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-backward
                          </Tooltip>}>
                            <i className="fa fa-backward" data-bs-toggle="tooltip" title="fa fa-backward"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-balance-scal 
                          </Tooltip>}>
                            <i className="fa fa-balance-scale" data-bs-toggle="tooltip" title="fa fa-balance-scale"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                fa fa-ban 
                          </Tooltip>}>
                            <i className="fa fa-ban" data-bs-toggle="tooltip" title="fa fa-ban"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bandcamp 
                          </Tooltip>}>
                            <i className="fa fa-bandcamp" data-bs-toggle="tooltip" title="fa fa-bandcamp"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-bank 
                          </Tooltip>}>
                            <i className="fa fa-bank" data-bs-toggle="tooltip" title="fa fa-bank"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bar-chart
                          </Tooltip>}>
                            <i className="fa fa-bar-chart" data-bs-toggle="tooltip" title="fa fa-bar-chart"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bar-chart-o
                          </Tooltip>}>
                            <i className="fa fa-bar-chart-o" data-bs-toggle="tooltip" title="fa fa-bar-chart-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-barcode
                          </Tooltip>}>
                            <i className="fa fa-barcode" data-bs-toggle="tooltip" title="fa fa-barcode"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-bars 
                          </Tooltip>}>
                            <i className="fa fa-bars" data-bs-toggle="tooltip" title="fa fa-bars"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-bath
                          </Tooltip>}>
                            <i className="fa fa-bath" data-bs-toggle="tooltip" title="fa fa-bath"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bathtub 
                          </Tooltip>}>
                            <i className="fa fa-bathtub" data-bs-toggle="tooltip" title="fa fa-bathtub"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-battery 
                          </Tooltip>}>
                            <i className="fa fa-battery" data-bs-toggle="tooltip" title="fa fa-battery"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-battery-0
                          </Tooltip>}>
                            <i className="fa fa-battery-0" data-bs-toggle="tooltip" title="fa fa-battery-0"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-battery-1
                          </Tooltip>}>
                            <i className="fa fa-battery-1" data-bs-toggle="tooltip" title="fa fa-battery-1"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-battery-2
                          </Tooltip>}>
                            <i className="fa fa-battery-2" data-bs-toggle="tooltip" title="fa fa-battery-2"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-battery-3 
                          </Tooltip>}>
                            <i className="fa fa-battery-3" data-bs-toggle="tooltip" title="fa fa-battery-3"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-battery-4 
                          </Tooltip>}>
                            <i className="fa fa-battery-4" data-bs-toggle="tooltip" title="fa fa-battery-4"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-battery-empt 
                          </Tooltip>}>
                            <i className="fa fa-battery-empty" data-bs-toggle="tooltip" title="fa fa-battery-empty"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-battery-full 
                          </Tooltip>}>
                            <i className="fa fa-battery-full" data-bs-toggle="tooltip" title="fa fa-battery-full"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-battery-half 
                          </Tooltip>}>
                            <i className="fa fa-battery-half" data-bs-toggle="tooltip" title="fa fa-battery-half"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-battery-quar 
                          </Tooltip>}>
                            <i className="fa fa-battery-quarter" data-bs-toggle="tooltip" title="fa fa-battery-quarter"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-battery-three-quarters" data-bs-toggle="tooltip" title="fa fa-battery-three-quarters"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                fa fa-bed 
                          </Tooltip>}>
                            <i className="fa fa-bed" data-bs-toggle="tooltip" title="fa fa-bed"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-beer 
                          </Tooltip>}>
                            <i className="fa fa-beer" data-bs-toggle="tooltip" title="fa fa-beer"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-behance 
                          </Tooltip>}>
                            <i className="fa fa-behance" data-bs-toggle="tooltip" title="fa fa-behance"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-behance-square 
                          </Tooltip>}>
                            <i className="fa fa-behance-square" data-bs-toggle="tooltip" title="fa fa-behance-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-bell
                          </Tooltip>}>
                            <i className="fa fa-bell" data-bs-toggle="tooltip" title="fa fa-bell"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bell-o 
                          </Tooltip>}>
                            <i className="fa fa-bell-o" data-bs-toggle="tooltip" title="fa fa-bell-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bell-slash  
                          </Tooltip>}>
                            <i className="fa fa-bell-slash" data-bs-toggle="tooltip" title="fa fa-bell-slash"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bell-slash-o 
                          </Tooltip>}>
                            <i className="fa fa-bell-slash-o" data-bs-toggle="tooltip" title="fa fa-bell-slash-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bicycle 
                          </Tooltip>}>
                            <i className="fa fa-bicycle" data-bs-toggle="tooltip" title="fa fa-bicycle"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-binoculars  
                          </Tooltip>}>
                            <i className="fa fa-binoculars" data-bs-toggle="tooltip" title="fa fa-binoculars"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-birthday-cake
                          </Tooltip>}>
                            <i className="fa fa-birthday-cake" data-bs-toggle="tooltip" title="fa fa-birthday-cake"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bitbucket 
                          </Tooltip>}>
                            <i className="fa fa-bitbucket" data-bs-toggle="tooltip" title="fa fa-bitbucket"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bitbucket-square
                          </Tooltip>}>
                            <i className="fa fa-bitbucket-square" data-bs-toggle="tooltip" title="fa fa-bitbucket-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bitcoin
                          </Tooltip>}>
                            <i className="fa fa-bitcoin" data-bs-toggle="tooltip" title="fa fa-bitcoin"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-black-tie
                          </Tooltip>}>
                            <i className="fa fa-black-tie" data-bs-toggle="tooltip" title="fa fa-black-tie"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-blind 
                          </Tooltip>}>
                            <i className="fa fa-blind" data-bs-toggle="tooltip" title="fa fa-blind"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bluetooth 
                          </Tooltip>}>
                            <i className="fa fa-bluetooth" data-bs-toggle="tooltip" title="fa fa-bluetooth"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bluetooth-b
                          </Tooltip>}>
                            <i className="fa fa-bluetooth-b" data-bs-toggle="tooltip" title="fa fa-bluetooth-b"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-bold
                          </Tooltip>}>
                            <i className="fa fa-bold" data-bs-toggle="tooltip" title="fa fa-bold"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-bolt 
                          </Tooltip>}>
                            <i className="fa fa-bolt" data-bs-toggle="tooltip" title="fa fa-bolt"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                      fa fa-bomb
                          </Tooltip>}>
                            <i className="fa fa-bomb" data-bs-toggle="tooltip" title="fa fa-bomb"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-book 
                          </Tooltip>}>
                            <i className="fa fa-book" data-bs-toggle="tooltip" title="fa fa-book"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bookmark 
                          </Tooltip>}>
                            <i className="fa fa-bookmark" data-bs-toggle="tooltip" title="fa fa-bookmark"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bookmark-o  
                          </Tooltip>}>
                            <i className="fa fa-bookmark-o" data-bs-toggle="tooltip" title="fa fa-bookmark-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-braille 
                          </Tooltip>}>
                            <i className="fa fa-braille" data-bs-toggle="tooltip" title="fa fa-braille"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-briefcase 
                          </Tooltip>}>
                            <i className="fa fa-briefcase" data-bs-toggle="tooltip" title="fa fa-briefcase"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                fa fa-btc
                          </Tooltip>}>
                            <i className="fa fa-btc" data-bs-toggle="tooltip" title="fa fa-btc"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                fa fa-bug
                          </Tooltip>}>
                            <i className="fa fa-bug" data-bs-toggle="tooltip" title="fa fa-bug"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-building
                          </Tooltip>}>
                            <i className="fa fa-building" data-bs-toggle="tooltip" title="fa fa-building"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-building-o  
                          </Tooltip>}>
                            <i className="fa fa-building-o" data-bs-toggle="tooltip" title="fa fa-building-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bullhorn 
                          </Tooltip>}>
                            <i className="fa fa-bullhorn" data-bs-toggle="tooltip" title="fa fa-bullhorn"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-bullseye 
                          </Tooltip>}>
                            <i className="fa fa-bullseye" data-bs-toggle="tooltip" title="fa fa-bullseye"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                fa fa-bus
                          </Tooltip>}>
                            <i className="fa fa-bus" data-bs-toggle="tooltip" title="fa fa-bus"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-buysellads 
                          </Tooltip>}>
                            <i className="fa fa-buysellads" data-bs-toggle="tooltip" title="fa fa-buysellads"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-cab
                          </Tooltip>}>
                            <i className="fa fa-cab" data-bs-toggle="tooltip" title="fa fa-cab"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-calculator  
                          </Tooltip>}>
                            <i className="fa fa-calculator" data-bs-toggle="tooltip" title="fa fa-calculator"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-calendar
                          </Tooltip>}>
                            <i className="fa fa-calendar" data-bs-toggle="tooltip" title="fa fa-calendar"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-calendar-che 
                          </Tooltip>}>
                            <i className="fa fa-calendar-check-o" data-bs-toggle="tooltip" title="fa fa-calender-check-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-calendar-min 
                          </Tooltip>}>
                            <i className="fa fa-calendar-minus-o" data-bs-toggle="tooltip" title="fa fa-calender-minus-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-calendar-o
                          </Tooltip>}>
                            <i className="fa fa-calendar-o" data-bs-toggle="tooltip" title="fa fa-calendar-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-calendar-plus-o 
                          </Tooltip>}>
                            <i className="fa fa-calendar-plus-o" data-bs-toggle="tooltip" title="fa fa-calendar-plus-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-calendar-times-o
                          </Tooltip>}>
                            <i className="fa fa-calendar-times-o" data-bs-toggle="tooltip" title="fa fa-calendar-times-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-camera
                          </Tooltip>}>
                            <i className="fa fa-camera" data-bs-toggle="tooltip" title="fa fa-camera"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-camera-retro 
                          </Tooltip>}>
                            <i className="fa fa-camera-retro" data-bs-toggle="tooltip" title="fa fa-camera-retro"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-car
                          </Tooltip>}>
                            <i className="fa fa-car" data-bs-toggle="tooltip" title="fa fa-car"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-caret-down
                          </Tooltip>}>
                            <i className="fa fa-caret-down" data-bs-toggle="tooltip" title="fa fa-caret-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-caret-left
                          </Tooltip>}>
                            <i className="fa fa-caret-left" data-bs-toggle="tooltip" title="fa fa-caret-left"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-caret-right 
                          </Tooltip>}>
                            <i className="fa fa-caret-right" data-bs-toggle="tooltip" title="fa fa-caret-right"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-caret-square 
                          </Tooltip>}>
                            <i className="fa fa-caret-square-o-down" data-bs-toggle="tooltip" title="fa fa-caret-square-o-down"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-caret-square 
                          </Tooltip>}>
                            <i className="fa fa-caret-square-o-left" data-bs-toggle="tooltip" title="fa fa-caret-square-o-left"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-caret-square-o-right" data-bs-toggle="tooltip" title="fa fa-caret-square-o-right"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-caret-square 
                          </Tooltip>}>
                            <i className="fa fa-caret-square-o-up" data-bs-toggle="tooltip" title="fa fa-caret-square-o-up"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-caret-up
                          </Tooltip>}>
                            <i className="fa fa-caret-up" data-bs-toggle="tooltip" title="fa fa-caret-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cart-arrow-d 
                          </Tooltip>}>
                            <i className="fa fa-cart-arrow-down" data-bs-toggle="tooltip" title="fa fa-cart-arrow-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cart-plus
                          </Tooltip>}>
                            <i className="fa fa-cart-plus" data-bs-toggle="tooltip" title="fa fa-cart-plus"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
           fa fa-cc
                          </Tooltip>}>
                            <i className="fa fa-cc" data-bs-toggle="tooltip" title="fa fa-cc"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cc-amex
                          </Tooltip>}>
                            <i className="fa fa-cc-amex" data-bs-toggle="tooltip" title="fa fa-cc-amex"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cc-diners-club 
                          </Tooltip>}>
                            <i className="fa fa-cc-diners-club" data-bs-toggle="tooltip" title="fa fa-cc-diners-club"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cc-discover" 
                          </Tooltip>}>
                            <i className="fa fa-cc-discover" data-bs-toggle="tooltip" title="fa fa-cc-discover"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cc-jcb
                          </Tooltip>}>
                            <i className="fa fa-cc-jcb" data-bs-toggle="tooltip" title="fa fa-cc-jcb"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cc-mastercard 
                          </Tooltip>}>
                            <i className="fa fa-cc-mastercard" data-bs-toggle="tooltip" title="fa fa-cc-mastercard"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cc-paypal
                          </Tooltip>}>
                            <i className="fa fa-cc-paypal" data-bs-toggle="tooltip" title="fa fa-cc-paypal"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cc-stripe
                          </Tooltip>}>
                            <i className="fa fa-cc-stripe" data-bs-toggle="tooltip" title="fa fa-cc-stripe"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cc-visa
                          </Tooltip>}>
                            <i className="fa fa-cc-visa" data-bs-toggle="tooltip" title="fa fa-cc-visa"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-certificate
                          </Tooltip>}>
                            <i className="fa fa-certificate" data-bs-toggle="tooltip" title="fa fa-certificate"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-chain
                          </Tooltip>}>
                            <i className="fa fa-chain" data-bs-toggle="tooltip" title="fa fa-chain"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"

                          overlay={<Tooltip>
                            fa fa-chain-broken 
                          </Tooltip>}>
                            <i className="fa fa-chain-broken" data-bs-toggle="tooltip" title="fa fa-chain-broken"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-check
                          </Tooltip>}>
                            <i className="fa fa-check" data-bs-toggle="tooltip" title="fa fa-check"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-check-circle 
                          </Tooltip>}>
                            <i className="fa fa-check-circle" data-bs-toggle="tooltip" title="fa fa-check-circle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-check-circle 
                          </Tooltip>}>
                            <i className="fa fa-check-circle-o" data-bs-toggle="tooltip" title="fa fa-check-circle-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-check-square 
                          </Tooltip>}>
                            <i className="fa fa-check-square" data-bs-toggle="tooltip" title="fa fa-check-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-check-square 
                          </Tooltip>}>
                            <i className="fa fa-check-square-o" data-bs-toggle="tooltip" title="fa fa-check-square-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-chevron-circ 
                          </Tooltip>}>
                            <i className="fa fa-chevron-circle-down" data-bs-toggle="tooltip" title="fa fa-chevron-circle-down"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-chevron-circ 
                          </Tooltip>}>
                            <i className="fa fa-chevron-circle-left" data-bs-toggle="tooltip" title="fa fa-chevron-circle-left"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-chevron-circle-right" data-bs-toggle="tooltip" title="fa fa-chevron-circle-right"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-chevron-circ 
                          </Tooltip>}>
                            <i className="fa fa-chevron-circle-up" data-bs-toggle="tooltip" title="fa fa-chevron-circle-up"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-chevron-down 
                          </Tooltip>}>
                            <i className="fa fa-chevron-down" data-bs-toggle="tooltip" title="fa fa-chevron-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-chevron-left 
                          </Tooltip>}>
                            <i className="fa fa-chevron-left" data-bs-toggle="tooltip" title="fa fa-chevron-left"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-chevron-righ 
                          </Tooltip>}>
                            <i className="fa fa-chevron-right" data-bs-toggle="tooltip" title="fa fa-chevron-right"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-chevron-up
                          </Tooltip>}>
                            <i className="fa fa-chevron-up" data-bs-toggle="tooltip" title="fa fa-chevron-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-child
                          </Tooltip>}>
                            <i className="fa fa-child" data-bs-toggle="tooltip" title="fa fa-child"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-chrome
                          </Tooltip>}>
                            <i className="fa fa-chrome" data-bs-toggle="tooltip" title="fa fa-chrome"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-circle
                          </Tooltip>}>
                            <i className="fa fa-circle" data-bs-toggle="tooltip" title="fa fa-circle"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-circle-o
                          </Tooltip>}>
                            <i className="fa fa-circle-o" data-bs-toggle="tooltip" title="fa fa-circle-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-circle-o-not 
                          </Tooltip>}>
                            <i className="fa fa-circle-o-notch" data-bs-toggle="tooltip" title="fa fa-circle-o-notch"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-circle-thin 
                          </Tooltip>}>
                            <i className="fa fa-circle-thin" data-bs-toggle="tooltip" title="fa fa-circle-thin"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-clipboard
                          </Tooltip>}>
                            <i className="fa fa-clipboard" data-bs-toggle="tooltip" title="fa fa-clipboard"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-clock-o
                          </Tooltip>}>
                            <i className="fa fa-clock-o" data-bs-toggle="tooltip" title="fa fa-clock-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-clone
                          </Tooltip>}>
                            <i className="fa fa-clone" data-bs-toggle="tooltip" title="fa fa-clone"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-close
                          </Tooltip>}>
                            <i className="fa fa-close" data-bs-toggle="tooltip" title="fa fa-close"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cloud
                          </Tooltip>}>
                            <i className="fa fa-cloud" data-bs-toggle="tooltip" title="fa fa-cloud"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cloud-downlo 
                          </Tooltip>}>
                            <i className="fa fa-cloud-download" data-bs-toggle="tooltip" title="fa fa-cloud-download"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cloud-upload 
                          </Tooltip>}>
                            <i className="fa fa-cloud-upload" data-bs-toggle="tooltip" title="fa fa-cloud-upload"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-cny
                          </Tooltip>}>
                            <i className="fa fa-cny" data-bs-toggle="tooltip" title="fa fa-cny"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-code
                          </Tooltip>}>
                            <i className="fa fa-code" data-bs-toggle="tooltip" title="fa fa-code"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-code-fork
                          </Tooltip>}>
                            <i className="fa fa-code-fork" data-bs-toggle="tooltip" title="fa fa-code-fork"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-codepen
                          </Tooltip>}>
                            <i className="fa fa-codepen" data-bs-toggle="tooltip" title="fa fa-codepen"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-codiepie
                          </Tooltip>}>
                            <i className="fa fa-codiepie" data-bs-toggle="tooltip" title="fa fa-codiepie"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-coffee
                          </Tooltip>}>
                            <i className="fa fa-coffee" data-bs-toggle="tooltip" title="fa fa-coffee"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-cog
                          </Tooltip>}>
                            <i className="fa fa-cog" data-bs-toggle="tooltip" title="fa fa-cog"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-cogs
                          </Tooltip>}>
                            <i className="fa fa-cogs" data-bs-toggle="tooltip" title="fa fa-cogs"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-columns
                          </Tooltip>}>
                            <i className="fa fa-columns" data-bs-toggle="tooltip" title="fa fa-columns"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-comment
                          </Tooltip>}>
                            <i className="fa fa-comment" data-bs-toggle="tooltip" title="fa fa-comment"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-comment-o
                          </Tooltip>}>
                            <i className="fa fa-comment-o" data-bs-toggle="tooltip" title="fa fa-comment-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-commenting  
                          </Tooltip>}>
                            <i className="fa fa-commenting" data-bs-toggle="tooltip" title="fa fa-commenting"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-commenting-o 
                          </Tooltip>}>
                            <i className="fa fa-commenting-o" data-bs-toggle="tooltip" title="fa fa-commenting-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-comments
                          </Tooltip>}>
                            <i className="fa fa-comments" data-bs-toggle="tooltip" title="fa fa-comments"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-comments-o
                          </Tooltip>}>
                            <i className="fa fa-comments-o" data-bs-toggle="tooltip" title="fa fa-comments-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-compass
                          </Tooltip>}>
                            <i className="fa fa-compass" data-bs-toggle="tooltip" title="fa fa-compass"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-compress
                          </Tooltip>}>
                            <i className="fa fa-compress" data-bs-toggle="tooltip" title="fa fa-compress"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-connectdevel 
                          </Tooltip>}>
                            <i className="fa fa-connectdevelop" data-bs-toggle="tooltip" title="fa fa-connectdevelop"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-contao
                          </Tooltip>}>
                            <i className="fa fa-contao" data-bs-toggle="tooltip" title="fa fa-contao"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        "fa fa-copy
                          </Tooltip>}>
                            <i className="fa fa-copy" data-bs-toggle="tooltip" title="fa fa-copy"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-copyright
                          </Tooltip>}>
                            <i className="fa fa-copyright" data-bs-toggle="tooltip" title="fa fa-copyright"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-creative-com 
                          </Tooltip>}>
                            <i className="fa fa-creative-commons" data-bs-toggle="tooltip" title="fa fa-creative-commons"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-credit-card
                          </Tooltip>}>
                            <i className="fa fa-credit-card" data-bs-toggle="tooltip" title="fa fa-credit-card"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-credit-card-alt 
                          </Tooltip>}>
                            <i className="fa fa-credit-card-alt" data-bs-toggle="tooltip" title="fa fa-credit-card-alt"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-crop
                          </Tooltip>}>
                            <i className="fa fa-crop" data-bs-toggle="tooltip" title="fa fa-crop"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-crosshairs  
                          </Tooltip>}>
                            <i className="fa fa-crosshairs" data-bs-toggle="tooltip" title="fa fa-crosshairs"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-css3
                          </Tooltip>}>
                            <i className="fa fa-css3" data-bs-toggle="tooltip" title="fa fa-css3"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-cube
                          </Tooltip>}>
                            <i className="fa fa-cube" data-bs-toggle="tooltip" title="fa fa-cube"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cubes
                          </Tooltip>}>
                            <i className="fa fa-cubes" data-bs-toggle="tooltip" title="fa fa-cubes"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-cut
                          </Tooltip>}>
                            <i className="fa fa-cut" data-bs-toggle="tooltip" title="fa fa-cut"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-cutlery
                          </Tooltip>}>
                            <i className="fa fa-cutlery" data-bs-toggle="tooltip" title="fa fa-cutlery"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-dashboard
                          </Tooltip>}>
                            <i className="fa fa-dashboard" data-bs-toggle="tooltip" title="fa fa-dashboard"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-dashcube
                          </Tooltip>}>
                            <i className="fa fa-dashcube" data-bs-toggle="tooltip" title="fa fa-dashcube"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-database
                          </Tooltip>}>
                            <i className="fa fa-database" data-bs-toggle="tooltip" title="fa fa-database"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        "fa fa-deaf
                          </Tooltip>}>
                            <i className="fa fa-deaf" data-bs-toggle="tooltip" title="fa fa-deaf"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-deafness
                          </Tooltip>}>
                            <i className="fa fa-deafness" data-bs-toggle="tooltip" title="fa fa-deafness"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-dedent
                          </Tooltip>}>
                            <i className="fa fa-dedent" data-bs-toggle="tooltip" title="fa fa-dedent"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-delicious
                          </Tooltip>}>
                            <i className="fa fa-delicious" data-bs-toggle="tooltip" title="fa fa-delicious"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-desktop
                          </Tooltip>}>
                            <i className="fa fa-desktop" data-bs-toggle="tooltip" title="fa fa-desktop"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-deviantart"  
                          </Tooltip>}>
                            <i className="fa fa-deviantart" data-bs-toggle="tooltip" title="fa fa-deviantart"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-diamond
                          </Tooltip>}>
                            <i className="fa fa-diamond" data-bs-toggle="tooltip" title="fa fa-diamond"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-digg
                          </Tooltip>}>
                            <i className="fa fa-digg" data-bs-toggle="tooltip" title="fa fa-digg"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-dollar
                          </Tooltip>}>
                            <i className="fa fa-dollar" data-bs-toggle="tooltip" title="fa fa-dollar"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-dot-circle-o 
                          </Tooltip>}>
                            <i className="fa fa-dot-circle-o" data-bs-toggle="tooltip" title="fa fa-dot-circle-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-download
                          </Tooltip>}>
                            <i className="fa fa-download" data-bs-toggle="tooltip" title="fa fa-download"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-dribbble
                          </Tooltip>}>
                            <i className="fa fa-dribbble" data-bs-toggle="tooltip" title="fa fa-dribbble"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-drivers-lice 
                          </Tooltip>}>
                            <i className="fa fa-drivers-license" data-bs-toggle="tooltip" title="fa fa-drivers-license"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-drivers-lice 
                          </Tooltip>}>
                            <i className="fa fa-drivers-license-o" data-bs-toggle="tooltip" title="fa fa-drivers-license-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-dropbox
                          </Tooltip>}>
                            <i className="fa fa-dropbox" data-bs-toggle="tooltip" title="fa fa-dropbox"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-drupal
                          </Tooltip>}>
                            <i className="fa fa-drupal" data-bs-toggle="tooltip" title="fa fa-drupal"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-edge
                          </Tooltip>}>
                            <i className="fa fa-edge" data-bs-toggle="tooltip" title="fa fa-edge"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-edit
                          </Tooltip>}>
                            <i className="fa fa-edit" data-bs-toggle="tooltip" title="fa fa-edit"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-eercast
                          </Tooltip>}>
                            <i className="fa fa-eercast" data-bs-toggle="tooltip" title="fa fa-eercast"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-eject
                          </Tooltip>}>
                            <i className="fa fa-eject" data-bs-toggle="tooltip" title="fa fa-eject"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-ellipsis-h  
                          </Tooltip>}>
                            <i className="fa fa-ellipsis-h" data-bs-toggle="tooltip" title="fa fa-ellipsis-h"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-ellipsis-v  
                          </Tooltip>}>
                            <i className="fa fa-ellipsis-v" data-bs-toggle="tooltip" title="fa fa-ellipsis-v"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-empire
                          </Tooltip>}>
                            <i className="fa fa-empire" data-bs-toggle="tooltip" title="fa fa-empire"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-envelope
                          </Tooltip>}>
                            <i className="fa fa-envelope" data-bs-toggle="tooltip" title="fa fa-envelope"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-envelope-o
                          </Tooltip>}>
                            <i className="fa fa-envelope-o" data-bs-toggle="tooltip" title="fa fa-envelope-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-envelope-ope 
                          </Tooltip>}>
                            <i className="fa fa-envelope-open" data-bs-toggle="tooltip" title="fa fa-envelope-open"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-envelope-ope 
                          </Tooltip>}>
                            <i className="fa fa-envelope-open-o" data-bs-toggle="tooltip" title="fa fa-envelope-open-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-envelope-square 
                          </Tooltip>}>
                            <i className="fa fa-envelope-square" data-bs-toggle="tooltip" title="fa fa-envelope-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-envira
                          </Tooltip>}>
                            <i className="fa fa-envira" data-bs-toggle="tooltip" title="fa fa-envira"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-eraser
                          </Tooltip>}>
                            <i className="fa fa-eraser" data-bs-toggle="tooltip" title="fa fa-eraser"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-etsy
                          </Tooltip>}>
                            <i className="fa fa-etsy" data-bs-toggle="tooltip" title="fa fa-etsy"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-eur
                          </Tooltip>}>
                            <i className="fa fa-eur" data-bs-toggle="tooltip" title="fa fa-eur"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-euro
                          </Tooltip>}>
                            <i className="fa fa-euro" data-bs-toggle="tooltip" title="fa fa-euro"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-exchange
                          </Tooltip>}>
                            <i className="fa fa-exchange" data-bs-toggle="tooltip" title="fa fa-exchange"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-exclamation 
                          </Tooltip>}>
                            <i className="fa fa-exclamation" data-bs-toggle="tooltip" title="fa fa-exclamation"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-exclamation-circle
                          </Tooltip>}>
                            <i className="fa fa-exclamation-circle" data-bs-toggle="tooltip" title="fa fa-exclamation-circle"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-exclamation-triangle" data-bs-toggle="tooltip" title="fa fa-exclamation-triangle"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-expand
                          </Tooltip>}>
                            <i className="fa fa-expand" data-bs-toggle="tooltip" title="fa fa-expand"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-expeditedssl 
                          </Tooltip>}>
                            <i className="fa fa-expeditedssl" data-bs-toggle="tooltip" title="fa fa-expeditedssl"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-external-lin 
                          </Tooltip>}>
                            <i className="fa fa-external-link" data-bs-toggle="tooltip" title="fa fa-external-link"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-external-link-square" data-bs-toggle="tooltip" title="fa fa-external-link-square"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-eye
                          </Tooltip>}>
                            <i className="fa fa-eye" data-bs-toggle="tooltip" title="fa fa-eye"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-eye-slash
                          </Tooltip>}>
                            <i className="fa fa-eye-slash" data-bs-toggle="tooltip" title="fa fa-eye-slash"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-eyedropper  
                          </Tooltip>}>
                            <i className="fa fa-eyedropper" data-bs-toggle="tooltip" title="fa fa-eyedropper"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
           fa fa-fa
                          </Tooltip>}>
                            <i className="fa fa-fa" data-bs-toggle="tooltip" title="fa fa-fa"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-facebook
                          </Tooltip>}>
                            <i className="fa fa-facebook" data-bs-toggle="tooltip" title="fa fa-facebook"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-facebook-f  
                          </Tooltip>}>
                            <i className="fa fa-facebook-f" data-bs-toggle="tooltip" title="fa fa-facebook-f"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-facebook-official
                          </Tooltip>}>
                            <i className="fa fa-facebook-official" data-bs-toggle="tooltip" title="fa fa-facebook-official"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-facebook-square
                          </Tooltip>}>
                            <i className="fa fa-facebook-square" data-bs-toggle="tooltip" title="fa fa-facebook-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-fast-backwar 
                          </Tooltip>}>
                            <i className="fa fa-fast-backward" data-bs-toggle="tooltip" title="fa fa-fast-backward"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-fast-forward 
                          </Tooltip>}>
                            <i className="fa fa-fast-forward" data-bs-toggle="tooltip" title="fa fa-fast-forward"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-fax
                          </Tooltip>}>
                            <i className="fa fa-fax" data-bs-toggle="tooltip" title="fa fa-fax"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        "fa fa-feed
                          </Tooltip>}>
                            <i className="fa fa-feed" data-bs-toggle="tooltip" title="fa fa-feed"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-female
                          </Tooltip>}>
                            <i className="fa fa-female" data-bs-toggle="tooltip" title="fa fa-female"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-fighter-jet 
                          </Tooltip>}>
                            <i className="fa fa-fighter-jet" data-bs-toggle="tooltip" title="fa fa-fighter-jet"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-file
                          </Tooltip>}>
                            <i className="fa fa-file" data-bs-toggle="tooltip" title="fa fa-file"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-archive 
                          </Tooltip>}>
                            <i className="fa fa-file-archive-o" data-bs-toggle="tooltip" title="fa fa-file-archive-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-audio-o 
                          </Tooltip>}>
                            <i className="fa fa-file-audio-o" data-bs-toggle="tooltip" title="fa fa-file-audio-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-code-o 
                          </Tooltip>}>
                            <i className="fa fa-file-code-o" data-bs-toggle="tooltip" title="fa fa-file-code-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-excel-o 
                          </Tooltip>}>
                            <i className="fa fa-file-excel-o" data-bs-toggle="tooltip" title="fa fa-file-excel-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-image-o 
                          </Tooltip>}>
                            <i className="fa fa-file-image-o" data-bs-toggle="tooltip" title="fa fa-file-image-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-movie-o 
                          </Tooltip>}>
                            <i className="fa fa-file-movie-o" data-bs-toggle="tooltip" title="fa fa-file-movie-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-o
                          </Tooltip>}>
                            <i className="fa fa-file-o" data-bs-toggle="tooltip" title="fa fa-file-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-pdf-o
                          </Tooltip>}>
                            <i className="fa fa-file-pdf-o" data-bs-toggle="tooltip" title="fa fa-file-pdf-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-photo-o 
                          </Tooltip>}>
                            <i className="fa fa-file-photo-o" data-bs-toggle="tooltip" title="fa fa-file-photo-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-picture 
                          </Tooltip>}>
                            <i className="fa fa-file-picture-o" data-bs-toggle="tooltip" title="fa fa-file-picture-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-powerpo 
                          </Tooltip>}>
                            <i className="fa fa-file-powerpoint-o" data-bs-toggle="tooltip" title="fa fa-file-powerpoint-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-sound-o 
                          </Tooltip>}>
                            <i className="fa fa-file-sound-o" data-bs-toggle="tooltip" title="fa fa-file-sound-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-text
                          </Tooltip>}>
                            <i className="fa fa-file-text" data-bs-toggle="tooltip" title="fa fa-file-text"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-text-o 
                          </Tooltip>}>
                            <i className="fa fa-file-text-o" data-bs-toggle="tooltip" title="fa fa-file-text-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-video-o 
                          </Tooltip>}>
                            <i className="fa fa-file-video-o" data-bs-toggle="tooltip" title="fa fa-file-video-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-word-o 
                          </Tooltip>}>
                            <i className="fa fa-file-word-o" data-bs-toggle="tooltip" title="fa fa-file-word-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-file-zip-o
                          </Tooltip>}>
                            <i className="fa fa-file-zip-o" data-bs-toggle="tooltip" title="fa fa-file-zip-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-files-o
                          </Tooltip>}>
                            <i className="fa fa-files-o" data-bs-toggle="tooltip" title="fa fa-files-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-film
                          </Tooltip>}>
                            <i className="fa fa-film" data-bs-toggle="tooltip" title="fa fa-film"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-filter
                          </Tooltip>}>
                            <i className="fa fa-filter" data-bs-toggle="tooltip" title="fa fa-filter"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-fire
                          </Tooltip>}>
                            <i className="fa fa-fire" data-bs-toggle="tooltip" title="fa fa-fire"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-fire-extingu 
                          </Tooltip>}>
                            <i className="fa fa-fire-extinguisher" data-bs-toggle="tooltip" title="fa fa-fire-extinguisher"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-firefox
                          </Tooltip>}>
                            <i className="fa fa-firefox" data-bs-toggle="tooltip" title="fa fa-firefox"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-first-order 
                          </Tooltip>}>
                            <i className="fa fa-first-order" data-bs-toggle="tooltip" title="fa fa-first-order"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-flag
                          </Tooltip>}>
                            <i className="fa fa-flag" data-bs-toggle="tooltip" title="fa fa-flag"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-flag-checker 
                          </Tooltip>}>
                            <i className="fa fa-flag-checkered" data-bs-toggle="tooltip" title="fa fa-flag-checkered"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-flag-o
                          </Tooltip>}>
                            <i className="fa fa-flag-o" data-bs-toggle="tooltip" title="fa fa-flag-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-flash
                          </Tooltip>}>
                            <i className="fa fa-flash" data-bs-toggle="tooltip" title="fa fa-flash"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-flask
                          </Tooltip>}>
                            <i className="fa fa-flask" data-bs-toggle="tooltip" title="fa fa-flask"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-flickr
                          </Tooltip>}>
                            <i className="fa fa-flickr" data-bs-toggle="tooltip" title="fa fa-flickr"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-floppy-o
                          </Tooltip>}>
                            <i className="fa fa-floppy-o" data-bs-toggle="tooltip" title="fa fa-floppy-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-folder
                          </Tooltip>}>
                            <i className="fa fa-folder" data-bs-toggle="tooltip" title="fa fa-folder"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-folder-o
                          </Tooltip>}>
                            <i className="fa fa-folder-o" data-bs-toggle="tooltip" title="fa fa-folder-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-folder-open" 
                          </Tooltip>}>
                            <i className="fa fa-folder-open" data-bs-toggle="tooltip" title="fa fa-folder-open"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-folder-open- 
                          </Tooltip>}>
                            <i className="fa fa-folder-open-o" data-bs-toggle="tooltip" title="fa fa-folder-open-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-font
                          </Tooltip>}>
                            <i className="fa fa-font" data-bs-toggle="tooltip" title="fa fa-font"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-font-awesome 
                          </Tooltip>}>
                            <i className="fa fa-font-awesome" data-bs-toggle="tooltip" title="fa fa-font-awesome"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-fonticons
                          </Tooltip>}>
                            <i className="fa fa-fonticons" data-bs-toggle="tooltip" title="fa fa-fonticons"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-fort-awesome 
                          </Tooltip>}>
                            <i className="fa fa-fort-awesome" data-bs-toggle="tooltip" title="fa fa-fort-awesome"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-forumbee
                          </Tooltip>}>
                            <i className="fa fa-forumbee" data-bs-toggle="tooltip" title="fa fa-forumbee"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-forward
                          </Tooltip>}>
                            <i className="fa fa-forward" data-bs-toggle="tooltip" title="fa fa-forward"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-foursquare 
                          </Tooltip>}>
                            <i className="fa fa-foursquare" data-bs-toggle="tooltip" title="fa fa-foursquare"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-free-code-ca 
                          </Tooltip>}>
                            <i className="fa fa-free-code-camp" data-bs-toggle="tooltip" title="fa fa-free-code-camp"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-frown-o
                          </Tooltip>}>
                            <i className="fa fa-frown-o" data-bs-toggle="tooltip" title="fa fa-frown-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-futbol-o
                          </Tooltip>}>
                            <i className="fa fa-futbol-o" data-bs-toggle="tooltip" title="fa fa-futbol-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-gamepad
                          </Tooltip>}>
                            <i className="fa fa-gamepad" data-bs-toggle="tooltip" title="fa fa-gamepad"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-gavel
                          </Tooltip>}>
                            <i className="fa fa-gavel" data-bs-toggle="tooltip" title="fa fa-gavel"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-gbp
                          </Tooltip>}>
                            <i className="fa fa-gbp" data-bs-toggle="tooltip" title="fa fa-gbp"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
           fa fa-ge
                          </Tooltip>}>
                            <i className="fa fa-ge" data-bs-toggle="tooltip" title="fa fa-ge"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-gear
                          </Tooltip>}>
                            <i className="fa fa-gear" data-bs-toggle="tooltip" title="fa fa-gear"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-gears
                          </Tooltip>}>
                            <i className="fa fa-gears" data-bs-toggle="tooltip" title="fa fa-gears"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-genderless  
                          </Tooltip>}>
                            <i className="fa fa-genderless" data-bs-toggle="tooltip" title="fa fa-genderless"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-get-pocket  
                          </Tooltip>}>
                            <i className="fa fa-get-pocket" data-bs-toggle="tooltip" title="fa fa-get-pocket"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
           fa fa-gg
                          </Tooltip>}>
                            <i className="fa fa-gg" data-bs-toggle="tooltip" title="fa fa-gg"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-gg-circle
                          </Tooltip>}>
                            <i className="fa fa-gg-circle" data-bs-toggle="tooltip" title="fa fa-gg-circle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-gift
                          </Tooltip>}>
                            <i className="fa fa-gift" data-bs-toggle="tooltip" title="fa fa-gift"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-git
                          </Tooltip>}>
                            <i className="fa fa-git" data-bs-toggle="tooltip" title="fa fa-git"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-git-square  
                          </Tooltip>}>
                            <i className="fa fa-git-square" data-bs-toggle="tooltip" title="fa fa-git-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-github
                          </Tooltip>}>
                            <i className="fa fa-github" data-bs-toggle="tooltip" title="fa fa-github"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-github-alt  
                          </Tooltip>}>
                            <i className="fa fa-github-alt" data-bs-toggle="tooltip" title="fa fa-github-alt"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-github-squar 
                          </Tooltip>}>
                            <i className="fa fa-github-square" data-bs-toggle="tooltip" title="fa fa-github-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-gitlab
                          </Tooltip>}>
                            <i className="fa fa-gitlab" data-bs-toggle="tooltip" title="fa fa-gitlab"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-gittip
                          </Tooltip>}>
                            <i className="fa fa-gittip" data-bs-toggle="tooltip" title="fa fa-gittip"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-glass
                          </Tooltip>}>
                            <i className="fa fa-glass" data-bs-toggle="tooltip" title="fa fa-glass"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-glide
                          </Tooltip>}>
                            <i className="fa fa-glide" data-bs-toggle="tooltip" title="fa fa-glide"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-glide-g
                          </Tooltip>}>
                            <i className="fa fa-glide-g" data-bs-toggle="tooltip" title="fa fa-glide-g"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-globe
                          </Tooltip>}>
                            <i className="fa fa-globe" data-bs-toggle="tooltip" title="fa fa-globe"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-google
                          </Tooltip>}>
                            <i className="fa fa-google" data-bs-toggle="tooltip" title="fa fa-google"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-google-plus 
                          </Tooltip>}>
                            <i className="fa fa-google-plus" data-bs-toggle="tooltip" title="fa fa-google-plus"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-google-plus-circle 
                          </Tooltip>}>
                            <i className="fa fa-google-plus-circle" data-bs-toggle="tooltip" title="fa fa-google-plus-circle"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-google-plus-official" data-bs-toggle="tooltip" title="fa fa-google-plus-official"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-google-plus-square 
                          </Tooltip>}>
                            <i className="fa fa-google-plus-square" data-bs-toggle="tooltip" title="fa fa-google-plus-square"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-google-walle 
                          </Tooltip>}>
                            <i className="fa fa-google-wallet" data-bs-toggle="tooltip" title="fa fa-google-wallet"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-graduation-cap
                          </Tooltip>}>
                            <i className="fa fa-graduation-cap" data-bs-toggle="tooltip" title="fa fa-graduation-cap"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-gratipay
                          </Tooltip>}>
                            <i className="fa fa-gratipay" data-bs-toggle="tooltip" title="fa fa-gratipay"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-grav
                          </Tooltip>}>
                            <i className="fa fa-grav" data-bs-toggle="tooltip" title="fa fa-grav"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-group
                          </Tooltip>}>
                            <i className="fa fa-group" data-bs-toggle="tooltip" title="fa fa-group"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-h-square
                          </Tooltip>}>
                            <i className="fa fa-h-square" data-bs-toggle="tooltip" title="fa fa-h-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hacker-news 
                          </Tooltip>}>
                            <i className="fa fa-hacker-news" data-bs-toggle="tooltip" title="fa fa-hacker-news"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-grab-o 
                          </Tooltip>}>
                            <i className="fa fa-hand-grab-o" data-bs-toggle="tooltip" title="fa fa-hand-grab-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-lizard-o 
                          </Tooltip>}>
                            <i className="fa fa-hand-lizard-o" data-bs-toggle="tooltip" title="fa fa-hand-lizard-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-o-down 
                          </Tooltip>}>
                            <i className="fa fa-hand-o-down" data-bs-toggle="tooltip" title="fa fa-hand-o-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-o-left
                          </Tooltip>}>
                            <i className="fa fa-hand-o-left" data-bs-toggle="tooltip" title="fa fa-hand-o-left"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-o-right 
                          </Tooltip>}>
                            <i className="fa fa-hand-o-right" data-bs-toggle="tooltip" title="fa fa-hand-o-right"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-o-up
                          </Tooltip>}>
                            <i className="fa fa-hand-o-up" data-bs-toggle="tooltip" title="fa fa-hand-o-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-paper-o 
                          </Tooltip>}>
                            <i className="fa fa-hand-paper-o" data-bs-toggle="tooltip" title="fa fa-hand-paper-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-peace-o 
                          </Tooltip>}>
                            <i className="fa fa-hand-peace-o" data-bs-toggle="tooltip" title="fa fa-hand-peace-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-pointer 
                          </Tooltip>}>
                            <i className="fa fa-hand-pointer-o" data-bs-toggle="tooltip" title="fa fa-hand-pointer-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-rock-o 
                          </Tooltip>}>
                            <i className="fa fa-hand-rock-o" data-bs-toggle="tooltip" title="fa fa-hand-rock-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-scissor 
                          </Tooltip>}>
                            <i className="fa fa-hand-scissors-o" data-bs-toggle="tooltip" title="fa fa-hand-scissors-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-spock-o 
                          </Tooltip>}>
                            <i className="fa fa-hand-spock-o" data-bs-toggle="tooltip" title="fa fa-hand-spock-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hand-stop-o 
                          </Tooltip>}>
                            <i className="fa fa-hand-stop-o" data-bs-toggle="tooltip" title="fa fa-hand-stop-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-handshake-o 
                          </Tooltip>}>
                            <i className="fa fa-handshake-o" data-bs-toggle="tooltip" title="fa fa-handshake-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hard-of-hear 
                          </Tooltip>}>
                            <i className="fa fa-hard-of-hearing" data-bs-toggle="tooltip" title="fa fa-hard-of-hearing"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hashtag
                          </Tooltip>}>
                            <i className="fa fa-hashtag" data-bs-toggle="tooltip" title="fa fa-hashtag"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hdd-o
                          </Tooltip>}>
                            <i className="fa fa-hdd-o" data-bs-toggle="tooltip" title="fa fa-hdd-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-header
                          </Tooltip>}>
                            <i className="fa fa-header" data-bs-toggle="tooltip" title="fa fa-header"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-headphones  
                          </Tooltip>}>
                            <i className="fa fa-headphones" data-bs-toggle="tooltip" title="fa fa-headphones"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-heart
                          </Tooltip>}>
                            <i className="fa fa-heart" data-bs-toggle="tooltip" title="fa fa-heart"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-heart-o
                          </Tooltip>}>
                            <i className="fa fa-heart-o" data-bs-toggle="tooltip" title="fa fa-heart-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-heartbeat
                          </Tooltip>}>
                            <i className="fa fa-heartbeat" data-bs-toggle="tooltip" title="fa fa-heartbeat"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-history
                          </Tooltip>}>
                            <i className="fa fa-history" data-bs-toggle="tooltip" title="fa fa-history"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-home
                          </Tooltip>}>
                            <i className="fa fa-home" data-bs-toggle="tooltip" title="fa fa-home"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hospital-o
                          </Tooltip>}>
                            <i className="fa fa-hospital-o" data-bs-toggle="tooltip" title="fa fa-hospital-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hotel
                          </Tooltip>}>
                            <i className="fa fa-hotel" data-bs-toggle="tooltip" title="fa fa-hotel"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hourglass
                          </Tooltip>}>
                            <i className="fa fa-hourglass" data-bs-toggle="tooltip" title="fa fa-hourglass"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hourglass-1 
                          </Tooltip>}>
                            <i className="fa fa-hourglass-1" data-bs-toggle="tooltip" title="fa fa-hourglass-1"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hourglass-2 
                          </Tooltip>}>
                            <i className="fa fa-hourglass-2" data-bs-toggle="tooltip" title="fa fa-hourglass-2"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hourglass-3 
                          </Tooltip>}>
                            <i className="fa fa-hourglass-3" data-bs-toggle="tooltip" title="fa fa-hourglass-3"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hourglass-en 
                          </Tooltip>}>
                            <i className="fa fa-hourglass-end" data-bs-toggle="tooltip" title="fa fa-hourglass-right"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hourglass-ha 
                          </Tooltip>}>
                            <i className="fa fa-hourglass-half" data-bs-toggle="tooltip" title="fa fa-hourglass-half"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hourglass-o
                          </Tooltip>}>
                            <i className="fa fa-hourglass-o" data-bs-toggle="tooltip" title="fa fa-hourglass-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-hourglass-start 
                          </Tooltip>}>
                            <i className="fa fa-hourglass-start" data-bs-toggle="tooltip" title="fa fa-hourglass-left"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-houzz
                          </Tooltip>}>
                            <i className="fa fa-houzz" data-bs-toggle="tooltip" title="fa fa-houzz"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-html5
                          </Tooltip>}>
                            <i className="fa fa-html5" data-bs-toggle="tooltip" title="fa fa-html5"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-i-cursor
                          </Tooltip>}>
                            <i className="fa fa-i-cursor" data-bs-toggle="tooltip" title="fa fa-i-cursor"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-id-badge
                          </Tooltip>}>
                            <i className="fa fa-id-badge" data-bs-toggle="tooltip" title="fa fa-id-badge"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-id-card
                          </Tooltip>}>
                            <i className="fa fa-id-card" data-bs-toggle="tooltip" title="fa fa-id-card"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-id-card-o
                          </Tooltip>}>
                            <i className="fa fa-id-card-o" data-bs-toggle="tooltip" title="fa fa-id-card-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-ils
                          </Tooltip>}>
                            <i className="fa fa-ils" data-bs-toggle="tooltip" title="fa fa-ils"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-image
                          </Tooltip>}>
                            <i className="fa fa-image" data-bs-toggle="tooltip" title="fa fa-image"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-imdb
                          </Tooltip>}>
                            <i className="fa fa-imdb" data-bs-toggle="tooltip" title="fa fa-imdb"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-inbox
                          </Tooltip>}>
                            <i className="fa fa-inbox" data-bs-toggle="tooltip" title="fa fa-inbox"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-indent
                          </Tooltip>}>
                            <i className="fa fa-indent" data-bs-toggle="tooltip" title="fa fa-indent"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-industry
                          </Tooltip>}>
                            <i className="fa fa-industry" data-bs-toggle="tooltip" title="fa fa-industry"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-info
                          </Tooltip>}>
                            <i className="fa fa-info" data-bs-toggle="tooltip" title="fa fa-info"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-info-circle 
                          </Tooltip>}>
                            <i className="fa fa-info-circle" data-bs-toggle="tooltip" title="fa fa-info-circle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-inr
                          </Tooltip>}>
                            <i className="fa fa-inr" data-bs-toggle="tooltip" title="fa fa-inr"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-instagram
                          </Tooltip>}>
                            <i className="fa fa-instagram" data-bs-toggle="tooltip" title="fa fa-instagram"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-institution 
                          </Tooltip>}>
                            <i className="fa fa-institution" data-bs-toggle="tooltip" title="fa fa-institution"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-internet-exp 
                          </Tooltip>}>
                            <i className="fa fa-internet-explorer" data-bs-toggle="tooltip" title="fa fa-internet-explorer"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-intersex
                          </Tooltip>}>
                            <i className="fa fa-intersex" data-bs-toggle="tooltip" title="fa fa-intersex"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-ioxhost
                          </Tooltip>}>
                            <i className="fa fa-ioxhost" data-bs-toggle="tooltip" title="fa fa-ioxhost"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-italic
                          </Tooltip>}>
                            <i className="fa fa-italic" data-bs-toggle="tooltip" title="fa fa-italic"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-joomla
                          </Tooltip>}>
                            <i className="fa fa-joomla" data-bs-toggle="tooltip" title="fa fa-joomla"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-jpy
                          </Tooltip>}>
                            <i className="fa fa-jpy" data-bs-toggle="tooltip" title="fa fa-jpy"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-jsfiddle
                          </Tooltip>}>
                            <i className="fa fa-jsfiddle" data-bs-toggle="tooltip" title="fa fa-jsfiddle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-key
                          </Tooltip>}>
                            <i className="fa fa-key" data-bs-toggle="tooltip" title="fa fa-key"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-keyboard-o
                          </Tooltip>}>
                            <i className="fa fa-keyboard-o" data-bs-toggle="tooltip" title="fa fa-keyboard-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-krw
                          </Tooltip>}>
                            <i className="fa fa-krw" data-bs-toggle="tooltip" title="fa fa-krw"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-language
                          </Tooltip>}>
                            <i className="fa fa-language" data-bs-toggle="tooltip" title="fa fa-language"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-laptop
                          </Tooltip>}>
                            <i className="fa fa-laptop" data-bs-toggle="tooltip" title="fa fa-laptop"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-lastfm
                          </Tooltip>}>
                            <i className="fa fa-lastfm" data-bs-toggle="tooltip" title="fa fa-lastfm"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-lastfm-squar 
                          </Tooltip>}>
                            <i className="fa fa-lastfm-square" data-bs-toggle="tooltip" title="fa fa-lastfm-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-leaf
                          </Tooltip>}>
                            <i className="fa fa-leaf" data-bs-toggle="tooltip" title="fa fa-leaf"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-leanpub
                          </Tooltip>}>
                            <i className="fa fa-leanpub" data-bs-toggle="tooltip" title="fa fa-leanpub"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-legal
                          </Tooltip>}>
                            <i className="fa fa-legal" data-bs-toggle="tooltip" title="fa fa-legal"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-lemon-o
                          </Tooltip>}>
                            <i className="fa fa-lemon-o" data-bs-toggle="tooltip" title="fa fa-lemon-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-level-down
                          </Tooltip>}>
                            <i className="fa fa-level-down" data-bs-toggle="tooltip" title="fa fa-level-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-level-up
                          </Tooltip>}>
                            <i className="fa fa-level-up" data-bs-toggle="tooltip" title="fa fa-level-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-life-bouy
                          </Tooltip>}>
                            <i className="fa fa-life-bouy" data-bs-toggle="tooltip" title="fa fa-life-bouy"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-life-buoy
                          </Tooltip>}>
                            <i className="fa fa-life-buoy" data-bs-toggle="tooltip" title="fa fa-life-buoy"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-life-ring
                          </Tooltip>}>
                            <i className="fa fa-life-ring" data-bs-toggle="tooltip" title="fa fa-life-ring"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-life-saver  
                          </Tooltip>}>
                            <i className="fa fa-life-saver" data-bs-toggle="tooltip" title="fa fa-life-saver"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-lightbulb-o 
                          </Tooltip>}>
                            <i className="fa fa-lightbulb-o" data-bs-toggle="tooltip" title="fa fa-lightbulb-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-line-chart  
                          </Tooltip>}>
                            <i className="fa fa-line-chart" data-bs-toggle="tooltip" title="fa fa-line-chart"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-link
                          </Tooltip>}>
                            <i className="fa fa-link" data-bs-toggle="tooltip" title="fa fa-link"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-linkedin
                          </Tooltip>}>
                            <i className="fa fa-linkedin" data-bs-toggle="tooltip" title="fa fa-linkedin"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-linkedin-squ 
                          </Tooltip>}>
                            <i className="fa fa-linkedin-square" data-bs-toggle="tooltip" title="fa fa-linkedin-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-linode
                          </Tooltip>}>
                            <i className="fa fa-linode" data-bs-toggle="tooltip" title="fa fa-linode"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-linux
                          </Tooltip>}>
                            <i className="fa fa-linux" data-bs-toggle="tooltip" title="fa fa-linux"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-list
                          </Tooltip>}>
                            <i className="fa fa-list" data-bs-toggle="tooltip" title="fa fa-list"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-list-alt
                          </Tooltip>}>
                            <i className="fa fa-list-alt" data-bs-toggle="tooltip" title="fa fa-list-alt"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-list-ol
                          </Tooltip>}>
                            <i className="fa fa-list-ol" data-bs-toggle="tooltip" title="fa fa-list-ol"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-list-ul
                          </Tooltip>}>
                            <i className="fa fa-list-ul" data-bs-toggle="tooltip" title="fa fa-list-ul"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-location-arr 
                          </Tooltip>}>
                            <i className="fa fa-location-arrow" data-bs-toggle="tooltip" title="fa fa-location-arrow"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-lock
                          </Tooltip>}>
                            <i className="fa fa-lock" data-bs-toggle="tooltip" title="fa fa-lock"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-long-arrow-d 
                          </Tooltip>}>
                            <i className="fa fa-long-arrow-down" data-bs-toggle="tooltip" title="fa fa-long-arrow-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-long-arrow-l 
                          </Tooltip>}>
                            <i className="fa fa-long-arrow-left" data-bs-toggle="tooltip" title="fa fa-long-arrow-left"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-long-arrow-r 
                          </Tooltip>}>
                            <i className="fa fa-long-arrow-right" data-bs-toggle="tooltip" title="fa fa-long-arrow-right"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-long-arrow-u 
                          </Tooltip>}>
                            <i className="fa fa-long-arrow-up" data-bs-toggle="tooltip" title="fa fa-long-arrow-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-low-vision 
                          </Tooltip>}>
                            <i className="fa fa-low-vision" data-bs-toggle="tooltip" title="fa fa-low-vision"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-magic
                          </Tooltip>}>
                            <i className="fa fa-magic" data-bs-toggle="tooltip" title="fa fa-magic"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-magnet
                          </Tooltip>}>
                            <i className="fa fa-magnet" data-bs-toggle="tooltip" title="fa fa-magnet"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mail-forward 
                          </Tooltip>}>
                            <i className="fa fa-mail-forward" data-bs-toggle="tooltip" title="fa fa-mail-forward"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mail-reply  
                          </Tooltip>}>
                            <i className="fa fa-mail-reply" data-bs-toggle="tooltip" title="fa fa-mail-reply"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mail-reply-a 
                          </Tooltip>}>
                            <i className="fa fa-mail-reply-all" data-bs-toggle="tooltip" title="fa fa-mail-reply-all"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-male
                          </Tooltip>}>
                            <i className="fa fa-male" data-bs-toggle="tooltip" title="fa fa-male"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-map
                          </Tooltip>}>
                            <i className="fa fa-map" data-bs-toggle="tooltip" title="fa fa-map"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-map-marker  
                          </Tooltip>}>
                            <i className="fa fa-map-marker" data-bs-toggle="tooltip" title="fa fa-map-marker"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-map-o
                          </Tooltip>}>
                            <i className="fa fa-map-o" data-bs-toggle="tooltip" title="fa fa-map-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-map-pin
                          </Tooltip>}>
                            <i className="fa fa-map-pin" data-bs-toggle="tooltip" title="fa fa-map-pin"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-map-signs
                          </Tooltip>}>
                            <i className="fa fa-map-signs" data-bs-toggle="tooltip" title="fa fa-map-signs"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-mars
                          </Tooltip>}>
                            <i className="fa fa-mars" data-bs-toggle="tooltip" title="fa fa-mars"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mars-double 
                          </Tooltip>}>
                            <i className="fa fa-mars-double" data-bs-toggle="tooltip" title="fa fa-mars-double"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mars-stroke 
                          </Tooltip>}>
                            <i className="fa fa-mars-stroke" data-bs-toggle="tooltip" title="fa fa-mars-stroke"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mars-stroke-h 
                          </Tooltip>}>
                            <i className="fa fa-mars-stroke-h" data-bs-toggle="tooltip" title="fa fa-mars-stroke-h"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mars-stroke-v
                          </Tooltip>}>
                            <i className="fa fa-mars-stroke-v" data-bs-toggle="tooltip" title="fa fa-mars-stroke-v"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-maxcdn
                          </Tooltip>}>
                            <i className="fa fa-maxcdn" data-bs-toggle="tooltip" title="fa fa-maxcdn"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-meanpath
                          </Tooltip>}>
                            <i className="fa fa-meanpath" data-bs-toggle="tooltip" title="fa fa-meanpath"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-medium
                          </Tooltip>}>
                            <i className="fa fa-medium" data-bs-toggle="tooltip" title="fa fa-medium"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-medkit
                          </Tooltip>}>
                            <i className="fa fa-medkit" data-bs-toggle="tooltip" title="fa fa-medkit"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-meetup
                          </Tooltip>}>
                            <i className="fa fa-meetup" data-bs-toggle="tooltip" title="fa fa-meetup"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-meh-o
                          </Tooltip>}>
                            <i className="fa fa-meh-o" data-bs-toggle="tooltip" title="fa fa-meh-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mercury
                          </Tooltip>}>
                            <i className="fa fa-mercury" data-bs-toggle="tooltip" title="fa fa-mercury"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-microchip
                          </Tooltip>}>
                            <i className="fa fa-microchip" data-bs-toggle="tooltip" title="fa fa-microchip"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-microphone  
                          </Tooltip>}>
                            <i className="fa fa-microphone" data-bs-toggle="tooltip" title="fa fa-microphone"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-microphone-s 
                          </Tooltip>}>
                            <i className="fa fa-microphone-slash" data-bs-toggle="tooltip" title="fa fa-microphone-slash"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-minus
                          </Tooltip>}>
                            <i className="fa fa-minus" data-bs-toggle="tooltip" title="fa fa-minus"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-minus-circle 
                          </Tooltip>}>
                            <i className="fa fa-minus-circle" data-bs-toggle="tooltip" title="fa fa-minus-circle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-minus-square 
                          </Tooltip>}>
                            <i className="fa fa-minus-square" data-bs-toggle="tooltip" title="fa fa-minus-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-minus-square 
                          </Tooltip>}>
                            <i className="fa fa-minus-square-o" data-bs-toggle="tooltip" title="fa fa-minus-square-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mixcloud
                          </Tooltip>}>
                            <i className="fa fa-mixcloud" data-bs-toggle="tooltip" title="fa fa-mixcloud"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mobile
                          </Tooltip>}>
                            <i className="fa fa-mobile" data-bs-toggle="tooltip" title="fa fa-mobile"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mobile-phone 
                          </Tooltip>}>
                            <i className="fa fa-mobile-phone" data-bs-toggle="tooltip" title="fa fa-mobile-phone"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-modx
                          </Tooltip>}>
                            <i className="fa fa-modx" data-bs-toggle="tooltip" title="fa fa-modx"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-money
                          </Tooltip>}>
                            <i className="fa fa-money" data-bs-toggle="tooltip" title="fa fa-money"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-moon-o
                          </Tooltip>}>
                            <i className="fa fa-moon-o" data-bs-toggle="tooltip" title="fa fa-moon-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mortar-board 
                          </Tooltip>}>
                            <i className="fa fa-mortar-board" data-bs-toggle="tooltip" title="fa fa-mortar-board"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-motorcycle  
                          </Tooltip>}>
                            <i className="fa fa-motorcycle" data-bs-toggle="tooltip" title="fa fa-motorcycle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-mouse-pointe 
                          </Tooltip>}>
                            <i className="fa fa-mouse-pointer" data-bs-toggle="tooltip" title="fa fa-mouse-pointer"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-music
                          </Tooltip>}>
                            <i className="fa fa-music" data-bs-toggle="tooltip" title="fa fa-music"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-navicon
                          </Tooltip>}>
                            <i className="fa fa-navicon" data-bs-toggle="tooltip" title="fa fa-navicon"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-neuter
                          </Tooltip>}>
                            <i className="fa fa-neuter" data-bs-toggle="tooltip" title="fa fa-neuter"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-newspaper-o 
                          </Tooltip>}>
                            <i className="fa fa-newspaper-o" data-bs-toggle="tooltip" title="fa fa-newspaper-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-object-group 
                          </Tooltip>}>
                            <i className="fa fa-object-group" data-bs-toggle="tooltip" title="fa fa-object-group"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-object-ungro 
                          </Tooltip>}>
                            <i className="fa fa-object-ungroup" data-bs-toggle="tooltip" title="fa fa-object-ungroup"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-odnoklassnik 
                          </Tooltip>}>
                            <i className="fa fa-odnoklassniki" data-bs-toggle="tooltip" title="fa fa-odnoklassniki"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-odnoklassniki-square" data-bs-toggle="tooltip" title="fa fa-odnoklassniki-square"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-opencart
                          </Tooltip>}>
                            <i className="fa fa-opencart" data-bs-toggle="tooltip" title="fa fa-opencart"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-openid
                          </Tooltip>}>
                            <i className="fa fa-openid" data-bs-toggle="tooltip" title="fa fa-openid"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-opera
                          </Tooltip>}>
                            <i className="fa fa-opera" data-bs-toggle="tooltip" title="fa fa-opera"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-optin-monste 
                          </Tooltip>}>
                            <i className="fa fa-optin-monster" data-bs-toggle="tooltip" title="fa fa-optin-monster"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-outdent
                          </Tooltip>}>
                            <i className="fa fa-outdent" data-bs-toggle="tooltip" title="fa fa-outdent"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pagelines
                          </Tooltip>}>
                            <i className="fa fa-pagelines" data-bs-toggle="tooltip" title="fa fa-pagelines"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-paint-brush 
                          </Tooltip>}>
                            <i className="fa fa-paint-brush" data-bs-toggle="tooltip" title="fa fa-paint-brush"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-paper-plane 
                          </Tooltip>}>
                            <i className="fa fa-paper-plane" data-bs-toggle="tooltip" title="fa fa-paper-plane"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-paper-plane-o 
                          </Tooltip>}>
                            <i className="fa fa-paper-plane-o" data-bs-toggle="tooltip" title="fa fa-paper-plane-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-paperclip
                          </Tooltip>}>
                            <i className="fa fa-paperclip" data-bs-toggle="tooltip" title="fa fa-paperclip"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-paragraph
                          </Tooltip>}>
                            <i className="fa fa-paragraph" data-bs-toggle="tooltip" title="fa fa-paragraph"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-paste
                          </Tooltip>}>
                            <i className="fa fa-paste" data-bs-toggle="tooltip" title="fa fa-paste"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pause
                          </Tooltip>}>
                            <i className="fa fa-pause" data-bs-toggle="tooltip" title="fa fa-pause"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pause-circle 
                          </Tooltip>}>
                            <i className="fa fa-pause-circle" data-bs-toggle="tooltip" title="fa fa-pause-circle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pause-circle 
                          </Tooltip>}>
                            <i className="fa fa-pause-circle-o" data-bs-toggle="tooltip" title="fa fa-pause-circle-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-paw
                          </Tooltip>}>
                            <i className="fa fa-paw" data-bs-toggle="tooltip" title="fa fa-paw"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-paypal
                          </Tooltip>}>
                            <i className="fa fa-paypal" data-bs-toggle="tooltip" title="fa fa-paypal"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pencil
                          </Tooltip>}>
                            <i className="fa fa-pencil" data-bs-toggle="tooltip" title="fa fa-pencil"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pencil-squar 
                          </Tooltip>}>
                            <i className="fa fa-pencil-square" data-bs-toggle="tooltip" title="fa fa-pencil-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pencil-squar 
                          </Tooltip>}>
                            <i className="fa fa-pencil-square-o" data-bs-toggle="tooltip" title="fa fa-pencil-square-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-percent
                          </Tooltip>}>
                            <i className="fa fa-percent" data-bs-toggle="tooltip" title="fa fa-percent"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-phone
                          </Tooltip>}>
                            <i className="fa fa-phone" data-bs-toggle="tooltip" title="fa fa-phone"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-phone-square 
                          </Tooltip>}>
                            <i className="fa fa-phone-square" data-bs-toggle="tooltip" title="fa fa-phone-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-photo
                          </Tooltip>}>
                            <i className="fa fa-photo" data-bs-toggle="tooltip" title="fa fa-photo"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-picture-o
                          </Tooltip>}>
                            <i className="fa fa-picture-o" data-bs-toggle="tooltip" title="fa fa-picture-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pie-chart
                          </Tooltip>}>
                            <i className="fa fa-pie-chart" data-bs-toggle="tooltip" title="fa fa-pie-chart"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pied-piper"  
                          </Tooltip>}>
                            <i className="fa fa-pied-piper" data-bs-toggle="tooltip" title="fa fa-pied-piper"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pied-piper-a 
                          </Tooltip>}>
                            <i className="fa fa-pied-piper-alt" data-bs-toggle="tooltip" title="fa fa-pied-piper-alt"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pied-piper-p 
                          </Tooltip>}>
                            <i className="fa fa-pied-piper-pp" data-bs-toggle="tooltip" title="fa fa-pied-piper-pp"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pinterest
                          </Tooltip>}>
                            <i className="fa fa-pinterest" data-bs-toggle="tooltip" title="fa fa-pinterest"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pinterest-p 
                          </Tooltip>}>
                            <i className="fa fa-pinterest-p" data-bs-toggle="tooltip" title="fa fa-pinterest-p"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-pinterest-square
                          </Tooltip>}>
                            <i className="fa fa-pinterest-square" data-bs-toggle="tooltip" title="fa fa-pinterest-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-plane
                          </Tooltip>}>
                            <i className="fa fa-plane" data-bs-toggle="tooltip" title="fa fa-plane"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-play
                          </Tooltip>}>
                            <i className="fa fa-play" data-bs-toggle="tooltip" title="fa fa-play"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-play-circle 
                          </Tooltip>}>
                            <i className="fa fa-play-circle" data-bs-toggle="tooltip" title="fa fa-play-circle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-play-circle-o 
                          </Tooltip>}>
                            <i className="fa fa-play-circle-o" data-bs-toggle="tooltip" title="fa fa-play-circle-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-plug
                          </Tooltip>}>
                            <i className="fa fa-plug" data-bs-toggle="tooltip" title="fa fa-plug"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-plus
                          </Tooltip>}>
                            <i className="fa fa-plus" data-bs-toggle="tooltip" title="fa fa-plus"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-plus-circle 
                          </Tooltip>}>
                            <i className="fa fa-plus-circle" data-bs-toggle="tooltip" title="fa fa-plus-circle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-plus-square 
                          </Tooltip>}>
                            <i className="fa fa-plus-square" data-bs-toggle="tooltip" title="fa fa-plus-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-plus-square-o 
                          </Tooltip>}>
                            <i className="fa fa-plus-square-o" data-bs-toggle="tooltip" title="fa fa-plus-square-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-podcast
                          </Tooltip>}>
                            <i className="fa fa-podcast" data-bs-toggle="tooltip" title="fa fa-podcast"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-power-off
                          </Tooltip>}>
                            <i className="fa fa-power-off" data-bs-toggle="tooltip" title="fa fa-power-off"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-print
                          </Tooltip>}>
                            <i className="fa fa-print" data-bs-toggle="tooltip" title="fa fa-print"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-product-hunt 
                          </Tooltip>}>
                            <i className="fa fa-product-hunt" data-bs-toggle="tooltip" title="fa fa-product-hunt"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-puzzle-piece 
                          </Tooltip>}>
                            <i className="fa fa-puzzle-piece" data-bs-toggle="tooltip" title="fa fa-puzzle-piece"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
           fa fa-qq
                          </Tooltip>}>
                            <i className="fa fa-qq" data-bs-toggle="tooltip" title="fa fa-qq"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-qrcode
                          </Tooltip>}>
                            <i className="fa fa-qrcode" data-bs-toggle="tooltip" title="fa fa-qrcode"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-question
                          </Tooltip>}>
                            <i className="fa fa-question" data-bs-toggle="tooltip" title="fa fa-question"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-question-cir 
                          </Tooltip>}>
                            <i className="fa fa-question-circle" data-bs-toggle="tooltip" title="fa fa-question-circle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-question-cir 
                          </Tooltip>}>
                            <i className="fa fa-question-circle-o" data-bs-toggle="tooltip" title="fa fa-question-circle-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-quora
                          </Tooltip>}>
                            <i className="fa fa-quora" data-bs-toggle="tooltip" title="fa fa-quora"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-quote-left
                          </Tooltip>}>
                            <i className="fa fa-quote-left" data-bs-toggle="tooltip" title="fa fa-quote-left"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-quote-right 
                          </Tooltip>}>
                            <i className="fa fa-quote-right" data-bs-toggle="tooltip" title="fa fa-quote-right"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
           fa fa-ra
                          </Tooltip>}>
                            <i className="fa fa-ra" data-bs-toggle="tooltip" title="fa fa-ra"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-random
                          </Tooltip>}>
                            <i className="fa fa-random" data-bs-toggle="tooltip" title="fa fa-random"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-ravelry
                          </Tooltip>}>
                            <i className="fa fa-ravelry" data-bs-toggle="tooltip" title="fa fa-ravelry"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-rebel
                          </Tooltip>}>
                            <i className="fa fa-rebel" data-bs-toggle="tooltip" title="fa fa-rebel"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-recycle
                          </Tooltip>}>
                            <i className="fa fa-recycle" data-bs-toggle="tooltip" title="fa fa-recycle"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-reddit
                          </Tooltip>}>
                            <i className="fa fa-reddit" data-bs-toggle="tooltip" title="fa fa-reddit"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-reddit-alien 
                          </Tooltip>}>
                            <i className="fa fa-reddit-alien" data-bs-toggle="tooltip" title="fa fa-reddit-alien"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-reddit-squar 
                          </Tooltip>}>
                            <i className="fa fa-reddit-square" data-bs-toggle="tooltip" title="fa fa-reddit-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-refresh
                          </Tooltip>}>
                            <i className="fa fa-refresh" data-bs-toggle="tooltip" title="fa fa-refresh"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-registered  
                          </Tooltip>}>
                            <i className="fa fa-registered" data-bs-toggle="tooltip" title="fa fa-registered"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-remove
                          </Tooltip>}>
                            <i className="fa fa-remove" data-bs-toggle="tooltip" title="fa fa-remove"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-renren
                          </Tooltip>}>
                            <i className="fa fa-renren" data-bs-toggle="tooltip" title="fa fa-renren"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-reorder
                          </Tooltip>}>
                            <i className="fa fa-reorder" data-bs-toggle="tooltip" title="fa fa-reorder"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-repeat
                          </Tooltip>}>
                            <i className="fa fa-repeat" data-bs-toggle="tooltip" title="fa fa-repeat"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-reply
                          </Tooltip>}>
                            <i className="fa fa-reply" data-bs-toggle="tooltip" title="fa fa-reply"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-reply-all
                          </Tooltip>}>
                            <i className="fa fa-reply-all" data-bs-toggle="tooltip" title="fa fa-reply-all"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-resistance  
                          </Tooltip>}>
                            <i className="fa fa-resistance" data-bs-toggle="tooltip" title="fa fa-resistance"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-retweet
                          </Tooltip>}>
                            <i className="fa fa-retweet" data-bs-toggle="tooltip" title="fa fa-retweet"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-rmb
                          </Tooltip>}>
                            <i className="fa fa-rmb" data-bs-toggle="tooltip" title="fa fa-rmb"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        "fa fa-road
                          </Tooltip>}>
                            <i className="fa fa-road" data-bs-toggle="tooltip" title="fa fa-road"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-rocket
                          </Tooltip>}>
                            <i className="fa fa-rocket" data-bs-toggle="tooltip" title="fa fa-rocket"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-rotate-left 
                          </Tooltip>}>
                            <i className="fa fa-rotate-left" data-bs-toggle="tooltip" title="fa fa-rotate-left"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-rotate-right 
                          </Tooltip>}>
                            <i className="fa fa-rotate-right" data-bs-toggle="tooltip" title="fa fa-rotate-right"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-rouble
                          </Tooltip>}>
                            <i className="fa fa-rouble" data-bs-toggle="tooltip" title="fa fa-rouble"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-rss
                          </Tooltip>}>
                            <i className="fa fa-rss" data-bs-toggle="tooltip" title="fa fa-rss"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-rss-square  
                          </Tooltip>}>
                            <i className="fa fa-rss-square" data-bs-toggle="tooltip" title="fa fa-rss-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-rub
                          </Tooltip>}>
                            <i className="fa fa-rub" data-bs-toggle="tooltip" title="fa fa-rub"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-ruble
                          </Tooltip>}>
                            <i className="fa fa-ruble" data-bs-toggle="tooltip" title="fa fa-ruble"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-rupee
                          </Tooltip>}>
                            <i className="fa fa-rupee" data-bs-toggle="tooltip" title="fa fa-rupee"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-s15
                          </Tooltip>}>
                            <i className="fa fa-s15" data-bs-toggle="tooltip" title="fa fa-s15"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-safari
                          </Tooltip>}>
                            <i className="fa fa-safari" data-bs-toggle="tooltip" title="fa fa-safari"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-save
                          </Tooltip>}>
                            <i className="fa fa-save" data-bs-toggle="tooltip" title="fa fa-save"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-scissors
                          </Tooltip>}>
                            <i className="fa fa-scissors" data-bs-toggle="tooltip" title="fa fa-scissors"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-scribd
                          </Tooltip>}>
                            <i className="fa fa-scribd" data-bs-toggle="tooltip" title="fa fa-scribd"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-search
                          </Tooltip>}>
                            <i className="fa fa-search" data-bs-toggle="tooltip" title="fa fa-search"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-search-minus 
                          </Tooltip>}>
                            <i className="fa fa-search-minus" data-bs-toggle="tooltip" title="fa fa-search-minus"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-search-plus 
                          </Tooltip>}>
                            <i className="fa fa-search-plus" data-bs-toggle="tooltip" title="fa fa-search-plus"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sellsy
                          </Tooltip>}>
                            <i className="fa fa-sellsy" data-bs-toggle="tooltip" title="fa fa-sellsy"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-send
                          </Tooltip>}>
                            <i className="fa fa-send" data-bs-toggle="tooltip" title="fa fa-send"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-send-o
                          </Tooltip>}>
                            <i className="fa fa-send-o" data-bs-toggle="tooltip" title="fa fa-send-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-server
                          </Tooltip>}>
                            <i className="fa fa-server" data-bs-toggle="tooltip" title="fa fa-server"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-share
                          </Tooltip>}>
                            <i className="fa fa-share" data-bs-toggle="tooltip" title="fa fa-share"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-share-alt
                          </Tooltip>}>
                            <i className="fa fa-share-alt" data-bs-toggle="tooltip" title="fa fa-share-alt"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-share-alt-square 
                          </Tooltip>}>
                            <i className="fa fa-share-alt-square" data-bs-toggle="tooltip" title="fa fa-share-alt-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-share-square 
                          </Tooltip>}>
                            <i className="fa fa-share-square" data-bs-toggle="tooltip" title="fa fa-share-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-share-square 
                          </Tooltip>}>
                            <i className="fa fa-share-square-o" data-bs-toggle="tooltip" title="fa fa-share-square-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-shekel
                          </Tooltip>}>
                            <i className="fa fa-shekel" data-bs-toggle="tooltip" title="fa fa-shekel"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sheqel
                          </Tooltip>}>
                            <i className="fa fa-sheqel" data-bs-toggle="tooltip" title="fa fa-sheqel"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-shield
                          </Tooltip>}>
                            <i className="fa fa-shield" data-bs-toggle="tooltip" title="fa fa-shield"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        "fa fa-ship
                          </Tooltip>}>
                            <i className="fa fa-ship" data-bs-toggle="tooltip" title="fa fa-ship"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-shirtsinbulk 
                          </Tooltip>}>
                            <i className="fa fa-shirtsinbulk" data-bs-toggle="tooltip" title="fa fa-shirtsinbulk"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-shopping-bag 
                          </Tooltip>}>
                            <i className="fa fa-shopping-bag" data-bs-toggle="tooltip" title="fa fa-shopping-bag"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-shopping-bas 
                          </Tooltip>}>
                            <i className="fa fa-shopping-basket" data-bs-toggle="tooltip" title="fa fa-shopping-basket"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-shopping-car 
                          </Tooltip>}>
                            <i className="fa fa-shopping-cart" data-bs-toggle="tooltip" title="fa fa-shopping-cart"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-shower
                          </Tooltip>}>
                            <i className="fa fa-shower" data-bs-toggle="tooltip" title="fa fa-shower"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sign-in
                          </Tooltip>}>
                            <i className="fa fa-sign-in" data-bs-toggle="tooltip" title="fa fa-sign-in"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sign-languag 
                          </Tooltip>}>
                            <i className="fa fa-sign-language" data-bs-toggle="tooltip" title="fa fa-sign-language"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sign-out
                          </Tooltip>}>
                            <i className="fa fa-sign-out" data-bs-toggle="tooltip" title="fa fa-sign-out"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-signal
                          </Tooltip>}>
                            <i className="fa fa-signal" data-bs-toggle="tooltip" title="fa fa-signal"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-signing
                          </Tooltip>}>
                            <i className="fa fa-signing" data-bs-toggle="tooltip" title="fa fa-signing"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-simplybuilt 
                          </Tooltip>}>
                            <i className="fa fa-simplybuilt" data-bs-toggle="tooltip" title="fa fa-simplybuilt"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sitemap
                          </Tooltip>}>
                            <i className="fa fa-sitemap" data-bs-toggle="tooltip" title="fa fa-sitemap"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-skyatlas
                          </Tooltip>}>
                            <i className="fa fa-skyatlas" data-bs-toggle="tooltip" title="fa fa-skyatlas"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-skype
                          </Tooltip>}>
                            <i className="fa fa-skype" data-bs-toggle="tooltip" title="fa fa-skype"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-slack
                          </Tooltip>}>
                            <i className="fa fa-slack" data-bs-toggle="tooltip" title="fa fa-slack"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sliders
                          </Tooltip>}>
                            <i className="fa fa-sliders" data-bs-toggle="tooltip" title="fa fa-sliders"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-slideshare  
                          </Tooltip>}>
                            <i className="fa fa-slideshare" data-bs-toggle="tooltip" title="fa fa-slideshare"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-smile-o
                          </Tooltip>}>
                            <i className="fa fa-smile-o" data-bs-toggle="tooltip" title="fa fa-smile-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-snapchat
                          </Tooltip>}>
                            <i className="fa fa-snapchat" data-bs-toggle="tooltip" title="fa fa-snapchat"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-snapchat-gho 
                          </Tooltip>}>
                            <i className="fa fa-snapchat-ghost" data-bs-toggle="tooltip" title="fa fa-snapchat-ghost"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-snapchat-squ 
                          </Tooltip>}>
                            <i className="fa fa-snapchat-square" data-bs-toggle="tooltip" title="fa fa-snapchat-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-snowflake-o" 
                          </Tooltip>}>
                            <i className="fa fa-snowflake-o" data-bs-toggle="tooltip" title="fa fa-snowflake-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-soccer-ball- 
                          </Tooltip>}>
                            <i className="fa fa-soccer-ball-o" data-bs-toggle="tooltip" title="fa fa-soccer-ball-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-sort
                          </Tooltip>}>
                            <i className="fa fa-sort" data-bs-toggle="tooltip" title="fa fa-sort"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sort-alpha-a 
                          </Tooltip>}>
                            <i className="fa fa-sort-alpha-asc" data-bs-toggle="tooltip" title="fa fa-sort-alpha-asc"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sort-alpha-d 
                          </Tooltip>}>
                            <i className="fa fa-sort-alpha-desc" data-bs-toggle="tooltip" title="fa fa-sort-alpha-desc"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sort-amount- 
                          </Tooltip>}>
                            <i className="fa fa-sort-amount-asc" data-bs-toggle="tooltip" title="fa fa-sort-amount-asc"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sort-amount- 
                          </Tooltip>}>
                            <i className="fa fa-sort-amount-desc" data-bs-toggle="tooltip" title="fa fa-sort-amount-desc"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sort-asc
                          </Tooltip>}>
                            <i className="fa fa-sort-asc" data-bs-toggle="tooltip" title="fa fa-sort-asc"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sort-desc
                          </Tooltip>}>
                            <i className="fa fa-sort-desc" data-bs-toggle="tooltip" title="fa fa-sort-desc"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sort-down
                          </Tooltip>}>
                            <i className="fa fa-sort-down" data-bs-toggle="tooltip" title="fa fa-sort-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sort-numeric-asc 
                          </Tooltip>}>
                            <i className="fa fa-sort-numeric-asc" data-bs-toggle="tooltip" title="fa fa-sort-numeric-asc"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sort-numeric-desc
                          </Tooltip>}>
                            <i className="fa fa-sort-numeric-desc" data-bs-toggle="tooltip" title="fa fa-sort-numeric-desc"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sort-up
                          </Tooltip>}>
                            <i className="fa fa-sort-up" data-bs-toggle="tooltip" title="fa fa-sort-up"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-soundcloud  
                          </Tooltip>}>
                            <i className="fa fa-soundcloud" data-bs-toggle="tooltip" title="fa fa-soundcloud"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-space-shuttle
                          </Tooltip>}>
                            <i className="fa fa-space-shuttle" data-bs-toggle="tooltip" title="fa fa-space-shuttle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-spinner
                          </Tooltip>}>
                            <i className="fa fa-spinner" data-bs-toggle="tooltip" title="fa fa-spinner"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-spoon
                          </Tooltip>}>
                            <i className="fa fa-spoon" data-bs-toggle="tooltip" title="fa fa-spoon"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-spotify
                          </Tooltip>}>
                            <i className="fa fa-spotify" data-bs-toggle="tooltip" title="fa fa-spotify"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-square
                          </Tooltip>}>
                            <i className="fa fa-square" data-bs-toggle="tooltip" title="fa fa-square"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-square-o
                          </Tooltip>}>
                            <i className="fa fa-square-o" data-bs-toggle="tooltip" title="fa fa-square-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-stack-exchange
                          </Tooltip>}>
                            <i className="fa fa-stack-exchange" data-bs-toggle="tooltip" title="fa fa-stack-exchange"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-stack-overflow 
                          </Tooltip>}>
                            <i className="fa fa-stack-overflow" data-bs-toggle="tooltip" title="fa fa-stack-overflow"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-star
                          </Tooltip>}>
                            <i className="fa fa-star" data-bs-toggle="tooltip" title="fa fa-star"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-star-half
                          </Tooltip>}>
                            <i className="fa fa-star-half" data-bs-toggle="tooltip" title="fa fa-star-half"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-star-half-empty
                          </Tooltip>}>
                            <i className="fa fa-star-half-empty" data-bs-toggle="tooltip" title="fa fa-star-half-empty"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-star-half-full 
                          </Tooltip>}>
                            <i className="fa fa-star-half-full" data-bs-toggle="tooltip" title="fa fa-star-half-full"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-star-half-o 
                          </Tooltip>}>
                            <i className="fa fa-star-half-o" data-bs-toggle="tooltip" title="fa fa-star-half-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-star-o
                          </Tooltip>}>
                            <i className="fa fa-star-o" data-bs-toggle="tooltip" title="fa fa-star-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-steam
                          </Tooltip>}>
                            <i className="fa fa-steam" data-bs-toggle="tooltip" title="fa fa-steam"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-steam-square 
                          </Tooltip>}>
                            <i className="fa fa-steam-square" data-bs-toggle="tooltip" title="fa fa-steam-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-step-backwar 
                          </Tooltip>}>
                            <i className="fa fa-step-backward" data-bs-toggle="tooltip" title="fa fa-step-backward"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-step-forward 
                          </Tooltip>}>
                            <i className="fa fa-step-forward" data-bs-toggle="tooltip" title="fa fa-step-forward"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-stethoscope
                          </Tooltip>}>
                            <i className="fa fa-stethoscope" data-bs-toggle="tooltip" title="fa fa-stethoscope"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sticky-note
                          </Tooltip>}>
                            <i className="fa fa-sticky-note" data-bs-toggle="tooltip" title="fa fa-sticky-note"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sticky-note-o 
                          </Tooltip>}>
                            <i className="fa fa-sticky-note-o" data-bs-toggle="tooltip" title="fa fa-sticky-note-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-stop
                          </Tooltip>}>
                            <i className="fa fa-stop" data-bs-toggle="tooltip" title="fa fa-stop"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-stop-circle 
                          </Tooltip>}>
                            <i className="fa fa-stop-circle" data-bs-toggle="tooltip" title="fa fa-stop-circle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-stop-circle-o 
                          </Tooltip>}>
                            <i className="fa fa-stop-circle-o" data-bs-toggle="tooltip" title="fa fa-stop-circle-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-street-view 
                          </Tooltip>}>
                            <i className="fa fa-street-view" data-bs-toggle="tooltip" title="fa fa-street-view"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-strikethrough 
                          </Tooltip>}>
                            <i className="fa fa-strikethrough" data-bs-toggle="tooltip" title="fa fa-strikethrough"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-stumbleupon 
                          </Tooltip>}>
                            <i className="fa fa-stumbleupon" data-bs-toggle="tooltip" title="fa fa-stumbleupon"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-stumbleupon-circle 
                          </Tooltip>}>
                            <i className="fa fa-stumbleupon-circle" data-bs-toggle="tooltip" title="fa fa-stumbleupon-circle"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-subscript
                          </Tooltip>}>
                            <i className="fa fa-subscript" data-bs-toggle="tooltip" title="fa fa-subscript"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-subway
                          </Tooltip>}>
                            <i className="fa fa-subway" data-bs-toggle="tooltip" title="fa fa-subway"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-suitcase
                          </Tooltip>}>
                            <i className="fa fa-suitcase" data-bs-toggle="tooltip" title="fa fa-suitcase"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-sun-o
                          </Tooltip>}>
                            <i className="fa fa-sun-o" data-bs-toggle="tooltip" title="fa fa-sun-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-superpowers 
                          </Tooltip>}>
                            <i className="fa fa-superpowers" data-bs-toggle="tooltip" title="fa fa-superpowers"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-superscript 
                          </Tooltip>}>
                            <i className="fa fa-superscript" data-bs-toggle="tooltip" title="fa fa-superscript"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-support
                          </Tooltip>}>
                            <i className="fa fa-support" data-bs-toggle="tooltip" title="fa fa-support"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-table
                          </Tooltip>}>
                            <i className="fa fa-table" data-bs-toggle="tooltip" title="fa fa-table"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-tablet
                          </Tooltip>}>
                            <i className="fa fa-tablet" data-bs-toggle="tooltip" title="fa fa-tablet"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-tachometer  
                          </Tooltip>}>
                            <i className="fa fa-tachometer" data-bs-toggle="tooltip" title="fa fa-tachometer"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-tag
                          </Tooltip>}>
                            <i className="fa fa-tag" data-bs-toggle="tooltip" title="fa fa-tag"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-tags
                          </Tooltip>}>
                            <i className="fa fa-tags" data-bs-toggle="tooltip" title="fa fa-tags"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-tasks
                          </Tooltip>}>
                            <i className="fa fa-tasks" data-bs-toggle="tooltip" title="fa fa-tasks"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-taxi
                          </Tooltip>}>
                            <i className="fa fa-taxi" data-bs-toggle="tooltip" title="fa fa-taxi"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-telegram
                          </Tooltip>}>
                            <i className="fa fa-telegram" data-bs-toggle="tooltip" title="fa fa-telegram"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-television  
                          </Tooltip>}>
                            <i className="fa fa-television" data-bs-toggle="tooltip" title="fa fa-television"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-tencent-weib 
                          </Tooltip>}>
                            <i className="fa fa-tencent-weibo" data-bs-toggle="tooltip" title="fa fa-tencent-weibo"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-terminal
                          </Tooltip>}>
                            <i className="fa fa-terminal" data-bs-toggle="tooltip" title="fa fa-terminal"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-text-height 
                          </Tooltip>}>
                            <i className="fa fa-text-height" data-bs-toggle="tooltip" title="fa fa-text-height"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-text-width  
                          </Tooltip>}>
                            <i className="fa fa-text-width" data-bs-toggle="tooltip" title="fa fa-text-width"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
           fa fa-th
                          </Tooltip>}>
                            <i className="fa fa-th" data-bs-toggle="tooltip" title="fa fa-th"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-th-large
                          </Tooltip>}>
                            <i className="fa fa-th-large" data-bs-toggle="tooltip" title="fa fa-th-large"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-th-list
                          </Tooltip>}>
                            <i className="fa fa-th-list" data-bs-toggle="tooltip" title="fa fa-th-list"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-themeisle
                          </Tooltip>}>
                            <i className="fa fa-themeisle" data-bs-toggle="tooltip" title="fa fa-themeisle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thermometer 
                          </Tooltip>}>
                            <i className="fa fa-thermometer" data-bs-toggle="tooltip" title="fa fa-thermometer"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thermometer-0
                          </Tooltip>}>
                            <i className="fa fa-thermometer-0" data-bs-toggle="tooltip" title="fa fa-thermometer-0"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thermometer-1 
                          </Tooltip>}>
                            <i className="fa fa-thermometer-1" data-bs-toggle="tooltip" title="fa fa-thermometer-1"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thermometer-2 
                          </Tooltip>}>
                            <i className="fa fa-thermometer-2" data-bs-toggle="tooltip" title="fa fa-thermometer-2"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thermometer-3
                          </Tooltip>}>
                            <i className="fa fa-thermometer-3" data-bs-toggle="tooltip" title="fa fa-thermometer-3"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thermometer-4 
                          </Tooltip>}>
                            <i className="fa fa-thermometer-4" data-bs-toggle="tooltip" title="fa fa-thermometer-4"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thermometer-empty
                          </Tooltip>}>
                            <i className="fa fa-thermometer-empty" data-bs-toggle="tooltip" title="fa fa-thermometer-empty"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thermometer-full 
                          </Tooltip>}>
                            <i className="fa fa-thermometer-full" data-bs-toggle="tooltip" title="fa fa-thermometer-full"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thermometer-half
                          </Tooltip>}>
                            <i className="fa fa-thermometer-half" data-bs-toggle="tooltip" title="fa fa-thermometer-half"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thermometer-quarter
                          </Tooltip>}>
                            <i className="fa fa-thermometer-quarter" data-bs-toggle="tooltip" title="fa fa-thermometer-quarter"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-thermometer-three-quarters" data-bs-toggle="tooltip" title="fa fa-thermometer-three-quarters"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thumb-tack 
                          </Tooltip>}>
                            <i className="fa fa-thumb-tack" data-bs-toggle="tooltip" title="fa fa-thumb-tack"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thumbs-down 
                          </Tooltip>}>
                            <i className="fa fa-thumbs-down" data-bs-toggle="tooltip" title="fa fa-thumbs-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thumbs-o-down
                          </Tooltip>}>
                            <i className="fa fa-thumbs-o-down" data-bs-toggle="tooltip" title="fa fa-thumbs-o-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thumbs-o-up 
                          </Tooltip>}>
                            <i className="fa fa-thumbs-o-up" data-bs-toggle="tooltip" title="fa fa-thumbs-o-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-thumbs-up
                          </Tooltip>}>
                            <i className="fa fa-thumbs-up" data-bs-toggle="tooltip" title="fa fa-thumbs-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-ticket
                          </Tooltip>}>
                            <i className="fa fa-ticket" data-bs-toggle="tooltip" title="fa fa-ticket"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-times
                          </Tooltip>}>
                            <i className="fa fa-times" data-bs-toggle="tooltip" title="fa fa-times"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-times-circle 
                          </Tooltip>}>
                            <i className="fa fa-times-circle" data-bs-toggle="tooltip" title="fa fa-times-circle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-times-circle 
                          </Tooltip>}>
                            <i className="fa fa-times-circle-o" data-bs-toggle="tooltip" title="fa fa-times-circle-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-times-rectange 
                          </Tooltip>}>
                            <i className="fa fa-times-rectangle" data-bs-toggle="tooltip" title="fa fa-times-rectangle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-times-rectangle
                          </Tooltip>}>
                            <i className="fa fa-times-rectangle-o" data-bs-toggle="tooltip" title="fa fa-times-rectangle-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        "fa fa-tint
                          </Tooltip>}>
                            <i className="fa fa-tint" data-bs-toggle="tooltip" title="fa fa-tint"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-toggle-down 
                          </Tooltip>}>
                            <i className="fa fa-toggle-down" data-bs-toggle="tooltip" title="fa fa-toggle-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-toggle-left 
                          </Tooltip>}>
                            <i className="fa fa-toggle-left" data-bs-toggle="tooltip" title="fa fa-toggle-left"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-toggle-off  
                          </Tooltip>}>
                            <i className="fa fa-toggle-off" data-bs-toggle="tooltip" title="fa fa-toggle-off"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-toggle-on
                          </Tooltip>}>
                            <i className="fa fa-toggle-on" data-bs-toggle="tooltip" title="fa fa-toggle-on"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-toggle-right 
                          </Tooltip>}>
                            <i className="fa fa-toggle-right" data-bs-toggle="tooltip" title="fa fa-toggle-right"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-toggle-up
                          </Tooltip>}>
                            <i className="fa fa-toggle-up" data-bs-toggle="tooltip" title="fa fa-toggle-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-trademark
                          </Tooltip>}>
                            <i className="fa fa-trademark" data-bs-toggle="tooltip" title="fa fa-trademark"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-train
                          </Tooltip>}>
                            <i className="fa fa-train" data-bs-toggle="tooltip" title="fa fa-train"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-transgender 
                          </Tooltip>}>
                            <i className="fa fa-transgender" data-bs-toggle="tooltip" title="fa fa-transgender"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-transgender-alt 
                          </Tooltip>}>
                            <i className="fa fa-transgender-alt" data-bs-toggle="tooltip" title="fa fa-transgender-alt"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-trash
                          </Tooltip>}>
                            <i className="fa fa-trash" data-bs-toggle="tooltip" title="fa fa-trash"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-trash-o
                          </Tooltip>}>
                            <i className="fa fa-trash-o" data-bs-toggle="tooltip" title="fa fa-trash-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-tree
                          </Tooltip>}>
                            <i className="fa fa-tree" data-bs-toggle="tooltip" title="fa fa-tree"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-trello
                          </Tooltip>}>
                            <i className="fa fa-trello" data-bs-toggle="tooltip" title="fa fa-trello"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-tripadvisor 
                          </Tooltip>}>
                            <i className="fa fa-tripadvisor" data-bs-toggle="tooltip" title="fa fa-tripadvisor"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-trophy
                          </Tooltip>}>
                            <i className="fa fa-trophy" data-bs-toggle="tooltip" title="fa fa-trophy"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-truck
                          </Tooltip>}>
                            <i className="fa fa-truck" data-bs-toggle="tooltip" title="fa fa-truck"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-try
                          </Tooltip>}>
                            <i className="fa fa-try" data-bs-toggle="tooltip" title="fa fa-try"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-tty
                          </Tooltip>}>
                            <i className="fa fa-tty" data-bs-toggle="tooltip" title="fa fa-tty"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-tumblr
                          </Tooltip>}>
                            <i className="fa fa-tumblr" data-bs-toggle="tooltip" title="fa fa-tumblr"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-tumblr-square 
                          </Tooltip>}>
                            <i className="fa fa-tumblr-square" data-bs-toggle="tooltip" title="fa fa-tumblr-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-turkish-lira 
                          </Tooltip>}>
                            <i className="fa fa-turkish-lira" data-bs-toggle="tooltip" title="fa fa-turkish-lira"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
           fa fa-tv
                          </Tooltip>}>
                            <i className="fa fa-tv" data-bs-toggle="tooltip" title="fa fa-tv"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-twitch
                          </Tooltip>}>
                            <i className="fa fa-twitch" data-bs-toggle="tooltip" title="fa fa-twitch"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-twitter
                          </Tooltip>}>
                            <i className="fa fa-twitter" data-bs-toggle="tooltip" title="fa fa-twitter"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-twitter-squa 
                          </Tooltip>}>
                            <i className="fa fa-twitter-square" data-bs-toggle="tooltip" title="fa fa-twitter-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-umbrella
                          </Tooltip>}>
                            <i className="fa fa-umbrella" data-bs-toggle="tooltip" title="fa fa-umbrella"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-underline
                          </Tooltip>}>
                            <i className="fa fa-underline" data-bs-toggle="tooltip" title="fa fa-underline"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        fa fa-undo
                          </Tooltip>}>
                            <i className="fa fa-undo" data-bs-toggle="tooltip" title="fa fa-undo"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-universal-access 
                          </Tooltip>}>
                            <i className="fa fa-universal-access" data-bs-toggle="tooltip" title="fa fa-universal-access"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-university  
                          </Tooltip>}>
                            <i className="fa fa-university" data-bs-toggle="tooltip" title="fa fa-university"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-unlink
                          </Tooltip>}>
                            <i className="fa fa-unlink" data-bs-toggle="tooltip" title="fa fa-unlink"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-unlock
                          </Tooltip>}>
                            <i className="fa fa-unlock" data-bs-toggle="tooltip" title="fa fa-unlock"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-unlock-alt  
                          </Tooltip>}>
                            <i className="fa fa-unlock-alt" data-bs-toggle="tooltip" title="fa fa-unlock-alt"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-unsorted
                          </Tooltip>}>
                            <i className="fa fa-unsorted" data-bs-toggle="tooltip" title="fa fa-unsorted"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-upload
                          </Tooltip>}>
                            <i className="fa fa-upload" data-bs-toggle="tooltip" title="fa fa-upload"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-usb
                          </Tooltip>}>
                            <i className="fa fa-usb" data-bs-toggle="tooltip" title="fa fa-usb"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-usd
                          </Tooltip>}>
                            <i className="fa fa-usd" data-bs-toggle="tooltip" title="fa fa-usd"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        "fa fa-user
                          </Tooltip>}>
                            <i className="fa fa-user" data-bs-toggle="tooltip" title="fa fa-user"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-user-circle" 
                          </Tooltip>}>
                            <i className="fa fa-user-circle" data-bs-toggle="tooltip" title="fa fa-user-circle"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-user-circle- 
                          </Tooltip>}>
                            <i className="fa fa-user-circle-o" data-bs-toggle="tooltip" title="fa fa-user-circle-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-user-md
                          </Tooltip>}>
                            <i className="fa fa-user-md" data-bs-toggle="tooltip" title="fa fa-user-md"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-user-o
                          </Tooltip>}>
                            <i className="fa fa-user-o" data-bs-toggle="tooltip" title="fa fa-user-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-user-plus
                          </Tooltip>}>
                            <i className="fa fa-user-plus" data-bs-toggle="tooltip" title="fa fa-user-plus"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-user-secret 
                          </Tooltip>}>
                            <i className="fa fa-user-secret" data-bs-toggle="tooltip" title="fa fa-user-secret"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-user-times  
                          </Tooltip>}>
                            <i className="fa fa-user-times" data-bs-toggle="tooltip" title="fa fa-user-times"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-users
                          </Tooltip>}>
                            <i className="fa fa-users" data-bs-toggle="tooltip" title="fa fa-users"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-vcard
                          </Tooltip>}>
                            <i className="fa fa-vcard" data-bs-toggle="tooltip" title="fa fa-vcard"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-vcard-o
                          </Tooltip>}>
                            <i className="fa fa-vcard-o" data-bs-toggle="tooltip" title="fa fa-vcard-o"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-venus
                          </Tooltip>}>
                            <i className="fa fa-venus" data-bs-toggle="tooltip" title="fa fa-venus"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-venus-double 
                          </Tooltip>}>
                            <i className="fa fa-venus-double" data-bs-toggle="tooltip" title="fa fa-venus-double"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-venus-mars"  
                          </Tooltip>}>
                            <i className="fa fa-venus-mars" data-bs-toggle="tooltip" title="fa fa-venus-mars"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-viacoin
                          </Tooltip>}>
                            <i className="fa fa-viacoin" data-bs-toggle="tooltip" title="fa fa-viacoin"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-viadeo
                          </Tooltip>}>
                            <i className="fa fa-viadeo" data-bs-toggle="tooltip" title="fa fa-viadeo"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-viadeo-squar 
                          </Tooltip>}>
                            <i className="fa fa-viadeo-square" data-bs-toggle="tooltip" title="fa fa-viadeo-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-video-camera 
                          </Tooltip>}>
                            <i className="fa fa-video-camera" data-bs-toggle="tooltip" title="fa fa-video-camera"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-vimeo
                          </Tooltip>}>
                            <i className="fa fa-vimeo" data-bs-toggle="tooltip" title="fa fa-vimeo"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-vimeo-square 
                          </Tooltip>}>
                            <i className="fa fa-vimeo-square" data-bs-toggle="tooltip" title="fa fa-vimeo-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        "fa fa-vine
                          </Tooltip>}>
                            <i className="fa fa-vine" data-bs-toggle="tooltip" title="fa fa-vine"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
           fa fa-vk
                          </Tooltip>}>
                            <i className="fa fa-vk" data-bs-toggle="tooltip" title="fa fa-vk"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            
                          </Tooltip>}><i
                      className="fa fa-volume-control-phone" data-bs-toggle="tooltip" title="fa fa-volume-control-phone"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-volume-down" 
                          </Tooltip>}>
                            <i className="fa fa-volume-down" data-bs-toggle="tooltip" title="fa fa-volume-down"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-volume-off"  
                          </Tooltip>}>
                            <i className="fa fa-volume-off" data-bs-toggle="tooltip" title="fa fa-volume-off"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-volume-up
                          </Tooltip>}>
                            <i className="fa fa-volume-up" data-bs-toggle="tooltip" title="fa fa-volume-up"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-warning
                          </Tooltip>}>
                            <i className="fa fa-warning" data-bs-toggle="tooltip" title="fa fa-warning"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-wechat
                          </Tooltip>}>
                            <i className="fa fa-wechat" data-bs-toggle="tooltip" title="fa fa-wechat"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-weibo
                          </Tooltip>}>
                            <i className="fa fa-weibo" data-bs-toggle="tooltip" title="fa fa-weibo"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-weixin
                          </Tooltip>}>
                            <i className="fa fa-weixin" data-bs-toggle="tooltip" title="fa fa-weixin"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-whatsapp
                          </Tooltip>}>
                            <i className="fa fa-whatsapp" data-bs-toggle="tooltip" title="fa fa-whatsapp"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-wheelchair"  
                          </Tooltip>}>
                            <i className="fa fa-wheelchair" data-bs-toggle="tooltip" title="fa fa-wheelchair"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-wheelchair-a 
                          </Tooltip>}>
                            <i className="fa fa-wheelchair-alt" data-bs-toggle="tooltip" title="fa fa-wheelchair-alt"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        "fa fa-wifi
                          </Tooltip>}>
                            <i className="fa fa-wifi" data-bs-toggle="tooltip" title="fa fa-wifi"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-wikipedia-w" 
                          </Tooltip>}>
                            <i className="fa fa-wikipedia-w" data-bs-toggle="tooltip" title="fa fa-wikipedia-w"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-window-close 
                          </Tooltip>}>
                            <i className="fa fa-window-close" data-bs-toggle="tooltip" title="fa fa-window-close"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-window-close 
                          </Tooltip>}>
                            <i className="fa fa-window-close-o" data-bs-toggle="tooltip" title="fa fa-window-close-o"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-window-maxim 
                          </Tooltip>}>
                            <i className="fa fa-window-maximize" data-bs-toggle="tooltip" title="fa fa-window-maximize"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-window-minim 
                          </Tooltip>}>
                            <i className="fa fa-window-minimize" data-bs-toggle="tooltip" title="fa fa-window-minimize"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-window-resto 
                          </Tooltip>}>
                            <i className="fa fa-window-restore" data-bs-toggle="tooltip" title="fa fa-window-restore"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-windows
                          </Tooltip>}>
                            <i className="fa fa-windows" data-bs-toggle="tooltip" title="fa fa-windows"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-won
                          </Tooltip>}>
                            <i className="fa fa-won" data-bs-toggle="tooltip" title="fa fa-won"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-wordpress
                          </Tooltip>}>
                            <i className="fa fa-wordpress" data-bs-toggle="tooltip" title="fa fa-wordpress"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-wpbeginner"  
                          </Tooltip>}>
                            <i className="fa fa-wpbeginner" data-bs-toggle="tooltip" title="fa fa-wpbeginner"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-wpexplorer"  
                          </Tooltip>}>
                            <i className="fa fa-wpexplorer" data-bs-toggle="tooltip" title="fa fa-wpexplorer"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-wpforms
                          </Tooltip>}>
                            <i className="fa fa-wpforms" data-bs-toggle="tooltip" title="fa fa-wpforms"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-wrench
                          </Tooltip>}>
                            <i className="fa fa-wrench" data-bs-toggle="tooltip" title="fa fa-wrench"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        "fa fa-xing
                          </Tooltip>}>
                            <i className="fa fa-xing" data-bs-toggle="tooltip" title="fa fa-xing"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-xing-square" 
                          </Tooltip>}>
                            <i className="fa fa-xing-square" data-bs-toggle="tooltip" title="fa fa-xing-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-y-combinator 
                          </Tooltip>}>
                            <i className="fa fa-y-combinator" data-bs-toggle="tooltip" title="fa fa-y-combinator"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-y-combinator 
                          </Tooltip>}>
                            <i className="fa fa-y-combinator-square" data-bs-toggle="tooltip" title="fa fa-y-combinator-square"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-yahoo
                          </Tooltip>}>
                            <i className="fa fa-yahoo" data-bs-toggle="tooltip" title="fa fa-yahoo"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
           fa fa-yc
                          </Tooltip>}>
                            <i className="fa fa-yc" data-bs-toggle="tooltip" title="fa fa-yc"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-yc-square
                          </Tooltip>}>
                            <i className="fa fa-yc-square" data-bs-toggle="tooltip" title="fa fa-yc-square"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                        "fa fa-yelp
                          </Tooltip>}>
                            <i className="fa fa-yelp" data-bs-toggle="tooltip" title="fa fa-yelp"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
               fa fa-yen
                          </Tooltip>}>
                            <i className="fa fa-yen" data-bs-toggle="tooltip" title="fa fa-yen"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-yoast
                          </Tooltip>}>
                            <i className="fa fa-yoast" data-bs-toggle="tooltip" title="fa fa-yoast"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-youtube
                          </Tooltip>}>
                            <i className="fa fa-youtube" data-bs-toggle="tooltip" title="fa fa-youtube"></i>
                      </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-youtube-play 
                          </Tooltip>}>
                            <i className="fa fa-youtube-play" data-bs-toggle="tooltip" title="fa fa-youtube-play"></i>
                  
                  </OverlayTrigger></li>
                  <li className="icons-list-item">
                    <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>
                            fa fa-youtube-squa 
                          </Tooltip>}>
                            <i className="fa fa-youtube-square" data-bs-toggle="tooltip" title="fa fa-youtube-square"></i>
                  
                  </OverlayTrigger></li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li>
                  <li>
                  
                  </li> 
           </ul>
           </div>
           </Col>
           </Row>
           </Card.Body>
           </Card>
           </Col>
           </Row>
           </Fragment>
           
);

export default FontAwesome;
