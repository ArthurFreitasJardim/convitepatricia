import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";

import { site } from "@/data/site";
import { Footer, Header } from "./SiteChrome";
import { SearchInvitation } from "./SearchInvitation";
import { VenueMap } from "./VenueMap";
import { VenueCarousel } from "./VenueCarousel";
import venueStyles from "./VenueCarousel.module.css";

const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent(`${site.local}, ${site.endereco}`);

export function HomePage() {
  return (
    <>
      <Header />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <span className="hero-star star-left" aria-hidden="true">
            ✧
          </span>
          <span className="hero-star star-right" aria-hidden="true">
            ✦
          </span>

          <div className="hero-content">
            <p className="eyebrow">UM CONVITE FEITO COM AMOR</p>

            <h1 id="hero-title" className="sr-only">
              Paty — 50 Carnavais
            </h1>

            <Image
              priority
              src="/images/logo-paty-nitido.png"
              alt="Paty — 50 Carnavais — a vida é hoje"
              width={1517}
              height={1210}
              className="hero-logo"
              sizes="(max-width: 700px) 85vw, 640px"
            />

            <div className="hero-date">
              <span className="hairline" />
              SÁBADO <b>13 · 02 · 2027</b>
              <span className="hairline" />
            </div>

            <a className="btn btn-rose hero-cta" href="#confirmar">
              Confirmar presença <span aria-hidden="true">↗</span>
            </a>

            <a className="hero-scroll" href="#convite">
              Descubra o convite <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className="message-section" id="convite">
          <div className="small-divider">
            <span />✧<span />
          </div>

          <p className="eyebrow">QUERIDOS AMIGOS E FAMILIARES</p>

          <h2 className="script-title">
            A vida merece ser celebrada
          </h2>

          <p className="center-copy">
            São 50 carnavais, muitas histórias e motivos para agradecer.
            E não existe jeito melhor de comemorar do que estar pertinho
            das pessoas que fazem parte da minha vida.
          </p>

          <p className="center-copy highlight-copy">
            Reserve essa data e venha viver esse momento comigo!
          </p>

          <div className="event-info">
            <div>
              <CalendarDays size={21} strokeWidth={1.3} />
              <span>QUANDO</span>
              <strong>{site.dataExtenso}</strong>
              <small>{site.horario}</small>
            </div>

            <div className="event-divider" />

            <div>
              <MapPin size={21} strokeWidth={1.3} />
              <span>ONDE</span>
              <strong>{site.local}</strong>
              <small>Belo Horizonte · MG</small>
            </div>
          </div>
        </section>

        <section className="venue-section" id="local">
          <div className={venueStyles.venueIntro}>
            <p className="eyebrow">O CENÁRIO DA NOSSA FESTA</p>

            <h2 className={venueStyles.venueName}>
              {site.local}
            </h2>

            <div
              className={venueStyles.ornament}
              aria-hidden="true"
            >
              <span /> ✧ <span />
            </div>

            <p className={venueStyles.venueDescription}>
              Um lugar especial para reunir quem a gente ama
              e celebrar a vida.
            </p>
          </div>

          <VenueCarousel photos={site.fotos} />

          <div className="venue-details">
            <div>
              <span className="eyebrow">
                BELLARA RECEPÇÕES
              </span>

              <p>{site.endereco}</p>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Como chegar
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>

          <VenueMap />
        </section>

        <section className="search-section" id="confirmar">
          <div className="small-divider">
            <span />♡<span />
          </div>

          <p className="eyebrow">FALTA POUCO PARA A FESTA</p>

          <h2 className="script-title">
            Confirme sua presença
          </h2>

          <p className="center-copy">
            Procure pelo título do seu convite, como{" "}
            <strong>“Patrícia e família”</strong>.
            Depois é só escolher quem vai e o tamanho do
            abadá de cada pessoa.
          </p>

          <SearchInvitation />

          <p className="search-helper">
            <Heart size={15} />
            Não encontrou seu convite? Fale com quem enviou
            o convite para conferir o nome cadastrado.
          </p>
        </section>

        <section className="closing-message">
          <Sparkles size={18} />

          <p>
            O melhor da vida é viver momentos assim, juntos.
          </p>

          <span>Com carinho, Paty ♡</span>
        </section>
      </main>

      <Footer />
    </>
  );
}