import { NextResponse } from "next/server";
import {correctOrigin,isAdmin} from "@/lib/admin-session";
import {deleteInvitation} from "@/lib/supabase";
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!correctOrigin(request))return NextResponse.json({error:"Origem inválida."},{status:403});
  if(!(await isAdmin()))return NextResponse.json({error:"Acesso não autorizado."},{status:401});
  const {id}=await params;
  if(!/^[a-f\d-]{36}$/i.test(id))return NextResponse.json({error:"ID inválido."},{status:400});
  try{await deleteInvitation(id);return NextResponse.json({ok:true});}
  catch(error){console.error("Excluir convite:",error);return NextResponse.json({error:"Falha ao excluir convite."},{status:500});}
}
