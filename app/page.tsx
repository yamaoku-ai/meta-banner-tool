"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Check,
  ClipboardList,
  Copy,
  Eye,
  FileText,
  History,
  LayoutDashboard,
  Lightbulb,
  MessageSquareText,
  Moon,
  Palette,
  RotateCcw,
  Save,
  Sparkles,
  Sun,
  Target,
  Trash2,
  Wand2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type BannerSize = "1080×1080" | "1200×628" | "1080×1920";

type CampaignType =
  | "商品販売"
  | "店舗集客"
  | "求人"
  | "サービス申込"
  | "リード獲得"
  | "LINE登録"
  | "資料請求"
  | "アプリDL"
  | "ブランド認知"
  | "イベント"
  | "その他";

type AdType =
  | "CV重視"
  | "CTR重視"
  | "高級ブランド"
  | "UGC風"
  | "セール訴求"
  | "BtoB";

type Industry =
  | "自動判定"
  | "美容"
  | "SaaS"
  | "不動産"
  | "教育"
  | "飲食"
  | "EC"
  | "人材"
  | "医療"
  | "金融"
  | "その他";

type Language = "日本語" | "英語";

type TabType =
  | "analysis"
  | "copies"
  | "designs"
  | "prompt"
  | "guide"
  | "saved";

type DesignCount =
  | "1枚"
  | "2枚"
  | "3枚"
  | "4枚"
  | "5枚"
  | "6枚"
  | "7枚"
  | "8枚"
  | "9枚";

type CopyTone =
  | "強め"
  | "自然"
  | "高級"
  | "共感"
  | "悩み解決"
  | "実績"
  | "限定"
  | "お得"
  | "SNS風"
  | "BtoB";

type DesignPattern = {
  title: string;
  style: string;
  color: string;
  layout: string;
  purpose: string;
  previewClass: string;
  accentClass: string;
};

type SavedHistory = {
  id: number;
  product: string;
  target: string;
  appeal: string;
  campaignType: CampaignType;
  adType: AdType;
  createdAt: string;
  prompt: string;
};

const CAMPAIGN_TYPES: CampaignType[] = [
  "商品販売",
  "店舗集客",
  "求人",
  "サービス申込",
  "リード獲得",
  "LINE登録",
  "資料請求",
  "アプリDL",
  "ブランド認知",
  "イベント",
  "その他",
];

const DESIGN_COUNTS: DesignCount[] = [
  "1枚",
  "2枚",
  "3枚",
  "4枚",
  "5枚",
  "6枚",
  "7枚",
  "8枚",
  "9枚",
];

const COPY_TONES: CopyTone[] = [
  "強め",
  "自然",
  "高級",
  "共感",
  "悩み解決",
  "実績",
  "限定",
  "お得",
  "SNS風",
  "BtoB",
];

const INDUSTRIES: Industry[] = [
  "自動判定",
  "美容",
  "SaaS",
  "不動産",
  "教育",
  "飲食",
  "EC",
  "人材",
  "医療",
  "金融",
  "その他",
];

type ResolvedIndustry = Exclude<Industry, "自動判定">;

type CopyBundle = {
  main: string;
  sub: string;
  benefit: string;
  problem: string;
  trust: string;
  limited: string;
  short: string;
  sns: string;
  comparison: string;
  description: string;
};

type IndustryRule = {
  mainHint: string;
  benefitHint: string;
  trustHint: string;
  avoidWords: string[];
};

const INDUSTRY_RULES: Record<ResolvedIndustry, IndustryRule> = {
  美容: {
    mainHint: "理想の自分に近づく",
    benefitHint: "毎日のケアを前向きに続けやすい",
    trustHint: "清潔感・口コミ感・安心感を重視",
    avoidWords: ["治る", "改善", "必ず", "絶対"],
  },
  SaaS: {
    mainHint: "業務をもっとスムーズに",
    benefitHint: "作業時間を減らし、チーム運用を整える",
    trustHint: "導入実績・セキュリティ・サポート体制を重視",
    avoidWords: ["誰でも必ず", "絶対"],
  },
  不動産: {
    mainHint: "納得できる住まい選びを",
    benefitHint: "条件に合う選択肢を見つけやすい",
    trustHint: "立地・価格・相談しやすさ・実績を重視",
    avoidWords: ["必ず見つかる", "絶対"],
  },
  教育: {
    mainHint: "学びを次の一歩へ",
    benefitHint: "続けやすく、成長を実感しやすい",
    trustHint: "カリキュラム・実績・学習サポートを重視",
    avoidWords: ["必ず合格", "絶対伸びる"],
  },
  飲食: {
    mainHint: "今日行きたいお店に",
    benefitHint: "できたてのおいしさと楽しい時間を味わえる",
    trustHint: "雰囲気・人気メニュー・口コミ感を重視",
    avoidWords: ["絶対うまい"],
  },
  EC: {
    mainHint: "欲しいが見つかる",
    benefitHint: "比較しやすく、買う理由が伝わりやすい",
    trustHint: "レビュー・価格・配送・返品しやすさを重視",
    avoidWords: ["最安", "必ず"],
  },
  人材: {
    mainHint: "自分らしく働ける場所へ",
    benefitHint: "条件だけでなく働きやすさも伝わる",
    trustHint: "仕事内容・待遇・職場の雰囲気を重視",
    avoidWords: ["誰でも採用", "必ず稼げる"],
  },
  医療: {
    mainHint: "まずは気軽に相談を",
    benefitHint: "不安を整理して相談しやすい",
    trustHint: "専門性・丁寧さ・安心感を重視",
    avoidWords: ["治る", "完治", "必ず", "絶対", "効果抜群"],
  },
  金融: {
    mainHint: "将来のお金を見直す",
    benefitHint: "比較検討に必要な情報を整理できる",
    trustHint: "リスク説明・実績・専門性を重視",
    avoidWords: ["必ず儲かる", "元本保証", "絶対"],
  },
  その他: {
    mainHint: "選ぶ理由が伝わる",
    benefitHint: "必要な情報が短時間で伝わる",
    trustHint: "目的に合わせて情報を整理",
    avoidWords: ["必ず", "絶対"],
  },
};

const includesAny = (text: string, words: string[]) =>
  words.some((word) => text.toLowerCase().includes(word.toLowerCase()));

const detectIndustry = (text: string, campaignType: CampaignType, adType: AdType): ResolvedIndustry => {
  const value = text.toLowerCase();

  if (campaignType === "求人") return "人材";
  if (campaignType === "資料請求" || adType === "BtoB") return "SaaS";
  if (includesAny(value, ["美容", "コスメ", "脱毛", "サロン", "エステ", "ネイル", "スキンケア", "ヘア"])) return "美容";
  if (includesAny(value, ["saas", "システム", "ツール", "dx", "crm", "業務", "法人", "btoB", "b2b"])) return "SaaS";
  if (includesAny(value, ["不動産", "マンション", "住宅", "賃貸", "物件", "土地", "リフォーム"])) return "不動産";
  if (includesAny(value, ["スクール", "講座", "学習", "英会話", "塾", "教育", "資格", "研修"])) return "教育";
  if (includesAny(value, ["飲食", "カフェ", "レストラン", "居酒屋", "ランチ", "グルメ", "メニュー"])) return "飲食";
  if (includesAny(value, ["通販", "ec", "ショップ", "販売", "購入", "配送", "セール"])) return "EC";
  if (includesAny(value, ["採用", "求人", "転職", "アルバイト", "パート", "正社員", "スタッフ募集"])) return "人材";
  if (includesAny(value, ["クリニック", "病院", "歯科", "医療", "整体", "診療", "治療"])) return "医療";
  if (includesAny(value, ["保険", "投資", "資産", "ローン", "金融", "税理士", "会計"])) return "金融";

  return "その他";
};

const sanitizeAdCopy = (value: string, avoidWords: string[]) => {
  const replacements: Record<string, string> = {
    実現: "形に",
    変革: "見直し",
    解決: "見直し",
    改善: "見直し",
    効果抜群: "実感しやすい",
    必ず: "しっかり",
    絶対: "きちんと",
    治る: "相談できる",
    完治: "相談",
    痩せる: "スタイル管理",
    直球コピー: "短い案内",
    信頼訴求: "安心材料",
    共感訴求: "共感",
    世界観訴求: "ブランドの魅力",
    比較訴求: "選ぶ理由",
    ベネフィット訴求: "得られる価値",
    権威性訴求: "安心材料",
    訴求: "案内",
    構成: "見せ方",
  };

  return [...avoidWords, ...Object.keys(replacements)].reduce((current, word) => {
    const replacement = replacements[word] || "";
    return current.split(word).join(replacement);
  }, value);
};

const fitCopyLength = (value: string, max: number) => {
  if (value.length <= max) return value;

  const separators = ["、", "。", "・", "で", "を"];
  for (const separator of separators) {
    const index = value.indexOf(separator);
    if (index > 5 && index <= max) return value.slice(0, index);
  }

  return value.slice(0, max);
};

