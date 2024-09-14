import { w3cwebsocket } from "websocket";
import React, { useState, useEffect } from "react";
import { WS_URL, USER_DETAILS } from "../Constant";
var wsClient = false;
var isConnected = false;
function connect() {
    const LOGIN_USER = USER_DETAILS();
    wsClient = new w3cwebsocket(
        `${WS_URL}?Authorization=${LOGIN_USER._id ? LOGIN_USER._id : ""}`
    );
    isConnected = true;
}

function useWebSocket(onMessageReceived, WsOnerror, WsOnclose, WSonopen) {
    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const WebSocketHandler = () => {
        wsClient.onopen = (e) => {
            console.log("WebSocket Client Connected");
            isConnected = true;
            WSonopen(e);
        };
        wsClient.onmessage = (message) => {
            onMessageReceived(message);
        };
        wsClient.onerror = function (e) {
            WsOnerror(e);
        };
        wsClient.onclose = function (e) {
            WsOnclose(e);
            console.warn("WebSocket Closed", e);
            // setIsConnected(false);
            isConnected = false;
            if (reconnectAttempt < 5) {
                setTimeout(() => {
                    setReconnectAttempt((prev) => prev + 1);
                    connect();
                    WebSocketHandler();
                }, 1000);
            }
        };
    };
    const sendWebSocketMessage = (data) => {
        if (isConnected) {
            wsClient.send(data);
        } else {
            console.error("Cannot send message. WebSocket not connected.");
        }
    };
    const disconnectWebSocket = () => {
        if (isConnected) {
            wsClient.close();
        }
    };
    useEffect(() => {
        if (!isConnected) {
            connect();
        }
        WebSocketHandler();
    }, []);
    return { sendWebSocketMessage, isConnected, disconnectWebSocket };
}
export default useWebSocket;
