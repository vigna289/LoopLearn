from django.urls import path
from .views import ai_help,recommend_users

urlpatterns = [
    path("ask/", ai_help),
    path("recommend/", recommend_users, name="ai_recommend"), 
]
