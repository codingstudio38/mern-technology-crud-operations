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
    const [current_scroll_position, setCurrent_scroll_position] = useState(0);
    const [pre_scroll_position, setPre_scroll_position] = useState(0);
    const [limitval, setLimitval] = useState([]);
    const [currentpage, setCurrentpage] = useState(1);
    const [lastpage, setLastpage] = useState(0);
    const [postsperpage, setPostsperpage] = useState(8);
    const [alltotal, setAlltotal] = useState(0);
    var [pagingcounter, setPagingcounter] = useState(1);
    const [newdata, setNewdata] = useState([]);
    const [videoid, setVideoid] = useState("");
    const [checkvideo, setCheckvideo] = useState(false);
    const [videodetails, setVideodetails] = useState({});
    const [videourl, setVideourl] = useState("");
    const [reloadvideo, setReloadvideo] = useState(false);
    const [datalistloading, setDatalistloading] = useState(false);
    useEffect(() => {
        document.title = "MERN Technology || Video Gallery";
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        getdata(currentpage, postsperpage);
    }, []);
    useEffect(() => {
        setVideoid(searchParams.get('watch'));
        if (searchParams.get('watch') != null && searchParams.get('watch') != "") {
            GetVideoById(searchParams.get('watch'));
        } else {
            setCheckvideo(false);
        }
    }, [location.pathname, watchis]);
    useEffect(() => {
        window.addEventListener("scroll", handelInfiniteScroll);
        return () => window.removeEventListener("scroll", handelInfiniteScroll);
    }, [current_scroll_position, lastpage, currentpage, datalistloading, pre_scroll_position]);
    const handelInfiniteScroll = async () => {
        setCurrent_scroll_position((pre) => {
            return document.documentElement.scrollTop;
        });
        // console.clear();
        try {
            if ((window.innerHeight + document.documentElement.scrollTop + 1) > document.documentElement.scrollHeight) {
                if (currentpage <= lastpage) {
                    if (!datalistloading) {
                        if (current_scroll_position > pre_scroll_position) {// going to bottom
                            if (currentpage == 1) {
                                setCurrentpage((p) => {
                                    return 2;
                                });
                            } else {
                                setCurrentpage((p) => {
                                    return p + 1;
                                });
                            }
                            setDatalistloading(true);
                            getdata(currentpage, postsperpage);
                            setPre_scroll_position((pre) => {
                                return document.documentElement.scrollTop;
                            });
                            console.log(`window scroll down..`);
                        } else {
                            console.log(`window scroll top..`);
                        }
                    } else {
                        console.log('data loading..');
                    }
                } else {
                    console.log(`data end`);
                }

            }
        } catch (error) {
            console.log(error.message);
        }
    };
    async function WatchVideo(item) {
        if (item.video_file_filedetails.filesize !== "") {
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
            if (result.total > 0) {
                setVideodetails(result.result);
                const idis = encodeURIComponent(encrypt(result.result._id));
                setVideourl(`${API_URL}/video-player?watch=${idis}`);
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
            setDatalistloading(false);
            return false;

        }
        if (datalistloading) {
            console.log('data stil loading. plase wait..');
            setDatalistloading(false);
            return false;
        }
        setDatalistloading(true);
        setTimeout(async () => {
            let result = await fetch(`${API_URL}/users/post-list?page=${page}&size=${size}&userid=`, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${LOGIN_USER.token}`,
                }
            });
            result = await result.json();
            setDatalistloading(false)
            // console.log(result);
            if (result.status === 200) {
                setLastpage((p) => {
                    return result.list.totalPages;
                })
                setAlltotal(result.list.totalDocs);
                if (result.list.totalDocs > 0) {
                    setNewdata((prev) => [...prev, ...result.list.docs]);
                }
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
        }, 1000)
    }


    // function changePage(page) {
    //     getdata(page, postsperpage);
    // }
    // function changeperPage(e) {
    //     if (e.target.value === "Limit") {
    //         getdata(1, 5);
    //         setPostsperpage(5);
    //         setCurrentpage(1);
    //     } else {
    //         getdata(1, e.target.value);
    //         setPostsperpage(e.target.value);
    //         setCurrentpage(1);
    //     }
    // }

    // function PlayVideo() {

    // }
    // function ChangeDate(d) {
    //     let date = new Date(d);
    //     let timeis = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;//:${date.getMilliseconds()
    //     return `${date.toDateString()} ${timeis}`;
    // }
    return (
        <div>
            {/* <h6>{location.pathname}</h6> */}
            <h2 style={{ textAlign: "center" }}>Video Gallery</h2>


            {
                checkvideo == false ?
                    <>
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
                        {
                            datalistloading == true ?
                                <div style={{ textAlign: "center", marginTop: '20px', marginBottom: '40px' }}>
                                    <div className="spinner-border text-primary" role="status" style={{ textAlign: "center", marginTop: '20px', marginBottom: '40px' }}>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>

                                :
                                <div></div>
                        }
                    </>
                    :
                    <>
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

                                {
                                    datalistloading == true ?
                                        <div style={{ textAlign: "center", marginTop: '20px', marginBottom: '40px' }}>
                                            <div className="spinner-border text-primary" role="status" style={{ textAlign: "center", marginTop: '20px', marginBottom: '40px' }}>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>

                                        :
                                        <div></div>
                                }
                            </div>
                        </div>

                    </>
            }




        </div>
    )
}

export default Videogallery;