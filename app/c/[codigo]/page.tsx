import { InvitePage } from "@/components/InvitePage";

type PageProps = {
  params: Promise<{ codigo: string }>;
};

export default async function ConvitePersonalizado({ params }: PageProps) {
  const { codigo } = await params;

  // Esqueleto: na próxima fase o código será buscado no banco de dados.
  // Por enquanto mantemos uma rota demonstrativa para validar o fluxo visual.
  const convidado = codigo.toLowerCase() === "demo" ? "Convidado especial" : "Convidado especial";

  return <InvitePage convidado={convidado} personalized />;
}
