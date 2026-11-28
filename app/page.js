import Link from "next/link";
import Painel from "../components/Moldura";
import { exigirAcesso } from "../lib/sessao";
import { conectar, modelos } from "../lib/banco";
import { cadastros } from "../lib/secoes";
export default async function Inicio() {
    const usuario = await exigirAcesso();
    await conectar();
    const grupos = await Promise.all(
        Object.entries(cadastros).map(async ([slug, config]) => ({
            slug,
            config,
            total: await modelos[slug].countDocuments(),
        })),
    );
    return (
        <Painel usuario={usuario}>
            <p className="contexto">Gestão de matrículas escolares</p>
            <div className="titulo">
                <h1>Painel administrativo</h1>
                <Link
                    className="btn btn-primary"
                    href="/alunos/novo"
                >
                    Cadastrar aluno
                </Link>
            </div>
            <div className="row g-3 mt-2">
                {grupos.map(({ slug, config, total }) => (
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
                            <strong>{total}</strong>
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </div>
                ))}
            </div>
        </Painel>
    );
}
