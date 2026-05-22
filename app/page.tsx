"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  Sparkles,
  Target,
  Layout,
  TrendingUp,
  Eye,
  ImageIcon,
  Copy,
  Wand2,
  Lightbulb,
  MessageSquareText,
  Save,
  RotateCcw,
  Moon,
  Sun,
  History,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type BannerSize = "1080×1080" | "1200×628" | "1080×1920";
type AdType = "CV重視" | "CTR重視" | "高級ブランド" | "UGC風" | "セール訴求" | "BtoB";
type TabType = "analysis" | "designs" | "copies" | "lp" | "prompt" | "history";
type DesignCount = "1枚" | "3枚" | "5枚";

type SavedHistory = {
  id: number;
  product: string;
  target: string;
  appeal: string;
  adType: AdType;
  createdAt: string;
  prompt: string;
};

const safeJsonParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const getCanvasRule = (size: BannerSize, count: number) => {
  if (size === "1080×1080") {
    return count === 1 ? "1080×1080" : count === 3 ? "3240×1080" : "5400×1080";
  }

  if (size === "1200×628") {
    return count === 1 ? "1200×628" : count === 3 ? "3600×628" : "6000×628";
  }

  return count === 1 ? "1080×1920" : count === 3 ? "3240×1920" : "5400×1920";
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
  const [cta, setCta] = useState("今すぐチェック");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [memo, setMemo] = useState("");

  const [adType, setAdType] = useState<AdType>("CV重視");
  const [size, setSize] = useState<BannerSize>("1080×1080");
  const [designCount, setDesignCount] = useState<DesignCount>("3枚");

  const [history, setHistory] = useState<SavedHistory[]>([]);
  const [favoriteDesigns, setFavoriteDesigns] = useState<string[]>([]);

  const selectedDesignCount = designCount === "1枚" ? 1 : designCount === "3枚" ? 3 : 5;
  const canvasSize = getCanvasRule(size, selectedDesignCount);

  useEffect(() => {
    const savedForm = safeJsonParse<
      Partial<{
        product: string;
        target: string;
        appeal: string;
        style: string;
        color: string;
        cta: string;
        referenceUrl: string;
        memo: string;
        adType: AdType;
        size: BannerSize;
        designCount: DesignCount;
        darkMode: boolean;
      }>
    >(localStorage.getItem("meta-banner-form"), {});

    setProduct(savedForm.product || "");
    setTarget(savedForm.target || "");
    setAppeal(savedForm.appeal || "");
    setStyle(savedForm.style || "");
    setColor(savedForm.color || "");
    setCta(savedForm.cta || "今すぐチェック");
    setReferenceUrl(savedForm.referenceUrl || "");
    setMemo(savedForm.memo || "");
    setAdType(savedForm.adType || "CV重視");
    setSize(savedForm.size || "1080×1080");
    setDesignCount(savedForm.designCount || "3枚");
    setDarkMode(savedForm.darkMode || false);

    setHistory(safeJsonParse<SavedHistory[]>(localStorage.getItem("meta-banner-history"), []));
    setFavoriteDesigns(safeJsonParse<string[]>(localStorage.getItem("meta-banner-favorites"), []));
  }, []);

  const qualityScore = useMemo(() => {
    let score = 40;
    if (product.trim()) score += 10;
    if (target.trim()) score += 15;
    if (appeal.trim()) score += 15;
    if (style.trim()) score += 5;
    if (color.trim()) score += 5;
    if (cta.trim()) score += 5;
    if (referenceUrl.trim()) score += 3;
    if (memo.trim()) score += 2;
    return Math.min(score, 100);
  }, [product, target, appeal, style, color, cta, referenceUrl, memo]);

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
        "感情訴求よりも、メリットや実績が明確な広告に反応しやすい",
        "比較・レビュー・数字訴求を確認してから行動する傾向",
      ];
    }

    if (target.includes("法人") || target.includes("BtoB") || target.includes("企業")) {
      return [
        "企業担当者・意思決定者・マーケティング担当者",
        "ROI、導入実績、信頼性、業務効率化を重視",
        "派手すぎる表現より、清潔感・実績感・信頼感のあるデザインに反応しやすい",
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

    if (!product.trim()) tips.push("商品名を入力すると、広告コピーとデザイン指示が具体化できます。");
    if (!target.trim()) tips.push("ターゲットを年齢・性別・悩みまで具体化するとCTRが上がりやすくなります。");
    if (!appeal.trim()) tips.push("訴求を入力すると、広告で一番目立たせるべきメッセージが明確になります。");
    if (!appeal.includes("無料")) tips.push("無料体験・無料相談・無料診断などがある場合は入れるとCV改善が期待できます。");
    if (!appeal.includes("限定")) tips.push("期間限定・数量限定・今だけなどの要素がある場合はクリック理由を作れます。");
    if (!cta.trim()) tips.push("CTAは『詳しく見る』よりも、商品に合った具体的な行動文言が理想です。");

    if (tips.length === 0) {
      tips.push(
        "入力内容は十分具体的です。複数デザイン生成でA/Bテストするのがおすすめです。",
        "CTR重視なら見出しをさらに短く強く、CV重視なら信頼要素を追加しましょう。"
      );
    }

    return tips;
  }, [product, target, appeal, cta]);

  const lpStructure = [
    { step: "01", title: "ファーストビュー", text: "広告と同じ訴求を使い、3秒で価値が伝わる見出しを配置。" },
    { step: "02", title: "悩み共感", text: "ターゲットが抱えている悩みを具体的に言語化し、自分ごと化させる。" },
    { step: "03", title: "ベネフィット", text: "機能説明ではなく、使った後に得られる変化を中心に見せる。" },
    { step: "04", title: "実績・口コミ", text: "導入実績、レビュー、利用者の声、数値実績で信頼感を強化。" },
    { step: "05", title: "CTA", text: "無料体験・問い合わせ・購入など、次の行動を明確に配置。" },
    { step: "06", title: "FAQ", text: "価格、使い方、不安点を解消し、離脱を防ぐ。" },
  ];

  const allDesigns = [
    {
      title: "Luxury",
      style: "高級感・ミニマル",
      color: "黒・ゴールド・白",
      layout: "余白を大きく取り、中央に商品と短いコピーを配置。装飾は最小限。",
      purpose: "高単価商材、ブランド訴求、美容、ラグジュアリー向け",
    },
    {
      title: "UGC",
      style: "SNS投稿風・自然体",
      color: "ベージュ・白・自然色",
      layout: "スマホ投稿のような自然な構図。広告感を弱め、リアルな利用シーンを想起させる。",
      purpose: "Instagramになじませたい広告、口コミ風、D2C商材向け",
    },
    {
      title: "CTR Impact",
      style: "強インパクト・視認性重視",
      color: "赤・黄色・白・高コントラスト",
      layout: "大きな見出し、強い色面、目立つCTA。スクロール停止率を最優先。",
      purpose: "クリック率重視、キャンペーン告知、短期獲得向け",
    },
    {
      title: "Minimal",
      style: "シンプル・清潔感",
      color: "白・グレー・青",
      layout: "情報量を絞り、余白と読みやすさを重視。信頼感ある構成。",
      purpose: "BtoB、SaaS、教育、幅広いサービス向け",
    },
    {
      title: "Sale",
      style: "セール訴求・緊急感",
      color: "赤・オレンジ・黄色",
      layout: "割引・限定・CTAを大きく配置。今すぐ行動する理由を強調。",
      purpose: "セール、期間限定、キャンペーン、EC向け",
    },
  ];

  const selectedDesigns = allDesigns.slice(0, selectedDesignCount);

  const copies = useMemo(() => {
    const name = product || "商品・サービス";
    const point = appeal || "魅力";

    return [
      `${name}をもっと魅力的に`,
      `今話題の${name}`,
      `${name}で理想を実現`,
      `${point}を、もっと簡単に`,
      `選ばれている${name}`,
      `${name}を今すぐ始める`,
      `あなたに合う${name}をチェック`,
      `${point}で毎日をもっと快適に`,
    ];
  }, [product, appeal]);

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
【横並びバナー ${index + 1}: ${design.title}】
- このバナー領域は「1枚の独立した完成広告」として作成してください。
- デザインテイスト: ${design.style}
- 推奨カラー: ${color || design.color}
- レイアウト方針: ${design.layout}
- 向いている用途: ${design.purpose}
- 他のバナー領域と明確に違う見た目、構図、色使いにしてください。
- この1枠の中に複数案を入れないでください。
- 横長に引き伸ばさず、指定サイズ ${size} の比率を守ってください。`
      )
      .join("\n");

    const personaText = persona.map((item) => `- ${item}`).join("\n");
    const hookText = emotionalHooks.map((item) => `- ${item}`).join("\n");
    const ctaText = ctaSuggestions.map((item) => `- ${item}`).join("\n");
    const improvementText = ctrImprovements.map((item) => `- ${item}`).join("\n");
    const copyText = copies.map((item, index) => `${index + 1}. ${item}`).join("\n");

    return `あなたはMeta広告に強いプロの広告デザイナー兼クリエイティブディレクターです。
