from django.contrib.auth.models import User
from django.db import models


class ForecasterProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="forecaster_profile",
    )

    rating = models.PositiveIntegerField(
        default=1000,
    )

    predictions_count = models.PositiveIntegerField(
        default=0,
    )

    correct_predictions = models.PositiveIntegerField(
        default=0,
    )

    incorrect_predictions = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-rating"]

    def __str__(self):
        return f"{self.user.username} - {self.rating}"