from django.shortcuts import render
from rest_framework import viewsets
from .models import Review
from .serializers import ReviewSerializer, ReveiwCreateSerializer
from .permissions import CustomReadOnly


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [CustomReadOnly]

    def get_serializer_class(self):
        if self.action == "create":
            return ReveiwCreateSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
