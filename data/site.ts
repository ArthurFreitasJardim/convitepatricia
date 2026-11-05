export const siteConfig = {
  celebrante: "Paty",
  idade: 50,
  tema: "50 Carnavais",
  slogan: "a vida é hoje",
  data: "13 de fevereiro de 2027",
  dataCurta: "13.02.2027",
  diaSemana: "Sábado",
  horario: "Horário em breve",
  local: "Local em breve",
  mensagem:
    "Um encontro feito para celebrar a vida, reunir pessoas queridas e viver uma noite inesquecível.",
};

export type SizeOption = {
  tamanho: string;
  altura: number;
  largura: number;
};

export const tamanhos: Record<"tradicional" | "babyLook" | "infantil", SizeOption[]> = {
  tradicional: [
    { tamanho: "P", altura: 68, largura: 52 },
    { tamanho: "M", altura: 70, largura: 54 },
    { tamanho: "G", altura: 73, largura: 56 },
    { tamanho: "GG", altura: 75.5, largura: 60 },
    { tamanho: "GGG", altura: 78, largura: 63 },
    { tamanho: "4G", altura: 80, largura: 64.5 },
  ],
  babyLook: [
    { tamanho: "P", altura: 55, largura: 40 },
    { tamanho: "M", altura: 57, largura: 42 },
    { tamanho: "G", altura: 59, largura: 44 },
    { tamanho: "GG", altura: 61, largura: 46 },
  ],
  infantil: [
    { tamanho: "02 anos", altura: 39, largura: 28 },
    { tamanho: "04 anos", altura: 42, largura: 32 },
    { tamanho: "06 anos", altura: 43, largura: 33 },
    { tamanho: "08 anos", altura: 45, largura: 34 },
    { tamanho: "10 anos", altura: 47, largura: 35 },
    { tamanho: "12 anos", altura: 50, largura: 36 },
  ],
};

export function formatMeasure(size: SizeOption) {
  return `${String(size.altura).replace(".", ",")} × ${String(size.largura).replace(".", ",")} cm`;
}
