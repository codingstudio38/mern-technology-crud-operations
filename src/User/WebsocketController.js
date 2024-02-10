import { w3cwebsocket } from "websocket";
import { useState, useEffect } from 'react';
let client = new w3cwebsocket('ws://127.0.0.1:8000');
let MyWSclient = null;
function WebsocketController(prop) {
    const [WSclient, setWSclient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    var [reconnectIn, setReconnectIn] = useState(0);
    // var [wsreadyState, setWsreadyState] = useState(0);
    useEffect(() => {
        if (prop.RunWS) {
            connectWebSocket();
        }
    }, []);
    const connectWebSocket = () => {
        const _WSclient = new w3cwebsocket('ws://127.0.0.1:8000');
        if (isConnected) {
            setReconnectIn(0);
        }
        _WSclient.onopen = (e) => {
            prop.ponopen(e);
            setWSclient(_WSclient);
            MyWSclient = _WSclient;
            // setWsreadyState(_WSclient.readyState)
            setIsConnected(true);
            console.warn('WebSocket Client Connected.');
        }
        _WSclient.onmessage = (message) => {
            prop.ponmessage(message);
        }
        _WSclient.onerror = function (e) {
            console.log("An error occured while connecting... ");
            prop.ponerror(e);
        };

        _WSclient.onclose = function (cl) {
            prop.ponclose(cl);
            setIsConnected(false);
            setTimeout(connectWebSocket, 1000);
            setReconnectIn(reconnectIn++);
            console.warn('echo-protocol Client Closed! Trying to reconnect..', reconnectIn);
        };
    }

    // WSclient.send(JSON.stringify({
    //     type: { message: "new conection", code: 100 },
    //     msg: "new user conected",
    //     user: '1'
    // })); 
    // return (<></>)
}

export { client, WebsocketController, MyWSclient };




