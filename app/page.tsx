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

  const campaignCta = useMemo(() => {
    if (campaignType === "求人") return "応募する";
    if (campaignType === "店舗集客") return "予約する";
    if (campaignType === "商品販売") return "今すぐ購入";
    if (campaignType === "サービス申込") return "申し込む";
    if (campaignType === "リード獲得") return "無料相談する";
    if (campaignType === "LINE登録") return "LINEで受け取る";
    if (campaignType === "資料請求") return "資料を見る";
    if (campaignType === "アプリDL") return "無料でダウンロード";
    if (campaignType === "ブランド認知") return "ブランドを見る";
    if (campaignType === "イベント") return "イベントを見る";
    return "詳しく見る";
  }, [campaignType]);

  const campaignFocus = useMemo(() => {
    if (campaignType === "求人") {
      return {
        main: "応募したくなる求人広告",
        points: ["職種・勤務地・給与・未経験歓迎を明確にする", "安心感と働きやすさを訴求", "応募CTAを強くする"],
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
        main: "購入につながる商品広告",
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
        main: "印象に残るブランド広告",
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
      points: ["広告目的を明確にする", "ターゲットに合わせたCTAにする", "訴求を絞る"],
    };
  }, [campaignType]);

  const generateCopies = () => {
    const name = product.trim() || "商品・サービス";
    const point = appeal.trim() || "魅力";
    const audience = target.trim() || "あなた";
    const defaultCta = campaignCta;

    if (copyTone === "強め") {
      setMainCopy(`${name}で今すぐ成果を変える`);
      setSubCopy(`${point}を一瞬で伝え、行動したくなる広告にする`);
      setCtaCopy(defaultCta);
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
      setCtaCopy(defaultCta);
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
      setCtaCopy(defaultCta);
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
      setCtaCopy(defaultCta);
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
      setCtaCopy(defaultCta);
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
      setCtaCopy(defaultCta);
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
      setCtaCopy(defaultCta);
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
      setCtaCopy(defaultCta);
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
      setCtaCopy(defaultCta);
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
      setCtaCopy(defaultCta);
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
      setCampaignType(data.campaignType || "商品販売");
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
  }, [product, target, appeal, copyTone, campaignType]);

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
      "第一印象でメリットが伝わる広告に反応しやすい",
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
    if (campaignType === "店舗集客") return ["予約する", "店舗を見る", "空き状況を見る", "今すぐ来店"];
    if (campaignType === "商品販売") return ["今すぐ購入", "商品を見る", "限定価格を見る", "カートに入れる"];
    if (campaignType === "サービス申込") return ["申し込む", "無料で始める", "詳細を見る", "相談する"];
    if (campaignType === "リード獲得") return ["無料相談する", "診断する", "問い合わせる", "今すぐ相談"];
    if (campaignType === "LINE登録") return ["LINEで受け取る", "友だち追加", "無料特典を受け取る", "LINE登録する"];
    if (campaignType === "資料請求") return ["資料を見る", "無料で資料請求", "導入事例を見る", "詳細資料を受け取る"];
    if (campaignType === "アプリDL") return ["無料でダウンロード", "アプリを試す", "今すぐ使う", "ダウンロード"];
    if (campaignType === "ブランド認知") return ["ブランドを見る", "世界観を見る", "詳しく見る", "ラインナップを見る"];
    if (campaignType === "イベント") return ["イベントを見る", "参加する", "詳細を見る", "申し込む"];
    return [campaignCta, "詳しく見る", "今すぐチェック", "詳細を見る"];
  }, [campaignType, campaignCta]);

  const ctrImprovements = useMemo(() => {
    const tips: string[] = [];

    if (!product.trim()) tips.push("商品・サービス名を入力すると、広告内容が具体化できます。");
    if (!target.trim()) tips.push("ターゲットを年齢・性別・悩みまで具体化するとCTRが上がりやすくなります。");
    if (!appeal.trim()) tips.push("訴求を入力すると、広告で一番目立たせるべきメッセージが明確になります。");
    if (!mainCopy.trim()) tips.push("メインコピーを入力すると、バナーの第一印象が強くなります。");
    if (!ctaCopy.trim()) tips.push("CTAを入力すると、クリック行動を促しやすくなります。");

    if (campaignType === "求人") tips.push("求人広告では、勤務地・給与・未経験可・シフト情報を入れると応募率が上がりやすいです。");
    if (campaignType === "店舗集客") tips.push("店舗集客では、地域名・口コミ・予約しやすさを入れると来店につながりやすいです。");
    if (campaignType === "商品販売") tips.push("商品広告では、商品写真を主役にして、使った後の変化を見せると効果的です。");
    if (campaignType === "資料請求") tips.push("資料請求では、得られる情報・導入事例・実績を見せるとCVしやすくなります。");

    if (tips.length === 0) {
      tips.push("入力内容は十分具体的です。複数デザインでA/Bテストするのがおすすめです。");
    }

    return tips;
  }, [campaignType, product, target, appeal, mainCopy, ctaCopy]);

  const recommendedDesigns = useMemo(() => {
    const scoreDesign = (title: string) => {
      let score = 0;
      const text = `${campaignType} ${adType} ${product} ${target} ${appeal}`.toLowerCase();

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
  }, [campaignType, adType, product, target, appeal, selectedDesignCount]);

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
商品・サービス: ${product || "未入力"}
ターゲット: ${target || "未入力"}
主な訴求: ${appeal || "未入力"}
目的: ${campaignFocus.main}

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
悩み訴求: ${problemCopy || "未入力"}
信頼訴求: ${trustCopy || "未入力"}

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

        <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className={`rounded-2xl border p-5 shadow-sm ${panel}`}>
            <div className="space-y-6">
              <SidebarSection title="広告設定" icon={<ClipboardList size={18} />}>
                <Select label="広告ジャンル" value={campaignType} onChange={(v) => setCampaignType(v as CampaignType)} options={CAMPAIGN_TYPES} />
                <Select label="広告タイプ" value={adType} onChange={(v) => setAdType(v as AdType)} options={["CV重視", "CTR重視", "高級ブランド", "UGC風", "セール訴求", "BtoB"]} />
                <Select label="出力言語" value={language} onChange={(v) => setLanguage(v as Language)} options={["日本語", "英語"]} />
                <Select label="画像サイズ" value={size} onChange={(v) => setSize(v as BannerSize)} options={["1080×1080", "1200×628", "1080×1920"]} />
                <Select label="デザインパターン数" value={designCount} onChange={(v) => setDesignCount(v as DesignCount)} options={DESIGN_COUNTS} />

                <div className={`rounded-xl border border-gray-200 p-4 ${softPanel}`}>
                  <div className="text-xs font-bold text-gray-500">最終出力サイズ</div>
                  <div className="mt-1 text-2xl font-black">{finalCanvasSize}</div>
                  <p className="mt-2 text-xs font-medium opacity-75">
                    各バナーは {size}、{layoutInstruction}で出力します。
                  </p>
                </div>
              </SidebarSection>

              <SidebarSection title="商品情報" icon={<Target size={18} />}>
                <Input label="商品・サービス名" value={product} onChange={setProduct} placeholder="例：AI英会話アプリ / カフェスタッフ募集" />
                <Input label="ターゲット" value={target} onChange={setTarget} placeholder="例：20代女性 / 渋谷周辺の求職者" />
                <Textarea label="主な訴求" value={appeal} onChange={setAppeal} placeholder="例：1日5分、初月無料、未経験歓迎、駅近" />
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
              mainCopy={mainCopy}
              subCopy={subCopy}
              ctaCopy={ctaCopy}
              product={product}
              size={size}
              finalCanvasSize={finalCanvasSize}
              layoutInstruction={layoutInstruction}
              campaignType={campaignType}
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
                        広告ジャンルとコピータイプに合わせて、バナーに使う文言を作成します。
                      </p>
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
                        <Input label="メインコピー" value={mainCopy} onChange={(value) => { setMainCopy(value); setHasEditedCopy(true); }} />
                        <Input label="CTA" value={ctaCopy} onChange={(value) => { setCtaCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="サブコピー" value={subCopy} onChange={(value) => { setSubCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="ベネフィットコピー" value={benefitCopy} onChange={(value) => { setBenefitCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="悩み訴求コピー" value={problemCopy} onChange={(value) => { setProblemCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="信頼訴求コピー" value={trustCopy} onChange={(value) => { setTrustCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="限定訴求コピー" value={limitedCopy} onChange={(value) => { setLimitedCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="短尺コピー" value={shortCopy} onChange={(value) => { setShortCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="SNS風コピー" value={snsCopy} onChange={(value) => { setSnsCopy(value); setHasEditedCopy(true); }} />
                        <Textarea label="比較訴求コピー" value={comparisonCopy} onChange={(value) => { setComparisonCopy(value); setHasEditedCopy(true); }} />
                        <div className="xl:col-span-2">
                          <Textarea label="長め説明コピー" value={descriptionCopy} onChange={(value) => { setDescriptionCopy(value); setHasEditedCopy(true); }} />
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
                                <th className="px-4 py-3">訴求</th>
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