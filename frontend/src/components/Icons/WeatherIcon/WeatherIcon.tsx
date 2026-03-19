import React, { FC, Fragment } from 'react';
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';



interface WeatherIconProps {}

const WeatherIcon: FC<WeatherIconProps> = () => (
  <Fragment>
  <PageHeader  title="weather Icons" />
  <Row>
    <Col md={12}>
      <Card>
        <Card.Header>
          <Card.Title>Weather icons</Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col lg={12} sm={12} mb={4}>
              <p className="mb-2">Simply beautiful open source icons. For more info <a
                  className="fs-16 text-primary font-weight-bold"
                  href="https://erikflowers.github.io/weather-icons/"
                  target="_blank" rel="noreferrer">click here</a>.</p>
              <p><code>&lt;i className="wi wi-ICON_NAME"&gt;&lt;/i&gt;</code></p>
            </Col>
            <Col lg={12} sm={12}>
              <div className="icons-list-wrap">
                <ul className="icons-list">
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-cloudy-high</Tooltip>}><i className="wi wi-day-cloudy-high"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-cloudy-high"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-moonrise</Tooltip>}><i className="wi wi-moonrise"
                      data-bs-toggle="tooltip" title="wi wi-moonrise"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-na</Tooltip>}><i className="wi wi-na"
                      data-bs-toggle="tooltip" title="wi wi-na"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-volcano</Tooltip>}><i className="wi wi-volcano"
                      data-bs-toggle="tooltip" title="wi wi-volcano"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-light-wind</Tooltip>}><i className="wi wi-day-light-wind"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-light-wind"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-moonset</Tooltip>}><i className="wi wi-moonset"
                      data-bs-toggle="tooltip" title="wi wi-moonset"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-flood</Tooltip>}><i className="wi wi-flood"
                      data-bs-toggle="tooltip" title="wi wi-flood"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-train</Tooltip>}><i className="wi wi-train"
                      data-bs-toggle="tooltip" title="wi wi-train"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-sleet</Tooltip>}><i className="wi wi-day-sleet"
                      data-bs-toggle="tooltip" title="wi wi-day-sleet"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-sleet</Tooltip>}><i className="wi wi-night-sleet"
                      data-bs-toggle="tooltip" title="wi wi-night-sleet"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-sandstorm</Tooltip>}><i className="wi wi-sandstorm"
                      data-bs-toggle="tooltip" title="wi wi-sandstorm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-small-craft-advisory</Tooltip>}><i
                      className="wi wi-small-craft-advisory"
                      data-bs-toggle="tooltip"
                      title="wi wi-small-craft-advisory"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-day-haze</Tooltip>}><i className="wi wi-day-haze"
                      data-bs-toggle="tooltip" title="wi wi-day-haze"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-sleet</Tooltip>}><i className="wi wi-night-alt-sleet"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-sleet"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-tsunami</Tooltip>}><i className="wi wi-tsunami"
                      data-bs-toggle="tooltip" title="wi wi-tsunami"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-gale-warning</Tooltip>}><i className="wi wi-gale-warning"
                      data-bs-toggle="tooltip" title="wi wi-gale-warning"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-cloudy-hi</Tooltip>}><i className="wi wi-night-cloudy-high"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-cloudy-high"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-raindrop</Tooltip>}><i className="wi wi-raindrop"
                      data-bs-toggle="tooltip" title="wi wi-raindrop"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-earthquake</Tooltip>}><i className="wi wi-earthquake"
                      data-bs-toggle="tooltip" title="wi wi-earthquake"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-storm-warning</Tooltip>}><i className="wi wi-storm-warning"
                      data-bs-toggle="tooltip"
                      title="wi wi-storm-warning"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-alt-partly-clo</Tooltip>}><i
                      className="wi wi-night-alt-partly-cloudy"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-partly-cloudy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-barometer</Tooltip>}><i className="wi wi-barometer"
                      data-bs-toggle="tooltip" title="wi wi-barometer"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-fire</Tooltip>}><i className="wi wi-fire"
                      data-bs-toggle="tooltip" title="wi wi-fire"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-hurricane-warni</Tooltip>}><i className="wi wi-hurricane-warning"
                      data-bs-toggle="tooltip"
                      title="wi wi-hurricane-warning"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-sleet</Tooltip>}><i className="wi wi-sleet"
                      data-bs-toggle="tooltip" title="wi wi-sleet"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-humidity</Tooltip>}><i className="wi wi-humidity"
                      data-bs-toggle="tooltip" title="wi wi-humidity"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-sunny</Tooltip>}><i className="wi wi-day-sunny"
                      data-bs-toggle="tooltip" title="wi wi-day-sunny"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-day-cloudy</Tooltip>}><i className="wi wi-day-cloudy"
                      data-bs-toggle="tooltip" title="wi wi-day-cloudy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-cloudy-gust</Tooltip>}><i className="wi wi-day-cloudy-gusts"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-cloudy-gusts"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-cloudy-wind</Tooltip>}><i className="wi wi-day-cloudy-windy"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-cloudy-windy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-day-fog</Tooltip>}><i className="wi wi-day-fog"
                      data-bs-toggle="tooltip" title="wi wi-day-fog"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-day-hail</Tooltip>}><i className="wi wi-day-hail"
                      data-bs-toggle="tooltip" title="wi wi-day-hail"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-day-haze</Tooltip>}><i className="wi wi-day-haze"
                      data-bs-toggle="tooltip" title="wi wi-day-haze"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-lightning</Tooltip>}><i className="wi wi-day-lightning"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-lightning"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-day-rain</Tooltip>}><i className="wi wi-day-rain"
                      data-bs-toggle="tooltip" title="wi wi-day-rain"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-day-rain-mix</Tooltip>}><i className="wi wi-day-rain-mix"
                      data-bs-toggle="tooltip" title="wi wi-day-rain-mix"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-rain-wind</Tooltip>}><i className="wi wi-day-rain-wind"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-rain-wind"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-day-showers</Tooltip>}><i className="wi wi-day-showers"
                      data-bs-toggle="tooltip" title="wi wi-day-showers"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-sleet</Tooltip>}><i className="wi wi-day-sleet"
                      data-bs-toggle="tooltip" title="wi wi-day-sleet"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-sleet-storm</Tooltip>}><i className="wi wi-day-sleet-storm"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-sleet-storm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-day-snow</Tooltip>}><i className="wi wi-day-snow"
                      data-bs-toggle="tooltip" title="wi wi-day-snow"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-day-snow-thunderstor</Tooltip>}><i
                      className="wi wi-day-snow-thunderstorm"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-snow-thunderstorm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-snow-wind</Tooltip>}><i className="wi wi-day-snow-wind"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-snow-wind"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-day-sprinkle</Tooltip>}><i className="wi wi-day-sprinkle"
                      data-bs-toggle="tooltip" title="wi wi-day-sprinkle"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-storm-showe</Tooltip>}><i className="wi wi-day-storm-showers"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-storm-showers"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-sunny-overc</Tooltip>}><i className="wi wi-day-sunny-overcast"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-sunny-overcast"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-thunderstor</Tooltip>}><i className="wi wi-day-thunderstorm"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-thunderstorm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-windy</Tooltip>}><i className="wi wi-day-windy"
                      data-bs-toggle="tooltip" title="wi wi-day-windy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-solar-eclipse</Tooltip>}><i className="wi wi-solar-eclipse"
                      data-bs-toggle="tooltip"
                      title="wi wi-solar-eclipse"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-hot</Tooltip>}><i className="wi wi-hot"
                      data-bs-toggle="tooltip" title="wi wi-hot"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-cloudy-high</Tooltip>}><i className="wi wi-day-cloudy-high"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-cloudy-high"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-day-light-wind</Tooltip>}><i className="wi wi-day-light-wind"
                      data-bs-toggle="tooltip"
                      title="wi wi-day-light-wind"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-clear</Tooltip>}><i className="wi wi-night-clear"
                      data-bs-toggle="tooltip" title="wi wi-night-clear"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-cloud</Tooltip>}><i className="wi wi-night-alt-cloudy"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-cloudy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-alt-cloudy-gus</Tooltip>}><i
                      className="wi wi-night-alt-cloudy-gusts"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-cloudy-gusts"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-alt-cloudy-win</Tooltip>}><i
                      className="wi wi-night-alt-cloudy-windy"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-cloudy-windy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-hail</Tooltip>}><i className="wi wi-night-alt-hail"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-hail"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-light</Tooltip>}><i className="wi wi-night-alt-lightning"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-lightning"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-rain</Tooltip>}><i className="wi wi-night-alt-rain"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-rain"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-rain-</Tooltip>}><i className="wi wi-night-alt-rain-mix"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-rain-mix"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-rain-</Tooltip>}><i className="wi wi-night-alt-rain-wind"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-rain-wind"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-showe</Tooltip>}><i className="wi wi-night-alt-showers"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-showers"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-sleet</Tooltip>}><i className="wi wi-night-alt-sleet"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-sleet"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-alt-sleet-stor</Tooltip>}><i
                      className="wi wi-night-alt-sleet-storm"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-sleet-storm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-snow</Tooltip>}><i className="wi wi-night-alt-snow"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-snow"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-alt-snow-thund</Tooltip>}><i
                      className="wi wi-night-alt-snow-thunderstorm"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-snow-thunderstorm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-snow-</Tooltip>}><i className="wi wi-night-alt-snow-wind"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-snow-wind"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-alt-sprin</Tooltip>}><i className="wi wi-night-alt-sprinkle"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-sprinkle"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-alt-storm-show</Tooltip>}><i
                      className="wi wi-night-alt-storm-showers"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-storm-showers"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-alt-thundersto</Tooltip>}><i
                      className="wi wi-night-alt-thunderstorm"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-thunderstorm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-cloudy</Tooltip>}><i className="wi wi-night-cloudy"
                      data-bs-toggle="tooltip" title="wi wi-night-cloudy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-cloudy-gu</Tooltip>}><i className="wi wi-night-cloudy-gusts"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-cloudy-gusts"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-cloudy-wi</Tooltip>}><i className="wi wi-night-cloudy-windy"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-cloudy-windy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-fog</Tooltip>}><i className="wi wi-night-fog"
                      data-bs-toggle="tooltip" title="wi wi-night-fog"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-hail</Tooltip>}><i className="wi wi-night-hail"
                      data-bs-toggle="tooltip" title="wi wi-night-hail"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-lightning</Tooltip>}><i className="wi wi-night-lightning"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-lightning"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-partly-cl</Tooltip>}><i className="wi wi-night-partly-cloudy"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-partly-cloudy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-rain</Tooltip>}><i className="wi wi-night-rain"
                      data-bs-toggle="tooltip" title="wi wi-night-rain"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-rain-mix</Tooltip>}><i className="wi wi-night-rain-mix"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-rain-mix"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-rain-wind</Tooltip>}><i className="wi wi-night-rain-wind"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-rain-wind"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-showers</Tooltip>}><i className="wi wi-night-showers"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-showers"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-sleet</Tooltip>}><i className="wi wi-night-sleet"
                      data-bs-toggle="tooltip" title="wi wi-night-sleet"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-sleet-sto</Tooltip>}><i className="wi wi-night-sleet-storm"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-sleet-storm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-snow</Tooltip>}><i className="wi wi-night-snow"
                      data-bs-toggle="tooltip" title="wi wi-night-snow"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-snow-thunderst</Tooltip>}><i
                      className="wi wi-night-snow-thunderstorm"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-snow-thunderstorm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-snow-wind</Tooltip>}><i className="wi wi-night-snow-wind"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-snow-wind"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-sprinkle</Tooltip>}><i className="wi wi-night-sprinkle"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-sprinkle"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-storm-sho</Tooltip>}><i className="wi wi-night-storm-showers"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-storm-showers"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-thunderst</Tooltip>}><i className="wi wi-night-thunderstorm"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-thunderstorm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-lunar-eclipse</Tooltip>}><i className="wi wi-lunar-eclipse"
                      data-bs-toggle="tooltip"
                      title="wi wi-lunar-eclipse"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-stars</Tooltip>}><i className="wi wi-stars"
                      data-bs-toggle="tooltip" title="wi wi-stars"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-storm-showers</Tooltip>}><i className="wi wi-storm-showers"
                      data-bs-toggle="tooltip"
                      title="wi wi-storm-showers"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-alt-cloudy-hig</Tooltip>}><i
                      className="wi wi-night-alt-cloudy-high"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-cloudy-high"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-night-cloudy-hi</Tooltip>}><i className="wi wi-night-cloudy-high"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-cloudy-high"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-night-alt-partly-clo</Tooltip>}><i
                      className="wi wi-night-alt-partly-cloudy"
                      data-bs-toggle="tooltip"
                      title="wi wi-night-alt-partly-cloudy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-cloud</Tooltip>}><i className="wi wi-cloud"
                      data-bs-toggle="tooltip" title="wi wi-cloud"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-cloudy</Tooltip>}><i className="wi wi-cloudy"
                      data-bs-toggle="tooltip" title="wi wi-cloudy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-cloudy-gusts</Tooltip>}><i className="wi wi-cloudy-gusts"
                      data-bs-toggle="tooltip" title="wi wi-cloudy-gusts"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-cloudy-windy</Tooltip>}><i className="wi wi-cloudy-windy"
                      data-bs-toggle="tooltip" title="wi wi-cloudy-windy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-fog</Tooltip>}><i className="wi wi-fog"
                      data-bs-toggle="tooltip" title="wi wi-fog"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-hail</Tooltip>}><i className="wi wi-hail"
                      data-bs-toggle="tooltip" title="wi wi-hail"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-rain</Tooltip>}><i className="wi wi-rain"
                      data-bs-toggle="tooltip" title="wi wi-rain"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-rain-mix</Tooltip>}><i className="wi wi-rain-mix"
                      data-bs-toggle="tooltip" title="wi wi-rain-mix"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-rain-wind</Tooltip>}><i className="wi wi-rain-wind"
                      data-bs-toggle="tooltip" title="wi wi-rain-wind"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-showers</Tooltip>}><i className="wi wi-showers"
                      data-bs-toggle="tooltip" title="wi wi-showers"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-sleet</Tooltip>}><i className="wi wi-sleet"
                      data-bs-toggle="tooltip" title="wi wi-sleet"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-snow</Tooltip>}><i className="wi wi-snow"
                      data-bs-toggle="tooltip" title="wi wi-snow"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-sprinkle</Tooltip>}><i className="wi wi-sprinkle"
                      data-bs-toggle="tooltip" title="wi wi-sprinkle"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-storm-showers</Tooltip>}><i className="wi wi-storm-showers"
                      data-bs-toggle="tooltip"
                      title="wi wi-storm-showers"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-thunderstorm</Tooltip>}><i className="wi wi-thunderstorm"
                      data-bs-toggle="tooltip" title="wi wi-thunderstorm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-snow-wind</Tooltip>}><i className="wi wi-snow-wind"
                      data-bs-toggle="tooltip" title="wi wi-snow-wind"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-snow</Tooltip>}><i className="wi wi-snow"
                      data-bs-toggle="tooltip" title="wi wi-snow"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-smog</Tooltip>}><i className="wi wi-smog"
                      data-bs-toggle="tooltip" title="wi wi-smog"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-smoke</Tooltip>}><i className="wi wi-smoke"
                      data-bs-toggle="tooltip" title="wi wi-smoke"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-lightning</Tooltip>}><i className="wi wi-lightning"
                      data-bs-toggle="tooltip" title="wi wi-lightning"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-raindrops</Tooltip>}><i className="wi wi-raindrops"
                      data-bs-toggle="tooltip" title="wi wi-raindrops"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-raindrop</Tooltip>}><i className="wi wi-raindrop"
                      data-bs-toggle="tooltip" title="wi wi-raindrop"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-snowflake-cold</Tooltip>}><i className="wi wi-snowflake-cold"
                      data-bs-toggle="tooltip"
                      title="wi wi-snowflake-cold"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-windy</Tooltip>}><i className="wi wi-windy"
                      data-bs-toggle="tooltip" title="wi wi-windy"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-strong-wind</Tooltip>}><i className="wi wi-strong-wind"
                      data-bs-toggle="tooltip" title="wi wi-strong-wind"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-sandstorm</Tooltip>}><i className="wi wi-sandstorm"
                      data-bs-toggle="tooltip" title="wi wi-sandstorm"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-earthquake</Tooltip>}><i className="wi wi-earthquake"
                      data-bs-toggle="tooltip" title="wi wi-earthquake"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-fire</Tooltip>}><i className="wi wi-fire"
                      data-bs-toggle="tooltip" title="wi wi-fire"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-flood</Tooltip>}><i className="wi wi-flood"
                      data-bs-toggle="tooltip" title="wi wi-flood"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-meteor</Tooltip>}><i className="wi wi-meteor"
                      data-bs-toggle="tooltip" title="wi wi-meteor"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-tsunami</Tooltip>}><i className="wi wi-tsunami"
                      data-bs-toggle="tooltip" title="wi wi-tsunami"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-volcano</Tooltip>}><i className="wi wi-volcano"
                      data-bs-toggle="tooltip" title="wi wi-volcano"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-hurricane</Tooltip>}><i className="wi wi-hurricane"
                      data-bs-toggle="tooltip" title="wi wi-hurricane"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-tornado</Tooltip>}><i className="wi wi-tornado"
                      data-bs-toggle="tooltip" title="wi wi-tornado"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-small-craft-advisory</Tooltip>}><i
                      className="wi wi-small-craft-advisory"
                      data-bs-toggle="tooltip"
                      title="wi wi-small-craft-advisory"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-gale-warning</Tooltip>}><i className="wi wi-gale-warning"
                      data-bs-toggle="tooltip" title="wi wi-gale-warning"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-storm-warning</Tooltip>}><i className="wi wi-storm-warning"
                      data-bs-toggle="tooltip"
                      title="wi wi-storm-warning"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-hurricane-warni</Tooltip>}><i className="wi wi-hurricane-warning"
                      data-bs-toggle="tooltip"
                      title="wi wi-hurricane-warning"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-wind-direction</Tooltip>}><i className="wi wi-wind-direction"
                      data-bs-toggle="tooltip"
                      title="wi wi-wind-direction"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-alien</Tooltip>}><i className="wi wi-alien"
                      data-bs-toggle="tooltip" title="wi wi-alien"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-celsius</Tooltip>}><i className="wi wi-celsius"
                      data-bs-toggle="tooltip" title="wi wi-celsius"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-fahrenheit</Tooltip>}><i className="wi wi-fahrenheit"
                      data-bs-toggle="tooltip" title="wi wi-fahrenheit"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-degrees</Tooltip>}><i className="wi wi-degrees"
                      data-bs-toggle="tooltip" title="wi wi-degrees"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-thermometer</Tooltip>}><i className="wi wi-thermometer"
                      data-bs-toggle="tooltip" title="wi wi-thermometer"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-thermometer-exterior</Tooltip>}><i
                      className="wi wi-thermometer-exterior"
                      data-bs-toggle="tooltip"
                      title="wi wi-thermometer-exterior"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-thermometer-internal</Tooltip>}><i
                      className="wi wi-thermometer-internal"
                      data-bs-toggle="tooltip"
                      title="wi wi-thermometer-internal"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-cloud-down</Tooltip>}><i className="wi wi-cloud-down"
                      data-bs-toggle="tooltip" title="wi wi-cloud-down"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-cloud-up</Tooltip>}><i className="wi wi-cloud-up"
                      data-bs-toggle="tooltip" title="wi wi-cloud-up"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-cloud-refresh</Tooltip>}><i className="wi wi-cloud-refresh"
                      data-bs-toggle="tooltip"
                      title="wi wi-cloud-refresh"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-horizon</Tooltip>}><i className="wi wi-horizon"
                      data-bs-toggle="tooltip" title="wi wi-horizon"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-horizon-alt</Tooltip>}><i className="wi wi-horizon-alt"
                      data-bs-toggle="tooltip" title="wi wi-horizon-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-sunrise</Tooltip>}><i className="wi wi-sunrise"
                      data-bs-toggle="tooltip" title="wi wi-sunrise"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-sunset</Tooltip>}><i className="wi wi-sunset"
                      data-bs-toggle="tooltip" title="wi wi-sunset"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-moonrise</Tooltip>}><i className="wi wi-moonrise"
                      data-bs-toggle="tooltip" title="wi wi-moonrise"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-moonset</Tooltip>}><i className="wi wi-moonset"
                      data-bs-toggle="tooltip" title="wi wi-moonset"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-refresh</Tooltip>}><i className="wi wi-refresh"
                      data-bs-toggle="tooltip"
                      title="typcn typcn-rss-outline"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-refresh-alt</Tooltip>}><i className="wi wi-refresh-alt"
                      data-bs-toggle="tooltip" title="wi wi-refresh-alt"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-umbrella</Tooltip>}><i className="wi wi-umbrella"
                      data-bs-toggle="tooltip" title="wi wi-umbrella"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-barometer</Tooltip>}><i className="wi wi-barometer"
                      data-bs-toggle="tooltip" title="wi wi-barometer"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-humidity</Tooltip>}><i className="wi wi-humidity"
                      data-bs-toggle="tooltip" title="wi wi-humidity"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip>wi wi-na</Tooltip>}><i className="wi wi-na"
                      data-bs-toggle="tooltip" title="wi wi-na"></i></OverlayTrigger></li>
                  <li className="icons-list-item"> <OverlayTrigger placement="top" overlay={<Tooltip> wi wi-train</Tooltip>}><i className="wi wi-train"
                      data-bs-toggle="tooltip" title="wi wi-train"></i></OverlayTrigger></li>
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

export default WeatherIcon;
