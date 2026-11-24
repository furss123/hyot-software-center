import { icon } from "./icons.js";

export function h(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "text") node.textContent = String(value);
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? "" : String(value));
  }
  for (const child of Array.isArray(children) ? children : [children]) {
    if (child != null && child !== false) node.append(child instanceof Node ? child : String(child));
  }
  return node;
}

export function button(label, onclick, children = label, attrs = {}) {
  return h("button", { type: "button", onclick, ...attrs }, children);
}

export function iconButton(label, name, onclick) {
  return button(label, onclick, icon(name), { class: "icon-button", "aria-label": label, title: label });
}

export function showDialog(mount, title, render) {
  const heading = h("h2", { text: title });
  const body = h("div", { class: "dialog-body" });
  const controller = new AbortController();
  const dialog = h("dialog", { class: "dialog", "aria-label": title });
  const close = () => dialog.close();
  dialog.append(h("header", { class: "dialog-header" }, [heading, iconButton("닫기", "close", close)]), body);
  dialog.addEventListener("close", () => {
    controller.abort();
    dialog.remove();
  }, { once: true });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) close();
  });
  mount.append(dialog);
  const focus = render(body, close, controller.signal);
  dialog.showModal();
  focus?.focus();
}
