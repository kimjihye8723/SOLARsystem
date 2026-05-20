import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#191c1f',
          950: '#0b0d10',
        },
        // 시스템 기본 테마
        brand: {
          primary: '#3b82f6',
          secondary: '#1e40af',
        },
        // 설비 상태 정의 컬러
        status: {
          normal: '#10b981',  // 정상 가동 (Green)
          standby: '#f5a623', // 대기 상태 (Orange/Yellow)
          stop: '#6b7280',    // 정지 상태 (Gray)
          fault: '#ef4444',   // 장애/고장 (Red)
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