さらに、広告運用・CTR改善・CV改善に詳しいマーケティング戦略担当者として考えてください。

以下の入力内容をもとに、Facebook / Instagram広告で成果が出やすいバナー画像を作成してください。

【最重要ルール】
- ${selectedDesignCount}種類のデザイン違いのMeta広告バナーを生成してください。
- 出力は「1枚の横長キャンバス」にしてください。
- ${selectedDesignCount}枚のバナーを、必ず左から右へ横並びに配置してください。
- 個別画像として分割生成しないでください。
- 1枚の横長画像の中に、${selectedDesignCount}個の完成バナーを横並びで入れてください。

【超重要：サイズ厳守ルール】
- 指定サイズ「${size}」は、全体キャンバスサイズではなく、『各バナー1枚ごとの実サイズ』です。
- 各バナーは必ず ${size} ピクセル相当の縦横比を維持してください。
- 各バナーを横長や縦長に変形しないでください。
- 各バナーを縮めたり引き伸ばしたりしないでください。
- 各バナーは「独立した1枚の広告画像」として成立させてください。

【全体キャンバスサイズ】
- バナー1枚ごとのサイズ: ${size}
- バナー枚数: ${selectedDesignCount}枚
- 全体キャンバスサイズ: ${canvasSize}

【キャンバス構成ルール】
- 全体キャンバスの高さ = バナー1枚の高さ
- 全体キャンバスの横幅 = バナー横幅 × ${selectedDesignCount}
- 各バナーは完全に同じサイズで並べてください。
- 各バナー領域を均等幅で分割してください。
- 各バナーを余白込みで同一サイズにしてください。