const uniqueCopyBundle = (bundle: CopyBundle, name: string): CopyBundle => {
  const used = new Set<string>();
  const fallback: Partial<Record<keyof CopyBundle, string>> = {
    main: `${name}をチェック`,
    sub: `${name}の魅力をわかりやすく紹介`,
    benefit: `選びやすさが伝わる案内`,
    problem: `今の選択に迷っている方へ`,
    trust: `安心して検討できる情報を紹介`,
    limited: `今だけの情報をチェック`,
    short: `${name}を見る`,
    sns: `これ、ちょっと気になる。`,
    comparison: `比べて選びやすい見せ方`,
    description: `${name}の魅力を、画像内で短く見せるコピーです。`,
  };

  return (Object.keys(bundle) as Array<keyof CopyBundle>).reduce((next, key) => {
    const current = bundle[key].trim();
    const value = current && !used.has(current) ? current : fallback[key] || current;
    used.add(value);
    next[key] = value;
    return next;
  }, {} as CopyBundle);
};

const getCopyLengthScore = (main: string, sub: string, cta: string) => {
  let score = 100;
  if (main.length < 8 || main.length > 22) score -= 20;
  if (sub.length < 16 || sub.length > 42) score -= 20;
  if (cta.length < 3 || cta.length > 12) score -= 15;
  return Math.max(score, 40);
};

const ALL_DESIGNS: DesignPattern[] = [
  {
    title: "Luxury",
    style: "高級感・ミニマル",
    color: "黒・ゴールド・白",
    layout: "余白を大きく取り、中央に商品と短いコピーを配置。",
    purpose: "高単価商材、ブランド訴求、美容、ラグジュアリー向け",
    previewClass: "bg-zinc-950 text-white",
    accentClass: "bg-amber-400 text-zinc-950",
  },
  {
    title: "UGC",
    style: "SNS投稿風・自然体",
    color: "ベージュ・白・自然色",
    layout: "スマホ投稿のような自然な構図。",
    purpose: "口コミ風、D2C商材、Instagram広告向け",
    previewClass: "bg-stone-100 text-stone-950",
    accentClass: "bg-white text-stone-950",
  },
  {
    title: "CTR Impact",
    style: "強インパクト・視認性重視",
    color: "赤・黄色・白",
    layout: "大きな見出し、強い色面、目立つCTA。",
    purpose: "クリック率重視、キャンペーン告知向け",
    previewClass: "bg-red-600 text-white",
    accentClass: "bg-yellow-300 text-red-700",
  },
  {
    title: "Minimal",
    style: "シンプル・清潔感",
    color: "白・グレー・青",
    layout: "情報量を絞り、余白と読みやすさを重視。",
    purpose: "BtoB、SaaS、教育、幅広いサービス向け",
    previewClass: "bg-white text-slate-950",
    accentClass: "bg-blue-600 text-white",
  },
  {
    title: "Sale",
    style: "セール訴求・緊急感",
    color: "赤・オレンジ・黄色",
    layout: "割引・限定・CTAを大きく配置。",
    purpose: "セール、期間限定、キャンペーン、EC向け",
    previewClass: "bg-orange-500 text-white",
    accentClass: "bg-white text-orange-600",
  },
  {
    title: "BtoB",
    style: "信頼感・論理的・実績重視",
    color: "ネイビー・白・ライトブルー",
    layout: "課題、解決策、実績、CTAを整理。",
    purpose: "SaaS、資料請求、無料相談、法人向け",
    previewClass: "bg-slate-900 text-white",
    accentClass: "bg-sky-400 text-slate-950",
  },
  {
    title: "Beauty",
    style: "美容・透明感・清潔感",
    color: "ピンク・白・ベージュ",
    layout: "人物や商品を美しく見せ、理想の変化を伝える。",
    purpose: "美容、コスメ、サロン、女性向け商材",
    previewClass: "bg-rose-50 text-rose-950",
    accentClass: "bg-rose-500 text-white",
  },
  {
    title: "Pop",
    style: "明るい・親しみやすい・SNS映え",
    color: "パステル・ビビッドカラー・白",
    layout: "丸みのある要素と大きめコピーで親近感を作る。",
    purpose: "若年層向け、アプリ、イベント、カジュアル商材",
    previewClass: "bg-violet-500 text-white",
    accentClass: "bg-lime-300 text-violet-950",
  },
  {
    title: "Trust",
    style: "安心感・実績・レビュー重視",
    color: "白・青・緑・グレー",
    layout: "レビュー、実績、数字、保証要素を配置。",
    purpose: "CV重視、比較検討商材、教育、金融系",
    previewClass: "bg-emerald-50 text-emerald-950",
    accentClass: "bg-emerald-600 text-white",
  },
  {
    title: "Premium Simple",
    style: "上質・簡潔・余白重視",
    color: "白・黒・グレージュ",
    layout: "情報を絞り、商品価値とコピーを静かに強く見せる。",
    purpose: "高単価サービス、ブランド訴求、洗練された広告向け",
    previewClass: "bg-neutral-100 text-neutral-950",
    accentClass: "bg-neutral-950 text-white",
  },
];

