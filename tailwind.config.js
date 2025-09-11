/** @type {import('tailwindcss').Config} */

export default {
    darkMode: 'class',
    content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    safelist: [
        'dark', // Ensures the 'dark' class is always included
    ],
    plugins: [require('@tailwindcss/forms')],
}
