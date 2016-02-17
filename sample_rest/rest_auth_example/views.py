from django.shortcuts import render

from .models import Car
from .serializers import UserSerializer, CarSerializer, UserProfileSerializer

from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.views import SocialLoginView

from allauth.socialaccount.providers.oauth2.client import OAuth2Client

from rest_framework import status


'''Login and registration will be handled with django-rest-auth this is an example of how 
	you would do a social login in view to work with django-all auth and django - rest auth.

	Django rest-auth will connect with your user profile to pull user info via the /user/ endpoint
	on your urls
'''


class FacebookLogin(SocialLoginView):
	adapter_class = FacebookOAuth2Adapter
	client_class = OAuth2Client
	callback_url = "http://localhost:8100/"


class GoogleLogin(SocialLoginView):
	adapter_class = GoogleOAuth2Adapter
	client_class = OAuth2Client
	callback_url = 'http://localhost:8100/'


class CarFeed(generics.ListAPIView):
	queryset = Car.objects.all()
	serializer_class = CarSerializer

class OneCar(generics.RetrieveAPIView):
	queryset = Car.objects.all()
	serializer_class = CarSerializer

class OwnerCarFeed(generics.RetrieveUpdateDestroyAPIView):
	authentication_class = (IsAuthenticated,)
	serializer_class = CarSerializer

	def get_queryset(self):

		return Car.objects.filter(owner=self.request.user)

	def get(self,request): 
		data = self.get_serializer(self.get_queryset(), many=True)
		return Response(data.data)


	def post(self, request):

		serializer = self.get_serializer(data=request.data)

		serializer.is_valid(raise_exception = True)
		serializer.save()

		return Response(serializer.data, status = status.HTTP_200_OK)

	def delete(self, request, pk):

		Car.objects.filter(pk=pk).delete()

		return Response("delete Sucessful", status=status.HTTP_200_OK)

	def put(self, request, pk):

		serializer = self.get_serializer(data=request.data)
		serializer.save()
		return Response(serializer.data, status= status.HTTP_200_OK)
