from django.shortcuts import render
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from .models import Review, User, Book, BookRequest
from .serializers import (
    RegisterSerializer,
    ReviewSerializer,
    ReviewCreateSerializer,
    UserSerializer,
    CommentSerializer,
    BookSerializer,
    BookRequestSerializer,
    BookListSerializer,
    BookCreateSerializer,
)
from .permissions import CustomReadOnly
from rest_framework.decorators import api_view

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # 누구나 접근 가능해야 함


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [CustomReadOnly]

    def get_serializer_class(self):
        if self.action == "create":
            return ReviewCreateSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [CustomReadOnly]


class CommentCreateView(APIView):
    # 로그인한 사용자만 접근 가능
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CommentSerializer(data=request.data)

        if serializer.is_valid():
            # writer를 현재 로그인한 유저(request.user)로 강제 지정
            serializer.save(writer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookListView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.AllowAny]





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
