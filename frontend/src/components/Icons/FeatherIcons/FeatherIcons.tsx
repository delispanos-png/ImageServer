import React, { FC, Fragment } from 'react';
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';



interface FeatherIconsProps {  }

const FeatherIcons: FC<FeatherIconsProps> = () => (
    <Fragment>
        <PageHeader  title="Feather Icons" />
        <Row>
            <Col md={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Feather Icons</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col lg={12} sm={12} mb={4}>
                                <p className="mb-2">Simply beautiful open source icons. For more info <a
                                    className="fs-16 text-primary font-weight-bold"
                                    href="https://feathericons.com" target="_blank" rel="noreferrer">click here</a>.
                                </p>
                                <p><code>&lt;i className="fe fe-ICON_NAME"&gt;&lt;/i&gt;</code></p>
                            </Col>
                            <Col lg={12} sm={12}>
                                <div className="icons-list-wrap">
                                    <ul className="icons-list">
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-activity</Tooltip>}><i className="fe fe-activity"
                                            data-bs-toggle="tooltip" title="fe fe-activity"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-airplay</Tooltip>}><i className="fe fe-airplay"
                                            data-bs-toggle="tooltip" title="fe fe-airplay"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-alert-circl</Tooltip>}><i className="fe fe-alert-circle"
                                            data-bs-toggle="tooltip" title="fe fe-alert-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-alert-octag</Tooltip>}><i className="fe fe-alert-octagon"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-alert-octagon"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-alert-trian</Tooltip>}><i className="fe fe-alert-triangle"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-alert-triangle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-align-cente</Tooltip>}><i className="fe fe-align-center"
                                            data-bs-toggle="tooltip" title="fe fe-align-center"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-align-justi</Tooltip>}><i className="fe fe-align-justify"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-align-justify"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-align-left</Tooltip>}><i className="fe fe-align-left"
                                            data-bs-toggle="tooltip" title="fe fe-align-left"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-align-right</Tooltip>}><i className="fe fe-align-right"
                                            data-bs-toggle="tooltip" title="fe fe-align-right"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-anchor</Tooltip>}><i className="fe fe-anchor"
                                            data-bs-toggle="tooltip" title="fe fe-anchor"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-aperture</Tooltip>}><i className="fe fe-aperture"
                                            data-bs-toggle="tooltip" title="fe fe-aperture"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-arrow-down</Tooltip>}><i className="fe fe-arrow-down"
                                            data-bs-toggle="tooltip" title="fe fe-arrow-down"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-arrow-down-circle</Tooltip>}><i className="fe fe-arrow-down-circle"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-arrow-down-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-arrow-down-left</Tooltip>}><i className="fe fe-arrow-down-left"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-arrow-down-left"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-arrow-down-right</Tooltip>}><i className="fe fe-arrow-down-right"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-arrow-down-right"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-arrow-left</Tooltip>}><i className="fe fe-arrow-left"
                                            data-bs-toggle="tooltip" title="fe fe-arrow-left"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-arrow-left-circle</Tooltip>}><i className="fe fe-arrow-left-circle"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-arrow-left-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-arrow-right</Tooltip>}><i className="fe fe-arrow-right"
                                            data-bs-toggle="tooltip" title="fe fe-arrow-right"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-arrow-right</Tooltip>}><i className="fe fe-arrow-right-circle"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-arrow-right-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-arrow-up</Tooltip>}><i className="fe fe-arrow-up"
                                            data-bs-toggle="tooltip" title="fe fe-arrow-up"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-arrow-up-circle</Tooltip>}><i className="fe fe-arrow-up-circle"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-arrow-up-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-arrow-up-left</Tooltip>}><i className="fe fe-arrow-up-left"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-arrow-up-left"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-arrow-up-right</Tooltip>}><i className="fe fe-arrow-up-right"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-arrow-up-right"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-at-sign</Tooltip>}><i className="fe fe-at-sign"
                                            data-bs-toggle="tooltip" title="fe fe-at-sign"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-award</Tooltip>}><i className="fe fe-award"
                                            data-bs-toggle="tooltip" title="fe fe-award"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-bar-chart</Tooltip>}><i className="fe fe-bar-chart"
                                            data-bs-toggle="tooltip" title="fe fe-bar-chart"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-bar-chart-2</Tooltip>}><i className="fe fe-bar-chart-2"
                                            data-bs-toggle="tooltip" title="fe fe-bar-chart-2"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-battery</Tooltip>}><i className="fe fe-battery"
                                            data-bs-toggle="tooltip" title="fe fe-battery"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-battery-cha</Tooltip>}><i className="fe fe-battery-charging"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-battery-charging"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-bell</Tooltip>}><i className="fe fe-bell"
                                            data-bs-toggle="tooltip" title="fe fe-bell"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-bell-off</Tooltip>}><i className="fe fe-bell-off"
                                            data-bs-toggle="tooltip" title="fe fe-bell-off"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-bluetooth</Tooltip>}><i className="fe fe-bluetooth"
                                            data-bs-toggle="tooltip" title="fe fe-bluetooth"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-bold</Tooltip>}><i className="fe fe-bold"
                                            data-bs-toggle="tooltip" title="fe fe-bold"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-book</Tooltip>}><i className="fe fe-book"
                                            data-bs-toggle="tooltip" title="fe fe-book"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-book-open</Tooltip>}><i className="fe fe-book-open"
                                            data-bs-toggle="tooltip" title="fe fe-book-open"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-bookmark</Tooltip>}><i className="fe fe-bookmark"
                                            data-bs-toggle="tooltip" title="fe fe-bookmark"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-box
