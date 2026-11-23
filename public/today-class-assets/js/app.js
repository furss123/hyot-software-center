import {
  REGIONS,
  addDays,
  formatDate,
  kindShort,
  seoulNow,
  seoulToday,
  toSchool,
  weekDates,
  withJosa,
} from "./school.js";
import { requestNeis } from "./neis.js";
import {
  SCHOOL_KEY,
  readClass,
  readJSON,
  readSchool,
  readTimetableCache,
  writeClass,
  writeJSON,
  writeTimetableCache,
} from "./storage.js";
import {
  classLabel,
  emptyTimetableMessage,
  fetchClassList,
  fetchTimetable,
  nowPeriod,
  timetableService,
} from "./timetable.js";

const host = document.querySelector("#today-class-web");
const root = host ? host.shadowRoot || host.attachShadow({mode: "open"}) : document;
const template = host?.querySelector("template");
if (template) root.append(template.content.cloneNode(true));
const app = root.querySelector("#app");
const toastEl = root.querySelector("#toast");
const savedSchool = readSchool();
let today = seoulToday();
const ui = { view: "" };
const state = {
  school: savedSchool,
  classInfo: readClass(savedSchool),
  date: today,
  view: "",
  query: "",
  region: "",
  results: [],
  total: 0,
  searchPage: 0,
  received: 0,
  searching: false,
  searchError: "",
  searchSeq: 0,
  periods: null,
  timetableStatus: "idle",
  timetableError: "",
  timetableSeq: 0,
  classOptions: [],
  classPickGrade: "",
  classListStatus: "idle",
  classListError: "",
  classListSeq: 0,
};

let searchTimer = 0;
let searchAbort = null;
let timetableAbort = null;
let classListAbort = null;
let toastTimer = 0;
let composing = false;

