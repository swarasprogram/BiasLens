import os
from decouple import config
import requests

NEWS_API_KEY = config("NEWS_API_KEY")

def fetch_news(query):
    url = f"https://newsapi.org/v2/everything?q={query}&apiKey={NEWS_API_KEY}"
    response = requests.get(url)
    return response.json()
