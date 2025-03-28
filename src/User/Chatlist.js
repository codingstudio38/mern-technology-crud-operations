import './../css/chat-box.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL, WEBSITE_PUBLIC, API_STORAGE_URL, USER_DETAILS, SET_LOCAL, GET_LOCAL, REMOVE_LOCAL } from './../Constant';
import Messagefilefilter from './Messagefilefilter';
import $ from 'jquery';
import { WebsocketController } from './WebsocketController';
// import { w3cwebsocket } from "websocket";

function Chatlist() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messagefile, setMessagefile] = useState("");
    const LOGIN_USER = USER_DETAILS();
    const [list, setList] = useState([]);
    const [searchkey, setSearchkey] = useState("");
    const [chatuser, setChatuser] = useState("");
    const [chatusername, setChatusername] = useState("Live Chat");
    const [chatuserphoto, setChatuserphoto] = useState(`${WEBSITE_PUBLIC}/no-img.jpg`);
    const [totalchat, setTotalchat] = useState("");
    const [chatboxopen, setChatboxopen] = useState(false);
    const [chatlist, setChatlist] = useState([]);
    const [loginid, setLoginid] = useState(LOGIN_USER._id);
    const [typinglabel, setTypinglabel] = useState(false);
    const [wsclientid, setWsclientid] = useState('');
    let [page, setPage] = useState(1);
    let [limit, setLimit] = useState(10);
    let [totalpage, setTotalpage] = useState(0);


    var activewsclients = [];
    var allusers = [];
    // const [activewsclients, setActivewsclients] = useState([]);
    // const [WSclient, setWSclient] = useState(null);
    // const [isConnected, setIsConnected] = useState(false);
    // var [reconnectIn, setReconnectIn] = useState(0);
    // var [wsreadyState, setWsreadyState] = useState(0);
    useEffect(() => {
        document.title = "MERN Technology || User - Chat Box";
        REMOVE_LOCAL('activechatuser');
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        getUserlist("");
        // setTimeout(() => {
        //     WSclient_()
        // }, 2000)
        setTimeout(() => {
            getNumberofActiveUser();
        }, 1000)
        // setTimeout(() => {
        //     delete WSclient_();
        // }, 3000)
        // console.log(WebsocketController({ 'onopen': WSonopen, 'onmessage': WSonmessage, 'onerror': WSonerror, 'onclose': WSonclose }));
    }, []);

    ////////////////////for WebsocketController start////////////////////
    ////////////////////for WebsocketController start////////////////////
    ////////////////////for WebsocketController start////////////////////
    ////////////////////for WebsocketController start////////////////////
    ////////////////////for WebsocketController start////////////////////
    function WSonopen(e) {
        setTimeout(() => {
            // clientSend(JSON.stringify({
            //     type: { message: "new conection", code: 100 },
            //     msg: "new user conected",
            //     user: LOGIN_USER._id
            // }));
            UpdateUserWeStatus(LOGIN_USER._id, 1);
        }, 1000)

    }

    function WSonmessage(e) {
        console.log('Chatlist.js', 'calling WSonmessage function');
        const dataFromServer = JSON.parse(e.data);
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
                onKeyDownFN(dataWS);
            } else if (dataWS.type.code === 400) {//for massage typeing stop
                onKeyUpFN(dataWS);
            }
        } else if (dataFromServer.type == 'datafromws') {
            if (dataFromServer.code == 1000) {// new client connection
                console.log('connected client', dataFromServer.clientid);
                getNumberofActiveUser();
            } else if (dataFromServer.code == 2000) {// client disconnection
                console.log('disconnect client', dataFromServer.clientid);
                getNumberofActiveUser();
            } else {
                console.log('disconnect client', dataFromServer);
            }
        }

    }

    function WSonerror(e) {
        console.log(e);
    }

    function WSonclose(e) {
        console.log(e);
    }

    const childRef = useRef(null);
    function CloseWSClient() {
        if (childRef.current) {
            childRef.current.CloseWSClientFn(false);
        }
    }

    const childDataSendRef = useRef(null);
    function clientSend(data) {
        if (childDataSendRef.current) {
            childDataSendRef.current.WSsendFn(data);
        }
    }

    const _WSclient = useRef(null);
    function WSclient_() {
        if (_WSclient.current) {
            return _WSclient.current.MyWSclient();
        } else {
            return null;
        }
    }
    ////////////////////for WebsocketController end////////////////////
    ////////////////////for WebsocketController end////////////////////
    ////////////////////for WebsocketController end////////////////////
    ////////////////////for WebsocketController end////////////////////
    ////////////////////for WebsocketController end////////////////////

    function onKeyDownFN(data) {
        let chatuser_datais = GET_LOCAL('activechatuser');
        chatuser_datais = chatuser_datais == false ? {} : JSON.parse(chatuser_datais);
        // console.clear();
        // console.log(data);
        // console.log(chatuser_datais);
        if (data.user != undefined) {
            if (chatuser_datais.chatuser != undefined) {
                // console.log(chatuser_datais.chatuser, data.user);
                if (chatuser_datais.chatuser == data.user) {
                    setTypinglabel(true);
                    // console.log(typinglabel, `${chatuser_datais.chatuser} user is typing..`);
                }
            }
        }
    }
    function onKeyUpFN(data) {
        let chatuser_datais = GET_LOCAL('activechatuser');
        chatuser_datais = chatuser_datais == false ? {} : JSON.parse(chatuser_datais);
        // console.clear();
        // console.log(data);
        // console.log(chatuser_datais);
        if (data.user != undefined) {
            if (chatuser_datais.chatuser != undefined) {
                console.log(chatuser_datais.chatuser, data.user);
                if (chatuser_datais.chatuser == data.user) {
                    setTimeout(() => {
                        setTypinglabel(false);
                    }, 1000)
                    // console.log(typinglabel, `${chatuser_datais.chatuser} user is typing stop.`);
                }
            }
        }
    }
    function TypeinggMassageFN(type) {
        if (type) {
            clientSend(JSON.stringify({
                type: { message: "user is typing..", code: 300 },
                msg: "typing",
                user: LOGIN_USER._id
            }));
        } else {
            clientSend(JSON.stringify({
                type: { message: "user typing stop.", code: 400 },
                msg: "typing stop",
                user: LOGIN_USER._id
            }));
        }
    }
    async function UpdateUserWeStatus(userid, status) {
        const myform = new FormData();
        myform.append('userid', userid);
        myform.append('status', status);
        let result = await fetch(`${API_URL}/update-user-wsstatus`, {
            method: 'POST',
            body: myform,
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        if (result.status == 200) {
            console.log(result.message);
        } else {
            console.error(result.message);
        }
    }

    async function getNumberofActiveUser() {
        const myform = new FormData();
        myform.append('status', 1);
        let result = await fetch(`${API_URL}/users/number-of-active-user`, {
            method: 'POST',
            body: myform,
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        if (result.status == 200) {
            // console.log(result);
            // setActivewsclients();
            activewsclients = [];
            activewsclients = result.data;
            // console.log(activewsclients);
            checkOnlineOrOfflineArr();
        } else {
            console.error(result.message);
        }
    }


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
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        if (result.status == 200) {
            setMessage("");
            setMessagefile("");
            document.getElementById("message_form").reset();
            setPhotosrc(`${WEBSITE_PUBLIC}/no-img.jpg`);
            setShowimgbox(false);
            FindChat(result.lastid);
            clientSend(JSON.stringify({
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
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        // console.clear();
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
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        // console.log(result);
        if (result.status === 200) {
            let letarray = result.data.filter((item) => {
                return item._id !== LOGIN_USER._id;
            });
            letarray.forEach(user => {
                getnoofunseenchat(user._id, LOGIN_USER._id);
            });
            // console.log(letarray);
            setList(letarray);
            allusers = [];
            allusers = letarray;
        } else {
            alert(result.message);
        }
    }
    function searchUser(k) {
        setSearchkey(k);
        getUserlist(k);
    }
    async function ActiveChatUser(id) {
        // clientSend(JSON.stringify({
        //     type: { message: "new conection", code: 100 },
        //     msg: "new user conected",
        //     user: LOGIN_USER._id
        // }));
        setChatlist([]);
        setTotalchat(0);
        setTotalpage(0);
        setPage(1);
        setChatuser(id);
        setChatboxopen(true);
        REMOVE_LOCAL('activechatuser');
        SET_LOCAL('activechatuser', JSON.stringify({ chatboxopen: true, chatuser: id, }));
        let result = await fetch(`${API_URL}/current-chat-user?from_user=${LOGIN_USER._id}&to_user=${id}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        if (result.status === 200) {
            setChatuser(result.from_user_data._id);
            setChatusername(result.from_user_data.name);
            setChatuserphoto(`${API_STORAGE_URL}/users-file/${result.from_user_data.photo}`);
            setTotalchat(result.total);
            setChatlist([]);
            setTotalchat(0);
            setTotalpage(0);
            setPage(1);
            GetActiveChatList(id);
            $(`#unsceendiv_${id}`).html(``);
        } else {
            alert(result.message);
        }
    }
    async function GetActiveChatList(id) {
        let result = await fetch(`${API_URL}/chat-list?page=${page}&limit=${limit}&from_user=${LOGIN_USER._id}&to_user=${id}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        if (result.status === 200) {
            console.log(result.pagination.docs);
            setChatlist(result.pagination.docs);
            // console.log(chatlist);
            // console.log(chatlist);
            setTotalchat(result.total);
            setTotalpage(result.pagination.totalpage);
            // setPage(result.pagination.current_page);
            setTimeout(() => {
                const element = document.getElementById("chat-history");
                element.scrollTop = element.scrollHeight;
            }, 200)
        } else {
            alert(result.message);
        }
    }
    const PageChange = async () => {
        setPage((prevCount) => prevCount + 1);
        // console.log(page, chatuser);
        let result = await fetch(`${API_URL}/chat-list?page=${page}&limit=${limit}&from_user=${LOGIN_USER._id}&to_user=${chatuser}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        if (result.status === 200) {
            console.log(result.pagination.docs);
            result.pagination.docs.forEach((items) => {
                chatlist.push(items);
            })
            // console.log(chatlist);
            // console.log(chatlist);
            // setChatlist(result.chat_data);
            setTotalchat(result.total);
            setTotalpage(result.pagination.totalpage);
            // setPage(result.pagination.current_page);
            // setTimeout(() => {
            //     const element = document.getElementById("chat-history");
            //     element.scrollTop = element.scrollHeight;
            // }, 200)
        } else {
            alert(result.message);
        }
    };
    // async function PageChange() {
    //     let p = page++;
    //     setPage(p);
    //     console.log(page, p);
    //     let result = await fetch(`${API_URL}/chat-list?page=${page}&limit=${limit}&from_user=${LOGIN_USER._id}&to_user=${chatuser}`, {
    //         method: 'GET',
    //         headers: {
    //             'authorization': `Bearer ${LOGIN_USER.token}`,
    //         }
    //     });
    //     result = await result.json();
    //     if (result.status === 200) {
    //         result.chat_data.forEach((items) => {
    //             chatlist.push(items);
    //         })
    //         // setChatlist(result.chat_data);
    //         setTotalchat(result.total);
    //         setTotalpage(result.pagination.totalpage);
    //         setPage(result.pagination.current_page);
    //         // setTimeout(() => {
    //         //     const element = document.getElementById("chat-history");
    //         //     element.scrollTop = element.scrollHeight;
    //         // }, 200)
    //     } else {
    //         alert(result.message);
    //     }
    // }
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
            onNewMessageSound();
            if (data.type.code == 200) {
                let off = document.getElementById(`off_${data.user}`);
                if (off != null && off != undefined) {
                    off.style.display = "none";
                }
                let on = document.getElementById(`on_${data.user}`);
                if (on != null && on != undefined) {
                    on.style.display = "block";
                }

                if (data.user == user_id && active == true) {
                    FindChat(data.message_id);
                    UpdateReadStatus(data.message_id, data.user, data.to_user, 1);

                } else {
                    getnoofunseenchat(data.user, data.to_user);
                    // alert(`new message id ${data.message_id}`);
                }
            }
        }
    }

    async function UpdateReadStatus(id, from, to, status) {
        const myform = new FormData();
        myform.append('status', status);
        myform.append('objid', id);
        myform.append('from_id', from);
        myform.append('to_id', to);
        let result = await fetch(`${API_URL}/update-read-status`, {
            method: 'POST',
            body: myform,
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        if (result.status === 200) {
            console.log(result.message);
        } else {
            alert(result.message);
        }
    }

    async function getnoofunseenchat(from, to) {
        const myform = new FormData();
        myform.append('from_id', from);
        myform.append('to_id', to);
        let result = await fetch(`${API_URL}/get-no-of-unseen-chat`, {
            method: 'POST',
            body: myform,
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        if (result.status === 200) {
            let total = result.total;
            let chat = result.total > 0 ? result.data.message : '';
            if (total > 0) {
                $(`#unsceendiv_${from}`).html(
                    `<p id="unsceenp_${from}">${textlength(chat, 12)} </p>
                  <span id="unsceenspan_${from}" style="width: 60px;"class="btn btn-danger btn-sm">${total} New</span>`
                );
            }
        } else {
            alert(result.message);
        }
    }


    function textlength(text, l) {
        if (text == "" || text == null) {
            return text;
        } else if (text.length > l) {
            return text.substring(0, l) + '...';
        } else {
            return text;
        }
    }

    function checkOnlineOrOfflineArr(data) {
        // console.log(activewsclients);
        // console.log(allusers);
        allusers.forEach((item) => {
            // console.log(item._id, checkuserId(item._id), $(`#on_${item._id}`));
            if (checkuserId(item._id)) {
                $(`#off_${item._id}`).css('display', 'none');
                $(`#on_${item._id}`).css('display', 'block');
            } else {
                $(`#on_${item._id}`).css('display', 'none');
                $(`#off_${item._id}`).css('display', 'block');
            }
        })
    }

    function checkuserId(id) {
        let check = false;
        activewsclients.forEach((item) => {
            if (item._id == id) {
                check = true;
            }
        })
        return check;
    }

    function changeDate(d) {
        var date = new Date(d);
        return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
        //return date.toUTCString();
        //return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        //return date.toDateString();
    }


    const [photosrc, setPhotosrc] = useState(`${WEBSITE_PUBLIC}/no-img.jpg`);
    const [showimgbox, setShowimgbox] = useState(false);
    function setIMGPhoto(e) {
        if (e.target.files[0] === undefined) {
            setShowimgbox(false);
            setMessagefile("");
            setPhotosrc(`${WEBSITE_PUBLIC}/no-img.jpg`);
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
            setPhotosrc(`${WEBSITE_PUBLIC}/excel.png`);
        } else if (ext === "pdf") {
            setPhotosrc(`${WEBSITE_PUBLIC}/pdf.png`);
        } else if (ext === "docx" || ext === "doc") {
            setPhotosrc(`${WEBSITE_PUBLIC}/doc.png`);
        } else {
            setPhotosrc(`${WEBSITE_PUBLIC}/Icon-doc.png`);
        }
        setMessagefile(e.target.files[0]);
        setShowimgbox(true);

    }

    function closeImgdiv() {
        setShowimgbox(false);
        setMessagefile("");
        setPhotosrc(`${WEBSITE_PUBLIC}/no-img.jpg`);
    }

    function onNewMessageSound() {
        const audio = new Audio(`${WEBSITE_PUBLIC}/sound/Messenger_Notification.mp3`);
        audio.play();
    }

    return (
        <div>
            <WebsocketController ponopen={WSonopen} ponmessage={WSonmessage} ponerror={WSonerror} ponclose={WSonclose} RunWS={true} ref={[childRef, childDataSendRef, _WSclient]} />
            <div className="container-chat container clearfix">
                <h2 style={{ "textAlign": "center", "textDecoration": "underline" }}>React JS Live Chat Box</h2>
                <h3>Name :- {LOGIN_USER.name}, my id:-{LOGIN_USER._id}</h3>
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
                                                    <img src={API_STORAGE_URL + "/users-file/" + item.photo} width="45" height="45" alt={item.name} />
                                                    <div className="about">
                                                        <div className="name" >{item.name}</div>
                                                        <div className="status" >
                                                            <div className='offline_div' id={"off_" + item._id} ><i className="fa fa-circle offline" /> offline</div>
                                                            <div className='online_div' id={"on_" + item._id} ><i className="fa fa-circle online" /> online</div>
                                                        </div>
                                                        <div id={'unsceendiv_' + item._id}>
                                                            {/* <p id={'unsceenp_' + item._id} className='unsceenp'>hello</p>
                                                            <span id={'unsceenspan_' + item._id} style={{ width: '60px' }} className="btn btn-danger btn-sm">3 New</span> */}
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
                                <div className="col-md-12 text-center">{page}
                                    {page <= totalpage ?
                                        <button type="button"
                                            className="btn btn-success btn-sm text-center" onClick={PageChange} style={{ margin: '5px' }} title="Load More.." >Load More..</button> :
                                        <></>}



                                </div>
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
                                    {
                                        typinglabel == true ? <><label>User is typing <img src={`${WEBSITE_PUBLIC}/typing-loader.gif`} style={{ width: '19px' }} /></label></>
                                            : <></>
                                    }

                                    <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows={3} defaultValue={""} onChange={(events) => { setMessage(events.target.value) }} onKeyUp={() => TypeinggMassageFN(false)} onKeyDown={() => TypeinggMassageFN(true)} />
                                    <label className="fa fa-file-image-o" htmlFor="IMGPhoto"></label>
                                    <input id="IMGPhoto" type="file" accept="image/png, image/gif, image/jpeg,.xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf" style={{ display: "none" }} onChange={(e) => setIMGPhoto(e)} />
                                    <button type='button' onClick={() => SendChat()}>Send</button>
                                    <button type='button' onClick={() => CloseWSClient()}>WS Close</button>
                                    {/* <button type='button' onClick={() => checkuserId('id')}>Test</button> */}

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