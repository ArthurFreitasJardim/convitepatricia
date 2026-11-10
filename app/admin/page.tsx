import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-session";
import { allInvitations } from "@/lib/supabase";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata:Metadata = { robots:{index:false,follow:false},title:"Painel da festa | Paty"};
export default async function Page() {
  if (!(await isAdmin())) return <AdminLogin/>;
  const list = await allInvitations();
  return <AdminDashboard initial={list}/>;
}
