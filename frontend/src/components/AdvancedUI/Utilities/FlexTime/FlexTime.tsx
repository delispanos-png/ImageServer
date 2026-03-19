import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row } from 'react-bootstrap';

interface FlexTimeProps {}

const FlexTime: FC<FlexTimeProps> = () => (
  <Fragment>
  <PageHeader  title="Flex"/>
  <Row>
    <Col lg={12}>
      <Card>
        <Card.Header>
          <Card.Title>
            Enable Flex
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex p-3 bg-light">
            I'm a flexbox container!
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>
            Direction
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div>
            <div className="d-flex flex-row bg-light mb-4">
              <div className="p-3 bg-gray-100">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300">
                Flex item 3
              </div>
            </div>
            <div className="d-flex flex-row-reverse bg-light">
              <div className="p-3 bg-gray-100">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300">
                Flex item 3
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>
            Justify Content
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div>
            <div className="d-flex flex-row justify-content-left bg-light mb-4">
              <div className="p-3 bg-gray-100">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300">
                Flex item 3
              </div>
            </div>
            <div className="d-flex flex-row justify-content-right bg-light mb-4">
              <div className="p-3 bg-gray-100">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300">
                Flex item 3
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center bg-light mb-4">
              <div className="p-3 bg-gray-100">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300">
                Flex item 3
              </div>
            </div>
            <div className="d-flex flex-row justify-content-between bg-light mb-4">
              <div className="p-3 bg-gray-100">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300">
                Flex item 3
              </div>
            </div>
            <div className="d-flex flex-row justify-content-around bg-light">
              <div className="p-3 bg-gray-100">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300">
                Flex item 3
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>
            Align Items
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div>
            <div className="d-flex flex-row align-items-start bg-light h-9 mb-4">
              <div className="p-3 bg-gray-100">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300">
                Flex item 3
              </div>
            </div>
            <div className="d-flex flex-row align-items-center bg-light h-9 mb-4">
              <div className="p-3 bg-gray-100">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300">
                Flex item 3
              </div>
            </div>
            <div className="d-flex flex-row align-items-end bg-light h-9 mb-4">
              <div className="p-3 bg-gray-100">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300">
                Flex item 3
              </div>
            </div>
            <div className="d-flex flex-row align-items-stretch bg-light h-9">
              <div className="p-3 bg-gray-100">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300">
                Flex item 3
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>
            Align Self
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div>
            <div className="d-flex flex-row bg-light h-9 mb-4">
              <div className="p-3 bg-gray-100 align-self-start">
                Flex item 1
              </div>
              <div className="p-3 bg-gray-200 align-self-center">
                Flex item 2
              </div>
              <div className="p-3 bg-gray-300 align-self-end">
                Flex item 3
              </div>
              <div className="p-3 bg-gray-400 align-self-stretch">
                Flex item 4
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>
            Fill
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div>
            <div className="d-flex bg-light">
              <div className="p-3 bg-gray-100 flex-fill">
                Flex item with a lot of content
              </div>
              <div className="p-3 bg-gray-200 flex-fill">
                Flex item
              </div>
              <div className="p-3 bg-gray-300 flex-fill">
                Flex item
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>
            Grow and Shrink
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div>
            <div className="d-flex bg-light">
              <div className="p-3 bg-gray-100 flex-grow-1">
                Flex item
              </div>
              <div className="p-3 bg-gray-200">
                Flex item
              </div>
              <div className="p-3 bg-gray-300">
                Third flex item
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>
            Auto Margins
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div>
            <div className="d-flex bg-light">
              <div className="p-3 bg-gray-100">
                Flex item
              </div>
              <div className="p-3 bg-gray-200">
                Flex item
              </div>
              <div className="p-3 bg-gray-300 mg-l-auto">
                Third flex item
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>
            Order
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div>
            <div className="d-flex bg-light">
              <div className="p-3 bg-gray-100 order-3">
                First Item
              </div>
              <div className="p-3 bg-gray-200 order-2">
                Second Item
              </div>
              <div className="p-3 bg-gray-300 order-1">
                Third Item
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Fragment>
);

export default FlexTime;
