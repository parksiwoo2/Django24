from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    translator = models.CharField(max_length=100, blank=True)
    publisher = models.CharField(max_length=100)
    CATEGORY_CHOICES = [
        ("fairy_tale", "동화"),
        ("thriller", "스릴러"),
        ("mystery", "미스터리/추리"),
        ("romance", "로맨스"),
        ("fantasy", "판타지"),
        ("sf", "SF"),
        ("essay", "에세이"),
        ("humanities", "인문"),
        ("self_dev", "자기계발"),
        ("business", "경제/경영"),
        ("it", "IT/개발"),
        ("history", "역사"),
        ("science", "과학"),
        ("etc", "기타"),
    ]
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="etc",
        verbose_name="태그",
    )
    published_date = models.DateField()
    isbn = models.CharField(max_length=13)
    pages = models.IntegerField()
    cover_image = models.URLField()
    description = models.TextField()
    rating = models.FloatField()
    difficulty = models.IntegerField(default=3) # 독서 난이도 (1-5), 책 추천을 위해 추가
    mbti_tags = models.


class User(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    nickname = models.CharField(max_length=100)
    interest_book = models.ManyToManyField(Book, related_name="interested_users")


class Author(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    books = models.ManyToManyField(Book, related_name="authors")


class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    posted_at = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField()
    level = models.IntegerField()
    comment = GenericRelation("Comment", related_query_name="review")


class Sector(models.Model):
    SECTOR_TYPE = (
        ("PAGE_ASC", "페이지 적은 순"),
        ("PAGE_DESC", "페이지 많은 순"),
        ("DIFFICULTY_ASC", "쉬운 책부터"),
        ("DIFFICULTY_DESC", "어려운 책부터"),
        ("RATING_DESC", "평점 높은 순"),
        ("MBTI_MATCH", "MBTI 기반"),
    )

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=30, choices=SECTOR_TYPE)
    rule = models.JSONField(null=True, blank=True)
    book = models.ManyToManyField(Book, related_name="Sector", blank=True)


class Comment(models.Model):
    # 1. 작성자 및 내용
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # 2. 어떤 모델에 대한 댓글인지 설정 (Generic Relation)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    # 3. 대댓글 구현 (자기 참조)
    # parent가 null이면 원본 댓글, 값이 있으면 그 댓글의 대댓글입니다.
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies"
    )


class BookRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    book_title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    translator = models.CharField(max_length=100, blank=True)
    publisher = models.CharField(max_length=100)
    reason = models.TextField()
    requested_at = models.DateTimeField(auto_now_add=True)
    comment = GenericRelation("Comment", related_query_name="book_request")
