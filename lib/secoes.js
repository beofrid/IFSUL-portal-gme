const nome = { chave: "nome", rotulo: "Nome", max: 120 };
const escola = { chave: "escola", rotulo: "Escola", max: 120 };
export const cadastros = {
    alunos: {
        titulo: "Alunos",
        singular: "aluno",
        novo: "Cadastrar aluno",
        descricao: "Matrículas escolares",
        codigo: "id_matricula",
        campos: [
            nome,
            { chave: "id_matricula", rotulo: "Número da matrícula", max: 32 },
            { chave: "nome_mae", rotulo: "Nome da mãe", max: 120 },
            {
                chave: "dataNascimento",
                rotulo: "Data de nascimento",
                tipo: "date",
            },
            escola,
            { chave: "cpf", rotulo: "CPF", max: 14, exemplo: "000.000.000-00" },
        ],
    },
    secretarios: {
        titulo: "Secretários",
        singular: "secretário",
        novo: "Cadastrar secretário",
        descricao: "Equipe da secretaria",
        codigo: "id_cadastro",
        campos: [
            nome,
            { chave: "id_cadastro", rotulo: "Código do cadastro", max: 32 },
            { chave: "email", rotulo: "E-mail", tipo: "email", max: 200 },
            escola,
        ],
    },
    escolas: {
        titulo: "Escolas",
        singular: "escola",
        novo: "Cadastrar escola",
        descricao: "Unidades municipais",
        codigo: "id_escola",
        campos: [
            nome,
            { chave: "id_escola", rotulo: "Código da escola", max: 32 },
        ],
    },
};

export function cadastro(chave) {
    return Object.hasOwn(cadastros, chave) ? cadastros[chave] : null;
}
