from django.db import models
from api.models import Room

# Create your models here.
class SpotifyToken(models.Model):
    # things that should be in the room
    user = models.CharField(max_length=50, unique=True)
    access_token = models.CharField(max_length=150, unique=True)
    refresh_token = models.CharField(max_length=150, unique=True)
    create_at = models.DateTimeField(auto_now_add=True)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

class VoteNext(models.Model):
    user = models.CharField(max_length=50, unique=True)
    create_at = models.DateTimeField(auto_now_add=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    song_id = models.CharField(max_length=50)

class VotePrev(models.Model):
    user = models.CharField(max_length=50, unique=True)
    create_at = models.DateTimeField(auto_now_add=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    song_id = models.CharField(max_length=50)
