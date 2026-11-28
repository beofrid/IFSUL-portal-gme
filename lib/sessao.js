import {
    createHmac,
    randomBytes,
    scrypt as derivar,
    timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { conectar, modelos } from "./banco";

const scrypt = promisify(derivar);
const duracao = 8 * 60 * 60;
function assinatura(texto) {
    const segredo = process.env.SESSION_SECRET;
    if (!segredo || segredo.length < 32)
        throw new Error(
            "Configure SESSION_SECRET com pelo menos 32 caracteres.",
        );
    return createHmac("sha256", segredo).update(texto).digest("hex");
}

export function iguais(a, b) {
    const x = Buffer.from(a),
        y = Buffer.from(b);
    return x.length === y.length && timingSafeEqual(x, y);
}

export async function gerarHash(senha, sal = randomBytes(16).toString("hex")) {
    const hash = await scrypt(senha, sal, 64);
    return sal + "." + hash.toString("hex");
}

export async function iniciar(id) {
    const texto = id + "." + (Math.floor(Date.now() / 1000) + duracao);
    (await cookies()).set("gme_sessao", texto + "." + assinatura(texto), {
        httpOnly: true,
        sameSite: "lax",
        secure:
            process.env.NODE_ENV === "production" &&
            process.env.COOKIE_SECURE !== "false",
        path: "/",
        maxAge: duracao,
    });
}

export async function exigirAcesso() {
    const valor = (await cookies()).get("gme_sessao")?.value || "";
    const [id, expira, mac] = valor.split(".");
    if (
        !mac ||
        !iguais(mac, assinatura(id + "." + expira)) ||
        Number(expira) <= Date.now() / 1000
    )
        redirect("/login");
    if (id === "admin") return { admin: true, nome: "Administração" };
    await conectar();
    const pessoa = await modelos.secretarios.findById(id).select("nome").lean();
    if (!pessoa) redirect("/login");
    return { admin: false, nome: pessoa.nome };
}
