export const SCHOOL_KEY = "today-meal.school";
const CACHE_KEY = "today-meal.cache";

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

function cacheId(school, date) {
  return `${school.officeCode}:${school.schoolCode}:${date}`;
}

export function readMealCache(school, date) {
  const hit = readJSON(CACHE_KEY, {})[cacheId(school, date)];
  return hit?.v === 2 && Array.isArray(hit.meals) ? hit.meals : null;
}

export function writeMealCache(school, date, meals) {
  const all = readJSON(CACHE_KEY, {});
  all[cacheId(school, date)] = { v: 2, meals, savedAt: Date.now() };
  const keys = Object.keys(all);
  if (keys.length > 24) {
    keys.sort((a, b) => (all[a]?.savedAt || 0) - (all[b]?.savedAt || 0));
    for (const key of keys.slice(0, keys.length - 24)) delete all[key];
  }
  writeJSON(CACHE_KEY, all);
}
