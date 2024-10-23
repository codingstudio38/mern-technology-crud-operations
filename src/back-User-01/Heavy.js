import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL, USER_DETAILS, API_STORAGE_URL } from './../Constant';
import './../css/App.css';

function Heavy() {
    const [datalist, setDatalist] = useState([]);
    useEffect(() => {
        let l = [];
        for (let index = 1; index <= 10000; index++) {
            l.push(index);
        }
        setDatalist(l);
    }, []);

    return (
        <div>
            <h2>Heavy Loding Component</h2>
            {
                datalist.map((item, index) =>
                    <b key={index}>{item},</b>
                )
            }
        </div>
    )
}

export default Heavy;