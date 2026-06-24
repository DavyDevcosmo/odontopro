"use client";

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
    const { toggle, isDark } = useTheme();

    return (
        <button
            onClick={toggle}
            aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
            className="
                flex items-center justify-center
                w-8 h-8 rounded-lg
                border border-[var(--border)]
                bg-[var(--surface-card)]
                text-[var(--content-secondary)]
                hover:text-[var(--content-primary)]
                hover:bg-[var(--surface-slot-hover)]
                transition-colors duration-200
            "
        >
            {isDark ? (
                /* Ícone sol — modo claro */
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
            ) : (
                /* Ícone lua — modo escuro */
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
            )}
        </button>
    );
}