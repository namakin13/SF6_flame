import { fetch } from "@tauri-apps/plugin-http";
import { invoke } from "@tauri-apps/api/core";
import { CharacterFrameData, MoveData, CHARACTER_LIST } from "./types";

const BASE_URL = "https://ultimateframedata.com/sf6";
const DELAY_MS = 1500;

// ==================== HTML パーサー ====================

function getText(el: Element | null): string {
  if (!el) return "-";
  return el.textContent?.replace(/\s+/g, " ").trim() || "-";
}

function parseHtml(html: string, slug: string, nameJa: string): CharacterFrameData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const container = doc.getElementById("contentcontainer");

  const categories: Record<string, MoveData[]> = {};
  let currentCategory = "Special Moves";

  if (!container) {
    console.warn(`[${slug}] #contentcontainer not found`);
    return { character: slug, character_ja: nameJa, scraped_at: new Date().toISOString(), categories };
  }

  for (const child of Array.from(container.children)) {
    const tag = child.tagName.toLowerCase();

    if (tag === "h2") {
      currentCategory = child.textContent?.trim() ?? currentCategory;
      continue;
    }

    if (!child.classList.contains("moves")) continue;

    if (!categories[currentCategory]) categories[currentCategory] = [];

    for (const mc of Array.from(child.querySelectorAll(".movecontainer"))) {
      const name = getText(mc.querySelector(".movename"));
      if (!name || name === "-") continue;

      categories[currentCategory].push({
        name,
        damage:   getText(mc.querySelector(".basedamage")),
        guard:    getText(mc.querySelector(".attacktype")),
        startup:  getText(mc.querySelector(".startup")),
        active:   getText(mc.querySelector(".activeframes")),
        recovery: getText(mc.querySelector(".recovery")),
        on_hit:   getText(mc.querySelector(".onhit")),
        on_block: getText(mc.querySelector(".onblock")),
        cancel:   getText(mc.querySelector(".cancellable")),
        notes:    getText(mc.querySelector(".notes")),
      });
    }
  }

  return {
    character: slug,
    character_ja: nameJa,
    scraped_at: new Date().toISOString(),
    categories,
  };
}

// ==================== 1キャラ取得 ====================

export async function fetchCharacter(
  slug: string,
  nameJa: string
): Promise<CharacterFrameData> {
  const url = `${BASE_URL}/${slug}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  return parseHtml(html, slug, nameJa);
}

// ==================== 進捗コールバック ====================

export interface UpdateProgress {
  current: number;
  total: number;
  slug: string;
  nameJa: string;
  status: "running" | "ok" | "error";
  error?: string;
}

// ==================== 全キャラ更新 ====================

export async function updateAllCharacters(
  targets: typeof CHARACTER_LIST,
  onProgress: (p: UpdateProgress) => void,
  signal: AbortSignal
): Promise<{ success: string[]; failed: string[] }> {
  const success: string[] = [];
  const failed: string[] = [];

  for (let i = 0; i < targets.length; i++) {
    if (signal.aborted) break;

    const { slug, name_ja } = targets[i];
    onProgress({ current: i + 1, total: targets.length, slug, nameJa: name_ja, status: "running" });

    try {
      const data = await fetchCharacter(slug, name_ja);
      const json = JSON.stringify(data, null, 2);
      await invoke("save_frame_data", { slug, data: json });
      success.push(slug);
      onProgress({ current: i + 1, total: targets.length, slug, nameJa: name_ja, status: "ok" });
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      failed.push(slug);
      onProgress({ current: i + 1, total: targets.length, slug, nameJa: name_ja, status: "error", error });
    }

    if (i < targets.length - 1 && !signal.aborted) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  // バージョン情報を保存
  if (success.length > 0) {
    const version = {
      updated_at: new Date().toISOString(),
      characters: success,
    };
    await invoke("save_update_version", { data: JSON.stringify(version, null, 2) });
  }

  return { success, failed };
}

// ==================== ユーザーデータ優先のロード ====================

export async function loadFrameData(slug: string): Promise<CharacterFrameData | null> {
  try {
    // アプリデータフォルダを優先
    const userJson: string | null = await invoke("load_user_frame_data", { slug });
    if (userJson) {
      return JSON.parse(userJson) as CharacterFrameData;
    }
  } catch {
    // fallthrough to bundled data
  }
  return null;
}

export interface UpdateVersionInfo {
  updated_at: string;
  characters: string[];
}

export async function loadUpdateVersion(): Promise<UpdateVersionInfo | null> {
  try {
    const json: string | null = await invoke("load_update_version");
    if (json) return JSON.parse(json) as UpdateVersionInfo;
  } catch {
    // ignore
  }
  return null;
}
