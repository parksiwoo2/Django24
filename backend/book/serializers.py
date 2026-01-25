from rest_framework import serializers
from .models import Book, BookRequest


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"


class BookRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRequest
        fields = "__all__"
