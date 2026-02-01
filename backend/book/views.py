from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, permissions

from .models import Book, BookRequest
from .serializers import (
    BookSerializer,
    BookRequestSerializer,
    BookListSerializer,
    BookCreateSerializer,
)

@api_view(["GET"])
def book_search(request):
    category = request.GET.get("category")

    books = Book.objects.all()
    if category:
        books = books.filter(category=category)

    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)



@api_view(["GET", "POST"])
def create_book_request(request):
    if request.method == "GET":
        requests = BookRequest.objects.all()
        serializer = BookRequestSerializer(requests, many=True)
        return Response(serializer.data)

    serializer = BookRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


class BookListView(generics.ListAPIView):
    queryset = Book.objects.all().order_by("-rating")
    serializer_class = BookListSerializer


class BookCreateView(generics.CreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookCreateSerializer
    permission_classes = [permissions.IsAdminUser]
