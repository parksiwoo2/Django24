from rest_framework import serializers
from .models import Review, User, Comment, Book,BookRequest
from django.contrib.contenttypes.models import ContentType

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["nickname", "interest_book"]


class RegisterSerializer(serializers.ModelSerializer):
    # 비밀번호는 쓰기 전용으로 설정 (응답에 포함되지 않게)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "password", "nickname"]

    def create(self, validated_data):
        # User.objects.create 대신 create_user를 써야 비밀번호가 암호화되어 저장됩니다.
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            nickname=validated_data["nickname"],
        )
        return user


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    content_type = serializers.CharField(write_only=True)
    writer = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"

    def create(self, validated_data):
        model_name = validated_data.pop("content_type")

        try:
            # 2. 문자열에 맞는 ContentType 동적 검색
            # (앱 이름은 본인의 프로젝트에 맞게 수정하거나, 반복문으로 찾게 할 수 있습니다)
            content_type = ContentType.objects.get(model=model_name.lower())

            return Comment.objects.create(content_type=content_type, **validated_data)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(
                {"model_type": "존재하지 않는 모델 타입입니다."}
            )


class CreateCommentSerializer(serializers.ModelSerializer):
    content_type = serializers.CharField(write_only=True)
    object_id = serializers.IntegerField(write_only=True)
    writer = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Comment
        fields = [
            "writer",
            "content",
            "content_type",
            "object_id",
            "parent",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    comment = CommentSerializer(many=True, read_only=True)
    reviewer = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = "__all__"


class ReviewCreateSerializer(serializers.ModelSerializer):
    reviewer = serializers.CharField(read_only=True)

    class Meta:
        model = Review
        fields = [
            "book",
            "reviewer",
            "description",
            "rating",
            "level",
        ]





class BookSerializer(serializers.ModelSerializer):
    category_label = serializers.CharField(
        source="get_category_display", read_only=True
    )

    class Meta:
        model = Book
        fields = "__all__"


class BookListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "autho",
            "publisher",
            "cover_image",
            "rating",
            "tags",
        ]


class BookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"


class BookRequestSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    requested_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = BookRequest
        fields = "__all__"