</Tooltip>}><i className="fe fe-box"
                                            data-bs-toggle="tooltip" title="fe fe-box"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-briefcase</Tooltip>}><i className="fe fe-briefcase"
                                            data-bs-toggle="tooltip" title="fe fe-briefcase"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-calendar</Tooltip>}><i className="fe fe-calendar"
                                            data-bs-toggle="tooltip" title="fe fe-calendar"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-camera</Tooltip>}><i className="fe fe-camera"
                                            data-bs-toggle="tooltip" title="fe fe-camera"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-camera-off</Tooltip>}><i className="fe fe-camera-off"
                                            data-bs-toggle="tooltip" title="fe fe-camera-off"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-cast</Tooltip>}><i className="fe fe-cast"
                                            data-bs-toggle="tooltip" title="fe fe-cast"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-check</Tooltip>}><i className="fe fe-check"
                                            data-bs-toggle="tooltip" title="fe fe-check"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-check-circle</Tooltip>}><i className="fe fe-check-circle"
                                            data-bs-toggle="tooltip" title="fe fe-check-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-check-square</Tooltip>}><i className="fe fe-check-square"
                                            data-bs-toggle="tooltip" title="fe fe-check-square"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-chevron-down</Tooltip>}><i className="fe fe-chevron-down"
                                            data-bs-toggle="tooltip" title="fe fe-chevron-down"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-chevron-left</Tooltip>}><i className="fe fe-chevron-left"
                                            data-bs-toggle="tooltip" title="fe fe-chevron-left"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-chevron-right</Tooltip>}><i className="fe fe-chevron-right"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-chevron-right"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-chevron-up</Tooltip>}><i className="fe fe-chevron-up"
                                            data-bs-toggle="tooltip" title="fe fe-chevron-up"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-chevrons-down</Tooltip>}><i className="fe fe-chevrons-down"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-chevrons-down"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-chevrons-left</Tooltip>}><i className="fe fe-chevrons-left"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-chevrons-left"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-chevrons-right</Tooltip>}><i className="fe fe-chevrons-right"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-chevrons-right"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-chevrons-up</Tooltip>}><i className="fe fe-chevrons-up"
                                            data-bs-toggle="tooltip" title="fe fe-chevrons-up"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-chrome</Tooltip>}><i className="fe fe-chrome"
                                            data-bs-toggle="tooltip" title="fe fe-chrome"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-circle</Tooltip>}><i className="fe fe-circle"
                                            data-bs-toggle="tooltip" title="fe fe-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-clipboard</Tooltip>}><i className="fe fe-clipboard"
                                            data-bs-toggle="tooltip" title="fe fe-clipboard"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-clock</Tooltip>}><i className="fe fe-clock"
                                            data-bs-toggle="tooltip" title="fe fe-clock"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-cloud</Tooltip>}><i className="fe fe-cloud"
                                            data-bs-toggle="tooltip" title="fe fe-cloud"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-cloud-drizz</Tooltip>}><i className="fe fe-cloud-drizzle"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-cloud-drizzle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-cloud-light</Tooltip>}><i className="fe fe-cloud-lightning"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-cloud-lightning"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-cloud-off</Tooltip>}><i className="fe fe-cloud-off"
                                            data-bs-toggle="tooltip" title="fe fe-cloud-off"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-cloud-rain</Tooltip>}><i className="fe fe-cloud-rain"
                                            data-bs-toggle="tooltip" title="fe fe-cloud-rain"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-cloud-snow</Tooltip>}><i className="fe fe-cloud-snow"
                                            data-bs-toggle="tooltip" title="fe fe-cloud-snow"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-code</Tooltip>}><i className="fe fe-code"
                                            data-bs-toggle="tooltip" title="fe fe-code"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-codepen</Tooltip>}><i className="fe fe-codepen"
                                            data-bs-toggle="tooltip" title="fe fe-codepen"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-command</Tooltip>}><i className="fe fe-command"
                                            data-bs-toggle="tooltip" title="fe fe-command"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-compass</Tooltip>}><i className="fe fe-compass"
                                            data-bs-toggle="tooltip" title="fe fe-compass"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-copy</Tooltip>}><i className="fe fe-copy"
                                            data-bs-toggle="tooltip" title="fe fe-copy"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-corner-down</Tooltip>}><i className="fe fe-corner-down-left"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-corner-down-left"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-corner-down</Tooltip>}><i className="fe fe-corner-down-right"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-corner-down-right"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-corner-left</Tooltip>}><i className="fe fe-corner-left-down"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-corner-left-down"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-corner-left</Tooltip>}><i className="fe fe-corner-left-up"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-corner-left-up"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-corner-right</Tooltip>}><i className="fe fe-corner-right-down"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-corner-right-down"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-corner-righ</Tooltip>}><i className="fe fe-corner-right-up"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-corner-right-up"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-corner-up-l</Tooltip>}><i className="fe fe-corner-up-left"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-corner-up-left"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-corner-up-r</Tooltip>}><i className="fe fe-corner-up-right"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-corner-up-right"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-cpu
