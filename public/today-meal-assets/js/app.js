import {
  ALLERGENS,
  ALLERGEN_NAME,
  MEAL_META,
  REGIONS,
  addDays,
  formatDate,
  kindShort,
  normalizeMeals,
  nowMealCode,
  seoulToday,
  toSchool,
  weekDates,
  withJosa,
  ymdCompact,
} from "./meal.js";
import { requestNeis } from "./neis.js";
import { SCHOOL_KEY, readJSON, readMealCache, readSchool, writeJSON, writeMealCache } from "./storage.js?v=2";

const ALLERGY_KEY = "today-meal.allergies";
const NUMBERS_KEY = "today-meal.numbers";

const webHost = document.querySelector("#today-meal-web");
const template = webHost?.querySelector("template");
const root = webHost.shadowRoot || webHost.attachShadow({ mode: "open" });
if (template) root.append(template.content.cloneNode(true));
const app = root.querySelector("#app");
const toastEl = root.querySelector("#toast");
const savedSchool = readSchool();
let today = seoulToday();
const ui = { view: "" };
const state = {
  school: savedSchool,
  schoolSaved: Boolean(savedSchool),
  allergies: new Set([].concat(readJSON(ALLERGY_KEY, []))),
  showNumbers: readJSON(NUMBERS_KEY, false) === true,
  date: today,
  view: "",
  query: "",
  region: "",
  results: [],
  total: 0,
  searchPage: 0,
  searching: false,
  searchError: "",
  searchSeq: 0,
  meals: null,
  mealStatus: "idle",
  mealError: "",
  mealSeq: 0,
};

let searchTimer = 0;
let searchAbort = null;
let mealAbort = null;
let toastTimer = 0;
let composing = false;

function h(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = String(value);
    else if (key === "hidden") node.hidden = true;
    else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value === true ? "" : String(value));
  }
  for (const child of Array.isArray(children) ? children : [children]) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

function icon(name) {
  const paths = {
    sun: '<circle cx="12" cy="12" r="3.4" fill="currentColor"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    bowl: '<path d="M4.5 10.5h15c-.4 5-3.2 8-7.5 8s-7.1-3-7.5-8z" fill="currentColor" opacity=".18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7.2 8.2c.7-1.5 1.7-2.2 2.6-2.2.5 1.1.4 2.1-.1 3.1M12.2 7.2c.7-1.3 1.6-1.9 2.4-1.9.4 1 .3 1.9-.1 2.9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    moon: '<path d="M15.2 3.6A7.2 7.2 0 1 0 20.4 15 6.6 6.6 0 0 1 15.2 3.6z" fill="currentColor"/>',
    gear: '<path fill="currentColor" fill-rule="evenodd" d="M10.1 2.7h3.8l.5 2.2c.6.2 1.1.5 1.6.9l2.1-1.1 2.7 2.7-1.1 2.1c.4.5.7 1 .9 1.6l2.2.5v3.8l-2.2.5c-.2.6-.5 1.1-.9 1.6l1.1 2.1-2.7 2.7-2.1-1.1c-.5.4-1 .7-1.6.9l-.5 2.2h-3.8l-.5-2.2a6 6 0 0 1-1.6-.9l-2.1 1.1-2.7-2.7 1.1-2.1a6 6 0 0 1-.9-1.6l-2.2-.5V10.6l2.2-.5c.2-.6.5-1.1.9-1.6L4.4 6.4l2.7-2.7 2.1 1.1c.5-.4 1-.7 1.6-.9l.5-2.2zM12 9.1a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z"/>',
    search: '<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    left: '<path d="M14 6 8 12l6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    right: '<path d="m10 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2-5.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M19.5 4.5V8H16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    close: '<path d="M7 7l10 10M17 7 7 17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    check: '<path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("ico");
  svg.innerHTML = paths[name] || "";
  return svg;
}

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
}

function render() {
  if (ui.view !== state.view) {
    app.replaceChildren();
    ui.view = state.view;
    if (state.view === "search") buildSearch();
    else buildMeals();
  }
  if (state.view === "search") paintSearch();
  else paintMeals();
}

