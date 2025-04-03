/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        custom: "0 2px 5px rgba(0, 0, 0, 0.25)",
        search: "5px 3px 15px rgba(0, 0, 0, 0.25)",
        "search-container": "0 4px 7px rgba(0, 0, 0, 0.25)",
        result: "0 -1px 2px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.3)",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to right, rgba(82, 91, 49, 0.6) 0%, rgba(190, 210, 6, 0.6) 50%, rgba(82, 91, 49, 0.6) 100%)",
      },
      textColor: {
        "custom-green": "#525B31",
        "custom-gold": "#D2B57A",
      },
      backgroundColor: {
        "custom-green": "#525B31",
        "custom-gold": "#D2B57A",
      },
      borderColor: {
        "custom-gold": "#D2B57A",
      },
    },
  },
  plugins: [],
};
