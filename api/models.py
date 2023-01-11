# Django allows us to write Python code and translate it into database code
from django.db import models
import string
import random
def generate_unique_code():
    length = 6

    while True:
        code = "".join(random.choices(string.ascii_uppercase + string.digits, k=length))
        # ensure the code is unique
        if Room.objects.filter(code=code).count() == 0:
            break
    return code

# Create your models here.
# Put most of the logic in the models
class Room(models.Model):
    # things that should be in the room
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    create_at = models.DateTimeField(auto_now_add=True)

    # can create functions here