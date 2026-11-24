export const ALLERGENS = [
  [1, "난류"],
  [2, "우유"],
  [3, "메밀"],
  [4, "땅콩"],
  [5, "대두"],
  [6, "밀"],
  [7, "고등어"],
  [8, "게"],
  [9, "새우"],
  [10, "돼지고기"],
  [11, "복숭아"],
  [12, "토마토"],
  [13, "아황산류"],
  [14, "호두"],
  [15, "닭고기"],
  [16, "쇠고기"],
  [17, "오징어"],
  [18, "조개류"],
  [19, "잣"],
];

export const ALLERGEN_NAME = Object.fromEntries(ALLERGENS);

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

export const MEAL_META = [
  { code: "1", key: "breakfast", label: "조식", icon: "sun", empty: "조식 메뉴가 없어요" },
  { code: "2", key: "lunch", label: "중식", icon: "bowl", empty: "중식 메뉴가 없어요" },
  { code: "3", key: "dinner", label: "석식", icon: "moon", empty: "석식 메뉴가 없어요" },
];

const MARKER = /(?:친환경|계절|국내산|무항생제|우수농산물|우수|HACCP|저염|저당|완제품|냉동|데침|영)/i;

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

export function nowMealCode(minutes = seoulNow().minutes) {
  if (minutes < 9 * 60 + 30) return "1";
  if (minutes < 13 * 60 + 30) return "2";
  return "3";
}

export function greeting(minutes = seoulNow().minutes) {
  if (minutes < 9 * 60 + 30) return "좋은 아침이에요";
  if (minutes < 13 * 60 + 30) return "맛있는 점심 시간이에요";
  if (minutes < 19 * 60) return "오늘 석식도 확인해 보세요";
  return "내일 급식도 미리 볼 수 있어요";
}

export function formatKcal(raw) {
  if (!raw) return "";
  const value = Number.parseFloat(String(raw).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(value)) return String(raw).trim();
  return `${Math.round(value).toLocaleString("ko-KR")} kcal`;
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

function decodeHtml(value) {
  return String(value || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (entity, code) => Number(code) <= 0x10ffff ? String.fromCodePoint(Number(code)) : entity)
    .replace(/\u00a0/g, " ");
}

function allergyNumbers(token) {
  const nums = token
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => Number.parseInt(part, 10));
  if (!nums.length || nums.some((num) => !Number.isInteger(num) || num < 1 || num > 19)) return null;
  return nums;
}

function parseLine(line) {
  let text = line.trim();
  if (!text) return null;
  let allergies = [];

  const paren = text.match(/\(\s*([\d.\s]+)\s*\)\s*$/);
  if (paren) {
    const nums = allergyNumbers(paren[1]);
    if (nums) {
      allergies = nums;
      text = text.slice(0, paren.index).trim();
    }
  }

  if (!allergies.length) {
    const bare = text.match(/((?:\d{1,2}\.)+\d{0,2})\s*$/);
    if (bare) {
      const nums = allergyNumbers(bare[1]);
      if (nums) {
        allergies = nums;
        text = text.slice(0, bare.index).trim();
      }
    }
  }

  text = text
    .replace(/\s*\*+\s*/g, " ")
    .replace(/\s*\/\s*$/g, "")
    .replace(/&s$/i, "")
    .replace(new RegExp(`\\((?:${MARKER.source})[^)]*\\)`, "gi"), " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return null;
  return { name: text, allergies };
}

export function parseMenu(raw) {
  return decodeHtml(raw)
    .split("\n")
    .map(parseLine)
    .filter(Boolean);
}

export function parseNutrition(raw) {
  return decodeHtml(raw)
    .split("\n")
    .map((line) => {
      const match = line.trim().match(/^(.+?)\s*:\s*(.+)$/);
      if (!match) return null;
      return {
        label: match[1].replace(/\(.*\)/, "").trim(),
        value: match[2].trim(),
      };
    })
    .filter(Boolean);
}

export function normalizeMeals(rows) {
  const byCode = new Map();
  for (const row of rows) {
    const code = String(row.MMEAL_SC_CODE || "");
    if (!["1", "2", "3"].includes(code) || byCode.has(code)) continue;
    byCode.set(code, {
      code,
      dishes: parseMenu(row.DDISH_NM),
      kcal: formatKcal(row.CAL_INFO),
      nutrition: parseNutrition(row.NTR_INFO),
      origin: decodeHtml(row.ORPLC_INFO).trim(),
    });
  }
  return MEAL_META.map((meta) => byCode.get(meta.code) || null);
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
