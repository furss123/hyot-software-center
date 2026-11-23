import {
  ALLERGENS,
  ALLERGEN_NAME,
  MEAL_META,
  REGIONS,
  addDays,
  formatDate,
  greeting,
  kindShort,
  normalizeMeals,
  nowMealCode,
  seoulNow,
  seoulToday,
  toSchool,
  weekDates,
  withJosa,
  ymdCompact,
} from "./meal.js";
import { requestNeis } from "./neis.js";
import { SCHOOL_KEY, readJSON, readMealCache, readSchool, writeJSON, writeMealCache } from "./storage.js";

const ALLERGY_KEY = "today-meal.allergies";
const NUMBERS_KEY = "today-meal.numbers";

const webHost = document.querySelector("#today-meal-web");
const template = webHost?.querySelector("template");
const webRoot = webHost?.shadowRoot || webHost?.attachShadow({ mode: "open" });
if (template && webRoot) webRoot.append(template.content.cloneNode(true));
const root = webRoot || document;
const app = root.querySelector("#app");
const toastEl = root.querySelector("#toast");
const neisKey = app.dataset.neisKey;
let today = seoulToday();
const ui = { view: "" };
const state = {
  school: readSchool(),
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
    down: '<path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("ico");
  svg.innerHTML = paths[name] || "";
  return svg;
}

