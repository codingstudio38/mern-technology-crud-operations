import CryptoJS from "crypto-js";
const secretKey = 'bc665a1f223dba15f5fbf5df08838647';
const iv_secretKey = 'bc66-f223-dba1-8647-2345-fd45-dfg3';
export const API_URL = "http://localhost:5000";
export const API_STORAGE_URL = "http://localhost:5000";
export const WEBSITE_URL = "http://localhost:3000";
export const WEBSITE_PUBLIC = "";
export const WEBSITE_BASE_URL = "/";
export const WS_URL = "ws://127.0.0.1:8000";
export const USER_DETAILS = () => {
    if (!window.localStorage.getItem("userinfo")) {
        return false;
    } else {
        return JSON.parse(window.localStorage.getItem("userinfo"));

    }
}

export const PATHNAME = () => {
    return window.location.pathname;
}

export const SET_LOCAL = (name, data) => {
    if (name == "") {
        return false;
    }
    window.localStorage.setItem(name, data);
    return true;
}
export const GET_LOCAL = (name) => {
    if (name == "") {
        return false;
    }
    if (!window.localStorage.getItem(name)) {
        return false;
    } else {
        return window.localStorage.getItem(name);

    }
}
export const REMOVE_LOCAL = (name) => {
    if (name == "") {
        return false;
    }
    if (!window.localStorage.getItem(name)) {
        return false;
    } else {
        window.localStorage.removeItem(name);
        return true;
    }
}
export const REMOVE_ALL_LOCAL = () => {
    window.localStorage.clear();
    return true;
}

export const USER_LOGOUT = async (token) => {
    let result = await fetch(`${API_URL}/logout`, {
        method: 'GET',
        headers: {
            'authorization': token,
        }
    });
    result = await result.json();
    return result;
}

export const encrypt = (data) => {
    const key_ = CryptoJS.enc.Utf8.parse(secretKey);
    const iv_ = CryptoJS.enc.Utf8.parse(iv_secretKey);
    const encrypted = CryptoJS.AES.encrypt(data,
        key_, {
        iv: iv_,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

export const decrypt = (encryptedData) => {
    const key_ = CryptoJS.enc.Utf8.parse(secretKey);
    const iv_ = CryptoJS.enc.Utf8.parse(iv_secretKey);
    const decrypted = CryptoJS.AES.decrypt(encryptedData,
        key_, {
        iv: iv_,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}