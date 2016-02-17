from django.conf.urls import include, url

from .views import FacebookLogin, GoogleLogin, CarFeed, OwnerCarFeed, OneCar



urlpatterns = [

	url(r'^api-auth-rest/', include('rest_framework.urls',namespace='rest_framework')),
    url(r'^$', CarFeed.as_view()),
    url(r'^one-car/', OneCar.as_view()),
    url(r'^facebook/',FacebookLogin.as_view()),
    url(r'^google/',GoogleLogin.as_view()),
    url(r'^owner/',OwnerCarFeed.as_view()),
    url(r'^rest-auth/', include('rest_auth.urls')),
	url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),


    
]