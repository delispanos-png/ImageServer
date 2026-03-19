import React, { FC, Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import { squareAvatar, roundAvatar, radiusAvatar, sizeAvatar, avatarsize, avatarradius, statusavatar, statusroundavatar, statusradiusavatar, avatarList, avatarroundList, avatarradiusList } from '../../../components/Elements/Avathar/Data/avatharData';
interface AvatharProps { }

const Avathar: FC<AvatharProps> = () => (

  <Fragment>
    <PageHeader title="Avatars" />
    <Row>
      <Col md={12} xl={6} lg={6}>
        <Card>
          <Card.Header>
            <Card.Title>Simple Square Avatar</Card.Title>
          </Card.Header>
          <Card.Body>

            <div className='avathar-list'>
              {squareAvatar.map((squareAvatars) => (
                <img key={Math.random()} className=' me-2 avatar' src={squareAvatars.src1} />
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title as="h4">Simple Round Avatar</Card.Title>
          </Card.Header>
          <Card.Body>

            <div className='Avathar-list'>
              {roundAvatar.map((roundAvatars) => (
                <img key={Math.random()} className=' me-2 avatar brround' src={roundAvatars.src1} />
              ))}
            </div>

          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title as="h4">Simple Radius Avatar</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className='Avathar-list'>
              {radiusAvatar.map((radiusAvatars) => (
                <img key={Math.random()} className=' me-2 avatar bradius' src={radiusAvatars.src1} />
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title>Avatar Size</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className='Avathar-list'>
              {sizeAvatar.map((sizeAvatars) => (
                <img  key={Math.random()} className={`mt-2 ${sizeAvatars.size}`} src={sizeAvatars.src1} />
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title>Rounded Avatar Size</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className='Avathar-list'>
              {avatarsize.map((avatarsizes) => (
                <img key={Math.random()} className={` mt-2 ${avatarsizes.size} brround`} src={avatarsizes.src1} />
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title>Radius Avatar Size</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className='Avathar-list'>
              {avatarradius.map((avataradiuss) => (
                <img key={Math.random()} className={` mt-2 ${avataradiuss.size} bradius`} src={avataradiuss.src1} />
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title>Avatar Status</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className='Avathar-list'>
              {statusavatar.map((statusavatars) => (
                <span className="me-2 avatar" key={Math.random()}>
                  <img src={statusavatars.src1} />
                  <span className={statusavatars.size}></span>
                </span>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title>Rounded Avatar Status</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className='Avathar-list'>
              {statusroundavatar.map((statusroundavatars) => (
                <span className="me-2 avatar brround" key={Math.random()}>
                  <img className="me-2 avatar brround" src={statusroundavatars.src1} />
                  <span className={statusroundavatars.size}></span>
                </span>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title>Radius Avatar Status</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className='Avathar-list'>
              {statusradiusavatar.map((statusradiusavatar) => (
                <span className="me-2 avatar bradius" key={Math.random()} >
                  <img className="me-2 avatar bradius" src={statusradiusavatar.src1} />
                  <span className={statusradiusavatar.size}></span>
                </span>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title>Avatars List</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className='Avathar-list' >
              {avatarList.map((avatarLists) => (
                <img key={Math.random()} className="avatar" src={avatarLists.src1} />
              ))}
              <span className="avatar">+8</span>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title>Rounded Avatars List</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="avatar-list avatar-list-stacked"
            >
              {avatarroundList.map((avatarroundLists) => (
                <img key={Math.random()} className="avatar brround" src={avatarroundLists.src1} />
              ))}
              <span className="avatar brround">+8</span>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6} xl={6}>
        <Card>
          <Card.Header>
            <Card.Title>Radius Avatars List</Card.Title>
          </Card.Header>
          <Card.Body>
            <div
              className="avatar-list avatar-list-stacked"
            >
              {avatarradiusList.map((avatarradiusLists) => (
                <img key={Math.random()} className="avatar bradius" src={avatarradiusLists.src1} />
              ))}
              <span className="avatar bradius">+8</span>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Fragment >

);

export default Avathar;
