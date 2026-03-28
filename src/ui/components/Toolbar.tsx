interface Props {
  characters: { slug: string; name_ja: string }[];
  selectedChar: string;
  onCharChange: (slug: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  alwaysOnTop: boolean;
  onAlwaysOnTopChange: (v: boolean) => void;
  opacity: number;
  onOpacityChange: (v: number) => void;
}

export default function Toolbar({
  characters,
  selectedChar,
  onCharChange,
  search,
  onSearchChange,
  alwaysOnTop,
  onAlwaysOnTopChange,
  opacity,
  onOpacityChange,
}: Props) {
  return (
    <div className="toolbar">
      {/* キャラクター選択 */}
      <select
        className="char-select"
        value={selectedChar}
        onChange={(e) => onCharChange(e.target.value)}
      >
        {characters.map(({ slug, name_ja }) => (
          <option key={slug} value={slug}>
            {name_ja}
          </option>
        ))}
      </select>

      {/* 技名検索 */}
      <input
        className="search-input"
        type="text"
        placeholder="技名検索..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="toolbar-right">
        {/* 常時前面トグル */}
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={alwaysOnTop}
            onChange={(e) => onAlwaysOnTopChange(e.target.checked)}
          />
          <span>前面固定</span>
        </label>

        {/* 透過度スライダー */}
        <label className="opacity-label">
          <span>透過</span>
          <input
            type="range"
            min={0.3}
            max={1}
            step={0.05}
            value={opacity}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
          />
          <span>{Math.round(opacity * 100)}%</span>
        </label>
      </div>
    </div>
  );
}
