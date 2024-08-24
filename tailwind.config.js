/** @type {import('tailwindcss').Config} */
import animatePlugin from 'tailwindcss-animate';
import formsPlugin from '@tailwindcss/forms';
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', 'node_modules/@ethsign/ui/dist/**/*.{js,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        normal: ["'IBM Plex Sans Light'", 'sans-serif'],
        italic: ["'IBM Plex Sans Italic'", 'sans-serif'],
        medium: ["'IBM Plex Sans Medium'", 'sans-serif'],
        mediumItalic: ["'IBM Plex Sans Medium Italic'", 'sans-serif'],
        semiBold: ["'IBM Plex Sans SemiBold'", 'sans-serif'],
        semiBoldItalic: ["'IBM Plex Sans SemiBold Italic'", 'sans-serif'],
        bold: ["'IBM Plex Sans Bold'", 'sans-serif'],
        boldItalic: ["'IBM Plex Sans Bold Italic'", 'sans-serif']
      },
      backgroundImage: {},
      backgroundSize: {
        '100%': '100% 100%'
      },
      boxShadow: {
        menu: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        right: 'inset -1px 0px 0px #EAECF0',
        bottom: 'inset 0px -1px 0px #EAECF0',
        xs: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        focus: '0px 0px 0px 4px #FEFBF9, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        focusPrimary: '0px 1px 2px 0px rgba(254, 250, 245, 0.05), 0px 0px 0px 4px rgba(254, 250, 245, 0.15)'
      },
      fontSize: {
        h1: ['2.375rem', '3.625rem'], //    [ 38px, 58px ]
        h2: ['1.625rem', '2.4375rem'], //    [ 26px, 39px ]
        h3: ['1.25rem', '1.875rem'], //   [ 20px, 30px ]
        h4: ['1rem', '1.5rem'], //    [ 16px, 24px ]
        p1: ['2.25rem', '2.6875rem'], //   [ 36px, 43px ]
        p2: ['1.5rem', '1.8125rem'], //    [ 24px, 29px ]
        p3: ['1.25rem', '1.5rem'], //   [ 20px, 24px ]
        p4: ['1.125rem', '1.375rem'], //    [ 18px, 22px ]
        p5: ['1rem', '1.1875rem'], //    [ 16px, 19px ]
        p6: ['0.875rem', '1.0625rem'], //   [ 14px, 17px ]
        p7: ['0.75rem', '1rem'], //  [ 12px, 16px ]
        xl: ['21px', '30px'],
        lg: ['19px', '28px'],
        md: ['17px', '24px'],
        base: ['17px', '24px'],
        sm: ['15px', '20px'],
        xs: ['13px', '18px']
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // primary: {
        //   DEFAULT: "hsl(var(--primary))",
        //   foreground: "hsl(var(--primary-foreground))",
        // },
        // secondary: {
        //   DEFAULT: "hsl(var(--secondary))",
        //   foreground: "hsl(var(--secondary-foreground))",
        // },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
          hover: 'hsl(var(--popover-hover))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        neutral: {
          300: '#E4E9F2',
          500: '#8F9BB3'
        },
        // dark mode
        light: 'rgba(19, 27, 47, 0.6)',
        gray: {
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#EAECF0',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1D2939',
          900: '#101828'
        },
        grey: {
          10: 'rgba(234, 236, 240, 0.1)',
          20: 'rgba(234, 236, 240, 0.20)',
          60: 'rgba(234, 236, 240, 0.60)',
          100: '#EAECF0',
          200: '#D0D5DD',
          300: '#98A2B3',
          400: '#667085',
          500: '#525A6A',
          600: '#3D4350',
          650: '#272B40',
          700: '#262B3E',
          730: '#1D2939',
          750: '#181E33',
          800: '#1A2038',
          850: '#131B2F',
          900: '#05051E'
        },
        primary: {
          25: '#FDFAF9',
          50: '#FDF7F3',
          100: '#FAEFE7',
          200: '#F2DBCC',
          300: '#ECBE9F',
          400: '#E7AE87',
          500: '#E29D70',
          600: '#DD8D58',
          700: '#D97D40',
          800: '#CD7134',
          900: '#CF5C10',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          25: '#F5F8FF',
          50: '#EFF4FF',
          100: '#D1E0FF',
          200: '#B2CCFF',
          300: '#84ADFF',
          400: '#528BFF',
          500: '#2970FF',
          600: '#155EEF',
          700: '#004EEB',
          800: '#0040C1',
          900: '#00359E',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        purple: {
          25: '#FCFAFF',
          50: '#F9F5FF',
          100: '#F4EBFF',
          200: '#E9D7FE',
          300: '#D6BBFB',
          400: '#B692F6',
          500: '#9E77ED',
          600: '#7F56D9',
          700: '#6941C6',
          800: '#6A1B9A',
          900: '#4A148C'
        },
        red: {
          25: '#FFFBFA',
          50: '#FEF3F2',
          100: '#FEE4E2',
          200: '#FECDCA',
          300: '#FDA29B',
          400: '#F97066',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
          800: '#912018',
          900: '#7A271A'
        },
        yellow: {
          25: '#FFFCF5',
          50: '#FFFAEB',
          100: '#FEF0C7',
          200: '#FEDF89',
          300: '#FEC84B',
          400: '#FDB022',
          500: '#F79009',
          600: '#DC6803',
          700: '#B54708',
          800: '#93370D',
          900: '#7A2E0E'
        },
        green: {
          25: '#FAFDF7',
          50: '#F5FBEE',
          100: '#E6F4D7',
          200: '#CEEAB0',
          300: '#ACDC79',
          400: '#86CB3C',
          500: '#669F2A',
          600: '#4F7A21',
          700: '#3F621A',
          800: '#335015',
          900: '#2B4212'
        },
        slime: {
          25: '#F6FEF9',
          50: '#ECFDF3',
          100: '#D1FADF',
          200: '#A6F4C5',
          300: '#6CE9A6',
          400: '#32D583',
          500: '#12B76A',
          600: '#039855',
          700: '#027A48',
          800: '#05603A',
          900: '#054F31'
        },
        tangerine: {
          25: '#FEFAF5',
          50: '#FEF6EE',
          100: '#FDEAD7',
          200: '#F9DBAF',
          300: '#F7B27A',
          400: '#F38744',
          500: '#EF6820',
          600: '#E04F16',
          700: '#B93815',
          800: '#932F19',
          900: '#772917'
        },
        blue: {
          25: '#F5FAFF',
          50: '#EFF8FF',
          100: '#D1E9FF',
          200: '#B2DDFF',
          300: '#84CAFF',
          400: '#53B1FD',
          500: '#2E90FA',
          600: '#1570EF',
          700: '#175CD3',
          800: '#1849A9',
          900: '#194185'
        },
        teal: {
          25: '#F6FEFC',
          50: '#F0FDF9',
          100: '#CCFBEF',
          200: '#99F6E0',
          300: '#5FE9D0',
          400: '#2ED3B7',
          500: '#15B79E',
          600: '#0E9384',
          700: '#107569',
          800: '#125D56',
          900: '#134E48'
        },
        cyan: {
          25: '#F5FEFF',
          50: '#ECFDFF',
          100: '#CFF9FE',
          200: '#A5F0FC',
          300: '#67E3F9',
          400: '#22CCEE',
          500: '#06AED4',
          600: '#088AB2',
          700: '#0E7090',
          800: '#155B75',
          900: '#164C63'
        },
        darkMatter: {
          25: '#F5F2F8',
          50: '#EBE5F0',
          100: '#D8CCE1',
          200: '#C5B3D3',
          300: '#B199C4',
          400: '#9E80B5',
          500: '#8A66A6',
          600: '#764C97',
          700: '#633389',
          800: '#501A7A',
          900: '#3C006B'
        },
        shareBorder: '#E0E0E0',
        shareBackground: '#F9F9F9',
        coolPurple: {
          100: '#957FEB',
          200: '#603FE0',
          300: '#4E2ADD'
        },
        coolBlue: {
          100: '#B9C4ED',
          200: '#7289DA',
          300: '#5978E4'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shake: 'shake 500ms'
      }
    }
  },
  plugins: [animatePlugin, formsPlugin]
};
