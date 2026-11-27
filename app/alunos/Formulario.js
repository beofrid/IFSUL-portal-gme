'use client';
import { useActionState, useState } from 'react';
import { campos } from '../../lib/campos';
import { cadastrar } from './acoes';

export default function Formulario({ escolas }) {
  const [erro, acao, enviando] = useActionState(cadastrar, '');
  const [valores, setValores] = useState({});
  function atualizar(evento) {
    const { name, value } = evento.target;
    setValores(anteriores => ({ ...anteriores, [name]: value }));
  }
  return (
    <form action={acao}>
      {campos.map(campo => (
        <label key={campo.chave}>
          {campo.rotulo}
          {campo.chave === 'escola' ? (
            <select name="escola" required disabled={!escolas.length} value={valores.escola || ''} onChange={atualizar}>
              <option value="">Selecione uma escola</option>
              {escolas.map(escola => (
                <option key={escola.id_escola} value={escola.nome}>{escola.nome} ({escola.id_escola})</option>
              ))}
            </select>
          ) : (
            <input name={campo.chave} type={campo.tipo || 'text'} maxLength={campo.max}
              placeholder={campo.exemplo} required value={valores[campo.chave] || ''} onChange={atualizar} />
          )}
        </label>
      ))}
      {erro && <p role="alert">{erro}</p>}
      <button disabled={enviando || !escolas.length}>{enviando ? 'Salvando…' : 'Salvar aluno'}</button>
    </form>
  );
}
