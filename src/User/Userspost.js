import React, { useState, useEffect } from 'react';
import './../css/App.css';
import { Pagination } from 'antd';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import { API_URL, USER_DETAILS } from '../Constant';
function Home() {
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    const [limitval, setLimitval] = useState([]);
    const [currentpage, setCurrentpage] = useState(1);
    const [postsperpage, setPostsperpage] = useState(10);
    const [alltotal, setAlltotal] = useState(0);
    var [pagingcounter, setPagingcounter] = useState(1);
    const [newdata, setNewdata] = useState([]);
    useEffect(() => {
        document.title = "MERN Technology || Users - Post";
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
        let result = await fetch(`${API_URL}/users/post-list?page=${page}&size=${size}`, {
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
    async function changePage(page) {
        getdata(page, postsperpage);
    }
    async function changeperPage(e) {
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
    return (
        <div>
            <h2 style={{ textAlign: "center" }}>Users Post</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th colSpan={6}>
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
                        <th className='th-center'>User Name</th>
                        <th className='th-center'>Title</th>
                        <th className='th-center'>Type</th>
                        <th className='th-center'>Content</th>
                        <th className='th-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        newdata.map((item, index) =>
                            <tr key={index} id={index}>
                                <td align='center'>{pagingcounter++}</td>
                                <td align='center'>{item.user_field.name}</td>
                                <td align='center'>{item.title}</td>
                                <td align='center'>{item.type}</td>
                                <td align='center'>{item.content}</td>
                                <td align='center'>Action</td>
                            </tr>
                        )
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={6} align='center'>
                            <Pagination pageSize={postsperpage} total={alltotal} current={currentpage} onChange={(value) => changePage(value)} showQuickJumper />
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}

export default Home;