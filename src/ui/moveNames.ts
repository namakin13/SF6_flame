/**
 * SF6 技名 英語 → 日本語 変換
 */

// ==================== 共通通常技パターン ====================

const NORMAL_MAP: Record<string, string> = {
  "Standing Light Punch": "立弱P",
  "Standing Medium Punch": "立中P",
  "Standing Heavy Punch": "立強P",
  "Standing Light Kick": "立弱K",
  "Standing Medium Kick": "立中K",
  "Standing Heavy Kick": "立強K",
  "Crouching Light Punch": "屈弱P",
  "Crouching Medium Punch": "屈中P",
  "Crouching Heavy Punch": "屈強P",
  "Crouching Light Kick": "屈弱K",
  "Crouching Medium Kick": "屈中K",
  "Crouching Heavy Kick": "屈強K",
  "Jump Light Punch": "空中弱P",
  "Jump Medium Punch": "空中中P",
  "Jump Heavy Punch": "空中強P",
  "Jump Light Kick": "空中弱K",
  "Jump Medium Kick": "空中中K",
  "Jump Heavy Kick": "空中強K",
  "Forward Throw": "前投げ",
  "Back Throw": "後ろ投げ",
  "Air Throw": "空中投げ",
};

// ==================== 技名サフィックス変換 ====================

const SUFFIX_MAP: [string, string][] = [
  ["(Light Punch)", "（弱P）"],
  ["(Medium Punch)", "（中P）"],
  ["(Heavy Punch)", "（強P）"],
  ["(Light Kick)", "（弱K）"],
  ["(Medium Kick)", "（中K）"],
  ["(Heavy Kick)", "（強K）"],
  ["(Overdrive)", "（OD）"],
  ["(Overdirve)", "（OD）"], // typoの修正
  ["Level 1", "Lv1"],
  ["Level 2", "Lv2"],
  ["Level 3", "Lv3"],
  ["Aerial ", "空中"],
];

// ==================== 技名本体 変換辞書 ====================

