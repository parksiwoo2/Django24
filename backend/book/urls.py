from django.urls import path
from . import views

urlpatterns = [
    path('author/<int:author_id>/', views.author_detail, name='author_detail'),
    path('detail/<int:book_id>/', views.book_detail, name='book_detail'),
    path('detail/<int:book_id>/rate/', views.rate_book, name='rate_book'),
]