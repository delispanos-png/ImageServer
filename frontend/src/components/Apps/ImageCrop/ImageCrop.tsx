import React, { FC, Fragment, useCallback, useState } from 'react';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cropper from 'react-easy-crop'
import media23 from '../../../assets/images/media/23.jpg';
import Select from 'react-select';
import PageHeader from '../../../layout/Header/pageheader';

interface ImageCropProps { }

const ImageCrop: FC<ImageCropProps> = () => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
  }, [])


  //get position
  const [show5, setShow5] = useState(false);

  const handleClose5 = () => setShow5(false);
  const handleShow5 = () => setShow5(true);

  //get position
  const [show6, setShow6] = useState(false);

  const handleClose6 = () => setShow6(false);
  const handleShow6 = () => setShow6(true);

  interface option {
    label: string
  }
  const options: option[] = [
    { label: 'sqaure(default)' },
    { label: 'circle' },

  ]
  interface option1 {
    label: string
  }
  const options1: option1[] = [
    { label: 'Image' },
    { label: 'Viewport(default)' },

  ]
  interface option2 {
    label: string
  }
  const options2: option2[] = [
    { label: 'True(default)' },
    { label: 'false' },

  ]
  interface option3 {
    label: string
  }
  const options3: option3[] = [
    { label: '2 (default' },
    { label: '5' },
    { label: '10' },


  ]
  interface option4 {
    label: string
  }
  const options4: option4[] = [
    { label: 'White(default)' },
    { label: 'Red' },
    { label: 'Blue' },


  ]
  interface option5 {
    label: string
  }
  const options5: option5[] = [
    { label: 'true(default)' },
    { label: 'false' },

  ]
  interface option6 {
    label: string
  }
  const options6: option6[] = [
    { label: 'true(default)' },
    { label: 'false' },

  ]

  interface option7 {
    label: string
  }
  const options7: option7[] = [
    { label: 'true' },
    { label: 'false(default)' },

  ]
  interface option8 {
    label: string
  }
  const options8: option8[] = [
    { label: 'true(default)' },
    { label: 'false' },

  ]
  interface option9 {
    label: string
  }
  const options9: option9[] = [
    { label: 'true' },
    { label: 'false(default)' },

  ]
  interface option10 {
    label: string
  }
  const options10: option10[] = [
    { label: 'left' },
    { label: 'right(default)' },

  ]
  return (

    <Fragment>
      <PageHeader title="Image Crop" />
      <Row className="row mt-5" id="app">
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Image Crop</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <Row className="row g-0">
                <Col lg={5} xl={6} className="col-lg-5 col-xl-6 border-end">
                  <div className="ps-7 pb-7 pt-5 pe-5">
                    <div id="cropme"></div>
                    <div className="App">
                      <div className="crop-container">
                        <Cropper
                          image="http://localhost:5173/src/assets/images/media/23.jpg"
                          crop={crop}
                          zoom={zoom}
                          aspect={1 / 1}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                        />
                      </div>
                      <div className="controls">
                        <input
                          type="range"
                          value={zoom}
                          min={1}
                          max={3}
                          step={0.1}
                          aria-labelledby="Zoom"
                          onChange={(e) => {
                          }}
                          className="zoom-range"
                        />
                      </div>
                    </div>
                    <div aria-hidden="true" className="modal fade" id="cropmePosition"
                      role="dialog">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">

                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={7} xl={6}>
                  <div className="options px-5 pt-5  border-bottom pb-3">
                    <Row>
                      <Col md={6} mb={4}>
                        <div className="title font-weight-semibold text-uppercase mb-3">
                          Viewport Type
                        </div>
                        <Select options={options} classNamePrefix='Select2' placeholder="square(default)" />
                      </Col>
                      <Col md={6} mb={4}>
                        <div className="title font-weight-semibold text-uppercase mb-3">
                          transform origin center
                        </div>
                        <Select options={options1} classNamePrefix='Select2' placeholder="image" />
                      </Col>
                    </Row>
                  </div>
                  <div className="options px-5 pt-5  border-bottom pb-3">
                    <div className="title font-weight-semibold text-uppercase mb-3">
                      Border
                    </div>
                    <Row>
                      <Col md={4} mb={4}>
                        <label className="text-capitalize">enable</label>
                        <Select options={options2} classNamePrefix='Select2' placeholder="true(default)" />

                      </Col>
                      <Col md={4} mb={4}>
                        <label className="text-capitalize">width</label>
                        <Select options={options3} classNamePrefix='Select2' placeholder="2(default)" />

                      </Col>
                      <Col md={4} mb={4}>
                        <label className="text-capitalize">color</label>
                        <Select options={options4} classNamePrefix='Select2' placeholder="white(default)" />

                      </Col>
                    </Row>
                  </div>
                  <div className="options px-5 pt-5  border-bottom pb-3">
                    <div className="title font-weight-semibold text-uppercase mb-3">
                      Zoom
                    </div>
                    <div className="row">
                      <Col md={4} mb={4}>
                        <label className="text-capitalize">enable</label>
                        <Select options={options5} classNamePrefix='Select2' placeholder="true(default)" />

                      </Col>
                      <Col md={4} mb={4}>
                        <label className="text-capitalize">mouseWheel</label>
                        <Select options={options6} classNamePrefix='Select2' placeholder="true(default)" />

                      </Col>
                      <Col md={4} mb={4}>
                        <label className="text-capitalize">slider</label>
                        <Select options={options7} classNamePrefix='Select2' placeholder="true" />

                      </Col>
                    </div>
                  </div>
                  <div className="options px-5 pt-5  border-bottom pb-3">
                    <div className="title font-weight-semibold text-uppercase mb-3">
                      Rotation
                    </div>
                    <Row>
                      <Col md={4} mb={4}>
                        <label className="text-capitalize">enable</label>
                        <Select options={options8} classNamePrefix='Select2' placeholder="true(default)" />

                      </Col>
                      <Col md={4} mb={4}>
                        <label className="text-capitalize">slider</label>
                        <Select options={options9} classNamePrefix='Select2' placeholder="true" />

                      </Col>
                      <Col md={4} mb={4}>
                        <label className="text-capitalize">Position</label>
                        <Select options={options10} classNamePrefix='Select2' placeholder="left" />

                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>

        </Col>
      </Row>
    </Fragment>
  )
};

export default ImageCrop;
