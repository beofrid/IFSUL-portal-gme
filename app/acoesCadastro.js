"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cadastro } from "../lib/secoes";
import { conectar, modelos } from "../lib/banco";
import { exigirAcesso, gerarHash, iguais, iniciar } from "../lib/sessao";

export async function entrar(anterior, form) {
    const email = String(form.get("email") || "")
        .trim()
        .toLowerCase();
    const senha = String(form.get("senha") || "");
    if (!senha || senha.length > 200) return "E-mail ou senha inválidos.";
    try {
        let id;
        if (
            email === process.env.ADMIN_EMAIL?.trim().toLowerCase() &&
            process.env.ADMIN_PASSWORD &&
            iguais(senha, process.env.ADMIN_PASSWORD)
        ) {
            id = "admin";
        } else {
            await conectar();
            const pessoa = await modelos.secretarios
                .findOne({ email })
                .select("+senhaHash")
                .lean();
            if (
                pessoa &&
                iguais(
                    pessoa.senhaHash,
                    await gerarHash(senha, pessoa.senhaHash.split(".")[0]),
                )
            )
                id = String(pessoa._id);
        }
        if (!id) return "E-mail ou senha inválidos.";
        await iniciar(id);
    } catch {
        return "Não foi possível iniciar a sessão. Confira a configuração do servidor.";
    }
    redirect("/");
}

export async function sair() {
    (await cookies()).delete("gme_sessao");
    redirect("/login");
}

async function autorizar(entidade, id) {
    const usuario = await exigirAcesso();
    if (!cadastro(entidade) || (entidade !== "alunos" && !usuario.admin))
        throw new Error("Acesso restrito.");
    if (id && !/^[0-9a-f]{24}$/.test(id)) throw new Error("Registro inválido.");
}

export async function salvar(entidade, id, anterior, form) {
    await autorizar(entidade, id);
    const config = cadastro(entidade);
    const dados = {};
    for (const campo of config.campos) {
        const valor = String(form.get(campo.chave) || "").trim();
        if (!valor || valor.length > (campo.max || 10))
            return "Confira o campo " + campo.rotulo + ".";
        dados[campo.chave] = valor;
    }
    if (entidade === "alunos") {
        const cpf = dados.cpf.replace(/\D/g, "");
        if (!/^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(dados.cpf))
            return "Informe o CPF com 11 dígitos.";
        dados.cpf = cpf.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
            "$1.$2.$3-$4",
        );
        const dia = new Date(dados.dataNascimento + "T00:00:00Z");
        if (
            !Number.isFinite(dia.getTime()) ||
            dia.toISOString().slice(0, 10) !== dados.dataNascimento ||
            dia > new Date()
        )
            return "Confira a data de nascimento.";
    }
    if (entidade === "secretarios") {
        dados.email = dados.email.toLowerCase();
        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email) ||
            dados.email === process.env.ADMIN_EMAIL?.trim().toLowerCase()
        )
            return "Informe um e-mail válido e diferente do acesso administrativo.";
        const senha = String(form.get("senha") || "");
        if ((!id || senha) && (senha.length < 8 || senha.length > 200))
            return "Use uma senha entre 8 e 200 caracteres.";
        if (senha) dados.senhaHash = await gerarHash(senha);
    }
    try {
        await conectar();
        if (
            (entidade === "alunos" || entidade === "secretarios") &&
            !(await modelos.escolas.exists({ nome: dados.escola }))
        ) {
            return "Selecione uma escola cadastrada. A escola informada não está disponível; recarregue a página e escolha novamente.";
        }
        const modelo = modelos[entidade];
        await modelo.init();
        if (id) {
            const resultado = await modelo.updateOne(
                { _id: id },
                { $set: dados },
                { runValidators: true },
            );
            if (!resultado.matchedCount)
                return "Este registro já foi excluído.";
        } else await modelo.create(dados);
    } catch (erro) {
        if (erro.code === 11000)
            return "Este código ou e-mail já está cadastrado.";
        return "Falha ao salvar. Verifique a conexão com o banco e tente novamente.";
    }
    redirect("/" + entidade + "?resultado=salvo");
}

export async function excluir(entidade, id) {
    await autorizar(entidade, id);
    await conectar();
    await modelos[entidade].deleteOne({ _id: id });
    redirect("/" + entidade + "?resultado=excluido");
}
