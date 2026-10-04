from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id",
            "question",
            "description",
            "category",
            "status",
            "resolution_source",
            "opens_at",
            "closes_at",
            "resolved_at",
            "winning_outcome",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "resolved_at",
            "winning_outcome",
            "created_at",
            "updated_at",
        ]