</Tooltip>}><i className="fe fe-cpu"
                                            data-bs-toggle="tooltip" title="fe fe-cpu"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-credit-card</Tooltip>}><i className="fe fe-credit-card"
                                            data-bs-toggle="tooltip" title="fe fe-credit-card"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-crop</Tooltip>}><i className="fe fe-crop"
                                            data-bs-toggle="tooltip" title="fe fe-crop"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-crosshair</Tooltip>}><i className="fe fe-crosshair"
                                            data-bs-toggle="tooltip" title="fe fe-crosshair"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-database</Tooltip>}><i className="fe fe-database"
                                            data-bs-toggle="tooltip" title="fe fe-database"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-delete</Tooltip>}><i className="fe fe-delete"
                                            data-bs-toggle="tooltip" title="fe fe-delete"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-disc</Tooltip>}><i className="fe fe-disc"
                                            data-bs-toggle="tooltip" title="fe fe-disc"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-dollar-sign</Tooltip>}><i className="fe fe-dollar-sign"
                                            data-bs-toggle="tooltip" title="fe fe-dollar-sign"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-download</Tooltip>}><i className="fe fe-download"
                                            data-bs-toggle="tooltip" title="fe fe-download"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-download-cl</Tooltip>}><i className="fe fe-download-cloud"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-download-cloud"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-droplet</Tooltip>}><i className="fe fe-droplet"
                                            data-bs-toggle="tooltip" title="fe fe-droplet"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-edit</Tooltip>}><i className="fe fe-edit"
                                            data-bs-toggle="tooltip" title="fe fe-edit"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-edit-2</Tooltip>}><i className="fe fe-edit-2"
                                            data-bs-toggle="tooltip" title="fe fe-edit-2"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-edit-3</Tooltip>}><i className="fe fe-edit-3"
                                            data-bs-toggle="tooltip" title="fe fe-edit-3"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-external-li</Tooltip>}><i className="fe fe-external-link"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-external-link"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-eye
