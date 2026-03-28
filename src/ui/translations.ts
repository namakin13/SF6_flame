// ==================== カテゴリ名 ====================

export const CATEGORY_MAP: Record<string, string> = {
  "Normal Attacks": "通常技",
  "Unique Attacks": "特殊技",
  "Target Combos": "ターゲットコンボ",
  "Jump Attacks": "空中技",
  "Special Moves": "必殺技",
  "Super Arts": "スーパーアーツ",
  "Misc.": "その他",
};

export function translateCategory(name: string): string {
  return CATEGORY_MAP[name] ?? name;
}

// ==================== ガードタイプ ====================

// 複合値の全文一致（括弧・記号混じりで分割できないケース）
const GUARD_FULL_MAP: Record<string, string> = {
  "-- (High)": "ガード不能(上段)",
  "High (High) (Parry)": "上段(パリィ可)",
  "High [High]": "上段",
  "Overhead (Overhead)": "頭上段",
  "Overhead [Overhead, High]": "頭上段・上段",
  "Low, Low(High on block)": "下段・下段(ガード時上段)",
  "(Low, Low), High, Drink": "下段・下段・上段・飲み",
  "Overhead, (High, High), Drink": "頭上段・上段・上段・飲み",
};

// トークン単位の変換
const GUARD_MAP: Record<string, string> = {
  "High": "上段",
  "Low": "下段",
  "Overhead": "頭上段",
  "Throw": "投げ",
  "Hit Throw": "打撃投げ",
  "Throw + High": "投げ・上段",
  "Throw + Hit": "打撃投げ",
  "Parry": "パリィ",
  "Unblockable": "ガード不能",
  "Stance": "構え",
  "Drink": "飲み",
  "-": "-",
  "--": "-",
};

export function translateGuard(value: string): string {
  if (!value || value === "-" || value === "--") return "-";
  // 全文一致を優先（括弧内コンマなど分割できないケース）
  if (GUARD_FULL_MAP[value]) return GUARD_FULL_MAP[value];
  // コンマ区切りで分割して各トークンを変換
  return value
    .split(", ")
    .map((v) => GUARD_MAP[v.trim()] ?? v.trim())
    .join("・");
}

// ==================== キャンセル ====================

// 複合値の全文一致（多段ヒット条件・説明文など）
const CANCEL_FULL_MAP: Record<string, string> = {
  "-- (Hold: Super)": "-(長押し:SA)",
  "Aerial Tatsumaki Senpu-kyaku": "空中竜巻旋風脚",
  "Kill Rush (Forward Only)": "キルラッシュ(前入力のみ)",
  "Jump (Hit only)": "J(ヒット時)",
  "Jump (on hit only)": "J(ヒット時)",
  "If Sumo Spirit buff is active, can cancel into Hundred Hand Slap.": "スモウスピリット時:百貫張り手",
  "Second hit can be canceled into Denjin Charge.": "2段目:電刃チャージ",
  "Third hit can be canceled into Denjin Charge.": "3段目:電刃チャージ",
  "Close: Special, Super Middle: Special, Super": "近距離:必殺・SA / 中距離:必殺・SA",
  "Early Frames: Special, Super": "序盤F:必殺・SA",
  "Frames 9-10: Special, Super": "9-10F:必殺・SA",
  "First Hit: -- Second Hit: Special, Super": "1段目:- / 2段目:必殺・SA",
  "First Hit: Special, Super": "1段目:必殺・SA",
  "First Hit: Special, Super Second Hit: --": "1段目:必殺・SA / 2段目:-",
  "First Hit: Special, Super Second Hit: FSE Special, FSE Super": "1段目:必殺・SA / 2段目:FSE必殺・FSE SA",
  "First Hit: Special, Super, Target Combo / Second Hit: Special, Super": "1段目:必殺・SA・TC / 2段目:必殺・SA",
  "First Hit: Target Combo / Second Hit: --": "1段目:TC / 2段目:-",
  "First Hit: Target Combo / Second Hit: Special, Super": "1段目:TC / 2段目:必殺・SA",
  "First Hit: Target Combo / Second Hit: Target Combo / Third Hit: --": "1段目:TC / 2段目:TC / 3段目:-",
  "Second Hit Only: Special, Super": "2段目のみ:必殺・SA",
  "Second Hit: Special, Super": "2段目:必殺・SA",
  "Second Hit: Super": "2段目:SA",
  "Second hit: Special, Super": "2段目:必殺・SA",
  "Second hit: Special, Super, Serenity Stream": "2段目:必殺・SA・セレニティストリーム",
  "Special, Special": "必殺・必殺",
  "Special, Super (second and third hits)": "必殺・SA(2・3段目)",
  "Special, Super, Jump (on hit only)": "必殺・SA・J(ヒット時)",
  "Special, Super, [Target Combo]": "必殺・SA・TC",
  "Super, [Target Combo]": "SA・TC",
  "Target Combo, Special (Second hit)": "TC・必殺(2段目)",
  "Third Hit: Special, Super": "3段目:必殺・SA",
  "[Target Combo]": "TC",
};

// トークン単位の変換
const CANCEL_PARTS: Record<string, string> = {
  "Chain": "連打",
  "Special": "必殺",
  "Super": "SA",
  "Target Combo": "TC",
  "Drive Rush": "DR",
  "Drive Rush Cancel": "DRC",
  "Jump": "J",
  "Jump Attacks": "空中技",
  "FSE Special": "FSE必殺",
  "FSE Super": "FSE SA",
  "Serenity Stream": "セレニティストリーム",
  "[Target Combo]": "TC",
};

export function translateCancel(value: string): string {
  if (!value || value === "-" || value === "--") return "-";
  // 全文一致を優先（多段ヒット条件・説明文など）
  if (CANCEL_FULL_MAP[value]) return CANCEL_FULL_MAP[value];
  // コンマ区切りで分割して各トークンを変換
  return value
    .split(", ")
    .map((v) => CANCEL_PARTS[v.trim()] ?? v.trim())
    .join("・");
}
