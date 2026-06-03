const SEM_START = new Date('2026-03-09T00:00:00');
const WEEKS = 16;
const COLORS = [
  '#2D6A4F','#1A3A5C','#7B3F00',
  '#6B2D8B','#B5451B','#1A5C4A'
];

export { SEM_START, WEEKS, COLORS };

export function str(v) {
  return String(v === null || v === undefined ? '' : v).trim();
}

export function weekStart(n) {
  const d = new Date(SEM_START);
  d.setDate(SEM_START.getDate() + (n - 1) * 7);
  return d;
}

export function getWeekN(fecha) {
  const d = new Date(fecha);
  const dia = d.getDay();
  d.setDate(d.getDate() + (dia === 0 ? -6 : 1 - dia));
  d.setHours(0, 0, 0, 0);
  return Math.round((d - SEM_START) / (7 * 864e5)) + 1;
}

export function isPast(n) {
  const v = weekStart(n);
  v.setDate(v.getDate() + 6);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return v < hoy;
}

export function daysTo(f) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.round((new Date(f) - hoy) / 864e5);
}

export function fDate(d) {
  return new Date(d).toLocaleDateString('es-CL', {
    day: 'numeric', month: 'short'
  });
}

export function fDateLong(d) {
  return new Date(d).toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}

export function fHora(d) {
  return new Date(d).toLocaleTimeString('es-CL', {
    hour: '2-digit', minute: '2-digit'
  });
}

export function fRango(n) {
  const l = weekStart(n);
  const v = new Date(l);
  v.setDate(l.getDate() + 4);
  const o = { day: 'numeric', month: 'short' };
  return l.toLocaleDateString('es-CL', o) + ' – ' + v.toLocaleDateString('es-CL', o);
}

export function nivelInfo(c) {
  if (c >= 4) return { ico: '🔴', lbl: 'Crítica',  bg: '#FFD6D6', tc: '#7A1F1F' };
  if (c >= 3) return { ico: '🟠', lbl: 'Alta',     bg: '#FFD8B1', tc: '#7C3300' };
  if (c >= 2) return { ico: '🟡', lbl: 'Moderada', bg: '#FFF3B0', tc: '#7B5E00' };
  if (c >= 1) return { ico: '🟢', lbl: 'Baja',     bg: '#D8F3DC', tc: '#2D6A4F' };
  return       { ico: '⚪', lbl: 'Libre',    bg: '#F0EEE9', tc: '#A09D96' };
}

export function heatClass(n, c) {
  if (isPast(n)) return 'cp';
  const cls = ['c0','c1','c2','c3','c4'];
  return cls[Math.min(c, 4)];
}

export function badge(days) {
  if (days < 0)   return { txt: 'Pasada',  bg: '#F0EEE9', tc: '#A09D96' };
  if (days === 0) return { txt: '¡Hoy!',   bg: '#FFD6D6', tc: '#7A1F1F' };
  if (days <= 3)  return { txt: days+'d',  bg: '#FFD6D6', tc: '#7A1F1F' };
  if (days <= 7)  return { txt: days+'d',  bg: '#FFD8B1', tc: '#7C3300' };
  if (days <= 14) return { txt: days+'d',  bg: '#FFF3B0', tc: '#7B5E00' };
  return               { txt: days+'d',  bg: '#D8F3DC', tc: '#2D6A4F' };
}