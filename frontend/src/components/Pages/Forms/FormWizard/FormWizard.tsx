import React, { FC, Fragment } from 'react';
import { BasicContent } from './Data/BasicContent';
import { VerticalOrientationWizard } from './Data/verticalWizard';
import { Card, Row, Form, Col } from 'react-bootstrap';
import  HorizontalLinearStepper, {  BasicFormWizard, VerticalWizard } from './Data/WizardData';
import { WizardForm } from './Data/FormWizardData';
import PageHeader from '../../../../layout/Header/pageheader';

interface FormWizardProps { }

const FormWizard: FC<FormWizardProps> = () => (
  <Fragment>
    <PageHeader title="Form Wizard" />
    <Row>
      <div className="col-12">
        <Card>
          <Card.Header>
            <Card.Title>Form Wizard</Card.Title>
          </Card.Header>
          <Card.Body>
            <HorizontalLinearStepper />
          </Card.Body>
        </Card>
      </div>
    </Row>
    <Row>
      <Col lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Accordion-Wizard-Form</Card.Title>
          </Card.Header>
          <Card.Body>
            <BasicFormWizard />

          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <Card.Header>
            <Card.Title>
              Basic Content Wizard
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <BasicContent />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <Card.Header>
            <Card.Title>
              Basic Wizard With Validation
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <WizardForm />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <Card.Header>
            <Card.Title>
              Vertical Orientation Wizard
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <VerticalOrientationWizard />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default FormWizard;
