import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paty • 50 Carnavais",
  description: "Convite especial para celebrar os 50 carnavais da Paty.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
