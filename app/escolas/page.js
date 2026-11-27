export default async function Pagina({ searchParams }) {
  return (
    <>
      {(await searchParams).resultado === 'salvo' && <p role="status">Cadastro salvo.</p>}
      <form action="/escolas/novo"><button>Cadastrar escola</button></form>
    </>
  );
}
