from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "id",
            "book",
            "reviewer",
            "description",
            "posted_at",
            "rating",
            "level",
        ]


class ReveiwCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "book",
            "description",
            "rating",
            "level",
        ]
