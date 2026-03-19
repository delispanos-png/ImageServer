import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import { Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../../layout/Header/pageheader';
import PerfectScrollbar from "react-perfect-scrollbar";
import {chats,contacts} from './Data/Chat02Data';
interface Chat02Props {}

const Chat02: FC<Chat02Props> = () => {
  const [allData, setAllData] = React.useState(chats)
	let allElement2:any = [];
	let myfunction = (InputData) => {
		let allElement:any
		for (allElement of chats) {
			if (allElement.heading[0] == " ") {
				allElement.heading = allElement.title.trim()
			}
			if (allElement.heading.toLowerCase().includes(InputData.toLowerCase())) {
				if (allElement.heading.toLowerCase().startsWith(InputData.toLowerCase())) {
					allElement2.push(allElement);
				}
			}

		}
		setAllData(allElement2);
	};

  return(
  <Fragment>
  <PageHeader  title="Chat 2" />
  <Card>
    <Row>
      <Col lg={5} xl={4} className="pe-0" >
        <div className="overflow-hidden mb-0 mb-lg-0">
          <Card.Body className="p-0">
            <div className="main-content-left main-content-left-chat">
              <div className="p-4 pb-0 border-bottom">
													<InputGroup className="input-group">
														<Form.Control type="text"  onChange={(ele) => { myfunction(ele.target.value) }} className="form-control" placeholder="Search Friends..." />
														<Button type="button" className="btn" variant='primary'>
															<i className="fa fa-search"></i>
														</Button>
													</InputGroup>
												</div>
            
              <div className="main-chat-contacts-wrapper">
                <label className="form-label  fs-13">Active Contacts (28)</label>
               <div className='lSSlideOuter '>
               <div className='lSSlideWrapper usingCss'>
                <div className="main-chat-contacts" id="chatActiveContacts">
                {contacts.map((contact) => (
                  <div  key={Math.random()}>
               <div className="lslide">		
                    <div className="main-img-user online me-2 mb-2  "><img alt=""
                        src={contact.src1}
                        className="avatar avatar-md brround"/></div>
                    <small>{contact.heading}</small>
                  </div>
                  </div>
                  ))}
                  <div>
                    <div className="main-chat-contacts-more">
                      20+
                    </div><small>More</small>
                  </div>
                </div>
                </div>
                </div>
              </div>
              <div className="main-chat-list ps ps--active-y" id="ChatList">
              {allData.map((chat)=>(
                <Link to="#" key={Math.random()}>
                  <div className="media new">
                    <div className={chat.user}>
                      <img alt="" src={chat.src1}
                        className="avatar avatar-md brround"/><span>{chat.text}</span>
                    </div>
                    <div className="media-body">
                      <div className="media-contact-name">
                        <span>{chat.heading}</span> <span>{chat.text1}</span>
                      </div>
                      <p>{chat.data}</p>
                    </div>
                  </div>
                </Link>
              ))}
          
              </div>
            </div>
          </Card.Body>
        </div>
      </Col>
      <Col lg={7} xl={8} className="ps-0">
        <div className="border-start">
          <div className="main-content-body main-content-body-chat">
         

            <div className="main-chat-header">
              <div className="main-img-user"><img alt=""
                  src={ImagesData("users2")}
                  className="avatar avatar-md brround"/></div>
              <div className="main-chat-msg-name">
                <h6>Patrenna</h6><small>Last seen: 1 minute ago</small>
              </div>
              <nav className="nav">
                <Link className="nav-link" to="#" data-bs-toggle="dropdown" >
                  
                  <i className="fe fe-more-vertical"></i>
                </Link>
                <ul className="dropdown-menu dropdown-menu-start">
                  <li>
                  
                    <Link to="#" >
                    
                      <i className="fe fe-phone-call me-1"></i>
                      Call
                    
                      </Link>
                  </li>
                  <li>
                    
                    <Link to="#">
                      
                      <i className="fe fe-video me-1"></i>
                      Videocall</Link>
                  </li>
                  <li>
                    <Link to="#"><i className="fe fe-mail me-1"></i> New
                      Message</Link>
                  </li>
                  <li>
                    <Link to="#"><i className="fe fe-settings me-1"></i>
                      Settings</Link>
                  </li>
                </ul>
                <Link className="nav-link d-none d-sm-block" data-bs-toggle="tooltip"
                  to="#">
                    <OverlayTrigger
													placement="top"
													delay={{ show: 250, hide: 400 }}
													overlay={
														<Tooltip className="primary">Call</Tooltip>
													}
												><i className="fe fe-phone text-muted"></i>
                        </OverlayTrigger></Link>
                <Link className="nav-link d-none d-sm-block" data-bs-toggle="tooltip"
                  to="#">
                     <OverlayTrigger
													placement="top"
													delay={{ show: 250, hide: 400 }}
													overlay={
														<Tooltip className="primary mb-3">Archive</Tooltip>
													}
												><i
                    className="fe fe-folder-plus text-muted"></i>
                    </OverlayTrigger></Link>
                <Link className="nav-link d-none d-sm-block" data-bs-toggle="tooltip"
                  to="#">
                     <OverlayTrigger
													placement="top"
													delay={{ show: 250, hide: 400 }}
													overlay={
														<Tooltip className="primary">Trash</Tooltip>
													}
												><i
                    className="fe fe-trash-2 text-muted"></i>
                    </OverlayTrigger></Link>
                <Link className="nav-link d-none d-sm-block" data-bs-toggle="tooltip"
                  to="#">
                     <OverlayTrigger
													placement="top"
													delay={{ show: 250, hide: 400 }}
													overlay={
														<Tooltip className="primary">View Info</Tooltip>
													}
												><i
                    className="fe fe-alert-octagon text-muted"></i>
                    </OverlayTrigger></Link>
              </nav>
            </div>
            <div className="main-chat-body" id="ChatBody">
            <PerfectScrollbar style={{ width: "100%", height: "500px" }}>
              <div className="content-inner">
                <label className="main-chat-time"><span className="bg-primary-transparent">3
                    days ago</span></label>
                <div className="media flex-row-reverse">
                  <div className="main-img-user online"><img alt=""
                     src={ImagesData("users2")}
                      className="avatar avatar-md brround"/></div>
                  <div className="media-body">
                    <div className="main-msg-wrapper">
                      Ut enim ad minima veniam, quis nostrum exercitationem
                      ullam
                      corporis suscipit laboriosam, nisi ut aliquid ex ea
                      commodi
                    </div>
                    <div className="main-msg-wrapper">
                      sed quia non numquam eius modi tempora incidunt ut
                      labore
                    </div>
                    <div className="main-msg-wrapper">
                      sed quia non numquam eius modi tempora incidunt ut
                      labore
                    </div>
                    <div>
                      <span>9:48 am</span> <a href="#"><i
                          className="icon ion-android-more-horizontal"></i></a>
                    </div>
                  </div>
                </div>
                <div className="media">
                  <div className="main-img-user online"><img alt=""
                     src={ImagesData("users14")}
                      className="avatar avatar-md brround"/></div>
                  <div className="media-body">
                    <div className="main-msg-wrapper">
                      Nor again is there anyone who loves or pursues or
                      desires to
                      obtain pain of itself
                    </div>
                    <div className="main-msg-wrapper">
                      pursues or desires to obtain pain of itself
                    </div>
                    <div className="main-msg-wrapper">
                      who loves or pursues or Nor again is there anyone
                    </div>
                    <div>
                      <span>9:32 am</span> <a href="#"><i
                          className="icon ion-android-more-horizontal"></i></a>
                    </div>
                  </div>
                </div>
                <div className="media flex-row-reverse">
                  <div className="main-img-user online"><img alt=""
                     src={ImagesData("users2")}
                      className="avatar avatar-md brround"/></div>
                  <div className="media-body">
                    <div className="main-msg-wrapper">
                      Nullam dictum felis eu pede mollis pretium
                    </div>
                    <div>
                      <span>11:22 am</span> <a href="#"><i
                          className="icon ion-android-more-horizontal"></i></a>
                    </div>
                  </div>
                </div><label className="main-chat-time"><span
                    className="bg-primary-transparent">Yesterday</span></label>
                <div className="media">
                  <div className="main-img-user online"><img alt=""
                      src={ImagesData("users14")}
                      className="avatar avatar-md brround"/></div>
                  <div className="media-body">
                    <div className="main-msg-wrapper">
                      Lorem ipsum dolor sit amet, consectetuer adipiscing
                      elit.
                      Aenean commodo ligula eget dolor.
                    </div>
                    <div>
                      <span>9:32 am</span> <a href="#"><i
                          className="icon ion-android-more-horizontal"></i></a>
                    </div>
                  </div>
                </div>
                <div className="media flex-row-reverse">
                  <div className="main-img-user online"><img alt=""
                      src={ImagesData("users2")}
                      className="avatar avatar-md brround"/></div>
                  <div className="media-body">
                    <div className="main-msg-wrapper">
                      To take a trivial example, which of us ever undertakes
                      laborious physical exercise, except to obtain some
                      advantage
                    </div>
                  </div>
                </div>
                <div className="media flex-row-reverse mt-1">
                  <div className="main-img-user online"><img alt=""
                      src={ImagesData("users2")}
                      className="avatar avatar-md brround"/></div>
                  <div className="media-body">
                    <div className="main-msg-wrapper">
                      Et harum quidem rerum facilis est et expedita distinctio
                    </div>
                    <div>
                      <span>9:48 am</span> <a href="#"><i
                          className="icon ion-android-more-horizontal"></i></a>
                    </div>
                  </div>
                </div>
                <label className="main-chat-time"><span
                    className="bg-primary-transparent">Today</span></label>
                <div className="media">
                  <div className="main-img-user online"><img alt=""
                      src={ImagesData("users14")}
                      className="avatar avatar-md brround"/></div>
                  <div className="media-body">
                    <div className="main-msg-wrapper">
                      Et harum quidem rerum facilis est et expedita distinctio
                    </div>
                    <div className="main-msg-wrapper">
                      To take a trivial example, which of us ever undertakes
                      laborious physical exercise, except to obtain some
                      advantage
                    </div>
                    <div>
                      <span>10:12 am</span> <a href="#"><i
                          className="icon ion-android-more-horizontal"></i></a>
                    </div>
                  </div>
                </div>
                <div className="media flex-row-reverse">
                  <div className="main-img-user online"><img alt=""
                     src={ImagesData("users2")}
                      className="avatar avatar-md brround"/></div>
                  <div className="media-body">
                    <div className="main-msg-wrapper">
                      Et harum quidem rerum facilis est et expedita distinctio
                    </div>
                    <div className="main-msg-wrapper">
                      To take a trivial example, which of us ever undertakes
                      laborious physical exercise, except to obtain some
                      advantage
                    </div>
                    <div>
                      <span>09:40 am</span> <a href="#"><i
                          className="icon ion-android-more-horizontal"></i></a>
                    </div>
                  </div>
                </div>
              </div>
              </PerfectScrollbar>
            </div>
            <div className="main-chat-footer">
              <nav className="nav">
                <Link to="#" className="nav-link"
                  data-bs-toggle="tooltip">
                     <OverlayTrigger
													placement="top"
													delay={{ show: 250, hide: 400 }}
													overlay={
														<Tooltip className="primary">Camera</Tooltip>
													}
												><i
                    className="fe fe-camera fs-20 text-muted"></i>
                    </OverlayTrigger></Link>
                <Link to="#" className="nav-link"
                  data-bs-toggle="tooltip">
                     <OverlayTrigger
													placement="top"
													delay={{ show: 250, hide: 400 }}
													overlay={
														<Tooltip className="primary">Emoji</Tooltip>
													}
												><i
                    className="fa fa-smile-o fs-20 text-muted"></i>
                    </OverlayTrigger></Link>
                <Link to="#" className="nav-link"
                  data-bs-toggle="tooltip">
                     <OverlayTrigger
													placement="top"
													delay={{ show: 250, hide: 400 }}
													overlay={
														<Tooltip className="primary">Attach</Tooltip>
													}
												><i
                    className="fe fe-paperclip fs-20 text-muted"></i>
                    </OverlayTrigger></Link>
              </nav>
              <input className="form-control" placeholder="Type your message here..."
                type="text"/> <Link className="main-msg-send" to="#"><i
                  className="fa fa-paper-plane-o text-muted"></i></Link>
            </div>
            
          </div>
          
        </div>
      </Col>
    </Row>
  </Card>
</Fragment>
)
};

export default Chat02;
