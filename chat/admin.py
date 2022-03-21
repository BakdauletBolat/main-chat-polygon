from django.contrib import admin
from .models import Message, Dialog
# Register your models here.

admin.site.register(Dialog)
admin.site.register(Message)