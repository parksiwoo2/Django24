from rest_framework.test import APITestCase
from rest_framework.views import status
from django.shortcuts import resolve_url
from django.urls import reverse
from .models import *

# 리뷰 조회(조회는 다 가능, cud는 로그인 요구)
# 리뷰 등록
# 유저의 관심 책 목록 조회
# 유저의 관심 책 목록 수정(본인만 가능)
# 댓글 등록
# 댓글 조회(서평, 대댓글), 도서 신청 댓글은 본인이랑 관리자만 가능


class ReviewViewSetTest(APITestCase):

    def setUp(self):
        """테스트용 유저와 리뷰, 댓글 생성"""
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        self.another_user = User.objects.create_user(
            username="anotheruser", password="password123"
        )
        self.book = Book.objects.create(
            title="Test Book",
            author="Test Author",
            publisher="Test Publisher",
            tags="test,book",
            published_date="2024-01-01",
            isbn="1234567890123",
            pages=300,
            cover_image="http://example.com/cover.jpg",
            description="A test book.",
            rating=4.5,
        )
        self.review = Review.objects.create(
            book=self.book,
            reviewer=self.user,
            description="Great book!",
            rating=5,
            level=5,
        )
        self.comment = Comment.objects.create(
            content="Nice review!", writer=self.user, content_object=self.review
        )

    def test_list_and_retrieve(self):
        """조회는 한 함수에서 묶어서 테스트 가능 (가성비)"""
        self.client.get(reverse("review-list"))
        self.client.get(reverse("review-detail", kwargs={"pk": self.review.id}))
        # ... assert ...

    def test_permission_denied_for_anonymous(self):
        """비로그인 유저가 글쓰기 시도할 때 막히는지 (보안 핵심)"""
        response = self.client.post(reverse("review-list"), data={})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_only_author_can_delete(self):
        """본인만 삭제 가능한지 (로직 핵심)"""
        self.client.force_authenticate(user=self.another_user)  # 남의 계정으로 로그인
        response = self.client.delete(
            reverse("review-detail", kwargs={"pk": self.review.id})
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
