import { useState, useRef, useCallback } from "react";
import { CHARACTER_LIST } from "../types";
import { updateAllCharacters, UpdateProgress } from "../updater";

interface Props {
  onClose: () => void;
  onComplete: (updatedSlugs: string[]) => void;
}

type PhaseState = "idle" | "running" | "done";

interface CharProgress {
  status: "waiting" | "running" | "ok" | "error";
  error?: string;
}

export default function UpdateModal({ onClose, onComplete }: Props) {
  const [phase, setPhase] = useState<PhaseState>("idle");
  const [current, setCurrent] = useState(0);
  const [total] = useState(CHARACTER_LIST.length);
  const [charMap, setCharMap] = useState<Record<string, CharProgress>>({});
  const [successCount, setSuccessCount] = useState(0);
  const [failedSlugs, setFailedSlugs] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  const handleStart = useCallback(async () => {
    setPhase("running");
    setCurrent(0);
    setCharMap({});
    setSuccessCount(0);
    setFailedSlugs([]);

    const ac = new AbortController();
    abortRef.current = ac;

    const onProgress = (p: UpdateProgress) => {
      setCurrent(p.current);
      setCharMap((prev) => ({
        ...prev,
        [p.slug]: { status: p.status === "running" ? "running" : p.status === "ok" ? "ok" : "error", error: p.error },
      }));
      setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    const { success, failed } = await updateAllCharacters(CHARACTER_LIST, onProgress, ac.signal);
    setSuccessCount(success.length);
    setFailedSlugs(failed);
    setPhase("done");
  }, []);

  const handleAbort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleClose = useCallback(() => {
    if (phase === "done" && successCount > 0) {
      const updated = CHARACTER_LIST.filter((c) => charMap[c.slug]?.status === "ok").map((c) => c.slug);
      onComplete(updated);
    }
    onClose();
  }, [phase, successCount, charMap, onComplete, onClose]);

  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <span>フレームデータ更新</span>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        {phase === "idle" && (
          <div className="modal-body">
            <p className="modal-desc">
              ultimateframedata.com から全26キャラの最新フレームデータを取得します。<br />
              完了までに約1分かかります。
            </p>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleStart}>更新開始</button>
              <button className="btn-secondary" onClick={onClose}>キャンセル</button>
            </div>
          </div>
        )}

        {(phase === "running" || phase === "done") && (
          <div className="modal-body">
            {/* プログレスバー */}
            <div className="progress-wrap">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-label">
                {phase === "done"
                  ? `完了 (成功 ${successCount} / ${total})`
                  : `${current} / ${total} キャラ取得中...`}
              </span>
            </div>

            {/* キャラ別ログ */}
            <div className="char-log">
              {CHARACTER_LIST.map(({ slug, name_ja }) => {
                const s = charMap[slug];
                if (!s) return null;
                return (
                  <div key={slug} className={`char-log-row status-${s.status}`}>
                    <span className="char-log-icon">
                      {s.status === "running" && "⟳"}
                      {s.status === "ok" && "✓"}
                      {s.status === "error" && "✗"}
                    </span>
                    <span className="char-log-name">{name_ja}</span>
                    {s.error && <span className="char-log-err">{s.error}</span>}
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>

            {/* 失敗一覧 */}
            {phase === "done" && failedSlugs.length > 0 && (
              <p className="modal-warn">
                失敗: {failedSlugs.join(", ")}
              </p>
            )}

            <div className="modal-actions">
              {phase === "running" && (
                <button className="btn-secondary" onClick={handleAbort}>中断</button>
              )}
              {phase === "done" && (
                <button className="btn-primary" onClick={handleClose}>
                  {successCount > 0 ? "適用して閉じる" : "閉じる"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