</Tooltip>}><i className="fe fe-eye"
                                            data-bs-toggle="tooltip" title="fe fe-eye"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-eye-off</Tooltip>}><i className="fe fe-eye-off"
                                            data-bs-toggle="tooltip" title="fe fe-eye-off"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-facebook</Tooltip>}><i className="fe fe-facebook"
                                            data-bs-toggle="tooltip" title="fe fe-facebook"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-fast-forwar</Tooltip>}><i className="fe fe-fast-forward"
                                            data-bs-toggle="tooltip" title="fe fe-fast-forward"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-feather</Tooltip>}><i className="fe fe-feather"
                                            data-bs-toggle="tooltip" title="fe fe-feather"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-file</Tooltip>}><i className="fe fe-file"
                                            data-bs-toggle="tooltip" title="fe fe-file"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-file-minus</Tooltip>}><i className="fe fe-file-minus"
                                            data-bs-toggle="tooltip" title="fe fe-file-minus"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-file-plus</Tooltip>}><i className="fe fe-file-plus"
                                            data-bs-toggle="tooltip" title="fe fe-file-plus"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-file-text</Tooltip>}><i className="fe fe-file-text"
                                            data-bs-toggle="tooltip" title="fe fe-file-text"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-film</Tooltip>}><i className="fe fe-film"
                                            data-bs-toggle="tooltip" title="fe fe-film"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-filter</Tooltip>}><i className="fe fe-filter"
                                            data-bs-toggle="tooltip" title="fe fe-filter"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-flag</Tooltip>}><i className="fe fe-flag"
                                            data-bs-toggle="tooltip" title="fe fe-flag"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-folder</Tooltip>}><i className="fe fe-folder"
                                            data-bs-toggle="tooltip" title="fe fe-folder"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-folder-minu</Tooltip>}><i className="fe fe-folder-minus"
                                            data-bs-toggle="tooltip" title="fe fe-folder-minus"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-folder-plus</Tooltip>}><i className="fe fe-folder-plus"
                                            data-bs-toggle="tooltip" title="fe fe-folder-plus"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-git-branch</Tooltip>}><i className="fe fe-git-branch"
                                            data-bs-toggle="tooltip" title="fe fe-git-branch"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-git-commit</Tooltip>}><i className="fe fe-git-commit"
                                            data-bs-toggle="tooltip" title="fe fe-git-commit"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-git-merge</Tooltip>}><i className="fe fe-git-merge"
                                            data-bs-toggle="tooltip" title="fe fe-git-merge"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-git-pull-request</Tooltip>}><i className="fe fe-git-pull-request"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-git-pull-request"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-github</Tooltip>}><i className="fe fe-github"
                                            data-bs-toggle="tooltip" title="fe fe-github"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-gitlab</Tooltip>}><i className="fe fe-gitlab"
                                            data-bs-toggle="tooltip" title="fe fe-gitlab"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-globe</Tooltip>}><i className="fe fe-globe"
                                            data-bs-toggle="tooltip" title="fe fe-globe"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-grid</Tooltip>}><i className="fe fe-grid"
                                            data-bs-toggle="tooltip" title="fe fe-grid"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-hard-drive</Tooltip>}><i className="fe fe-hard-drive"
                                            data-bs-toggle="tooltip" title="fe fe-hard-drive"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-hash</Tooltip>}><i className="fe fe-hash"
                                            data-bs-toggle="tooltip" title="fe fe-hash"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-headphones</Tooltip>}><i className="fe fe-headphones"
                                            data-bs-toggle="tooltip" title="fe fe-headphones"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-heart</Tooltip>}><i className="fe fe-heart"
                                            data-bs-toggle="tooltip" title="fe fe-heart"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-help-circle</Tooltip>}><i className="fe fe-help-circle"
                                            data-bs-toggle="tooltip" title="fe fe-help-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-home</Tooltip>}><i className="fe fe-home"
                                            data-bs-toggle="tooltip" title="fe fe-home"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-image</Tooltip>}><i className="fe fe-image"
                                            data-bs-toggle="tooltip" title="fe fe-image"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-inbox</Tooltip>}><i className="fe fe-inbox"
                                            data-bs-toggle="tooltip" title="fe fe-inbox"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-info</Tooltip>}><i className="fe fe-info"
                                            data-bs-toggle="tooltip" title="fe fe-info"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-instagram</Tooltip>}><i className="fe fe-instagram"
                                            data-bs-toggle="tooltip" title="fe fe-instagram"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-italic</Tooltip>}><i className="fe fe-italic"
                                            data-bs-toggle="tooltip" title="fe fe-italic"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-layers</Tooltip>}><i className="fe fe-layers"
                                            data-bs-toggle="tooltip" title="fe fe-layers"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-layout</Tooltip>}><i className="fe fe-layout"
                                            data-bs-toggle="tooltip" title="fe fe-layout"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-life-buoy</Tooltip>}><i className="fe fe-life-buoy"
                                            data-bs-toggle="tooltip" title="fe fe-life-buoy"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-link</Tooltip>}><i className="fe fe-link"
                                            data-bs-toggle="tooltip" title="fe fe-link"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-link-2</Tooltip>}><i className="fe fe-link-2"
                                            data-bs-toggle="tooltip" title="fe fe-link-2"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-linkedin</Tooltip>}><i className="fe fe-linkedin"
                                            data-bs-toggle="tooltip" title="fe fe-linkedin"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-list</Tooltip>}><i className="fe fe-list"
                                            data-bs-toggle="tooltip" title="fe fe-list"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-loader</Tooltip>}><i className="fe fe-loader"
                                            data-bs-toggle="tooltip" title="fe fe-loader"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-lock</Tooltip>}><i className="fe fe-lock"
                                            data-bs-toggle="tooltip" title="fe fe-lock"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-log-in</Tooltip>}><i className="fe fe-log-in"
                                            data-bs-toggle="tooltip" title="fe fe-log-in"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-log-out</Tooltip>}><i className="fe fe-log-out"
                                            data-bs-toggle="tooltip" title="fe fe-log-out"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-mail</Tooltip>}><i className="fe fe-mail"
                                            data-bs-toggle="tooltip" title="fe fe-mail"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-map
