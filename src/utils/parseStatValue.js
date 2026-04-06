/**
 * Estrae numero iniziale e suffisso da stringhe tipo "1847 cm", "24", "5 t", "5 吨".
 */
export function parseStatValueText(s) {
  const str = String(s).trim();
  const m = str.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (!m) return { target: 0, suffix: str };
  const target = parseFloat(m[1].replace(',', '.'));
  const rest = m[2].trim();
  const suffix = rest ? (rest.startsWith(' ') ? rest : ` ${rest}`) : '';
  return {
    target: Number.isFinite(target) ? target : 0,
    suffix,
  };
}
