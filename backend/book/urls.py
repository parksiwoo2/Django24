from django.urls import path
from rest_framework import routers
from .views import ReviewViewSet, UserViewSet
from . import views

router = routers.DefaultRouter()
router.register(r"reviews", ReviewViewSet)
router.register(r"users", UserViewSet)
urlpatterns = [
    path("books/", views.book_search),
    path("books/requests/", views.create_book_request),
]
urlpatterns += router.urls