</Tooltip>}><i className="fe fe-map"
                                            data-bs-toggle="tooltip" title="fe fe-map"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-map-pin</Tooltip>}><i className="fe fe-map-pin"
                                            data-bs-toggle="tooltip" title="fe fe-map-pin"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-maximize</Tooltip>}><i className="fe fe-maximize"
                                            data-bs-toggle="tooltip" title="fe fe-maximize"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-maximize-2</Tooltip>}><i className="fe fe-maximize-2"
                                            data-bs-toggle="tooltip" title="fe fe-maximize-2"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-menu</Tooltip>}><i className="fe fe-menu"
                                            data-bs-toggle="tooltip" title="fe fe-menu"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-message-circle</Tooltip>}><i className="fe fe-message-circle"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-message-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-message-square</Tooltip>}><i className="fe fe-message-square"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-message-square"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-mic
</Tooltip>}><i className="fe fe-mic"
                                            data-bs-toggle="tooltip" title="fe fe-mic"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-mic-off</Tooltip>}><i className="fe fe-mic-off"
                                            data-bs-toggle="tooltip" title="fe fe-mic-off"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-minimize</Tooltip>}><i className="fe fe-minimize"
                                            data-bs-toggle="tooltip" title="fe fe-minimize"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-minimize-2</Tooltip>}><i className="fe fe-minimize-2"
                                            data-bs-toggle="tooltip" title="fe fe-minimize-2"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-minus</Tooltip>}><i className="fe fe-minus"
                                            data-bs-toggle="tooltip" title="fe fe-minus"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-minus-circle</Tooltip>}><i className="fe fe-minus-circle"
                                            data-bs-toggle="tooltip" title="fe fe-minus-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-minus-square</Tooltip>}><i className="fe fe-minus-square"
                                            data-bs-toggle="tooltip" title="fe fe-minus-square"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-monitor</Tooltip>}><i className="fe fe-monitor"
                                            data-bs-toggle="tooltip" title="fe fe-monitor"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-moon</Tooltip>}><i className="fe fe-moon"
                                            data-bs-toggle="tooltip" title="fe fe-moon"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-more-horizontal</Tooltip>}><i className="fe fe-more-horizontal"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-more-horizontal"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-more-vertical</Tooltip>}><i className="fe fe-more-vertical"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-more-vertical"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-move</Tooltip>}><i className="fe fe-move"
                                            data-bs-toggle="tooltip" title="fe fe-move"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-music</Tooltip>}><i className="fe fe-music"
                                            data-bs-toggle="tooltip" title="fe fe-music"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-navigation</Tooltip>}><i className="fe fe-navigation"
                                            data-bs-toggle="tooltip" title="fe fe-navigation"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-navigation-</Tooltip>}><i className="fe fe-navigation-2"
                                            data-bs-toggle="tooltip" title="fe fe-navigation-2"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-octagon</Tooltip>}><i className="fe fe-octagon"
                                            data-bs-toggle="tooltip" title="fe fe-octagon"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-package</Tooltip>}><i className="fe fe-package"
                                            data-bs-toggle="tooltip" title="fe fe-package"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-paperclip</Tooltip>}><i className="fe fe-paperclip"
                                            data-bs-toggle="tooltip" title="fe fe-paperclip"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-pause</Tooltip>}><i className="fe fe-pause"
                                            data-bs-toggle="tooltip" title="fe fe-pause"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-pause-circle</Tooltip>}><i className="fe fe-pause-circle"
                                            data-bs-toggle="tooltip" title="fe fe-pause-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-percent</Tooltip>}><i className="fe fe-percent"
                                            data-bs-toggle="tooltip" title="fe fe-percent"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-phone</Tooltip>}><i className="fe fe-phone"
                                            data-bs-toggle="tooltip" title="fe fe-phone"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-phone-call</Tooltip>}><i className="fe fe-phone-call"
                                            data-bs-toggle="tooltip" title="fe fe-phone-call"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-phone-forwarded</Tooltip>}><i className="fe fe-phone-forwarded"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-phone-forwarded"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-phone-incoming</Tooltip>}><i className="fe fe-phone-incoming"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-phone-incoming"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-phone-missed</Tooltip>}><i className="fe fe-phone-missed"
                                            data-bs-toggle="tooltip" title="fe fe-phone-missed"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-phone-off</Tooltip>}><i className="fe fe-phone-off"
                                            data-bs-toggle="tooltip" title="fe fe-phone-off"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-phone-outgoing</Tooltip>}><i className="fe fe-phone-outgoing"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-phone-outgoing"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-pie-chart</Tooltip>}><i className="fe fe-pie-chart"
                                            data-bs-toggle="tooltip" title="fe fe-pie-chart"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-play</Tooltip>}><i className="fe fe-play"
                                            data-bs-toggle="tooltip" title="fe fe-play"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-play-circle</Tooltip>}><i className="fe fe-play-circle"
                                            data-bs-toggle="tooltip" title="fe fe-play-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-plus</Tooltip>}><i className="fe fe-plus"
                                            data-bs-toggle="tooltip" title="fe fe-plus"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-plus-circle</Tooltip>}><i className="fe fe-plus-circle"
                                            data-bs-toggle="tooltip" title="fe fe-plus-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-plus-square</Tooltip>}><i className="fe fe-plus-square"
                                            data-bs-toggle="tooltip" title="fe fe-plus-square"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-pocket</Tooltip>}><i className="fe fe-pocket"
                                            data-bs-toggle="tooltip" title="fe fe-pocket"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-power</Tooltip>}><i className="fe fe-power"
                                            data-bs-toggle="tooltip" title="fe fe-power"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-printer</Tooltip>}><i className="fe fe-printer"
                                            data-bs-toggle="tooltip" title="fe fe-printer"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-radio</Tooltip>}><i className="fe fe-radio"
                                            data-bs-toggle="tooltip" title="fe fe-radio"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-refresh-ccw</Tooltip>}><i className="fe fe-refresh-ccw"
                                            data-bs-toggle="tooltip" title="fe fe-refresh-ccw"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-refresh-cw</Tooltip>}><i className="fe fe-refresh-cw"
                                            data-bs-toggle="tooltip" title="fe fe-refresh-cw"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-repeat</Tooltip>}><i className="fe fe-repeat"
                                            data-bs-toggle="tooltip" title="fe fe-repeat"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-rewind</Tooltip>}><i className="fe fe-rewind"
                                            data-bs-toggle="tooltip" title="fe fe-rewind"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-rotate-ccw</Tooltip>}><i className="fe fe-rotate-ccw"
                                            data-bs-toggle="tooltip" title="fe fe-rotate-ccw"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-rotate-cw</Tooltip>}><i className="fe fe-rotate-cw"
                                            data-bs-toggle="tooltip" title="fe fe-rotate-cw"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-rss
