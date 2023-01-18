# Generated by Django 4.1.5 on 2023-01-17 06:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_room_current_song"),
        ("spotify", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Vote",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("user", models.CharField(max_length=50, unique=True)),
                ("create_at", models.DateTimeField(auto_now_add=True)),
                ("song_id", models.CharField(max_length=50)),
                (
                    "room",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.room"
                    ),
                ),
            ],
        ),
    ]
