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

        # ✅ Normalize + split properly
        def clean_skills(skill_string):
            if not skill_string:
                return []
            return [s.strip().lower() for s in skill_string.split(',') if s.strip()]

        user_skills = clean_skills(user.skills)
        desired_skills = clean_skills(user.desired_skills)

        all_users = User.objects.exclude(email=email)

        result = []

        for u in all_users:
            other_skills = clean_skills(u.skills)

            # ✅ Find matches
            matched = set(desired_skills).intersection(set(other_skills))

            # ✅ Similarity score
            similarity = 0
            if desired_skills:
                similarity = round((len(matched) / len(desired_skills)) * 100, 2)

            # ❗ Only include if at least 1 match
            if matched:
                result.append({
                    "id": u.id,
                    "full_name": u.full_name,
                    "email": u.email,
                    "skills": u.skills,
                    "desired_skills": u.desired_skills,
                    "similarity": similarity,
                    "matched_skills": list(matched),
                    "profile_picture": u.profile_picture.url if u.profile_picture else None
                })

        # ✅ Sort by similarity (best first)
        result = sorted(result, key=lambda x: x["similarity"], reverse=True)

        return Response(result, status=200)

    
class UserSignupView(APIView):
    def post(self, request):
        # Use request.data for text fields and request.FILES for file uploads
        data = request.data
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
