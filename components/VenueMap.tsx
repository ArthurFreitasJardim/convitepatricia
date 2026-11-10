
import { MapPin } from "lucide-react";

import { site } from "@/data/site";
import styles from "./VenueMap.module.css";

// Versão incorporada do Google Maps que não exige chave de API.
// Usamos o nome e o endereço já definidos em data/site.ts.
const query = encodeURIComponent(`${site.local}, ${site.endereco}`);
const embedUrl = `https://maps.google.com/maps?q=${query}&z=16&output=embed`;

export function VenueMap() {
  return (
    <div className={styles.container} aria-label="Localização da festa">
      <div className={styles.frame}>
        <iframe
          title="Mapa do Bellara Recepções — Avenida Portugal, 750, Belo Horizonte"
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <p className={styles.caption}>
        <MapPin size={15} strokeWidth={1.6} aria-hidden="true" />
        <span>
          Explore a localização no mapa ou use <strong>Como chegar</strong> para
          abrir a rota no celular.
        </span>
      </p>
    </div>
  );
}
