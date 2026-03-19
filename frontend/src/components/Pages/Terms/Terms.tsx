import React, { FC, Fragment } from 'react';
import PageHeader from '../../../layout/Header/pageheader';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { content } from '../../../components/Pages/Terms/Data/TermsData';
interface TermsProps { }
const Terms: FC<TermsProps> = () => (
  <Fragment>
    <PageHeader title="Terms & Conditions" />
    <Row>
      {content.map((Terms) => (
        <Col md={12} key={Math.random()}>
          <Card className=" overflow-hidden">
            <Card.Header>
              <Card.Title>{Terms.heading}</Card.Title>
            </Card.Header>
            <Card.Body>

              <p>I must explain to you how all this mistaken idea of denouncing pleasure and
                praising pain was born and I will give you a complete account of the system,
                and
                expound the actual teachings of the great explorer of the truth, the
                master-builder of human happiness. No one rejects, dislikes, or avoids
                pleasure
                itself, because it is pleasure, but because those who do not know how to
                pursue
                pleasure rationally encounter consequences</p>
            </Card.Body>
          </Card>
        </Col>
      ))}
      <Col md={12}>
        <Card className="overflow-hidden">
          <Card.Header>
            <Card.Title>Terms and Conditions</Card.Title>
          </Card.Header>
          <Card.Body>
            <p>I must explain to you how all this mistaken idea of denouncing pleasure and
              praising pain was born and I will give you a complete account of the system,
              and
              expound the actual teachings of the great explorer of the truth, the
              master-builder of human happiness. No one rejects, dislikes, or avoids
              pleasure
              itself, because it is pleasure, but because those who do not know how to
              pursue
              pleasure rationally encounter consequences</p>
            <ul className="list-style3">
              <li>ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                quos
                dolores </li>
              <li>quas molestias excepturi sint occaecati cupiditate non provident</li>
              <li>Nam libero tempore, cum soluta nobis est eligrighti optio cumque</li>
              <li>Temporibus autem quibusdam et aut officiis debitis aut rerum
                necessitatibus
                saepe eveniet ut et voluptates</li>
              <li>epudiandae sint et molestiae non recusandae itaque earum rerum hic
                tenetur a
                sapiente delectus</li>
              <li>ut aut reicirightis voluptatibus maiores alias consequatur aut
                perferrightis
                doloribus asperiores repellat</li>
            </ul>
          </Card.Body>
        </Card>
        <Card className="overflow-hidden">
          <Card.Header>
            <Card.Title>Was this information Helpful?</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="terms">
              <Link to="#" className="btn btn-primary text-white px-6 me-2">Yes</Link>
              <Link to="#" className="btn btn-secondary text-white px-6 me-2">No</Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default Terms;
