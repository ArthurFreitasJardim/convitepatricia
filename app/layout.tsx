import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Paty | 50 Carnavais",
  description: "Uma festa para celebrar a vida. 13 de fevereiro de 2027, Bellara Recepções, Belo Horizonte.",
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
