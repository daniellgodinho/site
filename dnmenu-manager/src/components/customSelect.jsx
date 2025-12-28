import React from 'react';

export const CustomSelect = ({ value, onChange, options, className = '' }) => {
    return (
        <div className={`relative group ${className}`}>
            <div className="absolute inset-0 bg-purple-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="relative appearance-none w-full px-6 py-4 bg-gray-800/50 border border-purple-600/30 rounded-2xl text-white focus:outline-none focus:border-purple-600 focus:bg-gray-800/70 transition-all duration-300 cursor-pointer"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};