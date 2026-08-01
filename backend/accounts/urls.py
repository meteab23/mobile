from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import DemoUsersView, LoginView, MeView

urlpatterns = [
    path("login/", LoginView.as_view(), name="auth-login"),
    path("refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("demo-users/", DemoUsersView.as_view(), name="auth-demo-users"),
]
