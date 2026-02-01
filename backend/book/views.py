from django.shortcuts import render
from rest_framework import viewsets,generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Review, User ,Book
from .serializers import (
    RegisterSerializer,
    ReviewSerializer,
    ReviewCreateSerializer,
    UserSerializer,
    CommentSerializer,
    BookSerializer,
)
from .permissions import CustomReadOnly


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] # 누구나 접근 가능해야 함

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