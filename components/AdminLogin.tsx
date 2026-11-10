"use client";
import {useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {LockKeyhole,ArrowRight} from "lucide-react";
import Link from "next/link";
export function AdminLogin(){
  const router=useRouter();const[password,setPassword]=useState("");const[busy,setBusy]=useState(false);const[error,setError]=useState("");
  async function submit(e:FormEvent){
    e.preventDefault();setBusy(true);setError("");
    try{
      const response=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});
      const result=await response.json().catch(()=>({error:`API de login indisponível (HTTP ${response.status}). Confira app/api/admin/login/route.ts.`}));
      if(!response.ok)throw new Error(result.error||"Não foi possível entrar.");
      setPassword("");router.refresh();
    }catch(err){setError(err instanceof Error?err.message:"Falha de conexão.");}
    finally{setBusy(false);}
  }
  return <main className="admin-login-page"><div className="admin-login-card"><Link className="admin-back" href="/">← Voltar ao convite</Link><div className="login-lock"><LockKeyhole size={25}/></div><p className="eyebrow">ÁREA PRIVADA</p><h1>Painel da festa</h1><p>Organize os convites e acompanhe cada confirmação de presença.</p><form onSubmit={submit}><label htmlFor="admin-password">Senha de administrador</label><input id="admin-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required placeholder="Digite sua senha"/><button type="submit" className="btn btn-rose" disabled={busy}>{busy?"Entrando...":"Acessar painel"}<ArrowRight size={17}/></button></form>{error&&<p className="form-feedback error" role="alert">{error}</p>}</div></main>;
}
