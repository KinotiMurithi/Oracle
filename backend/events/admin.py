from django.contrib import admin

from .models import Event, Outcome


class OutcomeInline(admin.TabularInline):
    model = Outcome
    extra = 2
    fields = ["label"]


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        "question",
        "category",
        "status",
        "opens_at",
        "closes_at",
        "created_at",
    ]

    list_filter = [
        "category",
        "status",
    ]

    search_fields = [
        "question",
        "description",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
        "resolved_at",
    ]

    fieldsets = [
        (
            "Event",
            {
                "fields": [
                    "question",
                    "description",
                    "category",
                    "status",
                ]
            },
        ),
        (
            "Schedule",
            {
                "fields": [
                    "opens_at",
                    "closes_at",
                ]
            },
        ),
        (
            "Resolution",
            {
                "fields": [
                    "resolution_source",
                    "winning_outcome",
                    "resolved_at",
                ]
            },
        ),
        (
            "System",
            {
                "fields": [
                    "created_at",
                    "updated_at",
                ]
            },
        ),
    ]

    inlines = [
        OutcomeInline,
    ]


@admin.register(Outcome)
class OutcomeAdmin(admin.ModelAdmin):
    list_display = [
        "label",
        "event",
        "created_at",
    ]

    list_filter = [
        "event",
    ]

    search_fields = [
        "label",
        "event__question",
    ]

    readonly_fields = [
        "created_at",
    ]