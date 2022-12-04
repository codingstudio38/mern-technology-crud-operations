import React, { useState, useEffect } from 'react';
import './../css/App.css';
import { Pagination } from 'antd';
import Table from 'react-bootstrap/Table';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL, USER_DETAILS } from './../Constant';
function Home() {
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    const [limitval, setLimitval] = useState([]);
    const [currentpage, setCurrentpage] = useState(1);
    const [postsperpage, setPostsperpage] = useState(5);
    const [alltotal, setAlltotal] = useState(0);
    var [pagingcounter, setPagingcounter] = useState(1);
    const [newdata, setNewdata] = useState([]);
    useEffect(() => {
        document.title = "MERN Technology || User - List";
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
                'authorization': LOGIN_USER.token,
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

    async function deleteUser(item) {
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        let result = await fetch(`${API_URL}/user?id=${item._id}`, {
            method: 'DELETE',
            headers: {
                'authorization': LOGIN_USER.token,
            }
        });
        result = await result.json();
        console.clear();
        if (result.status === 200) {
            if (item._id === LOGIN_USER._id) {
                alert("Your profile has been successfully deleted.");
                window.localStorage.clear();
                navigate('./../../');
            } else {
                alert(result.message);
                getdata(currentpage, postsperpage);
            }
        } else {
            alert(result.message);
        }
    }
    function ChangeDate(d) {
        let date = new Date(d);
        let timeis = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;//:${date.getMilliseconds()
        return `${date.toDateString()} ${timeis}`;
    }
    return (
        <div>
            <h2 style={{ textAlign: "center" }}>User List</h2>
            <Table striped bordered hover>
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
                        <th className='th-center'>Action</th>
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
                                    <img src={"http://localhost:5000/users-file/" + item.photo} width={"50px"} height={"60px"} />
                                </td>
                                <td align='center'>{ChangeDate(item.created_at)}</td>
                                <td align='center'>
                                    <Link className="btn btn-primary btn-sn" to={"./../edit?id=" + item._id} style={{ marginRight: "10px" }}> Edit</Link>
                                    <button onClick={() => deleteUser(item)} className='btn btn-danger btn-sn'>Delete</button>
                                </td>
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
            </Table>
        </div>
    )
}

export default Home;