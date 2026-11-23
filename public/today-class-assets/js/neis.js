export async function requestNeis(service, params, { signal, page = 1 } = {}) {
  const url = new URL(service, "https://hyot-today-class-api.reliableplover2.chatgpt.site/");
  url.searchParams.set("pIndex", String(page));
  for (const [name, value] of Object.entries(params)) {
    if (value) url.searchParams.set(name, value);
  }

  const controller = new AbortController();
  const cancel = () => controller.abort();
  if (signal?.aborted) cancel();
  else signal?.addEventListener("abort", cancel, { once: true });
  const timeout = setTimeout(cancel, 12_000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("시간표 서버가 응답하지 않았어요");
    return unpack(await response.json(), service);
  } catch (error) {
    if (signal?.aborted) throw error;
    if (controller.signal.aborted) throw new Error("응답이 너무 늦어요. 다시 시도해 주세요");
    if (error instanceof TypeError) throw new Error("네트워크 연결을 확인해 주세요");
    if (error instanceof SyntaxError) throw new Error("시간표 서버 응답을 읽지 못했어요");
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", cancel);
  }
}

function unpack(json, service) {
  const block = json?.[service];
  const header = block?.[0]?.head || [];
  const result = json?.RESULT || header.find((item) => item.RESULT)?.RESULT;
  if (result?.CODE === "INFO-200") return { rows: [], total: 0 };
  if (result && result.CODE !== "INFO-000") {
    const message = result.MESSAGE || "";
    throw new Error(/인증|KEY|키/.test(message) ? "잠시 후 다시 시도해 주세요" : message || "불러오지 못했어요");
  }
  if (!Array.isArray(block) || !Array.isArray(block[1]?.row)) {
    throw new Error("시간표 서버 응답을 읽지 못했어요");
  }
  const rows = block[1].row;
  const total = header.find((item) => item.list_total_count != null)?.list_total_count;
  return { rows, total: Number(total) || rows.length };
}
