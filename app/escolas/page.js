import Listagem from "../../components/Listagem";

export default function Pagina({ searchParams }) {
    return <Listagem entidade="escolas" searchParams={searchParams} />;
}
