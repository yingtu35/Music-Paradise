from .models import SpotifyToken
from api.models import Room
from django.utils import timezone
from requests import post, get, put
from datetime import timedelta
import base64
from .credentials import CLIENT_ID, CLIENT_SECRET
import json

BASIC_URI = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    # print(user_tokens)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def is_spotify_authenticated(session_id):
    token = get_user_tokens(session_id)
    # print(tokens)
    if token:
        if token.expires_in <= timezone.now():
            refresh_token(token)
        return True
    
    return False

def refresh_token(token):
    user = token.user
    refresh_token = token.refresh_token
    expired_access_token = token.access_token 

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
    # print(response)

    access_token = response.get("access_token")
    token_type = response.get("token_type")
    expires_in = timezone.now() + timedelta(seconds=response.get("expires_in"))

    spotify_token, created = SpotifyToken.objects.update_or_create(
        user=user, access_token=expired_access_token, refresh_token=refresh_token, defaults=
        {"access_token": access_token, "expires_in": expires_in, "token_type": token_type}
    )

def get_current_room(session):
    roomCode = session.get("room_code")
    queryset = Room.objects.filter(code=roomCode)
    if not queryset.exists():
        return False
    return queryset[0]

def execute_request(session_id, endpoint, post_=False, put_=False, data={}):
    token = get_user_tokens(session_id)
    if token:
        access_token = token.access_token
        endpoint = BASIC_URI + endpoint
        headers = {"Authorization": "Bearer " + access_token, 
                    "Content-Type": "application/json"
                    }

        if post_:
            response = post(endpoint, data=data, headers=headers)
        elif put_:
            response = put(endpoint, data=data, headers=headers)
        else:
            response = get(endpoint, {}, headers=headers)
        
        # print(response.json())

        # Not all response will succeed
        try:
            return response.json()
        except:
            # return {"Error": "Problems with request"}
            return response
        

