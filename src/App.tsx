import React, { useState, useMemo, useEffect } from "react";
import {
  Gauge, ClipboardList, PlusCircle, Check, X, AlertTriangle, ArrowRight, ArrowLeft, ArrowLeftRight,
  Layers, Clock, Building2, Megaphone, User2, CircleDot, ShieldCheck, Eye, Workflow,
  Sparkles, Pencil, Trash2, ChevronUp, ChevronDown, ListOrdered,
  Calendar, CalendarDays, Paperclip, ChevronRight, Save, LogIn, Copy, ExternalLink,
  Play, Pause, PackageCheck, Files, MessageSquare, Send, FileText, Scissors, LogOut,
  TrendingUp, TrendingDown, Minus, GripVertical, Info, Lock, Settings, SlidersHorizontal, Archive, ArchiveRestore,
  Users, Bell, Hourglass, Target, RefreshCcw, Upload, UserPlus,
} from "lucide-react";

const INK = "#1c1917", PAPER = "#f7f5f1", BRAND = "#0f766e", BLUE = "#1d4ed8";
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const ROLES = [{ id: "DA", name: "Director de Arte" }, { id: "RD", name: "Redactor" }, { id: "GR", name: "Gráfico" }, { id: "MM", name: "Multimedia" }, { id: "CO", name: "Content" }, { id: "PR", name: "Preditor" }];
const LINEAS = ["DC1", "DC2"]; // segmentos = bolsas de capacidad
const CAP = {
  DC1: { DA: 120, RD: 200, GR: 160, MM: 120, CO: 40, PR: 40 },
  DC2: { DA: 200, RD: 200, GR: 80, MM: 120, CO: 40, PR: 40 },
};
const totalCapLinea = (l) => ROLES.reduce((a, r) => a + (CAP[l]?.[r.id] || 0), 0);
const zeroRoles = () => Object.fromEntries(ROLES.map((r) => [r.id, 0]));
const STRESS = 1.2;
const LAB_EXEC = "Ejecutivo 9Lab"; // agencia interna modular
const CAP_LAB = { DA: 80, RD: 120, GR: 120, MM: 120, CO: 40, PR: 40 }; // capacidad propia de 9Lab (parte modular agencia + equipo externo) · demo
CAP["9Lab"] = CAP_LAB;

const MARCAS = ["DIS", "TT", "DC", "SPR", "MCN"];
const CLIENTES = ["DC", "MGM", "MTV", "AIG"];
const PRODUCTOS = ["AON", "APPS", "COMERCIAL"];
const DIVISIONES = ["Quito", "Guayaquil"];
const POS = ["Carla Ríos", "Andrés Pinto", "Sofía León", "Marco Díaz"];
const EJECUTIVOS = ["M. Salazar", "J. Andrade", "P. Cevallos", "L. Mora"];
const CAMPANAS = ["Día del niño", "Día del padre", "Día de la madre", "Verano Sierra", "Tu tarjeta", "Viajes exclusivos", "Aeropuertos", "Yatch Club", "Lanzamiento App", "Meta mensual", "Auto seguro", "Doble cupón", "Difiere tus compras", "Avances en efectivo", "Recuperados", "Perdidos", "Nuevos clientes", "Fidelizados"];
const CATEGORIAS = ["Marcas", "Temporalidades", "Reputación", "Negocios", "Proveeduría"];
const CAMP_CAT = { "Día del niño": "Temporalidades", "Día del padre": "Temporalidades", "Día de la madre": "Temporalidades", "Verano Sierra": "Temporalidades", "Tu tarjeta": "Marcas", "Viajes exclusivos": "Marcas", "Aeropuertos": "Marcas", "Yatch Club": "Marcas", "Lanzamiento App": "Marcas", "Meta mensual": "Negocios", "Auto seguro": "Negocios", "Doble cupón": "Negocios", "Difiere tus compras": "Negocios", "Avances en efectivo": "Negocios", "Recuperados": "Reputación", "Perdidos": "Reputación", "Nuevos clientes": "Proveeduría", "Fidelizados": "Proveeduría" };
const catOf = (camp) => CAMP_CAT[camp] || "Negocios";
const MARCA_SEG = { DC: "DC1", SPR: "DC1", MCN: "DC1", TT: "DC2", DIS: "DC2" };
// Segmento (bolsa) según categoría: Marcas -> por marca; Temporalidades -> elegido al aceptar; Reputación/Negocios -> DC1; Proveeduría -> DC2
const segFor = (cat, marca, chosen) => cat === "Marcas" ? (MARCA_SEG[marca] || "DC1") : cat === "Temporalidades" ? (chosen || "DC1") : cat === "Proveeduría" ? "DC2" : "DC1";
const ETIQUETAS = [{ id: "simple", name: "Simple", f: 1.0, c: "#16a34a" }, { id: "media", name: "Media", f: 1.0, c: "#d97706" }, { id: "alta", name: "Compleja", f: 1.0, c: "#be123c" }];
const etById = (id) => ETIQUETAS.find((e) => e.id === id) || ETIQUETAS[1];
const PRIORIDADES = ["Baja", "Media", "Alta", "Urgente"];
const PRIO_COLOR = { Baja: "#78716c", Media: "#0f766e", Alta: "#b45309", Urgente: "#be123c" };
const CREATIVOS = { DA: "Iván Costa", RD: "Lucía Mena", GR: "Pablo Núñez", MM: "Tomás Ruiz", CO: "Renata Vega", PR: "Diego Salas" };

const SKUS = [
  { id: "post", name: "Post Creación · Pieza", cor: "BA-DI-Post estático-016", cx: "simple", h: { DC: 0, CP: 1, DA: 0, GR: 3, MM: 0 } },
  { id: "kv", name: "KV Campaña mediana (Foto + Texto)", cor: "CO-GN-Key Visual-071", cx: "media", h: { DC: 0, CP: 4, DA: 8, GR: 0, MM: 0 } },
  { id: "video", name: "IG Story - Creación - animado", cor: "BA-DI-Story animado-014", cx: "media", h: { DC: 0, CP: 2, DA: 4, GR: 4, MM: 4 } },
  { id: "banner", name: "Banner - Creación", cor: "BA-DI-Banner estático-024", cx: "alta", h: { DC: 0, CP: 0.5, DA: 0, GR: 1, MM: 1 } },
  { id: "folleto", name: "Folleto / Brochure / PPT", cor: "BA-PO-Brochure impreso-056", cx: "alta", h: { DC: 0, CP: 8, DA: 16, GR: 24, MM: 0 } },
  { id: "landing", name: "E-club - Creación", cor: "ID-DI-Promocionales / E-Club-032", cx: "media", h: { DC: 0, CP: 2, DA: 4, GR: 4, MM: 0 } },
  { id: "guion", name: "Guión TVC", cor: "CO-GN-Guión de Video-076", cx: "simple", h: { DC: 0, CP: 12, DA: 0, GR: 0, MM: 0 } },
  { id: "adapt", name: "Aviso - Adaptación", cor: "BA-ATL-Aviso-005", cx: "simple", h: { DC: 0, CP: 0, DA: 0.5, GR: 2, MM: 0 } },
  { id: "storyest", name: "IG Story - Creación - estático", cor: "BA-DI-Story estático-015", cx: "media", h: { DC: 0, CP: 2, DA: 2, GR: 4, MM: 4 } },
  { id: "carrusel", name: "Post carrusel de hasta 5 frames", cor: "ID-DI-Carrusel-019", cx: "media", h: { DC: 0, CP: 1, DA: 0, GR: 3, MM: 2 } },
  { id: "tripleta", name: "Armado de tripleta (3 portadas, 2 carruseles y un reel)", cor: "ID-DI-Tripleta-020", cx: "alta", h: { DC: 0, CP: 4, DA: 2, GR: 4, MM: 4 } },
  { id: "kvhero", name: "KV Campaña Hero (Foto + Texto)", cor: "CO-GN-Key Visual-071", cx: "alta", h: { DC: 0, CP: 8, DA: 12, GR: 0, MM: 0 } },
  { id: "concdig", name: "Conceptualización Digital campañas Mediana", cor: "CO-DI-Idea Digital-079", cx: "media", h: { DC: 32, CP: 32, DA: 24, GR: 0, MM: 0 } },
  { id: "concdigpeq", name: "Conceptualización Digital campañas Pequeña", cor: "CO-DI-Idea Digital-079", cx: "simple", h: { DC: 20, CP: 24, DA: 16, GR: 0, MM: 0 } },
  { id: "avisoconcepto", name: "Aviso - Creación con concepto", cor: "CO-GN-Concepto-070", cx: "alta", h: { DC: 0.5, CP: 6, DA: 6, GR: 0, MM: 0 } },
  { id: "banneradapt", name: "Banner sencillo - Adaptación", cor: "BA-DI-Banner estático-024", cx: "simple", h: { DC: 0, CP: 0.1, DA: 0, GR: 1, MM: 1 } },
  { id: "boletin", name: "Boletín - Creación", cor: "CMC-GN-Boletín Normal-088", cx: "media", h: { DC: 0, CP: 3, DA: 0, GR: 8, MM: 8 } },
  { id: "infografia", name: "Gráfica de infografía compleja", cor: "BA-GN-Infografía-035", cx: "alta", h: { DC: 0, CP: 4, DA: 8, GR: 0, MM: 0 } },
  { id: "copy", name: "Copy - pieza compleja", cor: "ID-GN-Textos / Captions-119", cx: "alta", h: { DC: 0, CP: 8, DA: 0, GR: 0, MM: 0 } },
  { id: "copysimple", name: "Copy - pieza sencilla", cor: "ID-GN-Textos / Captions-119", cx: "simple", h: { DC: 0, CP: 2, DA: 0, GR: 0, MM: 0 } },
  { id: "ppt", name: "Presentación - Hasta 20 diapositivas", cor: "BA-CP-Presentación de PPT-125", cx: "simple", h: { DC: 1, CP: 0, DA: 24, GR: 0, MM: 0 } },
  { id: "valla", name: "Valla (por arte) - Creación", cor: "BA-ATL-Valla-007", cx: "media", h: { DC: 0.5, CP: 1.5, DA: 4, GR: 4, MM: 0 } },
  { id: "retoque", name: "Retoque de Fotografía media · c/u", cor: "BA-GN-Retoque de Fotos-139", cx: "media", h: { DC: 0, CP: 0, DA: 8, GR: 8, MM: 0 } },
  { id: "fotoia", name: "Generación de fotos con IA", cor: "BA-GN-Foto IA-036", cx: "alta", h: { DC: 1, CP: 0, DA: 8, GR: 8, MM: 0 } },
  { id: "sobreimp", name: "Sobreimposiciones de texto (video 15-30 seg)", cor: "BA-GN-Sobreimposiciones-099", cx: "media", h: { DC: 0, CP: 2, DA: 2, GR: 3, MM: 4 } },
  { id: "cobertura", name: "Cobertura de evento CM", cor: "GP-GN-CM | Cobertura De Eventos-003", cx: "media", h: { DC: 0, CP: 8, DA: 0, GR: 0, MM: 24 } },
  { id: "reportecierre", name: "Reporte de Cierre de Campaña", cor: "RAM | Reporte De Cierre De Campaña", cx: "media", h: { DC: 0, CP: 16, DA: 8, GR: 0, MM: 0 } },
  { id: "toolkit", name: "Toolkit o manual de uso Mediano", cor: "BA-CP-Toolkit-068", cx: "media", h: { DC: 0.5, CP: 3, DA: 12, GR: 12, MM: 0 } },
  { id: "brandbook", name: "Manual creación / brandbook · etapa", cor: "CO-CP-Manual de Marca-082", cx: "alta", h: { DC: 0, CP: 24, DA: 48, GR: 0, MM: 0 } },
  { id: "logo", name: "Propuesta de logo", cor: "CO-GN-Logo-074", cx: "media", h: { DC: 1, CP: 0, DA: 16, GR: 16, MM: 0 } },
  { id: "artefinal", name: "Arte Final · pieza", cor: "BA-GN-Arte Final-127", cx: "media", h: { DC: 0, CP: 0.5, DA: 0.5, GR: 0.5, MM: 0 } },
  { id: "planif", name: "Planificación Mensual", cor: "GP-GN-CM | Planificación De Contenido-003", cx: "media", h: { DC: 0, CP: 11, DA: 8, GR: 0, MM: 0 } },
];
// Reasigna las horas de cada entregable a los nuevos roles (Dir. Creativo sale; entran Content y Preditor). Valores de demo ajustables.
SKUS.forEach((s) => { const o = s.h; s.h = { DA: (o.DA || 0) + Math.round((o.DC || 0) * 0.6), RD: o.CP || 0, GR: o.GR || 0, MM: o.MM || 0, CO: Math.round((o.DC || 0) * 0.25), PR: Math.round((o.MM || 0) * 0.25) }; });
const skuById = (id) => SKUS.find((s) => s.id === id);
const PLANTILLAS = [
  { id: "rrss", name: "Pack RRSS mensual", items: [["post", "simple", 12], ["adapt", "simple", 8], ["banner", "media", 3]] },
  { id: "lanz", name: "Lanzamiento de campaña", items: [["guion", "media", 1], ["kv", "alta", 2], ["video", "alta", 1], ["landing", "media", 1]] },
  { id: "promo", name: "Promo temporada", items: [["kv", "media", 1], ["post", "media", 10], ["banner", "simple", 4]] },
];
const EJEC = {
  sin_iniciar: { label: "Nueva", c: "#a8a29e", icon: CircleDot },
  proceso: { label: "En proceso", c: "#d97706", icon: Play },
  pausa: { label: "Suspendida", c: "#78716c", icon: Pause },
  entregada: { label: "Finalizada", c: "#16a34a", icon: PackageCheck },
};
const EJEC_ORDER = ["sin_iniciar", "proceso", "pausa", "entregada"];

const TODAY = new Date("2026-06-04T00:00:00");
const addDays = (b, n) => { const d = new Date(b); d.setDate(d.getDate() + n); return d; };
const iso = (d) => d.toISOString().slice(0, 10);
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie"];
const CLOSE_REASONS = { retrabajo: "Retrabajo / incidencia", tiempo: "Tomó más tiempo del estimado", cliente: "Dependencia o aprobación del cliente", otro: "Otro" };
const REASON_COLOR = { retrabajo: "#1d4ed8", tiempo: "#b45309", cliente: "#7c3aed", otro: "#0f766e" };
const MONDAY = (() => { const d = new Date(TODAY); const wd = (d.getDay() + 6) % 7; return addDays(d, -wd); })();
const weekStart = (i) => addDays(MONDAY, i * 7);
const weekDays = (i) => [0, 1, 2, 3, 4].map((k) => addDays(weekStart(i), k));
const weekRange = (i) => { const s = weekStart(i), e = addDays(s, 4); return s.getMonth() === e.getMonth() ? `${s.getDate()}–${e.getDate()} ${MONTHS[e.getMonth()]}` : `${s.getDate()} ${MONTHS[s.getMonth()]}–${e.getDate()} ${MONTHS[e.getMonth()]}`; };
const HORIZON = 12;                                   // semanas planificables hacia adelante (~3 meses); el resto se abre rodando
const WEEKS = Array.from({ length: HORIZON + 1 }, (_, i) => i);
const MINWEEK = -8, MAXWEEK = HORIZON;                 // rango navegable: ~2 meses de historial + 3 meses adelante
const NAVWEEKS = Array.from({ length: MAXWEEK - MINWEEK + 1 }, (_, k) => MINWEEK + k);
const weeksInMonthOf = (w) => { const s = weekStart(w), m = s.getMonth(), y = s.getFullYear(); return NAVWEEKS.filter((i) => { const d = weekStart(i); return d.getMonth() === m && d.getFullYear() === y; }); };
const monthOf = (i) => { const s = weekStart(i), m = MONTHS[s.getMonth()], y = s.getFullYear(); return y === TODAY.getFullYear() ? m : `${m} ${y}`; };
const wkLabel = (w) => (w === 0 ? "Sem. actual" : w === 1 ? "Próxima sem." : weekRange(w));
const WEEKLBL = new Proxy({}, { get: (_, p) => wkLabel(Number(p)) });
const wdOf = (isoStr) => { const d = new Date(isoStr + "T00:00:00"); return Math.min(4, (d.getDay() + 6) % 7); };
const fmt = (s) => new Date(s + "T00:00:00").toLocaleDateString("es", { day: "2-digit", month: "short" });
// Feriados (work:true = laborable/conmemorativo, work:false = no laborable, no se asigna trabajo)
const HOLIDAYS = {
  "2026-06-05": { name: "Día del Medio Ambiente", work: true },
  "2026-06-10": { name: "Feriado local", work: false },
  "2026-06-24": { name: "Inti Raymi", work: false },
};
const holiday = (isoStr) => HOLIDAYS[isoStr] || null;
const isOff = (isoStr) => { const h = HOLIDAYS[isoStr]; return !!(h && !h.work); };
const workdaysIn = (week) => weekDays(week).filter((d) => !isOff(iso(d))).length;
const capFactor = (week) => workdaysIn(week) / 5;
const weekOfIso = (s) => WEEKS.find((w) => weekDays(w).some((x) => iso(x) === s));
const isWorkday = (d) => { const dow = new Date(iso(d) + "T00:00:00").getDay(); return dow >= 1 && dow <= 5 && !isOff(iso(d)); };
function earliestAdvanceDay() { const lead = new Date().getHours() < 12 ? 1 : 2; let d = addDays(TODAY, lead), g = 0; while (!isWorkday(d) && g < 21) { d = addDays(d, 1); g++; } return d; }
const moveStamp = () => { const d = new Date(); return `hoy ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
function upcomingSlots(n) { const res = []; for (let w = 0; w <= HORIZON && res.length < n; w++) { const dd = weekDays(w); for (let di = 0; di < 5 && res.length < n; di++) { const d = dd[di]; if (iso(d) <= iso(TODAY) || isOff(iso(d))) continue; res.push({ sem: w, dia: di, iso: iso(d), label: `${DAYS[di]} ${d.getDate()} ${MONTHS[d.getMonth()]}` }); } } return res; }
function segWeekBoard(allItems, linea, w, excludeId) {
  const dailyCap = Math.max(1, Math.round((totalCapLinea(linea) / 5) * capFactor(w)));
  const days = weekDays(w), off = (di) => isOff(iso(days[di]));
  const cols = [[], [], [], [], []], load = [0, 0, 0, 0, 0];
  const place = (t, di, h) => { cols[di].push({ it: t, h }); load[di] += h; };
  const tasks = allItems.filter((i) => i.linea === linea && i.estado === "aceptado" && i.id !== excludeId && weekFrac(i, w) > 0);
  tasks.forEach((t) => { if (t.dayPlan && !t.weekPlan) Object.keys(t.dayPlan).forEach((d) => place(t, +d, t.dayPlan[d])); });
  tasks.forEach((t) => { if (!t.weekPlan && !t.dayPlan && t.dia != null) place(t, t.dia, itemHoursWeek(t, w).tot); });
  tasks.forEach((t) => { if (!t.weekPlan && (t.dayPlan || t.dia != null)) return; let rem = itemHoursWeek(t, w).tot; for (let i = 0; i < 5 && rem > 0; i++) { if (off(i)) continue; const free = Math.max(0, dailyCap - load[i]); if (free <= 0) continue; const take = Math.min(free, rem); place(t, i, take); rem -= take; } });
  return { cols, load, dailyCap, days, off };
}

function suggestedHours(it) { const s = skuById(it.skuId), f = etById(it.etiqueta).f, per = {}; let tot = 0; ROLES.forEach((r) => { const v = Math.round(s.h[r.id] * it.cantidad * f); per[r.id] = v; tot += v; }); return { per, tot }; }
function itemHours(it) { const fr = it.frac == null ? 1 : it.frac, base = it.assignedHours || suggestedHours(it).per, per = {}; let tot = 0; ROLES.forEach((r) => { const v = Math.round((base[r.id] || 0) * fr); per[r.id] = v; tot += v; }); return { per, tot }; }
function weekFrac(it, w) { if (it.weekPlan) return it.weekPlan[w] || 0; return it.sem === w ? 1 : 0; }
function itemHoursWeek(it, w) { const f = weekFrac(it, w), { per, tot } = itemHours(it), p = {}; ROLES.forEach((r) => (p[r.id] = Math.round(per[r.id] * f))); return { per: p, tot: Math.round(tot * f), frac: f }; }
function planWeeks(it) { return it.weekPlan ? WEEKS.filter((w) => it.weekPlan[w] > 0) : [it.sem]; }
let _id = 300; const nid = () => `E-${++_id}`;
let _cor = 48200; const newCor = () => `COR-${++_cor}`;
const COR_YEAR = TODAY.getFullYear();
const corProjectName = (side, item) => `${side} - ${item.campana} - (${item.corYear || COR_YEAR})`;
const corUrl = (id) => `https://cor.works/task/${id}`;

const BASE = [
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 0, "retoque", "media", 3, "aceptado", 100, "entregada"],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 0, "kvhero", "alta", 1, "aceptado", 70, "proceso"],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 0, "copy", "alta", 3, "aceptado", 30, "pausa"],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 0, "post", "simple", 20, "revision", 0, null],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 0, "video", "media", 5, "aceptado", 60, "proceso"],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 0, "tripleta", "alta", 2, "aceptado", 100, "entregada"],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 1, "kv", "media", 1, "aceptado", 50, "proceso"],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 1, "banneradapt", "simple", 10, "provisional", 0, null],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 1, "post", "simple", 14, "revision", 0, null],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 1, "carrusel", "media", 3, "aceptado", 30, "proceso"],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 2, "storyest", "media", 8, "revision", 0, null],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 2, "copysimple", "simple", 2, "provisional", 0, null],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 2, "kv", "media", 2, "revision", 0, null],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 3, "kv", "media", 1, "aceptado", 60, "proceso"],
  ["DIS", "Marcas y experiencias", "Tu tarjeta", "M. Salazar", "Carla Ríos", 3, "banner", "alta", 7, "provisional", 0, null],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 0, "adapt", "simple", 7, "aceptado", 60, "proceso"],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 0, "concdig", "media", 1, "revision", 0, null],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 0, "banner", "alta", 8, "revision", 0, null],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 0, "banneradapt", "simple", 5, "aceptado", 5, "sin_iniciar"],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 1, "video", "media", 2, "aceptado", 30, "proceso"],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 1, "cobertura", "media", 1, "aceptado", 0, "sin_iniciar"],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 1, "cobertura", "media", 1, "aceptado", 30, "proceso"],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 1, "banneradapt", "simple", 4, "aceptado", 0, "sin_iniciar"],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 1, "copy", "alta", 4, "provisional", 0, null],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 2, "video", "media", 5, "revision", 0, null],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 2, "kv", "media", 1, "provisional", 0, null],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 2, "carrusel", "media", 8, "provisional", 0, null],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 3, "kvhero", "alta", 1, "provisional", 0, null],
  ["TT", "Marcas y experiencias", "Viajes exclusivos", "M. Salazar", "Marco Díaz", 3, "landing", "media", 2, "provisional", 0, null],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 0, "logo", "media", 1, "revision", 0, null],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 0, "sobreimp", "media", 5, "aceptado", 100, "entregada"],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 0, "copysimple", "simple", 7, "aceptado", 5, "sin_iniciar"],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 0, "kvhero", "alta", 1, "aceptado", 20, "proceso"],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 0, "retoque", "media", 3, "revision", 0, null],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 0, "banneradapt", "simple", 8, "aceptado", 5, "sin_iniciar"],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 1, "infografia", "alta", 1, "revision", 0, null],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 1, "banneradapt", "simple", 7, "aceptado", 30, "proceso"],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 1, "kv", "media", 1, "revision", 0, null],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 1, "copy", "alta", 5, "aceptado", 10, "sin_iniciar"],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 2, "avisoconcepto", "alta", 1, "provisional", 0, null],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 2, "valla", "media", 1, "revision", 0, null],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 2, "artefinal", "media", 8, "revision", 0, null],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 2, "storyest", "media", 6, "provisional", 0, null],
  ["SPR", "Marcas y experiencias", "Aeropuertos", "J. Andrade", "Andrés Pinto", 3, "valla", "media", 1, "revision", 0, null],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 0, "carrusel", "media", 8, "aceptado", 100, "entregada"],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 0, "valla", "media", 1, "aceptado", 50, "pausa"],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 0, "artefinal", "media", 12, "aceptado", 60, "proceso"],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 0, "infografia", "alta", 1, "aceptado", 5, "sin_iniciar"],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 1, "kv", "media", 2, "provisional", 0, null],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 1, "boletin", "media", 2, "aceptado", 20, "proceso"],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 1, "banneradapt", "simple", 7, "revision", 0, null],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 1, "boletin", "media", 2, "revision", 0, null],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 1, "carrusel", "media", 3, "provisional", 0, null],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 2, "retoque", "media", 2, "aceptado", 50, "proceso"],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 2, "storyest", "media", 6, "aceptado", 10, "sin_iniciar"],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 2, "retoque", "media", 4, "revision", 0, null],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 2, "banneradapt", "simple", 7, "provisional", 0, null],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 3, "tripleta", "alta", 1, "provisional", 0, null],
  ["DC", "Marcas y experiencias", "Yatch Club", "L. Mora", "Sofía León", 3, "tripleta", "alta", 2, "provisional", 0, null],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 0, "avisoconcepto", "alta", 1, "aceptado", 60, "proceso"],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 0, "carrusel", "media", 7, "aceptado", 60, "proceso"],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 0, "cobertura", "media", 1, "aceptado", 100, "entregada"],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 0, "logo", "media", 1, "aceptado", 40, "proceso"],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 0, "copysimple", "simple", 6, "aceptado", 70, "proceso"],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 0, "adapt", "simple", 6, "aceptado", 50, "proceso"],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 1, "storyest", "media", 8, "provisional", 0, null],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 1, "copysimple", "simple", 8, "provisional", 0, null],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 1, "banneradapt", "simple", 8, "aceptado", 0, "sin_iniciar"],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 2, "fotoia", "alta", 1, "revision", 0, null],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 2, "banneradapt", "simple", 4, "aceptado", 5, "sin_iniciar"],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 2, "copysimple", "simple", 8, "revision", 0, null],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 3, "post", "simple", 9, "aceptado", 10, "sin_iniciar"],
  ["MCN", "Marcas y experiencias", "Lanzamiento App", "P. Cevallos", "Marco Díaz", 3, "boletin", "media", 1, "revision", 0, null],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 0, "post", "simple", 20, "revision", 0, null],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 0, "carrusel", "media", 4, "aceptado", 40, "proceso"],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 0, "storyest", "media", 8, "revision", 0, null],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 0, "artefinal", "media", 10, "aceptado", 70, "proceso"],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 0, "storyest", "media", 6, "revision", 0, null],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 0, "post", "simple", 13, "revision", 0, null],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 1, "storyest", "media", 7, "provisional", 0, null],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 1, "adapt", "simple", 6, "revision", 0, null],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 1, "storyest", "media", 6, "aceptado", 5, "sin_iniciar"],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 1, "storyest", "media", 6, "aceptado", 5, "sin_iniciar"],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 1, "artefinal", "media", 4, "aceptado", 70, "proceso"],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 2, "cobertura", "media", 1, "provisional", 0, null],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 2, "copy", "alta", 3, "revision", 0, null],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 2, "cobertura", "media", 1, "aceptado", 5, "sin_iniciar"],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 3, "storyest", "media", 8, "provisional", 0, null],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 3, "adapt", "simple", 6, "revision", 0, null],
  ["SPR", "Negocios", "Meta mensual", "J. Andrade", "Andrés Pinto", 3, "cobertura", "media", 1, "revision", 0, null],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 0, "video", "media", 6, "aceptado", 40, "pausa"],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 0, "banner", "alta", 11, "aceptado", 100, "entregada"],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 0, "copysimple", "simple", 6, "aceptado", 50, "proceso"],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 0, "boletin", "media", 2, "aceptado", 30, "pausa"],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 1, "copysimple", "simple", 2, "revision", 0, null],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 1, "video", "media", 6, "revision", 0, null],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 1, "guion", "simple", 1, "provisional", 0, null],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 1, "banneradapt", "simple", 4, "provisional", 0, null],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 2, "banneradapt", "simple", 8, "revision", 0, null],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 2, "copysimple", "simple", 5, "aceptado", 40, "proceso"],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 2, "copy", "alta", 3, "revision", 0, null],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 2, "adapt", "simple", 9, "provisional", 0, null],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 3, "banner", "alta", 8, "revision", 0, null],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 3, "carrusel", "media", 7, "revision", 0, null],
  ["TT", "Negocios", "Auto seguro", "P. Cevallos", "Marco Díaz", 3, "cobertura", "media", 1, "provisional", 0, null],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 0, "storyest", "media", 4, "revision", 0, null],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 0, "storyest", "media", 8, "revision", 0, null],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 0, "post", "simple", 9, "revision", 0, null],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 0, "boletin", "media", 2, "aceptado", 40, "proceso"],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 0, "carrusel", "media", 3, "aceptado", 40, "pausa"],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 1, "banner", "alta", 9, "aceptado", 60, "proceso"],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 1, "storyest", "media", 6, "provisional", 0, null],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 1, "sobreimp", "media", 4, "aceptado", 5, "sin_iniciar"],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 1, "sobreimp", "media", 4, "revision", 0, null],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 2, "banneradapt", "simple", 9, "revision", 0, null],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 2, "sobreimp", "media", 4, "provisional", 0, null],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 3, "artefinal", "media", 9, "revision", 0, null],
  ["DC", "Negocios", "Doble cupón", "L. Mora", "Sofía León", 3, "copy", "alta", 4, "provisional", 0, null],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 0, "banneradapt", "simple", 7, "revision", 0, null],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 0, "cobertura", "media", 1, "aceptado", 40, "pausa"],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 0, "copysimple", "simple", 8, "aceptado", 100, "entregada"],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 0, "cobertura", "media", 1, "aceptado", 30, "pausa"],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 0, "cobertura", "media", 1, "aceptado", 0, "sin_iniciar"],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 1, "video", "media", 4, "aceptado", 40, "proceso"],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 1, "storyest", "media", 3, "revision", 0, null],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 1, "storyest", "media", 8, "aceptado", 60, "proceso"],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 1, "artefinal", "media", 9, "provisional", 0, null],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 2, "carrusel", "media", 8, "revision", 0, null],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 2, "artefinal", "media", 4, "revision", 0, null],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 2, "sobreimp", "media", 6, "revision", 0, null],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 2, "video", "media", 2, "provisional", 0, null],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 3, "copy", "alta", 3, "revision", 0, null],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 3, "banner", "alta", 9, "aceptado", 0, "sin_iniciar"],
  ["DIS", "Negocios", "Difiere tus compras", "M. Salazar", "Carla Ríos", 3, "carrusel", "media", 5, "revision", 0, null],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 0, "kv", "media", 2, "revision", 0, null],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 0, "concdigpeq", "simple", 1, "aceptado", 60, "proceso"],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 0, "storyest", "media", 6, "aceptado", 30, "proceso"],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 0, "retoque", "media", 3, "aceptado", 40, "proceso"],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 0, "banneradapt", "simple", 7, "aceptado", 10, "sin_iniciar"],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 1, "banneradapt", "simple", 4, "revision", 0, null],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 1, "storyest", "media", 8, "provisional", 0, null],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 1, "artefinal", "media", 6, "aceptado", 60, "proceso"],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 1, "cobertura", "media", 1, "aceptado", 20, "proceso"],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 2, "adapt", "simple", 8, "revision", 0, null],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 2, "copy", "alta", 5, "aceptado", 60, "proceso"],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 2, "banneradapt", "simple", 7, "aceptado", 0, "sin_iniciar"],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 3, "storyest", "media", 5, "provisional", 0, null],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 3, "adapt", "simple", 7, "revision", 0, null],
  ["DC", "Temporalidades", "Verano Sierra", "L. Mora", "Sofía León", 3, "carrusel", "media", 8, "aceptado", 10, "sin_iniciar"],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 0, "copysimple", "simple", 7, "aceptado", 60, "proceso"],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 0, "infografia", "alta", 1, "aceptado", 60, "proceso"],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 0, "tripleta", "alta", 1, "aceptado", 70, "proceso"],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 0, "copy", "alta", 4, "aceptado", 20, "proceso"],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 1, "storyest", "media", 4, "aceptado", 10, "sin_iniciar"],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 1, "banner", "alta", 5, "provisional", 0, null],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 1, "copysimple", "simple", 6, "aceptado", 5, "sin_iniciar"],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 2, "copysimple", "simple", 6, "aceptado", 0, "sin_iniciar"],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 2, "avisoconcepto", "alta", 1, "provisional", 0, null],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 2, "adapt", "simple", 9, "provisional", 0, null],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 2, "storyest", "media", 7, "provisional", 0, null],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 3, "avisoconcepto", "alta", 1, "provisional", 0, null],
  ["MCN", "Temporalidades", "Día de la madre", "P. Cevallos", "Sofía León", 3, "boletin", "media", 1, "provisional", 0, null],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 0, "banneradapt", "simple", 8, "revision", 0, null],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 0, "carrusel", "media", 4, "aceptado", 100, "entregada"],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 0, "valla", "media", 2, "revision", 0, null],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 0, "infografia", "alta", 1, "aceptado", 70, "proceso"],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 0, "kv", "media", 2, "aceptado", 60, "proceso"],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 1, "retoque", "media", 2, "provisional", 0, null],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 1, "landing", "media", 2, "revision", 0, null],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 1, "avisoconcepto", "alta", 1, "aceptado", 10, "sin_iniciar"],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 1, "storyest", "media", 5, "provisional", 0, null],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 2, "artefinal", "media", 4, "revision", 0, null],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 2, "banner", "alta", 10, "revision", 0, null],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 2, "sobreimp", "media", 4, "provisional", 0, null],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 3, "retoque", "media", 3, "revision", 0, null],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 3, "logo", "media", 1, "aceptado", 10, "sin_iniciar"],
  ["DIS", "Temporalidades", "Día del niño", "M. Salazar", "Carla Ríos", 3, "sobreimp", "media", 2, "provisional", 0, null],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 0, "sobreimp", "media", 5, "aceptado", 50, "pausa"],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 0, "infografia", "alta", 1, "revision", 0, null],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 0, "banneradapt", "simple", 8, "aceptado", 30, "proceso"],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 0, "tripleta", "alta", 2, "aceptado", 70, "proceso"],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 1, "banner", "alta", 5, "revision", 0, null],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 1, "boletin", "media", 1, "revision", 0, null],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 1, "copy", "alta", 5, "revision", 0, null],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 2, "banneradapt", "simple", 4, "provisional", 0, null],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 2, "boletin", "media", 2, "provisional", 0, null],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 2, "copy", "alta", 3, "aceptado", 70, "proceso"],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 2, "artefinal", "media", 11, "aceptado", 0, "sin_iniciar"],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 3, "post", "simple", 18, "aceptado", 40, "proceso"],
  ["TT", "Temporalidades", "Día del padre", "J. Andrade", "Andrés Pinto", 3, "landing", "media", 2, "revision", 0, null],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 0, "banner", "alta", 7, "revision", 0, null],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 0, "banneradapt", "simple", 6, "aceptado", 70, "proceso"],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 0, "carrusel", "media", 7, "aceptado", 0, "sin_iniciar"],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 0, "carrusel", "media", 6, "revision", 0, null],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 0, "carrusel", "media", 7, "revision", 0, null],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 0, "adapt", "simple", 8, "aceptado", 30, "pausa"],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 1, "adapt", "simple", 9, "provisional", 0, null],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 1, "banner", "alta", 4, "provisional", 0, null],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 1, "planif", "media", 1, "aceptado", 20, "proceso"],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 1, "boletin", "media", 2, "provisional", 0, null],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 2, "cobertura", "media", 1, "provisional", 0, null],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 2, "video", "media", 6, "provisional", 0, null],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 3, "boletin", "media", 1, "provisional", 0, null],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 3, "cobertura", "media", 1, "provisional", 0, null],
  ["MCN", "Onboarding", "Nuevos clientes", "P. Cevallos", "Sofía León", 3, "post", "simple", 17, "provisional", 0, null],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 0, "post", "simple", 17, "revision", 0, null],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 0, "guion", "simple", 1, "aceptado", 70, "proceso"],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 0, "storyest", "media", 7, "aceptado", 20, "proceso"],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 0, "cobertura", "media", 1, "aceptado", 70, "proceso"],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 0, "banneradapt", "simple", 5, "aceptado", 100, "entregada"],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 1, "artefinal", "media", 7, "revision", 0, null],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 1, "copy", "alta", 5, "revision", 0, null],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 1, "storyest", "media", 4, "revision", 0, null],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 1, "video", "media", 2, "aceptado", 30, "proceso"],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 2, "carrusel", "media", 3, "revision", 0, null],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 2, "cobertura", "media", 1, "provisional", 0, null],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 2, "banneradapt", "simple", 7, "provisional", 0, null],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 3, "artefinal", "media", 7, "aceptado", 10, "sin_iniciar"],
  ["DC", "Onboarding", "Recuperados", "L. Mora", "Sofía León", 3, "banner", "alta", 11, "revision", 0, null],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 0, "post", "simple", 11, "aceptado", 60, "proceso"],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 0, "banneradapt", "simple", 8, "aceptado", 50, "proceso"],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 0, "sobreimp", "media", 3, "aceptado", 20, "proceso"],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 0, "adapt", "simple", 8, "aceptado", 40, "proceso"],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 0, "storyest", "media", 5, "aceptado", 70, "proceso"],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 1, "video", "media", 2, "revision", 0, null],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 1, "sobreimp", "media", 2, "revision", 0, null],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 1, "adapt", "simple", 10, "revision", 0, null],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 1, "boletin", "media", 2, "provisional", 0, null],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 2, "banner", "alta", 12, "provisional", 0, null],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 2, "adapt", "simple", 7, "provisional", 0, null],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 2, "storyest", "media", 7, "revision", 0, null],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 2, "copy", "alta", 5, "aceptado", 10, "sin_iniciar"],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 3, "copysimple", "simple", 6, "revision", 0, null],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 3, "adapt", "simple", 6, "provisional", 0, null],
  ["SPR", "Onboarding", "Perdidos", "J. Andrade", "Andrés Pinto", 3, "post", "simple", 21, "aceptado", 10, "sin_iniciar"],
  ["MCN", "Negocios", "Avances en efectivo", "J. Andrade", "Andrés Pinto", 0, "copysimple", "simple", 6, "aceptado", 30, "proceso"],
  ["MCN", "Negocios", "Avances en efectivo", "J. Andrade", "Andrés Pinto", 0, "post", "simple", 10, "revision", 0, null],
  ["MCN", "Negocios", "Avances en efectivo", "J. Andrade", "Andrés Pinto", 1, "banner", "alta", 6, "provisional", 0, null],
  ["MCN", "Negocios", "Avances en efectivo", "J. Andrade", "Andrés Pinto", 2, "boletin", "media", 1, "revision", 0, null],
  ["MCN", "Negocios", "Avances en efectivo", "J. Andrade", "Andrés Pinto", 3, "copy", "alta", 3, "revision", 0, null],
  ["DIS", "Onboarding", "Fidelizados", "P. Cevallos", "Sofía León", 0, "carrusel", "media", 4, "aceptado", 20, "proceso"],
  ["DIS", "Onboarding", "Fidelizados", "P. Cevallos", "Sofía León", 0, "post", "simple", 8, "revision", 0, null],
  ["DIS", "Onboarding", "Fidelizados", "P. Cevallos", "Sofía León", 1, "video", "media", 3, "provisional", 0, null],
  ["DIS", "Onboarding", "Fidelizados", "P. Cevallos", "Sofía León", 2, "storyest", "media", 4, "revision", 0, null],
  ["DIS", "Onboarding", "Fidelizados", "P. Cevallos", "Sofía León", 3, "copysimple", "simple", 5, "provisional", 0, null],
];
const SEED_TODAY = wdOf(iso(TODAY));
const SEED = BASE.map((r, i) => {
  const acc = r[9] === "aceptado";
  let est = r[11] === "pausa" ? "pausada" : r[9];
  let ejec = r[11], avance = r[10], dia = null, arch = r[11] === "entregada";
  const cat = catOf(r[2]);
  const seg = segFor(cat, r[0], cat === "Temporalidades" ? (i % 2 ? "DC2" : "DC1") : null);
  const cantidad = Math.max(1, Math.round(r[8] * (seg === "DC1" ? 0.5 : 0.85)));
  if (r[5] === 0 && acc && est !== "pausada") {
    const nd = i % 5;
    if (nd < SEED_TODAY) { ejec = "entregada"; avance = 100; arch = true; dia = nd; }
    else { dia = nd; }
  }
  return { id: `E-${10 + i}`, marca: r[0], linea: seg, categoria: cat, campana: r[2], ejecutivo: r[3], poCliente: r[4], sem: r[5], fAire: iso(addDays(weekStart(r[5]), i % 5)), skuId: r[6], etiqueta: r[7], cantidad, estado: est, avance, ejecucion: ejec, brief: "", corCli: acc ? newCor() : null, corId: acc ? newCor() : null, corYear: acc ? COR_YEAR : null, prio: 0, prioridad: "Media", dia: est === "pausada" ? null : dia, archivado: arch };
});
LINEAS.forEach((l) => { const inL = SEED.filter((i) => i.linea === l); [...new Set(inL.map((i) => i.campana))].forEach((c) => inL.filter((i) => i.campana === c).forEach((i, k) => (i.prio = k))); });
// Algunas tareas ya delegadas a 9Lab (cambian de dueño al Ejecutivo 9Lab; siguen contando en su segmento y además en 9Lab)
SEED.forEach((it, k) => { if (it.estado === "aceptado" && !it.archivado && it.ejecucion !== "entregada" && k % 11 === 4) { it.delegBy = it.ejecutivo; it.ejecutivo = LAB_EXEC; it.lab = true; } });
const initCampOrder = {}; LINEAS.forEach((l) => { initCampOrder[l] = [...new Set(SEED.filter((i) => i.linea === l).map((i) => i.campana))]; });

