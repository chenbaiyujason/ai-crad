import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'tan': '#d2b48c', // 定义淡褐色
      },
      boxShadow: {
        'tan': '0 4px 6px -1px rgba(210, 180, 140, 0.1), 0 2px 4px -1px rgba(210, 180, 140, 0.06)', // 自定义淡褐色阴影
      }
    },
  },
  plugins: [

  ],
};
export default config;
