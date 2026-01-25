from django.urls import path
from . import views

urlpatterns = [
    path('books/', views.book_search),
    path('books/requests/', views.create_book_request),
]
