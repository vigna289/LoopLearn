from django.shortcuts import render
from django.contrib.auth import get_user_model
# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatMessage

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_message_count(request):
    user = request.user
    count = ChatMessage.objects.filter(receiver=user, is_read=False).count()
    return Response({'unread_count': count})


# views.py
from django.db.models import Q,Count

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all().order_by('-timestamp')
    serializer_class = ChatMessageSerializer

    @action(detail=False, methods=['get'])
    def user_chats(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required'}, status=400)

        messages = ChatMessage.objects.filter(Q(sender_id=user_id) | Q(receiver_id=user_id))
        
        partner_ids = set()
        for msg in messages:
            if msg.sender_id != int(user_id):
                partner_ids.add(msg.sender_id)
            if msg.receiver_id != int(user_id):
                partner_ids.add(msg.receiver_id)

        User = get_user_model()
        partners = User.objects.filter(id__in=partner_ids)
    
        data = [{'id': u.id, 'full_name': u.full_name, 'email': u.email} for u in partners]

        return Response(data)

    # New action: fetch messages between two users
    @action(detail=False, methods=['get'])
    def user_chat(self, request):
        user1 = request.query_params.get('user1')
        user2 = request.query_params.get('user2')

        if not user1 or not user2:
            return Response({'error': 'user1 and user2 are required'}, status=400)

        messages = ChatMessage.objects.filter(
            (Q(sender_id=user1) & Q(receiver_id=user2)) |
            (Q(sender_id=user2) & Q(receiver_id=user1))
        ).order_by('timestamp')

        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)
    @action(detail=False, methods=['post'])
    def mark_as_read(self, request):
        user1 = request.data.get('user1')
        user2 = request.data.get('user2')
        if not user1 or not user2:
            return Response({'error': 'user1 and user2 are required'}, status=400)

        ChatMessage.objects.filter(
            Q(sender_id=user2, receiver_id=user1), is_read=False
        ).update(is_read=True)
        return Response({'status': 'messages marked as read'})

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required'}, status=400)

        messages = (
            ChatMessage.objects.filter(receiver_id=user_id, is_read=False)
            .values('sender_id')
            .annotate(count=Count('id'))
        )
        data = {m['sender_id']: m['count'] for m in messages}
        return Response(data)

    @action(detail=False, methods=['delete'])
    def delete_chat(self, request):
        user1 = request.data.get('user1')
        user2 = request.data.get('user2')
        if not user1 or not user2:
            return Response({'error': 'user1 and user2 are required'}, status=400)

        ChatMessage.objects.filter(
            (Q(sender_id=user1, receiver_id=user2)) | (Q(sender_id=user2, receiver_id=user1))
        ).delete()
        return Response({'status': 'chat deleted successfully'})

