"use server";

import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { redirect } from "next/navigation";
import { conectar, Escola } from "../lib/banco";
import { Secretario } from "../lib/secretario";

function texto(form, chave) {
    return String(form.get(chave) || "").trim();
}

function mensagem(erro, duplicado) {
    if (erro.code === 11000) return duplicado;
    if (erro.name === "ValidationError")
        return "Confira os campos do cadastro.";
    return "Falha ao salvar. Confira a conexão com o banco e tente novamente.";
}

export async function cadastrarEscola(anterior, form) {
    try {
        await conectar();
        await Escola.init();
        await Escola.create({
            nome: texto(form, "nome"),
            id_escola: texto(form, "id_escola"),
        });
    } catch (erro) {
        return mensagem(erro, "Este código de escola já está cadastrado.");
    }
    redirect("/escolas?resultado=salvo");
}

export async function cadastrarSecretario(anterior, form) {
    const email = texto(form, "email").toLowerCase();
    const escola = texto(form, "escola");
    const senha = String(form.get("senha") || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return "Informe um e-mail válido.";
    if (senha.length < 8 || senha.length > 200)
        return "Use uma senha entre 8 e 200 caracteres.";
    try {
        await conectar();
        if (!(await Escola.exists({ nome: escola })))
            return "Selecione uma escola cadastrada.";
        const sal = randomBytes(16).toString("hex");
        const hash = await promisify(scrypt)(senha, sal, 64);
        await Secretario.init();
        await Secretario.create({
            nome: texto(form, "nome"),
            id_cadastro: texto(form, "id_cadastro"),
            email,
            escola,
            senhaHash: sal + "." + hash.toString("hex"),
        });
    } catch (erro) {
        return mensagem(erro, "Este código ou e-mail já está cadastrado.");
    }
    redirect("/secretarios?resultado=salvo");
}
