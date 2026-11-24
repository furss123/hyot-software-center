import { button, h, iconButton, showDialog } from "./dom.js";
import { icon } from "./icons.js";
import { ALLERGENS, MEAL_META, REGIONS, kindShort, toSchool } from "./meal.js";
import { requestNeis } from "./neis.js";
import { classLabel, fetchClassList } from "./timetable.js";

export function openSchoolSearch(mount, chooseSchool) {
  showDialog(mount, "학교 찾기", (body, close, signal) => {
    const input = h("input", {
      type: "text", placeholder: "학교 이름 입력", autocomplete: "off", maxlength: "60",
      enterkeyhint: "search", "aria-label": "학교 이름",
    });
    const region = h("select", { "aria-label": "지역" }, REGIONS.map(({ code, name }) =>
      h("option", { value: code, text: code ? name : "전체 지역" })));
    const clear = iconButton("검색어 지우기", "close", () => {
      input.value = "";
      queueSearch();
      input.focus();
    });
    clear.hidden = true;
    const results = h("div", { class: "search-results" });
    const status = h("p", { class: "muted search-status", role: "status", text: "학교 이름을 두 글자 이상 입력하세요." });
    const list = h("ul", { class: "school-results" });
    const pagination = h("div", { class: "pagination" });
    results.append(status, list, pagination);

    let debounce;
    let pending;
    let composing = false;
    let shown = 0;

    function resetSearch() {
      clearTimeout(debounce);
      pending?.abort();
      shown = 0;
      list.replaceChildren();
      pagination.replaceChildren();
    }

    function queueSearch() {
      resetSearch();
      clear.hidden = !input.value;
      if (input.value.trim().length < 2) {
        status.textContent = "학교 이름을 두 글자 이상 입력하세요.";
        return;
      }
      status.textContent = "학교를 찾는 중입니다.";
      debounce = setTimeout(() => search(1), 250);
    }

    async function search(page) {
      if (page === 1) resetSearch();
      const query = input.value.trim();
      if (query.length < 2 || signal.aborted) return;
      pending?.abort();
      const controller = new AbortController();
      pending = controller;
      const more = pagination.firstElementChild;
      if (more) more.disabled = true;
      status.textContent = "학교를 찾는 중입니다.";
      try {
        const { rows, total } = await requestNeis("schoolInfo", {
          SCHUL_NM: query,
          ATPT_OFCDC_SC_CODE: region.value,
        }, { signal: controller.signal, page });
        if (controller.signal.aborted) return;
        const schools = rows.filter((row) => row.SD_SCHUL_CODE && row.ATPT_OFCDC_SC_CODE && row.SCHUL_NM)
          .map(toSchool)
          .sort((a, b) => Number(b.name === query) - Number(a.name === query) || a.name.localeCompare(b.name, "ko"));
        const items = schools.map((school) => h("li", {}, button(school.name, () => {
          close();
          chooseSchool(school);
        }, [
          h("span", { class: "school-kind", text: kindShort(school.kind) }),
          h("span", { class: "school-result-copy" }, [
            h("strong", { text: school.name }),
            h("small", { text: school.address || school.region || school.kind }),
          ]),
          icon("right"),
        ], { class: "school-result" })));
        list.append(...items);
        shown += rows.length;
        status.textContent = shown ? `검색 결과 ${total}개` : "일치하는 학교가 없습니다.";
        pagination.replaceChildren();
        if (rows.length && shown < total) {
          pagination.append(button("더 보기", () => search(page + 1), "더 보기", { class: "secondary" }));
        }
        if (page > 1 && items.length) items[0].querySelector("button").focus();
      } catch (error) {
        if (controller.signal.aborted) return;
        status.textContent = error.message;
        pagination.replaceChildren(button("다시 시도", () => search(page), "다시 시도", { class: "secondary" }));
      }
    }

    input.addEventListener("compositionstart", () => { composing = true; });
    input.addEventListener("compositionend", () => {
      composing = false;
      queueSearch();
    });
    input.addEventListener("input", () => { if (!composing) queueSearch(); });
    region.addEventListener("change", queueSearch);
    signal.addEventListener("abort", resetSearch, { once: true });
    body.append(h("form", {
      class: "search-form",
      onsubmit: (event) => {
        event.preventDefault();
        if (!composing) search(1);
      },
    }, [h("div", { class: "search-field" }, [icon("search"), input, clear]), region]), results);
    return input;
  });
}

