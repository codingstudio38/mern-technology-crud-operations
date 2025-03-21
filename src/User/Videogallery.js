import React, { useState, useEffect } from 'react';
import './../css/App.css';
// import { Pagination } from 'antd';
// import Table from 'react-bootstrap/Table';
import { API_URL, USER_DETAILS, API_STORAGE_URL, WEBSITE_URL, encrypt, decrypt } from './../Constant';
import Videoplayer from './Videoplayer';
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};
function Videogallery() {
    const query = useQuery();
    const watchis = query.get("watch");
    const location = useLocation();
    const params = useParams();//param
    const [searchParams, setSearchParams] = useSearchParams();//queryparam
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    const [limitval, setLimitval] = useState([]);
    const [currentpage, setCurrentpage] = useState(1);
    const [postsperpage, setPostsperpage] = useState(100);
    const [alltotal, setAlltotal] = useState(0);
    var [pagingcounter, setPagingcounter] = useState(1);
    const [newdata, setNewdata] = useState([]);
    const [videoid, setVideoid] = useState("");
    const [checkvideo, setCheckvideo] = useState(false);
    const [videodetails, setVideodetails] = useState({});
    const [videourl, setVideourl] = useState("");
    const [reloadvideo, setReloadvideo] = useState(false);
    useEffect(() => {
        document.title = "MERN Technology || Video Gallery";
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        getdata(currentpage, postsperpage);
        setVideoid(searchParams.get('watch'));
        // console.log(videoid, searchParams.get('watch'));
        if (searchParams.get('watch') != null && searchParams.get('watch') != "") {
            GetVideoById(searchParams.get('watch'));
        } else {
            setCheckvideo(false);
        }
        // console.log(videoid, searchParams.get('watch'));
    }, [location.pathname, watchis]);
    async function WatchVideo(item) {
        if (item.video_file_filedetails.filesize !== "") {
            // window.location.href = `${WEBSITE_URL}/user/video-gallery?watch=${item._id}`;
            navigate(`./../../user/video-gallery?watch=${item._id}`);
            GetVideoById(item._id);
            setVideoid(item._id);
        }
    }
    async function GetVideoById(id) {
        setReloadvideo(true);
        let result = await fetch(`${API_URL}/users/post-byid/${id}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        setReloadvideo(false);
        if (result.status === 200) {
            // console.log(result.result);
            if (result.total > 0) {
                setVideodetails(result.result);
                const idis = encodeURIComponent(encrypt(result.result._id));
                // console.log(decrypt(result.encrypt));
                // console.log(`${API_URL}/nodejS-streams?watch=${result.result._id}`)
                // console.log(`?watch=${idis}`)
                setVideourl(`${API_URL}/nodejS-streams?watch=${idis}`);
                if (result.result.video_file_filedetails.filesize == "") {
                    setCheckvideo(false);
                } else {
                    setCheckvideo(true);
                }
            } else {
                setCheckvideo(false);
            }
        } else {
            alert(result.message);
            console.error(result);
            setCheckvideo(false);
        }
    }
    async function getdata(page, size) {
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        let result = await fetch(`${API_URL}/users/post-list?page=${page}&size=${size}&userid=`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${LOGIN_USER.token}`,
            }
        });
        result = await result.json();
        // console.log(result);
        if (result.status === 200) {
            setCurrentpage(result.list.page);
            setPostsperpage(result.list.limit);
            setAlltotal(result.list.totalDocs);
            setNewdata(result.list.docs);
            // console.log(newdata);
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
            {/* <h6>{location.pathname}</h6> */}
            <h2 style={{ textAlign: "center" }}>Video Gallery</h2>


            {
                checkvideo == false ?
                    <div className='row col-md-12'>
                        {
                            newdata.map((item, index) =>
                                <div className="col-md-3 mb-4" style={{ 'cursor': 'pointer' }} onClick={() => WatchVideo(item)} key={index} id={index}>
                                    <div className={item.video_file_filedetails.filesize == "" ?
                                        "card video-not-found"
                                        : videoid == item._id ? 'card current-video' : "card"}>
                                        {
                                            item.thumnail_filedetails.filesize == "" ?
                                                <img className="card-img-top highte200" src={`${WEBSITE_URL}/video-thumbnail.jpg`} alt="Card image cap" />
                                                : <img className="card-img-top highte200" src={`${item.thumnail_filedetails.file_path}`} alt="Card image cap" />
                                        }
                                        <div className="card-body">

                                            <p className="card-text">
                                                {
                                                    item.user_filedetails.filesize == "" ?
                                                        <img className="userphoto" src={`${WEBSITE_URL}/profile.png`} alt={item.user_field.name} />
                                                        : <img className="userphoto" src={`${item.user_filedetails.file_path}`} alt={item.user_field.name} />
                                                }
                                                {item.user_field.name}</p>
                                            <h5 className="card-title cut-text">{item.title}</h5>
                                            <p className="card-text cut-text">{item.content}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    :
                    <div className='row col-md-12'>
                        <div className='col-md-8'>
                            <div className="video-wrapper">
                                {
                                    reloadvideo == true ?
                                        <></>
                                        :
                                        <video id="videoPlayer" className="react-player" controls poster={
                                            videodetails.thumnail_filedetails.filesize == "" ? `${WEBSITE_URL}/video-thumbnail.jpg`
                                                :
                                                `${videodetails.thumnail_filedetails.file_path}`
                                        }>
                                            <source src={videourl} type="video/mp4"></source>
                                        </video>

                                }
                                {/*<Videoplayer videourl={videourl} thumbnail={videodetails.thumnail_filedetails.filesize == "" ? `${WEBSITE_URL}/video-thumbnail.jpg` : `${videodetails.thumnail_filedetails.file_path}`} /> */}
                            </div>
                            <div className='video-details'>
                                <h4>{videodetails.title}</h4>
                                <p>{videodetails.content}</p>
                            </div>
                        </div>
                        <div className='col-md-4'>
                            {
                                newdata.map((item, index) =>
                                    <div className="col-sm-12 m-1" style={{ 'cursor': 'pointer' }} onClick={() => WatchVideo(item)} key={index} id={index}>
                                        <div className={item.video_file_filedetails.filesize == "" ?
                                            "card video-not-found"
                                            : videoid == item._id ? 'card current-video' : "card"}>
                                            {
                                                item.thumnail_filedetails.filesize == "" ?
                                                    <img className="card-img-top highte200" src={`${WEBSITE_URL}/video-thumbnail.jpg`} alt="Card image cap" />
                                                    : <img className="card-img-top highte200" src={`${item.thumnail_filedetails.file_path}`} alt="Card image cap" />
                                            }
                                            <div className="card-body">

                                                <p className="card-text">
                                                    {
                                                        item.user_filedetails.filesize == "" ?
                                                            <img className="userphoto" src={`${WEBSITE_URL}/profile.png`} alt={item.user_field.name} />
                                                            : <img className="userphoto" src={`${item.user_filedetails.file_path}`} alt={item.user_field.name} />
                                                    }
                                                    {item.user_field.name}</p>
                                                <h5 className="card-title cut-text">{item.title}</h5>
                                                <p className="card-text cut-text">{item.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
            }




        </div>
    )
}

export default Videogallery;