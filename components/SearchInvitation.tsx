"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle, Search, Users } from "lucide-react";

type Result = {
  title: string;
  code: string;
};

export function SearchInvitation() {
  const [term, setTerm] = useState("");
  const [items, setItems] = useState<Result[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (term.trim().length < 3) {
      setItems([]);
      setMessage("");
      setBusy(false);
      return;
    }

    const controller = new AbortController();

    const handle = window.setTimeout(async () => {
      setBusy(true);
      setMessage("");

      try {
        const response = await fetch(
          `/api/convites/buscar?q=${encodeURIComponent(term.trim())}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const data = await response.json().catch(() => ({
          error: "A busca não retornou dados válidos.",
        }));

        if (!response.ok) {
          throw new Error(data.error || "Falha na busca.");
        }

        setItems(data.items || []);
      } catch (error) {
        if (controller.signal.aborted) return;

        setItems([]);
        setMessage(
          error instanceof Error
            ? error.message
            : "Não foi possível pesquisar."
        );
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(handle);
      controller.abort();
    };
  }, [term]);

  return (
    <div className="search-card">
      <label htmlFor="invitation-search">
        Nome ou título do convite
      </label>

      <div className="search-input-wrap">
        <Search size={20} strokeWidth={1.7} />

        <input
          id="invitation-search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          autoComplete="off"
          placeholder="Ex.: Patrícia e família"
          maxLength={80}
        />

        {busy && <LoaderCircle className="spin" size={18} />}
      </div>

      <div className="search-results" aria-live="polite">
        {message && (
          <p className="form-error">{message}</p>
        )}

        {!busy &&
          term.trim().length >= 3 &&
          !message &&
          items.length === 0 && (
            <p className="search-empty">
              Nenhum convite encontrado com esse nome.
            </p>
          )}

        {items.map((item) => (
          <Link
            href={`/c/${item.code}`}
            className="search-result"
            key={item.code}
          >
            <span className="search-result-icon">
              <Users size={19} />
            </span>

            <span>
              <strong>{item.title}</strong>
              <small>Selecionar este convite</small>
            </span>

            <ArrowRight size={18} />
          </Link>
        ))}

        {term.trim().length < 3 && (
          <p className="search-hint">
            Digite pelo menos 3 letras para localizar seu convite.
          </p>
        )}
      </div>
    </div>
  );
}