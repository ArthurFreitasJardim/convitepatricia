-- MIGRAÇÃO V5: preserva os convites e escolhas já salvos na V4.
-- Execute no SQL Editor do projeto Supabase que você já usa.
-- Execute após 001_convites.sql (se for um banco novo).

ALTER TABLE public.invite_groups
  ADD COLUMN IF NOT EXISTS title text;

ALTER TABLE public.invite_groups
  ADD COLUMN IF NOT EXISTS title_search text;

-- Preenche títulos para convites antigos (sem apagar convidados/respostas).
UPDATE public.invite_groups g
SET title = CASE
  WHEN (SELECT count(*) FROM public.invite_people p WHERE p.invitation_id = g.id) > 1
    THEN concat(coalesce((SELECT p.name FROM public.invite_people p
                          WHERE p.invitation_id = g.id ORDER BY p.position LIMIT 1), 'Convidado'), ' e família')
  ELSE coalesce((SELECT p.name FROM public.invite_people p
                 WHERE p.invitation_id = g.id ORDER BY p.position LIMIT 1), 'Convite')
END
WHERE title IS NULL OR btrim(title) = '';

-- Pesquisa básica que ignora acentos mais comuns em português.
UPDATE public.invite_groups
SET title_search = lower(translate(title,
  'ÁÀÂÃÄáàâãäÉÈÊËéèêëÍÌÎÏíìîïÓÒÔÕÖóòôõöÚÙÛÜúùûüÇç',
  'AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCc'
))
WHERE title_search IS NULL OR btrim(title_search) = '';

ALTER TABLE public.invite_groups
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN title_search SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'invite_groups_title_length'
  ) THEN
    ALTER TABLE public.invite_groups
      ADD CONSTRAINT invite_groups_title_length
      CHECK (char_length(btrim(title)) BETWEEN 2 AND 100);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS invite_groups_title_search_idx
  ON public.invite_groups (title_search text_pattern_ops);

-- Mantém RLS. Apenas o backend com a secret key acessa as tabelas.
