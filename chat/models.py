from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Dialog(models.Model):
    owner = models.ForeignKey(User, verbose_name="Dialog owner", related_name="selfDialogs",
                              on_delete=models.CASCADE)
    opponent = models.ForeignKey(User, verbose_name="Dialog opponent", on_delete=models.CASCADE)

    def __str__(self):
        return "Chat with " + self.opponent.username


class Message(models.Model):
    dialog = models.ForeignKey(Dialog, verbose_name="Dialog", related_name="messages", on_delete=models.CASCADE)
    sender = models.ForeignKey(User, verbose_name="Author", related_name="messages",
                               on_delete=models.CASCADE)
    text = models.TextField(verbose_name="Message text")
    read = models.BooleanField(verbose_name="Read", default=False)
    created_at = models.DateTimeField(auto_now_add=True,blank=True)
 

    def __str__(self):
        return self.sender.username + "(" + ") - '" + self.text + "'"

