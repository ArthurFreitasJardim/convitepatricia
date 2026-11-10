import { NextResponse } from "next/server";
import { findTitles } from "@/lib/supabase";
import { normalizeSearch } from "@/lib/types";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") || "";
  if (normalizeSearch(q).length < 3 || q.length > 80) return NextResponse.json({items:[]});
  try {
    const items = await findTitles(q);
    return NextResponse.json({items},{headers:{"Cache-Control":"no-store"}});
  } catch (error) {
    console.error("Busca de convites:",error);
    return NextResponse.json({error:"Não foi possível pesquisar agora."},{status:500});
  }
}
