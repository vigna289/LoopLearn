import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from huggingface_hub import InferenceClient
from .utils import get_embedding, cosine_similarity
from Registration.models import User
import numpy as np

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise Exception("HF_TOKEN not found in environment variables")

hf_client = InferenceClient(api_key=HF_TOKEN)

@api_view(["POST"])
def ai_help(request):
    question = request.data.get("question")

    if not question:
        return Response({"error": "Question is required"}, status=400)

    try:
        result = hf_client.chat.completions.create(
            model="meta-llama/Llama-3.1-8B-Instruct",
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI assistant for SkillBarter. Answer questions about skills, learning, careers, and platform usage. Keep answers short."
                },
                {"role": "user", "content": question}
            ],
        )

        answer = result.choices[0].message["content"]
        return Response({"answer": answer})

    except Exception as e:
        print("AI ERROR:", e)   # 👈 VERY IMPORTANT
        return Response({"error": "AI failed"}, status=500)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import get_embedding, cosine_similarity
from Registration.models import User
import numpy as np

# -------------------- AI Matching --------------------
@api_view(["POST"])
def recommend_users(request):
    user_id = request.data.get("user_id")
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # Combine skills + desired skills + experience into text
    user_text = f"{user.skills}. Desired: {user.desired_skills}. Experience: {user.year_of_experience}"
    user_vec = np.array(get_embedding(user_text))

    recommendations = []
    for other in User.objects.exclude(id=user.id):
        other_text = f"{other.skills}. Desired: {other.desired_skills}. Experience: {other.year_of_experience}"
        other_vec = np.array(get_embedding(other_text))
        similarity = cosine_similarity(user_vec, other_vec)
        recommendations.append((similarity, other))

    # Sort by similarity (highest first)
    recommendations.sort(reverse=True, key=lambda x: x[0])

    # Return top 5 recommendations
    top_users = [{
        "full_name": u.full_name,
        "email": u.email,
        "skills": u.skills,
        "desired_skills": u.desired_skills,
        "similarity": round(sim, 2)
    } for sim, u in recommendations[:5]]

    return Response({"recommendations": top_users})
