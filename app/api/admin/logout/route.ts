import { NextResponse } from "next/server";
import {correctOrigin,logOutAdmin} from "@/lib/admin-session";
export async function POST(request:Request){
  if(!correctOrigin(request))return NextResponse.json({error:"Origem inválida."},{status:403});
  await logOutAdmin();return NextResponse.json({ok:true});
}