const MOVE_NAME_MAP: Record<string, string> = {
  // --- ドライブシステム ---
  "Drive Impact": "ドライブインパクト",
  "Drive Parry": "ドライブパリィ",
  "Drive Rush": "ドライブラッシュ",
  "Drive Rush Cancel": "ドライブラッシュ（キャンセル）",
  "Drive Reversal": "ドライブリバーサル",

  // --- リュウ ---
  "Hadoken": "波動拳",
  "Shoryuken": "昇龍拳",
  "Tatsumaki Senpu-kyaku": "竜巻旋風脚",
  "High Blade Kick": "ハイブレードキック",
  "Hashogeki": "破昇撃",
  "Denjin Charge": "電刃チャージ",
  "Hadoken (Denjin Charge)": "波動拳（電刃）",
  "Hadoken (Denjin Charge + Overdrive)": "波動拳（電刃＋OD）",
  "Hashogeki (Denjin Charge)": "破昇撃（電刃）",
  "Hashogeki (Denjin Charge + Overdrive)": "破昇撃（電刃＋OD）",
  "Shinku Hadoken (Level 1)": "真空波動拳（Lv1）",
  "Shin Hashogeki (Level 2)": "真・破昇撃（Lv2）",
  "Shin Shoryuken (Level 3)": "真・昇龍拳（Lv3）",
  "Collarbone Breaker": "鎖骨割り",
  "Solar Plexus Strike": "水月打ち",
  "Axe Kick": "踵落とし",
  "Whirlwind Kick": "旋風脚",
  "Fuwa Triple Strike": "不破三段",
  "Back + Heavy Punch": "後ろ強P",
  "Back + Heavy Kick (Axe Kick)": "後ろ強K（踵落とし）",
  "Forward + Medium Punch (Collarbone Breaker)": "前中P（鎖骨割り）",
  "Forward + Heavy Punch (Solar Plexus Strike)": "前強P（水月打ち）",
  "Forward + Heavy Kick (Whirlwind Kick)": "前強K（旋風脚）",
  "Heavy Punch, Heavy Kick": "強P・強K",
  "Medium Punch, Light Kick, Heavy Kick (Fuwa Triple Strike)": "中P・弱K・強K（不破三段）",

  // --- ケン ---
  "Skull Splitter": "頭蓋破殺",
  "Quick Dash (KK)": "快脚（KK）",
  "Quick Dash > Emergency Stop": "快脚 → 急停止",
  "Quick Dash > Thunder Kick": "快脚 → 雷神脚",
  "Jinrai Kicks": "迅雷脚",
  "Dragonlash Kick": "龍尾脚",
  "Guren Enjinkyaku": "紅蓮焔陣脚",
  "Shinryuken (Level 3)": "神龍拳（Lv3）",
  "Guren Senpukyaku (Level 2)": "紅蓮旋風脚（Lv2）",
  "Shippu Jinraikyaku (Level 1)": "疾風迅雷脚（Lv1）",
  "Medium Punch, Heavy Punch": "中P・強P",
  "Medium Kick, Medium Kick, Hard Kick": "中K・中K・強K",
  "Shoryuken (Quick Dash)": "昇龍拳（快脚）",
  "Tatsumaki Senpu-kyaku (Quick Dash)": "竜巻旋風脚（快脚）",

  // --- 春麗 ---
  "Kikoken": "気功拳",
  "Hundred Lightning Kicks": "百烈脚",
  "Spinning Bird Kick": "鳳凰脚",
  "Hazanshu": "破山蹴",
  "Tensho Kicks": "天昇脚",
  "Kikosho (Level 1)": "気功掌（Lv1）",
  "Hoyoku-sen (Level 2)": "鳳翼扇（Lv2）",
  "Senretsu Kicks (Level 3)": "閃裂蹴（Lv3）",

  // --- ブランカ ---
  "Wild Edge": "ワイルドエッジ",
  "Amazon River Run": "アマゾンリバーラン",
  "Wild Nail": "ワイルドネイル",
  "Double Knee Bombs": "ダブルニーボンバー",
  "Rock Crusher": "ロッククラッシュ",
  "Electric Thunder": "電撃アタック",
  "Rolling Attack": "ローリングアタック",
  "Vertical Rolling Attack": "バーチカルローリング",
  "Wild Hunt": "ワイルドハント",
  "Blanka-chan Bomb": "ブランカちゃんボム",
  "Lightning Beast (Level 1)": "雷獣（Lv1）",
  "Ground Shave Roll (Level 2)": "地走りローリング（Lv2）",
  "Primal Roar (Level 3)": "プライマルロアー（Lv3）",

  // --- ガイル ---
  "Drake Fang": "ドレイクファング",
  "Sonic Boom": "ソニックブーム",
  "Flash Kick": "サマーソルトキック",
  "Sonic Blade": "ソニックブレード",
  "Sonic Cross": "ソニッククロス",
  "Sonic Break": "ソニックブレイク",
  "Sonic Hurricane (Level 1)": "ソニックハリケーン（Lv1）",
  "Solid Puncher (Level 2)": "ソリッドパンチャー（Lv2）",
  "Crossfire Blitz (Level 3)": "クロスファイアブリッツ（Lv3）",

  // --- ダルシム ---
  "Yoga Mountain": "ヨガマウンテン",
  "Yoga Lance": "ヨガランス",
  "Divine Kick": "合掌キック",
  "Yoga Uppercut": "ヨガアッパー",
  "Karma Kick": "因果キック",
  "Nirvana Punch": "涅槃パンチ",
  "Agile Kick": "アジャイルキック",
  "Thrust Kick": "スラストキック",
  "Yoga Fire": "ヨガファイアー",
  "Yoga Arch": "ヨガアーチ",
  "Yoga Flame": "ヨガフレイム",
  "Yoga Blast": "ヨガブラスト",
  "Yoga Comet": "ヨガコメット",
  "Yoga Teleport": "ヨガテレポート",
  "Yoga Inferno (Level 1)": "ヨガインフェルノ（Lv1）",
  "Yoga Sunburst (Level 2)": "ヨガサンバースト（Lv2）",
  "Yoga Catastrophe (Level 3)": "ヨガカタストロフィ（Lv3）",

  // --- E・本田 ---
  "Hundred Hand Slap": "百貫張り手",
  "Sumo Headbutt": "スーパー頭突き",
  "Sumo Smash": "大銀杏落とし",
  "Oicho Throw": "おいちょ投げ",
  "Sumo Dash": "大相撲ダッシュ",
  "Triple Slap": "三連張り手",
  "Nishiki-no-Tsuki (Level 1)": "錦の月（Lv1）",
  "Dohohohzan (Level 2)": "怒呼々々斬（Lv2）",
  "Fuji Drop (Level 3)": "富士落とし（Lv3）",

  // --- ザンギエフ ---
  "Smetana Dropkick": "スメタナドロップキック",
  "Cyclone Wheel Kick": "サイクロンニールキック",
  "Headbutt": "ヘッドバット",
  "Knee Hammer": "ニーバット",
  "Double Lariat": "ダブルラリアット",
  "Screw Piledriver": "スクリューパイルドライバー",
  "Borscht Dynamite": "ボルシチダイナマイト",
  "Russian Suplex / Siberian Express": "ロシアンスープレックス / シベリアンエクスプレス",
  "Russian Suplex (Overdrive) / Siberian Express (Overdrive)": "ロシアンスープレックス（OD）/ シベリアンエクスプレス（OD）",
  "Tundra Storm": "ツンドラストーム",
  "Iron Muscle": "アイアンマッスル",
  "Bolshoi Storm Buster (Level 1)": "ボリショイストームバスター（Lv1）",
  "Cyclone Lariat (Level 2)": "サイクロンラリアット（Lv2）",
  "Siberian Rusalka (Level 3)": "シベリアンルサールカ（Lv3）",

  // --- キャミィ ---
  "Delayed Ripper": "ディレイリーパー",
  "Spiral Arrow": "スパイラルアロー",
  "Cannon Spike": "キャノンスパイク",
  "Quick Spin Knuckle": "クイックスピンナックル",
  "Cannon Strike": "キャノンストライク",
  "Hooligan Combination": "フーリガンコンビネーション",
  "Hooligan Combination > Razor's Edge Slicer": "フーリガン → カミソリエッジ",
  "Hooligan Combination (Overdrive) > Razor's Edge Slicer": "フーリガン（OD）→ カミソリエッジ",
  "Hooligan Combination > Cannon Strike": "フーリガン → キャノンストライク",
  "Delta Red Assault (Level 1)": "デルタレッドアサルト（Lv1）",
  "Killer Bee Assault (Level 2)": "キラービーアサルト（Lv2）",
  "Cammy Forever (Level 3)": "キャミィフォーエバー（Lv3）",

  // --- ディージェイ ---
  "Speedy Maracas": "スピーディマラカス",
  "Air Slasher": "エアスラッシャー",
  "Jackknife Maximum": "ジャックナイフマキシマム",
  "Rolling Sobat": "ローリングソバット",
  "Machine Gun Upper": "マシンガンアッパー",
  "Jus Cool": "ジャスクール",
  "The Greatest Sobat (Level 1)": "ザ・グレイテストソバット（Lv1）",
  "Lowkey Sunrise Festival (Level 2)": "ロウキーサンライズフェスティバル（Lv2）",
  "Dancing Flash (Level 3)": "ダンシングフラッシュ（Lv3）",

  // --- ジュリ ---
  "Renko Kicks": "連剋脚",
  "Fuhajin": "不破陣",
  "Saihasho": "再破衝",
  "Ankensatsu": "暗剣殺",
  "Go Ohsatsu": "五凰殺",
  "Tensenrin": "転旋輪",
  "Fuha Wheel": "不破輪",
  "Feng Shui Engine (Level 1)": "風水エンジン（Lv1）",
  "Kaisen Dankairaku (Level 2)": "廻閃断崖落（Lv2）",
  "Juri Ultimate Feng Shui (Level 3)": "ジュリ究極風水（Lv3）",

  // --- ルーク ---
  "Outlaw Kick": "アウトローキック",
  "Sandblast": "サンドブラスト",
  "Fatal Shot (Overdrive Sandblast Followup)": "フェイタルショット（ODサンドブラスト派生）",
  "Flash Knuckle": "フラッシュナックル",
  "DDT (Overdrive Flash Knuckle Followup)": "DDT（ODフラッシュナックル派生）",
  "Aerial Flash Knuckle": "空中フラッシュナックル",
  "Avenger": "アベンジャー",
  "Avenger > No Chaser": "アベンジャー → ノーチェイサー",
  "Avenger > Impaler": "アベンジャー → インペイラー",
  "Luke SF-V (Level 1)": "ルークSF-V（Lv1）",
  "Final Strike (Level 3)": "ファイナルストライク（Lv3）",

  // --- ジェイミー ---
  "Hermit's Elbow": "仙姑肘",
  "Intoxicated Assault": "酩酊襲",
  "Senei Kick": "旋影脚",
  "Ransui Haze": "乱酔旋",
  "Falling Star Kick": "落星脚",
  "Full Moon Kick": "円月脚",
  "Down + KK": "下＋KK",
  "The Devil Inside": "ザ・デビルインサイド",
  "Freeflow Strikes (First Hit)": "フリーフロウストライク（1段目）",
  "Swagger Step": "スワッガーステップ",
  "Crazy Ol' Move": "クレイジーオルドムーブ",
  "Breakin' Down": "ブレイキンダウン",
  "The Drip": "ザ・ドリップ",
  "Bakkai": "白廻",
  "Haodong": "豪動",
  "Getsumen Dao Fa (Level 3)": "月面刀法（Lv3）",

  // --- JP ---
  "Grom Strelka": "グロームストレルカ",
  "Malice": "マリートヴァ",
  "Bylina": "ヴィリーナ",
  "Guillotinna": "ギリオチーナ",
  "Triglav": "トリグラフ",
  "Stribog": "ストリボグ",
  "Departure": "ディパーチャー",
  "Departure > Window": "ディパーチャー → ウィンドウ",
  "Departure > Shadow": "ディパーチャー → シャドウ",
  "Amnesia": "アムネジア",
  "Torbalan": "トールバラン",
  "Biting Krasnoe (Level 1)": "バイティングクラスノエ（Lv1）",
  "Tyrant Slaughter (Level 2)": "タイラントスローター（Lv2）",
  "Lucent Limbs (Level 3)": "ルーセントリムズ（Lv3）",

  // --- キンバリー ---
  "Windmill Kick": "風車",
  "Water Slicer Slide": "水切り蹴り",
  "Hisen Kick": "飛箭蹴",
  "Bushin Senpukyaku": "武神旋風脚",
  "Sprint": "スプリント",
  "Arc Step": "アークステップ",
  "Bushin Izuna Otoshi": "武神いづな落とし",
  "Bushin Hojin Kick": "武神鳳神蹴",
  "Nue Twister": "鵺ツイスター",
  "Rain of Kunai (Level 1)": "苦無の雨（Lv1）",
  "Super Ninja Cypher (Level 3)": "スーパー忍者（Lv3）",

  // --- リリー ---
  "Horn Breaker": "ホーンブレイク",
  "Ridge Thrust": "スラストリッジ",
  "Condor Wind": "コンドルウィンド",
  "Condor Spire": "コンドルスパイア",
  "Tomahawk Buster": "トマホークバスター",
  "Condor Dive": "コンドルダイブ",
  "Mexican Typhoon": "メキシカンタイフーン",
  "Breezing Hawk (Level 1)": "ブリージングホーク（Lv1）",
  "Thunderbird (Level 2)": "サンダーバード（Lv2）",
  "Raging Typhoon (Level 3)": "レイジングタイフーン（Lv3）",

  // --- マノン ---
  "Manège Doré": "マネージュドレ",
  "Rond-point": "ロンポワン",
  "Dégagé": "デガジェ",
  "Renversé": "ランベルセ",
  "Grand Fouetté": "グランフエッテ",
  "Arabesque (Level 1)": "アラベスク（Lv1）",
  "Étoile (Level 2)": "エトワール（Lv2）",
  "Pas de Deux (Level 3)": "パ・ド・ドゥ（Lv3）",

  // --- マリーザ ---
  "Gladius": "グラディウス",
  "Dimachaerus": "ディマカエルス",
  "Phalanx": "ファランクス",
  "Quadriga": "クアドリガ",
  "Scutum": "スクトゥム",
  "Scutum > Tonitrus": "スクトゥム → トニトルス",
  "Scutum > Procella": "スクトゥム → プロケラ",
  "Javelin of Marisa (Level 1)": "マリーザのジャベリン（Lv1）",
  "Goddess of the Hunt (Level 3)": "狩猟の女神（Lv3）",

  // --- ラシード ---
  "Crescent Kick": "クレセントキック",
  "Break Assault": "アサルト・ビーク",
  "Flapping Spin": "フラップ・スピン",
  "Spinning Mixer": "スピニングミキサー",
  "Eagle Spike": "イーグルスパイク",
  "Whirlwind Shot": "ウィンドシュート",
  "Arabian Cyclone": "アラビアンサイクロン",
  "Wing Stroke": "ウイングストローク",
  "Rolling Assault": "ローリングアサルト",
  "Nail Assault": "ネイルアサルト",
  "Front Flip (Side Flip > KK)": "前方宙返り（KK）",
  "Ysaar (Level 1)": "イサール（Lv1）",
  "Altair (Level 2)": "アルタイル（Lv2）",
  "Al-Rashid Tower (Level 3)": "アルラシードタワー（Lv3）",

  // --- A.K.I. ---
  "Pu Lao": "蒲牢",
  "Qiu Niu": "囚牛",
  "Chi Wen": "螭吻",
  "Nightshade Pulse": "ナイトシェードパルス",
  "Nightshade Chaser": "ナイトシェードチェイサー",
  "Nightshade Chaser, Burst": "ナイトシェードチェイサー・バースト",
  "Nightshade Chaser (Overdrive), Burst": "ナイトシェードチェイサー（OD）・バースト",
  "Orchid Spring": "オーキッドスプリング",
  "Orchid Wreath": "オーキッドリース",
  "Bad Harvest": "バッドハーベスト",
  "Serpent Lash": "サーペントラッシュ",
  "Deadly Implication (Level 1)": "デッドリーインプリケーション（Lv1）",
  "Viper Suplex (Level 3)": "バイパーサプレックス（Lv3）",

  // --- エド ---
  "Low Smash Combination": "ロースマッシュコンビネーション",
  "Cobra Punch": "コブラパンチ",
  "Hold HP (Psycho Knuckle)": "HP長押し（サイコナックル）",
  "Psycho Spark": "サイコスパーク",
  "Psycho Shoot (Psycho Spark Followup)": "サイコシュート（スパーク派生）",
  "Psycho Uppercut": "サイコアッパーカット",
  "Psycho Blitz": "サイコブリッツ",
  "Psycho Flicker": "サイコフリッカー",
  "Kill Rush": "キルラッシュ",
  "Psycho Barrage (Level 1)": "サイコバレッジ（Lv1）",
  "Psycho Cannon (Level 2)": "サイコキャノン（Lv2）",
  "Psycho Storm (Level 3)": "サイコストーム（Lv3）",

  // --- 豪鬼 ---
  "Rago High Kick": "羅豪脚",
  "Kikoku Combination": "鬼哭連撃",
  "Resso Snap Kick": "裂槍脚",
  "Gou Hadoken": "豪波動拳",
  "Gou Shoryuken": "豪昇龍拳",
  "Tatsumaki Zanku-kyaku": "竜巻斬空脚",
  "Demon Raid": "鬼降り",
  "Demon Swoop": "魔神爪撃",
  "Demon Low Slash": "鬼低空斬",
  "Demon Guillotine": "鬼落とし",
  "Suiretsusen": "水烈閃",
  "Ashura Senku": "阿修羅閃空",
  "Messatsu Gou Hadou (Level 1)": "滅殺豪波動（Lv1）",
  "Messatsu Goushoryu (Level 2)": "滅殺豪昇龍（Lv2）",
  "Shun Goku Satsu (Level 3)": "瞬獄殺（Lv3）",

  // --- M・バイソン ---
  "Evil Knee": "イビルニー",
  "Hover Kick": "ホバーキック",
  "Psycho Hammer": "サイコハンマー",
  "Psycho Crusher": "サイコクラッシャーアタック",
  "Double Knee Press": "ダブルニープレス",
  "Shadow Rise": "シャドウライズ",
  "Head Press": "ヘッドプレス",
  "Head Press (Overdirve)": "ヘッドプレス（OD）",
  "Sommersault Skull Diver": "サマーソルトスカルダイバー",
  "Devil Reverse": "デビルリバース",
  "Bison Warp": "バイソンワープ",
  "Knee Press Nightmare (Level 1)": "ニープレスナイトメア（Lv1）",
  "Psycho Inferno (Level 2)": "サイコインフェルノ（Lv2）",
  "Nightmare Booster (Level 3)": "ナイトメアブースター（Lv3）",

  // --- テリー ---
  "Round Wave": "ラウンドウェーブ",
  "Quick Burn": "クイックバーン",
  "Burning Knuckle": "バーニングナックル",
  "Power Charge": "パワーチャージ",
  "Crack Shoot": "クラックシュート",
  "Rising Tackle": "ライジングタックル",
  "Buster Wolf (Level 1)": "バスターウルフ（Lv1）",
  "Power Geyser (Level 2)": "パワーゲイザー（Lv2）",
  "Triple Wolf (Level 3)": "トリプルウルフ（Lv3）",

  // --- 舞 ---
  "Hoshi Kujaku": "星孔雀",
  "Senkotsu Uchi": "扇骨打ち",
  "Kachousen": "花蝶扇",
  "Hishou Ryuuenjin": "飛翔龍炎陣",
  "Ryuuenbu": "龍炎舞",
  "Hissatsu Shinobi Bachi": "必殺忍蜂",
  "Kagerou no Mai (Level 1)": "陽炎の舞（Lv1）",
  "Chou Hissatsu Shinobi Bachi (Level 2)": "超必殺忍蜂（Lv2）",
  "Air Chou Hissatsu Shinobi Bachi (Level 2)": "空中超必殺忍蜂（Lv2）",
  "Shiranui Ryuu: Enbu Ada Zakura (Level 3)": "不知火流炎舞仇桜（Lv3）",

  // --- エレナ ---
  "Rhino Horn": "ライノホーン",
  "Scratch Wheel": "スクラッチホイール",
  "Lynx Song": "リンクスソング",
  "Spinning Scythe": "スピニングサイス",
  "Moon Glider": "ムーングライダー",
  "Mallet Smash [Lynx Whirl > Mallet Smash]": "マレットスマッシュ",
  "Leopard Snap [Lynx Whirl > Leopard Snap]": "レオパードスナップ",
  "Harvest Circle [Lynx Whirl > Harvest Circle]": "ハーベストサークル",
  "Spinning Beat (Level 1)": "スピニングビート（Lv1）",
  "Brave Dance (Level 3)": "ブレイブダンス（Lv3）",

  // --- 共通 ---
  "Neutral Throw": "ニュートラル投げ",
  "Down Throw": "下投げ",
  "Down-Back Throw": "後下投げ",
  "Down-Forward Throw": "前下投げ",
  "Forward Air Throw": "前空中投げ",
  "Back Air Throw": "後ろ空中投げ",
  "Stats": "ステータス",

  // --- ケン ---
  "Dragonlash Kick (Quick Dash)": "龍尾脚（快脚）",
  "Emergeny Stop": "急停止",

  // --- ブランカ ---
  "Aerial Rolling Attack": "空中ローリングアタック",
  "Wild Lift": "ワイルドリフト",

  // --- ダルシム ---
  "Yoga Float": "ヨガフロート",
  "Zanku Hadoken (Forward Jump Only)": "斬空波動拳（前ジャンプ限定）",

  // --- E・本田 ---
  "Sumo Spirit": "スモウスピリット",
  "Down, Down + Medium Kick (Power Stomps)": "↓↓中K（パワーストンプ）",
  "Down, Down + Medium Kick, Medium Kick, Medium Kick": "↓↓中K・中K・中K",

  // --- ザンギエフ ---
  "Embrace": "エンブレース",

  // --- キャミィ ---
  "Spiral Arrow (Heavy Kick, Full Charge)": "スパイラルアロー（強K・フルチャージ）",
  "Cannon Spike (Heavy Kick, Full Charge)": "キャノンスパイク（強K・フルチャージ）",
  "Hooligan Combination > Fatal Leg Twister (Throw)": "フーリガン → フェイタルレッグツイスター（投げ）",
  "Hooligan Combination > Reverse Edge": "フーリガン → リバースエッジ",
  "Hooligan Combination > Silent Step": "フーリガン → サイレントステップ",

  // --- ジュリ ---
  "Shiku-sen": "四苦閃",

  // --- ルーク ---
  "Kill Switch Break": "キルスイッチブレイク",
  "Kill Switch Chaser": "キルスイッチチェイサー",
  "Rolling Cannon": "ローリングキャノン",
  "Slam Dunk (Overdrive Rising Upper Followup)": "スラムダンク（ODライジングアッパー派生）",

  // --- ジェイミー ---
  "Coward Crouch": "コワードクラウチ",
  "Serenity Stream (Down, Down-back, Back, Punch)": "セレニティストリーム（↙←P）",
  "Serenity Stream > Light Punch": "セレニティストリーム → 弱P",
  "Serenity Stream > Medium Punch": "セレニティストリーム → 中P",
  "Serenity Stream > Heavy Punch": "セレニティストリーム → 強P",
  "Serenity Stream > Light Kick": "セレニティストリーム → 弱K",
  "Serenity Stream > Medium Kick": "セレニティストリーム → 中K",
  "Serenity Stream > Heavy Kick": "セレニティストリーム → 強K",
  "Jus Cool > Light Kick": "ジャスクール → 弱K",
  "Jus Cool > Medium Kick": "ジャスクール → 中K",
  "Jus Cool > Heavy Kick": "ジャスクール → 強K",
  "Jus Cool > Forward + Punch": "ジャスクール → 前P",
  "Jus Cool > Forward + Punch > Back + Punch": "ジャスクール → 前P → 後ろP",
  "Freeflow Strikes > Punch Followup 1": "フリーフロウ → パンチ派生1",
  "Freeflow Strikes > Punch Followup 2": "フリーフロウ → パンチ派生2",
  "Freeflow Strikes > Kick Followup 1": "フリーフロウ → キック派生1",
  "Freeflow Strikes > Kick Followup 2": "フリーフロウ → キック派生2",
  "Passing Sway (Medium Punch, Medium Kick)": "パッシングスウェイ（中P・中K）",
  "Passing Sway > Jumping Knee (Medium Punch, Medium Kick, Medium Punch)": "パッシングスウェイ → ジャンピングニー",
  "Passing Sway > Jumping Lariat (Medium Punch, Medium Kick, Medium Punch)": "パッシングスウェイ → ジャンピングラリアット",
  "Funky Dance (Medium Punch, Medium Punch, Heavy Punch (Back + Heavy Punch))": "ファンキーダンス（中P・中P・強P（後ろ強P））",

  // --- キンバリー ---
  "Wall Jump": "壁蹴り",
  "Raid Jump": "レイドジャンプ",
  "Side Flip (Forward + KK)": "サイドフリップ（前KK）",
  "Shuriken Bomb / Genius at Play": "手裏剣ボム / ジーニアス・アット・プレイ",
  "Musasabi no Mai (During Forward Jump Only)": "ムササビの舞（前ジャンプ限定）",

  // --- マノン ---
  "À Terre (Medium Punch, Medium Kick)": "アテール（中P・中K）",
  "Temps Lié (Heavy Punch, Heavy Punch)": "タンリエ（強P・強P）",
  "Turning Tail (Heavy Punch, Heavy Punch)": "ターニングテイル（強P・強P）",

  // --- マリーザ ---
  "Malleus Breaker (Down-Forward + Heavy Punch)": "マルレウスブレイカー（↘強P）",
  "Falx Crusher Kick (Forward + Heavy Kick)": "ファルクスクラッシャーキック（前強K）",
  "Scutum > Enfold": "スクトゥム → エンフォールド",
  "Desert Storm (Forward + Heavy Punch, Heavy Punch, Heavy Punch)": "デザートストーム（前強P・強P・強P）",

  // --- A.K.I. ---
  "Venomous Fang": "ベノマスファング",
  "Entrapment": "エントラップメント",
  "Sinister Slide": "シニスタースライド",

  // --- エド ---
  "Psycho Mine": "サイコマイン",
  "Hidden Variable": "ヒドゥンバリアブル",

  // --- 豪鬼 ---
  "Demon Blade Kick": "鬼刃蹴り",
  "Demon Gou Rasen": "滅・豪螺旋",
  "Demon Gou Zanku": "滅・豪斬空",
  "Tenshin": "転身",

  // --- M・バイソン ---
  "Shadow Slide": "シャドウスライド",

  // --- テリー ---
  "Surprise Forward Hop": "サプライズフォワードホップ",
  "Surprise Back Hop": "サプライズバックホップ",

  // --- エレナ ---
  "Moon Glider Followup": "ムーングライダー派生",
  "Luminous Dive Kick": "ルミナスダイブキック",
  "Heel Strike": "ヒールストライク",
  "Torso Cleaver": "トルソークリーバー",
  "Neck Hunter": "ネックハンター",
  "Caelum Arc (Neutral Jump > Down + Heavy Punch)": "カエルムアーク（垂直J↓強P）",

  // --- ガイル ---
  "Guile High Kick (Down-Forward + Heavy Kick)": "ガイルハイキック（↘強K）",
  "Slide (Down-Forward + Heavy Kick)": "スライド（↘強K）",

  // --- 春麗 ---
  "Senka Snap Kick": "閃華スナップキック",
  "Kazekama Shin Kick": "風鎌脛蹴り",
  "Kasai Thrust Kick": "火砕スラストキック",
  "Gorai Axe Kick": "轟雷アックスキック",
  "Neko Damashi": "猫騙し",

  // --- リリー ---
  "Run (Forward, Hold Forward)": "ダッシュ（前入力・前長押し）",
  "Run > Forward + Kick (Tempest Moon)": "ダッシュ → 前K（テンペストムーン）",
  "Run > Forward + Punch (Backup)": "ダッシュ → 前P（バックアップ）",

  // --- ディージェイ ---
  "Power Drive (Medium Punch, Heavy Punch)": "パワードライブ（中P・強P）",
  "Power Dunk (Medium Punch, Heavy Kick, Heavy Kick)": "パワーダンク（中P・強K・強K）",
  "Power Shoot (Medium Punch, Heavy Kick)": "パワーシュート（中P・強K）",
  "Power Stomp (Down-Forward + Heavy Kick)": "パワーストンプ（↘強K）",
  "Hind Kick (Medium Kick, Heavy Kick)": "ヒンドキック（中K・強K）",
  "Heavy Two Hitter (Heavy Punch, Heavy Punch)": "ヘビーツーヒッター（強P・強P）",
  "Swing Combination (Heavy Punch, Heavy Kick)": "スウィングコンビネーション（強P・強K）",

  // --- その他 ---
  "Hammer Punch (Forward + Heavy Punch)": "ハンマーパンチ（前強P）",
  "Nose Breaker (Down + Medium Kick, Down + Heavy Punch)": "ノーズブレイカー（↓中K・↓強P）",
  "Fire Kick (Down + Medium Kick, Down + Heavy Kick)": "ファイアーキック（↓中K・↓強K）",
  "Fluttering Lark (Crouching Medium Kick, Heavy Kick)": "フラッタリングラーク（屈中K・強K）",
  "Korenzan (Back + Heavy Kick)": "狐蓮斬（後ろ強K）",
  "Round Arch (Back + Heavy Kick)": "ラウンドアーチ（後ろ強K）",
  "Snapback Combo (Medium Punch, Medium Punch, Medium Punch, Medium Punch)": "スナップバックコンボ（中P×4）",
  "Soaring Raid (Jump, Light Punch, Medium Kick)": "ソアリングレイド（J弱P・中K）",
  "Raptor Range (Jump, Medium Punch, Heavy Punch)": "ラプターレンジ（J中P・強P）",
  "Water Lotus Fist (Down-Forward + Heavy Punch)": "水蓮拳（↘強P）",
  "Starling Beak (Medium Punch, Medium Punch)": "スターリングビーク（中P・中P）",
  "Threebeat Combo (Light Punch, Medium Kick, Medium Kick)": "スリービートコンボ（弱P・中K・中K）",
  "Triple Impact (Light Punch, Medium Punch, Hard Punch)": "トリプルインパクト（弱P・中P・強P）",
  "Trunk Slap (Forward + Heavy Punch, Heavy Punch, Heavy Punch)": "トランクスラップ（前強P・強P・強P）",
  "Handstand Whip (Forward + Medium Kick, Medium Kick) Forward + Medium Kick": "ハンドスタンドウィップ（前中K・中K）",
  "Step Up (Hisen Kick > Up/Up-Forward/Up-Back)": "ステップアップ（飛燕蹴り → 上方向）",
  "Swagger Step > Swagger Hermit Punch": "スワッガーステップ → スワッガーハーミットパンチ",
  "Taiho Cannon Lift": "太砲キャノンリフト",
  "Quick Dash > Forward Step Kick": "快脚 → フォワードステップキック",
};

