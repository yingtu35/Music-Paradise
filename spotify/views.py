from django.shortcuts import render, redirect
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from requests import Request, post
from rest_framework import status
from .models import SpotifyToken, VoteNext, VotePrev
from django.utils import timezone
from datetime import timedelta
import base64
from .utils import *
from api.models import Room
import json

# Create your views here.
class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control"

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
    # print(response)
    
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

class CurrentSong(APIView):
    def get(self, request, format=None):
        room = get_current_room(self.request.session)
        if not room:
            return Response({"Error": "You are not in a room"}, status=status.HTTP_404_NOT_FOUND)

        host = room.host
        endpoint = "player/currently-playing"

        response = execute_request(host, endpoint)
        if "error" in response:
            # need to fetch the request again because the token of the host has expired
            if response.get("error").get("status") == 401 and self.request.session.session_key == host:
                user_token = get_user_tokens(self.request.session.session_key)
                refresh_token(user_token)
                # print("Token is automatically refreshed!")
                response = execute_request(host, endpoint)
            else:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)

        if "item" not in response:
            return Response(response, status=status.HTTP_204_NO_CONTENT)

        item = response.get("item")
        progress = response.get("progress_ms")
        duration = item.get("duration_ms")
        album_cover_src = item.get("album").get("images")[0].get("url")
        is_playing = response.get("is_playing")
        song_id = item.get("id")
        artists = ", ".join([artist.get("name") for artist in item.get("artists")])
        # Currently cannot get device information
        # volume = response.get("device").get("volume_percent")

        self.update_room_song(room, song_id)

        song = {
            "title": item.get("name"),
            "artist": artists,
            "duration": duration,
            "time": progress,
            "image_url": album_cover_src,
            "is_playing": is_playing,
            "votes_next": VoteNext.objects.filter(room=room, song_id=room.current_song).count(),
            "votes_prev": VotePrev.objects.filter(room=room, song_id=room.current_song).count(),
            "votesToSkip": room.votes_to_skip,
            "id": song_id,
            # "volume": volume
        }
        return Response(song, status=status.HTTP_200_OK)
    
    def update_room_song(self, room:Room, song_id):
        if room.current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=["current_song"])
            


class PauseSong(APIView):
    def put(self, request, format=None):
        room = get_current_room(self.request.session)
        if not room:
            return Response({"Error": "You are not in a room"}, status=status.HTTP_404_NOT_FOUND)

        if self.request.session.session_key == room.host or room.guest_can_pause:
            host = room.host
            endpoint = "player/pause"

            response = execute_request(host, endpoint, put_=True)
            if "error" in response:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
        
            return Response({"Success": "Song is paused."}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_403_FORBIDDEN)

class PlaySong(APIView):
    def put(self, request, format=None):
        room = get_current_room(self.request.session)
        if not room:
            return Response({"Error": "You are not in a room"}, status=status.HTTP_404_NOT_FOUND)
        
        if self.request.session.session_key == room.host or room.guest_can_pause:
            host = room.host
            endpoint = "player/play"

            response = execute_request(host, endpoint, put_=True)
            if "error" in response:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({"Success": "Song is played."}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_403_FORBIDDEN)

class SkipToNextSong(APIView):
    def post(self, request, format=None):
        room = get_current_room(self.request.session)
        if not room:
            return Response({"Error": "You are not in a room"}, status=status.HTTP_404_NOT_FOUND)
        
        is_voted = VoteNext.objects.filter(user=self.request.session.session_key, room=room, song_id=room.current_song)
        if is_voted:
            return Response({"Error": "Already voted."}, status=status.HTTP_403_FORBIDDEN)
        
        votes_next = VoteNext.objects.filter(room=room, song_id=room.current_song)
        votes_to_skip = room.votes_to_skip

        if self.request.session.session_key == room.host or (votes_next.count()+1) >= votes_to_skip:
            host = room.host
            endpoint = "player/next"
            response = execute_request(host, endpoint, post_=True)

            if "error" in response:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)

            VotePrev.objects.filter(room=room, song_id=room.current_song).delete()
            votes_next.delete()
            return Response({"Success": "Play next song."}, status=status.HTTP_200_OK)
        else:
            _ = VoteNext.objects.create(user=self.request.session.session_key, room=room, song_id=room.current_song)
            return Response({"Success": "Vote accepted."}, status=status.HTTP_202_ACCEPTED)
        
        

class SkipToPreviousSong(APIView):
    def post(self, request, format=None):
        room = get_current_room(self.request.session)
        if not room:
            return Response({"Error": "You are not in a room"}, status=status.HTTP_404_NOT_FOUND)
            
        is_voted = VotePrev.objects.filter(user=self.request.session.session_key, room=room, song_id=room.current_song).exists()
        if is_voted:
            return Response({"Error": "Already voted."}, status=status.HTTP_403_FORBIDDEN)

        votes_prev = VotePrev.objects.filter(room=room, song_id=room.current_song)
        votes_to_skip = room.votes_to_skip

        if self.request.session.session_key == room.host or (votes_prev.count()+1) >= votes_to_skip:
            host = room.host
            endpoint = "player/previous"
            response = execute_request(host, endpoint, post_=True)

            if "error" in response:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            
            VoteNext.objects.filter(room=room, song_id=room.current_song).delete()
            votes_prev.delete()
            print("votes deleted")
            
            return Response({"Success": "Play previous song."}, status=status.HTTP_200_OK)
        else:
            _ = VotePrev.objects.create(user=self.request.session.session_key, room=room, song_id=room.current_song)
            return Response({"Success": "Vote accepted."}, status=status.HTTP_202_ACCEPTED)

class SetVolume(APIView):
    def put(self, request, format=None):
        room = get_current_room(self.request.session)
        if not room:
            return Response({"Error": "You are not in a room"}, status=status.HTTP_404_NOT_FOUND)
        
        if self.request.session.session_key == room.host:
            host = room.host
            data = json.loads(request.body)
            endpoint = "player/volume?volume_percent=" + str(data.get("volume_percent"))
            
            print(data)
            response = execute_request(host, endpoint, put_=True, data=data)

            print(response)

            if "error" in response:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({"Success": "Volume is changed."}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_403_FORBIDDEN)





        
