import { conectar, Escola } from "../../lib/banco";
import Formulario from "./Formulario";

export const dynamic = "force-dynamic";

export default async function Alunos({ searchParams }) {
    let escolas = [];
    let aviso = "";
    try {
        await conectar();
        escolas = await Escola.find({}, "nome id_escola -_id")
            .sort({ nome: 1 })
            .lean();
        if (!escolas.length)
            aviso =
                "Cadastre uma escola na coleção escolas para habilitar o envio.";
    } catch {
        aviso =
            "Não foi possível carregar as escolas. Confira a configuração do banco.";
    }
    const salvo = (await searchParams).resultado === "salvo";
    return (
        <>
            <h1>Cadastrar aluno</h1>
            {salvo && <p role="status">Aluno cadastrado.</p>}
            {aviso && <p role="status">{aviso}</p>}
            <Formulario escolas={escolas} />
        </>
    );
}
