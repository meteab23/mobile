from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/trucks/", include("trucks.urls")),
    path("api/customers/", include("customers.urls")),
    path("api/quotations/", include("quotations.urls")),
    path("api/inventory/", include("inventory.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/search/", include("search.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
