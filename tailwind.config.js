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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          100: "#E7F0FF",
          600: "#007AFF",
          700: "#0456C4",
          900: "#002F6C",
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
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gray: {
          100: "#F2F2F2",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            lineHeight: '1.8',
            fontFamily: '"Noto Sans JP", ui-sans-serif, system-ui, sans-serif',
            h1: {
              color: '#111827',
              fontWeight: '700',
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h2: {
              color: '#111827',
              fontWeight: '600',
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h3: {
              color: '#111827',
              fontWeight: '600',
              fontSize: '1.5rem',
              lineHeight: '2rem',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },
            h4: {
              color: '#111827',
              fontWeight: '600',
              fontSize: '1.25rem',
              lineHeight: '1.75rem',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },
            p: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            strong: {
              color: '#111827',
              fontWeight: '600',
            },
            ul: {
              listStyleType: 'disc',
              paddingLeft: '1.5rem',
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: '1.5rem',
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            blockquote: {
              borderLeft: '4px solid #3B82F6',
              paddingLeft: '1rem',
              backgroundColor: '#F8FAFC',
              padding: '1rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              fontStyle: 'italic',
            },
            code: {
              backgroundColor: '#F1F5F9',
              color: '#3B82F6',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
            pre: {
              backgroundColor: '#1E293B',
              color: '#E2E8F0',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
              borderRadius: '0',
              fontSize: 'inherit',
              fontWeight: 'normal',
            },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            th: {
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '0.75rem',
              textAlign: 'left',
              fontWeight: '600',
            },
            td: {
              border: '1px solid #E2E8F0',
              padding: '0.75rem',
            },
            a: {
              color: '#3B82F6',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: '#1E40AF',
                textDecoration: 'underline',
              },
            },
          },
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: ["class"],
};