from email import message

from django.dispatch import receiver
from .models import Message
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .serializers import MessageSerializer
from asgiref.sync import async_to_sync


from channels.layers import get_channel_layer




class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
    
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        username = self.scope['user'].username

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'connected',
                'message': f'connected {username}'
            }
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

 
    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )
    

    async def connected(self,event):
        message = event['message']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'connected'
        }))

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'message'
        }))


class GetNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # print(self.scope)
        self.user_id = self.scope['user'].id
        self.room_group_name = 'notifications_%s' % self.user_id

        print('connected ',self.room_group_name)
        print(self.channel_layer_alias)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        receiver_id = text_data_json['receiver_id']
        self.notifcation_receiver_name = 'notifications_%s' % receiver_id

        print('send_to',self.notifcation_receiver_name)

        await self.channel_layer.group_send(
            self.notifcation_receiver_name,
            {
                'type': 'new_message',
                'message': message
            }
        )

    async def new_message(self, event):
        message = event['message']
        print('new_message')
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'new_message'
        }))