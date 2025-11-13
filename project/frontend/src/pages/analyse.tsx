// src/pages/AnalysePage.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AnalysePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, content, url } = location.state || {};

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    if (!title || !content || !url) {
      navigate("/");
      return;
    }

    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/analyze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, url }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
    } catch (err) {
      console.error("Analysis failed:", err);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (lang: string) => {
    setSelectedLang(lang);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/translate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: analysis?.summary,
          target_lang: lang,
        }),
      });

      const data = await res.json();
      if (data.translated_text) setTranslatedSummary(data.translated_text);
    } catch (err) {
      console.error("Translation failed:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-muted-foreground">
        ⏳ Analyzing article...
      </div>
    );

  if (!analysis)
    return (
      <div className="flex justify-center items-center min-h-screen text-destructive text-lg">
        ❌ Failed to analyze article. Try again later.
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Article Analysis
        </h1>
        <p className="text-center text-muted-foreground max-w-xl mx-auto">
          Explore the insights from AI: summary, sentiment, bias, and multilingual translation.
        </p>

        <div className="bg-card p-6 rounded-2xl shadow-md border">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            {url}
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-muted/20 p-4 rounded-lg space-y-2 border col-span-full">
            <h3 className="font-semibold text-muted-foreground"> Summary</h3>
            <p className="text-sm text-foreground">
              {translatedSummary || analysis.summary}
            </p>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg space-y-2 border">
            <h3 className="font-semibold text-muted-foreground"> Sentiment</h3>
            <p className="text-sm text-foreground">{analysis.sentiment}</p>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg space-y-2 border">
            <h3 className="font-semibold text-muted-foreground"> Bias</h3>
            <p className="text-sm text-foreground">{analysis.bias}</p>
          </div>
        </div>

        <div className="bg-muted/10 p-4 rounded-xl border space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
             Translate Summary:
          </label>
          <select
            className="w-full bg-background border border-border rounded-md p-2 text-sm text-foreground"
            value={selectedLang}
            onChange={(e) => handleTranslate(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="es">Spanish</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AnalysePage;
