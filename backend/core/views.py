from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from decouple import config
import requests
import json
from .utils.sentiment import analyze_sentiment
from .utils.translator import translate_text 
from .utils.bias_detector import get_bias
from .utils.summarizer import summarize_text

# Load API key from env
NEWS_API_KEY = config("NEWS_API_KEY")





@api_view(['POST'])
def detect_bias(request):
    url = request.data.get('url')
    bias = get_bias(url)
    return JsonResponse({'bias': bias})


@csrf_exempt
def search_news(request):
    query = request.GET.get("q")
    if not query:
        return JsonResponse({"error": "Query parameter 'q' is required"}, status=400)

    NEWS_API_KEY = config("NEWS_API_KEY")
    url = f"https://newsapi.org/v2/everything?q={query}&apiKey={NEWS_API_KEY}"
    response = requests.get(url)

    if response.status_code != 200:
        return JsonResponse({"error": "News API failed", "details": response.json()}, status=500)

    data = response.json()
    return JsonResponse(data)



@api_view(['GET'])
def get_news(request):
    query = request.GET.get('q') or request.GET.get('query')
    if not query:
        return Response({"articles": [], "error": "No query provided"})

    response = requests.get(
        'https://newsapi.org/v2/everything',
        params={"q": query, "language": "en", "apiKey": NEWS_API_KEY}
    )

    if response.status_code != 200:
        return Response({"error": "News API failed", "details": response.json()}, status=500)

    data = response.json()
    articles = data.get("articles", [])
    results = []

    for art in articles:
        title = art.get("title") or ""
        description = art.get("description") or ""
        content = art.get("content") or description
        url = art.get("url", "")
        source = art.get("source", {}).get("name", "")

        # Extract domain for bias detection
        domain = ""
        if url:
            parts = url.split("/")
            domain = parts[2].replace("www.", "") if len(parts) > 2 else ""

        # Sentiment and bias analysis
        sentiment = analyze_sentiment(f"{title} {content}")
        bias = get_bias(url)

        results.append({
            "title": title,
            "original": description,
            "source": domain or source,
            "url": url,
            "sentiment": sentiment,
            "bias": bias
        })

    return Response({"articles": results})





@csrf_exempt
def analyze_article(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get("title", "")
            content = data.get("content", "")
            url = data.get("url", "")

            # Use actual utils
            full_text = f"{title} {content}"
            summary = summarize_text(full_text)
            sentiment = analyze_sentiment(full_text)
            bias = get_bias(url)

            return JsonResponse({
                "summary": summary,
                "sentiment": sentiment.capitalize(),  # Capitalize to match frontend format
                "bias": bias.capitalize() if bias else "Unknown"
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)




@api_view(["POST"])
def translate_summary(request):
    text = request.data.get("text")
    target_lang = request.data.get("target_lang")

    if not text or not target_lang:
        return Response({"error": "Missing text or target language"}, status=400)

    translated = translate_text(text, target_lang)
    return Response({"translated_text": translated})