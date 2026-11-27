import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        nome: { type: String, required: true, trim: true, maxlength: 120 },
        id_cadastro: {
            type: String,
            required: true,
            unique: true,
            maxlength: 32,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            maxlength: 200,
        },
        escola: { type: String, required: true, maxlength: 120 },
        senhaHash: { type: String, required: true, select: false },
    },
    { collection: "secretarios", timestamps: true },
);

export const Secretario =
    mongoose.models.secretarios || mongoose.model("secretarios", schema);