function showSearch({ focus = false } = {}) {
  clearTimeout(searchTimer);
  state.searchSeq += 1;
  searchAbort?.abort();
  composing = false;
  state.view = "search";
  state.query = "";
  state.results = [];
  state.total = 0;
  state.searchPage = 0;
  state.searching = false;
  state.searchError = "";
  state.region = "";
  render();
  if (focus) ui.input?.focus();
}

function showMeals({ focus = false } = {}) {
  clearTimeout(searchTimer);
  state.searchSeq += 1;
  searchAbort?.abort();
  state.view = "meals";
  loadMeals();
  if (focus) ui.schoolName.focus();
}

function applySchoolSelection(school, saved, { focus = false } = {}) {
  mealAbort?.abort();
  state.mealSeq += 1;
  state.school = school;
  state.schoolSaved = saved;
  state.date = seoulToday();
  state.meals = null;
  if (school) showMeals({ focus });
  else showSearch({ focus });
}

function selectDate(ymd) {
  if (ymd === state.date) return;
  state.date = ymd;
  loadMeals();
}

async function loadMeals() {
  const school = state.school;
  const date = state.date;
  if (!school) return;
  mealAbort?.abort();
  const controller = new AbortController();
  mealAbort = controller;
  const seq = ++state.mealSeq;
  const cached = readMealCache(school, date);
  state.meals = cached;
  state.mealStatus = cached ? "refreshing" : "loading";
  state.mealError = "";
  if (state.view === "meals") render();

  try {
    const { rows } = await requestNeis(
      "mealServiceDietInfo",
      {
        ATPT_OFCDC_SC_CODE: school.officeCode,
        SD_SCHUL_CODE: school.schoolCode,
        MLSV_YMD: ymdCompact(date),
      },
      { signal: controller.signal }
    );
    if (seq !== state.mealSeq) return;
    const meals = normalizeMeals(rows);
    writeMealCache(school, date, meals);
    state.meals = meals;
    state.mealStatus = "ready";
    state.mealError = "";
  } catch (error) {
    if (error.name === "AbortError" || seq !== state.mealSeq) return;
    state.mealError = error.message || "급식을 불러오지 못했어요";
    state.mealStatus = cached ? "stale" : "error";
  }
  if (state.view === "meals" && seq === state.mealSeq) paintMeals();
}

function buildMeals() {
  ui.schoolName = h("h2", { class: "school-name", tabindex: "-1" });
  ui.schoolStatus = h("p", { class: "school-status" });
  ui.refresh = h("button", { type: "button", class: "icon-btn", "aria-label": "새로고침", onclick: refreshMeals }, [icon("refresh")]);
  ui.dateRow = h("div", { class: "date-row" });
  ui.week = h("div", { class: "week" });
  ui.mealBody = h("div", { class: "meal-body", "aria-busy": "true" });

  const head = h("header", { class: "board-head panel" }, [
    h("div", { class: "heading-with-icon" }, [
      h("span", { class: "tile accent-tile", "aria-hidden": "true" }, [icon("bowl")]),
      h("div", {}, [ui.schoolName, ui.schoolStatus]),
    ]),
    h("div", { class: "actions" }, [
      h("button", { type: "button", class: "ghost", onclick: () => showSearch({ focus: true }) }, "학교 변경"),
      ui.refresh,
      h("button", { type: "button", class: "icon-btn", "aria-label": "설정", onclick: openSettings }, [icon("gear")]),
    ]),
  ]);
  const calendar = h("section", { class: "calendar panel", "aria-label": "급식 날짜" }, [ui.dateRow, ui.week]);

  let touch = null;
  ui.mealBody.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    touch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  ui.mealBody.addEventListener("touchend", (event) => {
    if (!touch) return;
    const dx = event.changedTouches[0].clientX - touch.x;
    const dy = event.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    selectDate(addDays(state.date, dx < 0 ? 1 : -1));
  }, { passive: true });
  ui.mealBody.addEventListener("touchcancel", () => { touch = null; });

  app.append(head, calendar, ui.mealBody);
}

