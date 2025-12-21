from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from Registration.models import User
from Registration.serializers import UserSerializer
from rest_framework import generics

class SkillMatchView(APIView):
    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email query param is required'}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        user_skills = user.skills.all()
        desired_skills = user.desired_skills.all()

        # Find users who have skills matching current user's desired skills
        matching_users = User.objects.filter(
            skills__in=desired_skills
        ).exclude(email=email).distinct()

        serializer = UserSerializer(matching_users, many=True)
        return Response(serializer.data, status=200)
    
class UserSignupView(APIView):
    def post(self, request):
        # Use request.data for text fields and request.FILES for file uploads
        data = request.data.copy()
        files = request.FILES

        # Add files to data if they exist
        if 'certification1' in files:
            data['certification1'] = files['certification1']
        if 'certification2' in files:
            data['certification2'] = files['certification2']
        if 'profile_picture' in files:
            data['profile_picture'] = files['profile_picture']

        serializer = UserSerializer(data=data)
        
        if serializer.is_valid():
            user = serializer.save()  # triggers post_save signal automatically
            print("User saved:", user)  # debug print
            return Response(
                {"message": "Registration successful! Waiting for admin approval."},
                status=status.HTTP_201_CREATED
            )
        
        # If validation fails, return detailed errors
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['put', 'patch'])
    def update_user(self, request, pk=None):
        try:
            user = self.get_object()
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
