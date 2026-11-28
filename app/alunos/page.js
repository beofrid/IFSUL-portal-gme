import Listagem from "../../components/Listagem";

export default function Pagina({ searchParams }) {
    return (
        <Listagem
            entidade="alunos"
            searchParams={searchParams}
        />
    );
}
