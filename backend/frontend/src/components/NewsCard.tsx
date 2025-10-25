// src/components/NewsCard.tsx
import { useState } from "react";
import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface Article {
  title: string;
  original: string;
  sentiment: string;
  bias: string;
  source: string;
  url: string;
}

interface NewsCardProps {
  article: Article;
  index: number;
}

const NewsCard = ({ article, index }: NewsCardProps) => {
  const [analysis, setAnalysis] = useState<null | {
    summary: string;
    sentiment: string;
    bias: string;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [translating, setTranslating] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

 

const navigate = useNavigate();

const handleAnalyze = () => {
  navigate("/analyse", {
    state: {
      title: article.title,
      content: article.original,
      url: article.url,
    },
  });
};

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "es", name: "Spanish" },
    { code: "zh", name: "Chinese" },
  ];

  const getBadgeStyle = (type: string, value: string) => {
    const map = {
      sentiment: {
        Positive: "bg-sentiment-positive",
        Negative: "bg-sentiment-negative",
        Neutral: "bg-sentiment-neutral",
      },
      bias: {
        Left: "bg-bias-left",
        Center: "bg-bias-center",
        Right: "bg-bias-right",
        Unknown: "bg-bias-unknown",
      },
    };
    return (map as any)[type][value] || "bg-muted";
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return <TrendingUp className="w-3 h-3" />;
      case "Negative":
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const handleTranslate = async (lang: string) => {
    setSelectedLang(lang);
    setTranslating(true);
    const res = await fetch("/api/translate/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: analysis?.summary,
        target_lang: lang,
      }),
    });
    const data = await res.json();
    setTranslatedSummary(data.translated_text);
    setTranslating(false);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-glass backdrop-blur-md border border-glass hover:shadow-hover transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

      <div className="relative p-6 space-y-4">
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground leading-tight line-clamp-3 group-hover:text-primary-foreground transition-colors duration-300">
            {article.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {article.original}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-white ${getBadgeStyle(
              "sentiment",
              article.sentiment
            )}`}
          >
            {getSentimentIcon(article.sentiment)}
            {article.sentiment}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-white ${getBadgeStyle(
              "bias",
              article.bias
            )}`}
          >
            {article.bias}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {article.source}
          </span>
        </div>

        {!analysis ? (
          <button
            onClick={handleAnalyze}
            className="w-full mt-3 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "🔍 Analyze this article"}
          </button>
        ) : (
          <div className="mt-4 space-y-3 text-sm text-foreground">
            <div>
              <strong>📝 Summary:</strong>{" "}
              <span className="text-muted-foreground">
                {translatedSummary || analysis.summary}
              </span>
            </div>
            <div>
              <strong>🧠 Sentiment:</strong>{" "}
              <span className="text-muted-foreground">{analysis.sentiment}</span>
            </div>
            <div>
              <strong>⚖️ Bias:</strong>{" "}
              <span className="text-muted-foreground">{analysis.bias}</span>
            </div>

            <div className="pt-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                🌍 Translate Summary:
              </label>
              <select
                className="w-full px-3 py-2 border border-glass rounded-lg text-sm bg-transparent text-foreground"
                value={selectedLang}
                onChange={(e) => handleTranslate(e.target.value)}
                disabled={translating}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              {translating && (
                <p className="text-xs text-muted-foreground mt-1">Translating...</p>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-glass">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 group/link"
          >
            <span>Read full article</span>
            <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
