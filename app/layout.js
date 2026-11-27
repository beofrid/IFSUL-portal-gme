import Link from "next/link";
import "./globals.css";

export const metadata = {
    title: "Portal GME | Gestão de Matrículas Escolares",
};

export default function Layout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                <header>
                    <Link href="/">Portal GME</Link>
                    <nav aria-label="Navegação principal">
                        <Link href="/alunos">Alunos</Link>
                        <Link href="/escolas">Escolas</Link>
                        <Link href="/secretarios">Secretários</Link>
                    </nav>
                </header>
                <main>{children}</main>
                <footer>Portal GME · Gestão de Matrículas Escolares</footer>
            </body>
        </html>
    );
}
