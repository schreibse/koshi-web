const SUPPORTED = ['es', 'en'] as const;
type Locale = (typeof SUPPORTED)[number];
const FALLBACK: Locale = 'en';

export function preferredLocale(acceptLanguage: string | null): Locale {
  const ranked = (acceptLanguage ?? '')
    .split(',')
    .map((entry) => {
      const [tag, ...params] = entry.trim().toLowerCase().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return {
        language: tag.split('-')[0],
        q: q ? Number(q.trim().slice(2)) : 1,
      };
    })
    .filter(({ q }) => q > 0)
    .sort((a, b) => b.q - a.q);
  const match = ranked.find(({ language }) =>
    (SUPPORTED as readonly string[]).includes(language),
  );
  return (match?.language as Locale) ?? FALLBACK;
}
