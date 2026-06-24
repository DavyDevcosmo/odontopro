"use client"
export function Footer() {
    return (
        <footer className="py-6 text-center text-content-secondary text-sm ms:text md:text-base bg-surface-page">
            <p>Todos os direitos reservados {new Date().getFullYear()} - <span className="hover:text-content-primary duration-300 cursor-pointer">Davycosmo</span></p>
        </footer>
    )
}