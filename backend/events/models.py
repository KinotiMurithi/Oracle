from django.db import models


class Event(models.Model):
    class Category(models.TextChoices):
        WEATHER = "WEATHER", "Weather"
        SPORTS = "SPORTS", "Sports"
        POLITICS = "POLITICS", "Politics"
        ECONOMICS = "ECONOMICS", "Economics"
        TECHNOLOGY = "TECHNOLOGY", "Technology"
        GENERAL = "GENERAL", "General"

    class Status(models.TextChoices):
        OPEN = "OPEN", "Open"
        CLOSED = "CLOSED", "Closed"
        RESOLVED = "RESOLVED", "Resolved"
        CANCELLED = "CANCELLED", "Cancelled"

    question = models.CharField(max_length=500)

    description = models.TextField(blank=True)

    category = models.CharField(
        max_length=20,
        choices=Category.choices,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
    )

    resolution_source = models.URLField(
        blank=True,
        help_text="Source used to verify the real-world outcome.",
    )

    opens_at = models.DateTimeField()

    closes_at = models.DateTimeField()

    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    winning_outcome = models.ForeignKey(
        "Outcome",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="won_events",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.question


class Outcome(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="outcomes",
    )

    label = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.event.question} → {self.label}"