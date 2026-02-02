from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from book.views import RegisterView, CommentCreateView, BookListView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("book.urls")),
    path("api/comments/", CommentCreateView.as_view(), name="comment-create"),
    path("api/login/", obtain_auth_token, name="api_token_auth"),
    path('api/register/', RegisterView.as_view()),
    path("api/books/", BookListView.as_view(), name="book-list"),
]
