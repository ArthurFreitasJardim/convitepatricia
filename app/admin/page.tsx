import Link from "next/link";

const stats = [
  { label: "Convidados", value: "—" },
  { label: "Confirmados", value: "—" },
  { label: "Abadás escolhidos", value: "—" },
  { label: "Pendentes", value: "—" },
];

export default function AdminPage() {
  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <div className="eyebrow rose">PAINEL DA FESTA</div>
            <h1>Paty • 50 Carnavais</h1>
            <p>Esqueleto da área que vai concentrar convidados, confirmações e tamanhos.</p>
          </div>
          <Link href="/" className="secondary-button small">Ver convite</Link>
        </header>

        <section className="admin-stats">
          {stats.map((item) => (
            <article key={item.label}>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <h2>Convidados</h2>
              <p>A lista real será conectada ao banco de dados na próxima fase.</p>
            </div>
            <button type="button" disabled>+ Novo convidado</button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Status</th>
                  <th>Modelo</th>
                  <th>Tamanho</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Exemplo de convidado</td>
                  <td><span className="status-pill">Demonstração</span></td>
                  <td>Tradicional</td>
                  <td>G</td>
                  <td><Link href="/c/demo">Abrir</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
