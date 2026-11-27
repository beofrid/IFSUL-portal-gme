import { Marca } from '../../components/Moldura';

export default function Login() {
  return (
    <main className="acesso">
      <section className="cartao login">
        <Marca />
        <h1>Acesso ao portal</h1>
        <p className="text-secondary mb-4">Entre com seu e-mail e senha.</p>
        <form action="/" method="get" noValidate>
          <label className="form-label" htmlFor="email">E-mail</label>
          <input id="email" type="email" autoComplete="username" className="form-control mb-3" />
          <label className="form-label" htmlFor="senha">Senha</label>
          <input id="senha" type="password" autoComplete="current-password" className="form-control mb-4" />
          <button className="btn btn-primary w-100">Entrar</button>
        </form>
      </section>
    </main>
  );
}
