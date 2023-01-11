from django.urls import path
from .views import index

urlpatterns = [
    path("", index),
    path("join", index),
    path("create", index),
    path("room/<str:roomCode>", index),
    path('<path:path>', index) # redirect any other paths to index
]