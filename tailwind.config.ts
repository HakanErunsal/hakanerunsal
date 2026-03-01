import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        heading: ["var(--font-heading)", "var(--font-sans)", ...fontFamily.sans],
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
        "ue-sidebar": "hsl(var(--ue-sidebar-bg))",
        "ue-header": "hsl(var(--ue-header-bg))",
        "ue-code": "hsl(var(--ue-code-bg))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "hsl(var(--foreground))",
            "--tw-prose-headings": "hsl(var(--foreground))",
            "--tw-prose-links": "hsl(var(--primary))",
            "--tw-prose-bold": "hsl(var(--foreground))",
            "--tw-prose-counters": "hsl(var(--muted-foreground))",
            "--tw-prose-bullets": "hsl(var(--primary))",
            "--tw-prose-hr": "hsl(var(--border))",
            "--tw-prose-quotes": "hsl(var(--foreground))",
            "--tw-prose-quote-borders": "hsl(var(--primary))",
            "--tw-prose-code": "hsl(var(--foreground))",
            "--tw-prose-pre-code": "hsl(var(--foreground))",
            "--tw-prose-pre-bg": "hsl(var(--ue-code-bg))",
            "--tw-prose-th-borders": "hsl(var(--border))",
            "--tw-prose-td-borders": "hsl(var(--border))",
            maxWidth: "58rem",
            fontSize: "1rem",
            lineHeight: "1.75",
            h1: {
              fontFamily: "var(--font-heading), var(--font-sans)",
              fontWeight: "700",
              fontSize: "2.25rem",
              lineHeight: "1.25",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            },
            h2: {
              fontFamily: "var(--font-heading), var(--font-sans)",
              fontWeight: "700",
              fontSize: "1.875rem",
              lineHeight: "1.25",
              letterSpacing: "-0.01em",
              marginTop: "2.5rem",
              marginBottom: "0.75rem",
              paddingBottom: "0.5rem",
              borderBottom: "1px solid hsl(var(--border))",
            },
            h3: {
              fontFamily: "var(--font-heading), var(--font-sans)",
              fontWeight: "600",
              fontSize: "1.375rem",
              lineHeight: "1.3",
              marginTop: "2rem",
              marginBottom: "0.5rem",
            },
            h4: {
              fontFamily: "var(--font-heading), var(--font-sans)",
              fontWeight: "600",
              fontSize: "1.125rem",
              lineHeight: "1.4",
            },
            a: {
              textDecoration: "none",
              fontWeight: "inherit",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            code: {
              backgroundColor: "hsl(224 12% 15%)",
              padding: "0.15rem 0.4rem",
              borderRadius: "0.2rem",
              fontSize: "0.875em",
              fontWeight: "400",
            },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            pre: {
              backgroundColor: "hsl(var(--ue-code-bg))",
              borderRadius: "0.25rem",
              border: "1px solid hsl(var(--border))",
              padding: "1rem",
            },
            blockquote: {
              borderLeftColor: "hsl(var(--primary))",
              backgroundColor: "hsl(224 12% 12%)",
              padding: "0.5rem 1rem",
              borderRadius: "0 0.25rem 0.25rem 0",
              fontStyle: "normal",
            },
            table: {
              width: "100%",
            },
            thead: {
              backgroundColor: "hsl(224 12% 12%)",
            },
            "thead th": {
              fontFamily: "var(--font-heading), var(--font-sans)",
              fontWeight: "600",
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "0.75rem 1rem",
            },
            "tbody td": {
              padding: "0.75rem 1rem",
            },
            "tbody tr": {
              borderBottomColor: "hsl(var(--border))",
            },
            hr: {
              borderColor: "hsl(var(--border))",
              marginTop: "2rem",
              marginBottom: "2rem",
            },
            strong: {
              fontWeight: "600",
            },
            img: {
              borderRadius: "0.25rem",
            },
          },
        },
        invert: {
          css: {
            "--tw-prose-body": "hsl(var(--foreground))",
            "--tw-prose-headings": "hsl(var(--foreground))",
            "--tw-prose-links": "hsl(var(--primary))",
            "--tw-prose-bold": "hsl(var(--foreground))",
            "--tw-prose-counters": "hsl(var(--muted-foreground))",
            "--tw-prose-bullets": "hsl(var(--primary))",
            "--tw-prose-hr": "hsl(var(--border))",
            "--tw-prose-quotes": "hsl(var(--foreground))",
            "--tw-prose-quote-borders": "hsl(var(--primary))",
            "--tw-prose-code": "hsl(var(--foreground))",
            "--tw-prose-pre-code": "hsl(var(--foreground))",
            "--tw-prose-pre-bg": "hsl(var(--ue-code-bg))",
            "--tw-prose-th-borders": "hsl(var(--border))",
            "--tw-prose-td-borders": "hsl(var(--border))",
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
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
