import { w3cwebsocket } from "websocket";
import React, { useState, useEffect, forwardRef } from 'react';
import { WS_URL, WEBSITE_PUBLIC, USER_DETAILS } from './../Constant'
var reconnectIn = 0;
var wsClient = false;
var isConnected = false;
function connect() {
    const LOGIN_USER = USER_DETAILS();
    wsClient = new w3cwebsocket(
        `${WS_URL}?Authorization=${LOGIN_USER._id ? LOGIN_USER._id : ""}`
    );
    isConnected = true;
}
const WebsocketController = React.forwardRef((props, ref) => {

    React.useImperativeHandle(ref[0], () => ({
        CloseWSClientFn: CloseWSClientFn,
    }));

    React.useImperativeHandle(ref[1], () => ({
        WSsendFn: WSsendFn
    }));

    React.useImperativeHandle(ref[2], () => ({
        MyWSclient: MyWSclient
    }));

    const WebSocketHandler = () => {
        wsClient.onopen = (e) => {
            reconnectIn = 0;
            isConnected = true;
            props.ponopen(e);
            console.warn('WebSocket Client Connected.');
        }
        wsClient.onmessage = (message) => {
            props.ponmessage(message);
        }
        wsClient.onerror = function (e) {
            console.log("An error occured while connecting... ");
            props.ponerror(e);
        };

        wsClient.onclose = function (cl) {
            isConnected = false;
            if (!isConnected) {
                props.ponclose(cl);
                setTimeout(connect(), 1000);
                reconnectIn++;
                console.warn('echo-protocol Client Closed! Trying to reconnect..', reconnectIn);
                if (isConnected) {
                    WebSocketHandler();
                }
            }
        };
    }

    function CloseWSClientFn(reconnet) {
        if (isConnected) {
            wsClient.close();
        } else {
            console.error('failed to send data!! ws client not connected.');
        }
    }

    function WSsendFn(data) {
        if (isConnected) {
            wsClient.send(data);
        } else {
            console.error('failed to send data!! ws client not connected.');
        }
    }

    function MyWSclient() {
        return wsClient;
    }
    useEffect(() => {
        if (!isConnected) {
            connect()
        }
        WebSocketHandler();
    }, []);
    // return (<></>)
})

export { WebsocketController };




