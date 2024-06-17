import React, { useState, useEffect } from 'react';
import './../css/App.css';
import { Pagination } from 'antd';
import Table from 'react-bootstrap/Table';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL, USER_DETAILS, API_STORAGE_URL, WEBSITE_URL } from './../Constant';
function Videogallery() {
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    const [limitval, setLimitval] = useState([]);
    const [currentpage, setCurrentpage] = useState(1);
    const [postsperpage, setPostsperpage] = useState(5);
    const [alltotal, setAlltotal] = useState(0);
    var [pagingcounter, setPagingcounter] = useState(1);
    const [newdata, setNewdata] = useState([]);
    useEffect(() => {
        document.title = "MERN Technology || Video Gallery";
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        getdata(currentpage, postsperpage);
    }, []);
    async function getdata(page, size) {
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        let result = await fetch(`${API_URL}/users-list?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json()
        if (result.status === 200) {
            setCurrentpage(result.list.page);
            setPostsperpage(result.list.limit);
            setAlltotal(result.list.totalDocs);
            setNewdata(result.list.docs);
            setPagingcounter(result.list.pagingCounter);
            if (result.list.totalDocs <= 5) {
                setLimitval([5]);
            } else if (result.list.totalDocs <= 10) {
                setLimitval([5, 10]);
            } else if (result.list.totalDocs <= 25) {
                setLimitval([5, 10, 25]);
            } else if (result.list.totalDocs <= 50) {
                setLimitval([5, 10, 25, 50]);
            } else if (result.list.totalDocs <= 100) {
                setLimitval([5, 10, 25, 50, 100]);
            } else {
                setLimitval([5, 10, 25, 50, 100]);
            }
        } else {
            alert(result.message);
        }
    }
    function changePage(page) {
        getdata(page, postsperpage);
    }
    function changeperPage(e) {
        if (e.target.value === "Limit") {
            getdata(1, 5);
            setPostsperpage(5);
            setCurrentpage(1);
        } else {
            getdata(1, e.target.value);
            setPostsperpage(e.target.value);
            setCurrentpage(1);
        }
    }

    function PlayVideo() {

    }
    function ChangeDate(d) {
        let date = new Date(d);
        let timeis = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;//:${date.getMilliseconds()
        return `${date.toDateString()} ${timeis}`;
    }
    return (
        <div>
            <h2 style={{ textAlign: "center" }}>Video Gallery</h2>
            <div className='row col-md-12'>
                <div className='col-md-8'>
                    {/* onClick={() => PlayVideo()}  npm i 6app@latest*/}
                    <video id="videoPlayer" width="100%" height="100%" controls poster={`${WEBSITE_URL}/thum.jpg`}>
                        <source src='http://localhost:5000/nodejS-streams' type="video/mp4"></source>
                    </video>
                </div>
                <div className='col-md-4'>
                    <div className="col-sm-12 m-1" style={{ 'cursor': 'pointer' }}>
                        <div className="card">
                            <img className="card-img-top highte200" src={`${WEBSITE_URL}/thum.jpg`} alt="Card image cap"></img>
                            <div className="card-body">
                                <h5 className="card-title">Special title treatment</h5>
                                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 m-1" style={{ 'cursor': 'pointer' }}>
                        <div className="card">
                            <img className="card-img-top highte200" src={`${WEBSITE_URL}/thum.jpg`} alt="Card image cap"></img>
                            <div className="card-body">
                                <h5 className="card-title">Special title treatment</h5>
                                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* <Table striped bordered hover>
                <thead>
                    <tr>
                        <th colSpan={7}>
                            <select id='limit' name='limit' onChange={(e) => changeperPage(e)} className='limit' defaultValue={5}>
                                <option value="5">Limit</option>
                                {
                                    limitval.map((item, index) =>
                                        <option value={item} key={index}>{item}</option>
                                    )
                                }
                            </select>
                            <p style={{ textAlign: "right" }}> Total: {alltotal} of {pagingcounter + newdata.length - 1}</p>
                        </th>

                    </tr>
                    <tr>
                        <th className='th-center'>#</th>
                        <th className='th-center'>Name</th>
                        <th className='th-center'>Email Id</th>
                        <th className='th-center'>Phone No</th>
                        <th className='th-center'>Photo</th>
                        <th className='th-center'>Create Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        newdata.map((item, index) =>
                            <tr key={index} id={index}>
                                <td align='center'>{pagingcounter++}</td>
                                <td align='center'>{item.name}</td>
                                <td align='center'>{item.email}</td>
                                <td align='center'>{item.phone}</td>
                                <td align='center'>
                                    <img src={API_STORAGE_URL + "/users-file/" + item.photo} width={"50px"} height={"60px"} />
                                </td>
                                <td align='center'>{ChangeDate(item.created_at)}</td>
                            </tr>
                        )
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={7} align='center'>
                            <Pagination pageSize={postsperpage} total={alltotal} current={currentpage} onChange={(value) => changePage(value)} showQuickJumper />
                        </td>
                    </tr>
                </tfoot>
            </Table> */}
        </div>
    )
}

export default Videogallery;