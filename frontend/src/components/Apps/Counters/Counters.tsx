import React, { FC, useEffect, useState, useRef, Fragment } from 'react';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TimeFormat from "hh-mm-ss";
import PageHeader from '../../../layout/Header/pageheader';
import Countdown from 'react-countdown';
import CountUp from "react-countup";

interface CountersProps { }

const Counters: FC<CountersProps> = () => {
  //DAY COUNTING
  const AfterComplete = () => <span>You are good to go!</span>;

  // Renderer callback with condition
  const rendering = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return <AfterComplete />;
    } else {
      // Render a countdown
      return (
        <Row>
          <Card.Body className="text-center">
            <div className="under-countdown row">
              <div className="col-lg-3 mb-2">
                <div className="countdown bg-primary-transparent">
                  <span className="days">{days}</span>
                  <span>Days</span>
                </div>
              </div>
              <div className="col-lg-3 mb-2">
                <div className="countdown bg-success-transparent">
                  <span className="hours">{hours}</span>
                  <span>Hours</span>
                </div>
              </div>
              <div className="col-lg-3 mb-2">
                <div className="countdown bg-danger-transparent">
                  <span className="minutes">{minutes}</span>
                  <span>Minutes</span>
                </div>
              </div>
              <div className="col-lg-3 mb-2">
                <div className="countdown bg-warning-transparent">
                  <span className="seconds">{seconds}</span>
                  <span>Seconds</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Row>
      );
    }
  };

  //TIME COUNTING DAYS LIMIT
  // Random component
  const AfterCompletion = () => <span>You are good to go!</span>;

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return <AfterCompletion />;
    } else {
      // Render a countdown
      return (
        <span className="h3 text-primary text-bold">
          <span>{days}Days {hours} Hours {minutes} Minutes {seconds} Seconds</span>
        </span>
      );
    }
  };

  //COUNTING 0 TO 3
  const formatTime = (time) =>
    ` ${String(Math.floor(time / 60)).padStart(2, "0")} : ${String(
      time % 60
    ).padStart(2, "0")}`;

  const Timer = ({ time }) => {

    return (
      <>
        <div> 00 Day 00 :{formatTime(time)}</div>
      </>
    );
  };

  const IntervalTimerFunctional = () => {
    const [time, setTime] = useState(0);

    useEffect(() => {
      const timerId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
      return () => clearInterval(timerId);
    }, []);

    return (

      <Timer time={time} />
    )
  };

  //COUNTING 60 TO 20

  const Timers = ({ min }) => {
    let mainTime;
    const secondsLeft = () => {
      const left = Number(min) * 60;
      return left;
    };

    const [seconds, setSeconds] = useState(secondsLeft());
    useEffect(() => {
      startTime();
      return () => {
        stopTimer();
      };
    });

    const startTime = () => {
      if (seconds && seconds > 20) {
        mainTime = setInterval(tick, 1000);
      }
    };

    const stopTimer = () => {
      clearInterval(mainTime);
    };

    const tick = () => {
      setSeconds((seconds) => {
        const updatedSeconds = seconds - 1;
        if (updatedSeconds < 1) {
          stopTimer();
        }
        return updatedSeconds;
      });
    };

    const display = TimeFormat.fromS(seconds, "hh:mm:ss");
    const [h, m, s] = display.split(":");
    return (
      <>
        <div> 00 Day :  {h} : {m} : {s}</div>
      </>
    );
  };
  //COUNTING 1 MINUTE
  const intervalRef: any = useRef(null);

  const [timer, setTimer] = useState("00:00:00");
  useEffect(() => {
    function getTimeRemaining(endtime) {
      let i: any = new Date()
      const total = Date.parse(endtime) - Date.parse(i);
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor(((total / 1000) * 60 * 60) % 60);

      return {
        total,
        hours,
        minutes,
        seconds,
      };
    }
    function startTimer(deadline) {
      let { total, hours, minutes, seconds } = getTimeRemaining(deadline);
      if (total >= 0) {
      } else {
        clearInterval(intervalRef.current);
      }
    }

    function clearTimer(endtime) {
      setTimer("00:00:60");
      if (intervalRef.current) clearInterval(intervalRef.current);
      const id = setInterval(() => {
        startTimer(endtime);
      }, 1000);
      intervalRef.current = id;
    }
    function getDeadlineTime() {
      let deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + 60);
      return deadline;
    }

    clearTimer(getDeadlineTime());
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  return (
    <Fragment>
      <PageHeader title="Counters"/>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Day Counter</Card.Title>
            </Card.Header>
            <Card.Body className=" text-center">
              <Countdown date={Date.now() + 3088800000} renderer={rendering} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Time Counting days Limit</Card.Title>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="bg-info-transparent p-3 br-3 text-center">

                <Countdown date={Date.now() + 259200000} renderer={renderer} />

              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Numbers counter</Card.Title>
            </Card.Header>
            <Card.Body className="card-body text-center">
              <span
                className="avatar avatar-xl brround bg-primary-transparent border-primary text-primary"><i
                  className="las la-users"></i></span>
              <h5 className="mt-4 text-muted">Employess</h5>
              <h2 className="counter text-primary">
                <CountUp end={2569} separator="," start={0} duration={1.94} /></h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Numbers counter</Card.Title>
            </Card.Header>
            <Card.Body className="card-body text-center">
              <span
                className="avatar avatar-xl brround bg-success-transparent border-success text-success"><i
                  className="las la-briefcase"></i></span>
              <h5 className="mt-4 text-muted">Profit</h5>
              <h2 className="counter text-success">
                <CountUp
                  end={256989}
                  separator=","
                  start={0.0}
                  duration={1.94}
                />
                .32</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Numbers counter</Card.Title>
            </Card.Header>
            <Card.Body className="card-body text-center">
              <span
                className="avatar avatar-xl brround bg-danger-transparent border-danger text-danger"><i
                  className="las la-trash"></i></span>
              <h5 className="mt-4 text-muted">Errors</h5>
              <h2 className="counter text-danger">0.
                <CountUp end={8998} start={0} duration={1.4} />
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} xl={4}>
          <Card className="overflow-hidden">
            <Link to="#"><img className="card-img-top  "
              src={ImagesData("media8")} alt="img" /></Link>
            <div className="card-body d-flex flex-column">
              <h4 className="font-weight-bold"><a href="#">Time Counting From
                0</a>
              </h4>
              <div className="text-muted">To take a trivial example, which of us ever undertakes
                laborious physical exerciser , except to obtain some advantage from it...
              </div>
              <div
                className="bg-primary-transparent text-primary border-primary p-3 br-3 mt-4 text-center">
                <span id="timer-countup" className="h4  mb-0 font-weight-bold">
                  <IntervalTimerFunctional />
                </span>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={12} xl={4}>
          <Card className="overflow-hidden">
            <Link to="#"><img className="card-img-top "
              src={ImagesData("media9")} alt="img" /></Link>
            <div className="card-body d-flex flex-column">
              <h4 className="font-weight-bold"><Link to="#">Time Counting From 60
                to
                20</Link></h4>
              <div className="text-muted">To take a trivial example, which of us ever undertakes
                laborious physical exerciser , except to obtain some advantage from it...
              </div>
              <div
                className="bg-warning-transparent text-warning border-warning p-3 br-3 mt-4 text-center">
                <span id="timer-countinbetween" className="h4  mb-0 font-weight-bold">
                  <Timers min={1} />
                </span>

              </div>
            </div>
          </Card>
        </Col>
        <Col md={12} xl={4}>
          <Card className="overflow-hidden">
            <Link to="#"><img className="card-img-top "
              src={ImagesData("media10")} alt="img" /></Link>
            <Card.Body className="card-body d-flex flex-column">
              <h4 className="font-weight-bold"><a href="#">Time 1 minute
                counter</a>
              </h4>
              <div className="text-muted">To take a trivial example, which of us ever undertakes
                laborious physical exerciser , except to obtain some advantage from it...
              </div>
              <div
                className="bg-danger-transparent text-danger border-danger p-3 br-3 mt-4 text-center">
                <span id="timer-countercallback" className="h4  mb-0 font-weight-bold ">
                  {timer}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
};

export default Counters;