function paintMeals() {
  if (!ui.schoolName) return;
  ui.schoolName.textContent = state.school.name;
  ui.schoolStatus.replaceChildren(
    ...(state.schoolSaved ? [icon("check"), "이 브라우저에 저장됨"] : ["이번 방문에서만 표시돼요"])
  );
  const busy = state.mealStatus === "loading" || state.mealStatus === "refreshing";
  ui.refresh.classList.toggle("is-busy", busy);
  ui.refresh.disabled = busy;
  ui.mealBody.setAttribute("aria-busy", String(busy));
  const calendarKey = `${state.date}:${today}`;
  if (ui.dateRow.dataset.rendered !== calendarKey) {
    const active = root.activeElement;
    const restoreNav = ui.dateRow.contains(active) ? active.getAttribute("aria-label") : null;
    const restoreWeek = ui.week.contains(active) || active?.classList.contains("today-link");
    ui.dateRow.dataset.rendered = calendarKey;
    ui.dateRow.replaceChildren(...dateControls());
    ui.week.replaceChildren(...weekButtons());
    if (restoreWeek) ui.week.querySelector('[aria-pressed="true"]').focus();
    else if (restoreNav) ui.dateRow.querySelector(`[aria-label="${restoreNav}"]`)?.focus();
  }
  ui.mealBody.replaceChildren(...mealNodes());
}

function dateControls() {
  const info = formatDate(state.date);
  return [
    h("button", { type: "button", class: "nav-btn", "aria-label": "이전 날", onclick: () => selectDate(addDays(state.date, -1)) }, [icon("left")]),
    h("div", { class: "date-label" }, [
      h("h2", { text: `${info.title} ${info.sub}` }),
      state.date !== today
        ? h("button", { type: "button", class: "today-link", onclick: () => selectDate(today) }, "오늘로 돌아가기")
        : null,
    ]),
    h("button", { type: "button", class: "nav-btn", "aria-label": "다음 날", onclick: () => selectDate(addDays(state.date, 1)) }, [icon("right")]),
  ];
}

function weekButtons() {
  return weekDates(state.date).map((ymd) => {
    const info = formatDate(ymd);
    return h("button", {
      type: "button",
      class: "day",
      "aria-pressed": ymd === state.date ? "true" : "false",
      "aria-current": ymd === today ? "date" : null,
      "aria-label": `${info.month}월 ${info.day}일 ${info.sub}`,
      onclick: () => selectDate(ymd),
    }, [
      h("small", { text: info.week }),
      h("b", { text: String(info.day) }),
    ]);
  });
}

function mealNodes() {
  const nodes = [];
  if (state.mealStatus === "stale") {
    nodes.push(h("p", { class: "banner", role: "status", text: "최신 식단을 불러오지 못해 저장된 식단을 보여드려요." }));
  }
  const waiting = state.mealStatus === "loading" || state.mealStatus === "idle";
  if (waiting && !state.meals) {
    return [
      h("p", { class: "sr", role: "status", text: "식단을 불러오고 있어요." }),
      h("div", { class: "meal-grid", "aria-hidden": "true" },
        MEAL_META.map(() => h("div", { class: "skel panel" }))),
    ];
  }
  if (state.mealStatus === "error" && !state.meals) {
    nodes.push(h("section", { class: "notice panel" }, [
      h("h2", { text: "급식을 못 불러왔어요" }),
      h("p", { text: state.mealError || "잠시 후 다시 시도해 주세요." }),
      h("button", { type: "button", class: "primary", onclick: loadMeals }, "다시 시도"),
    ]));
    return nodes;
  }

  const meals = state.meals || [null, null, null];
  const any = meals.some((meal) => meal && meal.dishes.length);
  if (!any && (state.mealStatus === "ready" || state.mealStatus === "stale")) {
    nodes.push(h("section", { class: "notice panel" }, [
      h("span", { class: "tile" }, [icon("bowl")]),
      h("h2", { text: "등록된 식단이 없어요" }),
      h("p", { text: "다른 날짜를 선택해 식단을 확인해 보세요." }),
    ]));
    nodes.push(sourceLink());
    return nodes;
  }

  nodes.push(h("div", { class: "meal-grid" }, MEAL_META.map((meta, index) => mealCard(meta, meals[index]))));
  nodes.push(sourceLink());
  return nodes;
}

