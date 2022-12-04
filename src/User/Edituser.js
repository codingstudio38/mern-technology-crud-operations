import React, { useState, useEffect } from 'react';
import './../css/App.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL, USER_DETAILS, USER_LOGOUT } from '../Constant';
function Edituser() {
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    // const params = useParams();useParams//hook
    // const { id } = params;
    const [searchParams, setSearchParams] = useSearchParams();
    const [userid, setUserid] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState("");
    const [oldphoto, setOldphoto] = useState("");
    const [name, setName] = useState("");
    const [btndisable, setDtndisable] = useState(false);
    useEffect(() => {
        if (searchParams.get('id') == null || searchParams.get('id') === "") {
            navigate('./../home');
            return;
        }
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        document.title = "MERN Technology || User - Edit";
        setUserid(searchParams.get('id'));
        getUser(searchParams.get('id'));
    }, []);
    async function getUser(user) {
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        let result = await fetch(`${API_URL}/user?id=${user}`, {
            method: 'GET',
            headers: {
                'authorization': LOGIN_USER.token,
            }
        });
        result = await result.json();
        console.clear();
        if (result.status === 200) {
            setPhone(result.user.phone);
            setEmail(result.user.email);
            setOldphoto(result.user.photo);
            setName(result.user.name);
        } else {
            alert(result.message);
        }
    }


    async function updateUser(item) {
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        setDtndisable(true)
        const myform = new FormData();
        myform.append('name', name);
        myform.append('id', userid);
        myform.append('phone', phone);
        myform.append('email', email);
        myform.append('photo', photo);
        myform.append('password', password);
        myform.append('oldphoto', oldphoto);
        let result = await fetch(`${API_URL}/update`, {
            method: 'PUT',
            body: myform,
            headers: {
                'authorization': LOGIN_USER.token,
            }
        });
        result = await result.json();
        console.clear();
        if (result.status === 200) {
            if (userid === LOGIN_USER._id) {
                let result_log = await USER_LOGOUT(LOGIN_USER.token);
                console.clear();
                if (result_log.status === 200) {
                    alert("Your profile has been successfully updated.");
                    window.localStorage.clear();
                    setDtndisable(false);
                    navigate('./../../');
                } else {
                    setDtndisable(false);
                    alert(result_log.message);
                }
            } else {
                setDtndisable(false);
                alert(result.message);
                navigate('./../home');
            }
        } else {
            setDtndisable(false);
            alert(result.message);
        }
    }
    function SignUp() { return (<>Update</>) }
    function Loder() { return (<><i className="fa fa-spinner" aria-hidden="true"></i></>) }
    return (
        <div>
            <h2 style={{ textAlign: "center" }}>Edit User Details</h2>


            <div className="card-body p-md-5">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                        <form className="mx-1 mx-md-4" id="myform">
                            <div className="d-flex flex-row align-items-center mb-2">
                                <div className="d-flex align-items-center order-1 order-lg-2">
                                    <img src={"http://localhost:5000/users-file/" + oldphoto} style={{ width: "90px", marginLeft: "10px" }} className="img-fluid" alt="Sample image" />
                                </div>
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
                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                <button style={{ width: "100%" }} type="button" className="btn btn-primary" onClick={() => updateUser()}>
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

    )
}

export default Edituser;