export const site = {
  titulo: "Paty • 50 Carnavais",
  dia: "13",
  mes: "Fevereiro",
  ano: "2027",
  dataExtenso: "Sábado, 13 de fevereiro de 2027",
  horario: "Horário a confirmar",
  local: "Bellara Recepções",
  endereco: "Av. Portugal, 750 — Santa Amélia, Belo Horizonte — MG",

  maps:
    "https://www.google.com/maps/search/?api=1&query=Bellara%20Recep%C3%A7%C3%B5es%20Av.%20Portugal%20750%20Belo%20Horizonte",

  fotos: [
    {
      src: "https://cdn0.casamentos.com.br/vendor/8568/3_2/1280/jpeg/whatsapp-image-2025-01-28-at-15-00-23-1-1_13_2505-173814047995042.jpeg",
      alt: "Fachada envidraçada e gramado do Bellara Recepções",
    },
    {
      src: "https://cdn0.casamentos.com.br/vendor/8568/3_2/960/jpeg/whatsapp-image-2025-01-28-at-15-00-24_13_2505-173814034993703.jpeg",
      alt: "Vista panorâmica da Lagoa da Pampulha a partir do Bellara",
    },
    {
      src: "https://cdn0.casamentos.com.br/vendor/8568/3_2/960/jpeg/whatsapp-image-2025-01-28-at-15-00-22-1_13_2505-173814035769302.jpeg",
      alt: "Lustre decorativo no salão do Bellara Recepções",
    },
    {
      src: "https://cdn0.casamentos.com.br/vendor/8568/3_2/960/jpeg/whatsapp-image-2025-11-04-at-14-18-06-2_13_448568-176227673661825.jpeg",
      alt: "Salão de festas do Bellara preparado com mesas e arranjos de flores",
    },
    {
      src: "https://cdn0.casamentos.com.br/vendor/8568/3_2/960/jpeg/whatsapp-image-2025-08-27-at-11-25-05_13_448568-176227643135435.jpeg",
      alt: "Pôr do sol visto da área externa do Bellara",
    },
    {
      src: "https://cdn0.casamentos.com.br/vendor/8568/3_2/960/jpeg/whatsapp-image-2025-11-04-at-14-18-07-1_13_448568-176227674343745.jpeg",
      alt: "Pista de dança iluminada do Bellara Recepções",
    },
  ],
};

export const sizes = {
  tradicional: [
    { code: "P", length: 68, width: 52 },
    { code: "M", length: 70, width: 54 },
    { code: "G", length: 73, width: 56 },
    { code: "GG", length: 75.5, width: 60 },
    { code: "GGG", length: 78, width: 63 },
    { code: "4G", length: 80, width: 64.5 },
  ],
  babyLook: [
    { code: "P", length: 55, width: 40 },
    { code: "M", length: 57, width: 42 },
    { code: "G", length: 59, width: 44 },
    { code: "GG", length: 61, width: 46 },
  ],
  infantil: [
    { code: "02 anos", length: 39, width: 28 },
    { code: "04 anos", length: 42, width: 32 },
    { code: "06 anos", length: 43, width: 33 },
    { code: "08 anos", length: 45, width: 34 },
    { code: "10 anos", length: 47, width: 35 },
    { code: "12 anos", length: 50, width: 36 },
  ],
} as const;

export type Model = keyof typeof sizes;

export const models: Model[] = [
  "tradicional",
  "babyLook",
  "infantil",
];

export const modelNames: Record<Model, string> = {
  tradicional: "Tradicional",
  babyLook: "Baby Look",
  infantil: "Infantil",
};

export function isModel(value: unknown): value is Model {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(sizes, value)
  );
}

export function isSize(
  model: Model,
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    sizes[model].some((size) => size.code === value)
  );
}

export function formatCentimeters(value: number): string {
  return String(value).replace(".", ",");
}