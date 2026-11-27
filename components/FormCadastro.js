'use client';
import { useActionState } from 'react';
import { cadastrarEscola, cadastrarSecretario } from '../app/acoesCadastro';

export default function FormCadastro({ entidade, escolas = [], aviso }) {
  const secretario = entidade === 'secretarios';
  const [erro, acao, enviando] = useActionState(secretario ? cadastrarSecretario : cadastrarEscola, '');
  return (
    <form action={acao} className="cadastro-simples">
      <label>Nome<input name="nome" required maxLength={120} /></label>
      <label>{secretario ? 'Código do cadastro' : 'Código da escola'}
        <input name={secretario ? 'id_cadastro' : 'id_escola'} required maxLength={32} />
      </label>
      {secretario && <>
        <label>E-mail<input name="email" type="email" required maxLength={200} /></label>
        <label>Escola
          <select name="escola" defaultValue="" required disabled={!escolas.length}>
            <option value="" disabled>Selecione uma escola</option>
            {escolas.map(e => <option key={e.id_escola} value={e.nome}>{e.nome} ({e.id_escola})</option>)}
          </select>
        </label>
        {aviso && <p role="status">{aviso}</p>}
        <label>Senha de acesso<input type="password" name="senha" autoComplete="new-password" required minLength={8} maxLength={200} /></label>
      </>}
      {erro && <p role="alert">{erro}</p>}
      <button disabled={enviando || (secretario && !escolas.length)}>{enviando ? 'Salvando…' : 'Salvar'}</button>
    </form>
  );
}
