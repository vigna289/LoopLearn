# registration/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserSignupView
from .views import SkillMatchView

urlpatterns = [
   
]

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
        path('signup/', UserSignupView.as_view(), name='user-signup'),  # new signup endpoint
         path('skill-match/', SkillMatchView.as_view(), name='skill-match'),  # query param email
        
]


