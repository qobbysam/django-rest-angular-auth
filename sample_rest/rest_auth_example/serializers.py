from rest_framework import serializers
from django.contrib.auth.models import User

from .models import UserProfile, Car

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('first_name', 'last_name', 'username', 'email')


class UserProfileSerializer(serializers.ModelSerializer):
	user = UserSerializer()
	class Meta:
		model = UserProfile

class CarSerializer(serializers.ModelSerializer):
	owner = UserSerializer()
	class Meta:
		model = Car



