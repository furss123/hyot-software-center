const SCHOOL_KEY = "today-school.school";
const CLASS_KEY = "today-class.class";
const MEAL_CACHE_KEY = "today-meal.cache";
const CLASS_CACHE_KEY = "today-class.cache";

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
  const saved = readJSON(SCHOOL_KEY, undefined);
  if (saved !== undefined) return validSchool(saved) ? saved : null;
  const school = ["today-meal.school", "today-class.school"]
    .map((key) => readJSON(key, null)).find(validSchool) || null;
  writeSchool(school);
  return school;
}

function validSchool(school) {
  return Boolean(school?.name && school.officeCode && school.schoolCode);
}

export function writeSchool(school) {
  writeJSON(SCHOOL_KEY, school ?? false);
}

export function readClass(school) {
  const saved = readJSON(CLASS_KEY, null);
  if (!school || !saved?.grade || !saved?.classNm) return null;
  if (school.officeCode !== saved.officeCode || school.schoolCode !== saved.schoolCode) return null;
  return { grade: String(saved.grade), classNm: String(saved.classNm) };
}

export function writeClass(school, classInfo) {
  writeJSON(CLASS_KEY, classInfo ? {
    officeCode: school.officeCode,
    schoolCode: school.schoolCode,
    ...classInfo,
  } : null);
}

function cacheId(school, date, classInfo) {
  const parts = [school.officeCode, school.schoolCode];
  if (classInfo) parts.push(classInfo.grade, classInfo.classNm);
  return [...parts, date].join(":");
}

export function readMealCache(school, date) {
  const hit = readJSON(MEAL_CACHE_KEY, {})[cacheId(school, date)];
  return hit?.v === 2 && Array.isArray(hit.meals) ? hit.meals : null;
}

export function writeMealCache(school, date, meals) {
  writeCache(MEAL_CACHE_KEY, cacheId(school, date), { v: 2, meals });
}

export function readTimetableCache(school, date, classInfo) {
  const hit = readJSON(CLASS_CACHE_KEY, {})[cacheId(school, date, classInfo)];
  return hit?.v === 1 && Array.isArray(hit.periods) ? hit.periods : null;
}

export function writeTimetableCache(school, date, classInfo, periods) {
  writeCache(CLASS_CACHE_KEY, cacheId(school, date, classInfo), { v: 1, periods });
}

function writeCache(cacheKey, id, value) {
  const all = readJSON(cacheKey, {});
  all[id] = { ...value, savedAt: Date.now() };
  const keys = Object.keys(all);
  if (keys.length > 24) {
    keys.sort((a, b) => (all[a]?.savedAt || 0) - (all[b]?.savedAt || 0));
    for (const key of keys.slice(0, keys.length - 24)) delete all[key];
  }
  writeJSON(cacheKey, all);
}
