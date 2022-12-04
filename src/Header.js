import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import { useNavigate, NavLink } from 'react-router-dom';
import './css/App.css';
import { USER_DETAILS, USER_LOGOUT } from './Constant';
import React, { useEffect } from 'react';
function Header() {
    const LOGIN_USER = USER_DETAILS();
    const navigate = useNavigate();
    useEffect(() => {
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('');
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
                let result = await USER_LOGOUT(LOGIN_USER.token);
                console.clear();
                if (result.status === 200) {
                    window.localStorage.clear();
                    navigate('./../');
                } else {
                    alert(result.message);
                }
            }
        } else {
            alert("Failed..!! User details not found.");
        }
    }
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Nav className="me-auto">
                    {
                        checkUser() ?
                            <>
                                <NavLink className={"navlink"} to="/user/home">Home</NavLink>
                                <NavLink className={"navlink"} to="/user/users-post">Users Post</NavLink>
                            </>
                            :
                            <>
                                <NavLink className={"navlink"} to="/">Login</NavLink>
                                <NavLink className={"navlink"} to="/register">Register</NavLink>
                            </>
                    }

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
    );
}

export default Header;