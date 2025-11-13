from django.urls import path
from . import views
from django.http import JsonResponse

urlpatterns = [
    path('search/', views.search_news),


    path('bias/', views.detect_bias),
     path('', views.get_news),
       path('news/', views.search_news, name='get_news'),
    path('analyze/', views.analyze_article, name='analyze_article'),


           path("translate/", views.translate_summary, name="translate_summary"),
           path('analyze/', views.analyze),
path('detect-bias-text/', views.detect_bias_text),
]
