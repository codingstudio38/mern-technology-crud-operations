import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/App.css';
import Header from './Header';
import { API_URL, USER_DETAILS } from './Constant';
function Login() {
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    useEffect(() => {
        document.title = "MERN Technology || User - Login";
        document.body.style.backgroundColor = "aliceblue";
        if (!LOGIN_USER === false) {
            navigate('user/home');
            return;
        }
    }, []);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [btndisable, setDtndisable] = useState(false);
    function SignUp() { return (<>Sign Up</>) }
    function Loder() { return (<><i className="fa fa-spinner" aria-hidden="true"></i></>) }
    async function Login() {
        const myform = new FormData();
        myform.append('password', password);
        myform.append('email_id', email);
        setDtndisable(true);
        let result = await fetch(`${API_URL}/login`, {
            method: 'POST',
            body: myform,
        });
        result = await result.json();
        setDtndisable(false);
        console.clear();
        if (result.status === 200) {
            window.localStorage.clear();
            window.localStorage.setItem("userinfo", JSON.stringify(result.user));
            navigate('user/home');
        } else {
            window.localStorage.clear();
            alert(result.message);
        }
    }
    function SignUp() { return (<>Sign In</>) }
    function Loder() { return (<><i className="fa fa-spinner" aria-hidden="true"></i></>) }
    return (
        <div>
            <Header />
            <section>
                <div className="container">
                    <div className="row d-flex justify-content-center align-items-center" style={{ marginTop: "30px" }}>
                        <div className="col-lg-6 col-xl-6">
                            <div className="card text-black">
                                <div className="card-body p-md-5">
                                    <div className="row justify-content-center">
                                        <div className="col-md-10 col-lg-12 col-xl-12 order-2 order-lg-1">
                                            <p className="text-center h2 fw-bold mb-3 mx-1 mx-md-4 mt-2" style={{ textTransform: "uppercase" }}>MERN Technology</p>
                                            <p className="text-center h3 fw-bold mb-3 mx-1 mx-md-4 mt-2">Sign In</p>
                                            <form className="mx-1 mx-md-4">

                                                <div className="d-flex flex-row align-items-center mb-2">
                                                    <div className="form-outline flex-fill mb-0">
                                                        <label className="form-label" htmlFor="email">Email Id</label>
                                                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
                                                    </div>
                                                </div>

                                                <div className="d-flex flex-row align-items-center mb-2">
                                                    <div className="form-outline flex-fill mb-0">
                                                        <label className="form-label" htmlFor="password">Password</label>
                                                        <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                    <button style={{ width: "100%" }} type="button" className="btn btn-primary" onClick={() => Login()}>
                                                        {btndisable ?
                                                            <Loder />
                                                            :
                                                            <SignUp />
                                                        }
                                                    </button>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </div >
    )
}

export default Login;