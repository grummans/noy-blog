/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"JetBrains Mono"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        gruvbox: {
          dark: {
            bg: '#282828',
            fg: '#ebdbb2',
            red: '#cc241d',
            green: '#98971a',
            yellow: '#d79921',
            blue: '#458588',
            purple: '#b16286',
            aqua: '#689d6a',
            gray: '#a89984',
            bg0_h: '#1d2021',
            bg0_s: '#32302f',
            bg1: '#3c3836',
            bg2: '#504945',
            bg3: '#665c54',
            bg4: '#7c6f64',
          },
          light: {
            bg: '#fbf1c7',
            fg: '#3c3836',
            red: '#9d0006',
            green: '#79740e',
            yellow: '#b57614',
            blue: '#076678',
            purple: '#8f3f71',
            aqua: '#427b58',
            gray: '#7c6f64',
            bg0_h: '#f9f5d7',
            bg0_s: '#f2e5bc',
            bg1: '#ebdbb2',
            bg2: '#d5c4a1',
            bg3: '#bdae93',
            bg4: '#a89984',
          }
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gruvbox.light.fg'),
            a: {
              color: theme('colors.gruvbox.light.blue'),
              textDecoration: 'none',
              fontWeight: 'bold',
              '&:hover': {
                color: theme('colors.gruvbox.light.aqua'),
              },
            },
            h1: { color: theme('colors.gruvbox.light.red') },
            h2: { color: theme('colors.gruvbox.light.green') },
            h3: { color: theme('colors.gruvbox.light.yellow') },
            h4: { color: theme('colors.gruvbox.light.blue') },
            code: {
              color: theme('colors.gruvbox.light.purple'),
              backgroundColor: theme('colors.gruvbox.light.bg1'),
              padding: '0.2em 0.4em',
              borderRadius: '2px',
              fontStyle: 'normal',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: theme('colors.gruvbox.dark.bg0_h'),
              color: theme('colors.gruvbox.dark.fg'),
              borderRadius: '0px',
            },
            blockquote: {
              borderLeftColor: theme('colors.gruvbox.light.gray'),
              color: theme('colors.gruvbox.light.gray'),
            }
          },
        },
        invert: {
          css: {
            color: theme('colors.gruvbox.dark.fg'),
            a: {
              color: theme('colors.gruvbox.dark.blue'),
              '&:hover': {
                color: theme('colors.gruvbox.dark.aqua'),
              },
            },
            h1: { color: theme('colors.gruvbox.dark.red') },
            h2: { color: theme('colors.gruvbox.dark.green') },
            h3: { color: theme('colors.gruvbox.dark.yellow') },
            h4: { color: theme('colors.gruvbox.dark.blue') },
            code: {
              color: theme('colors.gruvbox.dark.purple'),
              backgroundColor: theme('colors.gruvbox.dark.bg1'),
            },
            blockquote: {
              borderLeftColor: theme('colors.gruvbox.dark.gray'),
              color: theme('colors.gruvbox.dark.gray'),
            }
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
