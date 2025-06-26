import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 原始网站使用 "Lato" 和 "Roboto Slab" 作为主要字体
        sans: ['var(--font-lato)', 'sans-serif'],
        serif: ['var(--font-roboto-slab)', 'serif'],
        // 代码字体
        mono: ['Consolas', 'Menlo', 'Courier', 'monospace'],
      },
      maxWidth: {
        // 主内容区的最大宽度
        '8xl': '90rem', // 约 1440px
      }
    },
  },
  plugins: [],
}
export default config 