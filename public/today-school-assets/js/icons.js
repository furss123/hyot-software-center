const strokes = {
  school: '<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-5h6v5M12 4V2m0 0h4M9 10v2m6-2v2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2"/>',
  book: '<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M8 3v18M3 7h3m-3 5h3m-3 5h3m6-10h4m-4 4h4"/>',
  meal: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M12 5v14m0-7h9m-15 0h3"/>',
  gear: '<path d="m10 3-.6 2.5-2 .9L5 5.6l-1.7 3 1.8 1.7v2.4l-1.8 1.7 1.7 3 2.4-.8 2 .9.6 2.5h4l.6-2.5 2-.9 2.4.8 1.7-3-1.8-1.7v-2.4l1.8-1.7-1.7-3-2.4.8-2-.9L14 3z"/><circle cx="12" cy="11.5" r="2.6"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.1 6.4M20 4v7h-7"/>',
  search: '<circle cx="10.7" cy="10.7" r="5.7"/><path d="m15 15 5 5"/>',
  left: '<path d="m14.5 6-6 6 6 6"/>',
  right: '<path d="m9.5 6 6 6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  external: '<path d="M13 5h6v6m0-6-9 9m-2-7H5v12h12v-3"/>',
  warning: '<path d="M10.5 4.6 3.2 17.3A1.8 1.8 0 0 0 4.8 20h14.4a1.8 1.8 0 0 0 1.6-2.7L13.5 4.6a1.7 1.7 0 0 0-3 0Z"/><path d="M12 10v3m0 3h.01"/>',
  pin: '<path d="m15 3 6 6-2.3.7-2.7 3.1.3 3.1-1.4 1.4-8.2-8.2 1.4-1.4 3.1.3 3.1-2.7L15 3Zm-4 10-6 6"/>',
  hide: '<path d="M5 12h14"/>',
};

export function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.75");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.classList.add("ico");
  svg.innerHTML = strokes[name];
  return svg;
}
