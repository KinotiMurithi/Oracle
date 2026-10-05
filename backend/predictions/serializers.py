from django.utils import timezone

from rest_framework import serializers

from .models import Prediction


class PredictionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Prediction
        fields = [
            "id",
            "user",
            "event",
            "outcome",
            "confidence",
            "status",
            "reward_points",
            "created_at",
            "evaluated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "status",
            "reward_points",
            "created_at",
            "evaluated_at",
        ]

    def validate(self, attrs):
        request = self.context["request"]

        event = attrs["event"]
        outcome = attrs["outcome"]
        confidence = attrs["confidence"]

        if event.status != event.Status.OPEN:
            raise serializers.ValidationError(
                "This event is not accepting predictions."
            )

        if timezone.now() >= event.closes_at:
            raise serializers.ValidationError(
                "The prediction deadline has passed."
            )

        if outcome.event_id != event.id:
            raise serializers.ValidationError(
                "The selected outcome does not belong to this event."
            )

        if confidence < 0 or confidence > 100:
            raise serializers.ValidationError(
                "Confidence must be between 0 and 100."
            )

        if Prediction.objects.filter(
            user=request.user,
            event=event,
        ).exists():
            raise serializers.ValidationError(
                "You have already made a prediction for this event."
            )

        return attrs

    def create(self, validated_data):
        return Prediction.objects.create(
            user=self.context["request"].user,
            **validated_data,
        )