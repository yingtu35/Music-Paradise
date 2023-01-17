from .models import SpotifyToken
from django.utils import timezone
from requests import post
from datetime import timedelta
import base64
from .credentials import CLIENT_ID, CLIENT_SECRET

def is_spotify_authenticated(session_id):
    tokens = SpotifyToken.objects.filter(user=session_id)
    # print(tokens)
    if tokens.exists():
        token = tokens[0]

        if token.expires_in <= timezone.now():
            refresh_token(token)
        return True
    
    return False

def refresh_token(token):
    refresh_token = token.refresh_token 

    response = post("https://accounts.spotify.com/api/token", data=
                {
                    "grant_type": "refresh_token",
                    "refresh_token": refresh_token,
                    'client_id': CLIENT_ID,
                    'client_secret': CLIENT_SECRET
                }).json()
    # headers={
    #                 "Authorization": "Basic " + str(base64.b64encode((CLIENT_ID + ":" + CLIENT_SECRET).encode()))[2:],
    #                 "Content-Type": "application/x-www-form-urlencoded"
    #             }

    access_token = response.get("access_token")
    token_type = response.get("token_type")
    refresh_token = response.get("refresh_token")
    expires_in = timezone.now() + timedelta(seconds=response.get("expires_in"))

    spotify_token, created = SpotifyToken.objects.update_or_create(
        user=token.user, access_token=access_token, refresh_token=refresh_token, defaults=
        {"expires_in": expires_in, "token_type": token_type}
    )