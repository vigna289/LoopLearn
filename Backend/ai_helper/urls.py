from django.urls import path
from .views import ai_help

urlpatterns = [
    path("ask/", ai_help),
]
