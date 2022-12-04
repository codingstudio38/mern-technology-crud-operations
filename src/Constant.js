export const API_URL = "http://localhost:5000";
export const USER_DETAILS = () => {
    if (!window.localStorage.getItem("userinfo")) {
        return false;
    } else {
        return JSON.parse(window.localStorage.getItem("userinfo"));

    }
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