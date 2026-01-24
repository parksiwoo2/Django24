from rest_framework import permissions
from django.contrib.auth import get_user_model

class CustomReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "GET":
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        user_field = None
        for field in ['reviewer', 'writer', 'requester']:
            if hasattr(obj, field):
                user_field = getattr(obj, field)
                break
        if isinstance(obj, get_user_model()):
            return obj == request.user  
        return user_field == request.user
