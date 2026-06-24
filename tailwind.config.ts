import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class", // Ativa dark mode via classe .dark no <html>

    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/_components/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    theme: {
        extend: {
            colors: {
                // ─── SIDEBAR ───────────────────────────────────────────────
                sidebar: {
                    bg:               "#1A3A4A", // dark: mantém | light: mesmo
                    "text-primary":   "#E0EEF5",
                    "text-secondary": "#7AAFC5",
                    "text-muted":     "#6A9BB0",
                    "text-muted-dark":"#4A7A90",
                    "item-active":    "rgba(75, 163, 195, 0.18)",
                    divider:          "rgba(255, 255, 255, 0.08)",
                },

                // ─── ACENTO ────────────────────────────────────────────────
                accent: {
                    primary: "#4BA3C3",
                    dark:    "#1A3A4A",
                },

                // ─── SUPERFÍCIES — LIGHT ───────────────────────────────────
                surface: {
                    page:        "#EEF3F7",
                    card:        "#FFFFFF",
                    "card-header":"#FAFCFD",
                    "slot-hover":"#F0F5F8",
                },

                // ─── SUPERFÍCIES — DARK ────────────────────────────────────
                // Usadas com o prefixo dark: nas classes Tailwind
                "surface-dark": {
                    page:         "#0D1E26",
                    card:         "#112636",
                    "card-header":"#0F2130",
                    "slot-hover": "#162F3D",
                },

                // ─── BORDAS — LIGHT ────────────────────────────────────────
                border: {
                    DEFAULT:    "#D4E3EC",
                    soft:       "#EEF3F7",
                    "trial-bar":"#C0DCEA",
                },

                // ─── BORDAS — DARK ─────────────────────────────────────────
                "border-dark": {
                    DEFAULT:    "#1E3D50",
                    soft:       "#162F3D",
                    "trial-bar":"#1E3D50",
                },

                // ─── TEXTOS — LIGHT ────────────────────────────────────────
                content: {
                    primary:   "#1A3A4A",
                    secondary: "#7A9FB5",
                    muted:     "#B0C8D5",
                },

                // ─── TEXTOS — DARK ─────────────────────────────────────────
                "content-dark": {
                    primary:   "#E0EEF5",
                    secondary: "#7AAFC5",
                    muted:     "#4A7A90",
                },

                // ─── STATUS (compartilhado light/dark) ─────────────────────
                status: {
                    "chip-confirmed-bg":   "#E3F2F8",
                    "chip-confirmed-text": "#1A7A9A",
                    "chip-confirmed-bg-dark":   "rgba(75,163,195,0.15)",
                    "chip-confirmed-text-dark": "#4BA3C3",

                    "trial-bar-bg":   "#E3F2F8",
                    "trial-bar-text": "#1A5A7A",
                    "trial-bar-bg-dark":   "rgba(75,163,195,0.12)",
                    "trial-bar-text-dark": "#7AAFC5",

                    "delta-green-bg":   "#E8F5EE",
                    "delta-green-text": "#2E8B57",
                    "delta-green-bg-dark":   "rgba(46,139,87,0.15)",
                    "delta-green-text-dark": "#4ABA7A",

                    "delta-neutral-bg":   "#EEF3F7",
                    "delta-neutral-text": "#6A9BB0",
                    "delta-neutral-bg-dark":   "#162F3D",
                    "delta-neutral-text-dark": "#7AAFC5",
                },
            },
        },
    },

    plugins: [],
};

export default config;