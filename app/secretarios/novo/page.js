import FormCadastro from "../../../components/FormCadastro";
import { conectar, Escola } from "../../../lib/banco";

export const dynamic = "force-dynamic";

export default async function NovoSecretario() {
    let escolas = [];
    let aviso = "";
    try {
        await conectar();
        escolas = await Escola.find({}, "nome id_escola -_id")
            .sort({ nome: 1 })
            .lean();
        if (!escolas.length)
            aviso = "Cadastre uma escola antes de cadastrar um secretário.";
    } catch {
        aviso =
            "Não foi possível carregar as escolas. Confira a conexão com o banco.";
    }
    return (
        <>
            <h1>Cadastrar secretário</h1>
            <FormCadastro
                entidade="secretarios"
                escolas={escolas}
                aviso={aviso}
            />
        </>
    );
}
