import React, { FC, Fragment } from 'react';
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';



interface SimpleLineIconsProps { }

const SimpleLineIcons: FC<SimpleLineIconsProps> = () => (
    <Fragment>
        <PageHeader title="Simple Line Icons" />
        <Row>
            <Col md={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Simpleline Icons</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col lg={12} sm={12} mb={4}>
                                <p className="mb-2">Simply beautiful open source icons. For more info <a
                                    className="fs-16 text-primary font-weight-bold"
                                    href="https://simplelineicons.github.io/" target="_blank" rel="noreferrer">click
                                    here</a>.</p>
                                <p><code>&lt;i className="si si-ICON_NAME"&gt;&lt;/i&gt;</code></p>
                            </Col>
                            <Col lg={12} sm={12}>
                                <div className="icons-list-wrap">
                                    <ul className="icons-list">
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> si-user
                                        </Tooltip>}><i className="si si-user"
                                            data-bs-toggle="tooltip" title="si-user"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip> si-people
                                        </Tooltip>}><i className="si si-people"
                                            data-bs-toggle="tooltip" title="si-people"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-user-female
                                        </Tooltip>}><i className="si si-user-female"
                                            data-bs-toggle="tooltip" title="si-user-female"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-user-follow
                                        </Tooltip>}><i className="si si-user-follow"
                                            data-bs-toggle="tooltip" title="si-user-follow"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-user-following</Tooltip>}><i className="si si-user-following"
                                            data-bs-toggle="tooltip" title="si-user-following"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-user-unfollow"</Tooltip>}><i className="si si-user-unfollow"
                                            data-bs-toggle="tooltip" title="si-user-unfollow"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-login
                                        </Tooltip>}><i className="si si-login"
                                            data-bs-toggle="tooltip" title="si-login"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-logout
                                        </Tooltip>}><i className="si si-logout"
                                            data-bs-toggle="tooltip" title="si-logout"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-emotsmile
                                        </Tooltip>}><i className="si si-emotsmile"
                                            data-bs-toggle="tooltip" title="si-emotsmile"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-phone
                                        </Tooltip>}><i className="si si-phone"
                                            data-bs-toggle="tooltip" title="si-phone"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-call-end
                                        </Tooltip>}><i className="si si-call-end"
                                            data-bs-toggle="tooltip" title="si-call-end"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-call-in
                                        </Tooltip>}><i className="si si-call-in"
                                            data-bs-toggle="tooltip" title="si-call-in"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-call-out
                                        </Tooltip>}><i className="si si-call-out"
                                            data-bs-toggle="tooltip" title="si-call-out"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-map
                                        </Tooltip>}><i className="si si-map"
                                            data-bs-toggle="tooltip" title="si-map"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-location-pin
                                        </Tooltip>}><i className="si si-location-pin"
                                            data-bs-toggle="tooltip" title="si-location-pin"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-direction
                                        </Tooltip>}><i className="si si-direction"
                                            data-bs-toggle="tooltip" title="si-direction"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>sisi si-directions
                                        </Tooltip>}><i className="si si-directions"
                                            data-bs-toggle="tooltip" title="si-directions"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-compass
                                        </Tooltip>}><i className="si si-compass"
                                            data-bs-toggle="tooltip" title="si-compass"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-layers
                                        </Tooltip>}><i className="si si-layers"
                                            data-bs-toggle="tooltip" title="si-layers"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-menu
                                        </Tooltip>}><i className="si si-menu"
                                            data-bs-toggle="tooltip" title="si-menu"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-list
                                        </Tooltip>}><i className="si si-list"
                                            data-bs-toggle="tooltip" title="si-list"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-options-vertical</Tooltip>}><i className="si si-options-vertical"
                                            data-bs-toggle="tooltip"
                                            title="si-options-vertical"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-options
                                        </Tooltip>}><i className="si si-options"
                                            data-bs-toggle="tooltip" title="si-options"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-arrow-down
                                        </Tooltip>}><i className="si si-arrow-down"
                                            data-bs-toggle="tooltip" title="si-arrow-down"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-arrow-left
                                        </Tooltip>}><i className="si si-arrow-left"
                                            data-bs-toggle="tooltip" title="si-arrow-left"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-arrow-right
                                        </Tooltip>}><i className="si si-arrow-right"
                                            data-bs-toggle="tooltip" title="si-arrow-right"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-arrow-up
                                        </Tooltip>}><i className="si si-arrow-up"
                                            data-bs-toggle="tooltip" title="si-arrow-up"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-arrow-up-circle</Tooltip>}><i className="si si-arrow-up-circle"
                                            data-bs-toggle="tooltip" title="si-arrow-up-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-arrow-left-circle</Tooltip>}><i className="si si-arrow-left-circle"
                                            data-bs-toggle="tooltip"
                                            title="si-arrow-left-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-arrow-right-cicle</Tooltip>}><i className="si si-arrow-right-circle"
                                            data-bs-toggle="tooltip"
                                            title="si-arrow-right-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-arrow-down-circle</Tooltip>}><i className="si si-arrow-down-circle"
                                            data-bs-toggle="tooltip"
                                            title="si-arrow-down-circle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-check
                                        </Tooltip>}><i className="si si-check"
                                            data-bs-toggle="tooltip" title="si-check"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-clock
                                        </Tooltip>}><i className="si si-clock"
                                            data-bs-toggle="tooltip" title="si-clock"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-plus
                                        </Tooltip>}><i className="si si-plus"
                                            data-bs-toggle="tooltip" title="si-plus"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-minus
                                        </Tooltip>}><i className="si si-minus"
                                            data-bs-toggle="tooltip" title="si-minus"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-close
                                        </Tooltip>}><i className="si si-close"
                                            data-bs-toggle="tooltip" title="si-close"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-event
                                        </Tooltip>}><i className="si si-event"
                                            data-bs-toggle="tooltip" title="si-event"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-exclamation
                                        </Tooltip>}><i className="si si-exclamation"
                                            data-bs-toggle="tooltip" title="si-exclamation"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-organization
                                        </Tooltip>}><i className="si si-organization"
                                            data-bs-toggle="tooltip" title="si-organization"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-trophy
                                        </Tooltip>}><i className="si si-trophy"
                                            data-bs-toggle="tooltip" title="si-trophy"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-screen-smartphone</Tooltip>}><i className="si si-screen-smartphone"
                                            data-bs-toggle="tooltip"
                                            title="si-screen-smartphone"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-screen-desktop</Tooltip>}><i className="si si-screen-desktop"
                                            data-bs-toggle="tooltip" title="si-screen-desktop"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-plane
                                        </Tooltip>}><i className="si si-plane"
                                            data-bs-toggle="tooltip" title="si-plane"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-notebook
                                        </Tooltip>}><i className="si si-notebook"
                                            data-bs-toggle="tooltip" title="si-notebook"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-mustache
                                        </Tooltip>}><i className="si si-mustache"
                                            data-bs-toggle="tooltip" title="si-mustache"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-mouse
                                        </Tooltip>}><i className="si si-mouse"
                                            data-bs-toggle="tooltip" title="si-mouse"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-magnet
                                        </Tooltip>}><i className="si si-magnet"
                                            data-bs-toggle="tooltip" title="si-magnet"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-energy
                                        </Tooltip>}><i className="si si-energy"
                                            data-bs-toggle="tooltip" title="si-energy"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-disc
                                        </Tooltip>}><i className="si si-disc"
                                            data-bs-toggle="tooltip" title="si-disc"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-cursor
                                        </Tooltip>}><i className="si si-cursor"
                                            data-bs-toggle="tooltip" title="si-cursor"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-cursor-move"
                                            </Tooltip>}><i className="si si-cursor-move"
                                                data-bs-toggle="tooltip" title="si-cursor-move"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-crop
                                        </Tooltip>}><i className="si si-crop"
                                            data-bs-toggle="tooltip" title="si-crop"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-chemistry
                                        </Tooltip>}><i className="si si-chemistry"
                                            data-bs-toggle="tooltip" title="si-chemistry"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-speedometer
                                        </Tooltip>}><i className="si si-speedometer"
                                            data-bs-toggle="tooltip" title="si-speedometer"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-shield
                                        </Tooltip>}><i className="si si-shield"
                                            data-bs-toggle="tooltip" title="si-shield"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-screen-tablet</Tooltip>}><i className="si si-screen-tablet"
                                            data-bs-toggle="tooltip" title="si-screen-tablet"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-magic-wand
                                        </Tooltip>}><i className="si si-magic-wand"
                                            data-bs-toggle="tooltip" title="si-magic-wand"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-hourglass
                                        </Tooltip>}><i className="si si-hourglass"
                                            data-bs-toggle="tooltip" title="si-hourglass"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-graduation
                                        </Tooltip>}><i className="si si-graduation"
                                            data-bs-toggle="tooltip" title="si-graduation"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-ghost
                                        </Tooltip>}><i className="si si-ghost"
                                            data-bs-toggle="tooltip" title="si-ghost"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-game-controller</Tooltip>}><i className="si si-game-controller"
                                            data-bs-toggle="tooltip" title="si-game-controller"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-fire
                                        </Tooltip>}><i className="si si-fire"
                                            data-bs-toggle="tooltip" title="si-fire"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-eyeglass
                                        </Tooltip>}><i className="si si-eyeglass"
                                            data-bs-toggle="tooltip" title="si-eyeglass"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-envelope-open</Tooltip>}><i className="si si-envelope-open"
                                            data-bs-toggle="tooltip" title="si-envelope-open"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-envelope-letter</Tooltip>}><i className="si si-envelope-letter"
                                            data-bs-toggle="tooltip" title="si-envelope-letter"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-bell
                                        </Tooltip>}><i className="si si-bell"
                                            data-bs-toggle="tooltip" title="si-bell"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-badge
                                        </Tooltip>}><i className="si si-badge"
                                            data-bs-toggle="tooltip" title="si-badge"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-anchor
                                        </Tooltip>}><i className="si si-anchor"
                                            data-bs-toggle="tooltip" title="si-anchor"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-wallet
                                        </Tooltip>}><i className="si si-wallet"
                                            data-bs-toggle="tooltip" title="si-wallet"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-vector
                                        </Tooltip>}><i className="si si-vector"
                                            data-bs-toggle="tooltip" title="si-vector"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-speech
                                        </Tooltip>}><i className="si si-speech"
                                            data-bs-toggle="tooltip" title="si-speech"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-puzzle
                                        </Tooltip>}><i className="si si-puzzle"
                                            data-bs-toggle="tooltip" title="si-puzzle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-printer
                                        </Tooltip>}><i className="si si-printer"
                                            data-bs-toggle="tooltip" title="si-printer"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-present
                                        </Tooltip>}><i className="si si-present"
                                            data-bs-toggle="tooltip" title="si-present"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-playlist
                                        </Tooltip>}><i className="si si-playlist"
                                            data-bs-toggle="tooltip" title="si-playlist"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-pin
                                        </Tooltip>}><i className="si si-pin"
                                            data-bs-toggle="tooltip" title="si-pin"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-picture
                                        </Tooltip>}><i className="si si-picture"
                                            data-bs-toggle="tooltip" title="si-picture"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-handbag
                                        </Tooltip>}><i className="si si-handbag"
                                            data-bs-toggle="tooltip" title="si-handbag"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-globe-alt
                                        </Tooltip>}><i className="si si-globe-alt"
                                            data-bs-toggle="tooltip" title="si-globe-alt"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-globe
                                        </Tooltip>}><i className="si si-globe"
                                            data-bs-toggle="tooltip" title="si-globe"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-folder-alt
                                        </Tooltip>}><i className="si si-folder-alt"
                                            data-bs-toggle="tooltip" title="si-folder-alt"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-folder
                                        </Tooltip>}><i className="si si-folder"
                                            data-bs-toggle="tooltip" title="si-folder"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-film
                                        </Tooltip>}><i className="si si-film"
                                            data-bs-toggle="tooltip" title="si-film"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-feed
                                        </Tooltip>}><i className="si si-feed"
                                            data-bs-toggle="tooltip" title="si-feed"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-drop
                                        </Tooltip>}><i className="si si-drop"
                                            data-bs-toggle="tooltip" title="si-drop"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-drawer
                                        </Tooltip>}><i className="si si-drawer"
                                            data-bs-toggle="tooltip" title="si-drawer"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-docs
                                        </Tooltip>}><i className="si si-docs"
                                            data-bs-toggle="tooltip" title="si-docs"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-doc
                                        </Tooltip>}><i className="si si-doc"
                                            data-bs-toggle="tooltip" title="si-doc"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-diamond
                                        </Tooltip>}><i className="si si-diamond"
                                            data-bs-toggle="tooltip" title="si-diamond"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-cup
                                        </Tooltip>}><i className="si si-cup"
                                            data-bs-toggle="tooltip" title="si-cup"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-calculator
                                        </Tooltip>}><i className="si si-calculator"
                                            data-bs-toggle="tooltip" title="si-calculator"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-bubbles
                                        </Tooltip>}><i className="si si-bubbles"
                                            data-bs-toggle="tooltip" title="si-bubbles"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-briefcase
                                        </Tooltip>}><i className="si si-briefcase"
                                            data-bs-toggle="tooltip" title="si-briefcase"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-book-open
                                        </Tooltip>}><i className="si si-book-open"
                                            data-bs-toggle="tooltip" title="si-book-open"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-basket-loaded</Tooltip>}><i className="si si-basket-loaded"
                                            data-bs-toggle="tooltip" title="si-basket-loaded"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-basket
                                        </Tooltip>}><i className="si si-basket"
                                            data-bs-toggle="tooltip" title="si-basket"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-bag
                                        </Tooltip>}><i className="si si-bag"
                                            data-bs-toggle="tooltip" title="si-bag"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-action-undo
                                        </Tooltip>}><i className="si si-action-undo"
                                            data-bs-toggle="tooltip" title="si-action-undo"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-action-redo
                                        </Tooltip>}><i className="si si-action-redo"
                                            data-bs-toggle="tooltip" title="si-action-redo"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-wrench
                                        </Tooltip>}><i className="si si-wrench"
                                            data-bs-toggle="tooltip" title="si-wrench"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-umbrella
                                        </Tooltip>}><i className="si si-umbrella"
                                            data-bs-toggle="tooltip" title="si-umbrella"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-trash
                                        </Tooltip>}><i className="si si-trash"
                                            data-bs-toggle="tooltip" title="si-trash"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-tag
                                        </Tooltip>}><i className="si si-tag"
                                            data-bs-toggle="tooltip" title="si-tag"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-support
                                        </Tooltip>}><i className="si si-support"
                                            data-bs-toggle="tooltip" title="si-support"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-frame
                                        </Tooltip>}><i className="si si-frame"
                                            data-bs-toggle="tooltip" title="si-frame"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-size-fullscree</Tooltip>}><i className="si si-size-fullscreen"
                                            data-bs-toggle="tooltip" title="si-size-fullscreen"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-size-actual
                                        </Tooltip>}><i className="si si-size-actual"
                                            data-bs-toggle="tooltip" title="si-size-actual"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-shuffle
                                        </Tooltip>}><i className="si si-shuffle"
                                            data-bs-toggle="tooltip" title="si-shuffle"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-share-alt
                                        </Tooltip>}><i className="si si-share-alt"
                                            data-bs-toggle="tooltip" title="si-share-alt"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-share
                                        </Tooltip>}><i className="si si-share"
                                            data-bs-toggle="tooltip" title="si-share"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-rocket
                                        </Tooltip>}><i className="si si-rocket"
                                            data-bs-toggle="tooltip" title="si-rocket"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-question
                                        </Tooltip>}><i className="si si-question"
                                            data-bs-toggle="tooltip" title="si-question"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-pie-chart
                                        </Tooltip>}><i className="si si-pie-chart"
                                            data-bs-toggle="tooltip" title="si-pie-chart"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-pencil
                                        </Tooltip>}><i className="si si-pencil"
                                            data-bs-toggle="tooltip" title="si-pencil"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-note
                                        </Tooltip>}><i className="si si-note"
                                            data-bs-toggle="tooltip" title="si-note"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-loop
                                        </Tooltip>}><i className="si si-loop"
                                            data-bs-toggle="tooltip" title="si-loop"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-home
                                        </Tooltip>}><i className="si si-home"
                                            data-bs-toggle="tooltip" title="si-home"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-grid
                                        </Tooltip>}><i className="si si-grid"
                                            data-bs-toggle="tooltip" title="si-grid"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-graph
                                        </Tooltip>}><i className="si si-graph"
                                            data-bs-toggle="tooltip" title="si-graph"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-microphone
                                        </Tooltip>}><i className="si si-microphone"
                                            data-bs-toggle="tooltip" title="si-microphone"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-music-tone-alt</Tooltip>}><i className="si si-music-tone-alt"
                                            data-bs-toggle="tooltip" title="si-music-tone-alt"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-music-tone
                                        </Tooltip>}><i className="si si-music-tone"
                                            data-bs-toggle="tooltip" title="si-music-tone"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-earphones-alt</Tooltip>}><i className="si si-earphones-alt"
                                            data-bs-toggle="tooltip" title="si-earphones-alt"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-earphones
                                        </Tooltip>}><i className="si si-earphones"
                                            data-bs-toggle="tooltip" title="si-earphones"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-equalizer
                                        </Tooltip>}><i className="si si-equalizer"
                                            data-bs-toggle="tooltip" title="si-equalizer"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-like
                                        </Tooltip>}><i className="si si-like"
                                            data-bs-toggle="tooltip" title="si-like"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-dislike
                                        </Tooltip>}><i className="si si-dislike"
                                            data-bs-toggle="tooltip" title="si-dislike"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-control-start</Tooltip>}><i className="si si-control-start"
                                            data-bs-toggle="tooltip" title="si-control-start"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-control-rewind</Tooltip>}><i className="si si-control-rewind"
                                            data-bs-toggle="tooltip" title="si-control-rewind"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-control-play
                                        </Tooltip>}><i className="si si-control-play"
                                            data-bs-toggle="tooltip" title="si-control-play"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-control-pause</Tooltip>}><i className="si si-control-pause"
                                            data-bs-toggle="tooltip" title="si-control-pause"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-control-forward</Tooltip>}><i className="si si-control-forward"
                                            data-bs-toggle="tooltip" title="si-control-forward"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-control-end
                                        </Tooltip>}><i className="si si-control-end"
                                            data-bs-toggle="tooltip" title="si-control-end"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-volume-1
                                        </Tooltip>}><i className="si si-volume-1"
                                            data-bs-toggle="tooltip" title="si-volume-1"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-volume-2
                                        </Tooltip>}><i className="si si-volume-2"
                                            data-bs-toggle="tooltip" title="si-volume-2"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-volume-off
                                        </Tooltip>}><i className="si si-volume-off"
                                            data-bs-toggle="tooltip" title="si-volume-off"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-calendar
                                        </Tooltip>}><i className="si si-calendar"
                                            data-bs-toggle="tooltip" title="si-calendar"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-bulb
                                        </Tooltip>}><i className="si si-bulb"
                                            data-bs-toggle="tooltip" title="si-bulb"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-chart
                                        </Tooltip>}><i className="si si-chart"
                                            data-bs-toggle="tooltip" title="si-chart"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-ban
                                        </Tooltip>}><i className="si si-ban"
                                            data-bs-toggle="tooltip" title="si-ban"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-bubble
                                        </Tooltip>}><i className="si si-bubble"
                                            data-bs-toggle="tooltip" title="si-bubble"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-camrecorder
                                        </Tooltip>}><i className="si si-camrecorder"
                                            data-bs-toggle="tooltip" title="si-camrecorder"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-camera
                                        </Tooltip>}><i className="si si-camera"
                                            data-bs-toggle="tooltip" title="si-camera"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-cloud-download</Tooltip>}>
                                            <i className="si si-cloud-download"
                                            data-bs-toggle="tooltip" title="si-cloud-download"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-cloud-upload
                                        </Tooltip>}><i className="si si-cloud-upload"
                                            data-bs-toggle="tooltip" title="si-cloud-upload"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-envelope
                                        </Tooltip>}><i className="si si-envelope"
                                            data-bs-toggle="tooltip" title="si-envelope"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-eye
                                        </Tooltip>}><i className="si si-eye"
                                            data-bs-toggle="tooltip" title="si-eye"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-flag
                                        </Tooltip>}><i className="si si-flag"
                                            data-bs-toggle="tooltip" title="si-flag"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-heart
                                        </Tooltip>}><i className="si si-heart"
                                            data-bs-toggle="tooltip" title="si-heart"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-info
                                        </Tooltip>}><i className="si si-info"
                                            data-bs-toggle="tooltip" title="si-info"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-key
                                        </Tooltip>}><i className="si si-key"
                                            data-bs-toggle="tooltip" title="si-key"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-link
                                        </Tooltip>}><i className="si si-link"
                                            data-bs-toggle="tooltip" title="si-link"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-lock
                                        </Tooltip>}><i className="si si-lock"
                                            data-bs-toggle="tooltip" title="si-lock"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-lock-open
                                        </Tooltip>}><i className="si si-lock-open"
                                            data-bs-toggle="tooltip" title="si-lock-open"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-magnifier
                                        </Tooltip>}><i className="si si-magnifier"
                                            data-bs-toggle="tooltip" title="si-magnifier"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-magnifier-add</Tooltip>}><i className="si si-magnifier-add"
                                            data-bs-toggle="tooltip" title="si-magnifier-add"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-magnifier-remove</Tooltip>}><i className="si si-magnifier-remove"
                                            data-bs-toggle="tooltip"
                                            title="si-magnifier-remove"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-paper-clip
                                        </Tooltip>}><i className="si si-paper-clip"
                                            data-bs-toggle="tooltip" title="si-paper-clip"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-paper-plane
                                        </Tooltip>}><i className="si si-paper-plane"
                                            data-bs-toggle="tooltip" title="si-paper-plane"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-power
                                        </Tooltip>}><i className="si si-power"
                                            data-bs-toggle="tooltip" title="si-power"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-refresh
                                        </Tooltip>}><i className="si si-refresh"
                                            data-bs-toggle="tooltip" title="si-refresh"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-reload
                                        </Tooltip>}><i className="si si-reload"
                                            data-bs-toggle="tooltip" title="si-reload"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-settings
                                        </Tooltip>}><i className="si si-settings"
                                            data-bs-toggle="tooltip" title="si-settings"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-star
                                        </Tooltip>}><i className="si si-star"
                                            data-bs-toggle="tooltip" title="si-star"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-symbol-female</Tooltip>}><i className="si si-symbol-female"
                                            data-bs-toggle="tooltip" title="si-symbol-female"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-symbol-male
                                        </Tooltip>}><i className="si si-symbol-male"
                                            data-bs-toggle="tooltip" title="si-symbol-male"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-target
                                        </Tooltip>}><i className="si si-target"
                                            data-bs-toggle="tooltip" title="si-target"></i></OverlayTrigger></li>
                                        <li className="icons-list-item"><OverlayTrigger placement="top" overlay={<Tooltip>si si-credit-card
                                        </Tooltip>}><i className="si si-credit-card"
                                            data-bs-toggle="tooltip" title="si-credit-card"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">  <OverlayTrigger placement="top" overlay={<Tooltip>si si-paypal
                                        </Tooltip>}><i className="si si-paypal"
                                            data-bs-toggle="tooltip" title="si-paypal"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-tumblr</Tooltip>}><i className="si si-social-tumblr"
                                                data-bs-toggle="tooltip" title="si-social-tumblr"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-twitter</Tooltip>}><i className="si si-social-twitter"
                                                data-bs-toggle="tooltip" title="si-social-twitter"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-facebook</Tooltip>}><i className="si si-social-facebook"
                                                data-bs-toggle="tooltip" title="si-social-facebook"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-instagram</Tooltip>}><i className="si si-social-instagram"
                                                data-bs-toggle="tooltip"
                                                title="si-social-instagram"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-linkedin</Tooltip>}><i className="si si-social-linkedin"
                                                data-bs-toggle="tooltip" title="si-social-linkedin"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-pinterest</Tooltip>}><i className="si si-social-pinterest"
                                                data-bs-toggle="tooltip"
                                                title="si-social-pinterest"></i>
                                            </OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-github</Tooltip>}><i className="si si-social-github"
                                                data-bs-toggle="tooltip" title="si-social-github"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-google</Tooltip>}><i className="si si-social-google"
                                                data-bs-toggle="tooltip" title="si-social-google"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-reddit</Tooltip>}><i className="si si-social-reddit"
                                                data-bs-toggle="tooltip" title="si-social-reddit"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-skype
                                            </Tooltip>}><i className="si si-social-skype"
                                                data-bs-toggle="tooltip" title="si-social-skype"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-dribbble</Tooltip>}><i className="si si-social-dribbble"
                                                data-bs-toggle="tooltip" title="si-social-dribbble"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-behance</Tooltip>}><i className="si si-social-behance"
                                                data-bs-toggle="tooltip" title="si-social-behance"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-foursqare</Tooltip>}><i className="si si-social-foursqare"
                                                data-bs-toggle="tooltip"
                                                title="si-social-foursqare"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-soundcloud</Tooltip>}><i className="si si-social-soundcloud"
                                                data-bs-toggle="tooltip"
                                                title="si-social-soundcloud"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-spotify</Tooltip>}><i className="si si-social-spotify"
                                                data-bs-toggle="tooltip" title="si-social-spotify"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-stumbleupon</Tooltip>}><i className="si si-social-stumbleupon"
                                                data-bs-toggle="tooltip"
                                                title="si-social-stumbleupon"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-youtube</Tooltip>}><i className="si si-social-youtube"
                                                data-bs-toggle="tooltip" title="si-social-youtube"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-dropbox</Tooltip>}><i className="si si-social-dropbox"
                                                data-bs-toggle="tooltip" title="si-social-dropbox"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-vkontak</Tooltip>}><i className="si si-social-vkontakte"
                                                data-bs-toggle="tooltip"
                                                title="si-social-vkontakte"></i></OverlayTrigger></li>
                                        <li className="icons-list-item">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>si si-social-steam"
                                            </Tooltip>}><i className="si si-social-steam"
                                                data-bs-toggle="tooltip" title="si-social-steam"></i></OverlayTrigger></li>
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

export default SimpleLineIcons;