function bowlArt() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 120 100");
  svg.setAttribute("class", "bowl-art");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <path class="steam" d="M42 30c4 5 4 8 0 13" fill="none" stroke="#ffb0c0" stroke-width="3" stroke-linecap="round"/>
    <path class="steam" d="M60 24c4 5 4 8 0 13" fill="none" stroke="#ffb0c0" stroke-width="3" stroke-linecap="round"/>
    <path class="steam" d="M78 30c4 5 4 8 0 13" fill="none" stroke="#ffb0c0" stroke-width="3" stroke-linecap="round"/>
    <path d="M18 50h84c-2 20-16 32-42 32S20 70 18 50z" fill="#fff" stroke="#ff8aa0" stroke-width="3"/>
    <path d="M14 50h92" stroke="#ff8aa0" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="60" cy="50" rx="26" ry="6" fill="#ffe1e8"/>
    <circle cx="50" cy="62" r="3" fill="#ffd2a8"/>
    <circle cx="66" cy="66" r="2.4" fill="#b7ead8"/>
  `;
  return svg;
}

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

function render() {
  if (!webRoot) document.title = state.school ? `오늘 급식 · ${state.school.name}` : "오늘 급식";
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

function showMeals() {
  clearTimeout(searchTimer);
  state.searchSeq += 1;
  searchAbort?.abort();
  state.view = "meals";
  loadMeals();
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
      { signal: controller.signal, key: neisKey }
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
  ui.schoolName = h("strong", { class: "brand-name" });
  ui.refresh = h("button", { type: "button", class: "icon-btn", "aria-label": "새로고침", onclick: refreshMeals }, [icon("refresh")]);
  ui.dateRow = h("div", { class: "date-row" });
  ui.week = h("div", { class: "week" });
  ui.pending = h("div", { class: "pending-line", hidden: true });
  ui.mealBody = h("div", { class: "meal-body" });

  const head = h("header", { class: "sticky-head" }, [
    h("div", { class: "brand-row" }, [
      h("button", { type: "button", class: "school-switch", "aria-label": "학교 변경", onclick: () => showSearch({ focus: true }) }, [
        h("span", { class: "mark", "aria-hidden": "true" }, [icon("bowl")]),
        h("span", { class: "brand-copy" }, [
          h("small", { class: "brand-kicker", text: "오늘 급식" }),
          ui.schoolName,
        ]),
      ]),
      h("div", { class: "icon-actions" }, [
        ui.refresh,
        h("button", { type: "button", class: "icon-btn", "aria-label": "설정", onclick: openSettings }, [icon("gear")]),
      ]),
    ]),
    ui.dateRow,
    ui.week,
    ui.pending,
  ]);

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

  app.append(head, ui.mealBody);
}

function paintMeals() {
  if (!ui.schoolName) return;
  ui.schoolName.textContent = state.school?.name || "학교 등록";
  ui.schoolName.title = state.school?.name || "";
  const busy = state.mealStatus === "loading" || state.mealStatus === "refreshing";
  ui.refresh.classList.toggle("is-busy", busy);
  ui.refresh.disabled = busy;
  ui.pending.hidden = !busy;
  ui.dateRow.replaceChildren(...dateControls());
  ui.week.replaceChildren(...weekButtons());
  ui.mealBody.replaceChildren(...mealNodes());
}

function dateControls() {
  const info = formatDate(state.date);
  const today = seoulToday();
  return [
    h("button", { type: "button", class: "nav-btn", "aria-label": "이전 날", onclick: () => selectDate(addDays(state.date, -1)) }, [icon("left")]),
    h("div", { class: "date-label" }, [
      h("strong", { text: info.title }),
      state.date === today
        ? h("span", { text: info.sub })
        : h("button", { type: "button", class: "today-link", onclick: () => selectDate(today) }, `${info.sub} · 오늘로`),
    ]),
    h("button", { type: "button", class: "nav-btn", "aria-label": "다음 날", onclick: () => selectDate(addDays(state.date, 1)) }, [icon("right")]),
  ];
}

function weekButtons() {
  const today = seoulToday();
  return weekDates(state.date).map((ymd) => {
    const info = formatDate(ymd);
    const classes = ["day"];
    if (ymd === today) classes.push("is-today");
    if (info.week === "토" || info.week === "일") classes.push("is-weekend");
    return h("button", {
      type: "button",
      class: classes.join(" "),
      "aria-pressed": ymd === state.date ? "true" : "false",
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
  if (state.mealStatus === "stale" || (state.mealStatus === "error" && state.meals)) {
    nodes.push(h("p", { class: "banner", text: state.mealError || "최신 정보를 불러오지 못해서 저장된 식단을 보여줘요" }));
  }
  const waiting = state.mealStatus === "loading" || state.mealStatus === "idle";
  if (waiting && !state.meals) {
    nodes.push(h("div", { class: "skel" }), h("div", { class: "skel" }), h("div", { class: "skel" }));
    return nodes;
  }
  if (state.mealStatus === "error" && !state.meals) {
    nodes.push(h("section", { class: "error-card" }, [
      bowlArt(),
      h("h2", { text: "급식을 못 불러왔어요" }),
      h("p", { text: state.mealError || "잠시 후 다시 시도해 주세요." }),
      h("div", { class: "stack" }, [
        h("button", { type: "button", class: "primary", onclick: loadMeals }, "다시 시도"),
      ]),
    ]));
    return nodes;
  }

  const meals = state.meals || [null, null, null];
  const any = meals.some((meal) => meal && meal.dishes.length);
  if (!any && (state.mealStatus === "ready" || state.mealStatus === "stale")) {
    const info = formatDate(state.date);
    const weekend = info.week === "토" || info.week === "일";
    nodes.push(h("section", { class: "empty-day" }, [
      bowlArt(),
      h("h2", { text: weekend ? "주말에는 급식이 없어요" : "이 날은 급식이 없어요" }),
      h("p", { text: weekend ? "월요일 메뉴가 궁금하면 날짜를 넘겨 보세요." : "아직 식단이 올라오지 않았거나, 급식이 없는 날이에요." }),
    ]));
    nodes.push(sourceLink());
    return nodes;
  }

  if (state.date === seoulToday()) nodes.push(h("p", { class: "greet", text: greeting() }));
  MEAL_META.forEach((meta, index) => nodes.push(mealCard(meta, meals[index])));
  nodes.push(sourceLink());
  return nodes;
}

function mealCard(meta, meal) {
  const dishes = meal?.dishes || [];
  if (!dishes.length) {
    return h("section", { class: `meal is-empty meal-${meta.key}`, "aria-label": meta.label }, [
      h("div", { class: "meal-icon" }, [icon(meta.icon)]),
      h("div", {}, [
        h("h2", { class: "meal-title", text: meta.label }),
        h("p", { text: meta.empty }),
      ]),
    ]);
  }

  const isNow = state.date === seoulToday() && nowMealCode() === meta.code;
  const hits = dishes.filter((dish) => dish.allergies.some((num) => state.allergies.has(num)));
  return h("section", { class: `meal is-full meal-${meta.key}${isNow ? " is-now" : ""}`, "aria-label": meta.label }, [
    h("div", { class: "meal-head" }, [
      h("div", { class: "meal-icon" }, [icon(meta.icon)]),
      h("div", {}, [
        h("h2", { class: "meal-title" }, [
          meta.label,
          isNow ? h("span", { class: "now-pill", text: "지금" }) : null,
        ]),
        h("p", { class: "meal-meta", text: [`${dishes.length}가지`, meal.kcal].filter(Boolean).join("  ·  ") }),
      ]),
    ]),
    hits.length ? h("p", { class: "alert-note", text: `조심할 메뉴 ${hits.length}개` }) : null,
    h("ul", { class: "dishes" }, dishes.map((dish) => dishRow(dish))),
    nutritionBlock(meal),
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
    placeholder: webRoot ? "학교 이름을 입력해 주세요" : "학교 이름, 예: 배재고등학교",
    autocomplete: "off",
    enterkeyhint: "search",
    "aria-label": "학교 이름",
  });
  ui.clear = h("button", { type: "button", class: "clear-btn", hidden: true, "aria-label": "검색어 지우기", onclick: clearQuery }, [icon("close")]);
  ui.regions = h("div", { class: "regions" });
  ui.results = h("div", { class: "results" });

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
    class: "search-box",
    onsubmit: (event) => {
      event.preventDefault();
      if (!composing) searchNow();
    },
  }, [
    h("span", { class: "search-ico", "aria-hidden": "true" }, [icon("search")]),
    ui.input,
    ui.clear,
  ]);

  const head = h("header", { class: "search-head" }, [
    h("div", { class: "brand-row" }, [
      h("div", { class: "brand-lockup" }, [
        h("span", { class: "mark", "aria-hidden": "true" }, [icon("bowl")]),
        h("span", { class: "brand-copy" }, [
          h("strong", { class: "logo-name", text: "오늘 급식" }),
        ]),
      ]),
      h("button", { type: "button", class: "icon-btn", "aria-label": "설정", onclick: openSettings }, [icon("gear")]),
    ]),
    h("p", { class: "lede", text: "학교를 등록하면 조식, 중식, 석식이 한 화면에 보여요." }),
    form,
    ui.regions,
  ]);
  app.append(head, ui.results);
  paintRegions();
}

function paintSearch() {
  if (ui.clear) ui.clear.hidden = !state.query;
  paintResults();
}

function paintRegions() {
  if (!ui.regions) return;
  ui.regions.replaceChildren(...REGIONS.map((region) => h("button", {
    type: "button",
    class: "region",
    "data-code": region.code,
    "aria-pressed": state.region === region.code ? "true" : "false",
    onclick: () => selectRegion(region.code),
  }, region.name)));
}

function selectRegion(code) {
  state.region = code;
  for (const button of ui.regions.querySelectorAll(".region")) {
    button.setAttribute("aria-pressed", button.dataset.code === code ? "true" : "false");
  }
  if (state.query.trim().length >= 2) searchNow();
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
    }, { signal: controller.signal, key: neisKey, page });
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
  if (!query) {
    ui.results.replaceChildren(h("div", { class: "hero" }, [
      bowlArt(),
      h("p", { text: "전국 초·중·고등학교를 검색해 보세요." }),
    ]));
    return;
  }
  if (query.length < 2) {
    ui.results.replaceChildren(h("p", { class: "hint", text: "두 글자부터 찾아요" }));
    return;
  }
  if (state.searching && !state.results.length) {
    ui.results.replaceChildren(h("p", { class: "hint", text: "찾는 중이에요" }));
    return;
  }
  if (state.searchError && !state.results.length) {
    ui.results.replaceChildren(h("section", { class: "error-card" }, [
      h("h2", { text: "검색이 잠시 멈췄어요" }),
      h("p", { text: state.searchError }),
      h("div", { class: "stack" }, [
        h("button", { type: "button", class: "primary", onclick: searchNow }, "다시 시도"),
      ]),
    ]));
    return;
  }
  if (!state.results.length) {
    ui.results.replaceChildren(h("p", { class: "hint", text: "이 이름으로는 학교를 못 찾았어요" }));
    return;
  }

  const nodes = state.results.map((school) => h("button", {
    type: "button",
    class: "school-card",
    onclick: () => chooseSchool(school),
  }, [
    h("span", { class: "badge", "data-k": kindShort(school.kind), text: kindShort(school.kind) }),
    h("span", { class: "school-card-body" }, [
      h("strong", { text: school.name }),
      h("span", { class: "kind-line", text: [school.kind, school.coed ? `${school.coed}학교` : ""].filter(Boolean).join(" · ") }),
      school.address ? h("span", { class: "addr", text: school.address }) : null,
    ]),
  ]));

  if (state.total > state.results.length) {
    const more = webRoot && state.searchPage * 5 < state.total;
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
  const ok = await openSheet("학교 등록", (close) => h("div", {}, [
    h("p", { class: "sheet-kicker", text: "학교 등록" }),
    h("h2", { class: "sheet-title", text: school.name }),
    h("p", { class: "sheet-sub", text: [school.kind, school.coed ? `${school.coed}학교` : "", school.address || school.region].filter(Boolean).join(" · ") }),
    h("div", { class: "sheet-actions" }, [
      h("button", { type: "button", class: "primary", onclick: () => close(true) }, "이 학교로 등록"),
      h("button", { type: "button", class: "ghost", onclick: () => close(false) }, "다시 고르기"),
    ]),
  ]), ".primary");
  if (!ok) return;

  const prev = state.school;
  const same = prev && prev.officeCode === school.officeCode && prev.schoolCode === school.schoolCode;
  if (same) {
    toast("이미 보고 있는 학교예요");
    showMeals();
    return;
  }
  writeJSON(SCHOOL_KEY, school);
  state.school = school;
  state.date = seoulToday();
  state.meals = null;
  toast(prev ? `${withJosa(school.name, "으로")} 바꿨어요` : `${withJosa(school.name, "을를")} 등록했어요`);
  showMeals();
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
      h("p", { class: "sheet-kicker", text: "설정" }),
      h("h2", { class: "sheet-title", text: "오늘 급식" }),
      state.school ? h("p", { class: "current-school", text: `${state.school.name} · ${state.school.region}` }) : h("p", { class: "current-school", text: "아직 등록한 학교가 없어요" }),
      h("div", { class: "stack" }, [
        state.view === "meals" ? h("button", { type: "button", class: "ghost", onclick: () => { close(false); showSearch({ focus: true }); } }, "학교 변경") : null,
        state.school ? h("button", { type: "button", class: "ghost", onclick: () => { close(false); forgetSchool(); } }, "등록 지우기") : null,
      ]),
      h("p", { class: "section-label", text: "내 알레르기" }),
      h("p", { class: "help", text: "해당 재료가 들어간 메뉴를 표시해요." }),
      h("div", { class: "allergen-grid" }, chips),
      h("button", { type: "button", class: "text-button", onclick: clearAllergies }, "선택 지우기"),
      h("p", { class: "section-label", text: "보기" }),
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
  writeJSON(SCHOOL_KEY, null);
  state.mealSeq += 1;
  mealAbort?.abort();
  state.school = null;
  state.meals = null;
  toast("등록을 지웠어요");
  showSearch();
}

function openSheet(label, build, focusSelector) {
  return new Promise((resolve) => {
    let settled = false;
    const previousFocus = root.activeElement;
    const close = (value) => {
      if (settled) return;
      settled = true;
      overlay.remove();
      ui.sheet = null;
      document.body.classList.remove("no-scroll");
      app.inert = false;
      previousFocus?.focus();
      resolve(value);
    };
    const overlay = h("div", {
      class: "overlay",
      onclick: (event) => { if (event.target === overlay) close(false); },
    }, [
      h("div", { class: "sheet", role: "dialog", "aria-modal": "true", "aria-label": label }, [
        h("button", { type: "button", class: "sheet-x icon-btn", "aria-label": "닫기", onclick: () => close(false) }, [icon("close")]),
        h("div", { class: "handle", "aria-hidden": "true" }),
        build(close),
      ]),
    ]);
    overlay.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const controls = overlay.querySelectorAll("button:not(:disabled)");
      const boundary = event.shiftKey ? controls[0] : controls[controls.length - 1];
      if (root.activeElement !== boundary) return;
      event.preventDefault();
      (event.shiftKey ? controls[controls.length - 1] : controls[0])?.focus();
    });
    ui.sheet = { close };
    document.body.classList.add("no-scroll");
    app.inert = true;
    (webRoot || document.body).append(overlay);
    overlay.querySelector(focusSelector || "[aria-label='닫기']")?.focus();
  });
}

function onKey(event) {
  if (ui.sheet) {
    if (event.key === "Escape") ui.sheet.close(false);
    return;
  }
  if (state.view !== "meals") return;
  if (webRoot && !webRoot.activeElement) return;
  if (event.composedPath()[0]?.matches?.("input, textarea")) return;
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

if (location.protocol !== "file:") {
  try { localStorage.removeItem("today-meal.apiKey"); } catch {}
  document.addEventListener("keydown", onKey);
  window.addEventListener("online", () => {
    if (!updateToday() && state.view === "meals") loadMeals();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateToday();
  });
  setInterval(updateToday, 60_000);
  const isNative = Boolean(window.Capacitor?.isNativePlatform?.());
  if (!webRoot && !isNative && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
  if (state.school) showMeals();
  else showSearch();
}
