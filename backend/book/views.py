from django.shortcuts import render, get_object_or_404, redirect
from .models import Book, Author, Review

# 1. 작가 상세 페이지
def author_detail(request, author_id):
    author = get_object_or_404(Author, pk=author_id)
    books = author.books.all()
    return render(request, 'book/author_detail.html', {'author': author, 'books': books})

# 2. 책 상세 페이지 (별점 등록 포함)
def book_detail(request, book_id):
    book = get_object_or_404(Book, pk=book_id)
    reviews = book.reviews.all()
    return render(request, 'book/book_detail.html', {'book': book, 'reviews': reviews})

# 3. 별점 등록 기능
def rate_book(request, book_id):
    if request.method == 'POST':
        book = get_object_or_404(Book, pk=book_id)
        
        # 로그인 안 했으면 관리자 로그인으로 튕김 (테스트용)
        if not request.user.is_authenticated:
            return redirect('/admin/login/')
            
        Review.objects.create(
            book=book,
            user=request.user,
            rating=int(request.POST.get('rating')),
            content=request.POST.get('content')
        )
        return redirect('book_detail', book_id=book.id)