function mealCard(meta, meal) {
  const dishes = meal?.dishes || [];
  const isNow = dishes.length > 0 && state.date === today && nowMealCode() === meta.code;
  const hits = dishes.filter((dish) => dish.allergies.some((num) => state.allergies.has(num)));
  return h("section", { class: `meal panel meal-${meta.key}${isNow ? " is-now" : ""}`, "aria-label": meta.label }, [
    h("div", { class: "meal-head" }, [
      h("span", { class: "tile meal-icon" }, [icon(meta.icon)]),
      h("div", {}, [
        h("h2", { class: "meal-title" }, [
          meta.label,
          isNow ? h("span", { class: "now-pill", text: "지금" }) : null,
        ]),
        h("p", {
          class: "meal-meta",
          text: dishes.length ? [`${dishes.length}가지`, meal.kcal].filter(Boolean).join(" · ") : meta.empty,
        }),
      ]),
    ]),
    hits.length ? h("p", { class: "alert-note", text: `조심할 메뉴 ${hits.length}개` }) : null,
    dishes.length ? h("ul", { class: "dishes" }, dishes.map(dishRow)) : null,
    dishes.length ? nutritionBlock(meal) : null,
  ]);
}

function dishRow(dish) {
  const matched = dish.allergies.filter((num) => state.allergies.has(num));
  return h("li", { class: matched.length ? "dish is-alert" : "dish" }, [
    h("span", { class: "dish-dot", "aria-hidden": "true" }),
    h("span", { class: "dish-copy" }, [
      h("span", { class: "dish-name", text: dish.name }),
      matched.length ? h("span", { class: "dish-tags", text: matched.map((num) => ALLERGEN_NAME[num]).join(" · ") }) : null,
    ]),
    state.showNumbers && dish.allergies.length ? h("span", { class: "dish-nums", text: dish.allergies.join("·") }) : null,
  ]);
}

function nutritionBlock(meal) {
  if (!meal.nutrition?.length && !meal.origin) return null;
  const main = (meal.nutrition || []).slice(0, 3);
  const rest = (meal.nutrition || []).slice(3);
  const bits = [];
  if (meal.nutrition?.length) bits.push("영양");
  if (meal.origin) bits.push("원산지");
  return h("details", { class: "extra" }, [
    h("summary", { text: bits.join(" · ") }),
    main.length ? h("div", { class: "stats" }, main.map((item) => h("div", { class: "stat" }, [
      h("b", { text: item.value }),
      h("span", { text: item.label }),
    ]))) : null,
    rest.length ? h("p", { class: "more-nuts", text: rest.map((item) => `${item.label} ${item.value}`).join(" · ") }) : null,
    meal.origin ? h("p", { class: "origin", text: meal.origin }) : null,
  ]);
}

function sourceLink() {
  return h("a", {
    class: "source",
    href: "https://open.neis.go.kr",
    target: "_blank",
    rel: "noopener noreferrer",
  }, "자료 · 나이스 교육정보");
}

function refreshMeals() {
  if (state.mealStatus === "loading" || state.mealStatus === "refreshing") return;
  loadMeals();
}

