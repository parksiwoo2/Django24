from django.contrib import admin
from .models import Book, User, Author, Review, Sector, Comment, BookRequest

admin.site.register(Book)
admin.site.register(User)
admin.site.register(Author)
admin.site.register(Review)
admin.site.register(Sector)
admin.site.register(Comment)
admin.site.register(BookRequest)
