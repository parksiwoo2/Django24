from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Book
from .serializers import BookListSerializer, BookCreateSerializer

# 도서 리스트 조회 api 
class BookListView(generics.ListAPIView):
    queryset = Book.objects.all().order_by("-rating") # 추천 우선순위
    serializer_class = BookListSerializer

# 관리자 도서 추가 api
class BookCreateView(generics.CreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookCreateSerializer
    permission_classes = [permissions.IsAdminUser]
