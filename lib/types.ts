import type { Model } from "@/data/site";
export type Attendance = "pending" | "yes" | "no";
export type Person = {
  id: string;
  name: string;
  position: number;
  attendance: Attendance;
  model: Model | null;
  size: string | null;
  updated_at: string | null;
};
export type Invitation = {
  id: string;
  code: string;
  title: string;
  created_at: string;
  people: Person[];
};
export type GuestAnswer = {
  id: string;
  attendance: "yes" | "no";
  model: Model | null;
  size: string | null;
};
export function invitationStatus(people: Person[]) {
  const responded = people.filter(p => p.attendance !== "pending").length;
  if (responded === 0) return "Aguardando";
  if (responded === people.length) return "Respondido";
  return "Parcial";
}
export function normalizeSearch(value: string) {
  return value.trim().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
