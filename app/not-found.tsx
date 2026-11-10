import Link from "next/link";
export default function NotFound() {
  return <main className="empty-page"><span className="eyebrow">50 CARNAVAIS</span><h1>Convite não encontrado</h1><p>Confira o link ou pesquise pelo título do convite na página inicial.</p><Link className="btn btn-rose" href="/">Voltar ao convite</Link></main>;
}
