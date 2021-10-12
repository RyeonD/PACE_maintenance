from django.db import models

class Custom(models.Model):
    message=models.CharField(max_length=100)

class Store(models.Model):
    message=models.CharField(max_length=100)

# Create your models here.
class UserInfo(models.Model):
    user_id = models.CharField(max_length=200)
    user_point = models.IntegerField(default=0)
