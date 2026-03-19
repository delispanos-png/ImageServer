import React, { FC, Fragment, useEffect, useState } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Form, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { userlists, usersdata } from '../../../../components/Apps/UserList/UserList01/Data/UserlistData';
import { Link } from 'react-router-dom';

interface UserList01Props { }

const UserList01: FC<UserList01Props> = () => {
  //for User search function

  const [data, setdata] = useState(usersdata)
  useEffect(() => {
  }, [usersdata])
  const [data1, setdata1] = useState(true)

  //Delete function
  function handleRemove(id) {
    const RemoveData = data.filter((userdata) => userdata.id !== id);
    setdata(RemoveData);

  }
  //Update function

  let getdata = (data, id) => {

    data.map((ele) => {
      if (ele.id == id) {
        if (data.target.heading == "heading") {
          ele.heading = data.target.value
        }
        if (data.target.heading == "class") {
          ele.class = data.target.value
        }
        if (data.target.heading == "class2") {
          ele.class2 = data.target.value
        }
      }
    })
  }

  return (

    <Fragment>
      <PageHeader title="User List" />
      <Row className="flex-lg-nowrap">
        <Col className="col-12">
          <div className="row flex-lg-nowrap m-0">
            <div className="col-12 mb-3">
              <div className="e-panel card">
                <Card.Body>
                  <div className="e-table">
                    <div className="table-responsive table-lg mt-3">
                      <Table className="table table-bordered border-top text-nowrap">

                        <thead>

                          <tr>
                            {userlists.map((userlist) => (
                              <th key={Math.random()} className="align-top border-bottom-0 wd-20">{userlist.heading}
                              </th>
                            ))}

                          </tr>

                        </thead>

                        <tbody>
                          {data.map((userdata) => (
                            <tr key={Math.random()}>
                              <td className="align-middle">
                                <Form.Check type="checkbox" id="default-checkbox" />
                              </td>

                              <td className="align-middle">
                                <div className="d-flex">
                                  <img
                                    className="avatar brround avatar-md d-block"
                                    src={userdata.src1} />
                                  <div className="ms-3 mt-1">
                                    <h6 className="mb-0 font-weight-bold mt-2">
                                      {data1 ? userdata.heading : <input type='text' name="name" className='form-control' defaultValue={userdata.heading} onChange={(e) => { getdata(e, userdata.id) }} />}</h6>
                                  </div>
                                </div>
                              </td>
                              <td className="text-nowrap align-middle">{data1 ? userdata.class : <input type='text' name='created' className='form-control' defaultValue={userdata.class} onChange={(e) => { getdata(e, userdata.id) }} />}</td>
                              <td className="align-middle">
                                <div>
                                  <span
                                    className={`bg-${userdata.color}-transparent text-primary px-2 py-1 br-7 border-${userdata.color}`}>{userdata.class1}</span>
                                </div>
                              </td>
                              <td className="text-nowrap align-middle">
                                {data1 ? userdata.class2 :
                                  <input type='text' name='mail' className='form-control'
                                    defaultValue={userdata.class2} onChange={(e) => { getdata(e, userdata.id) }} />}
                              </td>
                              <td className="align-middle">
                                <Link to="#" className="btn btn-sm btn-info me-1" onClick={() => { setdata1(!data1) }}>
                                  {data1 ?
                                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                      <i className="las la-pen" ></i>
                                    </OverlayTrigger> :
                                    <OverlayTrigger placement="top" overlay={<Tooltip>Update</Tooltip>}>
                                      <i className="fe fe-check-circle"></i>
                                    </OverlayTrigger>}
                                </Link>
                                <Button onClick={() => { handleRemove(userdata.id) }} className="btn-sm me-1" variant='danger'
                                  type="button" ><i
                                    className={`fe fe-${userdata.main1}-2`}></i></Button>
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Card.Body>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
};

export default UserList01;
