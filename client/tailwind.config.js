/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0A1F44",   // TimeLock Navy
                secondary: "#FFA500", // TimeLock Orange
                accent: "#1EC677",    // TimeLock Green
                'brand-dark': '#0A1F44',
                'brand-orange': '#FFA500',
                'brand-green': '#1EC677',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}