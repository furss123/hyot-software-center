import { button, h, iconButton } from "./dom.js";
import { openClassPicker, openPreferences, openSchoolSearch } from "./dialogs.js";
import { icon } from "./icons.js";
import { ALLERGEN_NAME, MEAL_META, addDays, formatDate, normalizeMeals, seoulToday, weekDates, ymdCompact } from "./meal.js";
import { requestNeis } from "./neis.js";
import {
  readClass, readJSON, readMealCache, readSchool, readTimetableCache,
  writeClass, writeJSON, writeMealCache, writeSchool, writeTimetableCache,
} from "./storage.js";
import { classLabel, fetchTimetable, timetableService } from "./timetable.js";

const host = document.querySelector("#today-school-web");
const template = host?.querySelector("template");
const root = host ? host.shadowRoot || host.attachShadow({ mode: "open" }) : document;
if (template) root.append(template.content.cloneNode(true));

const app = root.querySelector("#app");
const widget = window.widget;
const systemTheme = matchMedia("(prefers-color-scheme: dark)");
const THEME_KEY = "today-school.theme";
const TEXT_SIZE_KEY = "today-school.largeText";
const MEAL_KEY = "today-school.defaultMeal";
const ALLERGY_KEY = "today-meal.allergies";
const NUMBERS_KEY = "today-meal.numbers";
const asset = (path) => new URL("../" + path, import.meta.url).href;
const panels = {
  timetable: { status: "idle", data: null },
  meals: { status: "idle", data: null },
};

let school = readSchool();
let classInfo = readClass(school);
let today = seoulToday();
let date = today;
let mealChoice = null;
const savedTheme = readJSON(THEME_KEY, "system");
let theme = ["system", "light", "dark"].includes(savedTheme) ? savedTheme : "system";
let largeText = readJSON(TEXT_SIZE_KEY, false) === true;
let defaultMeal = readJSON(MEAL_KEY, "auto");
if (!MEAL_META.some(({ code }) => code === defaultMeal)) defaultMeal = "auto";
let showNumbers = readJSON(NUMBERS_KEY, false) === true;
const allergies = new Set([].concat(readJSON(ALLERGY_KEY, [])).map(Number));
const supportsTimetable = () => Boolean(school && timetableService(school.kind));

const ui = {};

function applyTheme() {
  const html = document.documentElement;
  const deviceTheme = systemTheme.matches ? "dark" : "light";
  const appearance = theme === "system" ? (host && html.dataset.theme) || deviceTheme : theme;
  (host || html).dataset.theme = appearance;
  const color = appearance === "dark" ? "#111722" : "#f5f7fb";
  document.querySelector('meta[name="theme-color"]:not([media])')?.setAttribute("content", color);
  if (widget) widget.setTheme(theme).catch(() => {});
  const statusBar = window.Capacitor?.Plugins?.StatusBar;
  if (statusBar) {
    statusBar.setStyle({ style: appearance === "dark" ? "LIGHT" : "DARK" }).catch(() => {});
    statusBar.setBackgroundColor({ color }).catch(() => {});
  }
}

