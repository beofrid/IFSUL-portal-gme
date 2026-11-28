import Registro from "../../../components/Registro";

export default async function Pagina({ params, searchParams }) {
    const { id } = await params;
    return (
        <Registro
            entidade="secretarios"
            id={id}
            searchParams={searchParams}
        />
    );
}
