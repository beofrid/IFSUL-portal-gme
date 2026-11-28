import { Login } from "../../components/FormCadastro";
import { Marca } from "../../components/Moldura";
export default function PaginaLogin() {
    return (
        <main className="acesso">
            <section className="cartao login">
                <Marca />
                <h1>Acesso ao portal</h1>
                <p className="text-secondary mb-4">
                    Entre com seu e-mail e senha.
                </p>
                <Login />

                <div className="m-3">
                    <p className="fw-bold mb-0">Aluno: Bruno Medeiros Dias</p>
                    <p className="fw-bold ">Polo: São Francisco de Paula</p>
                    <p className=" fw-bold small mb-0">Logins:</p>
                    <p className="small mb-0">adm@email.com</p>
                    <p className="small mb-0">secretario1@email.com (visualiza todos e só cadastra aluno)</p>
                    <p className="small mb-0">Senha: 12345678</p>

                </div>
            </section>
            
        </main>
    );
}
