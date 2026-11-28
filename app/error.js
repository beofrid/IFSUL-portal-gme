"use client";
export default function Erro({ reset }) {
    return (
        <main className="container py-5">
            <section className="cartao p-4">
                <h1>Não foi possível carregar os dados</h1>
                <p>Problema com a conexão com o MongoDB</p>
                <button
                    className="btn btn-primary"
                    onClick={reset}
                >
                    Tentar novamente
                </button>
            </section>
        </main>
    );
}
