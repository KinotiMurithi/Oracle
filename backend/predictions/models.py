from django.contrib.auth.models import User
from django.db import models

from events.models import Event, Outcome


class Prediction(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CORRECT = "CORRECT", "Correct"
        INCORRECT = "INCORRECT", "Incorrect"
        VOID = "VOID", "Void"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="predictions",
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="predictions",
    )

    outcome = models.ForeignKey(
        Outcome,
        on_delete=models.CASCADE,
        related_name="predictions",
    )

    confidence = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Forecast confidence as a percentage from 0 to 100.",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    reward_points = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    evaluated_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "event"],
                name="unique_prediction_per_user_event",
            ),
        ]

    def __str__(self):
        return f"{self.user.username} → {self.event.question}"