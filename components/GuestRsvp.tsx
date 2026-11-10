"use client";
import {useState} from "react";
import {Check,ChevronDown,Ruler,Save} from "lucide-react";
import {formatCentimeters,isModel,modelNames,models,sizes,type Model} from "@/data/site";
import {ShirtDrawing} from "./ShirtDrawing";
import type {Invitation,Attendance} from "@/lib/types";
type Draft={id:string;attendance:Attendance;model:Model|null;size:string|null};
export function GuestRsvp({invitation}:{invitation:Invitation}){
  const [entries,setEntries]=useState<Draft[]>(()=>invitation.people.map(p=>({id:p.id,attendance:p.attendance,model:p.model,size:p.size})));
  const [busy,setBusy]=useState(false);
  const [saved,setSaved]=useState(false);
  const [msg,setMsg]=useState("");
  const update=(id:string,fields:Partial<Draft>)=>{setEntries(prev=>prev.map(p=>p.id===id?{...p,...fields}:p));setSaved(false);setMsg("");};
  const ready=entries.every(p=>p.attendance==="no" || (p.attendance==="yes"&&p.model&&p.size));
  async function save(){
    if(!ready||busy)return;
    setBusy(true);setMsg("");
    try{
      const res=await fetch(`/api/convites/${invitation.code}/respostas`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({responses:entries})});
      const data=await res.json().catch(()=>({error:`Erro de comunicação com o servidor (${res.status}).`}));
      if(!res.ok)throw new Error(data.error||"Não foi possível salvar.");
      setSaved(true);setMsg("Respostas confirmadas! Você pode abrir este convite novamente para conferir ou alterar.");
    }catch(error){setSaved(false);setMsg(error instanceof Error?error.message:"Erro ao salvar.");}
    finally{setBusy(false);}
  }
  return <div className="guest-form">
    {invitation.people.map((person,index)=>{
      const row=entries.find(e=>e.id===person.id);
      if(!row)return null;
      return <section key={person.id} className="person-card" aria-labelledby={`person-${person.id}`}>
        <div className="person-card-head"><span className="person-index">{String(index+1).padStart(2,"0")}</span><h3 id={`person-${person.id}`}>{person.name}</h3></div>
        <p className="form-question">Você vai à festa?</p>
        <div className="attendance-pills" role="group" aria-label={`Presença de ${person.name}`}>
          <button type="button" aria-pressed={row.attendance==="yes"} className={row.attendance==="yes"?"is-selected":""} onClick={()=>update(person.id,{attendance:"yes"})}>{row.attendance==="yes"&&<Check size={16}/>} Sim, vou!</button>
          <button type="button" aria-pressed={row.attendance==="no"} className={row.attendance==="no"?"is-selected":""} onClick={()=>update(person.id,{attendance:"no",model:null,size:null})}>Não poderei ir</button>
        </div>
        {row.attendance==="yes"&&<div className="shirt-choices">
          <p className="form-question">1. Escolha o modelo do abadá</p>
          <div className="shirt-grid" role="group" aria-label={`Modelo de ${person.name}`}>{models.map(model=><button key={model} type="button" className={`shirt-choice ${row.model===model?"is-selected":""}`} aria-pressed={row.model===model} onClick={()=>update(person.id,{model,size:row.model===model?row.size:null})}><span className="shirt-pic"><ShirtDrawing model={model}/></span><span>{modelNames[model]}</span>{row.model===model&&<Check className="shirt-check" size={16}/>}</button>)}</div>
          {row.model&&<><p className="form-question size-question">2. Escolha o tamanho</p>
            <div className="size-pills" role="group" aria-label={`Tamanho de ${person.name}`}>{sizes[row.model].map(s=><button key={s.code} type="button" aria-pressed={row.size===s.code} className={row.size===s.code?"is-selected":""} onClick={()=>update(person.id,{size:s.code})}>{s.code}</button>)}</div>
            {row.size&&<p className="size-selection"><Check size={14}/> {modelNames[row.model]} — {row.size} selecionado</p>}
            <details className="measure-guide"><summary><Ruler size={16}/> Como escolher o tamanho? <ChevronDown className="guide-chevron" size={16}/></summary><div className="measure-body"><p>Use uma camiseta que já veste bem. Coloque-a esticada em uma mesa e meça <strong>de axila a axila</strong> (largura) e <strong>do ombro até a barra</strong> (comprimento).</p><div className="measure-sketch"><ShirtDrawing model={row.model}/><span className="measure-line measure-line-width">↔ largura</span><span className="measure-line measure-line-height">↕ comprimento</span></div><table><thead><tr><th>Tamanho</th><th>Comprimento</th><th>Largura</th></tr></thead><tbody>{sizes[row.model].map(s=><tr key={s.code}><td>{s.code}</td><td>{formatCentimeters(s.length)} cm</td><td>{formatCentimeters(s.width)} cm</td></tr>)}</tbody></table><small>Medidas aproximadas do abadá. Em caso de dúvida entre dois tamanhos, considere o maior para um caimento mais folgado.</small></div></details>
          </>}
        </div>}
        {row.attendance==="no"&&<p className="decline-note">Sua ausência será registrada ao confirmar as respostas.</p>}
      </section>;
    })}
    <div className="rsvp-actions"><button type="button" className="btn btn-rose save-rsvp" disabled={!ready||busy} onClick={save}><Save size={17}/>{busy?"Salvando...":saved?"Salvar alterações":"Confirmar respostas"}</button>{!ready&&<p>Preencha a resposta e, se for participar, o modelo e o tamanho de todas as pessoas.</p>}{msg&&<p role="status" className={`form-feedback ${saved?"ok":"error"}`}>{msg}</p>}<small>Você poderá atualizar as escolhas acessando novamente o mesmo convite.</small></div>
  </div>;
}
