import Image from "next/image";
import Link from "next/link";
export function Header(){
  return <header className="site-header">
    <Link className="wordmark" href="/" aria-label="Início — Paty 50 Carnavais">Paty <span>· 50 Carnavais</span></Link>
    <nav aria-label="Menu principal">
      <Link href="/#convite">O convite</Link>
      <Link href="/#local">O local</Link>
      <Link className="nav-confirm" href="/#confirmar">Confirmar presença</Link>
    </nav>
  </header>;
}
export function Footer(){
  return <footer className="site-footer">
    <Image src="/images/signature.png" alt="a vida é hoje" width={1230} height={363} className="footer-signature"/>
    <p>13.02.2027 <span>✦</span> Paty — 50 Carnavais</p>
    <small>Feito com carinho para viver uma noite inesquecível.</small>
  </footer>;
}
