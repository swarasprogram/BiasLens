# utils/sentiment.py

from transformers import pipeline

sentiment_pipeline = pipeline("sentiment-analysis")

def analyze_sentiment(text):
    if not text.strip():
        return "neutral"
    result = sentiment_pipeline(text[:512])[0]
    label = result["label"].lower()

    if "positive" in label:
        return "positive"
    elif "negative" in label:
        return "negative"
    else:
        return "neutral"