// ==================== パターン変換ヘルパー ====================

/** ボタン名を略記に変換 */
function replaceButtons(s: string): string {
  return s
    .replace(/Heavy Punch/g, "強P")
    .replace(/Medium Punch/g, "中P")
    .replace(/Light Punch/g, "弱P")
    .replace(/Hard Punch/g, "強P")
    .replace(/Heavy Kick/g, "強K")
    .replace(/Medium Kick/g, "中K")
    .replace(/Light Kick/g, "弱K")
    .replace(/Hard Kick/g, "強K")
    .replace(/\bPunch\b/g, "P")
    .replace(/\bKick\b/g, "K");
}

/** 方向入力を記号に変換 */
function replaceDirections(s: string): string {
  return s
    .replace(/Down-Forward \+ /g, "↘")
    .replace(/Down-Back \+ /g, "↙")
    .replace(/Down \+ /g, "↓")
    .replace(/Back \+ /g, "後ろ")
    .replace(/Forward \+ /g, "前")
    .replace(/Up \+ /g, "↑");
}

/** 括弧内の技名を辞書で引いて変換 */
function translateParen(inner: string): string {
  return MOVE_NAME_MAP[inner] ?? replaceButtons(replaceDirections(inner));
}

/**
 * 入力表記・コンボ文字列をパターンで変換する。
 * 変換できない場合は null を返す。
 */