const SIZE_MAP: Record<BannerSize, { width: number; height: number }> = {
  "1080×1080": { width: 1080, height: 1080 },
  "1200×628": { width: 1200, height: 628 },
  "1080×1920": { width: 1080, height: 1920 },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("analysis");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [product, setProduct] = useState("");
  const [target, setTarget] = useState("");
  const [appeal, setAppeal] = useState("");
  const [style, setStyle] = useState("");
  const [color, setColor] = useState("");
  const [memo, setMemo] = useState("");

  const [campaignType, setCampaignType] = useState<CampaignType>("商品販売");
  const [adType, setAdType] = useState<AdType>("CV重視");
  const [industry, setIndustry] = useState<Industry>("自動判定");
  const [language, setLanguage] = useState<Language>("日本語");
  const [size, setSize] = useState<BannerSize>("1080×1080");
  const [designCount, setDesignCount] = useState<DesignCount>("3枚");

  const [copyTone, setCopyTone] = useState<CopyTone>("強め");
  const [mainCopy, setMainCopy] = useState("");
  const [subCopy, setSubCopy] = useState("");
  const [ctaCopy, setCtaCopy] = useState("今すぐチェック");
  const [benefitCopy, setBenefitCopy] = useState("");
  const [problemCopy, setProblemCopy] = useState("");
  const [trustCopy, setTrustCopy] = useState("");
  const [limitedCopy, setLimitedCopy] = useState("");
  const [shortCopy, setShortCopy] = useState("");
  const [snsCopy, setSnsCopy] = useState("");
  const [comparisonCopy, setComparisonCopy] = useState("");
  const [descriptionCopy, setDescriptionCopy] = useState("");
  const [hasEditedCopy, setHasEditedCopy] = useState(false);

  const [history, setHistory] = useState<SavedHistory[]>([]);
  const [selectedDesignTitles, setSelectedDesignTitles] = useState<string[]>([]);

  const selectedDesignCount = Number(designCount.replace("枚", ""));

  const finalCanvasSize = useMemo(() => {
    const current = SIZE_MAP[size];

    if (selectedDesignCount <= 3) {
      return `${current.width * selectedDesignCount}×${current.height}`;
    }

    const columns = 3;
    const rows = Math.ceil(selectedDesignCount / columns);

    return `${current.width * columns}×${current.height * rows}`;
  }, [size, selectedDesignCount]);

  const layoutInstruction = useMemo(() => {
    if (selectedDesignCount <= 3) return "横1列";
    return "3列グリッド";
  }, [selectedDesignCount]);

  const panel = darkMode
    ? "border-zinc-800 bg-zinc-900 text-white"
    : "border-gray-200 bg-white text-gray-900";

  const softPanel = darkMode
    ? "bg-zinc-800 text-white"
    : "bg-[#F7F8FA] text-gray-900";

  const pageBg = darkMode
    ? "bg-zinc-950 text-white"
    : "bg-[#F5F6F8] text-gray-900";

  const detectedIndustry = useMemo(
    () => detectIndustry(`${product} ${target} ${appeal}`, campaignType, adType),
    [product, target, appeal, campaignType, adType]
  );

  const resolvedIndustry = industry === "自動判定" ? detectedIndustry : industry;

  const industryRule = INDUSTRY_RULES[resolvedIndustry] || INDUSTRY_RULES["その他"];

  const instagramRule = {
    label: "Instagram向け",
    mainMax: 18,
    subMax: 34,
    direction: "世界観・共感・短い言葉を重視",
  };

  const copyLengthScore = useMemo(
    () => getCopyLengthScore(mainCopy, subCopy, ctaCopy),
    [mainCopy, subCopy, ctaCopy]
  );

  const campaignCta = useMemo(() => {
    if (campaignType === "求人") return "応募する";
    if (campaignType === "店舗集客") return "予約する";
    if (campaignType === "商品販売") return "今すぐ購入";
    if (campaignType === "サービス申込") return "申し込む";
    if (campaignType === "リード獲得") return "無料相談する";
    if (campaignType === "LINE登録") return "LINEで受け取る";
    if (campaignType === "資料請求") return "無料で資料を見る";
    if (campaignType === "アプリDL") return "無料でダウンロード";
    if (campaignType === "ブランド認知") return "コンセプトを見る";
    if (campaignType === "イベント") return "イベント詳細を見る";
    return "詳しく見る";
  }, [campaignType]);

  const campaignFocus = useMemo(() => {
    if (campaignType === "求人") {
      return {
        main: "応募したくなる求人広告",
        points: ["職種・勤務地・給与・未経験歓迎を明確にする", "安心感と働きやすさを伝える", "応募CTAを強くする"],
      };
    }

    if (campaignType === "店舗集客") {
      return {
        main: "来店予約につながる集客広告",
        points: ["地域名・雰囲気・口コミ感を重視", "予約や来店のハードルを下げる", "店舗写真風の構図が有効"],
      };
    }

    if (campaignType === "商品販売") {
      return {
        main: "購買意欲を高める商品広告",
        points: ["商品ベネフィットを一瞬で伝える", "価格・限定・使った後の変化を強調", "商品を主役にする"],
      };
    }

    if (campaignType === "サービス申込") {
      return {
        main: "申込につながるサービス広告",
        points: ["課題解決と導入メリットを明確化", "不安を減らす信頼要素を入れる", "申込CTAをわかりやすくする"],
      };
    }

    if (campaignType === "リード獲得") {
      return {
        main: "問い合わせにつながるリード広告",
        points: ["無料相談・診断・特典を強調", "信頼性と専門性を出す", "入力ハードルを下げる"],
      };
    }

    if (campaignType === "LINE登録") {
      return {
        main: "LINE登録につながる広告",
        points: ["登録特典を明確にする", "無料・限定・簡単さを強調", "スマホ視認性を重視"],
      };
    }

    if (campaignType === "資料請求") {
      return {
        main: "資料請求につながる広告",
        points: ["法人向けの信頼感を重視", "資料で得られる情報を明確にする", "導入事例や実績感を入れる"],
      };
    }

    if (campaignType === "アプリDL") {
      return {
        main: "アプリDLにつながる広告",
        points: ["アプリ画面・体験価値を伝える", "無料・簡単・便利を強調", "DL後のメリットを見せる"],
      };
    }

    if (campaignType === "ブランド認知") {
      return {
        main: "世界観を伝えるブランド広告",
        points: ["世界観・トーン・余白を重視", "ブランド名を覚えやすく見せる", "売り込み感を弱める"],
      };
    }

    if (campaignType === "イベント") {
      return {
        main: "参加につながるイベント広告",
        points: ["日時・場所・参加メリットを明確にする", "限定感と楽しさを出す", "参加CTAを目立たせる"],
      };
    }

    return {
      main: "目的に合わせた広告",
      points: ["広告目的を明確にする", "ターゲットに合わせたCTAにする", "伝える内容を絞る"],
    };
  }, [campaignType]);

  const buildCopyBundle = (
    currentCampaignType: CampaignType,
    currentIndustry: ResolvedIndustry,
    currentAdType: AdType,
    name: string,
    point: string,
    audience: string
  ): CopyBundle => {
    const safePoint = point.trim();
    const safeAudience = audience.trim() || "検討中の方";

    const industryWords: Record<ResolvedIndustry, {
      item: string;
      main: string;
      sub: string;
      benefit: string;
      problem: string;
      trust: string;
      sns: string;
      comparison: string;
    }> = {
      美容: {
        item: "美容アイテム",
        main: "毎日のケアをもっと気軽に",
        sub: "続けやすさにこだわった美容アイテム",
        benefit: "自分に合うケアを見つけやすい",
        problem: "今のケアに物足りなさを感じている方へ",
        trust: "初めての方にも選ばれている人気アイテム",
        sns: "最近これ使ってる人多い",
        comparison: "使いやすさで選びたい方へ",
      },
      SaaS: {
        item: "業務ツール",
        main: "業務改善をもっとスムーズに",
        sub: "導入前に知りたい情報をまとめて確認",
        benefit: "毎日の作業を見直しやすくなる",
        problem: "今の運用にムダを感じている方へ",
        trust: "導入前に確認したいポイントを整理",
        sns: "こういうツール、探してた",
        comparison: "資料で比べてから選べる",
      },
      不動産: {
        item: "住まい",
        main: "理想の暮らしに近づく住まい",
        sub: "立地・価格・暮らしやすさをまとめて確認",
        benefit: "納得して住まいを選びやすい",
        problem: "物件選びで迷っている方へ",
        trust: "相談しやすさと実績が伝わる案内",
        sns: "この部屋、ちょっと見てみたい",
        comparison: "暮らしやすさで比べたい方へ",
      },
      教育: {
        item: "学習サービス",
        main: "学びを次の一歩へ",
        sub: "続けやすい学習環境がわかる案内",
        benefit: "自分のペースで成長を目指せる",
        problem: "学び直しを始めたい方へ",
        trust: "カリキュラムと受講環境を確認できる",
        sns: "これなら続けられそう",
        comparison: "続けやすさで選びたい方へ",
      },
      飲食: {
        item: "人気メニュー",
        main: "今日行きたいお店に",
        sub: "人気メニューとお店の雰囲気を紹介",
        benefit: "来店前に食べたい理由が見つかる",
        problem: "今日のお店選びに迷っている方へ",
        trust: "写真でお店の雰囲気がわかる",
        sns: "ここ、次行きたい",
        comparison: "雰囲気でお店を選びたい方へ",
      },
      EC: {
        item: "人気アイテム",
        main: "欲しいが見つかる",
        sub: "価格・レビュー・使いやすさを比較",
        benefit: "買う前に選ぶ理由がわかる",
        problem: "買う決め手がほしい方へ",
        trust: "レビューを見ながら選びやすい",
        sns: "これ、買ってよかった系",
        comparison: "レビューで比べて選べる",
      },
      人材: {
        item: "仕事",
        main: "自分らしく働ける場所へ",
        sub: "仕事内容と職場の雰囲気がわかる求人",
        benefit: "応募前に働くイメージが持てる",
        problem: "今の働き方を見直したい方へ",
        trust: "未経験から始めやすい仕事です",
        sns: "この職場、ちょっと良さそう",
        comparison: "条件だけでなく働きやすさで選ぶ",
      },
      医療: {
        item: "相談先",
        main: "まずは気軽に相談を",
        sub: "不安なことを相談しやすい案内",
        benefit: "悩みを整理して相談しやすい",
        problem: "不安をそのままにしたくない方へ",
        trust: "丁寧に相談できる環境です",
        sns: "相談しやすそうで安心",
        comparison: "安心して相談できる場所を選ぶ",
      },
      金融: {
        item: "相談サービス",
        main: "将来のお金を見直す",
        sub: "比較検討に必要な情報をまとめて確認",
        benefit: "自分に合う選択肢を考えやすい",
        problem: "お金の判断に迷っている方へ",
        trust: "専門家に相談しながら考えられる",
        sns: "一度ちゃんと見直したい",
        comparison: "条件を比べて納得して選ぶ",
      },
      その他: {
        item: "サービス",
        main: `${name}をチェック`,
        sub: "魅力と選ぶ理由を短く紹介",
        benefit: "短時間で価値が伝わる",
        problem: "何を選ぶか迷っている方へ",
        trust: "安心して検討できる情報を紹介",
        sns: "これ、ちょっと気になる",
        comparison: "比べて選びやすい案内",
      },
    };

    const i = industryWords[currentIndustry] || industryWords["その他"];

    const campaignCopy: Record<CampaignType, CopyBundle> = {
      商品販売: {
        main: currentIndustry === "美容" ? "理想の自分を目指すなら" : `${name}を選ぶ理由`,
        sub: currentIndustry === "美容" ? "毎日のケアに取り入れやすい人気アイテム" : `${i.item}の魅力を短く紹介`,
        benefit: currentIndustry === "美容" ? "毎日の習慣に取り入れやすい" : "買う前に魅力がひと目でわかる",
        problem: currentIndustry === "美容" ? "今のケアに物足りなさを感じている方へ" : "どれを選ぶか迷っている方へ",
        trust: currentIndustry === "美容" ? "初めての方にも選ばれている人気アイテム" : "レビューを見ながら選びやすい",
        limited: "今だけの案内をチェック",
        short: `${name}を見る`,
        sns: i.sns,
        comparison: i.comparison,
        description: `${safeAudience}に向けて、画像内で商品の魅力と選ぶ理由を短く見せます。`,
      },
      店舗集客: {
        main: currentIndustry === "飲食" ? "今日行きたいお店に" : `気軽に立ち寄れる${name}`,
        sub: currentIndustry === "飲食" ? "人気メニューとお店の雰囲気を紹介" : "雰囲気と通いやすさが伝わる案内",
        benefit: "来店前に魅力がわかる",
        problem: "行き先に迷っている方へ",
        trust: "写真で雰囲気が伝わる案内",
        limited: "今週行きたい場所をチェック",
        short: "お店を見る",
        sns: currentIndustry === "飲食" ? "ここ、次行きたい" : "ここ、保存しておきたい",
        comparison: "雰囲気で選びたい方へ",
        description: `${safeAudience}に向けて、来店したくなる理由を画像内で短く見せます。`,
      },
      求人: {
        main: "自分らしく働ける環境へ",
        sub: "仕事内容と職場の雰囲気がわかる求人",
        benefit: "応募前に働くイメージが持てる",
        problem: "今の働き方を見直したい方へ",
        trust: "未経験から始めやすい仕事です",
        limited: "募集枠があるうちにチェック",
        short: "求人を見る",
        sns: "この職場、ちょっと良さそう",
        comparison: "条件だけでなく働きやすさで選ぶ",
        description: `${safeAudience}に向けて、働くメリットと応募しやすさを画像内で伝えます。`,
      },
      サービス申込: {
        main: `${name}を気軽に始める`,
        sub: "はじめてでも内容がわかる案内",
        benefit: "申込前の不安を減らせる",
        problem: "そろそろ見直したい方へ",
        trust: "利用の流れがわかりやすい",
        limited: "始めやすい今のうちに",
        short: "申し込む",
        sns: "これなら始めやすそう",
        comparison: "内容を見てから決められる",
        description: `${safeAudience}に向けて、申込前に知りたい内容を画像内で短く見せます。`,
      },
      リード獲得: {
        main: "まずは無料で相談",
        sub: "相談するメリットがすぐにわかる案内",
        benefit: "自分に合う選択肢を確認できる",
        problem: "ひとりで判断しにくい方へ",
        trust: "気軽に相談しやすい窓口です",
        limited: "無料相談を受付中",
        short: "相談する",
        sns: "相談だけできるのは助かる",
        comparison: "調べ続けるより、まず相談",
        description: `${safeAudience}に向けて、無料相談しやすい理由を画像内で見せます。`,
      },
      LINE登録: {
        main: "お得な情報をLINEで",
        sub: "登録するメリットがすぐにわかる案内",
        benefit: "最新情報や特典を受け取りやすい",
        problem: "大事な案内を見逃したくない方へ",
        trust: "登録後に届く内容がわかる",
        limited: "LINE限定情報をチェック",
        short: "LINE登録する",
        sns: "LINEで届くの便利そう",
        comparison: "探すよりLINEで受け取る",
        description: `${safeAudience}に向けて、LINE登録の手軽さと特典を画像内で伝えます。`,
      },
      資料請求: {
        main: `${name}を資料で確認`,
        sub: "導入前に知りたい情報をまとめて確認",
        benefit: "比較検討に必要な情報が手に入る",
        problem: "判断材料が足りず迷っている方へ",
        trust: "特徴・料金・事例を確認できる",
        limited: "無料資料を今すぐチェック",
        short: "資料を見る",
        sns: "資料だけ見られるのは助かる",
        comparison: "資料で比べてから選べる",
        description: `${safeAudience}に向けて、資料で確認できる内容を画像内で短く見せます。`,
      },
      アプリDL: {
        main: `${name}で、もっと手軽に`,
        sub: "スマホでかんたんに使えるアプリ",
        benefit: "毎日の手間を少し減らせる",
        problem: "もっと手軽に済ませたい方へ",
        trust: "使いやすさが伝わる案内",
        limited: "無料で始められる今のうちに",
        short: "アプリで体験",
        sns: "このアプリ、普通に便利",
        comparison: "面倒な手順よりアプリでかんたんに",
        description: `${safeAudience}に向けて、アプリの便利さを画像内で短く見せます。`,
      },
      ブランド認知: {
        main: currentIndustry === "不動産" ? "理想の暮らしを叶える住まい" : `${name}の魅力を知る`,
        sub: currentIndustry === "不動産" ? "上質な空間設計にこだわりました" : "ブランドの魅力が自然に伝わる案内",
        benefit: "価値観に合うブランドと出会える",
        problem: "自分に合う選択を探している方へ",
        trust: "売り込みすぎず印象に残る見せ方",
        limited: "今、注目したいブランド体験",
        short: `${name}を知る`,
        sns: "この雰囲気、けっこう好き",
        comparison: "価格だけでなく雰囲気で選ぶ",
        description: `${safeAudience}に向けて、ブランドの印象と魅力を画像内で見せます。`,
      },
      イベント: {
        main: `${name}で特別な体験を`,
        sub: "参加したくなる理由がすぐにわかる案内",
        benefit: "今しかできない体験を楽しめる",
        problem: "週末の予定を探している方へ",
        trust: "日時・場所・内容がわかりやすい",
        limited: "期間限定イベント開催中",
        short: "イベントを見る",
        sns: "これ、友だちと行きたい",
        comparison: "見るだけより参加して楽しむ",
        description: `${safeAudience}に向けて、イベントの楽しさと参加理由を画像内で見せます。`,
      },
      その他: {
        main: `${name}をチェック`,
        sub: "魅力と選ぶ理由を短く紹介",
        benefit: "短時間で価値が伝わる",
        problem: "何を選ぶか迷っている方へ",
        trust: "安心して検討できる情報を紹介",
        limited: "気になった今がチェックのタイミング",
        short: `${name}を見る`,
        sns: "これ、ちょっと気になる",
        comparison: "比べて選びやすい案内",
        description: `${safeAudience}に向けて、魅力と選ぶ理由を画像内で短く見せます。`,
      },
    };

    const adTypeCopy: Record<AdType, Partial<CopyBundle>> = {
      CV重視: {
        main: currentCampaignType === "商品販売" ? `${name}を選ぶ理由` : campaignCopy[currentCampaignType].main,
        sub: "迷わず次の行動に進める案内",
        trust: "初めてでも判断しやすい情報を紹介",
        short: campaignCta,
      },
      CTR重視: {
        main: currentIndustry === "飲食" ? "今日ここ行かない？" : "これ、気になりませんか？",
        sub: "思わず続きを見たくなる短い見出し",
        short: "まずは見る",
        sns: "気になって保存したくなる",
      },
      高級ブランド: {
        main: currentIndustry === "美容" ? "ワンランク上のケア体験" : `ワンランク上の${name}`,
        sub: "上質な印象が残るシンプルな案内",
        benefit: "日常を少し上質にする選択",
        comparison: "価格だけでなく価値で選ぶ",
        sns: "この雰囲気、ちゃんと上品",
      },
      UGC風: {
        main: currentCampaignType === "求人" ? "この職場、ちょっと気になる" : i.sns,
        sub: "投稿になじむ自然なひとこと",
        problem: "もっと早く知りたかった方へ",
        sns: currentCampaignType === "店舗集客" ? "ここ、保存しておきたい" : i.sns,
        comparison: "リアルな使用感で選びやすい",
      },
      セール訴求: {
        main: currentCampaignType === "求人" ? "今だけ応募受付中" : "今だけ特別価格",
        sub: "期間限定キャンペーン実施中",
        benefit: "今チェックする理由がわかる",
        limited: "期間限定の案内をチェック",
        short: "今すぐ見る",
      },
      BtoB: {
        main: currentCampaignType === "資料請求" ? `${name}を資料で比較` : `${name}で業務を見直す`,
        sub: "導入前に確認したい内容を整理",
        benefit: "検討に必要な情報をまとめて確認できる",
        problem: "属人的な運用を見直したい方へ",
        trust: "法人導入前に確認しやすい資料です",
        comparison: "感覚ではなく資料で比較する",
      },
    };

    const copyToneCopy: Record<CopyTone, Partial<CopyBundle>> = {
      強め: {
        main: currentCampaignType === "求人" ? "今の働き方を変えるなら" : currentIndustry === "美容" && currentCampaignType === "商品販売" ? "理想の自分を目指すなら" : `${name}を選ぶなら今`,
        sub: currentIndustry === "美容" && currentCampaignType === "商品販売" ? "毎日のケアに取り入れやすい人気アイテム" : "今チェックしたい理由がすぐにわかる",
      },
      自然: {
        main: i.main,
        sub: i.sub,
      },
      高級: {
        main: currentIndustry === "美容" ? "ワンランク上のケア体験" : `ワンランク上の${name}`,
        sub: currentIndustry === "美容" ? "上質な使い心地にこだわりました" : "上質な印象が残るシンプルな案内",
      },
      共感: {
        main: currentCampaignType === "求人" ? "今の働き方、見直しませんか？" : "その悩み、そろそろ手放しませんか？",
        sub: `${safeAudience}に寄り添うやさしい案内`,
      },
      悩み解決: {
        main: "その悩みに、次の選択を",
        sub: safePoint ? `${safePoint}で迷っている方へ` : i.problem,
      },
      実績: {
        main: currentCampaignType === "求人" ? "働きやすさで選ばれる職場" : `選ばれている${name}`,
        sub: currentIndustry === "美容" ? "多くの方に選ばれている人気アイテム" : "選ばれる理由を短く紹介",
      },
      限定: {
        main: currentCampaignType === "求人" ? "今だけ募集受付中" : "今だけ特別案内",
        sub: "期間限定のメリットをチェック",
        limited: "期間限定の案内をチェック",
      },
      お得: {
        main: `${name}を賢く始める`,
        sub: "お得に試したい方へ向けた案内",
      },
      SNS風: {
        main: currentCampaignType === "店舗集客" ? "ここ、保存しておきたい" : i.sns,
        sub: "Instagramになじむ自然なひとこと",
      },
      BtoB: {
        main: currentCampaignType === "資料請求" ? `${name}を資料で比較` : `${name}で業務を見直す`,
        sub: "導入前に確認したい内容を整理",
      },
    };

    return {
      ...campaignCopy[currentCampaignType],
      ...adTypeCopy[currentAdType],
      ...copyToneCopy[copyTone],
      description: `${safeAudience}に向けて、広告タイプ「${currentCampaignType}」、業種「${currentIndustry}」、コピータイプ「${copyTone}」に合わせた画像内コピーです。`,
    };
  };

  const generateCopies = () => {
    const name = product.trim() || "商品・サービス";
    const point = appeal.trim() || industryRule.mainHint;
    const audience = target.trim() || "検討中の方";

    const rawCopy = buildCopyBundle(campaignType, resolvedIndustry, adType, name, point, audience);

    const sanitized = (Object.keys(rawCopy) as Array<keyof CopyBundle>).reduce((next, key) => {
      const max = key === "main" ? instagramRule.mainMax : key === "sub" ? instagramRule.subMax : 80;
      next[key] = fitCopyLength(sanitizeAdCopy(rawCopy[key], industryRule.avoidWords), max);
      return next;
    }, {} as CopyBundle);

    const unique = uniqueCopyBundle(sanitized, name);

    setMainCopy(unique.main);
    setSubCopy(unique.sub);
    setCtaCopy(campaignCta);
    setBenefitCopy(unique.benefit);
    setProblemCopy(unique.problem);
    setTrustCopy(unique.trust);
    setLimitedCopy(unique.limited);
    setShortCopy(unique.short);
    setSnsCopy(unique.sns);
    setComparisonCopy(unique.comparison);
    setDescriptionCopy(unique.description);
    setHasEditedCopy(false);
  };

  useEffect(() => {
    const savedForm = localStorage.getItem("meta-banner-form");
    const savedHistory = localStorage.getItem("meta-banner-history");
    const savedSelectedDesigns = localStorage.getItem("meta-banner-selected-designs");

    if (savedForm) {
      const data = JSON.parse(savedForm);

      setProduct(data.product || "");
      setTarget(data.target || "");
      setAppeal(data.appeal || "");
      setStyle(data.style || "");
      setColor(data.color || "");
      setMemo(data.memo || "");
      setCampaignType(data.campaignType || "商品販売");
      setAdType(data.adType || "CV重視");
      setIndustry(data.industry || "自動判定");
      setLanguage(data.language || "日本語");
      setSize(data.size || "1080×1080");
      setDesignCount(data.designCount || "3枚");
      setDarkMode(data.darkMode || false);
      setCopyTone(data.copyTone || "強め");
      setMainCopy(data.mainCopy || "");
      setSubCopy(data.subCopy || "");
      setCtaCopy(data.ctaCopy || "今すぐチェック");
      setBenefitCopy(data.benefitCopy || "");
      setProblemCopy(data.problemCopy || "");
      setTrustCopy(data.trustCopy || "");
      setLimitedCopy(data.limitedCopy || "");
      setShortCopy(data.shortCopy || "");
      setSnsCopy(data.snsCopy || "");
      setComparisonCopy(data.comparisonCopy || "");
      setDescriptionCopy(data.descriptionCopy || "");
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    if (savedSelectedDesigns) {
      setSelectedDesignTitles(JSON.parse(savedSelectedDesigns));
    }
  }, []);

  useEffect(() => {
    if (!hasEditedCopy) {
      generateCopies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, target, appeal, copyTone, campaignType, adType, industry, size]);

  useEffect(() => {
    setSelectedDesignTitles((current) => current.slice(0, selectedDesignCount));
  }, [selectedDesignCount]);

  useEffect(() => {
    localStorage.setItem("meta-banner-selected-designs", JSON.stringify(selectedDesignTitles));
  }, [selectedDesignTitles]);

  const qualityScore = useMemo(() => {
    let score = 35;

    if (campaignType) score += 8;
    if (product.trim()) score += 10;
    if (target.trim()) score += 12;
    if (appeal.trim()) score += 13;
    if (mainCopy.trim()) score += 7;
    if (subCopy.trim()) score += 5;
    if (ctaCopy.trim()) score += 5;
    if (benefitCopy.trim()) score += 3;
    if (problemCopy.trim()) score += 3;
    if (trustCopy.trim()) score += 3;
    if (style.trim()) score += 2;
    if (color.trim()) score += 2;

    return Math.min(score, 100);
  }, [
    campaignType,
    product,
    target,
    appeal,
    mainCopy,
    subCopy,
    ctaCopy,
    benefitCopy,
    problemCopy,
    trustCopy,
    style,
    color,
  ]);

  const analysisScores = useMemo(() => {
    const scrollStopRate =
      adType === "CTR重視" || adType === "セール訴求" ? 92 : adType === "UGC風" ? 84 : 76;

    const clickPotential =
      adType === "CTR重視" ? 94 : campaignType === "LINE登録" || campaignType === "アプリDL" ? 88 : 78;

    const conversionPotential =
      adType === "CV重視" || campaignType === "資料請求" || campaignType === "リード獲得" ? 92 : 76;

    const trustLevel =
      adType === "BtoB" || campaignType === "求人" || campaignType === "資料請求" ? 92 : 78;

    const clarity =
      product && target && appeal ? 90 : product && appeal ? 75 : 62;

    return {
      scrollStopRate,
      clickPotential,
      conversionPotential,
      trustLevel,
      clarity,
    };
  }, [adType, campaignType, product, target, appeal]);

  const persona = useMemo(() => {
    if (campaignType === "求人") {
      return [
        "求職中・転職検討中のユーザー",
        "勤務地・給与・働きやすさ・未経験可を重視",
        "応募前の不安を減らす情報に反応しやすい",
      ];
    }

    if (campaignType === "店舗集客") {
      return [
        "近隣エリアで店舗を探しているユーザー",
        "口コミ・雰囲気・価格・予約のしやすさを重視",
        "地域名や来店後の体験が伝わる広告に反応しやすい",
      ];
    }

    if (target.includes("法人") || target.includes("BtoB") || target.includes("企業")) {
      return [
        "企業担当者・意思決定者・マーケティング担当者",
        "ROI、導入実績、信頼性、業務効率化を重視",
        "問い合わせや資料請求につながる明確なCTAが有効",
      ];
    }

    if (target.includes("女性")) {
      return [
        "25〜34歳女性",
        "InstagramやTikTokで情報収集する傾向",
        "口コミ、実例、Before/Afterに興味を持ちやすい",
      ];
    }

    return [
      "SNSや検索で情報収集する一般ユーザー",
      "短時間で価値が伝わる広告に反応しやすい",
      "難しい説明より、直感的に価値が伝わる表現が有効",
    ];
  }, [campaignType, target]);

  const emotionalHooks = useMemo(() => {
    const hooks: string[] = [];

    if (campaignType === "求人") hooks.push("安心感：未経験・働きやすさ・応募しやすさ");
    if (campaignType === "店舗集客") hooks.push("近さ・体験価値：行ってみたいと思わせる");
    if (campaignType === "商品販売") hooks.push("ベネフィット：使った後の変化を想像させる");
    if (campaignType === "資料請求") hooks.push("信頼感：比較検討に必要な情報を提示");
    if (appeal.includes("無料")) hooks.push("損失回避：無料なら試してみたい心理");
    if (appeal.includes("限定")) hooks.push("希少性：今だけ感による行動促進");
    if (appeal.includes("時短")) hooks.push("時短欲求：面倒を減らしたい心理");
    if (appeal.includes("実績") || appeal.includes("口コミ")) hooks.push("社会的証明：他人の評価による安心感");

    if (hooks.length === 0) {
      hooks.push("興味喚起：まず目に止める", "比較心理：他の商品より良さそうと思わせる");
    }

    return hooks;
  }, [campaignType, appeal]);

  const ctaSuggestions = useMemo(() => {
    if (campaignType === "求人") return ["今すぐ応募", "募集要項を見る", "まずは相談", "職場を見てみる"];
    if (campaignType === "店舗集客") return ["予約する", "店舗を見る", "空き状況を見る", "来店予約はこちら"];
    if (campaignType === "商品販売") return ["今すぐ購入", "商品を見る", "限定価格を見る", "カートに入れる"];
    if (campaignType === "サービス申込") return ["申し込む", "無料で始める", "詳細を見る", "相談する"];
    if (campaignType === "リード獲得") return ["無料相談する", "診断する", "問い合わせる", "今すぐ相談"];
    if (campaignType === "LINE登録") return ["LINEで受け取る", "友だち追加", "無料特典を受け取る", "LINE登録する"];
    if (campaignType === "資料請求") return ["無料で資料を見る", "無料で資料請求", "導入事例を見る", "詳細資料を受け取る"];
    if (campaignType === "アプリDL") return ["無料でダウンロード", "アプリを試す", "今すぐ使う", "ダウンロード"];
    if (campaignType === "ブランド認知") return ["コンセプトを見る", "ブランドサイトを見る", "世界観を見る", "ラインナップを見る"];
    if (campaignType === "イベント") return ["イベント詳細を見る", "参加する", "詳細を見る", "申し込む"];
    return [campaignCta, "詳しく見る", "今すぐチェック", "詳細を見る"];
  }, [campaignType, campaignCta]);

  const ctrImprovements = useMemo(() => {
    const tips: string[] = [];

    if (!product.trim()) tips.push("商品名を具体的にすると、広告の説得力が上がります。");
    if (!target.trim()) tips.push("ターゲット像を具体化すると、クリック率改善につながります。");
    if (!appeal.trim()) tips.push("主な強みを入力すると、広告で一番目立たせるべきメッセージが明確になります。");
    if (!mainCopy.trim()) tips.push("メインコピーを入力すると、バナーの第一印象が強くなります。");
    if (!ctaCopy.trim()) tips.push("CTAを入力すると、クリック行動を促しやすくなります。");
    tips.push(`文字数スコアは${copyLengthScore}点です。メイン12〜20文字、サブ20〜35文字、CTA4〜10文字を目安にしてください。`);

    if (campaignType === "求人") tips.push("求人広告では、勤務地・給与・未経験可・シフト情報を入れると応募率が上がりやすいです。");
    if (campaignType === "店舗集客") tips.push("店舗集客では、地域名・口コミ・予約しやすさを入れると来店につながりやすいです。");
    if (campaignType === "商品販売") tips.push("商品広告では、商品写真を主役にして、使った後の変化を見せると効果的です。");
    if (campaignType === "資料請求") tips.push("資料請求では、得られる情報・導入事例・実績を見せるとCVしやすくなります。");

    if (tips.length === 0) {
      tips.push("入力内容は十分具体的です。複数デザインでA/Bテストするのがおすすめです。");
    }

    return tips;
  }, [campaignType, product, target, appeal, mainCopy, subCopy, ctaCopy, copyLengthScore]);

  const recommendedDesigns = useMemo(() => {
    const scoreDesign = (title: string) => {
      let score = 0;
      const text = `${campaignType} ${adType} ${resolvedIndustry} ${product} ${target} ${appeal}`.toLowerCase();

      if (campaignType === "求人" && ["Trust", "Minimal", "BtoB"].includes(title)) score += 10;
      if (campaignType === "店舗集客" && ["UGC", "Pop", "Beauty"].includes(title)) score += 10;
      if (campaignType === "商品販売" && ["Sale", "CTR Impact", "UGC"].includes(title)) score += 10;
      if (campaignType === "資料請求" && ["BtoB", "Trust", "Minimal"].includes(title)) score += 10;
      if (campaignType === "LINE登録" && ["Pop", "CTR Impact", "Sale"].includes(title)) score += 10;
      if (campaignType === "ブランド認知" && ["Luxury", "Premium Simple", "Minimal"].includes(title)) score += 10;

      if (adType === "高級ブランド" && ["Luxury", "Premium Simple", "Beauty"].includes(title)) score += 8;
      if (adType === "UGC風" && ["UGC", "Pop", "Beauty"].includes(title)) score += 8;
      if (adType === "CTR重視" && ["CTR Impact", "Pop", "Sale"].includes(title)) score += 8;
      if (adType === "CV重視" && ["Trust", "Minimal", "BtoB"].includes(title)) score += 8;
      if (adType === "セール訴求" && ["Sale", "CTR Impact", "Pop"].includes(title)) score += 8;
      if (adType === "BtoB" && ["BtoB", "Trust", "Minimal"].includes(title)) score += 8;

      if (text.includes("美容") || text.includes("コスメ") || text.includes("女性")) {
        if (["Beauty", "UGC", "Luxury"].includes(title)) score += 4;
      }

      if (text.includes("法人") || text.includes("saas") || text.includes("資料") || text.includes("企業")) {
        if (["BtoB", "Trust", "Minimal"].includes(title)) score += 4;
      }

      return score;
    };

    return [...ALL_DESIGNS]
      .sort((a, b) => scoreDesign(b.title) - scoreDesign(a.title))
      .slice(0, selectedDesignCount);
  }, [campaignType, adType, resolvedIndustry, product, target, appeal, selectedDesignCount]);

  const selectedDesigns = useMemo(() => {
    if (selectedDesignTitles.length === 0) return recommendedDesigns;

    const selected = selectedDesignTitles
      .map((title) => ALL_DESIGNS.find((design) => design.title === title))
      .filter((design): design is DesignPattern => Boolean(design));

    return selected.slice(0, selectedDesignCount);
  }, [recommendedDesigns, selectedDesignTitles, selectedDesignCount]);

  const primaryPreviewDesign = selectedDesigns[0] || ALL_DESIGNS[0];

  const chartData = [
    { subject: "停止率", value: analysisScores.scrollStopRate },
    { subject: "クリック", value: analysisScores.clickPotential },
    { subject: "CV", value: analysisScores.conversionPotential },
    { subject: "信頼感", value: analysisScores.trustLevel },
    { subject: "明確さ", value: analysisScores.clarity },
  ];

  const prompt = useMemo(() => {
    const designInstructions = selectedDesigns
      .map(
        (design, index) => `
【${index + 1}. ${design.title}】
スタイル: ${design.style}
カラー: ${color || design.color}`
      )
      .join("\n");

    return `Meta広告用バナーを作成してください。

【広告情報】
広告ジャンル: ${campaignType}
広告タイプ: ${adType}
業界: ${resolvedIndustry}（選択: ${industry}）
媒体: Instagram
商品・サービス: ${product || "未入力"}
ターゲット: ${target || "未入力"}
主な強み: ${appeal || "未入力"}
目的: ${campaignFocus.main}
媒体別方針: ${instagramRule.direction}

【サイズ】
各バナー: ${size}
出力サイズ: ${finalCanvasSize}
レイアウト: ${layoutInstruction}

【コピー】
メイン: ${mainCopy || "未入力"}
サブ: ${subCopy || "未入力"}
CTA: ${ctaCopy || campaignCta}

【補助コピー】
ベネフィット: ${benefitCopy || "未入力"}
悩み・共感: ${problemCopy || "未入力"}
安心材料: ${trustCopy || "未入力"}

【デザイン案】
${designInstructions}

【広告ジャンル別の重要ポイント】
${campaignFocus.points.map((point) => `- ${point}`).join("\n")}

【デザインルール】
- Meta広告向け
- スマホで視認性高く
- 文字は大きく読みやすく
- CTAは目立たせる
- 各バナーは完全に独立
- 各バナーで構図・配色・CTA表現を変える
- 3枚以下は横1列、4枚以上は3列グリッド
- 比較表・コラージュは禁止

【出力】
${finalCanvasSize} 相当の1枚のキャンバスに、${size} 相当の独立した広告バナーを ${selectedDesignCount} 個、${layoutInstruction}で生成してください。`;
  }, [
    selectedDesigns,
    selectedDesignCount,
    campaignType,
    campaignFocus,
    campaignCta,
    adType,
    industry,
    resolvedIndustry,
    instagramRule.direction,
    product,
    target,
    appeal,
    size,
    finalCanvasSize,
    layoutInstruction,
    mainCopy,
    subCopy,
    ctaCopy,
    benefitCopy,
    problemCopy,
    trustCopy,
    color,
  ]);

  const saveForm = () => {
    const data = {
      product,
      target,
      appeal,
      style,
      color,
      memo,
      campaignType,
      adType,
      industry,
      language,
      size,
      designCount,
      darkMode,
      copyTone,
      mainCopy,
      subCopy,
      ctaCopy,
      benefitCopy,
      problemCopy,
      trustCopy,
      limitedCopy,
      shortCopy,
      snsCopy,
      comparisonCopy,
      descriptionCopy,
      selectedDesignTitles,
    };

    localStorage.setItem("meta-banner-form", JSON.stringify(data));

    const newHistory: SavedHistory = {
      id: Date.now(),
      product: product || "未入力",
      target: target || "未入力",
      appeal: appeal || "未入力",
      campaignType,
      adType,
      createdAt: new Date().toLocaleString(),
      prompt,
    };

    const nextHistory = [newHistory, ...history].slice(0, 30);

    setHistory(nextHistory);
    localStorage.setItem("meta-banner-history", JSON.stringify(nextHistory));

    alert("保存しました");
  };

  const resetForm = () => {
    const ok = confirm("入力内容をリセットしますか？");
    if (!ok) return;

    localStorage.removeItem("meta-banner-form");
    localStorage.removeItem("meta-banner-selected-designs");

    setProduct("");
    setTarget("");
    setAppeal("");
    setStyle("");
    setColor("");
    setMemo("");
    setCampaignType("商品販売");
    setAdType("CV重視");
    setIndustry("自動判定");
    setLanguage("日本語");
    setSize("1080×1080");
    setDesignCount("3枚");
    setCopyTone("強め");
    setMainCopy("");
    setSubCopy("");
    setCtaCopy("今すぐチェック");
    setBenefitCopy("");
    setProblemCopy("");
    setTrustCopy("");
    setLimitedCopy("");
    setShortCopy("");
    setSnsCopy("");
    setComparisonCopy("");
    setDescriptionCopy("");
    setHasEditedCopy(false);
    setSelectedDesignTitles([]);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    alert("コピーしました");
  };

  const openChatGPT = async () => {
    try {
      setLoading(true);
      await navigator.clipboard.writeText(prompt);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const deleteHistoryItem = (id: number) => {
    const ok = confirm("この保存データを削除しますか？");
    if (!ok) return;

    const nextHistory = history.filter((item) => item.id !== id);
    setHistory(nextHistory);
    localStorage.setItem("meta-banner-history", JSON.stringify(nextHistory));
  };

  const toggleDesign = (title: string) => {
    setSelectedDesignTitles((current) => {
      if (current.includes(title)) {
        return current.filter((item) => item !== title);
      }

      if (current.length >= selectedDesignCount) {
        return current;
      }

      return [...current, title];
    });
  };

  return (
    <main className={`min-h-screen ${pageBg}`}>
      <div className="mx-auto max-w-[1680px] px-4 py-5 sm:px-6 lg:px-8">
        <header className={`sticky top-0 z-50 mb-5 rounded-2xl border px-5 py-4 shadow-sm backdrop-blur ${darkMode ? "border-zinc-800 bg-zinc-900/95 text-white" : "border-gray-200 bg-white/95 text-gray-900"}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <LayoutDashboard className="text-blue-600" />
                <h1 className="text-2xl font-black tracking-tight">Meta Creative Studio</h1>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-500">
                広告ジャンルに合わせて、コピー・デザイン・生成プロンプトを作成します。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={copyPrompt} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-sm hover:bg-gray-50">
                コピー
              </button>

              <a
                href="https://chatgpt.com/"
                target="_blank"
                rel="noopener noreferrer"
                onMouseDown={openChatGPT}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
              >
                バナーを作る
              </a>

              <button onClick={() => setDarkMode(!darkMode)} className={`rounded-xl border px-3 py-2 ${darkMode ? "border-zinc-700 bg-zinc-800" : "border-gray-200 bg-white"}`}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-5">
          <aside className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${panel}`}>
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-blue-600"><ClipboardList size={18} /></div>
                    <h2 className="text-base font-black">広告設定</h2>
                  </div>
                  <p className="mt-1 text-xs font-medium text-gray-500">
                    よく使う項目だけを上にまとめました。詳細は必要な時だけ開けます。
                  </p>
                </div>

                <div className={`rounded-xl border border-gray-200 px-4 py-3 text-sm ${softPanel}`}>
                  <div className="font-black">{finalCanvasSize}</div>
                  <div className="mt-1 text-xs font-medium opacity-75">
                    {size} / {layoutInstruction} / {resolvedIndustry} / Instagram向け
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
                <Input label="商品・サービス名" value={product} onChange={setProduct} placeholder="例：AI英会話アプリ / カフェスタッフ募集" />
                <Select label="広告ジャンル" value={campaignType} onChange={(v) => setCampaignType(v as CampaignType)} options={CAMPAIGN_TYPES} />
                <Select label="業界" value={industry} onChange={(v) => setIndustry(v as Industry)} options={INDUSTRIES} />
                <Select label="広告タイプ" value={adType} onChange={(v) => setAdType(v as AdType)} options={["CV重視", "CTR重視", "高級ブランド", "UGC風", "セール訴求", "BtoB"]} />
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <Input label="ターゲット" value={target} onChange={setTarget} placeholder="例：20代女性 / 渋谷周辺の求職者" />
                <Textarea label="主な強み" value={appeal} onChange={setAppeal} placeholder="例：1日5分、初月無料、未経験歓迎、駅近" rows={3} />
              </div>

              <details className={`rounded-xl border border-gray-200 ${softPanel}`}>
                <summary className="cursor-pointer select-none px-4 py-3 text-sm font-black">
                  詳細設定を開く
                </summary>
                <div className="grid gap-4 border-t border-gray-200 p-4 md:grid-cols-2 xl:grid-cols-4">
                  <Select label="出力言語" value={language} onChange={(v) => setLanguage(v as Language)} options={["日本語", "英語"]} />
                  <Select label="画像サイズ" value={size} onChange={(v) => setSize(v as BannerSize)} options={["1080×1080", "1200×628", "1080×1920"]} />
                  <Select label="デザインパターン数" value={designCount} onChange={(v) => setDesignCount(v as DesignCount)} options={DESIGN_COUNTS} />
                  <Input label="カラー" value={color} onChange={setColor} placeholder="未入力なら自動で最適化" />
                  <Input label="デザインテイスト" value={style} onChange={setStyle} placeholder="未入力なら自動で最適化" />
                  <div className="md:col-span-2 xl:col-span-3">
                    <Textarea label="追加メモ" value={memo} onChange={setMemo} placeholder="例：広告感を弱めたい" rows={3} />
                  </div>
                </div>
              </details>

              <div className="sticky bottom-3 z-20 grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:static sm:flex sm:justify-end sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
                <button onClick={saveForm} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 sm:min-w-32">
                  <Save size={17} />
                  保存
                </button>

                <button onClick={resetForm} className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 sm:min-w-32">
                  <RotateCcw size={17} />
                  リセット
                </button>
              </div>

              {loading && (
                <div className="rounded-xl bg-blue-50 p-4 text-sm font-bold text-blue-700">
                  生成内容をコピーしています...
                </div>
              )}
            </div>
          </aside>

          <section className="min-w-0 space-y-5">
            <StepBar
              qualityScore={qualityScore}
              hasProduct={Boolean(product.trim())}
              hasCopy={Boolean(mainCopy.trim() && subCopy.trim() && ctaCopy.trim())}
              selectedDesignCount={selectedDesigns.length}
            />


            <div className={`rounded-2xl border shadow-sm ${panel}`}>
              <div className={`sticky top-0 z-30 border-b px-4 pt-2 ${darkMode ? "border-zinc-800 bg-zinc-900/95" : "border-gray-200 bg-white/95"} backdrop-blur`}>
                <div className="flex gap-5 overflow-x-auto">
                  <TabButton active={activeTab === "analysis"} onClick={() => setActiveTab("analysis")} icon={<BarChart3 size={17} />} label="改善チェック" />
                  <TabButton active={activeTab === "copies"} onClick={() => setActiveTab("copies")} icon={<MessageSquareText size={17} />} label="バナー文字案" />
                  <TabButton active={activeTab === "designs"} onClick={() => setActiveTab("designs")} icon={<Sparkles size={17} />} label="デザイン選択" />
                  <TabButton active={activeTab === "prompt"} onClick={() => setActiveTab("prompt")} icon={<FileText size={17} />} label="プロンプト" />
                  <TabButton active={activeTab === "guide"} onClick={() => setActiveTab("guide")} icon={<Lightbulb size={17} />} label="使い方" />
                  <TabButton active={activeTab === "saved"} onClick={() => setActiveTab("saved")} icon={<History size={17} />} label="保存欄" />
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {activeTab === "analysis" && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 lg:grid-cols-2">
                    <Card title="広告品質スコア" icon={<BarChart3 />} panel={panel}>
                      <div className="mx-auto mt-6 h-44 w-44 sm:h-56 sm:w-56">
                        <CircularProgressbar
                          value={qualityScore}
                          text={`${qualityScore}%`}
                          styles={buildStyles({
                            textSize: "16px",
                            pathColor: "#2563eb",
                            textColor: darkMode ? "#ffffff" : "#111827",
                          })}
                        />
                      </div>
                    </Card>

                    <Card title="クリエイティブ評価" icon={<Eye />} panel={panel}>
                      <div className="mt-6 h-[260px] sm:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={chartData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.35} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card title="広告ジャンル別ポイント" icon={<Target />} panel={panel}>
                      <List items={[campaignFocus.main, ...campaignFocus.points]} />
                    </Card>

                    <Card title="想定ペルソナ" icon={<Target />} panel={panel}>
                      <List items={persona} />
                    </Card>

                    <Card title="感情フック" icon={<Lightbulb />} panel={panel}>
                      <List items={emotionalHooks} />
                    </Card>

                    <Card title="推奨CTA" icon={<Wand2 />} panel={panel}>
                      <List items={ctaSuggestions} />
                    </Card>

                    <Card title="CTR / CV 改善提案" icon={<BarChart3 />} panel={panel}>
                      <List items={ctrImprovements} />
                    </Card>
                  </motion.div>
                )}

                {activeTab === "copies" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className={`rounded-xl p-5 ${softPanel}`}>
                      <h2 className="text-xl font-black">バナー文字案</h2>
                      <p className="mt-2 text-sm font-medium leading-7 opacity-80">
                        ここに出る文言は、画像内に入れるための候補です。メインコピーは一番大きい見出し、サブコピーは補足説明、CTAはボタン風に見せる行動文言として使います。
                      </p>
                      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-3 text-gray-700">
                          <div className="font-black text-gray-900">メインコピー</div>
                          <p className="mt-1 leading-6">画像で最も目立たせる一言。第一印象を作ります。</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-3 text-gray-700">
                          <div className="font-black text-gray-900">サブコピー</div>
                          <p className="mt-1 leading-6">見出しを補足する短い説明。理由や魅力を伝えます。</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-3 text-gray-700">
                          <div className="font-black text-gray-900">CTA</div>
                          <p className="mt-1 leading-6">クリック・予約・応募など、次の行動を促す文言です。</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
                      <div className="space-y-4">
                        <Select label="コピータイプ" value={copyTone} onChange={(v) => setCopyTone(v as CopyTone)} options={COPY_TONES} />

                        <button onClick={generateCopies} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">
                          コピー更新
                        </button>

                        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                          <div className="font-black text-gray-900">現在の推奨CTA</div>
                          <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 font-bold text-blue-700">{campaignCta}</div>
                        </div>
                      </div>

                      <div className="grid gap-5 xl:grid-cols-2">
                        <Input label="メインコピー（画像の主見出し）" value={mainCopy} onChange={(value) => { setMainCopy(value); setHasEditedCopy(true); }} />
                        <Input label="CTA（ボタン風の行動文言）" value={ctaCopy} onChange={(value) => { setCtaCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="サブコピー（主見出しの補足）" value={subCopy} onChange={(value) => { setSubCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="ベネフィットコピー（得られる価値）" value={benefitCopy} onChange={(value) => { setBenefitCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="悩み・共感コピー（画像内の一言）" value={problemCopy} onChange={(value) => { setProblemCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="安心材料コピー（画像内の補足）" value={trustCopy} onChange={(value) => { setTrustCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="限定コピー（今見る理由）" value={limitedCopy} onChange={(value) => { setLimitedCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="短尺コピー（小さな装飾文言）" value={shortCopy} onChange={(value) => { setShortCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="SNS風コピー（投稿風の一言）" value={snsCopy} onChange={(value) => { setSnsCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="比較コピー（選ぶ理由）" value={comparisonCopy} onChange={(value) => { setComparisonCopy(value); setHasEditedCopy(true); }} />
                        <div className="xl:col-span-2">
                          <Textarea label="長め説明コピー（生成プロンプト用の意図説明）" value={descriptionCopy} onChange={(value) => { setDescriptionCopy(value); setHasEditedCopy(true); }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "designs" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div className={`rounded-xl p-5 ${softPanel}`}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-black">デザイン選択</h2>
                          <p className="mt-2 text-sm font-medium leading-7 opacity-80">
                            1〜9枚まで選択できます。4枚以上は3列グリッドで生成します。
                          </p>
                        </div>

                        <button onClick={() => setSelectedDesignTitles([])} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50">
                          選択解除
                        </button>
                      </div>

                      <div className="mt-4 text-sm font-bold">
                        選択中：{selectedDesignTitles.length === 0 ? `推奨 ${selectedDesignCount}件` : `${selectedDesignTitles.length} / ${selectedDesignCount}件`}
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                      {ALL_DESIGNS.map((design) => {
                        const isSelected = selectedDesignTitles.includes(design.title);
                        const isAutoRecommended = selectedDesignTitles.length === 0 && selectedDesigns.some((item) => item.title === design.title);
                        const isDisabled = !isSelected && selectedDesignTitles.length >= selectedDesignCount;

                        return (
                          <motion.button
                            whileHover={{ y: -2 }}
                            key={design.title}
                            type="button"
                            onClick={() => toggleDesign(design.title)}
                            disabled={isDisabled}
                            className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition ${
                              isSelected || isAutoRecommended ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-200"
                            } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:shadow-md"}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-xs font-black text-gray-500">
                                  {isSelected ? "選択中" : isAutoRecommended ? "推奨" : "デザイン案"}
                                </div>
                                <h3 className="mt-2 text-2xl font-black text-gray-950">{design.title}</h3>
                              </div>

                              {(isSelected || isAutoRecommended) && (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                                  <Check size={16} />
                                </div>
                              )}
                            </div>

                            <div className="mt-5 space-y-3">
                              <Info title="スタイル" value={design.style} />
                              <Info title="カラー" value={color || design.color} />
                              <Info title="レイアウト" value={design.layout} />
                              <Info title="用途" value={design.purpose} />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === "prompt" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="mb-4 flex flex-wrap gap-3">
                      <button onClick={copyPrompt} className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-bold text-gray-800 hover:bg-gray-50">
                        コピー
                      </button>

                      <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" onMouseDown={openChatGPT} className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">
                        バナーを作る
                      </a>
                    </div>

                    <pre className="max-h-[720px] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-gray-950 p-5 text-sm leading-7 text-green-400">
                      {prompt}
                    </pre>
                  </motion.div>
                )}

                {activeTab === "guide" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div className={`rounded-xl p-5 ${softPanel}`}>
                      <h2 className="text-xl font-black">使い方</h2>
                      <p className="mt-2 text-sm font-medium leading-7 opacity-80">
                        広告ジャンル、商品情報、コピー、デザインを選ぶだけで生成プロンプトを作成できます。
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card title="1. 広告ジャンルを選ぶ" icon={<Target />} panel={panel}>
                        <List items={["求人・店舗集客・商品販売などを選択", "広告目的に合ったCTAへ自動調整", "デザイン推奨もジャンルに合わせて変化"]} />
                      </Card>

                      <Card title="2. コピーを調整" icon={<MessageSquareText />} panel={panel}>
                        <List items={["コピータイプを選択", "コピー更新で文字案を作成", "必要に応じて直接編集"]} />
                      </Card>

                      <Card title="3. デザインを選択" icon={<Sparkles />} panel={panel}>
                        <List items={["1〜9枚から選択", "3枚以下は横1列", "4枚以上は3列グリッド"]} />
                      </Card>

                      <Card title="4. バナーを作る" icon={<Wand2 />} panel={panel}>
                        <List items={["プロンプトをコピー", "ChatGPTを開く", "貼り付けて画像生成"]} />
                      </Card>
                    </div>
                  </motion.div>
                )}

                {activeTab === "saved" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div className={`rounded-xl p-5 ${softPanel}`}>
                      <h2 className="text-xl font-black">保存欄</h2>
                      <p className="mt-2 text-sm font-medium opacity-80">
                        保存データはこの端末・このブラウザの localStorage に保存されます。他の人とは共有されません。
                      </p>
                    </div>

                    {history.length === 0 && <div className="font-bold opacity-70">保存データはまだありません。</div>}

                    {history.length > 0 && (
                      <div className="overflow-hidden rounded-xl border border-gray-200">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[860px] border-collapse bg-white text-left text-sm text-gray-900">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                              <tr>
                                <th className="px-4 py-3">商品</th>
                                <th className="px-4 py-3">ジャンル</th>
                                <th className="px-4 py-3">ターゲット</th>
                                <th className="px-4 py-3">強み</th>
                                <th className="px-4 py-3">保存日時</th>
                                <th className="px-4 py-3 text-right">操作</th>
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                              {history.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                  <td className="max-w-[180px] truncate px-4 py-4 font-bold">{item.product}</td>
                                  <td className="px-4 py-4">{item.campaignType}</td>
                                  <td className="max-w-[180px] truncate px-4 py-4">{item.target}</td>
                                  <td className="max-w-[220px] truncate px-4 py-4">{item.appeal}</td>
                                  <td className="px-4 py-4 text-gray-500">{item.createdAt}</td>
                                  <td className="px-4 py-4">
                                    <div className="flex justify-end gap-2">
                                      <button onClick={() => navigator.clipboard.writeText(item.prompt)} className="rounded-lg border border-gray-200 px-3 py-2 font-bold hover:bg-gray-50">
                                        <Copy size={15} />
                                      </button>

                                      <button onClick={() => deleteHistoryItem(item.id)} className="rounded-lg bg-red-600 px-3 py-2 font-bold text-white hover:bg-red-700">
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            <PreviewArea
              panel={panel}
              softPanel={softPanel}
              designs={selectedDesigns}
              mainCopy={mainCopy}
              subCopy={subCopy}
              ctaCopy={ctaCopy}
              product={product}
              size={size}
              finalCanvasSize={finalCanvasSize}
              layoutInstruction={layoutInstruction}
              campaignType={campaignType}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

function StepBar({
  qualityScore,
  hasProduct,
  hasCopy,
  selectedDesignCount,
}: {
  qualityScore: number;
  hasProduct: boolean;
  hasCopy: boolean;
  selectedDesignCount: number;
}) {
  const steps = [
    { label: "情報入力", done: hasProduct },
    { label: "コピー作成", done: hasCopy },
    { label: "デザイン選択", done: selectedDesignCount > 0 },
    { label: "生成準備", done: qualityScore >= 70 },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-black text-gray-900">制作ステップ</h2>
          <p className="mt-1 text-xs font-medium text-gray-500">入力から生成までの進行状況です。</p>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${step.done ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                {step.done ? <Check size={15} /> : index + 1}
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-gray-900">{step.label}</div>
                <div className="text-xs text-gray-500">{step.done ? "完了" : "未完了"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewArea({
  panel,
  softPanel,
  designs,
  mainCopy,
  subCopy,
  ctaCopy,
  product,
  size,
  finalCanvasSize,
  layoutInstruction,
  campaignType,
}: {
  panel: string;
  softPanel: string;
  designs: DesignPattern[];
  mainCopy: string;
  subCopy: string;
  ctaCopy: string;
  product: string;
  size: BannerSize;
  finalCanvasSize: string;
  layoutInstruction: string;
  campaignType: CampaignType;
}) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${panel}`}>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-black">プレビュー</h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            実際の広告に近い見た目で、コピーとデザイン方向性を確認できます。
          </p>
        </div>

        <div className={`rounded-xl px-4 py-3 text-sm font-bold ${softPanel}`}>
          {size} / {layoutInstruction} / 最終 {finalCanvasSize}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex min-w-max gap-4">
          {designs.map((design, index) => (
            <div key={`${design.title}-${index}`} className="w-[260px] shrink-0">
              <AdPreviewCard
                design={design}
                mainCopy={mainCopy}
                subCopy={subCopy}
                ctaCopy={ctaCopy}
                product={product}
                badge={`${index + 1}`}
                campaignType={campaignType}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdPreviewCard({
  design,
  mainCopy,
  subCopy,
  ctaCopy,
  product,
  badge,
  campaignType,
}: {
  design: DesignPattern;
  mainCopy: string;
  subCopy: string;
  ctaCopy: string;
  product: string;
  badge: string;
  campaignType: CampaignType;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-xs text-gray-500">
        <div className="font-bold">Sponsored</div>
        <div>{campaignType}</div>
      </div>

      <div className={`relative aspect-square overflow-hidden p-5 ${design.previewClass}`}>
        <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">
          {badge}
        </div>

        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="text-xs font-bold opacity-75">{product || "Product"}</div>
            <div className="mt-5 max-w-[92%] text-3xl font-black leading-tight">
              {mainCopy || "メインコピー"}
            </div>
            <p className="mt-4 max-w-[90%] text-sm font-semibold leading-6 opacity-85">
              {subCopy || "サブコピーが入ります"}
            </p>
          </div>

          <div>
            <div className={`inline-flex rounded-full px-5 py-3 text-sm font-black shadow-sm ${design.accentClass}`}>
              {ctaCopy || "詳しく見る"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 text-xs font-bold text-gray-500">
        <span>Meta Ad Preview</span>
        <span>CTA</span>
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-2">
        <div className="text-blue-600">{icon}</div>
        <h2 className="text-sm font-black">{title}</h2>
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Card({
  title,
  icon,
  children,
  panel,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  panel: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${panel}`}>
      <div className="flex items-center gap-3">
        <div className="text-blue-600">{icon}</div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm font-medium leading-7">
      {items.map((item) => (
        <li key={item}>・{item}</li>
      ))}
    </ul>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 border-b-2 px-1 py-4 text-sm font-bold transition ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-100 p-3 text-black">
      <div className="text-xs font-bold text-gray-500">{title}</div>
      <div className="mt-1 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}