function build() {
  const brand = h("div", { class: "brand" }, [
    h("img", { class: "brand-icon", src: asset("icon.svg"), alt: "", width: "38", height: "38" }),
    h("span", { text: "오늘 학교" }),
  ]);
  ui.schoolName = h("span", { class: "school-name" });
  ui.school = button("학교 등록", chooseSchool, [icon("school"), ui.schoolName, icon("down")], { class: "school-button" });
  ui.refresh = iconButton("새로고침", "refresh", loadDay);
  ui.settings = iconButton("설정", "gear", settings);
  const topbar = h("header", { class: "topbar" }, h("div", { class: "topbar-inner" }, [
    brand, h("div", { class: "toolbar" }, [ui.school, ui.refresh, ui.settings]),
  ]));

  ui.dateTitle = h("h1", { id: "date-title" });
  ui.dateYear = h("p", { class: "date-year" });
  ui.today = button("오늘", () => selectDate(today), [icon("calendar"), "오늘"], { class: "secondary today-button" });
  ui.week = h("div", { class: "week", role: "group", "aria-label": "요일 선택" });
  const previous = iconButton("이전 날", "left", () => selectDate(addDays(date, -1)));
  const next = iconButton("다음 날", "right", () => selectDate(addDays(date, 1)));
  ui.week.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    selectDate(addDays(date, event.key === "ArrowLeft" ? -1 : 1));
    ui.week.querySelector('[aria-pressed="true"]')?.focus();
  });
  const dates = h("section", { class: "date-section", "aria-labelledby": ui.dateTitle.id }, [
    h("div", { class: "date-heading" }, [
      h("div", {}, [ui.dateYear, ui.dateTitle]),
      ui.today,
    ]),
    h("div", { class: "week-strip" }, [previous, ui.week, next]),
  ]);

  ui.register = h("div", { class: "register-strip" }, [
    h("span", { class: "register-icon" }, icon("school")),
    h("p", { text: "학교를 등록하면 시간표와 급식을 볼 수 있습니다." }),
    button("학교 등록", chooseSchool, ["학교 등록", icon("arrow")], { class: "primary" }),
  ]);

  ui.classButton = button("학년·반 선택", chooseClass, [], { class: "class-button" });
  ui.mealEnergy = h("span", { class: "meal-energy" });
  ui.timetable = h("div", { class: "panel-body", "aria-live": "polite" });
  ui.meals = h("div", { class: "panel-body meal-body", "aria-live": "polite" });
  ui.mealTabs = MEAL_META.map(({ code, label }) => button(label, () => {
    mealChoice = code;
    paintMeals();
  }, label, { class: "meal-tab" }));
  const tabs = h("div", { class: "meal-tabs", role: "group", "aria-label": "급식 구분" }, ui.mealTabs);
  const panelsGrid = h("div", { class: "panels" }, [
    makePanel("시간표", "timetable", "book", ui.classButton, ui.timetable),
    makePanel("급식", "meals", "meal", ui.mealEnergy, tabs, ui.meals),
  ]);
  ui.panelShortcuts = h("div", { class: "panel-shortcuts", role: "group", "aria-label": "바로 이동" }, [
    panelShortcut("시간표", "book", panelsGrid.children[0]),
    panelShortcut("급식", "meal", panelsGrid.children[1]),
  ]);

  const source = h("a", {
    href: "https://open.neis.go.kr/", target: "_blank", rel: "noopener noreferrer",
    onclick: widget ? (event) => {
      event.preventDefault();
      widget.openExternal(event.currentTarget.href);
    } : null,
  }, ["나이스 교육정보 개방 포털", icon("external")]);

  const dashboard = h(host ? "div" : "main", { class: "dashboard" }, [
    dates, ui.register, ui.panelShortcuts, panelsGrid,
    h("footer", { class: "data-source" }, [h("span", { text: "자료 제공" }), source]),
  ]);
  addSwipe(panelsGrid);
  app.replaceChildren(topbar, dashboard);
  if (widget) app.prepend(widgetBar());
}

function panelShortcut(label, glyph, panel) {
  const heading = panel.querySelector("h2");
  return button(label, () => {
    heading.focus({ preventScroll: true });
    panel.scrollIntoView({ block: "start" });
  }, [icon(glyph), label, icon("down")], { "aria-controls": heading.id });
}

function makePanel(label, name, glyph, action, ...children) {
  const heading = h("h2", { id: name + "-heading", tabindex: "-1", text: label });
  return h("section", { class: "panel panel-" + name, "aria-labelledby": heading.id }, [
    h("header", { class: "panel-header" }, [
      h("div", { class: "panel-title" }, [h("span", { class: "panel-icon" }, icon(glyph)), heading]),
      action,
    ]),
    ...children,
  ]);
}

