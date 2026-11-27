export default async function Pagina({ searchParams }) {
    return (
        <>
            {(await searchParams).resultado === "salvo" && (
                <p role="status">Cadastro salvo.</p>
            )}
            <form action="/secretarios/novo">
                <button>Cadastrar secretário</button>
            </form>
        </>
    );
}
