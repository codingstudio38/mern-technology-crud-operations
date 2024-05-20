import React, { useState, useEffect } from 'react';
import './../css/App.css';
import { Pagination } from 'antd';
import Table from 'react-bootstrap/Table';
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { API_URL, USER_DETAILS } from '../Constant';
import $ from 'jquery';
function Userspost() {
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    const [limitval, setLimitval] = useState([]);
    const [currentpage, setCurrentpage] = useState(1);
    const [postsperpage, setPostsperpage] = useState(10);
    const [alltotal, setAlltotal] = useState(0);
    var [pagingcounter, setPagingcounter] = useState(1);
    var [userslist, setUserslist] = useState([]);
    const [newdata, setNewdata] = useState([]);
    const [show, setShow] = useState(false);
    const [showedit, setShowedit] = useState(false);
    const [user, setUser] = useState('');
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [content, setContent] = useState('');

    const [edituser, setEdituser] = useState('');
    const [edittitle, setEdittitle] = useState('');
    const [edittype, setEdittype] = useState('');
    const [editcontent, setEditcontent] = useState('');
    const [rowid, setRowid] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleEditClose = () => setShowedit(false);
    let [editpostdata, setEditpostdata] = useState({
        "_id": "",
        "userid": "",
        "title": "",
        "type": "",
        "content": "",
        "created_at": "",
        "updated_at": "",
        "__v": ""
    });
    useEffect(() => {
        document.title = "MERN Technology || Users - Post";
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        getdata(currentpage, postsperpage);
        getUserdata();
    }, []);
    async function getUserdata() {
        let result = await fetch(`${API_URL}/all-users`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json()
        if (result.status === 200) {
            // console.log(result.list);
            setUserslist(result.list)
        } else {
            alert(result.message);
        }
    }
    async function getdata(page, size) {
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        let result = await fetch(`${API_URL}/users/post-list?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json()
        if (result.status === 200) {
            setNewdata([]);
            // console.log(result);
            setCurrentpage(result.list.page);
            setPostsperpage(result.list.limit);
            setAlltotal(result.list.totalDocs);
            // setNewdata(result.list.docs); 
            setNewdata(result.newlist);
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
        setCurrentpage(page);
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
    async function saveData() {
        // console.log({'user':user,'title':title,'type':type,'content':content});
        const myform = new FormData();
        myform.append('user', user);
        myform.append('title', title);
        myform.append('type', type);
        myform.append('content', content);
        let result = await fetch(`${API_URL}/users/save-post`, {
            method: 'POST',
            body: myform,
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        console.clear();
        // console.log(result);
        if (result.status === 200) {
            alert(result.message);
            setShow(false);
            getdata(1, 10);
        } else {
            alert(result.message);
            console.error(result);
        }
    }

    async function EditRow(item) {
        let result = await fetch(`${API_URL}/users/post-byid/${item._id}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        console.clear();
        if (result.status === 200) {
            setShowedit(true);
            setEditpostdata(result.result);
            setRowid(result.result._id);
            setEdituser(result.result.userid);
            setEdittitle(result.result.title);
            setEdittype(result.result.type);
            setEditcontent(result.result.content);
            // console.log(editpostdata);
        } else {
            alert(result.message);
            console.error(result);
        }
    }

    async function DeleteRow(item) {
        if (window.confirm('Are you sure to delete this record ?')) {
            let result = await fetch(`${API_URL}/users/delete-post-byid/${item._id}`, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${LOGIN_USER.token}`,
                }
            });
            result = await result.json();
            console.clear();
            if (result.status === 200) {
                alert(result.message);
                getdata(1, 10);
            } else {
                alert(result.message);
                console.error(result);
            }
        }
    }

    async function updateData() {
        console.clear();
        // console.log({ 'rowid': rowid, 'user': edituser, 'title': edittitle, 'type': edittype, 'content': editcontent });
        if (rowid == "") {
            alert('Unknow error');
            setShowedit(false);
            getdata(1, 10);
            return false;
        }
        if (edituser == "") {
            alert('Please select user.'); return false;
        }

        const myform = new FormData();
        myform.append('rowid', rowid);
        myform.append('userid', edituser);
        myform.append('title', edittitle);
        myform.append('type', edittype);
        myform.append('content', editcontent);
        let result = await fetch(`${API_URL}/users/update-post`, {
            method: 'POST',
            body: myform,
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        console.clear();
        // console.log(result);
        if (result.status === 200) {
            alert(result.message);
            setShowedit(false);
            getdata(1, 10);
        } else {
            alert(result.message);
            console.error(result);
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
                            <button
                                id='modal_btn'
                                type='button'
                                className='btn btn-primary btn-sm m-2'
                                alert="Add New" title='Add New'
                                style={{ float: 'right' }}
                                onClick={() => handleShow()}
                            >
                                <i className="fa fa-plus-circle" aria-hidden="true"></i>
                            </button>
                            <p style={{ textAlign: "right" }}> Total: {alltotal} of {pagingcounter + newdata.length - 1}</p>
                        </th>

                    </tr>
                    <tr>
                        <th className='th-center'>#</th>
                        <th className='th-center'>User Name</th>
                        <th className='th-center'>Title</th>
                        <th className='th-center'>Type</th>
                        <th className='th-center'>Content</th>
                        <th className='th-center'>Created Date</th>
                        <th className='th-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        newdata.map((item, index) =>
                            <tr key={index} id={index} data-attributes={index}>
                                <td align='center'>{pagingcounter++}</td>
                                <td align='center'>{item.user_field.name}</td>
                                <td align='center'>{item.title}</td>
                                <td align='center'>{item.type}</td>
                                <td align='center'>
                                    <textarea defaultValue={item.content}>

                                    </textarea>
                                </td>
                                <td align='center'>{item.created_at} / {item.updated_at}</td>
                                <td align='center'>
                                    <button type='button' className='btn btn-warning btn-sm' onClick={() => EditRow(item)}>
                                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                    </button>
                                    <button type='button' className='btn btn-danger btn-sm' style={{ marginLeft: '4px' }} onClick={() => DeleteRow(item)}>
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                </td>
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


            <Modal show={show} onHide={handleClose} id="addmodal">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group m-1">
                            <label htmlFor="user">User</label>
                            <select className="form-control" id="user" name='user' onChange={(e) => setUser(e.target.value)}>
                                <option value={''}>Select User</option>
                                {
                                    userslist.map((item, index) =>
                                        <option value={item._id} key={index}>{item.name}</option>
                                    )
                                }
                            </select>
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name='title'
                                placeholder="Title"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="type">Type</label>
                            <select className="form-control" id="type" name='type' onChange={(e) => setType(e.target.value)}>
                                <option value={''}>Select Type</option>
                                <option value={'song'}>Song</option>
                                <option value={'sport'}>Sport</option>
                            </select>
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="content">Content</label>
                            <textarea rows={5} className='form-control' id="content" name='content' onChange={(e) => setContent(e.target.value)}>

                            </textarea>
                        </div>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => saveData()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>




            <Modal show={showedit} onHide={handleEditClose} id="editmodal">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group m-1">
                            <label htmlFor="user">User</label>
                            <select className="form-control" id="user" name='user' defaultValue={editpostdata.userid} onChange={(e) => setEdituser(e.target.value)}>
                                <option value={''}>Select User</option>
                                {
                                    userslist.map((item, index) =>
                                        <option value={item._id} key={index} >{item.name}</option>
                                        // selected = { editpostdata.userid == item._id ? true : false }
                                    )
                                }
                            </select>
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name='title'
                                placeholder="Title"
                                defaultValue={editpostdata.title}
                                onChange={(e) => setEdittitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="type">Type</label>
                            <select defaultValue={editpostdata.type} className="form-control" id="type" name='type' onChange={(e) => setEdittype(e.target.value)}>
                                <option value={''}>Select Type</option>
                                <option value={'song'} >Song</option>
                                <option value={'sport'} >Sport</option>
                            </select>
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="content">Content</label>
                            <textarea rows={5} className='form-control' id="content" name='content' defaultValue={editpostdata.content} onChange={(e) => setEditcontent(e.target.value)}>

                            </textarea>
                        </div>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => updateData()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Userspost;