const ESTADO = {
  borrador: { bg: "#f5f5f4", fg: "#a8a29e", label: "Borrador" },
  revision: { bg: "#fef3c7", fg: "#92400e", label: "En revisión" },
  provisional: { bg: "#dbeafe", fg: "#1e40af", label: "Provisional" },
  aceptado: { bg: "#ccfbf1", fg: "#115e59", label: "Aceptado · COR" },
  pausada: { bg: "#fffbeb", fg: "#92400e", label: "Pausada · esperando reactivación" },
  rechazado: { bg: "#f5f5f4", fg: "#a8a29e", label: "Rechazado" },
};
function statusColor(pct) { if (pct >= 100) return { bar: "#be123c", chip: "#fee2e2", text: "#9f1239", label: "Sin cupo" }; if (pct >= 85) return { bar: "#d97706", chip: "#fef3c7", text: "#92400e", label: "Ajustado" }; return { bar: BRAND, chip: "#ccfbf1", text: "#115e59", label: "Disponible" }; }
const inp = { background: "#fff", border: "1px solid #e7e5e4", borderRadius: 10, padding: "9px 11px", fontSize: 14, width: "100%", color: INK, fontFamily: "inherit" };
const dateInput = { background: "#fff", border: "1px solid #e7e5e4", borderRadius: 8, padding: "4px 8px", fontSize: 12, color: INK };

const TODAY_WEEK = 0; // la semana actual del prototipo
const TODAY_IDX = wdOf(iso(TODAY)); // día actual dentro de la semana (0=Lun … 4=Vie)
// Riesgo de fecha al aire y salud de campaña
const airWeek = (it) => Math.round((new Date(it.fAire + "T00:00:00") - MONDAY) / 6048e5); // 6048e5 = 7 días en ms
const planSpan = (it) => { const ws = planWeeks(it); return { start: Math.min(...ws), end: Math.max(...ws) }; };
function taskRisk(it) {
  if (it.archivado || it.ejecucion === "entregada") return "ok";
  if (it.estado !== "aceptado") return "none";
  const aw = airWeek(it), pe = planSpan(it).end;
  if (pe > aw || aw < TODAY_WEEK) return "late";          // el plan cruza / ya pasó la fecha al aire
  if (aw === TODAY_WEEK || (it.retrabajos || []).length) return "risk";
  return "ok";
}
const HEALTH = {
  ok: { key: "ok", label: "En regla", bar: BRAND, chip: "#ccfbf1", text: "#115e59" },
  risk: { key: "risk", label: "En riesgo", bar: "#d97706", chip: "#fef3c7", text: "#92400e" },
  late: { key: "late", label: "Atrasada", bar: "#be123c", chip: "#fee2e2", text: "#9f1239" },
};
function campHealth(tasks) { const act = tasks.filter((t) => !t.archivado); if (!act.length) return HEALTH.ok; const r = act.map(taskRisk); if (r.includes("late")) return HEALTH.late; if (r.includes("risk")) return HEALTH.risk; return HEALTH.ok; }
// Tareas personales del ejecutivo (no van a COR, no consumen capacidad)
const PERSONAL_SEED = [
  { id: "PT1", owner: "M. Salazar", title: "Status semanal con cliente DIS", date: iso(TODAY), done: false, prio: "alta" },
  { id: "PT2", owner: "M. Salazar", title: "Revisar brief de nueva campaña Verano", date: iso(addDays(TODAY, 1)), done: false, prio: "media" },
  { id: "PT3", owner: "M. Salazar", title: "Enviar reporte de cierre de mes", date: iso(addDays(TODAY, 2)), done: false, prio: "media" },
  { id: "PT4", owner: "M. Salazar", title: "Coordinar sesión de fotos con producción", date: iso(addDays(TODAY, -1)), done: true, prio: "baja" },
  { id: "PT5", owner: "J. Andrade", title: "Llamada de feedback con PO", date: iso(TODAY), done: false, prio: "alta" },
];
let _pt = 100;
const newPtId = () => `PT${++_pt}`;
const SAVED_BASE = 132; // horas extra evitadas acumuladas del mes (ilustrativo)
const MESES_TREND = ["Marzo", "Abril", "Mayo", "Junio"];
const MONTH_TREND = { Marzo: [68, 74, 71, 79], Abril: [81, 88, 92, 85], Mayo: [90, 97, 86, 93], Junio: [78, 84, 0, 0] };

function Login({ onEnter }) {
  const [u, setU] = useState(""); const [p, setP] = useState("");
  return (
    <div className="w-full flex items-center justify-center" style={{ background: INK, minHeight: 680 }}>
      <div className="rounded-2xl p-8" style={{ background: PAPER, width: 380 }}>
        <div className="flex items-center gap-3 mb-6"><div className="rounded-xl flex items-center justify-center" style={{ width: 42, height: 42, background: INK }}><Workflow size={22} color={PAPER} /></div><div><div style={{ ...serif, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>Smart Business X</div><div className="text-xs" style={{ color: "#78716c" }}>Tráfico operativo · sobre COR</div></div></div>
        <div className="space-y-3"><div><label className="text-xs block mb-1" style={{ color: "#78716c", fontWeight: 600 }}>Usuario</label><input style={inp} value={u} onChange={(e) => setU(e.target.value)} placeholder="cualquier usuario" /></div><div><label className="text-xs block mb-1" style={{ color: "#78716c", fontWeight: 600 }}>Contraseña</label><input type="password" style={inp} value={p} onChange={(e) => setP(e.target.value)} placeholder="cualquier contraseña" /></div></div>
        <button onClick={onEnter} className="mt-6 w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm" style={{ background: INK, color: PAPER, fontWeight: 600 }}><LogIn size={16} /> Entrar</button>
        <div className="text-xs text-center mt-4" style={{ color: "#a8a29e" }}>Demo · cualquier credencial funciona</div>
      </div>
    </div>
  );
}

export default function App() { const [a, setA] = useState(false); return a ? <Main onExit={() => setA(false)} /> : <Login onEnter={() => setA(true)} />; }

function Main({ onExit }) {
  const [view, setView] = useState("miSemana");
  const [audience, setAudience] = useState("agencia");
  const [week, setWeek] = useState(0);
  const [closeDay, setCloseDay] = useState(null);
  const [lineaView, setLineaView] = useState("General");
  const [items, setItems] = useState(SEED);
  const [campOrder, setCampOrder] = useState(initCampOrder);
  const [toast, setToast] = useState(null);
  const [decision, setDecision] = useState(null);
  const [editing, setEditing] = useState(null);
  const [corModal, setCorModal] = useState(null);
  const openCor = (it, side) => setCorModal({ it, side: side || (audience === "cliente" ? "cliente" : "agencia") });
  const corMembers = (item, side) => side === "cliente" ? (item.membersCli || [item.poCliente].filter(Boolean)) : (item.membersAg || (() => { const { per } = itemHours(item); return ROLES.filter((r) => per[r.id] > 0).map((r) => CREATIVOS[r.id]); })());
  const corAddMember = (item, side, name) => { const cur = corMembers(item, side); if (cur.includes(name)) return; set(item.id, side === "cliente" ? { membersCli: [...cur, name] } : { membersAg: [...cur, name] }); fireToast(`${name} agregado en COR (${side})`); };
  const corRemoveMember = (item, side, name) => { const cur = corMembers(item, side); set(item.id, side === "cliente" ? { membersCli: cur.filter((n) => n !== name) } : { membersAg: cur.filter((n) => n !== name) }); fireToast(`${name} quitado en COR (${side})`); };
  const [splitDays, setSplitDays] = useState(null);
  const [cfg, setCfg] = useState(false);
  const [timeFor, setTimeFor] = useState(null);
  const [retroFor, setRetroFor] = useState(null);
  const [actingPO, setActingPO] = useState("Director");
  const [actingExec, setActingExec] = useState("Director");
  const [showCap, setShowCap] = useState(false);
  useEffect(() => { setShowCap(audience === "cliente"); }, [audience, actingPO, actingExec]);
  const [moveReqs, setMoveReqs] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const notify = (o) => setNotifs((p) => [{ id: `N-${Math.random().toString(36).slice(2, 7)}`, at: moveStamp(), read: false, sev: "info", forAgency: false, forExec: null, forClientAll: false, forPO: null, ...o }, ...p].slice(0, 40));
  const [savedHours, setSavedHours] = useState(SAVED_BASE);
  const [ptasks, setPtasks] = useState(PERSONAL_SEED);
  const addPtask = (title, date, prio) => { if (!title || !title.trim()) return; setPtasks((p) => [...p, { id: newPtId(), owner: me, title: title.trim(), date: date || iso(TODAY), done: false, prio: prio || "media" }]); };
  const togglePtask = (id) => setPtasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const removePtask = (id) => setPtasks((p) => p.filter((t) => t.id !== id));
  const fireToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2600); };

  const inWeek = (it) => weekFrac(it, week) > 0;
  const inLinea = (it) => (lineaView === "9Lab" ? !!it.lab : lineaView === "General" ? (isDirector || myLines.includes(it.linea)) : it.linea === lineaView);

  const consByW = useMemo(() => { const o = {}; LINEAS.forEach((l) => (o[l] = zeroRoles())); o["9Lab"] = zeroRoles(); items.filter((i) => i.estado === "aceptado").forEach((it) => { const f = weekFrac(it, week); if (f <= 0) return; const { per } = itemHours(it); ROLES.forEach((r) => (o[it.linea][r.id] += Math.round(per[r.id] * f))); if (it.lab) ROLES.forEach((r) => (o["9Lab"][r.id] += Math.round(per[r.id] * f))); }); return o; }, [items, week]);
  const provByW = useMemo(() => { const o = {}; LINEAS.forEach((l) => (o[l] = zeroRoles())); o["9Lab"] = zeroRoles(); items.filter((i) => i.estado === "provisional").forEach((it) => { const f = weekFrac(it, week); if (f <= 0) return; const { per } = itemHours(it); ROLES.forEach((r) => (o[it.linea][r.id] += Math.round(per[r.id] * f))); if (it.lab) ROLES.forEach((r) => (o["9Lab"][r.id] += Math.round(per[r.id] * f))); }); return o; }, [items, week]);
  const consAll = useMemo(() => { const w = {}; WEEKS.forEach((s) => { w[s] = {}; LINEAS.forEach((l) => (w[s][l] = zeroRoles())); w[s]["9Lab"] = zeroRoles(); }); items.filter((i) => i.estado === "aceptado").forEach((it) => { const { per } = itemHours(it); WEEKS.forEach((s) => { const f = weekFrac(it, s); if (f <= 0) return; ROLES.forEach((r) => (w[s][it.linea][r.id] += Math.round(per[r.id] * f))); if (it.lab) ROLES.forEach((r) => (w[s]["9Lab"][r.id] += Math.round(per[r.id] * f))); }); }); return w; }, [items]);

  const set = (id, patch) => setItems((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const confirmDecision = (it, action, sem, seg) => {
    const fAire = iso(addDays(weekStart(sem), wdOf(it.fAire)));
    const reAcc = !!it.corId;
    const segPatch = it.categoria === "Temporalidades" && seg ? { linea: seg } : {};
    const patch = action === "aceptar"
      ? { estado: "aceptado", sem, fAire, ...segPatch, weekPlan: null, weekLabels: null, dia: null, dayPlan: null, avance: reAcc ? it.avance : 5, ejecucion: reAcc ? (it.avance > 0 ? "proceso" : "sin_iniciar") : "sin_iniciar", corCli: it.corCli || newCor(), corId: it.corId || newCor(), corYear: it.corYear || COR_YEAR, reentry: false, log: reAcc ? [...(it.log || []), logEntry(me, `Reactivada en ${WEEKLBL[sem]} · misma tarea en COR`)] : it.log }
      : { estado: "provisional", sem, fAire, ...segPatch };
    if (action === "aceptar" && sem !== it.sem) setSavedHours((h) => h + itemHours(it).tot);
    set(it.id, patch); setDecision(null);
    const verb = action === "aceptar" ? (reAcc ? "reactivó" : "aceptó") : "dejó provisional";
    notify({ sev: "info", forAgency: true, forExec: it.ejecutivo, text: `${it.poCliente} ${verb} "${skuById(it.skuId).name} · ${it.campana}" en ${WEEKLBL[sem]}.` });
    fireToast(action === "aceptar" ? `${it.id} ${reAcc ? "reactivado" : "aceptado"} en ${WEEKLBL[sem]} · ${reAcc ? "misma tarea en COR" : "creado en COR"}` : `${it.id} provisional en ${WEEKLBL[sem]}`);
  };
  const confirmSplit = (it, parts, seg) => {
    const valid = parts.filter((p) => (Number(p.pct) || 0) > 0);
    const weekPlan = {}, weekLabels = {}; valid.forEach((p) => { weekPlan[p.sem] = (weekPlan[p.sem] || 0) + (Number(p.pct) || 0) / 100; if (p.label) weekLabels[p.sem] = p.label; });
    const weeks = Object.keys(weekPlan).map(Number).sort((a, b) => a - b);
    const primary = weeks[0] != null ? weeks[0] : it.sem;
    const single = weeks.length <= 1;
    const reAcc = !!it.corId;
    const segPatch = it.categoria === "Temporalidades" && seg ? { linea: seg } : {};
    setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, estado: "aceptado", sem: primary, ...segPatch, weekPlan: single ? null : weekPlan, weekLabels: single ? null : weekLabels, frac: 1, dia: null, dayPlan: null, fAire: iso(addDays(weekStart(primary), wdOf(it.fAire))), avance: reAcc ? it.avance : 5, ejecucion: reAcc ? (it.avance > 0 ? "proceso" : "sin_iniciar") : "sin_iniciar", corCli: it.corCli || newCor(), corId: it.corId || newCor(), corYear: it.corYear || COR_YEAR, reentry: false, log: reAcc ? [...(it.log || []), logEntry(me, single ? `Reactivada en ${WEEKLBL[primary]} · misma tarea en COR` : `Reactivada y repartida en ${weeks.length} semanas · misma tarea en COR`)] : it.log } : x)));
    setDecision(null);
    fireToast(single ? `${it.id} ${reAcc ? "reactivado" : "aceptado"} en ${WEEKLBL[primary]} · ${reAcc ? "misma tarea en COR" : "creado en COR"}` : `${it.id} repartido en ${weeks.length} semanas · 1 sola tarea en COR`);
  };

  const addItems = (rows, asDraft) => {
    const estado = asDraft ? "borrador" : "revision";
    const news = rows.map((r) => ({ ...r, id: nid(), estado, avance: 0, ejecucion: null, corCli: null, corId: null, corYear: null, prio: 99 }));
    setItems((prev) => [...news, ...prev]);
    setCampOrder((prev) => { const next = { ...prev }; news.forEach((n) => { if (!next[n.linea]) next[n.linea] = []; if (!next[n.linea].includes(n.campana)) next[n.linea] = [...next[n.linea], n.campana]; }); return next; });
    setView("solicitudes");
    if (!asDraft) [...new Set(rows.map((r) => r.poCliente))].forEach((po) => { const n = rows.filter((r) => r.poCliente === po).length; notify({ sev: "info", forPO: po, text: `La agencia ingresó ${n} entregable(s) a tu revisión.` }); });
    fireToast(asDraft ? `${rows.length} entregable(s) en borrador` : `${rows.length} a revisión · semana ${rows[0].sem + 1}`);
  };
  const moveItem = (it, dir) => setItems((prev) => { const g = prev.filter((x) => x.linea === it.linea && x.campana === it.campana && x.sem === it.sem && ["revision", "provisional", "aceptado"].includes(x.estado)).sort((a, b) => a.prio - b.prio); const i = g.findIndex((x) => x.id === it.id), sw = g[i + dir]; if (!sw) return prev; return prev.map((x) => x.id === it.id ? { ...x, prio: sw.prio } : x.id === sw.id ? { ...x, prio: it.prio } : x); });
  const moveCamp = (linea, camp, dir) => setCampOrder((prev) => { const arr = [...(prev[linea] || [])]; const i = arr.indexOf(camp); if (i < 0 || i + dir < 0 || i + dir >= arr.length) return prev; [arr[i], arr[i + dir]] = [arr[i + dir], arr[i]]; return { ...prev, [linea]: arr }; });
  const moveCampWeek = (linea, camp, newSem) => { setItems((prev) => prev.map((x) => (x.linea === linea && x.campana === camp ? { ...x, sem: newSem, fAire: iso(addDays(weekStart(newSem), wdOf(x.fAire))) } : x))); fireToast(`${camp} movida a ${WEEKLBL[newSem]}`); };
  const logEntry = (by, text) => ({ by, at: moveStamp(), text });
  const placeItem = (x, toSem, toDia) => ({ ...x, sem: toSem, dia: toDia, weekPlan: null, weekLabels: null, dayPlan: null, fAire: iso(addDays(weekStart(toSem), toDia)) });
  const nextFreeWeek = (linea, afterSem, it) => { const per = itemHours(it).per; for (let w = afterSem + 1; w <= HORIZON; w++) { const cf = capFactor(w); if (ROLES.every((r) => { const cp = Math.round(CAP[linea][r.id] * cf); return !cp || consAll[w][linea][r.id] + per[r.id] <= cp; })) return w; } return Math.min(HORIZON, afterSem + 1); };
  const advanceItem = (item, toSem, toDia, by, displacedId, urgent = true) => {
    const dItem = displacedId ? items.find((i) => i.id === displacedId) : null;
    const dispW = dItem ? nextFreeWeek(item.linea, toSem, dItem) : null;
    setItems((prev) => prev.map((x) => {
      if (x.id === item.id) return { ...placeItem(x, toSem, toDia), ...(urgent ? { prioridad: "Urgente" } : {}), log: [...(x.log || []), logEntry(by, urgent ? `Movida a Urgente · de ${WEEKLBL[item.sem]} a ${WEEKLBL[toSem]}` : `Adelantada · de ${WEEKLBL[item.sem]} a ${WEEKLBL[toSem]}`)] };
      if (displacedId && x.id === displacedId) return { ...x, sem: dispW, dia: null, dayPlan: null, weekPlan: null, weekLabels: null, fAire: iso(addDays(weekStart(dispW), wdOf(x.fAire))), log: [...(x.log || []), logEntry(by, `Desplazada a ${WEEKLBL[dispW]} (siguiente espacio disponible) por el adelanto de ${by}`)] };
      return x;
    }));
    setSavedHours((s) => s + 4);
    notify({ sev: "info", forAgency: true, forExec: item.ejecutivo, forPO: item.poCliente, text: `${by} ${urgent ? "movió a Urgente" : "adelantó"} "${skuById(item.skuId).name} · ${item.campana}" a ${WEEKLBL[toSem]}.` });
    if (dItem) notify({ sev: "info", forAgency: true, forExec: dItem.ejecutivo, forPO: dItem.poCliente, text: `"${skuById(dItem.skuId).name} · ${dItem.campana}" se desplazó a ${WEEKLBL[dispW]} por un adelanto.` });
    fireToast(`${skuById(item.skuId).name} ${urgent ? "movida a Urgente" : "adelantada"} a ${WEEKLBL[toSem]}`);
  };
  const delayItem = (item, by) => {
    const w = nextFreeWeek(item.linea, item.sem, item);
    if (w <= item.sem) { fireToast("No hay una semana siguiente disponible"); return; }
    set(item.id, { sem: w, dia: null, dayPlan: null, weekPlan: null, weekLabels: null, fAire: iso(addDays(weekStart(w), wdOf(item.fAire))), log: [...(item.log || []), logEntry(by, `Retrasada a ${WEEKLBL[w]} (siguiente espacio disponible)`)] });
    notify({ sev: "info", forAgency: true, forExec: item.ejecutivo, forPO: item.poCliente, text: `${by} retrasó "${skuById(item.skuId).name} · ${item.campana}" a ${WEEKLBL[w]}.` });
    fireToast(`Retrasada a ${WEEKLBL[w]}`);
  };
  const requestAdvance = (item, toSem, toDia, by, displaces, urgent = true) => {
    const id = `R-${Math.random().toString(36).slice(2, 6)}`;
    const affectedPO = by !== item.poCliente ? item.poCliente : displaces[0] ? displaces[0].po : item.poCliente;
    const verbo = urgent ? "mover a Urgente" : "adelantar";
    setMoveReqs((p) => [{ id, itemId: item.id, name: `${skuById(item.skuId).name} · ${item.campana}`, linea: item.linea, exec: item.ejecutivo, fromSem: item.sem, toSem, toDia, by, owner: item.poCliente, affectedPO, at: moveStamp(), displaces, urgent }, ...p]);
    set(item.id, { pendingMove: id });
    notify({ sev: "alert", forAgency: true, forExec: item.ejecutivo, forPO: affectedPO, text: `${by} solicita ${verbo} "${skuById(item.skuId).name} · ${item.campana}" a ${WEEKLBL[toSem]}. Requiere tu visto bueno.` });
    notify({ sev: "info", forAgency: true, forExec: item.ejecutivo, forPO: item.poCliente, text: `Se está ${urgent ? "priorizando a Urgente" : "adelantando"} "${skuById(item.skuId).name} · ${item.campana}" (a cargo de ${item.ejecutivo}) · pendiente de aprobar el desplazamiento de la tarea de ${affectedPO}.` });
    fireToast(`Solicitud enviada a la agencia y a ${affectedPO}`);
  };
  const approveReq = (req, approver) => {
    const dispW = {};
    req.displaces.forEach((d) => { const it = items.find((i) => i.id === d.id); if (it) dispW[d.id] = nextFreeWeek(req.linea, req.toSem, it); });
    setItems((prev) => prev.map((x) => {
      if (x.id === req.itemId) return { ...placeItem(x, req.toSem, req.toDia), ...(req.urgent ? { prioridad: "Urgente" } : {}), pendingMove: null, log: [...(x.log || []), logEntry(req.by, req.urgent ? `Movida a Urgente · de ${WEEKLBL[req.fromSem]} a ${WEEKLBL[req.toSem]}` : `Adelantada · de ${WEEKLBL[req.fromSem]} a ${WEEKLBL[req.toSem]}`), logEntry(approver, "Solicitud aprobada")] };
      if (req.displaces.some((d) => d.id === x.id)) { const w = dispW[x.id] != null ? dispW[x.id] : Math.min(HORIZON, req.toSem + 1); return { ...x, sem: w, dia: null, dayPlan: null, weekPlan: null, weekLabels: null, fAire: iso(addDays(weekStart(w), wdOf(x.fAire))), log: [...(x.log || []), logEntry(approver, `Desplazada a ${WEEKLBL[w]} (siguiente espacio disponible) · adelanto aprobado`)] }; }
      return x;
    }));
    setMoveReqs((p) => p.filter((r) => r.id !== req.id));
    setSavedHours((s) => s + 4);
    notify({ sev: "info", forAgency: true, forExec: req.exec, forPO: req.by, text: `${approver} aprobó ${req.urgent ? "mover a Urgente" : "adelantar"} "${req.name}" a ${WEEKLBL[req.toSem]}.` });
    req.displaces.forEach((d) => notify({ sev: "info", forClientAll: false, forPO: d.po, forAgency: true, forExec: req.exec, text: `"${d.name}" se desplazó a ${WEEKLBL[dispW[d.id] != null ? dispW[d.id] : Math.min(HORIZON, req.toSem + 1)]} por un adelanto aprobado.` }));
    fireToast(`Aprobado por ${approver} · ${req.name}`);
  };
  const rejectReq = (req, approver) => {
    set(req.itemId, { pendingMove: null, log: [...((items.find((i) => i.id === req.itemId) || {}).log || []), logEntry(approver, "Solicitud rechazada")] });
    setMoveReqs((p) => p.filter((r) => r.id !== req.id));
    notify({ sev: "info", forAgency: true, forExec: req.exec, forPO: req.by, text: `${approver} rechazó la solicitud de "${req.name}".` });
    fireToast(`Rechazado por ${approver} · ${req.name}`);
  };
  const copyLink = (corId) => { try { navigator.clipboard.writeText(`https://cor.works/task/${corId}`); } catch (e) {} fireToast(`Link de ${corId} copiado`); };
  const moveDia = (id, dia) => setItems((p) => p.map((x) => (x.id === id ? { ...x, dia, dayPlan: null } : x)));
  const plannerReplace = (moverId, toDia, wk, victimId, dest) => {
    const mv = items.find((i) => i.id === moverId), vc = items.find((i) => i.id === victimId);
    setItems((p) => p.map((x) => {
      if (x.id === moverId) return { ...x, sem: wk, dia: toDia, dayPlan: null, weekPlan: null, weekLabels: null, fAire: iso(addDays(weekStart(wk), toDia)) };
      if (x.id === victimId) {
        if (dest.kind === "day") return { ...x, sem: wk, dia: dest.dia, dayPlan: null, weekPlan: null, weekLabels: null, fAire: iso(addDays(weekStart(wk), dest.dia)), log: [...(x.log || []), logEntry(me, `Desplazada al ${DAYS[dest.dia]} por replanificación en el tablero`)] };
        return { ...x, sem: dest.sem, dia: null, dayPlan: null, weekPlan: null, weekLabels: null, fAire: iso(addDays(weekStart(dest.sem), wdOf(x.fAire))), log: [...(x.log || []), logEntry(me, `Desplazada a ${WEEKLBL[dest.sem]} por replanificación en el tablero`)] };
      }
      return x;
    }));
    if (mv && vc) { fireToast(`${skuById(mv.skuId).name} reemplazó a ${skuById(vc.skuId).name} · ${dest.kind === "day" ? `movida al ${DAYS[dest.dia]}` : `movida a ${WEEKLBL[dest.sem]}`}`); notify({ sev: "info", forAgency: true, forExec: vc.ejecutivo, forPO: vc.poCliente, text: `"${skuById(vc.skuId).name} · ${vc.campana}" se reprogramó (${dest.kind === "day" ? DAYS[dest.dia] : WEEKLBL[dest.sem]}) por una replanificación en el tablero.` }); }
  };
  const resetDia = (w) => { setItems((p) => p.map((x) => (x.sem === w ? { ...x, dia: null, dayPlan: null } : x))); fireToast("Plan reordenado por prioridad"); };
  const setDayPlan = (id, plan) => { const clean = plan && Object.keys(plan).length ? plan : null; setItems((p) => p.map((x) => (x.id === id ? { ...x, dayPlan: clean, dia: null } : x))); setSplitDays(null); fireToast(clean ? "Horas repartidas entre los días" : "Reparto por días quitado"); };
  const setPrioridad = (it, val) => { set(it.id, { prioridad: val }); notify({ sev: "alert", forAgency: true, forExec: it.ejecutivo, text: `${it.poCliente} cambió la prioridad de "${skuById(it.skuId).name} · ${it.campana}" a ${val}.` }); fireToast(`Prioridad de ${it.id}: ${val}`); };
  const setAssigned = (id, map) => { set(id, { assignedHours: map }); setTimeFor(null); fireToast(map ? "Tiempo asignado actualizado" : "Volvió al tiempo sugerido"); };
  const createRetro = (item, data) => {
    set(item.id, { retrabajos: [...(item.retrabajos || []), { ...data, by: me, at: moveStamp() }], log: [...(item.log || []), logEntry(me, `Retrabajo (${data.tipo === "cliente" ? "Cliente" : "Interno"}) · ${data.motivo}: ${data.titulo}`)] });
    notify({ sev: "alert", forAgency: true, forExec: item.ejecutivo, text: `Se registró un retrabajo en "${skuById(item.skuId).name} · ${item.campana}" (${data.motivo}). Se sincroniza con COR.` });
    setRetroFor(null);
    fireToast("Retrabajo creado y enviado a COR");
  };
  const setArchivedItem = (it, val) => { set(it.id, { archivado: val }); fireToast(val ? "Tarea archivada en el repositorio" : "Tarea restaurada"); };
  const setArchivedCamp = (ids, val) => { setItems((p) => p.map((x) => (ids.includes(x.id) ? { ...x, archivado: val } : x))); fireToast(val ? "Campaña archivada en el repositorio" : "Campaña restaurada"); };
  const me = audience === "agencia" ? actingExec : actingPO;
  const isDirector = me === "Director";
  const isLab = audience === "agencia" && me === LAB_EXEC;
  const inScopePerson = (i) => isDirector || (audience === "agencia" ? i.ejecutivo === me : i.poCliente === me);
  const dueToday = items.filter((i) => i.estado === "aceptado" && i.sem === TODAY_WEEK && i.ejecucion !== "entregada" && (i.dia === TODAY_IDX || (i.dayPlan && i.dayPlan[TODAY_IDX] > 0) || (i.weekPlan && weekFrac(i, TODAY_WEEK) > 0)) && inScopePerson(i));
  const REASONS = CLOSE_REASONS;
  const closeMarkPart = (it, x, n) => { set(it.id, { avance: Math.max(it.avance, Math.round((x / n) * 100)), ejecucion: "proceso", log: [...(it.log || []), logEntry(me, `Cierre del día: completada la parte ${x}/${n} (el resto sigue planificado)`)] }); };
  const closeMarkDone = (it) => { set(it.id, { ejecucion: "entregada", avance: 100, archivado: true, log: [...(it.log || []), logEntry(me, "Cierre del día: marcada como entregada")] }); };
  const closeReschedule = (it, slot, reason, comment) => {
    const fromLbl = `${DAYS[TODAY_IDX]} ${weekDays(TODAY_WEEK)[TODAY_IDX].getDate()} ${MONTHS[weekDays(TODAY_WEEK)[TODAY_IDX].getMonth()]}`;
    set(it.id, { sem: slot.sem, dia: slot.dia, dayPlan: null, weekPlan: null, weekLabels: null, ejecucion: it.avance > 0 ? "proceso" : "sin_iniciar", delayed: true, closeReason: reason, delayInfo: { from: fromLbl, to: slot.label, reason, comment, by: me, at: moveStamp() }, retrabajos: reason === "retrabajo" ? [...(it.retrabajos || []), { titulo: "Retrabajo detectado en el cierre del día", tipo: "interno", motivo: "Cierre del día", deadline: slot.iso, descripcion: comment, by: me, at: moveStamp() }] : it.retrabajos, log: [...(it.log || []), logEntry(me, `Retraso · reprogramada del ${fromLbl} al ${slot.label} · ${REASONS[reason]}${comment ? `: ${comment}` : ""}`)] });
    notify({ sev: "alert", forAgency: true, forExec: it.ejecutivo, forPO: it.poCliente, text: `"${skuById(it.skuId).name} · ${it.campana}" no se terminó el ${fromLbl} y se reprogramó al ${slot.label} (${REASONS[reason]}).` });
  };
  const finishClose = () => { setCloseDay(null); fireToast("Cierre del día completado · jornada lista"); };
  const closeReturnClient = (it, comment) => {
    set(it.id, { estado: "revision", dia: null, dayPlan: null, weekPlan: null, weekLabels: null, ejecucion: null, reentry: true, closeReason: "cliente", delayInfo: { from: `${DAYS[TODAY_IDX]} ${weekDays(TODAY_WEEK)[TODAY_IDX].getDate()} ${MONTHS[weekDays(TODAY_WEEK)[TODAY_IDX].getMonth()]}`, to: "Aprobaciones (cliente)", reason: "cliente", comment, by: me, at: moveStamp() }, log: [...(it.log || []), logEntry(me, `Cierre del día: devuelta a aprobación del cliente · dependencia${comment ? `: ${comment}` : ""}`)] });
    notify({ sev: "alert", forAgency: true, forExec: it.ejecutivo, forPO: it.poCliente, text: `"${skuById(it.skuId).name} · ${it.campana}" volvió a Solicitudes para tu aprobación (dependencia del cliente). Al aceptarla se vuelve a planificar.` });
  };
  const myLines = isDirector ? LINEAS : LINEAS.filter((l) => items.some((i) => (audience === "agencia" ? i.ejecutivo : i.poCliente) === me && i.linea === l));
  const dashDisabled = !isDirector && lineaView === "General";
  useEffect(() => { if (dashDisabled && (view === "dashboard" || view === "semana") && !isLab) setView("pedidos"); if (view === "aprobaciones" && audience !== "cliente") setView("pedidos"); if (audience === "cliente" && view === "miSemana") setView("pedidos"); if (isLab && !["lab", "semana", "dashboard", "miSemana", "retro"].includes(view)) setView("lab"); }, [dashDisabled, view, audience, isLab]);
  useEffect(() => { if (isLab) { setLineaView("9Lab"); return; } if (!isDirector && myLines.length) setLineaView(myLines[0]); }, [audience, actingExec, actingPO, isLab]);
  const delegarLab = (it) => { set(it.id, { lab: true, delegBy: it.delegBy || it.ejecutivo, ejecutivo: LAB_EXEC, log: [...(it.log || []), logEntry(me, `Delegada a 9Lab (antes ${it.ejecutivo})`)] }); notify({ sev: "info", forAgency: true, text: `"${skuById(it.skuId).name} · ${it.campana}" delegada a 9Lab.` }); fireToast(`${it.id} delegada a 9Lab`); };
  const devolverLab = (it) => { const back = it.delegBy || EJECUTIVOS[0]; set(it.id, { lab: false, ejecutivo: back, delegBy: null, log: [...(it.log || []), logEntry(me, `Devuelta de 9Lab a ${back}`)] }); fireToast(`${it.id} devuelta a ${back}`); };
  const myReqs = moveReqs.filter((r) => (audience === "agencia" ? isDirector || r.exec === actingExec : isDirector || r.affectedPO === actingPO));
  const myNotifs = notifs.filter((n) => (audience === "agencia" ? (isDirector ? n.forAgency || !!n.forExec : n.forExec === actingExec) : (isDirector ? n.forClientAll || !!n.forPO : n.forClientAll || n.forPO === actingPO)));
  const markNotifsRead = () => { const ids = new Set(myNotifs.map((n) => n.id)); setNotifs((p) => p.map((n) => (ids.has(n.id) ? { ...n, read: true } : n))); };
  const approverName = me;
  const pedidosProps = {
    items, audience, inWeek, inLinea, consByW, campOrder, lineaView, week, inScopePerson, isDirector,
    onAccept: (it) => setDecision({ item: it, action: "aceptar" }),
    onReject: (it) => { set(it.id, { estado: "rechazado" }); setSavedHours((h) => h + itemHours(it).tot); notify({ sev: "info", forAgency: true, forExec: it.ejecutivo, text: `${it.poCliente} rechazó "${skuById(it.skuId).name} · ${it.campana}".` }); fireToast(`${it.id} rechazado`); },
    onProvisional: (it) => setDecision({ item: it, action: "provisional" }),
    onEdit: setEditing,
    onDelete: (it) => { setItems((p) => p.filter((x) => x.id !== it.id)); fireToast(`${it.id} eliminado`); },
    onEjec: (it, e) => {
      if (e === "pausa") { set(it.id, { estado: "pausada", ejecucion: "pausa", dia: null, dayPlan: null, reentry: true, log: [...(it.log || []), logEntry(me, "Suspendida por la agencia · enviada a Aprobaciones del cliente para reactivación")] }); notify({ sev: "alert", forAgency: true, forExec: it.ejecutivo, forPO: it.poCliente, text: `La agencia suspendió "${skuById(it.skuId).name} · ${it.campana}". Sale del plan; reactívala desde Aprobaciones cuando quieras retomarla.` }); fireToast(`${it.id} suspendida · enviada a Aprobaciones`); return; }
      set(it.id, { ejecucion: e, avance: e === "entregada" ? 100 : it.avance, archivado: e === "entregada" ? true : it.archivado }); if (e === "entregada") fireToast("Tarea finalizada y archivada en el repositorio");
    },
    onReactivar: (it) => setDecision({ item: it, action: "aceptar" }),
    onCopy: copyLink, onOpenCor: openCor, onTime: setTimeFor, onArchive: setArchivedItem, onArchiveCamp: setArchivedCamp, onRetro: setRetroFor, onDelegar: delegarLab, onDevolver: devolverLab, isLab,
  };

  return (
    <div style={{ background: PAPER, color: INK, minHeight: 680 }} className="w-full">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <Header audience={audience} setAudience={setAudience} week={week} setWeek={setWeek} lineaView={lineaView} setLineaView={setLineaView} onExit={onExit} onConfig={() => setCfg(true)} notifs={myNotifs} reqs={myReqs} onApprove={(r) => approveReq(r, approverName)} onReject={(r) => rejectReq(r, approverName)} onReadNotifs={markNotifsRead} hideWeek={view === "solicitudes" || view === "aprobaciones"} actingPO={actingPO} setActingPO={setActingPO} actingExec={actingExec} setActingExec={setActingExec} isDirector={isDirector} isLab={isLab} showCap={showCap} setShowCap={setShowCap} myLines={myLines} view={view} setView={setView} dashDisabled={dashDisabled} />
        {(isLab || (!(! isDirector && lineaView === "General") && (isDirector || showCap))) && <CapStrip items={items} consByW={consByW} provByW={provByW} lineaView={lineaView} week={week} inLinea={inLinea} inWeek={inWeek} />}
        <div className="flex items-center gap-2 mt-4" style={{ minHeight: 30 }}>
          {view === "solicitudes" || view === "aprobaciones" ? <span className="flex items-center gap-1.5 text-xs" style={{ color: "#a8a29e" }}><Files size={14} /> {view === "aprobaciones" ? "Aprobaciones · reingresos de todas las semanas" : "Solicitudes de todas las semanas"}</span> : <>
            <span className="flex items-center gap-1.5 text-xs flex-shrink-0" style={{ color: "#78716c" }}><CalendarDays size={14} /> Semana:</span>
            {(() => {
              const wkM = weeksInMonthOf(week), first = wkM[0], last = wkM[wkM.length - 1];
              const canPrev = first - 1 >= MINWEEK, canNext = last + 1 <= MAXWEEK;
              const goMonth = (dir) => { const edge = dir < 0 ? first - 1 : last + 1; if (edge < MINWEEK || edge > MAXWEEK) return; setWeek(weeksInMonthOf(edge)[0]); };
              return <>
                <button onClick={() => goMonth(-1)} disabled={!canPrev} title="Mes anterior" className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 26, height: 26, background: "#ece9e3", color: canPrev ? "#57534e" : "#d6d3d1" }}><ArrowLeft size={14} /></button>
                <span className="text-xs flex-shrink-0" style={{ fontWeight: 700, color: INK, textTransform: "capitalize", minWidth: 64, textAlign: "center" }}>{monthOf(week)}</span>
                <button onClick={() => goMonth(1)} disabled={!canNext} title="Mes siguiente" className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 26, height: 26, background: "#ece9e3", color: canNext ? "#57534e" : "#d6d3d1" }}><ArrowRight size={14} /></button>
                <div className="flex items-center gap-1 overflow-x-auto" style={{ minWidth: 0, paddingBottom: 2 }}>{wkM.map((i) => <button key={i} onClick={() => setWeek(i)} className="px-3 py-1 rounded-full text-xs flex-shrink-0" style={{ background: week === i ? INK : "#ece9e3", color: week === i ? PAPER : "#57534e", fontWeight: week === i ? 600 : 500, whiteSpace: "nowrap", boxShadow: i === 0 && week !== 0 ? `inset 0 0 0 1.5px ${BRAND}` : "none" }}>{i === 0 ? "Sem. actual" : weekRange(i)}</button>)}</div>
              </>;
            })()}
          </>}
          {audience === "agencia" && !isDirector && <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
            <button onClick={() => setCloseDay({ mandatory: false, tasks: dueToday })} className="text-xs flex items-center gap-1 rounded-full px-3 py-1.5" style={{ background: dueToday.length ? "#fffbeb" : "#f0eee9", border: `1px solid ${dueToday.length ? "#fcd34d" : "#e7e5e4"}`, color: dueToday.length ? "#92400e" : "#78716c", fontWeight: 600 }}><ClipboardList size={13} /> Cierre del día{dueToday.length ? ` · ${dueToday.length}` : ""}</button>
            <button onClick={() => setCloseDay({ mandatory: true, tasks: dueToday })} title="Demo: simular que es la mañana siguiente y la jornada anterior no se cerró" className="text-xs flex items-center gap-1 rounded-full px-3 py-1.5" style={{ background: INK, color: PAPER, fontWeight: 600 }}><Clock size={13} /> Simular nuevo día</button>
          </div>}
        </div>
        <div className="flex items-center gap-1 mt-4 mb-5 flex-wrap">
          {audience === "agencia" && <NavBtn id="miSemana" icon={Sparkles} label="Mi semana" view={view} setView={setView} />}
          {!isLab && <NavBtn id="pedidos" icon={ClipboardList} label={audience === "cliente" ? "Tareas en tráfico" : "Tareas"} view={view} setView={setView} />}
          {!isLab && <NavBtn id="solicitudes" icon={Files} label={audience === "cliente" ? "Pendientes de ingreso" : "Solicitudes"} view={view} setView={setView} badge={items.filter((i) => (i.estado === "revision" || i.estado === "provisional") && (audience === "agencia" || !i.reentry) && inScopePerson(i)).length || null} />}
          {audience === "cliente" && <NavBtn id="aprobaciones" icon={RefreshCcw} label="Aprobaciones" view={view} setView={setView} badge={items.filter((i) => i.reentry && ["pausada", "revision", "provisional"].includes(i.estado) && inScopePerson(i)).length || null} />}
          {audience === "cliente" && <NavBtn id="prioridades" icon={ListOrdered} label="Priorizaciones" view={view} setView={setView} />}
          {audience === "agencia" && <NavBtn id="lab" icon={UserPlus} label="9Lab" view={view} setView={setView} badge={items.filter((i) => i.lab && (isLab ? inScopePerson(i) : true)).length || null} />}
          {!dashDisabled && <NavBtn id="semana" icon={CalendarDays} label={audience === "cliente" ? "Planificación" : "Planificador"} view={view} setView={setView} />}
          <NavBtn id="retro" icon={Megaphone} label="Retroplanning" view={view} setView={setView} />
          {audience === "agencia" && !isLab && <NavBtn id="ingreso" icon={PlusCircle} label="Ingresar pedido" view={view} setView={setView} />}
        </div>

        {audience === "agencia" && myReqs.length > 0 && (
          <Card style={{ padding: 0, marginBottom: 16, borderColor: "#fcd34d" }}>
            <div className="px-5 py-2.5 flex items-center gap-2" style={{ borderBottom: "1px solid #f0eee9", background: "#fffbeb" }}><Bell size={15} color="#b45309" /><span style={{ fontWeight: 700, color: "#92400e" }}>Solicitudes de adelanto</span><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fde68a", color: "#92400e", fontWeight: 700 }}>{myReqs.length}</span><span className="text-xs" style={{ color: "#a8a29e" }}>· tocan capacidad o trabajo de otro PO</span></div>
            <div>{myReqs.map((r, ri) => (
              <div key={r.id} className="px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: ri ? "1px solid #f7f5f1" : "none" }}>
                <div className="flex-1" style={{ minWidth: 240 }}>
                  <div className="text-sm" style={{ fontWeight: 600 }}>{r.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#78716c" }}>{r.by} pide adelantar de {WEEKLBL[r.fromSem]} a <b>{WEEKLBL[r.toSem]}</b> · {r.at}{r.displaces.length > 0 && <span style={{ color: "#9f1239" }}> · desplaza {r.displaces.map((d) => `${d.name} (${d.po})`).join(", ")}</span>}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => rejectReq(r, actingExec)} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: "#f5f5f4", color: "#57534e", fontWeight: 600 }}><X size={12} /> Rechazar</button>
                  <button onClick={() => approveReq(r, actingExec)} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: BRAND, color: "#fff", fontWeight: 600 }}><Check size={12} /> Aprobar</button>
                </div>
              </div>
            ))}</div>
          </Card>
        )}

        {view === "miSemana" && audience === "agencia" && <MiSemana items={items} ptasks={ptasks} onAddPtask={addPtask} onTogglePtask={togglePtask} onRemovePtask={removePtask} me={me} isDirector={isDirector} isLab={isLab} inScopePerson={inScopePerson} setView={setView} onOpenCor={openCor} />}
        {view === "retro" && <Retro items={items} inLinea={inLinea} inScopePerson={inScopePerson} audience={audience} setView={setView} />}
        {view === "dashboard" && <Dashboard consByW={consByW} provByW={provByW} items={items} audience={audience} lineaView={lineaView} setLineaView={setLineaView} week={week} savedHours={savedHours} inScopePerson={inScopePerson} isDirector={isDirector} me={me} showCap={showCap} />}
        {view === "pedidos" && <Pedidos {...pedidosProps} mode="tareas" />}
        {view === "solicitudes" && <Pedidos {...pedidosProps} mode="solicitudes" />}
        {view === "aprobaciones" && audience === "cliente" && <Pedidos {...pedidosProps} mode="aprobaciones" />}
        {view === "lab" && audience === "agencia" && <Pedidos {...pedidosProps} mode="lab" />}
        {view === "prioridades" && audience === "cliente" && <Prioridades items={items} consAll={consAll} inWeek={inWeek} inLinea={inLinea} campOrder={campOrder} onMoveItem={moveItem} onMoveCamp={moveCamp} onSetPrio={setPrioridad} week={week} actingPO={actingPO} setActingPO={setActingPO} onAdvance={advanceItem} onRequest={requestAdvance} onDelay={delayItem} />}
        {view === "semana" && <SemanaView items={items} audience={audience} inLinea={inLinea} lineaView={lineaView} campOrder={campOrder} week={week} onOpenCor={openCor} onCopy={copyLink} onMoveDia={moveDia} onReset={resetDia} onOpenSplit={setSplitDays} onReplace={plannerReplace} />}
        {view === "ingreso" && audience === "agencia" && <Ingreso onAdd={addItems} week={week} actingExec={actingExec} isDirector={isDirector} lineaView={lineaView} campaigns={[...new Map(items.filter((it) => it.campana).map((it) => [it.campana, { name: it.campana, marca: it.marca, linea: it.linea, fAire: it.fAire }])).values()]} />}
      </div>

      {decision && <DecisionModal decision={decision} consAll={consAll} onClose={() => setDecision(null)} onConfirm={confirmDecision} onSplit={confirmSplit} />}
      {editing && <EditModal item={editing} onClose={() => setEditing(null)} onSave={(u) => { set(u.id, u); setEditing(null); fireToast(`${u.id} actualizado`); }} />}
      {corModal && (() => { const live = items.find((x) => x.id === corModal.it.id) || corModal.it; return <CorTaskModal item={live} side={corModal.side} onClose={() => setCorModal(null)} onToast={fireToast} onCopy={copyLink} onRetro={(it) => { setCorModal(null); setRetroFor(it); }} onAddMember={corAddMember} onRemoveMember={corRemoveMember} />; })()}
      {retroFor && <RetrabajoModal item={retroFor} onClose={() => setRetroFor(null)} onCreate={createRetro} />}
      {splitDays && <DaySplitModal item={splitDays} onClose={() => setSplitDays(null)} onSave={setDayPlan} />}
      {cfg && <ConfigModal onClose={() => setCfg(false)} />}
      {timeFor && <AssignTimeModal entry={timeFor} onClose={() => setTimeFor(null)} onSave={(map) => setAssigned(timeFor.id, map)} />}
      {closeDay && <CloseDayModal tasks={closeDay.tasks} allItems={items} mandatory={closeDay.mandatory} slots={upcomingSlots(8)} reasons={REASONS} onDone={closeMarkDone} onMarkPart={closeMarkPart} onReschedule={closeReschedule} onReturnClient={closeReturnClient} onCreateRetro={createRetro} onSaveTime={setAssigned} onFinish={finishClose} onClose={() => setCloseDay(null)} />}
      {toast && <div className="fixed left-1/2 bottom-6 px-4 py-2.5 rounded-full text-sm flex items-center gap-2" style={{ transform: "translateX(-50%)", background: INK, color: PAPER, zIndex: 60 }}><Check size={15} color="#5eead4" /> {toast}</div>}
    </div>
  );
}