function buildSearch() {
  ui.input = h("input", {
    class: "search-input",
    id: "school-query",
    type: "text",
    placeholder: "예를 들어 남악고등학교",
    autocomplete: "off",
    enterkeyhint: "search",
  });
  ui.clear = h("button", { type: "button", class: "clear-btn", hidden: true, "aria-label": "검색어 지우기", onclick: clearQuery }, [icon("close")]);
  ui.results = h("div", { class: "results", hidden: true });

  ui.input.addEventListener("compositionstart", () => { composing = true; });
  ui.input.addEventListener("compositionend", () => {
    composing = false;
    state.query = ui.input.value;
    onQueryChanged();
  });
  ui.input.addEventListener("input", () => {
    state.query = ui.input.value;
    ui.clear.hidden = !state.query;
    if (!composing) onQueryChanged();
  });

  const form = h("form", {
    class: "search-form",
    onsubmit: (event) => {
      event.preventDefault();
      if (!composing) searchNow();
    },
  }, [
    h("div", { class: "field" }, [
      h("label", { for: "school-query", text: "학교 이름" }),
      h("span", { class: "input-wrap" }, [ui.input, ui.clear]),
    ]),
    h("div", { class: "field" }, [
      h("label", { for: "school-region", text: "지역" }),
      h("select", {
        id: "school-region",
        onchange: (event) => {
          state.region = event.currentTarget.value;
          if (state.query.trim().length >= 2) searchNow();
        },
      }, REGIONS.map(({ code, name }) => h("option", { value: code }, code ? name : "전체 지역"))),
    ]),
    h("button", { type: "submit", class: "primary search-submit" }, [icon("search"), "검색"]),
  ]);

  const head = h("header", { class: "search-head" }, [
    h("div", { class: "heading-with-icon" }, [
      h("span", { class: "tile accent-tile", "aria-hidden": "true" }, [icon("bowl")]),
      h("div", {}, [
        h("h2", { text: state.school ? "학교 변경" : "학교 찾기" }),
        h("p", { class: "school-status", text: "선택한 학교는 이 브라우저에 저장돼요." }),
      ]),
    ]),
    h("div", { class: "actions" }, [
      state.school ? h("button", {
        type: "button",
        class: "ghost",
        onclick: () => showMeals({ focus: true }),
      }, "식단으로 돌아가기") : null,
      h("button", { type: "button", class: "icon-btn", "aria-label": "설정", onclick: openSettings }, [icon("gear")]),
    ]),
  ]);
  app.append(h("section", { class: "panel search-panel", "aria-label": "학교 검색" }, [head, form, ui.results]));
}

function paintSearch() {
  if (ui.clear) ui.clear.hidden = !state.query;
  paintResults();
}

function onQueryChanged() {
  clearTimeout(searchTimer);
  state.searchSeq += 1;
  searchAbort?.abort();
  state.searching = false;
  state.results = [];
  state.total = 0;
  state.searchPage = 0;
  state.searchError = "";
  ui.clear.hidden = !state.query;
  if (state.query.trim().length < 2) {
    paintResults();
    return;
  }
  state.searching = true;
  paintResults();
  searchTimer = setTimeout(searchNow, 280);
}

function clearQuery() {
  state.query = "";
  ui.input.value = "";
  onQueryChanged();
  ui.input.focus();
}

function searchNow() {
  return loadSearchPage(1);
}

async function loadSearchPage(page) {
  clearTimeout(searchTimer);
  const query = state.query.trim();
  const region = state.region;
  if (query.length < 2) {
    onQueryChanged();
    return;
  }
  searchAbort?.abort();
  const controller = new AbortController();
  searchAbort = controller;
  const seq = ++state.searchSeq;
  if (page === 1) {
    state.results = [];
    state.total = 0;
    state.searchPage = 0;
  }
  state.searching = true;
  state.searchError = "";
  paintResults();
  try {
    const { rows, total } = await requestNeis("schoolInfo", {
      SCHUL_NM: query,
      ATPT_OFCDC_SC_CODE: region,
    }, { signal: controller.signal, page });
    if (seq !== state.searchSeq) return;
    state.results = [...state.results, ...rankSchools(rows, query)];
    state.total = rows.length ? total : state.results.length;
    state.searchPage = page;
    state.searching = false;
  } catch (error) {
    if (error.name === "AbortError" || seq !== state.searchSeq) return;
    state.searching = false;
    state.searchError = error.message || "학교를 불러오지 못했어요";
  }
  if (seq === state.searchSeq) paintResults();
}

function rankSchools(rows, query) {
  const score = (name) => {
    if (name === query) return 0;
    if (name.startsWith(query)) return 1;
    return 2;
  };
  return rows
    .filter((row) => row.SD_SCHUL_CODE && row.ATPT_OFCDC_SC_CODE && row.SCHUL_NM)
    .map(toSchool)
    .sort((a, b) => score(a.name) - score(b.name) || a.name.localeCompare(b.name, "ko"));
}

