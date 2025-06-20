import React, { useState, useEffect, lazy, Suspense } from 'react';
import './../css/App.css';
import { Pagination } from 'antd';
import Table from 'react-bootstrap/Table';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL, USER_DETAILS, API_STORAGE_URL } from './../Constant';
// import OpenAI from "openai";


function Chatgpt() {
    // const AI_client = new OpenAI();
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    useEffect(() => {
        document.title = "MERN Technology || Chat GPT";
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
    }, []);
    async function CallAIApi() {
        // const response = await AI_client.responses.create({
        //     model: "gpt-4.1",
        //     input: "Write a one-sentence bedtime story about a unicorn.",
        // });
        // console.log(response);
        // console.log(response.output_text);
    }
    return (
        <div>
            <h3>Chat GPT</h3>
            <button type='button' onClick={() => CallAIApi()} className='btn btn-primary btn-sm'>Call API</button>
        </div>
    )
}

export default Chatgpt; 