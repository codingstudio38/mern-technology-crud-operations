import React, { useEffect } from 'react';
import './../css/chat-box.css';
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
                <a target="_blank" href={"http://localhost:5000/users-chat-file/" + file}>
                    <img src={"http://localhost:5000/users-chat-file/" + file} className="images" />
                </a>
            </>
        );
    } else if (ext === "xlsx" || ext === "xls") {
        return (
            <>
                <a href={"http://localhost:5000/users-chat-file/" + file} download={"http://localhost:5000/users-chat-file/" + file}>
                    <img src="http://localhost:3000/excel.png" className="images" />
                </a>
            </>
        )
    } else if (ext === "pdf") {
        return (
            <>
                <a href={"http://localhost:5000/users-chat-file/" + file} download={"http://localhost:5000/users-chat-file/" + file}>
                    <img src="http://localhost:3000/pdf.png" className="images" />
                </a>
            </>
        )
    } else if (ext === "docx" || ext === "doc") {
        return (
            <>
                <a href={"http://localhost:5000/users-chat-file/" + file} download={"http://localhost:5000/users-chat-file/" + file}>
                    <img src="http://localhost:3000/doc.png" className="images" />
                </a>
            </>
        )
    } else {
        return (
            <>
                <a href={"http://localhost:5000/users-chat-file/" + file} download={"http://localhost:5000/users-chat-file/" + file}>
                    <img src="http://localhost:3000/Icon-doc.png" className="images" />
                </a>
            </>
        )
    }
}