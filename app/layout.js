import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
export const metadata = {
    title: "Portal GME | Gestão de Matrículas Escolares",
    description: "Portal acadêmico de gestão de matrículas escolares",
};
export default function Layout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                {children}
                <footer>Portal GME · Gestão de Matrículas Escolares</footer>
            </body>
        </html>
    );
}
