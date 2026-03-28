import { useMemo } from "react";
import { MoveData } from "../types";
import { translateMoveName } from "../moveNames";
import { translateGuard, translateCancel } from "../translations";

interface Props {
  moves: MoveData[];
  search: string;
}

function frameClass(value: string): string {
  const num = parseInt(value);
  if (isNaN(num)) return "";
  if (num >= 3) return "adv-positive";
  if (num <= -3) return "adv-negative";
  return "adv-neutral";
}

export default function FrameTable({ moves, search }: Props) {
  const filtered = useMemo(() => {
    if (!search.trim()) return moves;
    const q = search.toLowerCase();
    return moves.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        translateMoveName(m.name).includes(q) ||
        m.startup.includes(q) ||
        m.on_hit.includes(q) ||
        m.on_block.includes(q)
    );
  }, [moves, search]);

  if (filtered.length === 0) {
    return <div className="status-msg">該当する技がありません</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="frame-table">
        <thead>
          <tr>
            <th className="col-name">技名</th>
            <th className="col-num">ダメージ</th>
            <th className="col-guard">ガード</th>
            <th className="col-num">発生</th>
            <th className="col-num">持続</th>
            <th className="col-num">硬直</th>
            <th className="col-adv">ヒット</th>
            <th className="col-adv">ガード</th>
            <th className="col-cancel">キャンセル</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((move, i) => (
            <tr key={i} className={i % 2 === 0 ? "row-even" : "row-odd"}>
              <td className="col-name">{translateMoveName(move.name)}</td>
              <td className="col-num">{move.damage}</td>
              <td className="col-guard">{translateGuard(move.guard)}</td>
              <td className="col-num">{move.startup}</td>
              <td className="col-num">{move.active}</td>
              <td className="col-num">{move.recovery}</td>
              <td className={`col-adv ${frameClass(move.on_hit)}`}>
                {move.on_hit}
              </td>
              <td className={`col-adv ${frameClass(move.on_block)}`}>
                {move.on_block}
              </td>
              <td className="col-cancel">{translateCancel(move.cancel)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
