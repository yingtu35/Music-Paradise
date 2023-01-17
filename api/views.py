from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSEerializar, UpdateRoomSEerializar
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class JoinRoomView(APIView):
    lookup_kwarg = "code"
    serializer_class = RoomSerializer

    def post(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_kwarg)
        if code != None:
            queryset = Room.objects.filter(code=code)

            if queryset.exists():
                room = queryset[0]
                self.request.session["room_code"] = code
                return Response({"message": "Room Joined!"}, status=status.HTTP_200_OK)

            return Response({"Bad Request": "Invalid Room Code"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"Bad Request": "Invalid Post data, did not find a code key"}, status=status.HTTP_400_BAD_REQUEST)

class GetRoomView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = "code"

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Room.objects.filter(code=code)
            if queryset.exists():
                room = queryset[0]
                data = RoomSerializer(room).data
                data["is_host"] = self.request.session.session_key == room.host
                # print(data["is_host"])
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response({"Room Not Found": "Invalid Room Code"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"Bad Request": "Room Code Parameter Missing"}, status=status.HTTP_400_BAD_REQUEST)

class CreateRoomView(APIView):
    serializer_class = CreateRoomSEerializar

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # get the data sent by user    
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key

            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                self.request.session["room_code"] = room.code
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                self.request.session["room_code"] = room.code
                room.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoomView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        # print(self.request.session.session_key)
        data = {
            "code": self.request.session.get("room_code")
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoomView(APIView):
    def post(self, request, format=None):
        if "room_code" in self.request.session:
            self.request.session.pop("room_code")

            host_id = self.request.session.session_key
            rooms = Room.objects.filter(host=host_id)
            if rooms.exists():
                room = rooms[0]
                room.delete()
            return Response({"Message": "Successfully Leave Room"}, status=status.HTTP_200_OK)
        return Response({"Bad Request": "No Room Code"}, status=status.HTTP_400_BAD_REQUEST)

class UpdateRoomView(APIView):
    serializer_class= UpdateRoomSEerializar

    def patch(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            votes_to_skip = serializer.data.get("votes_to_skip")
            guest_can_pause = serializer.data.get("guest_can_pause")
            code = serializer.data.get("code")

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({"Room Not Found": "Invalid Room Code"}, status=status.HTTP_400_BAD_REQUEST)
            room = queryset[0]
            
            user = self.request.session.session_key
            if room.host != user:
                return Response({"Update Forbidden": "You are not the host of the room"}, status=status.HTTP_403_FORBIDDEN)

            room.votes_to_skip = votes_to_skip
            room.guest_can_pause = guest_can_pause
            room.save(update_fields=["votes_to_skip", "guest_can_pause"])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        
        return Response({"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST)