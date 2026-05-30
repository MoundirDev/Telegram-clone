/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tg: {
          blue: 'var(--tg-blue)',
          'blue-hover': 'var(--tg-blue-hover)',
          sidebar: 'var(--tg-sidebar)',
          panel: 'var(--tg-panel)',
          border: 'var(--tg-border)',
          'chat-bg': 'var(--tg-chat-bg)',
          outgoing: 'var(--tg-outgoing)',
          'outgoing-text': 'var(--tg-outgoing-text)',
          incoming: 'var(--tg-incoming)',
          'incoming-text': 'var(--tg-incoming-text)',
          muted: 'var(--tg-muted)',
          title: 'var(--tg-title)',
          'search-bg': 'var(--tg-search-bg)',
          hover: 'var(--tg-hover)',
          selected: 'var(--tg-selected)',
          'selected-text': 'var(--tg-selected-text)',
          online: 'var(--tg-online)',
        },
      },
      fontFamily: {
        tg: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        bubble: '0 1px 2px var(--tg-shadow)',
        header: '0 1px 2px var(--tg-shadow)',
      },
    },
  },
  plugins: [],
};
