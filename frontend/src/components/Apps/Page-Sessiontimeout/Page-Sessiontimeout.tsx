import React, { FC, Fragment, useEffect } from 'react';
import PageHeader from '../../../layout/Header/pageheader';
import { Card, Col, Row } from 'react-bootstrap';
import Swal from "sweetalert2";
interface PageSessiontimeoutProps { }
const PageSessiontimeout: FC<PageSessiontimeoutProps> = () => {
  useEffect(() => {

    Swal.fire({
      title: 'Session TimeOut',
      text: 'Youre being timed out due to inactivity. Please choose to stay signed in or to logoff. Otherwise, you will logged off automatically.',
      cancelButtonText: 'Log Out',
      confirmButtonText: 'Stay Loggedin',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#5121ad',
      cancelButtonColor: '#df2626',
      timer: 5000,
      timerProgressBar: true,
    })
  }, [])
  return (

    <Fragment>
      <PageHeader title="Page Session Timeout" />
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>
                Session Time Out Demo
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <p className="mg-b-20">The Basic Collapse Accordion Styles of Nixlot template</p>
              <p className="mg-b-10">I must explain to you how all this mistaken idea of
                denouncing
                pleasure and praising pain was born and I will give you a complete account
                of
                the system, and expound the actual teachings of the great explorer of the
                truth,
                the master-builder of human happiness. No one rejects, dislikes, or avoids
                pleasure itself, because it is pleasure, but because those who do not know
                how
                to pursue pleasure rationally encounter consequences</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
};

export default PageSessiontimeout;
