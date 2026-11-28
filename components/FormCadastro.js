"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { entrar, salvar } from "../app/acoesCadastro";
import { cadastro } from "../lib/secoes";

export function Login() {
    const [erro, action, enviando] = useActionState(entrar, "");
    return (
        <form action={action}>
            <label
                className="form-label"
                htmlFor="email"
            >
                E-mail
            </label>
            <input
                id="email"
                name="email"
                className="form-control mb-3"
                type="email"
                required
                autoComplete="username"
            />
            <label
                className="form-label"
                htmlFor="senha"
            >
                Senha
            </label>
            <input
                id="senha"
                name="senha"
                className="form-control mb-4"
                type="password"
                required
                autoComplete="current-password"
            />
            {erro && (
                <p
                    role="alert"
                    className="alert alert-danger"
                >
                    {erro}
                </p>
            )}
            <button
                className="btn btn-primary w-100"
                disabled={enviando}
            >
                {enviando ? "Entrando…" : "Entrar"}
            </button>
        </form>
    );
}

export function Formulario({ entidade, id = "", inicial = {}, escolas = [] }) {
    const comEscola = entidade === "alunos" || entidade === "secretarios";
    const escolaDisponivel = escolas.some(
        (escola) => escola.nome === inicial.escola,
    );
    const [valores, alterar] = useState(() =>
        comEscola && !escolaDisponivel ? { ...inicial, escola: "" } : inicial,
    );
    const [erro, action, enviando] = useActionState(
        salvar.bind(null, entidade, id),
        "",
    );
    const campos = [...cadastro(entidade).campos];
    if (entidade === "secretarios")
        campos.push({
            chave: "senha",
            rotulo: id ? "Nova senha (opcional)" : "Senha de acesso",
            tipo: "password",
            max: 200,
        });
    return (
        <form
            action={action}
            className="cartao p-4"
        >
            <div className="row g-3">
                {campos.map((c) => (
                    <div
                        className="col-md-6"
                        key={c.chave}
                    >
                        <label
                            className="form-label"
                            htmlFor={c.chave}
                        >
                            {c.rotulo}
                        </label>
                        {c.chave === "escola" ? (
                            <>
                                <select
                                    id={c.chave}
                                    name={c.chave}
                                    className="form-select"
                                    required
                                    disabled={!escolas.length}
                                    aria-describedby={
                                        !escolas.length ||
                                        (inicial.escola &&
                                            !escolaDisponivel &&
                                            !valores.escola)
                                            ? "escola-aviso"
                                            : undefined
                                    }
                                    value={valores.escola || ""}
                                    onChange={(e) =>
                                        alterar({
                                            ...valores,
                                            escola: e.target.value,
                                        })
                                    }
                                >
                                    <option
                                        value=""
                                        disabled
                                    >
                                        Selecione uma escola
                                    </option>
                                    {escolas.map((escola) => (
                                        <option
                                            key={escola.id_escola}
                                            value={escola.nome}
                                        >
                                            {escola.nome} ({escola.id_escola})
                                        </option>
                                    ))}
                                </select>
                                {!escolas.length ? (
                                    <p
                                        id="escola-aviso"
                                        role="status"
                                        className="text-danger mt-2 mb-0"
                                    >
                                        Nenhuma escola cadastrada. Solicite ao
                                        administrador o cadastro de uma escola
                                        antes de salvar.
                                    </p>
                                ) : inicial.escola &&
                                  !escolaDisponivel &&
                                  !valores.escola ? (
                                    <p
                                        id="escola-aviso"
                                        role="status"
                                        className="text-danger mt-2 mb-0"
                                    >
                                        A escola anterior ({inicial.escola}) não
                                        está mais disponível. Selecione uma
                                        escola cadastrada.
                                    </p>
                                ) : null}
                            </>
                        ) : (
                            <input
                                id={c.chave}
                                name={c.chave}
                                className="form-control"
                                type={c.tipo || "text"}
                                autoComplete={
                                    c.tipo === "password"
                                        ? "new-password"
                                        : undefined
                                }
                                required={!(id && c.chave === "senha")}
                                maxLength={c.max}
                                minLength={c.chave === "senha" ? 8 : undefined}
                                placeholder={c.exemplo}
                                value={valores[c.chave] || ""}
                                onChange={(e) =>
                                    alterar({
                                        ...valores,
                                        [c.chave]: e.target.value,
                                    })
                                }
                            />
                        )}
                    </div>
                ))}
            </div>
            {erro && (
                <p
                    role="alert"
                    className="alert alert-danger mt-3"
                >
                    {erro}
                </p>
            )}
            <div className="d-flex gap-2 mt-4">
                <button
                    className="btn btn-primary"
                    disabled={enviando || (comEscola && !escolas.length)}
                >
                    {enviando ? "Salvando…" : "Salvar"}
                </button>
                <Link
                    href={"/" + entidade}
                    className="btn btn-outline-secondary"
                >
                    Cancelar
                </Link>
            </div>
        </form>
    );
}
