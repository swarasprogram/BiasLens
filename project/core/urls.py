from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from . import views

def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("healthz", health_check),

    path("search/", views.search_news),
    path("bias/", views.detect_bias),
    path("", views.get_news),
    path("news/", views.search_news, name="get_news"),

    path("analyze/", views.analyze_article, name="analyze_article"),
    path("translate/", views.translate_summary, name="translate_summary"),
    path("detect-bias-text/", views.detect_bias_text),
]