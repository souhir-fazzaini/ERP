'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({
                                   children,
                                   variant = 'primary',
                                   className = '',
                                   ...props
                               }: ButtonProps) {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    };

    return (
        <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
