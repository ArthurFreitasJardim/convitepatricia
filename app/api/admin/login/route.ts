import { NextResponse } from "next/server";
import { correctOrigin, startAdmin, verifyPassword } from "@/lib/admin-session";
// Mitigação básica em memória para desenvolvimento/instância única.
// Para produção pública de maior porte, usar rate limit persistente na borda.
const attempts = new Map<string,{tries:number;until:number}>();
export async function POST(request:Request) {
  if (!correctOrigin(request)) return NextResponse.json({error:"Origem inválida."},{status:403});
  const key = (request.headers.get("x-forwarded-for")?.split(",")[0] || "local").trim();
  const now = Date.now();
  const record = attempts.get(key);
  if (record && record.until > now && record.tries >= 5) return NextResponse.json({error:"Muitas tentativas. Tente novamente em 15 minutos."},{status:429});
  const body = await request.json().catch(()=>null);
  if (typeof body?.password !== "string" || body.password.length > 300) return NextResponse.json({error:"Informe uma senha válida."},{status:400});
  try {
    if (!verifyPassword(body.password)) {
      attempts.set(key,{tries:record && record.until > now ? record.tries+1:1,until:now+15*60*1000});
      return NextResponse.json({error:"Senha incorreta."},{status:401});
    }
    attempts.delete(key);
    await startAdmin();
    return NextResponse.json({ok:true});
  } catch(error) {
    console.error("Configuração de login:",error);
    return NextResponse.json({error:"Configuração do painel incompleta. Verifique o .env.local."},{status:500});
  }
}
