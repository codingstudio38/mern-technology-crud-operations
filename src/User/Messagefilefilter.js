import React, { useEffect } from 'react';
import './../css/chat-box.css';
import { API_URL, WEBSITE_PUBLIC, API_STORAGE_URL } from './../Constant';
export default function Messagefilefilter(props) {
    var file = props.file;
    var ext = file.substring(file.lastIndexOf('.') + 1).toLowerCase();
    useEffect(() => {

    })
    if (file === "") {
        return (
            <>

            </>
        );
    }
    if (ext === "gif" || ext === "png" || ext === "PNG" || ext === "jpeg" || ext === "jpg") {
        return (
            <>
                <a target="_blank" href={API_STORAGE_URL + "/users-chat-file/" + file}>
                    <img src={API_STORAGE_URL + "/users-chat-file/" + file} className="images" />
                </a>
            </>
        );
    } else if (ext === "xlsx" || ext === "xls") {
        return (
            <>
                <a target="_blank" href={API_STORAGE_URL + "/users-chat-file/" + file} download={API_STORAGE_URL + "/users-chat-file/" + file}>
                    <img src={`${WEBSITE_PUBLIC}/excel.png`} className="images" />
                </a>
            </>
        )
    } else if (ext === "pdf") {
        return (
            <>
                <a target="_blank" href={API_STORAGE_URL + "/users-chat-file/" + file} download={API_STORAGE_URL + "/users-chat-file/" + file}>
                    <img src={`${WEBSITE_PUBLIC}/pdf.png`} className="images" />
                </a>
            </>
        )
    } else if (ext === "docx" || ext === "doc") {
        return (
            <>
                <a target="_blank" href={API_STORAGE_URL + "/users-chat-file/" + file} download={API_STORAGE_URL + "/users-chat-file/" + file}>
                    <img src={`${WEBSITE_PUBLIC}/doc.png`} className="images" />
                </a>
            </>
        )
    } else {
        return (
            <>
                <a target="_blank" href={API_STORAGE_URL + "/users-chat-file/" + file} download={API_STORAGE_URL + "/users-chat-file/" + file}>
                    <img src={`${WEBSITE_PUBLIC}/Icon-doc.png`} className="images" />
                </a>
            </>
        )
    }
}