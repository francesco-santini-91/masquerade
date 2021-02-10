import React from 'react';

export default function Wrapper(props) {
    return(
        <div className="Wrapper">
            {props.component()}
        </div>
    );
}