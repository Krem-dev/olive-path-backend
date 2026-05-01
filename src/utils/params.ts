/**
 * Express 5 typings can widen `req.params.X` / `req.query.X` to
 * `string | string[]`. These helpers narrow them safely.
 */

export function paramInt(value: unknown, fallback = NaN): number {
  if (typeof value !== 'string') return fallback;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}

export function paramStr(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}