</Tooltip>}><i className="fe fe-rss"
                                            data-bs-toggle="tooltip" title="fe fe-rss"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-save</Tooltip>}><i className="fe fe-save"
                                            data-bs-toggle="tooltip" title="fe fe-save"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-scissors</Tooltip>}><i className="fe fe-scissors"
                                            data-bs-toggle="tooltip" title="fe fe-scissors"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-search</Tooltip>}><i className="fe fe-search"
                                            data-bs-toggle="tooltip" title="fe fe-search"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-send</Tooltip>}><i className="fe fe-send"
                                            data-bs-toggle="tooltip" title="fe fe-send"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-server</Tooltip>}><i className="fe fe-server"
                                            data-bs-toggle="tooltip" title="fe fe-server"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-settings</Tooltip>}><i className="fe fe-settings"
                                            data-bs-toggle="tooltip" title="fe fe-settings"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-share</Tooltip>}><i className="fe fe-share"
                                            data-bs-toggle="tooltip" title="fe fe-share"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-share-2</Tooltip>}><i className="fe fe-share-2"
                                            data-bs-toggle="tooltip" title="fe fe-share-2"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-shield</Tooltip>}><i className="fe fe-shield"
                                            data-bs-toggle="tooltip" title="fe fe-shield"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-shield-off</Tooltip>}><i className="fe fe-shield-off"
                                            data-bs-toggle="tooltip" title="fe fe-shield-off"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-shopping-bag</Tooltip>}><i className="fe fe-shopping-bag"
                                            data-bs-toggle="tooltip" title="fe fe-shopping-bag"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-shopping-cart</Tooltip>}><i className="fe fe-shopping-cart"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-shopping-cart"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-shuffle</Tooltip>}><i className="fe fe-shuffle"
                                            data-bs-toggle="tooltip" title="fe fe-shuffle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-sidebar</Tooltip>}><i className="fe fe-sidebar"
                                            data-bs-toggle="tooltip" title="fe fe-sidebar"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-skip-back</Tooltip>}><i className="fe fe-skip-back"
                                            data-bs-toggle="tooltip" title="fe fe-skip-back"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-skip-forwar</Tooltip>}><i className="fe fe-skip-forward"
                                            data-bs-toggle="tooltip" title="fe fe-skip-forward"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-slack</Tooltip>}><i className="fe fe-slack"
                                            data-bs-toggle="tooltip" title="fe fe-slack"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-slash</Tooltip>}><i className="fe fe-slash"
                                            data-bs-toggle="tooltip" title="fe fe-slash"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-sliders</Tooltip>}><i className="fe fe-sliders"
                                            data-bs-toggle="tooltip" title="fe fe-sliders"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-smartphone</Tooltip>}><i className="fe fe-smartphone"
                                            data-bs-toggle="tooltip" title="fe fe-smartphone"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-speaker</Tooltip>}><i className="fe fe-speaker"
                                            data-bs-toggle="tooltip" title="fe fe-speaker"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-square</Tooltip>}><i className="fe fe-square"
                                            data-bs-toggle="tooltip" title="fe fe-square"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-star</Tooltip>}><i className="fe fe-star"
                                            data-bs-toggle="tooltip" title="fe fe-star"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-stop-circle</Tooltip>}><i className="fe fe-stop-circle"
                                            data-bs-toggle="tooltip" title="fe fe-stop-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-sun
