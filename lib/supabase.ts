import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { normalizeSearch, type GuestAnswer, type Invitation, type Person } from "@/lib/types";
import type { Model, } from "@/data/site";

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Configure SUPABASE_URL e SUPABASE_SECRET_KEY no .env.local.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

type RawPerson = { id: string; name: string; position: number; attendance: string; model: string | null; size: string | null; updated_at: string | null };
type RawGroup = { id: string; code: string; title: string; created_at: string; invite_people: RawPerson[] | null };
const columns = "id,code,title,created_at,invite_people(id,name,position,attendance,model,size,updated_at)";
function mapGroup(g: RawGroup): Invitation {
  return { id: g.id, code: g.code, title: g.title, created_at: g.created_at,
    people: (g.invite_people ?? []).map((p): Person => ({
      id: p.id, name: p.name, position: p.position,
      attendance: p.attendance as Person["attendance"], model: p.model as Model | null,
      size: p.size, updated_at: p.updated_at,
    })).sort((a,b) => a.position - b.position)
  };
}
export async function getInvitation(code: string): Promise<Invitation | null> {
  const { data, error } = await client().from("invite_groups").select(columns).eq("code",code).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapGroup(data as unknown as RawGroup) : null;
}
export async function allInvitations(): Promise<Invitation[]> {
  const all: Invitation[] = [];
  for (let start = 0;;start+=200) {
    const { data, error } = await client().from("invite_groups").select(columns).order("created_at", {ascending:false}).range(start,start+199);
    if (error) throw new Error(error.message);
    const page = (data ?? []) as unknown as RawGroup[];
    all.push(...page.map(mapGroup));
    if (page.length < 200) break;
  }
  return all;
}
export async function findTitles(q: string): Promise<{title:string;code:string}[]> {
  const needle = normalizeSearch(q);
  if (needle.length < 3 || needle.length > 80) return [];
  const { data, error } = await client().from("invite_groups")
    .select("title,code").ilike("title_search",`%${needle}%`).order("title").limit(8);
  if (error) throw new Error(error.message);
  return (data ?? []).map(row => ({ title: row.title as string, code: row.code as string }));
}
export async function newInvitation(title: string, names: string[]): Promise<Invitation> {
  const db = client();
  const code = randomBytes(20).toString("hex");
  const { data, error } = await db.from("invite_groups").insert({
    code, title, title_search: normalizeSearch(title)
  }).select("id").single();
  if (error || !data) throw new Error(error?.message || "Falha ao criar convite.");
  const { error: peopleError } = await db.from("invite_people")
    .insert(names.map((name, position) => ({ invitation_id: data.id, name, position })));
  if (peopleError) {
    await db.from("invite_groups").delete().eq("id",data.id);
    throw new Error(peopleError.message);
  }
  const created = await getInvitation(code);
  if (!created) throw new Error("Convite criado mas não encontrado.");
  return created;
}
export async function saveGuestAnswers(code: string, answers: GuestAnswer[]) {
  const { error } = await client().rpc("save_invitation_responses", {
    p_code: code, p_responses: answers
  });
  if (error) throw new Error(error.message);
}
export async function deleteInvitation(id: string) {
  const { error } = await client().from("invite_groups").delete().eq("id",id);
  if (error) throw new Error(error.message);
}
