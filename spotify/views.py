from django.shortcuts import render, redirect
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from requests import Request, post
from rest_framework import status
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
import base64
from .utils import is_spotify_authenticated

# Create your views here.
class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing"

        # initiate the authorization request
        url = Request("GET", "https://accounts.spotify.com/authorize", params=
                {
                    "client_id": CLIENT_ID,
                    "response_type": "code",
                    "redirect_uri": REDIRECT_URI,
                    "scope": scopes
                }).prepare().url
        
        return Response({"url": url}, status=status.HTTP_200_OK)

def spotify_callback(request, format=None):
    code = request.GET.get("code")
    error = request.GET.get("error")
    if error:
        print("error: " + error)

    response = post("https://accounts.spotify.com/api/token", data=
                {
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri': REDIRECT_URI,
                    'client_id': CLIENT_ID,
                    'client_secret': CLIENT_SECRET
                }).json()
    # headers={
    #                 "Authorization": "Basic " + str(base64.b64encode((CLIENT_ID + ":" + CLIENT_SECRET).encode()))[2:],
    #                 "Content-Type": "application/x-www-form-urlencoded"
    #             }
    print(response)
    
    access_token = response.get("access_token")
    token_type = response.get("token_type")
    refresh_token = response.get("refresh_token")
    expires_in = timezone.now() + timedelta(seconds=response.get("expires_in"))
    error = response.get("error")

    if not request.session.exists(request.session.session_key):
        request.session.create()
    
    user = request.session.session_key

    spotify_token, created = SpotifyToken.objects.update_or_create(
        user=user, access_token=access_token, refresh_token=refresh_token, defaults=
        {"expires_in": expires_in, "token_type": token_type}
    )

    return redirect("frontend:")

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        # print(is_authenticated)
        return Response({"status": is_authenticated}, status=status.HTTP_200_OK)


        
