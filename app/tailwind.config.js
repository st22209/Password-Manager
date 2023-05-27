/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            backgroundImage: {
                "user-background": "url('src/assets/user_background.svg')",
            },
        },
        fontFamily: {
            "bebas": "Bebas Neue",
            "poppins": "Poppins",
            "roboto": "Roboto"
        }
    },
    plugins: [],
}
