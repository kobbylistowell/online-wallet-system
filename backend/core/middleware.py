from django.utils.deprecation import MiddlewareMixin
from django.conf import settings


class CorsMiddleware(MiddlewareMixin):
    """Add CORS headers so the frontend (e.g. Vite dev server) can call the API."""

    def process_response(self, request, response):
        origin = request.META.get('HTTP_ORIGIN')
        if origin and hasattr(settings, 'CORS_ALLOWED_ORIGINS') and origin in settings.CORS_ALLOWED_ORIGINS:
            response['Access-Control-Allow-Origin'] = origin
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        return response

    def process_request(self, request):
        if request.method == 'OPTIONS':
            origin = request.META.get('HTTP_ORIGIN')
            if origin and hasattr(settings, 'CORS_ALLOWED_ORIGINS') and origin in settings.CORS_ALLOWED_ORIGINS:
                from django.http import HttpResponse
                r = HttpResponse()
                r['Access-Control-Allow-Origin'] = origin
                r['Access-Control-Allow-Credentials'] = 'true'
                r['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
                r['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
                r['Access-Control-Max-Age'] = '86400'
                return r
        return None
