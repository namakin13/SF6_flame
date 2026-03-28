import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

// ==================== 型定義 ====================

interface MoveData {
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

interface CharacterFrameData {
  character: string;
  character_ja: string;
  scraped_at: string;
  categories: {
    [category: string]: MoveData[];
  };
}

// ==================== キャラクター定義 ====================

const CHARACTERS: { slug: string; name_ja: string }[] = [
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
];

const BASE_URL = "https://ultimateframedata.com/sf6";
const OUTPUT_DIR = path.join(__dirname, "../src/data/frames");
const DELAY_MS = 2000;

// ==================== ユーティリティ ====================

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getText($el: cheerio.Cheerio<any>): string {
  return $el.text().replace(/\s+/g, " ").trim() || "-";
}

// ==================== パーサー ====================

function parsePage(html: string): { [category: string]: MoveData[] } {
  const $ = cheerio.load(html);
  const categories: { [category: string]: MoveData[] } = {};
  let currentCategory = "Unknown";

  // カテゴリ見出しと技コンテナを順番に処理
  $("#contentcontainer")
    .children()
    .each((_, el) => {
      const tag = $(el).prop("tagName")?.toLowerCase();

      // カテゴリ見出し
      if (tag === "h2") {
        currentCategory = $(el).text().trim();
        return;
      }

      // 技リストのコンテナ (div.moves)
      if ($(el).hasClass("moves")) {
        if (!categories[currentCategory]) {
          categories[currentCategory] = [];
        }

        $(el)
          .find(".movecontainer")
          .each((_, container) => {
            const c = $(container);

            const move: MoveData = {
              name: getText(c.find(".movename")),
              damage: getText(c.find(".basedamage")),
              guard: getText(c.find(".attacktype")),
              startup: getText(c.find(".startup")),
              active: getText(c.find(".activeframes")),
              recovery: getText(c.find(".recovery")),
              on_hit: getText(c.find(".onhit")),
              on_block: getText(c.find(".onblock")),
              cancel: getText(c.find(".cancellable")),
              notes: getText(c.find(".notes")),
            };

            // 技名が取れたものだけ追加
            if (move.name && move.name !== "-") {
              categories[currentCategory].push(move);
            }
          });
      }
    });

  return categories;
}

// ==================== スクレイパー本体 ====================

async function scrapeCharacter(
  slug: string,
  name_ja: string
): Promise<CharacterFrameData | null> {
  const url = `${BASE_URL}/${slug}`;

  try {
    console.log(`  Fetching: ${url}`);
    const response = await axios.get<string>(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      timeout: 15000,
    });

    const categories = parsePage(response.data);
    const totalMoves = Object.values(categories).reduce(
      (sum, moves) => sum + moves.length,
      0
    );

    if (totalMoves === 0) {
      console.warn(`  WARNING: No moves found for ${slug}`);
    } else {
      console.log(
        `  OK: ${totalMoves} moves / ${Object.keys(categories).length} categories`
      );
    }

    return {
      character: slug,
      character_ja: name_ja,
      scraped_at: new Date().toISOString(),
      categories,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(`  ERROR ${err.response?.status ?? "network"}: ${slug}`);
    } else {
      console.error(`  ERROR: ${slug} - ${String(err)}`);
    }
    return null;
  }
}

async function main() {
  console.log("=== SF6 Frame Data Scraper ===\n");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 引数でキャラクター絞り込み
  const targetSlug = process.argv[2];
  const targets = targetSlug
    ? CHARACTERS.filter((c) => c.slug.toLowerCase() === targetSlug.toLowerCase())
    : CHARACTERS;

  if (targets.length === 0) {
    console.error(`Character not found: ${targetSlug}`);
    console.log("Available:", CHARACTERS.map((c) => c.slug).join(", "));
    process.exit(1);
  }

  const results = { success: [] as string[], failed: [] as string[] };

  for (let i = 0; i < targets.length; i++) {
    const { slug, name_ja } = targets[i];
    console.log(`[${i + 1}/${targets.length}] ${slug} (${name_ja})`);

    const data = await scrapeCharacter(slug, name_ja);

    if (data) {
      const filename = path.join(OUTPUT_DIR, `${slug}.json`);
      fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
      results.success.push(slug);
    } else {
      results.failed.push(slug);
    }

    if (i < targets.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log("\n=== 完了 ===");
  console.log(`成功: ${results.success.length} キャラ`);
  if (results.failed.length > 0) {
    console.log(`失敗: ${results.failed.join(", ")}`);
  }

  // バージョンファイル
  const versionFile = path.join(OUTPUT_DIR, "_version.json");
  fs.writeFileSync(
    versionFile,
    JSON.stringify(
      {
        scraped_at: new Date().toISOString(),
        source: BASE_URL,
        characters: results.success,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log(`\nデータ保存先: ${OUTPUT_DIR}`);
}

main().catch(console.error);