function widgetBar() {
  const sync = ({ alwaysOnTop }) => pin.setAttribute("aria-pressed", String(alwaysOnTop));
  const pin = iconButton("항상 위", "pin", async () => {
    pin.disabled = true;
    try {
      sync(await widget.setPreference("alwaysOnTop", pin.getAttribute("aria-pressed") !== "true"));
    } catch {
      pin.title = "창 고정 설정을 변경하지 못했습니다.";
    } finally {
      pin.disabled = false;
    }
  });
  pin.disabled = true;
  widget.onPreferencesChanged(sync);
  widget.getPreferences().then((preferences) => {
    sync(preferences);
    pin.disabled = false;
  }).catch(() => { pin.title = "창 고정 설정을 불러오지 못했습니다."; });
  return h("div", { class: "window-bar" }, [
    pin, iconButton("트레이로 숨기기", "hide", widget.hide), iconButton("종료", "close", widget.close),
  ]);
}

function addSwipe(target) {
  let start;
  target.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1 || event.target.closest("button, a, summary")) {
      start = null;
      return;
    }
    const { clientX, clientY } = event.touches[0];
    start = { x: clientX, y: clientY };
  }, { passive: true });
  target.addEventListener("touchcancel", () => { start = null; }, { passive: true });
  target.addEventListener("touchend", (event) => {
    if (!start) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    start = null;
    if (Math.abs(dx) > 72 && Math.abs(dx) > Math.abs(dy) * 1.5) selectDate(addDays(date, dx < 0 ? 1 : -1));
  }, { passive: true });
}

function paintDate() {
  const { year, title, sub } = formatDate(date);
  ui.dateYear.textContent = year + "년";
  ui.dateTitle.replaceChildren(title, " ", h("span", { text: sub }));
  ui.today.setAttribute("aria-current", date === today ? "date" : "false");

  const dates = weekDates(date);
  if (ui.week.firstElementChild?.dataset.date !== dates[0]) {
    ui.week.replaceChildren(...dates.map((ymd) => {
      const info = formatDate(ymd);
      return button(info.title, () => selectDate(ymd), [
        h("span", { text: info.week }),
        h("time", { datetime: ymd, text: info.day }),
      ], {
        class: "day-button" + (["토", "일"].includes(info.week) ? " weekend" : ""),
        "data-date": ymd,
        "aria-label": info.title + " " + info.sub,
      });
    }));
  }
  for (const day of ui.week.children) {
    day.setAttribute("aria-pressed", String(day.dataset.date === date));
    day.setAttribute("aria-current", day.dataset.date === today ? "date" : "false");
  }
}

function paintControls() {
  const name = school?.name || "학교 등록";
  ui.school.hidden = !school;
  ui.refresh.hidden = !school;
  ui.schoolName.textContent = name;
  ui.school.setAttribute("aria-label", school ? name + " 학교 변경" : name);
  ui.register.hidden = Boolean(school);
  ui.panelShortcuts.hidden = !school;
  ui.refresh.disabled = !school || Object.values(panels).some((panel) => panel.status === "loading");
  ui.classButton.hidden = !supportsTimetable();
  ui.classButton.replaceChildren(classInfo ? classLabel(classInfo) : "학년·반 선택", icon("down"));
  if (!host) document.title = school ? "오늘 학교 · " + school.name : "오늘 학교";
}

function empty(name, title) {
  return h("div", { class: "empty-state" }, [
    h("img", { src: asset("assets/" + name + ".svg"), alt: "", width: "92", height: "69" }),
    h("p", { text: title }),
  ]);
}

function panelStatus(panel, name, retry) {
  const { status, data, error } = panel;
  if (status === "loading" && data === null) {
    return h("p", { class: "loading-state", role: "status" }, [
      h("span", { class: "loading-indicator", "aria-hidden": "true" }),
      name + " 정보를 불러오는 중입니다.",
    ]);
  }
  if (status === "error") {
    return h("div", { class: "panel-notice", role: "status" }, [
      icon("warning"),
      h("div", {}, [
        h("p", { text: data === null ? name + " 정보를 불러올 수 없습니다." : "저장된 " + name + " 정보입니다." }),
        h("small", { text: error }),
      ]),
      button("다시 시도", retry, "다시 시도", { class: "secondary" }),
    ]);
  }
  return null;
}