export function openClassPicker(mount, { school, date, classInfo, chooseClass }) {
  showDialog(mount, "학년·반 선택", (body, close, signal) => {
    const options = h("div", { class: "class-options" });
    const status = h("p", { class: "muted", role: "status" });
    body.append(h("p", { class: "dialog-school", text: school.name }), status, options);
    let currentGrade = classInfo?.grade;

    async function load() {
      status.textContent = "학급을 불러오는 중입니다.";
      options.replaceChildren();
      try {
        const grades = await fetchClassList(school, date, signal);
        if (signal.aborted) return;
        if (!grades.length) {
          status.textContent = "공개된 학급 정보가 없습니다.";
          return;
        }
        status.textContent = "";
        if (!grades.some(({ grade }) => grade === currentGrade)) currentGrade = grades[0].grade;
        const gradeButtons = h("div", { class: "chip-grid", role: "group", "aria-label": "학년" });
        const classes = h("div", { class: "chip-grid", role: "group", "aria-label": "반" });
        const paintClasses = () => {
          for (const item of gradeButtons.children) {
            item.setAttribute("aria-pressed", String(item.dataset.grade === currentGrade));
          }
          classes.replaceChildren(...grades.find(({ grade }) => grade === currentGrade).classes.map((classNm) =>
            button(`${classNm}반`, () => {
              chooseClass({ grade: currentGrade, classNm });
              close();
            }, `${classNm}반`, {
              class: "chip",
              "aria-pressed": String(classInfo?.grade === currentGrade && classInfo.classNm === classNm),
            })));
        };
        gradeButtons.append(...grades.map(({ grade }) => button(`${grade}학년`, () => {
          currentGrade = grade;
          paintClasses();
        }, `${grade}학년`, { class: "chip", "data-grade": grade })));
        options.append(h("p", { class: "field-label", text: "학년" }), gradeButtons,
          h("p", { class: "field-label", text: "반" }), classes);
        paintClasses();
      } catch (error) {
        if (signal.aborted) return;
        status.textContent = error.message;
        options.append(button("다시 시도", load, "다시 시도", { class: "secondary" }));
      }
    }
    load();
  });
}

function settingsSection(title, children) {
  return h("section", { class: "settings-section" }, [h("h3", { text: title }), ...children]);
}

function settingSwitch(label, checked, change) {
  const input = h("input", {
    type: "checkbox", class: "switch", role: "switch", checked,
    onchange: (event) => change(event.currentTarget.checked),
  });
  const row = h("label", { class: "setting-row" }, [
    h("span", { text: label }),
    h("span", { class: "switch-control" }, [input, h("span", { class: "switch-track", "aria-hidden": "true" })]),
  ]);
  return { row, input };
}

function windowsSettings(widget, signal) {
  const status = h("p", { class: "muted settings-status", role: "status", text: "Windows 설정을 불러오는 중입니다." });
  const options = [
    ["autoStart", "Windows 로그인 시 자동 시작"],
    ["alwaysOnTop", "항상 위에 표시"],
  ].map(([key, label]) => {
    const { row, input } = settingSwitch(label, false, async (enabled) => {
      input.disabled = true;
      status.textContent = "";
      try {
        const settings = await widget.setPreference(key, enabled);
        paint(settings);
        if (settings[key] !== enabled) status.textContent = "변경 사항을 적용하지 못했습니다.";
      } catch {
        input.checked = !enabled;
        status.textContent = "Windows 설정을 변경하지 못했습니다.";
      } finally {
        input.disabled = false;
      }
    });
    row.hidden = true;
    return { key, row, input };
  });

  function paint(settings) {
    if (signal.aborted) return;
    for (const { key, row, input } of options) {
      row.hidden = typeof settings[key] !== "boolean";
      input.checked = settings[key] === true;
    }
  }

  const unsubscribe = widget.onPreferencesChanged(paint);
  signal.addEventListener("abort", unsubscribe, { once: true });
  widget.getPreferences().then((settings) => {
    paint(settings);
    status.textContent = "";
  }).catch(() => { status.textContent = "Windows 설정을 불러오지 못했습니다."; });
  return settingsSection("Windows 위젯", [...options.map(({ row }) => row), status]);
}

