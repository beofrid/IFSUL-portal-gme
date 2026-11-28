import Link from "next/link";
import { notFound } from "next/navigation";
import Painel from "./Moldura";
import { cadastro } from "../lib/secoes";
import { conectar, modelos } from "../lib/banco";
import { exigirAcesso } from "../lib/sessao";

function filtroLiteral(texto) {
    return {
        $regex: texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
    };
}
export default async function Listagem({ entidade, searchParams }) {
    const config = cadastro(entidade);
    if (!config) notFound();
    const usuario = await exigirAcesso();
    const editar = usuario.admin || entidade === "alunos";
    const comEscola = entidade !== "escolas";
    const busca = await searchParams;
    const filtros = {};
    for (const chave of comEscola ? ["nome", "escola"] : ["nome"]) {
        if (typeof busca[chave] === "string" && busca[chave].trim())
            filtros[chave] = filtroLiteral(busca[chave].trim().slice(0, 120));
    }
    await conectar();
    const linhas = await modelos[entidade]
        .find(filtros)
        .select("nome escola " + config.codigo)
        .sort({ nome: 1, _id: 1 })
        .lean();
    const url = "/" + entidade;
    return (
        <Painel
            usuario={usuario}
            atual={entidade}
        >
            <p className="contexto">{config.descricao}</p>
            <div className="titulo">
                <h1>{config.titulo}</h1>
                {editar && (
                    <Link
                        className="btn btn-primary"
                        href={url + "/novo"}
                    >
                        {config.novo}
                    </Link>
                )}
            </div>
            {["salvo", "excluido"].includes(busca.resultado) && (
                <p
                    role="status"
                    className="alert alert-success"
                >
                    Registro{" "}
                    {busca.resultado === "salvo" ? "salvo" : "excluído"}.
                </p>
            )}
            <section className="cartao">
                <form
                    action={url}
                    className="filtros"
                >
                    <label>
                        Nome
                        <input
                            name="nome"
                            className="form-control"
                            defaultValue={busca.nome}
                            maxLength={120}
                        />
                    </label>
                    {comEscola && (
                        <label>
                            Escola
                            <input
                                name="escola"
                                className="form-control"
                                defaultValue={busca.escola}
                                maxLength={120}
                            />
                        </label>
                    )}
                    <button className="btn btn-primary">Pesquisar</button>
                    <Link
                        className="btn btn-link"
                        href={url}
                    >
                        Limpar
                    </Link>
                </form>
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>{comEscola ? "Escola" : "Código"}</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {linhas.map((linha) => {
                                const item = url + "/" + linha._id;
                                return (
                                    <tr key={String(linha._id)}>
                                        <td>{linha.nome}</td>
                                        <td>
                                            {comEscola
                                                ? linha.escola
                                                : linha.id_escola}
                                        </td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-2">
                                                <Link href={item}>
                                                    Visualizar
                                                </Link>
                                                {editar && (
                                                    <>
                                                        <Link
                                                            href={
                                                                item +
                                                                "?acao=editar"
                                                            }
                                                        >
                                                            Editar
                                                        </Link>
                                                        <Link
                                                            className="text-danger"
                                                            href={
                                                                item +
                                                                "?acao=excluir"
                                                            }
                                                        >
                                                            Excluir
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {!linhas.length && (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="text-center text-secondary py-4"
                                    >
                                        Nenhum registro encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </Painel>
    );
}
