from django.db import models

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

# Create your models here.

class UserProfile(models.Model):
	user = models.OneToOneField(User, related_name="profileOwner")
	birth_place = models.CharField(max_length=50, blank=True, null=True)


class Car(models.Model):
	owner = models.ForeignKey(User, related_name="carOwner")
	car_name = models.CharField(max_length=50)
	time_created = models.DateTimeField(auto_now_add = True)

'''This will handle the creation of Tokens for each user that is created'''

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)