【正しい構成例】
- 1080×1080 を3枚生成:
  - 各バナー = 1080×1080
  - 全体 = 3240×1080
  - 3240pxを3等分し、各領域を1080pxにする

- 1080×1080 を5枚生成:
  - 各バナー = 1080×1080
  - 全体 = 5400×1080
  - 5400pxを5等分し、各領域を1080pxにする

- 1080×1920 を3枚生成:
  - 各バナー = 1080×1920
  - 全体 = 3240×1920
  - 横方向のみ3倍に拡張

- 1200×628 を3枚生成:
  - 各バナー = 1200×628
  - 全体 = 3600×628
  - 横方向のみ3倍に拡張

- 1200×628 を5枚生成:
  - 各バナー = 1200×628
  - 全体 = 6000×628
  - 横方向のみ5倍に拡張

【禁止事項】
- コラージュ禁止
- 比較表禁止
- モザイク配置禁止
- 各バナーサイズの不統一禁止
- 一部だけ横長になることを禁止
- 各バナー内に複数案を入れることを禁止
- 全体を1つの広告としてデザインすることを禁止
- バナー同士の重なり禁止
- サイズ比率変更禁止
- グリッド配置禁止
- 縦積み配置禁止

【各バナーの独立性】
- 各バナーは完全に別デザインにしてください。
- 各バナーごとに以下を変えてください。
  ・構図
  ・配色
  ・フォント
  ・CTAデザイン
  ・写真 / イラスト
  ・背景
  ・雰囲気
- ただしサイズだけは全バナーで完全一致させてください。
- 各バナーは単体でも広告として成立する完成度にしてください。

【横並びレイアウト】
- 各バナーを左から右へ一直線に並べてください。
- 必ず横1列にしてください。
- 各バナーの境界が分かるようにしてください。
- 必要に応じて余白または細い区切り線を入れてください。
- ただし区切りによってバナーサイズを崩さないでください。

【生成枚数】
${selectedDesignCount}枚

【商品・サービス】
${product || "未入力"}

【ターゲット】
${target || "未入力"}

【主な訴求】
${appeal || "未入力"}

【広告タイプ】
${adType}

【各バナー1枚ごとの画像サイズ】
${size}

【全体キャンバスサイズ】
${canvasSize}

【CTA】
${cta || "未入力"}

【希望デザインテイスト】
${style || "未入力のため、商品・ターゲット・訴求から最適なテイストを判断してください"}

【希望カラー】
${color || "未入力のため、商品・ターゲット・訴求から最適な配色を判断してください"}

