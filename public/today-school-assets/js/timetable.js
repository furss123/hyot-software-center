import { seoulToday, ymdCompact } from "./meal.js";
import { requestNeis } from "./neis.js";

export function academicYear(ymd = seoulToday()) {
  const [year, month] = ymd.split("-").map(Number);
  return month >= 3 ? year : year - 1;
}

export function timetableService(kind = "") {
  if (kind.includes("초등")) return "elsTimetable";
  if (kind.includes("중학")) return "misTimetable";
  if (kind.includes("고등")) return "hisTimetable";
  return "";
}

export function classLabel({ grade, classNm }) {
  return `${grade}학년 ${classNm}반`;
}

function sortClassNames(a, b) {
  return a.localeCompare(b, "ko", { numeric: true });
}

function normalizeClasses(rows) {
  const byGrade = new Map();
  for (const row of rows) {
    const grade = String(row.GRADE || "").trim();
    const classNm = String(row.CLASS_NM || "").trim();
    if (!grade || !classNm) continue;
    if (!byGrade.has(grade)) byGrade.set(grade, new Set());
    byGrade.get(grade).add(classNm);
  }
  return [...byGrade.keys()].sort(sortClassNames).map((grade) => ({
    grade,
    classes: [...byGrade.get(grade)].sort(sortClassNames),
  }));
}

function normalizePeriods(rows) {
  const byPeriod = new Map();
  for (const row of rows) {
    const period = Number(row.PERIO);
    if (!Number.isInteger(period) || period < 1) continue;
    const subject = String(row.ITRT_CNTNT || "").replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim();
    const room = String(row.CLRM_NM || "").trim();
    const slot = byPeriod.get(period) || { subjects: new Set(), rooms: new Set() };
    if (subject) slot.subjects.add(subject);
    if (room) slot.rooms.add(room);
    byPeriod.set(period, slot);
  }
  return [...byPeriod.entries()].sort(([a], [b]) => a - b).map(([period, slot]) => ({
    period,
    subject: [...slot.subjects].join(" / ") || "수업",
    room: [...slot.rooms].join(" · "),
  }));
}

async function allRows(service, params, signal) {
  const first = await requestNeis(service, params, { signal });
  const rows = first.rows.slice();
  for (let page = 2; rows.length < first.total; page += 1) {
    const next = await requestNeis(service, params, { signal, page });
    if (!next.rows.length) break;
    rows.push(...next.rows);
  }
  return rows;
}

function schoolParams(school) {
  return { ATPT_OFCDC_SC_CODE: school.officeCode, SD_SCHUL_CODE: school.schoolCode };
}

export async function fetchClassList(school, date, signal) {
  const rows = await allRows("classInfo", { ...schoolParams(school), AY: String(academicYear(date)) }, signal);
  return normalizeClasses(rows);
}

export async function fetchTimetable(school, classInfo, date, signal) {
  const rows = await allRows(timetableService(school.kind), {
    ...schoolParams(school),
    ALL_TI_YMD: ymdCompact(date),
    GRADE: classInfo.grade,
    CLASS_NM: classInfo.classNm,
  }, signal);
  return normalizePeriods(rows);
}
