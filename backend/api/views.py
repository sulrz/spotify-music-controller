from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Room
from .serializers import CreateRoomSerializer, RoomSerializer, UpdateRoomSerializer


# Create your views here.
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoomView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = "code"

    def get(self, request, format=None):
        print(f"User: {self.request.session.session_key} got the room")

        res = Response(data={})
        code = self.request.GET.get(self.lookup_url_kwarg)

        if self.request.session.get("room_code") != code:
            res = Response(
                data={"message": "Bad Request: Join before accessing"},
                status=status.HTTP_403_FORBIDDEN,
            )
        elif code != None:
            rooms = Room.objects.filter(code=code)
            if len(rooms) > 0:
                data = RoomSerializer(rooms[0]).data
                data["is_host"] = self.request.session.session_key == rooms[0].host
                res = Response(
                    data=data,
                    status=status.HTTP_200_OK,
                    # headers={
                    #     "Access-Control-Allow-Credentials": "true",
                    #     # "Cross-Origin-Opener-Policy": "unsafe-none",
                    # },
                )
            else:
                res = Response(
                    data={"message": "Room Not Found: Invalid Room Code"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            res = Response(
                data={"message": "Bad Request: Code parameter not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        res.set_cookie(key="sessionid", value=self.request.session.session_key)
        return res


class JoinRoomView(APIView):
    lookup_url_kwarg = "code"

    def post(self, request, format=None):
        print(self.request.COOKIES)

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        print(f"User: {self.request.session.session_key} joined the room")

        code = self.request.data.get(self.lookup_url_kwarg)
        res = Response(data={})

        if code != None:
            rooms = Room.objects.filter(code=code)

            if len(rooms) > 0:
                room = rooms[0]
                self.request.session["room_code"] = code
                res = Response(
                    data={"message": "Room Joined"},
                    status=status.HTTP_200_OK,
                )
            else:
                res = Response(
                    data={"message": "Room Not Found: Invalid Room Code"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        else:
            res = Response(
                data={"message": "Bad Request: Code parameter not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        res.set_cookie(key="sessionid", value=self.request.session.session_key)
        return res


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        print(f"User: {self.request.session.session_key} created the room")

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                self.request.session["room_code"] = room.code
                res = Response(
                    data=RoomSerializer(room).data,
                    status=status.HTTP_200_OK,
                )
            else:
                room = Room(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip,
                )
                room.save()
                self.request.session["room_code"] = room.code
                res = Response(
                    data=RoomSerializer(room).data,
                    status=status.HTTP_201_CREATED,
                )
        else:
            res = Response(
                data={"message": "Bad Request: Invalid data"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        res.set_cookie(key="sessionid", value=self.request.session.session_key)
        return res


class UserInRoomView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        print(f"User: {self.request.session.session_key} checked is in room")

        data = {
            "code": self.request.session.get("room_code"),
        }

        res = Response(
            data=data,
            status=status.HTTP_200_OK,
        )

        res.set_cookie(key="sessionid", value=self.request.session.session_key)
        return res


class LeaveRoomView(APIView):
    def post(self, request, format=None):
        if "room_code" in self.request.session:
            print(
                f"User {self.request.session.session_key} left the room {self.request.session['room_code']}"
            )
            code = self.request.session.pop("room_code")
            host_id = self.request.session.session_key
            rooms = Room.objects.filter(host=host_id)

            if len(rooms) > 0:
                print(f"Room {code} is deleted")
                room = rooms[0]
                room.delete()
        return Response(data={"message": "Success"}, status=status.HTTP_200_OK)


class UpdateRoomView(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        print(f"User: {self.request.session.session_key} updates a room")

        res = Response(data={})
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            code = serializer.data.get("code")

            rooms = Room.objects.filter(code=code)

            if len(rooms) > 0:
                room = rooms[0]
                user_id = self.request.session.session_key

                if room.host != user_id:
                    res = Response(
                        data={"message": "Not a Host"},
                        status=status.HTTP_403_FORBIDDEN,
                    )
                else:
                    room.guest_can_pause = guest_can_pause
                    room.votes_to_skip = votes_to_skip
                    room.save(update_fields=["guest_can_pause", "votes_to_skip"])

                    res = Response(
                        data={"message": "Updated Successfully"},
                        status=status.HTTP_200_OK,
                    )
            else:
                res = Response(
                    data={"message": "Room Not Found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            res = Response(
                data={"message": "Bad Request: Invalid Data"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        res.set_cookie(key="sessionid", value=self.request.session.session_key)
        return res
