from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatMessageViewSet, unread_message_count

router = DefaultRouter()
router.register(r'messages', ChatMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('unread-count/', unread_message_count, name='unread-message-count'),
]
