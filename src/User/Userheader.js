import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import { useNavigate, NavLink } from 'react-router-dom';
import { API_URL, USER_DETAILS, USER_LOGOUT } from './../Constant';
import React, { useEffect, useRef } from 'react';
import './../css/App.css';
import { WebsocketController } from './WebsocketController';
function Userheader() {
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    useEffect(() => {
        // setInterval(function () {

        // }, 1000);
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
    }, []);
    function checkUser() {
        if (!LOGIN_USER === false) {
            return LOGIN_USER;
        } else {
            return false;
        }
    }
    async function logout() {
        if (!LOGIN_USER === false) {
            if (window.confirm("Are you sure ?")) {
                let result = await USER_LOGOUT(`Bearer ${LOGIN_USER.token}`);
                console.clear();
                if (result.status == 401) {
                    window.localStorage.clear();
                    navigate('./../../');
                    return false;
                }
                if (result.status === 200) {
                    window.localStorage.clear();
                    navigate('./../../');
                } else {
                    alert(result.message);
                }
            }
        } else {
            alert("Failed..!! User details not found.");
        }
    }
    function WSonopen(e) {
        console.log(e);
    }
    function WSonmessage(e) {
        console.log('Userheader.js', 'calling WSonmessage function');
    }
    function WSonerror(e) {
        console.log(e);
    }

    function WSonclose(e) {
        console.log(e);
    }
    const childRef = useRef(null);
    function CloseWSClient() {
        if (childRef.current) {
            childRef.current.CloseWSClientFn(false);
        }
    }

    const childDataSendRef = useRef(null);
    function clientSend(data) {
        if (childDataSendRef.current) {
            childDataSendRef.current.WSsendFn(data);
        }
    }

    const _WSclient = useRef(null);
    function WSclient_() {
        if (_WSclient.current) {
            return _WSclient.current.MyWSclient();
        } else {
            return null;
        }
    }
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Nav className="me-auto">
                    <NavLink className={"navlink"} to="/user/home">Home</NavLink>
                    <NavLink className={"navlink"} to="/user/users-post">Users Post</NavLink>
                    <NavLink className={"navlink"} to="/user/video-gallery">Video Gallery</NavLink>
                    <NavLink className={"navlink"} to="/user/chat-box">Live Chat</NavLink>
                </Nav>
                {
                    checkUser() ?
                        <>
                            {/* <WebsocketController ponopen={WSonopen} ponmessage={WSonmessage} ponerror={WSonerror} ponclose={WSonclose} RunWS={true} ref={[childRef, childDataSendRef, _WSclient]} /> */}
                            <Nav>
                                <NavDropdown title={LOGIN_USER.name}>
                                    <NavDropdown.Item onClick={() => { navigate('/user/home') }}>Profile</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav></>
                        : null
                }
            </Container>
        </Navbar>
    );
}

export default Userheader;