function Header({ audience, setAudience, week, setWeek, lineaView, setLineaView, onExit, onConfig, notifs, reqs, onApprove, onReject, onReadNotifs, hideWeek, actingPO, setActingPO, actingExec, setActingExec, isDirector, isLab, showCap, setShowCap, myLines, view, setView, dashDisabled }) {
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-3"><div className="rounded-xl flex items-center justify-center" style={{ width: 40, height: 40, background: INK }}><Workflow size={20} color={PAPER} /></div><div><div className="flex items-center gap-2"><span style={{ ...serif, fontSize: 23, fontWeight: 700, letterSpacing: -0.5 }}>Smart Business X</span><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#e7e5e4", color: "#57534e" }}>demo</span></div><div className="text-xs" style={{ color: "#78716c" }}>Tráfico operativo semanal · sobre COR</div></div></div>
        <div className="flex items-center gap-2 flex-wrap">
          <HolidayChip setWeek={setWeek} />
          <NotifBell notifs={notifs} reqs={reqs} onApprove={onApprove} onReject={onReject} onReadNotifs={onReadNotifs} />
          <div className="flex items-center rounded-full p-1" style={{ background: "#e7e5e4" }}>{[{ id: "agencia", label: "Agencia", icon: ShieldCheck }, { id: "cliente", label: "Cliente", icon: Eye }].map((a) => <button key={a.id} onClick={() => setAudience(a.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: audience === a.id ? "#fff" : "transparent", color: audience === a.id ? INK : "#78716c", fontWeight: audience === a.id ? 600 : 500 }}><a.icon size={13} /> {a.label}</button>)}</div>
          <button onClick={onConfig} title="Configuración · entregables y SKUs" className="flex items-center justify-center rounded-full" style={{ width: 32, height: 32, background: "#e7e5e4", color: "#57534e" }}><Settings size={15} /></button>
          <button onClick={onExit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: "#e7e5e4", color: "#57534e", fontWeight: 600 }}><LogOut size={13} /> Salir</button>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {!isLab && <div className="flex items-center gap-1.5"><span className="flex items-center gap-1.5 text-xs" style={{ color: "#78716c" }}><Layers size={14} /> Segmento:</span><select value={lineaView} onChange={(e) => setLineaView(e.target.value)} title={isDirector ? "El Director ve todos los segmentos o uno a la vez" : "Tus segmentos de negocio · uno a la vez o todos tus segmentos juntos"} style={{ ...dateInput, padding: "5px 9px", fontWeight: 600 }}>{isDirector ? <><option value="General">General (todos)</option>{LINEAS.map((l) => <option key={l}>{l}</option>)}</> : <>{myLines.length > 1 && <option value="General">Todos mis segmentos</option>}{myLines.map((l) => <option key={l}>{l}</option>)}</>}</select></div>}
        {isLab && <span className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5" style={{ background: "#eef2ff", color: "#1e40af", fontWeight: 600 }}><UserPlus size={14} /> Agencia interna 9Lab · capacidad propia</span>}
        {!isLab && <div className="h-4" style={{ width: 1, background: "#d6d3d1" }} />}
        <div className="flex items-center gap-1.5"><span className="flex items-center gap-1.5 text-xs" style={{ color: "#78716c" }}><User2 size={14} /> Ver como:</span><select value={audience === "agencia" ? actingExec : actingPO} onChange={(e) => (audience === "agencia" ? setActingExec(e.target.value) : setActingPO(e.target.value))} title={audience === "agencia" ? "Director ve todo · un ejecutivo ve sus proyectos · 9Lab solo lo delegado" : "Director ve todo · un PO ve solo sus campañas"} style={{ ...dateInput, padding: "5px 9px", fontWeight: 600, color: BRAND }}>{["Director", ...(audience === "agencia" ? [...EJECUTIVOS, LAB_EXEC] : POS)].map((n) => <option key={n}>{n}</option>)}</select></div>
        <div className="h-4" style={{ width: 1, background: "#d6d3d1" }} />
        <NavBtn id="dashboard" icon={Gauge} label="Dashboard" view={view} setView={setView} disabled={dashDisabled} title={dashDisabled ? "El Dashboard depende de la capacidad de un segmento · no disponible en 'Todos mis segmentos'" : undefined} />
        {!isLab && !isDirector && (lineaView === "General" ? <span className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5" style={{ marginLeft: "auto", background: "#faf9f6", border: "1px solid #ece9e3", color: "#a8a29e", fontWeight: 600 }} title="La capacidad operativa no aplica al combinar varios segmentos"><Gauge size={14} /> Capacidad no disponible en vista combinada</span> : <button onClick={() => setShowCap((s) => !s)} className="flex items-center gap-2 text-xs rounded-full px-3 py-1.5" style={{ marginLeft: "auto", background: showCap ? "#f0fdfa" : "#fff", border: `1px solid ${showCap ? "#bae6e0" : "#e7e5e4"}`, color: showCap ? "#115e59" : "#57534e", fontWeight: 600 }}><Gauge size={14} /> {showCap ? "Ocultar capacidad operativa" : "Ver capacidad operativa"} <ChevronDown size={13} style={{ transform: showCap ? "rotate(180deg)" : "none", transition: "transform .15s" }} /></button>)}
      </div>
    </div>
  );
}

function NotifBell({ notifs, reqs, onApprove, onReject, onReadNotifs }) {
  const [open, setOpen] = useState(false);
  const unread = (notifs || []).filter((n) => !n.read).length + (reqs || []).length;
  const toggle = () => { const nx = !open; setOpen(nx); if (nx) onReadNotifs(); };
  return (
    <div style={{ position: "relative" }}>
      <button onClick={toggle} title="Notificaciones y alertas" className="flex items-center justify-center rounded-full" style={{ width: 32, height: 32, background: unread ? "#fef3c7" : "#e7e5e4", color: unread ? "#92400e" : "#57534e", position: "relative" }}>
        <Bell size={15} />
        {unread > 0 && <span style={{ position: "absolute", top: -3, right: -3, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 9, background: "#be123c", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</span>}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 55 }} />
          <div className="rounded-2xl" style={{ position: "absolute", right: 0, top: 40, width: 340, maxHeight: 440, overflow: "auto", background: "#fff", border: "1px solid #ece9e3", boxShadow: "0 12px 32px rgba(28,25,23,.16)", zIndex: 56 }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid #f0eee9" }}><Bell size={14} color={BRAND} /><span style={{ fontWeight: 700 }}>Notificaciones</span></div>
            {(reqs || []).length > 0 && <div className="px-4 py-2" style={{ background: "#fffbeb" }}>
              <div className="text-xs mb-2 flex items-center gap-1" style={{ color: "#92400e", fontWeight: 700 }}><AlertTriangle size={12} /> Alertas · requieren tu visto bueno</div>
              <div className="space-y-2">{reqs.map((r) => (
                <div key={r.id} className="rounded-xl px-3 py-2" style={{ background: "#fff", border: "1px solid #fde68a" }}>
                  <div className="text-xs" style={{ color: INK }}><b>{r.by}</b> pide mover a Urgente <b>{r.name}</b> a {WEEKLBL[r.toSem]}.{r.displaces.length > 0 && <span style={{ color: "#9f1239" }}> Desplaza {r.displaces.map((d) => `${d.name} (${d.po})`).join(", ")}.</span>}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>{r.at}</div>
                  <div className="flex items-center gap-2 mt-2"><button onClick={() => onReject(r)} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: "#f5f5f4", color: "#57534e", fontWeight: 600 }}><X size={11} /> Rechazar</button><button onClick={() => onApprove(r)} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: BRAND, color: "#fff", fontWeight: 600 }}><Check size={11} /> Aprobar</button></div>
                </div>
              ))}</div>
            </div>}
            <div className="px-4 py-2">
              {(notifs || []).length === 0 && (reqs || []).length === 0 ? <div className="text-xs text-center py-4" style={{ color: "#a8a29e" }}>Sin novedades.</div> :
                <div className="space-y-2">{(notifs || []).map((n) => (
                  <div key={n.id} className="flex items-start gap-2">
                    <span style={{ marginTop: 5, width: 6, height: 6, borderRadius: 6, flexShrink: 0, background: n.sev === "alert" ? "#b45309" : "#d6d3d1" }} />
                    <div><div className="text-xs" style={{ color: INK }}>{n.text}</div><div className="text-xs" style={{ color: "#a8a29e" }}>{n.at}</div></div>
                  </div>
                ))}</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CapStrip({ items, consByW, provByW, lineaView, week, inLinea, inWeek }) {
  const scope = lineaView === "General" ? LINEAS : [lineaView];
  const totalCons = scope.reduce((a, l) => a + ROLES.reduce((b, r) => b + consByW[l][r.id], 0), 0);
  const totalProv = scope.reduce((a, l) => a + ROLES.reduce((b, r) => b + provByW[l][r.id], 0), 0);
  const wf = capFactor(week), wd = workdaysIn(week);
  const totalCap = Math.round(scope.reduce((a, l) => a + totalCapLinea(l), 0) * wf);
  const pct = totalCap ? Math.round((totalCons / totalCap) * 100) : 0, head = statusColor(pct);
  const inScope = items.filter(inLinea).filter(inWeek);
  return (
    <div className="rounded-2xl px-5 py-3 mt-4 flex items-center justify-between flex-wrap gap-4" style={{ background: INK }}>
      <div className="flex items-center gap-4">
        <span style={{ ...serif, fontSize: 38, lineHeight: 1, fontWeight: 700, color: pct >= 100 ? "#fb7185" : pct >= 85 ? "#fbbf24" : "#5eead4" }}>{pct}%</span>
        <div><div className="flex items-center gap-2"><span className="text-sm" style={{ color: PAPER, fontWeight: 600 }}>Capacidad operativa</span><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: head.bar, color: "#fff", fontWeight: 600 }}>{head.label}</span></div><div className="text-xs" style={{ color: "#a8a29e" }}>{lineaView === "General" ? "todos los segmentos" : lineaView} · {WEEKLBL[week]} ({weekRange(week)}) · {totalCons}/{totalCap} h · <span style={{ color: "#93c5fd" }}>+{totalProv} h prov.</span>{wd < 5 ? <span style={{ color: "#fbbf24" }}> · {wd} días laborables</span> : null}</div></div>
      </div>
      <div className="flex items-center gap-5">
        <MiniStat label="Aceptados" value={inScope.filter((i) => i.estado === "aceptado").length} />
        <MiniStat label="Entregadas" value={inScope.filter((i) => i.ejecucion === "entregada").length} />
        <MiniStat label="En revisión" value={inScope.filter((i) => i.estado === "revision").length} />
      </div>
    </div>
  );
}
function MiniStat({ label, value }) { return <div className="text-center"><div style={{ ...serif, fontSize: 22, fontWeight: 700, color: PAPER }}>{value}</div><div className="text-xs" style={{ color: "#78716c" }}>{label}</div></div>; }

function HolidayChip({ setWeek }) {
  const all = Object.keys(HOLIDAYS).sort();
  const [i, setI] = useState(0);
  useEffect(() => { if (all.length <= 1) return; const t = setInterval(() => setI((x) => (x + 1) % all.length), 3800); return () => clearInterval(t); }, [all.length]);
  if (!all.length) return null;
  const d = all[i % all.length], h = HOLIDAYS[d], off = !h.work;
  const ws = weekOfIso(d);
  return (
    <button onClick={() => ws != null && setWeek(ws)} title="Feriados del mes · clic para ir a esa semana" className="rounded-full overflow-hidden flex items-center" style={{ background: "#f0fdfa", border: "1px solid #bae6e0", height: 30, width: 252, maxWidth: "100%", flexShrink: 0 }}>
      <span className="flex items-center justify-center" style={{ width: 26, color: "#0f766e", flexShrink: 0 }}><CalendarDays size={13} /></span>
      <span className="overflow-hidden pr-3 flex items-center" style={{ height: 30, flex: 1, minWidth: 0 }}>
        <style>{`@keyframes hslideup{0%{transform:translateY(115%);opacity:0}100%{transform:translateY(0);opacity:1}}`}</style>
        <span key={i} className="flex items-center gap-1.5 text-xs" style={{ animation: "hslideup .45s ease", color: "#115e59", fontWeight: 600, minWidth: 0, width: "100%" }}>
          <span style={{ width: 6, height: 6, borderRadius: 6, background: off ? "#e11d48" : "#0d9488", display: "inline-block", flexShrink: 0 }} />
          <span className="truncate" style={{ minWidth: 0 }}>{fmt(d)} · {h.name}<span style={{ color: "#6b9b96", fontWeight: 400 }}> · {off ? "no laborable" : "laborable"}</span></span>
        </span>
      </span>
    </button>
  );
}
function NavBtn({ id, icon: Icon, label, view, setView, badge, disabled, title }) { const a = view === id; if (disabled) return <button title={title} disabled className="flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: "transparent", color: "#c4c0b8", fontWeight: 500, cursor: "not-allowed" }}><Icon size={16} /> {label}</button>; return <button onClick={() => setView(id)} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: a ? INK : "transparent", color: a ? PAPER : "#57534e", fontWeight: a ? 600 : 500 }}><Icon size={16} /> {label}{badge ? <span className="ml-1 text-xs px-1.5 rounded-full" style={{ background: a ? BRAND : "#e7e5e4", color: a ? "#fff" : "#57534e" }}>{badge}</span> : null}</button>; }
function Card({ children, style }) { return <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #ece9e3", ...style }}>{children}</div>; }
function Field({ label, children }) { return <div><label className="text-xs block mb-1" style={{ color: "#78716c", fontWeight: 600 }}>{label}</label>{children}</div>; }

function Kpi({ icon: Icon, label, value, sub, dark }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: dark ? INK : "#fff", border: dark ? "none" : "1px solid #ece9e3" }}>
      <div className="flex items-center gap-1.5 mb-1"><Icon size={14} color={dark ? "#5eead4" : BRAND} /><span className="text-xs" style={{ color: dark ? "#a8a29e" : "#78716c", fontWeight: 600 }}>{label}</span></div>
      <div style={{ ...serif, fontSize: 30, lineHeight: 1, fontWeight: 700, color: dark ? PAPER : INK }}>{value}</div>
      <div className="text-xs mt-1.5" style={{ color: dark ? "#78716c" : "#a8a29e" }}>{sub}</div>
    </div>
  );
}
function TrendChart({ points }) {
  const W = 560, H = 168, padX = 34, padY = 26, n = points.length, max = 100;
  const X = (i) => padX + (n <= 1 ? (W - 2 * padX) / 2 : (i * (W - 2 * padX)) / (n - 1));
  const Y = (v) => H - padY - (v / max) * (H - 2 * padY);
  const d = points.map((p, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {[0, 50, 100].map((g) => (<g key={g}><line x1={padX} x2={W - padX} y1={Y(g)} y2={Y(g)} stroke="#f0eee9" strokeWidth="1" /><text x={6} y={Y(g) + 3} fontSize="9" fill="#a8a29e">{g}%</text></g>))}
      {n > 1 && <path d={d} fill="none" stroke={BRAND} strokeWidth="2.5" strokeLinejoin="round" />}
      {points.map((p, i) => (<g key={i}><circle cx={X(i)} cy={Y(p.v)} r="3.5" fill={BRAND} /><text x={X(i)} y={Y(p.v) - 8} fontSize="9" fill={INK} textAnchor="middle" fontWeight="600">{p.v}%</text><text x={X(i)} y={H - 7} fontSize="8" fill="#a8a29e" textAnchor="middle">{p.lbl}</text></g>))}
    </svg>
  );
}

function ReasonBubbleChart({ data }) {
  if (!data.length) return <div className="text-xs" style={{ color: "#a8a29e" }}>Sin datos aún.</div>;
  const max = Math.max(...data.map((d) => d.n)), W = 300, H = 150, n = data.length;
  const short = { retrabajo: "Retrabajo", tiempo: "Más tiempo", cliente: "Cliente", otro: "Otro" };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 150 }}>
      <line x1="0" y1={H - 22} x2={W} y2={H - 22} stroke="#ece9e3" strokeWidth="1" />
      {data.map((d, i) => { const cx = (W / (n + 1)) * (i + 1); const r = 13 + (d.n / max) * 28; const cy = (H - 30) - (d.n / max) * 30; return (
        <g key={d.k}>
          <circle cx={cx} cy={cy} r={r} fill={d.color + "2e"} stroke={d.color} strokeWidth="1.5" />
          <text x={cx} y={cy + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={d.color}>{d.n}</text>
          <text x={cx} y={H - 8} textAnchor="middle" fontSize="9" fill="#78716c">{short[d.k]}</text>
        </g>
      ); })}
    </svg>
  );
}

