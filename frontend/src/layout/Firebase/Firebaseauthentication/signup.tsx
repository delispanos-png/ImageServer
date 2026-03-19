import React, { FC, Fragment, useState } from 'react';
import Logo1 from '../../../assets/images/brand/logo1.png';
import { Card, Col, InputGroup, Row, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../Firebaseapi/Firebaseapi';

interface Register02Props { }

const Register02: FC<Register02Props> = () => {
    document.body.classList.add("register-2", "login-page");

    const [err, setError] = useState("");
    const [Loader, setLoader] = useState(false);
    const [data, setData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmpassword: "",
    })
    const { email, password, fullname, confirmpassword } = data;
    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const Signup = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password).then(
            user => { console.log(user); RouteChange(); setLoader(false) }).catch(err => { console.log(err); setError(err.message); setLoader(false) })
    }
    let navigate = useNavigate();
    const RouteChange = () => {
        let path = `${import.meta.env.BASE_URL}dashboard`;
        navigate(path);
    }

    return (
        <Fragment>
            <div className="page">
                <div className="page-content">
                    <div className="container">
                        <Row>
                            <div className="col mx-auto mt-5">
                                <div className="row justify-content-center">
                                    <Col md={6} xl={4}>
                                        <div className="text-center mb-6">
                                            <Link to={`${import.meta.env.BASE_URL}dashboard`}>
                                                <img src={Logo1} className="header-brand-img" alt="Azea logo" /></Link>
                                        </div>
                                        <Card>
                                            <Card.Body>
                                                <div className="text-center mb-3">
                                                    <h1 className="mb-2">Register</h1>
                                                    {err && <Alert variant="danger">{err}</Alert>}
                                                    <Link to="#">Create New Account</Link>
                                                </div>
                                                <div className="mt-5">
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text>
                                                            <i className="fe fe-user"></i>
                                                        </InputGroup.Text>
                                                        <Form.Control type="text" name='fullname' placeholder="Username" value={fullname} onChange={changeHandler} required />
                                                    </InputGroup>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text>
                                                            <i className="fe fe-mail"></i>
                                                        </InputGroup.Text>
                                                        <Form.Control placeholder="Email" name="email" type="email" value={email} onChange={changeHandler} required />
                                                    </InputGroup>
                                                    <InputGroup className="mb-4">
                                                        <span className="input-group-text"><i className="fe fe-lock"></i></span>
                                                        <Form.Control  name="password" type="password" placeholder="Password" value={password} onChange={changeHandler} required />
                                                    </InputGroup>
                                                    
                                                    <Form.Group>
                                                        {/* <label className="custom-control custom-checkbox">
														<input type="checkbox" className="custom-control-input"/>
														<span className="custom-control-label">I Agree For<a href="#" className="font-weight-bold">  Terms & Conditions.</a></span>
													</label> */}
                                                        <Form.Check type="checkbox" label="I Agree For Terms & Conditions." />

                                                    </Form.Group>
                                                    <div className="form-group text-center mb-3">
                                                        <Link to={`${import.meta.env.BASE_URL}dashboard`} className="btn btn-primary w-100 br-7" onClick={Signup}>Sign Up{Loader ? <span role="status" aria-hidden="true" className="spinner-border spinner-border-sm ms-2"></span> : ""}</Link>
                                                    </div>
                                                    <Form.Group className="form-group fs-14 text-center font-weight-bold">
												<Link to={`${import.meta.env.BASE_URL}Firebase/Firebaseauthentication/login`} >If already have an Account</Link>
											</Form.Group>
                                                    
                                                    <div className="form-group fs-12 text-center">
                                                        By Clicking Sign up,Your agree to our  <Link to="#" className="font-weight-bold">Terms & Conditions</Link> and have read and acknowledge our  <a href="#" className="font-weight-bold">Privacy & Services.</a>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                        <div className="text-center register-icons">
                                            <div className="small text-white mb-4">Register using with</div>
                                            <Button className="btn bg-white-50  text-white-50 font-weight-semibold w-12 google me-2" type="button" variant='light'><i className="fa fa-google"></i></Button>
                                            <Button className="btn bg-white-50  text-white-50 font-weight-semibold  w-12 facebook me-2" type="button" variant='light'><i className="fa fa-facebook-f"></i></Button>
                                            <Button className="btn bg-white-50  text-white-50 font-weight-semibold w-12 twitter me-2" type="button" variant='light'><i className="fa fa-twitter"></i></Button>
                                        </div>
                                    </Col>
                                </div>
                            </div>
                        </Row>
                    </div>
                </div>
            </div>

        </Fragment>
    )
};

export default Register02;
