import './../css/chat-box.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL, USER_DETAILS } from './../Constant';

function Chatlist() {
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    const [list, setList] = useState([]);
    const [searchkey, setSearchkey] = useState("");
    useEffect(() => {
        document.title = "MERN Technology || User - Chat Box";
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        getUserlist("");
    }, []);

    async function getUserlist(key) {
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
            setList(result.data);
        } else {
            alert(result.message);
        }
    }
    function searchUser(k) {
        setSearchkey(k);
        getUserlist(k);
    }
    return (
        <div>
            <div className="container-chat container clearfix">
                <div className="row">
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
                                            <li className="clearfix custom" key={index}>
                                                <div className="custom-in-dev">
                                                    <img src={"http://localhost:5000/users-file/" + item.photo} width="45" height="45" alt={item.name} />
                                                    <div className="about">
                                                        <div className="name" >{item.name}</div>
                                                        <div className="status">
                                                            <i className="fa fa-circle online" /> online
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    }
                                    {/*  <i className="fa fa-circle offline" /> left 7 mins ago 
                                    <li className="c-width">
                                        <div className="message-data">
                                            <span className="message-data-name"><i className="fa fa-circle online" /> Vincent</span>
                                            <span className="message-data-time">10:31 AM, Today</span>
                                        </div>
                                        <i className="fa fa-circle online" />
                                        <i className="fa fa-circle online" style={{ color: '#AED2A6' }} />
                                        <i className="fa fa-circle online" style={{ color: '#DAE9DA' }} />
                                    </li>
                                    */}

                                </ul>

                            </div>

                        </div>
                    </div>
                    <div className="col-md-8" style={{ 'padding': '0px' }}>
                        <div className="chat">
                            <div className="chat-header clearfix">
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01_green.jpg" alt="avatar" />
                                <div className="chat-about">
                                    <div className="chat-with">Chat with Vincent Porter</div>
                                    <div className="chat-num-messages">already 1 902 messages</div>
                                </div>
                                <i className="fa fa-star" />
                            </div>
                            <div className="chat-history">
                                <ul>
                                    <li className="clearfix">
                                        <div className="message-data align-right">
                                            <span className="message-data-time">10:10 AM, Today</span> &nbsp; &nbsp;
                                            <span className="message-data-name">Olia</span> <i className="fa fa-circle me" />
                                        </div>
                                        <div className="message other-message float-right">
                                            Hi Vincent, how are you? How is the project coming along?
                                        </div>
                                    </li>
                                    <li className="c-width">
                                        <div className="message-data">
                                            <span className="message-data-name"><i className="fa fa-circle online" /> Vincent</span>
                                            <span className="message-data-time">10:12 AM, Today</span>
                                        </div>
                                        <div className="message my-message">
                                            Are we meeting today? Project has been already finished and I have results to show you.
                                        </div>
                                    </li>


                                </ul>
                            </div>
                            <div className="chat-message clearfix">
                                <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows={3} defaultValue={""} />
                                <i className="fa fa-file-o" /> &nbsp;&nbsp;&nbsp;
                                <i className="fa fa-file-image-o" />
                                <button>Send</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
export default Chatlist;