const timetableApi = "https://hyot-today-class-api.reliableplover2.chatgpt.site/";

export async function requestNeis(service, params, { signal, page = 1 } = {}) {
  // The public NEIS endpoint returns up to five sample rows and ignores pagination without a key.
  const useProxy = service !== "mealServiceDietInfo";
  const url = new URL(service, useProxy ? timetableApi : "https://open.neis.go.kr/hub/");
  url.searchParams.set("pIndex", String(page));
  if (!useProxy) {
    url.searchParams.set("Type", "json");
    url.searchParams.set("pSize", "5");
  }
  for (const [name, value] of Object.entries(params)) {
    if (value) url.searchParams.set(name, value);
  }

  const controller = new AbortController();
  const cancel = () => controller.abort();
  if (signal?.aborted) cancel();
  else signal?.addEventListener("abort", cancel, { once: true });
  const timeout = setTimeout(cancel, 12_000);
  try {
    const { status, data } = await fetchData(url, controller.signal, useProxy);
    if (controller.signal.aborted) throw new DOMException("Aborted", "AbortError");
    if (status < 200 || status >= 300) throw new Error("나이스 서버가 응답하지 않습니다.");
    return unpack(data, service);
  } catch (error) {
    if (signal?.aborted) throw error;
    if (controller.signal.aborted) throw new Error("응답이 지연되고 있습니다. 다시 시도해 주세요.");
    if (error instanceof TypeError) throw new Error("인터넷 연결을 확인해 주세요.");
    if (error instanceof SyntaxError) throw new Error("나이스 응답을 읽을 수 없습니다.");
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", cancel);
  }
}

async function fetchData(url, signal, useProxy) {
  if (useProxy && window.widget) return window.widget.getSchoolData(url.href);
  const nativeHttp = window.Capacitor?.Plugins?.CapacitorHttp;
  if (useProxy && nativeHttp && window.Capacitor.isNativePlatform()) {
    return nativeHttp.get({ url: url.href, connectTimeout: 12_000, readTimeout: 12_000, responseType: "json" });
  }
  const response = await fetch(url, { signal });
  return { status: response.status, data: response.ok ? await response.json() : null };
}

function unpack(json, service) {
  const block = json?.[service];
  const header = block?.[0]?.head || [];
  const result = json?.RESULT || header.find((item) => item.RESULT)?.RESULT;
  if (result?.CODE === "INFO-200") return { rows: [], total: 0 };
  if (result && result.CODE !== "INFO-000") {
    const message = result.MESSAGE || "";
    throw new Error(/인증|KEY|키/.test(message) ? "잠시 후 다시 시도해 주세요." : message || "정보를 불러올 수 없습니다.");
  }
  if (!Array.isArray(block) || !Array.isArray(block[1]?.row)) {
    throw new Error("나이스 응답을 읽을 수 없습니다.");
  }
  const rows = block[1].row;
  const total = header.find((item) => item.list_total_count != null)?.list_total_count;
  return { rows, total: Number(total) || rows.length };
}
