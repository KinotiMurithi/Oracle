from rest_framework import serializers

from .models import Event, Outcome


class OutcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outcome
        fields = [
            "id",
            "label",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]


class EventSerializer(serializers.ModelSerializer):
    outcomes = OutcomeSerializer(
        many=True,
        read_only=True,
    )

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
            "outcomes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "resolved_at",
            "winning_outcome",
            "outcomes",
            "created_at",
            "updated_at",
        ]