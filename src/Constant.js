export const API_URL = "http://localhost:5000";
export const USER_DETAILS = () => {
    if (!window.localStorage.getItem("userinfo")) {
        return false;
    } else {
        return JSON.parse(window.localStorage.getItem("userinfo"));

    }
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