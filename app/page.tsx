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

type AdType =
  | "CV重視"
  | "CTR重視"
  | "高級ブランド"
  | "UGC風"
  | "セール訴求"
  | "BtoB";

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
  | "9枚"
  | "10枚";

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
  adType: AdType;
  createdAt: string;
  prompt: string;
};

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
  "10枚",
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

  const [adType, setAdType] = useState<AdType>("CV重視");
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
    return `${current.width * selectedDesignCount}×${current.height}`;
  }, [size, selectedDesignCount]);

  const panel = darkMode
    ? "border-zinc-800 bg-zinc-900 text-white"
    : "border-gray-200 bg-white text-gray-900";

  const softPanel = darkMode
    ? "bg-zinc-800 text-white"
    : "bg-[#F7F8FA] text-gray-900";

  const pageBg = darkMode
    ? "bg-zinc-950 text-white"
    : "bg-[#F5F6F8] text-gray-900";

  const generateCopies = () => {
    const name = product.trim() || "商品・サービス";
    const point = appeal.trim() || "魅力";
    const audience = target.trim() || "あなた";

    if (copyTone === "強め") {
      setMainCopy(`${name}で今すぐ成果を変える`);
      setSubCopy(`${point}を一瞬で伝え、行動したくなる広告にする`);
      setCtaCopy("今すぐチェック");
      setBenefitCopy(`${point}で、迷わず選ばれる理由を作る`);
      setProblemCopy(`まだ${name}を試していないなら、機会損失かもしれません`);
      setTrustCopy(`選ばれる理由がひと目で伝わる設計`);
      setLimitedCopy(`今だけのチャンスを逃さない`);
      setShortCopy(`成果を変える${name}`);
      setSnsCopy(`これ、もっと早く知りたかった。`);
      setComparisonCopy(`従来の迷いを減らし、次の行動につなげる`);
      setDescriptionCopy(`${audience}に向けて、${point}を強くわかりやすく伝える広告コピーです。`);
    }

    if (copyTone === "自然") {
      setMainCopy(`${name}をもっと身近に`);
      setSubCopy(`${point}を自然に伝え、SNSになじむ広告にする`);
      setCtaCopy("詳しく見る");
      setBenefitCopy(`毎日の中で自然に使える${name}`);
      setProblemCopy(`無理なく続けられる方法を探している方へ`);
      setTrustCopy(`自然体で伝わるから、共感されやすい`);
      setLimitedCopy(`気になった今が、始めどき`);
      setShortCopy(`もっと自然に、もっと便利に`);
      setSnsCopy(`最近これ、かなり良かった。`);
      setComparisonCopy(`押し売り感なく、価値が伝わる`);
      setDescriptionCopy(`${audience}に自然になじむトーンで、${point}をやさしく伝えます。`);
    }

    if (copyTone === "高級") {
      setMainCopy(`上質な${name}を`);
      setSubCopy(`${point}を洗練された世界観で伝える`);
      setCtaCopy("詳細を見る");
      setBenefitCopy(`日常を一段上げる、上質な選択`);
      setProblemCopy(`妥協しない人のための${name}`);
      setTrustCopy(`品質と世界観で選ばれるブランド体験`);
      setLimitedCopy(`限られた方へ届けたい特別な価値`);
      setShortCopy(`上質を、あなたに`);
      setSnsCopy(`この上品さ、ちゃんと伝わる。`);
      setComparisonCopy(`価格ではなく、価値で選ばれる`);
      setDescriptionCopy(`${audience}に向けて、高級感・信頼感・洗練された印象を重視したコピーです。`);
    }

    if (copyTone === "共感") {
      setMainCopy(`その悩み、${name}で変えられる`);
      setSubCopy(`${audience}の気持ちに寄り添い、${point}をやさしく伝える`);
      setCtaCopy("まずは見てみる");
      setBenefitCopy(`無理せず、自分らしく変われる`);
      setProblemCopy(`頑張っているのに、なかなか変わらないあなたへ`);
      setTrustCopy(`同じ悩みを持つ人に選ばれています`);
      setLimitedCopy(`始めるなら、今の気持ちが動いたタイミングで`);
      setShortCopy(`もう一人で悩まない`);
      setSnsCopy(`これ、私のことかも。`);
      setComparisonCopy(`我慢ではなく、解決できる選択へ`);
      setDescriptionCopy(`${audience}の悩みや不安に共感し、行動への心理的ハードルを下げるコピーです。`);
    }

    if (copyTone === "悩み解決") {
      setMainCopy(`${point}の悩みを解決`);
      setSubCopy(`${name}で、今の課題をわかりやすく改善へ導く`);
      setCtaCopy("解決方法を見る");
      setBenefitCopy(`悩みを放置せず、具体的な一歩へ`);
      setProblemCopy(`こんな悩み、後回しにしていませんか？`);
      setTrustCopy(`課題から逆算したわかりやすい提案`);
      setLimitedCopy(`今なら始めやすいタイミング`);
      setShortCopy(`悩みを、解決へ`);
      setSnsCopy(`これで悩みがかなりラクになった。`);
      setComparisonCopy(`悩み続けるより、解決策を選ぶ`);
      setDescriptionCopy(`${audience}の課題を明確化し、${name}を解決策として提示するコピーです。`);
    }

    if (copyTone === "実績") {
      setMainCopy(`選ばれる${name}`);
      setSubCopy(`${point}と信頼感を伝え、比較検討中の不安を減らす`);
      setCtaCopy("実績を見る");
      setBenefitCopy(`選ばれている理由がわかる`);
      setProblemCopy(`失敗したくない選択だからこそ、信頼できるものを`);
      setTrustCopy(`実績・レビュー・安心感で選ばれる`);
      setLimitedCopy(`信頼できる選択を、今すぐ確認`);
      setShortCopy(`信頼で選ぶなら`);
      setSnsCopy(`みんなが選ぶ理由、わかった。`);
      setComparisonCopy(`なんとなく選ぶより、実績で選ぶ`);
      setDescriptionCopy(`${audience}が安心して判断できるよう、信頼・実績・レビュー感を重視したコピーです。`);
    }

    if (copyTone === "限定") {
      setMainCopy(`今だけ、${name}をお得に`);
      setSubCopy(`${point}を期間限定感と一緒に強く訴求する`);
      setCtaCopy("限定価格を見る");
      setBenefitCopy(`今始める理由がある特別なチャンス`);
      setProblemCopy(`後で見ようと思って、逃していませんか？`);
      setTrustCopy(`限定でも価値が伝わる安心設計`);
      setLimitedCopy(`期間限定・数量限定の特別オファー`);
      setShortCopy(`今だけ限定`);
      setSnsCopy(`これ、今だけらしい。`);
      setComparisonCopy(`いつかより、今がお得`);
      setDescriptionCopy(`${audience}に向けて、希少性・緊急性・今すぐ行動する理由を強めたコピーです。`);
    }

    if (copyTone === "お得") {
      setMainCopy(`${name}を賢く始める`);
      setSubCopy(`${point}をお得感とわかりやすさで伝える`);
      setCtaCopy("お得に始める");
      setBenefitCopy(`コストを抑えて、しっかり価値を実感`);
      setProblemCopy(`高いだけの選択で損していませんか？`);
      setTrustCopy(`価格だけでなく、価値も納得できる`);
      setLimitedCopy(`今なら始めやすい特典つき`);
      setShortCopy(`賢く、お得に`);
      setSnsCopy(`これなら試しやすい。`);
      setComparisonCopy(`価格も価値も、納得できる選択へ`);
      setDescriptionCopy(`${audience}に向けて、コスパ・無料・割引・始めやすさを伝えるコピーです。`);
    }

    if (copyTone === "SNS風") {
      setMainCopy(`これ、ほんとに便利`);
      setSubCopy(`${name}の${point}を投稿風に自然に伝える`);
      setCtaCopy("投稿を見る");
      setBenefitCopy(`使ってみたくなるリアルな魅力`);
      setProblemCopy(`もっと早く知りたかった、と思える選択`);
      setTrustCopy(`リアルな使用感が伝わる見せ方`);
      setLimitedCopy(`気になった人からチェック中`);
      setShortCopy(`これ、いいかも`);
      setSnsCopy(`最近使ってよかったもの。`);
      setComparisonCopy(`広告っぽさより、リアルな共感で伝える`);
      setDescriptionCopy(`${audience}に向けて、InstagramやTikTokになじむ自然な投稿風コピーです。`);
    }

    if (copyTone === "BtoB") {
      setMainCopy(`${name}で業務を効率化`);
      setSubCopy(`${point}をわかりやすく伝え、問い合わせや資料請求につなげる`);
      setCtaCopy("資料を見る");
      setBenefitCopy(`業務負担を減らし、成果につながる仕組みへ`);
      setProblemCopy(`今の業務フローに、ムダが残っていませんか？`);
      setTrustCopy(`法人導入に必要な信頼感を重視`);
      setLimitedCopy(`まずは無料相談・資料請求から`);
      setShortCopy(`業務改善を、次の段階へ`);
      setSnsCopy(`現場のムダ、そろそろ見直したい。`);
      setComparisonCopy(`属人的な運用から、仕組み化された運用へ`);
      setDescriptionCopy(`法人担当者・意思決定者に向けて、課題解決・効率化・信頼性を重視したコピーです。`);
    }

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
      setAdType(data.adType || "CV重視");
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
  }, [product, target, appeal, copyTone]);

  useEffect(() => {
    setSelectedDesignTitles((current) => current.slice(0, selectedDesignCount));
  }, [selectedDesignCount]);

  useEffect(() => {
    localStorage.setItem("meta-banner-selected-designs", JSON.stringify(selectedDesignTitles));
  }, [selectedDesignTitles]);

  const qualityScore = useMemo(() => {
    let score = 40;

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

  const persona = useMemo(() => {
    if (target.includes("女性")) {
      return [
        "25〜34歳女性",
        "InstagramやTikTokで情報収集する傾向",
        "美容・ライフスタイル・時短・コスパに反応しやすい",
        "口コミ、実例、Before/Afterに興味を持ちやすい",
        "広告っぽすぎる表現より、自然で共感できる見せ方を好む",
      ];
    }

    if (target.includes("男性")) {
      return [
        "25〜40代男性",
        "効率・成果・スペック・コスパを重視",
        "メリットや実績が明確な広告に反応しやすい",
        "比較・レビュー・数字訴求を確認してから行動する傾向",
      ];
    }

    if (target.includes("法人") || target.includes("BtoB") || target.includes("企業")) {
      return [
        "企業担当者・意思決定者・マーケティング担当者",
        "ROI、導入実績、信頼性、業務効率化を重視",
        "清潔感・実績感・信頼感のあるデザインに反応しやすい",
        "問い合わせや資料請求につながる明確なCTAが有効",
      ];
    }

    return [
      "SNSや検索で情報収集する一般ユーザー",
      "興味を持った後に比較検討する傾向",
      "第一印象でメリットが伝わる広告に反応しやすい",
      "難しい説明より、直感的に価値が伝わる表現が有効",
    ];
  }, [target]);

  const emotionalHooks = useMemo(() => {
    const hooks: string[] = [];

    if (appeal.includes("無料")) hooks.push("損失回避：無料なら試してみたい心理");
    if (appeal.includes("限定")) hooks.push("希少性：今だけ感による行動促進");
    if (appeal.includes("時短")) hooks.push("時短欲求：面倒を減らしたい心理");
    if (appeal.includes("簡単")) hooks.push("不安解消：自分にもできそうという安心感");
    if (appeal.includes("高級")) hooks.push("憧れ：上質な体験への期待");
    if (appeal.includes("安い") || appeal.includes("割引")) hooks.push("お得感：今買う理由を作る");
    if (appeal.includes("実績") || appeal.includes("口コミ")) hooks.push("社会的証明：他人の評価による安心感");

    if (hooks.length === 0) {
      hooks.push(
        "興味喚起：まず目に止める",
        "比較心理：他の商品より良さそうと思わせる",
        "ベネフィット訴求：使った後の変化を想像させる"
      );
    }

    return hooks;
  }, [appeal]);

  const ctaSuggestions = useMemo(() => {
    if (adType === "CV重視") return ["今すぐ無料体験", "30秒で登録", "無料で始める", "まずは試してみる"];
    if (adType === "CTR重視") return ["詳しく見る", "今すぐチェック", "続きを見る", "詳細を見る"];
    if (adType === "高級ブランド") return ["上質な体験を見る", "ブランドを見る", "詳細はこちら", "ラインナップを見る"];
    if (adType === "UGC風") return ["実際の声を見る", "投稿を見る", "詳しく見る", "試してみる"];
    if (adType === "セール訴求") return ["限定価格を見る", "今すぐ申し込む", "セールを見る", "お得に始める"];
    return ["資料を見る", "無料相談する", "導入事例を見る", "問い合わせる"];
  }, [adType]);

  const ctrImprovements = useMemo(() => {
    const tips: string[] = [];

    if (!product.trim()) tips.push("商品名を入力すると、バナー文字案とデザイン指示が具体化できます。");
    if (!target.trim()) tips.push("ターゲットを年齢・性別・悩みまで具体化するとCTRが上がりやすくなります。");
    if (!appeal.trim()) tips.push("訴求を入力すると、広告で一番目立たせるべきメッセージが明確になります。");
    if (!mainCopy.trim()) tips.push("メインコピーを入力すると、バナーの第一印象が強くなります。");
    if (!subCopy.trim()) tips.push("サブコピーを入力すると、補足説明が伝わりやすくなります。");
    if (!ctaCopy.trim()) tips.push("CTAを入力すると、クリック行動を促しやすくなります。");
    if (!benefitCopy.trim()) tips.push("ベネフィットコピーを入れると、使った後の変化が伝わりやすくなります。");
    if (!problemCopy.trim()) tips.push("悩み訴求を入れると、ターゲットの自分ごと化がしやすくなります。");
    if (!trustCopy.trim()) tips.push("信頼訴求を入れると、CV前の不安を減らせます。");

    if (tips.length === 0) {
      tips.push(
        "入力内容は十分具体的です。複数デザイン生成でA/Bテストするのがおすすめです。",
        "CTR重視なら見出しをさらに短く強く、CV重視なら信頼要素を追加しましょう。"
      );
    }

    return tips;
  }, [
    product,
    target,
    appeal,
    mainCopy,
    subCopy,
    ctaCopy,
    benefitCopy,
    problemCopy,
    trustCopy,
  ]);

  const recommendedDesigns = useMemo(() => {
    const scoreDesign = (title: string) => {
      let score = 0;
      const text = `${adType} ${product} ${target} ${appeal}`.toLowerCase();

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

      if (text.includes("無料") || text.includes("限定") || text.includes("割引") || text.includes("セール")) {
        if (["Sale", "CTR Impact", "Pop"].includes(title)) score += 4;
      }

      return score;
    };

    return [...ALL_DESIGNS]
      .sort((a, b) => scoreDesign(b.title) - scoreDesign(a.title))
      .slice(0, selectedDesignCount);
  }, [adType, product, target, appeal, selectedDesignCount]);

  const selectedDesigns = useMemo(() => {
    if (selectedDesignTitles.length === 0) return recommendedDesigns;

    const selected = selectedDesignTitles
      .map((title) => ALL_DESIGNS.find((design) => design.title === title))
      .filter((design): design is DesignPattern => Boolean(design));

    return selected.slice(0, selectedDesignCount);
  }, [recommendedDesigns, selectedDesignTitles, selectedDesignCount]);

  const primaryPreviewDesign = selectedDesigns[0] || ALL_DESIGNS[0];

  const chartData = [
    { subject: "CTR", value: adType === "CTR重視" ? 95 : 76 },
    { subject: "CV", value: adType === "CV重視" ? 95 : 72 },
    { subject: "信頼感", value: adType === "BtoB" ? 95 : 78 },
    { subject: "UGC感", value: adType === "UGC風" ? 95 : 66 },
    { subject: "高級感", value: adType === "高級ブランド" ? 95 : 62 },
  ];

  const prompt = useMemo(() => {
    const designInstructions = selectedDesigns
      .map(
        (design, index) => `
【バナー ${index + 1}: ${design.title}】
- デザインテイスト: ${design.style}
- 推奨カラー: ${color || design.color}
- レイアウト方針: ${design.layout}
- 向いている用途: ${design.purpose}
- 他のバナーと明確に違う見た目、構図、色使いにしてください。`
      )
      .join("\n");

    const personaText = persona.map((item) => `- ${item}`).join("\n");
    const hookText = emotionalHooks.map((item) => `- ${item}`).join("\n");
    const ctaText = ctaSuggestions.map((item) => `- ${item}`).join("\n");
    const improvementText = ctrImprovements.map((item) => `- ${item}`).join("\n");

    return `あなたはMeta広告に強いプロの広告デザイナー兼クリエイティブディレクターです。
さらに、広告運用・CTR改善・CV改善に詳しいマーケティング戦略担当者として考えてください。

以下の入力内容をもとに、Facebook / Instagram広告で成果が出やすいバナー画像を作成してください。

【最重要ルール】
- 出力は横並びレイアウトにしてください。
- ${selectedDesignCount}種類のデザイン違いのMeta広告バナーを、1枚の横長キャンバスに横並びで配置してください。
- 各バナーは完全に独立した別デザインにしてください。
- 1バナー = 1広告クリエイティブとして成立する構成にしてください。
- 指定サイズ（${size}）は「各バナー1枚ごとのサイズ」です。
- 最終的な横長キャンバスサイズは ${finalCanvasSize} 相当です。
- 比較表デザイン・コラージュ風は禁止です。
- 各バナーごとに、配色・構図・フォント・CTAデザイン・雰囲気を明確に変えてください。

【生成するバナー数】
${selectedDesignCount}種類

【各バナーのサイズ】
${size}

【最終出力サイズ】
${finalCanvasSize}

【商品・サービス】
${product || "未入力"}

【ターゲット】
${target || "未入力"}

【主な訴求】
${appeal || "未入力"}

【広告タイプ】
${adType}

【コピータイプ】
${copyTone}

【メインコピー】
${mainCopy || "未入力"}

【サブコピー】
${subCopy || "未入力"}

【CTA】
${ctaCopy || "未入力"}

【ベネフィットコピー】
${benefitCopy || "未入力"}

【悩み訴求コピー】
${problemCopy || "未入力"}

【信頼訴求コピー】
${trustCopy || "未入力"}

【限定訴求コピー】
${limitedCopy || "未入力"}

【短尺コピー】
${shortCopy || "未入力"}

【SNS風コピー】
${snsCopy || "未入力"}

【比較訴求コピー】
${comparisonCopy || "未入力"}

【長め説明コピー】
${descriptionCopy || "未入力"}

【希望デザインテイスト】
${style || "未入力のため、商品・ターゲット・訴求から最適なテイストを判断してください"}

【希望カラー】
${color || "未入力のため、商品・ターゲット・訴求から最適な配色を判断してください"}

【追加メモ】
${memo || "なし"}

【想定ペルソナ】
${personaText}

【感情フック】
${hookText}

【推奨CTA案】
${ctaText}

【CTR / CV 改善観点】
${improvementText}

【デザインパターン指示】
${designInstructions}

【プロ向けデザイン共通ルール】
- Meta広告向けに、スマホ表示でも一瞬で内容が伝わるようにしてください。
- メインコピーは大きく、視認性高く配置してください。
- CTAは目立つ場所に配置し、クリックしたくなる見せ方にしてください。
- 情報を詰め込みすぎず、余白を活かしてください。
- 商品・ターゲット・訴求内容に合わせて、フォント、配色、構図、写真/イラストの方向性を最適化してください。
- 汎用テンプレートではなく、この入力内容に合った広告クリエイティブにしてください。
- 高級感が必要なら余白とミニマル表現を重視してください。
- CTR重視なら強いコントラスト、大きな見出し、目を止める構図を使ってください。
- CV重視なら信頼感、安心感、CTAの明確さを重視してください。
- UGC風なら広告感を弱め、SNS投稿に自然になじむ構図にしてください。
- セール訴求なら限定感、価格感、緊急感を強調してください。
- BtoBなら清潔感、信頼感、実績感、読みやすさを重視してください。

【出力】
${finalCanvasSize} 相当の横長キャンバスに、${size} 相当の独立した広告バナーを ${selectedDesignCount} 個、横並びで生成してください。`;
  }, [
    selectedDesigns,
    selectedDesignCount,
    product,
    target,
    appeal,
    adType,
    size,
    finalCanvasSize,
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
    style,
    color,
    memo,
    persona,
    emotionalHooks,
    ctaSuggestions,
    ctrImprovements,
    copyTone,
  ]);

  const saveForm = () => {
    const data = {
      product,
      target,
      appeal,
      style,
      color,
      memo,
      adType,
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
    setAdType("CV重視");
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
                広告設定からコピー作成、デザイン選択、生成内容の作成までをまとめて管理します。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={copyPrompt} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-sm hover:bg-gray-50">
                コピー
              </button>

              <a
  href="https://chatgpt.com/?hints=search"
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

        <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className={`rounded-2xl border p-5 shadow-sm ${panel}`}>
            <div className="space-y-6">
              <SidebarSection title="広告設定" icon={<ClipboardList size={18} />}>
                <Select label="広告タイプ" value={adType} onChange={(v) => setAdType(v as AdType)} options={["CV重視", "CTR重視", "高級ブランド", "UGC風", "セール訴求", "BtoB"]} />
                <Select label="出力言語" value={language} onChange={(v) => setLanguage(v as Language)} options={["日本語", "英語"]} />
                <Select label="画像サイズ" value={size} onChange={(v) => setSize(v as BannerSize)} options={["1080×1080", "1200×628", "1080×1920"]} />
                <Select label="デザインパターン数" value={designCount} onChange={(v) => setDesignCount(v as DesignCount)} options={DESIGN_COUNTS} />

                <div className={`rounded-xl border border-gray-200 p-4 ${softPanel}`}>
                  <div className="text-xs font-bold text-gray-500">最終出力サイズ</div>
                  <div className="mt-1 text-2xl font-black">{finalCanvasSize}</div>
                  <p className="mt-2 text-xs font-medium opacity-75">
                    各バナーは {size}、横並びで出力します。
                  </p>
                </div>
              </SidebarSection>

              <SidebarSection title="商品情報" icon={<Target size={18} />}>
                <Input label="商品・サービス名" value={product} onChange={setProduct} placeholder="例：AI英会話アプリ" />
                <Input label="ターゲット" value={target} onChange={setTarget} placeholder="例：20代女性、英語初心者" />
                <Textarea label="主な訴求" value={appeal} onChange={setAppeal} placeholder="例：1日5分、初月無料、初心者でも簡単" />
              </SidebarSection>

              <SidebarSection title="デザイン条件" icon={<Palette size={18} />}>
                <Input label="デザインテイスト" value={style} onChange={setStyle} placeholder="未入力なら自動で最適化" />
                <Input label="カラー" value={color} onChange={setColor} placeholder="未入力なら自動で最適化" />
                <Textarea label="追加メモ" value={memo} onChange={setMemo} placeholder="例：広告感を弱めたい" />
              </SidebarSection>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={saveForm} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                  <Save size={17} />
                  保存
                </button>

                <button onClick={resetForm} className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50">
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

            <PreviewArea
              panel={panel}
              softPanel={softPanel}
              designs={selectedDesigns}
              primaryDesign={primaryPreviewDesign}
              mainCopy={mainCopy}
              subCopy={subCopy}
              ctaCopy={ctaCopy}
              product={product}
              size={size}
              finalCanvasSize={finalCanvasSize}
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
                        バナーに入れるキャッチコピー・補足文・CTA・訴求別コピーを作成します。直接編集するとプロンプトへ反映されます。
                      </p>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
                      <div className="space-y-4">
                        <Select label="コピータイプ" value={copyTone} onChange={(v) => setCopyTone(v as CopyTone)} options={COPY_TONES} />

                        <button onClick={generateCopies} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">
                          コピー更新
                        </button>

                        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                          <div className="font-black text-gray-900">コピータイプの使い分け</div>
                          <ul className="mt-3 space-y-2 leading-6">
                            <li>・強め：CTR重視</li>
                            <li>・自然 / SNS風：UGC向け</li>
                            <li>・高級：ブランド向け</li>
                            <li>・実績 / BtoB：CV向け</li>
                            <li>・限定 / お得：セール向け</li>
                          </ul>
                        </div>
                      </div>

                      <div className="grid gap-5 xl:grid-cols-2">
                        <Input
                          label="メインコピー"
                          value={mainCopy}
                          onChange={(value) => {
                            setMainCopy(value);
                            setHasEditedCopy(true);
                          }}
                          placeholder="一番大きく目立つ文字"
                        />

                        <Input
                          label="CTA"
                          value={ctaCopy}
                          onChange={(value) => {
                            setCtaCopy(value);
                            setHasEditedCopy(true);
                          }}
                          placeholder="例：今すぐチェック"
                        />

                        <Textarea
                          label="サブコピー"
                          value={subCopy}
                          onChange={(value) => {
                            setSubCopy(value);
                            setHasEditedCopy(true);
                          }}
                          placeholder="メインコピーを補足する説明文"
                        />

                        <Textarea
                          label="ベネフィットコピー"
                          value={benefitCopy}
                          onChange={(value) => {
                            setBenefitCopy(value);
                            setHasEditedCopy(true);
                          }}
                          placeholder="使うことで得られるメリット"
                        />

                        <Textarea
                          label="悩み訴求コピー"
                          value={problemCopy}
                          onChange={(value) => {
                            setProblemCopy(value);
                            setHasEditedCopy(true);
                          }}
                          placeholder="ターゲットの悩みを言語化"
                        />

                        <Textarea
                          label="信頼訴求コピー"
                          value={trustCopy}
                          onChange={(value) => {
                            setTrustCopy(value);
                            setHasEditedCopy(true);
                          }}
                          placeholder="実績・レビュー・安心感"
                        />

                        <Textarea
                          label="限定訴求コピー"
                          value={limitedCopy}
                          onChange={(value) => {
                            setLimitedCopy(value);
                            setHasEditedCopy(true);
                          }}
                          placeholder="今だけ・数量限定・キャンペーン"
                        />

                        <Textarea
                          label="短尺コピー"
                          value={shortCopy}
                          onChange={(value) => {
                            setShortCopy(value);
                            setHasEditedCopy(true);
                          }}
                          placeholder="短く強い一言"
                        />

                        <Textarea
                          label="SNS風コピー"
                          value={snsCopy}
                          onChange={(value) => {
                            setSnsCopy(value);
                            setHasEditedCopy(true);
                          }}
                          placeholder="投稿っぽい自然な表現"
                        />

                        <Textarea
                          label="比較訴求コピー"
                          value={comparisonCopy}
                          onChange={(value) => {
                            setComparisonCopy(value);
                            setHasEditedCopy(true);
                          }}
                          placeholder="従来・他社・今までとの違い"
                        />

                        <div className="xl:col-span-2">
                          <Textarea
                            label="長め説明コピー"
                            value={descriptionCopy}
                            onChange={(value) => {
                              setDescriptionCopy(value);
                              setHasEditedCopy(true);
                            }}
                            placeholder="広告文や補足説明に使える長めのコピー"
                          />
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
                            1〜10枚まで選択できます。未選択の場合は、広告タイプ・商品・ターゲット・訴求から推奨デザインを自動採用します。
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

                      <button onClick={openChatGPT} className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">
                        バナーを作る
                      </button>
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
                        商品情報を入力すると、改善チェック・バナー文字案・デザイン選択・画像生成用プロンプトをまとめて作成できます。
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card title="1. 商品情報を入力" icon={<Target />} panel={panel}>
                        <List items={["商品・サービス名を入力", "ターゲットを具体化", "主な訴求を入力", "必要に応じてカラーやテイストを指定"]} />
                      </Card>

                      <Card title="2. コピーを調整" icon={<MessageSquareText />} panel={panel}>
                        <List items={["コピータイプを選択", "コピー更新で文字案を作成", "各コピー欄を直接編集", "編集内容はプロンプトへ自動反映"]} />
                      </Card>

                      <Card title="3. デザインを選択" icon={<Sparkles />} panel={panel}>
                        <List items={["デザインパターン数を1〜10枚から選択", "10種類のデザイン案から選択", "未選択の場合は推奨を自動採用", "各バナーは独立デザインとして生成"]} />
                      </Card>

                      <Card title="4. バナーを作る" icon={<Wand2 />} panel={panel}>
                        <List items={["バナーを作るを押す", "プロンプトが自動コピーされる", "ChatGPTが新規タブで開く", "コピーされた内容を貼り付けて画像生成"]} />
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
                          <table className="w-full min-w-[760px] border-collapse bg-white text-left text-sm text-gray-900">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                              <tr>
                                <th className="px-4 py-3">商品</th>
                                <th className="px-4 py-3">ターゲット</th>
                                <th className="px-4 py-3">訴求</th>
                                <th className="px-4 py-3">広告タイプ</th>
                                <th className="px-4 py-3">保存日時</th>
                                <th className="px-4 py-3 text-right">操作</th>
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                              {history.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                  <td className="max-w-[180px] truncate px-4 py-4 font-bold">{item.product}</td>
                                  <td className="max-w-[180px] truncate px-4 py-4">{item.target}</td>
                                  <td className="max-w-[220px] truncate px-4 py-4">{item.appeal}</td>
                                  <td className="px-4 py-4">{item.adType}</td>
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
  primaryDesign,
  mainCopy,
  subCopy,
  ctaCopy,
  product,
  size,
  finalCanvasSize,
}: {
  panel: string;
  softPanel: string;
  designs: DesignPattern[];
  primaryDesign: DesignPattern;
  mainCopy: string;
  subCopy: string;
  ctaCopy: string;
  product: string;
  size: BannerSize;
  finalCanvasSize: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${panel}`}>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-black">プレビュー</h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            実際の生成前に、コピーとデザイン方向性を確認できます。
          </p>
        </div>

        <div className={`rounded-xl px-4 py-3 text-sm font-bold ${softPanel}`}>
          {size} / 最終 {finalCanvasSize}
        </div>
      </div>

      <div>
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
                />
              </div>
            ))}
          </div>
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
}: {
  design: DesignPattern;
  mainCopy: string;
  subCopy: string;
  ctaCopy: string;
  product: string;
  badge: string;
}) {
  return (
    <div className={`relative aspect-square overflow-hidden rounded-xl p-5 shadow-sm ${design.previewClass}`}>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <textarea
        rows={4}
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