【参考画像URL】
${referenceUrl || "なし"}

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

【広告コピー案】
${copyText}

【横並びバナー別デザイン指示】
${designInstructions}

【プロ向けデザイン共通ルール】
- 各デザイン案は、見た目・配色・構図・余白・フォントの印象を明確に変えてください。
- Meta広告向けに、スマホ表示でも一瞬で内容が伝わるようにしてください。
- メインコピーは大きく、視認性高く配置してください。
- CTAボタンは目立つ場所に配置し、クリックしたくなる見せ方にしてください。
- 情報を詰め込みすぎず、余白を活かしてください。
- 商品・ターゲット・訴求内容に合わせて、フォント、配色、構図、写真/イラストの方向性を最適化してください。
- 汎用テンプレートではなく、この入力内容に合った広告クリエイティブにしてください。
- 高級感が必要なら余白とミニマル表現を重視してください。
- CTR重視なら強いコントラスト、大きな見出し、目を止める構図を使ってください。
- CV重視なら信頼感、安心感、CTAの明確さを重視してください。
- UGC風なら広告感を弱め、SNS投稿に自然になじむ構図にしてください。
- セール訴求なら限定感、価格感、緊急感を強調してください。
- BtoBなら清潔感、信頼感、実績感、読みやすさを重視してください。

