import { NextResponse } from "next/server";
import {correctOrigin} from "@/lib/admin-session";
import {getInvitation,saveGuestAnswers} from "@/lib/supabase";
import {isModel,isSize} from "@/data/site";
import type { GuestAnswer } from "@/lib/types";
export async function POST(request:Request,{params}:{params:Promise<{codigo:string}>}){
  if(!correctOrigin(request))return NextResponse.json({error:"Origem inválida."},{status:403});
  const {codigo}=await params;
  if(!/^[a-f0-9]{40}$/.test(codigo))return NextResponse.json({error:"Convite inválido."},{status:404});
  const body=await request.json().catch(()=>null);
  const entries:unknown=body?.responses;
  if(!Array.isArray(entries)||entries.length<1||entries.length>20)return NextResponse.json({error:"Respostas inválidas."},{status:400});
  try{
    const group=await getInvitation(codigo);
    if(!group)return NextResponse.json({error:"Convite não encontrado."},{status:404});
    if(group.people.length!==entries.length)return NextResponse.json({error:"Responda por todas as pessoas do convite."},{status:400});
    const available=new Set(group.people.map(p=>p.id));
    const seen=new Set<string>();
    const responses:GuestAnswer[]=[];
    for(const e of entries){
      if(!e||typeof e!=="object"||typeof e.id!=="string"||!available.has(e.id)||seen.has(e.id))return NextResponse.json({error:"Pessoa inválida ou duplicada."},{status:400});
      seen.add(e.id);
      if(e.attendance==="no")responses.push({id:e.id,attendance:"no",model:null,size:null});
      else if(e.attendance==="yes"&&isModel(e.model)&&isSize(e.model,e.size))responses.push({id:e.id,attendance:"yes",model:e.model,size:e.size});
      else return NextResponse.json({error:"Defina a presença, modelo e tamanho de cada pessoa."},{status:400});
    }
    await saveGuestAnswers(codigo,responses);
    return NextResponse.json({ok:true});
  }catch(error){console.error("Salvar RSVP:",error);return NextResponse.json({error:"Não foi possível salvar. Tente novamente."},{status:500});}
}
