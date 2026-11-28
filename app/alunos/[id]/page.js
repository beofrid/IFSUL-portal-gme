import Registro from "../../../components/Registro";

export default async function Pagina({ params, searchParams }) {
    const { id } = await params;
    return (
        <Registro
            entidade="alunos"
            id={id}
            searchParams={searchParams}
        />
    );
}
