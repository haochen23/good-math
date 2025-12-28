/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Child-friendly color palette
                primary: {
                    50: '#fef3e2',
                    100: '#fde4b9',
                    200: '#fcd58c',
                    300: '#fbc55e',
                    400: '#fab93b',
                    500: '#f9ae19', // Main primary - warm yellow/orange
                    600: '#f5a115',
                    700: '#ef8f10',
                    800: '#e97e0b',
                    900: '#e06004',
                },
                secondary: {
                    50: '#e8f5e9',
                    100: '#c8e6c9',
                    200: '#a5d6a7',
                    300: '#81c784',
                    400: '#66bb6a',
                    500: '#4caf50', // Main secondary - friendly green
                    600: '#43a047',
                    700: '#388e3c',
                    800: '#2e7d32',
                    900: '#1b5e20',
                },
                accent: {
                    50: '#e3f2fd',
                    100: '#bbdefb',
                    200: '#90caf9',
                    300: '#64b5f6',
                    400: '#42a5f5',
                    500: '#2196f3', // Main accent - sky blue
                    600: '#1e88e5',
                    700: '#1976d2',
                    800: '#1565c0',
                    900: '#0d47a1',
                },
                fun: {
                    pink: '#ff6b9d',
                    purple: '#9c27b0',
                    orange: '#ff9800',
                    teal: '#00bcd4',
                    coral: '#ff7043',
                    lime: '#cddc39',
                },
                // Semantic colors
                success: '#4caf50',
                error: '#f44336',
                warning: '#ff9800',
                info: '#2196f3',
            },
            fontFamily: {
                sans: ['Nunito', 'system-ui', 'sans-serif'],
                display: ['Fredoka One', 'cursive'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            fontSize: {
                'display-lg': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],
                'display-md': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
                'display-sm': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
                'number-lg': ['5rem', { lineHeight: '1', fontWeight: '700' }],
                'number-md': ['3.5rem', { lineHeight: '1', fontWeight: '700' }],
                'number-sm': ['2.5rem', { lineHeight: '1', fontWeight: '600' }],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'medium': '0 8px 30px rgba(0, 0, 0, 0.12)',
                'strong': '0 12px 40px rgba(0, 0, 0, 0.16)',
                'glow-primary': '0 0 20px rgba(249, 174, 25, 0.4)',
                'glow-success': '0 0 20px rgba(76, 175, 80, 0.4)',
                'glow-accent': '0 0 20px rgba(33, 150, 243, 0.4)',
            },
            animation: {
                'bounce-slow': 'bounce 2s infinite',
                'pulse-soft': 'pulse 3s ease-in-out infinite',
                'wiggle': 'wiggle 0.5s ease-in-out',
                'pop': 'pop 0.3s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'confetti': 'confetti 1s ease-out forwards',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                pop: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                confetti: {
                    '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
                },
            },
        },
    },
    plugins: [],
}
