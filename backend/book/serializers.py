from rest_framework import serializers
from .models import Book

# 도서 리스트용 Serializer
class BookListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'autho',
            'translator',
            'publisher',
            'cover_image',
            'rating',
            'tags'
        ]

# 관리자 도서 등록용 Serializer
class BookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__" # 관리자는 모든 필드 입력 가능