import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import { useNavigate, NavLink } from 'react-router-dom';
import useWebSocket from './WSController';
import './../css/App.css';
import React, { useState, useEffect, useRef } from 'react';
import { API_URL, WEBSITE_PUBLIC, API_STORAGE_URL, USER_DETAILS, SET_LOCAL, GET_LOCAL, REMOVE_LOCAL, USER_LOGOUT } from './../Constant';
function Userheader() {
    const { sendWebSocketMessage, isConnected } = useWebSocket(WSonmessage, WSonerror, WSonclose, WSonopen);
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    // const { sendWebSocketMessage, isConnected } = useWebSocket(WSonmessage, WSonerror, WSonclose, WSonopen);
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


    function WSonerror(e) {
        console.log(e);
    }

    function WSonclose(e) {
        console.log(e);
    }
    function WSonopen(e) {
        console.log(e)
    }
    function WSonmessage(e) {
        const dataFromServer = JSON.parse(e.data);
        console.log('Userheader.js', dataFromServer);
        if (dataFromServer.type == 'utf8') {
            let dataWS = JSON.parse(dataFromServer.utf8Data);
            if (dataWS.type.code === 200) {//for new massage
                onNewMessage(dataWS);
            }
            //  else if (dataWS.type.code === 100) {//for new connetion
            //     checkOnlineOrOfflineArr(dataWS);
            //     // if (dataWS.user == LOGIN_USER._id) {
            //     //     setWsclientid(dataFromServer.clientid);
            //     // }
            //     // console.log(dataWS, dataFromServer.clientid);
            // } 
            else if (dataWS.type.code === 300) {//for massage typeing

            } else if (dataWS.type.code === 400) {//for massage typeing stop

            }
        } else if (dataFromServer.type == 'datafromws') {
            if (dataFromServer.code == 1000) {// new client connection
                console.log('connected client', dataFromServer.clientid);
            } else if (dataFromServer.code == 2000) {// client disconnection
                console.log('disconnect client', dataFromServer.clientid);
            }
        }
    }

    function onNewMessage(data) {
        var chatuser_datais, user_is, user_id, active;
        chatuser_datais = GET_LOCAL('activechatuser');
        if (chatuser_datais !== false) {
            user_is = JSON.parse(chatuser_datais);
            user_id = user_is.chatuser;
            active = user_is.chatboxopen;
        } else {
            user_id = "";
            active = false;
        }
        if (data.to_user == LOGIN_USER._id) {
            console.log(data);
        }
    }


    return (
        <>
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
                            <Nav>
                                <NavDropdown title={LOGIN_USER.name}>
                                    <NavDropdown.Item onClick={() => { navigate('/user/home') }}>Profile</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            : null
                    }
                </Container>
            </Navbar>
        </>
    );
}

export default Userheader;