"use server";
import { campos } from "../../lib/campos";
import { conectar, Aluno, Escola } from "../../lib/banco";
import { redirect } from "next/navigation";

export async function cadastrar(anterior, form) {
    const dados = {};
    for (const campo of campos) {
        const valor = String(form.get(campo.chave) || "").trim();
        if (!valor || valor.length > (campo.max || 10))
            return "Confira o campo " + campo.rotulo + ".";
        dados[campo.chave] = valor;
    }
    const cpf = dados.cpf.replace(/\D/g, "");
    if (!/^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(dados.cpf))
        return "Informe o CPF com 11 dígitos.";
    dados.cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    const dia = new Date(dados.dataNascimento + "T00:00:00Z");
    if (
        !Number.isFinite(dia.getTime()) ||
        dia.toISOString().slice(0, 10) !== dados.dataNascimento ||
        dia > new Date()
    )
        return "Confira a data de nascimento.";
    try {
        await conectar();
        if (!(await Escola.exists({ nome: dados.escola })))
            return "Selecione uma escola cadastrada.";
        await Aluno.init();
        await Aluno.create(dados);
    } catch (erro) {
        if (erro.code === 11000)
            return "Este número de matrícula já está cadastrado.";
        return "Falha ao salvar. Confira a conexão com o banco e tente novamente.";
    }
    redirect("/alunos?resultado=salvo");
}
