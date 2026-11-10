import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationPage } from "@/components/InvitationPage";
import { getInvitation } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {robots:{index:false,follow:false},title:"Meu convite | Paty 50 Carnavais"};
export default async function Page({params}:{params:Promise<{codigo:string}>}) {
  const {codigo} = await params;
  if (!/^[a-f0-9]{40}$/.test(codigo)) notFound();
  const invitation = await getInvitation(codigo);
  if (!invitation) notFound();
  return <InvitationPage invitation={invitation}/>;
}
