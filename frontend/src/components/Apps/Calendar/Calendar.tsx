import React, { Component, FC, Fragment, useEffect, useState } from 'react';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages'
import { Button, Card, Col, Row } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from './data/events-utils';
import { Link } from 'react-router-dom';

class FullCalenderComponent extends Component {
  state = {
    calendarWeekends: true,

    // Data for ListCalendar******

    calendarEvents1: [
      { id: '1', title: "Event Now1", start: new Date() },
      { id: '2', title: "Event Now2", start: new Date() },
      { id: '3', title: "Event Now3", start: new Date() },
      { id: '4', title: "Event Now4", start: new Date() },
      { id: '5', title: "Event Now5", start: new Date() },
      { id: '6', title: "Event Now6", start: new Date() },
    ],


    // Data for FullCalendar******

    calendarEvents: [
      {
        title: "Atlanta Monster", start: new Date("2019-04-04 00:00"), id: "99999998"
      },
      {
        title: "My Favorite Murder", start: new Date("2019-04-05 00:00"), id: "99999999"
      }
    ],
    events: [

      { title: "Calendar Events", id: "1", bg: "bg-primary-transparent mb-2" },

      { title: "Birthday Events", id: "2", bg: " bg-success-transparent mb-2" },
      { title: "Holiday Calendar", id: "3", bg: "bg-info-transparent mb-2" },
      { title: "Office Events", id: "4", bg: "bg-danger-transparent mb-2" },
      { title: "Other Events", id: "5", bg: "bg-warning-transparent mb-2" },
      { title: "Festival Events", id: "6", bg: "bg-teal-transparent mb-2" },
      { title: "Timeline Events", id: "7", bg: "bg-dark-transparent mb-2" },


    ],
  };
  handleEventClick: ((arg) => void) | undefined;
  componentDidMount() {
    let draggableEl: any = document.getElementById("external-events");
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let title = eventEl.getAttribute("title");
        let id = eventEl.getAttribute("data");

        return {
          title: title,
          id: id
        };
      }
    });
  }

  eventClick = eventClick => {
  };
  handleEventClicks = (clickInfo: any) => {
    if (window.confirm(`Are you sure you want to delete the event? '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  };
  handleDateSelect = (selectInfo: any) => {
    let title = prompt("Event title");
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }

  };
  render() {
    return (
      <Fragment>
        <PageHeader title="Calendar" />
        <Row>
          <Col lg={3}>
            <Card>
                <Card.Body>
                  <div id="external-events" style={{ padding: "10px", height: "auto", maxHeight: "-webkit-fill-available" }}>
                    <div className="mb-3 d-grid">
                      <Button className="btn w-100 fs-15 text-start" variant='primary'
                       >Add New
                        Event</Button>
                    </div>
                    
                    {this.state.events.map(event => (
                      <Link to="#" className={`fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event ${event.bg} `} title={event.title} datatype={event.id} key={event.id}>
                        {/* <span className={`p-1 ${event.bg} ms-2 me-3 br-3`}></span> */}
                        <div className={`fc-event-main ${event.bg}`}> {event.title}</div>
                      </Link>
                    ))}
                  </div>
                  <div className="calendar-image">
                    <img src={ImagesData("pngs10")} alt="img" />
                  </div>
                </Card.Body>
            </Card>
          </Col>
          <Col lg={9}>
            <Card>
              <Card.Body>
                <FullCalendar initialView="dayGridMonth"
                  headerToolbar={{ start: "prev,next today", center: "title", end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek" }}
                  rerenderDelay={10}
                  eventDurationEditable={false}
                  editable={true}
                  droppable={true}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  events={this.state.calendarEvents}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  initialEvents={INITIAL_EVENTS} 
                  select={this.handleDateSelect}
                  eventClick={this.handleEventClicks}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
};
export default FullCalenderComponent;










