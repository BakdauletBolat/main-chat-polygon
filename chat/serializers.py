from urllib import request
from rest_framework.serializers import ModelSerializer,SerializerMethodField
from .models import Dialog, Message
from django.contrib.auth.models import User
from django.db.models import Q


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ('id','username')



class MessageSerializer(ModelSerializer):

    class Meta:
        model = Message
        fields = ('__all__')

class DialogSerializer(ModelSerializer):

    owner = UserSerializer()
    opponent = UserSerializer()
    messages = MessageSerializer(many=True,read_only=True)

    class Meta:
        model = Dialog
        fields = ('__all__')


class MessageCreateSerializer(ModelSerializer):

    class Meta:
        model = Message
        read_only_fields = ('sender',)
        fields = ('id','text','dialog','sender','created_at','read')