function paintTimetable() {
  if (!school) {
    ui.timetable.replaceChildren(empty("timetable", "교시별 과목"));
    return;
  }
  if (!supportsTimetable()) {
    ui.timetable.replaceChildren(empty("timetable", "이 학교는 시간표 조회를 지원하지 않습니다."));
    return;
  }
  if (!classInfo) {
    ui.timetable.replaceChildren(empty("timetable", "학년과 반을 선택해 주세요."));
    return;
  }
  const panel = panels.timetable;
  const notice = panelStatus(panel, "시간표", loadTimetable);
  const nodes = notice ? [notice] : [];
  if (panel.data?.length) {
    nodes.push(h("ol", { class: "period-list" }, panel.data.map(({ period, subject, room }) =>
      h("li", { class: "period-row", value: period }, [
        h("span", { class: "period-label", text: period + "교시" }),
        h("strong", { class: "period-subject", text: subject }),
        room && room !== classInfo.classNm ? h("small", { class: "period-room", text: room }) : null,
      ]))));
  } else if (panel.data) {
    nodes.push(empty("timetable", "공개된 시간표가 없습니다."));
  }
  ui.timetable.replaceChildren(...nodes);
}

function paintMeals() {
  const panel = panels.meals;
  const available = (meal) => Boolean(meal?.dishes?.length);
  const preferredCode = defaultMeal === "auto" ? "2" : defaultMeal;
  const preferred = panel.data?.find((meal) => meal?.code === preferredCode);
  const activeCode = mealChoice || (available(preferred) ? preferredCode : panel.data?.find(available)?.code || preferredCode);
  const activeIndex = MEAL_META.findIndex(({ code }) => code === activeCode);
  const meal = panel.data?.[activeIndex];
  ui.mealEnergy.textContent = available(meal) ? meal.kcal : "";
  for (let i = 0; i < ui.mealTabs.length; i += 1) {
    const tab = ui.mealTabs[i];
    tab.setAttribute("aria-pressed", String(i === activeIndex));
    tab.disabled = !school;
  }

  if (!school) {
    ui.meals.replaceChildren(empty("meals", "조식·중식·석식 메뉴"));
    return;
  }
  const notice = panelStatus(panel, "급식", loadMeals);
  const nodes = notice ? [notice] : [];
  if (panel.data) {
    if (available(meal)) nodes.push(...mealDetails(meal));
    else nodes.push(empty("meals", panel.data.some(available)
      ? MEAL_META[activeIndex].label + " 메뉴가 없습니다."
      : "공개된 식단이 없습니다."));
  }
  ui.meals.replaceChildren(...nodes);
}

function mealDetails(meal) {
  const rows = meal.dishes.map((dish) => {
    const matched = [...new Set(dish.allergies)].filter((number) => allergies.has(number) && ALLERGEN_NAME[number]);
    return h("li", { class: "dish-row" + (matched.length ? " allergen-match" : "") }, [
      h("span", { class: "dish-dot", "aria-hidden": "true" }),
      h("span", { class: "dish-name", text: dish.name }),
      matched.length ? h("span", { class: "allergen-tag" }, [
        icon("warning"), matched.map((number) => ALLERGEN_NAME[number]).join(" · "),
      ]) : null,
      showNumbers && dish.allergies.length
        ? h("small", { class: "dish-numbers", "aria-label": "알레르기 번호 " + dish.allergies.join(", "), text: dish.allergies.join("·") })
        : null,
    ]);
  });
  return [
    h("ul", { class: "dish-list" }, rows),
    meal.nutrition?.length || meal.origin ? h("details", { class: "meal-details" }, [
      h("summary", {}, [
        [meal.nutrition?.length && "영양 정보", meal.origin && "원산지"].filter(Boolean).join(" · "),
        icon("down"),
      ]),
      meal.nutrition?.length ? h("dl", { class: "nutrition-list" }, meal.nutrition.map(({ label, value }) =>
        h("div", {}, [h("dt", { text: label }), h("dd", { text: value })]))) : null,
      meal.origin ? h("p", { class: "meal-origin", text: meal.origin }) : null,
    ]) : null,
  ].filter(Boolean);
}

function chooseSchool() {
  openSchoolSearch(app, (chosen) => {
    school = chosen;
    classInfo = readClass(school);
    writeSchool(school);
    mealChoice = null;
    loadDay();
  });
}

