import React from 'react';

export function CustomSelect({ value, onChange, options, className = "" }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`px-4 py-2 bg-[#2e2e2e] border border-purple-600/30 rounded-xl text-white focus:outline-none focus:border-purple-600 transition-all ${className}`}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}