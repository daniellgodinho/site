import React from 'react';
import monkeyLogo from '../assets/monkeyLogo.png';

export function Logo({ className = "w-10 h-10" }) {
    return (
        <img
            src={monkeyLogo}
            alt="DN Menu Logo"
            className={`${className} object-contain drop-shadow-lg`}
        />
    );
}