import { useState } from "react";
import axios from "axios";
import { Search, Loader2, AlertCircle, Newspaper, Globe, Brain } from "lucide-react";
import NewsCard from "@/components/NewsCard";

interface Article {
  title: string;
  original: string;
  sentiment: string;
  bias: string;
  source: string;
  url: string;
}

function Home() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNews = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/?q=${query}`);
      setArticles(response.data.articles);
    } catch (err) {
      setError("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchNews();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative max-w-4xl mx-auto text-center pt-20 pb-16 px-6">
          {/* Logo and Title */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-glass backdrop-blur-md border border-glass">
              AI Powered News Analysis
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black tracking-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                BiasLens
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get unbiased, multilingual news — summarized, sentiment-analyzed, and explained with AI precision.
            </p>
          </div>

          {/* Search Section */}
          <div className="mt-12 space-y-4">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex rounded-2xl bg-glass backdrop-blur-md border border-glass shadow-glass overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search world news (e.g. India, economy, war)"
                  className="flex-1 pl-12 pr-4 py-4 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset text-lg"
                />
                <button
                  onClick={fetchNews}
                  disabled={loading || !query.trim()}
                  className="px-8 py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-primary-foreground font-semibold flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Globe, text: "Global Sources" },
                { icon: Brain, text: "AI Analysis" },
                { icon: Newspaper, text: "Real-time Updates" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-secondary-foreground">
                  <feature.icon className="w-4 h-4" />
                  {feature.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <div className="space-y-2 text-center">
              <p className="text-lg font-medium text-foreground">Analyzing global news...</p>
              <p className="text-sm text-muted-foreground">Processing sentiment and bias detection</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-lg font-medium text-foreground">Something went wrong</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
              <Newspaper className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2 text-center max-w-md">
              <p className="text-xl font-semibold text-foreground">Ready to analyze news</p>
              <p className="text-muted-foreground">Enter a search term above to get started with AI-powered news analysis and bias detection.</p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {articles.length > 0 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                Found {articles.length} articles
              </h2>
              <p className="text-muted-foreground">
                Analyzed for sentiment and bias detection
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <NewsCard 
                  key={index} 
                  article={article} 
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-glass bg-glass/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span></span>
              <span className="text-red-500"></span>
              <span></span>
            </div>
            <div className="text-sm text-muted-foreground">
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;