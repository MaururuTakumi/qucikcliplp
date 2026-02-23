module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '3rem',
      },
      screens: {
        lg: '1140px',
        xl: '1280px',
      },
    },
    extend: {
      maxWidth: {
        '2xl': '1536px',
      },
      colors: {
        cream: '#F7F6F3',
        ink: '#111111',
        accent: {
          DEFAULT: '#D4581A',
          light: '#FFF3EC',
          hover: '#B84915',
        },
        muted: '#666666',
        subtle: '#E0DDD8',
        warm: '#8C8C8C',
        // Keep some for shadcn compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: '#D4581A',
          foreground: '#FFFFFF',
          50: '#FFF3EC',
          100: '#FFE4D2',
          500: '#D4581A',
          600: '#B84915',
          700: '#9C3A10',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: '#666666',
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "2px",
      },
      fontFamily: {
        serif: [
          '"Noto Serif JP"',
          '"Georgia"',
          '"Times New Roman"',
          'serif',
        ],
        sans: [
          '"Noto Sans JP"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"IBM Plex Mono"',
          '"Menlo"',
          '"Monaco"',
          'monospace',
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#111111',
            lineHeight: '1.8',
          },
        },
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "draw-line": {
          from: { width: "0%" },
          to: { width: "100%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-up-delay-1": "fade-up 0.8s ease-out 0.15s forwards",
        "fade-up-delay-2": "fade-up 0.8s ease-out 0.3s forwards",
        "fade-up-delay-3": "fade-up 0.8s ease-out 0.45s forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "draw-line": "draw-line 1.2s ease-out 0.6s forwards",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: ["class"],
};
