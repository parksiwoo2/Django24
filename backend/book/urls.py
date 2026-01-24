from django.urls import path
from rest_framework import routers
from .views import ReviewViewSet, UserInterestBookViewSet

router = routers.DefaultRouter()
router.register(r"review", ReviewViewSet)
router.register(r"interest-books", UserInterestBookViewSet)
urlpatterns = router.urls
