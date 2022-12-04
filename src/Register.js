import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/App.css';
import Header from './Header';
import { API_URL, USER_DETAILS } from './Constant';
function Register() {
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    useEffect(() => {
        document.title = "MERN Technology || User - Register";
        document.body.style.backgroundColor = "aliceblue";
        if (!LOGIN_USER === false) {
            navigate('/user/home');
            return;
        }
    }, []);
    const [photo, setPhoto] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [btndisable, setDtndisable] = useState(false);
    function SignUp() { return (<>Sign Up</>) }
    function Loder() { return (<><i className="fa fa-spinner" aria-hidden="true"></i></>) }
    async function postFormData() {
        const myform = new FormData();
        myform.append('password', password);
        myform.append('phone', phone);
        myform.append('email', email);
        myform.append('name', name);
        myform.append('photo', photo);
        setDtndisable(true);
        let result = await fetch(`${API_URL}/create`, {
            method: 'POST',
            body: myform,
        });
        result = await result.json();
        console.clear();
        if (result.status === 200) {
            window.localStorage.clear();
            alert(result.message);
            navigate('/');
        } else {
            window.localStorage.clear();
            alert(result.message);
        }
        setDtndisable(false);
    }
    return (
        <div>
            <Header />
            <section className="vh-100">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-12 col-xl-11">
                            <div className="card text-black">
                                <div className="card-body p-md-5">
                                    <div className="row justify-content-center">
                                        <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                            <p className="text-center h2 fw-bold mb-3 mx-1 mx-md-4 mt-2" style={{ textTransform: "uppercase" }}>MERN Technology</p>
                                            <p className="text-center h3 fw-bold mb-3 mx-1 mx-md-4 mt-2">Sign Up</p>
                                            <form className="mx-1 mx-md-4" id="myform">
                                                <div className="d-flex flex-row align-items-center mb-2">
                                                    <div className="form-outline flex-fill mb-0">
                                                        <label htmlFor="photo" className="form-label">Profile Picture</label>
                                                        <input className="form-control" type="file" id="photo" onChange={(e) => setPhoto(e.target.files[0])} />
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-row align-items-center mb-2">
                                                    <div className="form-outline flex-fill mb-0">
                                                        <label className="form-label" htmlFor="name">Your Name</label>
                                                        <input type="text" id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-row align-items-center mb-2">
                                                    <div className="form-outline flex-fill mb-0">
                                                        <label className="form-label" htmlFor="email">Your Email</label>
                                                        <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-row align-items-center mb-2">
                                                    <div className="form-outline flex-fill mb-0">
                                                        <label className="form-label" htmlFor="phone">Phone No</label>
                                                        <input type="number" id="phone" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-row align-items-center mb-2">
                                                    <div className="form-outline flex-fill mb-0">
                                                        <label className="form-label" htmlFor="password">Password</label>
                                                        <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="form-check d-flex justify-content-center mb-3">
                                                    <input className="form-check-input me-2" type="checkbox" defaultValue id="form2Example3c" />
                                                    <label className="form-check-label" htmlFor="form2Example3">
                                                        I agree all statements in <a href="#!">Terms of service</a>
                                                    </label>
                                                </div>
                                                <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                    <button style={{ width: "100%" }} type="button" className="btn btn-primary" onClick={() => postFormData()}>
                                                        {btndisable ?
                                                            <Loder />
                                                            :
                                                            <SignUp />
                                                        }
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" className="img-fluid" alt="Sample image" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Register;