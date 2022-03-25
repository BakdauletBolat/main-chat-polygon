from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView,ListAPIView
from .models import Dialog
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.views import APIView
from django.db.models import Q
from django.contrib.auth.models import User
from .models import Message
from rest_framework.permissions import IsAuthenticated
from .serializers import DialogSerializer, MessageCreateSerializer, UserSerializer

class DialogRetriveView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,pk):
        dialog = get_object_or_404(Dialog,id=pk)
        for message in dialog.messages.filter(read=False):
        
            if message.sender != request.user:
                message.read = True
                message.save()

        return JsonResponse(DialogSerializer(dialog).data,safe=False) 

class DialogListView(APIView):
    permission_classes = [IsAuthenticated]

    def get_dialogs_with_user(self,user_1, user_2):
        return Dialog.objects.filter(
        Q(owner=user_1, opponent=user_2) | Q(opponent=user_1, owner=user_2))

    def get(self,request,username):
        user2 = get_object_or_404(User, username=username)
        user1 = request.user
        dialogs = self.get_dialogs_with_user(user1,user2)
        if len(dialogs) == 0:
            dialog = Dialog.objects.create(owner=request.user, opponent=user2)
            return JsonResponse(DialogSerializer(dialog).data)
        else:
            dialog = dialogs[0]
            return JsonResponse(DialogSerializer(dialog).data)




class MessageCreateView(CreateAPIView):

    serializer_class = MessageCreateSerializer
    queryset = Message.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save(sender=self.request.user)


class UserListApiView(APIView):

    def get(self,request):
        queryset = User.objects.all()
        return JsonResponse(UserSerializer(queryset,context={
            'request':request,       
        },many=True).data,safe=False)

    
    permission_classes = [IsAuthenticated]


class ListUserDialogs(APIView):

    def get(self,request):

        user = request.user

        usertDialogs = Dialog.objects.filter(Q(owner=user) | Q(opponent=user))

        return JsonResponse(DialogSerializer(usertDialogs,many=True,context={
            'request':request,       
        }).data,safe=False)



class UserMe(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):

        return JsonResponse(UserSerializer(request.user,context={
            'request':request,       
        }).data)
