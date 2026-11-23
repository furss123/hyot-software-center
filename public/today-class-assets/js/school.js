export const REGIONS = [
  { code: "", name: "전체" },
  { code: "B10", name: "서울" },
  { code: "C10", name: "부산" },
  { code: "D10", name: "대구" },
  { code: "E10", name: "인천" },
  { code: "F10", name: "광주" },
  { code: "G10", name: "대전" },
  { code: "H10", name: "울산" },
  { code: "I10", name: "세종" },
  { code: "J10", name: "경기" },
  { code: "K10", name: "강원" },
  { code: "M10", name: "충북" },
  { code: "N10", name: "충남" },
  { code: "P10", name: "전북" },
  { code: "Q10", name: "전남" },
  { code: "R10", name: "경북" },
  { code: "S10", name: "경남" },
  { code: "T10", name: "제주" },
];

const seoulClock = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function seoulNow(date = new Date()) {
  const parts = seoulClock.formatToParts(date);
  const map = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  let hour = Number(map.hour);
  if (hour === 24) hour = 0;
  return {
    ymd: `${map.year}-${map.month}-${map.day}`,
    minutes: hour * 60 + Number(map.minute),
  };
}

export function seoulToday() {
  return seoulNow().ymd;
}

export function addDays(ymd, days) {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDate(ymd) {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const week = ["일", "월", "화", "수", "목", "금", "토"][date.getUTCDay()];
  return { year, month, day, week, title: `${month}월 ${day}일`, sub: `${week}요일` };
}

export function weekDates(ymd) {
  const { week } = formatDate(ymd);
  const index = ["월", "화", "수", "목", "금", "토", "일"].indexOf(week);
  const monday = addDays(ymd, -index);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function ymdCompact(ymd) {
  return ymd.replaceAll("-", "");
}

export function kindShort(kind = "") {
  if (kind.includes("유치")) return "유";
  if (kind.includes("초등")) return "초";
  if (kind.includes("중학")) return "중";
  if (kind.includes("고등")) return "고";
  if (kind.includes("특수")) return "특";
  return "교";
}

export function withJosa(word, kind) {
  const last = word.charCodeAt(word.length - 1);
  const base = last - 0xac00;
  const batchim = base >= 0 && base <= 11171 ? base % 28 : -1;
  if (kind === "을를") return word + (batchim > 0 ? "을" : "를");
  if (kind === "으로") return word + (batchim > 0 && batchim !== 8 ? "으로" : "로");
  return word;
}

export function toSchool(row) {
  const coed = row.COEDU_SC_NM === "남" || row.COEDU_SC_NM === "여" ? row.COEDU_SC_NM : "";
  return {
    name: row.SCHUL_NM || "이름 없는 학교",
    officeCode: row.ATPT_OFCDC_SC_CODE,
    officeName: row.ATPT_OFCDC_SC_NM,
    schoolCode: row.SD_SCHUL_CODE,
    kind: row.SCHUL_KND_SC_NM || "학교",
    region: row.LCTN_SC_NM || "",
    address: String(row.ORG_RDNMA || "").trim(),
    coed,
  };
}
