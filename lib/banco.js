import mongoose from "mongoose";
import { campos } from "./campos";

export async function conectar() {
    if (!process.env.MONGODB_URI)
        throw new Error("Configure MONGODB_URI no ambiente.");
    await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    });
}

const definicao = {};
for (const campo of campos) {
    definicao[campo.chave] =
        campo.tipo === "date"
            ? { type: Date, required: true }
            : {
                  type: String,
                  trim: true,
                  maxlength: campo.max,
                  required: true,
              };
}
definicao.id_matricula.unique = true;

const alunoSchema = new mongoose.Schema(definicao, {
    collection: "alunos",
    timestamps: true,
});
const escolaSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true, trim: true, maxlength: 120 },
        id_escola: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 32,
        },
    },
    { collection: "escolas", timestamps: true },
);
export const Aluno =
    mongoose.models.alunos || mongoose.model("alunos", alunoSchema);
export const Escola =
    mongoose.models.escolas || mongoose.model("escolas", escolaSchema);
