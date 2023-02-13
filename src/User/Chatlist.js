import './../css/chat-box.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL, USER_DETAILS, SET_LOCAL, GET_LOCAL, REMOVE_LOCAL } from './../Constant';
import Messagefilefilter from './Messagefilefilter';
import $ from 'jquery';
import { w3cwebsocket as W3CWebSocket } from "websocket";
const client = new W3CWebSocket('ws://127.0.0.1:8000');

function Chatlist() {
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    const [list, setList] = useState([]);
    const [searchkey, setSearchkey] = useState("");
    const [chatuser, setChatuser] = useState("");
    const [chatusername, setChatusername] = useState("Live Chat");
    const [chatuserphoto, setChatuserphoto] = useState("http://localhost:3000/no-img.jpg");
    const [totalchat, setTotalchat] = useState("");
    const [chatboxopen, setChatboxopen] = useState(false);
    const [chatlist, setChatlist] = useState([]);
    const [loginid, setLoginid] = useState(LOGIN_USER._id);
    useEffect(() => {
        document.title = "MERN Technology || User - Chat Box";
        REMOVE_LOCAL('activechatuser');
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        getUserlist("");
        client.onopen = () => {
            // var t = setInterval(function () {
            //     if (client.readyState !== 1) {
            //         clearInterval(t);
            //         return;
            //     } 
            //     client.send('{type:"ping"}');
            // }, 5000);
            //console.log('WebSocket Client Connected.');
        }
        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            //console.log(dataFromServer);
            if (dataFromServer.type.code === 200) {
                onNewMessage(dataFromServer);
            } else {
                onNewConnection(dataFromServer);
            }
        }
        // client.onerror = function (e) {
        //     console.log("An error occured while connecting... ", e.data);
        // };
        client.onclose = function () {
            // console.log('echo-protocol Client Closed');

        };

        setTimeout(() => {
            NewConnected("new user conected", `${LOGIN_USER._id}`);
        }, 1000);
    }, []);
    function NewConnected(value, id) {
        client.send(JSON.stringify({
            type: { message: "new conection", code: 100 },
            msg: value,
            user: id
        }));
    }

    const [message, setMessage] = useState("");
    const [messagefile, setMessagefile] = useState("");
    async function SendChat() {
        let chatuser_datais = GET_LOCAL('activechatuser');
        if (!chatuser_datais) {
            alert("Please select a user from user list.");
            return;
        }
        let user_is = JSON.parse(chatuser_datais);
        if (user_is.chatuser == "") {
            alert("Please select a user from user list.");
            return;
        }
        if (messagefile == "" && message == "") {
            document.getElementById("message-to-send").focus();
            return;
        }
        const myform = new FormData();
        myform.append('message', message);
        myform.append('chat_file', messagefile);
        myform.append('to_user', user_is.chatuser);
        myform.append('from_user', LOGIN_USER._id);
        let result = await fetch(`${API_URL}/save-user-chat`, {
            method: 'POST',
            body: myform,
            headers: {
                'authorization': LOGIN_USER.token,
            }
        });
        result = await result.json();
        if (result.status == 200) {
            setMessage("");
            setMessagefile("");
            document.getElementById("message_form").reset();
            setPhotosrc("http://localhost:3000/no-img.jpg");
            setShowimgbox(false);
            FindChat(result.lastid);
            client.send(JSON.stringify({
                type: { 'message': "new message", 'code': 200 },
                user: LOGIN_USER._id,
                to_user: user_is.chatuser,
                message_id: result.lastid
            }));
        } else {
            alert(result.message);
        }
    }

    async function FindChat(id) {
        var chatuser_datais, user_is, to_user;
        chatuser_datais = GET_LOCAL('activechatuser');
        user_is = JSON.parse(chatuser_datais);
        to_user = user_is.chatuser;
        let result = await fetch(`${API_URL}/find-chat?chatid=${id}&from_user=${LOGIN_USER._id}&to_user=${to_user}`, {
            method: 'GET',
            headers: {
                'authorization': LOGIN_USER.token,
            }
        });
        result = await result.json();
        console.clear();
        if (result.status == 200) {
            setTotalchat((pre) => {
                //return result.total;
                return pre + 1;
            });
            var pre_list = [];
            setChatlist((pre) => {
                // console.log("pre", pre);
                pre_list = pre;
                pre_list.push(result.chat);
                return pre_list;
            });

            // setTotalchat((pre) => {
            //     if (result.chat.from_user == LOGIN_USER._id) {
            //         return t;
            //     } else {
            //         return pre;
            //     }
            // });


            const element = $('#chat-history');
            element.animate({
                scrollTop: element.prop("scrollHeight")
            }, 500);


        } else {
            alert(result.message);
        }
    }


    async function getUserlist(key) {
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        if (key === undefined) {
            key = "";
        }
        let result = await fetch(`${API_URL}/users-chat-list?name=${key}`, {
            method: 'GET',
            headers: {
                'authorization': LOGIN_USER.token,
            }
        });
        result = await result.json();
        if (result.status === 200) {
            let letarray = result.data.filter((item) => {
                return item._id !== LOGIN_USER._id;
            });
            setList(letarray);
        } else {
            alert(result.message);
        }
    }
    function searchUser(k) {
        setSearchkey(k);
        getUserlist(k);
    }
    async function ActiveChatUser(id) {
        NewConnected("new user conected", `${LOGIN_USER._id}`);
        setChatuser(id);
        setChatboxopen(true);
        REMOVE_LOCAL('activechatuser');
        SET_LOCAL('activechatuser', JSON.stringify({ chatboxopen: true, chatuser: id, }));
        let result = await fetch(`${API_URL}/current-chat-user?from_user=${LOGIN_USER._id}&to_user=${id}`, {
            method: 'GET',
            headers: {
                'authorization': LOGIN_USER.token,
            }
        });
        result = await result.json();
        if (result.status === 200) {
            setChatuser(result.from_user_data._id);
            setChatusername(result.from_user_data.name);
            setChatuserphoto(`http://localhost:5000/users-file/${result.from_user_data.photo}`);
            setTotalchat(result.total);
            GetActiveChatList(id);
        } else {
            alert(result.message);
        }
    }
    async function GetActiveChatList(id) {
        let result = await fetch(`${API_URL}/chat-list?from_user=${LOGIN_USER._id}&to_user=${id}`, {
            method: 'GET',
            headers: {
                'authorization': LOGIN_USER.token,
            }
        });
        result = await result.json();
        if (result.status === 200) {
            setChatlist(result.chat_data);
            setTotalchat(result.total);
            setTimeout(() => {
                const element = document.getElementById("chat-history");
                element.scrollTop = element.scrollHeight;
            }, 200)
        } else {
            alert(result.message);
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
            //console.log("data ", data);
            // console.log("data.user", data.user);
            // console.log("data.to_user", data.to_user);
            // console.log("LOGIN_USER._i", LOGIN_USER._id);
            //console.log(`new message`);
            onNewMessageSound();
            if (data.type.code == 200) {
                document.getElementById(`off_${data.user}`).style.display = "none";
                document.getElementById(`on_${data.user}`).style.display = "block";
                if (data.user == user_id && active == true) {
                    FindChat(data.message_id);
                    //GetActiveChatList(data.user);
                } else {
                    alert(`new message id ${data.message_id}`);
                }
            }
        }
    }
    function onNewConnection(data) {
        console.log(`new conneciotn`);
        //onNewConnectionSound();
        if (data.user !== LOGIN_USER._id) {
            if (data.type.code === 100) {
                document.getElementById(`off_${data.user}`).style.display = "none";
                document.getElementById(`on_${data.user}`).style.display = "block";
            }
        }
    }

    function changeDate(d) {
        var date = new Date(d);
        return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
        //return date.toUTCString();
        //return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        //return date.toDateString();
    }


    const [photosrc, setPhotosrc] = useState("http://localhost:3000/no-img.jpg");
    const [showimgbox, setShowimgbox] = useState(false);
    function setIMGPhoto(e) {
        if (e.target.files[0] === undefined) {
            setShowimgbox(false);
            setMessagefile("");
            setPhotosrc("http://localhost:3000/no-img.jpg");
            return;
        }
        var name = e.target.files[0].name;
        console.log(name);
        var ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
        if (ext === "gif" || ext === "png" || ext === "PNG" || ext === "jpeg" || ext === "jpg") {
            var reader = new FileReader();
            reader.onload = function (event) {
                setPhotosrc(event.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        } else if (ext === "xlsx" || ext === "xls") {
            setPhotosrc("http://localhost:3000/excel.png");
        } else if (ext === "pdf") {
            setPhotosrc("http://localhost:3000/pdf.png");
        } else if (ext === "docx" || ext === "doc") {
            setPhotosrc("http://localhost:3000/doc.png");
        } else {
            setPhotosrc("http://localhost:3000/Icon-doc.png");
        }
        setMessagefile(e.target.files[0]);
        setShowimgbox(true);

    }

    function closeImgdiv() {
        setShowimgbox(false);
        setMessagefile("");
        setPhotosrc("http://localhost:3000/no-img.jpg");
    }

    function onNewMessageSound() {
        const audio = new Audio("http://localhost:3000/sound/Messenger_Notification.mp3");
        audio.play();
    }
    function onNewConnectionSound() {
        const audio = new Audio("http://localhost:3000/sound/new_connections.mp3");
        audio.play();
    }
    return (
        <div>
            <div className="container-chat container clearfix">
                <h2 style={{ "textAlign": "center", "textDecoration": "underline" }}>React JS Live Chat Box</h2>
                <div className="row" style={{ "marginBottom": "30px" }}>
                    <div className="col-md-4" style={{ 'padding': '0px' }}>
                        <div className="people-list" id="people-list">
                            <div className="search">
                                <input type="text" placeholder="search" onKeyUp={(e) => searchUser(e.target.value)} />
                                <i className="fa fa-search" />
                            </div>
                            <div className="list-he">



                                <ul className="list">
                                    {
                                        list.map((item, index) =>
                                            <li className="clearfix custom" key={index} onClick={() => ActiveChatUser(`${item._id}`)}>
                                                <div className="custom-in-dev">
                                                    <img src={"http://localhost:5000/users-file/" + item.photo} width="45" height="45" alt={item.name} />
                                                    <div className="about">
                                                        <div className="name" >{item.name}</div>
                                                        <div className="status" >
                                                            <div className='offline_div' id={"off_" + item._id} ><i className="fa fa-circle offline" /> offline</div>
                                                            <div className='online_div' id={"on_" + item._id} ><i className="fa fa-circle online" /> online</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    }

                                    {/* https://stackoverflow.com/questions/29286050/websocket-client-disconnects-on-sending-large-data */}
                                </ul>

                            </div>

                        </div>
                    </div>
                    <div className="col-md-8" style={{ 'padding': '0px' }}>
                        <div className="chat" style={{ "width": "100%" }}>
                            <div className="chat-header clearfix">
                                <img src={chatuserphoto} alt="avatar" className='chat-avatar' />
                                <div className="chat-about">
                                    <div className="chat-with">{chatusername}</div>
                                    <div className="chat-num-messages">already {totalchat} messages</div>
                                </div>
                                <i className="fa fa-star" />
                            </div>
                            <div className="chat-history" id="chat-history">
                                <ul>
                                    {
                                        chatlist.map((item, index) =>


                                            <li className="clearfix" key={index}>

                                                {item.sender == loginid ?
                                                    < div >
                                                        {
                                                            item.chat_file !== null && item.message !== null ?

                                                                <><div className="message-data align-right">
                                                                    <span className="message-data-time">{changeDate(item.created_at)}</span> &nbsp; &nbsp;
                                                                    <span className="message-data-name">You</span> <i className="fa fa-circle me" />
                                                                </div>
                                                                    <div className="message other-message float-right">
                                                                        <i className="fa fa-chevron-down mycon" aria-hidden="true"></i>
                                                                        <Messagefilefilter file={item.chat_file} />

                                                                        {item.message}

                                                                    </div></>

                                                                : item.chat_file == null && item.message !== null ?

                                                                    <><div className="message-data align-right">
                                                                        <span className="message-data-time">{changeDate(item.created_at)}</span> &nbsp; &nbsp;
                                                                        <span className="message-data-name">You</span> <i className="fa fa-circle me" />
                                                                    </div>
                                                                        <div className="message other-message float-right">
                                                                            <i className="fa fa-chevron-down mycon" aria-hidden="true"></i>
                                                                            {item.message}

                                                                        </div></>
                                                                    : item.chat_file !== null && item.message == null ?

                                                                        <><div className="message-data align-right">
                                                                            <span className="message-data-time">{changeDate(item.created_at)}</span> &nbsp; &nbsp;
                                                                            <span className="message-data-name">You</span> <i className="fa fa-circle me" />
                                                                        </div>
                                                                            <div className="message other-message float-right">
                                                                                <i className="fa fa-chevron-down mycon" aria-hidden="true"></i>
                                                                                <Messagefilefilter file={item.chat_file} />

                                                                            </div></>
                                                                        : <><div className="message-data align-right">
                                                                            <span className="message-data-time">{changeDate(item.created_at)}</span> &nbsp; &nbsp;
                                                                            <span className="message-data-name">You</span> <i className="fa fa-circle me" />
                                                                        </div>
                                                                            <div className="message other-message float-right">
                                                                                <i className="fa fa-chevron-down mycon" aria-hidden="true"></i>
                                                                                {item.message}

                                                                            </div></>
                                                        }

                                                    </div>

                                                    :
                                                    <div className="c-width">
                                                        {
                                                            item.chat_file !== null && item.message !== null ?

                                                                <><div className="message-data">
                                                                    <span className="message-data-name"><i className="fa fa-circle online" /> {chatusername}</span>
                                                                    <span className="message-data-time">{changeDate(item.created_at)}</span>
                                                                </div>
                                                                    <div className="message my-message">
                                                                        <i className="fa fa-chevron-down other" aria-hidden="true"></i>
                                                                        <Messagefilefilter file={item.chat_file} />
                                                                        {item.message}

                                                                    </div></>

                                                                : item.chat_file == null && item.message !== null ?

                                                                    <><div className="message-data">
                                                                        <span className="message-data-name"><i className="fa fa-circle online" /> {chatusername}</span>
                                                                        <span className="message-data-time">{changeDate(item.created_at)}</span>
                                                                    </div>
                                                                        <div className="message my-message">
                                                                            <i className="fa fa-chevron-down other" aria-hidden="true"></i>
                                                                            {item.message}

                                                                        </div></>
                                                                    : item.chat_file !== null && item.message == null ?

                                                                        <><div className="message-data">
                                                                            <span className="message-data-name"><i className="fa fa-circle online" /> {chatusername}</span>
                                                                            <span className="message-data-time">{changeDate(item.created_at)}</span>
                                                                        </div>
                                                                            <div className="message my-message">
                                                                                <i className="fa fa-chevron-down other" aria-hidden="true"></i>
                                                                                <Messagefilefilter file={item.chat_file} />

                                                                            </div></>
                                                                        : <><div className="message-data">
                                                                            <span className="message-data-name"><i className="fa fa-circle online" /> {chatusername}</span>
                                                                            <span className="message-data-time">{changeDate(item.created_at)}</span>
                                                                        </div>
                                                                            <div className="message my-message">
                                                                                <i className="fa fa-chevron-down other" aria-hidden="true"></i>
                                                                                {item.message}

                                                                            </div></>
                                                        }
                                                    </div>
                                                }

                                            </li>


                                        )
                                    }

                                </ul>
                            </div>
                            <div className={showimgbox === true ? "file-view-area show" : "file-view-area hide"}>
                                <img src={photosrc} className='images' id='images' />
                                <div className='cross-div' onClick={() => closeImgdiv()}>
                                    <i className="fa fa-times-circle cross" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div className="chat-message clearfix">
                                <form id='message_form' method='post' encType='multipart/form-data'>
                                    <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows={3} defaultValue={""} onChange={(events) => { setMessage(events.target.value) }} />
                                    <label className="fa fa-file-image-o" htmlFor="IMGPhoto"></label>
                                    <input id="IMGPhoto" type="file" accept="image/png, image/gif, image/jpeg,.xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf" style={{ display: "none" }} onChange={(e) => setIMGPhoto(e)} />
                                    <button type='button' onClick={() => SendChat()}>Send</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}
export default Chatlist;