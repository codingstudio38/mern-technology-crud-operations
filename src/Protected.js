import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
function Protected(props) {
    const navigate = useNavigate();
    useEffect(() => {
        if (!window.localStorage.getItem("userinfo")) {
            navigate('../');
            return;
        }
    }, [])
    let Cmp = props.Component
    return (
        <>
            <Cmp></Cmp>
        </>
    )
}
export default Protected;