function chooseClass() {
  if (!supportsTimetable()) return;
  openClassPicker(app, {
    school, date, classInfo,
    chooseClass: (chosen) => {
      classInfo = chosen;
      writeClass(school, classInfo);
      paintControls();
      loadTimetable();
    },
  });
}

function settings() {
  openPreferences(app, {
    school, classInfo, supportsTimetable: supportsTimetable(), openSchool: chooseSchool, openClass: chooseClass,
    widget, hosted: Boolean(host), theme, largeText, defaultMeal, allergies, showNumbers,
    saveTheme: (next) => {
      theme = next;
      writeJSON(THEME_KEY, theme);
      applyTheme();
    },
    saveTextSize: (enabled) => {
      largeText = enabled;
      writeJSON(TEXT_SIZE_KEY, largeText);
      app.classList.toggle("large-text", largeText);
    },
    saveDefaultMeal: (code) => {
      defaultMeal = code;
      mealChoice = null;
      writeJSON(MEAL_KEY, code);
      paintMeals();
    },
    save: (numbers = showNumbers) => {
      showNumbers = numbers;
      writeJSON(ALLERGY_KEY, [...allergies]);
      writeJSON(NUMBERS_KEY, showNumbers);
      paintMeals();
    },
    forgetSchool: () => {
      if (classInfo) writeClass(school, null);
      school = null;
      classInfo = null;
      writeSchool(null);
      loadDay();
    },
  });
}

function selectDate(next) {
  if (date === next) return;
  date = next;
  loadDay();
}

async function loadPanel(panel, paint, load, cached = null, save) {
  panel.controller?.abort();
  const controller = new AbortController();
  panel.controller = controller;
  panel.data = cached;
  panel.status = load ? "loading" : "idle";
  paint();
  paintControls();
  if (!load) return;
  try {
    const data = await load(controller.signal);
    if (controller.signal.aborted) return;
    save(data);
    panel.data = data;
    panel.status = "ready";
  } catch (error) {
    if (controller.signal.aborted) return;
    panel.status = "error";
    panel.error = error.message;
  }
  paint();
  paintControls();
}

function loadTimetable() {
  const snapshot = [school, date, classInfo];
  if (!supportsTimetable() || !classInfo) return loadPanel(panels.timetable, paintTimetable);
  const [selectedSchool, selectedDate, selectedClass] = snapshot;
  return loadPanel(panels.timetable, paintTimetable,
    (signal) => fetchTimetable(selectedSchool, selectedClass, selectedDate, signal),
    readTimetableCache(...snapshot), (data) => writeTimetableCache(...snapshot, data));
}

function loadMeals() {
  if (!school) return loadPanel(panels.meals, paintMeals);
  const snapshot = [school, date];
  const [selectedSchool, selectedDate] = snapshot;
  return loadPanel(panels.meals, paintMeals, async (signal) => {
    const { rows } = await requestNeis("mealServiceDietInfo", {
      ATPT_OFCDC_SC_CODE: selectedSchool.officeCode,
      SD_SCHUL_CODE: selectedSchool.schoolCode,
      MLSV_YMD: ymdCompact(selectedDate),
    }, { signal });
    return normalizeMeals(rows);
  }, readMealCache(...snapshot), (data) => writeMealCache(...snapshot, data));
}

function loadDay() {
  paintDate();
  loadTimetable();
  loadMeals();
}

function updateToday() {
  const next = seoulToday();
  if (next === today) return false;
  const followToday = date === today;
  today = next;
  if (followToday) selectDate(next);
  else paintDate();
  return followToday;
}

if (app && (location.protocol !== "file:" || widget)) {
  applyTheme();
  if (typeof systemTheme.addEventListener === "function") systemTheme.addEventListener("change", applyTheme);
  else systemTheme.addListener(applyTheme);
  if (host) new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true, attributeFilter: ["data-theme"],
  });
  app.classList.toggle("large-text", largeText);
  build();
  loadDay();
  window.addEventListener("online", () => { if (!updateToday()) loadDay(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) updateToday(); });
  setInterval(updateToday, 60_000);
  const isNative = window.Capacitor?.isNativePlatform?.();
  if (!host && !widget && !isNative && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}
