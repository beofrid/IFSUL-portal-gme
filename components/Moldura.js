import Link from "next/link";
import { cadastros } from "../lib/secoes";
import { sair } from "../app/acoesCadastro";
import Image from "next/image";
import logo from "../public/logo2.png";

export function Marca() {
    return (
        <span className="marca">
            <Image
                src={logo}
                alt=""
                className="img-fluid bordalogo"
                style={{ width: "clamp(24px, 6vw, 220px)", height: "auto" }}
            />
            Portal GME
        </span>
    );
}
export default function Painel({ usuario, atual, children }) {
    return (
        <>
            <header>
                <nav
                    className="container navbar navbar-dark"
                    aria-label="Navegação principal"
                >
                    <Link
                        href="/"
                        className="navbar-brand"
                    >
                        <Marca />
                    </Link>
                    <div className="nav menu">
                        <Link
                            className={"nav-link " + (!atual ? "ativo" : "")}
                            href="/"
                        >
                            Início
                        </Link>
                        {Object.entries(cadastros).map(([slug, config]) => (
                            <Link
                                href={"/" + slug}
                                key={slug}
                                className={
                                    "nav-link " +
                                    (atual === slug ? "ativo" : "")
                                }
                            >
                                {config.titulo}
                            </Link>
                        ))}
                    </div>
                    <form
                        action={sair}
                        className="conta"
                    >
                        <span>{usuario.nome}</span>
                        <button className="btn btn-sm btn-outline-light">
                            Sair
                        </button>
                    </form>
                </nav>
            </header>
            <main className="container py-4 py-md-5">{children}</main>
        </>
    );
}