function Retro({ items, inLinea, inScopePerson, audience, setView }) {
  const [span, setSpan] = useState(8);
  const [fromW, setFromW] = useState(Math.max(MINWEEK, TODAY_WEEK - 1));
  const [showSol, setShowSol] = useState(true);
  const [open, setOpen] = useState({});
  const toggle = (c) => setOpen((p) => ({ ...p, [c]: !p[c] }));
  const toW = Math.min(MAXWEEK, fromW + span - 1);
  const days = []; for (let w = fromW; w <= toW; w++) for (let di = 0; di < 5; di++) days.push({ w, di, date: weekDays(w)[di] });
  const N = days.length;
  const absOf = (w, di) => (w - fromW) * 5 + di;
  const clamp = (x) => Math.max(0, Math.min(N - 1, x));
  const todayAbs = TODAY_WEEK >= fromW && TODAY_WEEK <= toW ? absOf(TODAY_WEEK, TODAY_IDX) : -1;
  const dayPlanIdx = (it) => { if (it.dayPlan) return Object.keys(it.dayPlan).map(Number).filter((d) => it.dayPlan[d] > 0); if (it.dia != null) return [it.dia]; return null; };
  const isSol = (i) => i.estado === "revision" || i.estado === "provisional";
  const startW = (it) => (it.weekPlan ? Math.min(...planWeeks(it)) : it.sem);
  const endW = (it) => (it.weekPlan ? Math.max(...planWeeks(it)) : it.sem);
  const startDi = (it) => { if (it.weekPlan) return 0; const dp = dayPlanIdx(it); return dp ? Math.min(...dp) : 0; };
  const endDi = (it) => { if (it.weekPlan) return 4; const dp = dayPlanIdx(it); return dp ? Math.max(...dp) : 0; };
  const scoped = items.filter((i) => !i.archivado && inLinea(i) && inScopePerson(i) && (i.estado === "aceptado" || (showSol && isSol(i))));
  const overlaps = (it) => { const aw = airWeek(it); const lo = Math.min(startW(it), aw), hi = Math.max(endW(it), aw); return hi >= fromW && lo <= toW; };
  const visible = scoped.filter(overlaps);
  const camps = [...new Set(visible.map((i) => i.campana))].sort((a, b) => { const da = visible.filter((i) => i.campana === a).reduce((m, i) => (i.fAire < m ? i.fAire : m), "9999"); const db = visible.filter((i) => i.campana === b).reduce((m, i) => (i.fAire < m ? i.fAire : m), "9999"); return da.localeCompare(db); });
  const tpl = `200px repeat(${N}, minmax(30px, 1fr))`;
  const SOL_BG = "repeating-linear-gradient(45deg,#bfdbfe,#bfdbfe 3px,#eff6ff 3px,#eff6ff 6px)";
  const Dot = ({ c, dash }) => <span style={{ width: 12, height: 12, borderRadius: 3, background: dash ? SOL_BG : c, border: dash ? "1px dashed #1d4ed8" : "none", display: "inline-block" }} />;
  const winLbl = `${weekStart(fromW).getDate()} ${MONTHS[weekStart(fromW).getMonth()]} – ${addDays(weekStart(toW), 4).getDate()} ${MONTHS[addDays(weekStart(toW), 4).getMonth()]}`;
  const ctrlBtn = { background: "#fff", border: "1px solid #e7e5e4", color: "#57534e", fontWeight: 600 };
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div style={{ ...serif, fontSize: 24, fontWeight: 700, color: INK }}>Retroplanning</div>
        <button onClick={() => { if (typeof window !== "undefined") window.print(); }} title="Genera un PDF para compartir con el cliente (sin costos). En el navegador: Guardar como PDF." className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={ctrlBtn}><PackageCheck size={13} /> Exportar / Imprimir (PDF)</button>
      </div>
      <p className="text-sm mb-3" style={{ color: "#78716c" }}>Cada entregable va desde su <b>ingreso al tráfico</b> hasta su <b>fecha al aire</b>; si reprogramas la tarea, su inicio se mueve. Las barras que <b style={{ color: "#9f1239" }}>cruzan la fecha al aire</b> salen en rojo. Mueve la ventana para ver más adelante.</p>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button onClick={() => setFromW(Math.max(MINWEEK, fromW - 2))} title="Atrás" className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32, ...ctrlBtn }}><ChevronRight size={16} style={{ transform: "rotate(180deg)" }} /></button>
        <span className="text-sm px-3 py-1.5 rounded-full" style={{ background: "#faf9f6", border: "1px solid #ece9e3", color: INK, fontWeight: 600 }}>{winLbl}</span>
        <button onClick={() => setFromW(Math.min(MAXWEEK - 1, fromW + 2))} title="Adelante" className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32, ...ctrlBtn }}><ChevronRight size={16} /></button>
        <button onClick={() => setFromW(Math.max(MINWEEK, TODAY_WEEK - 1))} className="text-xs px-3 py-1.5 rounded-full" style={ctrlBtn}>Hoy</button>
        <div className="flex items-center gap-1 ml-1">{[4, 8, 12].map((sv) => <button key={sv} onClick={() => setSpan(sv)} className="text-xs px-2.5 py-1.5 rounded-full" style={{ background: span === sv ? INK : "#fff", border: "1px solid " + (span === sv ? INK : "#e7e5e4"), color: span === sv ? PAPER : "#57534e", fontWeight: 600 }}>{sv} sem</button>)}</div>
        <button onClick={() => setShowSol(!showSol)} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1 ml-auto" style={{ background: showSol ? "#eff6ff" : "#fff", border: "1px solid " + (showSol ? "#bfdbfe" : "#e7e5e4"), color: showSol ? "#1e40af" : "#57534e", fontWeight: 600 }}><Files size={13} /> {showSol ? "Ocultar solicitudes" : "Ver solicitudes"}</button>
      </div>
      <div className="flex items-center gap-4 mb-4 flex-wrap text-xs" style={{ color: "#57534e" }}>
        <span className="flex items-center gap-1.5"><Dot c={HEALTH.ok.bar} /> En regla</span>
        <span className="flex items-center gap-1.5"><Dot c={HEALTH.risk.bar} /> En riesgo</span>
        <span className="flex items-center gap-1.5"><Dot c={HEALTH.late.bar} /> Cruza la fecha al aire</span>
        <span className="flex items-center gap-1.5"><Dot c="#34d399" /> Finalizada</span>
        <span className="flex items-center gap-1.5"><Dot dash /> Solicitud (por aprobar)</span>
        <span className="flex items-center gap-1.5"><span style={{ width: 12, height: 12, borderRadius: 3, outline: `2px solid ${INK}`, outlineOffset: -2, display: "inline-block" }} /> Día de la fecha al aire</span>
      </div>
      {camps.length === 0 && <Card><div className="text-sm text-center" style={{ color: "#a8a29e" }}>No hay entregables en esta ventana. Mueve las fechas o amplía las semanas.</div></Card>}
      <div className="flex flex-col gap-4">
        {camps.map((camp) => {
          const g = visible.filter((i) => i.campana === camp).sort((a, b) => a.fAire.localeCompare(b.fAire));
          const g0 = g[0], appr = g.filter((i) => !isSol(i)), ch = campHealth(appr.length ? appr : g), lateN = appr.filter((it) => taskRisk(it) === "late").length;
          return (
            <Card key={camp} style={{ padding: 0, overflow: "hidden" }}>
              <div onClick={() => toggle(camp)} className="px-4 py-2.5 flex items-center gap-2 flex-wrap" style={{ borderBottom: open[camp] ? "1px solid #f0eee9" : "none", cursor: "pointer" }}>
                {open[camp] ? <ChevronDown size={16} color="#a8a29e" /> : <ChevronRight size={16} color="#a8a29e" />}
                <Megaphone size={15} color={BRAND} /><span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{camp}</span>
                <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: ch.chip, color: ch.text, fontWeight: 600 }}><CircleDot size={10} /> {ch.label}</span>
                <span className="text-xs" style={{ color: "#a8a29e" }}>{g0.marca} · {catOf(camp)} · {g0.linea} · {g.length} entregables</span>
                {lateN > 0 && <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ml-auto" style={{ background: "#fee2e2", color: "#9f1239", fontWeight: 600 }}><AlertTriangle size={11} /> {lateN} cruzan la fecha al aire · visto bueno cliente</span>}
              </div>
              {open[camp] && <div style={{ overflowX: "auto" }}>
                <div style={{ minWidth: 200 + N * 30 }}>
                  <div style={{ display: "grid", gridTemplateColumns: tpl, alignItems: "stretch", borderBottom: "1px solid #f7f5f1", background: "#faf9f6" }}>
                    <div className="px-3 py-1.5 text-xs" style={{ color: "#a8a29e", fontWeight: 600 }}>Entregable</div>
                    {days.map((d, k) => <div key={k} className="text-center" style={{ padding: "4px 0", borderLeft: d.di === 0 ? "1px solid #ece9e3" : "none", background: k === todayAbs ? "#f0fdfa" : "transparent" }}><div style={{ fontSize: 9, color: k === todayAbs ? BRAND : "#a8a29e", fontWeight: k === todayAbs ? 700 : 500 }}>{DAYS[d.di][0]}</div><div style={{ fontSize: 11, color: k === todayAbs ? BRAND : "#78716c", fontWeight: k === todayAbs ? 700 : 500 }}>{d.date.getDate()}</div>{d.di === 0 && <div style={{ fontSize: 8, color: "#c4c0b8" }}>{MONTHS[d.date.getMonth()]}</div>}</div>)}
                  </div>
                  {g.map((it) => {
                    const aw = airWeek(it), airAbs = clamp(absOf(aw, wdOf(it.fAire)));
                    const sAbs = clamp(absOf(startW(it), startDi(it))), eAbs = clamp(absOf(endW(it), endDi(it)));
                    const bs = Math.min(sAbs, airAbs), be = Math.max(eAbs, airAbs);
                    const done = it.ejecucion === "entregada", solq = isSol(it);
                    const col = done ? "#34d399" : (HEALTH[taskRisk(it)] || HEALTH.ok).bar;
                    return (
                      <div key={it.id} style={{ display: "grid", gridTemplateColumns: tpl, alignItems: "center", borderTop: "1px solid #f7f5f1" }}>
                        <div className="px-3 py-1.5" style={{ minWidth: 0 }}><div className="text-xs truncate" style={{ fontWeight: 600, color: INK }}>{skuById(it.skuId).name} <span style={{ color: "#a8a29e", fontWeight: 400 }}>×{it.cantidad}</span></div><div className="text-xs truncate" style={{ color: "#a8a29e" }}>al aire {fmt(it.fAire)}{it.lab ? " · 9Lab" : ""}{solq ? " · " : ""}{solq && <span style={{ color: "#1e40af", fontWeight: 600 }}>por aprobar</span>}</div></div>
                        {days.map((d, k) => { const on = k >= bs && k <= be, isAir = k === airAbs; return <div key={k} style={{ padding: "0 1px", borderLeft: d.di === 0 ? "1px solid #f0eee9" : "none", background: k === todayAbs ? "#f0fdfa" : "transparent" }}><div title={isAir ? `Fecha al aire: ${fmt(it.fAire)}` : undefined} style={{ height: 18, background: on ? (solq ? SOL_BG : col) : "transparent", borderTopLeftRadius: k === bs ? 5 : 0, borderBottomLeftRadius: k === bs ? 5 : 0, borderTopRightRadius: k === be ? 5 : 0, borderBottomRightRadius: k === be ? 5 : 0, borderTop: on && solq ? "1px dashed #1d4ed8" : "none", borderBottom: on && solq ? "1px dashed #1d4ed8" : "none", outline: isAir ? `2px solid ${INK}` : "none", outlineOffset: -2 }} /></div>; })}
                      </div>
                    );
                  })}
                </div>
              </div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function MiSemana({ items, ptasks, onAddPtask, onTogglePtask, onRemovePtask, me, isDirector, isLab, inScopePerson, setView, onOpenCor }) {
  const mine = items.filter((i) => !i.archivado && inScopePerson(i));
  const riesgo = mine.filter((i) => i.estado === "aceptado" && ["late", "risk"].includes(taskRisk(i))).sort((a, b) => a.fAire.localeCompare(b.fAire));
  const vence = mine.filter((i) => i.estado === "aceptado" && i.ejecucion !== "entregada" && weekFrac(i, TODAY_WEEK) > 0).sort((a, b) => a.fAire.localeCompare(b.fAire));
  const espera = mine.filter((i) => ["revision", "provisional"].includes(i.estado));
  const deleg = items.filter((i) => i.lab && !i.archivado && (isDirector || i.delegBy === me));
  const myPt = ptasks.filter((t) => t.owner === me);
  const ptActive = myPt.filter((t) => !t.done).sort((a, b) => a.date.localeCompare(b.date));
  const ptArch = myPt.filter((t) => t.done).sort((a, b) => b.date.localeCompare(a.date));
  const [nt, setNt] = useState(""); const [nd, setNd] = useState(iso(TODAY));
  const [showArch, setShowArch] = useState(false);
  const today = weekDays(TODAY_WEEK)[TODAY_IDX];
  const Row = ({ it }) => { const r = HEALTH[taskRisk(it)] || HEALTH.ok; return (
    <button onClick={() => onOpenCor(it, "agencia")} className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between gap-2" style={{ background: "#faf9f6", border: "1px solid #f0eee9" }}>
      <div style={{ minWidth: 0 }}><div className="text-sm truncate" style={{ fontWeight: 600, color: INK }}>{skuById(it.skuId).name} <span style={{ color: "#a8a29e", fontWeight: 400 }}>×{it.cantidad}</span></div><div className="text-xs truncate" style={{ color: "#a8a29e" }}>{it.campana} · {it.marca} · {it.linea}{it.lab ? " · 9Lab" : ""}</div></div>
      <span className="text-xs flex items-center gap-1" style={{ color: r.text, fontWeight: 600, whiteSpace: "nowrap" }}><CircleDot size={10} /> {fmt(it.fAire)}</span>
    </button>
  ); };
  const KPI = ({ n, label, color, bg, target }) => <button onClick={() => target && setView(target)} className="rounded-2xl px-4 py-3 text-left flex-1" style={{ background: bg, border: "1px solid #ece9e3", minWidth: 140 }}><div style={{ ...serif, fontSize: 26, fontWeight: 700, color }}>{n}</div><div className="text-xs mt-0.5" style={{ color: "#78716c", fontWeight: 600 }}>{label}</div></button>;
  const ListCard = ({ icon: Icon, color, title, arr, emptyText, target }) => (
    <Card style={{ padding: 0 }}>
      <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: "1px solid #f0eee9" }}>
        <span className="flex items-center gap-2 text-sm" style={{ fontWeight: 700, color: INK }}><Icon size={15} color={color} /> {title}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f0eee9", color: "#57534e", fontWeight: 700 }}>{arr.length}</span>
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        {arr.length === 0 ? <div className="text-xs text-center py-4" style={{ color: "#a8a29e" }}>{emptyText}</div> : arr.slice(0, 6).map((it) => <Row key={it.id} it={it} />)}
        {arr.length > 6 && target && <button onClick={() => setView(target)} className="text-xs mt-1 self-start" style={{ color: BLUE, fontWeight: 600 }}>Ver los {arr.length} →</button>}
      </div>
    </Card>
  );
  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-2 mb-1"><div style={{ ...serif, fontSize: 24, fontWeight: 700, color: INK }}>Mi semana</div><div className="text-xs" style={{ color: "#a8a29e" }}>{isLab ? "Agencia interna 9Lab" : me} · {DAYS[TODAY_IDX]} {today.getDate()} {MONTHS[today.getMonth()]}</div></div>
      <p className="text-sm mb-4" style={{ color: "#78716c" }}>Tu centro de control: lo urgente, lo que vence, lo que espera al cliente y tus pendientes.</p>
      <div className="flex items-stretch gap-3 mb-4 flex-wrap">
        <KPI n={riesgo.length} label="En riesgo de fecha al aire" color="#9f1239" bg="#fff5f5" target="retro" />
        <KPI n={vence.length} label="Vence esta semana" color="#92400e" bg="#fffbeb" target="semana" />
        <KPI n={espera.length} label="Espera al cliente" color="#1e40af" bg="#eff6ff" target="solicitudes" />
        <KPI n={myPt.filter((t) => !t.done).length} label="Mis pendientes" color={INK} bg="#faf9f6" />
      </div>
      <Card style={{ padding: 0, marginTop: 16 }}>
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: "1px solid #f0eee9" }}>
          <span className="flex items-center gap-2 text-sm" style={{ fontWeight: 700, color: INK }}><Sparkles size={15} color={BRAND} /> Mis pendientes <span className="text-xs" style={{ color: "#a8a29e", fontWeight: 400 }}>(notas y tareas internas · no van a COR)</span></span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f0eee9", color: "#57534e", fontWeight: 700 }}>{ptActive.length} abiertas</span>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <input value={nt} onChange={(e) => setNt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { onAddPtask(nt, nd); setNt(""); } }} placeholder="Nueva tarea personal…" style={{ ...dateInput, flex: 1, minWidth: 180, padding: "7px 10px" }} />
            <input type="date" value={nd} onChange={(e) => setNd(e.target.value)} style={{ ...dateInput, padding: "7px 10px" }} />
            <button onClick={() => { onAddPtask(nt, nd); setNt(""); }} className="text-xs px-3 py-2 rounded-full flex items-center gap-1" style={{ background: BRAND, color: "#fff", fontWeight: 600 }}><Check size={13} /> Agregar</button>
          </div>
          <div className="flex flex-col gap-1.5">
            {ptActive.length === 0 ? <div className="text-xs text-center py-3" style={{ color: "#a8a29e" }}>Sin pendientes abiertos. Agrega uno arriba.</div> : ptActive.map((t) => (
              <div key={t.id} className="px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: "#faf9f6", border: "1px solid #f0eee9" }}>
                <button onClick={() => onTogglePtask(t.id)} title="Marcar como terminada (va a archivados)" className="rounded flex items-center justify-center" style={{ width: 20, height: 20, flexShrink: 0, background: "#fff", border: "1px solid #d6d3d1" }} />
                <div className="flex-1" style={{ minWidth: 0 }}><span className="text-sm" style={{ color: INK }}>{t.title}</span></div>
                <span className="text-xs" style={{ color: "#a8a29e", whiteSpace: "nowrap" }}>{fmt(t.date)}</span>
                <button onClick={() => onRemovePtask(t.id)} title="Eliminar" className="rounded flex items-center justify-center" style={{ width: 24, height: 24, color: "#c4c0b8" }}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
          {ptArch.length > 0 && (
            <div className="mt-3" style={{ borderTop: "1px solid #f0eee9", paddingTop: 10 }}>
              <button onClick={() => setShowArch((s) => !s)} className="text-xs flex items-center gap-1.5" style={{ color: "#78716c", fontWeight: 600 }}>{showArch ? <ChevronDown size={13} /> : <ChevronRight size={13} />} Archivados ({ptArch.length})</button>
              {showArch && <div className="flex flex-col gap-1.5 mt-2">{ptArch.map((t) => (
                <div key={t.id} className="px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: "#f7f5f1", border: "1px solid #f0eee9" }}>
                  <button onClick={() => onTogglePtask(t.id)} title="Restaurar" className="rounded flex items-center justify-center" style={{ width: 20, height: 20, flexShrink: 0, background: BRAND, border: `1px solid ${BRAND}` }}><Check size={13} color="#fff" /></button>
                  <div className="flex-1" style={{ minWidth: 0 }}><span className="text-sm" style={{ color: "#a8a29e", textDecoration: "line-through" }}>{t.title}</span></div>
                  <span className="text-xs" style={{ color: "#c4c0b8", whiteSpace: "nowrap" }}>{fmt(t.date)}</span>
                  <button onClick={() => onRemovePtask(t.id)} title="Eliminar" className="rounded flex items-center justify-center" style={{ width: 24, height: 24, color: "#c4c0b8" }}><Trash2 size={13} /></button>
                </div>
              ))}</div>}
            </div>
          )}
        </div>
      </Card>
      <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <ListCard icon={AlertTriangle} color="#be123c" title="En riesgo de fecha al aire" arr={riesgo} emptyText="Nada en riesgo. Vas al día." target="retro" />
        <ListCard icon={Clock} color="#d97706" title="Vence esta semana" arr={vence} emptyText="Sin entregas esta semana." target="semana" />
        {!isLab && <ListCard icon={RefreshCcw} color={BLUE} title="Espera decisión del cliente" arr={espera} emptyText="Nada esperando al cliente." target="solicitudes" />}
      </div>
      <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <ListCard icon={UserPlus} color={BLUE} title={isLab ? "Mis tareas 9Lab" : "Delegado a 9Lab"} arr={deleg} emptyText="Sin tareas en 9Lab." target="lab" />
      </div>
    </div>
  );
}

function Dashboard({ consByW, provByW, items, audience, lineaView, setLineaView, week, savedHours, inScopePerson, isDirector, me, showCap }) {
  const [mes, setMes] = useState("Todos");
  const isLab = lineaView === "9Lab";
  const scope = lineaView === "General" ? LINEAS : [lineaView];
  const inScope = (i) => (isLab ? !!i.lab : scope.includes(i.linea)) && weekFrac(i, week) > 0 && inScopePerson(i);
  const acc = items.filter((i) => i.estado === "aceptado" && inScope(i));
  const entregadas = acc.filter((i) => i.ejecucion === "entregada");
  const cumplimiento = acc.length ? Math.round((entregadas.length / acc.length) * 100) : null;
  const cf = capFactor(week);
  const cons = scope.reduce((a, l) => a + ROLES.reduce((b, r) => b + consByW[l][r.id], 0), 0);
  const cap = Math.round(scope.reduce((a, l) => a + totalCapLinea(l), 0) * cf);
  const ocupacion = cap ? Math.round((cons / cap) * 100) : 0;
  const trend = mes === "Todos"
    ? MESES_TREND.flatMap((m) => MONTH_TREND[m].map((v, i) => ({ v, lbl: `${m.slice(0, 3)} ${i + 1}` }))).filter((p) => p.v > 0)
    : MONTH_TREND[mes].map((v, i) => ({ v, lbl: `Sem ${i + 1}` })).filter((p) => p.v > 0);
  const plan = [16, 19, 14, 22, 12], ent = [14, 17, 13, 16, 9], mx = 22;
  const cumplSemana = Math.round((ent.reduce((a, b) => a + b, 0) / plan.reduce((a, b) => a + b, 0)) * 100);

  // ── Inteligencia operativa (todas las semanas dentro del scope) ──
  const todayIso = iso(TODAY), soonIso = iso(addDays(TODAY, 2));
  const sItems = items.filter((i) => (isLab ? !!i.lab : scope.includes(i.linea)) && !i.archivado && inScopePerson(i));
  const prod = sItems.filter((i) => i.estado === "aceptado");
  const live = prod.filter((i) => i.ejecucion !== "entregada");
  const overdue = live.filter((i) => i.fAire < todayIso);
  const dueSoon = live.filter((i) => i.fAire >= todayIso && i.fAire <= soonIso && i.avance < 80);
  const suspended = sItems.filter((i) => i.estado === "pausada");
  const campOf = (arr) => [...new Set(arr.map((i) => i.campana))];
  const asgTotOf = (i) => ROLES.reduce((x, r) => x + (i.assignedHours[r.id] || 0), 0);
  const withAsg = prod.filter((i) => i.assignedHours);
  const devs = withAsg.map((i) => { const s = suggestedHours(i).tot; return s ? (asgTotOf(i) - s) / s : 0; });
  const avgDev = devs.length ? Math.round((devs.reduce((a, b) => a + b, 0) / devs.length) * 100) : null;
  const overDouble = withAsg.filter((i) => { const s = suggestedHours(i).tot; return s && asgTotOf(i) > 2 * s; });
  const efficientPct = withAsg.length ? Math.round((withAsg.filter((i) => { const s = suggestedHours(i).tot; return s && asgTotOf(i) <= s; }).length / withAsg.length) * 100) : null;
  const decided = sItems.filter((i) => ["aceptado", "provisional", "rechazado"].includes(i.estado));
  const rejected = sItems.filter((i) => i.estado === "rechazado");
  const rejRate = decided.length ? Math.round((rejected.length / decided.length) * 100) : 0;
  const provis = sItems.filter((i) => i.estado === "provisional");
  const revision = sItems.filter((i) => i.estado === "revision");
  const reprog = sItems.filter((i) => i.closeReason);
  const reasonCounts = Object.keys(CLOSE_REASONS).map((k) => ({ k, label: CLOSE_REASONS[k], color: REASON_COLOR[k], n: reprog.filter((i) => i.closeReason === k).length })).filter((x) => x.n > 0);
  const creLoad = ROLES.map((r) => { const c = scope.reduce((a, l) => a + consByW[l][r.id], 0), cp = Math.round(scope.reduce((a, l) => a + CAP[l][r.id], 0) * cf), pct = cp ? Math.round((c / cp) * 100) : 0; const susp = suspended.filter((i) => itemHours(i).per[r.id] > 0).length; return { ...r, person: CREATIVOS[r.id], c, cp, pct, st: statusColor(pct), susp }; });
  const roleOver = creLoad.filter((r) => r.pct > 100);
  const alerts = [
    { k: "venc", n: overdue.length, c: campOf(overdue).length, Icon: AlertTriangle, col: "#9f1239", bg: "#fef2f2", t: "Deadlines vencidos", d: "tareas pasadas de fecha al aire sin finalizar", items: overdue },
    { k: "riesgo", n: dueSoon.length, c: campOf(dueSoon).length, Icon: Hourglass, col: "#92400e", bg: "#fffbeb", t: "En riesgo (≤ 2 días)", d: "vencen pronto y van por debajo del 80%", items: dueSoon },
    { k: "nofin", n: reprog.length, c: campOf(reprog).length, Icon: Clock, col: "#9f1239", bg: "#fef2f2", t: "No finalizadas a tiempo", d: "reprogramadas en el cierre del día · revisa los motivos abajo", items: reprog },
    { k: "susp", n: suspended.length, c: campOf(suspended).length, Icon: Pause, col: "#92400e", bg: "#fffbeb", t: "Tareas suspendidas", d: "fuera del plan · esperan que el cliente las reactive", items: suspended },
    { k: "rol", n: roleOver.length, c: 0, Icon: Gauge, col: roleOver.length ? "#9f1239" : "#0f766e", bg: roleOver.length ? "#fef2f2" : "#f0fdfa", t: "Roles sobre capacidad", d: "creativos por encima del 100% esta semana", items: [] },
  ];
  const totalAlerts = overdue.length + dueSoon.length + suspended.length + roleOver.length + reprog.length;
  const shownAlerts = isDirector ? alerts : alerts.filter((a) => a.k !== "rol");
  const shownTotal = shownAlerts.reduce((s, a) => s + a.n, 0);

  // ── Métricas seguras para cliente (sin horas, costos ni nombres internos) ──
  const cliPend = revision.length;
  const cliLive = live.length;
  const cliDone = prod.filter((i) => i.ejecucion === "entregada");
  const cliCumpl = prod.length ? Math.round((cliDone.length / prod.length) * 100) : null;
  const cliNext = [...live].sort((a, b) => a.fAire.localeCompare(b.fAire)).slice(0, 5);
  const cliCamps = campOf(sItems.filter((i) => i.estado !== "borrador")).map((c) => { const g = sItems.filter((i) => i.campana === c && i.estado !== "borrador"); const ga = g.filter((i) => i.estado === "aceptado"); const av = ga.length ? Math.round(ga.reduce((a, i) => a + i.avance, 0) / ga.length) : 0; return { c, rev: g.filter((i) => i.estado === "revision").length, prov: g.filter((i) => i.estado === "provisional").length, prod: ga.filter((i) => i.ejecucion !== "entregada").length, done: ga.filter((i) => i.ejecucion === "entregada").length, av, marca: g[0].marca }; });

  return (
    <div className="space-y-4">
      {!isDirector && <div className="rounded-xl px-4 py-2.5 text-xs flex items-center gap-2" style={{ background: "#ecfeff", color: "#155e75" }}><User2 size={14} /> Ves como <b style={{ marginLeft: 2 }}>{me}</b> · solo tus campañas y tareas. La capacidad del equipo no se muestra en esta vista.</div>}
      {isDirector && audience === "cliente" && <div className="rounded-xl px-4 py-2.5 text-xs flex items-center gap-2" style={{ background: "#ecfeff", color: "#155e75" }}><Eye size={14} /> Vista cliente · ves estado, avance y entregas de tus campañas. La operación interna queda resguardada.</div>}

      {audience === "cliente" && (
        <div className="grid grid-cols-4 gap-3">
          <Kpi icon={Bell} label="Pendiente de tu decisión" value={cliPend} sub="solicitudes esperan tu aprobación" />
          <Kpi icon={Play} label="En producción" value={cliLive} sub="aceptadas, en curso" />
          <Kpi icon={PackageCheck} label="Entregadas" value={cliDone.length} sub="completadas a la fecha" />
          <Kpi icon={Target} label="Cumplimiento de entregas" value={cliCumpl == null ? "—" : `${cliCumpl}%`} sub="de lo aceptado, ya entregado" />
        </div>
      )}

      {audience === "cliente" && (
        <Card>
          <div className="flex items-center gap-2 mb-4"><CalendarDays size={16} color={BRAND} /><span style={{ fontWeight: 600 }}>Próximas entregas</span><span className="text-xs" style={{ color: "#a8a29e" }}>· {lineaView}</span></div>
          {cliNext.length === 0 ? <div className="text-sm text-center" style={{ color: "#a8a29e" }}>Sin entregas en curso.</div> :
            <div className="space-y-2">{cliNext.map((i) => { const od = overdue.includes(i), rk = dueSoon.includes(i), flag = od ? { t: "Atrasada", c: "#9f1239", bg: "#fef2f2" } : rk ? { t: "En riesgo", c: "#92400e", bg: "#fffbeb" } : null; return (
              <div key={i.id} className="flex items-center gap-3 rounded-xl px-3 py-2 flex-wrap" style={{ background: "#faf9f6", border: "1px solid #ece9e3" }}>
                <div className="flex-1" style={{ minWidth: 160 }}>
                  <div className="text-sm" style={{ fontWeight: 600 }}>{skuById(i.skuId).name} <span style={{ color: "#a8a29e", fontWeight: 400 }}>· {i.campana}</span></div>
                  <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "#a8a29e" }}><Calendar size={11} /> al aire {fmt(i.fAire)}</div>
                </div>
                <div className="flex items-center gap-2" style={{ width: 130 }}><div className="rounded-full overflow-hidden flex-1" style={{ background: "#f0eee9", height: 7 }}><div style={{ width: i.avance + "%", height: "100%", background: BRAND }} /></div><span className="text-xs" style={{ color: "#57534e", fontWeight: 600, width: 30 }}>{i.avance}%</span></div>
                {flag && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: flag.bg, color: flag.c, fontWeight: 600 }}>{flag.t}</span>}
              </div>
            ); })}</div>}
        </Card>
      )}

      {audience === "cliente" && (
        <Card>
          <div className="flex items-center gap-2 mb-4"><Megaphone size={16} color={BRAND} /><span style={{ fontWeight: 600 }}>Estado de tus campañas</span></div>
          {cliCamps.length === 0 ? <div className="text-sm text-center" style={{ color: "#a8a29e" }}>Sin campañas activas.</div> :
            <div className="space-y-3">{cliCamps.map((c) => (
              <div key={c.c} className="rounded-xl px-3 py-2.5" style={{ background: "#faf9f6", border: "1px solid #ece9e3" }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                  <span className="text-sm" style={{ fontWeight: 700 }}>{c.c} <span style={{ color: "#a8a29e", fontWeight: 400 }}>· {c.marca}</span></span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {c.rev > 0 && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fffbeb", color: "#92400e", fontWeight: 600 }}>{c.rev} en revisión</span>}
                    {c.prov > 0 && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#dbeafe", color: "#1e40af", fontWeight: 600 }}>{c.prov} provisional</span>}
                    {c.prod > 0 && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#ccfbf1", color: "#115e59", fontWeight: 600 }}>{c.prod} en producción</span>}
                    {c.done > 0 && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#dcfce7", color: "#166534", fontWeight: 600 }}>{c.done} entregadas</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2"><div className="rounded-full overflow-hidden flex-1" style={{ background: "#f0eee9", height: 7 }}><div style={{ width: c.av + "%", height: "100%", background: BRAND }} /></div><span className="text-xs" style={{ color: "#57534e", fontWeight: 600 }}>{c.av}%</span></div>
              </div>
            ))}</div>}
        </Card>
      )}

      {audience === "agencia" && (isDirector ? (
        <div className="grid grid-cols-3 gap-3">
          <Kpi dark icon={Clock} label="Horas extra evitadas · mes" value={`${savedHours} h`} sub="demanda frenada o reprogramada antes de saturar al equipo" />
          <Kpi icon={PackageCheck} label="Cumplimiento de entregas" value={cumplimiento == null ? "—" : `${cumplimiento}%`} sub={`${entregadas.length}/${acc.length} comprometidos · ${WEEKLBL[week]}`} />
          <Kpi icon={Gauge} label="Ocupación de capacidad" value={`${ocupacion}%`} sub={`${cons}/${cap} h comprometidas`} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Kpi icon={ClipboardList} label="Mis tareas activas" value={acc.filter((i) => i.ejecucion !== "entregada").length} sub={`aceptadas en curso · ${WEEKLBL[week]}`} />
          <Kpi icon={PackageCheck} label="Mi cumplimiento de entregas" value={cumplimiento == null ? "—" : `${cumplimiento}%`} sub={`${entregadas.length}/${acc.length} comprometidos · ${WEEKLBL[week]}`} />
        </div>
      ))}

      {audience === "agencia" && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Bell size={16} color={shownTotal ? "#b45309" : BRAND} /><span style={{ fontWeight: 600 }}>Alertas operativas</span><span className="text-xs" style={{ color: "#a8a29e" }}>· {isDirector ? lineaView : me}</span></div>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: shownTotal ? "#fef2f2" : "#f0fdfa", color: shownTotal ? "#9f1239" : "#0f766e", fontWeight: 700 }}>{shownTotal} activas</span>
          </div>
          <div className={isDirector ? "grid grid-cols-4 gap-3" : "grid grid-cols-3 gap-3"}>{shownAlerts.map((a) => (
            <div key={a.k} className="rounded-xl p-3" style={{ background: a.n ? a.bg : "#faf9f6", border: "1px solid #ece9e3" }}>
              <div className="flex items-center gap-2 mb-0.5"><a.Icon size={15} color={a.n ? a.col : "#a8a29e"} /><span style={{ ...serif, fontSize: 22, fontWeight: 800, color: a.n ? a.col : "#a8a29e" }}>{a.n}</span></div>
              <div className="text-xs" style={{ fontWeight: 700, color: INK }}>{a.t}</div>
              <div className="text-xs mt-0.5" style={{ color: "#78716c" }}>{a.d}</div>
              {a.items.length > 0 && <div className="text-xs mt-1.5" style={{ color: a.col }}>{a.items.slice(0, 2).map((i) => `${skuById(i.skuId).name} · ${i.campana}`).join("  ·  ")}{a.items.length > 2 ? `  +${a.items.length - 2}` : ""}</div>}
              {a.k === "rol" && roleOver.length > 0 && <div className="text-xs mt-1.5" style={{ color: a.col }}>{roleOver.map((r) => `${r.person.split(" ")[0]} ${r.pct}%`).join("  ·  ")}</div>}
            </div>
          ))}</div>
        </Card>
      )}

      {reprog.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2"><Clock size={16} color="#9f1239" /><span style={{ fontWeight: 600 }}>Tareas no finalizadas a tiempo · motivos</span><span className="text-xs" style={{ color: "#a8a29e" }}>· {reprog.length} reprogramadas</span></div>
          </div>
          <div className="grid grid-cols-2 gap-5" style={{ gridTemplateColumns: "1.1fr 0.9fr" }}>
            <div className="space-y-2" style={{ minWidth: 0 }}>{reprog.slice(0, 8).map((it) => (
              <div key={it.id} className="rounded-lg px-3 py-2 flex items-center gap-2" style={{ background: "#faf9f6", border: "1px solid #ece9e3" }}>
                <span className="text-sm flex-1" style={{ fontWeight: 600, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{skuById(it.skuId).name} <span style={{ color: "#a8a29e", fontWeight: 400 }}>· {it.campana}</span></span>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: REASON_COLOR[it.closeReason] + "22", color: REASON_COLOR[it.closeReason], fontWeight: 600 }}>{({ retrabajo: "Retrabajo", tiempo: "Más tiempo", cliente: "Cliente", otro: "Otro" })[it.closeReason]}</span>
                <span title={it.delayInfo ? `Motivo: ${CLOSE_REASONS[it.closeReason]}\n${it.delayInfo.from} → ${it.delayInfo.to}${it.delayInfo.comment ? `\n"${it.delayInfo.comment}"` : ""}` : CLOSE_REASONS[it.closeReason]} style={{ cursor: "help", color: "#a8a29e", flexShrink: 0 }}><Info size={15} /></span>
              </div>
            ))}{reprog.length > 8 && <div className="text-xs" style={{ color: "#a8a29e" }}>+{reprog.length - 8} más</div>}</div>
            <div>
              <div className="text-xs mb-1" style={{ color: "#78716c", fontWeight: 600 }}>¿Qué motivos pesan más?</div>
              <ReasonBubbleChart data={reasonCounts} />
              <div className="flex flex-wrap gap-2 mt-1">{reasonCounts.map((d) => <span key={d.k} className="text-xs flex items-center gap-1" style={{ color: "#78716c" }}><span style={{ width: 9, height: 9, borderRadius: 9, background: d.color, display: "inline-block" }} /> {({ retrabajo: "Retrabajo", tiempo: "Más tiempo", cliente: "Cliente", otro: "Otro" })[d.k]} · {d.n}</span>)}</div>
            </div>
          </div>
          <div className="text-xs mt-3" style={{ color: "#a8a29e" }}>Cada tarea que no se finalizó en su día se reprograma con un motivo. {audience === "cliente" ? "Así sabes por qué se movió cada entrega." : "Si un motivo crece (p. ej. \u201cmás tiempo\u201d), suele indicar subestimación de tiempos o cuellos de botella."}</div>
        </Card>
      )}

      {audience === "agencia" && (
        <div className="grid grid-cols-4 gap-3">
          <Kpi icon={Target} label="Eficiencia de asignación" value={efficientPct == null ? "—" : `${efficientPct}%`} sub={`${overDouble.length} sobre el doble del estimado`} />
          <Kpi icon={avgDev != null && avgDev > 0 ? TrendingUp : TrendingDown} label="Desvío vs. estimado" value={avgDev == null ? "—" : `${avgDev > 0 ? "+" : ""}${avgDev}%`} sub={`asignado vs SKU · ${withAsg.length} tareas`} />
          <Kpi icon={X} label="Tasa de rechazo" value={`${rejRate}%`} sub={`${rejected.length}/${decided.length} decisiones del cliente`} />
          <Kpi icon={Hourglass} label="Provisionales por confirmar" value={provis.length} sub="esperan confirmación del cliente" />
        </div>
      )}

      {audience === "agencia" && isDirector && (
        <Card>
          <div className="flex items-center gap-2 mb-4"><Users size={16} color={BRAND} /><span style={{ fontWeight: 600 }}>Carga por creativo</span><span className="text-xs" style={{ color: "#a8a29e" }}>· {WEEKLBL[week]} · {lineaView}</span></div>
          <div className="space-y-3">{creLoad.map((r) => (
            <div key={r.id}>
              <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                <span className="text-sm" style={{ fontWeight: 600 }}>{r.person} <span style={{ color: "#a8a29e", fontWeight: 400 }}>· {r.name}</span></span>
                <span className="flex items-center gap-2">{r.susp > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: "#fffbeb", color: "#92400e", fontWeight: 600 }}><Pause size={10} /> {r.susp} en pausa</span>}<span className="text-sm" style={{ color: "#78716c" }}>{r.c}/{r.cp} h · <span style={{ color: r.st.text, fontWeight: 600 }}>{r.pct}%</span></span></span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ background: "#f0eee9", height: 8 }}><div style={{ width: Math.min(100, r.pct) + "%", height: "100%", background: r.st.bar }} /></div>
            </div>
          ))}</div>
          <div className="text-xs mt-3" style={{ color: "#a8a29e" }}>Integrantes desde COR. Un creativo sobre 100% o con tareas en pausa pide redistribución.</div>
        </Card>
      )}

      {(isDirector || showCap) && !(!isDirector && lineaView === "General") && (lineaView === "General" ? (
        <Card>
          <div className="flex items-center gap-2 mb-4"><Layers size={16} color={BRAND} /><span style={{ fontWeight: 600 }}>Capacidad por segmento de negocio</span><span className="text-xs ml-1" style={{ color: "#a8a29e" }}>· {WEEKLBL[week]}</span></div>
          <div className="grid grid-cols-2 gap-3">{(isLab ? ["9Lab"] : LINEAS).map((l) => { const c = ROLES.reduce((a, r) => a + consByW[l][r.id], 0), cp = Math.round(totalCapLinea(l) * cf), p = cp ? Math.round((c / cp) * 100) : 0, st = statusColor(p); return <button key={l} onClick={() => setLineaView(l)} className="rounded-xl p-4 text-left" style={{ background: "#faf9f6", border: "1px solid #ece9e3" }}><div className="flex items-center justify-between mb-2"><span className="text-sm" style={{ fontWeight: 600 }}>{l === "9Lab" ? "9Lab · capacidad propia" : l}</span><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: st.chip, color: st.text, fontWeight: 600 }}>{audience === "cliente" ? st.label : `${p}%`}</span></div><div className="rounded-full overflow-hidden" style={{ background: "#f0eee9", height: 8 }}><div style={{ width: Math.min(100, p) + "%", height: "100%", background: st.bar }} /></div>{audience === "agencia" && <div className="text-xs mt-1.5" style={{ color: "#a8a29e" }}>{c} / {cp} h · {l === "9Lab" ? "modular + externo" : "equipo propio"}</div>}</button>; })}</div>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Layers size={16} color={BRAND} /><span style={{ fontWeight: 600 }}>{audience === "cliente" ? "Disponibilidad · " : "Carga por rol · "}{lineaView}</span><span className="text-xs" style={{ color: "#a8a29e" }}>· {WEEKLBL[week]}</span></div><div className="flex items-center gap-3 text-xs" style={{ color: "#78716c" }}><span className="flex items-center gap-1"><span style={{ width: 10, height: 10, background: BRAND, borderRadius: 3, display: "inline-block" }} /> COR</span><span className="flex items-center gap-1"><span style={{ width: 10, height: 10, background: "#bfdbfe", borderRadius: 3, display: "inline-block" }} /> prov.</span></div></div>
          <div className="space-y-4">{ROLES.map((r) => { const c = consByW[lineaView][r.id], pv = provByW[lineaView][r.id], cp = Math.round(CAP[lineaView][r.id] * cf), pct = cp ? Math.round((c / cp) * 100) : 0, st = statusColor(pct); return <div key={r.id}><div className="flex items-center justify-between mb-1.5"><span className="text-sm" style={{ fontWeight: 600 }}>{r.name}</span>{audience === "agencia" ? <span className="text-sm" style={{ color: "#78716c" }}>{c} / {cp} h · <span style={{ color: st.text, fontWeight: 600 }}>{pct}%</span></span> : <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: st.chip, color: st.text, fontWeight: 600 }}>{st.label}</span>}</div><div className="rounded-full overflow-hidden flex" style={{ background: "#f0eee9", height: 10 }}><div style={{ width: Math.min(100, pct) + "%", height: "100%", background: st.bar }} /><div style={{ width: Math.min(Math.max(0, 100 - pct), cp ? (pv / cp) * 100 : 0) + "%", height: "100%", background: "#bfdbfe" }} /></div></div>; })}</div>
        </Card>
      ))}

      {audience === "agencia" && isDirector && (
        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2"><TrendingUp size={16} color={BRAND} /><span style={{ fontWeight: 600 }}>Tendencia de demanda</span><span className="text-xs" style={{ color: "#a8a29e" }}>· % de ocupación por semana</span></div>
            <select value={mes} onChange={(e) => setMes(e.target.value)} style={{ ...dateInput, padding: "5px 9px" }}><option value="Todos">Todos los meses</option>{MESES_TREND.map((m) => <option key={m}>{m}</option>)}</select>
          </div>
          <TrendChart points={trend} />
        </Card>
      )}

      {audience === "agencia" && isDirector && (
        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2"><PackageCheck size={16} color={BRAND} /><span style={{ fontWeight: 600 }}>Eficiencia del equipo · {WEEKLBL[week]}</span></div>
            <div className="flex items-center gap-3 text-xs" style={{ color: "#78716c" }}><span style={{ fontWeight: 600, color: INK }}>{cumplSemana}% cumplimiento</span><span className="flex items-center gap-1"><span style={{ width: 10, height: 10, background: "#d6d3d1", borderRadius: 2, display: "inline-block" }} /> comprometidas</span><span className="flex items-center gap-1"><span style={{ width: 10, height: 10, background: BRAND, borderRadius: 2, display: "inline-block" }} /> cumplidas</span></div>
          </div>
          <div className="flex items-end justify-between gap-2" style={{ height: 130 }}>{DAYS.map((d, i) => (<div key={d} className="flex-1 flex flex-col items-center gap-1"><div className="flex items-end gap-1" style={{ height: 100 }}><div style={{ width: 14, height: (plan[i] / mx) * 100, background: "#d6d3d1", borderRadius: 3 }} /><div style={{ width: 14, height: (ent[i] / mx) * 100, background: BRAND, borderRadius: 3 }} /></div><span className="text-xs" style={{ color: "#a8a29e" }}>{d}</span></div>))}</div>
          <div className="text-xs mt-3" style={{ color: "#a8a29e" }}>Entregas comprometidas vs. cumplidas en la semana. Una brecha sostenida señala sobrecarga del equipo.</div>
        </Card>
      )}
    </div>
  );
}

