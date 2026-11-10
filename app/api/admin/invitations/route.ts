import { NextResponse } from "next/server";
import {correctOrigin,isAdmin} from "@/lib/admin-session";
import {newInvitation} from "@/lib/supabase";
import {normalizeSearch} from "@/lib/types";
export async function POST(request:Request){
  if(!correctOrigin(request))return NextResponse.json({error:"Origem inválida."},{status:403});
  if(!(await isAdmin()))return NextResponse.json({error:"Acesso não autorizado."},{status:401});
  const body=await request.json().catch(()=>null);
  const title=typeof body?.title ==="string"?body.title.trim():"";
  const names:unknown=body?.names;
  if(title.length<2 || title.length>100 || normalizeSearch(title).length<2 || !Array.isArray(names) || names.length<1 || names.length>20 || names.some(n=>typeof n!=="string" || n.trim().length<1 || n.trim().length>80)){
    return NextResponse.json({error:"Informe um título (2–100 caracteres) e de 1 a 20 pessoas."},{status:400});
  }
  try{
    const invitation=await newInvitation(title,names.map((n:string)=>n.trim()));
    return NextResponse.json({invitation},{status:201});
  }catch(error){console.error("Criar convite:",error);return NextResponse.json({error:"Não foi possível criar. Confira se executou a migração 002 do Supabase."},{status:500});}
}
