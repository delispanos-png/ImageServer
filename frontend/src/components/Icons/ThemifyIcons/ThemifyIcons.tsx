import React, { FC, Fragment } from 'react';
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';



interface ThemifyIconsProps {}

const ThemifyIcons: FC<ThemifyIconsProps> = () => (
  <Fragment>
  <PageHeader  title="Themify Icons" />
  <Row>
    <Col md={12}>
      <Card>
        <Card.Header>
          <Card.Title>Themify Icons</Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col lg={12} sm={12} mb={4}>
              <p className="mb-2">Simply beautiful open source icons. For more info <a
                  className="fs-16 text-primary font-weight-bold"
                  href="https://themify.me/themify-icons" target="_blank" rel="noreferrer">click
                  here</a>.</p>
              <p><code>&lt;i className="ti-ICON_NAME"&gt;&lt;/i&gt;</code></p>
            </Col>
            <Col lg={12} sm={12}>
              <div className="icons-list-wrap">
                <ul className="icons-list">
                  <li className="icons-list-item"><OverlayTrigger placement="top"   overlay={<Tooltip>ti-arrow-up</Tooltip>} ><i className="ti-arrow-up"
                      data-bs-toggle="tooltip" title="ti-arrow-up"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrow-right</Tooltip>} ><i className="ti-arrow-right"
                      data-bs-toggle="tooltip" title="ti-arrow-right"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrow-left</Tooltip>} ><i className="ti-arrow-left"
                      data-bs-toggle="tooltip" title="ti-arrow-left"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrow-down</Tooltip>} ><i className="ti-arrow-down"
                      data-bs-toggle="tooltip" title="ti-arrow-down"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrows-vertical</Tooltip>} ><i className="ti-arrows-vertical"
                      data-bs-toggle="tooltip" title="ti-arrows-vertical"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrows-horizontal</Tooltip>} ><i className="ti-arrows-horizontal"
                      data-bs-toggle="tooltip"
                      title="ti-arrows-horizontal"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>="ti-angle-up</Tooltip>} ><i className="ti-angle-up"
                      data-bs-toggle="tooltip" title="ti-angle-up"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-angle-right</Tooltip>} ><i className="ti-angle-right"
                      data-bs-toggle="tooltip" title="ti-angle-right"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-angle-left</Tooltip>} ><i className="ti-angle-left"
                      data-bs-toggle="tooltip" title="ti-angle-left"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-angle-down</Tooltip>} ><i className="ti-angle-down"
                      data-bs-toggle="tooltip" title="ti-angle-down"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-angle-double-up</Tooltip>} ><i className="ti-angle-double-up"
                      data-bs-toggle="tooltip" title="ti-angle-double-up"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-angle-double-right</Tooltip>} ><i className="ti-angle-double-right"
                      data-bs-toggle="tooltip"
                      title="ti-angle-double-right"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-angle-double-left</Tooltip>} ><i className="ti-angle-double-left"
                      data-bs-toggle="tooltip"
                      title="ti-angle-double-left"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-angle-double-down</Tooltip>} ><i className="ti-angle-double-down"
                      data-bs-toggle="tooltip"
                      title="ti-angle-double-down"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-move</Tooltip>} ><i className="ti-move"
                      data-bs-toggle="tooltip" title="ti-move"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-fullscreen</Tooltip>} ><i className="ti-fullscreen"
                      data-bs-toggle="tooltip" title="ti-fullscreen"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrow-top-right</Tooltip>} ><i className="ti-arrow-top-right"
                      data-bs-toggle="tooltip" title="ti-arrow-top-right"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrow-top-left</Tooltip>} ><i className="ti-arrow-top-left"
                      data-bs-toggle="tooltip" title="ti-arrow-top-left"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrow-circle-up</Tooltip>} ><i className="ti-arrow-circle-up"
                      data-bs-toggle="tooltip" title="ti-arrow-circle-up"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrow-circle-right</Tooltip>} ><i className="ti-arrow-circle-right"
                      data-bs-toggle="tooltip"
                      title="ti-arrow-circle-right"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrow-circle-left</Tooltip>} ><i className="ti-arrow-circle-left"
                      data-bs-toggle="tooltip"
                      title="ti-arrow-circle-left"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrow-circle-down</Tooltip>} ><i className="ti-arrow-circle-down"
                      data-bs-toggle="tooltip"
                      title="ti-arrow-circle-down"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-arrows-corner</Tooltip>} ><i className="ti-arrows-corner"
                      data-bs-toggle="tooltip" title="ti-arrows-corner"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-split-v</Tooltip>} ><i className="ti-split-v"
                      data-bs-toggle="tooltip" title="ti-split-v"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-split-v-alt</Tooltip>} ><i className="ti-split-v-alt"
                      data-bs-toggle="tooltip" title="ti-split-v-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>e="ti-split-h</Tooltip>} ><i className="ti-split-h"
                      data-bs-toggle="tooltip" title="ti-split-h"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-hand-point-up</Tooltip>} ><i className="ti-hand-point-up"
                      data-bs-toggle="tooltip" title="ti-hand-point-up"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-hand-point-right</Tooltip>} ><i className="ti-hand-point-right"
                      data-bs-toggle="tooltip"
                      title="ti-hand-point-right"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-hand-point-left</Tooltip>} ><i className="ti-hand-point-left"
                      data-bs-toggle="tooltip" title="ti-hand-point-left"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-hand-point-down</Tooltip>} ><i className="ti-hand-point-down"
                      data-bs-toggle="tooltip" title="ti-hand-point-down"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-back-right</Tooltip>} ><i className="ti-back-right"
                      data-bs-toggle="tooltip" title="ti-back-right"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>"ti-back-left</Tooltip>} ><i className="ti-back-left"
                      data-bs-toggle="tooltip" title="ti-back-left"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-exchange-vertical</Tooltip>} ><i className="ti-exchange-vertical"
                      data-bs-toggle="tooltip"
                      title="ti-exchange-vertical"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-wand</Tooltip>} ><i className="ti-wand"
                      data-bs-toggle="tooltip" title="ti-wand"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-save</Tooltip>} ><i className="ti-save"
                      data-bs-toggle="tooltip" title="ti-save"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-save-alt</Tooltip>} ><i className="ti-save-alt"
                      data-bs-toggle="tooltip" title="ti-save-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-direction</Tooltip>} ><i className="ti-direction"
                      data-bs-toggle="tooltip" title="ti-direction"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-direction-alt</Tooltip>} ><i className="ti-direction-alt"
                      data-bs-toggle="tooltip" title="ti-direction-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-user</Tooltip>} ><i className="ti-user"
                      data-bs-toggle="tooltip" title="ti-user"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-link</Tooltip>} ><i className="ti-link"
                      data-bs-toggle="tooltip" title="ti-link"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-unlink</Tooltip>} ><i className="ti-unlink"
                      data-bs-toggle="tooltip" title="ti-unlink"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-trash</Tooltip>} ><i className="ti-trash"
                      data-bs-toggle="tooltip" title="ti-trash"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-target</Tooltip>} ><i className="ti-target"
                      data-bs-toggle="tooltip" title="ti-target"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-tag</Tooltip>} ><i className="ti-tag"
                      data-bs-toggle="tooltip" title="ti-tag"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-desktop</Tooltip>} ><i className="ti-desktop"
                      data-bs-toggle="tooltip" title="ti-desktop"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-tablet</Tooltip>} ><i className="ti-tablet"
                      data-bs-toggle="tooltip" title="ti-tablet"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-mobile</Tooltip>} ><i className="ti-mobile"
                      data-bs-toggle="tooltip" title="ti-mobile"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-email</Tooltip>} ><i className="ti-email"
                      data-bs-toggle="tooltip" title="ti-email"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-star</Tooltip>} ><i className="ti-star"
                      data-bs-toggle="tooltip" title="ti-star"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-spray</Tooltip>} ><i className="ti-spray"
                      data-bs-toggle="tooltip" title="ti-spray"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-signal</Tooltip>} ><i className="ti-signal"
                      data-bs-toggle="tooltip" title="ti-signal"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-shopping-cart</Tooltip>} ><i className="ti-shopping-cart"
                      data-bs-toggle="tooltip" title="ti-shopping-cart"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-shopping-cart-full</Tooltip>} ><i className="ti-shopping-cart-full"
                      data-bs-toggle="tooltip"
                      title="ti-shopping-cart-full"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-settings</Tooltip>} ><i className="ti-settings"
                      data-bs-toggle="tooltip" title="ti-settings"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-search</Tooltip>} ><i className="ti-search"
                      data-bs-toggle="tooltip" title="ti-search"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-zoom-in</Tooltip>} ><i className="ti-zoom-in"
                      data-bs-toggle="tooltip" title="ti-zoom-in"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-zoom-out</Tooltip>} ><i className="ti-zoom-out"
                      data-bs-toggle="tooltip" title="ti-zoom-out"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-cut</Tooltip>} ><i className="ti-cut"
                      data-bs-toggle="tooltip" title="ti-cut"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-ruler</Tooltip>} ><i className="ti-ruler"
                      data-bs-toggle="tooltip" title="ti-ruler"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-ruler-alt-2</Tooltip>} ><i className="ti-ruler-alt-2"
                      data-bs-toggle="tooltip" title="ti-ruler-alt-2"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-ruler-pencil</Tooltip>} ><i className="ti-ruler-pencil"
                      data-bs-toggle="tooltip" title="ti-ruler-pencil"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-ruler-alt</Tooltip>} ><i className="ti-ruler-alt"
                      data-bs-toggle="tooltip" title="ti-ruler-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-bookmark</Tooltip>} ><i className="ti-bookmark"
                      data-bs-toggle="tooltip" title="ti-bookmark"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-bookmark-alt</Tooltip>} ><i className="ti-bookmark-alt"
                      data-bs-toggle="tooltip" title="ti-bookmark-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-reload</Tooltip>} ><i className="ti-reload"
                      data-bs-toggle="tooltip" title="ti-reload"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-plus</Tooltip>} ><i className="ti-plus"
                      data-bs-toggle="tooltip" title="ti-plus"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-minus</Tooltip>} ><i className="ti-minus"
                      data-bs-toggle="tooltip" title="ti-minus"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-close</Tooltip>} ><i className="ti-close"
                      data-bs-toggle="tooltip" title="ti-close"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-pin</Tooltip>} ><i className="ti-pin"
                      data-bs-toggle="tooltip" title="ti-pin"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-pencil</Tooltip>} ><i className="ti-pencil"
                      data-bs-toggle="tooltip" title="ti-pencil"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-pencil-alt</Tooltip>} ><i className="ti-pencil-alt"
                      data-bs-toggle="tooltip" title="ti-pencil-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-paint-roller</Tooltip>} ><i className="ti-paint-roller"
                      data-bs-toggle="tooltip" title="ti-paint-roller"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-paint-bucket</Tooltip>} ><i className="ti-paint-bucket"
                      data-bs-toggle="tooltip" title="ti-paint-bucket"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-na
