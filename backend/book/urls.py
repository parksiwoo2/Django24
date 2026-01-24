from django.urls import path
from rest_framework import routers
from .views import ReviewViewSet

router = routers.DefaultRouter()
router.register(r"posts", ReviewViewSet)
urlpatterns = router.urls
