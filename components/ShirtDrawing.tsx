type ShirtDrawingProps = {
  modelo: "tradicional" | "babyLook" | "infantil";
  className?: string;
};

/** Silhuetas esquemáticas: representam o corte, não a estampa final do abadá. */
export function ShirtDrawing({ modelo, className = "" }: ShirtDrawingProps) {
  const paths: Record<ShirtDrawingProps["modelo"], string> = {
    tradicional:
      "M38 23 52 16 61 20 Q80 34 99 20 L108 16 122 23 138 53 114 66 108 52 108 136 52 136 52 52 46 66 22 53Z",
    babyLook:
      "M39 23 54 16 62 20 Q80 34 98 20 L106 16 121 23 137 50 115 62 107 50 Q99 83 107 114 L111 136 Q80 143 49 136 L53 114 Q61 83 53 50 L45 62 23 50Z",
    infantil:
      "M45 28 59 22 65 25 Q80 36 95 25 L101 22 115 28 130 55 111 66 106 55 106 132 54 132 54 55 49 66 30 55Z",
  };
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      fill="none"
      role="img"
      aria-label={`Desenho ilustrativo do abadá ${modelo === "tradicional" ? "tradicional" : modelo === "babyLook" ? "baby look" : "infantil"}`}
    >
      <defs>
        <linearGradient id={`shirt-fill-${modelo}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F4E8E6" />
        </linearGradient>
      </defs>
      <path d={paths[modelo]} fill={`url(#shirt-fill-${modelo})`} stroke="#D6C1BE" strokeWidth="2" strokeLinejoin="round" />
      <path d="M61 20Q80 43 99 20" stroke="#E7D5D1" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M80 45V119" stroke="#F0E5E2" strokeWidth="1.5" strokeDasharray="2 6" />
      <path d="M54 130H106" stroke="#E6D7D4" strokeWidth="1.5" />
      <path d="M70 61H90" stroke="#C58D93" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 57V65M86 57V65" stroke="#C58D93" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