function Pedidos({ items, audience, mode = "tareas", inWeek, inLinea, consByW, campOrder, lineaView, week, inScopePerson, isDirector, isLab, onAccept, onReject, onProvisional, onReactivar, onEdit, onDelete, onEjec, onCopy, onOpenCor, onTime, onArchive, onArchiveCamp, onRetro, onDelegar, onDevolver }) {
  const sol = mode === "solicitudes";
  const apr = mode === "aprobaciones";
  const lab = mode === "lab";
  const solLike = sol || apr;
  const [fEje, setFEje] = useState("todos"); const [fCamp, setFCamp] = useState("todas"); const [fPo, setFPo] = useState("todos"); const [fEst, setFEst] = useState("todos"); const [fArch, setFArch] = useState("activas"); const [fWk, setFWk] = useState("todas"); const [fSort, setFSort] = useState("antiguas");
  const [open, setOpen] = useState({});
  let list = lab ? items.filter((i) => i.lab) : items.filter(inLinea).filter(inScopePerson).filter((i) => !i.lab);
  if (!solLike && !lab) list = list.filter(inWeek);
  if (apr) list = list.filter((i) => i.reentry && ["pausada", "revision", "provisional"].includes(i.estado));
  else if (sol) { if (audience === "cliente") list = list.filter((i) => !i.reentry && (i.estado === "revision" || i.estado === "provisional")); else list = list.filter((i) => i.estado === "revision" || i.estado === "provisional" || i.estado === "pausada" || i.estado === "borrador"); }
  else list = list.filter((i) => i.estado === "aceptado").filter((i) => (fArch === "archivadas" ? i.archivado : !i.archivado));
  if (solLike && fWk !== "todas") list = list.filter((i) => weekFrac(i, Number(fWk)) > 0);
  if (fEje !== "todos") list = list.filter((i) => i.ejecutivo === fEje);
  if (fCamp !== "todas") list = list.filter((i) => i.campana === fCamp);
  if (audience === "cliente" && fPo !== "todos") list = list.filter((i) => i.poCliente === fPo);
  if (solLike && fEst !== "todos") list = list.filter((i) => i.estado === fEst);
  const arch = !solLike && fArch === "archivadas";
  const crank = (camp) => { const g = list.find((i) => i.campana === camp); const arr = campOrder[g.linea] || []; const r = arr.indexOf(camp); return r < 0 ? 999 : r; };
  const campDate = (camp) => list.filter((i) => i.campana === camp).reduce((m, i) => (i.fAire < m ? i.fAire : m), "9999-99-99");
  const camps = [...new Set(list.map((i) => i.campana))].sort((a, b) => (solLike ? (fSort === "antiguas" ? campDate(a).localeCompare(campDate(b)) : campDate(b).localeCompare(campDate(a))) : crank(a) - crank(b)));
  const isCampOpen = (c) => open[c] !== false;
  const toggle = (c) => setOpen((p) => ({ ...p, [c]: p[c] === false ? true : false }));
  const Sel = ({ value, set, opts, label }) => <select value={value} onChange={(e) => set(e.target.value)} style={{ ...dateInput, padding: "5px 9px" }}>{opts.map((o, i) => <option key={o.v} value={o.v}>{i === 0 ? `${label}: ${o.t}` : o.t}</option>)}</select>;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {!solLike && <button onClick={() => setFArch(arch ? "activas" : "archivadas")} title={arch ? "Viendo el repositorio · clic para volver a activas" : "Ver archivadas (repositorio)"} className="rounded-full flex items-center justify-center" style={{ width: 34, height: 34, background: arch ? "#fef3c7" : "#fff", border: `1px solid ${arch ? "#fcd34d" : "#e7e5e4"}`, color: arch ? "#92400e" : "#78716c", flexShrink: 0 }}><Archive size={16} /></button>}
        {isDirector && <Sel value={fEje} set={setFEje} label="Ejecutivo" opts={[{ v: "todos", t: "todos" }, ...EJECUTIVOS.map((e) => ({ v: e, t: e }))]} />}
        <Sel value={fCamp} set={setFCamp} label="Campaña" opts={[{ v: "todas", t: "todas" }, ...CAMPANAS.map((c) => ({ v: c, t: c }))]} />
        {audience === "cliente" && isDirector && <Sel value={fPo} set={setFPo} label="PO" opts={[{ v: "todos", t: "todos" }, ...POS.map((p) => ({ v: p, t: p }))]} />}
        {solLike && <Sel value={fWk} set={setFWk} label="Semana" opts={[{ v: "todas", t: "todas" }, ...WEEKS.map((w) => ({ v: String(w), t: w === 0 ? "Sem. actual" : weekRange(w) }))]} />}
        {solLike && <Sel value={fSort} set={setFSort} label="Orden" opts={[{ v: "antiguas", t: "Más antiguas primero" }, { v: "recientes", t: "Más recientes primero" }]} />}
        {sol && <Sel value={fEst} set={setFEst} label="Estado" opts={[{ v: "todos", t: "todos" }, { v: "revision", t: "En revisión" }, { v: "provisional", t: "Provisional" }, ...(audience === "agencia" ? [{ v: "pausada", t: "Pausadas" }] : [])]} />}
      </div>
      <div className="text-xs mb-3 flex items-center gap-1.5" style={{ color: "#78716c" }}>{lab ? <><UserPlus size={13} color={BLUE} /> Tareas delegadas a 9Lab (agencia interna). {isLab ? "Trabájalas con su COR de agencia; el cliente y sus costos no se ven aquí." : "El Director o el ejecutivo pueden devolverlas a su dueño original."}</> : apr ? <><RefreshCcw size={13} color={BLUE} /> Reingresos: tareas que vuelven a tu aprobación (misma tarea en COR y tiempos ya registrados). Al aceptarlas o reactivarlas se vuelven a planificar.</> : sol ? <><Files size={13} color={BRAND} /> {audience === "cliente" ? "Pedidos nuevos por decidir" : "Solicitudes"} de todas las semanas, ordenadas por fecha al aire ({fSort === "antiguas" ? "más antiguas primero" : "más recientes primero"}). Al aceptarlas pasan a Tareas.</> : arch ? <><PackageCheck size={13} color="#92400e" /> Repositorio de tareas y campañas finalizadas. Puedes restaurarlas si hace falta.</> : <><ListOrdered size={13} color={BRAND} /> Tareas aceptadas, ordenadas por la prioridad que marcó el cliente.</>}</div>
      {camps.length === 0 && <Card><div className="text-sm text-center" style={{ color: "#a8a29e" }}>{lab ? "Sin tareas delegadas a 9Lab." : apr ? "Sin reingresos por aprobar." : sol ? "Sin pendientes en esta semana." : arch ? "Aún no hay nada archivado en esta semana." : "Sin tareas aceptadas en esta semana o filtro."}</div></Card>}
      <div className="space-y-3">
        {camps.map((camp) => {
          const group = list.filter((i) => i.campana === camp).sort((a, b) => (solLike ? (fSort === "antiguas" ? a.fAire.localeCompare(b.fAire) : b.fAire.localeCompare(a.fAire)) : a.prio - b.prio)), g0 = group[0];
          const revis = group.filter((i) => i.estado === "revision"), gh = revis.reduce((a, i) => a + itemHours(i).tot, 0);
          const consL = ROLES.reduce((a, r) => a + consByW[g0.linea][r.id], 0), cap = Math.round(totalCapLinea(g0.linea) * capFactor(week)), projPct = cap ? Math.round(((consL + gh) / cap) * 100) : 0;
          const campWeekH = group.filter((i) => i.estado === "aceptado" || i.estado === "provisional").reduce((a, i) => a + itemHoursWeek(i, week).tot, 0);
          const scopeCap = lineaView === "General" ? Math.round(LINEAS.reduce((a, l) => a + totalCapLinea(l), 0) * capFactor(week)) : cap;
          const campPct = scopeCap ? Math.round((campWeekH / scopeCap) * 100) : 0, cst = statusColor(campPct);
          const reqH = group.reduce((a, i) => a + itemHours(i).tot, 0);
          const prank = (campOrder[g0.linea] || []).indexOf(camp), isOpen = isCampOpen(camp);
          const allDone = group.every((i) => i.ejecucion === "entregada");
          return (
            <Card key={camp} style={{ padding: 0 }}>
              <div className="px-4 py-2 flex items-center justify-between flex-wrap gap-2" onClick={() => toggle(camp)} style={{ borderBottom: isOpen ? "1px solid #f0eee9" : "none", cursor: "pointer" }}>
                <div className="flex items-center gap-3">
                  {isOpen ? <ChevronDown size={16} color="#a8a29e" /> : <ChevronRight size={16} color="#a8a29e" />}
                  {prank >= 0 && !arch && <span className="rounded-md flex items-center justify-center" title="Prioridad del cliente" style={{ width: 22, height: 22, background: prank === 0 ? BRAND : "#f0eee9", color: prank === 0 ? "#fff" : "#57534e", fontWeight: 700, fontSize: 12 }}>{prank + 1}</span>}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap"><Megaphone size={14} color={arch ? "#a8a29e" : BRAND} /><span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{camp}</span><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f0eee9", color: "#57534e" }}>{group.length} entregables</span>{!solLike && !arch && (() => { const ch = campHealth(group); return <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" title="Salud de la campaña según fechas al aire y estado de las tareas" style={{ background: ch.chip, color: ch.text, fontWeight: 600 }}><CircleDot size={10} /> {ch.label}</span>; })()}{solLike ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fffbeb", color: "#92400e", fontWeight: 600 }}>{reqH} h por decidir</span> : !arch && <span className="text-xs px-2 py-0.5 rounded-full" title={`Ocupa ${campWeekH} h · ${campPct}% de la capacidad ${lineaView === "General" ? "total" : "de " + g0.linea} en ${WEEKLBL[week]}`} style={{ background: cst.chip, color: cst.text, fontWeight: 600 }}>{campPct}% de la semana</span>}{arch && <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "#fef3c7", color: "#92400e", fontWeight: 600 }}><Archive size={11} /> Archivada</span>}</div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: "#a8a29e" }}><span className="flex items-center gap-1"><Building2 size={11} /> {g0.marca}</span><span className="flex items-center gap-1"><CircleDot size={11} /> {catOf(g0.campana)}</span><span className="flex items-center gap-1"><Layers size={11} /> {g0.linea}</span>{audience === "cliente" && <span className="flex items-center gap-1"><User2 size={11} /> PO {g0.poCliente}</span>}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!solLike && audience === "agencia" && arch && <button onClick={(e) => { e.stopPropagation(); onArchiveCamp(group.map((i) => i.id), false); }} className="text-xs flex items-center gap-1 rounded-full px-3 py-1.5" style={{ background: "#f0fdfa", border: "1px solid #bae6e0", color: "#115e59", fontWeight: 600 }}><ArchiveRestore size={13} /> Restaurar campaña</button>}
                  {!solLike && audience === "agencia" && !arch && allDone && <button onClick={(e) => { e.stopPropagation(); onArchiveCamp(group.map((i) => i.id), true); }} className="text-xs flex items-center gap-1 rounded-full px-3 py-1.5" style={{ background: "#fef3c7", border: "1px solid #fcd34d", color: "#92400e", fontWeight: 600 }}><Archive size={13} /> Archivar campaña</button>}
                </div>
              </div>
              {isOpen && <div>{group.map((it, idx) => <ItemRow key={it.id} it={it} idx={idx} rank={idx + 1} audience={audience} arch={arch} showWeek={solLike || lab} isLab={isLab} labView={lab} onAccept={onAccept} onReject={onReject} onProvisional={onProvisional} onReactivar={onReactivar} onEdit={onEdit} onDelete={onDelete} onEjec={onEjec} onCopy={onCopy} onOpenCor={onOpenCor} onTime={onTime} onArchive={onArchive} onRetro={onRetro} onDelegar={onDelegar} onDevolver={onDevolver} />)}</div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
function ItemRow({ it, idx, rank, audience, arch, showWeek, isLab, labView, onAccept, onReject, onProvisional, onReactivar, onEdit, onDelete, onEjec, onCopy, onOpenCor, onTime, onArchive, onRetro, onDelegar, onDevolver }) {
  const sku = skuById(it.skuId), et = etById(it.etiqueta), { per, tot } = itemHours(it), es = ESTADO[it.estado], ej = it.ejecucion ? EJEC[it.ejecucion] : null;
  const breakdown = ROLES.filter((r) => per[r.id] > 0).map((r) => `${r.name}: ${per[r.id]} h`).join("   ·   ");
  const sugTot = suggestedHours(it).tot, asgTot = it.assignedHours ? ROLES.reduce((a, r) => a + (it.assignedHours[r.id] || 0), 0) : sugTot, over = sugTot ? asgTot / sugTot : 1;
  const tcol = !it.assignedHours ? { bg: "#f5f5f4", c: "#57534e", lab: "Tiempo asignado por rol" } : over > 2 ? { bg: "#fee2e2", c: "#9f1239", lab: "Sobre el doble del estimado" } : over > 1 ? { bg: "#fef3c7", c: "#92400e", lab: "Sobre el tiempo estimado" } : { bg: "#ccfbf1", c: "#115e59", lab: "Tiempo eficiente (bajo el estimado)" };
  return (
    <div className="px-4 py-2 flex items-start justify-between flex-wrap gap-3" style={{ borderTop: idx ? "1px solid #f7f5f1" : "none" }}>
      <div className="flex-1" style={{ minWidth: 220 }}>
        <div className="flex items-center gap-2 flex-wrap">
          {rank && <span className="text-xs" style={{ color: "#c4c0b8", fontWeight: 700 }}>#{rank}</span>}
          <span className="text-sm" style={{ fontWeight: 600 }}>{sku.name} <span style={{ color: "#a8a29e" }}>×{it.cantidad}</span></span>
          {it.weekPlan && <span className="text-xs px-1.5 py-0.5 rounded flex items-center gap-1" title="Una sola tarea, repartida en varias semanas" style={{ background: "#ecfeff", color: "#155e75", fontWeight: 600 }}><CalendarDays size={9} /> en {planWeeks(it).length} sem</span>}
          {audience === "agencia" && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#f0eee9", color: "#57534e", fontWeight: 600 }}>{et.name}</span>}
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: es.bg, color: es.fg, fontWeight: 600 }}>{es.label}</span>
          {ej && it.estado !== "pausada" && <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: ej.c + "1e", color: ej.c, fontWeight: 600 }}><ej.icon size={11} /> {ej.label}</span>}
          {it.delayed && <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" title={it.delayInfo ? `Reprogramada del ${it.delayInfo.from} al ${it.delayInfo.to} · ${it.delayInfo.comment || ""}` : "Reprogramada con retraso"} style={{ background: "#fef2f2", color: "#9f1239", fontWeight: 600 }}><Clock size={10} /> Retraso{it.delayInfo ? ` → ${it.delayInfo.to}` : ""}</span>}
          {it.reentry && <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" title="Reingreso · misma tarea en COR, tiempos ya registrados. Al aceptarla se vuelve a planificar." style={{ background: "#eef2ff", color: "#1e40af", fontWeight: 600 }}><RefreshCcw size={10} /> Reingreso</span>}
          {it.lab && <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" title={it.delegBy ? `Delegada a 9Lab por ${it.delegBy}` : "Delegada a 9Lab"} style={{ background: "#eef2ff", color: "#1e40af", fontWeight: 600 }}><UserPlus size={10} /> 9Lab{it.delegBy ? ` · de ${it.delegBy.split(" ")[0]}` : ""}</span>}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs flex-wrap" style={{ color: "#a8a29e" }}>
          <span className="flex items-center gap-1"><Calendar size={11} /> aire {fmt(it.fAire)}</span>
          {showWeek && <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: "#f0eee9", color: "#57534e", fontWeight: 600 }}><CalendarDays size={10} /> {it.weekPlan ? `${planWeeks(it).length} sem` : WEEKLBL[it.sem]}</span>}
          {audience === "agencia" && <span className="flex items-center gap-1"><User2 size={11} /> {it.ejecutivo}</span>}
          <span className="flex items-center gap-1">{tot} h{audience === "agencia" && <span title={(it.assignedHours ? "Tiempo asignado · " : "Tiempo sugerido · ") + breakdown} style={{ cursor: "help", display: "inline-flex" }}><Clock size={11} color={it.assignedHours ? tcol.c : "#c4c0b8"} /></span>}</span>
          {it.corId && (audience === "cliente"
            ? <span className="flex items-center gap-1"><button onClick={() => onOpenCor(it, "cliente")} className="px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: "#eef2ff", color: BLUE, fontWeight: 600 }}>{it.corCli} <ExternalLink size={11} /></button><button onClick={() => onCopy(it.corCli)} title="Copiar link" style={{ color: BLUE }}><Copy size={12} /></button></span>
            : isLab
            ? <span className="flex items-center gap-1"><button onClick={() => onOpenCor(it, "agencia")} title="Abrir ficha del proyecto AGENCIA" className="px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: "#eef2ff", color: BLUE, fontWeight: 600 }}><span style={{ fontSize: 9, opacity: .7, fontWeight: 700 }}>AGENCIA</span> {it.corId} <ExternalLink size={10} /></button><button onClick={() => onCopy(it.corId)} title="Copiar link AGENCIA" style={{ color: BLUE }}><Copy size={11} /></button></span>
            : <span className="flex items-center gap-2 flex-wrap"><span className="flex items-center gap-1"><button onClick={() => onOpenCor(it, "cliente")} title="Abrir ficha del proyecto CLIENTE" className="px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: "#eef2ff", color: BLUE, fontWeight: 600 }}><span style={{ fontSize: 9, opacity: .7, fontWeight: 700 }}>CLIENTE</span> {it.corCli} <ExternalLink size={10} /></button><button onClick={() => onCopy(it.corCli)} title="Copiar link CLIENTE" style={{ color: BLUE }}><Copy size={11} /></button></span><span className="flex items-center gap-1"><button onClick={() => onOpenCor(it, "agencia")} title="Abrir ficha del proyecto AGENCIA" className="px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: "#eef2ff", color: BLUE, fontWeight: 600 }}><span style={{ fontSize: 9, opacity: .7, fontWeight: 700 }}>AGENCIA</span> {it.corId} <ExternalLink size={10} /></button><button onClick={() => onCopy(it.corId)} title="Copiar link AGENCIA" style={{ color: BLUE }}><Copy size={11} /></button></span></span>)}
        </div>
        {it.estado === "pausada" && <div className="text-xs mt-1 flex items-center gap-1" style={{ color: "#b45309" }}><Pause size={11} /> La agencia suspendió esta tarea · {audience === "cliente" ? "reactívala para que vuelva a planificarse." : "esperando que el cliente la reactive."}</div>}
      </div>
      <div className="flex items-center gap-2">
        {it.estado === "aceptado" && <div className="flex items-center gap-2"><div className="rounded-full overflow-hidden" style={{ width: 60, height: 7, background: "#f0eee9" }}><div style={{ width: it.avance + "%", height: "100%", background: BRAND }} /></div><span className="text-xs" style={{ color: "#57534e", fontWeight: 600 }}>{it.avance}%</span>{audience === "agencia" && !arch && <select value={it.ejecucion || "sin_iniciar"} onChange={(e) => onEjec(it, e.target.value)} style={{ ...dateInput, padding: "3px 6px", fontSize: 11 }}>{EJEC_ORDER.map((k) => <option key={k} value={k}>{EJEC[k].label}</option>)}</select>}</div>}
        {audience === "agencia" && arch && <button onClick={() => onArchive(it, false)} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: "#f0fdfa", border: "1px solid #bae6e0", color: "#115e59", fontWeight: 600 }}><ArchiveRestore size={13} /> Restaurar</button>}
        {audience === "agencia" && !arch && it.ejecucion === "entregada" && <button onClick={() => onArchive(it, true)} title="Enviar al repositorio" className="rounded-full flex items-center justify-center" style={{ width: 30, height: 30, background: "#fef3c7", color: "#92400e" }}><Archive size={14} /></button>}
        {audience === "agencia" && !arch && it.estado !== "rechazado" && <>{it.estado === "aceptado" && <button onClick={() => onRetro(it)} title="Crear retrabajo / incidencia (se envía a COR)" className="rounded-full flex items-center justify-center" style={{ width: 30, height: 30, background: (it.retrabajos || []).length ? "#eef2ff" : "#f5f5f4", color: BLUE, position: "relative" }}><RefreshCcw size={14} />{(it.retrabajos || []).length > 0 && <span style={{ position: "absolute", top: -3, right: -3, minWidth: 14, height: 14, padding: "0 3px", borderRadius: 7, background: BLUE, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{it.retrabajos.length}</span>}</button>}<button onClick={() => onTime(it)} title={tcol.lab} className="rounded-full flex items-center justify-center" style={{ width: 30, height: 30, background: tcol.bg, color: tcol.c }}><SlidersHorizontal size={14} /></button>{!isLab && <IconBtn icon={Pencil} onClick={() => onEdit(it)} />}{!isLab && <IconBtn icon={Trash2} onClick={() => onDelete(it)} danger />}{!isLab && !labView && it.estado === "aceptado" && !it.lab && <button onClick={() => onDelegar(it)} title="Delegar a 9Lab (cambia de dueño al Ejecutivo 9Lab)" className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: "#eef2ff", color: "#1e40af", fontWeight: 600 }}><Send size={12} /> 9Lab</button>}{!isLab && labView && it.lab && <button onClick={() => onDevolver(it)} title={`Devolver a ${it.delegBy || "su dueño"}`} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: "#f5f5f4", color: "#57534e", fontWeight: 600 }}><ArrowLeft size={12} /> Devolver</button>}</>}
        {audience === "cliente" && it.estado === "revision" && <><button onClick={() => onProvisional(it)} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: "#dbeafe", color: "#1e40af", fontWeight: 600 }}><Clock size={12} /> Provisional</button><button onClick={() => onReject(it)} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: "#f5f5f4", color: "#57534e", fontWeight: 600 }}><X size={12} /> Rechazar</button><button onClick={() => onAccept(it)} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: BRAND, color: "#fff", fontWeight: 600 }}><Check size={12} /> Aceptar</button></>}
        {audience === "cliente" && it.estado === "provisional" && <button onClick={() => onAccept(it)} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: BRAND, color: "#fff", fontWeight: 600 }}><Check size={12} /> Confirmar</button>}
        {audience === "cliente" && it.estado === "pausada" && <button onClick={() => onReactivar(it)} title="Reactivar · vuelve a planificarse" className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: BRAND, color: "#fff", fontWeight: 600 }}><Play size={12} /> Reactivar</button>}
      </div>
    </div>
  );
}
function IconBtn({ icon: Icon, onClick, danger }) { return <button onClick={onClick} className="rounded-full flex items-center justify-center" style={{ width: 30, height: 30, background: "#f5f5f4", color: danger ? "#be123c" : "#57534e" }}><Icon size={14} /></button>; }

function WeekPreview({ items, linea, week, incoming, toDia, victimId, actingPO, onPick, urgent = true }) {
  const days = weekDays(week), dailyCap = Math.round(totalCapLinea(linea) / 5);
  const off = (di) => isOff(iso(days[di]));
  const startDi = week === TODAY_WEEK ? Math.max(0, TODAY_IDX) : 0;
  const lastWork = [4, 3, 2, 1, 0].find((i) => !off(i));
  const tasks = items.filter((i) => i.linea === linea && weekFrac(i, week) > 0 && (i.estado === "aceptado" || i.estado === "provisional"));
  const ordered = [...tasks].sort((a, b) => a.prio - b.prio);
  const cols = [[], [], [], [], []], load = [0, 0, 0, 0, 0];
  ordered.forEach((t) => { if (t.dayPlan && !t.weekPlan) Object.keys(t.dayPlan).forEach((d) => { cols[+d].push({ it: t, h: t.dayPlan[d] }); load[+d] += t.dayPlan[d]; }); });
  ordered.forEach((t) => { if (!t.weekPlan && !t.dayPlan && t.dia != null) { const h = itemHoursWeek(t, week).tot; cols[t.dia].push({ it: t, h }); load[t.dia] += h; } });
  ordered.forEach((t) => { if (!t.weekPlan && (t.dayPlan || t.dia != null)) return; let rem = itemHoursWeek(t, week).tot; for (let i = startDi; i < 5 && rem > 0; i++) { if (off(i)) continue; const free = Math.max(0, dailyCap - load[i]); if (free <= 0) continue; const take = Math.min(free, rem); cols[i].push({ it: t, h: take }); load[i] += take; rem -= take; } if (rem > 0 && lastWork != null) { cols[lastWork].push({ it: t, h: rem }); load[lastWork] += rem; } });
  const incH = incoming ? itemHours(incoming).tot : 0;
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {days.map((d, di) => {
        const dayOff = off(di), extra = incoming && di === toDia ? incH : 0, dh = load[di] + extra, pct = dailyCap ? Math.round((dh / dailyCap) * 100) : 0, st = statusColor(pct);
        return (
          <div key={di} className="rounded-lg" style={{ background: dayOff ? "#fef2f2" : "#fff", border: dayOff ? "1px dashed #fca5a5" : "1px solid #ece9e3", minHeight: 104 }}>
            <div className="px-1.5 py-1 flex items-center justify-between" style={{ borderBottom: "1px solid #f0eee9" }}><span style={{ fontSize: 10, fontWeight: 700, color: dayOff ? "#9f1239" : INK }}>{DAYS[di]} {d.getDate()}</span>{!dayOff && <span style={{ fontSize: 9, color: st.text, fontWeight: 700 }}>{dh}/{dailyCap}</span>}</div>
            <div className="p-1 space-y-1">
              {incoming && di === toDia && <div className="rounded px-1.5 py-1" style={{ background: urgent ? "#fef3c7" : "#ecfeff", border: `1px solid ${urgent ? "#fcd34d" : "#a5d8d4"}` }}><div style={{ fontSize: 9, fontWeight: 700, color: urgent ? "#92400e" : "#115e59" }}>↑ {skuById(incoming.skuId).name}</div><div style={{ fontSize: 9, color: urgent ? "#b45309" : "#0f766e" }}>{incH}h · {urgent ? "Urgente" : "adelantada"}</div></div>}
              {cols[di].map((seg, si) => {
                const it = seg.it, own = it.poCliente === actingPO, isV = it.id === victimId, sel = !!onPick && it.ejecucion !== "entregada";
                return (
                  <button key={si} onClick={() => sel && onPick(it.id)} disabled={!sel} title={sel ? (own ? "Tu tarea · reemplázala con la urgente (se aplica de inmediato)" : `Tarea de ${it.poCliente} · a cargo de ${it.ejecutivo} · requiere su visto bueno`) : "No se puede reemplazar"} className="w-full text-left rounded px-1.5 py-1" style={{ background: isV ? "#fff1f2" : own ? "#f0fdfa" : "#faf9f6", border: `1px solid ${isV ? "#fecaca" : own ? "#bae6e0" : "#ece9e3"}`, borderLeft: `3px solid ${isV ? "#e11d48" : own ? "#0f766e" : "#d6d3d1"}`, cursor: sel ? "pointer" : "default", opacity: !sel && !isV ? 0.6 : 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: isV ? "#9f1239" : INK, textDecoration: isV ? "line-through" : "none" }}>{skuById(it.skuId).name}</div>
                    <div style={{ fontSize: 8, color: isV ? "#9f1239" : "#a8a29e", lineHeight: 1.2 }}>{it.campana}</div>
                    <div className="flex items-center gap-0.5" style={{ fontSize: 9, color: isV ? "#9f1239" : own ? "#0f766e" : "#a8a29e" }}>{!own && <Lock size={8} style={{ flexShrink: 0 }} />}{seg.h}h · {own ? "tuya" : it.poCliente.split(" ")[0]}{isV ? " · sale" : ""}</div>
                  </button>
                );
              })}
              {dayOff && <div style={{ fontSize: 9, color: "#be123c" }}>feriado</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AdvanceModal({ entry, mode = "urgente", items, consAll, actingPO, onClose, onApply, onRequest }) {
  const urgent = mode === "urgente";
  const eDay = earliestAdvanceDay(), eIso = iso(eDay), eWeek = weekOfIso(eIso);
  const slotDay = (w) => { const d = weekDays(w).find((x) => !isOff(iso(x)) && iso(x) >= eIso); return d ? wdOf(iso(d)) : null; };
  const targets = WEEKS.filter((w) => w < entry.sem && slotDay(w) != null);
  const [toSem, setToSem] = useState(targets.length ? targets[0] : entry.sem);
  const [victimId, setVictimId] = useState(null);
  const linea = entry.linea, sku = skuById(entry.skuId);
  const noTarget = targets.length === 0;
  const toDia = noTarget ? null : slotDay(toSem);
  const weekItems = noTarget ? [] : items.filter((i) => i.linea === linea && weekFrac(i, toSem) > 0 && (i.estado === "aceptado" || i.estado === "provisional") && i.id !== entry.id && !i.archivado && i.ejecucion !== "entregada");
  const victim = weekItems.find((i) => i.id === victimId) || null;
  const needsVictim = weekItems.length > 0;
  const ready = !noTarget && (!needsVictim || !!victim);
  const outcome = victim && victim.poCliente !== actingPO ? "request" : "apply";
  let pct = 0, st = statusColor(0);
  if (!noTarget) { const cf = capFactor(toSem); const per = itemHours(entry).per; const projPer = ROLES.map((r) => ({ proj: consAll[toSem][linea][r.id] + per[r.id], cp: Math.round(CAP[linea][r.id] * cf) })); const sp = projPer.reduce((a, x) => a + x.proj, 0), sc = projPer.reduce((a, x) => a + x.cp, 0); pct = sc ? Math.round((sp / sc) * 100) : 0; st = statusColor(pct); }
  const previewItem = { ...entry, prioridad: urgent ? "Urgente" : entry.prioridad, prio: -1 };
  const pickWeek = (w) => { setToSem(w); setVictimId(null); };
  const confirm = () => {
    if (!ready) return;
    if (outcome === "apply") onApply(entry, toSem, toDia, actingPO, victim ? victim.id : null, urgent);
    else onRequest(entry, toSem, toDia, actingPO, victim ? [{ id: victim.id, po: victim.poCliente, name: `${skuById(victim.skuId).name} · ${victim.campana}` }] : [], urgent);
    onClose();
  };
  const accent = urgent ? "#b45309" : BRAND;
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: "rgba(28,25,23,.45)", zIndex: 70 }} onClick={onClose}>
      <div className="rounded-2xl w-full" style={{ background: "#fff", maxWidth: 600, maxHeight: "92vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #f0eee9" }}>{urgent ? <AlertTriangle size={16} color="#b45309" /> : <ArrowLeft size={16} color={BRAND} />}<span style={{ ...serif, fontSize: 18, fontWeight: 700 }}>{urgent ? "Mover a Urgente" : "Adelantar tarea"}</span></div>
        <div className="px-5 py-4">
          <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{sku.name} ×{entry.cantidad} <span style={{ color: "#a8a29e", fontWeight: 400 }}>· {entry.campana}</span></div>
          <p className="text-xs mb-3" style={{ color: "#78716c" }}>Hoy está en <b>{WEEKLBL[entry.sem]}</b>. Elige la semana destino y, en el planificador, la tarea que quieres reemplazar con la tuya. {urgent ? "Quedará marcada como Urgente." : "Se adelanta sin marcarla como urgente."} Actúas como <b style={{ color: INK }}>{actingPO}</b>.</p>
          {noTarget ? (
            <div className="rounded-xl px-3 py-3 text-xs flex items-start gap-2" style={{ background: "#fffbeb", color: "#92400e" }}><Hourglass size={14} style={{ marginTop: 1, flexShrink: 0 }} /><span>No se puede adelantar más. Por la regla de aviso ({new Date().getHours() < 12 ? "antes del mediodía → +1 día" : "tarde/noche → +2 días"}), lo más pronto que algo entra es <b>{fmt(eIso)}</b>{eWeek != null ? ` (${WEEKLBL[eWeek]})` : ""}, que no es antes de su semana actual.</span></div>
          ) : (
            <>
              <div className="text-xs mb-1.5" style={{ color: "#78716c", fontWeight: 600 }}>Adelantar a:</div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">{targets.map((w) => <button key={w} onClick={() => pickWeek(w)} className="rounded-xl px-3 py-2 text-left" style={{ border: toSem === w ? `1.5px solid ${BRAND}` : "1px solid #e7e5e4", background: toSem === w ? "#f0fdfa" : "#faf9f6" }}><div className="text-xs" style={{ fontWeight: 700, color: toSem === w ? "#115e59" : INK }}>{WEEKLBL[w]}</div><div className="text-xs" style={{ color: "#a8a29e" }}>entra {fmt(iso(addDays(weekStart(w), slotDay(w))))}</div></button>)}</div>
              <div className="flex items-center justify-between mb-1.5"><span className="text-xs" style={{ color: "#78716c", fontWeight: 600 }}><CalendarDays size={12} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />Toca la tarea a reemplazar · {linea} · {WEEKLBL[toSem]}</span><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: st.chip, color: st.text, fontWeight: 700 }}>{pct}% de la semana</span></div>
              <WeekPreview items={items} linea={linea} week={toSem} incoming={previewItem} toDia={toDia} victimId={victimId} actingPO={actingPO} onPick={setVictimId} urgent={urgent} />
              <div className="flex items-center gap-3 mt-2 flex-wrap" style={{ fontSize: 10, color: "#a8a29e" }}><span className="flex items-center gap-1"><span style={{ width: 9, height: 9, borderRadius: 2, background: "#f0fdfa", borderLeft: "3px solid #0f766e", display: "inline-block" }} /> tuya</span><span className="flex items-center gap-1"><Lock size={9} /> de otro PO</span><span className="flex items-center gap-1"><span style={{ width: 9, height: 9, borderRadius: 2, background: "#fff1f2", borderLeft: "3px solid #e11d48", display: "inline-block" }} /> sale</span></div>
              {needsVictim && !victim && <div className="rounded-xl px-3 py-2.5 mt-2 text-xs flex items-start gap-2" style={{ background: "#fffbeb", color: "#92400e" }}><AlertTriangle size={14} style={{ marginTop: 1, flexShrink: 0 }} /><span>Selecciona en el planificador la tarea que tu tarea va a reemplazar.</span></div>}
              {!needsVictim && <div className="rounded-xl px-3 py-2.5 mt-2 text-xs flex items-start gap-2" style={{ background: "#f0fdfa", color: "#115e59" }}><Check size={14} style={{ marginTop: 1, flexShrink: 0 }} /><span>Esa semana no tiene tareas que reemplazar: tu tarea entra directo y queda a tu nombre.</span></div>}
              {victim && <div className="rounded-xl px-3 py-2.5 mt-2 text-xs flex items-start gap-2" style={{ background: outcome === "apply" ? "#f0fdfa" : "#eff6ff", color: outcome === "apply" ? "#115e59" : "#1e40af" }}>{outcome === "apply" ? <Check size={14} style={{ marginTop: 1, flexShrink: 0 }} /> : <ShieldCheck size={14} style={{ marginTop: 1, flexShrink: 0 }} />}<span>{outcome === "apply" ? <>Reemplazas <b>{sku.name}</b> tuya por esta: se aplica de inmediato. <b>{skuById(victim.skuId).name} · {victim.campana}</b> (a cargo de {victim.ejecutivo}) se mueve al siguiente espacio disponible.</> : <>Quieres reemplazar <b>{skuById(victim.skuId).name} · {victim.campana}</b> de <b>{victim.poCliente}</b>, a cargo del ejecutivo <b>{victim.ejecutivo}</b>: requiere su visto bueno o el de la agencia. Si se aprueba, esa tarea se mueve al siguiente espacio disponible.</>}</span></div>}
            </>
          )}
        </div>
        <div className="px-5 py-4 flex items-center justify-end gap-2" style={{ borderTop: "1px solid #f0eee9" }}>
          <button onClick={onClose} className="text-sm px-4 py-2 rounded-full" style={{ background: "#f5f5f4", color: "#57534e", fontWeight: 600 }}>{noTarget ? "Cerrar" : "Cancelar"}</button>
          {!noTarget && <button onClick={confirm} disabled={!ready} className="text-sm px-4 py-2 rounded-full flex items-center gap-1" style={{ background: !ready ? "#e7e5e4" : outcome === "apply" ? accent : BRAND, color: !ready ? "#a8a29e" : "#fff", fontWeight: 600, cursor: ready ? "pointer" : "not-allowed" }}>{outcome === "request" ? <><Send size={14} /> Enviar solicitud</> : urgent ? <><AlertTriangle size={14} /> Mover a Urgente</> : <><ArrowLeft size={14} /> Adelantar</>}</button>}
        </div>
      </div>
    </div>
  );
}

function Prioridades({ items, consAll, inWeek, inLinea, campOrder, onMoveItem, onMoveCamp, onSetPrio, week, actingPO, setActingPO, onAdvance, onRequest, onDelay }) {
  const [advFor, setAdvFor] = useState(null);
  const [menuFor, setMenuFor] = useState(null);
  const eIso = iso(earliestAdvanceDay());
  const canEarlier = (it) => WEEKS.some((w) => w < it.sem && weekDays(w).some((x) => !isOff(iso(x)) && iso(x) >= eIso));
  const active = items.filter((i) => ["revision", "provisional", "aceptado"].includes(i.estado)).filter(inLinea).filter(inWeek);
  const lineas = LINEAS.filter((l) => active.some((i) => i.linea === l));
  const Opt = ({ icon: Icon, label, hint, color, disabled, onClick }) => <button disabled={disabled} onClick={onClick} className="w-full text-left px-3 py-2 text-xs flex items-center gap-2" style={{ background: "#fff", color: disabled ? "#c4c0b8" : INK, cursor: disabled ? "not-allowed" : "pointer", borderBottom: "1px solid #f7f5f1" }}><Icon size={13} color={disabled ? "#c4c0b8" : color || "#78716c"} style={{ flexShrink: 0 }} /> <span style={{ fontWeight: 600 }}>{label}</span>{hint && <span style={{ color: "#a8a29e", marginLeft: "auto" }}>{hint}</span>}</button>;
  return (
    <div className="space-y-4">
      <div className="rounded-xl px-4 py-2.5 text-xs flex items-center justify-between gap-2 flex-wrap" style={{ background: "#ecfeff", color: "#155e75" }}>
        <span className="flex items-center gap-2"><ListOrdered size={14} /> Ordena, prioriza y reprograma entregables. Es de {WEEKLBL[week]}.</span>
        <span className="flex items-center gap-1.5"><User2 size={13} /> Actúas como: <select value={actingPO} onChange={(e) => setActingPO(e.target.value)} style={{ ...dateInput, padding: "3px 7px", fontSize: 11, fontWeight: 700, color: "#155e75" }}>{["Director", ...POS].map((p) => <option key={p}>{p}</option>)}</select></span>
      </div>
      {lineas.map((linea) => {
        const camps = (campOrder[linea] || []).filter((c) => active.some((i) => i.linea === linea && i.campana === c));
        return (
          <Card key={linea} style={{ padding: 0 }}>
            <div className="px-5 py-3" style={{ borderBottom: "1px solid #f0eee9" }}><span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{linea}</span><span className="text-xs ml-2" style={{ color: "#a8a29e" }}>equipo propio · {totalCapLinea(linea)} h/sem</span></div>
            {camps.map((camp, ci) => {
              const its = active.filter((i) => i.linea === linea && i.campana === camp).sort((a, b) => a.prio - b.prio), ch = its.reduce((a, i) => a + itemHours(i).tot, 0);
              return (
                <div key={camp} style={{ borderTop: ci ? "1px solid #f0eee9" : "none" }}>
                  <div className="px-5 py-2.5 flex items-center gap-3 flex-wrap" style={{ background: "#faf9f6" }}>
                    <div className="rounded-md flex items-center justify-center" style={{ width: 24, height: 24, background: INK, color: "#fff", fontWeight: 700, fontSize: 12 }}>{ci + 1}</div>
                    <Megaphone size={14} color={BRAND} /><span className="text-sm flex-1" style={{ fontWeight: 600 }}>{camp} <span className="text-xs" style={{ color: "#a8a29e" }}>· {its.length} entregables · {ch} h</span></span>
                    <div className="flex flex-col gap-0.5"><button onClick={() => onMoveCamp(linea, camp, -1)} disabled={ci === 0} className="rounded flex items-center justify-center" style={{ width: 26, height: 18, background: ci === 0 ? "#f0eee9" : "#e7e5e4", color: ci === 0 ? "#d6d3d1" : "#44403c" }}><ChevronUp size={13} /></button><button onClick={() => onMoveCamp(linea, camp, 1)} disabled={ci === camps.length - 1} className="rounded flex items-center justify-center" style={{ width: 26, height: 18, background: ci === camps.length - 1 ? "#f0eee9" : "#e7e5e4", color: ci === camps.length - 1 ? "#d6d3d1" : "#44403c" }}><ChevronDown size={13} /></button></div>
                  </div>
                  {its.map((it, ei) => { const sku = skuById(it.skuId), es = ESTADO[it.estado], canAct = it.estado === "aceptado" || it.estado === "provisional", mine = it.poCliente === actingPO, canDelay = it.sem < 3, earlier = canEarlier(it); return (
                    <div key={it.id} className="pl-12 pr-5 py-2 flex items-center gap-3 flex-wrap" style={{ borderTop: "1px solid #f7f5f1" }}>
                      <span className="text-xs" style={{ color: "#a8a29e", width: 16 }}>{ei + 1}.</span>
                      <div className="flex-1" style={{ minWidth: 160 }}><span className="text-sm">{sku.name} <span style={{ color: "#a8a29e" }}>×{it.cantidad}</span></span><span className="text-xs px-1.5 py-0.5 rounded-full ml-2" style={{ background: es.bg, color: es.fg, fontWeight: 600 }}>{es.label}</span><span className="text-xs ml-2" style={{ color: mine ? "#0f766e" : "#a8a29e" }}>{it.poCliente}</span>{it.pendingMove && <span className="text-xs px-1.5 py-0.5 rounded-full ml-1" style={{ background: "#eff6ff", color: "#1e40af", fontWeight: 600 }}>solicitud pendiente</span>}{!it.pendingMove && (it.log || []).some((l) => l.text.startsWith("Movida a Urgente")) && <span className="text-xs px-1.5 py-0.5 rounded-full ml-1" title={(it.log || []).filter((l) => l.text.startsWith("Movida a Urgente")).slice(-1)[0]?.by} style={{ background: "#fee2e2", color: "#9f1239", fontWeight: 600 }}>urgente</span>}</div>
                      {canAct && !it.pendingMove && (mine ? <div style={{ position: "relative" }}>
                        <button onClick={() => setMenuFor(menuFor === it.id ? null : it.id)} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: menuFor === it.id ? "#f0eee9" : "#fff", border: "1px solid #e7e5e4", color: "#57534e", fontWeight: 600 }}><CalendarDays size={12} /> Reprogramar <ChevronDown size={12} /></button>
                        {menuFor === it.id && <><div onClick={() => setMenuFor(null)} style={{ position: "fixed", inset: 0, zIndex: 40 }} /><div className="rounded-xl" style={{ position: "absolute", right: 0, top: 30, width: 224, background: "#fff", border: "1px solid #ece9e3", boxShadow: "0 12px 28px rgba(28,25,23,.16)", zIndex: 41, overflow: "hidden" }}>
                          <Opt icon={ArrowRight} label="Siguiente semana" hint={canDelay ? "retrasar" : "sin semana"} disabled={!canDelay} onClick={() => { onDelay(it, actingPO); setMenuFor(null); }} />
                          <Opt icon={AlertTriangle} label="Mover a Urgente" color="#b45309" hint={earlier ? "" : "sin hueco"} disabled={!earlier} onClick={() => { setAdvFor({ it, mode: "urgente" }); setMenuFor(null); }} />
                          <Opt icon={ArrowLeft} label="Adelantar a…" color={BRAND} hint={earlier ? "" : "sin hueco"} disabled={!earlier} onClick={() => { setAdvFor({ it, mode: "adelantar" }); setMenuFor(null); }} />
                        </div></>}
                      </div> : <span title={`Solo ${it.poCliente} puede reprogramar su entregable`} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: "#f5f5f4", color: "#c4c0b8", fontWeight: 600, cursor: "not-allowed" }}><Lock size={11} /> Reprogramar</span>)}
                      <select value={it.prioridad || "Media"} onChange={(e) => onSetPrio(it, e.target.value)} title="Prioridad · qué resolver primero" style={{ ...dateInput, padding: "3px 7px", fontSize: 11, fontWeight: 700, color: PRIO_COLOR[it.prioridad || "Media"] }}>{PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}</select>
                      <div className="flex gap-1"><button onClick={() => onMoveItem(it, -1)} disabled={ei === 0} className="rounded flex items-center justify-center" style={{ width: 24, height: 22, background: ei === 0 ? "#f7f5f1" : "#f0eee9", color: ei === 0 ? "#d6d3d1" : "#57534e" }}><ChevronUp size={12} /></button><button onClick={() => onMoveItem(it, 1)} disabled={ei === its.length - 1} className="rounded flex items-center justify-center" style={{ width: 24, height: 22, background: ei === its.length - 1 ? "#f7f5f1" : "#f0eee9", color: ei === its.length - 1 ? "#d6d3d1" : "#57534e" }}><ChevronDown size={12} /></button></div>
                    </div>
                  ); })}
                </div>
              );
            })}
          </Card>
        );
      })}
      {lineas.length === 0 && <Card><div className="text-sm text-center" style={{ color: "#a8a29e" }}>Sin entregables activos en {WEEKLBL[week]}.</div></Card>}
      {advFor && <AdvanceModal entry={advFor.it} mode={advFor.mode} items={items} consAll={consAll} actingPO={actingPO} onClose={() => setAdvFor(null)} onApply={onAdvance} onRequest={onRequest} />}
    </div>
  );
}

