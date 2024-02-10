import { w3cwebsocket } from "websocket";
let client = new w3cwebsocket('ws://127.0.0.1:8000');
const connectWebSocket = () => {
    const WSclient = new w3cwebsocket('ws://127.0.0.1:8000');
    WSclient.onopen = (e) => {
        setWSclient(WSclient);
        setWsreadyState(WSclient.readyState)
        setIsConnected(true);
        WSclient.send(JSON.stringify({
            type: { message: "new conection", code: 100 },
            msg: "new user conected",
            user: LOGIN_USER._id
        }), (e) => {
            console.log(e);
        });
        // var t = setInterval(function () {
        //     if (client.readyState !== 1) {
        //         clearInterval(t);
        //         return;
        //     } 
        //     client.send('{type:"ping"}');
        // }, 5000);
        console.log('WebSocket Client Connected.');
    }
    WSclient.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        console.log(dataFromServer);
        if (dataFromServer.type.code === 200) {
            onNewMessage(dataFromServer);
        } else {
            onNewConnection(dataFromServer);
        }
    }
    WSclient.onerror = function (e) {
        console.log("An error occured while connecting... ", e);
    };

    WSclient.onclose = function (cl) {
        setIsConnected(false);
        console.warn('echo-protocol Client Closed!');
        setTimeout(connectWebSocket, 2000);
        // console.log("WSclient.readyState", WSclient);
        // console.log("WSclient.readyState", WSclient.readyState);
        // setWsreadyState(1);
        // let wbRecon = setInterval(function () {
        //     if (wsreadyState == 1) {
        //         clearInterval(wbRecon);
        //         return true;
        //     }
        //     connectWebSocket();
        //     setWsreadyState(reconnectIn++);
        //     console.log('WebSocket client trying to reconnect.', reconnectIn);
        // }, 2000);
        // console.log('send ping', WSclient);
    };
}
export { client };




