from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Prediction
from .serializers import PredictionSerializer


class PredictionViewSet(viewsets.ModelViewSet):
    serializer_class = PredictionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Prediction.objects
            .filter(user=self.request.user)
            .select_related("event", "outcome")
        )