import Image from "next/image";
import { AbadaSelector } from "./AbadaSelector";
import { siteConfig } from "@/data/site";

type InvitePageProps = { convidado?: string; personalized?: boolean };

export function InvitePage({ convidado, personalized = false }: InvitePageProps) {
  return (
    <main className="invitation-page">
      <section className="invite-cover" aria-labelledby="cover-heading">
        <div className="cover-texture" aria-hidden="true" />
        <div className="cover-inner">
          <div className="cover-topline"><span></span> VOCÊ ESTÁ CONVIDADO(A) <span></span></div>
          <Image
            src="/images/logo-paty-nitido.png"
            alt="Paty — 50 Carnavais — a vida é hoje"
            width={1517}
            height={1210}
            className="cover-logo"
            priority
            sizes="(max-width: 720px) 86vw, 570px"
          />
          <h1 id="cover-heading" className="visually-hidden">Convite para os 50 carnavais da Paty</h1>
          <p className="cover-greeting">
            {personalized && convidado ? <>Um convite especial para <strong>{convidado}</strong></> : "Um convite especial para você"}
          </p>
          <p className="cover-date"><span>13</span><span className="cover-date-detail">FEVEREIRO <i>•</i> 2027 <small>SÁBADO</small></span></p>
          <a className="cover-link" href="#convite">Abrir meu convite <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <div className="paper-content" id="convite">
        <section className="invitation-message" aria-labelledby="message-heading">
          <div className="small-diamond" aria-hidden="true">✧</div>
          <h2 id="message-heading"><Image src="/images/headline-celebrar.png" width={1300} height={289} alt="Vem celebrar comigo" className="script-heading celebrate-heading" /></h2>
          <p>
            A vida é feita de encontros, memórias e pessoas especiais.
            Quero você comigo para celebrar meus <strong>50 carnavais!</strong>
          </p>
          <div className="when-line" aria-label="Data e informações do evento">
            <div className="date-side">SÁBADO</div>
            <div className="date-center">13</div>
            <div className="date-side">FEV<br />2027</div>
          </div>
          <p className="pending-info">Horário e local serão informados em breve.</p>
        </section>

        <div className="ornament" aria-hidden="true"><span></span><b>♡</b><span></span></div>

        <section id="abada" className="abada-area" aria-labelledby="abada-heading">
          <p className="section-eyebrow">UM DETALHE ESPECIAL DA FESTA</p>
          <h2 id="abada-heading"><Image src="/images/headline-abada.png" width={1300} height={217} alt="Escolha seu abadá" className="script-heading abada-heading" /></h2>
          <p className="abada-intro">Escolha o modelo e o tamanho que você vai usar. É simples e rapidinho!</p>
          <AbadaSelector />
        </section>

        <footer className="invite-footer">
          <div className="ornament small" aria-hidden="true"><span></span><b>✦</b><span></span></div>
          <p>Com carinho, Paty</p>
          <Image src="/images/signature.png" alt="a vida é hoje" width={1230} height={363} className="footer-signature" />
          <small>{siteConfig.dataCurta} · 50 Carnavais</small>
        </footer>
      </div>
    </main>
  );
}