function translateByPattern(name: string): string | null {
  let s = name;

  // --- ジャンプ入力系 ---
  if (s.startsWith("Neutral Jump")) {
    s = s.replace(/^Neutral Jump,?\s*/, "垂直J");
    s = replaceDirections(s);
    s = replaceButtons(s);
    s = s.replace(/\(([^)]+)\)/g, (_, p) => `（${translateParen(p)}）`);
    return s.replace(/, /g, "・");
  }
  if (s.startsWith("Forward Jump, ")) {
    s = s.replace(/^Forward Jump, /, "前J");
    s = replaceDirections(s);
    s = replaceButtons(s);
    s = s.replace(/\(([^)]+)\)/g, (_, p) => `（${translateParen(p)}）`);
    return s.replace(/, /g, "・");
  }
  if (s.startsWith("Jump, ")) {
    s = s.replace(/^Jump, /, "J");
    s = replaceDirections(s);
    s = replaceButtons(s);
    s = s.replace(/\(([^)]+)\)/g, (_, p) => `（${translateParen(p)}）`);
    return s.replace(/, /g, "・");
  }
  // ジャンプ空中コンボ（"Jump X, Jump Y" 形式）
  if (/^Jump (Light|Medium|Heavy) (Punch|Kick),/.test(s)) {
    s = s.replace(/Jump /g, "J");
    s = replaceButtons(s);
    return s.replace(/, /g, "・");
  }

  // --- 方向入力系 ---
  const dirPrefixes = [
    "Down-Forward + ", "Down-Back + ", "Forward/Back + ",
    "Down + ", "Back + ", "Forward + ", "Up + ",
  ];
  if (dirPrefixes.some((p) => s.startsWith(p))) {
    // "Direction + Buttons (Name) rest" 形式を分解
    const m = s.match(/^(.+?)\s*\(([^)]+)\)\s*(.*)$/);
    if (m) {
      const [, before, paren, after] = m;
      let head = replaceButtons(replaceDirections(before.trim()));
      let tail = after ? replaceButtons(replaceDirections(after)) : "";
      return `${head}（${translateParen(paren)}）${tail}`.replace(/, /g, "・");
    }
    s = replaceButtons(replaceDirections(s));
    return s.replace(/, /g, "・");
  }

  // --- コンボ文字列系（"X Punch/Kick, Y Punch/Kick ..." 形式） ---
  if (/^(Light|Medium|Heavy|Hard) (Punch|Kick)/.test(s)) {
    const m = s.match(/^(.+?)\s*\(([^)]+)\)$/);
    if (m) {
      const [, before, paren] = m;
      const head = replaceButtons(before.trim()).replace(/, /g, "・");
      return `${head}（${translateParen(paren)}）`;
    }
    s = replaceButtons(s);
    return s.replace(/, /g, "・");
  }

  return null;
}

