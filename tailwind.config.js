/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 專案色彩系統
      colors: {
        primary: "#073358",
        "primary-light": "#105794",
        "accent-yellow": "#FFFBA5",
        "button-primary": "#60a5faa5",
        "button-hover": "#418de9a5",
        error: "rgb(230, 29, 29)",
      },
      // 字體系統
      fontFamily: {
        display: ["EB Garamond", "serif"],
        brand: ["Times New Roman", "serif"],
      },
      // 背景漸層
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(141.11deg, rgba(7, 51, 88, 0.4) 9.39%, #073358 70.4%)",
      },
      // 陰影系統
      boxShadow: {
        button: "0 7px 10px rgba(0, 0, 0, 0.2)",
        "button-active": "0 4px 10px rgba(0, 0, 0, 0.2)",
      },
      // 響應式斷點 - 混合式方法 (保持向下兼容)
      screens: {
        // Mobile-first 標準斷點
        'sm': '640px',
        'md': '768px', 
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        
        // 專案特定的 max-width 斷點
        'max-iphoneSE': { max: "375px" },
        'max-iphoneXR': { max: "414px" },
        'max-ipad': { max: "768px" },
        'max-small-tab-port': { max: "800px" },
        'max-tab-port': { max: "900px" },
        'max-small-desktop': { max: "1028px" },
        'max-desktop': { max: "1230px" },
        
        // 舊版兼容 (建議逐步移除)
        iphoneSE: { max: "375px" },
        iphoneXR: { max: "414px" },
        ipad: { max: "768px" },
        "small-tab-port": { max: "800px" },
        "tab-port": { max: "900px" },
        "small-desktop": { max: "1028px" },
        desktop: { max: "1230px" },
        "big-desktop": { min: "1800px" },
      },
      // 自定義尺寸 (從 SCSS 提取的精確數值)
      spacing: {
        18: "4.5rem", // tab-port width
      },
      // 自定義寬度
      width: {
        "3/10": "30%", // Result 左側寬度
      },
      // 動畫尺寸系統
      animation: {
        'fade-in': 'fadeIn 0.7s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      // Z-index 層級
      zIndex: {
        1: "1",
        2: "2",
      },
    },
  },
  plugins: [],
};
