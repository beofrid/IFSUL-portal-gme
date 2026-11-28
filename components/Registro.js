import Link from "next/link";
import { notFound } from "next/navigation";
import Painel from "./Moldura";
import { Formulario } from "./FormCadastro";
import { cadastro } from "../lib/secoes";
import { conectar, modelos } from "../lib/banco";
import { exigirAcesso } from "../lib/sessao";
import { excluir } from "../app/acoesCadastro";

export default async function Registro({ entidade, id, searchParams }) {
    const config = cadastro(entidade);
    if (!config) notFound();
    const usuario = await exigirAcesso();
    const { acao } = await searchParams;
    const novo = id === "novo";
    const editar = usuario.admin || entidade === "alunos";
    if ((novo || acao) && !editar) notFound();
    let valores = {};
    if (!novo) {
        if (!/^[0-9a-f]{24}$/.test(id)) notFound();
        await conectar();
        const registro = await modelos[entidade].findById(id).lean();
        if (!registro) notFound();
        valores = Object.fromEntries(
            config.campos.map((c) => [
                c.chave,
                c.tipo === "date"
                    ? registro[c.chave].toISOString().slice(0, 10)
                    : registro[c.chave],
            ]),
        );
    }
    let escolas = [];
    if (
        (novo || acao === "editar") &&
        (entidade === "alunos" || entidade === "secretarios")
    ) {
        await conectar();
        escolas = await modelos.escolas
            .find({})
            .select("nome id_escola -_id")
            .sort({ nome: 1, id_escola: 1 })
            .lean();
    }
    const titulo = novo
        ? config.novo
        : acao === "editar"
          ? "Editar " + config.singular
          : acao === "excluir"
            ? "Excluir " + config.singular
            : valores.nome;
    return (
        <Painel
            usuario={usuario}
            atual={entidade}
        >
            <Link href={"/" + entidade}>← {config.titulo}</Link>
            <h1 className="my-4">{titulo}</h1>
            {novo || acao === "editar" ? (
                <Formulario
                    entidade={entidade}
                    id={novo ? "" : id}
                    inicial={valores}
                    escolas={escolas}
                />
            ) : acao === "excluir" ? (
                <form
                    action={excluir.bind(null, entidade, id)}
                    className="cartao p-4"
                >
                    <p>
                        Confirma a exclusão de <strong>{valores.nome}</strong>?
                    </p>
                    <div className="d-flex gap-2">
                        <button className="btn btn-danger">
                            Confirmar exclusão
                        </button>
                        <Link
                            href={"/" + entidade}
                            className="btn btn-outline-secondary"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            ) : (
                <section className="cartao p-4">
                    <dl className="row">
                        {config.campos.map((c) => (
                            <div
                                key={c.chave}
                                className="col-sm-6 mb-3"
                            >
                                <dt>{c.rotulo}</dt>
                                <dd>
                                    {c.tipo === "date"
                                        ? valores[c.chave]
                                              .split("-")
                                              .reverse()
                                              .join("/")
                                        : valores[c.chave]}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    {editar && (
                        <Link
                            className="btn btn-primary"
                            href={"/" + entidade + "/" + id + "?acao=editar"}
                        >
                            Editar
                        </Link>
                    )}
                </section>
            )}
        </Painel>
    );
}
