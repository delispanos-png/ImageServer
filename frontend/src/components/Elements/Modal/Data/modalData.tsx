import React, { useState } from 'react'
import Modal from "react-animated-modal";
import { Button,Col, } from 'react-bootstrap';
export default function modalData() {
     //Animated Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
            <Col sm={6} md={4} xl={3}>
              <Modal  visible={isModalOpen}
  closemodal={() => setIsModalOpen(false)}
  type="zoomIn"
  duration={500}>
                  <Modal.Header>
                    <Modal.Title>Message Preview</Modal.Title>
                    <Button className="btn-close  btn-close-white "type="button"><span aria-hidden="true">&times;</span></Button>
                    </Modal.Header>
                    <Modal.Body className="modal-body text-center p-4">
                    <h6>Why We Use Electoral College. Not Popular Vote</h6>
                    <p>It is a long established fact that a reader will be
																distracted by the readable content of a page when
																looking at
																its layout. The point of using Lorem Ipsum is that it
																has a
																more-or-less normal distribution of letters, as opposed
																to
																using 'Content here, content here', making it look like
																readable English.</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" type="button">Save Changes</Button>
                    <Button variant="secondary"
                          type="button">Close</Button>
                  </Modal.Footer>
                </Modal>
                <Button onClick={() => setIsModalOpen(true)}>Slide in Right</Button>
              </Col> 
    </div>
  );
}