【最終出力】
- 「1枚の横長画像」として出力してください。
- その中に ${selectedDesignCount} 枚の完成バナーを横並びで配置してください。
- 各バナーサイズは必ず ${size} を維持してください。
- 全体サイズは必ず ${canvasSize} にしてください。
- 各バナーは単体でも広告として成立する完成度にしてください。`;
  }, [
    selectedDesigns,
    selectedDesignCount,
    canvasSize,
    product,
    target,
    appeal,
    adType,
    size,
    cta,
    style,
    color,
    referenceUrl,
    memo,
    persona,
    emotionalHooks,
    ctaSuggestions,
    ctrImprovements,
    copies,
  ]);

  const saveForm = () => {
    const data = {
      product,
      target,
      appeal,
      style,
      color,
      cta,
      referenceUrl,
      memo,
      adType,
      size,
      designCount,
      darkMode,
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

    const nextHistory = [newHistory, ...history].slice(0, 20);
    setHistory(nextHistory);
    localStorage.setItem("meta-banner-history", JSON.stringify(nextHistory));

    alert("保存しました");
  };

  const resetForm = () => {
    const ok = confirm("入力内容をリセットしますか？");
    if (!ok) return;

    localStorage.removeItem("meta-banner-form");

    setProduct("");
    setTarget("");
    setAppeal("");
    setStyle("");
    setColor("");
    setCta("今すぐチェック");
    setReferenceUrl("");
    setMemo("");
    setAdType("CV重視");
    setSize("1080×1080");
    setDesignCount("3枚");
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      alert("コピーしました");
    } catch {
      alert("コピーに失敗しました。ブラウザ設定を確認してください。");
    }
  };

  const openChatGPT = async () => {
    try {
      setLoading(true);

      await navigator.clipboard.writeText(prompt);

      window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");

      setTimeout(() => {
        setLoading(false);
        alert("プロンプトをコピーしました。\n開いたChatGPTに貼り付けてください。");
      }, 500);
    } catch (error) {
      setLoading(false);
      alert("コピーに失敗しました。ブラウザ設定を確認してください。");
      console.error(error);
    }
  };

  const toggleFavorite = (title: string) => {
    const next = favoriteDesigns.includes(title)
      ? favoriteDesigns.filter((item) => item !== title)
      : [...favoriteDesigns, title];

    setFavoriteDesigns(next);
    localStorage.setItem("meta-banner-favorites", JSON.stringify(next));
  };

  const bg = darkMode ? "bg-zinc-950 text-white" : "bg-gray-100 text-black";
  const panel = darkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-gray-200 text-black";
  const softPanel = darkMode ? "bg-zinc-800 text-white" : "bg-gray-100 text-black";

  return (
    <main className={`min-h-screen ${bg}`}>
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className={`rounded-3xl border p-5 shadow-xl sm:p-6 xl:sticky xl:top-6 xl:h-[calc(100vh-48px)] xl:overflow-auto ${panel}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Brain />
                <h1 className="text-2xl font-bold">Meta広告AI</h1>
              </div>

              <button onClick={() => setDarkMode(!darkMode)} className={`rounded-2xl p-3 ${softPanel}`}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            <p className="mt-3 text-sm font-medium opacity-80">
              広告戦略・複数デザイン・高品質プロンプトを自動生成します。
            </p>

            <div className="mt-8 space-y-5">
              <Select label="広告タイプ" value={adType} onChange={(v) => setAdType(v as AdType)} options={["CV重視", "CTR重視", "高級ブランド", "UGC風", "セール訴求", "BtoB"]} />
              <Select label="画像サイズ" value={size} onChange={(v) => setSize(v as BannerSize)} options={["1080×1080", "1200×628", "1080×1920"]} />
              <Select label="生成枚数" value={designCount} onChange={(v) => setDesignCount(v as DesignCount)} options={["1枚", "3枚", "5枚"]} />

              <Input label="商品・サービス名" value={product} onChange={setProduct} placeholder="例：AI英会話アプリ" />
              <Input label="ターゲット" value={target} onChange={setTarget} placeholder="例：20代女性、英語初心者" />
              <Textarea label="主な訴求" value={appeal} onChange={setAppeal} placeholder="例：1日5分、初月無料、初心者でも簡単" />
              <Input label="デザインテイスト" value={style} onChange={setStyle} placeholder="未入力ならAIが最適化" />
              <Input label="カラー" value={color} onChange={setColor} placeholder="未入力ならAIが最適化" />
              <Input label="CTA" value={cta} onChange={setCta} placeholder="例：今すぐ無料体験" />
              <Input label="参考画像URL" value={referenceUrl} onChange={setReferenceUrl} placeholder="参考画像があれば入力" />
              <Textarea label="追加メモ" value={memo} onChange={setMemo} placeholder="例：広告感を弱めたい" />

              <div className="grid grid-cols-2 gap-3">
                <button onClick={copyPrompt} className="flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 font-bold text-white">
                  <Copy size={18} />
                  コピー
                </button>

                <button onClick={openChatGPT} className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-bold text-white">
                  <Wand2 size={18} />
                  GPT生成
                </button>

                <button onClick={saveForm} className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-bold text-white">
                  <Save size={18} />
                  保存
                </button>

                <button onClick={resetForm} className="flex items-center justify-center gap-2 rounded-2xl bg-gray-300 px-4 py-3 font-bold text-black">
                  <RotateCcw size={18} />
                  リセット
                </button>
              </div>

              {loading && (
                <div className="rounded-2xl bg-green-100 p-4 text-sm font-bold text-green-700">
                  AIが広告戦略を分析中...
                </div>
              )}
            </div>
          </aside>

          <section className="min-w-0 space-y-6">
            <div className={`rounded-3xl border p-4 shadow-xl sm:p-6 ${panel}`}>
              <div className="flex gap-3 overflow-x-auto pb-2">
                <TabButton active={activeTab === "analysis"} onClick={() => setActiveTab("analysis")} icon={<Brain size={18} />} label="AI分析" />
                <TabButton active={activeTab === "designs"} onClick={() => setActiveTab("designs")} icon={<Sparkles size={18} />} label="複数デザイン" />
                <TabButton active={activeTab === "copies"} onClick={() => setActiveTab("copies")} icon={<Target size={18} />} label="広告コピー" />
                <TabButton active={activeTab === "lp"} onClick={() => setActiveTab("lp")} icon={<Layout size={18} />} label="LP提案" />
                <TabButton active={activeTab === "prompt"} onClick={() => setActiveTab("prompt")} icon={<MessageSquareText size={18} />} label="プロンプト" />
                <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")} icon={<History size={18} />} label="履歴" />
              </div>

              {activeTab === "analysis" && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid gap-6 lg:grid-cols-2">
                  <Card title="広告品質スコア" icon={<TrendingUp />} panel={panel}>
                    <div className="mx-auto mt-6 h-44 w-44 sm:h-56 sm:w-56">
                      <CircularProgressbar value={qualityScore} text={`${qualityScore}%`} styles={buildStyles({ textSize: "16px", pathColor: darkMode ? "#22c55e" : "#111827", textColor: darkMode ? "#fff" : "#111827" })} />
                    </div>
                  </Card>

                  <Card title="AI分析グラフ" icon={<Eye />} panel={panel}>
                    <div className="mt-6 h-[260px] sm:h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={chartData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis />
                          <Radar dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.45} />
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

                  <Card title="CTR / CV 改善提案" icon={<TrendingUp />} panel={panel}>
                    <List items={ctrImprovements} />
                  </Card>
                </motion.div>
              )}

              {activeTab === "designs" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                  {selectedDesigns.map((design) => (
                    <motion.div whileHover={{ scale: 1.02 }} key={design.title} className={`overflow-hidden rounded-3xl border shadow-lg ${panel}`}>
                      <div className="relative flex aspect-[4/3] items-end bg-gradient-to-br from-gray-900 via-gray-700 to-gray-300 p-5 text-white">
                        <button onClick={() => toggleFavorite(design.title)} className="absolute right-5 top-5 rounded-full bg-white/20 p-2 backdrop-blur">
                          <Star className={favoriteDesigns.includes(design.title) ? "fill-yellow-400 text-yellow-400" : "text-white"} />
                        </button>

                        <div>
                          <div className="text-sm font-semibold opacity-80">{design.style}</div>
                          <div className="mt-1 text-2xl font-bold">{product || design.title}</div>
                          <div className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-black">{cta}</div>
                        </div>

                        <ImageIcon className="absolute bottom-5 right-5 opacity-50" />
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-bold">{design.title}</h3>
                        <div className="mt-4 space-y-3">
                          <Info title="スタイル" value={design.style} />
                          <Info title="カラー" value={color || design.color} />
                          <Info title="レイアウト" value={design.layout} />
                          <Info title="用途" value={design.purpose} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "copies" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid gap-4">
                  {copies.map((copy, index) => (
                    <div key={copy} className={`rounded-2xl border p-5 shadow-sm ${panel}`}>
                      <div className="text-sm font-bold opacity-60">COPY {index + 1}</div>
                      <div className="mt-2 text-base font-bold sm:text-lg">{copy}</div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "lp" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid gap-5 lg:grid-cols-2">
                  {lpStructure.map((item) => (
                    <div key={item.step} className={`rounded-3xl border p-5 shadow-sm ${panel}`}>
                      <div className="text-sm font-bold opacity-60">{item.step}</div>
                      <div className="mt-1 text-xl font-bold">{item.title}</div>
                      <div className="mt-2 opacity-80">{item.text}</div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "prompt" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
                  <PromptBlock prompt={prompt} />
                </motion.div>
              )}

              {activeTab === "history" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-4">
                  {history.length === 0 && <div className="font-bold opacity-70">まだ履歴はありません。</div>}

                  {history.map((item) => (
                    <div key={item.id} className={`rounded-3xl border p-5 shadow-sm ${panel}`}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-lg font-bold">{item.product}</div>
                          <div className="mt-1 text-sm opacity-70">{item.createdAt}</div>
                        </div>

                        <button onClick={() => navigator.clipboard.writeText(item.prompt)} className="rounded-2xl bg-black px-4 py-2 font-bold text-white">
                          コピー
                        </button>
                      </div>

                      <div className="mt-3 text-sm opacity-80">ターゲット：{item.target}</div>
                      <div className="mt-1 text-sm opacity-80">訴求：{item.appeal}</div>
                      <div className="mt-1 text-sm opacity-80">広告タイプ：{item.adType}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="rounded-3xl bg-black p-4 text-white shadow-2xl sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">生成プロンプト</h2>
                <div className="flex gap-3">
                  <button onClick={copyPrompt} className="rounded-2xl bg-white px-4 py-2 font-bold text-black">
                    コピー
                  </button>

                  <button onClick={openChatGPT} className="rounded-2xl bg-green-600 px-4 py-2 font-bold text-white">
                    GPT生成
                  </button>
                </div>
              </div>

              <pre className="mt-6 max-h-[520px] overflow-auto whitespace-pre-wrap break-words text-sm leading-7 text-green-400">
                {prompt}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Card({ title, icon, children, panel }: { title: string; icon: React.ReactNode; children: React.ReactNode; panel: string }) {
  return (
    <div className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${panel}`}>
      <div className="flex items-center gap-3">
        {icon}
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

function PromptBlock({ prompt }: { prompt: string }) {
  return (
    <pre className="max-h-[720px] overflow-auto whitespace-pre-wrap break-words rounded-3xl bg-gray-950 p-5 text-sm leading-7 text-green-400">
      {prompt}
    </pre>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 font-bold transition sm:px-5 ${active ? "bg-black text-white" : "bg-gray-100 text-black hover:bg-gray-200"}`}>
      {icon}
      {label}
    </button>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-100 p-3 text-black">
      <div className="text-sm font-bold text-gray-600">{title}</div>
      <div className="mt-1 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-black" />
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <textarea rows={4} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-black" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-black">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}