function SemanaView({ items, audience, inLinea, lineaView, campOrder, week, onOpenCor, onCopy, onMoveDia, onReset, onOpenSplit, onReplace }) {
  const days = weekDays(week);
  const scope = lineaView === "General" ? LINEAS : [lineaView];
  const weekCap = scope.reduce((a, l) => a + totalCapLinea(l), 0);
  const dailyCap = Math.round(weekCap / 5);
  const todayIdx = week === TODAY_WEEK ? TODAY_IDX : -1;
  const startDi = week === TODAY_WEEK ? Math.max(0, todayIdx) : 0;
  const hol = days.map((d) => holiday(iso(d)));
  const off = (di) => !!(hol[di] && !hol[di].work);
  const lastWork = [4, 3, 2, 1, 0].find((i) => !off(i));
  const [dragId, setDragId] = useState(null);
  const [moveModal, setMoveModal] = useState(null);

  const tasks = items.filter(inLinea).filter((i) => weekFrac(i, week) > 0 && i.estado === "aceptado");
  const crank = (t) => { const arr = campOrder[t.linea] || []; const r = arr.indexOf(t.campana); return r < 0 ? 999 : r; };
  const ordered = [...tasks].sort((a, b) => crank(a) - crank(b) || a.prio - b.prio);

  const cols = [[], [], [], [], []], load = [0, 0, 0, 0, 0];
  const place = (t, di, h, split) => { cols[di].push({ it: t, h, split }); load[di] += h; };
  ordered.forEach((t) => { if (t.dayPlan && !t.weekPlan) Object.keys(t.dayPlan).forEach((d) => place(t, +d, t.dayPlan[d], true)); });
  ordered.forEach((t) => { if (!t.weekPlan && !t.dayPlan && t.dia != null) place(t, t.dia, itemHoursWeek(t, week).tot, false); });
  ordered.forEach((t) => {
    if (!t.weekPlan && (t.dayPlan || t.dia != null)) return;
    let rem = itemHoursWeek(t, week).tot;
    const segs = [];
    for (let i = startDi; i < 5 && rem > 0; i++) {
      if (off(i)) continue; // feriado no laborable: no se asigna
      const free = Math.max(0, dailyCap - load[i]);
      if (free <= 0) continue;
      const take = Math.min(free, rem);
      segs.push([i, take]); load[i] += take; rem -= take;
    }
    if (rem > 0 && lastWork != null) { segs.push([lastWork, rem]); load[lastWork] += rem; } // semana sin cupo: el resto queda visible en el último día laborable
    const multi = segs.length > 1;
    segs.forEach(([i, hh]) => cols[i].push({ it: t, h: hh, split: multi }));
  });

  const locked = (t, di) => t.ejecucion === "entregada" || (week === TODAY_WEEK && di <= todayIdx);
  const canDrop = (di) => audience === "agencia" && week >= TODAY_WEEK && !off(di) && !(week === TODAY_WEEK && di <= todayIdx);
  const moverTask = () => tasks.find((t) => t.id === dragId);
  const dropDay = (di) => {
    if (!dragId || !canDrop(di)) { setDragId(null); return; }
    const mover = moverTask(); setDragId(null);
    if (!mover) return;
    if (mover.dayPlan) { onOpenSplit(mover); return; }   // dividida en días → volver a repartir
    if (mover.dia === di) return;                                          // mismo día
    const free = dailyCap - load[di];
    if (free > 0) { onMoveDia(mover.id, di); return; }                     // hay espacio → mover directo
    setMoveModal({ mover, toDia: di, victim: null, mode: "day" });          // día lleno → elegir a quién reemplazar
  };
  const dropOnTask = (victim, di) => {
    if (!dragId) { return; }
    const mover = moverTask(); setDragId(null);
    if (!mover || mover.id === victim.id || !canDrop(di)) return;
    if (mover.dayPlan) { onOpenSplit(mover); return; }   // dividida en días → volver a repartir
    setMoveModal({ mover, toDia: di, victim, mode: "task" });               // soltar encima → reemplazar a esa tarea
  };
  const mm = moveModal;
  const dayVictims = mm ? [...new Map(cols[mm.toDia].map((s) => [s.it.id, s.it])).values()].filter((t) => !locked(t, mm.toDia) && t.id !== mm.mover.id) : [];
  const nearestDay = mm ? (() => { let best = null, bd = 99; for (let i = 0; i < 5; i++) { if (i === mm.toDia || off(i) || (week === TODAY_WEEK && i <= todayIdx) || load[i] >= dailyCap) continue; const dist = Math.abs(i - mm.toDia); if (dist < bd) { bd = dist; best = i; } } return best; })() : null;
  const fwdWeeks = WEEKS.filter((w) => w > week).slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2"><CalendarDays size={16} color={BRAND} /><span style={{ fontWeight: 600 }}>Planificador · {WEEKLBL[week]}</span><span className="text-xs" style={{ color: "#a8a29e" }}>· {weekRange(week)} · {dailyCap} h/día{workdaysIn(week) < 5 ? ` · ${workdaysIn(week)} días laborables` : ""}</span></div>
        {audience === "agencia" && <button onClick={() => onReset(week)} className="text-xs flex items-center gap-1 rounded-full px-3 py-1.5" style={{ background: "#f0eee9", color: "#57534e", fontWeight: 600 }}><ListOrdered size={12} /> Reordenar por prioridad</button>}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {days.map((d, di) => {
          const h = hol[di], dayOff = off(di), dh = load[di], pct = dailyCap ? Math.round((dh / dailyCap) * 100) : 0, st = statusColor(pct), isToday = di === todayIdx, droppable = canDrop(di);
          return (
            <div key={di} onDragOver={(e) => { if (droppable) e.preventDefault(); }} onDrop={() => dropDay(di)} className="rounded-xl" style={{ background: dayOff ? "#fef2f2" : isToday ? "#fffdf5" : "#fff", border: dayOff ? "1.5px dashed #fca5a5" : isToday ? `1.5px solid ${BRAND}` : "1px solid #ece9e3", minHeight: 240 }}>
              <div className="px-2.5 py-2" style={{ borderBottom: "1px solid #f0eee9" }}>
                <div className="flex items-center justify-between"><span className="text-xs" style={{ fontWeight: 700, color: dayOff ? "#9f1239" : isToday ? BRAND : INK }}>{DAYS[di]} {d.getDate()}{isToday ? " · hoy" : ""}</span>{dayOff ? <span className="flex items-center gap-0.5 text-xs" style={{ color: "#9f1239", fontWeight: 600 }}><Lock size={10} /> feriado</span> : <span className="text-xs" style={{ color: st.text, fontWeight: 600 }}>{dh}/{dailyCap}h</span>}</div>
                {dayOff ? <div className="text-xs mt-1 truncate" style={{ color: "#be123c" }} title={h.name}>{h.name} · no laborable</div>
                  : <><div className="rounded-full overflow-hidden mt-1" style={{ background: "#f0eee9", height: 5 }}><div style={{ width: Math.min(100, pct) + "%", height: "100%", background: st.bar }} /></div>{h && h.work && <div className="text-xs mt-1 truncate flex items-center gap-1" style={{ color: "#b45309" }} title={h.name}><span style={{ width: 6, height: 6, borderRadius: 6, background: "#d97706", display: "inline-block" }} /> {h.name}</div>}</>}
              </div>
              <div className="p-2 space-y-2">
                {cols[di].map((seg, si) => {
                  const it = seg.it, sku = skuById(it.skuId), es = ESTADO[it.estado], ej = it.ejecucion ? EJEC[it.ejecucion] : null, lk = locked(it, di), tot = itemHoursWeek(it, week).tot;
                  const grab = audience === "agencia" && week >= TODAY_WEEK && !lk && !it.weekPlan;
                  const canSplit = audience === "agencia" && it.ejecucion !== "entregada" && !it.weekPlan && !(week === TODAY_WEEK && di < todayIdx);
                  return (
                    <div key={it.id + "-" + si} draggable={grab} onDragStart={() => grab && setDragId(it.id)} onDragEnd={() => setDragId(null)}
                      onDragOver={(e) => { if (audience === "agencia" && dragId && dragId !== it.id && canDrop(di)) { e.preventDefault(); e.stopPropagation(); } }}
                      onDrop={(e) => { e.stopPropagation(); dropOnTask(it, di); }}
                      onClick={() => it.corId && onOpenCor(it)}
                      className="rounded-lg p-2" style={{ background: dragId === it.id ? "#ecfeff" : "#faf9f6", border: "1px solid #ece9e3", borderLeft: `3px solid ${seg.split ? BRAND : es.fg}`, cursor: grab ? "grab" : (it.corId ? "pointer" : "default"), opacity: lk ? 0.7 : 1 }}>
                      <div className="flex items-start gap-1">
                        {audience === "agencia" && (lk ? <Lock size={11} color="#c4c0b8" style={{ marginTop: 2, flexShrink: 0 }} /> : seg.split ? <Scissors size={11} color={BRAND} style={{ marginTop: 2, flexShrink: 0 }} /> : <GripVertical size={11} color="#c4c0b8" style={{ marginTop: 2, flexShrink: 0 }} />)}
                        <div className="flex-1" style={{ minWidth: 0 }}><div className="text-xs" style={{ fontWeight: 600, lineHeight: 1.2 }}>{sku.name}</div><div className="text-xs flex items-center gap-0.5" style={{ color: "#a8a29e", lineHeight: 1.3 }}><Megaphone size={9} style={{ flexShrink: 0 }} /> {it.campana}{it.delayed && <Clock size={9} color="#9f1239" style={{ flexShrink: 0 }} />}</div></div>
                        {canSplit && <button onClick={(e) => { e.stopPropagation(); onOpenSplit(it); }} title="Repartir horas en días" className="flex-shrink-0" style={{ color: seg.split ? BRAND : "#c4c0b8" }}><Scissors size={12} /></button>}
                      </div>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <span className="text-xs px-1 rounded" style={{ background: "#f0eee9", color: "#57534e" }}>{it.marca}</span>
                        {it.weekPlan && <span className="text-xs px-1 rounded flex items-center gap-0.5" title="Una sola tarea, repartida en varias semanas · 1 sola tarea en COR" style={{ background: "#ecfeff", color: "#155e75", fontWeight: 600 }}><CalendarDays size={9} /> {it.weekLabels && it.weekLabels[week] ? `${it.weekLabels[week]} · ${Math.round(weekFrac(it, week) * 100)}%` : `${Math.round(weekFrac(it, week) * 100)}%`}</span>}
                        {seg.split ? <span className="text-xs" style={{ color: BRAND, fontWeight: 700 }}>{seg.h}h <span style={{ color: "#a8a29e", fontWeight: 400 }}>de {tot}h</span></span> : <span className="text-xs" style={{ color: "#a8a29e" }}>{seg.h}h</span>}
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-1 flex-wrap">
                        {ej ? <span className="flex items-center gap-0.5 text-xs" style={{ color: ej.c }}><ej.icon size={10} /> {ej.label}</span> : <span className="text-xs" style={{ color: es.fg }}>{es.label}</span>}
                        {it.corId && <button onClick={(e) => { e.stopPropagation(); onOpenCor(it); }} title="Abrir ficha de la tarea" className="flex-shrink-0" style={{ color: BLUE }}><ExternalLink size={13} /></button>}
                      </div>
                    </div>
                  );
                })}
                {cols[di].length === 0 && <div className="text-xs text-center py-6" style={{ color: dayOff ? "#fca5a5" : droppable ? "#d6d3d1" : "#e7e5e4" }}>{dayOff ? "feriado" : droppable ? "suelta aquí" : "—"}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-xs mt-3 leading-relaxed" style={{ color: "#a8a29e" }}>
        El trabajo nuevo se programa desde hoy en adelante y se reparte por prioridad del cliente, llenando cada día hasta su capacidad ({dailyCap} h). Si una tarea no cabe completa en un día, sus horas sobrantes pasan solas al día siguiente — ningún día se sobrecarga. {audience === "agencia" ? <>Arrastra una tarjeta a otro día para replanificar: si el día tiene cupo se mueve directo; si está lleno, eliges qué tarea reemplazar y a dónde mover la desplazada. Suelta una tarjeta <b>encima de otra</b> para reemplazarla. Las tarjetas divididas (<Scissors size={11} className="inline" style={{ verticalAlign: "-1px" }} />) se pueden mover y abren el reparto de horas.</> : "Vista de cliente: solo lectura."} Muestra solo lo ya aprobado y planificado (tareas aceptadas). Las tareas entregadas y las del día de hoy quedan bloqueadas. Los feriados no laborables (en rojo) no reciben trabajo y la capacidad de la semana se reparte solo entre los días laborables.
      </div>
      {mm && <PlannerMoveModal mover={mm.mover} toDia={mm.toDia} victim={mm.victim} mode={mm.mode} dayName={DAYS[mm.toDia]} victims={dayVictims} nearestDay={nearestDay} fwdWeeks={fwdWeeks} week={week} onConfirm={(vId, dest) => { onReplace(mm.mover.id, mm.toDia, week, vId, dest); setMoveModal(null); }} onClose={() => setMoveModal(null)} />}
    </div>
  );
}

function PlannerMoveModal({ mover, toDia, victim, mode, dayName, victims, nearestDay, fwdWeeks, week, onConfirm, onClose }) {
  const [vId, setVId] = useState(victim ? victim.id : null);
  const v = victim || victims.find((x) => x.id === vId) || null;
  const moverName = skuById(mover.skuId).name;
  const noDest = nearestDay == null && fwdWeeks.length === 0;
  const btn = { width: "100%", textAlign: "left", border: "1px solid #ece9e3", borderRadius: 12, padding: "10px 12px", background: "#fff" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(28,25,23,.45)" }} onClick={onClose}>
      <div className="rounded-2xl w-full" style={{ maxWidth: 440, background: PAPER, padding: 20, maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-2"><div className="rounded-full flex items-center justify-center" style={{ width: 40, height: 40, background: mode === "task" ? "#ecfeff" : "#fef3c7" }}>{mode === "task" ? <ArrowLeftRight size={20} color="#0f766e" /> : <AlertTriangle size={20} color="#b45309" />}</div><div style={{ ...serif, fontSize: 19, fontWeight: 700 }}>{mode === "task" ? "Reemplazar tarea" : `${dayName} está lleno`}</div></div>
        <p className="text-xs mb-4" style={{ color: "#78716c" }}>Mueves <b style={{ color: INK }}>{moverName}</b> <span style={{ color: "#a8a29e" }}>· {mover.campana}</span> al {dayName}.</p>
        {!vId
          ? <div>
            <div className="text-xs mb-2" style={{ fontWeight: 600, color: INK }}>¿Qué tarea quieres reemplazar en {dayName}?</div>
            {victims.length === 0
              ? <div className="rounded-xl text-sm text-center py-4" style={{ background: "#fff", border: "1px solid #ece9e3", color: "#a8a29e" }}>No hay tareas reemplazables ese día (las demás están bloqueadas).</div>
              : <div className="space-y-2">{victims.map((t) => <button key={t.id} onClick={() => setVId(t.id)} style={btn} className="flex items-center justify-between gap-2"><span className="text-sm" style={{ fontWeight: 600 }}>{skuById(t.skuId).name} <span style={{ color: "#a8a29e", fontWeight: 400 }}>· {t.campana}</span></span><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f0eee9", color: "#57534e" }}>{t.marca}</span></button>)}</div>}
          </div>
          : <div>
            <div className="text-xs mb-2" style={{ fontWeight: 600, color: INK }}>{moverName} ocupará el lugar de <b>{v ? skuById(v.skuId).name : ""}</b>. ¿A dónde mueves {v ? skuById(v.skuId).name : "esa tarea"}?</div>
            <div className="space-y-2">
              {nearestDay != null && <button onClick={() => onConfirm(vId, { kind: "day", dia: nearestDay })} style={{ ...btn, borderColor: "#bae6e0", background: "#f0fdfa" }} className="flex items-center gap-2"><CalendarDays size={15} color={BRAND} /><span className="text-sm" style={{ fontWeight: 600, color: "#115e59" }}>Día más cercano disponible · {DAYS[nearestDay]}</span></button>}
              {fwdWeeks.length > 0 && <div className="rounded-xl" style={{ border: "1px solid #ece9e3", padding: "10px 12px", background: "#fff" }}><div className="text-xs mb-1.5" style={{ color: "#57534e", fontWeight: 600 }}>Otra semana</div><div className="flex flex-wrap gap-1.5">{fwdWeeks.map((w) => <button key={w} onClick={() => onConfirm(vId, { kind: "week", sem: w })} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "#eef2ff", color: BLUE, fontWeight: 600 }}>{WEEKLBL[w]}</button>)}</div></div>}
              {noDest && <div className="rounded-xl text-sm text-center py-4" style={{ background: "#fff", border: "1px solid #ece9e3", color: "#a8a29e" }}>No hay días ni semanas siguientes con espacio. Libera cupo primero.</div>}
            </div>
          </div>}
        <div className="flex gap-2 mt-4">
          {vId && !victim && <button onClick={() => setVId(null)} className="rounded-full py-2 px-4 text-sm" style={{ background: "#f0eee9", color: "#57534e", fontWeight: 600 }}>Atrás</button>}
          <button onClick={onClose} className="flex-1 rounded-full py-2 text-sm" style={{ background: "#f5f5f4", color: "#57534e", fontWeight: 600 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

function CloseDayModal({ tasks, allItems, mandatory, slots, reasons, onDone, onMarkPart, onReschedule, onReturnClient, onCreateRetro, onSaveTime, onFinish, onClose }) {
  const [resolved, setResolved] = useState({});
  const [forms, setForms] = useState({});
  const [retroFor, setRetroFor] = useState(null);
  const [timeFor, setTimeFor] = useState(null);
  const total = tasks.length, done = Object.keys(resolved).length, allDone = done >= total;
  const today = weekDays(TODAY_WEEK)[TODAY_IDX];
  const setForm = (id, patch) => setForms((f) => ({ ...f, [id]: { open: true, phase: "motivo", reason: null, comment: "", retroDone: false, timeDone: false, ...(f[id] || {}), ...patch } }));
  const splitInfo = (it) => { if (it.weekPlan) { const ws = planWeeks(it); return { multi: ws.length > 1, n: ws.length, x: Math.max(1, ws.indexOf(TODAY_WEEK) + 1), kind: "semanas" }; } if (it.dayPlan) { const ds = Object.keys(it.dayPlan).map(Number).sort((a, b) => a - b); return { multi: ds.length > 1, n: ds.length, x: Math.max(1, ds.indexOf(TODAY_IDX) + 1), kind: "días" }; } return { multi: false, n: 1, x: 1, kind: "" }; };
  const markDone = (it) => { onDone(it); setResolved((r) => ({ ...r, [it.id]: { outcome: "done" } })); };
  const markPart = (it, x, n) => { onMarkPart(it, x, n); setResolved((r) => ({ ...r, [it.id]: { outcome: "parte", x, n } })); };
  const goResched = (it) => { const f = forms[it.id]; if (f.reason === "cliente") { onReturnClient(it, f.comment.trim()); setResolved((r) => ({ ...r, [it.id]: { outcome: "cliente" } })); } else { setForm(it.id, { phase: "resched" }); } };
  const pickSlot = (it, slot) => { const f = forms[it.id]; onReschedule(it, slot, f.reason, (f.comment || "").trim()); setResolved((r) => ({ ...r, [it.id]: { outcome: "resched", slot, reason: f.reason } })); };
  const reasonKeys = Object.keys(reasons);
  const reasonIcon = (k) => (k === "retrabajo" ? RefreshCcw : k === "tiempo" ? SlidersHorizontal : k === "cliente" ? User2 : Info);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(28,25,23,.55)" }} onClick={() => { if (!mandatory) onClose(); }}>
      <div className="rounded-2xl w-full flex flex-col" style={{ maxWidth: 600, background: PAPER, maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="p-5" style={{ borderBottom: "1px solid #ece9e3" }}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3"><div className="rounded-full flex items-center justify-center" style={{ width: 40, height: 40, background: "#fef3c7" }}><ClipboardList size={20} color="#b45309" /></div><div><div style={{ ...serif, fontSize: 20, fontWeight: 700 }}>Cierre del día</div><div className="text-xs" style={{ color: "#78716c" }}>{DAYS[TODAY_IDX]} {today.getDate()} {MONTHS[today.getMonth()]} · ¿qué pasó con lo planificado?</div></div></div>
            {!mandatory && <button onClick={onClose} style={{ color: "#a8a29e" }}><X size={20} /></button>}
          </div>
          {mandatory && <div className="rounded-lg px-3 py-2 mt-3 text-xs flex items-start gap-1.5" style={{ background: "#fef2f2", color: "#9f1239" }}><Lock size={13} style={{ marginTop: 1, flexShrink: 0 }} /><span><b>Obligatorio.</b> La jornada anterior no se cerró. Marca cada tarea para poder seguir usando la app — lo que se planifica se debe hacer o justificar.</span></div>}
          {total > 0 && <div className="flex items-center gap-2 mt-3"><div className="flex-1 rounded-full overflow-hidden" style={{ background: "#ece9e3", height: 6 }}><div style={{ width: `${total ? (done / total) * 100 : 100}%`, height: "100%", background: BRAND }} /></div><span className="text-xs" style={{ color: "#78716c", fontWeight: 600 }}>{done}/{total} resueltas</span></div>}
        </div>
        <div className="overflow-y-auto p-4 space-y-2" style={{ flex: 1 }}>
          {total === 0 && <div className="rounded-xl text-center py-8" style={{ background: "#fff", border: "1px solid #ece9e3", color: "#a8a29e" }}>No hay tareas planificadas pendientes para hoy. Todo al día.</div>}
          {tasks.map((it) => {
            const r = resolved[it.id], sku = skuById(it.skuId), f = forms[it.id] || {};
            if (r) return (
              <div key={it.id} className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ background: r.outcome === "done" ? "#f0fdfa" : r.outcome === "cliente" ? "#eef2ff" : r.outcome === "parte" ? "#eff6ff" : "#fffbeb", border: `1px solid ${r.outcome === "done" ? "#bae6e0" : r.outcome === "cliente" ? "#c7d2fe" : r.outcome === "parte" ? "#bfdbfe" : "#fde68a"}` }}>
                {r.outcome === "done" ? <Check size={16} color={BRAND} /> : r.outcome === "cliente" ? <User2 size={16} color={BLUE} /> : r.outcome === "parte" ? <Layers size={16} color={BLUE} /> : <ArrowRight size={16} color="#b45309" />}
                <span className="text-sm flex-1" style={{ fontWeight: 600, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sku.name} <span style={{ color: "#a8a29e", fontWeight: 400 }}>· {it.campana}</span></span>
                <span className="text-xs flex-shrink-0" style={{ color: r.outcome === "done" ? "#115e59" : r.outcome === "cliente" || r.outcome === "parte" ? "#1e40af" : "#92400e", fontWeight: 600 }}>{r.outcome === "done" ? "Entregada" : r.outcome === "cliente" ? "Devuelta al cliente" : r.outcome === "parte" ? `Parte ${r.x}/${r.n} hecha` : `Retraso → ${r.slot.label}`}</span>
              </div>
            );
            const est = suggestedHours(it).tot, asg = it.assignedHours ? ROLES.reduce((a, rr) => a + (it.assignedHours[rr.id] || 0), 0) : est;
            const si = splitInfo(it);
            const ctaReady = f.reason && (f.reason === "retrabajo" ? f.retroDone : (f.comment || "").trim());
            return (
              <div key={it.id} className="rounded-xl" style={{ background: "#fff", border: "1px solid #ece9e3" }}>
                <div className="px-3 py-2.5 flex items-center gap-2">
                  <div className="flex-1" style={{ minWidth: 0 }}><div className="text-sm" style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sku.name} <span style={{ color: "#a8a29e" }}>×{it.cantidad}</span></div><div className="text-xs flex items-center gap-1" style={{ color: "#a8a29e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}><Megaphone size={10} style={{ flexShrink: 0 }} /> {it.campana} · {it.marca} · {it.avance}%</div></div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {si.multi && si.x < si.n
                      ? <button onClick={() => markPart(it, si.x, si.n)} title="Solo se completa la parte de hoy; el resto sigue planificado" className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: "#dbeafe", color: "#1e40af", fontWeight: 600 }}><Layers size={12} /> Completé mi parte · {si.x}/{si.n}</button>
                      : <button onClick={() => markDone(it)} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: BRAND, color: "#fff", fontWeight: 600 }}><Check size={12} /> {si.multi ? `Terminar última · ${si.n}/${si.n}` : "Terminada"}</button>}
                    <button onClick={() => setForm(it.id, { open: !f.open, phase: "motivo" })} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: f.open ? "#fef3c7" : "#f5f5f4", color: "#92400e", fontWeight: 600 }}><Clock size={12} /> No terminada</button>
                  </div>
                </div>
                {f.open && f.phase !== "resched" && <div className="px-3 pb-3 pt-1" style={{ borderTop: "1px dashed #ece9e3" }}>
                  {si.multi && <div className="rounded-lg px-3 py-2 mb-2 mt-2 text-xs flex items-start gap-1.5" style={{ background: "#fffbeb", color: "#92400e" }}><AlertTriangle size={13} style={{ marginTop: 1, flexShrink: 0 }} /><span>Tarea repartida en <b>{si.n} {si.kind}</b> (hoy ibas por la parte {si.x}). Reprogramarla mueve <b>todo el plan restante</b> y se vuelve a repartir desde el nuevo día.</span></div>}
                  <div className="text-xs mb-1.5 mt-2" style={{ fontWeight: 600, color: INK }}>Motivo</div>
                  <div className="flex flex-wrap gap-1.5 mb-2">{reasonKeys.map((k) => { const RI = reasonIcon(k); return <button key={k} onClick={() => setForm(it.id, { reason: k })} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: f.reason === k ? INK : "#f0eee9", color: f.reason === k ? PAPER : "#57534e", fontWeight: 600 }}><RI size={11} /> {reasons[k]}</button>; })}</div>
                  {f.reason === "retrabajo" && <div className="rounded-lg px-3 py-2 mb-2 flex items-center justify-between gap-2" style={{ background: "#eef2ff", border: "1px solid #c7d2fe" }}><span className="text-xs" style={{ color: "#1e40af" }}>{f.retroDone ? "Retrabajo registrado y enviado a COR." : "Registra el retrabajo con sus detalles (se sincroniza con COR)."}</span><button onClick={() => setRetroFor(it)} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0" style={{ background: f.retroDone ? "#dbeafe" : BLUE, color: f.retroDone ? "#1e40af" : "#fff", fontWeight: 600 }}><RefreshCcw size={11} /> {f.retroDone ? "Editar / ver" : "Registrar retrabajo"}</button></div>}
                  {f.reason === "tiempo" && <div className="rounded-lg px-3 py-2 mb-2 flex items-center justify-between gap-2" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}><span className="text-xs" style={{ color: "#92400e" }}>Tiempo: <b>{asg} h</b> asignado · estimado {est} h{f.timeDone ? " · ajustado" : ""}. {asg <= est ? "¿Necesita más tiempo?" : "Por encima del estimado."}</span><button onClick={() => setTimeFor(it)} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0" style={{ background: "#fef3c7", color: "#92400e", fontWeight: 600 }}><SlidersHorizontal size={11} /> Ajustar tiempo</button></div>}
                  {f.reason === "cliente" && <div className="rounded-lg px-3 py-2 mb-2 text-xs" style={{ background: "#eef2ff", color: "#1e40af" }}>Volverá a <b>Aprobaciones</b> del cliente como reingreso. Al aceptarla, se vuelve a planificar (misma tarea en COR, tiempos ya registrados).</div>}
                  {f.reason !== "retrabajo" && <textarea value={f.comment || ""} onChange={(e) => setForm(it.id, { comment: e.target.value })} rows={2} placeholder="Comentario (obligatorio): ¿qué faltó? ¿qué se acordó?" style={{ ...inp, fontSize: 13, marginTop: 6, marginBottom: 10 }} />}
                  <div className="flex justify-end"><button onClick={() => goResched(it)} disabled={!ctaReady} className="text-xs px-4 py-1.5 rounded-full flex items-center gap-1" style={{ background: ctaReady ? (f.reason === "cliente" ? BLUE : "#b45309") : "#d6d3d1", color: "#fff", fontWeight: 600 }}><ArrowRight size={12} /> {f.reason === "cliente" ? "Reprogramar" : "Reprogramar con retraso"}</button></div>
                </div>}
                {f.open && f.phase === "resched" && <div className="px-3 pb-3 pt-2" style={{ borderTop: "1px dashed #ece9e3" }}>
                  <div className="text-xs mb-2 flex items-center gap-1.5" style={{ fontWeight: 600, color: INK }}><CalendarDays size={13} color={BRAND} /> Elige en el planificador a qué día se mueve (mira la carga y lo que ya hay):</div>
                  <ReschedulePlanner task={it} allItems={allItems} onPlace={(sem, dia) => pickSlot(it, { sem, dia, iso: iso(weekDays(sem)[dia]), label: `${DAYS[dia]} ${weekDays(sem)[dia].getDate()} ${MONTHS[weekDays(sem)[dia].getMonth()]}` })} />
                  <button onClick={() => setForm(it.id, { phase: "motivo" })} className="text-xs mt-2" style={{ color: "#a8a29e" }}>← volver al motivo</button>
                </div>}
              </div>
            );
          })}
        </div>
        <div className="p-4 flex items-center justify-between gap-2" style={{ borderTop: "1px solid #ece9e3" }}>
          <span className="text-xs" style={{ color: "#a8a29e" }}>{mandatory ? (allDone ? "Listo para continuar." : "Resuelve todas para continuar.") : "Puedes cerrar y seguir marcando luego."}</span>
          <button onClick={onFinish} disabled={mandatory && !allDone} className="rounded-full px-5 py-2 text-sm flex items-center gap-1" style={{ background: (mandatory && !allDone) ? "#d6d3d1" : BRAND, color: "#fff", fontWeight: 600 }}><Check size={14} /> {allDone ? "Finalizar cierre" : "Finalizar"}</button>
        </div>
      </div>
      {retroFor && <RetrabajoModal item={retroFor} onClose={() => setRetroFor(null)} onCreate={(itm, data) => { onCreateRetro(itm, data); setForm(retroFor.id, { reason: "retrabajo", retroDone: true, phase: "resched" }); setRetroFor(null); }} />}
      {timeFor && <AssignTimeModal entry={timeFor} onClose={() => setTimeFor(null)} onSave={(map) => { onSaveTime(timeFor.id, map); setForm(timeFor.id, { timeDone: true }); setTimeFor(null); }} />}
    </div>
  );
}

function ReschedulePlanner({ task, allItems, onPlace }) {
  const firstFuture = upcomingSlots(1)[0];
  const [w, setW] = useState(firstFuture ? firstFuture.sem : Math.min(HORIZON, TODAY_WEEK + 1));
  const board = segWeekBoard(allItems, task.linea, w, task.id);
  const need = itemHours(task).tot;
  const todayIdx = w === TODAY_WEEK ? TODAY_IDX : -1;
  const canDrop = (di) => !board.off(di) && !(w === TODAY_WEEK && di <= todayIdx);
  let rec = null; for (let i = 0; i < 5; i++) { if (canDrop(i) && board.dailyCap - board.load[i] >= need) { rec = i; break; } }
  if (rec == null) for (let i = 0; i < 5; i++) { if (canDrop(i) && board.dailyCap - board.load[i] > 0) { rec = i; break; } }
  const weeks = WEEKS.filter((x) => x >= TODAY_WEEK).slice(0, 8);
  return (
    <div className="rounded-xl p-2" style={{ background: "#faf9f6", border: "1px solid #ece9e3" }}>
      <div className="flex items-center gap-1 overflow-x-auto mb-2" style={{ paddingBottom: 2 }}>{weeks.map((x) => <button key={x} onClick={() => setW(x)} className="px-2.5 py-1 rounded-full text-xs flex-shrink-0" style={{ background: w === x ? INK : "#ece9e3", color: w === x ? PAPER : "#57534e", fontWeight: w === x ? 600 : 500, whiteSpace: "nowrap" }}>{x === 0 ? "Sem. actual" : weekRange(x)}</button>)}</div>
      <div className="text-xs mb-1.5" style={{ color: "#78716c" }}>Necesita ~<b>{need} h</b>. Haz clic en un día para mover la tarea ahí. El borde verde es el siguiente día con cupo.</div>
      <div className="grid grid-cols-5 gap-1.5">{board.days.map((d, di) => {
        const dayOff = board.off(di), dh = board.load[di], cap = board.dailyCap, pct = cap ? Math.round((dh / cap) * 100) : 0, st = statusColor(pct), drop = canDrop(di), isRec = di === rec;
        return (
          <button key={di} disabled={!drop} onClick={() => drop && onPlace(w, di)} className="rounded-lg p-1.5 text-left" style={{ background: dayOff ? "#fef2f2" : drop ? "#fff" : "#f5f5f4", border: isRec ? `1.5px solid ${BRAND}` : dayOff ? "1px dashed #fca5a5" : "1px solid #ece9e3", minHeight: 96, cursor: drop ? "pointer" : "not-allowed", opacity: drop ? 1 : 0.55 }}>
            <div className="flex items-center justify-between"><span className="text-xs" style={{ fontWeight: 700 }}>{DAYS[di]} {d.getDate()}</span>{!dayOff && <span className="text-xs" style={{ color: st.text, fontWeight: 600 }}>{pct}%</span>}</div>
            {dayOff ? <div className="text-xs mt-1" style={{ color: "#be123c" }}>feriado</div> : <>
              <div className="rounded-full overflow-hidden mt-1" style={{ background: "#f0eee9", height: 4 }}><div style={{ width: Math.min(100, pct) + "%", height: "100%", background: st.bar }} /></div>
              <div className="mt-1 space-y-0.5" style={{ maxHeight: 46, overflow: "hidden" }}>{board.cols[di].slice(0, 3).map((seg, si) => <div key={si} className="text-xs truncate" style={{ color: "#a8a29e", lineHeight: 1.25 }}>· {skuById(seg.it.skuId).name}</div>)}{board.cols[di].length > 3 && <div className="text-xs" style={{ color: "#c4c0b8" }}>+{board.cols[di].length - 3} más</div>}{board.cols[di].length === 0 && drop && <div className="text-xs" style={{ color: "#d6d3d1" }}>libre</div>}</div>
              {isRec && <div className="text-xs mt-1" style={{ color: BRAND, fontWeight: 700 }}>sugerido</div>}
            </>}
          </button>
        );
      })}</div>
    </div>
  );
}

function DaySplitModal({ item, onClose, onSave }) {
  const tot = itemHours(item).tot, sku = skuById(item.skuId);
  const days = weekDays(item.sem);
  const todayIdx = item.sem === TODAY_WEEK ? TODAY_IDX : -1;
  const startDi = item.sem === TODAY_WEEK ? Math.max(0, todayIdx) : 0;
  const init = () => { const a = [0, 0, 0, 0, 0]; if (item.dayPlan) Object.keys(item.dayPlan).forEach((d) => (a[+d] = item.dayPlan[d])); else a[startDi] = tot; return a; };
  const [h, setH] = useState(init);
  const sum = h.reduce((a, b) => a + (Number(b) || 0), 0), rem = tot - sum;
  const usedDays = h.filter((v, i) => v > 0 && i >= startDi).length;
  const valid = rem === 0 && usedDays >= 1;
  const setDay = (i, v) => setH((p) => p.map((x, k) => (k === i ? Math.max(0, Math.round(Number(v) || 0)) : x)));
  const even = () => { const av = [0, 1, 2, 3, 4].filter((i) => i >= startDi), base = Math.floor(tot / av.length), a = [0, 0, 0, 0, 0]; av.forEach((i) => (a[i] = base)); a[av[av.length - 1]] += tot - base * av.length; setH(a); };
  const save = () => { const plan = {}; h.forEach((v, i) => { if (v > 0 && i >= startDi) plan[i] = v; }); onSave(item.id, plan); };
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: "rgba(28,25,23,.45)", zIndex: 70 }} onClick={onClose}>
      <div className="rounded-2xl w-full" style={{ background: "#fff", maxWidth: 460, maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #f0eee9" }}>
          <Scissors size={16} color={BRAND} /><span style={{ ...serif, fontSize: 18, fontWeight: 700 }}>Repartir horas en la semana</span>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="text-sm"><span style={{ fontWeight: 600 }}>{sku.name} ×{item.cantidad}</span>{item.parte ? <span className="text-xs ml-1" style={{ color: "#155e75" }}>· {item.parte}</span> : null}<span className="text-xs ml-2" style={{ color: "#a8a29e" }}>{item.marca} · {WEEKLBL[item.sem]}</span></div>
          <div className="rounded-xl px-3 py-2 flex items-center justify-between" style={{ background: rem === 0 ? "#f0fdfa" : "#faf9f6" }}>
            <span className="text-xs" style={{ color: "#57534e" }}>Total de la tarea: <strong>{tot} h</strong></span>
            <span className="text-xs" style={{ color: rem === 0 ? "#115e59" : rem < 0 ? "#9f1239" : "#92400e", fontWeight: 600 }}>{rem === 0 ? "✓ todo repartido" : rem > 0 ? `faltan ${rem} h` : `sobran ${-rem} h`}</span>
          </div>
          <div className="space-y-1.5">
            {days.map((d, i) => { const disabled = i < startDi; return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm" style={{ width: 78, color: disabled ? "#c4c0b8" : i === todayIdx ? BRAND : INK, fontWeight: i === todayIdx ? 700 : 500 }}>{DAYS[i]} {d.getDate()}{i === todayIdx ? " · hoy" : ""}</span>
                {disabled
                  ? <span className="text-xs flex-1" style={{ color: "#c4c0b8" }}>— día pasado</span>
                  : <><input type="number" min="0" value={h[i] || ""} onChange={(e) => setDay(i, e.target.value)} placeholder="0" style={{ ...inp, width: 90, padding: "6px 9px" }} /><span className="text-xs" style={{ color: "#a8a29e" }}>h</span>
                    <div className="flex-1 rounded-full overflow-hidden" style={{ background: "#f0eee9", height: 6 }}><div style={{ width: Math.min(100, tot ? (h[i] / tot) * 100 : 0) + "%", height: "100%", background: BRAND }} /></div></>}
              </div>
            ); })}
          </div>
          <button onClick={even} className="text-xs flex items-center gap-1 rounded-full px-3 py-1.5" style={{ background: "#f0eee9", color: "#57534e", fontWeight: 600 }}><Layers size={12} /> Repartir parejo</button>
          <div className="text-xs" style={{ color: "#a8a29e" }}>Distribuye las {tot} h entre los días que quieras. La suma debe cuadrar con el total.</div>
        </div>
        <div className="px-5 py-4 flex items-center justify-between gap-2" style={{ borderTop: "1px solid #f0eee9" }}>
          <button onClick={() => onSave(item.id, null)} className="text-xs px-3 py-2 rounded-full" style={{ background: "#f5f5f4", color: "#9f1239", fontWeight: 600 }}>Quitar reparto</button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-sm px-4 py-2 rounded-full" style={{ background: "#f5f5f4", color: "#57534e", fontWeight: 600 }}>Cancelar</button>
            <button onClick={save} disabled={!valid} className="text-sm px-4 py-2 rounded-full flex items-center gap-1" style={{ background: valid ? BRAND : "#e7e5e4", color: valid ? "#fff" : "#a8a29e", fontWeight: 600 }}><Check size={14} /> Aplicar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ingreso({ onAdd, week, actingExec, isDirector, lineaView, campaigns = [] }) {
  const defOwner = actingExec || EJECUTIVOS[0];
  const defLinea = !isDirector && lineaView && LINEAS.includes(lineaView) ? lineaView : LINEAS[0];
  const [mode, setMode] = useState(null); const [step, setStep] = useState("camp");
  const [aiText, setAiText] = useState(""); const [aiLoading, setAiLoading] = useState(false); const [aiError, setAiError] = useState("");
  const [head, setHead] = useState({ marca: MARCAS[0], categoria: "Marcas", linea: defLinea, campana: "", campanaNueva: false, ejecutivo: defOwner, cliente: CLIENTES[0], producto: PRODUCTOS[0], division: DIVISIONES[0], fInicio: iso(TODAY), fFin: iso(addDays(TODAY, 21)), fAire: iso(addDays(TODAY, 21)) });
  const [plantilla, setPlantilla] = useState(""); const [draft, setDraft] = useState({ sem: week, skuId: "post", etiqueta: skuById("post").cx, cantidad: 1, poCliente: POS[0] });
  const [lista, setLista] = useState([]); const [brief, setBrief] = useState("");
  const [editTime, setEditTime] = useState(null);
  const saveTime = (i, map) => { setLista((p) => p.map((l, j) => (j === i ? { ...l, assignedHours: map } : l))); setEditTime(null); };
  const setH = (k, v) => setHead((s) => ({ ...s, [k]: v }));
  const setLine = (i, k, v) => setLista((p) => p.map((l, j) => (j === i ? { ...l, [k]: v } : l)));
  const pickCampaign = (name) => { const c = campaigns.find((x) => x.name === name); const cc = catOf(name); setHead((s) => ({ ...s, campana: name, categoria: cc, ...(c ? { marca: c.marca, fAire: c.fAire, fFin: c.fAire } : {}), linea: segFor(cc, c ? c.marca : s.marca) })); };
  const addLinea = () => setLista((p) => [...p, { ...draft, cantidad: Number(draft.cantidad) || 1 }]);
  const rmLinea = (i) => setLista((p) => p.filter((_, j) => j !== i));
  const applyPlantilla = (id) => { setPlantilla(id); const t = PLANTILLAS.find((x) => x.id === id); if (t) setLista(t.items.map(([skuId, etiqueta, cantidad]) => ({ skuId, etiqueta, cantidad, sem: week, poCliente: POS[0] }))); };
  const submit = (asDraft) => { if (!lista.length) return; const cc = head.campanaNueva ? head.categoria : catOf(head.campana); const seg = segFor(cc, head.marca); onAdd(lista.map((l) => ({ ...head, ...l, categoria: cc, linea: seg, brief, campana: head.campana || "Sin campaña", fAire: head.fFin || head.fAire })), asDraft); };
  const goFromCamp = () => setStep(head.campanaNueva ? "new" : "tasks");
  async function runAI() {
    setAiLoading(true); setAiError("");
    const prompt = `Estructura un pedido de tráfico de agencia. Devuelve SOLO JSON válido, sin markdown.
marca ∈ ${JSON.stringify(MARCAS)}; categoria ∈ ${JSON.stringify(CATEGORIAS)}; ejecutivo ∈ ${JSON.stringify(EJECUTIVOS)}; poCliente ∈ ${JSON.stringify(POS)}.
entregables.sku usa nombre exacto de ${JSON.stringify(SKUS.map((s) => s.name))}; etiqueta ∈ ["simple","media","alta"]. fAire YYYY-MM-DD (hoy ${iso(TODAY)}).
Esquema: {"marca","categoria","campana","ejecutivo","poCliente","fAire","entregables":[{"sku","etiqueta","cantidad"}]}
Pedido: """${aiText}"""`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }) });
      const data = await res.json();
      const txt = data.content.filter((b) => b.type === "text").map((b) => b.text).join("").replace(/```json|```/g, "").trim();
      const j = JSON.parse(txt);
      setHead((s) => ({ ...s, marca: MARCAS.includes(j.marca) ? j.marca : s.marca, categoria: CATEGORIAS.includes(j.categoria) ? j.categoria : s.categoria, campana: j.campana || s.campana, campanaNueva: !CAMPANAS.includes(j.campana), ejecutivo: isDirector && EJECUTIVOS.includes(j.ejecutivo) ? j.ejecutivo : s.ejecutivo, fFin: /^\d{4}-\d{2}-\d{2}$/.test(j.fAire) ? j.fAire : s.fFin, fAire: /^\d{4}-\d{2}-\d{2}$/.test(j.fAire) ? j.fAire : s.fAire }));
      const po = POS.includes(j.poCliente) ? j.poCliente : POS[0];
      setLista((j.entregables || []).map((e) => { const sku = SKUS.find((s) => s.name.toLowerCase() === String(e.sku).toLowerCase()) || SKUS.find((s) => s.name.toLowerCase().includes(String(e.sku).toLowerCase())) || SKUS[0]; return { skuId: sku.id, etiqueta: ["simple", "media", "alta"].includes(e.etiqueta) ? e.etiqueta : "media", cantidad: Number(e.cantidad) || 1, sem: week, poCliente: po }; }));
      setMode("manual"); setStep("camp");
    } catch (e) { setAiError("No se pudo interpretar. Revisa el texto o usa el modo manual."); } finally { setAiLoading(false); }
  }
  if (!mode) return (
    <Card>
      <div style={{ ...serif, fontSize: 20, fontWeight: 700 }} className="mb-1">Ingresar pedido</div><p className="text-xs mb-5" style={{ color: "#78716c" }}>¿Cómo quieres cargarlo?</p>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setMode("ia")} className="rounded-2xl p-5 text-left" style={{ border: "1px solid #99f6e4", background: "#f0fdfa" }}><div className="rounded-full flex items-center justify-center mb-3" style={{ width: 44, height: 44, background: BRAND }}><Sparkles size={22} color="#fff" /></div><div style={{ fontWeight: 700, color: "#115e59" }}>Con IA</div><div className="text-xs mt-1" style={{ color: "#115e59" }}>Descríbelo en lenguaje natural y se llena solo. Tú revisas y confirmas.</div></button>
        <button onClick={() => setMode("manual")} className="rounded-2xl p-5 text-left" style={{ border: "1px solid #e7e5e4", background: "#faf9f6" }}><div className="rounded-full flex items-center justify-center mb-3" style={{ width: 44, height: 44, background: INK }}><Pencil size={20} color="#fff" /></div><div style={{ fontWeight: 700 }}>Manual</div><div className="text-xs mt-1" style={{ color: "#78716c" }}>Paso a paso, con plantillas opcionales.</div></button>
      </div>
    </Card>
  );
  if (mode === "ia") return (
    <Card>
      <button onClick={() => setMode(null)} className="text-xs flex items-center gap-1 mb-3" style={{ color: "#78716c" }}><ArrowLeft size={13} /> volver</button>
      <div className="flex items-center gap-2 mb-1"><Sparkles size={18} color={BRAND} /><span style={{ ...serif, fontSize: 20, fontWeight: 700 }}>Ingreso con IA</span></div><p className="text-xs mb-4" style={{ color: "#78716c" }}>Escribe el pedido como te lo pidieron. Claude lo estructura.</p>
      <textarea value={aiText} onChange={(e) => setAiText(e.target.value)} rows={4} style={{ ...inp, fontSize: 14 }} placeholder='Ej: "Para DIS, campaña Día de la madre, segmento temporalidades, PO Carla Ríos: 3 key visuals complejidad alta y 18 posts simples, al aire el 12 de junio."' />
      {aiError && <div className="text-xs mt-2" style={{ color: "#be123c" }}>{aiError}</div>}
      <button onClick={runAI} disabled={aiLoading || !aiText.trim()} className="mt-4 flex items-center gap-2 rounded-full px-5 py-3 text-sm" style={{ background: aiLoading || !aiText.trim() ? "#d6d3d1" : BRAND, color: "#fff", fontWeight: 600 }}>{aiLoading ? "Interpretando…" : <>Generar pedido <Sparkles size={15} /></>}</button>
    </Card>
  );
  const et = etById(draft.etiqueta);
  return (
    <>
    <Card>
      {(() => { const steps = head.campanaNueva ? ["camp", "new", "tasks"] : ["camp", "tasks"]; const lbl = { camp: "Campaña", new: "Nueva campaña", tasks: "Tareas" }; return <div className="flex items-center justify-between mb-4"><button onClick={() => setMode(null)} className="text-xs flex items-center gap-1" style={{ color: "#78716c" }}><ArrowLeft size={13} /> volver</button><div className="flex items-center gap-2">{steps.map((s, i) => <div key={s} className="flex items-center gap-2"><div className="rounded-full flex items-center justify-center text-xs" style={{ width: 24, height: 24, background: step === s ? INK : "#e7e5e4", color: step === s ? "#fff" : "#78716c", fontWeight: 700 }}>{i + 1}</div><span className="text-xs" style={{ color: step === s ? INK : "#a8a29e", fontWeight: step === s ? 600 : 500 }}>{lbl[s]}</span>{i < steps.length - 1 && <ChevronRight size={14} color="#d6d3d1" />}</div>)}</div></div>; })()}
      {step === "camp" && (
        <div>
          <p className="text-xs mb-4" style={{ color: "#78716c" }}>El dueño de la tarea es quien la crea. Solo el Director puede asignarla a otro ejecutivo o asignársela a sí mismo.</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Dueño de la tarea (ejecutivo)">{isDirector
              ? <select style={inp} value={head.ejecutivo} onChange={(e) => setH("ejecutivo", e.target.value)}><option value="Director">Director (yo)</option>{EJECUTIVOS.map((x) => <option key={x}>{x}</option>)}</select>
              : <div style={{ ...inp, background: "#f5f5f4", display: "flex", alignItems: "center", gap: 6 }}><Lock size={13} color="#a8a29e" /> {head.ejecutivo}</div>}
            </Field>
            <Field label="Campaña">{head.campanaNueva
              ? <div style={{ ...inp, background: "#f0fdfa", color: "#115e59", display: "flex", alignItems: "center", gap: 6 }}><PlusCircle size={13} /> Nueva campaña · la configuras en el siguiente paso</div>
              : <select style={inp} value={head.campana} onChange={(e) => pickCampaign(e.target.value)}><option value="">Buscar y elegir…</option>{campaigns.map((c) => <option key={c.name}>{c.name}</option>)}</select>}
              <button onClick={() => { setH("campanaNueva", !head.campanaNueva); setH("campana", ""); }} className="text-xs mt-1" style={{ color: BRAND, fontWeight: 600 }}>{head.campanaNueva ? "← elegir una existente" : "+ crear campaña nueva"}</button>
            </Field>
          </div>
          {!head.campanaNueva && head.campana && <div className="text-xs mt-3 rounded-lg px-3 py-2" style={{ background: "#f0fdfa", color: "#115e59" }}>Campaña existente · Marca {head.marca} · {head.categoria}{head.categoria === "Temporalidades" ? " · segmento se define al aceptar" : ` · Segmento ${segFor(head.categoria, head.marca)}`} · al aire {fmt(head.fAire)}. Pasas directo a las tareas.</div>}
          <button onClick={goFromCamp} disabled={!(head.campanaNueva || head.campana.trim())} className="mt-5 flex items-center gap-2 rounded-full px-5 py-3 text-sm" style={{ background: head.campanaNueva || head.campana.trim() ? INK : "#d6d3d1", color: PAPER, fontWeight: 600 }}>Siguiente <ArrowRight size={16} /></button>
        </div>
      )}
      {step === "new" && (
        <div>
          <p className="text-xs mb-4" style={{ color: "#78716c" }}>Configura la nueva campaña. Se creará en COR dentro de la marca, con sus dos proyectos (cliente y agencia).</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre de la campaña / proyecto"><input style={inp} placeholder="Ej: Verano 360" value={head.campana} onChange={(e) => setH("campana", e.target.value)} /></Field>
            <Field label="Cliente"><select style={inp} value={head.cliente} onChange={(e) => setH("cliente", e.target.value)}>{CLIENTES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Marca"><select style={inp} value={head.marca} onChange={(e) => setH("marca", e.target.value)}>{MARCAS.map((m) => <option key={m}>{m}</option>)}</select></Field>
            <Field label="Categoría"><select style={inp} value={head.categoria} onChange={(e) => setH("categoria", e.target.value)}>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}</select>{head.categoria === "Marcas" ? <div className="text-xs mt-1" style={{ color: "#a8a29e" }}>Segmento por marca → <b>{segFor("Marcas", head.marca)}</b></div> : head.categoria === "Temporalidades" ? <div className="text-xs mt-1" style={{ color: "#a8a29e" }}>El segmento (DC1/DC2) lo elige el cliente al aceptar</div> : <div className="text-xs mt-1" style={{ color: "#a8a29e" }}>Segmento fijo → <b>{segFor(head.categoria, head.marca)}</b></div>}</Field>
            <Field label="Producto"><select style={inp} value={head.producto} onChange={(e) => setH("producto", e.target.value)}>{PRODUCTOS.map((p) => <option key={p}>{p}</option>)}</select></Field>
            <Field label="División"><select style={inp} value={head.division} onChange={(e) => setH("division", e.target.value)}>{DIVISIONES.map((d) => <option key={d}>{d}</option>)}</select></Field>
            <Field label="Plantilla de tareas (opcional)"><select style={inp} value={plantilla} onChange={(e) => applyPlantilla(e.target.value)}><option value="">Sin plantilla</option>{PLANTILLAS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
            <Field label="Fecha de inicio (creación)"><input type="date" style={inp} value={head.fInicio} onChange={(e) => setH("fInicio", e.target.value)} /></Field>
            <Field label="Fecha de fin"><input type="date" style={inp} value={head.fFin} onChange={(e) => setH("fFin", e.target.value)} /></Field>
          </div>
          {plantilla && <div className="text-xs mt-3" style={{ color: BRAND }}>Plantilla cargada: {lista.length} tareas listas en el siguiente paso (ajusta semana, PO y tiempos).</div>}
          <div className="flex items-center gap-2 mt-5"><button onClick={() => setStep("camp")} className="rounded-full px-4 py-3 text-sm flex items-center gap-1" style={{ background: "#e7e5e4", color: INK, fontWeight: 600 }}><ArrowLeft size={15} /> Atrás</button><button onClick={() => setStep("tasks")} disabled={!head.campana.trim()} className="flex items-center gap-2 rounded-full px-5 py-3 text-sm" style={{ background: head.campana.trim() ? INK : "#d6d3d1", color: PAPER, fontWeight: 600 }}>Siguiente <ArrowRight size={16} /></button></div>
        </div>
      )}
      {step === "tasks" && (
        <div>
          <div className="rounded-xl p-4 mb-4" style={{ background: "#faf9f6", border: "1px solid #e7e5e4" }}>
            <div className="mb-3">
              <label className="text-xs block mb-2 flex items-center gap-1.5" style={{ color: "#78716c", fontWeight: 600 }}><CalendarDays size={13} /> Semana de ingreso</label>
              <div className="flex items-center gap-1 overflow-x-auto" style={{ paddingBottom: 2 }}>{WEEKS.map((i) => { const nm = i === 0 || weekStart(i).getMonth() !== weekStart(i - 1).getMonth(); return (
                <span key={i} className="flex items-center gap-1" style={{ whiteSpace: "nowrap" }}>
                  {nm && <span className="text-xs pl-1.5 pr-0.5 flex-shrink-0" style={{ color: "#c4c0b8", fontWeight: 700, textTransform: "capitalize" }}>{monthOf(i)}</span>}
                  <button onClick={() => setDraft((d) => ({ ...d, sem: i }))} className="rounded-xl px-3 py-2 text-left flex-shrink-0" style={{ border: draft.sem === i ? `1.5px solid ${BRAND}` : "1px solid #e7e5e4", background: draft.sem === i ? "#f0fdfa" : "#fff" }}><div className="text-xs" style={{ fontWeight: 700, color: draft.sem === i ? "#115e59" : INK }}>{i === 0 ? "Sem. actual" : i === 1 ? "Próxima" : `Semana ${i + 1}`}</div><div className="text-xs mt-0.5" style={{ color: draft.sem === i ? "#0f766e" : "#a8a29e" }}>{weekRange(i)}</div></button>
                </span>); })}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Entregable"><select style={inp} value={draft.skuId} onChange={(e) => setDraft((d) => ({ ...d, skuId: e.target.value, etiqueta: skuById(e.target.value).cx }))}>{SKUS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
              <Field label="Complejidad"><select style={inp} value={draft.etiqueta} onChange={(e) => setDraft((d) => ({ ...d, etiqueta: e.target.value }))}>{ETIQUETAS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></Field>
            </div>
            <div className="grid grid-cols-2 gap-3"><Field label="Cantidad"><input type="number" min="1" style={inp} value={draft.cantidad} onChange={(e) => setDraft((d) => ({ ...d, cantidad: e.target.value }))} /></Field><Field label="PO Cliente"><select style={inp} value={draft.poCliente} onChange={(e) => setDraft((d) => ({ ...d, poCliente: e.target.value }))}>{POS.map((p) => <option key={p}>{p}</option>)}</select></Field></div>
            <div className="flex items-center justify-between mt-3"><span className="text-xs" style={{ color: "#78716c" }}>Estimado: <b>{itemHours({ skuId: draft.skuId, etiqueta: draft.etiqueta, cantidad: Number(draft.cantidad) || 1 }).tot} h</b> · {et.name}</span><button onClick={addLinea} className="text-xs flex items-center gap-1 rounded-full px-3 py-2" style={{ background: BRAND, color: "#fff", fontWeight: 600 }}><PlusCircle size={13} /> Agregar a la lista</button></div>
          </div>
          {lista.length > 0 && <div className="rounded-xl mb-4" style={{ border: "1px solid #e7e5e4" }}>{lista.map((l, i) => { const s = skuById(l.skuId), e = etById(l.etiqueta); return <div key={i} className="px-4 py-2.5 flex items-center justify-between flex-wrap gap-2" style={{ borderTop: i ? "1px solid #f7f5f1" : "none" }}><div className="text-sm flex items-center gap-1.5">{s.name} <span style={{ color: "#a8a29e" }}>×{l.cantidad}</span> <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#f0eee9", color: "#57534e", fontWeight: 600 }}>{e.name}</span></div><div className="flex items-center gap-2 flex-wrap"><select value={l.sem} onChange={(ev) => setLine(i, "sem", Number(ev.target.value))} title="Semana de ingreso" style={{ ...dateInput, padding: "4px 6px", fontSize: 11 }}>{WEEKS.map((sm) => <option key={sm} value={sm}>{sm === 0 ? "Sem. actual" : weekRange(sm)}</option>)}</select><select value={l.poCliente} onChange={(ev) => setLine(i, "poCliente", ev.target.value)} title="PO cliente" style={{ ...dateInput, padding: "4px 6px", fontSize: 11 }}>{POS.map((p) => <option key={p}>{p}</option>)}</select><span className="text-xs" style={{ color: l.assignedHours ? BRAND : "#78716c", fontWeight: l.assignedHours ? 600 : 400 }}>{itemHours(l).tot} h · {l.assignedHours ? "asignado" : "sugerido"}</span><button onClick={() => setEditTime(i)} title="Cambiar tiempos por rol" style={{ color: l.assignedHours ? BRAND : "#a8a29e" }}><SlidersHorizontal size={15} /></button><button onClick={() => rmLinea(i)} style={{ color: "#be123c" }}><Trash2 size={14} /></button></div></div>; })}</div>}
          <Field label="Brief o comentarios del pedido"><textarea value={brief} onChange={(e) => setBrief(e.target.value)} rows={2} style={{ ...inp, fontSize: 14 }} placeholder="Contexto, referencias, links…" /></Field>
          <div className="text-xs mt-1 mb-4 flex items-center gap-1" style={{ color: "#a8a29e" }}><Paperclip size={12} /> Adjuntar archivo (en la versión real)</div>
          <div className="flex items-center gap-2"><button onClick={() => setStep(head.campanaNueva ? "new" : "camp")} className="rounded-full px-4 py-3 text-sm flex items-center gap-1" style={{ background: "#e7e5e4", color: INK, fontWeight: 600 }}><ArrowLeft size={15} /> Atrás</button><button onClick={() => submit(true)} disabled={!lista.length} className="rounded-full px-4 py-3 text-sm flex items-center gap-1" style={{ background: "#faf9f6", border: "1px solid #e7e5e4", color: lista.length ? INK : "#a8a29e", fontWeight: 600 }}><Save size={15} /> Guardar borrador</button><button onClick={() => submit(false)} disabled={!lista.length} className="rounded-full px-5 py-3 text-sm flex items-center gap-1" style={{ background: lista.length ? INK : "#d6d3d1", color: PAPER, fontWeight: 600 }}>Ingresar a la cola <ArrowRight size={16} /></button></div>
        </div>
      )}
    </Card>
    {editTime != null && lista[editTime] && <AssignTimeModal entry={lista[editTime]} onClose={() => setEditTime(null)} onSave={(map) => saveTime(editTime, map)} />}
    </>
  );
}

function DecisionModal({ decision, consAll, onClose, onConfirm, onSplit }) {
  const { item, action } = decision;
  const accept = action === "aceptar";
  const [sem, setSem] = useState(item.sem);
  const [tab, setTab] = useState("single");
  const { per, tot } = itemHours(item);
  const isTemp = item.categoria === "Temporalidades";
  const [seg, setSeg] = useState(LINEAS.includes(item.linea) ? item.linea : "DC1");
  const linea = isTemp ? seg : item.linea, cap = totalCapLinea(linea);
  const info = (s) => {
    const c = consAll[s][linea], cf = capFactor(s), capS = cap * cf;
    const projTot = ROLES.reduce((a, r) => a + c[r.id] + (accept ? per[r.id] : 0), 0);
    const rows = ROLES.filter((r) => c[r.id] + per[r.id] > CAP[linea][r.id] * cf).map((r) => { const pj = c[r.id] + per[r.id], cp = CAP[linea][r.id] * cf; return { name: r.name, pct: cp ? Math.round((pj / cp) * 100) : 999, hard: pj > STRESS * cp }; });
    return { pct: capS ? Math.round((projTot / capS) * 100) : 0, rows, blocked: rows.some((x) => x.hard) };
  };
  const cur = info(sem);
  const blocked = accept && tab === "single" && cur.blocked;
  const headFrac = (s, limit) => { const cf = capFactor(s); let f = 1; ROLES.forEach((r) => { if (per[r.id] > 0) { const head = Math.max(0, limit * CAP[linea][r.id] * cf - consAll[s][linea][r.id]); f = Math.min(f, head / per[r.id]); } }); return Math.max(0, Math.min(1, f)); };
  const fitPctNow = Math.floor(headFrac(item.sem, 1) * 100);
  const fitHoursNow = Math.round((tot * fitPctNow) / 100);
  const nextSem = Math.min(HORIZON, item.sem + 1);
  const TRAMOS = ["Creación", "Ajustes", "Arte final", "Entrega"];
  const computeSuggestion = () => {
    let rem = 1; const res = [];
    for (let s = item.sem; s <= HORIZON && rem > 0.005; s++) {
      let take;
      if (s === HORIZON || res.length === 3) take = rem;
      else { const fit = Math.min(rem, headFrac(s, 1)); if (fit <= 0.005) continue; take = fit; }
      res.push({ sem: s, frac: take }); rem -= take;
      if (res.length >= 4) break;
    }
    if (!res.length) res.push({ sem: item.sem, frac: 1 });
    const pcts = res.map((r) => Math.round(r.frac * 100));
    pcts[pcts.length - 1] += 100 - pcts.reduce((a, b) => a + b, 0);
    return res.map((r, i) => ({ label: TRAMOS[i] || `Tramo ${i + 1}`, sem: r.sem, pct: Math.max(0, pcts[i]) }));
  };
  const [parts, setParts] = useState(computeSuggestion);
  const setPart = (i, k, v) => setParts((p) => p.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const addPart = () => setParts((p) => (p.length < 4 ? [...p, { label: TRAMOS[p.length] || `Tramo ${p.length + 1}`, sem: nextSem, pct: Math.max(0, 100 - p.reduce((a, x) => a + (Number(x.pct) || 0), 0)) }] : p));
  const suggestSplit = () => setParts(computeSuggestion());
  const rmPart = (i) => setParts((p) => (p.length > 2 ? p.filter((_, j) => j !== i) : p));
  const sumPct = parts.reduce((a, p) => a + (Number(p.pct) || 0), 0);
  const weekAdds = {}; parts.forEach((p) => { const f = (Number(p.pct) || 0) / 100; weekAdds[p.sem] = weekAdds[p.sem] || zeroRoles(); ROLES.forEach((r) => (weekAdds[p.sem][r.id] += per[r.id] * f)); });
  let splitHard = false; Object.keys(weekAdds).forEach((s) => ROLES.forEach((r) => { const proj = consAll[s][linea][r.id] + weekAdds[s][r.id], cp = CAP[linea][r.id] * capFactor(Number(s)); if (proj > STRESS * cp) splitHard = true; }));
  const splitValid = sumPct === 100 && !splitHard;
  const weekHard = (s) => ROLES.some((r) => consAll[s][linea][r.id] + (weekAdds[s] ? weekAdds[s][r.id] : 0) > STRESS * CAP[linea][r.id] * capFactor(s));
  const reAcc = accept && !!item.corId;
  const title = !accept ? "Marcar como provisional" : tab === "split" ? "Dividir en semanas" : blocked ? "No entra en esta semana" : cur.rows.length ? "Entra en zona de estrés" : reAcc ? "Reactivar y replanificar" : "Aceptar y crear en COR";
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 py-6" style={{ background: "rgba(28,25,23,0.45)", zIndex: 50 }}>
      <div className="rounded-2xl p-6 w-full" style={{ background: "#fff", maxWidth: 520 }}>
        <div className="flex items-center gap-3 mb-3"><div className="rounded-full flex items-center justify-center" style={{ width: 40, height: 40, background: blocked ? "#fee2e2" : !accept ? "#dbeafe" : tab === "split" ? "#ecfeff" : cur.rows.length ? "#fef3c7" : "#ccfbf1" }}>{blocked ? <X size={20} color="#be123c" /> : !accept ? <Clock size={20} color="#1d4ed8" /> : tab === "split" ? <Scissors size={20} color="#0f766e" /> : cur.rows.length ? <AlertTriangle size={20} color="#b45309" /> : <Check size={20} color={BRAND} />}</div><div style={{ ...serif, fontSize: 20, fontWeight: 700 }}>{title}</div></div>
        <p className="text-sm mb-4" style={{ color: "#57534e" }}><b>{skuById(item.skuId).name} ×{item.cantidad}</b> · {item.campana} · {linea} · <b>{tot} h</b></p>
        {isTemp && accept && (
          <div className="rounded-xl px-3 py-2.5 mb-4" style={{ background: "#faf9f6", border: "1px solid #e7e5e4" }}>
            <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: "#78716c", fontWeight: 600 }}><Layers size={13} color={BRAND} /> Temporalidad · ¿a qué tráfico entra?</div>
            <div className="flex items-center gap-1 rounded-full p-1" style={{ background: "#f0eee9", width: "fit-content" }}>{LINEAS.map((l) => <button key={l} onClick={() => setSeg(l)} className="px-3 py-1 rounded-full text-xs" style={{ background: seg === l ? "#fff" : "transparent", fontWeight: 600, color: seg === l ? INK : "#78716c" }}>{l}</button>)}</div>
          </div>
        )}
        {accept && (
          <div className="flex items-center gap-1 mb-4 rounded-full p-1" style={{ background: "#f0eee9", width: "fit-content" }}>
            <button onClick={() => setTab("single")} className="px-3 py-1 rounded-full text-xs flex items-center gap-1" style={{ background: tab === "single" ? "#fff" : "transparent", fontWeight: 600, color: INK }}><CalendarDays size={12} /> Una semana</button>
            <button onClick={() => setTab("split")} className="px-3 py-1 rounded-full text-xs flex items-center gap-1" style={{ background: tab === "split" ? "#fff" : "transparent", fontWeight: 600, color: INK }}><Scissors size={12} /> Dividir en semanas</button>
          </div>
        )}
        {(!accept || tab === "single") && (<>
          <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: "#78716c", fontWeight: 600 }}><CalendarDays size={13} /> Planificar en la semana{accept ? " (elige una donde quepa)" : ""}:</div>
          <div className="grid grid-cols-4 gap-2 mb-4">{WEEKS.filter((w) => w >= item.sem).slice(0, 4).map((s) => { const w = info(s); const sel = sem === s; const st = statusColor(w.pct); return (
            <button key={s} onClick={() => setSem(s)} className="rounded-xl p-2 text-left" style={{ border: sel ? `1.5px solid ${INK}` : "1px solid #e7e5e4", background: sel ? "#faf9f6" : "#fff" }}>
              <div className="text-xs" style={{ fontWeight: 700 }}>{s === 0 ? "Actual" : s === 1 ? "Próxima" : `Semana ${s + 1}`}</div><div className="text-xs" style={{ color: "#a8a29e" }}>{weekRange(s)}</div><div className="text-xs mt-1" style={{ color: accept && w.blocked ? "#be123c" : st.text, fontWeight: 700 }}>{w.pct}%{accept && w.blocked ? " · no entra" : ""}</div>
            </button>
          ); })}</div>
          {accept && cur.rows.length > 0 && <div className="space-y-2 mb-4">{cur.rows.map((r) => <div key={r.name} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: r.hard ? "#fef2f2" : "#fffbeb" }}><span className="text-sm" style={{ color: r.hard ? "#9f1239" : "#92400e", fontWeight: 600 }}>{r.name}</span><span className="text-sm" style={{ color: r.hard ? "#9f1239" : "#92400e" }}>llegaría a {r.pct}%{r.hard ? " · sobre 120%" : ""}</span></div>)}</div>}
          <p className="text-xs mb-5" style={{ color: "#78716c" }}>{blocked ? "No entra en esta semana (supera el 120%). Elige otra." : !accept ? "Queda reservado (no se crea en COR) y planificado en la semana elegida." : cur.rows.length ? "Entra en zona de estrés (100–120%). Acepta con cuidado." : reAcc ? "Es una tarea que se había suspendido: al confirmar se reactiva sobre la MISMA tarea de COR y se replanifica en la semana elegida." : "Al confirmar se crea la tarea en COR en la semana elegida."}</p>
        </>)}
        {accept && tab === "split" && (<>
          <div className="rounded-xl px-3 py-2.5 mb-3 text-xs" style={{ background: "#f0fdfa", color: "#115e59" }}>
            <div style={{ fontWeight: 600 }}>{fitPctNow > 0 ? `${WEEKLBL[item.sem]} admite ~${fitHoursNow} h más (${fitPctNow}% del entregable) sin pasarse.` : `${WEEKLBL[item.sem]} ya no tiene cupo: conviene llevar todo a otra semana.`}</div>
            <div>Restan {tot - fitHoursNow} h ({100 - fitPctNow}%) por ubicar. Usa "Sugerir división" o ajusta los % a mano.</div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: "#78716c" }}>Cada parte va a una semana con su % (de {tot} h).</span>
            <button onClick={suggestSplit} className="text-xs flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: "#ccfbf1", color: "#115e59", fontWeight: 600 }}><Sparkles size={12} /> Sugerir división</button>
          </div>
          <div className="space-y-2 mb-2">{parts.map((p, i) => { const ph = Math.round(tot * (Number(p.pct) || 0) / 100); const hard = weekHard(p.sem); return (
            <div key={i} className="flex items-center gap-2">
              <input value={p.label} onChange={(e) => setPart(i, "label", e.target.value)} style={{ ...inp, padding: "6px 9px", flex: 1 }} placeholder={`Tramo ${i + 1}`} />
              <select value={p.sem} onChange={(e) => setPart(i, "sem", Number(e.target.value))} style={{ ...dateInput, padding: "6px 8px" }}>{WEEKS.map((s) => <option key={s} value={s}>{s === 0 ? "Actual" : weekRange(s)}</option>)}</select>
              <div className="flex items-center gap-1"><input type="number" min="0" max="100" value={p.pct} onChange={(e) => setPart(i, "pct", Number(e.target.value))} style={{ ...inp, padding: "6px 6px", width: 48 }} /><span className="text-xs" style={{ color: "#a8a29e" }}>%</span></div>
              <span className="text-xs" style={{ color: "#78716c", width: 34, textAlign: "right" }}>{ph}h</span>
              {hard ? <AlertTriangle size={15} color="#be123c" style={{ flexShrink: 0 }} title="Esta semana se pasaría del 120%: baja el % o muévela" /> : <span style={{ width: 15, flexShrink: 0 }} />}
              <button onClick={() => rmPart(i)} disabled={parts.length <= 2} style={{ color: parts.length <= 2 ? "#d6d3d1" : "#be123c" }}><Trash2 size={14} /></button>
            </div>
          ); })}</div>
          <div className="flex items-center justify-between mb-3">
            <button onClick={addPart} disabled={parts.length >= 4} className="text-xs flex items-center gap-1" style={{ color: parts.length >= 4 ? "#d6d3d1" : BRAND, fontWeight: 600 }}><PlusCircle size={13} /> Agregar parte</button>
            <span className="text-xs" style={{ color: sumPct === 100 ? "#115e59" : "#be123c", fontWeight: 600 }}>{sumPct}% asignado{sumPct !== 100 ? " · debe sumar 100%" : " ✓"}</span>
          </div>
          <p className="text-xs mb-5" style={{ color: splitHard ? "#be123c" : "#78716c" }}>{splitHard ? "Alguna parte deja su semana sobre el 120% (mira el de cada fila). Baja su porcentaje o muévela a otra semana." : reAcc ? "Sigue siendo una sola tarea en COR (la misma que ya existía); solo se reparte su trabajo entre las semanas indicadas." : "Se crea una sola tarea en COR; solo se reparte su trabajo entre las semanas indicadas."}</p>
        </>)}
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-full py-2.5 text-sm" style={{ background: "#e7e5e4", color: INK, fontWeight: 600 }}>Cancelar</button>
          {accept && tab === "split"
            ? <button onClick={() => onSplit(item, parts.map((p) => ({ ...p, pct: Number(p.pct) || 0 })), isTemp ? seg : undefined)} disabled={!splitValid} className="flex-1 rounded-full py-2.5 text-sm" style={{ background: splitValid ? BRAND : "#d6d3d1", color: "#fff", fontWeight: 600 }}>Aceptar dividido</button>
            : <button onClick={() => onConfirm(item, action, sem, isTemp ? seg : undefined)} disabled={blocked} className="flex-1 rounded-full py-2.5 text-sm" style={{ background: blocked ? "#d6d3d1" : !accept ? "#1d4ed8" : cur.rows.length ? "#b45309" : BRAND, color: "#fff", fontWeight: 600 }}>{!accept ? "Marcar provisional" : cur.rows.length ? "Aceptar igual" : "Confirmar"}</button>}
        </div>
      </div>
    </div>
  );
}
function EditModal({ item, onClose, onSave }) {
  const [it, setIt] = useState(item);
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4" style={{ background: "rgba(28,25,23,0.45)", zIndex: 50 }}>
      <div className="rounded-2xl p-6 max-w-md w-full" style={{ background: "#fff" }}>
        <div style={{ ...serif, fontSize: 20, fontWeight: 700 }} className="mb-1">Editar entregable</div><p className="text-xs mb-4" style={{ color: "#78716c" }}>{item.id} · {item.campana}</p>
        <div className="space-y-3"><Field label="Entregable"><select style={inp} value={it.skuId} onChange={(e) => setIt((s) => ({ ...s, skuId: e.target.value }))}>{SKUS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><div className="grid grid-cols-2 gap-3"><Field label="Etiqueta"><select style={inp} value={it.etiqueta} onChange={(e) => setIt((s) => ({ ...s, etiqueta: e.target.value }))}>{ETIQUETAS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></Field><Field label="Cantidad"><input type="number" min="1" style={inp} value={it.cantidad} onChange={(e) => setIt((s) => ({ ...s, cantidad: Number(e.target.value) || 1 }))} /></Field></div><Field label="Semana de trabajo"><select style={inp} value={it.sem} onChange={(e) => { const ns = Number(e.target.value); setIt((s) => ({ ...s, sem: ns, fAire: iso(addDays(weekStart(ns), wdOf(s.fAire))) })); }}>{WEEKS.map((i) => <option key={i} value={i}>{i === 0 ? "Sem. actual" : i === 1 ? "Próxima" : `Semana ${i + 1}`} · {weekRange(i)}</option>)}</select></Field></div>
        <div className="flex gap-2 mt-5"><button onClick={onClose} className="flex-1 rounded-full py-2.5 text-sm" style={{ background: "#e7e5e4", color: INK, fontWeight: 600 }}>Cancelar</button><button onClick={() => onSave(it)} className="flex-1 rounded-full py-2.5 text-sm" style={{ background: INK, color: PAPER, fontWeight: 600 }}>Guardar</button></div>
      </div>
    </div>
  );
}
function RetrabajoModal({ item, onClose, onCreate }) {
  const MOTIVOS = ["Ajuste", "Cambio de alcance", "Corrección del cliente", "Error interno", "Material o insumo tardío", "Recursos insuficientes", "Otro"];
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("cliente");
  const [motivo, setMotivo] = useState("Ajuste");
  const [deadline, setDeadline] = useState("");
  const [colab, setColab] = useState([]);
  const [desc, setDesc] = useState("");
  const sku = skuById(item.skuId);
  const team = Object.values(CREATIVOS);
  const toggle = (n) => setColab((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  const valid = titulo.trim() && desc.trim();
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: "rgba(28,25,23,.5)", zIndex: 70 }} onClick={onClose}>
      <div className="rounded-2xl w-full" style={{ background: "#fff", maxWidth: 560, maxHeight: "92vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f0eee9" }}><div className="flex items-center gap-2"><RefreshCcw size={16} color={BLUE} /><span style={{ ...serif, fontSize: 18, fontWeight: 700 }}>Crear retrabajo</span></div><button onClick={onClose} style={{ color: "#a8a29e" }}><X size={18} /></button></div>
        <div className="px-6 py-5">
          <div className="text-xs mb-3" style={{ color: "#78716c" }}>Completa la información para dar más contexto al retrabajo de <b style={{ color: INK }}>{sku.name} · {item.campana}</b>. Se registra en COR vía API.</div>
          <div className="mb-3"><label className="text-xs" style={{ color: "#78716c", fontWeight: 600 }}>TÍTULO *</label><input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Escribe un título" style={{ ...inp, marginTop: 4 }} /></div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[{ id: "cliente", t: "Cliente", d: "Para correcciones solicitadas por el cliente." }, { id: "interno", t: "Interno", d: "Para piezas que requieren una revisión." }].map((o) => (
              <button key={o.id} onClick={() => setTipo(o.id)} className="rounded-xl px-3 py-3 text-center" style={{ border: tipo === o.id ? `1.5px solid ${BLUE}` : "1px solid #e7e5e4", background: tipo === o.id ? "#eff6ff" : "#fff" }}><div className="flex items-center justify-center gap-1.5 mb-1"><CircleDot size={13} color={tipo === o.id ? BLUE : "#c4c0b8"} /><span className="text-sm" style={{ fontWeight: 700, color: tipo === o.id ? "#1e40af" : INK }}>{o.t}</span></div><div className="text-xs" style={{ color: "#a8a29e", lineHeight: 1.3 }}>{o.d}</div></button>
            ))}
          </div>
          <div className="mb-3"><label className="text-xs" style={{ color: "#78716c", fontWeight: 600 }}>MOTIVO</label><select value={motivo} onChange={(e) => setMotivo(e.target.value)} style={{ ...inp, marginTop: 4 }}>{MOTIVOS.map((m) => <option key={m}>{m}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div><label className="text-xs flex items-center gap-1" style={{ color: "#78716c", fontWeight: 600 }}><Calendar size={11} /> DEADLINE</label><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ ...inp, marginTop: 4 }} /></div>
            <div><label className="text-xs flex items-center gap-1" style={{ color: "#78716c", fontWeight: 600 }}><UserPlus size={11} /> COLABORADORES</label><div className="flex flex-wrap gap-1 mt-1.5">{team.map((n) => <button key={n} onClick={() => toggle(n)} className="text-xs px-2 py-1 rounded-full" style={{ background: colab.includes(n) ? "#eef2ff" : "#f5f5f4", border: `1px solid ${colab.includes(n) ? "#bfdbfe" : "#e7e5e4"}`, color: colab.includes(n) ? "#1e40af" : "#57534e", fontWeight: 600 }}>{n.split(" ")[0]}</button>)}</div></div>
          </div>
          <div className="mb-3"><label className="text-xs" style={{ color: "#78716c", fontWeight: 600 }}>DESCRIPCIÓN *</label><textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="Agrega todos los detalles del retrabajo" style={{ ...inp, marginTop: 4, resize: "vertical" }} /></div>
          <button title="Adjuntar archivo (demo)" className="text-xs px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ background: "#fff", border: `1px solid ${BLUE}`, color: BLUE, fontWeight: 600 }}><Upload size={13} /> Adjuntar archivo <span style={{ color: "#a8a29e", fontWeight: 400 }}>o arrastra y suelta</span></button>
        </div>
        <div className="px-6 py-4 flex items-center justify-end gap-2" style={{ borderTop: "1px solid #f0eee9" }}>
          <button onClick={onClose} className="text-sm px-4 py-2 rounded-full" style={{ background: "#f5f5f4", color: "#57534e", fontWeight: 600 }}>Cancelar</button>
          <button onClick={() => valid && onCreate(item, { titulo: titulo.trim(), tipo, motivo, deadline, colaboradores: colab, descripcion: desc.trim() })} disabled={!valid} className="text-sm px-4 py-2 rounded-full flex items-center gap-1" style={{ background: valid ? BRAND : "#e7e5e4", color: valid ? "#fff" : "#a8a29e", fontWeight: 600, cursor: valid ? "pointer" : "not-allowed" }}><RefreshCcw size={14} /> Crear retrabajo</button>
        </div>
      </div>
    </div>
  );
}
function CorTaskModal({ item, side, onClose, onToast, onCopy, onRetro, onAddMember, onRemoveMember }) {
  const sku = skuById(item.skuId), { per, tot } = itemHours(item), ej = item.ejecucion ? EJEC[item.ejecucion] : EJEC.sin_iniciar;
  const logged = Math.round(tot * (item.avance || 0) / 100); const [msg, setMsg] = useState("");
  const send = () => { if (!msg.trim()) return; onToast("Comentario enviado a COR"); setMsg(""); };
  const prio = item.prioridad || "Media";
  const integrantes = ROLES.filter((r) => per[r.id] > 0);
  const cli = side === "cliente";
  const prog = tot ? Math.round((logged / tot) * 100) : 0; // avance = cargado / planificado
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 py-6" style={{ background: "rgba(28,25,23,0.5)", zIndex: 50 }}>
      <div className="rounded-2xl w-full" style={{ background: "#fff", maxWidth: 560, maxHeight: "92vh", overflow: "auto" }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: "#0b1220", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}><div className="flex items-center gap-2"><div className="rounded-md flex items-center justify-center" style={{ width: 26, height: 26, background: BLUE }}><Gauge size={15} color="#fff" /></div><div><div className="text-sm" style={{ color: "#fff", fontWeight: 600 }}>{cli ? "Tarea en COR" : sku.cor}</div><div className="text-xs" style={{ color: "#93c5fd" }}>{cli ? item.corCli : `Tarea en COR · ${item.corId}`}</div></div></div><div className="flex items-center gap-2"><a href={corUrl(cli ? item.corCli : item.corId)} className="text-xs flex items-center gap-1 px-2 py-1 rounded" style={{ background: "#1e293b", color: "#cbd5e1" }}>Abrir en COR <ExternalLink size={11} /></a><button onClick={onClose} style={{ color: "#94a3b8" }}><X size={18} /></button></div></div>
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-1"><span style={{ ...serif, fontSize: 20, fontWeight: 700 }}>{sku.name} ×{item.cantidad}</span><span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: ej.c + "1e", color: ej.c, fontWeight: 600 }}><ej.icon size={11} /> {ej.label}</span></div>
          {!cli && <div className="text-xs mb-4" style={{ color: "#a8a29e" }}>En COR la tarea se llama <b style={{ color: "#57534e" }}>{sku.cor}</b> (el SKU) · tipo de tarea: {sku.name}</div>}
          {cli && <div className="mb-4" />}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
            <Row k="Proyecto" v={`${item.campana} · ${item.marca}`} />
            <Row k="Segmento / equipo" v={item.linea} />
            <Row k="Estado" v={ej.label} />
            <Row k="Prioridad (cliente)" v={<span style={{ color: PRIO_COLOR[prio], fontWeight: 700 }}>{prio}</span>} />
            <Row k="Fecha de inicio" v={fmt(iso(weekStart(item.sem)))} />
            <Row k="Fecha fin · al aire" v={fmt(item.fAire)} />
            <Row k="Entregables" v={item.cantidad} />
            {!cli && <Row k="Etiqueta · complejidad" v={etById(item.etiqueta).name} />}
            <Row k="Horas planificadas" v={`${tot} h`} />
            {!cli && <Row k="Horas cargadas (COR)" v={`${logged} h`} />}
          </div>
          {item.weekPlan && <div className="rounded-lg px-3 py-2 mb-4 text-xs flex items-start gap-1.5" style={{ background: "#ecfeff", color: "#155e75" }}><CalendarDays size={13} style={{ marginTop: 1, flexShrink: 0 }} /><span><b>Una sola tarea</b>, con su trabajo repartido en el tiempo: {planWeeks(item).map((w) => `${item.weekLabels && item.weekLabels[w] ? item.weekLabels[w] + " · " : ""}${w === 0 ? "Sem. actual" : weekRange(w)} ${Math.round(item.weekPlan[w] * 100)}%`).join("  ·  ")}. Las {tot} h totales viven en este mismo COR.</span></div>}
          {(() => {
            const members = cli ? (item.membersCli || [item.poCliente].filter(Boolean)) : (item.membersAg || integrantes.map((r) => CREATIVOS[r.id]));
            const pool = cli ? POS : Object.values(CREATIVOS);
            const addable = pool.filter((n) => !members.includes(n));
            const roleOf = (n) => { if (cli) return "cliente"; const r = ROLES.find((x) => CREATIVOS[x.id] === n); return r ? r.name : ""; };
            return <div className="rounded-lg px-3 py-2.5 mb-4" style={{ background: "#faf9f6" }}>
              <div className="text-xs mb-1.5 flex items-center gap-1" style={{ color: "#78716c", fontWeight: 600 }}><User2 size={12} /> {cli ? "Personas del cliente" : "Integrantes"} <span style={{ color: "#a8a29e", fontWeight: 400 }}>· asignados en COR</span></div>
              <div className="flex flex-wrap gap-1.5 items-center">
                {members.length ? members.map((n) => <span key={n} className="text-xs pl-2 pr-1 py-1 rounded-full flex items-center gap-1" style={{ background: "#fff", border: "1px solid #e7e5e4", color: INK }}>{n}{roleOf(n) ? <span style={{ color: "#a8a29e" }}>· {roleOf(n)}</span> : null}<button onClick={() => onRemoveMember && onRemoveMember(item, side, n)} title="Quitar de COR" className="rounded-full flex items-center justify-center" style={{ width: 16, height: 16, color: "#be123c" }}><X size={11} /></button></span>) : <span className="text-xs" style={{ color: "#a8a29e" }}>Sin asignar aún en COR</span>}
                {addable.length > 0 && <select value="" onChange={(e) => { if (e.target.value && onAddMember) onAddMember(item, side, e.target.value); }} className="text-xs rounded-full px-2 py-1" style={{ background: "#eef2ff", color: BLUE, border: "1px dashed #bfdbfe", fontWeight: 600 }}><option value="">+ Agregar persona</option>{addable.map((n) => <option key={n} value={n}>{n}{roleOf(n) && !cli ? ` · ${roleOf(n)}` : ""}</option>)}</select>}
              </div>
              <div className="text-xs mt-2" style={{ color: "#a8a29e" }}>Agregar o quitar personas se escribe en COR (Task Members) vía API.</div>
            </div>;
          })()}
          {!cli
            ? <div className="rounded-lg p-3 mb-4" style={{ background: "#f0fdfa", border: "1px solid #99f6e4" }}><div className="flex items-center justify-between text-xs mb-1" style={{ color: "#115e59", fontWeight: 600 }}><span>Planificado vs. cargado · avance</span><span>{prog}%</span></div><div className="rounded-full overflow-hidden" style={{ background: "#e7e5e4", height: 8 }}><div style={{ width: Math.min(100, prog) + "%", height: "100%", background: BRAND }} /></div></div>
            : <div className="rounded-lg p-3 mb-4" style={{ background: "#f0fdfa", border: "1px solid #99f6e4" }}><div className="flex items-center justify-between text-xs mb-1" style={{ color: "#115e59", fontWeight: 600 }}><span>Avance del entregable</span><span>{prog}%</span></div><div className="rounded-full overflow-hidden" style={{ background: "#e7e5e4", height: 8 }}><div style={{ width: Math.min(100, prog) + "%", height: "100%", background: BRAND }} /></div></div>}
          {!cli && <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#57534e", fontWeight: 600 }}><RefreshCcw size={13} /> Retrabajos / incidencias</span>
              <button onClick={() => onRetro && onRetro(item)} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: "#eef2ff", color: BLUE, fontWeight: 600 }}><RefreshCcw size={12} /> Crear retrabajo</button>
            </div>
            {(item.retrabajos || []).length ? <div className="space-y-1.5">{item.retrabajos.map((r, k) => <div key={k} className="rounded-lg px-3 py-2" style={{ background: "#faf9f6", border: "1px solid #ece9e3" }}><div className="flex items-center gap-2 flex-wrap"><span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: r.tipo === "cliente" ? "#dbeafe" : "#f0eee9", color: r.tipo === "cliente" ? "#1e40af" : "#57534e", fontWeight: 600 }}>{r.tipo === "cliente" ? "Cliente" : "Interno"}</span><span className="text-xs" style={{ fontWeight: 600 }}>{r.titulo}</span><span className="text-xs" style={{ color: "#a8a29e" }}>· {r.motivo}</span></div><div className="text-xs mt-0.5" style={{ color: "#78716c" }}>{r.descripcion}</div><div className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>{r.by} · {r.at}{r.deadline ? ` · entrega ${fmt(r.deadline)}` : ""}{r.colaboradores && r.colaboradores.length ? ` · ${r.colaboradores.join(", ")}` : ""}</div></div>)}</div> : <div className="text-xs" style={{ color: "#a8a29e" }}>Sin retrabajos registrados. Úsalo para reportar por qué una tarea lleva más horas o no se entregó a tiempo.</div>}
          </div>}
          {(item.log || []).length > 0 && <div className="mb-4"><div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "#57534e", fontWeight: 600 }}><Workflow size={13} /> Registro de cambios</div><div className="space-y-1.5">{item.log.map((l, k) => <div key={k} className="flex items-start gap-2 text-xs"><span style={{ color: "#a8a29e", whiteSpace: "nowrap" }}>{l.at}</span><span style={{ color: INK }}><b>{l.by}</b> · {l.text}</span></div>)}</div></div>}
          <div className="mb-4"><div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "#57534e", fontWeight: 600 }}><MessageSquare size={13} /> Comentarios</div><div className="space-y-2"><Comment who="Carla Ríos (cliente)" txt="Ajustar el claim al de la última ronda, por favor." /><Comment who="M. Salazar (cuentas)" txt="Listo, subo v2 hoy. Equipo gráfico ya con el insumo." /></div><div className="flex items-center gap-2 mt-3"><input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Escribe un comentario…" style={{ ...inp, padding: "8px 10px" }} /><button onClick={send} className="rounded-full flex items-center justify-center" style={{ width: 38, height: 38, background: BRAND, color: "#fff", flexShrink: 0 }}><Send size={15} /></button></div></div>
          <div className="flex items-center gap-3 text-xs mb-4" style={{ color: "#78716c" }}><span className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: "#f5f5f4" }}><FileText size={12} /> brief_v2.pdf</span><span className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: "#f5f5f4" }}><FileText size={12} /> referencias.zip</span><span className="flex items-center gap-1" style={{ color: "#a8a29e" }}><Paperclip size={11} /> adjuntar</span></div>
          {cli
            ? <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#eff6ff", color: "#1e40af" }}>Al crear la tarea, el PO ({item.poCliente}) queda asignado en el COR del cliente. El avance es la relación entre las horas planificadas y las efectivamente trabajadas en COR.</div>
            : <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#eff6ff", color: "#1e40af" }}>La app escribe en COR el nombre (SKU), fechas, entregables, prioridad, etiqueta y horas planificadas, y asigna al PO en el COR del cliente; COR devuelve horas cargadas e integrantes. Vía API: Tasks, Task Members, Task Messages, Task Attachments.</div>}
        </div>
      </div>
    </div>
  );
}
function Row({ k, v }) { return <div><div className="text-xs" style={{ color: "#a8a29e" }}>{k}</div><div style={{ color: INK }}>{v}</div></div>; }
function Comment({ who, txt }) { return <div className="rounded-lg px-3 py-2" style={{ background: "#faf9f6" }}><div className="text-xs" style={{ color: "#78716c", fontWeight: 600 }}>{who}</div><div className="text-sm" style={{ color: INK }}>{txt}</div></div>; }

