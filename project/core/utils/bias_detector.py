# utils/bias.py


bias_map = {
    # LEFT-LEANING SOURCES
    "cnn.com": "left",
    "nytimes.com": "left",
    "theguardian.com": "left",
    "huffpost.com": "left",
    "msnbc.com": "left",
    "vox.com": "left",
    "slate.com": "left",
    "buzzfeednews.com": "left",
    "motherjones.com": "left",
    "thedailybeast.com": "left",
    "newyorker.com": "left",
    "politico.com": "left",
    "propublica.org": "left",

    # CENTER-LEANING SOURCES
    "bbc.com": "center",
    "reuters.com": "center",
    "apnews.com": "center",
    "npr.org": "center",
    "abcnews.go.com": "center",
    "cbsnews.com": "center",
    "usatoday.com": "center",
    "time.com": "center",
    "economist.com": "center",
    "forbes.com": "center",
    "bloomberg.com": "center",
    "aljazeera.com": "center",
    "marketwatch.com": "center",

    # RIGHT-LEANING SOURCES
    "foxnews.com": "right",
    "wsj.com": "right",
    "dailymail.co.uk": "right",
    "nypost.com": "right",
    "washingtontimes.com": "right",
    "breitbart.com": "right",
    "dailycaller.com": "right",
    "newsmax.com": "right",
    "theblaze.com": "right",
    "nationalreview.com": "right",
    "theepochtimes.com": "right",
    "gizmodo.com": "right",  # sometimes right-leaning

    # INTERNATIONAL (mostly center but often varies by article)
    "hindustantimes.com": "center",
    "indiatoday.in": "center",
    "ndtv.com": "center",
    "timesofindia.indiatimes.com": "center",
    "thehindu.com": "center",
    "straitstimes.com": "center",
    "scmp.com": "center",  # South China Morning Post
    "globaltimes.com": "left", 
     "bbc.co.uk": "left" # Chinese state media
}



def get_bias(url: str) -> str:
    try:
        domain = url.split("/")[2].replace("www.", "")
    except IndexError:
        return "unknown"

    # Make domain lowercase for consistent matching
    domain = domain.lower()

    return bias_map.get(domain, "unknown")