export function openPreferences(mount, preferences) {
  const {
    school, classInfo, supportsTimetable, openSchool, openClass, forgetSchool, allergies, showNumbers, save,
    widget, hosted, theme, largeText, defaultMeal, saveTheme, saveTextSize, saveDefaultMeal,
  } = preferences;
  showDialog(mount, "설정", (body, close, signal) => {
    body.classList.add("settings-body");
    const themeOptions = h("fieldset", { class: "theme-options" }, [
      h("legend", { text: "화면 테마" }),
      h("div", { class: "theme-segments" }, [
        ["system", hosted ? "홈페이지 설정" : "시스템 설정"],
        ["light", "라이트"],
        ["dark", "다크"],
      ].map(([value, label]) => h("label", {}, [
        h("input", {
          type: "radio", name: "theme", value, checked: theme === value,
          onchange: (event) => { if (event.currentTarget.checked) saveTheme(value); },
        }),
        h("span", { text: label }),
      ]))),
    ]);
    const schoolActions = [
      button("학교", () => { close(); openSchool(); }, [
        h("span", { text: school ? "학교 변경" : "학교 등록" }),
        h("span", { class: "muted", text: school?.name || "" }),
        icon("right"),
      ], { class: "setting-row" }),
      supportsTimetable ? button("학년·반", () => { close(); openClass(); }, [
        h("span", { text: "학년·반" }),
        h("span", { class: "muted", text: classInfo ? classLabel(classInfo) : "선택" }),
        icon("right"),
      ], { class: "setting-row" }) : null,
    ];
    const meal = h("select", {
      onchange: (event) => saveDefaultMeal(event.currentTarget.value),
    }, [
      { code: "auto", label: "자동 (중식 우선)" }, ...MEAL_META,
    ].map(({ code, label }) => h("option", { value: code, selected: code === defaultMeal, text: label })));
    const group = h("div", { class: "chip-grid", role: "group", "aria-label": "알레르기 재료" });
    for (const [number, name] of ALLERGENS) {
      group.append(button(name, (event) => {
        if (allergies.has(number)) allergies.delete(number);
        else allergies.add(number);
        event.currentTarget.setAttribute("aria-pressed", String(allergies.has(number)));
        save();
      }, name, { class: "chip", "aria-pressed": String(allergies.has(number)) }));
    }
    const clear = button("선택 지우기", () => {
      allergies.clear();
      for (const item of group.children) item.setAttribute("aria-pressed", "false");
      save();
    }, "선택 지우기", { class: "text-button" });
    body.append(settingsSection("보기", [themeOptions, settingSwitch("시간표·급식 글자 크게", largeText, saveTextSize).row]));
    if (widget) body.append(windowsSettings(widget, signal));
    body.append(settingsSection("학교", schoolActions), settingsSection("급식", [
      h("label", { class: "setting-row" }, [h("span", { text: "먼저 볼 급식" }), meal]),
      settingSwitch("알레르기 번호 표시", showNumbers, save).row,
      h("div", { class: "settings-heading" }, [h("h4", { text: "알레르기 재료" }), clear]),
      h("p", { class: "muted", text: "선택한 재료가 포함된 메뉴에 재료 이름을 표시합니다." }),
      group,
    ]));
    if (school) body.append(button("학교 등록 지우기", () => {
      close();
      showDialog(mount, "학교 등록 지우기", (confirmation, dismiss) => {
        confirmation.append(h("p", { class: "muted", text: `${school.name} 학교 및 학년·반 설정을 지웁니다.` }),
          h("div", { class: "dialog-actions" }, [
            button("취소", dismiss, "취소", { class: "secondary" }),
            button("지우기", () => { forgetSchool(); dismiss(); }, "지우기", { class: "danger-button" }),
          ]));
      });
    }, "학교 등록 지우기", { class: "text-button remove-school" }));
  });
}