</Tooltip>}><i className="fe fe-sun"
                                            data-bs-toggle="tooltip" title="fe fe-sun"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-sunrise</Tooltip>}><i className="fe fe-sunrise"
                                            data-bs-toggle="tooltip" title="fe fe-sunrise"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-sunset</Tooltip>}><i className="fe fe-sunset"
                                            data-bs-toggle="tooltip" title="fe fe-sunset"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-tablet</Tooltip>}><i className="fe fe-tablet"
                                            data-bs-toggle="tooltip" title="fe fe-tablet"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-tag
</Tooltip>}><i className="fe fe-tag"
                                            data-bs-toggle="tooltip" title="fe fe-tag"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-target</Tooltip>}><i className="fe fe-target"
                                            data-bs-toggle="tooltip" title="fe fe-target"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-terminal</Tooltip>}><i className="fe fe-terminal"
                                            data-bs-toggle="tooltip" title="fe fe-terminal"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-thermometer</Tooltip>}><i className="fe fe-thermometer"
                                            data-bs-toggle="tooltip" title="fe fe-thermometer"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-thumbs-down</Tooltip>}><i className="fe fe-thumbs-down"
                                            data-bs-toggle="tooltip" title="fe fe-thumbs-down"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-thumbs-up</Tooltip>}><i className="fe fe-thumbs-up"
                                            data-bs-toggle="tooltip" title="fe fe-thumbs-up"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-toggle-left</Tooltip>}><i className="fe fe-toggle-left"
                                            data-bs-toggle="tooltip" title="fe fe-toggle-left"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-toggle-right</Tooltip>}><i className="fe fe-toggle-right"
                                            data-bs-toggle="tooltip" title="fe fe-toggle-right"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-trash</Tooltip>}><i className="fe fe-trash"
                                            data-bs-toggle="tooltip" title="fe fe-trash"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-trash-2</Tooltip>}><i className="fe fe-trash-2"
                                            data-bs-toggle="tooltip" title="fe fe-trash-2"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-trending-down</Tooltip>}><i className="fe fe-trending-down"
                                            data-bs-toggle="tooltip"
                                            title="fe fe-trending-down"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-trending-up</Tooltip>}><i className="fe fe-trending-up"
                                            data-bs-toggle="tooltip" title="fe fe-trending-up"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-triangle</Tooltip>}><i className="fe fe-triangle"
                                            data-bs-toggle="tooltip" title="fe fe-triangle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-truck</Tooltip>}><i className="fe fe-truck"
                                            data-bs-toggle="tooltip" title="fe fe-truck"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-tv</Tooltip>}><i className="fe fe-tv"
                                            data-bs-toggle="tooltip" title="fe fe-tv"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-twitter</Tooltip>}><i className="fe fe-twitter"
                                            data-bs-toggle="tooltip" title="fe fe-twitter"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-type</Tooltip>}><i className="fe fe-type"
                                            data-bs-toggle="tooltip" title="fe fe-type"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-umbrella</Tooltip>}><i className="fe fe-umbrella"
                                            data-bs-toggle="tooltip" title="fe fe-umbrella"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-underline</Tooltip>}><i className="fe fe-underline"
                                            data-bs-toggle="tooltip" title="fe fe-underline"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-unlock</Tooltip>}><i className="fe fe-unlock"
                                            data-bs-toggle="tooltip" title="fe fe-unlock"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-upload</Tooltip>}><i className="fe fe-upload"
                                            data-bs-toggle="tooltip" title="fe fe-upload"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe-upload-clou</Tooltip>}><i className="fe fe-upload-cloud"
                                            data-bs-toggle="tooltip" title="fe fe-upload-cloud"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-user</Tooltip>}><i className="fe fe-user"
                                            data-bs-toggle="tooltip" title="fe fe-user"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-user-check</Tooltip>}><i className="fe fe-user-check"
                                            data-bs-toggle="tooltip" title="fe fe-user-check"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>e fe-user-minus</Tooltip>}><i className="fe fe-user-minus"
                                            data-bs-toggle="tooltip" title="fe fe-user-minus"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-user-plus</Tooltip>}><i className="fe fe-user-plus"
                                            data-bs-toggle="tooltip" title="fe fe-user-plus"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-user-x</Tooltip>}><i className="fe fe-user-x"
                                            data-bs-toggle="tooltip" title="fe fe-user-x"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-users</Tooltip>}><i className="fe fe-users"
                                            data-bs-toggle="tooltip" title="fe fe-users"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-video</Tooltip>}><i className="fe fe-video"
                                            data-bs-toggle="tooltip" title="fe fe-video"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-video-off</Tooltip>}><i className="fe fe-video-off"
                                            data-bs-toggle="tooltip" title="fe fe-video-off"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> fe-voicemail</Tooltip>}><i className="fe fe-voicemail"
                                            data-bs-toggle="tooltip" title="fe fe-voicemail"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-volume</Tooltip>}><i className="fe fe-volume"
                                            data-bs-toggle="tooltip" title="fe fe-volume"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-volume-1</Tooltip>}><i className="fe fe-volume-1"
                                            data-bs-toggle="tooltip" title="fe fe-volume-1"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-volume-2</Tooltip>}><i className="fe fe-volume-2"
                                            data-bs-toggle="tooltip" title="fe fe-volume-2"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-volume-x</Tooltip>}><i className="fe fe-volume-x"
                                            data-bs-toggle="tooltip" title="fe fe-volume-x"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-watch</Tooltip>}><i className="fe fe-watch"
                                            data-bs-toggle="tooltip" title="fe fe-watch"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-wifi</Tooltip>}><i className="fe fe-wifi"
                                            data-bs-toggle="tooltip" title="fe fe-wifi"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-wifi-off</Tooltip>}><i className="fe fe-wifi-off"
                                            data-bs-toggle="tooltip" title="fe fe-wifi-off"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-wind</Tooltip>}><i className="fe fe-wind"
                                            data-bs-toggle="tooltip" title="fe fe-wind"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-x</Tooltip>}><i className="fe fe-x"
                                            data-bs-toggle="tooltip" title="fe fe-x"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-x-circle</Tooltip>}><i className="fe fe-x-circle"
                                            data-bs-toggle="tooltip" title="fe fe-x-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-x-square</Tooltip>}><i className="fe fe-x-square"
                                            data-bs-toggle="tooltip" title="fe fe-x-square"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-zap</Tooltip>}><i className="fe fe-zap"
                                            data-bs-toggle="tooltip" title="fe fe-zap"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-zap-off</Tooltip>}><i className="fe fe-zap-off"
                                            data-bs-toggle="tooltip" title="fe fe-zap-off"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-zoom-in</Tooltip>}><i className="fe fe-zoom-in"
                                            data-bs-toggle="tooltip" title="fe fe-zoom-in"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>fe fe-zoom-out</Tooltip>} ><i className="fe fe-zoom-out"
                                            data-bs-toggle="tooltip" title="fe fe-zoom-out"></i></OverlayTrigger></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
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

export default FeatherIcons;