// ==================== 変換関数 ====================

/**
 * 技名を英語から日本語に変換する
 * 完全一致 → サフィックス変換 → パターン変換 → フォールバックの順に試みる
 */
export function translateMoveName(name: string): string {
  // 1. 完全一致（通常技）
  if (NORMAL_MAP[name]) return NORMAL_MAP[name];

  // 2. 完全一致（スペシャル技辞書）
  if (MOVE_NAME_MAP[name]) return MOVE_NAME_MAP[name];

  // 3. Aerial prefix
  if (name.startsWith("Aerial ")) {
    const base = name.replace("Aerial ", "");
    const translated = MOVE_NAME_MAP[base];
    if (translated) return "空中" + translated;
  }

  // 4. サフィックス変換
  let result = name;
  for (const [en, ja] of SUFFIX_MAP) {
    if (result.includes(en)) {
      const base = result.replace(` ${en}`, "").replace(en, "").trim();
      const translatedBase = MOVE_NAME_MAP[base] || base;
      result = translatedBase + ja.replace("（", " （").trim();
      break;
    }
  }
  result = result
    .replace("(Overdrive)", "（OD）")
    .replace("(Light Punch)", "（弱P）")
    .replace("(Medium Punch)", "（中P）")
    .replace("(Heavy Punch)", "（強P）")
    .replace("(Light Kick)", "（弱K）")
    .replace("(Medium Kick)", "（中K）")
    .replace("(Heavy Kick)", "（強K）");

  if (result !== name) return result;

  // 5. パターン変換（入力表記・コンボ文字列）
  const pattern = translateByPattern(name);
  if (pattern) return pattern;

  return name;
}
