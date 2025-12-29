import React from 'react';
import monkeyLogo from '../assets/monkeyLogo.png';

export function Logo({ className = "w-20 h-20" }) {
    return (
        <img
            src={monkeyLogo}
            alt="DN Menu Logo"
            className={`${className} object-contain drop-shadow-lg`}
        />
    );
}