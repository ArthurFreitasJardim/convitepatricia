"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Ruler, X } from "lucide-react";
import { formatMeasure, tamanhos, type SizeOption } from "@/data/site";
import { ShirtDrawing } from "./ShirtDrawing";

type Modelo = keyof typeof tamanhos;

const modelos: Array<{ id: Modelo; label: string; description: string }> = [
  { id: "tradicional", label: "Tradicional", description: "Corte reto" },
  { id: "babyLook", label: "Baby Look", description: "Mais ajustado" },
  { id: "infantil", label: "Infantil", description: "Para crianças" },
];

function formatNumber(value: number) {
  return String(value).replace(".", ",");
}

export function AbadaSelector() {
  const [modelo, setModelo] = useState<Modelo>("tradicional");
  const [tamanho, setTamanho] = useState<string>("");
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [resumoAberto, setResumoAberto] = useState(false);
  const [larguraInformada, setLarguraInformada] = useState("");
  const [comprimentoInformado, setComprimentoInformado] = useState("");
  const sizes = tamanhos[modelo];
  const selecionado = sizes.find((size) => size.tamanho === tamanho);

  const sugestao = useMemo<SizeOption | null>(() => {
    const largura = Number(larguraInformada.replace(",", "."));
    const altura = Number(comprimentoInformado.replace(",", "."));
    if (!largura || !altura || largura < 15 || largura > 100 || altura < 20 || altura > 120) return null;
    const pontuados = [...sizes].sort((a, b) => {
      // Comparação proporcional: não presume que tamanhos de modelos diferentes equivalem.
      const score = (size: SizeOption) =>
        Math.pow((size.largura - largura) / largura, 2) +
        Math.pow((size.altura - altura) / altura, 2);
      return score(a) - score(b);
    });
    return pontuados[0];
  }, [sizes, larguraInformada, comprimentoInformado]);

  function changeModel(id: Modelo) {
    setModelo(id);
    setTamanho("");
    setResumoAberto(false);
    setLarguraInformada("");
    setComprimentoInformado("");
  }

  return (
    <div className="pick-panel">
      <div className="pick-step">
        <p className="step-label"><span>01</span> Qual modelo você prefere?</p>
        <div className="model-grid" role="group" aria-label="Modelo do abadá">
          {modelos.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`model-option${modelo === item.id ? " is-active" : ""}`}
              aria-pressed={modelo === item.id}
              onClick={() => changeModel(item.id)}
            >
              {modelo === item.id && <span className="selected-dot" aria-label="Selecionado"><Check size={13} /></span>}
              <ShirtDrawing modelo={item.id} className="model-shirt" />
              <span className="model-name">{item.label}</span>
              <span className="model-description">{item.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pick-step size-pick-step">
        <p className="step-label"><span>02</span> E qual é o seu tamanho?</p>
        <div className="size-options" role="group" aria-label="Tamanho do abadá">
          {sizes.map((size) => (
            <button
              key={size.tamanho}
              type="button"
              aria-pressed={tamanho === size.tamanho}
              className={`size-option${tamanho === size.tamanho ? " is-active" : ""}`}
              onClick={() => { setTamanho(size.tamanho); setResumoAberto(false); }}
            >
              {size.tamanho}
            </button>
          ))}
        </div>
        {selecionado ? (
          <p className="size-hint selected-hint"><Check size={15} /> {selecionado.tamanho}: {formatNumber(selecionado.largura)} cm de largura × {formatNumber(selecionado.altura)} cm de comprimento{modelo === "tradicional" && selecionado.tamanho === "4G" ? " · Consulte disponibilidade de cores." : ""}</p>
        ) : (
          <p className="size-hint">Escolha um tamanho acima para continuar.</p>
        )}
      </div>

      <div className="size-guide">
        <button
          className="size-guide-trigger"
          type="button"
          aria-expanded={guiaAberto}
          onClick={() => setGuiaAberto(!guiaAberto)}
        >
          <span><Ruler size={19} strokeWidth={1.6} /> Não sabe seu tamanho? <u>Veja como medir</u></span>
          <ChevronDown size={17} className={guiaAberto ? "chevron-up" : ""} />
        </button>
        {guiaAberto && (
          <div className="size-guide-body">
            <p className="guide-intro">A maneira mais simples é comparar com uma camiseta que já veste bem em você.</p>
            <div className="measure-steps">
              <div className="measure-diagram" aria-label="Diagrama mostrando largura horizontal e comprimento vertical da camiseta">
                <ShirtDrawing modelo={modelo} className="guide-shirt" />
                <svg viewBox="0 0 230 215" className="measure-overlay" aria-hidden="true">
                  <path d="M73 87H164" stroke="#A96572" strokeWidth="1.8" strokeDasharray="4 3" />
                  <path d="m79 82-6 5 6 5m79-10 6 5-6 5" stroke="#A96572" strokeWidth="1.8" fill="none" />
                  <path d="M181 48V186" stroke="#BBA16D" strokeWidth="1.8" strokeDasharray="4 3" />
                  <path d="m176 54 5-6 5 6m-10 126 5 6 5-6" stroke="#BBA16D" strokeWidth="1.8" fill="none" />
                  <text x="115" y="79" fill="#A96572" textAnchor="middle" fontSize="11">largura</text>
                  <text x="193" y="118" fill="#9B845B" fontSize="10" transform="rotate(90 193 118)" textAnchor="middle">comprimento</text>
                </svg>
              </div>
              <div className="measure-instructions">
                <p><b>1.</b> Estenda uma camiseta em uma superfície plana.</p>
                <p><b>2.</b> Meça a <strong>largura</strong> de uma axila à outra.</p>
                <p><b>3.</b> Meça o <strong>comprimento</strong> do ombro até a barra.</p>
                <p className="measure-footnote">As medidas fornecidas são aproximadas e correspondem à peça, não à circunferência do corpo.</p>
              </div>
            </div>
            <div className="measure-compare">
              <p className="guide-subtitle">Quer uma sugestão de tamanho?</p>
              <p className="helper-copy">Informe as medidas da camiseta que você costuma usar.</p>
              <div className="measure-inputs">
                <label> Largura (cm)
                  <input type="text" inputMode="decimal" placeholder="Ex.: 54" value={larguraInformada} onChange={(e) => setLarguraInformada(e.target.value)} />
                </label>
                <label> Comprimento (cm)
                  <input type="text" inputMode="decimal" placeholder="Ex.: 70" value={comprimentoInformado} onChange={(e) => setComprimentoInformado(e.target.value)} />
                </label>
              </div>
              {sugestao && (
                <div className="recommended-size" role="status">
                  <span>Tamanho mais próximo: <strong>{sugestao.tamanho}</strong></span>
                  <button type="button" onClick={() => { setTamanho(sugestao.tamanho); setGuiaAberto(false); setResumoAberto(false); }}>Selecionar {sugestao.tamanho}</button>
                </div>
              )}
              <details className="full-size-table">
                <summary>Ver todas as medidas do modelo</summary>
                <table>
                  <thead><tr><th>Tamanho</th><th>Largura</th><th>Comprimento</th></tr></thead>
                  <tbody>{sizes.map((s) => <tr key={s.tamanho}><td>{s.tamanho}</td><td>{formatNumber(s.largura)} cm</td><td>{formatNumber(s.altura)} cm</td></tr>)}</tbody>
                </table>
              </details>
            </div>
          </div>
        )}
      </div>

      <div className="pick-action">
        <button type="button" className="main-action" disabled={!selecionado} onClick={() => setResumoAberto(true)}>
          Conferir minha escolha <span aria-hidden="true">→</span>
        </button>
        <p className="preview-disclaimer">Seleção demonstrativa. O envio da confirmação será liberado em breve.</p>
      </div>

      {resumoAberto && selecionado && (
        <div className="choice-summary" role="status">
          <button type="button" aria-label="Fechar resumo" onClick={() => setResumoAberto(false)} className="close-summary"><X size={17} /></button>
          <span className="summary-decoration">♡</span>
          <h3>Sua escolha está pronta!</h3>
          <p><strong>{modelos.find((m) => m.id === modelo)?.label} · {selecionado.tamanho}</strong></p>
          <p>{formatMeasure(selecionado)} (comprimento × largura)</p>
          <small>Este é apenas um resumo para visualização; seus dados ainda não foram salvos ou enviados à organização.</small>
        </div>
      )}
    </div>
  );
}
