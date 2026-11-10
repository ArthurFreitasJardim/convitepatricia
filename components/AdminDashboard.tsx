"use client";
import {useMemo,useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {Copy,Share2,Plus,LogOut,ExternalLink,X,ChevronDown,Trash2,Users,CheckCircle2,Clock,Shirt,RefreshCw, Search} from "lucide-react";
import type {Invitation} from "@/lib/types";
import {invitationStatus} from "@/lib/types";
import {modelNames,models,sizes,type Model} from "@/data/site";
export function AdminDashboard({initial}:{initial:Invitation[]}){
  const router=useRouter();
  const [showModal,setShowModal]=useState(false);
  const [title,setTitle]=useState("");const[names,setNames]=useState<string[]>([""]);
  const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");const [newCode,setNewCode]=useState("");const [filter,setFilter]=useState("");
  const [opened,setOpened]=useState<string|null>(null);
  const filtered=initial.filter(g=>g.title.toLocaleLowerCase("pt-BR").includes(filter.toLocaleLowerCase("pt-BR")));
  const stats=useMemo(()=>{
    const people=initial.flatMap(group=>group.people);
    const yes=people.filter(p=>p.attendance==="yes");
    const counts={} as Record<Model,Record<string,number>>;
    for(const model of models){counts[model]={};for(const s of sizes[model]) counts[model][s.code]=yes.filter(p=>p.model===model&&p.size===s.code).length;}
    return {people:people.length,yes:yes.length,no:people.filter(p=>p.attendance==="no").length,pending:people.filter(p=>p.attendance==="pending").length,counts};
  },[initial]);
  const urlFor=(code:string)=>`${window.location.origin}/c/${code}`;
  async function copy(code:string){
    try{await navigator.clipboard.writeText(urlFor(code));setMessage("Link copiado. Pode enviar pelo WhatsApp!");}
    catch{setMessage(`Link: ${urlFor(code)}`);}
  }
  async function share(code:string){
    if(navigator.share){try{await navigator.share({title:"Paty — 50 Carnavais",text:"Seu convite para os 50 carnavais da Paty ♡",url:urlFor(code)});return;}catch(e){if(e instanceof DOMException&&e.name==="AbortError")return;}}
    await copy(code);
  }
  function adjustCount(n:number){setNames(prev=>Array.from({length:Math.min(20,Math.max(1,n))},(_,i)=>prev[i]??""));}
  function clearForm(){setShowModal(false);setTitle("");setNames([""]);}
  async function create(e:FormEvent){
    e.preventDefault();setBusy(true);setMessage("");
    try{
      const res=await fetch("/api/admin/invitations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,names})});
      const result=await res.json().catch(()=>({error:`API indisponível (HTTP ${res.status}).`}));
      if(!res.ok)throw new Error(result.error||"Erro ao criar o convite.");
      setNewCode(result.invitation.code);setOpened(result.invitation.id);clearForm();setMessage(`Convite “${result.invitation.title}” criado com sucesso!`);router.refresh();
    }catch(error){setMessage(error instanceof Error?error.message:"Erro ao criar convite.");}
    finally{setBusy(false);}
  }
  async function remove(group:Invitation){
    if(!confirm(`Excluir permanentemente “${group.title}” e todas as respostas desse convite?`))return;
    setBusy(true);setMessage("");
    try{const res=await fetch(`/api/admin/invitations/${group.id}`,{method:"DELETE"});const data=await res.json().catch(()=>({error:"Erro de comunicação com o servidor."}));if(!res.ok)throw new Error(data.error||"Falha ao excluir.");setMessage("Convite excluído.");router.refresh();}
    catch(err){setMessage(err instanceof Error?err.message:"Falha ao excluir.");}
    finally{setBusy(false);}
  }
  async function logout(){await fetch("/api/admin/logout",{method:"POST"});router.refresh();}
  const cards=[{label:"Convites criados",value:initial.length,icon:<Users size={20}/>},{label:"Pessoas convidadas",value:stats.people,icon:<Users size={20}/>},{label:"Confirmadas",value:stats.yes,icon:<CheckCircle2 size={20}/>},{label:"Aguardando resposta",value:stats.pending,icon:<Clock size={20}/>},{label:"Abadás",value:stats.yes,icon:<Shirt size={20}/>}];
  return <main className="admin-page"><div className="admin-container">
    <header className="admin-head"><div><p className="eyebrow">PATY · 50 CARNAVAIS</p><h1>Painel da festa</h1><p>Convites, pessoas e abadás — tudo em um só lugar.</p></div><div className="admin-head-actions"><button type="button" className="admin-simple" onClick={()=>router.refresh()}><RefreshCw size={15}/> Atualizar</button><button type="button" className="admin-simple" onClick={logout}><LogOut size={16}/> Sair</button></div></header>
    <div className="admin-metrics">{cards.map(card=><article className="metric" key={card.label}><span>{card.icon}{card.label}</span><strong>{card.value}</strong></article>)}</div>
    <section className="dashboard-panel"><div className="dashboard-section-head"><div><p className="eyebrow">ORGANIZAÇÃO</p><h2>Lista de convites</h2><p>Clique em um título para ver as respostas de cada pessoa.</p></div><button className="btn btn-rose admin-create" onClick={()=>{setMessage("");setShowModal(true);}}><Plus size={17}/> Criar novo convite</button></div>
    {message&&<p className="admin-alert" role="status">{message}</p>}
    {newCode&&<div className="last-created"><span>Último convite criado</span><button type="button" onClick={()=>copy(newCode)}><Copy size={15}/> Copiar link</button><button type="button" onClick={()=>share(newCode)}><Share2 size={15}/> Compartilhar</button></div>}
    <label className="admin-filter"><Search size={18}/><input placeholder="Buscar título do convite..." value={filter} onChange={e=>setFilter(e.target.value)}/></label>
    {initial.length===0&&<p className="admin-blank">Nenhum convite criado. Clique em <strong>Criar novo convite</strong> para começar.</p>}
    {initial.length>0&&filtered.length===0&&<p className="admin-blank">Nenhum convite com esse título.</p>}
    <div className="admin-invites">{filtered.map(group=>{
      const isOpen=opened===group.id;const confirmed=group.people.filter(p=>p.attendance==="yes").length;
      return <article className="admin-invite" key={group.id}>
        <button className="admin-invite-heading" type="button" aria-expanded={isOpen} onClick={()=>setOpened(isOpen?null:group.id)}><span className="invite-icon"><Users size={19}/></span><span className="admin-invite-label"><strong>{group.title}</strong><small>{group.people.length} {group.people.length===1?"pessoa":"pessoas"} · {invitationStatus(group.people)} · {confirmed} {confirmed===1?"confirmada":"confirmadas"}</small></span><ChevronDown className={isOpen?"rotated":""} size={20}/></button>
        {isOpen&&<div className="admin-invite-expanded"><div className="table-scroll"><table><thead><tr><th>Convidado</th><th>Presença</th><th>Modelo</th><th>Tamanho</th></tr></thead><tbody>{group.people.map(p=><tr key={p.id}><td>{p.name}</td><td><span className={`status status-${p.attendance}`}>{p.attendance==="yes"?"Confirmado":p.attendance==="no"?"Não vai":"Pendente"}</span></td><td>{p.model?modelNames[p.model]:"—"}</td><td>{p.size??"—"}</td></tr>)}</tbody></table></div><div className="admin-invite-controls"><button onClick={()=>share(group.code)}><Share2 size={15}/> Compartilhar</button><button onClick={()=>copy(group.code)}><Copy size={15}/> Copiar link</button><a href={`/c/${group.code}`} target="_blank" rel="noreferrer"><ExternalLink size={15}/> Abrir</a><button className="danger" onClick={()=>remove(group)} disabled={busy}><Trash2 size={15}/> Excluir</button></div></div>}
      </article>;
    })}</div>
    </section>
    <section className="dashboard-panel"><div className="dashboard-section-head"><div><p className="eyebrow">RESUMO GERAL</p><h2>Abadás por tamanho</h2><p>Somente pessoas que confirmaram presença entram na contagem.</p></div><div className="total-pill">{stats.yes} abadás confirmados</div></div><div className="dashboard-sizes">{models.map(model=><article className="model-summary" key={model}><div className="summary-head"><h3>{modelNames[model]}</h3><strong>{Object.values(stats.counts[model]).reduce((a,b)=>a+b,0)}</strong></div><div className="size-bars">{sizes[model].map(s=><div key={s.code} className="summary-row"><span>{s.code}</span><div className="summary-bar"><i style={{width:`${stats.yes?Math.max(0,stats.counts[model][s.code]/stats.yes*100):0}%`}}/></div><strong>{stats.counts[model][s.code]}</strong></div>)}</div></article>)}</div><p className="panel-note">Não vão: {stats.no} · Ainda não responderam: {stats.pending}</p></section>
  </div>
  {showModal&&<div className="dialog-scrim" onMouseDown={e=>{if(e.currentTarget===e.target)clearForm();}}><section role="dialog" aria-modal="true" aria-labelledby="create-title" className="create-dialog"><button className="dialog-close" aria-label="Fechar" onClick={clearForm}><X size={20}/></button><p className="eyebrow">NOVO CONVITE</p><h2 id="create-title">Quem vamos convidar?</h2><p>Crie um título para a busca, por exemplo <strong>“Fernando e família”</strong>. Depois cadastre os nomes dentro dele.</p><form onSubmit={create}><label htmlFor="group-title">Título do convite</label><input id="group-title" placeholder="Ex.: Fernando e família" value={title} onChange={e=>setTitle(e.target.value)} minLength={2} maxLength={100} required/><label htmlFor="people-count">Quantidade de pessoas</label><input id="people-count" type="number" min={1} max={20} value={names.length} onChange={e=>adjustCount(Number(e.target.value)||1)}/><div className="invite-name-list">{names.map((name,i)=><div key={i}><label htmlFor={`person-name-${i}`}>Pessoa {i+1}</label><input id={`person-name-${i}`} placeholder="Nome completo" required maxLength={80} value={name} onChange={e=>setNames(old=>old.map((n,j)=>j===i?e.target.value:n))}/></div>)}</div><button className="btn btn-rose" disabled={busy}>{busy?"Criando...":"Criar e gerar link"} <Plus size={17}/></button></form></section></div>}
  </main>;
}
