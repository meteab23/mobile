from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")


class IsSalesManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ("admin", "sales_manager")
        )


class IsSalesStaff(BasePermission):
    """Admin, sales manager, or salesperson — can create/edit sales data."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ("admin", "sales_manager", "salesperson")
        )


class ReadOnlyOrSalesStaff(BasePermission):
    """Viewers can read; sales staff can write."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.role in ("admin", "sales_manager", "salesperson")


class ReadOnlyOrManager(BasePermission):
    """Viewers/sales can read; managers+ can write (pricing, inventory edits)."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.role in ("admin", "sales_manager")
