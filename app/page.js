import Link from "next/link";
import { conectar, Aluno, Escola } from "../lib/banco";
import { Secretario } from "../lib/secretario";
import { secoes } from "../lib/secoes";

export const dynamic = "force-dynamic";

export default async function Inicio() {
    const modelos = { alunos: Aluno, escolas: Escola, secretarios: Secretario };
    let totais = {};
    try {
        await conectar();
        totais = Object.fromEntries(
            await Promise.all(
                Object.entries(modelos).map(async ([slug, modelo]) => [
                    slug,
                    await modelo.countDocuments(),
                ]),
            ),
        );
    } catch {
    }
    const grupos = Object.entries(secoes);
    return (
        <>
            <p className="contexto">Gestão de matrículas escolares</p>
            <div className="titulo">
                <h1>Painel administrativo</h1>
                <Link
                    className="btn btn-primary"
                    href="/alunos"
                >
                    Cadastrar aluno
                </Link>
            </div>
            <div className="row g-3 mt-2">
                {grupos.map(([slug, config]) => (
                    <div
                        key={slug}
                        className="col-md-4"
                    >
                        <Link
                            className="cartao resumo"
                            href={"/" + slug}
                        >
                            <h2>{config.titulo}</h2>
                            <p>{config.descricao}</p>
                            <strong>{totais[slug] ?? "—"}</strong>
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}
