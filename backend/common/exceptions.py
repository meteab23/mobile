from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    """Normalize API error responses for the frontend toast layer."""
    response = exception_handler(exc, context)
    if response is not None:
        detail = response.data
        if isinstance(detail, dict):
            message = detail.get("detail") or detail.get("non_field_errors") or detail
            if isinstance(message, list):
                message = message[0]
        elif isinstance(detail, list):
            message = detail[0]
        else:
            message = str(detail)
        response.data = {
            "success": False,
            "message": str(message),
            "errors": detail if isinstance(detail, dict) else {"detail": detail},
        }
    return response
