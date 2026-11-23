import { formatDate, seoulToday, ymdCompact } from "./school.js";
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

export function naturalClassSort(a, b) {
  const na = Number.parseInt(a, 10);
  const nb = Number.parseInt(b, 10);
  if (Number.isFinite(na) && Number.isFinite(nb) && String(na) === a && String(nb) === b) return na - nb;
  return String(a).localeCompare(String(b), "ko", { numeric: true });
}

export function classLabel(grade, classNm) {
  if (!grade || !classNm) return "";
  return `${grade}학년 ${classNm}반`;
}

export function normalizeClasses(rows) {
  const byGrade = new Map();
  for (const row of rows || []) {
    const grade = String(row.GRADE || "").trim();
    const classNm = String(row.CLASS_NM || "").trim();
    if (!grade || !classNm) continue;
    if (!byGrade.has(grade)) byGrade.set(grade, new Set());
    byGrade.get(grade).add(classNm);
  }
  return [...byGrade.keys()]
    .sort(naturalClassSort)
    .map((grade) => ({
      grade,
      classes: [...byGrade.get(grade)].sort(naturalClassSort),
    }));
}

export function normalizePeriods(rows) {
  const byPeriod = new Map();
  for (const row of rows || []) {
    const period = Number.parseInt(String(row.PERIO || ""), 10);
    if (!Number.isInteger(period) || period < 1) continue;
    const subject = String(row.ITRT_CNTNT || "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    const slot = byPeriod.get(period) || { subjects:new Set(), rooms:new Set() };
    if (subject) slot.subjects.add(subject);
    if (row.CLRM_NM) slot.rooms.add(String(row.CLRM_NM).trim());
    byPeriod.set(period, slot);
  }
  return [...byPeriod.entries()].sort(([a],[b]) => a-b).map(([period, slot]) => ({
    period, subject:[...slot.subjects].join(" / ") || "수업", room:[...slot.rooms].join(" · "),
  }));
}

/** Rough “지금 교시” hint for weekday daytime. */
export function nowPeriod(minutes, periods) {
  if (!periods?.length) return 0;
  const first = Math.min(...periods.map((item) => item.period));
  const last = Math.max(...periods.map((item) => item.period));
  const start = 8 * 60 + 40;
  const slot = 60;
  for (let period = first; period <= last; period += 1) {
    const from = start + (period - 1) * slot;
    const to = from + 50;
    if (minutes >= from && minutes < to) return period;
  }
  return 0;
}

async function allRows(service, params, options) {
  const first = await requestNeis(service, params, options);
  const rows = first.rows.slice();
  for (let page = 2; rows.length < first.total; page += 1) {
    const next = await requestNeis(service, params, {...options, page});
    if (!next.rows.length) break;
    rows.push(...next.rows);
  }
  return rows;
}

export async function fetchClassList(school, { signal } = {}) {
  const ay = String(academicYear());
  const rows = await allRows(
    "classInfo",
    {
      ATPT_OFCDC_SC_CODE: school.officeCode,
      SD_SCHUL_CODE: school.schoolCode,
      AY: ay,
    },
    { signal }
  );
  return normalizeClasses(rows);
}

export async function fetchTimetable(school, classInfo, date, { signal } = {}) {
  const service = timetableService(school.kind);
  if (!service) throw new Error("이 학교 종류는 시간표를 지원하지 않아요");
  const rows = await allRows(
    service,
    {
      ATPT_OFCDC_SC_CODE: school.officeCode,
      SD_SCHUL_CODE: school.schoolCode,
      ALL_TI_YMD: ymdCompact(date),
      GRADE: classInfo.grade,
      CLASS_NM: classInfo.classNm,
    },
    { signal }
  );
  return normalizePeriods(rows);
}

export function emptyTimetableMessage(date) {
  const { week } = formatDate(date);
  if (week === "토" || week === "일") return { title: "주말에는 수업이 없어요", body: "월요일 시간표가 궁금하면 날짜를 넘겨 보세요." };
  return { title: "이 날은 시간표가 없어요", body: "아직 올라오지 않았거나, 수업이 없는 날이에요." };
}
