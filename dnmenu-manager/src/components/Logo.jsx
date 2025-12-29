import React from 'react';
import monkeyLogo from '../assets/monkeyLogo.png';

export function Logo({ className = "w-24 h-24" }) {
    return (
        <img
            src={monkeyLogo}
            alt="DN Menu Logo"
            className={`${className} object-contain drop-shadow-lg`}
        />
    );
}