function AssignTimeModal({ entry, onClose, onSave }) {
  const sku = skuById(entry.skuId), sug = suggestedHours(entry);
  const av = entry.avance || 0;
  const started = ["proceso", "pausa", "entregada"].includes(entry.ejecucion) && av > 0;
  const planBase = entry.assignedHours || sug.per;
  const logged = {}; ROLES.forEach((r) => (logged[r.id] = started ? Math.round((planBase[r.id] || 0) * av / 100) : 0));
  const loggedTot = ROLES.reduce((a, r) => a + logged[r.id], 0);
  const floorOf = (id) => (started ? logged[id] : 0);
  const [h, setH] = useState(() => { const a = {}; ROLES.forEach((r) => (a[r.id] = Math.max(floorOf(r.id), (entry.assignedHours ? entry.assignedHours[r.id] : sug.per[r.id]) || 0))); return a; });
  const tot = ROLES.reduce((a, r) => a + (Number(h[r.id]) || 0), 0);
  const setRole = (id, v) => setH((p) => ({ ...p, [id]: Math.max(floorOf(id), Math.round(Number(v) || 0)) }));
  const useSug = () => setH(() => { const a = {}; ROLES.forEach((r) => (a[r.id] = Math.max(floorOf(r.id), sug.per[r.id]))); return a; });
  const save = () => { const same = ROLES.every((r) => (Number(h[r.id]) || 0) === sug.per[r.id]); onSave(same ? null : { ...h }); };
  const ind = tot < sug.tot ? { label: "Bajo el tiempo estimado", c: "#0f766e", bg: "#f0fdfa", Icon: TrendingDown } : tot > sug.tot ? { label: "Sobre el tiempo estimado", c: "#92400e", bg: "#fffbeb", Icon: TrendingUp } : { label: "En el tiempo estimado", c: "#57534e", bg: "#faf9f6", Icon: Minus };
  const diff = tot - sug.tot, diffPct = sug.tot ? Math.round((diff / sug.tot) * 100) : 0;
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: "rgba(28,25,23,.45)", zIndex: 70 }} onClick={onClose}>
      <div className="rounded-2xl w-full" style={{ background: "#fff", maxWidth: 460, maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #f0eee9" }}><SlidersHorizontal size={16} color={BRAND} /><span style={{ ...serif, fontSize: 18, fontWeight: 700 }}>Tiempo asignado</span></div>
        <div className="px-5 py-4">
          <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{sku.name} ×{entry.cantidad}</div>
          <p className="text-xs mb-3" style={{ color: "#78716c" }}>Ajusta las horas reales de creatividad por rol. El SKU da un tiempo sugerido; aquí pones el que de verdad se usará.</p>
          {started && <div className="rounded-lg px-3 py-2 mb-3 text-xs flex items-start gap-2" style={{ background: "#eff6ff", color: "#1e40af" }}><Info size={13} style={{ marginTop: 1, flexShrink: 0 }} /><span>Esta tarea ya está <b>en proceso</b>: tiene <b>{loggedTot} h</b> cargadas en COR. Puedes sumar más horas, pero no reducir por debajo de lo ya cargado.</span></div>}
          <div className="space-y-2">
            {ROLES.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <span className="text-sm" style={{ width: 120, fontWeight: 500 }}>{r.name}</span>
                <span className="text-xs text-right" style={{ width: 96, color: "#a8a29e" }}>sug. {sug.per[r.id]}h{started && <><br /><span style={{ color: BLUE }}>cargado {logged[r.id]}h</span></>}</span>
                <input type="number" min={floorOf(r.id)} value={h[r.id]} onChange={(e) => setRole(r.id, e.target.value)} style={{ ...inp, width: 78, padding: "6px 9px" }} />
                <span className="text-xs" style={{ color: "#a8a29e" }}>h</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 rounded-xl px-3 py-2" style={{ background: "#faf9f6" }}>
            <span className="text-xs" style={{ color: "#57534e" }}>Total asignado: <strong style={{ color: INK }}>{tot} h</strong> <span style={{ color: "#a8a29e" }}>· sugerido {sug.tot} h{started ? ` · cargado ${loggedTot} h` : ""}</span></span>
            <button onClick={useSug} className="text-xs flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: "#f0eee9", color: "#57534e", fontWeight: 600 }}>Usar sugerido</button>
          </div>
          <div className="flex items-center gap-2 mt-2 rounded-xl px-3 py-2" style={{ background: ind.bg }}><ind.Icon size={15} color={ind.c} /><span className="text-xs" style={{ color: ind.c, fontWeight: 600 }}>{ind.label}</span>{diff !== 0 && <span className="text-xs" style={{ color: ind.c }}>· {diff > 0 ? "+" : ""}{diff} h ({diffPct > 0 ? "+" : ""}{diffPct}%) vs. estimado</span>}</div>
        </div>
        <div className="px-5 py-4 flex items-center justify-end gap-2" style={{ borderTop: "1px solid #f0eee9" }}>
          <button onClick={onClose} className="text-sm px-4 py-2 rounded-full" style={{ background: "#f5f5f4", color: "#57534e", fontWeight: 600 }}>Cancelar</button>
          <button onClick={save} className="text-sm px-4 py-2 rounded-full flex items-center gap-1" style={{ background: BRAND, color: "#fff", fontWeight: 600 }}><Check size={14} /> Aplicar</button>
        </div>
      </div>
    </div>
  );
}

function ConfigModal({ onClose }) {
  const Chip = ({ t, c }) => <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: (c || "#78716c") + "1e", color: c || "#57534e", fontWeight: 600 }}>{t}</span>;
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 py-6" style={{ background: "rgba(28,25,23,0.45)", zIndex: 70 }} onClick={onClose}>
      <div className="rounded-2xl w-full" style={{ background: "#fff", maxWidth: 560, maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f0eee9" }}>
          <div className="flex items-center gap-2"><Settings size={18} color={BRAND} /><span style={{ ...serif, fontSize: 19, fontWeight: 700 }}>Configuración</span></div>
          <button onClick={onClose} style={{ color: "#a8a29e" }}><X size={18} /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <div className="text-sm mb-1" style={{ fontWeight: 600 }}>Entregables y SKUs</div>
            <p className="text-xs mb-3" style={{ color: "#78716c" }}>El <b>nombre del entregable</b> es el título que se ve en la app; el <b>SKU</b> es el nombre con el que se crea la tarea en COR. Aquí se administra ese listado.</p>
            <div className="rounded-xl" style={{ border: "1px solid #e7e5e4" }}>
              <div className="px-4 py-2 flex items-center text-xs" style={{ background: "#faf9f6", color: "#a8a29e", fontWeight: 600 }}><span className="flex-1">Entregable (app)</span><span style={{ width: 90 }}>SKU (COR)</span><span style={{ width: 56, textAlign: "right" }}>h base</span></div>
              {SKUS.map((s, i) => { const t = ROLES.reduce((a, r) => a + s.h[r.id], 0); return (
                <div key={s.id} className="px-4 py-2 flex items-center text-sm" style={{ borderTop: "1px solid #f7f5f1" }}>
                  <span className="flex-1">{s.name}</span>
                  <span style={{ width: 90 }}><span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#eef2ff", color: BLUE, fontWeight: 600 }}>{s.cor}</span></span>
                  <span style={{ width: 56, textAlign: "right", color: "#78716c" }}>{t} h</span>
                </div>
              ); })}
            </div>
          </div>
          <div>
            <div className="text-sm mb-2" style={{ fontWeight: 600 }}>Vocabulario sincronizado con COR</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 flex-wrap"><span className="text-xs" style={{ color: "#a8a29e", width: 96 }}>Estado</span>{Object.keys(EJEC).map((k) => <Chip key={k} t={EJEC[k].label} c={EJEC[k].c} />)}</div>
              <div className="flex items-center gap-2 flex-wrap"><span className="text-xs" style={{ color: "#a8a29e", width: 96 }}>Prioridad</span>{PRIORIDADES.map((p) => <Chip key={p} t={p} c={PRIO_COLOR[p]} />)}</div>
              <div className="flex items-center gap-2 flex-wrap"><span className="text-xs" style={{ color: "#a8a29e", width: 96 }}>Etiqueta</span>{ETIQUETAS.map((e) => <Chip key={e.id} t={e.name} c={e.c} />)}<span className="text-xs" style={{ color: "#a8a29e" }}>· por complejidad</span></div>
            </div>
          </div>
          <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#f5f5f4", color: "#78716c" }}>Vista de solo lectura para el prototipo. La edición de entregables, equipos y capacidades se habilita en una siguiente fase.</div>
        </div>
      </div>
    </div>
  );
}
