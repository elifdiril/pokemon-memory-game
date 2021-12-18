import React from 'react';
import '../styles/restart.css';

function Restart({ restart }) {

    return (
        <button className='res' onClick={restart}>Restart</button>
    );
}

export default Restart;