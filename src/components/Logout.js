import React from 'react'


function Logout(props) {
    return (
        <div>
            <button onClick={props.onClick}>Logout {props.username}</button>
        </div>
    )
}

export default Logout