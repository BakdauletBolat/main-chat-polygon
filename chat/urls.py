
from django.contrib import admin
from django.urls import path
from .views import DialogListView,MessageCreateView,UserListApiView,UserMe


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('me/',UserMe.as_view()),
    path('users/',UserListApiView.as_view()),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('create-message/',MessageCreateView.as_view()),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('<str:username>/', DialogListView.as_view()),
]
