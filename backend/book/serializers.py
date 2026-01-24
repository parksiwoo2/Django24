from rest_framework import serializers
from .models import Review,User


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

class UserInterestBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["interest_book"]