export interface MoveData {
  name: string;
  damage: string;
  guard: string;
  startup: string;
  active: string;
  recovery: string;
  on_hit: string;
  on_block: string;
  cancel: string;
  notes: string;
}

export interface CharacterFrameData {
  character: string;
  character_ja: string;
  scraped_at: string;
  categories: {
    [category: string]: MoveData[];
  };
}

export const CHARACTER_LIST: { slug: string; name_ja: string }[] = [
  { slug: "ryu", name_ja: "リュウ" },
  { slug: "ken", name_ja: "ケン" },
  { slug: "chunli", name_ja: "春麗" },
  { slug: "blanka", name_ja: "ブランカ" },
  { slug: "guile", name_ja: "ガイル" },
  { slug: "dhalsim", name_ja: "ダルシム" },
  { slug: "ehonda", name_ja: "E・本田" },
  { slug: "zangief", name_ja: "ザンギエフ" },
  { slug: "cammy", name_ja: "キャミィ" },
  { slug: "deejay", name_ja: "ディージェイ" },
  { slug: "juri", name_ja: "ジュリ" },
  { slug: "luke", name_ja: "ルーク" },
  { slug: "jamie", name_ja: "ジェイミー" },
  { slug: "jp", name_ja: "JP" },
  { slug: "kimberly", name_ja: "キンバリー" },
  { slug: "lily", name_ja: "リリー" },
  { slug: "manon", name_ja: "マノン" },
  { slug: "marisa", name_ja: "マリーザ" },
  { slug: "rashid", name_ja: "ラシード" },
  { slug: "aki", name_ja: "A.K.I." },
  { slug: "ed", name_ja: "エド" },
  { slug: "akuma", name_ja: "豪鬼" },
  { slug: "mbison", name_ja: "M・バイソン" },
  { slug: "terry", name_ja: "テリー" },
  { slug: "mai", name_ja: "舞" },
  { slug: "elena", name_ja: "エレナ" },
  { slug: "sagat", name_ja: "サガット" },
  { slug: "cviper", name_ja: "C.バイパー" },
  { slug: "alex", name_ja: "アレックス" },
];