</Tooltip>} ><i className="ti-na"
                      data-bs-toggle="tooltip" title="ti-na"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-medall</Tooltip>} ><i className="ti-medall"
                      data-bs-toggle="tooltip" title="ti-medall"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-medall-alt</Tooltip>} ><i className="ti-medall-alt"
                      data-bs-toggle="tooltip" title="ti-medall-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-marker</Tooltip>} ><i className="ti-marker"
                      data-bs-toggle="tooltip" title="ti-marker"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-marker-alt</Tooltip>} ><i className="ti-marker-alt"
                      data-bs-toggle="tooltip" title="ti-marker-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-lock</Tooltip>} ><i className="ti-lock"
                      data-bs-toggle="tooltip" title="ti-lock"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-unlock</Tooltip>} ><i className="ti-unlock"
                      data-bs-toggle="tooltip" title="ti-unlock"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-location-arrow</Tooltip>} ><i className="ti-location-arrow"
                      data-bs-toggle="tooltip" title="ti-location-arrow"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-layout</Tooltip>} ><i className="ti-layout"
                      data-bs-toggle="tooltip" title="ti-layout"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-layers</Tooltip>} ><i className="ti-layers"
                      data-bs-toggle="tooltip" title="ti-layers"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-layers-alt</Tooltip>} ><i className="ti-layers-alt"
                      data-bs-toggle="tooltip" title="ti-layers-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-key</Tooltip>} ><i className="ti-key"
                      data-bs-toggle="tooltip" title="ti-key"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-image</Tooltip>} ><i className="ti-image"
                      data-bs-toggle="tooltip" title="ti-image"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-heart</Tooltip>} ><i className="ti-heart"
                      data-bs-toggle="tooltip" title="ti-heart"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-heart-broken</Tooltip>} ><i className="ti-heart-broken"
                      data-bs-toggle="tooltip" title="ti-heart-broken"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-hand-stop</Tooltip>} ><i className="ti-hand-stop"
                      data-bs-toggle="tooltip" title="ti-hand-stop"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-hand-open</Tooltip>} ><i className="ti-hand-open"
                      data-bs-toggle="tooltip" title="ti-hand-open"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-hand-drag</Tooltip>} ><i className="ti-hand-drag"
                      data-bs-toggle="tooltip" title="ti-hand-drag"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-flag</Tooltip>} ><i className="ti-flag"
                      data-bs-toggle="tooltip" title="ti-flag"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-flag-alt</Tooltip>} ><i className="ti-flag-alt"
                      data-bs-toggle="tooltip" title="ti-flag-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-flag-alt-2</Tooltip>} ><i className="ti-flag-alt-2"
                      data-bs-toggle="tooltip" title="ti-flag-alt-2"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-eye</Tooltip>} ><i className="ti-eye"
                      data-bs-toggle="tooltip" title="ti-eye"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-import</Tooltip>} ><i className="ti-import"
                      data-bs-toggle="tooltip" title="ti-import"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-export</Tooltip>} ><i className="ti-export"
                      data-bs-toggle="tooltip" title="ti-export"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-cup</Tooltip>} ><i className="ti-cup"
                      data-bs-toggle="tooltip" title="ti-cup"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-crown</Tooltip>} ><i className="ti-crown"
                      data-bs-toggle="tooltip" title="ti-crown"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-comments</Tooltip>} ><i className="ti-comments"
                      data-bs-toggle="tooltip" title="ti-comments"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-comment</Tooltip>} ><i className="ti-comment"
                      data-bs-toggle="tooltip" title="ti-comment"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-comment-alt</Tooltip>} ><i className="ti-comment-alt"
                      data-bs-toggle="tooltip" title="ti-comment-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-thought</Tooltip>} ><i className="ti-thought"
                      data-bs-toggle="tooltip" title="ti-thought"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-clip</Tooltip>} ><i className="ti-clip"
                      data-bs-toggle="tooltip" title="ti-clip"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-check</Tooltip>} ><i className="ti-check"
                      data-bs-toggle="tooltip" title="ti-check"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-check-box</Tooltip>} ><i className="ti-check-box"
                      data-bs-toggle="tooltip" title="ti-check-box"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-camera</Tooltip>} ><i className="ti-camera"
                      data-bs-toggle="tooltip" title="ti-camera"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-announcement</Tooltip>} ><i className="ti-announcement"
                      data-bs-toggle="tooltip" title="ti-announcement"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-brush</Tooltip>} ><i className="ti-brush"
                      data-bs-toggle="tooltip" title="ti-brush"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-brush-alt</Tooltip>} ><i className="ti-brush-alt"
                      data-bs-toggle="tooltip" title="ti-brush-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-palette</Tooltip>} ><i className="ti-palette"
                      data-bs-toggle="tooltip" title="ti-palette"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-briefcase</Tooltip>} ><i className="ti-briefcase"
                      data-bs-toggle="tooltip" title="ti-briefcase"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-bolt</Tooltip>} ><i className="ti-bolt"
                      data-bs-toggle="tooltip" title="ti-bolt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-bolt-alt</Tooltip>} ><i className="ti-bolt-alt"
                      data-bs-toggle="tooltip" title="ti-bolt-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-blackboard</Tooltip>} ><i className="ti-blackboard"
                      data-bs-toggle="tooltip" title="ti-blackboard"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-bag</Tooltip>} ><i className="ti-bag"
                      data-bs-toggle="tooltip" title="ti-bag"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-world</Tooltip>} ><i className="ti-world"
                      data-bs-toggle="tooltip" title="ti-world"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-wheelchair</Tooltip>} ><i className="ti-wheelchair"
                      data-bs-toggle="tooltip" title="ti-wheelchair"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-car</Tooltip>} ><i className="ti-car"
                      data-bs-toggle="tooltip" title="ti-car"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-truck</Tooltip>} ><i className="ti-truck"
                      data-bs-toggle="tooltip" title="ti-truck"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-timer</Tooltip>} ><i className="ti-timer"
                      data-bs-toggle="tooltip" title="ti-timer"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-ticket</Tooltip>} ><i className="ti-ticket"
                      data-bs-toggle="tooltip" title="ti-ticket"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-thumb-up</Tooltip>} ><i className="ti-thumb-up"
                      data-bs-toggle="tooltip" title="ti-thumb-up"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-thumb-down</Tooltip>} ><i className="ti-thumb-down"
                      data-bs-toggle="tooltip" title="ti-thumb-down"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-stats-up</Tooltip>} ><i className="ti-stats-up"
                      data-bs-toggle="tooltip" title="ti-stats-up"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-stats-down</Tooltip>} ><i className="ti-stats-down"
                      data-bs-toggle="tooltip" title="ti-stats-down"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-shine</Tooltip>} ><i className="ti-shine"
                      data-bs-toggle="tooltip" title="ti-shine"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-shift-right</Tooltip>} ><i className="ti-shift-right"
                      data-bs-toggle="tooltip" title="ti-shift-right"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-shift-left</Tooltip>} ><i className="ti-shift-left"
                      data-bs-toggle="tooltip" title="ti-shift-left"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-shift-right</Tooltip>} ><i className="ti-shift-right-alt"
                      data-bs-toggle="tooltip" title="ti-shift-right-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-shift-left</Tooltip>} ><i className="ti-shift-left-alt"
                      data-bs-toggle="tooltip" title="ti-shift-left-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-shield</Tooltip>} ><i className="ti-shield"
                      data-bs-toggle="tooltip" title="ti-shield"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-notepad</Tooltip>} ><i className="ti-notepad"
                      data-bs-toggle="tooltip" title="ti-notepad"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-server</Tooltip>} ><i className="ti-server"
                      data-bs-toggle="tooltip" title="ti-server"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-pulse</Tooltip>} ><i className="ti-pulse"
                      data-bs-toggle="tooltip" title="ti-pulse"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-printer</Tooltip>} ><i className="ti-printer"
                      data-bs-toggle="tooltip" title="ti-printer"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-power-off</Tooltip>} ><i className="ti-power-off"
                      data-bs-toggle="tooltip" title="ti-power-off"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-plug</Tooltip>} ><i className="ti-plug"
                      data-bs-toggle="tooltip" title="ti-plug"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-pie-chart</Tooltip>} ><i className="ti-pie-chart"
                      data-bs-toggle="tooltip" title="ti-pie-chart"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-panel</Tooltip>} ><i className="ti-panel"
                      data-bs-toggle="tooltip" title="ti-panel"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-package</Tooltip>} ><i className="ti-package"
                      data-bs-toggle="tooltip" title="ti-package"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-music</Tooltip>} ><i className="ti-music"
                      data-bs-toggle="tooltip" title="ti-music"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-music-alt</Tooltip>} ><i className="ti-music-alt"
                      data-bs-toggle="tooltip" title="ti-music-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-mouse</Tooltip>} ><i className="ti-mouse"
                      data-bs-toggle="tooltip" title="ti-mouse"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-mouse-alt</Tooltip>} ><i className="ti-mouse-alt"
                      data-bs-toggle="tooltip" title="ti-mouse-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-money</Tooltip>} ><i className="ti-money"
                      data-bs-toggle="tooltip" title="ti-money"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-microphone</Tooltip>} ><i className="ti-microphone"
                      data-bs-toggle="tooltip" title="ti-microphone"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-men</Tooltip>} ><i className="ti-menu"
                      data-bs-toggle="tooltip" title="ti-menu"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-menu-alt</Tooltip>} ><i className="ti-menu-alt"
                      data-bs-toggle="tooltip" title="ti-menu-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-map</Tooltip>} ><i className="ti-map"
                      data-bs-toggle="tooltip" title="ti-map"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-map-alt</Tooltip>} ><i className="ti-map-alt"
                      data-bs-toggle="tooltip" title="ti-map-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-location-pin</Tooltip>} ><i className="ti-location-pin"
                      data-bs-toggle="tooltip" title="ti-location-pin"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-light-bulb</Tooltip>} ><i className="ti-light-bulb"
                      data-bs-toggle="tooltip" title="ti-light-bulb"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-info</Tooltip>} ><i className="ti-info"
                      data-bs-toggle="tooltip" title="ti-info"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>=ti-infinite</Tooltip>} ><i className="ti-infinite"
                      data-bs-toggle="tooltip" title="ti-infinite"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>=ti-id-badge</Tooltip>} ><i className="ti-id-badge"
                      data-bs-toggle="tooltip" title="ti-id-badge"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-hummer</Tooltip>} ><i className="ti-hummer"
                      data-bs-toggle="tooltip" title="ti-hummer"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-home</Tooltip>} ><i className="ti-home"
                      data-bs-toggle="tooltip" title="ti-home"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-help</Tooltip>} ><i className="ti-help"
                      data-bs-toggle="tooltip" title="ti-help"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-headphone</Tooltip>} ><i className="ti-headphone"
                      data-bs-toggle="tooltip" title="ti-headphone"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-harddrives</Tooltip>} ><i className="ti-harddrives"
                      data-bs-toggle="tooltip" title="ti-harddrives"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-harddrive</Tooltip>} ><i className="ti-harddrive"
                      data-bs-toggle="tooltip" title="ti-harddrive"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-gift</Tooltip>} ><i className="ti-gift"
                      data-bs-toggle="tooltip" title="ti-gift"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-game</Tooltip>} ><i className="ti-game"
                      data-bs-toggle="tooltip" title="ti-game"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-filter</Tooltip>} ><i className="ti-filter"
                      data-bs-toggle="tooltip" title="ti-filter"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-files</Tooltip>} ><i className="ti-files"
                      data-bs-toggle="tooltip" title="ti-files"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-file</Tooltip>} ><i className="ti-file"
                      data-bs-toggle="tooltip" title="ti-file"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-zip</Tooltip>} ><i className="ti-zip"
                      data-bs-toggle="tooltip" title="ti-zip"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-folder</Tooltip>} ><i className="ti-folder"
                      data-bs-toggle="tooltip" title="ti-folder"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-envelope</Tooltip>} ><i className="ti-envelope"
                      data-bs-toggle="tooltip" title="ti-envelope"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-dashboard</Tooltip>} ><i className="ti-dashboard"
                      data-bs-toggle="tooltip" title="ti-dashboard"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-cloud</Tooltip>} ><i className="ti-cloud"
                      data-bs-toggle="tooltip" title="ti-cloud"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-cloud-up</Tooltip>} ><i className="ti-cloud-up"
                      data-bs-toggle="tooltip" title="ti-cloud-up"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-cloud-down</Tooltip>} ><i className="ti-cloud-down"
                      data-bs-toggle="tooltip" title="ti-cloud-down"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-clipboard</Tooltip>} ><i className="ti-clipboard"
                      data-bs-toggle="tooltip" title="ti-clipboard"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-calendar</Tooltip>} ><i className="ti-calendar"
                      data-bs-toggle="tooltip" title="ti-calendar"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-book</Tooltip>} ><i className="ti-book"
                      data-bs-toggle="tooltip" title="ti-book"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-bell</Tooltip>} ><i className="ti-bell"
                      data-bs-toggle="tooltip" title="ti-bell"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-basketball</Tooltip>} ><i className="ti-basketball"
                      data-bs-toggle="tooltip" title="ti-basketball"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-bar-chart</Tooltip>} ><i className="ti-bar-chart"
                      data-bs-toggle="tooltip" title="ti-bar-chart"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-bar-chart-</Tooltip>} ><i className="ti-bar-chart-alt"
                      data-bs-toggle="tooltip" title="ti-bar-chart-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-archive</Tooltip>} ><i className="ti-archive"
                      data-bs-toggle="tooltip" title="ti-archive"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-anchor</Tooltip>} ><i className="ti-anchor"
                      data-bs-toggle="tooltip" title="ti-anchor"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-alert</Tooltip>} ><i className="ti-alert"
                      data-bs-toggle="tooltip" title="ti-alert"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-alarm-clock</Tooltip>} ><i className="ti-alarm-clock"
                      data-bs-toggle="tooltip" title="ti-alarm-clock"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-agenda</Tooltip>} ><i className="ti-agenda"
                      data-bs-toggle="tooltip" title="ti-agenda"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-write</Tooltip>} ><i className="ti-write"
                      data-bs-toggle="tooltip" title="ti-write"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-wallet</Tooltip>} ><i className="ti-wallet"
                      data-bs-toggle="tooltip" title="ti-wallet"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-video-clapper</Tooltip>} ><i className="ti-video-clapper"
                      data-bs-toggle="tooltip" title="ti-video-clapper"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-video-camera</Tooltip>} ><i className="ti-video-camera"
                      data-bs-toggle="tooltip" title="ti-video-camera"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-vector</Tooltip>} ><i className="ti-vector"
                      data-bs-toggle="tooltip" title="ti-vector"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-support</Tooltip>} ><i className="ti-support"
                      data-bs-toggle="tooltip" title="ti-support"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-stamp</Tooltip>} ><i className="ti-stamp"
                      data-bs-toggle="tooltip" title="ti-stamp"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-slice</Tooltip>} ><i className="ti-slice"
                      data-bs-toggle="tooltip" title="ti-slice"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-shortcode</Tooltip>} ><i className="ti-shortcode"
                      data-bs-toggle="tooltip" title="ti-shortcode"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-receipt</Tooltip>} ><i className="ti-receipt"
                      data-bs-toggle="tooltip" title="ti-receipt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-pin2</Tooltip>} ><i className="ti-pin2"
                      data-bs-toggle="tooltip" title="ti-pin2"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-pin-alt</Tooltip>} ><i className="ti-pin-alt"
                      data-bs-toggle="tooltip" title="ti-pin-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-pencil-alt</Tooltip>} ><i className="ti-pencil-alt2"
                      data-bs-toggle="tooltip" title="ti-pencil-alt2"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-eraser</Tooltip>} ><i className="ti-eraser"
                      data-bs-toggle="tooltip" title="ti-eraser"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-more</Tooltip>} ><i className="ti-more"
                      data-bs-toggle="tooltip" title="ti-more"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-more-alt</Tooltip>} ><i className="ti-more-alt"
                      data-bs-toggle="tooltip" title="ti-more-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-microphone-alt</Tooltip>} ><i className="ti-microphone-alt"
                      data-bs-toggle="tooltip" title="ti-microphone-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-magnet</Tooltip>} ><i className="ti-magnet"
                      data-bs-toggle="tooltip" title="ti-magnet"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-line-double</Tooltip>} ><i className="ti-line-double"
                      data-bs-toggle="tooltip" title="ti-line-double"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-line-dotted</Tooltip>} ><i className="ti-line-dotted"
                      data-bs-toggle="tooltip" title="ti-line-dotted"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-line-dashed</Tooltip>} ><i className="ti-line-dashed"
                      data-bs-toggle="tooltip" title="ti-line-dashed"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-ink-pen</Tooltip>} ><i className="ti-ink-pen"
                      data-bs-toggle="tooltip" title="ti-ink-pen"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-info-alt</Tooltip>} ><i className="ti-info-alt"
                      data-bs-toggle="tooltip" title="ti-info-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-help-alt</Tooltip>} ><i className="ti-help-alt"
                      data-bs-toggle="tooltip" title="ti-help-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-headphone-alt</Tooltip>} ><i className="ti-headphone-alt"
                      data-bs-toggle="tooltip" title="ti-headphone-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-gallery</Tooltip>} ><i className="ti-gallery"
                      data-bs-toggle="tooltip" title="ti-gallery"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-face-smile</Tooltip>} ><i className="ti-face-smile"
                      data-bs-toggle="tooltip" title="ti-face-smile"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-face-sad</Tooltip>} ><i className="ti-face-sad"
                      data-bs-toggle="tooltip" title="ti-face-sad"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-credit-card</Tooltip>} ><i className="ti-credit-card"
                      data-bs-toggle="tooltip" title="ti-credit-card"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-comments-smiley</Tooltip>} ><i className="ti-comments-smiley"
                      data-bs-toggle="tooltip" title="ti-comments-smiley"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-time</Tooltip>} ><i className="ti-time"
                      data-bs-toggle="tooltip" title="ti-time"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-share</Tooltip>} ><i className="ti-share"
                      data-bs-toggle="tooltip" title="ti-share"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-share-alt</Tooltip>} ><i className="ti-share-alt"
                      data-bs-toggle="tooltip" title="ti-share-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-rocket</Tooltip>} ><i className="ti-rocket"
                      data-bs-toggle="tooltip" title="ti-rocket"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-new-window</Tooltip>} ><i className="ti-new-window"
                      data-bs-toggle="tooltip" title="ti-new-window"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-rss</Tooltip>} ><i className="ti-rss"
                      data-bs-toggle="tooltip" title="ti-rss"></i></OverlayTrigger></li>
                  <li className="icons-list-item"><OverlayTrigger   placement="top"   overlay={<Tooltip>ti-rss-alt</Tooltip>} ><i className="ti-rss-alt"
                      data-bs-toggle="tooltip" title="ti-rss-alt"></i></OverlayTrigger></li>
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

export default ThemifyIcons;