function h(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = String(value);
    else if (key === "hidden") node.hidden = true;
    else if (key === "style" && typeof value === "string") node.setAttribute("style", value);
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
    calendar: '<rect x="4" y="5.5" width="16" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 3.5v4M16 3.5v4M4 10.5h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8.5 14h2M13.5 14h2M8.5 17h2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    gear: '<path fill="currentColor" fill-rule="evenodd" d="M10.1 2.7h3.8l.5 2.2c.6.2 1.1.5 1.6.9l2.1-1.1 2.7 2.7-1.1 2.1c.4.5.7 1 .9 1.6l2.2.5v3.8l-2.2.5c-.2.6-.5 1.1-.9 1.6l1.1 2.1-2.7 2.7-2.1-1.1c-.5.4-1 .7-1.6.9l-.5 2.2h-3.8l-.5-2.2a6 6 0 0 1-1.6-.9l-2.1 1.1-2.7-2.7 1.1-2.1a6 6 0 0 1-.9-1.6l-2.2-.5V10.6l2.2-.5c.2-.6.5-1.1.9-1.6L4.4 6.4l2.7-2.7 2.1 1.1c.5-.4 1-.7 1.6-.9l.5-2.2zM12 9.1a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z"/>',
    search: '<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    left: '<path d="M14 6 8 12l6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    right: '<path d="m10 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2-5.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M19.5 4.5V8H16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    close: '<path d="M7 7l10 10M17 7 7 17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
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
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

function render() {
  if (!host) document.title = state.school ? `오늘 수업 · ${state.school.name}` : "오늘 수업";
  if (ui.view !== state.view) {
    app.replaceChildren();
    ui.view = state.view;
    if (state.view === "search") buildSearch();
    else buildHome();
  }
  if (state.view === "search") paintSearch();
  else paintHome();
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

function showHome() {
  clearTimeout(searchTimer);
  state.searchSeq += 1;
  searchAbort?.abort();
  state.view = "home";
  if (!state.classInfo) {
    render();
    openClassSetup();
    return;
  }
  loadTimetable();
}

function selectDate(ymd) {
  if (ymd === state.date) return;
  state.date = ymd;
  loadTimetable();
}

async function loadTimetable() {
  const school = state.school;
  const classInfo = state.classInfo;
  const date = state.date;
  if (!school || !classInfo) return;
  if (!timetableService(school.kind)) {
    state.periods = [];
    state.timetableStatus = "unsupported";
    state.timetableError = "이 학교 종류는 시간표를 지원하지 않아요";
    if (state.view === "home") render();
    return;
  }
  timetableAbort?.abort();
  const controller = new AbortController();
  timetableAbort = controller;
  const seq = ++state.timetableSeq;
  const cached = readTimetableCache(school, classInfo, date);
  state.periods = cached;
  state.timetableStatus = cached ? "refreshing" : "loading";
  state.timetableError = "";
  if (state.view === "home") render();

  try {
    const periods = await fetchTimetable(school, classInfo, date, { signal: controller.signal });
    if (seq !== state.timetableSeq) return;
    writeTimetableCache(school, classInfo, date, periods);
    state.periods = periods;
    state.timetableStatus = "ready";
    state.timetableError = "";
  } catch (error) {
    if (error.name === "AbortError" || seq !== state.timetableSeq) return;
    state.timetableError = error.message || "시간표를 불러오지 못했어요";
    state.timetableStatus = cached ? "stale" : "error";
  }
  if (state.view === "home" && seq === state.timetableSeq) paintHome();
}

function attachSwipe(target) {
  let touch = null;
  target.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    touch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  target.addEventListener("touchend", (event) => {
    if (!touch) return;
    const dx = event.changedTouches[0].clientX - touch.x;
    const dy = event.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    selectDate(addDays(state.date, dx < 0 ? 1 : -1));
  }, { passive: true });
  target.addEventListener("touchcancel", () => { touch = null; });
}

function buildHome() {
  ui.schoolName = h("strong", { class: "brand-name" });
  ui.classLine = h("button", { type: "button", class: "class-line", onclick: () => openClassSetup() });
  ui.refresh = h("button", { type: "button", class: "icon-btn", "aria-label": "새로고침", onclick: refreshTimetable }, [icon("refresh")]);
  ui.dateRow = h("div", { class: "date-row" });
  ui.week = h("div", { class: "week" });
  ui.pending = h("div", { class: "pending-line", hidden: true });
  ui.body = h("div", { class: "body" });

  const head = h("header", { class: "sticky-head" }, [
    h("div", { class: "brand-row" }, [
      h("button", { type: "button", class: "school-switch", "aria-label": "학교 변경", onclick: () => showSearch({ focus: true }) }, [
        h("span", { class: "mark", "aria-hidden": "true" }, [icon("calendar")]),
        h("span", { class: "brand-copy" }, [
          h("small", { class: "brand-kicker", text: "오늘 수업" }),
          ui.schoolName,
        ]),
      ]),
      h("div", { class: "icon-actions" }, [
        ui.refresh,
        h("button", { type: "button", class: "icon-btn", "aria-label": "설정", onclick: openSettings }, [icon("gear")]),
      ]),
    ]),
    ui.classLine,
    ui.dateRow,
    ui.week,
    ui.pending,
  ]);

  attachSwipe(ui.body);
  app.append(head, ui.body);
}

function paintHome() {
  if (!ui.schoolName) return;
  ui.schoolName.textContent = state.school?.name || "학교 등록";
  ui.schoolName.title = state.school?.name || "";
  const label = state.classInfo ? classLabel(state.classInfo.grade, state.classInfo.classNm) : "학년·반을 선택해 주세요";
  ui.classLine.replaceChildren(
    h("span", { class: "class-line-label", text: label }),
    h("span", { class: "class-line-action", text: state.classInfo ? "변경" : "선택" }),
  );
  const busy = state.timetableStatus === "loading" || state.timetableStatus === "refreshing";
  ui.refresh.classList.toggle("is-busy", busy);
  ui.refresh.disabled = busy || !state.classInfo;
  ui.pending.hidden = !busy;
  ui.dateRow.replaceChildren(...dateControls());
  ui.week.replaceChildren(...weekButtons());
  ui.body.replaceChildren(...timetableNodes());
}

function dateControls() {
  const info = formatDate(state.date);
  const current = seoulToday();
  return [
    h("button", { type: "button", class: "nav-btn", "aria-label": "이전 날", onclick: () => selectDate(addDays(state.date, -1)) }, [icon("left")]),
    h("div", { class: "date-label" }, [
      h("strong", { text: info.title }),
      state.date === current
        ? h("span", { text: info.sub })
        : h("button", { type: "button", class: "today-link", onclick: () => selectDate(current) }, `${info.sub} · 오늘로`),
    ]),
    h("button", { type: "button", class: "nav-btn", "aria-label": "다음 날", onclick: () => selectDate(addDays(state.date, 1)) }, [icon("right")]),
  ];
}

function weekButtons() {
  const current = seoulToday();
  return weekDates(state.date).map((ymd) => {
    const info = formatDate(ymd);
    const classes = ["day"];
    if (ymd === current) classes.push("is-today");
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

function timetableNodes() {
  const nodes = [];
  if (!state.classInfo) {
    nodes.push(h("section", { class: "empty-day" }, [
      h("h2", { text: "학년·반을 골라 주세요" }),
      h("p", { text: "학교를 등록한 뒤 학년과 반을 저장하면 그 반 시간표를 보여줘요." }),
      h("div", { class: "stack" }, [
        h("button", { type: "button", class: "primary", onclick: () => openClassSetup() }, "학년·반 선택"),
      ]),
    ]));
    return nodes;
  }
  if (state.timetableStatus === "unsupported") {
    nodes.push(h("section", { class: "empty-day" }, [
      h("h2", { text: "시간표를 지원하지 않아요" }),
      h("p", { text: state.timetableError || "초·중·고등학교만 시간표를 볼 수 있어요." }),
    ]));
    return nodes;
  }
  if (state.timetableStatus === "stale" || (state.timetableStatus === "error" && state.periods)) {
    nodes.push(h("p", { class: "banner", text: "연결이 끊겨 마지막으로 저장한 시간표를 표시하고 있어요." }));
  }
  const waiting = state.timetableStatus === "loading" || state.timetableStatus === "idle";
  if (waiting && !state.periods) {
    nodes.push(h("div", { class: "skel" }), h("div", { class: "skel skel-period" }), h("div", { class: "skel skel-period" }));
    return nodes;
  }
  if (state.timetableStatus === "error" && !state.periods) {
    nodes.push(h("section", { class: "error-card" }, [
      h("h2", { text: "시간표를 못 불러왔어요" }),
      h("p", { text: state.timetableError || "잠시 후 다시 시도해 주세요." }),
      h("div", { class: "stack" }, [
        h("button", { type: "button", class: "primary", onclick: loadTimetable }, "다시 시도"),
      ]),
    ]));
    return nodes;
  }

  const periods = state.periods || [];
  if (!periods.length && (state.timetableStatus === "ready" || state.timetableStatus === "stale")) {
    const empty = emptyTimetableMessage(state.date);
    nodes.push(h("section", { class: "empty-day" }, [
      h("h2", { text: empty.title }),
      h("p", { text: empty.body }),
    ]));
    nodes.push(sourceLink());
    return nodes;
  }

  if (state.date === seoulToday()) {
    nodes.push(h("p", { class: "greet", text: `${classLabel(state.classInfo.grade, state.classInfo.classNm)} 오늘 수업이에요` }));
  }
  const current = state.date === seoulToday() ? nowPeriod(seoulNow().minutes, periods) : 0;
  nodes.push(h("section", { class: "period-list", "aria-label": "수업 시간표" }, periods.map((item) => periodRow(item, current))));
  nodes.push(sourceLink());
  return nodes;
}

function periodRow(item, currentPeriod) {
  const isNow = currentPeriod === item.period;
  return h("article", {
    class: `period-card${isNow ? " is-now" : ""}`,
  }, [
    h("div", { class: "period-num" }, [
      h("b", { text: String(item.period) }),
      h("span", { text: "교시" }),
    ]),
    h("div", { class: "period-copy" }, [
      h("h2", { class: "period-title" }, [
        item.subject,
        isNow ? h("span", { class: "now-pill", text: "현재 교시 추정", title: "오전 8시 40분 시작 기준으로 학교 일과와 다를 수 있어요." }) : null,
      ]),
      item.room ? h("p", { class: "period-meta", text: `${item.room}교실` }) : null,
    ]),
  ]);
}

function refreshTimetable() {
  if (!state.classInfo) {
    openClassSetup();
    return;
  }
  if (state.timetableStatus === "loading" || state.timetableStatus === "refreshing") return;
  loadTimetable();
}

function sourceLink() {
  return h("a", {
    class: "source",
    href: "https://open.neis.go.kr",
    target: "_blank",
    rel: "noopener noreferrer",
  }, "자료 · 나이스 교육정보");
}

function buildSearch() {
  ui.input = h("input", {
    class: "search-input",
    id: "school-query",
    type: "text",
    placeholder: "학교 이름, 예: 남악고등학교",
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
        h("span", { class: "mark", "aria-hidden": "true" }, [icon("calendar")]),
        h("span", { class: "brand-copy" }, [
          h("strong", { class: "logo-name", text: "학교 찾기" }),
        ]),
      ]),
      h("button", { type: "button", class: "icon-btn", "aria-label": "설정", onclick: openSettings }, [icon("gear")]),
    ]),
    h("p", { class: "lede", text: "학교와 학년·반을 저장하면 그 반의 수업 시간표가 보여요." }),
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
    state.received = 0;
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
    state.received += rows.length;
    state.total = rows.length ? total : state.received;
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
    .filter((school) => timetableService(school.kind))
    .sort((a, b) => score(a.name) - score(b.name) || a.name.localeCompare(b.name, "ko"));
}

function paintResults() {
  if (!ui.results) return;
  const query = state.query.trim();
  if (!query) {
    ui.results.replaceChildren();
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
  if (!state.results.length && !state.total) {
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

  if (!nodes.length) nodes.push(h("p", {class:"hint", text:"시간표를 제공하는 초·중·고등학교가 없어요."}));
  if (state.received < state.total) {
    if (state.searchError) nodes.push(h("p", {class:"result-note", text:state.searchError}));
    nodes.push(h("button", {type:"button", class:"ghost", disabled:state.searching,
      onclick:() => loadSearchPage(state.searchPage + 1)}, state.searching ? "찾는 중…" : "학교 더 보기"));
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
    showHome();
    return;
  }
  writeJSON(SCHOOL_KEY, school);
  state.school = school;
  state.date = seoulToday();
  state.periods = null;
  state.classInfo = null;
  writeClass(null);
  state.classOptions = [];
  state.classPickGrade = "";
  toast(prev ? `${withJosa(school.name, "으로")} 바꿨어요` : `${withJosa(school.name, "을를")} 등록했어요`);
  showHome();
}

async function openClassSetup({ soft = false } = {}) {
  if (!state.school) {
    toast("먼저 학교를 등록해 주세요");
    return;
  }
  if (!timetableService(state.school.kind)) {
    toast("이 학교 종류는 시간표를 지원하지 않아요");
    return;
  }

  const school = state.school;
  const body = h("div", { class: "class-setup" });
  return openSheet("학년·반 선택", (close) => {
    const save = (grade, classNm) => {
      const next = { grade: String(grade), classNm: String(classNm) };
      writeClass(state.school, next);
      state.classInfo = next;
      state.periods = null;
      toast(`${classLabel(next.grade, next.classNm)}으로 저장했어요`);
      close(true);
      if (state.view === "home") loadTimetable();
      else showHome();
    };

    const paint = () => {
      if (state.school !== school) return;
      const nodes = [
        h("p", { class: "sheet-kicker", text: "시간표" }),
        h("h2", { class: "sheet-title", text: "학년·반 선택" }),
        h("p", { class: "sheet-sub", text: soft
          ? `${state.school.name}의 학년과 반을 저장하면 시간표를 볼 수 있어요.`
          : `${state.school.name} · 저장한 반의 수업 시간표를 보여줘요.` }),
      ];

      if (state.classListStatus === "loading" && !state.classOptions.length) {
        nodes.push(h("p", { class: "hint", text: "학급 목록을 불러오는 중이에요" }));
      } else if (state.classListStatus === "error" && !state.classOptions.length) {
        nodes.push(h("p", { class: "help", text: state.classListError || "학급 목록을 불러오지 못했어요" }));
        nodes.push(h("div", { class: "stack" }, [
          h("button", { type: "button", class: "primary", onclick: () => loadClassOptions().then(paint) }, "다시 시도"),
          soft ? h("button", { type: "button", class: "ghost", onclick: () => close(false) }, "나중에") : null,
        ]));
      } else if (!state.classOptions.length) {
        nodes.push(h("p", { class: "help", text: "등록된 학급 정보가 없어요. 학교에서 아직 공개하지 않았을 수 있어요." }));
        if (soft) nodes.push(h("div", { class: "stack" }, [
          h("button", { type: "button", class: "ghost", onclick: () => close(false) }, "나중에"),
        ]));
      } else {
        const grades = state.classOptions;
        const grade = state.classPickGrade || grades[0]?.grade || "";
        state.classPickGrade = grade;
        const selected = grades.find((item) => item.grade === grade) || grades[0];
        nodes.push(h("p", { class: "section-label", text: "학년" }));
        nodes.push(h("div", { class: "chip-grid" }, grades.map((item) => h("button", {
          type: "button",
          class: "chip",
          "aria-pressed": item.grade === grade ? "true" : "false",
          onclick: () => {
            state.classPickGrade = item.grade;
            paint();
          },
        }, `${item.grade}학년`))));
        nodes.push(h("p", { class: "section-label", text: "반" }));
        nodes.push(h("div", { class: "chip-grid" }, (selected?.classes || []).map((classNm) => h("button", {
          type: "button",
          class: "chip",
          "aria-pressed": state.classInfo?.grade === grade && state.classInfo?.classNm === classNm ? "true" : "false",
          onclick: () => save(grade, classNm),
        }, `${classNm}반`))));
        if (soft) {
          nodes.push(h("button", { type: "button", class: "text-button", onclick: () => close(false) }, "나중에 할게요"));
        }
      }
      body.replaceChildren(...nodes);
    };

    state.classListStatus = state.classOptions.length ? "ready" : "loading";
    paint();
    loadClassOptions().then(paint);
    return body;
  }, soft ? "[aria-label='닫기']" : ".chip, [aria-label='닫기']");
}

async function loadClassOptions() {
  const school = state.school;
  if (!school) return;
  classListAbort?.abort();
  const controller = new AbortController();
  classListAbort = controller;
  const seq = ++state.classListSeq;
  state.classListStatus = "loading";
  state.classListError = "";
  try {
    const options = await fetchClassList(school, { signal: controller.signal });
    if (seq !== state.classListSeq) return;
    state.classOptions = options;
    if (!state.classPickGrade || !options.some((item) => item.grade === state.classPickGrade)) {
      state.classPickGrade = state.classInfo?.grade || options[0]?.grade || "";
    }
    state.classListStatus = "ready";
  } catch (error) {
    if (error.name === "AbortError" || seq !== state.classListSeq) return;
    state.classListStatus = "error";
    state.classListError = error.message || "학급 목록을 불러오지 못했어요";
  }
}

function openSettings() {
  const classText = state.classInfo
    ? classLabel(state.classInfo.grade, state.classInfo.classNm)
    : "아직 저장한 반이 없어요";

  return openSheet("설정", (close) => h("div", {}, [
    h("p", { class: "sheet-kicker", text: "설정" }),
    h("h2", { class: "sheet-title", text: "오늘 수업" }),
    state.school
      ? h("p", { class: "current-school", text: `${state.school.name} · ${state.school.region}` })
      : h("p", { class: "current-school", text: "아직 등록한 학교가 없어요" }),
    h("div", { class: "stack" }, [
      state.view === "home"
        ? h("button", { type: "button", class: "ghost", onclick: () => { close(false); showSearch({ focus: true }); } }, "학교 변경")
        : null,
      state.school && timetableService(state.school.kind)
        ? h("button", { type: "button", class: "ghost", onclick: () => { close(false); openClassSetup(); } }, `학년·반 설정 · ${classText}`)
        : null,
      state.school
        ? h("button", { type: "button", class: "ghost", onclick: () => { close(false); forgetSchool(); } }, "등록 지우기")
        : null,
    ]),
  ]));
}

function forgetSchool() {
  writeJSON(SCHOOL_KEY, null);
  writeClass(null);
  state.timetableSeq += 1;
  timetableAbort?.abort();
  classListAbort?.abort();
  state.school = null;
  state.classInfo = null;
  state.periods = null;
  state.classOptions = [];
  state.classPickGrade = "";
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
      overlay.close();
      overlay.remove();
      ui.sheet = null;
      previousFocus?.focus();
      resolve(value);
    };
    const overlay = h("dialog", {class:"sheet", "aria-label":label}, [
      h("button", {type:"button", class:"sheet-x icon-btn", "aria-label":"닫기", onclick:() => close(false)}, [icon("close")]),
      build(close),
    ]);
    overlay.addEventListener("cancel", event => { event.preventDefault(); close(false); });
    overlay.addEventListener("click", event => {
      if (event.target !== overlay) return;
      const box = overlay.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close(false);
    });
    ui.sheet = {close};
    (host ? root : document.body).append(overlay);
    overlay.showModal();
    overlay.querySelector(focusSelector || "[aria-label='닫기']")?.focus();
  });
}

function onKey(event) {
  if (ui.sheet) {
    if (event.key === "Escape") ui.sheet.close(false);
    return;
  }
  if (state.view !== "home") return;
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
  if (state.view === "home") {
    if (wasToday) loadTimetable();
    else paintHome();
  }
  return wasToday;
}

if (location.protocol !== "file:") {
  root.addEventListener("keydown", onKey);
  window.addEventListener("online", () => {
    if (updateToday()) return;
    if (state.view === "home" && state.classInfo) loadTimetable();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateToday();
  });
  setInterval(() => {
    if (!document.hidden && !updateToday() && state.view === "home" && state.date === today && state.periods?.length) ui.body.replaceChildren(...timetableNodes());
  }, 60_000);
  if (!host && "serviceWorker" in navigator && !["today-class.local", "appassets.androidplatform.net"].includes(location.hostname)) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
  if (state.school) showHome();
  else showSearch();
}
