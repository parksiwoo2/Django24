from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db.models import Avg  
class Book(models.Model):
    title = models.CharField(max_length=200)
    
    publisher = models.CharField(max_length=100)
    tags = models.CharField(max_length=200, blank=True) 
    published_date = models.DateField()
    isbn = models.CharField(max_length=13)
    pages = models.IntegerField()
    cover_image = models.URLField(blank=True)
    description = models.TextField()
    rating = models.FloatField(default=0.0) 

    def __str__(self):
        return self.title

    def update_rating(self):

        avg = self.reviews.aggregate(Avg('rating'))['rating__avg']
        self.rating = round(avg, 1) if avg else 0.0
        self.save()


class User(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    nickname = models.CharField(max_length=100)
    interest_book = models.ManyToManyField(Book, related_name="interested_users")
    
    def __str__(self):
        return self.nickname

class Author(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
   
    books = models.ManyToManyField(Book, related_name="authors") 

    def __str__(self):
        return self.name

class Review(models.Model):
   
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    
  
  
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_written')
    
    description = models.TextField() 
    rating = models.IntegerField()   
    level = models.IntegerField(default=1) 
    
  
    comment = GenericRelation("Comment", related_query_name="review")
    
    created_at = models.DateTimeField(auto_now_add=True)
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        self.book.update_rating()

class Sector(models.Model):
    name = models.CharField(max_length=200)
    book = models.ManyToManyField(Book, related_name="sectors") 

class Comment(models.Model):
    
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies"
    )

class BookRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book_title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    publisher = models.CharField(max_length=100)
    reason = models.TextField()
    requested_at = models.DateTimeField(auto_now_add=True)
    comment = GenericRelation("Comment", related_query_name="book_request")