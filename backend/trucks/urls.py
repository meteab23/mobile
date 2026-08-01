from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import TruckViewSet

router = DefaultRouter()
router.register("", TruckViewSet, basename="truck")

urlpatterns = [
    path("", include(router.urls)),
]
