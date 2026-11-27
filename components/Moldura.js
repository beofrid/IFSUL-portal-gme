"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { secoes } from "../lib/secoes";

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
export default function Moldura({ children }) {
    const caminho = usePathname();
    const atual = caminho.split("/")[1];
    if (atual === "login") return children;
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
                        {Object.entries(secoes).map(([slug, config]) => (
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
                    <div className="conta">
                        <Link
                            href="/login"
                            className="btn btn-sm btn-outline-light"
                        >
                            Sair
                        </Link>
                    </div>
                </nav>
            </header>
            <main className="container py-4 py-md-5">{children}</main>
        </>
    );
}
