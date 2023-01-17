from django.db import models

# Create your models here.
class SpotifyToken(models.Model):
    # things that should be in the room
    user = models.CharField(max_length=50, unique=True)
    access_token = models.CharField(max_length=150, unique=True)
    refresh_token = models.CharField(max_length=150, unique=True)
    create_at = models.DateTimeField(auto_now_add=True)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)
