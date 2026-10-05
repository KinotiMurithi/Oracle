from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Event
from .serializers import EventSerializer


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.prefetch_related("outcomes").all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]