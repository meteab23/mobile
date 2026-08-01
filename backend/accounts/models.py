from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user with role-based access for the dealership ERP."""

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        SALES_MANAGER = "sales_manager", "Sales Manager"
        SALESPERSON = "salesperson", "Salesperson"
        VIEWER = "viewer", "Viewer"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.VIEWER)
    phone = models.CharField(max_length=30, blank=True)
    job_title = models.CharField(max_length=100, blank=True)
    avatar_color = models.CharField(max_length=7, default="#1976d2")

    class Meta:
        ordering = ["username"]

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"

    @property
    def is_admin_role(self):
        return self.role == self.Role.ADMIN or self.is_superuser

    @property
    def can_manage_sales(self):
        return self.role in (self.Role.ADMIN, self.Role.SALES_MANAGER)

    @property
    def can_create_quotations(self):
        return self.role in (
            self.Role.ADMIN,
            self.Role.SALES_MANAGER,
            self.Role.SALESPERSON,
        )
