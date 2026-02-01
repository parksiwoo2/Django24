from rest_framework import serializers
from .models import Book, BookRequest


class BookSerializer(serializers.ModelSerializer):
    category_label = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Book
        fields = "__all__"


class BookRequestSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    requested_at = serializers.DateTimeField(read_only=True)
    class Meta:
        model = BookRequest
        fields = "__all__"