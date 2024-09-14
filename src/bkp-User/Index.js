import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import Userheader from './Userheader';
function Adminindex() {
    const navigate = useNavigate();
    const location = useLocation();
    const L1 = location.pathname === "/user" ? true : false;
    const L2 = location.pathname === "/user/" ? true : false;
    useEffect(() => {
        // navigate('/cpanel/view');
        document.body.style.backgroundColor = "white";
        if (L1) {
            navigate('user/home')
        }
        if (L2) {
            navigate('user/home')
        }
    }, [])
    return (
        <>
            <Userheader />
            <Outlet></Outlet>
        </>
    )
}
export default Adminindex;