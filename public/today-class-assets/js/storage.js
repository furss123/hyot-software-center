export const SCHOOL_KEY = "today-class.school";
export const CLASS_KEY = "today-class.class";
const CACHE_KEY = "today-class.cache";

export function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable in private browsing.
  }
}

export function readSchool() {
  const school = readJSON(SCHOOL_KEY, null);
  return school?.name && school.officeCode && school.schoolCode ? school : null;
}

export function readClass(school) {
  if (!school) return null;
  const saved = readJSON(CLASS_KEY, null);
  if (!saved?.grade || !saved?.classNm) return null;
  if (saved.officeCode !== school.officeCode || saved.schoolCode !== school.schoolCode) return null;
  return { grade: String(saved.grade), classNm: String(saved.classNm) };
}

export function writeClass(school, classInfo) {
  if (!school || !classInfo?.grade || !classInfo?.classNm) {
    writeJSON(CLASS_KEY, null);
    return;
  }
  writeJSON(CLASS_KEY, {
    officeCode: school.officeCode,
    schoolCode: school.schoolCode,
    grade: String(classInfo.grade),
    classNm: String(classInfo.classNm),
  });
}

function cacheId(school, classInfo, date) {
  return `${school.officeCode}:${school.schoolCode}:${classInfo.grade}:${classInfo.classNm}:${date}`;
}

function pruneCache(all, limit = 24) {
  const keys = Object.keys(all);
  if (keys.length <= limit) return all;
  keys.sort((a, b) => (all[a]?.savedAt || 0) - (all[b]?.savedAt || 0));
  for (const key of keys.slice(0, keys.length - limit)) delete all[key];
  return all;
}

export function readTimetableCache(school, classInfo, date) {
  if (!school || !classInfo) return null;
  const hit = readJSON(CACHE_KEY, {})[cacheId(school, classInfo, date)];
  return hit?.v === 1 && Array.isArray(hit.periods) ? hit.periods : null;
}

export function writeTimetableCache(school, classInfo, date, periods) {
  if (!school || !classInfo) return;
  const all = pruneCache({
    ...readJSON(CACHE_KEY, {}),
    [cacheId(school, classInfo, date)]: { v: 1, periods, savedAt: Date.now() },
  });
  writeJSON(CACHE_KEY, all);
}
