import React, { useState } from "react";

export default function SVGIcon(props: any) {

    return (
        <svg className={props.className} viewBox="0 0 24 24">
            <path d={props.icon} fill="currentColor"></path>
        </svg>
        
    );
}