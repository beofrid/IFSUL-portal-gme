import mongoose from "mongoose";
import { cadastros } from "./secoes";

export async function conectar() {
    if (!process.env.MONGODB_URI)
        throw new Error("Configure MONGODB_URI no ambiente.");
    await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    });
}

export const modelos = {};
for (const [colecao, config] of Object.entries(cadastros)) {
    const campos = {};
    for (const campo of config.campos) {
        campos[campo.chave] =
            campo.tipo === "date"
                ? { type: Date, required: true }
                : {
                      type: String,
                      required: true,
                      trim: true,
                      maxlength: campo.max,
                  };
    }
    campos[config.codigo].unique = true;
    if (colecao === "secretarios") {
        Object.assign(campos.email, { unique: true, lowercase: true });
        campos.senhaHash = { type: String, required: true, select: false };
    }
    const schema = new mongoose.Schema(campos, {
        collection: colecao,
        timestamps: true,
    });
    modelos[colecao] =
        mongoose.models[colecao] || mongoose.model(colecao, schema);
}
