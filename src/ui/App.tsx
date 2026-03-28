import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
// data-tauri-drag-region を JSX で使うための型拡張
declare module "react" {
  interface HTMLAttributes<T> {
    "data-tauri-drag-region"?: boolean;
  }
}
import { CharacterFrameData, CHARACTER_LIST } from "./types";
import Toolbar from "./components/Toolbar";
import FrameTable from "./components/FrameTable";
import UpdateModal from "./components/UpdateModal";
import { translateCategory } from "./translations";
import { loadFrameData, loadUpdateVersion } from "./updater";

// バンドル済みJSON（フォールバック用）
const bundledModules = import.meta.glob<{ default: CharacterFrameData }>(
  "../data/frames/*.json"
);

export default function App() {
  const [selectedChar, setSelectedChar] = useState("ryu");
  const [frameData, setFrameData] = useState<CharacterFrameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [alwaysOnTop, setAlwaysOnTop] = useState(true);
  const [opacity, setOpacity] = useState(0.95);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // 最終更新日時を読み込む
  useEffect(() => {
    loadUpdateVersion().then((v) => {
      if (v) setLastUpdated(v.updated_at);
    });
  }, []);

  // フレームデータ読み込み（ユーザーデータ優先）
  const loadData = useCallback(async (slug: string) => {
    setLoading(true);
    setActiveCategory(null);

    try {
      // 1. アプリデータフォルダを優先
      const userData = await loadFrameData(slug);
      if (userData) {
        setFrameData(userData);
        setActiveCategory(Object.keys(userData.categories)[0] ?? null);
        return;
      }

      // 2. バンドル済みJSONにフォールバック
      const key = `../data/frames/${slug}.json`;
      const loader = bundledModules[key];
      if (!loader) throw new Error(`No data for: ${slug}`);
      const mod = await loader();
      setFrameData(mod.default);
      setActiveCategory(Object.keys(mod.default.categories)[0] ?? null);
    } catch (e) {
      console.error("Failed to load frame data:", e);
      setFrameData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(selectedChar);
  }, [selectedChar, loadData]);

  // 常時最前面切替
  const handleAlwaysOnTop = useCallback(async (value: boolean) => {
    setAlwaysOnTop(value);
    try {
      await invoke("set_always_on_top", { value });
    } catch { /* dev環境では失敗することがある */ }
  }, []);

  // ウィンドウを閉じる
  const handleClose = useCallback(async () => {
    await getCurrentWindow().close();
  }, []);

  // 更新完了後の処理
  const handleUpdateComplete = useCallback((updatedSlugs: string[]) => {
    loadUpdateVersion().then((v) => {
      if (v) setLastUpdated(v.updated_at);
    });
    // 現在表示中のキャラが更新された場合は再読み込み
    if (updatedSlugs.includes(selectedChar)) {
      loadData(selectedChar);
    }
  }, [selectedChar, loadData]);

  const categories = frameData ? Object.keys(frameData.categories) : [];

  // 最終更新日時のフォーマット
  const updatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
    : null;

  return (
    <div className="app-container" style={{ opacity }}>
      {/* タイトルバー */}
      <div className="title-bar" data-tauri-drag-region>
        <span className="title-bar-text" data-tauri-drag-region>SF6 フレームビューア</span>
        <div className="title-bar-right">
          {updatedLabel && (
            <span className="update-date" data-tauri-drag-region>最終更新: {updatedLabel}</span>
          )}
          <button
            className="update-btn"
            title="フレームデータを最新版に更新"
            onClick={() => setShowUpdateModal(true)}
          >
            ↺ 更新
          </button>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>

      <Toolbar
        characters={CHARACTER_LIST}
        selectedChar={selectedChar}
        onCharChange={setSelectedChar}
        search={search}
        onSearchChange={setSearch}
        alwaysOnTop={alwaysOnTop}
        onAlwaysOnTopChange={handleAlwaysOnTop}
        opacity={opacity}
        onOpacityChange={setOpacity}
      />

      {/* カテゴリタブ */}
      {categories.length > 0 && (
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {translateCategory(cat)}
            </button>
          ))}
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="content-area">
        {loading && <div className="status-msg">読込中...</div>}
        {!loading && !frameData && (
          <div className="status-msg">データが見つかりません</div>
        )}
        {!loading && frameData && activeCategory && (
          <FrameTable
            moves={frameData.categories[activeCategory] ?? []}
            search={search}
          />
        )}
      </div>

      {/* 更新モーダル */}
      {showUpdateModal && (
        <UpdateModal
          onClose={() => setShowUpdateModal(false)}
          onComplete={handleUpdateComplete}
        />
      )}
    </div>
  );
}
