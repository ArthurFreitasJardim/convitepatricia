import Link from "next/link";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-session";
import { allInvitations } from "@/lib/supabase";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Painel da festa | Paty",
};

function AdminUnavailable({ isSessionError = false }: { isSessionError?: boolean }) {
  return (
    <main className="admin-page">
      <div className="admin-container">
        <section className="dashboard-panel" style={{ maxWidth: 680, margin: "64px auto" }}>
          <p className="eyebrow">PATY · 50 CARNAVAIS</p>
          <h1 style={{ fontSize: 30, marginBottom: 12 }}>Painel temporariamente indisponível</h1>
          <p style={{ lineHeight: 1.7 }}>
            {isSessionError
              ? "Não foi possível validar a sessão administrativa. Confira a configuração do painel na Vercel."
              : "Não foi possível carregar a lista de convites. Confira as variáveis do Supabase e se as migrações 001 e 002 foram executadas."}
          </p>
          <p style={{ lineHeight: 1.7 }}>
            O erro técnico foi registrado nos <strong>Runtime Logs</strong> da Vercel,
            na rota <code>/admin</code>.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
            <Link className="btn btn-rose" href="/admin">Tentar novamente</Link>
            <Link className="btn btn-outline" href="/">Voltar ao convite</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default async function AdminPage() {
  let authenticated: boolean;

  try {
    authenticated = await isAdmin();
  } catch (error) {
    console.error("[admin/session] Falha ao validar sessão:", error);
    return <AdminUnavailable isSessionError />;
  }

  if (!authenticated) return <AdminLogin />;

  try {
    const invitations = await allInvitations();
    return <AdminDashboard initial={invitations} />;
  } catch (error) {
    console.error("[admin/supabase] Falha ao listar convites:", error);
    return <AdminUnavailable />;
  }
}
