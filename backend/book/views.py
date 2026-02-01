from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Book, BookRequest, User
from .serializers import BookSerializer, BookRequestSerializer

@api_view(['GET'])
def book_search(request):
    category = request.GET.get('category') 

    books = Book.objects.all()
    if category:
        books = books.filter(category=category)

    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def create_book_request(request):

    if request.method == 'GET':
        requests = BookRequest.objects.all()
        serializer = BookRequestSerializer(requests, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = BookRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
