import Image from "next/image";
import {CalendarDays,MapPin,ArrowLeft} from "lucide-react";
import Link from "next/link";
import {site} from "@/data/site";
import type {Invitation} from "@/lib/types";
import {GuestRsvp} from "./GuestRsvp";
export function InvitationPage({invitation}:{invitation:Invitation}){
  return <main className="guest-page">
    <div className="guest-top"><Link href="/"><ArrowLeft size={17}/> Voltar para o site</Link><span>13 · 02 · 2027</span></div>
    <div className="guest-hero">
      <Image src="/images/logo-paty-nitido.png" alt="Paty — 50 Carnavais — a vida é hoje" width={1517} height={1210} className="guest-logo" priority/>
      <p className="eyebrow">SEU CONVITE ESPECIAL</p>
      <h1>{invitation.title}</h1>
      <p>Estamos contando com você para celebrar essa noite tão especial!</p>
      <div className="guest-info"><span><CalendarDays size={16}/>{site.dataExtenso}</span><span><MapPin size={16}/>{site.local}</span></div>
    </div>
    <div className="guest-form-section"><div className="small-divider"><span/>♡<span/></div><p className="eyebrow">CONFIRMAÇÃO DE PRESENÇA</p><h2 className="script-title">Vai celebrar comigo?</h2><p>Confirme quem vai participar e escolha o modelo e o tamanho de cada abadá.</p><GuestRsvp invitation={invitation}/></div>
    <div className="guest-bottom"><a href={site.maps} target="_blank" rel="noreferrer">Ver localização do Bellara ↗</a><p>Com carinho, Paty ♡</p></div>
  </main>;
}
