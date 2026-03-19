import React, { FC, Fragment } from 'react';
import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Dropdown, ListGroup, Pagination, Row } from 'react-bootstrap';
import { todolists, listsdata } from '../../../../components/Apps/TodoList/TodoList03/Data/Todolist03Data';

interface TodoList03Props { }

const TodoList03: FC<TodoList03Props> = () => (
  <Fragment>
    <PageHeader title="Todo List 3" />
    <Row>
      <Col md={12} xl={3} lg={4}>
        <Card>
          <ListGroup className="list-group-transparent mb-0 mail-inbox pb-3">
            <div className="mt-4 mb-4 ms-4 me-4 text-center">
              <Button href="#" className="d-grid" variant='primary'>Add New
                Task</Button>
            </div>
            {todolists.map((todolist) => (
              <ListGroup.Item key={Math.random()}
                className="list-group-item-action d-flex align-items-center">
                <i
                  className={`fe fe-${todolist.icon}  me-4 p-2 border-${todolist.color1} ${todolist.main} bg-${todolist.color1}-transparent text-primary`}></i>
                {todolist.heading}<span className={`ms-auto badge bg-${todolist.color}`}>{todolist.class}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Col>
      <Col md={12} xl={9} lg={8}>
        <Row>
          {listsdata.map((listdata) => (
            <Col xxl={3} xl={4} md={6} key={Math.random()}>
              <Card>
                <Card.Body className="p-0">
                  <div className="todo-widget-header d-flex pb-2 p-4">
                    <label className="custom-control custom-checkbox mb-0">
                      <input type="checkbox" className="custom-control-input"
                        name="example-checkbox2" value="option2" />
                      <span className="custom-control-label"></span>
                    </label>
                    <Dropdown className="ms-auto">
                      <Dropdown.Toggle as="a" className="option-dots no-caret" data-bs-toggle="dropdown"><i
                        className="fe fe-more-vertical fs-20"></i></Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-start">
                        <Dropdown.Item href="#">Assigned
                          to</Dropdown.Item>
                        <Dropdown.Item href="#">Mark As
                          Unread</Dropdown.Item>
                        <Dropdown.Item href="#">Mark As
                          Important</Dropdown.Item>
                        <Dropdown.Item href="#">Add to
                          Tasks</Dropdown.Item>
                        <Dropdown.Item href="#">Add
                          Star</Dropdown.Item>
                        <Dropdown.Item href="#">Move
                          to</Dropdown.Item>
                        <Dropdown.Item href="#">Mute</Dropdown.Item>
                        <Dropdown.Item href="#">Move to
                          Trash</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="px-5 pb-5 text-center">
                    <img src={listdata.src1} alt="img"
                      className="w-80 mx-auto br-7" />
                    <h6
                      className="mb-1 font-weight-semibold mt-4 p-2 bg-primary-transparent text-primary border-primary br-7">
                      <i className={`fe fe-${listdata.icon} fs-18 me-1 m-0`}></i> {listdata.heading}
                    </h6>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="pagination mb-4 float-end">
          <Pagination>
            <Pagination.Item disabled>Prev</Pagination.Item>
            <Pagination.Item className="active">
              {1}
            </Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>{4}</Pagination.Item>
            <Pagination.Item>{5}</Pagination.Item>
            <Pagination.Next>Next</Pagination.Next>
          </Pagination>
        </div>
      </Col>
    </Row>
  </Fragment>
);

export default TodoList03;
