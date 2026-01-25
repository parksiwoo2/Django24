from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Book, BookRequest, User
from .serializers import BookSerializer, BookRequestSerializer

@api_view(['GET'])
def book_search(request):
    tag = request.GET.get('tag')

    if not tag:
        return Response({"error": "tag 파라미터 필요"}, status=400)

    books = Book.objects.filter(tags__icontains=tag)
    serializer = BookSerializer(books, many=True)

    return Response(serializer.data)

@api_view(['POST'])
def create_book_request(request):
    serializer = BookRequestSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)