function paintResults() {
  if (!ui.results) return;
  const query = state.query.trim();
  ui.results.hidden = !query;
  if (!query) {
    ui.results.replaceChildren();
    return;
  }
  if (query.length < 2) {
    ui.results.replaceChildren(h("p", { class: "hint", role: "status", text: "학교 이름을 두 글자 이상 입력해 주세요." }));
    return;
  }
  if (state.searching && !state.results.length) {
    ui.results.replaceChildren(h("p", { class: "hint", role: "status", text: "학교를 찾고 있어요." }));
    return;
  }
  if (state.searchError && !state.results.length) {
    ui.results.replaceChildren(h("section", { class: "notice" }, [
      h("h3", { text: "학교 검색에 실패했어요" }),
      h("p", { text: state.searchError }),
      h("button", { type: "button", class: "primary", onclick: searchNow }, "다시 시도"),
    ]));
    return;
  }
  if (!state.results.length) {
    ui.results.replaceChildren(h("p", { class: "hint", role: "status", text: "검색 결과가 없어요. 학교 이름이나 지역을 확인해 주세요." }));
    return;
  }

  const nodes = state.results.map((school) => h("button", {
    type: "button",
    class: "school-card",
    onclick: () => chooseSchool(school),
  }, [
    h("span", { class: "tile school-type", "aria-hidden": "true", text: kindShort(school.kind) }),
    h("span", { class: "school-card-body" }, [
      h("strong", { text: school.name }),
      h("span", { class: "school-description", text: [school.kind, school.address || school.region].filter(Boolean).join(" · ") }),
    ]),
    icon("right"),
  ]));

  if (state.total > state.results.length) {
    const more = state.searchPage * 5 < state.total;
    nodes.push(h("p", {
      class: "result-note",
      text: `전체 ${state.total}곳 중 ${state.results.length}곳을 표시하고 있어요. 학교 이름을 더 정확히 입력하거나 지역을 골라 주세요.`,
    }));
    if (state.searchError) nodes.push(h("p", { class: "result-note", text: state.searchError }));
    if (more) nodes.push(h("button", {
      type: "button",
      class: "ghost more-results",
      disabled: state.searching,
      onclick: () => loadSearchPage(state.searchPage + 1),
    }, state.searching ? "찾는 중이에요" : "학교 더 보기"));
  }
  ui.results.replaceChildren(...nodes);
}

async function chooseSchool(school) {
  const ok = await openSheet("학교 저장", (close) => h("div", {}, [
    h("h2", { class: "sheet-title", text: school.name }),
    h("p", { class: "sheet-sub", text: [school.kind, school.address || school.region].filter(Boolean).join(" · ") }),
    h("p", { class: "help", text: "다음에 이 브라우저로 방문하면 이 학교의 급식이 바로 열려요." }),
    h("div", { class: "sheet-actions" }, [
      h("button", { type: "button", class: "primary", onclick: () => close(true) }, "이 학교 저장"),
      h("button", { type: "button", class: "ghost", onclick: () => close(false) }, "다시 고르기"),
    ]),
  ]), ".primary");
  if (!ok) return;

  const saved = writeJSON(SCHOOL_KEY, school);
  applySchoolSelection(school, saved, { focus: true });
  toast(saved
    ? `${withJosa(school.name, "을를")} 저장했어요.`
    : "브라우저에 저장할 수 없어 이번 방문에만 표시해요.");
}

