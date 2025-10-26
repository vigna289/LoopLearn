from rest_framework.routers import DefaultRouter
from .views import ChatMessageViewSet

router = DefaultRouter()
router.register(r'messages', ChatMessageViewSet)

urlpatterns = router.urls
