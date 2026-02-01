from django.urls import path
from rest_framework import routers
from .views import ReviewViewSet, UserViewSet

router = routers.DefaultRouter()
router.register(r"reviews", ReviewViewSet)
router.register(r"users", UserViewSet)
urlpatterns = router.urls