function openSettings() {
  const numberButton = h("button", {
    type: "button",
    class: "switch-row",
    "aria-pressed": state.showNumbers ? "true" : "false",
    onclick: () => {
      state.showNumbers = !state.showNumbers;
      writeJSON(NUMBERS_KEY, state.showNumbers);
      numberButton.setAttribute("aria-pressed", state.showNumbers ? "true" : "false");
      if (state.view === "meals") paintMeals();
    },
  }, [
    h("span", {}, [
      "알레르기 번호",
      h("small", { text: "메뉴 옆에 1·2·5처럼 보여요" }),
    ]),
    h("span", { class: "knob", "aria-hidden": "true" }),
  ]);

  return openSheet("설정", (close) => {
    const chips = ALLERGENS.map(([num, name]) => h("button", {
      type: "button",
      class: "chip",
      "aria-pressed": state.allergies.has(num) ? "true" : "false",
      onclick: (event) => toggleAllergy(num, event.currentTarget),
    }, name));

    return h("div", {}, [
      h("h2", { class: "sheet-title", text: "급식 설정" }),
      state.school ? h("div", { class: "saved-school" }, [
        h("p", { text: state.school.name }),
        h("button", {
          type: "button",
          class: "text-button",
          onclick: () => { close(false); forgetSchool(); },
        }, state.schoolSaved ? "저장된 학교 지우기" : "학교 선택 해제"),
      ]) : null,
      h("h3", { class: "section-label", text: "내 알레르기" }),
      h("p", { class: "help", text: "해당 재료가 들어간 메뉴를 표시해요." }),
      h("div", { class: "allergen-grid" }, chips),
      h("button", { type: "button", class: "text-button", onclick: clearAllergies }, "선택 지우기"),
      h("h3", { class: "section-label", text: "보기" }),
      numberButton,
    ]);
  });
}

function toggleAllergy(num, button) {
  if (state.allergies.has(num)) state.allergies.delete(num);
  else state.allergies.add(num);
  button.setAttribute("aria-pressed", state.allergies.has(num) ? "true" : "false");
  writeJSON(ALLERGY_KEY, [...state.allergies]);
  if (state.view === "meals") paintMeals();
}

function clearAllergies() {
  state.allergies.clear();
  writeJSON(ALLERGY_KEY, []);
  root.querySelectorAll(".chip").forEach((chip) => chip.setAttribute("aria-pressed", "false"));
  if (state.view === "meals") paintMeals();
}

function forgetSchool() {
  if (!writeJSON(SCHOOL_KEY, null) && state.schoolSaved) {
    toast("저장된 학교를 지우지 못했어요.");
    return;
  }
  applySchoolSelection(null, false, { focus: true });
  toast("학교 선택을 지웠어요.");
}

function openSheet(label, build, focusSelector) {
  return new Promise((resolve) => {
    const previousFocus = root.activeElement;
    const close = (value) => {
      dialog.close();
      dialog.remove();
      ui.sheet = null;
      document.body.classList.remove("today-meal-modal");
      previousFocus?.focus();
      resolve(value);
    };
    const dialog = h("dialog", {
      class: "sheet",
      "aria-label": label,
      oncancel: (event) => { event.preventDefault(); close(false); },
      onclick: (event) => { if (event.target === dialog) close(false); },
    }, [
      h("div", { class: "sheet-content" }, [
        h("button", { type: "button", class: "sheet-x icon-btn", "aria-label": "닫기", onclick: () => close(false) }, [icon("close")]),
        build(close),
      ]),
    ]);
    ui.sheet = { close };
    document.body.classList.add("today-meal-modal");
    root.append(dialog);
    dialog.showModal();
    dialog.querySelector(focusSelector || "[aria-label='닫기']")?.focus();
  });
}

function onKey(event) {
  if (ui.sheet || state.view !== "meals" || !app.contains(root.activeElement)) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    selectDate(addDays(state.date, -1));
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    selectDate(addDays(state.date, 1));
  }
}

function updateToday() {
  const current = seoulToday();
  if (current === today) return false;
  const wasToday = state.date === today;
  today = current;
  if (wasToday) state.date = current;
  if (state.view === "meals") {
    if (wasToday) loadMeals();
    else paintMeals();
  }
  return wasToday;
}

document.addEventListener("keydown", onKey);
window.addEventListener("online", () => {
  if (!updateToday() && state.view === "meals") loadMeals();
});
window.addEventListener("storage", (event) => {
  if (event.storageArea !== localStorage || (event.key !== SCHOOL_KEY && event.key !== null)) return;
  const school = readSchool();
  if (!school && !state.school) return;
  ui.sheet?.close(false);
  applySchoolSelection(school, Boolean(school));
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateToday();
});
setInterval(updateToday, 60_000);
if (state.school) showMeals();
else showSearch();
