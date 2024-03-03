import { w3cwebsocket } from "websocket";
import React, { useState, useEffect, forwardRef } from 'react';
import { WS_URL, WEBSITE_PUBLIC } from './../Constant'
// let client = new w3cwebsocket('ws://127.0.0.1:8000');
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

    const [WSclient, setWSclient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    var [reconnectIn, setReconnectIn] = useState(0);
    // var [wsreadyState, setWsreadyState] = useState(0);
    useEffect(() => {
        if (props.RunWS) {
            connectWebSocket();
        }
    }, []);
    const connectWebSocket = () => {
        const _WSclient = new w3cwebsocket(WS_URL);
        if (isConnected) {
            setReconnectIn(0);
        }
        _WSclient.onopen = (e) => {
            props.ponopen(e);
            setWSclient(_WSclient);
            setIsConnected(true);
            console.warn('WebSocket Client Connected.');
        }
        _WSclient.onmessage = (message) => {
            props.ponmessage(message);
        }
        _WSclient.onerror = function (e) {
            console.log("An error occured while connecting... ");
            props.ponerror(e);
        };

        _WSclient.onclose = function (cl) {
            props.ponclose(cl);
            setIsConnected(false);
            setTimeout(connectWebSocket, 1000);
            setReconnectIn(reconnectIn++);
            console.warn('echo-protocol Client Closed! Trying to reconnect..', reconnectIn);
        };
    }

    function CloseWSClientFn() {
        alert();
    }

    function WSsendFn(data) {
        if (WSclient !== null) {
            WSclient.send(data);
        } else {
            console.error('failed to send data!');
        }
    }

    function MyWSclient() {
        return WSclient;
    }

    // return (<></>)
})

export { WebsocketController };




